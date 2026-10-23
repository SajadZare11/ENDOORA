import type { Metadata } from "next";
import { LeitnerStudyArena } from "../../../../components/learner/leitner";

export const metadata: Metadata = {
  title: "اتاق مطالعه لایتنر خطاهای یادگیری | ایندورا",
  description:
    "مرور با فواصل زمانی خطاهای مکالمه و آزمون بر اساس سیستم علمی ۵ جعبه لایتنر برای زبان‌آموزان ایرانی",
};

export default function LeitnerStudyPage() {
  return <LeitnerStudyArena />;
}
