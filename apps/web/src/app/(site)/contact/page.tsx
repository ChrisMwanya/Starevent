import type { Metadata } from "next";
import { Sparkle } from "@/components/icons";
import { PageTitle } from "@/components/page-hero";
import { QuoteForm } from "@/components/quote-form";
import { getSettings } from "@/lib/content";
import { addressLines, telUrl, whatsappGreeting, whatsappUrl } from "@/lib/site";
import { reveal } from "@/lib/motion";

const description = "Parlez-nous de votre projet : nous revenons vers vous rapidement avec une proposition.";

export const metadata: Metadata = {
  title: "Contact et devis",
  description,
};

export default async function ContactPage() {
  const settings = await getSettings();
  const whatsapp = whatsappUrl(settings.whatsappNumber, whatsappGreeting);
  const address = addressLines(settings);

  return (
    <>
      <PageTitle title="Parlons de votre événement" />

      <section
        {...reveal()}
        className="shell grid gap-14 pt-16 md:pt-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-20"
      >
        <div>
          <h2 className="text-3xl font-medium tracking-tight">Demande de devis</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/85">
            Décrivez votre événement en quelques lignes. Votre demande est transmise à notre équipe, qui vous recontacte
            avec une proposition.
          </p>

          <dl className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-20">
            <div>
              <dt className="flex items-center gap-2 text-lg font-medium">
                <Sparkle className="h-4 w-auto text-brand-orange" />
                WhatsApp
              </dt>
              <dd className="mt-2 text-sm">
                {whatsapp ? (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-b border-foreground pb-0.5 transition-colors hover:border-brand-orange hover:text-brand-orange"
                  >
                    Démarrer une conversation
                  </a>
                ) : (
                  <span className="text-muted">Bientôt disponible</span>
                )}
              </dd>
            </div>
            {settings.phone ? (
              <div>
                <dt className="flex items-center gap-2 text-lg font-medium">
                  <Sparkle className="h-4 w-auto text-brand-orange" />
                  Téléphone
                </dt>
                <dd className="mt-2 text-sm">
                  <a
                    href={telUrl(settings.phone)}
                    className="border-b border-foreground pb-0.5 transition-colors hover:border-brand-orange hover:text-brand-orange"
                  >
                    {settings.phone}
                  </a>
                </dd>
              </div>
            ) : null}
            {settings.email ? (
              <div>
                <dt className="flex items-center gap-2 text-lg font-medium">
                  <Sparkle className="h-4 w-auto text-brand-orange" />
                  Email
                </dt>
                <dd className="mt-2 text-sm">
                  <a
                    href={`mailto:${settings.email}`}
                    className="border-b border-foreground pb-0.5 transition-colors hover:border-brand-orange hover:text-brand-orange"
                  >
                    {settings.email}
                  </a>
                </dd>
              </div>
            ) : null}
            {address.length > 0 ? (
              <div>
                <dt className="flex items-center gap-2 text-lg font-medium">
                  <Sparkle className="h-4 w-auto text-brand-orange" />
                  Nous trouver
                </dt>
                <dd className="mt-2 text-sm">
                  <address className="not-italic">
                    {address.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </dd>
              </div>
            ) : null}
          </dl>
        </div>

        <QuoteForm />
      </section>
    </>
  );
}
