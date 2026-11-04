import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/marketing/PublicShell";
import styles from "./school.module.css";

export const metadata: Metadata = {
  title: "مرکز آموزش زبان دبیرستان و کنکور سراسری | ایندورا",
  description:
    "آموزش خط‌به‌خط کتب درسی Vision 1, Vision 2, Vision 3، بانک سوالات امتحانات نهایی خرداد و شهریور، و تکنیک‌های تست‌زنی کنکور سراسری زبان انگلیسی.",
};

interface LessonItem {
  num: string;
  title: string;
  grammar: string;
}

interface GradeData {
  grade: string;
  bookTitle: string;
  gradeNum: string;
  slug: string;
  cefr: string;
  lessonsCount: string;
  description: string;
  lessons: LessonItem[];
  konkurFocus: string;
  href: string;
  btnLabel: string;
}

const STATS = [
  { label: "پایه‌های تحصیلی", value: "۳ پایه", sub: "دهم، یازدهم و دوازدهم" },
  { label: "دروس تخصصی", value: "۱۰ درس", sub: "آموزش خط‌به‌خط و استقرایی" },
  { label: "بانک سوالات نهایی", value: "+۱۰۰۰ سوال", sub: "تفکیک‌شده با پاسخ تشریحی" },
  { label: "مهارت‌های استاندارد", value: "۵ مهارت", sub: "شنیداری، لغات، گرامر، درک، نگارش" },
];

const GRADES: GradeData[] = [
  {
    grade: "پایه دهم دبیرستان",
    bookTitle: "Vision 1",
    gradeNum: "۱۰",
    slug: "vision_1",
    cefr: "A2",
    lessonsCount: "۴ درس جامع",
    description: "پایه‌ریزی واژگان بنیادین، قواعد زمان‌های آینده و ساختارهای مقایسه‌ای زبان انگلیسی دوره متوسطه دوم.",
    lessons: [
      { num: "۱", title: "نجات طبیعت (Saving Nature)", grammar: "زمان‌های آینده (Will & Be going to)" },
      { num: "۲", title: "شگفتی‌های خلقت (Wonders of Creation)", grammar: "صفت‌های مقایسه‌ای و عالی" },
      { num: "۳", title: "ارزش علم (The Value of Knowledge)", grammar: "گذشته استمراری و تمایز با گذشته ساده" },
      { num: "۴", title: "جهان‌گردی و گردشگری (Traveling the World)", grammar: "افعال کمکی وجهی (Modals)" },
    ],
    konkurFocus: "تسلط بر زمان‌های آینده، مقایسه صفات، شناخت اسم‌ها و افعال بی‌قاعده پرتکرار در سوالات واژگان.",
    href: "/high-school/grade-10",
    btnLabel: "ورود به سرفصل‌های دهم (Vision 1) ←",
  },
  {
    grade: "پایه یازدهم دبیرستان",
    bookTitle: "Vision 2",
    gradeNum: "۱۱",
    slug: "vision_2",
    cefr: "B1",
    lessonsCount: "۳ درس جامع",
    description: "توسعه ساختارهای گرامری مرکب، زمان حال کامل، جملات شرطی و تقویت درک مطلب تحلیلی.",
    lessons: [
      { num: "۱", title: "درک دیگران (Understanding People)", grammar: "اسامی قابل شمارش / غیرقابل شمارش" },
      { num: "۲", title: "سبک زندگی سالم (A Healthy Lifestyle)", grammar: "زمان حال کامل و اسم مصدر (Gerund)" },
      { num: "۳", title: "هنر و فرهنگ (Art and Culture)", grammar: "جملات شرطی نوع اول و مصدر با to" },
    ],
    konkurFocus: "شرطی نوع ۱، تمایز کاربرد Gerund و Infinitive، کمیت‌سنج‌های اسامی و تکنیک‌های کلوزتست.",
    href: "/high-school/grade-11",
    btnLabel: "ورود به سرفصل‌های یازدهم (Vision 2) ←",
  },
  {
    grade: "پایه دوازدهم دبیرستان",
    bookTitle: "Vision 3",
    gradeNum: "۱۲",
    slug: "vision_3",
    cefr: "B1+",
    lessonsCount: "۳ درس تخصصی",
    description: "آمادگی حداکثری برای امتحانات نهایی کشوری خرداد و شهریور، جملات مجهول و مهارت پاراگراف‌نویسی.",
    lessons: [
      { num: "۱", title: "حس قدردانی و احترام (Sense of Appreciation)", grammar: "جملات مجهول و سوالات ضمیمه (Tag)" },
      { num: "۲", title: "فرهنگ لغت و جستجوی واژگان (Look it Up!)", grammar: "ضمایر موصولی و شرطی نوع دوم" },
      { num: "۳", title: "انرژی‌های تجدیدپذیر (Renewable Energy)", grammar: "مجهول افعال مدال و گذشته کامل" },
    ],
    konkurFocus: "پوشش ۱۰۰٪ سوالات امتحان نهایی خرداد، کارگاه ضرب‌المثل‌ها، جملات مجهول و نگارش پاراگراف استاندارد.",
    href: "/high-school/grade-12",
    btnLabel: "ورود به سرفصل‌های دوازدهم (Vision 3) ←",
  },
];

export default function SchoolHubPage() {
  return (
    <PublicShell locale="fa" currentPath="/skills/school">
      <div className={styles.container} dir="rtl">
        {/* Navigation Breadcrumb */}
        <nav aria-label="راهنمای مسیر" className={styles.navBar}>
          <Link href="/skills" className={styles.backLink}>
            <svg
              className={styles.backIcon}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
            <span>بازگشت به مرکز مهارت‌های ایندورا</span>
          </Link>
          <span className={styles.navDivider}>/</span>
          <span className={styles.navCurrent}>کتب دبیرستان و کنکور</span>
        </nav>

        {/* Hero Section */}
        <header className={styles.heroHeader}>
          <div className={styles.heroBadgeRow}>
            <span className={styles.badgeSystem}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
              </svg>
              برنامه درسی ملی ایران
            </span>
            <span className={styles.badgeLevel}>دوره دوم متوسطه • نظری و فنی</span>
          </div>

          <h1 className={styles.title}>
            مرکز تخصصی آموزش زبان <span className={styles.titleAccent}>دبیرستان و کنکور</span>
          </h1>

          <p className={styles.description}>
            آموزش تعاملی و خط‌به‌خط کتب سه‌گانه <strong>Vision</strong>، تحلیل تشریحی تست‌های کنکور سراسری، و کارگاه‌های آمادگی امتحانات نهایی با پاسخنامه استاندارد و سیستم تصحیح هوشمند.
          </p>

          {/* Quick Stats Grid */}
          <div className={styles.statsGrid}>
            {STATS.map((stat, i) => (
              <div key={i} className={styles.statItem}>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
                <div className={styles.statSub}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </header>

        {/* Featured Tamrin 20 Card (Clean, light surface with elegant violet/gold accents) */}
        <section className={styles.featuredCard}>
          <div className={styles.featuredAccentBar} aria-hidden="true" />
          <div className={styles.featuredInner}>
            <div className={styles.featuredContent}>
              <div className={styles.featuredBadgesRow}>
                <span className={styles.featuredPillSpecial}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  ویژه امتحانات نهایی کشوری
                </span>
                <span className={styles.featuredPillGrade}>پایه دوازدهم (Vision 3)</span>
                <span className={styles.featuredPillStatus}>فعال و تعاملی</span>
              </div>

              <h2 className={styles.featuredTitle}>
                سامانه «تمرین تا ۲۰» نهایی خرداد و شهریور
              </h2>

              <p className={styles.featuredDescription}>
                بانک تعاملی بیش از ۱۰۰۰ سوال آزمون‌های سراسری نهایی به تفکیک درس‌به‌درس در ۵ مهارت اصلی همراه با فایل صوتی اورجینال، تحلیل گرامر و شروع با ۲۰ سوال طلایی تضمینی.
              </p>

              {/* Skill chips preview */}
              <div className={styles.skillsTagList}>
                <span className={styles.skillTag}>🎧 سوالات لیسنینگ با صوت</span>
                <span className={styles.skillTag}>📖 درک مطلب و کلوزتست</span>
                <span className={styles.skillTag}>🧩 واژگان و اصطلاحات</span>
                <span className={styles.skillTag}>✍️ دستور زبان و نگارش</span>
              </div>
            </div>

            <div className={styles.featuredAction}>
              <Link href="/high-school/grade-12/tamrin20" className={styles.featuredBtn}>
                <span>ورود به سامانه تمرین تا ۲۰</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
              <span className={styles.featuredMetaNote}>تصحیح خودکار • مرور نامحدود سوالات</span>
            </div>
          </div>
        </section>

        {/* High School Grades Grid */}
        <section aria-labelledby="grades-heading">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleWrapper}>
              <h2 id="grades-heading" className={styles.sectionTitle}>
                سرفصل‌های آموزشی به تفکیک پایه تحصیلی
              </h2>
              <p className={styles.sectionSubtitle}>
                برای ورود به تمارین تعاملی، آموزش‌های استقرایی و تست‌های مربوطه، کتاب پایه خود را انتخاب کنید:
              </p>
            </div>
          </div>

          <div className={styles.gradesGrid}>
            {GRADES.map((g) => (
              <article key={g.slug} className={styles.gradeCard}>
                {/* Card Top: Grade Header */}
                <div className={styles.cardHeader}>
                  <div className={styles.bookInfo}>
                    <div className={styles.gradeNumberBadge}>{g.gradeNum}</div>
                    <div>
                      <span className={styles.bookSub}>{g.bookTitle}</span>
                      <h3 className={styles.gradeTitle}>{g.grade}</h3>
                    </div>
                  </div>
                  <span className={styles.gradeCefrPill} title={`سطح استاندارد اروپایی: ${g.cefr}`}>
                    سطح {g.cefr}
                  </span>
                </div>

                <p className={styles.gradeDesc}>{g.description}</p>

                {/* Lessons List */}
                <div className={styles.lessonsWrapper}>
                  <div className={styles.lessonsHeaderRow}>
                    <span className={styles.lessonsHeaderTitle}>دروس و سرفصل‌ها</span>
                    <span className={styles.lessonsBadge}>{g.lessonsCount}</span>
                  </div>

                  <ul className={styles.lessonsList}>
                    {g.lessons.map((lesson) => (
                      <li key={lesson.num} className={styles.lessonItem}>
                        <div className={styles.lessonMain}>
                          <span className={styles.lessonNum}>{lesson.num}</span>
                          <span className={styles.lessonTitle}>{lesson.title}</span>
                        </div>
                        <span className={styles.grammarTag}>{lesson.grammar}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Konkur & Final Exam Insight Box */}
                <div className={styles.konkurBox}>
                  <div className={styles.konkurHeader}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <strong>تمرکز امتحانی و کنکور:</strong>
                  </div>
                  <p className={styles.konkurText}>{g.konkurFocus}</p>
                </div>

                {/* Card Footer CTA */}
                <div className={styles.gradeCardFooter}>
                  <Link href={g.href} className={styles.gradeFooterBtn}>
                    <span>{g.btnLabel}</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
