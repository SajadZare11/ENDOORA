import type { Metadata } from "next";
import { HomePage } from "@/components/marketing/HomePage";
import { PublicShell } from "@/components/marketing/PublicShell";
import { buildMetadata } from "@/lib/public-site";

export const metadata: Metadata = buildMetadata(
  "fa",
  "/",
  "Endoora | مسیر شخصی یادگیری انگلیسی",
  "Endoora یک سیستم یادگیری انگلیسی فارسی‌محور برای زبان‌آموزان ایران است: ارزیابی، مسیر شخصی، تمرین، مدرس و پیشرفت در یک چرخه متصل.",
);

export default function Home() {
  return (
    <PublicShell locale="fa" currentPath="/">
      <HomePage locale="fa" />
    </PublicShell>
  );
}
