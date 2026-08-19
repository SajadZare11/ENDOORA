"use client";

import Link from "next/link";

import { useTeacherHome } from "./TeacherShell";


export function TeacherFoundationPage({
  titleFa,
  titleEn,
  bodyFa,
  bodyEn,
}: {
  titleFa: string;
  titleEn: string;
  bodyFa: string;
  bodyEn: string;
}) {
  const { locale } = useTeacherHome();
  return (
    <section className="teacher-foundation-page">
      <p className="teacher-eyebrow">{locale === "fa" ? "پایه امن روز ۱۰" : "Day 10 safe foundation"}</p>
      <h1>{locale === "fa" ? titleFa : titleEn}</h1>
      <p>{locale === "fa" ? bodyFa : bodyEn}</p>
      <div className="teacher-foundation-notice" role="status">
        {locale === "fa"
          ? "این صفحه وجود دارد تا ناوبری مدرس به مسیر خراب یا قابلیت ساختگی نرسد. عملیات واقعی فقط در روز اختصاصی همان دامنه فعال می‌شود."
          : "This page exists so teacher navigation never lands on a broken route or invented capability. Real operations activate only on that domain's dedicated roadmap day."}
      </div>
      <Link className="teacher-button teacher-button--secondary" href="/teacher">
        {locale === "fa" ? "بازگشت به خانه مدرس" : "Back to teacher home"}
      </Link>
    </section>
  );
}
