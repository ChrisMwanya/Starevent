import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Back-office", template: "%s | Back-office Star Event" },
  // Le back-office ne doit pas apparaître dans les moteurs de recherche
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
