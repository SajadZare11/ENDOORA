import type { ReactNode } from "react";
import type { Metadata } from "next";
import { PublicShell } from "../../components/marketing/PublicShell";

export const metadata: Metadata = {
  title: "مرجع جامع کتاب‌ها و منابع زبان انگلیسی | اندورا",
  description:
    "کامل‌ترین آرشیو دانلود کتب بین‌المللی، رمان‌ها و داستان‌های صوتی سطح‌بندی‌شده، نمونه‌سوالات رسمی امتحانات نهایی دوازدهم، ویدیوهای مستند و کتاب‌های گرامر با لینک مستقیم و سرور کمکی.",
  keywords: [
    "دانلود کتاب زبان",
    "کتاب های زبان انگلیسی",
    "American English File",
    "Speakout",
    "امتحان نهایی دوازدهم زبان",
    "رمان انگلیسی سطح بندی شده",
    "دانلود جزوه زبان",
    "پادکست و کتاب صوتی انگلیسی",
    "English Grammar in Use",
  ],
};

export default function BooksLayout({ children }: { children: ReactNode }) {
  return (
    <PublicShell locale="fa" currentPath="/books">
      {children}
    </PublicShell>
  );
}
