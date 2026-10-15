import Image from "next/image";
import Link from "next/link";
import { NavLinks } from "@/components/nav-links";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/75 backdrop-blur-md">
      <div className="shell flex items-center justify-between gap-4 py-4 sm:gap-6 sm:py-5">
        <Link href="/" className="shrink-0" aria-label={`${siteConfig.name} — Accueil`}>
          <Image
            src="/brand/star-event-horizontal-couleur-fond-fonce.svg"
            alt={siteConfig.name}
            width={235}
            height={20}
            unoptimized
            priority
            className="h-auto w-36 light:hidden sm:w-[235px]"
          />
          <Image
            src="/brand/star-event-horizontal-couleur.svg"
            alt={siteConfig.name}
            width={235}
            height={20}
            unoptimized
            priority
            className="hidden h-auto w-36 light:block sm:w-[235px]"
          />
        </Link>
        <NavLinks className="hidden items-center gap-x-8 lg:flex xl:gap-x-10" />
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link
            href="/contact"
            className="rounded-full border border-foreground px-4 py-2 text-xs font-medium tracking-wider whitespace-nowrap uppercase transition-colors hover:bg-foreground hover:text-background sm:px-5"
          >
            {/* Libellé court sur mobile pour que l'en-tête tienne sur une ligne */}
            <span className="sm:hidden">Devis</span>
            <span className="hidden sm:inline">Demander un devis</span>
          </Link>
        </div>
      </div>
      {/* Sur mobile, la navigation passe sur une rangée sous l'en-tête */}
      <NavLinks className="shell flex gap-x-6 overflow-x-auto border-t border-line py-3 [scrollbar-width:none] lg:hidden" />
    </header>
  );
}
