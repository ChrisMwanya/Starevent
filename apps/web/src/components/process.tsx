import { processSteps } from "@/lib/site";
import { reveal } from "@/lib/motion";

/** Grille en quatre colonnes reprise du bloc « Benefits » du modèle. */
export function Process() {
  return (
    <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {processSteps.map((step, index) => (
        <li key={step.title} {...reveal(index, 120)} className="group border-t border-line pt-5">
          <span className="bg-eclat -mt-5 mb-5 block h-px w-0 transition-[width] duration-500 group-hover:w-full" />
          <p className="text-sm text-brand-orange tabular-nums">[{index + 1}]</p>
          <h3 className="mt-3 text-xl font-medium">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
