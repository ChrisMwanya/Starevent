export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

/** Choix enregistré, sinon préférence du système (même logique que `themeInitScript`). */
export function resolveTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {}
  return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

/** Script exécuté pendant l'analyse du HTML, avant le premier affichage, pour éviter un flash de thème. */
export const themeInitScript = `(function(){var t;try{t=localStorage.getItem("${THEME_STORAGE_KEY}")}catch(e){}if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.setAttribute("data-theme",t)})()`;
