import Link from "next/link";
import { ArrowUp } from "@/components/icons";
import { Marquee } from "@/components/marquee";
import { SocialLinks } from "@/components/social-links";
import { getSettings } from "@/lib/content";
import {
  addressLines,
  eventTypes,
  formatPhone,
  navigation,
  siteConfig,
  siteCredit,
  telUrl,
  whatsappGreeting,
  whatsappUrl,
} from "@/lib/site";
import { reveal } from "@/lib/motion";

const marqueeWords = [siteConfig.name, "Kinshasa", "Mariages", "Corporate", "Anniversaires"];

const linkClass = "transition-colors hover:text-brand-orange";

export async function Footer() {
  const settings = await getSettings();
  const whatsapp = whatsappUrl(settings.whatsappNumber, whatsappGreeting);
  const address = addressLines(settings);

  return (
    <footer id="pied-de-page" className="mt-24 md:mt-32">
      <Marquee words={marqueeWords} accent />

      <div className="shell grid gap-14 pt-16 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:pt-24">
        <div>
          <p {...reveal()} className="max-w-md text-4xl leading-tight font-medium tracking-tight md:text-5xl">
            Lancez votre événement dès maintenant
          </p>
          <ul className="mt-8 flex flex-wrap gap-3 text-sm">
            <li>
              <Link
                href="/contact"
                className="inline-block rounded-full bg-surface px-5 py-2.5 transition-colors hover:bg-foreground hover:text-background"
              >
                Demander un devis
              </Link>
            </li>
          </ul>

          <SocialLinks className="mt-10" />
        </div>

        <div {...reveal()} className="grid grid-cols-2 gap-x-8 gap-y-12 text-sm sm:grid-cols-3">
          <div>
            <p className="text-muted">Menu</p>
            <ul className="mt-4 space-y-2.5">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-muted">Événements</p>
            <ul className="mt-4 space-y-2.5">
              {eventTypes.map((type) => (
                <li key={type.value}>
                  <Link href={`/prestations#${type.value}`} className={linkClass}>
                    {type.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-muted">Contact</p>
            <dl className="mt-4 space-y-4">
              {settings.phone ? (
                <div>
                  <dt className="text-xs tracking-wider text-muted uppercase">Téléphone</dt>
                  <dd className="mt-1">
                    <a href={telUrl(settings.phone)} className={linkClass}>
                      {settings.phone}
                    </a>
                  </dd>
                </div>
              ) : null}
              {whatsapp && settings.whatsappNumber ? (
                <div>
                  <dt className="text-xs tracking-wider text-muted uppercase">WhatsApp</dt>
                  <dd className="mt-1">
                    <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {formatPhone(settings.whatsappNumber)}
                    </a>
                  </dd>
                </div>
              ) : null}
              {settings.email ? (
                <div>
                  <dt className="text-xs tracking-wider text-muted uppercase">Email</dt>
                  <dd className="mt-1">
                    <a href={`mailto:${settings.email}`} className={linkClass}>
                      {settings.email}
                    </a>
                  </dd>
                </div>
              ) : null}
              {address.length > 0 ? (
                <div>
                  <dt className="text-xs tracking-wider text-muted uppercase">Adresse</dt>
                  <dd className="mt-1">
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
        </div>
      </div>

      <div className="shell flex items-end justify-between gap-6 border-t border-line pt-8 pb-10 text-sm">
        <div>
          <p className="text-brand-orange">© {siteConfig.name}</p>
          <p className="mt-2 tracking-wider uppercase">Agence événementielle — Kinshasa, RDC</p>
        </div>
        <a href="#" className="flex flex-col items-center gap-2 transition-colors hover:text-brand-orange">
          <ArrowUp className="animate-float size-4" />
          Haut de page
        </a>
      </div>

      <div className="border-t border-line">
        <p className="shell py-5 text-center text-xs text-muted">
          Site conçu et développé par{" "}
          {siteCredit.url ? (
            <a
              href={siteCredit.url}
              target="_blank"
              rel="noopener"
              className="text-foreground transition-colors hover:text-brand-orange"
            >
              {siteCredit.name}
            </a>
          ) : (
            <span className="text-foreground">{siteCredit.name}</span>
          )}
        </p>
      </div>
    </footer>
  );
}
