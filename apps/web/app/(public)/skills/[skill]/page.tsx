import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../skills.module.css";

interface SkillDetail {
  slug: string;
  titleFa: string;
  titleEn: string;
  heroSummaryFa: string;
  cefrRange: string;
  icon: string;
  l1ChallengeTitle: string;
  l1ChallengeDescription: string;
  syllabusTopics: Array<{ titleFa: string; titleEn: string; level: string }>;
  recommendedCourses: Array<{ slug: string; title: string; level: string }>;
}

const SKILL_DETAILS: Record<string, SkillDetail> = {
  grammar: {
    slug: "grammar",
    titleFa: "دستور زبان و گرامر",
    titleEn: "Grammar & Structure",
    heroSummaryFa: "تسلط کاربردی بر زمان‌ها، ساختارهای شرطی، مجهول و نقل‌قول‌ها بر مبنای نقش ارتباطی آن‌ها در مکالمه و نگارش.",
    cefrRange: "A1 تا C1",
    icon: "⚡",
    l1ChallengeTitle: "تداخل زبانی فارسی و انگلیسی در زمان‌ها",
    l1ChallengeDescription: "استفاده نابه‌جا از گذشته ساده به جای حال کامل، حذف حروف اضافه وابسته و ساختارهای اشتباه ضمایر موصولی از چالش‌های شایع فارسی‌زبانان است که در این بخش به‌صورت ریشه‌ای برطرف می‌شوند.",
    syllabusTopics: [
      { titleFa: "تفاوت حال ساده و استمراری در افعال حالت (Stative Verbs)", titleEn: "Present Simple vs Continuous with Stative Verbs", level: "A2" },
      { titleFa: "رمزگشایی حال کامل و گذشته ساده", titleEn: "Present Perfect vs Past Simple", level: "B1" },
      { titleFa: "جملات شرطی نوع دوم و سوم در تحلیل موقعیت‌ها", titleEn: "Second and Third Conditionals in Analytical Contexts", level: "B2" },
      { titleFa: "ساختارهای وارونگی (Inversion) برای تأکید کلام", titleEn: "Inversion for Advanced Emphasis", level: "C1" },
    ],
    recommendedCourses: [
      { slug: "konkur-english-vision-mastery", title: "دوره جامع گرامر کنکور سراسری و دبیرستان", level: "B1" },
      { slug: "ielts-academic-speaking-and-writing-mastery", title: "مسترکلاس دقت گرامری در رایتینگ آیلتس", level: "B2" },
    ],
  },
  listening: {
    slug: "listening",
    titleFa: "مهارت شنیداری و ادراک صوتی",
    titleEn: "Listening & Acoustic Perception",
    heroSummaryFa: "تربیت سیستم شنیداری برای تشخیص پیوستگی گفتار (Connected Speech)، لهجه‌های بین‌المللی و کاهش تکیه صوتی در پادکست‌ها و مکالمات طبیعی.",
    cefrRange: "A2 تا C2",
    icon: "🎧",
    l1ChallengeTitle: "چالش تفکیک مرز واژه‌ها در گفتار پیوسته",
    l1ChallengeDescription: "فارسی‌زبانان به دلیل ساختار هجایی متفاوت زبان مادری، واژه‌های انگلیسی را به صورت مجزا جستجو می‌کنند؛ آموزش پیوندها (Linking) و حذف آواها (Elision) این مانع ادراکی را حل می‌کند.",
    syllabusTopics: [
      { titleFa: "اتصال صامت به مصوت در جملات سریع", titleEn: "Consonant-to-Vowel Linking in Fluent Speech", level: "B1" },
      { titleFa: "کاهش صدای شوآ (/ə/) در افعال کمکی و حروف اضافه", titleEn: "Schwa Reduction in Auxiliary Verbs and Prepositions", level: "B2" },
      { titleFa: "تکنیک‌های یادداشت‌برداری در سخنرانی‌های آکادمیک", titleEn: "Active Note-Taking for Academic Lectures", level: "C1" },
    ],
    recommendedCourses: [
      { slug: "ielts-academic-speaking-and-writing-mastery", title: "شنیداری پیشرفته آزمون آیلتس (بخش ۳ و ۴)", level: "B2" },
    ],
  },
  reading: {
    slug: "reading",
    titleFa: "مهارت خواندن و درک مطلب",
    titleEn: "Reading Comprehension",
    heroSummaryFa: "افزایش سرعت مطالعه، مهارت‌های خواندن سریع، تحلیل ساختار متون تحلیلی و استخراج سریع فکت‌ها.",
    cefrRange: "A2 تا C1",
    icon: "📖",
    l1ChallengeTitle: "تله ترجمه کلمه به کلمه",
    l1ChallengeDescription: "ترجمه ذهنی تمام کلمات سرعت درک مطلب را به شدت کاهش می‌دهد. در اندورا تکنیک‌های خواندن بلوکی (Chunking) و پیش‌بینی محتوا آموزش داده می‌شود.",
    syllabusTopics: [
      { titleFa: "تکنیک مرور اجمالی (Skimming) برای دستیابی به ایده اصلی", titleEn: "Skimming for Gist and Paragraph Macro-Structure", level: "B1" },
      { titleFa: "تکنیک پویش (Scanning) برای پاسخ به سؤالات جزئیات", titleEn: "Scanning for Names, Dates, and Factual Evidence", level: "B1" },
      { titleFa: "استنباط دیدگاه و لحن نویسنده (Inference Skills)", titleEn: "Author Tone and Implied Meaning in Academic Texts", level: "B2" },
    ],
    recommendedCourses: [
      { slug: "konkur-english-vision-mastery", title: "تکنیک‌های درک مطلب و کلوزتست کنکور", level: "B1" },
    ],
  },
  writing: {
    slug: "writing",
    titleFa: "مهارت نگارش و رایتینگ",
    titleEn: "Writing & Composition",
    heroSummaryFa: "اصول نگارش پاراگراف‌های استدلالی منسجم، نامه‌نگاری اداری، تسک‌های آیلتس و مقالات آکادمیک.",
    cefrRange: "A2 تا C1",
    icon: "✍️",
    l1ChallengeTitle: "عدم انسجام ساختار منطقی متن",
    l1ChallengeDescription: "نوشتن به سبک فارسی توصیفی اغلب در رایتینگ انگلیسی منجر به پرش موضوعی می‌شود. استفاده از چارچوب PEEL تضمین‌کننده نظم استدلالی است.",
    syllabusTopics: [
      { titleFa: "ساختار پاراگراف استدلالی با مدل PEEL", titleEn: "Persuasive Paragraph Structure with PEEL", level: "B1" },
      { titleFa: "کلمات ربط و انتقال منطقی میان جملات (Cohesion)", titleEn: "Logical Cohesive Devices & Transition Words", level: "B2" },
      { titleFa: "نگارش مقدمه و نتیجه‌گیری قدرتمند در مقالات تحلیلی", titleEn: "Powerful Introductions and Conclusions in Academic Essays", level: "B2" },
    ],
    recommendedCourses: [
      { slug: "ielts-academic-speaking-and-writing-mastery", title: "مسترکلاس رایتینگ تسک ۲ آیلتس (نمره ۷+)", level: "B2" },
    ],
  },
  speaking: {
    slug: "speaking",
    titleFa: "مهارت گفتاری و مکالمه",
    titleEn: "Speaking & Spoken Fluency",
    heroSummaryFa: "تقویت روانی کلام، بداهه‌گویی در موقعیت‌های واقعی، مهار استرس، و غلبه بر مکث‌های طولانی.",
    cefrRange: "A1 تا C2",
    icon: "🎙️",
    l1ChallengeTitle: "توقف به خاطر وسواس گرامری",
    l1ChallengeDescription: "تلاش برای گفتن جملات بی‌نقص باعث مکث‌های طولانی می‌شود؛ یادگیری تکنیک‌های خرید زمان (Fillers) روانی کلام را بازمی‌گرداند.",
    syllabusTopics: [
      { titleFa: "عبارات پرکننده طبیعی برای فکر کردن در مکالمه", titleEn: "Natural Conversation Fillers to Buy Thinking Time", level: "A2" },
      { titleFa: "بیان توصیفی کلمات فراموش‌شده (Paraphrasing)", titleEn: "Paraphrasing Strategies for Unknown Nouns", level: "B1" },
      { titleFa: "بحث و تبادل نظر در موضوعات انتزاعی و پیچیده", titleEn: "Debating Abstract Concepts with Spoken Nuance", level: "B2" },
    ],
    recommendedCourses: [
      { slug: "ielts-academic-speaking-and-writing-mastery", title: "تمرین‌های اسپیکینگ مصاحبه آیلتس", level: "B2" },
    ],
  },
  vocabulary: {
    slug: "vocabulary",
    titleFa: "واژگان و اصطلاحات کاربردی",
    titleEn: "Vocabulary & Lexical Chunks",
    heroSummaryFa: "یادگیری زنجیره‌ای واژگان بر مبنای همنشینی‌ها (Collocations)، افعال دوکلمه‌ای (Phrasal Verbs) و سیستم جعبه لایتنر هوشمند.",
    cefrRange: "A1 تا C2",
    icon: "💡",
    l1ChallengeTitle: "حفظ واژگان منفرد بدون بافت جمله",
    l1ChallengeDescription: "حفظ لیست‌های تکی کلمات مانع استفاده از آن‌ها در صحبت می‌شود. در اندورا واژه‌ها در قالب ترکیب‌های دوتایی و سه‌تایی تثبیت می‌شوند.",
    syllabusTopics: [
      { titleFa: "همنشینی‌های طلایی فعل و اسم با Do و Make", titleEn: "Essential Verb-Noun Collocations with Do and Make", level: "A2" },
      { titleFa: "افعال دوکلمه‌ای روزمره در محیط‌های کاری و اداری", titleEn: "High-Frequency Phrasal Verbs for Workplaces", level: "B1" },
      { titleFa: "واژگان آکادمیک عمومی بر اساس لیست AWL", titleEn: "Academic Word List (AWL) Core Terminology", level: "B2" },
    ],
    recommendedCourses: [
      { slug: "konkur-english-vision-mastery", title: "لغات پرتکرار و ریشه‌شناسی کنکور سراسری", level: "B1" },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(SKILL_DETAILS).map((skill) => ({ skill }));
}

export async function generateMetadata({ params }: { params: Promise<{ skill: string }> }): Promise<Metadata> {
  const { skill } = await params;
  const detail = SKILL_DETAILS[skill];
  if (!detail) return {};
  return {
    title: `${detail.titleFa} | مهارت‌های اندورا`,
    description: detail.heroSummaryFa,
  };
}

export default async function SkillDetailPage({ params }: { params: Promise<{ skill: string }> }) {
  const { skill } = await params;
  const detail = SKILL_DETAILS[skill];
  if (!detail) notFound();

  return (
    <div className={styles.container} dir="rtl">
      <Link href="/skills" style={{ color: "var(--color-link)", fontWeight: 700, textDecoration: "none", display: "inline-block", marginBottom: "var(--space-4)" }}>
        ← بازگشت به مرکز مهارت‌ها
      </Link>

      <header className={styles.heroHeader}>
        <span className={styles.heroBadge}>سطح هدف: {detail.cefrRange}</span>
        <h1 className={styles.heroTitle}>آموزش {detail.titleFa}</h1>
        <p className={styles.heroDescription}>{detail.heroSummaryFa}</p>
      </header>

      {/* Persian L1 Interference Callout */}
      <section className={styles.noticeBanner} aria-label="تحلیل خطای فارسی‌زبانان">
        <span style={{ fontSize: "1.5rem" }}>💡</span>
        <div>
          <strong style={{ color: "var(--color-text)" }}>{detail.l1ChallengeTitle}:</strong>
          <p style={{ margin: 0, marginTop: "0.25rem", lineHeight: "var(--line-height-body)" }}>
            {detail.l1ChallengeDescription}
          </p>
        </div>
      </section>

      {/* Curriculum Topics */}
      <section style={{ marginBlockEnd: "var(--space-10)" }}>
        <h2 style={{ fontSize: "var(--font-size-h2)", fontWeight: 800, marginBottom: "var(--space-4)" }}>
          سرفصل‌های آموزشی و دروس کلیدی
        </h2>
        <div style={{ display: "grid", gap: "var(--space-3)" }}>
          {detail.syllabusTopics.map((topic, idx) => (
            <div
              key={idx}
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-card)",
                padding: "var(--space-4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "var(--space-4)",
              }}
            >
              <div>
                <h3 style={{ fontSize: "var(--font-size-body)", fontWeight: 700, margin: 0, marginBottom: "0.25rem" }}>
                  {topic.titleFa}
                </h3>
                <div style={{ fontSize: "var(--font-size-small)", color: "var(--color-text-muted)", direction: "ltr", textAlign: "right", fontFamily: "var(--font-family-latin)" }}>
                  {topic.titleEn}
                </div>
              </div>
              <span className={styles.cefrBadge}>{topic.level}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Courses */}
      <section style={{ marginBlockEnd: "var(--space-10)" }}>
        <h2 style={{ fontSize: "var(--font-size-h2)", fontWeight: 800, marginBottom: "var(--space-4)" }}>
          دوره‌های پیشنهادی برای این مهارت
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(18rem, 1fr))", gap: "var(--space-4)" }}>
          {detail.recommendedCourses.map((c) => (
            <div
              key={c.slug}
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-card)",
                padding: "var(--space-5)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <span className={styles.cefrBadge}>{c.level}</span>
                <h3 style={{ fontSize: "var(--font-size-body)", fontWeight: 700, marginBlock: "var(--space-2)" }}>
                  {c.title}
                </h3>
              </div>
              <Link
                href={`/courses/${c.slug}`}
                style={{
                  color: "var(--color-action)",
                  fontWeight: 700,
                  textDecoration: "none",
                  marginTop: "var(--space-3)",
                  display: "inline-block",
                }}
              >
                مشاهده سرفصل دوره ←
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
