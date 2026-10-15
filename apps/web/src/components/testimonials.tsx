import Image from "next/image";
import type { Testimonial } from "@/lib/content";
import { mediaUrl } from "@/lib/site";
import { reveal } from "@/lib/motion";

/** Rangée de témoignages à défilement horizontal ; la première carte porte la couleur de marque. */
export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <ul className="-mx-5 flex snap-x gap-5 overflow-x-auto px-5 pb-2 md:-mx-10 md:px-10">
      {items.map((item, index) => (
        <li
          key={item.id}
          {...reveal(index)}
          className={`flex min-h-80 transition-transform duration-300 hover:-translate-y-1.5 w-72 shrink-0 snap-start flex-col p-6 ${
            index === 0 ? "bg-eclat text-white" : "bg-surface"
          }`}
        >
          <div className="flex items-start justify-between">
            {item.photoUrl ? (
              <Image
                src={mediaUrl(item.photoUrl)}
                alt=""
                width={48}
                height={48}
                className="size-12 rounded-full object-cover"
              />
            ) : (
              <span className="grid size-12 place-items-center rounded-full bg-foreground/10 text-lg font-medium">
                {item.authorName.charAt(0)}
              </span>
            )}
            <span aria-hidden="true" className="font-serif text-6xl leading-none opacity-30">
              “
            </span>
          </div>
          <blockquote className="mt-8 flex-1 text-lg leading-snug">{item.quote}</blockquote>
          <p className="mt-8 text-sm font-semibold">{item.authorName}</p>
          {item.authorRole ? (
            <p className={`text-sm ${index === 0 ? "text-white/80" : "text-muted"}`}>{item.authorRole}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
