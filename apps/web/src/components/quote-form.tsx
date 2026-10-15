"use client";

import { useState } from "react";
import { budgetRanges, eventTypes, siteConfig } from "@/lib/site";

type FieldErrors = Record<string, string[] | undefined>;

type Status =
  | { state: "idle" | "sending" }
  | { state: "sent"; whatsappUrl: string | null }
  | { state: "error"; message: string; fields?: FieldErrors };

const fieldClass =
  "mt-2 w-full rounded-md bg-surface px-4 py-3.5 text-foreground placeholder:text-foreground/35 focus:outline-2 focus:outline-brand-orange";

function Field({
  label,
  required = false,
  invalid = false,
  children,
}: {
  label: string;
  required?: boolean;
  invalid?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      {required ? " *" : null}
      {children}
      {invalid ? <span className="mt-1.5 block text-xs text-brand-orange">Vérifiez ce champ.</span> : null}
    </label>
  );
}

export function QuoteForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const fields = status.state === "error" ? (status.fields ?? {}) : {};

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    // Les champs facultatifs laissés vides ne sont pas envoyés
    const payload = Object.fromEntries(Array.from(new FormData(form)).filter(([, value]) => value !== ""));

    setStatus({ state: "sending" });
    try {
      const response = await fetch(`${siteConfig.apiUrl}/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json().catch(() => ({}));

      if (response.status === 201) {
        form.reset();
        setStatus({ state: "sent", whatsappUrl: body.whatsappUrl ?? null });
        return;
      }
      setStatus({
        state: "error",
        message:
          response.status === 400
            ? "Certains champs sont incomplets ou invalides."
            : (body.error ?? "L'envoi a échoué. Merci de réessayer dans un instant."),
        fields: body.fields,
      });
    } catch {
      setStatus({
        state: "error",
        message: "Impossible de joindre le serveur. Vérifiez votre connexion et réessayez.",
      });
    }
  }

  if (status.state === "sent") {
    return (
      <div role="status" className="rounded-md bg-surface p-8">
        <h2 className="text-2xl font-medium">Votre demande est bien envoyée</h2>
        <p className="mt-3 text-sm text-foreground/85">
          Notre équipe revient vers vous avec une proposition adaptée à votre événement.
        </p>
        {status.whatsappUrl ? (
          <a
            href={status.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-eclat mt-6 inline-block rounded-md px-6 py-3 text-sm font-semibold text-white"
          >
            Poursuivre sur WhatsApp
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
      <Field label="Nom complet" required invalid={Boolean(fields.fullName)}>
        <input
          name="fullName"
          required
          minLength={2}
          maxLength={120}
          autoComplete="name"
          placeholder="Votre nom"
          className={fieldClass}
        />
      </Field>
      <Field label="Téléphone" required invalid={Boolean(fields.phone)}>
        <input
          name="phone"
          type="tel"
          required
          minLength={6}
          maxLength={30}
          autoComplete="tel"
          placeholder="+243 …"
          className={fieldClass}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Email" required invalid={Boolean(fields.email)}>
          <input
            name="email"
            type="email"
            required
            maxLength={160}
            autoComplete="email"
            placeholder="vous@exemple.com"
            className={fieldClass}
          />
        </Field>
      </div>
      <Field label="Type d'événement" required invalid={Boolean(fields.eventType)}>
        <select name="eventType" required defaultValue="" className={fieldClass}>
          <option value="" disabled>
            Choisir
          </option>
          {eventTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
          <option value="autre">Autre événement</option>
        </select>
      </Field>
      <Field label="Date envisagée" invalid={Boolean(fields.eventDate)}>
        <input name="eventDate" type="date" className={fieldClass} />
      </Field>
      <Field label="Nombre d'invités" invalid={Boolean(fields.guestCount)}>
        <input
          name="guestCount"
          type="number"
          min={1}
          max={100000}
          inputMode="numeric"
          placeholder="150"
          className={fieldClass}
        />
      </Field>
      <Field label="Budget indicatif" invalid={Boolean(fields.budgetRange)}>
        <select name="budgetRange" defaultValue="a-definir" className={fieldClass}>
          {budgetRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field label="Votre projet" required invalid={Boolean(fields.message)}>
          <textarea
            name="message"
            required
            minLength={10}
            maxLength={5000}
            rows={5}
            placeholder="Lieu, ambiance, attentes…"
            className={fieldClass}
          />
        </Field>
      </div>

      {/* Champ piège anti-spam : doit rester vide */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          Site web
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status.state === "sending"}
          className="bg-eclat w-full rounded-md px-6 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {status.state === "sending" ? "Envoi en cours…" : "Envoyer ma demande"}
        </button>
        <p role="alert" className="mt-3 min-h-5 text-sm text-brand-orange">
          {status.state === "error" ? status.message : null}
        </p>
      </div>
    </form>
  );
}
