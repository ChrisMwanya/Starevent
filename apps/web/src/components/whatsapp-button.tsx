import { getSettings } from "@/lib/content";
import { whatsappGreeting, whatsappUrl } from "@/lib/site";

export async function WhatsAppButton() {
  const { whatsappNumber } = await getSettings();
  const href = whatsappUrl(whatsappNumber, whatsappGreeting);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-4 bottom-4 rounded-full bg-[#128c7e] px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#0e7469]"
    >
      Discuter sur WhatsApp
    </a>
  );
}
