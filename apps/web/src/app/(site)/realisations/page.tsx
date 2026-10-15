import type { Metadata } from "next";
import { PageTitle } from "@/components/page-hero";
import { ProjectCard } from "@/components/project-card";
import { ProjectGallery } from "@/components/project-gallery";
import { SectionHeading } from "@/components/section-heading";
import { getProjects } from "@/lib/content";
import { reveal } from "@/lib/motion";

const description = "Découvrez les événements organisés par Star Event, filtrables par type d'événement.";

export const metadata: Metadata = {
  title: "Réalisations",
  description,
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <PageTitle title="Des événements qui laissent une trace" />

      <section className="shell pt-20 md:pt-28">
        <SectionHeading label="Nos réalisations" title="Le portfolio de l'agence" />
        <div className="mt-12">
          {projects.length > 0 ? (
            <ProjectGallery eventTypes={projects.map((project) => project.eventType)}>
              {projects.map((project, index) => (
                <li key={project.id} data-event-type={project.eventType} {...reveal(index % 2, 120)}>
                  <ProjectCard project={project} sizes="(min-width: 640px) 50vw, 100vw" ratio="aspect-square" />
                </li>
              ))}
            </ProjectGallery>
          ) : (
            <p className="border-y border-line py-10 text-muted">
              Nos premières réalisations seront bientôt publiées ici.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
