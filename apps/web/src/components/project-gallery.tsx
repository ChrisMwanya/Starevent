"use client";

import { useState } from "react";
import { eventTypeLabel } from "@/lib/site";

/** Filtre par type d'événement ; les cartes sont rendues côté serveur et passées en `children`. */
export function ProjectGallery({ eventTypes, children }: { eventTypes: string[]; children: React.ReactNode }) {
  const [active, setActive] = useState<string | null>(null);
  const filters = [null, ...Array.from(new Set(eventTypes))];

  return (
    <div>
      {filters.length > 2 ? (
        <ul className="flex flex-wrap gap-2 text-sm">
          {filters.map((filter) => (
            <li key={filter ?? "tous"}>
              <button
                type="button"
                aria-pressed={active === filter}
                onClick={() => setActive(filter)}
                className={`rounded-full border px-4 py-2 transition-colors ${
                  active === filter
                    ? "border-foreground bg-foreground text-background"
                    : "border-line hover:border-foreground"
                }`}
              >
                {filter ? eventTypeLabel(filter) : "Tous"}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {/* Les cartes hors filtre sont masquées par leur attribut `data-event-type` */}
      <ul
        data-active={active ?? undefined}
        className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 [&[data-active]>li]:hidden"
      >
        {children}
      </ul>
      {active ? (
        <style>{`ul[data-active="${active}"] > li[data-event-type="${active}"] { display: block; }`}</style>
      ) : null}
    </div>
  );
}
