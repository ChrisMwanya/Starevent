import 'dotenv/config';
import { z } from 'zod';

// Messages de validation en français, renvoyés tels quels au back-office
z.config(z.locales.fr());

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGINS: z.string().default('http://localhost:3000'),
  DATABASE_URL: z.string().default('postgres://starevent:starevent@127.0.0.1:5434/starevent'),
  // Dossier des images envoyées depuis le back-office, servi sur /uploads
  UPLOADS_DIR: z.string().default('uploads'),
  // Site Next.js à prévenir après une modification de contenu (revalidation du cache)
  WEB_URL: z.string().url().default('http://localhost:3000'),
  REVALIDATE_SECRET: z.string().default(''),
  SMTP_HOST: z.string().default(''),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().default(''),
  SMTP_PASSWORD: z.string().default(''),
  MAIL_FROM: z.string().default('Star Event <no-reply@starevent.cd>'),
  MAIL_TO: z.string().default(''),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Configuration invalide :', z.flattenError(parsed.error).fieldErrors);
  process.exit(1);
}

export const env = {
  ...parsed.data,
  corsOrigins: parsed.data.CORS_ORIGINS.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  isProduction: parsed.data.NODE_ENV === 'production',
};
