import { z } from 'zod';
import { EVENT_TYPES } from './schemas/quote.js';

const text = (max: number) => z.string().trim().min(1, 'Champ obligatoire').max(max);
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform((value) => value || null);
// Image envoyée par le back-office (/uploads/…), image du site (/…) ou adresse complète
const mediaUrl = z
  .string()
  .trim()
  .max(500)
  .regex(/^(\/|https?:\/\/)/, 'Adresse d’image invalide')
  .nullish()
  .transform((value) => value || null);
const optionalUrl = z
  .union([z.url({ protocol: /^https?$/ }).max(500), z.literal('')])
  .nullish()
  .transform((value) => value || null);
const position = z.coerce.number().int().min(0).max(10000).default(0);
const published = z.boolean().default(true);
const slug = z
  .string()
  .trim()
  .max(120)
  .regex(/^[a-z0-9-]*$/, 'Uniquement des minuscules, chiffres et tirets')
  .nullish();

type Field = { key: string; column: string };

export type Resource = {
  table: string;
  fields: Field[];
  schema: z.ZodObject;
  orderBy: string;
  /** Champ dont dérive le slug quand il est laissé vide. */
  slugFrom?: string;
};

function fields(map: Record<string, string>): Field[] {
  return Object.entries(map).map(([key, column]) => ({ key, column }));
}

/** Contenus gérés par le back-office ; la clé est aussi l'étiquette de cache côté site. */
export const resources = {
  services: {
    table: 'site.services',
    fields: fields({
      title: 'title',
      slug: 'slug',
      category: 'category',
      excerpt: 'excerpt',
      priceRange: 'price_range',
      coverUrl: 'cover_url',
      position: 'position',
      published: 'published',
    }),
    schema: z.object({
      title: text(160),
      slug,
      category: z.enum(EVENT_TYPES),
      excerpt: optionalText(600),
      priceRange: optionalText(120),
      coverUrl: mediaUrl,
      position,
      published,
    }),
    orderBy: 'position, id',
    slugFrom: 'title',
  },
  projects: {
    table: 'site.projects',
    fields: fields({
      title: 'title',
      slug: 'slug',
      eventType: 'event_type',
      eventDate: 'event_date',
      location: 'location',
      featured: 'featured',
      coverUrl: 'cover_url',
      position: 'position',
      published: 'published',
    }),
    schema: z.object({
      title: text(160),
      slug,
      eventType: z.enum(EVENT_TYPES),
      eventDate: z.iso
        .date()
        .nullish()
        .or(z.literal(''))
        .transform((value) => value || null),
      location: optionalText(120),
      featured: z.boolean().default(false),
      coverUrl: mediaUrl,
      position,
      published,
    }),
    orderBy: 'position, event_date DESC NULLS LAST, id DESC',
    slugFrom: 'title',
  },
  testimonials: {
    table: 'site.testimonials',
    fields: fields({
      authorName: 'author_name',
      authorRole: 'author_role',
      quote: 'quote',
      photoUrl: 'photo_url',
      position: 'position',
      published: 'published',
    }),
    schema: z.object({
      authorName: text(120),
      authorRole: optionalText(120),
      quote: text(1000),
      photoUrl: mediaUrl,
      position,
      published,
    }),
    orderBy: 'position, id',
  },
  team: {
    table: 'site.team_members',
    fields: fields({
      name: 'name',
      role: 'role',
      bio: 'bio',
      photoUrl: 'photo_url',
      position: 'position',
      published: 'published',
    }),
    schema: z.object({
      name: text(120),
      role: text(120),
      bio: optionalText(400),
      photoUrl: mediaUrl,
      position,
      published,
    }),
    orderBy: 'position, id',
  },
  clients: {
    table: 'site.clients',
    fields: fields({
      name: 'name',
      logoUrl: 'logo_url',
      websiteUrl: 'website_url',
      position: 'position',
      published: 'published',
    }),
    schema: z.object({
      name: text(120),
      logoUrl: mediaUrl,
      websiteUrl: optionalUrl,
      position,
      published,
    }),
    orderBy: 'position, id',
  },
} satisfies Record<string, Resource>;

export type ResourceName = keyof typeof resources;

export function isResourceName(value: string): value is ResourceName {
  return Object.hasOwn(resources, value);
}

/** Colonnes SQL renommées en camelCase pour le JSON. */
export function selectList(resource: Resource): string {
  return ['id', ...resource.fields.map((field) => `${field.column} AS "${field.key}"`)].join(', ');
}

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}

export const settingsSchema = z.object({
  phone: optionalText(40),
  whatsappNumber: z
    .string()
    .trim()
    .regex(/^\d{8,15}$/, 'Format international sans « + » ni espaces, ex. 243810000000')
    .nullish()
    .or(z.literal(''))
    .transform((value) => value || null),
  email: z
    .email()
    .max(160)
    .nullish()
    .or(z.literal(''))
    .transform((value) => value || null),
  address: optionalText(400),
  instagramUrl: optionalUrl,
  facebookUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  tiktokUrl: optionalUrl,
});

export type Settings = z.infer<typeof settingsSchema>;

export const QUOTE_STATUSES = ['nouveau', 'contacte', 'converti', 'archive'] as const;
