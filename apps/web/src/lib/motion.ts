import type { CSSProperties } from "react";

/** Attributs d'apparition au défilement, décalés selon la position dans une liste. */
export function reveal(index = 0, step = 90) {
  return {
    "data-reveal": "",
    // `RevealObserver` peut marquer l'élément avant que React ait fini de l'hydrater
    suppressHydrationWarning: true,
    style: { "--reveal-delay": `${index * step}ms` } as CSSProperties,
  };
}

/** Délai d'une animation d'entrée jouée au chargement de la page. */
export function entranceDelay(ms: number): CSSProperties {
  return { animationDelay: `${ms}ms` };
}
