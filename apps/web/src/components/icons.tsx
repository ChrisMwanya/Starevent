type IconProps = { className?: string };

/** L'éclat à quatre branches du logo, utilisé comme puce et motif décoratif. */
export function Sparkle({ className }: IconProps) {
  return (
    <svg viewBox="44 26 28 48" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M58 26Q60.8 45.2 72 50Q60.8 54.8 58 74Q55.2 54.8 44 50Q55.2 45.2 58 26Z" />
    </svg>
  );
}

export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden="true"
      className={className}
    >
      <path d="M3.5 12.5l9-9M5.5 3.5h7v7" />
    </svg>
  );
}

export function ArrowUp({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden="true"
      className={className}
    >
      <path d="M8 14V2M3 7l5-5 5 5" />
    </svg>
  );
}

const socialPaths: Record<string, React.ReactNode> = {
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </>
  ),
  Facebook: (
    <path d="M14 21v-8h3l.5-3.5H14V7.8c0-1 .3-1.8 1.8-1.8h1.8V3a24 24 0 0 0-2.6-.1C12.4 2.9 10.6 4.5 10.6 7.4v2.1H7.5V13h3.1v8" />
  ),
  LinkedIn: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7.5 10.5V17M7.5 7.2v.1M11.5 17v-6.5M11.5 13.5c0-1.7 1-3 2.6-3s2.4 1.1 2.4 3V17" />
    </>
  ),
  TikTok: <path d="M14 3v12.2a3.3 3.3 0 1 1-3.3-3.3M14 3c.4 2.5 2 4.2 4.8 4.4" />,
};

export function SocialIcon({ name, className }: IconProps & { name: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {socialPaths[name]}
    </svg>
  );
}

export function SunIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function MoonIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
    </svg>
  );
}
