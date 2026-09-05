import type { Metadata } from "next";
import Link from "next/link";
import styles from "./school.module.css";

export const metadata: Metadata = {
  title: "بخش اختصاصی کتب دبیرستان و کنکور سراسری | اندورا",
  description: "آموزش و تحلیل خط‌به‌خط کتب درسی Vision 1, Vision 2, Vision 3 و تکنیک‌های تست‌زنی کنکور زبان انگلیسی.",
};

const GRADES = [
  {
    grade: "پایه دهم (Vision 1)",
    slug: "vision_1",
    cefr: "A2",
    lessons: ["درس ۱: نجات طبیعت (Saving Nature) - زمان‌های آینده", "درس ۲: شگفتی‌های خلقت (Wonders of Creation) - صفت‌های مقایسه‌ای", "درس ۳: ارزش علم (The Value of Knowledge) - گذشته استمراری", "درس ۴: جهان‌گردی و ایران‌گردی (Traveling the World) - افعال کمکی"],
    konkurFocus: "زمان‌های آینده با Will و Be going to، صفات برتر و برترین، و افعال با قاعده و بی‌قاعده.",
  },
  {
    grade: "پایه یازدهم (Vision 2)",
    slug: "vision_2",
    cefr: "B1",
    lessons: ["درس ۱: درک دیگران (Understanding People) - اسامی قابل شمارش و غیرقابل شمارش", "درس ۲: سبک زندگی سالم (A Healthy Lifestyle) - زمان حال کامل", "درس ۳: هنر و فرهنگ (Art and Culture) - جملات مجهول (Passive Voice)"],
    konkurFocus: "تفاوت حال کامل با گذشته ساده، قیدهای تکرار، کمیت‌سنج‌ها (much, many, a few) و ساختارهای مجهول زمان حال و گذشته.",
  },
  {
    grade: "پایه دوازدهم (Vision 3)",
    slug: "vision_3",
    cefr: "B1+",
    lessons: ["درس ۱: حس فداکاری (Sense of Appreciation) - مجهول افعال مدال", "درس ۲: نگاه به آینده (Look into the Future) - ساختارهای موصولی (Relative Clauses)", "درس ۳: فناوری و ارتباطات (Renewable Energy) - حروف ربط همپایه و ناهمپایه (Tag Questions)"],
    konkurFocus: "سؤالات ضمیمه (Tag Questions)، جملات مجهول با Can/Must/Should، ضمایر موصولی Who/Whom/Which/That و کلمات ربط.",
  },
];

export default function SchoolHubPage() {
  return (
    <div className={styles.container} dir="rtl">
      <Link href="/skills" style={{ color: "var(--color-link)", fontWeight: 700, textDecoration: "none", display: "inline-block", marginBottom: "var(--space-4)" }}>
        ← بازگشت به مرکز مهارت‌ها
      </Link>

      <header className={styles.heroHeader}>
        <span className={styles.badge}>برنامه درسی ملی ایران</span>
        <h1 className={styles.title}>مرکز آموزش زبان دبیرستان و کنکور</h1>
        <p className={styles.description}>
          آموزش جامع کتب سه گانه Vision (پایه‌های دهم، یازدهم و دوازدهم) همراه با حل تشریحی تست‌های کنکور سراسری سال‌های اخیر و تکنیک‌های کلوزتست.
        </p>
      </header>

      {/* Featured Konkur Course Card */}
      <section className={styles.konkurBanner}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--space-4)" }}>
          <div>
            <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 700, color: "var(--color-action)" }}>دوره پیشنهادی جامع</span>
            <h2 style={{ fontSize: "var(--font-size-h2)", fontWeight: 800, marginBlock: "var(--space-2)" }}>
              دوره تخصصی کنکور سراسری و امتحانات نهایی (Vision ۱ تا ۳)
            </h2>
            <p style={{ margin: 0, color: "var(--color-text-muted)", maxInlineSize: "40rem", lineHeight: "var(--line-height-body)" }}>
              شامل ۲۴ ساعت آموزش تعاملی، حل ۵۰۰ تست استاندارد طبقه‌بندی‌شده، جزوه لغات کنکوری با ریشه‌شناسی و آزمون‌های سنجشی آنلاین.
            </p>
          </div>
          <Link
            href="/courses/konkur-english-vision-mastery"
            style={{
              paddingInline: "var(--space-5)",
              paddingBlock: "var(--space-3)",
              background: "var(--color-action)",
              color: "var(--color-white)",
              borderRadius: "var(--radius-control)",
              fontWeight: 700,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            مشاهده سرفصل‌های دوره کنکور ←
          </Link>
        </div>
      </section>

      {/* High School Grades Grid */}
      <div className={styles.gradesGrid}>
        {GRADES.map((g, idx) => (
          <div key={idx} className={styles.gradeCard}>
            <div>
              <span className={styles.gradePill}>سطح: {g.cefr}</span>
              <h3 className={styles.gradeTitle}>{g.grade}</h3>
              
              <div style={{ marginBlockEnd: "var(--space-4)" }}>
                <strong style={{ fontSize: "var(--font-size-small)", color: "var(--color-text)" }}>دروس کتاب:</strong>
                <ul style={{ margin: 0, paddingInlineStart: "1.25rem", color: "var(--color-text-muted)", fontSize: "var(--font-size-small)", marginTop: "0.25rem" }}>
                  {g.lessons.map((l, lIdx) => (
                    <li key={lIdx} style={{ marginBottom: "0.25rem" }}>{l}</li>
                  ))}
                </ul>
              </div>

              <div style={{ padding: "var(--space-3)", background: "var(--color-surface-subtle)", borderRadius: "var(--radius-control)", fontSize: "var(--font-size-meta)", color: "var(--color-text)" }}>
                <strong>نکته کنکوری: </strong>{g.konkurFocus}
              </div>
            </div>

            <div style={{ marginTop: "var(--space-5)", paddingTop: "var(--space-3)", borderTop: "1px solid var(--color-border)" }}>
              <Link
                href="/courses/konkur-english-vision-mastery"
                style={{ color: "var(--color-action)", fontWeight: 700, textDecoration: "none", fontSize: "var(--font-size-small)" }}
              >
                شروع آموزش این پایه ←
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
