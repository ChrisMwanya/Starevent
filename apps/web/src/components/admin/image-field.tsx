"use client";

import { useRef, useState } from "react";
import { uploadImage } from "@/lib/admin/client";
import { secondaryButton } from "./ui";

/** Choix d'une image : envoi immédiat à l'API, puis l'adresse renvoyée est enregistrée avec le formulaire. */
export function ImageField({ value, onChange }: { value: string | null; onChange: (url: string | null) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<{ uploading: boolean; error: string | null }>({ uploading: false, error: null });

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setState({ uploading: true, error: null });
    try {
      const { url } = await uploadImage(file);
      onChange(url);
      setState({ uploading: false, error: null });
    } catch (error) {
      setState({ uploading: false, error: error instanceof Error ? error.message : "Envoi impossible." });
    } finally {
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-4">
      <div className="grid aspect-[4/3] w-36 place-items-center overflow-hidden rounded-md border border-line bg-background">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element -- aperçu d'une image tout juste envoyée
          <img src={value} alt="" className="size-full object-cover" />
        ) : (
          <span className="text-xs text-muted">Aucune image</span>
        )}
      </div>
      <div className="flex flex-col items-start gap-2">
        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="sr-only"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
        <button
          type="button"
          disabled={state.uploading}
          onClick={() => input.current?.click()}
          className={secondaryButton}
        >
          {state.uploading ? "Envoi…" : value ? "Changer l'image" : "Choisir une image"}
        </button>
        {value ? (
          <button type="button" onClick={() => onChange(null)} className="text-xs text-muted hover:text-foreground">
            Retirer l&apos;image
          </button>
        ) : null}
        <p className="text-xs text-muted">JPEG, PNG, WebP ou AVIF, 8 Mo maximum.</p>
        {state.error ? <p className="text-xs text-red-500">{state.error}</p> : null}
      </div>
    </div>
  );
}
