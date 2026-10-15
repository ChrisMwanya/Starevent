"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin/client";
import { quoteStatuses } from "@/lib/admin/resources";
import { budgetRanges, eventTypeLabel } from "@/lib/site";
import { AdminHeader } from "./admin-shell";
import { dangerButton, inputClass, primaryButton } from "./ui";

type Quote = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string | null;
  guestCount: number | null;
  budgetRange: string;
  message: string;
  status: string;
  notes: string | null;
  createdAt: string;
};

const dateTime = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" });

/** Demandes reçues par le formulaire de contact, classées par statut. */
export function QuotesManager() {
  const [status, setStatus] = useState<string>("nouveau");
  const [quotes, setQuotes] = useState<Quote[] | null>(null);

  const [version, setVersion] = useState(0);
  const reload = () => setVersion((current) => current + 1);

  useEffect(() => {
    let active = true;
    adminFetch<Quote[]>(`/quotes?status=${status}`).then((data) => active && setQuotes(data));
    return () => {
      active = false;
    };
  }, [status, version]);

  function selectStatus(value: string) {
    setQuotes(null);
    setStatus(value);
  }

  return (
    <>
      <AdminHeader title="Demandes de devis" description="Les demandes envoyées depuis la page Contact du site." />

      <div role="tablist" className="mb-6 flex flex-wrap gap-2">
        {quoteStatuses.map((option) => (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={status === option.value}
            onClick={() => selectStatus(option.value)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              status === option.value
                ? "border-foreground bg-foreground text-background"
                : "border-line hover:border-foreground"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {quotes === null ? <p className="text-sm text-muted">Chargement…</p> : null}
      {quotes?.length === 0 ? (
        <p className="rounded-md border border-dashed border-line p-10 text-center text-sm text-muted">
          Aucune demande dans cette catégorie.
        </p>
      ) : null}
      <ul className="space-y-3">
        {quotes?.map((quote) => (
          <QuoteItem key={quote.id} quote={quote} onChange={reload} />
        ))}
      </ul>
    </>
  );
}

function QuoteItem({ quote, onChange }: { quote: Quote; onChange: () => void }) {
  const [status, setStatus] = useState(quote.status);
  const [notes, setNotes] = useState(quote.notes ?? "");
  const [saving, setSaving] = useState(false);
  const budget = budgetRanges.find((range) => range.value === quote.budgetRange)?.label ?? quote.budgetRange;

  async function save() {
    setSaving(true);
    try {
      await adminFetch(`/quotes/${quote.id}`, { method: "PATCH", body: JSON.stringify({ status, notes }) });
      onChange();
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!window.confirm(`Supprimer la demande de ${quote.fullName} ? Cette action est définitive.`)) return;
    await adminFetch(`/quotes/${quote.id}`, { method: "DELETE" });
    onChange();
  }

  return (
    <li>
      <details className="group rounded-md border border-line">
        <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-1 p-4 [&::-webkit-details-marker]:hidden">
          <span className="font-medium">{quote.fullName}</span>
          <span className="text-sm text-muted">{eventTypeLabel(quote.eventType)}</span>
          <span className="ml-auto text-sm text-muted">{dateTime.format(new Date(quote.createdAt))}</span>
        </summary>
        <div className="grid gap-6 border-t border-line p-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="space-y-4 text-sm">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
              <Detail label="Email">
                <a href={`mailto:${quote.email}`} className="text-brand-orange hover:underline">
                  {quote.email}
                </a>
              </Detail>
              <Detail label="Téléphone">
                <a href={`tel:${quote.phone.replace(/[^\d+]/g, "")}`} className="text-brand-orange hover:underline">
                  {quote.phone}
                </a>
              </Detail>
              <Detail label="Date souhaitée">{quote.eventDate ?? "Non précisée"}</Detail>
              <Detail label="Invités">{quote.guestCount ?? "Non précisé"}</Detail>
              <Detail label="Budget">{budget}</Detail>
            </dl>
            <p className="rounded-md bg-surface p-4 whitespace-pre-line">{quote.message}</p>
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-medium">
              Statut
              <select value={status} onChange={(event) => setStatus(event.target.value)} className={inputClass}>
                {quoteStatuses.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label.replace(/s$/, "")}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium">
              Notes internes
              <textarea
                rows={4}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className={inputClass}
              />
            </label>
            <div className="flex items-center justify-between gap-3">
              <button type="button" className={dangerButton} onClick={remove}>
                Supprimer
              </button>
              <button type="button" className={primaryButton} onClick={save} disabled={saving}>
                {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      </details>
    </li>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs tracking-wider text-muted uppercase">{label}</dt>
      <dd className="mt-0.5">{children}</dd>
    </div>
  );
}
