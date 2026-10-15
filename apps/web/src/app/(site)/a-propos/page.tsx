import type { Metadata } from "next";
import { AboutBlock } from "@/components/about-block";
import { PageTitle } from "@/components/page-hero";
import { Process } from "@/components/process";
import { SectionHeading } from "@/components/section-heading";
import { Team } from "@/components/team";
import { getTeam } from "@/lib/content";

const description = "Star Event, agence événementielle à Kinshasa : notre approche et notre façon de travailler.";

export const metadata: Metadata = {
  title: "À propos",
  description,
};

export default async function AboutPage() {
  const team = await getTeam();

  return (
    <>
      <PageTitle title="Une équipe au service de vos grands moments" />

      <AboutBlock />

      {team.length > 0 ? (
        <section className="shell pt-20 md:pt-28">
          <SectionHeading label="L'équipe" title="Les personnes derrière vos événements" />
          <div className="mt-12">
            <Team members={team} />
          </div>
        </section>
      ) : null}

      <section className="shell pt-20 md:pt-28">
        <SectionHeading label="Notre démarche" title="Comment nous travaillons avec vous" align="left" />
        <div className="mt-12">
          <Process />
        </div>
      </section>
    </>
  );
}
