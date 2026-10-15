import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";

export function ArrowLink({
  href,
  children,
  accent = false,
}: {
  href: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 border-b pb-1 text-sm transition-colors ${
        accent
          ? "border-brand-orange text-brand-orange hover:border-foreground hover:text-foreground"
          : "border-foreground hover:border-brand-orange hover:text-brand-orange"
      }`}
    >
      {children}
      <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}

/** Bouton « pilule + pastille » du modèle : appel à l'action principal. */
export function PillLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center">
      <span className="rounded-full bg-foreground px-6 py-3 text-xs font-medium tracking-wider text-background uppercase">
        {children}
      </span>
      <span className="bg-eclat grid size-11 place-items-center rounded-full text-white transition-transform group-hover:rotate-45">
        <ArrowUpRight className="size-4" />
      </span>
    </Link>
  );
}
