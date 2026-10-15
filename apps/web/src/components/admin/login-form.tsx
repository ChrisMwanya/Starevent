"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminFetch } from "@/lib/admin/client";
import { inputClass, primaryButton } from "./ui";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSending(true);
    setError(null);
    try {
      await adminFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
      });
      router.replace("/admin");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Connexion impossible.");
      setSending(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <label className="block text-sm font-medium">
        Email
        <input name="email" type="email" required autoComplete="username" className={inputClass} />
      </label>
      <label className="block text-sm font-medium">
        Mot de passe
        <input name="password" type="password" required autoComplete="current-password" className={inputClass} />
      </label>
      <button type="submit" disabled={sending} className={`${primaryButton} w-full`}>
        {sending ? "Connexion…" : "Se connecter"}
      </button>
      <p role="alert" className="min-h-5 text-sm text-red-500">
        {error}
      </p>
    </form>
  );
}
