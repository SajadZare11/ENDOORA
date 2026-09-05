import type { Metadata } from "next";
import Link from "next/link";
import styles from "./skills.module.css";

export const metadata: Metadata = {
  title: "مرکز مهارت‌های زبان انگلیسی | اندورا",
  description: "آموزش جامع مهارت‌های شش‌گانه زبان انگلیسی، گرامر، واژگان، فرهنگ کاربردی و کتب درسی دبیرستان و کنکور.",
};

interface SkillSummary {
  slug: string;
  titleFa: string;
  titleEn: string;
  desc: string;
  icon: string;
  count: number;
}

const SKILLS_LIST: SkillSummary[] = [
  { slug: "grammar", titleFa: "دستور زبان و گرامر", titleEn: "Grammar", desc: "آموزش تحلیلی ساختارها و زمان‌های افعال با رویکرد کاربردی در مکالمه و آزمون.", icon: "⚡", count: 24 },
  { slug: "listening", titleFa: "مهارت شنیداری", titleEn: "Listening", desc: "رمزگشایی گفتار متصل، کاهش تکیه صوتی، و تقویت درک شنیداری لهجه‌های مختلف.", icon: "🎧", count: 18 },
  { slug: "reading", titleFa: "خواندن و درک مطلب", titleEn: "Reading", desc: "تکنیک‌های مرور اجمالی (Skimming) و پویش (Scanning) برای متون آکادمیک و عمومی.", icon: "📖", count: 16 },
  { slug: "writing", titleFa: "نگارش و رایتینگ", titleEn: "Writing", desc: "چارچوب‌های استاندارد مقاله‌نویسی (PEEL)، پاراگراف‌های استدلالی و تسک‌های آیلتس.", icon: "✍️", count: 20 },
  { slug: "speaking", titleFa: "مکالمه و روانی کلام", titleEn: "Speaking", desc: "راهکارهای غلبه بر مکث در صحبت کردن و حفظ زنجیره کلام در موقعیت‌های واقعی.", icon: "🎙️", count: 22 },
  { slug: "vocabulary", titleFa: "واژگان و اصطلاحات", titleEn: "Vocabulary", desc: "یادگیری طبیعی کلمات در قالب همنشینی‌ها (Collocations) و خوشه‌های معنایی.", icon: "💡", count: 35 },
  { slug: "culture", titleFa: "فرهنگ و ارتباطات", titleEn: "Culture & Events", desc: "آداب گپ‌وگفت‌های اجتماعی (Small Talk)، هنجارهای رفتاری و نکات بین‌فرهنگی.", icon: "🌐", count: 14 },
  { slug: "school", titleFa: "دبیرستان و کنکور", titleEn: "High School & Konkur", desc: "تحلیل درس‌به‌درس کتب Vision 1, 2, 3 و تکنیک‌های تست‌زنی کنکور سراسری.", icon: "🎓", count: 28 },
];

const FEATURED_ARTICLES = [
  {
    slug: "mastering-present-perfect-vs-past-simple",
    titleFa: "تفاوت کاربردی حال کامل و گذشته ساده در مکالمه روزمره",
    titleEn: "Present Perfect vs. Past Simple: The Definitive Guide",
    summaryFa: "چگونه بدون تردید بین زمان گذشته ساده و حال کامل در مکالمات و آزمون‌ها انتخاب درستی داشته باشیم.",
    cefr: "B1",
    skill: "grammar",
    readMinutes: 6,
    isPremium: false,
    author: "تیم علمی اندورا",
  },
  {
    slug: "connected-speech-elision-linking",
    titleFa: "رمزگشایی گفتار متصل: پدیده پیوند صداها و الیژن در مکالمه",
    titleEn: "Connected Speech Decoded: Linking & Elision in Daily Talk",
    summaryFa: "چرا افراد بومی صداها را به هم پیوند می‌زنند و چگونه گوش خود را برای شنیدن آن هماهنگ کنیم.",
    cefr: "B2",
    skill: "listening",
    readMinutes: 8,
    isPremium: true,
    author: "لابراتوار آکوستیک اندورا",
  },
  {
    slug: "vision-1-grade-10-grammar-and-vocabulary-mastery",
    titleFa: "مرور جامع زبان انگلیسی دهم (Vision 1) همراه با تست‌های کنکور",
    titleEn: "Vision 1 (Grade 10): Core Grammar & Konkur Prep",
    summaryFa: "بررسی گرامر Will و Be going to، واژگان درس اول و تحلیل سؤالات چهارگزینه‌ای کنکور سراسری.",
    cefr: "A2",
    skill: "school",
    readMinutes: 10,
    isPremium: false,
    author: "دپارتمان کتب درسی دبیرستان",
  },
  {
    slug: "navigating-small-talk-in-english-culture",
    titleFa: "فرهنگ گفتگوی کوتاه (Small Talk) در تعاملات بین‌المللی",
    titleEn: "The Art of Small Talk: Cultural Norms & Polite Chats",
    summaryFa: "موضوعات امن و هنجارهای اجتماعی برای شروع گفتگوهای خودمانی با انگلیسی‌زبانان.",
    cefr: "B1",
    skill: "culture",
    readMinutes: 5,
    isPremium: false,
    author: "گروه مطالعات بین‌فرهنگی",
  },
];

export default function SkillsHubPage() {
  return (
    <div className={styles.container} dir="rtl">
      <header className={styles.heroHeader}>
        <span className={styles.heroBadge}>پایگاه دانش یادگیری زبان</span>
        <h1 className={styles.heroTitle}>مهارت‌های زبان انگلیسی اندورا</h1>
        <p className={styles.heroDescription}>
          مجموعه مقالات آموزشی تألیفی، دروس تعاملی، پادکست‌ها و راهنماهای کاربردی برای تسلط گام‌به‌گام بر مهارت‌های زبان بر اساس استاندارد بین‌المللی CEFR.
        </p>
      </header>

      <section className={styles.noticeBanner} aria-label="شفافیت آموزشی">
        <span style={{ fontSize: "1.25rem" }}>🛡️</span>
        <div>
          <strong>اصل شفافیت آموزشی و حقوق مؤلفان (قاعده ۸ قانون اساسی محصول):</strong>
          <p style={{ margin: 0, marginTop: "0.25rem" }}>
            تمام محتواهای آموزشی این مرکز به‌صورت مستقل و توسط اساتید اندورا تدوین شده‌اند و هیچ‌گونه کپی‌برداری از منابع تجاری ثالث وجود ندارد.
          </p>
        </div>
      </section>

      {/* Skills Categories Grid */}
      <section aria-label="دسته‌بندی مهارت‌ها">
        <div className={styles.skillsGrid}>
          {SKILLS_LIST.map((skill) => (
            <Link
              key={skill.slug}
              href={skill.slug === "culture" ? "/skills/culture" : skill.slug === "school" ? "/skills/school" : `/skills/${skill.slug}`}
              className={styles.skillCard}
            >
              <div>
                <div className={styles.skillCardHeader}>
                  <div className={styles.skillIconBox}>{skill.icon}</div>
                  <span className={styles.skillCountBadge}>{skill.count} درس</span>
                </div>
                <h2 className={styles.skillTitleFa}>{skill.titleFa}</h2>
                <div className={styles.skillTitleEn}>{skill.titleEn}</div>
                <p className={styles.articleSummary}>{skill.desc}</p>
              </div>
              <div className={styles.skillFooter}>
                <span>ورود به مرکز آموزش</span>
                <span>←</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Educational Articles */}
      <section className={styles.feedSection} aria-label="مقالات و درس‌های برگزیده">
        <div className={styles.feedHeader}>
          <h2 className={styles.feedTitle}>درس‌های منتخب و کاربردی</h2>
          <div className={styles.filterGroup}>
            <Link href="/courses" className={styles.filterBtn}>
              مشاهده دوره‌های کامل
            </Link>
            <Link href="/skills/school" className={styles.filterBtn}>
              بخش ویژه کنکور و دبیرستان
            </Link>
            <Link href="/skills/culture" className={styles.filterBtn}>
              فرهنگ و مناسبت‌ها
            </Link>
          </div>
        </div>

        <div className={styles.articlesGrid}>
          {FEATURED_ARTICLES.map((art) => (
            <article key={art.slug} className={styles.articleCard}>
              <div>
                <div className={styles.articleMeta}>
                  <span className={styles.cefrBadge}>{art.cefr}</span>
                  {art.isPremium && <span className={styles.premiumBadge}>ویژه</span>}
                  <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-text-muted)" }}>
                    {art.readMinutes} دقیقه مطالعه
                  </span>
                </div>
                <h3 className={styles.articleTitleFa}>{art.titleFa}</h3>
                <div className={styles.articleTitleEn}>{art.titleEn}</div>
                <p className={styles.articleSummary}>{art.summaryFa}</p>
              </div>
              <div className={styles.articleFooter}>
                <span>{art.author}</span>
                <Link
                  href={`/skills/${art.skill}`}
                  style={{ color: "var(--color-action)", fontWeight: 700, textDecoration: "none" }}
                >
                  مشاهده درس ←
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
