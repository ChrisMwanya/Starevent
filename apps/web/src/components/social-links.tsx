import { SocialIcon } from "@/components/icons";
import { getSettings } from "@/lib/content";
import { socialLinks } from "@/lib/site";

const itemClass =
  "grid size-11 place-items-center rounded-full border border-line transition-colors hover:border-brand-orange hover:bg-brand-orange hover:text-white";

/** Icônes des réseaux sociaux ; un réseau sans lien s'affiche sans être cliquable. */
export async function SocialLinks({ className = "" }: { className?: string }) {
  const settings = await getSettings();

  return (
    <ul aria-label="Réseaux sociaux" className={`flex gap-3 ${className}`}>
      {socialLinks(settings).map((social) => (
        <li key={social.name}>
          {social.url ? (
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className={itemClass}
            >
              <SocialIcon name={social.name} className="size-5" />
            </a>
          ) : (
            <span title={`${social.name} (lien à venir)`} className={`${itemClass} cursor-default`}>
              <SocialIcon name={social.name} className="size-5" />
              <span className="sr-only">{social.name}</span>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
