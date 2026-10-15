import { getSettings } from './settings.js';

export async function buildWhatsAppLink(message?: string): Promise<string | null> {
  const { whatsappNumber } = await getSettings();
  if (!whatsappNumber) return null;
  const url = new URL(`https://wa.me/${whatsappNumber}`);
  if (message) url.searchParams.set('text', message);
  return url.toString();
}
