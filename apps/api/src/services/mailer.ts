import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import type { QuoteRequest } from '../schemas/quote.js';

const transporter = env.SMTP_HOST
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } : undefined,
    })
  : null;

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

  if (!transporter || !env.MAIL_TO) {
    console.info('[mailer] SMTP non configuré, notification non envoyée :\n' + lines.join('\n'));
    return;
  }

  await transporter.sendMail({
    from: env.MAIL_FROM,
    to: env.MAIL_TO,
    replyTo: quote.email,
    subject: `Nouvelle demande de devis — ${quote.eventType} — ${quote.fullName}`,
    text: lines.join('\n'),
  });
}
