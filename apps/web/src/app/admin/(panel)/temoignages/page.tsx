import type { Metadata } from "next";
import { ResourceManager } from "@/components/admin/resource-manager";

export const metadata: Metadata = { title: "Témoignages" };

export default function TestimonialsAdminPage() {
  return <ResourceManager resource="testimonials" />;
}
