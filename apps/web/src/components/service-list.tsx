import Image from "next/image";
import { ArrowLink } from "@/components/arrow-link";
import type { Service } from "@/lib/content";
import { eventTypes } from "@/lib/site";
import { reveal } from "@/lib/motion";

export type ServiceItem = {
  key: string;
  anchor: string;
  title: string;
  excerpt: string | null;
  priceRange: string | null;
  image: string | null;
};

/** Prestations publiées depuis le back-office, sinon les quatre univers d'événements de l'agence. */
export function serviceItems(services: Service[]): ServiceItem[] {
  if (services.length === 0) {
    return eventTypes.map((type) => ({
      key: type.value,
      anchor: type.value,
      title: type.label,
      excerpt: type.excerpt,
      priceRange: null,
      image: type.image,
    }));
  }

  const anchored = new Set<string>();
  return services.map((service) => {
    // Une seule ancre par catégorie, pour les liens `/prestations#mariage` du pied de page
    const anchor = anchored.has(service.category) ? service.slug : service.category;
    anchored.add(service.category);
    return {
      key: String(service.id),
      anchor,
      title: service.title,
      excerpt: service.excerpt,
      priceRange: service.priceRange,
      image: service.coverUrl || (eventTypes.find((type) => type.value === service.category)?.image ?? null),
    };
  });
}

/** Liste numérotée en accordéon : un seul élément ouvert à la fois, sans JavaScript. */
export function ServiceList({ services }: { services: Service[] }) {
  const items = serviceItems(services);

  return (
    <ul className="border-t border-foreground/60">
      {items.map((item, index) => (
        <li key={item.key} id={item.anchor} {...reveal(index)} className="scroll-mt-24 border-b border-foreground/60">
          <details name="prestations" open={index === 0} className="group">
            <summary className="group/row flex cursor-pointer list-none items-baseline gap-5 py-6 text-2xl transition-colors hover:text-brand-orange md:gap-8 md:py-8 md:text-4xl [&::-webkit-details-marker]:hidden">
              <span className="text-sm tabular-nums md:text-base">[{index + 1}]</span>
              <span className="flex-1 transition-transform duration-300 group-hover/row:translate-x-3">
                {item.title}
              </span>
              <span
                aria-hidden="true"
                className="text-xl text-muted transition-transform group-open:rotate-45 md:text-2xl"
              >
                +
              </span>
            </summary>
            <div className="animate-fade-up flex flex-wrap items-end justify-between gap-6 pb-8 pl-10 md:pl-16">
              <div className="flex flex-wrap items-end gap-6">
                {item.image ? (
                  <div className="relative aspect-[4/3] w-40 shrink-0 overflow-hidden bg-surface">
                    <Image src={item.image} alt="" fill sizes="10rem" className="object-cover" />
                  </div>
                ) : null}
                <div className="max-w-xl space-y-2 text-muted">
                  {item.excerpt ? <p>{item.excerpt}</p> : null}
                  {item.priceRange ? <p className="text-sm">Budget indicatif : {item.priceRange}</p> : null}
                </div>
              </div>
              <ArrowLink href="/contact" accent>
                Demander un devis
              </ArrowLink>
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}
