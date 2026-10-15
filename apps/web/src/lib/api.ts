import "server-only";
import { siteConfig } from "@/lib/site";

/**
 * Lecture du contenu servi par l'API Express. À appeler depuis une fonction marquée `"use cache"`
 * (avec `cacheLife` et `cacheTag`) pour que la page soit prérendue.
 */
export async function apiFetch<T>(path: string): Promise<T> {
  const url = new URL(path, siteConfig.apiUrl);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API ${response.status} sur ${url.pathname}`);
  }
  const body = (await response.json()) as { data: T };
  return body.data;
}
