import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHighSchoolLesson } from "@/lib/highschool";
import { HighSchoolLessonPlayer } from "@/components/highschool/HighSchoolLessonPlayer";

export const metadata: Metadata = {
  title: "پایه دهم - درس ۲: شگفتی‌های خلقت (Wonders of Creation) | ایندورا",
  description:
    "آموزش تعاملی و استقرایی درس دوم کتاب انگلیسی پایه دهم (Vision 1) شامل Get Ready، مکالمه رصدخانه، واژگان، ریدینگ مایع شگفت‌انگیز، گرامر صفت‌ها، لیسنینگ و نگارش.",
};

export default async function Grade10Lesson2Page() {
  const lesson = await getHighSchoolLesson(10, 2);
  if (!lesson) notFound();

  return <HighSchoolLessonPlayer lesson={lesson} />;
}
