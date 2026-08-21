import type { Metadata } from "next";
import { HomePage } from "@/components/marketing/HomePage";
import { buildMetadata } from "@/lib/public-site";

export const metadata: Metadata = buildMetadata(
  "fa",
  "/",
  "Endoora | A new door to your English",
  "Endoora یک سیستم یادگیری انگلیسی فارسی‌محور برای زبان‌آموزان ایران است: ارزیابی، مسیر شخصی، تمرین، مدرس و پیشرفت در یک چرخه متصل.",
);

export default function Home() {
  return <HomePage locale="fa" />;
}
