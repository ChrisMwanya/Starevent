/**
 * Charge des contenus FICTIFS de démonstration dans les tables vides.
 * Usage : npm run db:seed. Ne pas lancer en production : tout est modifiable ou supprimable
 * depuis le back-office, mais ces contenus ne décrivent pas de vrais clients ni de vrais événements.
 */
import { migrate } from '../db/migrate.js';
import { pool, query } from '../db/pool.js';
import { saveSettings, getSettings } from '../services/settings.js';

async function isEmpty(table: string): Promise<boolean> {
  const [row] = await query<{ count: number }>(`SELECT count(*)::int AS count FROM ${table}`);
  return row!.count === 0;
}

async function insertAll(table: string, rows: Record<string, unknown>[]) {
  if (!(await isEmpty(table))) {
    console.info(`[seed] ${table} contient déjà des données : ignoré`);
    return;
  }
  for (const [index, row] of rows.entries()) {
    const entries = Object.entries({ ...row, position: index });
    await query(
      `INSERT INTO ${table} (${entries.map(([column]) => column).join(', ')})
       VALUES (${entries.map((_, i) => `$${i + 1}`).join(', ')})`,
      entries.map(([, value]) => value),
    );
  }
  console.info(`[seed] ${table} : ${rows.length} éléments`);
}

await migrate();

await insertAll('site.services', [
  {
    title: 'Mariages',
    slug: 'mariages',
    category: 'mariage',
    excerpt:
      'Cérémonie, réception, décoration et coordination : un mariage à votre image, orchestré dans les moindres détails.',
    cover_url: '/illustrations/mariage-couple.jpg',
  },
  {
    title: 'Événements corporate',
    slug: 'evenements-corporate',
    category: 'corporate',
    excerpt: "Séminaires, lancements, conférences et soirées d'entreprise, pensés pour vos équipes et vos clients.",
    cover_url: '/illustrations/corporate-intervention.jpg',
  },
  {
    title: 'Anniversaires',
    slug: 'anniversaires',
    category: 'anniversaire',
    excerpt: 'Fêtes privées et célébrations sur mesure, de la réunion intime au grand format.',
    cover_url: '/illustrations/anniversaire-bougies.jpg',
  },
  {
    title: 'Événements institutionnels',
    slug: 'evenements-institutionnels',
    category: 'institutionnel',
    excerpt: "Cérémonies officielles, galas et événements publics, avec la rigueur protocolaire qu'ils exigent.",
    cover_url: '/illustrations/institutionnel-assemblee.jpg',
  },
]);

await insertAll(
  'site.projects',
  [
    ['Mariage en plein air', 'mariage', '2026-07-18', 'Ngaliema', true, '/realisations/allee-fleurie.jpg'],
    ['Réception de mariage', 'mariage', '2026-04-25', 'Gombe', false, '/realisations/decor-floral.jpg'],
    ['Séminaire de direction', 'corporate', '2026-06-12', 'Gombe', true, '/realisations/salle-seminaire.jpg'],
    ['Conférence annuelle', 'corporate', '2026-02-20', 'Limete', false, '/illustrations/scene-conference.jpg'],
    ["Anniversaire d'enfant", 'anniversaire', '2026-05-09', 'Kintambo', true, '/realisations/colonnes-ballons.jpg'],
    ['Fête surprise des 40 ans', 'anniversaire', '2026-03-14', 'Ma Campagne', false, '/illustrations/cadeaux.jpg'],
    ['Assemblée générale', 'institutionnel', '2026-08-28', 'Gombe', false, '/realisations/auditorium.jpg'],
    ['Réunion protocolaire', 'institutionnel', '2026-01-30', 'Gombe', false, '/realisations/salle-du-conseil.jpg'],
  ].map(([title, eventType, eventDate, location, featured, cover], index) => ({
    title,
    slug: `exemple-${index + 1}`,
    event_type: eventType,
    event_date: eventDate,
    location,
    featured,
    cover_url: cover,
  })),
);

await insertAll(
  'site.testimonials',
  [
    [
      'John Doe',
      'Mariage, Ngaliema',
      "Une équipe attentive du premier rendez-vous jusqu'au dernier invité. Nous n'avons rien eu à gérer le jour J.",
    ],
    [
      'Jane Doe',
      'Directrice des ressources humaines',
      'Organisation, logistique et accueil impeccables pour notre séminaire. Nous referons appel à eux.',
    ],
    [
      'Jean Dupont',
      'Fête des 40 ans',
      "La décoration a dépassé nos attentes et tout était prêt à l'heure. Merci pour cette belle fête.",
    ],
    [
      'Marie Martin',
      'Chargée du protocole',
      'Un respect rigoureux du protocole et une coordination sans faille avec nos équipes.',
    ],
  ].map(([authorName, authorRole, quote], index) => ({
    author_name: authorName,
    author_role: authorRole,
    quote,
    // Avatars illustrés : pas de visage réel associé à un témoignage inventé
    photo_url: `/illustrations/temoignages/avatar-${index + 1}.png`,
  })),
);

await insertAll(
  'site.team_members',
  [
    ['Direction générale', 'Pilote chaque projet et reste votre interlocuteur principal.'],
    ['Coordination événementielle', 'Organise le planning, les prestataires et la logistique.'],
    ['Décoration et scénographie', "Imagine l'ambiance et met en scène chaque espace."],
    ['Relation client', "Vous accompagne du premier contact jusqu'au jour J."],
  ].map(([role, bio]) => ({ name: 'Nom à compléter', role, bio })),
);

await insertAll(
  'site.clients',
  ['A', 'B', 'C', 'D', 'E', 'F'].map((letter) => ({ name: `Client ${letter}` })),
);

const settings = await getSettings();
if (!settings.phone && !settings.address) {
  await saveSettings({
    ...settings,
    phone: '+243 000 000 000',
    address: 'Adresse à compléter\nGombe, Kinshasa\nRépublique démocratique du Congo',
  });
  console.info('[seed] coordonnées provisoires enregistrées');
}

await pool.end();
