import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHighSchoolLesson } from "@/lib/highschool";
import { HighSchoolLessonPlayer } from "@/components/highschool/HighSchoolLessonPlayer";

export const metadata: Metadata = {
  title: "پایه یازدهم - درس ۱: شناخت مردم و زبان‌ها (Understanding People) | ایندورا",
  description:
    "آموزش تعاملی و استقرایی درس اول کتاب انگلیسی پایه یازدهم (Vision 2) شامل Get Ready، مکالمه صوتی بابک صابریان، واژگان و مترادف‌ها، ریدینگ زبان‌های جهان، گرامر اسم‌های شمارشی، لیسنینگ اعداد و رایتینگ جمله ساده.",
};

export default async function Grade11Lesson1Page() {
  const lesson = await getHighSchoolLesson(11, 1);
  if (!lesson) notFound();

  return <HighSchoolLessonPlayer lesson={lesson} />;
}
