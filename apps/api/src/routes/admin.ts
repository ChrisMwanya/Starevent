import { randomBytes } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { Router, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import { z } from 'zod';
import { env } from '../config/env.js';
import { query } from '../db/pool.js';
import { requireAdmin, requireTrustedOrigin } from '../middleware/auth.js';
import {
  isResourceName,
  QUOTE_STATUSES,
  resources,
  selectList,
  settingsSchema,
  slugify,
  type Resource,
} from '../resources.js';
import { createSession, deleteSession, SESSION_COOKIE, SESSION_TTL_MS, verifyPassword } from '../services/auth.js';
import { revalidateSite } from '../services/revalidate.js';
import { getSettings, saveSettings } from '../services/settings.js';

export const adminRouter = Router();

adminRouter.use(requireTrustedOrigin);

function sendInvalid(res: Response, error: z.ZodError) {
  res.status(400).json({ error: 'Certains champs sont invalides.', fields: z.flattenError(error).fieldErrors });
}

/* ---------- Connexion ---------- */

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Trop de tentatives, merci de réessayer dans quelques minutes.' },
});

const loginSchema = z.object({ email: z.email().max(160), password: z.string().min(1).max(200) });

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: env.isProduction,
  path: '/',
};

adminRouter.post('/auth/login', loginLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Email ou mot de passe manquant.' });
    return;
  }
  const [admin] = await query<{ id: number; email: string; name: string; password_hash: string }>(
    'SELECT id, email, name, password_hash FROM site.admins WHERE lower(email) = lower($1)',
    [parsed.data.email],
  );
  if (!admin || !(await verifyPassword(parsed.data.password, admin.password_hash))) {
    res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    return;
  }
  const { token } = await createSession(admin.id);
  res.cookie(SESSION_COOKIE, token, { ...cookieOptions, maxAge: SESSION_TTL_MS });
  res.json({ data: { id: admin.id, email: admin.email, name: admin.name } });
});

adminRouter.post('/auth/logout', async (req, res) => {
  const token = req.cookies?.[SESSION_COOKIE] as string | undefined;
  if (token) await deleteSession(token);
  res.clearCookie(SESSION_COOKIE, cookieOptions);
  res.status(204).end();
});

// Tout ce qui suit exige une session
adminRouter.use(requireAdmin);

adminRouter.get('/auth/me', (req, res) => {
  res.json({ data: req.admin });
});

/* ---------- Tableau de bord ---------- */

adminRouter.get('/stats', async (_req, res) => {
  const counts = await query<{ name: string; count: number }>(
    `SELECT 'services' AS name, count(*)::int AS count FROM site.services
     UNION ALL SELECT 'projects', count(*)::int FROM site.projects
     UNION ALL SELECT 'testimonials', count(*)::int FROM site.testimonials
     UNION ALL SELECT 'team', count(*)::int FROM site.team_members
     UNION ALL SELECT 'clients', count(*)::int FROM site.clients
     UNION ALL SELECT 'newQuotes', count(*)::int FROM site.quote_requests WHERE status = 'nouveau'`,
  );
  res.json({ data: Object.fromEntries(counts.map((row) => [row.name, row.count])) });
});

/* ---------- Images ---------- */

const uploadsDir = path.resolve(env.UPLOADS_DIR);
mkdirSync(uploadsDir, { recursive: true });

// Pas de SVG : un SVG peut embarquer du script
const imageTypes: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/avif': '.avif',
};

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (_req, file, callback) =>
      callback(null, `${randomBytes(12).toString('hex')}${imageTypes[file.mimetype]}`),
  }),
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => callback(null, Object.hasOwn(imageTypes, file.mimetype)),
});

adminRouter.post('/uploads', (req, res) => {
  upload.single('file')(req, res, (error) => {
    if (error) {
      const tooLarge = error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE';
      res.status(400).json({ error: tooLarge ? 'Image trop lourde (8 Mo maximum).' : 'Envoi impossible.' });
      return;
    }
    if (!req.file) {
      res.status(400).json({ error: 'Formats acceptés : JPEG, PNG, WebP ou AVIF.' });
      return;
    }
    res.status(201).json({ data: { url: `/uploads/${req.file.filename}` } });
  });
});

/* ---------- Coordonnées ---------- */

adminRouter.get('/settings', async (_req, res) => {
  res.json({ data: await getSettings() });
});

adminRouter.put('/settings', async (req, res) => {
  const parsed = settingsSchema.safeParse(req.body);
  if (!parsed.success) return sendInvalid(res, parsed.error);
  await saveSettings(parsed.data);
  revalidateSite(['settings']);
  res.json({ data: parsed.data });
});

/* ---------- Demandes de devis ---------- */

const quoteColumns = `id, full_name AS "fullName", email, phone, event_type AS "eventType", event_date AS "eventDate",
  guest_count AS "guestCount", budget_range AS "budgetRange", message, status, notes, created_at AS "createdAt"`;

adminRouter.get('/quotes', async (req, res) => {
  const status = z.enum(QUOTE_STATUSES).safeParse(req.query.status);
  const rows = status.success
    ? await query(`SELECT ${quoteColumns} FROM site.quote_requests WHERE status = $1 ORDER BY created_at DESC`, [
        status.data,
      ])
    : await query(`SELECT ${quoteColumns} FROM site.quote_requests ORDER BY created_at DESC`);
  res.json({ data: rows });
});

const quoteUpdateSchema = z.object({
  status: z.enum(QUOTE_STATUSES),
  notes: z
    .string()
    .trim()
    .max(4000)
    .nullish()
    .transform((value) => value || null),
});

adminRouter.patch('/quotes/:id', async (req, res) => {
  const id = z.coerce.number().int().positive().safeParse(req.params.id);
  const parsed = quoteUpdateSchema.safeParse(req.body);
  if (!id.success) return void res.status(404).json({ error: 'Demande introuvable' });
  if (!parsed.success) return sendInvalid(res, parsed.error);
  const [row] = await query(
    `UPDATE site.quote_requests SET status = $1, notes = $2, updated_at = now() WHERE id = $3 RETURNING ${quoteColumns}`,
    [parsed.data.status, parsed.data.notes, id.data],
  );
  if (!row) return void res.status(404).json({ error: 'Demande introuvable' });
  res.json({ data: row });
});

adminRouter.delete('/quotes/:id', async (req, res) => {
  const id = z.coerce.number().int().positive().safeParse(req.params.id);
  if (!id.success) return void res.status(404).json({ error: 'Demande introuvable' });
  await query('DELETE FROM site.quote_requests WHERE id = $1', [id.data]);
  res.status(204).end();
});

/* ---------- Contenus (prestations, réalisations, témoignages, équipe, clients) ---------- */

async function uniqueSlug(resource: Resource, base: string, excludeId?: number): Promise<string> {
  const root = base || 'element';
  for (let attempt = 1; ; attempt++) {
    const candidate = attempt === 1 ? root : `${root}-${attempt}`;
    const [taken] = await query(`SELECT 1 FROM ${resource.table} WHERE slug = $1 AND id <> $2`, [
      candidate,
      excludeId ?? 0,
    ]);
    if (!taken) return candidate;
  }
}

async function prepareValues(resource: Resource, data: Record<string, unknown>, excludeId?: number) {
  if (resource.slugFrom) {
    const source = (data.slug as string | null | undefined) || slugify(String(data[resource.slugFrom] ?? ''));
    data.slug = await uniqueSlug(resource, source, excludeId);
  }
  return resource.fields.map((field) => data[field.key] ?? null);
}

adminRouter.param('resource', (req, res, next, name: string) => {
  if (!isResourceName(name)) return void res.status(404).json({ error: 'Ressource introuvable' });
  next();
});

function getResource(name: string): Resource {
  return resources[name as keyof typeof resources];
}

adminRouter.get('/content/:resource', async (req, res) => {
  const resource = getResource(req.params.resource as string);
  res.json({ data: await query(`SELECT ${selectList(resource)} FROM ${resource.table} ORDER BY ${resource.orderBy}`) });
});

adminRouter.post('/content/:resource', async (req, res) => {
  const name = req.params.resource as string;
  const resource = getResource(name);
  const parsed = resource.schema.safeParse(req.body);
  if (!parsed.success) return sendInvalid(res, parsed.error);
  const values = await prepareValues(resource, parsed.data as Record<string, unknown>);
  const columns = resource.fields.map((field) => field.column);
  const [row] = await query(
    `INSERT INTO ${resource.table} (${columns.join(', ')})
     VALUES (${columns.map((_, index) => `$${index + 1}`).join(', ')})
     RETURNING ${selectList(resource)}`,
    values,
  );
  revalidateSite([name]);
  res.status(201).json({ data: row });
});

adminRouter.put('/content/:resource/:id', async (req, res) => {
  const name = req.params.resource as string;
  const resource = getResource(name);
  const id = z.coerce.number().int().positive().safeParse(req.params.id);
  if (!id.success) return void res.status(404).json({ error: 'Élément introuvable' });
  const parsed = resource.schema.safeParse(req.body);
  if (!parsed.success) return sendInvalid(res, parsed.error);
  const values = await prepareValues(resource, parsed.data as Record<string, unknown>, id.data);
  const assignments = resource.fields.map((field, index) => `${field.column} = $${index + 1}`);
  const [row] = await query(
    `UPDATE ${resource.table} SET ${assignments.join(', ')}, updated_at = now()
     WHERE id = $${values.length + 1} RETURNING ${selectList(resource)}`,
    [...values, id.data],
  );
  if (!row) return void res.status(404).json({ error: 'Élément introuvable' });
  revalidateSite([name]);
  res.json({ data: row });
});

adminRouter.delete('/content/:resource/:id', async (req, res) => {
  const name = req.params.resource as string;
  const resource = getResource(name);
  const id = z.coerce.number().int().positive().safeParse(req.params.id);
  if (!id.success) return void res.status(404).json({ error: 'Élément introuvable' });
  await query(`DELETE FROM ${resource.table} WHERE id = $1`, [id.data]);
  revalidateSite([name]);
  res.status(204).end();
});
