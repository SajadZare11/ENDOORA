import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHighSchoolLesson } from "@/lib/highschool";
import { HighSchoolLessonPlayer } from "@/components/highschool/HighSchoolLessonPlayer";

export const metadata: Metadata = {
  title: "پایه یازدهم - درس ۳: هنر و فرهنگ (Art and Culture) | ایندورا",
  description:
    "آموزش تعاملی و استقرایی درس سوم زبان پایه یازدهم (Vision 2) شامل Get Ready صنایع دستی و هنر، مکالمه خرید سوغاتی در اصفهان، ریدینگ هنر و جامعه، گرامر شرطی نوع اول و صفت‌های مفعولی (Past Participles)، لیسنینگ و لحن خیزان/افتان، و کارگاه مصدر با to (Infinitives).",
};

export default async function Grade11Lesson3Page() {
  const lesson = await getHighSchoolLesson(11, 3);
  if (!lesson) notFound();

  return <HighSchoolLessonPlayer lesson={lesson} />;
}
