import type { Metadata } from "next";
import { buildMetadata } from "../../lib/public-site";
import { FeaturesCatalog } from "../../components/marketing/FeaturesCatalog";

export const metadata: Metadata = buildMetadata(
  "fa",
  "/features",
  "امکانات و قابلیت‌های Endoora",
  "آشنایی با قابلیت‌های نوآورانه آموزشی ایندورا: مدل یادگیرنده Learner Twin، ماموریت روزانه، ژنوم اشتباهات، منتور رایتینگ، مکالمه صوتی و شبیه‌ساز آیلتس.",
);

export default function FeaturesPage() {
  return <FeaturesCatalog locale="fa" />;
}
