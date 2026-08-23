import Link from "next/link";

import {
  accountPath,
  localizedPath,
  type PublicLocale,
} from "../../lib/public-site";
import { PublicFaq } from "./PublicFaq";
import { WaitlistForm } from "./WaitlistForm";
import styles from "./marketing.module.css";

const loop = [
  { number: "01", fa: "تعیین سطح", en: "Placement", bodyFa: "شناخت نقطه شروع با شواهد چندمهارتی", bodyEn: "Find a starting point from multi-skill evidence" },
  { number: "02", fa: "Learner Twin", en: "Learner Twin", bodyFa: "ساخت تصویری قابل بررسی از نیازهای یادگیری", bodyEn: "Build an inspectable view of learning needs" },
  { number: "03", fa: "مسیر شخصی", en: "Personal path", bodyFa: "انتخاب قدم بعدی بر اساس هدف و زمان", bodyEn: "Choose the next step from goals and available time" },
  { number: "04", fa: "Daily Mission", en: "Daily Mission", bodyFa: "تمرین کوتاه، هدفمند و قابل مدیریت", bodyEn: "Practise with a focused, manageable mission" },
  { number: "05", fa: "سازگاری", en: "Adapt", bodyFa: "به‌روزرسانی مسیر با شواهد و بازخورد تازه", bodyEn: "Update the path with new evidence and feedback" },
] as const;

const features = [
  {
    index: "01",
    title: "Learner Twin",
    textFa: "یک مدل آموزشی توضیح‌پذیر که از ارزیابی و فعالیت واقعی تغذیه می‌شود؛ می‌توانی شواهدش را ببینی، اصلاح کنی یا بازنشانی کنی.",
    textEn: "An explainable learning model fed by assessment and real activity. You can inspect, correct, or reset its evidence.",
    url: "/features/learner-twin",
    visual: "twin",
  },
  {
    index: "02",
    title: "Mistake Genome",
    textFa: "یک پاسخ اشتباه به برچسب دائمی تبدیل نمی‌شود. فقط الگوهای دارای شواهد کافی به تمرین هدفمند بعدی وصل می‌شوند.",
    textEn: "One wrong answer never becomes a permanent label. Only sufficiently supported patterns inform targeted practice.",
    url: "/features/mistake-genome",
    visual: "mistakes",
  },
  {
    index: "03",
    title: "Daily Mission",
    textFa: "به‌جای جست‌وجو بین صدها درس، هر روز یک مأموریت متناسب با زمان، هدف و مرورهای عقب‌افتاده پیشنهاد می‌شود.",
    textEn: "Instead of searching hundreds of lessons, get one mission shaped by your time, goal, and overdue reviews.",
    url: "/features/daily-mission",
    visual: "mission",
  },
] as const;

function FeatureVisual({ type, locale }: { type: string; locale: PublicLocale }) {
  const isFa = locale === "fa";
  if (type === "twin") {
    return (
      <div className={styles.featureVisual} aria-label={isFa ? "پیش‌نمایش شواهد Learner Twin" : "Learner Twin evidence preview"}>
        <div className={styles.visualHeading}><span className={styles.visualMark}>E</span><strong>Learner Twin</strong></div>
        {["Vocabulary", "Grammar", "Listening"].map((skill) => (
          <div className={styles.evidenceRow} key={skill}><span lang="en" dir="ltr">{skill}</span><small>{isFa ? "در انتظار ارزیابی" : "Awaiting assessment"}</small></div>
        ))}
      </div>
    );
  }
  if (type === "mistakes") {
    return (
      <div className={styles.featureVisual} aria-label={isFa ? "پیش‌نمایش تحلیل الگوی اشتباه" : "Mistake pattern preview"}>
        <div className={styles.patternLine}><span /><span /><span /></div>
        <div className={styles.patternNote}><strong>{isFa ? "ابتدا شواهد" : "Evidence first"}</strong><small>{isFa ? "الگو پس از چند مشاهده معتبر می‌شود" : "A pattern needs multiple valid observations"}</small></div>
        <div className={styles.reviewTag}>{isFa ? "قابل بازبینی توسط زبان‌آموز و مدرس" : "Reviewable by learner and teacher"}</div>
      </div>
    );
  }
  return (
    <div className={styles.featureVisual} aria-label={isFa ? "پیش‌نمایش مأموریت روزانه" : "Daily Mission preview"}>
      <div className={styles.missionHeader}><span>{isFa ? "امروز" : "Today"}</span><small>{isFa ? "متناسب با زمان تو" : "Fits your available time"}</small></div>
      <div className={styles.missionTask}><span className={styles.taskCheck} aria-hidden="true">✓</span><div><strong>{isFa ? "مرور هدفمند" : "Focused review"}</strong><small>{isFa ? "تمرین بعد از ساخت مسیر نمایش داده می‌شود" : "Practice appears after your path is built"}</small></div></div>
    </div>
  );
}

export function HomePage({ locale }: { locale: PublicLocale }) {
  const isFa = locale === "fa";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Endoora",
    url: locale === "fa" ? "https://endoora.ir/" : "https://endoora.ir/en",
    inLanguage: locale === "fa" ? "fa-IR" : "en",
    description: isFa
      ? "سیستم یادگیری انگلیسی فارسی‌محور برای زبان‌آموزان ایران"
      : "A Persian-first English learning system for Iranian learners",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <section className={styles.heroNext}>
        <div className={styles.heroCopy}>
          <h1>{isFa ? "یادگیری انگلیسی که مسیر مخصوص تو را می‌سازد." : "English learning that builds a path around you."}</h1>
          <p>{isFa ? "Endoora سطح، هدف و الگوهای یادگیری تو را به یک مسیر متصل تبدیل می‌کند؛ از تعیین سطح تا تمرین روزانه و بازخورد مدرس." : "Endoora connects your level, goals, and learning patterns into one path—from placement to daily practice and teacher feedback."}</p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryButton} href={localizedPath(locale, "/placement")}>
              <span>{isFa ? "شروع تعیین سطح رایگان" : "Start free placement"}</span><span aria-hidden="true">{isFa ? "←" : "→"}</span>
            </Link>
            <Link className={styles.secondaryButton} href={accountPath(locale, "/auth/register")}>
              <span>{isFa ? "شروع یادگیری" : "Start learning"}</span><span aria-hidden="true">{isFa ? "←" : "→"}</span>
            </Link>
          </div>
          <p className={styles.heroNote}>{isFa ? "در حال ساخت · بدون ادعای نمره یا نتیجه تضمینی" : "In development · no guaranteed score or outcome claims"}</p>
        </div>

        <div className={styles.twinCard} aria-label={isFa ? "پیش‌نمایش محصول Learner Twin" : "Learner Twin product preview"}>
          <div className={styles.previewChrome}><span /><span /><span /><strong>Learner Twin</strong></div>
          <div className={styles.previewBody}>
            <aside className={styles.previewRail} aria-hidden="true"><b>E</b><span /><span /><span /><span /></aside>
            <div className={styles.previewContent}>
              <div className={styles.twinIdentity}>
                <div className={styles.orb}><span /></div>
                <div><strong>Learner Twin</strong><small>{isFa ? "تصویری قابل اصلاح از مسیر تو" : "A correctable view of your path"}</small></div>
              </div>
              <p className={styles.previewTitle}>{isFa ? "وضعیت ارزیابی مهارت‌ها" : "Skill assessment status"}</p>
              <span className={styles.previewBadge}>
                {isFa ? "پیش‌نمایش · بدون دادهٔ ساختگی" : "Preview · no invented learner data"}
              </span>
              {["Vocabulary", "Grammar", "Listening"].map((skill) => (
                <div className={styles.skillPreview} key={skill}><span lang="en" dir="ltr">{skill}</span><small>{isFa ? "در انتظار تعیین سطح" : "Awaiting placement"}</small></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="how" className={`${styles.section} ${styles.loopSection}`}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionLabel}>{isFa ? "از شناخت تا پیشرفت" : "From insight to progress"}</span>
          <h2>{isFa ? "چرخه یادگیری Endoora" : "The Endoora learning loop"}</h2>
          <p>{isFa ? "هر بخش، شواهد لازم را به قدم بعدی می‌رساند؛ مسیر از صفحه‌های جدا و بی‌ارتباط ساخته نمی‌شود." : "Each stage carries useful evidence into the next, instead of leaving you with disconnected feature pages."}</p>
        </div>
        <ol className={styles.loopGrid}>
          {loop.map((item) => (
            <li key={item.number}>
              <span className={styles.loopNumber}>{item.number}</span>
              <div className={styles.loopIcon} aria-hidden="true"><span /></div>
              <h3>{isFa ? item.fa : item.en}</h3>
              <p>{isFa ? item.bodyFa : item.bodyEn}</p>
            </li>
          ))}
        </ol>
        <Link className={styles.centerLink} href={localizedPath(locale, "/how-it-works")}>
          {isFa ? "مشاهده چرخه کامل" : "Explore the full learning loop"}<span aria-hidden="true">{isFa ? "←" : "→"}</span>
        </Link>
      </section>

      <section id="features" className={`${styles.section} ${styles.featuresSection}`}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionLabel}>{isFa ? "یک سیستم، نه چند ابزار جدا" : "One system, not disconnected tools"}</span>
          <h2>{isFa ? "قابلیت‌هایی که از شواهد یادگیری استفاده می‌کنند" : "Features grounded in learning evidence"}</h2>
        </div>
        <div className={styles.featureStories}>
          {features.map((feature) => (
            <article className={styles.featureStory} key={feature.title}>
              <div className={styles.featureCopy}>
                <span className={styles.storyIndex}>{feature.index}</span>
                <h3 dir="ltr">{feature.title}</h3>
                <p>{isFa ? feature.textFa : feature.textEn}</p>
                <Link className={styles.textLink} href={localizedPath(locale, feature.url)}>{isFa ? "جزئیات و محدودیت‌ها" : "Details and limitations"}<span aria-hidden="true">{isFa ? "←" : "→"}</span></Link>
              </div>
              <div><FeatureVisual type={feature.visual} locale={locale} /></div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.humanBand}>
        <div className={styles.humanCopy}>
          <span className={styles.sectionLabel}>{isFa ? "هوش مصنوعی + راهنمایی انسانی" : "AI + human guidance"}</span>
          <h2>{isFa ? "شخصی‌سازی با AI؛ تصمیم‌های مهم با امکان بازبینی انسانی" : "AI for personalization, with human review where it matters"}</h2>
          <p>{isFa ? "بازار مدرس Endoora بر تأیید، دسترسی حداقلی به داده و ارتباط روشن با شواهد یادگیری بنا می‌شود. AI ابزار کمک است، نه جایگزین قضاوت حرفه‌ای." : "Endoora’s teacher marketplace is built around verification, least-privilege data access, and clear links to learning evidence. AI supports—not replaces—professional judgment."}</p>
          <Link className={styles.textLink} href={localizedPath(locale, "/teachers")}>{isFa ? "آشنایی با مسیر مدرس‌ها" : "Explore the teacher pathway"}<span aria-hidden="true">{isFa ? "←" : "→"}</span></Link>
        </div>
        <ol className={styles.humanSteps}>
          <li><span>01</span><strong>{isFa ? "شواهد یادگیری" : "Learning evidence"}</strong><small>{isFa ? "فقط داده مرتبط" : "Only relevant data"}</small></li>
          <li><span>02</span><strong>{isFa ? "پیشنهاد AI" : "AI suggestion"}</strong><small>{isFa ? "با محدودیت روشن" : "With explicit limits"}</small></li>
          <li><span>03</span><strong>{isFa ? "بازخورد مدرس" : "Teacher feedback"}</strong><small>{isFa ? "در رابطه مجاز" : "Within authorized access"}</small></li>
        </ol>
      </section>

      <section className={styles.trustRail} aria-labelledby="trust-title">
        <div><span className={styles.sectionLabel}>{isFa ? "اعتماد قبل از هیجان" : "Trust before hype"}</span><h2 id="trust-title">{isFa ? "محدودیت‌ها را پنهان نمی‌کنیم" : "We do not hide the limitations"}</h2></div>
        <div><strong>IELTS</strong><p>{isFa ? "تمرین شبیه‌سازی‌شده است؛ نمره AI رسمی نیست." : "Practice is simulated; an AI estimate is not official."}</p></div>
        <div><strong>{isFa ? "هوش مصنوعی" : "Artificial intelligence"}</strong><p>{isFa ? "ممکن است اشتباه کند و باید قابل گزارش و اصلاح باشد." : "It can be wrong and must remain reportable and correctable."}</p></div>
        <div><strong>{isFa ? "کنترل داده" : "Data control"}</strong><p>{isFa ? "داده آموزشی باید هدف‌دار، حداقلی و قابل توضیح باشد." : "Learning data should be purpose-bound, minimal, and explainable."}</p></div>
      </section>

      <section id="faq" className={`${styles.section} ${styles.faqSection}`}><PublicFaq locale={locale} /></section>

      <section id="waitlist" className={styles.waitlist}>
        <div className={styles.waitlistCopy}><span className={styles.sectionLabel}>{isFa ? "دسترسی اولیه" : "Early access"}</span><h2>{isFa ? "وقتی آماده شد، از اولین نفرها باش" : "Be among the first when it is ready"}</h2><p>{isFa ? "فقط خبرهای پیش‌راه‌اندازی؛ بدون خبرنامه ناخواسته و بدون فروش اطلاعات تماس." : "Prelaunch updates only—no unwanted newsletter and no sale of contact information."}</p></div>
        <WaitlistForm locale={locale} source="homepage" />
      </section>
    </>
  );
}
