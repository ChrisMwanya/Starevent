import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";

const allowedTags = new Set(["services", "projects", "testimonials", "team", "clients", "settings"]);

function isAuthorized(header: string | null): boolean {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || !header) return false;
  const expected = Buffer.from(secret);
  const received = Buffer.from(header);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

/** Appelée par l'API après une modification dans le back-office : le contenu change aussitôt sur le site. */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request.headers.get("x-revalidate-secret"))) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as { tags?: unknown } | null;
  const tags = Array.isArray(body?.tags) ? body.tags.filter((tag): tag is string => allowedTags.has(tag)) : [];
  // `expire: 0` : la visite suivante voit directement le nouveau contenu
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  return Response.json({ revalidated: tags });
}
