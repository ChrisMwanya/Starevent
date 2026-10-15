"use client";

import { useLayoutEffect } from "react";
import { MoonIcon, SunIcon } from "@/components/icons";
import { resolveTheme, THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

/** Bascule clair / sombre ; les deux icônes sont rendues et le CSS affiche la bonne, sans écart d'hydratation. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  // En développement, React retire l'attribut posé par le script lors du remontage du mode strict
  useLayoutEffect(() => {
    applyTheme(resolveTheme());

    // Sans choix enregistré, le site suit les changements de préférence du système
    const media = matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      try {
        if (localStorage.getItem(THEME_STORAGE_KEY)) return;
      } catch {}
      applyTheme(media.matches ? "light" : "dark");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  function toggle() {
    const next: Theme = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Changer de thème (clair ou sombre)"
      title="Changer de thème"
      className={`grid size-9 shrink-0 place-items-center rounded-full border border-line transition-colors hover:border-brand-orange hover:text-brand-orange ${className}`}
    >
      <SunIcon className="size-4 light:hidden" />
      <MoonIcon className="hidden size-4 light:block" />
    </button>
  );
}
