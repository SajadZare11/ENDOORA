import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "زبان انگلیسی پایه دوازدهم (Vision 3) | ایندورا",
  description: "آموزش خط‌به‌خط و استقرایی تمامی دروس کتاب انگلیسی پایه دوازدهم دبیرستان همراه با تمارین، کارگاه هم‌آیی‌ها و آمادگی امتحان نهایی.",
};

const GRADE12_LESSONS = [
  {
    number: 1,
    titleFa: "حس قدردانی و احترام",
    titleEn: "Sense of Appreciation",
    grammarTopic: "جملات مجهول (Passive Voice در حال و گذشته ساده) و سوالات ضمیمه (Tag Questions)",
    status: "active",
    href: "/high-school/grade-12/lesson-1",
    description: "شامل آموزش ۷ بخشی: Get Ready احترام به بزرگان و قهرمانان ملی، مکالمه صوتی دکتر محمد قریب، واژگان و کارگاه هم‌آیی‌ها (Collocations)، ریدینگ احترام به والدین، گرامر استقرایی مجهول و تگ کوئسشن، تلفظ لحن تایید و تردید (↘/↗)، و نگارش جملات مرکب با and, but, or, so.",
    sectionsCount: 7,
  },
  {
    number: 2,
    titleFa: "فرهنگ لغت و جستجوی واژگان",
    titleEn: "Look it Up!",
    grammarTopic: "جملات موصولی (Relative Clauses با who, which, that) و شرطی نوع دوم (Conditional Type II)",
    status: "active",
    href: "/high-school/grade-12/lesson-2",
    description: "شامل آموزش ۷ بخشی: Get Ready لغت‌نامه‌ها و دانستنی‌های جالب، مکالمه صوتی مجید و معلم زبان، واژگان و کارگاه خانواده اجزای کلمات (Word Part Families)، ریدینگ راهنمای استفاده از دیکشنری، گرامر موصولی و شرطی نوع دوم، لحن خیزان/افتان، و نگارش ساختار پاراگراف و Topic Sentence.",
    sectionsCount: 7,
  },
  {
    number: 3,
    titleFa: "انرژی‌های تجدیدپذیر",
    titleEn: "Renewable Energy",
    grammarTopic: "مجهول با افعال کمکی (Modals Passive) و زمان گذشته کامل (Past Perfect Tense)",
    status: "active",
    href: "/high-school/grade-12/lesson-3",
    description: "شامل آموزش ۷ بخشی: Get Ready انرژی‌های تجدیدپذیر و توربین‌ها، مکالمه صوتی منجیل عماد و پدر، واژگان و کارگاه ضرب‌المثل‌ها (Proverbs)، ریدینگ زمین برای فرزندانمان، گرامر مجهول مدال و ماضی بعید، لحن توالی زمانی (before/after)، و نگارش پاراگراف استاندارد امتحان نهایی.",
    sectionsCount: 7,
  },
];

export default function Grade12OverviewPage() {
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
        <Link href="/" style={{ color: "var(--school-violet-base, #6d28d9)", textDecoration: "none", fontWeight: 600 }}>
          خانه
        </Link>
        <span>/</span>
        <Link href="/skills/school" style={{ color: "var(--school-violet-base, #6d28d9)", textDecoration: "none", fontWeight: 600 }}>
          زبان دبیرستان
        </Link>
        <span>/</span>
        <span aria-current="page" style={{ color: "var(--color-text, #0f172a)", fontWeight: 700 }}>
          پایه دوازدهم (Vision 3)
        </span>
      </nav>

      <header style={{ marginBottom: "2rem", borderBottom: "1px solid var(--color-border, #e2e8f0)", paddingBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <span style={{ background: "#fef3c7", color: "#b45309", fontWeight: 700, fontSize: "0.8rem", padding: "0.25rem 0.65rem", borderRadius: "9999px", border: "1px solid #fde68a" }}>
            متوسطه دوم • پایه دوازدهم
          </span>
          <span style={{ background: "#f0fdf4", color: "#166534", fontWeight: 700, fontSize: "0.8rem", padding: "0.25rem 0.65rem", borderRadius: "9999px" }}>
            کتاب رسمی: Vision 3
          </span>
        </div>
        <h1 style={{ margin: "0 0 0.5rem 0", fontSize: "1.6rem", fontWeight: 800, color: "var(--color-text, #0f172a)" }}>
          سرفصل‌های آموزشی زبان انگلیسی پایه دوازدهم
        </h1>
        <p style={{ margin: 0, color: "var(--color-text-secondary, #475569)", fontSize: "0.95rem", lineHeight: 1.6 }}>
          در این بخش می‌توانید به صورت کاملاً آزاد و ماژولار وارد درس‌های کتاب Vision 3 شده و تمامی ۷ بخش آموزشی آن (Get Ready، مکالمه صوتی، واژگان و کارگاه هم‌آیی‌ها، ریدینگ تحلیلی، گرامر استقرایی مجهول، لیسنینگ و لحن سوالات ضمیمه، و رایتینگ جملات مرکب) را بدون استرس یاد بگیرید.
        </p>
      </header>

      {/* Tamrin 20 Banner */}
      <section
        style={{
          background: "linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #7c3aed 100%)",
          color: "#ffffff",
          borderRadius: "14px",
          padding: "1.5rem",
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.25rem",
          boxShadow: "0 10px 28px -4px rgba(109, 40, 217, 0.35)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
            <span
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                fontSize: "0.75rem",
                fontWeight: 700,
                padding: "0.2rem 0.6rem",
                borderRadius: "999px",
                backdropFilter: "blur(4px)",
              }}
            >
              بانک آزمون‌های نهایی
            </span>
            <span
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                color: "#ffffff",
                fontSize: "0.75rem",
                fontWeight: 700,
                padding: "0.2rem 0.6rem",
                borderRadius: "999px",
                boxShadow: "0 2px 8px rgba(245, 158, 11, 0.4)",
              }}
            >
              ⭐ کسب نمره ۲۰
            </span>
          </div>
          <h2 style={{ margin: "0.25rem 0", fontSize: "1.35rem", fontWeight: 800 }}>
            تمرین تا ۲۰ (بیش از ۱۰۰۰ سوال امتحانات نهایی Vision 3)
          </h2>
          <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.95, lineHeight: 1.5, maxInlineSize: "40rem" }}>
            تفکیک درس به درس در ۵ مهارت شنیداری، واژگان، گرامر، درک مطلب و نگارش با فیدبک آنی سبز/قرمز و شروع با ۲۰ سوال طلایی.
          </p>
        </div>

        <Link
          href="/high-school/grade-12/tamrin20"
          style={{
            background: "#ffffff",
            color: "#5b21b6",
            padding: "0.75rem 1.25rem",
            borderRadius: "10px",
            fontWeight: 800,
            fontSize: "0.95rem",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            whiteSpace: "nowrap",
          }}
        >
          ورود به تمرین تا ۲۰ دوازدهم ←
        </Link>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
        {GRADE12_LESSONS.map((lesson) => {
          const isActive = lesson.status === "active";

          return (
            <div
              key={lesson.number}
              style={{
                background: "var(--color-surface, #ffffff)",
                border: isActive ? "2px solid #5b21b6" : "1px solid var(--color-border, #e2e8f0)",
                borderRadius: "14px",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: isActive ? "0 4px 14px rgba(91, 33, 182, 0.25)" : "none",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ fontWeight: 800, color: "#5b21b6", fontSize: "0.9rem" }}>
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

                <h2 style={{ margin: "0 0 0.25rem 0", fontSize: "1.25rem", fontWeight: 800, color: "var(--color-text, #0f172a)" }}>
                  {lesson.titleFa}
                </h2>
                <div style={{ fontFamily: "var(--font-family-latin, sans-serif)", color: "#6d28d9", fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.75rem", direction: "ltr", textAlign: "right" }}>
                  {lesson.titleEn}
                </div>

                <div style={{ padding: "0.5rem 0.75rem", background: "var(--color-canvas, #f8fafc)", borderRadius: "8px", border: "1px solid var(--color-border, #e2e8f0)", marginBottom: "0.75rem", fontSize: "0.85rem" }}>
                  <strong style={{ color: "var(--color-text, #334155)" }}>مبحث گرامر: </strong>
                  <span style={{ color: "var(--color-text-secondary, #475569)" }}>{lesson.grammarTopic}</span>
                </div>

                <p style={{ margin: "0 0 1rem 0", color: "var(--color-muted, #64748b)", fontSize: "0.85rem", lineHeight: 1.5 }}>
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
                      background: "linear-gradient(135deg, #5b21b6 0%, #4c1d95 100%)",
                      color: "#ffffff",
                      borderRadius: "8px",
                      fontWeight: 700,
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      boxShadow: "0 4px 12px rgba(91, 33, 182, 0.28)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
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
