-- Contenu du site et back-office. Schéma dédié : les anciennes tables Strapi restent dans `public`.
CREATE SCHEMA IF NOT EXISTS site;

CREATE TABLE site.admins (
  id serial PRIMARY KEY,
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE site.sessions (
  token_hash text PRIMARY KEY,
  admin_id integer NOT NULL REFERENCES site.admins (id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE site.services (
  id serial PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL,
  excerpt text,
  price_range text,
  cover_url text,
  position integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE site.projects (
  id serial PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  event_type text NOT NULL,
  event_date date,
  location text,
  featured boolean NOT NULL DEFAULT false,
  cover_url text,
  position integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE site.testimonials (
  id serial PRIMARY KEY,
  author_name text NOT NULL,
  author_role text,
  quote text NOT NULL,
  photo_url text,
  position integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE site.team_members (
  id serial PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  bio text,
  photo_url text,
  position integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE site.clients (
  id serial PRIMARY KEY,
  name text NOT NULL,
  logo_url text,
  website_url text,
  position integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Une seule ligne : coordonnées et réseaux sociaux
CREATE TABLE site.settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  data jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO site.settings (id) VALUES (1);

CREATE TABLE site.quote_requests (
  id serial PRIMARY KEY,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  event_type text NOT NULL,
  event_date date,
  guest_count integer,
  budget_range text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'nouveau',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX quote_requests_status_idx ON site.quote_requests (status, created_at DESC);
