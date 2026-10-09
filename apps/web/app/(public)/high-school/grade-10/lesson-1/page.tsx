import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHighSchoolLesson } from "@/lib/highschool";
import { HighSchoolLessonPlayer } from "@/components/highschool/HighSchoolLessonPlayer";

export const metadata: Metadata = {
  title: "پایه دهم - درس ۱: نجات طبیعت (Saving Nature) | ایندورا",
  description:
    "آموزش تعاملی و استقرایی درس اول کتاب انگلیسی پایه دهم (Vision 1) شامل Get Ready، مکالمه، واژگان، ریدینگ، گرامر آینده، لیسنینگ و رایتینگ.",
};

export default async function Grade10Lesson1Page() {
  const lesson = await getHighSchoolLesson(10, 1);
  if (!lesson) notFound();

  return <HighSchoolLessonPlayer lesson={lesson} />;
}
