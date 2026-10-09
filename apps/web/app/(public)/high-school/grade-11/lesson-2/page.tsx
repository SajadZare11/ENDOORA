import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHighSchoolLesson } from "@/lib/highschool";
import { HighSchoolLessonPlayer } from "@/components/highschool/HighSchoolLessonPlayer";

export const metadata: Metadata = {
  title: "پایه یازدهم - درس ۲: سبک زندگی سالم (A Healthy Lifestyle) | ایندورا",
  description:
    "آموزش تعاملی و استقرایی درس دوم زبان پایه یازدهم (Vision 2) شامل Get Ready عادات سلامت، مکالمه کوهنوردی دربند، ریدینگ زندگی سالم‌تر، گرامر حال کامل و افعال عبارتی، استرس اضطراری و کارگاه اسم مصدر (Gerunds).",
};

export default async function Grade11Lesson2Page() {
  const lesson = await getHighSchoolLesson(11, 2);
  if (!lesson) notFound();

  return <HighSchoolLessonPlayer lesson={lesson} />;
}
