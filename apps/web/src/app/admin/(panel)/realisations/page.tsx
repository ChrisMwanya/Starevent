import type { Metadata } from "next";
import { ResourceManager } from "@/components/admin/resource-manager";

export const metadata: Metadata = { title: "Réalisations" };

export default function ProjectsAdminPage() {
  return <ResourceManager resource="projects" />;
}
