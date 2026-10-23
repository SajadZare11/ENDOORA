import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicShell } from "@/components/marketing/PublicShell";
import { IELTSClinicRoom } from "@/components/ielts/clinics/IELTSClinicRoom";
import { ALL_IELTS_CLINICS, getClinicById } from "@/data/ielts/clinics";

interface ClinicPageProps {
  params: Promise<{ clinicId: string }>;
}

export async function generateStaticParams() {
  return ALL_IELTS_CLINICS.map((clinic) => ({
    clinicId: clinic.id,
  }));
}

export async function generateMetadata({ params }: ClinicPageProps): Promise<Metadata> {
  const { clinicId } = await params;
  const clinic = getClinicById(clinicId);

  if (!clinic) {
    return {
      title: "کلینیک آیلتس پیدا نشد | ایندورا",
    };
  }

  return {
    title: `${clinic.titleFa} | کلینیک‌های آیلتس ایندورا`,
    description: clinic.hurdleSummaryFa,
  };
}

export default async function ClinicDetailPage({ params }: ClinicPageProps) {
  const { clinicId } = await params;
  const clinic = getClinicById(clinicId);

  if (!clinic) {
    notFound();
  }

  return (
    <PublicShell locale="fa" currentPath={`/ielts/clinics/${clinic.id}`}>
      <main style={{ minHeight: "85vh", background: "#f8fafc" }}>
        <IELTSClinicRoom clinic={clinic} />
      </main>
    </PublicShell>
  );
}
