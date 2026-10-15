import Image from "next/image";
import { Sparkle } from "@/components/icons";
import type { Client } from "@/lib/content";
import { reveal } from "@/lib/motion";
import { mediaUrl } from "@/lib/site";

const cellClass =
  "group flex size-full items-center justify-center gap-2 px-6 text-lg font-medium text-foreground/45 transition-colors duration-300 hover:bg-surface hover:text-foreground";

/** Grille des références clients : logo s'il existe, sinon le nom. */
export function Clients({ clients }: { clients: Client[] }) {
  return (
    <ul className="grid grid-cols-2 border-t border-l border-line sm:grid-cols-3 lg:grid-cols-6">
      {clients.map((client, index) => {
        const content = client.logoUrl ? (
          <span className="relative block h-12 w-full">
            <Image
              src={mediaUrl(client.logoUrl)}
              alt={client.name}
              fill
              sizes="12rem"
              className="object-contain opacity-70 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
            />
          </span>
        ) : (
          <>
            <Sparkle className="h-4 w-auto text-brand-orange/70" />
            {client.name}
          </>
        );
        return (
          <li key={client.id} {...reveal(index, 70)} className="h-28 border-r border-b border-line md:h-36">
            {client.websiteUrl ? (
              <a href={client.websiteUrl} target="_blank" rel="noopener noreferrer" className={cellClass}>
                {content}
              </a>
            ) : (
              <div className={cellClass}>{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
