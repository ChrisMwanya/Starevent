"use client";

import { useEffect, useState } from "react";
import { adminFetch, AdminApiError, type FieldErrors } from "@/lib/admin/client";
import type { Settings } from "@/lib/content";
import { AdminHeader } from "./admin-shell";
import { inputClass, primaryButton } from "./ui";

const fields: { name: keyof Settings; label: string; type?: string; help?: string; multiline?: boolean }[] = [
  { name: "phone", label: "Téléphone", help: "Tel qu'affiché, par exemple « +243 810 000 000 »." },
  {
    name: "whatsappNumber",
    label: "Numéro WhatsApp",
    help: "Format international sans « + » ni espaces, par exemple 243810000000. Vide : pas de bouton WhatsApp.",
  },
  { name: "email", label: "Email", type: "email" },
  { name: "address", label: "Adresse", multiline: true, help: "Une ligne par retour à la ligne." },
  { name: "instagramUrl", label: "Instagram", type: "url" },
  { name: "facebookUrl", label: "Facebook", type: "url" },
  { name: "linkedinUrl", label: "LinkedIn", type: "url" },
  { name: "tiktokUrl", label: "TikTok", type: "url" },
];

/** Coordonnées et réseaux sociaux affichés dans le pied de page, la page Contact et le haut de page. */
export function SettingsForm() {
  const [values, setValues] = useState<Settings | null>(null);
  const [state, setState] = useState<{ saving: boolean; message: string | null; errors: FieldErrors }>({
    saving: false,
    message: null,
    errors: {},
  });

  useEffect(() => {
    adminFetch<Settings>("/settings").then(setValues);
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setState({ saving: true, message: null, errors: {} });
    try {
      setValues(await adminFetch<Settings>("/settings", { method: "PUT", body: JSON.stringify(values) }));
      setState({ saving: false, message: "Coordonnées enregistrées.", errors: {} });
    } catch (error) {
      setState({
        saving: false,
        message: error instanceof Error ? error.message : "Enregistrement impossible.",
        errors: error instanceof AdminApiError ? error.fields : {},
      });
    }
  }

  return (
    <>
      <AdminHeader
        title="Coordonnées"
        description="Téléphone, WhatsApp, adresse et réseaux sociaux. Un champ vide n'est pas affiché sur le site."
      />
      {values === null ? (
        <p className="text-sm text-muted">Chargement…</p>
      ) : (
        <form onSubmit={submit} className="grid max-w-3xl gap-5 sm:grid-cols-2">
          {fields.map((field) => {
            const value = values[field.name] ?? "";
            const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
              setValues({ ...values, [field.name]: event.target.value });
            return (
              <label key={field.name} className={`block text-sm font-medium ${field.multiline ? "sm:col-span-2" : ""}`}>
                {field.label}
                {field.multiline ? (
                  <textarea rows={3} value={value} onChange={onChange} className={inputClass} />
                ) : (
                  <input type={field.type ?? "text"} value={value} onChange={onChange} className={inputClass} />
                )}
                {field.help ? <span className="mt-1 block text-xs font-normal text-muted">{field.help}</span> : null}
                {state.errors[field.name] ? (
                  <span className="mt-1 block text-xs font-normal text-red-500">{state.errors[field.name]?.[0]}</span>
                ) : null}
              </label>
            );
          })}
          <div className="flex items-center gap-4 sm:col-span-2">
            <button type="submit" className={primaryButton} disabled={state.saving}>
              {state.saving ? "Enregistrement…" : "Enregistrer"}
            </button>
            {state.message ? (
              <p role="status" className="text-sm text-muted">
                {state.message}
              </p>
            ) : null}
          </div>
        </form>
      )}
    </>
  );
}
