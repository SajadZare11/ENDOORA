import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHighSchoolLesson } from "@/lib/highschool";
import { HighSchoolLessonPlayer } from "@/components/highschool/HighSchoolLessonPlayer";

export const metadata: Metadata = {
  title: "پایه دهم - درس ۳: ارزش علم و دانش (The Value of Knowledge) | ایندورا",
  description:
    "آموزش تعاملی و استقرایی درس سوم کتاب انگلیسی پایه دهم (Vision 1) شامل Get Ready اختراعات، مکالمه دانشمندان ایرانی، واژگان جدید، ریدینگ توماس ادیسون، گرامر گذشته استمراری و ضمایر انعکاسی، لیسنینگ و استرس تاکیدی و نگارش افعال کنشی و حالتی.",
};

export default async function Grade10Lesson3Page() {
  const lesson = await getHighSchoolLesson(10, 3);
  if (!lesson) notFound();

  return <HighSchoolLessonPlayer lesson={lesson} />;
}
