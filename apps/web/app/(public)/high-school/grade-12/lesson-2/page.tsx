import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHighSchoolLesson } from "@/lib/highschool";
import { HighSchoolLessonPlayer } from "@/components/highschool/HighSchoolLessonPlayer";

export const metadata: Metadata = {
  title: "پایه دوازدهم - درس ۲: فرهنگ لغت و جستجوی واژگان (Look it Up!) | ایندورا",
  description:
    "آموزش تعاملی و استقرایی درس دوم کتاب انگلیسی پایه دوازدهم (Vision 3) شامل Get Ready لغت‌نامه‌ها، مکالمه صوتی مجید و آقای ایران‌مهر، واژگان و کارگاه خانواده اجزای کلمات (Word Part Families)، ریدینگ راهنمای دیکشنری، گرامر ضمایر موصولی و شرطی نوع دوم، و نگارش پاراگراف.",
};

export default async function Grade12Lesson2Page() {
  const lesson = await getHighSchoolLesson(12, 2);
  if (!lesson) notFound();

  return <HighSchoolLessonPlayer lesson={lesson} />;
}
