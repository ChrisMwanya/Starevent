import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { quoteRequestSchema } from '../schemas/quote.js';
import { notifyNewQuoteRequest } from '../services/mailer.js';
import { saveQuoteRequest } from '../services/quotes.js';
import { buildWhatsAppLink } from '../services/whatsapp.js';

export const quotesRouter = Router();

const quoteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Trop de demandes, merci de réessayer plus tard.' },
});

quotesRouter.post('/', quoteLimiter, async (req, res) => {
  const parsed = quoteRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: 'Données invalides', fields: z.flattenError(parsed.error).fieldErrors });
    return;
  }

  const quote = parsed.data;
  const { id } = await saveQuoteRequest(quote);

  // La demande est enregistrée : un échec d'email ne doit pas faire échouer la requête
  notifyNewQuoteRequest(quote).catch((error) => console.error('[mailer]', error));

  res.status(201).json({
    id,
    whatsappUrl: await buildWhatsAppLink(
      `Bonjour Star Event, je viens d'envoyer une demande de devis (${quote.eventType}) au nom de ${quote.fullName}.`,
    ),
  });
});
