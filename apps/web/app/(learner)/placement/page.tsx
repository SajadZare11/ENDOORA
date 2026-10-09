import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/marketing/PublicShell";
import styles from "./placement.module.css";

export const metadata: Metadata = {
  title: "آزمون هوشمند تعیین سطح زبان انگلیسی | ایندورا",
  description: "سنجش جامع، انطباقی و بدون استرس در ۶ مهارت اصلی گرامر، لغت، ریدینگ، لیسنینگ، مکالمه و رایتینگ با گزارش استاندارد CEFR.",
};

const SKILLS_DATA = [
  {
    number: "۰۱",
    icon: "🎯",
    titleFa: "دستور زبان (Grammar)",
    titleEn: "Grammar & Structure",
    descFa: "ارزیابی انطباقی زمان‌ها، ترتیب ساختاری کلمات و الگوهای جمله‌سازی بدون حفظ فرمول‌های خسته‌کننده.",
  },
  {
    number: "۰۲",
    icon: "📚",
    titleFa: "واژگان (Vocabulary)",
    titleEn: "Vocabulary in Context",
    descFa: "سنجش دایره لغات فعال، کلمات پربسامد دانشگاهی و عبارات روزمره مورد نیاز برای مکالمه طبیعی.",
  },
  {
    number: "۰۳",
    icon: "📖",
    titleFa: "درک مطلب (Reading)",
    titleEn: "Reading Comprehension",
    descFa: "بررسی سرعت درک متن، استخراج پیام اصلی و یافتن جزئیات کلیدی در متون کوتاه و جذاب.",
  },
  {
    number: "۰۴",
    icon: "🎧",
    titleFa: "شنیداری (Listening)",
    titleEn: "Audio Listening Lab",
    descFa: "پخش فایل‌های صوتی شفاف با لهجه استاندارد برای سنجش درک مکالمات روزمره و کاری.",
  },
  {
    number: "۰۵",
    icon: "🎙️",
    titleFa: "گفتاری (Speaking)",
    titleEn: "Speech & Pronunciation",
    descFa: "تحلیل هوشمند لهجه، روانی کلام و انتقال مفهوم با کمک آزمایشگاه ضبط صدای ایندورا.",
  },
  {
    number: "۰۶",
    icon: "✍️",
    titleFa: "نگارش (Writing)",
    titleEn: "Structured Writing",
    descFa: "بررسی ساختار پاراگراف، املا، گرامر نوشتاری و پیوستگی منطقی جملات در حل مسائل واقعی.",
  },
];

const CEFR_LEVELS = [
  { level: "A1", labelFa: "مبتدی (Starter)", descFa: "آشنایی با عبارات ساده روزمره، معرفی خود و بیان نیازهای فوری." },
  { level: "A2", labelFa: "مقدماتی (Elementary)", descFa: "مکالمه ساده درباره موضوعات آشنا، زمان گذشته و برنامه‌های آینده." },
  { level: "B1", labelFa: "متوسط (Intermediate)", descFa: "بیان تجربیات، مکالمه در سفر، کار و دانشگاه و ابراز نظرات شخصی." },
  { level: "B2", labelFa: "فوق‌متوسط (Upper-Intermediate)", descFa: "مکالمه روان و بی‌وقفه با افراد بومی، نگارش گزارش و دفاع از دیدگاه‌ها." },
  { level: "C1", labelFa: "پیشرفته (Advanced)", descFa: "درک متون طولانی، مکالمه روان بدون مکث و توانایی دفاع از تحلیل‌های آکادمیک و حرفه‌ای." },
  { level: "C2", labelFa: "مسلط و حرفه‌ای (Proficient)", descFa: "تسلط کامل مانند متکلمین بومی، تمایز ظریف‌ترین سایه‌های معنایی و نگارش متون انتقادی." },
];

export default function PlacementLandingPage() {
  return (
    <PublicShell locale="fa" currentPath="/placement">
      <main className={styles.page} dir="rtl">
        <div className={styles.container}>
          {/* Hero Section */}
          <section className={styles.hero}>
            <div className={styles.heroTag}>
              ✨ سامانه سنجش و تعیین سطح اختصاصی اندورا
            </div>
            <h1>
              <span className={styles.heroBrandWrap}>
                <svg className={styles.heroSpark} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 2C12 7.523 7.523 12 2 12C7.523 12 12 16.477 12 22C12 16.477 16.477 12 22 12C16.477 12 12 7.523 12 2Z"
                    fill="url(#sparkGradLanding)"
                  />
                  <circle cx="12" cy="12" r="1.5" fill="#ffffff" opacity="0.9" />
                  <defs>
                    <linearGradient id="sparkGradLanding" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#06b6d4" />
                      <stop offset="1" stopColor="#0284c7" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className={styles.heroBrandText}>ایندورا،</span>
              </span>{" "}
              <span className={styles.heroSubText}>تعیین سطح دقیق</span>{" "}
              <span className={styles.heroAccent}>بدون استرس</span>
            </h1>
            <p>
              توی چند دقیقه، توانایی واقعی خودت رو در ۶ مهارت اصلی بسنج و کارنامه استاندارد CEFR همراه با کتاب آموزشی پیشنهادی و کلاس مناسبت رو تحویل بگیر.
            </p>

            <div className={styles.actionsRow} style={{ justifyContent: "center" }}>
              <Link href="/placement/demo" className={styles.button}>
                <span>شروع رایگان آزمون تعیین سطح</span>
                <span aria-hidden="true">←</span>
              </Link>
              <Link
                href="/placement/listening-ready"
                className={styles.button}
                style={{
                  background: "var(--color-surface)",
                  color: "var(--color-text)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                }}
              >
                <span>بررسی میکروفون و صدا</span>
                <span aria-hidden="true">🎧</span>
              </Link>
            </div>
          </section>

          {/* 6 Core Skills Feature Matrix */}
          <section className={styles.card} style={{ marginBlockEnd: "var(--space-8)" }}>
            <div style={{ textAlign: "center", marginBlockEnd: "var(--space-6)" }}>
              <span className={styles.heroTag}>ماتریس جامع ارزیابی</span>
              <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.85rem)", fontWeight: 800, margin: "var(--space-2) 0" }}>
                ۶ ستون اصلی سنجش هوشمند در ایندورا
              </h2>
              <p style={{ color: "var(--color-muted)", fontSize: "0.95rem", maxWidth: "42rem", margin: "0 auto" }}>
                برخلاف آزمون‌های سنتی که فقط گرامر تستی را می‌سنجند، سیستم انطباقی ایندورا توانایی عملی و ارتباطی واقعی شما را بررسی می‌کند.
              </p>
            </div>

            <div className={styles.featureGrid}>
              {SKILLS_DATA.map((skill) => (
                <div key={skill.number} className={styles.featureCard}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div className={styles.featureIcon}>{skill.icon}</div>
                    <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--color-action)" }}>
                      {skill.number}
                    </span>
                  </div>
                  <h3 className={styles.featureTitle}>{skill.titleFa}</h3>
                  <small style={{ color: "var(--color-muted)", fontFamily: "var(--font-family-latin)", direction: "ltr", textAlign: "start" }}>
                    {skill.titleEn}
                  </small>
                  <p className={styles.featureDesc}>{skill.descFa}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CEFR Benchmark Section */}
          <section className={styles.card} style={{ marginBlockEnd: "var(--space-8)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-3)", marginBlockEnd: "var(--space-4)" }}>
              <div>
                <span className={styles.heroTag}>استاندارد مرجع اروپایی CEFR</span>
                <h2 style={{ fontSize: "1.35rem", fontWeight: 800, margin: "var(--space-1) 0" }}>
                  مقیاس سطح‌بندی کارنامه ایندورا
                </h2>
              </div>
              <small style={{ color: "var(--color-muted)" }}>
                گزارش شفاف شواهد، بدون نمره صوری
              </small>
            </div>

            <div className={styles.ladderContainer}>
              {CEFR_LEVELS.map((item) => (
                <div key={item.level} className={styles.ladderRow}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                    <span className={styles.ladderBadge}>{item.level}</span>
                    <strong style={{ fontSize: "1rem" }}>{item.labelFa}</strong>
                  </div>
                  <span style={{ color: "var(--color-muted)", fontSize: "0.88rem" }}>
                    {item.descFa}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom Call to Action Card */}
          <section
            className={styles.card}
            style={{
              textAlign: "center",
              background: "linear-gradient(180deg, color-mix(in srgb, var(--color-action) 8%, var(--color-surface)), var(--color-surface))",
              border: "1px solid color-mix(in srgb, var(--color-action) 30%, var(--color-border))",
              padding: "clamp(var(--space-8), 5vw, var(--space-12))",
            }}
          >
            <div style={{ fontSize: "3rem", marginBlockEnd: "var(--space-2)" }}>🚀</div>
            <h2 style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.1rem)", fontWeight: 900, marginBlockEnd: "var(--space-3)" }}>
              آماده‌ای سطح واقعی زبانت رو بشناسی؟
            </h2>
            <p style={{ color: "var(--color-muted)", maxWidth: "38rem", margin: "0 auto var(--space-6)" }}>
              آزمون هوشمند انطباقی (CAT) ایندورا با مدل روان‌سنجی IRT سطح دقیق شما را در چارچوب CEFR می‌سنجد و بلافاصله کارنامه تحلیلی همراه با نقشه راه اختصاصی صادر می‌شود.
            </p>
            <Link href="/placement/demo" className={styles.button} style={{ minInlineSize: "16rem" }}>
              <span>ورود به آزمون تعیین سطح</span>
              <span aria-hidden="true">←</span>
            </Link>
          </section>
        </div>
      </main>
    </PublicShell>
  );
}
