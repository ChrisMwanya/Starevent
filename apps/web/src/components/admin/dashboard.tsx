"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin/client";
import { AdminHeader } from "./admin-shell";

type Stats = Record<"services" | "projects" | "testimonials" | "team" | "clients" | "newQuotes", number>;

const cards: { key: keyof Stats; label: string; href: string }[] = [
  { key: "newQuotes", label: "Nouvelles demandes de devis", href: "/admin/devis" },
  { key: "services", label: "Prestations", href: "/admin/prestations" },
  { key: "projects", label: "Réalisations", href: "/admin/realisations" },
  { key: "testimonials", label: "Témoignages", href: "/admin/temoignages" },
  { key: "team", label: "Membres de l'équipe", href: "/admin/equipe" },
  { key: "clients", label: "Clients", href: "/admin/clients" },
];

export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    adminFetch<Stats>("/stats").then(setStats);
  }, []);

  return (
    <>
      <AdminHeader
        title="Tableau de bord"
        description="Gérez le contenu du site Star Event et suivez les demandes de devis."
      />
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <li key={card.key}>
            <Link
              href={card.href}
              className={`block rounded-lg border p-6 transition-colors ${
                card.key === "newQuotes"
                  ? "bg-eclat border-transparent text-white"
                  : "border-line hover:border-foreground"
              }`}
            >
              <p className="text-4xl font-medium tabular-nums">{stats ? stats[card.key] : "—"}</p>
              <p className={`mt-2 text-sm ${card.key === "newQuotes" ? "text-white/85" : "text-muted"}`}>
                {card.label}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
