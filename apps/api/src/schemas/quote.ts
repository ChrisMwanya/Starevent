import { z } from 'zod';

export const EVENT_TYPES = ['mariage', 'corporate', 'anniversaire', 'institutionnel', 'autre'] as const;

export const BUDGET_RANGES = [
  'moins-de-2000',
  'de-2000-a-5000',
  'de-5000-a-10000',
  'de-10000-a-25000',
  'plus-de-25000',
  'a-definir',
] as const;

export const quoteRequestSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.email().max(160),
  phone: z.string().trim().min(6).max(30),
  eventType: z.enum(EVENT_TYPES),
  eventDate: z.iso.date().optional(),
  guestCount: z.coerce.number().int().min(1).max(100000).optional(),
  budgetRange: z.enum(BUDGET_RANGES).default('a-definir'),
  message: z.string().trim().min(10).max(5000),
  // Champ piège anti-spam : doit rester vide
  website: z.string().max(0).optional(),
});

export type QuoteRequest = z.infer<typeof quoteRequestSchema>;
