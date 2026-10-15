import type { Metadata } from "next";
import { ResourceManager } from "@/components/admin/resource-manager";

export const metadata: Metadata = { title: "Prestations" };

export default function ServicesAdminPage() {
  return <ResourceManager resource="services" />;
}
