import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { apiFetch } from "@/lib/api";

export type Service = {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  priceRange: string | null;
  coverUrl: string | null;
};

export type Project = {
  id: number;
  title: string;
  slug: string;
  eventType: string;
  eventDate: string | null;
  location: string | null;
  featured: boolean;
  coverUrl: string | null;
};

export type Testimonial = {
  id: number;
  authorName: string;
  authorRole: string | null;
  quote: string;
  photoUrl: string | null;
};

export type TeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string | null;
  photoUrl: string | null;
};

export type Client = {
  id: number;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
};

export type Settings = {
  phone: string | null;
  whatsappNumber: string | null;
  email: string | null;
  address: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  linkedinUrl: string | null;
  tiktokUrl: string | null;
};

const emptySettings: Settings = {
  phone: null,
  whatsappNumber: null,
  email: null,
  address: null,
  instagramUrl: null,
  facebookUrl: null,
  linkedinUrl: null,
  tiktokUrl: null,
};

// L'étiquette porte le nom de la ressource : l'API la revalide après chaque modification du back-office.
// API injoignable : la page s'affiche sans ce contenu et réessaie quelques minutes plus tard.
async function load<T>(tag: string, fallback: T): Promise<T> {
  cacheTag(tag);
  try {
    const data = await apiFetch<T>(`/content/${tag}`);
    cacheLife("hours");
    return data;
  } catch {
    cacheLife("minutes");
    return fallback;
  }
}

export async function getServices(): Promise<Service[]> {
  "use cache";
  return load<Service[]>("services", []);
}

export async function getProjects(): Promise<Project[]> {
  "use cache";
  return load<Project[]>("projects", []);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  "use cache";
  return load<Testimonial[]>("testimonials", []);
}

export async function getTeam(): Promise<TeamMember[]> {
  "use cache";
  return load<TeamMember[]>("team", []);
}

export async function getClients(): Promise<Client[]> {
  "use cache";
  return load<Client[]>("clients", []);
}

export async function getSettings(): Promise<Settings> {
  "use cache";
  return load<Settings>("settings", emptySettings);
}
