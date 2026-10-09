import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/marketing/PublicShell";
import styles from "./school.module.css";

export const metadata: Metadata = {
  title: "بخش اختصاصی کتب دبیرستان و کنکور سراسری | ایندورا",
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
    lessons: ["درس ۱: درک دیگران (Understanding People) - اسامی قابل شمارش و جمله ساده", "درس ۲: سبک زندگی سالم (A Healthy Lifestyle) - زمان حال کامل و اسم مصدر (Gerund)", "درس ۳: هنر و فرهنگ (Art and Culture) - جملات شرطی نوع اول و مصدر با to (Infinitives)"],
    konkurFocus: "جملات شرطی نوع اول، حال کامل، افعال عبارتی، تمایز اسم مصدر (Gerund) و مصدر (Infinitive)، و کمیت‌سنج‌های اسامی.",
  },
  {
    grade: "پایه دوازدهم (Vision 3)",
    slug: "vision_3",
    cefr: "B1+",
    lessons: [
      "درس ۱: حس قدردانی و احترام (Sense of Appreciation) - مجهول و سوالات ضمیمه (Tag Questions)",
      "درس ۲: فرهنگ لغت و جستجوی واژگان (Look it Up!) - ضمایر موصولی و شرطی نوع دوم",
      "درس ۳: انرژی‌های تجدیدپذیر (Renewable Energy) - مجهول افعال مدال و گذشته کامل",
    ],
    konkurFocus: "امتحانات نهایی خرداد، سوالات ضمیمه، جملات مجهول، ضمایر موصولی، کارگاه ضرب‌المثل‌ها و پاراگراف‌نویسی استاندارد.",
  },
];

export default function SchoolHubPage() {
  return (
    <PublicShell locale="fa" currentPath="/skills/school">
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



      {/* Featured Tamrin 20 Practice Hub Card */}
      <section
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
          color: "#ffffff",
          borderRadius: "var(--radius-card, 14px)",
          padding: "var(--space-5, 1.25rem)",
          marginBottom: "var(--space-6, 1.5rem)",
          boxShadow: "0 8px 20px -4px rgba(37, 99, 235, 0.25)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-4)" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
              <span style={{ background: "rgba(255,255,255,0.2)", fontSize: "0.75rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: "999px" }}>
                سامانه تعاملی امتحانات نهایی
              </span>
              <span style={{ background: "#22c55e", fontSize: "0.75rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: "999px" }}>
                پایه دوازدهم (Vision 3)
              </span>
            </div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, margin: "0.35rem 0", color: "#ffffff" }}>
              تمرین تا ۲۰ (بیش از ۱۰۰۰ سوال امتحانات نهایی خرداد و شهریور)
            </h2>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.9)", fontSize: "0.9rem", maxInlineSize: "44rem", lineHeight: 1.5 }}>
              تفکیک درس به درس در ۵ مهارت (شنیداری با صوت، واژگان، دستور زبان، درک مطلب و نگارش) با تصحیح آنی، توضیحات تکمیلی و شروع با ۲۰ سوال طلایی.
            </p>
          </div>
          <Link
            href="/high-school/grade-12/tamrin20"
            style={{
              paddingInline: "var(--space-5, 1.25rem)",
              paddingBlock: "var(--space-3, 0.75rem)",
              background: "#ffffff",
              color: "#1d4ed8",
              borderRadius: "var(--radius-control, 8px)",
              fontWeight: 800,
              textDecoration: "none",
              display: "inline-block",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              whiteSpace: "nowrap",
            }}
          >
            ورود به تمرین تا ۲۰ دوازدهم ←
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
                href={
                  g.slug === "vision_1"
                    ? "/high-school/grade-10"
                    : g.slug === "vision_2"
                    ? "/high-school/grade-11"
                    : "/high-school/grade-12"
                }
                style={{ color: "var(--color-action)", fontWeight: 700, textDecoration: "none", fontSize: "var(--font-size-small)" }}
              >
                {g.slug === "vision_1"
                  ? "ورود به سرفصل‌های پایه دهم (تمام ۴ درس فعال) ←"
                  : g.slug === "vision_2"
                  ? "ورود به سرفصل‌های پایه یازدهم (تمام ۳ درس فعال) ←"
                  : "ورود به سرفصل‌های پایه دوازدهم (تمام ۳ درس فعال) ←"}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
    </PublicShell>
  );
}
