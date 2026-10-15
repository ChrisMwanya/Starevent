import type { Metadata } from "next";
import { PageTitle } from "@/components/page-hero";
import { Process } from "@/components/process";
import { SectionHeading } from "@/components/section-heading";
import { ServiceList } from "@/components/service-list";
import { getServices } from "@/lib/content";

const description = "Mariages, corporate, anniversaires, institutionnel : une prestation adaptée à chaque événement.";

export const metadata: Metadata = {
  title: "Nos prestations",
  description,
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <PageTitle title="Une prestation pour chaque événement" />

      <section className="shell pt-20 md:pt-28">
        <SectionHeading label="Prestations" title="Ce que nous organisons pour vous" />
        <div className="mt-12">
          <ServiceList services={services} />
        </div>
      </section>

      <section className="shell pt-20 md:pt-28">
        <SectionHeading label="Notre démarche" title="Quatre étapes, un seul interlocuteur" align="left" />
        <div className="mt-12">
          <Process />
        </div>
      </section>
    </>
  );
}
