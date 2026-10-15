import { siteConfig } from "@/lib/site";

export type FieldErrors = Record<string, string[] | undefined>;

export class AdminApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly fields: FieldErrors = {},
  ) {
    super(message);
  }
}

/** Appel au back-office de l'API, avec le cookie de session. Une session expirée renvoie vers la connexion. */
export async function adminFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const isForm = init.body instanceof FormData;
  const response = await fetch(`${siteConfig.apiUrl}/admin${path}`, {
    ...init,
    credentials: "include",
    headers: isForm ? init.headers : { "Content-Type": "application/json", ...init.headers },
  });

  // Session expirée : retour à la connexion (rechargement complet, l'état du back-office est perdu)
  if (response.status === 401 && !path.startsWith("/auth/login")) {
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- hors composant, pas de routeur disponible
    window.location.href = "/admin/login";
    // La page est quittée : rien à afficher ni d'erreur à signaler
    return new Promise<T>(() => {});
  }
  if (response.status === 204) return undefined as T;

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new AdminApiError(body.error ?? "Une erreur est survenue.", response.status, body.fields);
  }
  return body.data as T;
}

export function uploadImage(file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append("file", file);
  return adminFetch("/uploads", { method: "POST", body: form });
}
