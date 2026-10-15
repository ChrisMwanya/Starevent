import { query } from '../db/pool.js';
import type { QuoteRequest } from '../schemas/quote.js';

export async function saveQuoteRequest(quote: QuoteRequest): Promise<{ id: number }> {
  const [row] = await query<{ id: number }>(
    `INSERT INTO site.quote_requests
       (full_name, email, phone, event_type, event_date, guest_count, budget_range, message)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id`,
    [
      quote.fullName,
      quote.email,
      quote.phone,
      quote.eventType,
      quote.eventDate ?? null,
      quote.guestCount ?? null,
      quote.budgetRange,
      quote.message,
    ],
  );
  return { id: row!.id };
}
