import AdaptivePracticeHub from "@/components/practice/AdaptivePracticeHub";

export const metadata = {
  title: "تمرین انطباقی جامع مهارت‌ها | ایندورا",
  description: "سامانه تمرین انطباقی زبان انگلیسی با مونتاژ هوشمند تله‌های گزینه‌ای LinUCB و پایش فراموشی DKT-Forget",
};

export default function PracticePage() {
  return <AdaptivePracticeHub initialSection="all" />;
}
