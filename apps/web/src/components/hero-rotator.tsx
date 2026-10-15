"use client";

import Image from "next/image";
import Link from "next/link";
import { createContext, use, useEffect, useState } from "react";
import { ArrowUpRight, Sparkle } from "@/components/icons";
import { entranceDelay } from "@/lib/motion";

const ROTATION_MS = 3_000;

type Item = { title: string; anchor: string; image: string | null };

type Rotation = {
  items: Item[];
  index: number;
  setIndex: (index: number) => void;
  setPaused: (paused: boolean) => void;
};

const RotationContext = createContext<Rotation | null>(null);

function useRotation(): Rotation {
  const rotation = use(RotationContext);
  if (!rotation) throw new Error("HeroRotationProvider manquant");
  return rotation;
}

/**
 * Prestation affichée dans le héros, partagée par le fond et les deux premières cartes.
 * La rotation s'arrête au survol, au focus et quand le visiteur a demandé moins d'animations.
 */
export function HeroRotationProvider({ items, children }: { items: Item[]; children: React.ReactNode }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length < 2) return;
    const timer = window.setInterval(() => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      setIndex((current) => (current + 1) % items.length);
    }, ROTATION_MS);
    return () => window.clearInterval(timer);
  }, [paused, items.length]);

  return <RotationContext value={{ items, index, setIndex, setPaused }}>{children}</RotationContext>;
}

/** Fond du héros : la photo de la prestation affichée, en fondu. Toutes les photos sont chargées d'avance. */
export function HeroBackdrop() {
  const { items, index } = useRotation();

  return (
    <div className="animate-drift absolute inset-0 will-change-transform">
      {items.map((entry, position) =>
        entry.image ? (
          <Image
            key={entry.anchor}
            src={entry.image}
            alt=""
            fill
            priority={position === 0}
            sizes="100vw"
            className={`object-cover transition-opacity duration-1000 ${position === index ? "opacity-100" : "opacity-0"}`}
          />
        ) : null,
      )}
    </div>
  );
}

/** Les deux premières cartes du héros : la prestation et sa photo. */
export function HeroRotator() {
  const { items, index, setIndex, setPaused } = useRotation();
  const item = items[index % items.length]!;

  const pauseHandlers = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocus: () => setPaused(true),
    onBlur: () => setPaused(false),
  };

  return (
    <>
      <div
        {...pauseHandlers}
        style={entranceDelay(700)}
        className="group animate-fade-up hover-eclat flex min-h-56 flex-col bg-foreground p-4 text-background transition-colors duration-300 hover:text-white sm:min-h-72 sm:p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-background text-foreground">
            <Sparkle className="h-5 w-auto" />
          </span>
          {items.length > 1 ? (
            // Au-dessus du lien qui couvre la carte, pour rester cliquables
            <div className="relative z-10 flex gap-1.5 pt-1">
              {items.map((entry, position) => (
                <button
                  key={entry.anchor}
                  type="button"
                  onClick={() => setIndex(position)}
                  aria-label={`Afficher ${entry.title}`}
                  aria-current={position === index ? "true" : undefined}
                  className={`h-1.5 rounded-full bg-current transition-all duration-300 ${
                    position === index ? "w-5 opacity-90" : "w-1.5 opacity-30 hover:opacity-60"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>

        <Link
          href={`/prestations#${item.anchor}`}
          className="mt-6 flex flex-1 flex-col after:absolute after:inset-0 sm:mt-8"
        >
          {/* La clé relance l'animation d'entrée à chaque changement de prestation */}
          <span
            key={item.anchor}
            className="animate-fade-up text-xl leading-tight font-medium text-balance sm:text-2xl"
          >
            {item.title}
          </span>
          <span className="mt-auto inline-flex items-center gap-2 self-end border-b border-current pt-6 pb-1 text-sm">
            Voir la prestation
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </Link>
      </div>

      <div
        {...pauseHandlers}
        style={entranceDelay(820)}
        className="group animate-fade-up relative order-last col-span-2 aspect-video overflow-hidden bg-surface sm:order-none sm:col-span-1 sm:aspect-auto sm:min-h-72"
      >
        {/* Toutes les photos sont superposées : seule la courante est visible, les autres sont déjà chargées */}
        {items.map((entry, position) =>
          entry.image ? (
            <Image
              key={entry.anchor}
              src={entry.image}
              alt={position === index ? `Illustration : ${entry.title}` : ""}
              fill
              priority={position === 0}
              sizes="(min-width: 640px) 22vw, 100vw"
              className={`object-cover transition-opacity duration-700 ${position === index ? "opacity-100" : "opacity-0"}`}
            />
          ) : null,
        )}
        {/* Voile aux couleurs du logo au survol */}
        <div className="bg-eclat absolute inset-0 opacity-0 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-50" />
      </div>
    </>
  );
}
