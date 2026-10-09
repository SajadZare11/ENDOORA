import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHighSchoolLesson } from "@/lib/highschool";
import { HighSchoolLessonPlayer } from "@/components/highschool/HighSchoolLessonPlayer";

export const metadata: Metadata = {
  title: "پایه دهم - درس ۴: جهان‌گردی و گردشگری (Traveling the World) | ایندورا",
  description:
    "آموزش تعاملی و استقرایی درس چهارم کتاب انگلیسی پایه دهم (Vision 1) شامل Get Ready ابزارهای سفر، مکالمه آژانس مادرید، واژگان جدید ایران‌شناسی، ریدینگ بهشت واقعی ایران، گرامر افعال مدال و حروف اضافه، لیسنینگ و استرس تقابلی و نگارش قیدهای حالت و بی‌قاعده.",
};

export default async function Grade10Lesson4Page() {
  const lesson = await getHighSchoolLesson(10, 4);
  if (!lesson) notFound();

  return <HighSchoolLessonPlayer lesson={lesson} />;
}
