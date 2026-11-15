import type { Metadata } from "next";
import { PublicShell } from "../../components/marketing/PublicShell";
import { PricingPageClient } from "./PricingPageClient";
import { buildMetadata } from "../../lib/public-site";

export const metadata: Metadata = buildMetadata(
  "fa",
  "/pricing",
  "طرح‌ها و تعرفه‌های اشتراک ایندورا | پلن رایگان و طلایی",
  "مشاهده تعرفه پلن رایگان و پلن‌های طلایی ۱ ماهه، ۳ ماهه و ۶ ماهه ایندورا با دسترسی کامل به زبان دبیرستان، امتحانات نهایی تمرین تا ۲۰، دوره‌های ویدیویی، مهارت‌ها و آیلتس."
);

export default function PricingPage() {
  return (
    <PublicShell locale="fa" currentPath="/pricing">
      <PricingPageClient />
    </PublicShell>
  );
}
