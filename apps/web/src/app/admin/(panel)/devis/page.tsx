import type { Metadata } from "next";
import { QuotesManager } from "@/components/admin/quotes-manager";

export const metadata: Metadata = { title: "Demandes de devis" };

export default function QuotesPage() {
  return <QuotesManager />;
}
