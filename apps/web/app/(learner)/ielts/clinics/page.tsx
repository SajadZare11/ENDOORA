import type { Metadata } from "next";
import { PublicShell } from "@/components/marketing/PublicShell";
import { IELTSClinicsHub } from "@/components/ielts/clinics/IELTSClinicsHub";

export const metadata: Metadata = {
  title: "کلینیک‌های استراتژی و تله‌زدایی آیلتس | ایندورا",
  description:
    "مجموعه جامع کلینیک‌های استراتژی، تله‌زدایی کمبریج، و تمرین‌های تعاملی هدفمند برای کسب نمره بند ۷ و ۸ در آزمون آیلتس.",
};

export default function IELTSClinicsPage() {
  return (
    <PublicShell locale="fa" currentPath="/ielts/clinics">
      <main style={{ minHeight: "80vh", background: "#f8fafc" }}>
        <IELTSClinicsHub />
      </main>
    </PublicShell>
  );
}
