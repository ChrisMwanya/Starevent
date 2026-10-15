import { eventTypes } from "@/lib/site";

export type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "date" | "checkbox" | "image" | "number" | "url";
  options?: { value: string; label: string }[];
  required?: boolean;
  help?: string;
  /** Occupe toute la largeur du formulaire. */
  wide?: boolean;
};

export type ResourceConfig = {
  /** Nom de la ressource dans l'API (`/admin/content/<name>`). */
  name: string;
  title: string;
  singular: string;
  description: string;
  /** Champs affichés dans la liste : texte principal, texte secondaire, image. */
  primary: string;
  secondary?: (item: Record<string, unknown>) => string | null;
  image?: string;
  fields: FieldConfig[];
};

const eventTypeOptions = [
  ...eventTypes.map((type) => ({ value: type.value, label: type.label })),
  { value: "autre", label: "Autre événement" },
];

const label = (value: unknown) => eventTypeOptions.find((option) => option.value === value)?.label ?? null;

const displayFields: FieldConfig[] = [
  {
    name: "position",
    label: "Ordre d'affichage",
    type: "number",
    help: "Les plus petits nombres s'affichent en premier.",
  },
  { name: "published", label: "Publié sur le site", type: "checkbox" },
];

export const adminResources = {
  services: {
    name: "services",
    title: "Prestations",
    singular: "prestation",
    description: "Les prestations présentées sur l'accueil et la page Prestations.",
    primary: "title",
    secondary: (item) => label(item.category),
    image: "coverUrl",
    fields: [
      { name: "title", label: "Titre", type: "text", required: true },
      { name: "category", label: "Type d'événement", type: "select", options: eventTypeOptions, required: true },
      { name: "excerpt", label: "Description", type: "textarea", wide: true },
      { name: "priceRange", label: "Budget indicatif", type: "text", help: "Par exemple « À partir de 2 000 $ »." },
      { name: "slug", label: "Identifiant d'URL", type: "text", help: "Laissez vide : il est créé à partir du titre." },
      { name: "coverUrl", label: "Photo", type: "image", wide: true },
      ...displayFields,
    ],
  },
  projects: {
    name: "projects",
    title: "Réalisations",
    singular: "réalisation",
    description: "Le portfolio : les trois réalisations « mises en avant » apparaissent sur l'accueil.",
    primary: "title",
    secondary: (item) => [label(item.eventType), item.location, item.eventDate].filter(Boolean).join(" · ") || null,
    image: "coverUrl",
    fields: [
      { name: "title", label: "Titre", type: "text", required: true },
      { name: "eventType", label: "Type d'événement", type: "select", options: eventTypeOptions, required: true },
      { name: "eventDate", label: "Date", type: "date" },
      { name: "location", label: "Lieu", type: "text", help: "Par exemple « Gombe »." },
      { name: "featured", label: "Mettre en avant sur l'accueil", type: "checkbox" },
      { name: "slug", label: "Identifiant d'URL", type: "text", help: "Laissez vide : il est créé à partir du titre." },
      { name: "coverUrl", label: "Photo", type: "image", wide: true },
      ...displayFields,
    ],
  },
  testimonials: {
    name: "testimonials",
    title: "Témoignages",
    singular: "témoignage",
    description: "Les avis clients affichés sur l'accueil.",
    primary: "authorName",
    secondary: (item) => (item.authorRole as string) ?? null,
    image: "photoUrl",
    fields: [
      { name: "authorName", label: "Nom du client", type: "text", required: true },
      { name: "authorRole", label: "Précision", type: "text", help: "Par exemple « Mariage, juin 2026 »." },
      { name: "quote", label: "Témoignage", type: "textarea", required: true, wide: true },
      { name: "photoUrl", label: "Photo (facultative)", type: "image", wide: true },
      ...displayFields,
    ],
  },
  team: {
    name: "team",
    title: "Équipe",
    singular: "membre",
    description: "Les membres de l'équipe présentés sur la page À propos.",
    primary: "name",
    secondary: (item) => (item.role as string) ?? null,
    image: "photoUrl",
    fields: [
      { name: "name", label: "Nom", type: "text", required: true },
      { name: "role", label: "Poste", type: "text", required: true },
      { name: "bio", label: "Présentation", type: "textarea", wide: true },
      { name: "photoUrl", label: "Portrait", type: "image", wide: true },
      ...displayFields,
    ],
  },
  clients: {
    name: "clients",
    title: "Clients",
    singular: "client",
    description: "La section « Ils nous font confiance » de l'accueil.",
    primary: "name",
    secondary: (item) => (item.websiteUrl as string) ?? null,
    image: "logoUrl",
    fields: [
      { name: "name", label: "Nom", type: "text", required: true },
      { name: "websiteUrl", label: "Site web", type: "url" },
      { name: "logoUrl", label: "Logo", type: "image", wide: true, help: "Sans logo, le nom s'affiche à la place." },
      ...displayFields,
    ],
  },
} satisfies Record<string, ResourceConfig>;

export type AdminResourceName = keyof typeof adminResources;

export const quoteStatuses = [
  { value: "nouveau", label: "Nouvelles" },
  { value: "contacte", label: "Contactées" },
  { value: "converti", label: "Converties" },
  { value: "archive", label: "Archivées" },
] as const;
