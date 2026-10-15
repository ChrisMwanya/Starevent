import { env } from '../config/env.js';

/** Demande au site de rafraîchir les contenus modifiés ; un échec n'empêche pas l'enregistrement. */
export function revalidateSite(tags: string[]): void {
  if (!env.REVALIDATE_SECRET) {
    console.info('[revalidate] REVALIDATE_SECRET absent : le site se mettra à jour à l’expiration de son cache');
    return;
  }
  fetch(new URL('/api/revalidate', env.WEB_URL), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-revalidate-secret': env.REVALIDATE_SECRET },
    body: JSON.stringify({ tags }),
  })
    .then((response) => {
      if (!response.ok) console.error(`[revalidate] le site a répondu ${response.status}`);
    })
    .catch((error) => console.error('[revalidate]', error));
}
