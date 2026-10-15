import pg from 'pg';
import { env } from '../config/env.js';

// Les dates `date` restent des chaînes AAAA-MM-JJ, sans conversion de fuseau
pg.types.setTypeParser(pg.types.builtins.DATE, (value) => value);

export const pool = new pg.Pool({ connectionString: env.DATABASE_URL });

export async function query<T extends pg.QueryResultRow>(text: string, values?: unknown[]): Promise<T[]> {
  const { rows } = await pool.query<T>(text, values);
  return rows;
}
