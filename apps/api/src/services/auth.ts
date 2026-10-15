import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { query } from '../db/pool.js';

const scryptAsync = promisify(scrypt) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;

export const SESSION_COOKIE = 'se_admin';
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type Admin = { id: number; email: string; name: string };

/** Format stocké : `scrypt$<sel base64>$<empreinte base64>`. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, 64);
  return `scrypt$${salt.toString('base64')}$${hash.toString('base64')}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, salt, hash] = stored.split('$');
  if (scheme !== 'scrypt' || !salt || !hash) return false;
  const expected = Buffer.from(hash, 'base64');
  const actual = await scryptAsync(password, Buffer.from(salt, 'base64'), expected.length);
  return timingSafeEqual(actual, expected);
}

// Seule l'empreinte du jeton est stockée : une fuite de la base ne donne pas de session valide
function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function createSession(adminId: number): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await query('INSERT INTO site.sessions (token_hash, admin_id, expires_at) VALUES ($1, $2, $3)', [
    hashToken(token),
    adminId,
    expiresAt,
  ]);
  // Ménage des sessions expirées au passage
  await query('DELETE FROM site.sessions WHERE expires_at < now()');
  return { token, expiresAt };
}

export async function findSessionAdmin(token: string): Promise<Admin | null> {
  const [admin] = await query<Admin>(
    `SELECT a.id, a.email, a.name FROM site.sessions s
     JOIN site.admins a ON a.id = s.admin_id
     WHERE s.token_hash = $1 AND s.expires_at > now()`,
    [hashToken(token)],
  );
  return admin ?? null;
}

export async function deleteSession(token: string): Promise<void> {
  await query('DELETE FROM site.sessions WHERE token_hash = $1', [hashToken(token)]);
}
