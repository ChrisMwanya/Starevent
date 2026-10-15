import { PillLink } from "@/components/arrow-link";
import { Sparkle } from "@/components/icons";
import { SocialLinks } from "@/components/social-links";
import { entranceDelay } from "@/lib/motion";
import { eventTypes } from "@/lib/site";

/** Titre révélé mot à mot, chaque mot glissant hors d'un masque. */
function RisingTitle({ text }: { text: string }) {
  const words = text.split(" ");

  return (
    <h1 className="max-w-4xl text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[1.05] font-medium tracking-tight text-balance">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <span key={index}>
            <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-top">
              <span className="animate-rise inline-block" style={entranceDelay(120 + index * 70)}>
                {word}
              </span>
            </span>
            {index < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </h1>
  );
}

/** Texte d'introduction suivi de son appel à l'action. */
function HeroCall({ intro, delay }: { intro: string; delay: number }) {
  return (
    <div className="flex max-w-sm flex-col items-start gap-6">
      <p className="animate-fade-up text-foreground/85" style={entranceDelay(delay)}>
        {intro}
      </p>
      <div className="animate-fade-up" style={entranceDelay(delay + 100)}>
        <PillLink href="/contact">Parlons-en</PillLink>
      </div>
      <div className="animate-fade-up" style={entranceDelay(delay + 200)}>
        <SocialLinks />
      </div>
    </div>
  );
}

/** En-tête des pages intérieures : le titre seul. */
export function PageTitle({ title }: { title: string }) {
  return (
    <section className="shell">
      <div className="border-b border-line pt-14 pb-14 md:pt-20 md:pb-20">
        <RisingTitle text={title} />
      </div>
    </section>
  );
}

/** Héros de l'accueil : titre, appel à l'action, fond animé et bandeau des types d'événements. */
export function PageHero({
  eyebrow = "Agence événementielle — Kinshasa",
  title,
  intro,
  backdrop,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro: string;
  /** Fond animé (photos), assombri pour garder le texte lisible. */
  backdrop?: React.ReactNode;
  children: React.ReactNode;
}) {
  const afterTitle = 120 + title.split(" ").length * 70;

  return (
    <>
      <section className={`relative ${backdrop ? "isolate overflow-hidden" : ""}`}>
        {backdrop ? (
          <div aria-hidden="true" className="absolute inset-0 -z-10">
            <div className="scroll-parallax absolute inset-0">{backdrop}</div>
            <div className="absolute inset-0 bg-background/70" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
          </div>
        ) : null}
        <div className="shell pt-14 pb-16 md:pt-20 md:pb-24">
          <div className="flex items-start justify-between gap-10">
            <div>
              <p className="animate-fade-up mb-4 text-sm text-muted">{eyebrow}</p>
              <RisingTitle text={title} />
            </div>
            <Sparkle className="hidden h-20 w-auto shrink-0 text-foreground/20 md:block" />
          </div>

          <div className="mt-12 grid grid-cols-1 gap-10 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:items-end">
            <HeroCall intro={intro} delay={afterTitle} />
            {children}
          </div>
        </div>
      </section>

      {/* Tient la place de la bande de logos clients du modèle, en défilement continu */}
      <div className="shell">
        <div className="group overflow-hidden border-y border-line py-10 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="animate-marquee-slow flex w-max group-hover:[animation-play-state:paused]">
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                aria-hidden={copy === 1 ? "true" : undefined}
                className="flex shrink-0 items-center text-lg font-medium text-foreground/45 md:text-xl"
              >
                {[...eventTypes, ...eventTypes].map((type, index) => (
                  <li key={`${type.value}-${index}`} className="flex items-center gap-2.5 px-8 md:px-12">
                    <Sparkle className="h-5 w-auto shrink-0 text-brand-orange/70" />
                    {type.label}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
