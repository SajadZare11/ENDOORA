import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHighSchoolLesson } from "@/lib/highschool";
import { HighSchoolLessonPlayer } from "@/components/highschool/HighSchoolLessonPlayer";

export const metadata: Metadata = {
  title: "پایه دوازدهم - درس ۱: حس قدردانی و احترام (Sense of Appreciation) | ایندورا",
  description:
    "آموزش تعاملی و استقرایی درس اول کتاب انگلیسی پایه دوازدهم (Vision 3) شامل Get Ready قهرمانان ملی، مکالمه صوتی دکتر محمد قریب، واژگان و کارگاه هم‌آیی‌ها (Collocations)، ریدینگ احترام به والدین، گرامر مجهول و سوالات ضمیمه، لیسنینگ و نگارش جملات مرکب.",
};

export default async function Grade12Lesson1Page() {
  const lesson = await getHighSchoolLesson(12, 1);
  if (!lesson) notFound();

  return <HighSchoolLessonPlayer lesson={lesson} />;
}
