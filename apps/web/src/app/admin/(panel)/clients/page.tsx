import type { Metadata } from "next";
import { ResourceManager } from "@/components/admin/resource-manager";

export const metadata: Metadata = { title: "Clients" };

export default function ClientsAdminPage() {
  return <ResourceManager resource="clients" />;
}
