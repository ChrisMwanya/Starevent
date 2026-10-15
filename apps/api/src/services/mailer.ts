import { Resend } from 'resend';
import { env } from '../config/env.js';
import type { QuoteRequest } from '../schemas/quote.js';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
const recipients = env.MAIL_TO.split(',')
  .map((address) => address.trim())
  .filter(Boolean);

export async function notifyNewQuoteRequest(quote: QuoteRequest): Promise<void> {
  const lines = [
    `Nom : ${quote.fullName}`,
    `Email : ${quote.email}`,
    `Téléphone : ${quote.phone}`,
    `Type d'événement : ${quote.eventType}`,
    `Date souhaitée : ${quote.eventDate ?? 'non précisée'}`,
    `Nombre d'invités : ${quote.guestCount ?? 'non précisé'}`,
    `Budget indicatif : ${quote.budgetRange}`,
    '',
    quote.message,
  ];

  if (!resend || recipients.length === 0) {
    console.info('[mailer] Resend non configuré, notification non envoyée :\n' + lines.join('\n'));
    return;
  }

  // Le SDK Resend ne lève pas d'exception : l'échec est dans `error`
  const { error } = await resend.emails.send({
    from: env.MAIL_FROM,
    to: recipients,
    replyTo: quote.email,
    subject: `Nouvelle demande de devis — ${quote.eventType} — ${quote.fullName}`,
    text: lines.join('\n'),
  });
  if (error) throw new Error(`Resend : ${error.message}`);
}
