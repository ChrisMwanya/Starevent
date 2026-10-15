# Star Event

Site web de l'agence événementielle Star Event (Kinshasa).

| Dossier    | Rôle                                                              | Techno                  | Port local |
| ---------- | ----------------------------------------------------------------- | ----------------------- | ---------- |
| `apps/web` | Site public et back-office (`/admin`)                             | Next.js 16 + Tailwind 4 | 3000       |
| `apps/api` | API : contenu du site, back-office, demandes de devis, images     | Express 5 (TypeScript)  | 4000       |
| —          | Base de données (`docker-compose.yml`)                            | PostgreSQL 16           | 5434       |
| `docs/`    | Propositions, benchmark, brief et logos (non versionnés)          | —                       | —          |

Chaque application a son propre `package.json` et son propre `node_modules`.

## Démarrage

Prérequis : Node 24 (`nvm use`), Docker.

```bash
npm run install:all   # dépendances racine + 2 applications
npm run db:up         # PostgreSQL sur le port 5434
npm run dev           # web + api en parallèle (l'API applique les migrations au démarrage)
```

Fichiers d'environnement (copiés depuis les `.env.example`, non versionnés) :
`apps/web/.env.local` et `apps/api/.env`. `REVALIDATE_SECRET` doit avoir la même valeur dans les deux.

### Premier lancement

```bash
npm run admin:create -- vous@exemple.com "Votre nom"   # compte du back-office (mot de passe demandé)
npm run db:seed                                         # facultatif : contenus FICTIFS de démonstration
```

Le back-office est ensuite sur http://localhost:3000/admin. `db:seed` ne remplit que les tables vides ; ne pas le lancer en production.

## Back-office

| Rubrique          | Contenu                                                                     |
| ----------------- | --------------------------------------------------------------------------- |
| Demandes de devis | Demandes du formulaire de contact, statut (nouvelle, contactée, convertie, archivée) et notes |
| Prestations       | Accueil et page Prestations                                                 |
| Réalisations      | Portfolio ; les réalisations « mises en avant » apparaissent sur l'accueil  |
| Témoignages       | Accueil                                                                     |
| Équipe            | Page À propos                                                               |
| Clients           | Section « Ils nous font confiance » de l'accueil                            |
| Coordonnées       | Téléphone, WhatsApp, email, adresse, réseaux sociaux                        |

Chaque élément peut être enregistré en brouillon (non publié). Après une modification, l'API demande au site de
rafraîchir son cache (`POST /api/revalidate` sur `apps/web`) : le changement est visible immédiatement.

Les images sont envoyées à l'API (JPEG, PNG, WebP ou AVIF, 8 Mo maximum), stockées dans `apps/api/uploads/`
et servies sur `/uploads`. En production, ce dossier doit être sur un volume persistant et sauvegardé.

## API

| Route                        | Accès          | Usage                                              |
| ---------------------------- | -------------- | -------------------------------------------------- |
| `GET /content/:ressource`    | Public         | Contenu publié (`services`, `projects`, `testimonials`, `team`, `clients`) |
| `GET /content/settings`      | Public         | Coordonnées                                        |
| `POST /quotes`               | Public         | Demande de devis (validation Zod, limite de débit, champ piège anti-spam) |
| `/admin/*`                   | Session admin  | Connexion, contenus, demandes, coordonnées, images |

Sécurité du back-office : mots de passe hachés (scrypt), session en cookie `HttpOnly` / `SameSite=Lax` dont seule
l'empreinte est stockée, vérification de l'origine sur les requêtes qui modifient des données, limite de tentatives
de connexion.

Les tables sont dans le schéma PostgreSQL `site` ; les migrations SQL sont dans `apps/api/src/db/migrations/`.

## Parcours d'une demande de devis

`apps/web` (formulaire) → `POST /quotes` sur `apps/api` → enregistrement dans `site.quote_requests` → email à l'équipe
→ lien WhatsApp renvoyé au visiteur → suivi dans le back-office.
