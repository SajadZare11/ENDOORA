import type { Metadata } from "next";
import { ClassroomStudio } from "@/components/classroom/ClassroomStudio";

interface ClassroomRoomPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ role?: string }>;
}

export const metadata: Metadata = {
  title: "اتاق جلسه و کلاس زنده | ایندورا",
  description:
    "محیط اختصاصی کلاس آنلاین و استودیوی آموزشی ۱ به ۱ ایندورا همراه با وایت‌برد مشترک، شکار لحظه‌ای اشتباهات و اتصال به جعبه لایتنر.",
};

export default async function ClassroomRoomPage({
  params,
  searchParams,
}: ClassroomRoomPageProps) {
  const { id } = await params;
  const sParams = searchParams ? await searchParams : {};
  const initialRole = sParams?.role === "teacher" ? "teacher" : "learner";

  return <ClassroomStudio bookingId={id} initialRole={initialRole} />;
}
