import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHighSchoolLesson } from "@/lib/highschool";
import { HighSchoolLessonPlayer } from "@/components/highschool/HighSchoolLessonPlayer";

export const metadata: Metadata = {
  title: "پایه دوازدهم - درس ۳: انرژی‌های تجدیدپذیر (Renewable Energy) | ایندورا",
  description:
    "آموزش تعاملی و استقرایی درس سوم کتاب انگلیسی پایه دوازدهم (Vision 3) شامل Get Ready توربین‌های بادی و خورشیدی، مکالمه منجیل عماد و پدر، واژگان و کارگاه ضرب‌المثل‌ها (Proverbs)، ریدینگ زمین برای فرزندانمان، گرامر مجهول مدال‌ها و گذشته کامل، و نگارش پاراگراف استاندارد امتحان نهایی.",
};

export default async function Grade12Lesson3Page() {
  const lesson = await getHighSchoolLesson(12, 3);
  if (!lesson) notFound();

  return <HighSchoolLessonPlayer lesson={lesson} />;
}
