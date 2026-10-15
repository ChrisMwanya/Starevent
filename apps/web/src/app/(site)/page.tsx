import Link from "next/link";
import { AboutBlock } from "@/components/about-block";
import { Clients } from "@/components/clients";
import { CtaBand } from "@/components/cta-band";
import { HeroBackdrop, HeroRotationProvider, HeroRotator } from "@/components/hero-rotator";
import { ArrowLink } from "@/components/arrow-link";
import { PageHero } from "@/components/page-hero";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCards } from "@/components/service-cards";
import { serviceItems } from "@/components/service-list";
import { Testimonials } from "@/components/testimonials";
import { getClients, getProjects, getServices, getTestimonials } from "@/lib/content";
import { entranceDelay, reveal } from "@/lib/motion";

const intro =
  "Mariages, événements corporate, anniversaires et événements institutionnels : Star Event conçoit et organise chaque moment de A à Z.";

/** Les trois cartes du héros du modèle : prestation, visuel, appel à l'action. */
function HeroCards() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
      <HeroRotator />

      <Link
        href="/contact"
        style={entranceDelay(940)}
        className="group animate-fade-up flex min-h-56 flex-col bg-surface p-4 transition-colors duration-300 hover:bg-brand-orange hover:text-white sm:min-h-72 sm:p-5"
      >
        <span aria-hidden="true" className="self-end font-serif text-5xl leading-none opacity-30 sm:text-6xl">
          “
        </span>
        <span className="mt-2 leading-snug sm:text-lg">
          Un projet en tête&nbsp;? Parlons-en et recevez une proposition sur mesure.
        </span>
        <span className="mt-auto pt-8 text-sm font-semibold">Star Event</span>
        <span className="text-sm opacity-60">Kinshasa, RDC</span>
      </Link>
    </div>
  );
}

async function LatestProjects() {
  const projects = await getProjects();
  const selection = [...projects.filter((project) => project.featured), ...projects]
    .filter((project, index, all) => all.indexOf(project) === index)
    .slice(0, 3);

  return (
    <section className="shell pt-20 md:pt-28">
      <SectionHeading label="Réalisations" title="Quelques événements récemment orchestrés" />
      <div className="mt-8 flex max-w-sm flex-col items-start gap-4 md:mt-4">
        <p className="text-sm text-foreground/85">
          Un aperçu des événements que nous avons conçus et coordonnés à Kinshasa.
        </p>
        <ArrowLink href="/realisations">Voir toutes les réalisations</ArrowLink>
      </div>

      {/* Largeurs décroissantes, cartes alignées en bas : effet d'escalier */}
      {selection.length > 0 ? (
        <ul className="mt-12 grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1.1fr_0.75fr] lg:items-end">
          {selection.map((project, index) => (
            <li key={project.id} {...reveal(index, 120)} className={index === 0 ? "sm:col-span-2 lg:col-span-1" : ""}>
              <ProjectCard
                project={project}
                sizes={
                  ["(min-width: 1024px) 42vw, 100vw", "(min-width: 1024px) 31vw, (min-width: 640px) 50vw, 100vw"][
                    index
                  ] ?? "(min-width: 1024px) 21vw, (min-width: 640px) 50vw, 100vw"
                }
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-12 border-y border-line py-10 text-muted">
          Nos premières réalisations seront bientôt publiées ici.
        </p>
      )}
    </section>
  );
}

async function Services() {
  const services = await getServices();

  return (
    <section className="shell pt-20 md:pt-28">
      <SectionHeading label="Nos services" title="Un savoir-faire pour chaque type d'événement" />
      <div className="mt-8 flex max-w-sm flex-col items-start gap-4 md:mt-4">
        <p className="text-sm text-foreground/85">
          Lieu, prestataires, décoration, coordination : nous adaptons chaque prestation à votre projet.
        </p>
        <ArrowLink href="/prestations">Toutes nos prestations</ArrowLink>
      </div>
      <div className="mt-12">
        <ServiceCards services={services} />
      </div>
    </section>
  );
}

export default async function HomePage() {
  const [testimonials, clients, services] = await Promise.all([getTestimonials(), getClients(), getServices()]);
  const heroItems = serviceItems(services).map(({ title, anchor, image }) => ({ title, anchor, image }));

  return (
    <>
      {/* Le fond et les cartes du héros affichent la même prestation, à tour de rôle */}
      <HeroRotationProvider items={heroItems}>
        <PageHero title="Vos événements, orchestrés à Kinshasa" intro={intro} backdrop={<HeroBackdrop />}>
          <HeroCards />
        </PageHero>
      </HeroRotationProvider>

      <Services />
      <AboutBlock showLink />
      <LatestProjects />

      {clients.length > 0 ? (
        <section className="shell pt-20 md:pt-28">
          <SectionHeading
            label="Ils nous font confiance"
            title="Des clients particuliers, entreprises et institutions"
          />
          <div className="mt-12">
            <Clients clients={clients} />
          </div>
        </section>
      ) : null}

      {testimonials.length > 0 ? (
        <section className="shell pt-20 md:pt-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading label="Témoignages" title="Ils nous ont confié leur événement" align="left" />
            <ArrowLink href="/contact" accent>
              Confiez-nous le vôtre
            </ArrowLink>
          </div>
          <div className="mt-12">
            <Testimonials items={testimonials} />
          </div>
        </section>
      ) : null}

      <CtaBand />
    </>
  );
}
