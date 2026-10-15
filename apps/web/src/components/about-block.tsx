import Image from "next/image";
import { ArrowLink } from "@/components/arrow-link";
import { Sparkle } from "@/components/icons";
import { SectionLabel } from "@/components/section-heading";
import { reveal } from "@/lib/motion";

const strengths = [
  {
    title: "Un interlocuteur unique",
    text: "Une seule équipe coordonne le lieu, les prestataires et le planning.",
  },
  {
    title: "Des prestations sur mesure",
    text: "Chaque proposition part de votre projet, de vos invités et de votre budget.",
  },
  {
    title: "Présents le jour J",
    text: "Nous restons sur place pour que vous profitiez pleinement de l'instant.",
  },
];

const facts = [
  { value: "4", label: "Univers d'événements" },
  { value: "A→Z", label: "De l'idée au jour J" },
];

export function AboutBlock({ showLink = false }: { showLink?: boolean }) {
  return (
    <section className="shell pt-20 md:pt-28">
      <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
        {/* Composition photo : grande image, vignette en décalé et badge aux couleurs du logo */}
        <div {...reveal()} className="relative pr-10 pb-16 sm:pr-16 sm:pb-20">
          <div className="relative aspect-[4/5] overflow-hidden bg-surface">
            <Image
              src="/illustrations/salle-de-reception.jpg"
              alt="Salle de réception aux tables rondes nappées de blanc"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="absolute right-0 bottom-0 aspect-[4/3] w-1/2 overflow-hidden border-8 border-background bg-surface">
            <Image
              src="/illustrations/diner-de-gala.jpg"
              alt="Table dressée pour un dîner de gala"
              fill
              sizes="(min-width: 1024px) 20vw, 45vw"
              className="object-cover"
            />
          </div>
          <div className="bg-eclat absolute top-6 -left-3 flex items-center gap-3 px-5 py-4 text-white sm:-left-6">
            <Sparkle className="h-7 w-auto" />
            <p className="text-sm leading-tight font-medium">
              Agence événementielle
              <br />
              basée à Kinshasa
            </p>
          </div>
        </div>

        <div>
          <div {...reveal()}>
            <SectionLabel>L&apos;agence</SectionLabel>
            <h2 className="mt-5 text-3xl leading-tight font-medium tracking-tight text-balance md:text-5xl">
              Star Event, bien plus que de l&apos;organisation
            </h2>
            <p className="mt-6 max-w-lg text-foreground/85">
              Pour les particuliers, les entreprises et les institutions, nous concevons et organisons chaque événement
              de A à Z, du premier échange jusqu&apos;au dernier invité.
            </p>
          </div>

          <ul className="mt-10 border-t border-line">
            {strengths.map((item, index) => (
              <li key={item.title} {...reveal(index + 1, 100)} className="flex gap-4 border-b border-line py-5">
                <Sparkle className="mt-1 h-4 w-auto shrink-0 text-brand-orange" />
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-1 text-sm text-muted">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>

          <div {...reveal()} className="mt-10 flex flex-wrap items-end justify-between gap-8">
            <dl className="flex gap-12">
              {facts.map((fact) => (
                <div key={fact.label} className="flex flex-col-reverse gap-2">
                  <dt className="text-sm text-muted">{fact.label}</dt>
                  <dd className="text-5xl leading-none font-medium tracking-tight md:text-6xl">{fact.value}</dd>
                </div>
              ))}
            </dl>
            {showLink ? <ArrowLink href="/a-propos">Découvrir l&apos;agence</ArrowLink> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
