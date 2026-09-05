import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../courses.module.css";

interface CourseDetail {
  slug: string;
  titleFa: string;
  titleEn: string;
  desc: string;
  cefr: string;
  hours: number;
  author: string;
  sourceAttribution: string;
  modules: Array<{
    titleFa: string;
    titleEn: string;
    lessons: Array<{ id: string; titleFa: string; duration: number; isFree: boolean }>;
  }>;
}

const COURSES_MAP: Record<string, CourseDetail> = {
  "konkur-english-vision-mastery": {
    slug: "konkur-english-vision-mastery",
    titleFa: "دوره جامع زبان انگلیسی دبیرستان و کنکور (Vision ۱ تا ۳)",
    titleEn: "Vision 1-3 & Konkur English Mastery",
    desc: "آموزش گام‌به‌گام کتب درسی دهم، یازدهم و دوازدهم همراه با تحلیل تکنیک‌های درک مطلب و کلوزتست کنکور سراسری.",
    cefr: "B1",
    hours: 24,
    author: "هیئت مؤلفان و اساتید کنکور اندورا",
    sourceAttribution: "کارگروه تألیف برنامه درسی ملی اندورا",
    modules: [
      {
        titleFa: "فصل ۱: پایه دهم (Vision 1) - زمان‌های آینده و صفات مقایسه‌ای",
        titleEn: "Module 1: Grade 10 - Future Forms & Comparative Adjectives",
        lessons: [
          { id: "101", titleFa: "درس ۱: آینده ساده با Will و Be going to", duration: 20, isFree: true },
          { id: "102", titleFa: "درس ۲: واژگان کلیدی نجات طبیعت و محیط زیست", duration: 25, isFree: false },
          { id: "103", titleFa: "درس ۳: گذشته استمراری و کاربرد While", duration: 18, isFree: false },
        ],
      },
      {
        titleFa: "فصل ۲: پایه یازدهم (Vision 2) - زمان حال کامل و اسامی شمارشی",
        titleEn: "Module 2: Grade 11 - Present Perfect & Countable Nouns",
        lessons: [
          { id: "201", titleFa: "درس ۱: ساختار و کاربرد حال کامل در آزمون نهایی", duration: 22, isFree: false },
          { id: "202", titleFa: "درس ۲: مجهول زمان حال ساده و گذشته ساده", duration: 26, isFree: false },
        ],
      },
      {
        titleFa: "فصل ۳: پایه دوازدهم (Vision 3) - مجهول مدال‌ها و ساختارهای موصولی",
        titleEn: "Module 3: Grade 12 - Passive Modals & Relative Clauses",
        lessons: [
          { id: "301", titleFa: "درس ۱: سؤالات ضمیمه (Tag Questions) و شروط آن", duration: 19, isFree: false },
          { id: "302", titleFa: "درس ۲: حل تشریحی ۱۰۰ تست منتخب کنکور", duration: 45, isFree: false },
        ],
      },
    ],
  },
  "ielts-academic-speaking-and-writing-mastery": {
    slug: "ielts-academic-speaking-and-writing-mastery",
    titleFa: "مسترکلاس اسپیکینگ و رایتینگ آیلتس آکادمیک (Band 7+)",
    titleEn: "IELTS Academic Speaking & Writing: Target Band 7+",
    desc: "رویکرد اصولی به معیارهای چهارگانه نمره‌دهی آیلتس بر مبنای استانداردهای رسمی کمبریج.",
    cefr: "B2",
    hours: 30,
    author: "دپارتمان آیلتس و تصحیح‌کنندگان رسمی اندورا",
    sourceAttribution: "Endoora IELTS Research Board",
    modules: [
      {
        titleFa: "فصل ۱: تسک ۲ رایتینگ (Task 2) - معماری مقاله و چارچوب PEEL",
        titleEn: "Module 1: Task 2 Essay Architecture",
        lessons: [
          { id: "101", titleFa: "درس ۱: کالبدشکافی مقدمه استاندارد در ۴۰ کلمه", duration: 18, isFree: true },
          { id: "102", titleFa: "درس ۲: نگارش پاراگراف‌های بدنه با استدلال قوی", duration: 28, isFree: false },
          { id: "103", titleFa: "درس ۳: کلمات ربط پیشرفته و انسجام متنی", duration: 24, isFree: false },
        ],
      },
      {
        titleFa: "فصل ۲: اسپیکینگ پارت ۲ و ۳ - بداهه‌گویی و واژگان موضوعی",
        titleEn: "Module 2: Speaking Parts 2 & 3",
        lessons: [
          { id: "201", titleFa: "درس ۱: استراتژی صحبت ۲ دقیقه‌ای در پارت ۲", duration: 20, isFree: false },
          { id: "202", titleFa: "درس ۲: پاسخ به سؤالات انتزاعی در پارت ۳", duration: 25, isFree: false },
        ],
      },
    ],
  },
  "foundations-of-spoken-fluency": {
    slug: "foundations-of-spoken-fluency",
    titleFa: "دوره جامع روانی مکالمه و بیان محاوره‌ای انگلیسی",
    titleEn: "Foundations of Everyday Spoken Fluency",
    desc: "غلبه بر استرس مکالمه، یادگیری اصطلاحات روزمره و تقویت روانی کلام بدون وسواس گرامری.",
    cefr: "A2",
    hours: 18,
    author: "لابراتوار مکالمه کاربردی اندورا",
    sourceAttribution: "Endoora Spoken English Group",
    modules: [
      {
        titleFa: "فصل ۱: عبارات پرکننده و مهارت خرید زمان",
        titleEn: "Module 1: Conversational Fillers & Buying Time",
        lessons: [
          { id: "101", titleFa: "درس ۱: تکنیک توصیف غیرمستقیم کلمات فراموش‌شده", duration: 15, isFree: true },
          { id: "102", titleFa: "درس ۲: گفتگوی کوتاه در احوال‌پرسی‌های روزمره", duration: 20, isFree: false },
        ],
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(COURSES_MAP).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = COURSES_MAP[slug];
  if (!course) return {};
  return {
    title: `${course.titleFa} | دوره‌های اندورا`,
    description: course.desc,
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = COURSES_MAP[slug];
  if (!course) notFound();

  return (
    <div className={styles.container} dir="rtl">
      <Link href="/courses" style={{ color: "var(--color-link)", fontWeight: 700, textDecoration: "none", display: "inline-block", marginBottom: "var(--space-4)" }}>
        ← بازگشت به کاتالوگ دوره‌ها
      </Link>

      <header className={styles.header}>
        <div>
          <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
            <span className={styles.cefrBadge}>{course.cefr}</span>
            <span className={styles.audienceBadge}>{course.hours} ساعت محتوا</span>
          </div>
          <h1 className={styles.title}>{course.titleFa}</h1>
          <div style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-family-latin)", direction: "ltr", textAlign: "right", marginBottom: "var(--space-3)" }}>
            {course.titleEn}
          </div>
          <p className={styles.subtitle}>{course.desc}</p>
        </div>
      </header>

      {/* Modules Syllabus List */}
      <section style={{ marginBlockEnd: "var(--space-10)" }}>
        <h2 style={{ fontSize: "var(--font-size-h2)", fontWeight: 800, marginBottom: "var(--space-4)" }}>
          سرفصل‌های آموزشی دوره
        </h2>

        <div style={{ display: "grid", gap: "var(--space-6)" }}>
          {course.modules.map((module, mIdx) => (
            <div
              key={mIdx}
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-card)",
                padding: "var(--space-5)",
                boxShadow: "var(--shadow-subtle)",
              }}
            >
              <h3 style={{ fontSize: "var(--font-size-h3)", fontWeight: 700, marginBottom: "var(--space-1)" }}>
                {module.titleFa}
              </h3>
              <div style={{ fontSize: "var(--font-size-small)", color: "var(--color-text-muted)", direction: "ltr", textAlign: "right", fontFamily: "var(--font-family-latin)", marginBottom: "var(--space-4)" }}>
                {module.titleEn}
              </div>

              <div style={{ display: "grid", gap: "var(--space-3)" }}>
                {module.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "var(--space-3) var(--space-4)",
                      background: "var(--color-surface-subtle)",
                      borderRadius: "var(--radius-control)",
                      flexWrap: "wrap",
                      gap: "var(--space-2)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                      <span>{lesson.isFree ? "🟢" : "🔒"}</span>
                      <strong style={{ fontSize: "var(--font-size-small)" }}>{lesson.titleFa}</strong>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                      <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)" }}>
                        {lesson.duration} دقیقه
                      </span>
                      {lesson.isFree ? (
                        <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-learning-teal)", fontWeight: 700 }}>
                          پیش‌نمایش رایگان
                        </span>
                      ) : (
                        <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-achievement-amber)", fontWeight: 700 }}>
                          اشتراک ویژه
                        </span>
                      )}
                      <Link
                        href={`/courses/${course.slug}/lessons/${lesson.id}`}
                        style={{
                          paddingInline: "var(--space-3)",
                          paddingBlock: "var(--space-1)",
                          background: lesson.isFree ? "var(--color-action)" : "var(--color-surface)",
                          color: lesson.isFree ? "var(--color-white)" : "var(--color-text)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "var(--radius-control)",
                          fontSize: "var(--font-size-small)",
                          fontWeight: 700,
                          textDecoration: "none",
                        }}
                      >
                        {lesson.isFree ? "شروع رایگان" : "مشاهده درس"}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Author and Copyright footer */}
      <footer style={{ padding: "var(--space-4)", background: "var(--color-surface-subtle)", borderRadius: "var(--radius-card)", fontSize: "var(--font-size-small)", color: "var(--color-text-muted)" }}>
        <div><strong>تألیف و نظارت علمی: </strong>{course.author}</div>
        <div style={{ marginTop: "0.25rem" }}><strong>منبع و مجوز: </strong>{course.sourceAttribution} — کلیه حقوق برای اندورا محفوظ است.</div>
      </footer>
    </div>
  );
}
