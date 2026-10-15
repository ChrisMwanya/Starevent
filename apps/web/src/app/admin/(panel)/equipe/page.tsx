import type { Metadata } from "next";
import { ResourceManager } from "@/components/admin/resource-manager";

export const metadata: Metadata = { title: "Équipe" };

export default function TeamAdminPage() {
  return <ResourceManager resource="team" />;
}
