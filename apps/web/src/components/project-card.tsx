import Image from "next/image";
import { Sparkle } from "@/components/icons";
import type { Project } from "@/lib/content";
import { eventTypeLabel } from "@/lib/site";

const monthYear = new Intl.DateTimeFormat("fr-FR", {
  month: "short",
  year: "numeric",
});

export function ProjectCard({
  project,
  sizes,
  ratio = "aspect-[4/3]",
}: {
  project: Project;
  sizes: string;
  ratio?: string;
}) {
  return (
    <article className="group">
      <div className={`relative overflow-hidden bg-surface ${ratio}`}>
        {project.coverUrl ? (
          <Image
            src={project.coverUrl}
            alt={project.title}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="bg-eclat grid size-full place-items-center">
            <Sparkle className="h-1/4 w-auto text-white" />
          </div>
        )}
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4 text-sm">
        <p className="text-muted">
          {eventTypeLabel(project.eventType)}
          {project.location ? ` · ${project.location}` : ""}
        </p>
        {project.eventDate ? (
          <p className="whitespace-nowrap">{monthYear.format(new Date(project.eventDate))}</p>
        ) : null}
      </div>
      <h3 className="mt-1 text-lg font-medium tracking-wide uppercase transition-colors group-hover:text-brand-orange">
        {project.title}
      </h3>
    </article>
  );
}
