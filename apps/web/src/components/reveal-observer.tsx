"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Révèle les éléments `[data-reveal]` quand ils entrent dans l'écran (voir globals.css). */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -40px 0px" },
    );

    for (const element of document.querySelectorAll("[data-reveal]:not([data-revealed])")) {
      observer.observe(element);
    }
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
