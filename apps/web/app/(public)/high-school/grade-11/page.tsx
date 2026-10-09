import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "زبان انگلیسی پایه یازدهم (Vision 2) | ایندورا",
  description: "آموزش خط‌به‌خط و استقرایی تمامی دروس کتاب انگلیسی پایه یازدهم دبیرستان همراه با تمارین و کارگاه تعاملی.",
};

const GRADE11_LESSONS = [
  {
    number: 1,
    titleFa: "شناخت مردم و زبان‌ها",
    titleEn: "Understanding People",
    grammarTopic: "اسم‌های قابل شمارش و غیرقابل شمارش، کمیت‌سنج‌ها (Many, Much, A few, A little) و واحدهای شمارش",
    status: "active",
    href: "/high-school/grade-11/lesson-1",
    description: "شامل آموزش ۷ بخشی: Get Ready زبان‌ها و قاره‌ها، مکالمه پازلی مترجم صدا و سیما، واژگان و کارگاه مترادف‌ها (Synonyms)، ریدینگ زبان‌های جهان، گرامر استقرایی اسم‌ها، لیسنینگ و استرس اعداد (Teen vs. Ten)، نگارش ساختار جمله ساده (SVO) و انواع قیدها.",
    sectionsCount: 7,
  },
  {
    number: 2,
    titleFa: "سبک زندگی سالم",
    titleEn: "A Healthy Lifestyle",
    grammarTopic: "حال کامل (Present Perfect) و افعال عبارتی (Phrasal Verbs)",
    status: "active",
    href: "/high-school/grade-11/lesson-2",
    description: "شامل آموزش ۷ بخشی: Get Ready تغذیه سالم، مکالمه سلامت و کوهنوردی دربند، ریدینگ زندگی طولانی‌تر و سالم‌تر، گرامر استقرایی حال کامل، پیشوندها و پسوندها، و نگارش اسم مصدر (Gerunds).",
    sectionsCount: 7,
  },
  {
    number: 3,
    titleFa: "هنر و فرهنگ",
    titleEn: "Art and Culture",
    grammarTopic: "جملات شرطی نوع اول (Conditional Type I) و اسم مفعول (Past Participles)",
    status: "active",
    href: "/high-school/grade-11/lesson-3",
    description: "شامل آموزش ۷ بخشی: Get Ready صنایع دستی و هنر، مکالمه خرید صنایع دستی، ریدینگ هنر و جامعه، گرامر استقرایی شرطی نوع اول، متضادها (Antonyms)، و نگارش مصدر با to (Infinitives).",
    sectionsCount: 7,
  },
];

export default function Grade11OverviewPage() {
  return (
    <div style={{ maxInlineSize: "1050px", marginInline: "auto", padding: "1.5rem 1rem", direction: "rtl" }}>
      {/* Breadcrumbs */}
      <nav
        aria-label="مسیر صفحه"
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "var(--space-2, 0.5rem)",
          fontSize: "var(--font-size-meta, 0.875rem)",
          color: "var(--color-muted, #475569)",
          marginBottom: "1.25rem",
        }}
      >
        <Link href="/" style={{ color: "var(--color-link, #1d4ed8)", textDecoration: "none", fontWeight: 600 }}>
          خانه
        </Link>
        <span>/</span>
        <Link href="/skills/school" style={{ color: "var(--color-link, #1d4ed8)", textDecoration: "none", fontWeight: 600 }}>
          زبان دبیرستان
        </Link>
        <span>/</span>
        <span aria-current="page" style={{ color: "var(--color-text, #0f172a)", fontWeight: 700 }}>
          پایه یازدهم (Vision 2)
        </span>
      </nav>

      <header style={{ marginBottom: "2rem", borderBottom: "1px solid var(--color-border, #e2e8f0)", paddingBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <span style={{ background: "#eff6ff", color: "#2563eb", fontWeight: 700, fontSize: "0.8rem", padding: "0.25rem 0.65rem", borderRadius: "9999px" }}>
            متوسطه دوم • پایه یازدهم
          </span>
          <span style={{ background: "#f0fdf4", color: "#166534", fontWeight: 700, fontSize: "0.8rem", padding: "0.25rem 0.65rem", borderRadius: "9999px" }}>
            کتاب رسمی: Vision 2
          </span>
        </div>
        <h1 style={{ margin: "0 0 0.5rem 0", fontSize: "1.6rem", fontWeight: 800, color: "var(--color-text, #0f172a)" }}>
          سرفصل‌های آموزشی زبان انگلیسی پایه یازدهم
        </h1>
        <p style={{ margin: 0, color: "var(--color-text-secondary, #475569)", fontSize: "0.95rem", lineHeight: 1.6 }}>
          در این بخش می‌توانید به صورت کاملاً آزاد و ماژولار وارد درس‌های کتاب Vision 2 شده و تمامی ۷ بخش آموزشی آن (Get Ready، مکالمه صوتی، واژگان و مترادف‌ها، ریدینگ تحلیلی، گرامر استقرایی، لیسنینگ و رایتینگ) را بدون استرس و با مثال‌های تعاملی یاد بگیرید.
        </p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
        {GRADE11_LESSONS.map((lesson) => {
          const isActive = lesson.status === "active";

          return (
            <div
              key={lesson.number}
              style={{
                background: "var(--color-surface, #ffffff)",
                border: isActive ? "2px solid #3b82f6" : "1px solid var(--color-border, #e2e8f0)",
                borderRadius: "14px",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: isActive ? "0 4px 12px rgba(59, 130, 246, 0.12)" : "none",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ fontWeight: 800, color: "#2563eb", fontSize: "0.9rem" }}>
                    درس شماره {lesson.number}
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "0.2rem 0.5rem",
                      borderRadius: "6px",
                      background: isActive ? "#dcfce7" : "#f1f5f9",
                      color: isActive ? "#15803d" : "#64748b",
                    }}
                  >
                    {isActive ? "آماده یادگیری (فعال)" : "به‌زودی"}
                  </span>
                </div>

                <h2 style={{ margin: "0 0 0.25rem 0", fontSize: "1.25rem", fontWeight: 800, color: "#0f172a" }}>
                  {lesson.titleFa}
                </h2>
                <div style={{ fontFamily: "var(--font-family-latin, sans-serif)", color: "#3b82f6", fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.75rem", direction: "ltr", textAlign: "right" }}>
                  {lesson.titleEn}
                </div>

                <div style={{ padding: "0.5rem 0.75rem", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "0.75rem", fontSize: "0.85rem" }}>
                  <strong style={{ color: "#334155" }}>مبحث گرامر: </strong>
                  <span style={{ color: "#475569" }}>{lesson.grammarTopic}</span>
                </div>

                <p style={{ margin: "0 0 1rem 0", color: "#64748b", fontSize: "0.85rem", lineHeight: 1.5 }}>
                  {lesson.description}
                </p>
              </div>

              <div>
                {isActive ? (
                  <Link
                    href={lesson.href}
                    style={{
                      display: "block",
                      textAlign: "center",
                      padding: "0.65rem 1rem",
                      background: "#2563eb",
                      color: "#ffffff",
                      borderRadius: "8px",
                      fontWeight: 700,
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      transition: "background 0.2s ease",
                    }}
                  >
                    شروع آموزش ۷ بخشی درس {lesson.number} ←
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    style={{
                      inlineSize: "100%",
                      padding: "0.65rem 1rem",
                      background: "#f1f5f9",
                      color: "#94a3b8",
                      borderRadius: "8px",
                      fontWeight: 600,
                      border: "none",
                      fontSize: "0.85rem",
                      cursor: "not-allowed",
                    }}
                  >
                    در حال تولید محتوا
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
