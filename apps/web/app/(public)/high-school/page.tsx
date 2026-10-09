import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "زبان دبیرستان | ایندورا",
  description: "آموزش جامع و تعاملی کتب زبان انگلیسی دبیرستان (پایه‌های دهم، یازدهم و دوازدهم).",
};

const HIGH_SCHOOL_GRADES = [
  {
    grade: "پایه دهم (Grade 10)",
    book: "Vision 1",
    cefr: "A2",
    href: "/high-school/grade-10",
    status: "active",
    highlight: "تمام ۴ درس پایه دهم (نجات طبیعت، شگفتی‌های خلقت، ارزش دانش، جهان‌گردی) کاملاً آماده و تعاملی هستند.",
    description: "شامل ۴ درس جامع: نجات طبیعت، شگفتی‌های خلقت، ارزش دانش، و ایران‌گردی و جهان‌گردی.",
  },
  {
    grade: "پایه یازدهم (Grade 11)",
    book: "Vision 2",
    cefr: "B1",
    href: "/high-school/grade-11",
    status: "active",
    highlight: "تمام ۳ درس پایه یازدهم (شناخت مردم، سبک زندگی سالم، هنر و فرهنگ) کاملاً آماده و تعاملی هستند.",
    description: "شامل ۳ درس تخصصی برای ارتقای دامنه واژگان و مهارت درک مطلب کنکور و نهایی.",
  },
  {
    grade: "پایه دوازدهم (Grade 12)",
    book: "Vision 3",
    cefr: "B1+",
    href: "/high-school/grade-12",
    status: "active",
    highlight: "تمام ۳ درس پایه دوازدهم (حس قدردانی، فرهنگ لغت و انرژی‌های تجدیدپذیر) کاملاً آماده، استقرایی و تعاملی هستند.",
    description: "تمرکز ویژه بر امتحانات نهایی خرداد، تست‌های کنکور سراسری، گرامر مجهول و شرطی، کارگاه ضرب‌المثل‌ها و پاراگراف‌نویسی کامل.",
  },
];

export default function HighSchoolRootPage() {
  return (
    <div style={{ maxInlineSize: "1050px", marginInline: "auto", padding: "1.5rem 1rem", direction: "rtl" }}>
      <header style={{ marginBottom: "2rem", borderBottom: "1px solid var(--color-border, #e2e8f0)", paddingBottom: "1rem" }}>
        <span style={{ background: "#eff6ff", color: "#2563eb", fontWeight: 700, fontSize: "0.8rem", padding: "0.25rem 0.65rem", borderRadius: "9999px" }}>
          مرکز آموزش دوره دوم متوسطه
        </span>
        <h1 style={{ margin: "0.5rem 0", fontSize: "1.75rem", fontWeight: 800, color: "var(--color-text, #0f172a)" }}>
          بخش زبان انگلیسی دبیرستان (Vision ۱، ۲ و ۳)
        </h1>
        <p style={{ margin: 0, color: "var(--color-text-secondary, #475569)", fontSize: "0.95rem", lineHeight: 1.6 }}>
          پایه تحصیلی مورد نظر خود را انتخاب کنید تا به آموزش‌های استقرایی، حل تمارین خط‌به‌خط و کارگاه‌های صوتی تعاملی دسترسی داشته باشید.
        </p>
      </header>

      {/* Featured Tamrin 20 Card */}
      <section
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
          color: "#ffffff",
          borderRadius: "14px",
          padding: "1.5rem",
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.25rem",
          boxShadow: "0 8px 20px -4px rgba(37, 99, 235, 0.25)",
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
              }}
            >
              بخش ویژه امتحانات نهایی
            </span>
            <span
              style={{
                background: "#22c55e",
                fontSize: "0.75rem",
                fontWeight: 700,
                padding: "0.2rem 0.6rem",
                borderRadius: "999px",
              }}
            >
              زبان دوازدهم (Vision 3)
            </span>
          </div>
          <h2 style={{ margin: "0.25rem 0", fontSize: "1.35rem", fontWeight: 800 }}>
            تمرین تا ۲۰ (بانک تعاملی بیش از ۱۰۰۰ سوال امتحانات نهایی)
          </h2>
          <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.95, lineHeight: 1.5, maxInlineSize: "40rem" }}>
            حل درس به درس و مهارت به مهارت (شنیداری با صوت، واژگان، گرامر، درک مطلب، نگارش) با تصحیح هوشمند، توضیحات تکمیلی، و شروع با ۲۰ سوال طلایی.
          </p>
        </div>

        <Link
          href="/high-school/grade-12/tamrin20"
          style={{
            background: "#ffffff",
            color: "#1d4ed8",
            padding: "0.75rem 1.25rem",
            borderRadius: "10px",
            fontWeight: 800,
            fontSize: "0.95rem",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            whiteSpace: "nowrap",
          }}
        >
          ورود به تمرین تا ۲۰ دوازدهم ←
        </Link>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: "1.25rem" }}>
        {HIGH_SCHOOL_GRADES.map((g, idx) => {
          const isActive = g.status === "active";

          return (
            <div
              key={idx}
              style={{
                background: "var(--color-surface, #ffffff)",
                border: isActive ? "2px solid #2563eb" : "1px solid var(--color-border, #e2e8f0)",
                borderRadius: "14px",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: isActive ? "0 4px 14px rgba(37, 99, 235, 0.15)" : "none",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2563eb" }}>
                    کتاب درسی: {g.book}
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
                    {isActive ? "فعال" : "به‌زودی"}
                  </span>
                </div>

                <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1.3rem", fontWeight: 800, color: "#0f172a" }}>
                  {g.grade}
                </h2>

                <p style={{ margin: "0 0 0.75rem 0", color: "#475569", fontSize: "0.85rem", lineHeight: 1.5 }}>
                  {g.description}
                </p>

                <div style={{ padding: "0.5rem 0.75rem", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "1rem", fontSize: "0.8rem", color: "#1e293b" }}>
                  💡 <strong>نکته: </strong>{g.highlight}
                </div>
              </div>

              <div>
                {isActive ? (
                  <Link
                    href={g.href}
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
                    }}
                  >
                    ورود به دروس {g.book} ({g.grade.split(" ")[0]} {g.grade.split(" ")[1]}) ←
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
                    به‌زودی در دسترس قرار می‌گیرد
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
