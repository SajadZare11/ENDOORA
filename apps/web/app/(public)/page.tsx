import type { Metadata } from "next";
import { HomePage } from "@/components/marketing/HomePage";
import { PublicShell } from "@/components/marketing/PublicShell";
import { buildMetadata } from "@/lib/public-site";

export const metadata: Metadata = buildMetadata(
  "fa",
  "/",
  "Endoora | ایندورا، انگلیسی راحت و هوشمند",
  "در اندورا با تعیین سطح رایگان، نقشه راه اختصاصی، کلاس‌های آنلاین خودمانی و تمرین‌های ۱۰ دقیقه‌ای با هوش مصنوعی، انگلیسی رو ساده و لذت‌بخش یاد بگیر.",
);

export default function Home() {
  return (
    <PublicShell locale="fa" currentPath="/">
      <HomePage locale="fa" />
    </PublicShell>
  );
}
