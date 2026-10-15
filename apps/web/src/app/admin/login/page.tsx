import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Connexion" };

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="w-full max-w-sm rounded-lg border border-line bg-surface p-8">
        <p className="text-sm font-medium tracking-wide text-brand-orange uppercase">Star Event</p>
        <h1 className="mt-2 mb-8 text-2xl font-medium">Connexion au back-office</h1>
        <LoginForm />
      </div>
    </main>
  );
}
