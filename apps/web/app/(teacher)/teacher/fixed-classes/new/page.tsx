"use client";

import Link from "next/link";

import { useTeacherHome } from "../../../../../components/teacher/TeacherShell";


export default function NewFixedClassFoundationPage() {
  const { data, locale } = useTeacherHome();
  const verified = data.capabilities.teacher_verified;

  return (
    <section className="teacher-foundation-page">
      <p className="teacher-eyebrow">{locale === "fa" ? "کلاس ثابت" : "Fixed class"}</p>
      <h1>{locale === "fa" ? "ایجاد کلاس ثابت" : "Create fixed class"}</h1>
      <p>
        {verified
          ? locale === "fa"
            ? "مدرس تأیید شده است، اما فرم واقعی ایجاد کلاس تا مرحله اختصاصی کلاس‌های ثابت فعال نمی‌شود."
            : "The teacher is verified, but the real fixed-class creation form stays disabled until the dedicated fixed-class stage."
          : locale === "fa"
            ? "ایجاد کلاس پولی قبل از تأیید مدرس مجاز نیست. ابتدا وضعیت پروفایل و تأیید مدرس را تکمیل کن."
            : "Paid class creation is not allowed before teacher verification. Complete the teacher profile and verification first."}
      </p>
      <div className="teacher-foundation-notice" role="status">
        {locale === "fa"
          ? "هیچ قیمت، ظرفیت، زمان‌بندی یا کلاس ساختگی در روز ۱۰ ذخیره نمی‌شود."
          : "Day 10 stores no invented price, capacity, schedule, or class record."}
      </div>
      <Link className="teacher-button teacher-button--secondary" href={verified ? "/teacher" : "/account/profile"}>
        {verified
          ? locale === "fa" ? "بازگشت به خانه مدرس" : "Back to teacher home"
          : locale === "fa" ? "رفتن به پروفایل" : "Open profile"}
      </Link>
    </section>
  );
}
