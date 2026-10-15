import type { Settings } from "@/lib/content";

export const siteConfig = {
  name: "Star Event",
  description:
    "Agence événementielle à Kinshasa : mariages, événements corporate, anniversaires et événements institutionnels.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
};

export type SocialNetwork = "Instagram" | "Facebook" | "LinkedIn" | "TikTok";

/** Les quatre réseaux, dans l'ordre d'affichage ; un réseau sans adresse s'affiche sans lien. */
export function socialLinks(settings: Settings): { name: SocialNetwork; url: string | null }[] {
  return [
    { name: "Instagram", url: settings.instagramUrl },
    { name: "Facebook", url: settings.facebookUrl },
    { name: "LinkedIn", url: settings.linkedinUrl },
    { name: "TikTok", url: settings.tiktokUrl },
  ];
}

export function addressLines(settings: Settings): string[] {
  return (settings.address ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Image envoyée depuis le back-office (servie par l'API) ou image du site (dossier `public`). */
export function mediaUrl(path: string): string {
  return path.startsWith("/uploads/") ? `${siteConfig.apiUrl}${path}` : path;
}

/** Numéro au format international lisible, à partir des chiffres seuls. */
export function formatPhone(digits: string): string {
  return `+${digits.replace(/\D/g, "").replace(/^(\d{3})(\d{3})(\d{3})(\d+)$/, "$1 $2 $3 $4")}`;
}

export function telUrl(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Crédit du créateur du site, affiché sous le pied de page. Sans `url`, le nom s'affiche sans lien. */
export const siteCredit = {
  name: "Chris Mwanya",
  url: "https://chrismwanya.com" as string | null,
};

export const navigation = [
  { href: "/prestations", label: "Nos prestations" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
] as const;

// Mêmes valeurs que l'énumération `EVENT_TYPES` de l'API
export const eventTypes = [
  {
    value: "mariage",
    label: "Mariages",
    excerpt:
      "Cérémonie, réception, décoration et coordination : un mariage à votre image, orchestré dans les moindres détails.",
    image: "/illustrations/mariage-couple.jpg",
  },
  {
    value: "corporate",
    label: "Événements corporate",
    excerpt: "Séminaires, lancements, conférences et soirées d'entreprise, pensés pour vos équipes et vos clients.",
    image: "/illustrations/corporate-intervention.jpg",
  },
  {
    value: "anniversaire",
    label: "Anniversaires",
    excerpt: "Fêtes privées et célébrations sur mesure, de la réunion intime au grand format.",
    image: "/illustrations/anniversaire-bougies.jpg",
  },
  {
    value: "institutionnel",
    label: "Événements institutionnels",
    excerpt: "Cérémonies officielles, galas et événements publics, avec la rigueur protocolaire qu'ils exigent.",
    image: "/illustrations/institutionnel-assemblee.jpg",
  },
] as const;

export type EventType = (typeof eventTypes)[number]["value"] | "autre";

export function eventTypeLabel(value: string): string {
  return eventTypes.find((type) => type.value === value)?.label ?? "Autre événement";
}

export const budgetRanges = [
  { value: "a-definir", label: "À définir ensemble" },
  { value: "moins-de-2000", label: "Moins de 2 000 $" },
  { value: "de-2000-a-5000", label: "2 000 à 5 000 $" },
  { value: "de-5000-a-10000", label: "5 000 à 10 000 $" },
  { value: "de-10000-a-25000", label: "10 000 à 25 000 $" },
  { value: "plus-de-25000", label: "Plus de 25 000 $" },
] as const;

export const processSteps = [
  {
    title: "Échange",
    text: "Vous nous décrivez votre projet par le formulaire de devis ou directement sur WhatsApp.",
  },
  {
    title: "Proposition",
    text: "Nous revenons vers vous avec une proposition adaptée à votre événement et à votre budget.",
  },
  {
    title: "Préparation",
    text: "Lieu, prestataires, décoration, planning : nous coordonnons chaque étape avec vous.",
  },
  {
    title: "Jour J",
    text: "Notre équipe est sur place pour que vous profitiez pleinement de l'instant.",
  },
] as const;

export const whatsappGreeting = "Bonjour Star Event, je souhaite discuter de mon événement.";

export function whatsappUrl(number: string | null, message?: string): string | null {
  if (!number) return null;
  const url = new URL(`https://wa.me/${number}`);
  if (message) url.searchParams.set("text", message);
  return url.toString();
}
