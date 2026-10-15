import { Sparkle } from "@/components/icons";

/** Bandeau de texte géant défilant, signature du pied de page et du bloc « À propos ». */
export function Marquee({ words, accent = false }: { words: readonly string[]; accent?: boolean }) {
  const sequence = (
    <div className="flex shrink-0 items-center">
      {words.map((word) => (
        <span key={word} className="flex items-center">
          <span className="px-[0.35em]">{word}</span>
          <Sparkle className={`h-[0.5em] w-auto ${accent ? "text-brand-orange" : ""}`} />
        </span>
      ))}
    </div>
  );

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden text-[clamp(4.5rem,13vw,11rem)] leading-none font-medium tracking-tight whitespace-nowrap text-foreground/20 select-none"
    >
      <div className="animate-marquee flex w-max">
        {sequence}
        {sequence}
      </div>
    </div>
  );
}
