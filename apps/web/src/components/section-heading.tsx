import { Sparkle } from "@/components/icons";
import { reveal } from "@/lib/motion";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-sm font-medium tracking-wide text-brand-orange uppercase">
      <Sparkle className="h-4 w-auto" />
      {children}
    </p>
  );
}

/** En-tête de section du modèle : étiquette à gauche, grand titre aligné à droite. */
export function SectionHeading({
  label,
  title,
  align = "right",
}: {
  label: string;
  title: string;
  align?: "left" | "right";
}) {
  const heading = (
    <h2 className="max-w-2xl text-3xl leading-tight font-medium tracking-tight text-balance md:text-5xl">{title}</h2>
  );

  if (align === "left") {
    return (
      <div {...reveal()} className="space-y-5">
        <SectionLabel>{label}</SectionLabel>
        {heading}
      </div>
    );
  }

  return (
    <div {...reveal()} className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
      <SectionLabel>{label}</SectionLabel>
      <div className="md:text-right">{heading}</div>
    </div>
  );
}
