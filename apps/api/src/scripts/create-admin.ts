/**
 * Crée un compte du back-office, ou change son mot de passe s'il existe.
 * Usage : npm run admin:create -- <email> "<nom>"   (le mot de passe est demandé)
 */
import { createInterface } from 'node:readline/promises';
import { Writable } from 'node:stream';
import { z } from 'zod';
import { migrate } from '../db/migrate.js';
import { pool, query } from '../db/pool.js';
import { hashPassword } from '../services/auth.js';

const [email, name] = process.argv.slice(2);
if (!z.email().safeParse(email).success || !name) {
  console.error('Usage : npm run admin:create -- <email> "<nom>"');
  process.exit(1);
}

/** Saisie masquée : seule la question s'affiche, pas les caractères tapés. */
async function askPassword(question: string): Promise<string> {
  let muted = false;
  const output = new Writable({
    write(chunk, encoding, callback) {
      if (!muted) process.stdout.write(chunk, encoding);
      callback();
    },
  });
  const readline = createInterface({ input: process.stdin, output, terminal: true });
  const pending = readline.question(question);
  muted = true;
  const answer = await pending;
  readline.close();
  process.stdout.write('\n');
  return answer;
}

const password = process.env.ADMIN_PASSWORD ?? (await askPassword('Mot de passe (12 caractères minimum) : '));

if (password.length < 12) {
  console.error('Mot de passe trop court : 12 caractères minimum.');
  process.exit(1);
}

await migrate();
await query(
  `INSERT INTO site.admins (email, name, password_hash) VALUES (lower($1), $2, $3)
   ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash`,
  [email, name, await hashPassword(password)],
);
await pool.end();
console.info(`Compte prêt : ${email.toLowerCase()}`);
