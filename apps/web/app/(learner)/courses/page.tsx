import type { Metadata } from "next";
import Link from "next/link";
import styles from "./courses.module.css";

export const metadata: Metadata = {
  title: "دوره‌های آموزشی تعاملی | اندورا",
  description: "کاتالوگ جامع دوره‌های زبان انگلیسی، آمادگی آیلتس و کنکور سراسری با سیلابس مدولار و ویدئوهای تعاملی.",
};

const COURSES_DATA = [
  {
    slug: "konkur-english-vision-mastery",
    titleFa: "دوره جامع زبان انگلیسی دبیرستان و کنکور (Vision ۱ تا ۳)",
    titleEn: "Vision 1-3 & Konkur English Mastery",
    desc: "آموزش گام‌به‌گام گرامر، واژگان کلیدی، تکنیک‌های کلوزتست و درک مطلب کنکور سراسری بر اساس کتب درسی رسمی.",
    cefr: "B1",
    audience: "دبیرستان و کنکور",
    hours: 24,
    modules: 3,
    hasFreePreview: true,
  },
  {
    slug: "ielts-academic-speaking-and-writing-mastery",
    titleFa: "مسترکلاس اسپیکینگ و رایتینگ آیلتس آکادمیک (Band 7+)",
    titleEn: "IELTS Academic Speaking & Writing: Target Band 7+",
    desc: "رویکرد اصولی به معیارهای چهارگانه نمره‌دهی آیلتس: واژگان موضوعی، انسجام، دقت گرامری و روانی کلام.",
    cefr: "B2",
    audience: "آیلتس آکادمیک",
    hours: 30,
    modules: 4,
    hasFreePreview: true,
  },
  {
    slug: "foundations-of-spoken-fluency",
    titleFa: "دوره جامع روانی مکالمه و بیان محاوره‌ای انگلیسی",
    titleEn: "Foundations of Everyday Spoken Fluency",
    desc: "غلبه بر استرس مکالمه، یادگیری اصطلاحات روزمره و تقویت روانی کلام بدون وسواس گرامری.",
    cefr: "A2",
    audience: "مکالمه عمومی",
    hours: 18,
    modules: 3,
    hasFreePreview: true,
  },
];

export default function CoursesCatalogPage() {
  return (
    <div className={styles.container} dir="rtl">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>دوره‌های آموزشی اندورا</h1>
          <p className={styles.subtitle}>
            دوره‌های مدولار با سرفصل‌های ساختاریافته، ویدئوهای آموزشی، تمرین‌های تعاملی و پیش‌نمایش رایگان جلسه اول.
          </p>
        </div>
        <Link
          href="/skills"
          style={{
            color: "var(--color-link)",
            fontWeight: 700,
            textDecoration: "none",
            paddingInline: "var(--space-4)",
            paddingBlock: "var(--space-2)",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-control)",
          }}
        >
          مرکز دانش مهارت‌ها ←
        </Link>
      </header>

      <div className={styles.coursesGrid}>
        {COURSES_DATA.map((c) => (
          <Link key={c.slug} href={`/courses/${c.slug}`} className={styles.courseCard}>
            <div className={styles.cardBanner}>
              <div className={styles.badgeRow}>
                <span className={styles.cefrBadge}>{c.cefr}</span>
                <span className={styles.audienceBadge}>{c.audience}</span>
                {c.hasFreePreview && (
                  <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 700, color: "var(--color-learning-teal)" }}>
                    ✓ پیش‌نمایش رایگان
                  </span>
                )}
              </div>
              <h2 className={styles.courseTitleFa}>{c.titleFa}</h2>
              <div className={styles.courseTitleEn}>{c.titleEn}</div>
            </div>

            <div className={styles.cardBody}>
              <p className={styles.courseDesc}>{c.desc}</p>
              <div style={{ display: "flex", gap: "var(--space-4)", fontSize: "var(--font-size-small)", color: "var(--color-text-muted)" }}>
                <span>⏱️ {c.hours} ساعت آموزش</span>
                <span>📚 {c.modules} فصل آموزشی</span>
              </div>
            </div>

            <div className={styles.cardFooter}>
              <span>مشاهده سرفصل و دروس</span>
              <span>←</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
