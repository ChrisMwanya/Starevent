import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { getSettings } from "@/lib/content";
import { whatsappGreeting, whatsappUrl } from "@/lib/site";
import { reveal } from "@/lib/motion";

/** Dernier appel à l'action avant le pied de page. */
export async function CtaBand() {
  const { whatsappNumber } = await getSettings();
  const whatsapp = whatsappUrl(whatsappNumber, whatsappGreeting);

  return (
    <section className="shell pt-20 md:pt-28">
      <div
        {...reveal()}
        className="bg-eclat flex flex-col gap-10 px-6 py-14 text-white md:px-14 md:py-20 lg:flex-row lg:items-end lg:justify-between"
      >
        <div className="max-w-2xl">
          <p className="text-sm font-medium tracking-wide uppercase opacity-80">Votre prochain événement</p>
          <h2 className="mt-4 text-4xl leading-tight font-medium tracking-tight text-balance md:text-6xl">
            Un projet en tête&nbsp;? Parlons-en.
          </h2>
          <p className="mt-5 max-w-md opacity-90">
            Décrivez-nous votre événement : nous revenons vers vous avec une proposition sur mesure.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-full bg-brand-ink px-6 py-3.5 text-sm font-medium tracking-wider uppercase transition-colors hover:bg-white hover:text-brand-ink"
          >
            Demander un devis
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          {whatsapp ? (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-white px-6 py-3.5 text-sm font-medium tracking-wider uppercase transition-colors hover:bg-white hover:text-brand-ink"
            >
              WhatsApp
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
