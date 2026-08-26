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
      <h1>{locale === "fa" ? titleFa : titleEn}</h1>
      <p>{locale === "fa" ? bodyFa : bodyEn}</p>
      <div className="teacher-foundation-notice" role="status">
        {locale === "fa"
          ? "این بخش اکنون مسیر، دسترسی و وضعیت امن را نشان می‌دهد. عملیات واقعی فقط پس از ساخته‌شدن مدل و داده همان دامنه فعال می‌شود."
          : "This area currently provides its safe route, access state, and guidance. Real operations activate only after that domain's models and data exist."}
      </div>
      <Link className="teacher-button teacher-button--secondary" href="/teacher">
        {locale === "fa" ? "بازگشت به خانه مدرس" : "Back to teacher home"}
      </Link>
    </section>
  );
}
