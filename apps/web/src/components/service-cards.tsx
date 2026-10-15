import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { serviceItems } from "@/components/service-list";
import type { Service } from "@/lib/content";
import { reveal } from "@/lib/motion";

/** Présentation des prestations en cartes ; le détail reste sur la page Prestations. */
export function ServiceCards({ services }: { services: Service[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {serviceItems(services).map((item, index) => (
        <li key={item.key} {...reveal(index, 110)}>
          <Link
            href={`/prestations#${item.anchor}`}
            className="group flex h-full flex-col bg-surface p-4 hover-eclat transition-colors duration-300 hover:text-white"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-background">
              {item.image ? (
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                  className="object-cover"
                />
              ) : null}
            </div>
            <span className="mt-6 text-sm tabular-nums opacity-60">[{index + 1}]</span>
            <h3 className="mt-2 text-2xl leading-tight font-medium">{item.title}</h3>
            {item.excerpt ? <p className="mt-3 text-sm leading-relaxed opacity-80">{item.excerpt}</p> : null}
            <span className="mt-auto inline-flex items-center gap-2 self-start border-b border-current pt-8 pb-1 text-sm">
              En savoir plus
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
