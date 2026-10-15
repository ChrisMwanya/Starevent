import { query } from '../db/pool.js';
import { settingsSchema, type Settings } from '../resources.js';

export async function getSettings(): Promise<Settings> {
  const [row] = await query<{ data: unknown }>('SELECT data FROM site.settings WHERE id = 1');
  // Valeurs relues à travers le schéma : les champs absents valent `null`
  const parsed = settingsSchema.safeParse(row?.data ?? {});
  return parsed.success ? parsed.data : settingsSchema.parse({});
}

export async function saveSettings(settings: Settings): Promise<void> {
  await query('UPDATE site.settings SET data = $1, updated_at = now() WHERE id = 1', [settings]);
}
