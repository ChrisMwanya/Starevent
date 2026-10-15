"use client";

import { useEffect, useRef, useState } from "react";
import { adminFetch, AdminApiError, type FieldErrors } from "@/lib/admin/client";
import { adminResources, type AdminResourceName, type FieldConfig } from "@/lib/admin/resources";
import { mediaUrl } from "@/lib/site";
import { AdminHeader } from "./admin-shell";
import { ImageField } from "./image-field";
import { dangerButton, inputClass, primaryButton, secondaryButton } from "./ui";

type Item = Record<string, unknown> & { id: number };
type Draft = Record<string, unknown> & { id?: number };

function emptyDraft(fields: FieldConfig[]): Draft {
  return Object.fromEntries(
    fields.map((field) => [
      field.name,
      field.type === "checkbox" ? field.name === "published" : field.type === "number" ? 0 : null,
    ]),
  );
}

/** Liste, création, modification et suppression d'un type de contenu. */
export function ResourceManager({ resource }: { resource: AdminResourceName }) {
  const config = adminResources[resource];
  const [items, setItems] = useState<Item[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  // Incrémenté après chaque modification pour relire la liste
  const [version, setVersion] = useState(0);
  const reload = () => setVersion((current) => current + 1);

  useEffect(() => {
    let active = true;
    adminFetch<Item[]>(`/content/${config.name}`)
      .then((data) => active && setItems(data))
      .catch((error) => active && setLoadError(error instanceof Error ? error.message : "Chargement impossible."));
    return () => {
      active = false;
    };
  }, [config.name, version]);

  function open(item: Draft) {
    setDraft(item);
    dialog.current?.showModal();
  }

  function close() {
    dialog.current?.close();
    setDraft(null);
  }

  async function remove(item: Item) {
    if (!window.confirm(`Supprimer « ${String(item[config.primary])} » ? Cette action est définitive.`)) return;
    await adminFetch(`/content/${config.name}/${item.id}`, { method: "DELETE" });
    reload();
  }

  return (
    <>
      <AdminHeader
        title={config.title}
        description={config.description}
        action={
          <button type="button" className={primaryButton} onClick={() => open(emptyDraft(config.fields))}>
            Ajouter une {config.singular}
          </button>
        }
      />

      {loadError ? <p className="text-sm text-red-500">{loadError}</p> : null}
      {items === null && !loadError ? <p className="text-sm text-muted">Chargement…</p> : null}
      {items?.length === 0 ? (
        <p className="rounded-md border border-dashed border-line p-10 text-center text-sm text-muted">
          Aucun élément pour l&apos;instant.
        </p>
      ) : null}

      {items && items.length > 0 ? (
        <ul className="divide-y divide-line rounded-md border border-line">
          {items.map((item) => {
            const image = config.image ? (item[config.image] as string | null) : null;
            const secondary = config.secondary?.(item);
            return (
              <li key={item.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 p-3">
                {config.image ? (
                  <div className="aspect-[4/3] w-20 shrink-0 overflow-hidden rounded bg-surface">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element -- vignette du back-office
                      <img src={mediaUrl(image)} alt="" className="size-full object-cover" />
                    ) : null}
                  </div>
                ) : null}
                <div className="min-w-[9rem] flex-1">
                  <p className="truncate font-medium">{String(item[config.primary])}</p>
                  {secondary ? <p className="truncate text-sm text-muted">{secondary}</p> : null}
                </div>
                {item.published === false ? (
                  <span className="hidden rounded-full border border-line px-2.5 py-1 text-xs text-muted sm:inline">
                    Brouillon
                  </span>
                ) : null}
                {item.featured === true ? (
                  <span className="hidden rounded-full bg-brand-orange/15 px-2.5 py-1 text-xs text-brand-orange sm:inline">
                    En avant
                  </span>
                ) : null}
                <div className="ml-auto flex shrink-0 gap-1">
                  <button type="button" className={secondaryButton} onClick={() => open({ ...item })}>
                    Modifier
                  </button>
                  <button type="button" className={dangerButton} onClick={() => remove(item)}>
                    Supprimer
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}

      <dialog
        ref={dialog}
        onClose={() => setDraft(null)}
        className="m-auto w-[min(48rem,calc(100vw-2rem))] rounded-lg border border-line bg-background p-0 text-foreground backdrop:bg-black/60"
      >
        {draft ? (
          <ResourceForm
            key={draft.id ?? "nouveau"}
            initial={draft}
            fields={config.fields}
            title={draft.id ? `Modifier la ${config.singular}` : `Nouvelle ${config.singular}`}
            onCancel={close}
            onSave={async (values) => {
              const path = draft.id ? `/content/${config.name}/${draft.id}` : `/content/${config.name}`;
              await adminFetch(path, { method: draft.id ? "PUT" : "POST", body: JSON.stringify(values) });
              close();
              reload();
            }}
          />
        ) : null}
      </dialog>
    </>
  );
}

function ResourceForm({
  initial,
  fields,
  title,
  onCancel,
  onSave,
}: {
  initial: Draft;
  fields: FieldConfig[];
  title: string;
  onCancel: () => void;
  onSave: (values: Draft) => Promise<void>;
}) {
  const [values, setValues] = useState<Draft>(initial);
  const [errors, setErrors] = useState<{ message: string | null; fields: FieldErrors }>({ message: null, fields: {} });
  const [saving, setSaving] = useState(false);

  const set = (name: string, value: unknown) => setValues((current) => ({ ...current, [name]: value }));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setErrors({ message: null, fields: {} });
    try {
      const payload = { ...values };
      delete payload.id;
      await onSave(payload);
    } catch (error) {
      if (error instanceof AdminApiError) setErrors({ message: error.message, fields: error.fields });
      else setErrors({ message: "Enregistrement impossible.", fields: {} });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="flex items-center justify-between border-b border-line px-6 py-4">
        <h2 className="text-lg font-medium">{title}</h2>
        <button type="button" onClick={onCancel} aria-label="Fermer" className="text-2xl leading-none text-muted">
          ×
        </button>
      </div>

      <div className="grid max-h-[70vh] gap-5 overflow-y-auto px-6 py-6 sm:grid-cols-2">
        {fields.map((field) => (
          <FieldInput
            key={field.name}
            field={field}
            value={values[field.name]}
            error={errors.fields[field.name]?.[0]}
            onChange={(value) => set(field.name, value)}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-line px-6 py-4">
        {errors.message ? <p className="mr-auto text-sm text-red-500">{errors.message}</p> : null}
        <button type="button" className={secondaryButton} onClick={onCancel}>
          Annuler
        </button>
        <button type="submit" className={primaryButton} disabled={saving}>
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}

function FieldInput({
  field,
  value,
  error,
  onChange,
}: {
  field: FieldConfig;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
}) {
  const id = `champ-${field.name}`;
  const wrapper = field.wide || field.type === "textarea" || field.type === "image" ? "sm:col-span-2" : "";
  const text = (value as string | null) ?? "";

  if (field.type === "checkbox") {
    return (
      <label className={`flex items-center gap-3 self-end py-2 text-sm ${wrapper}`}>
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          className="grid size-5 shrink-0 cursor-pointer appearance-none place-content-center rounded border border-line bg-background after:hidden after:text-xs after:leading-none after:text-white after:content-['✓'] checked:border-transparent checked:bg-eclat checked:after:block focus-visible:outline-2 focus-visible:outline-brand-orange"
        />
        {field.label}
      </label>
    );
  }

  let control: React.ReactNode;
  switch (field.type) {
    case "textarea":
      control = (
        <textarea
          id={id}
          rows={4}
          value={text}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
        />
      );
      break;
    case "select":
      control = (
        <select id={id} value={text} onChange={(event) => onChange(event.target.value)} className={inputClass}>
          <option value="" disabled>
            Choisir
          </option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
      break;
    case "image":
      control = <ImageField value={(value as string | null) ?? null} onChange={onChange} />;
      break;
    case "number":
      control = (
        <input
          id={id}
          type="number"
          min={0}
          value={(value as number | null) ?? 0}
          onChange={(event) => onChange(event.target.valueAsNumber || 0)}
          className={inputClass}
        />
      );
      break;
    default:
      control = (
        <input
          id={id}
          type={field.type}
          value={text}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
        />
      );
  }

  return (
    <div className={wrapper}>
      <label htmlFor={field.type === "image" ? undefined : id} className="text-sm font-medium">
        {field.label}
        {field.required ? " *" : null}
      </label>
      {control}
      {field.help ? <p className="mt-1 text-xs text-muted">{field.help}</p> : null}
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
