"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { adminFetch } from "@/lib/admin/client";

type Admin = { id: number; email: string; name: string };

const links = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/devis", label: "Demandes de devis" },
  { href: "/admin/prestations", label: "Prestations" },
  { href: "/admin/realisations", label: "Réalisations" },
  { href: "/admin/temoignages", label: "Témoignages" },
  { href: "/admin/equipe", label: "Équipe" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/coordonnees", label: "Coordonnées" },
];

/**
 * Cadre du back-office. Chaque page lit ses données auprès de l'API, qui refuse les requêtes sans session :
 * `adminFetch` renvoie alors vers la connexion. La page peut donc s'afficher sans attendre cette vérification.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    // Sans session, `adminFetch` renvoie vers la page de connexion
    adminFetch<Admin>("/auth/me")
      .then(setAdmin)
      .catch(() => {});
  }, []);

  async function logout() {
    await adminFetch("/auth/logout", { method: "POST" }).catch(() => {});
    router.replace("/admin/login");
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="border-b border-line bg-surface lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-b-0">
        <div className="flex h-full flex-col gap-6 p-5">
          <div className="flex items-center justify-between gap-3">
            <Link href="/admin" className="font-semibold tracking-wide">
              Star Event <span className="text-brand-orange">· Admin</span>
            </Link>
            <ThemeToggle />
          </div>
          <nav aria-label="Back-office" className="-mx-2 flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {links.map((link) => {
              const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-md px-3 py-2 text-sm whitespace-nowrap transition-colors ${
                    active ? "bg-foreground text-background" : "hover:bg-background"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto hidden space-y-3 text-sm lg:block">
            <a href="/" target="_blank" className="block text-muted hover:text-foreground">
              Voir le site ↗
            </a>
            {admin ? (
              <p className="truncate text-muted" title={admin.email}>
                {admin.name}
              </p>
            ) : null}
            <button type="button" onClick={logout} className="text-brand-orange hover:underline">
              Se déconnecter
            </button>
          </div>
        </div>
      </aside>
      <main className="min-w-0 p-5 md:p-10">
        {children}
        <button type="button" onClick={logout} className="mt-12 text-sm text-brand-orange hover:underline lg:hidden">
          Se déconnecter
        </button>
      </main>
    </div>
  );
}

export function AdminHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-medium tracking-tight">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
