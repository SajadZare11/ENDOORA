import type { Metadata } from "next";
import Link from "next/link";
import styles from "./learn.module.css";

export const metadata: Metadata = {
  title: "مرکز یادگیری | اندورا",
  description: "دسترسی جامع به دوره‌های آموزشی، پایگاه مهارت‌ها، مسیر یادگیری شخصی، واژگان و کتب درسی کنکور.",
};

const LEARNING_DESTINATIONS = [
  {
    title: "دوره‌های آموزشی تعاملی",
    desc: "دوره‌های ویدئویی ساختاریافته از سطح A2 تا C1، کنکور سراسری، و آمادگی آیلتس همراه با آزمون‌های سنجشی.",
    href: "/courses",
    icon: "🎓",
    action: "ورود به دوره‌ها",
  },
  {
    title: "مرکز مهارت‌های شش‌گانه",
    desc: "پایگاه مقالات و تمرین‌های تخصصی لیسنینگ، ریدینگ، رایتینگ، اسپیکینگ، گرامر تحلیلی و واژگان.",
    href: "/skills",
    icon: "⚡",
    action: "مشاهده مهارت‌ها",
  },
  {
    title: "مسیر رشد شخصی (Learning Path)",
    desc: "برنامه آموزشی منطبق بر نتایج آزمون تعیین سطح شما و نقاط ضعف شناسایی‌شده در همزاد یادگیرنده.",
    href: "/path",
    icon: "🗺️",
    action: "مشاهده مسیر من",
  },
  {
    title: "کتب دبیرستان و کنکور سراسری",
    desc: "تحلیل درس‌به‌درس کتاب‌های Vision 1, 2, 3 و تست‌های گرامر و واژگان کنکور سراسری با پاسخ تشریحی.",
    href: "/skills/school",
    icon: "📚",
    action: "ورود به بخش دبیرستان",
  },
  {
    title: "جعبه واژگان هوشمند (SRS)",
    desc: "مرور کلمات فعال و تثبیت در حافظه بلندمدت با الگوریتم تکرار فاصله‌دار SM-2 بدون فراموشی.",
    href: "/vocabulary",
    icon: "💡",
    action: "شروع مرور واژگان",
  },
  {
    title: "فرهنگ و ارتباطات بین‌المللی",
    desc: "یادگیری آداب گپ‌وگفت‌های خودمانی (Small Talk)، نکات بین‌فرهنگی و تعارف در ارتباطات انگلیسی.",
    href: "/skills/culture",
    icon: "🌐",
    action: "آشنایی با فرهنگ زبان",
  },
  {
    title: "لابراتوار مکالمه و هوش مصنوعی",
    desc: "نقش‌آفرینی صوتی و متنی در ۱۰ سناریوی واقعی زندگی و کار، همراه با ارزیابی بازخوردی بدون سرزنش.",
    href: "/roleplay",
    icon: "🎙️",
    action: "ورود به نقش‌آفرینی",
  },
  {
    title: "افتخارات و نشان‌ها",
    desc: "مشاهده نشان‌های به‌دست‌آمده، مأموریت‌های ۷ روزه، کلوپ‌های هم‌آموزی و جدول رده‌بندی امن.",
    href: "/achievements",
    icon: "🏆",
    action: "مشاهده دستاوردها",
  },
];

export default function LearnHubPage() {
  return (
    <div className={styles.container} dir="rtl">
      <header className={styles.heroHeader}>
        <h1 className={styles.title}>مرکز جامع یادگیری اندورا</h1>
        <p className={styles.subtitle}>
          تمام منابع آموزشی، دوره‌ها، مهارت‌ها و ابزارهای تمرینی در یک نگاه. گام بعدی یادگیری خود را انتخاب کنید.
        </p>
      </header>

      <div className={styles.hubGrid}>
        {LEARNING_DESTINATIONS.map((dest, idx) => (
          <Link key={idx} href={dest.href} className={styles.hubCard}>
            <div>
              <div className={styles.cardIcon}>{dest.icon}</div>
              <h2 className={styles.cardTitle}>{dest.title}</h2>
              <p className={styles.cardDesc}>{dest.desc}</p>
            </div>
            <div className={styles.cardAction}>
              <span>{dest.action}</span>
              <span>←</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
