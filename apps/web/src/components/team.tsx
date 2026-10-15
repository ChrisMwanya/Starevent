import Image from "next/image";
import { Sparkle } from "@/components/icons";
import type { TeamMember } from "@/lib/content";
import { reveal } from "@/lib/motion";

/** Cartes de l'équipe ; sans portrait, un éclat du logo tient la place de la photo. */
export function Team({ members }: { members: TeamMember[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {members.map((member, index) => (
        <li key={member.id} {...reveal(index, 110)}>
          <article className="group">
            <div className="hover-eclat grid aspect-[3/4] place-items-center overflow-hidden bg-surface">
              {member.photoUrl ? (
                <Image
                  src={member.photoUrl}
                  alt={`${member.name}, ${member.role}`}
                  fill
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <Sparkle className="h-1/4 w-auto text-foreground/15 transition-colors duration-300 group-hover:text-white" />
              )}
            </div>
            <p className="mt-5 text-sm font-medium tracking-wide text-brand-orange uppercase">{member.role}</p>
            <h3 className="mt-1 text-xl font-medium">{member.name}</h3>
            {member.bio ? <p className="mt-2 text-sm text-muted">{member.bio}</p> : null}
          </article>
        </li>
      ))}
    </ul>
  );
}
