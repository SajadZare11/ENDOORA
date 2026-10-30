"use client";

import Link from "next/link";
import { useState } from "react";

import {
  accountPath,
  localizedPath,
  type PublicLocale,
} from "../../lib/public-site";
import { PublicFaq } from "./PublicFaq";
import styles from "./marketing.module.css";

interface LoopStepItem {
  number: string;
  stepKey: string;
  fa: string;
  en: string;
  subtitleFa: string;
  subtitleEn: string;
  bodyFa: string;
  bodyEn: string;
  badgeFa: string;
  badgeEn: string;
  icon: string;
  highlightsFa: string[];
  highlightsEn: string[];
  actionHref: string;
  actionLabelFa: string;
  actionLabelEn: string;
}

const loop7Steps: LoopStepItem[] = [
  {
    number: "01",
    stepKey: "onboarding",
    fa: "انتخاب سن و هدف",
    en: "Onboarding & Goal Profiling",
    subtitleFa: "مسیر متناسب با سن تو",
    subtitleEn: "Age group & core learner intent",
    bodyFa: "اول به ما بگو چند سالته و برای چی می‌خوای انگلیسی یاد بگیری؛ مکالمه، مدرسه یا مهاجرت؟ تا مسیرت رو آماده کنیم.",
    bodyEn: "Profile registration, age bracket (young 4–7, 8–12, adult), and core learning goals to calibrate the personalized journey from day one.",
    icon: "🎯",
    badgeFa: "گام ۱: معرفی و هدف",
    badgeEn: "Step 1: Goal Profile",
    highlightsFa: [
      "خردسالان (۴ تا ۷ سال): شعر، انیمیشن و بازی‌های شاد با حروف الفبا",
      "کودکان و نوجوانان (۸ تا ۱۲ سال): داستان‌های هیجان‌انگیز و مکالمه روان",
      "بزرگسالان: مکالمه خودمانی، کار، دانشگاه و آمادگی آزمون‌های بین‌المللی",
    ],
    highlightsEn: [
      "Young learners (4–7): songs, stories, strong phonics",
      "Young learners (8–12): interactive discovery & illustrated stories",
      "Adults: general fluency, career, migration & international exams",
    ],
    actionHref: "/auth/register",
    actionLabelFa: "شروع با ثبت‌نام رایگان",
    actionLabelEn: "Start with Free Registration",
  },
  {
    number: "02",
    stepKey: "placement",
    fa: "تعیین سطح سریع و هوشمند",
    en: "6-Skill Placement Test",
    subtitleFa: "سنجش بدون استرس مهارت‌ها",
    subtitleEn: "Adaptive 6-skill diagnostic assessment",
    bodyFa: "توی چند دقیقه گرامر، لغت، تلفظ، شنیداری و نوشتن رو می‌سنجیم تا دقیقاً بدونیم کجای کاری و چی نیاز داری.",
    bodyEn: "Comprehensive adaptive assessment across Grammar, Vocabulary, Reading, Listening, Speaking, and Writing without synthetic score guesswork.",
    icon: "🧠",
    badgeFa: "گام ۲: سنجش مهارت‌ها",
    badgeEn: "Step 2: 6-Skill Engine",
    highlightsFa: [
      "تست هوشمند گرامر و کلمات بدون سوالات تکراری",
      "بررسی روانی صحبت کردن و لهجه با هوش مصنوعی",
      "سنجش گوش دادن و درک مطلب، ساده و شفاف",
    ],
    highlightsEn: [
      "Adaptive grammar & vocabulary assessment powered by AI",
      "Voice pronunciation & fluency analysis in real time",
      "Reading comprehension, listening, and written sentence logic",
    ],
    actionHref: "/placement",
    actionLabelFa: "ورود به آزمون تعیین سطح",
    actionLabelEn: "Start Placement Test",
  },
  {
    number: "03",
    stepKey: "report",
    fa: "کارنامه ساده و شفاف",
    en: "CEFR Diagnostic Report",
    subtitleFa: "سطح واقعیت کجاست؟",
    subtitleEn: "Standardized international CEFR benchmark",
    bodyFa: "یه کارنامه تر و تمیز می‌گیری که نشون میده تو هر مهارت کجایی؛ از مبتدی تا پیشرفته، همه چی شفافه.",
    bodyEn: "Transparent evidence summary, radar skill breakdown, and rigorous CEFR diagnostic classification from Beginner (A1) to Advanced (C2).",
    icon: "📊",
    badgeFa: "گام ۳: کارنامه شفاف",
    badgeEn: "Step 3: CEFR Benchmark",
    highlightsFa: [
      "مشخص شدن سطح استانداردت (از A1 تا C2)",
      "نمودار نقاط قوت و مهارت‌هایی که نیاز به تمرین دارن",
      "انتخاب کتاب مناسب دقیقاً اندازه سطحت",
    ],
    highlightsEn: [
      "Rigorous CEFR benchmark (A1, A2, B1, B2, C1, C2)",
      "Radar chart & separate diagnostic scores across all 6 skills",
      "Evidence-grounded baseline for automated textbook mapping",
    ],
    actionHref: "/placement/report",
    actionLabelFa: "دیدن نمونه کارنامه",
    actionLabelEn: "View Diagnostic Report",
  },
  {
    number: "04",
    stepKey: "roadmap",
    fa: "کتاب و نقشه راه اختصاصی",
    en: "Personalized Path & Book Mapping",
    subtitleFa: "معتبرترین کتاب‌ها بر اساس سطحت",
    subtitleEn: "Automated textbook syllabus & progression graph",
    bodyFa: "سیستم بهترین کتاب آموزشی روز دنیا رو برات انتخاب میکنه و درس به درس باهات میاد جلو تا بدونی هر هفته قراره چی یاد بگیری.",
    bodyEn: "Automated curriculum matching to standard coursebooks based on placement evidence, generating interactive visual progression roadmaps for present and future phases.",
    icon: "📚",
    badgeFa: "گام ۴: کتاب مناسب تو",
    badgeEn: "Step 4: Textbook & Syllabus Roadmap",
    highlightsFa: [
      "مبتدی (A1): American English File Starter (شروع مکالمه و الفبا)",
      "مقدماتی (A2): American English File 1 & 2 (مکالمه روزمره و جمله‌سازی)",
      "متوسط (B1): American English File 3 (اصطلاحات و مکالمه روان)",
      "فوق‌متوسط (B2): American English File 4 (بحث آزاد و گرامر پیشرفته)",
      "پیشرفته (C1–C2): American English File 5 و کتب آزمون CAE",
      "خردسالان (۴–۷): Family and Friends — شعر، بازی و تلفظ صوتی حروف",
      "کودکان و نوجوانان (۸–۱۲): Oxford Discover، Super Minds یا Fly High",
      "آزمون‌های بین‌المللی: Cambridge IELTS، Road to IELTS، Target Band 7، Barron's TOEFL iBT، Delta TOEFL، 4000 Essential English Words",
    ],
    highlightsEn: [
      "Beginner (A1): American English File Starter (Oxford)",
      "Elementary (A2): American English File 1 & 2 (Oxford)",
      "Pre-Intermediate to Intermediate (B1): American English File 3 (Oxford)",
      "Upper-Intermediate (B2): American English File 4 (Oxford)",
      "Advanced (C1–C2): American English File 5 & CAE exam prep",
      "Very young (4–7): Family and Friends — songs, stories, strong phonics",
      "Young learners (8–12): Oxford Discover, Super Minds, or Fly High",
      "Exam Prep: Cambridge IELTS series, Road to IELTS, Target Band 7, Barron's TOEFL iBT, Delta TOEFL, 4000 Essential English Words",
    ],
    actionHref: "/path",
    actionLabelFa: "دیدن نقشه راه و کتاب‌ها",
    actionLabelEn: "Explore Personalized Path & Books",
  },
  {
    number: "05",
    stepKey: "liveClass",
    fa: "کلاس آنلاین با استاد",
    en: "Live Online Class Enrollment",
    subtitleFa: "تک‌نفره یا گروه‌های صمیمی تا ۴ نفر",
    subtitleEn: "Smart teacher matching & cohort clustering (max 4)",
    bodyFa: "روز و ساعتی که راحتی رو انتخاب کن! می‌تونی کلاس خصوصی تک‌نفره برداری یا با ۲ تا ۳ همکلاسی هم‌سطح خودت هم‌کلام بشی.",
    bodyEn: "Learners select weekly availability and preferred format (solo 1-on-1 or small group with up to 3 classmates, max 4 students). Requests appear in the teacher pool where smart cohorts cluster and teachers log taught units and homework.",
    icon: "👥",
    badgeFa: "گام ۵: کلاس زنده با استاد",
    badgeEn: "Step 5: Live Cohort Matching",
    highlightsFa: [
      "کلاس انفرادی (خصوصی ۱ نفره) یا گروهی با حداکثر ۳ همکلاسی هم‌سطح",
      "تنظیم روزها و ساعت‌های خالی در هفته به انتخاب خودت",
      "پیدا شدن سریع استاد و هماهنگی کلاس در محیط آنلاین",
      "همکلاسی‌های دقیقاً هم‌سطح برای مکالمه بدون خجالت",
      "ثبت گزارش درس و تمرین‌های اختصاصی توسط استاد بعد از هر جلسه",
    ],
    highlightsEn: [
      "1-on-1 solo private or small group with up to 3 classmates (4 students max)",
      "Learner selects weekly available days and time windows",
      "Class request pool in teacher dashboard for quick claim & acceptance",
      "Smart cohort clustering for learners with matching CEFR & common availability",
      "Skyroom / Google Meet live links and post-session teacher lesson & homework logs",
    ],
    actionHref: "/path#enroll",
    actionLabelFa: "انتخاب زمان و ثبت‌نام کلاس",
    actionLabelEn: "Enroll in a Live Class",
  },
  {
    number: "06",
    stepKey: "dailyMission",
    fa: "مأموریت روزانه (۱۰ دقیقه‌ای)",
    en: "Adaptive Daily Mission",
    subtitleFa: "تمرین کوتاه، ماندگاری همیشگی",
    subtitleEn: "Priority teacher homework + Spaced Repetition (SRS)",
    bodyFa: "لازم نیست ساعت‌ها وقت بذاری؛ فقط ۱۰ تا ۱۵ دقیقه در روز تمرین‌های استادت و فلش‌کارت‌های هوشمند رو مرور کن تا کلمات از یادت نرن.",
    bodyEn: "Manageable daily learning rhythm where homework assigned in the latest live teacher session takes priority #1, combined with spaced-repetition (SRS) vocabulary consolidation.",
    icon: "⚡",
    badgeFa: "گام ۶: عادت روزانه ۱۰ دقیقه‌ای",
    badgeEn: "Step 6: Daily Mission & SRS",
    highlightsFa: [
      "انجام راحت تکالیفی که استادت بهت داده برای جلسه بعد",
      "فلش‌کارت‌های هوشمند لغت که نمی‌ذارن کلمات یادت بره",
      "فقط روزی ۱۰ الی ۱۵ دقیقه تمرین برای حفظ پیوستگی",
      "پیشرفت قدم به قدم بدون خستگی و دلزدگی",
    ],
    highlightsEn: [
      "Priority #1: Live class homework assigned by your teacher in the latest session",
      "Spaced Repetition System (SRS) for long-term vocabulary retention",
      "Focused 10–15 minute daily practice rhythm for sustainable habit building",
      "Continuous adaptation to your pace and newly identified learning gaps",
    ],
    actionHref: "/today",
    actionLabelFa: "دیدن مأموریت امروز",
    actionLabelEn: "View Today's Mission",
  },
  {
    number: "07",
    stepKey: "aiLabs",
    fa: "هوش مصنوعی برای مکالمه و تمرین",
    en: "AI Labs & Deep Practice",
    subtitleFa: "بدون استرس و هر چقدر خواستی تمرین کن",
    subtitleEn: "Writing Mentor, Voice Lab, AI Roleplay & Mistake Genome",
    bodyFa: "هر موقع شبانه‌روز می‌تونی با هوش مصنوعی انگلیسی حرف بزنی، ترست بریزه، تلفظت رو اصلاح کنی و دستخط و انشات رو چک کنی.",
    bodyEn: "Unbounded interactive practice across the AI Writing Mentor, Voice & Pronunciation Lab, situational AI Roleplay conversations, and Mistake Genome remediation.",
    icon: "🔬",
    badgeFa: "گام ۷: همراه هوشمند ۲۴ ساعته",
    badgeEn: "Step 7: AI Labs & Deep Practice",
    highlightsFa: [
      "AI Writing Mentor: بررسی گرامر، پیشنهاد بازنویسی روان‌تر و اصلاح انشا",
      "Voice Lab: گوش دادن به صدای تو و اصلاح تلفظ، لهجه و روانی صحبت",
      "AI Roleplay: شبیه‌سازی مکالمات واقعی (کافه، فرودگاه، هتل، مصاحبه کاری)",
      "Mistake Genome: پیدا کردن اشتباهات پرتکرارت و تبدیل اون‌ها به نقطه قوت",
    ],
    highlightsEn: [
      "AI Writing Mentor: Essay & paragraph analysis, rewriting suggestions & grammar check",
      "Voice & Pronunciation Lab: Real-time pronunciation, accent, rhythm, and fluency feedback",
      "AI Roleplay: Situational immersion (job interview, airport, hotel, restaurant)",
      "Mistake Genome: Recurring error pattern analysis and focused micro-drills",
    ],
    actionHref: "/practice-ai",
    actionLabelFa: "ورود به تمرین با هوش مصنوعی",
    actionLabelEn: "Open AI Practice Labs",
  },
];

const features = [
  {
    index: "01",
    title: "Learner Twin",
    textFa: "یه تصویر زنده و شفاف از سطح واقعی تو؛ سیستم دقیقاً می‌دونه کدوما رو بلدی و روی کدوما باید بیشتر تمرین کنی.",
    textEn: "An explainable learning model fed by assessment and real activity. You can inspect, correct, or reset its evidence.",
    url: "/features/learner-twin",
    visual: "twin",
  },
  {
    index: "02",
    title: "Mistake Genome",
    textFa: "از اشتباه کردن نترس! سیستم خطاهای پرتکرارت رو پیدا می‌کنه و با تمرین‌های کوتاه و هدفمند تبدیلشون می‌کنه به نقطه قوتت.",
    textEn: "One wrong answer never becomes a permanent label. Only sufficiently supported patterns inform targeted practice.",
    url: "/features/mistake-genome",
    visual: "mistakes",
  },
  {
    index: "03",
    title: "Daily Mission",
    textFa: "به جای اینکه بین صدها درس گیج بشی، هر روز یه برنامه جمع‌وجور ۱۰ دقیقه‌ای اندازه وقت خالی خودت داری.",
    textEn: "Instead of searching hundreds of lessons, get one mission shaped by your time, goal, and overdue reviews.",
    url: "/features/daily-mission",
    visual: "mission",
  },
] as const;

function FeatureVisual({ type, locale }: { type: string; locale: PublicLocale }) {
  const isFa = locale === "fa";
  if (type === "twin") {
    return (
      <div className={styles.featureVisual} aria-label={isFa ? "پیش‌نمایش وضعیت مهارت‌های تو" : "Learner Twin evidence preview"}>
        <div className={styles.visualHeading}><span className={styles.visualMark}>E</span><strong>Learner Twin</strong></div>
        {["Vocabulary", "Grammar", "Listening"].map((skill) => (
          <div className={styles.evidenceRow} key={skill}><span lang="en" dir="ltr">{skill}</span><small>{isFa ? "منتظر تعیین سطح" : "Awaiting assessment"}</small></div>
        ))}
      </div>
    );
  }
  if (type === "mistakes") {
    return (
      <div className={styles.featureVisual} aria-label={isFa ? "پیش‌نمایش رفع اشتباهات" : "Mistake pattern preview"}>
        <div className={styles.patternLine}><span /><span /><span /></div>
        <div className={styles.patternNote}><strong>{isFa ? "یادگیری از اشتباهات" : "Evidence first"}</strong><small>{isFa ? "شناسایی نقاط ضعف پرتکرار" : "A pattern needs multiple valid observations"}</small></div>
        <div className={styles.reviewTag}>{isFa ? "بررسی مشترک توسط تو و استاد" : "Reviewable by learner and teacher"}</div>
      </div>
    );
  }
  return (
    <div className={styles.featureVisual} aria-label={isFa ? "پیش‌نمایش برنامه امروز" : "Daily Mission preview"}>
      <div className={styles.missionHeader}><span>{isFa ? "امروز" : "Today"}</span><small>{isFa ? "اندازه وقت خالی تو" : "Fits your available time"}</small></div>
      <div className={styles.missionTask}><span className={styles.taskCheck} aria-hidden="true">✓</span><div><strong>{isFa ? "تمرین ۱۰ دقیقه‌ای" : "Focused review"}</strong><small>{isFa ? "بعد از تعیین سطح فعال میشه" : "Practice appears after your path is built"}</small></div></div>
    </div>
  );
}

function ShowcaseInteractiveDetail({ stepKey, isFa }: { stepKey: string; isFa: boolean }) {
  if (stepKey === "roadmap") {
    const books = [
      {
        level: isFa ? "مبتدی (A1)" : "Beginner (A1)",
        book: "American English File Starter (Oxford)",
        desc: isFa ? "شروع مکالمه‌های ساده، کلمات پرکاربرد روزمره و تلفظ حروف" : "Foundational speaking, starter vocabulary & phonics",
      },
      {
        level: isFa ? "مقدماتی (A2)" : "Elementary (A2)",
        book: "American English File 1 & 2 (Oxford)",
        desc: isFa ? "تقویت مکالمه روزمره، جمله‌سازی راحت و زمان‌های گذشته و آینده" : "Everyday fluency, sentence construction & past/future tenses",
      },
      {
        level: isFa ? "متوسط (B1)" : "Pre-Intermediate to Intermediate (B1)",
        book: "American English File 3 (Oxford)",
        desc: isFa ? "بحث درباره موضوعات جذاب، اصطلاحات کاربردی و افزایش دایره لغت" : "Discussion skills, modals, topical vocab & natural idioms",
      },
      {
        level: isFa ? "فوق‌متوسط (B2)" : "Upper-Intermediate (B2)",
        book: "American English File 4 (Oxford)",
        desc: isFa ? "مکالمه روان و پیوسته، بیان نظر و گرامرهای پیشرفته‌تر" : "Nuanced debate, semi-technical texts & complex grammar",
      },
      {
        level: isFa ? "پیشرفته (C1–C2)" : "Advanced (C1–C2)",
        book: "American English File 5 & Cambridge CAE",
        desc: isFa ? "تسلط کامل مثل زبان مادری، متون پیشرفته و آمادگی عالی" : "Near-native mastery, academic nuance & CAE advanced prep",
      },
      {
        level: isFa ? "خردسالان (۴ تا ۷ سال)" : "Young Learners (4–7)",
        book: "Family and Friends (Oxford)",
        desc: isFa ? "آهنگ‌ها و شعرهای شاد، داستان‌های مصور و یادگیری صوتی حروف الفبا" : "Joyful songs, picture stories & solid phonics foundations",
      },
      {
        level: isFa ? "کودکان و نوجوانان (۸ تا ۱۲ سال)" : "Young Learners (8–12)",
        book: "Oxford Discover / Super Minds / Fly High",
        desc: isFa ? "داستان‌های ماجراجویی، پروژه‌های جذاب و اعتمادبه‌نفس برای صحبت کردن" : "Inquiry-based discovery, interactive projects & spoken confidence",
      },
      {
        level: isFa ? "آزمون آیلتس (IELTS)" : "IELTS Exam Prep",
        book: "Cambridge IELTS Series + Road to IELTS + Target Band 7",
        desc: isFa ? "تست‌های اصلی کمبریج، ترفندهای لیسنینگ و ریدینگ و تکنیک‌های نمره‌آوری" : "Official Cambridge past papers, Academic strategies & timing drills",
      },
      {
        level: isFa ? "آزمون تافل (TOEFL)" : "TOEFL Exam Prep",
        book: "Barron's TOEFL iBT + Delta's Key to TOEFL",
        desc: isFa ? "آزمون‌های شبیه‌سازی‌شده، ریدینگ پیشرفته و رایتینگ آکادمیک" : "iBT practice tests, integrated writing & advanced reading skills",
      },
      {
        level: isFa ? "لغات کاربردی" : "Vocabulary Mastery",
        book: "4000 Essential English Words & Essential Words",
        desc: isFa ? "یادگیری کلمات پرکاربرد روزمره با مرور مداوم برای ماندگاری تو ذهن" : "Spaced-repetition mastery of high-frequency frequency corpora",
      },
    ];

    return (
      <div className={styles.showcaseInteractiveBox}>
        <div style={{ marginBottom: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <strong style={{ fontSize: "0.92rem", color: "var(--color-text)" }}>
            {isFa ? "📚 کتاب‌های استانداردی که بر اساس سطحت بهت پیشنهاد میشه" : "📚 Smart Textbook Mapping Grounded in Diagnostic Level"}
          </strong>
          <small style={{ color: "var(--color-muted)" }}>
            {isFa ? "درس به درس همراه با نمودار پیشرفت" : "With present & future milestone progression graphs"}
          </small>
        </div>
        <div className={styles.showcaseBooksMatrix}>
          {books.map((b) => (
            <div key={b.book} className={styles.showcaseBookCard}>
              <span className={styles.showcaseBookLevel}>{b.level}</span>
              <strong className={styles.showcaseBookTitle}>{b.book}</strong>
              <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>{b.desc}</small>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (stepKey === "liveClass") {
    return (
      <div className={styles.showcaseInteractiveBox}>
        <div style={{ marginBottom: "0.75rem" }}>
          <strong style={{ fontSize: "0.92rem", color: "var(--color-text)" }}>
            {isFa ? "👥 فرمت کلاس‌های آنلاین؛ اونجور که راحتی یاد بگیر" : "👥 Live Class Matching & Smart Cohort Clustering"}
          </strong>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))", gap: "0.75rem" }}>
          <div className={styles.showcaseBookCard}>
            <span className={styles.showcaseBookLevel}>{isFa ? "فرمت ۱: کلاس خصوصی" : "Format 1: Solo 1-on-1"}</span>
            <strong className={styles.showcaseBookTitle}>{isFa ? "استاد اختصاصی برای خودت" : "Private Dedicated Class"}</strong>
            <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>
              {isFa ? "تمرکز ۱۰۰٪ استاد روی نیازهای تو، زمان‌بندی منعطف و رفع اشکال کامل." : "100% teacher focus on your exact pace, flexible schedule, and bespoke feedback."}
            </small>
          </div>
          <div className={styles.showcaseBookCard}>
            <span className={styles.showcaseBookLevel}>{isFa ? "فرمت ۲: گروه دوستانه" : "Format 2: Small Cohort"}</span>
            <strong className={styles.showcaseBookTitle}>{isFa ? "۲ تا ۴ نفره با هم‌سطح‌های خودت" : "Up to 3 Classmates (Max 4 Students)"}</strong>
            <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>
              {isFa ? "مکالمه دوستانه، فضای کلاسی شاداب، هزینه اقتصادی‌تر و انگیزه یادگیری گروهی." : "Peer roleplay, vibrant classroom dynamics, cost-effective pricing, and group energy."}
            </small>
          </div>
          <div className={styles.showcaseBookCard}>
            <span className={styles.showcaseBookLevel}>{isFa ? "تکلیف و پیشرفت منظم" : "Teacher Request Pool"}</span>
            <strong className={styles.showcaseBookTitle}>{isFa ? "ارتباط مستقیم با استاد" : "Teacher Claim & Post-Session Homework"}</strong>
            <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>
              {isFa ? "بعد از هر کلاس، استاد تمرین‌های جدیدت رو ثبت می‌کنه تا توی برنامه روزانه‌ت حلشون کنی." : "Teachers log taught topics and homework after every session, feeding straight into your Daily Mission."}
            </small>
          </div>
        </div>
      </div>
    );
  }

  if (stepKey === "dailyMission") {
    return (
      <div className={styles.showcaseInteractiveBox}>
        <div style={{ marginBottom: "0.75rem" }}>
          <strong style={{ fontSize: "0.92rem", color: "var(--color-text)" }}>
            {isFa ? "⚡ برنامه روزانه‌ت چطوری چیده میشه؟" : "⚡ Daily Mission Architecture (Adaptive & Habit-Forming)"}
          </strong>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))", gap: "0.75rem" }}>
          <div className={styles.showcaseBookCard}>
            <span className={styles.showcaseBookLevel} style={{ color: "#d97706" }}>{isFa ? "⭐ اولویت اول" : "⭐ Priority #1"}</span>
            <strong className={styles.showcaseBookTitle}>{isFa ? "تکالیف کلاس آنلاین" : "Teacher Live Class Homework"}</strong>
            <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>
              {isFa ? "تمرین‌هایی که استادت توی آخرین جلسه بهت داده تا برای کلاس بعدی آماده بشی." : "Direct homework tasks assigned by your teacher in the latest live session to prepare for your next class."}
            </small>
          </div>
          <div className={styles.showcaseBookCard}>
            <span className={styles.showcaseBookLevel}>{isFa ? "🔄 اولویت دوم" : "🔄 Priority #2"}</span>
            <strong className={styles.showcaseBookTitle}>{isFa ? "مرور فلش‌کارت‌های لغت" : "Spaced Repetition Review (SRS)"}</strong>
            <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>
              {isFa ? "مرور سریع کلمات جدید با روش علمی تا بره توی حافظه بلندمدتت و یادت نره." : "Scientific flashcard reviews scheduled at the optimal moment right before forgetting occurs."}
            </small>
          </div>
          <div className={styles.showcaseBookCard}>
            <span className={styles.showcaseBookLevel}>{isFa ? "⏱ ریتم راحت" : "⏱ Sustainable Rhythm"}</span>
            <strong className={styles.showcaseBookTitle}>{isFa ? "۱۰ الی ۱۵ دقیقه در روز" : "10–15 Minutes Daily"}</strong>
            <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>
              {isFa ? "تمرین‌های کوتاه و جمع‌وجور که هر روز به راحتی انجام میدی و خسته‌ت نمیکنه." : "Bite-sized, focused practice designed to fit busy lifestyles without burnout."}
            </small>
          </div>
        </div>
      </div>
    );
  }

  if (stepKey === "aiLabs") {
    return (
      <div className={styles.showcaseInteractiveBox}>
        <div style={{ marginBottom: "0.75rem" }}>
          <strong style={{ fontSize: "0.92rem", color: "var(--color-text)" }}>
            {isFa ? "🔬 ۴ ابزار هوشمند برای تمرین در هر ساعتی از شبانه‌روز" : "🔬 4 Specialized AI Deep Practice Labs"}
          </strong>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(13rem, 1fr))", gap: "0.75rem" }}>
          <div className={styles.showcaseBookCard}>
            <span className={styles.showcaseBookLevel}>✍️ AI Writing Mentor</span>
            <strong className={styles.showcaseBookTitle}>{isFa ? "مربی نوشتن و نگارش" : "Essay & Paragraph Mentor"}</strong>
            <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>
              {isFa ? "متنت رو بنویس تا ایرادهای گرامری رو بگیره و پیشنهاد بده چطور زیباتر بنویسی." : "Grammar rectification, natural phrasing suggestions & band criterion feedback."}
            </small>
          </div>
          <div className={styles.showcaseBookCard}>
            <span className={styles.showcaseBookLevel}>🎙️ Voice Lab</span>
            <strong className={styles.showcaseBookTitle}>{isFa ? "استودیوی تلفظ و لهجه" : "Voice & Pronunciation Lab"}</strong>
            <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>
              {isFa ? "بلند بخون تا هوش مصنوعی بگه تلفظ و استرس کلماتت چقدر درسته و چطور روان‌تر حرف بزنی." : "Phonetic breakdown, syllable stress, cadence, and real-time fluency scoring."}
            </small>
          </div>
          <div className={styles.showcaseBookCard}>
            <span className={styles.showcaseBookLevel}>🎭 AI Roleplay</span>
            <strong className={styles.showcaseBookTitle}>{isFa ? "مکالمه در دنیای واقعی" : "Situational AI Roleplay"}</strong>
            <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>
              {isFa ? "بدون خجالت انگلیسی گپ بزن؛ در موقعیت‌های فرودگاه، کافه، هتل یا مصاحبه کاری." : "Interactive dialogues in job interviews, business negotiations, and travel scenarios."}
            </small>
          </div>
          <div className={styles.showcaseBookCard}>
            <span className={styles.showcaseBookLevel}>🧬 Mistake Genome</span>
            <strong className={styles.showcaseBookTitle}>{isFa ? "رفع اشتباهات پرتکرار" : "Mistake Pattern Genome"}</strong>
            <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>
              {isFa ? "پیدا کردن خطاهایی که ما ایرانی‌ها معمولاً داریم و رفع کردنشون با تمرین‌های کوتاه." : "Pinpoints Iranian learner error patterns with surgical targeted micro-drills."}
            </small>
          </div>
        </div>
      </div>
    );
  }

  if (stepKey === "onboarding") {
    return (
      <div className={styles.showcaseInteractiveBox}>
        <div style={{ marginBottom: "0.75rem" }}>
          <strong style={{ fontSize: "0.92rem", color: "var(--color-text)" }}>
            {isFa ? "🎯 سن و هدفت چیه؟" : "🎯 Calibrated Demographics & Learner Intent"}
          </strong>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))", gap: "0.75rem" }}>
          <div className={styles.showcaseBookCard}>
            <span className={styles.showcaseBookLevel}>{isFa ? "۴ تا ۷ سال" : "Ages 4–7"}</span>
            <strong className={styles.showcaseBookTitle}>{isFa ? "خردسالان (Kids)" : "Early Childhood Learners"}</strong>
            <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>
              {isFa ? "آشنایی با صداها، حروف الفبا، شعرها و بازی‌های شاد کودکانه بدون فشار." : "Engaging sounds, phonics fundamentals, playful songs, and illustrated stories."}
            </small>
          </div>
          <div className={styles.showcaseBookCard}>
            <span className={styles.showcaseBookLevel}>{isFa ? "۸ تا ۱۲ سال" : "Ages 8–12"}</span>
            <strong className={styles.showcaseBookTitle}>{isFa ? "کودکان و نوجوانان" : "Young Learners & Juniors"}</strong>
            <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>
              {isFa ? "ایجاد اعتمادبه‌نفس مکالمه، داستان‌های جذاب و یادگیری راحت کلمات روزمره." : "Spoken confidence, curiosity-driven themes, and active contextual vocabulary."}
            </small>
          </div>
          <div className={styles.showcaseBookCard}>
            <span className={styles.showcaseBookLevel}>{isFa ? "بزرگسالان" : "Adult Learners"}</span>
            <strong className={styles.showcaseBookTitle}>{isFa ? "مکالمه، کار و مهاجرت" : "Fluency, Career & Test Prep"}</strong>
            <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>
              {isFa ? "مکالمه روان و خودمانی، موفقیت در کار و دانشگاه و آمادگی آیلتس/تافل." : "Spoken fluency, career advancement, international study & exam credentials."}
            </small>
          </div>
        </div>
      </div>
    );
  }

  if (stepKey === "placement") {
    return (
      <div className={styles.showcaseInteractiveBox}>
        <div style={{ marginBottom: "0.75rem" }}>
          <strong style={{ fontSize: "0.92rem", color: "var(--color-text)" }}>
            {isFa ? "🧠 سنجش ۶ مهارت اصلی در چند دقیقه" : "🧠 Adaptive 6-Skill Diagnostic Testing Engine"}
          </strong>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(9.5rem, 1fr))", gap: "0.5rem" }}>
          {["Grammar", "Vocabulary", "Reading", "Listening", "Speaking", "Writing"].map((skill) => (
            <div key={skill} className={styles.showcaseBookCard} style={{ textAlign: "center", padding: "0.6rem" }}>
              <span className={styles.showcaseBookLevel} dir="ltr">{skill}</span>
              <strong style={{ fontSize: "0.82rem" }}>
                {isFa
                  ? skill === "Grammar" ? "دستور زبان و ساختار"
                  : skill === "Vocabulary" ? "دایره لغات"
                  : skill === "Reading" ? "درک مطلب متن"
                  : skill === "Listening" ? "شنیدن و درک صدا"
                  : skill === "Speaking" ? "صحبت و تلفظ"
                  : "نوشتن درست"
                  : skill}
              </strong>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (stepKey === "report") {
    return (
      <div className={styles.showcaseInteractiveBox}>
        <div style={{ marginBottom: "0.75rem" }}>
          <strong style={{ fontSize: "0.92rem", color: "var(--color-text)" }}>
            {isFa ? "📊 کارنامه شفاف و مشخص شدن سطح واقعی" : "📊 CEFR Benchmark & Radar Skill Profiling"}
          </strong>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(13rem, 1fr))", gap: "0.75rem" }}>
          <div className={styles.showcaseBookCard}>
            <span className={styles.showcaseBookLevel}>{isFa ? "سطح استانداردت" : "International Standard"}</span>
            <strong className={styles.showcaseBookTitle}>A1 → A2 → B1 → B2 → C1 → C2</strong>
            <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>
              {isFa ? "خیلی ساده بهت نشون میدیم الان کجایی و تا هدف بعدیت چقدر راه داری." : "Rigorous mapping against CEFR scales with full transparent evidence logs."}
            </small>
          </div>
          <div className={styles.showcaseBookCard}>
            <span className={styles.showcaseBookLevel}>{isFa ? "شروع بدون معطلی" : "Seamless Handoff"}</span>
            <strong className={styles.showcaseBookTitle}>{isFa ? "معرفی کتاب و تعیین کلاس" : "Handoff to Roadmap & Syllabus"}</strong>
            <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>
              {isFa ? "بر اساس همین کارنامه، کتاب مناسبت انتخاب میشه و کلاست آماده میشه." : "Assessment scores seamlessly dictate textbook matching in Step 4 and cohort placement in Step 5."}
            </small>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export function HomePage({ locale }: { locale: PublicLocale }) {
  const isFa = locale === "fa";
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0);
  const activeStep = loop7Steps[selectedStepIndex] ?? loop7Steps[0];
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Endoora",
    url: locale === "fa" ? "https://endoora.ir/" : "https://endoora.ir/en",
    inLanguage: locale === "fa" ? "fa-IR" : "en",
    description: isFa
      ? "یادگیری خودمانی، راحت و هوشمند زبان انگلیسی در اندورا"
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
          <h1>
            {isFa ? (
              <>
                <span className={styles.heroLine}>
                  <span className={styles.heroBrandWrap}>
                    <svg className={styles.heroSpark} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M12 2C12 7.523 7.523 12 2 12C7.523 12 12 16.477 12 22C12 16.477 16.477 12 22 12C16.477 12 12 7.523 12 2Z"
                        fill="url(#endooraSparkGrad)"
                      />
                      <circle cx="12" cy="12" r="1.5" fill="#ffffff" opacity="0.9" />
                      <defs>
                        <linearGradient id="endooraSparkGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#06b6d4" />
                          <stop offset="1" stopColor="#0284c7" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className={styles.heroBrandText}>ایندورا،</span>
                  </span>
                </span>
                <span className={styles.heroLine}>
                  <span className={styles.heroSubText}>انگلیسی راحت</span>
                </span>
                <span className={styles.heroLine}>
                  <span className={styles.heroAccent}>و&nbsp;هوشمند</span>
                </span>
              </>
            ) : (
              <>Turn English learning into a personal path toward <span className={styles.heroAccent}>real opportunities.</span></>
            )}
          </h1>
          <p>{isFa ? "توی چند دقیقه رایگان تعیین سطح شو، بهترین کتاب آموزشی متناسب با خودت رو بگیر و با کلاس‌های آنلاین و تمرین‌های روزانه ۱۰ دقیقه‌ای، راحت انگلیسی صحبت کن." : "Endoora turns your level, goals, and learning patterns into one clear path—from placement to daily practice and teacher guidance."}</p>
                    <div className={styles.heroActions}>
            <Link className={styles.primaryButton} href={localizedPath(locale, "/placement")}>
              <span>{isFa ? "شروع تعیین سطح رایگان" : "Start free placement"}</span><span aria-hidden="true">{isFa ? "←" : "→"}</span>
            </Link>
            <Link className={styles.secondaryButton} href="#how">
              <span>{isFa ? "مراحل یادگیری و کلاس‌ها" : "Explore learning loop"}</span><span aria-hidden="true">↓</span>
            </Link>
          </div>
        </div>

        <div className={styles.floatingShowcase} aria-label={isFa ? "پیش‌نمایش تعاملی پلتفرم ایندورا" : "Interactive Endoora platform preview"}>
          {/* Ambient backlight glow */}
          <div className={styles.showcaseAura} aria-hidden="true" />
          
          {/* Floating Badge 1: AI Voice Tutor Waveform */}
          <div className={`${styles.floatingBadge} ${styles.badgeVoice}`}>
            <div className={styles.voiceIconBox}>
              <span className={styles.micPulse}>🎙️</span>
            </div>
            <div className={styles.voiceDetails}>
              <div className={styles.voiceTopRow}>
                <span className={styles.voiceTitle}>{isFa ? "تمرین هوشمند تلفظ" : "AI Voice Lab"}</span>
                <span className={styles.voiceScore}>۹۴٪ روانی کلام</span>
              </div>
              <div className={styles.waveformAnimation} aria-hidden="true">
                <span style={{ height: "14px", animationDelay: "0ms" }} />
                <span style={{ height: "22px", animationDelay: "150ms" }} />
                <span style={{ height: "12px", animationDelay: "300ms" }} />
                <span style={{ height: "26px", animationDelay: "100ms" }} />
                <span style={{ height: "18px", animationDelay: "250ms" }} />
                <span style={{ height: "10px", animationDelay: "350ms" }} />
                <span style={{ height: "20px", animationDelay: "200ms" }} />
              </div>
            </div>
          </div>

          {/* Floating Badge 2: Live Cohort Class Reminder */}
          <div className={`${styles.floatingBadge} ${styles.badgeClass}`}>
            <div className={styles.classIconBox}>👥</div>
            <div className={styles.classDetails}>
              <div className={styles.classTimeRow}>
                <strong>{isFa ? "کلاس آنلاین امروز" : "Live Session Today"}</strong>
                <span className={styles.timeTag}>۱۸:۳۰</span>
              </div>
              <span className={styles.cohortSub}>
                {isFa ? "گروه دوستانه ۴ نفره · با استاد رضایی" : "Small Cohort (4 max) · Live"}
              </span>
            </div>
          </div>

          {/* Main Glassmorphic Canvas Card */}
          <div className={styles.canvasCard}>
            {/* Window Topbar */}
            <div className={styles.canvasHeader}>
              <div className={styles.canvasDots} aria-hidden="true">
                <span className={styles.dotRed} />
                <span className={styles.dotYellow} />
                <span className={styles.dotGreen} />
              </div>
              <div className={styles.canvasStatus}>
                <span className={styles.livePulse} />
                <span>{isFa ? "مسیر فعال یادگیری" : "Active Learning Path"}</span>
              </div>
              <span className={styles.canvasTag}>Endoora Twin v2</span>
            </div>

            {/* Profile & Current Level Bar */}
            <div className={styles.canvasProfile}>
              <div className={styles.avatarWrap}>
                <div className={styles.avatarOrb}>
                  <span>E</span>
                </div>
                <div className={styles.avatarInfo}>
                  <div className={styles.avatarTitleRow}>
                    <strong>{isFa ? "مسیر یادگیری من" : "My Learning Path"}</strong>
                    <span className={styles.levelBadge}>B1 · Intermediate</span>
                  </div>
                  <span className={styles.goalText}>
                    {isFa ? "🎯 هدف: مکالمه روان و مصاحبه کاری" : "🎯 Goal: Fluency & Career"}
                  </span>
                </div>
              </div>
              <div className={styles.streakBadge}>
                <span className={styles.streakIcon}>🔥</span>
                <div>
                  <strong>۷ روز</strong>
                  <small>{isFa ? "تمرین متوالی" : "Streak"}</small>
                </div>
              </div>
            </div>

            {/* Interactive Skills Progress Grid */}
            <div className={styles.canvasSkills}>
              <div className={styles.skillsHeading}>
                <span>{isFa ? "وضعیت مهارت‌های زبانی (تحلیل هوش مصنوعی)" : "AI Skill Diagnosis"}</span>
                <span className={styles.accuracyTag}>{isFa ? "دقت ۹۶٪" : "96% Calibrated"}</span>
              </div>
              <div className={styles.skillBars}>
                <div className={styles.skillRow}>
                  <div className={styles.skillLabelRow}>
                    <span className={styles.skillName}>Speaking & Fluency</span>
                    <span className={styles.skillScore}>۷۸٪</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={`${styles.progressFill} ${styles.fillTeal}`} style={{ width: "78%" }} />
                  </div>
                </div>

                <div className={styles.skillRow}>
                  <div className={styles.skillLabelRow}>
                    <span className={styles.skillName}>Vocabulary & Idioms</span>
                    <span className={styles.skillScore}>۸۵٪</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={`${styles.progressFill} ${styles.fillCyan}`} style={{ width: "85%" }} />
                  </div>
                </div>

                <div className={styles.skillRow}>
                  <div className={styles.skillLabelRow}>
                    <span className={styles.skillName}>Listening & Pronunciation</span>
                    <span className={styles.skillScore}>۸۲٪</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={`${styles.progressFill} ${styles.fillIndigo}`} style={{ width: "82%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Next Recommended Milestone */}
            <div className={styles.milestoneFooter}>
              <div className={styles.milestoneIcon}>📚</div>
              <div className={styles.milestoneText}>
                <strong>American English File 3</strong>
                <small>{isFa ? "کتاب اختصاصی سطح متوسط · جلسه ۴ از ۱۲" : "Recommended Syllabus · Session 4/12"}</small>
              </div>

            </div>
          </div>
        </div>
      </section>

      <section id="how" className={`${styles.section} ${styles.loopSection}`}>
        <div className={styles.sectionHeading}>
          <span className={styles.sectionLabel}>
            {isFa ? "مسیر یادگیری گام‌به‌گام" : "The Endoora 7-Step Learning Loop"}
          </span>
          <h2>
            {isFa ? "از تعیین سطح تا مکالمه روان در ۷ قدم ساده" : "From Diagnostic Placement to Live Class & AI Deep Practice"}
          </h2>
          <p>
            {isFa
              ? "روی هر مرحله کلیک کن یا برو روش تا ببینی چطوری از صفر تا تسلط کامل کنارتیم:"
              : "Hover or click any stage to explore curriculum textbooks, live class matching, daily missions, and AI labs in real time."}
          </p>
        </div>

        <ol className={styles.loopGrid7}>
          {loop7Steps.map((step, idx) => {
            const isActive = selectedStepIndex === idx;
            return (
              <li
                key={step.number}
                className={styles.loopStepCard}
                data-active={isActive ? "true" : undefined}
                onMouseEnter={() => setSelectedStepIndex(idx)}
                onClick={() => setSelectedStepIndex(idx)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedStepIndex(idx);
                  }
                }}
                aria-label={`${step.number}: ${isFa ? step.fa : step.en}`}
              >
                <span className={styles.loopStepNumberBadge}>{step.number}</span>
                <div className={styles.loopStepIcon} aria-hidden="true">
                  <span>{step.icon}</span>
                </div>
                <h3 className={styles.loopStepTitle}>{isFa ? step.fa : step.en}</h3>
                <div className={styles.loopStepSubtitle}>{isFa ? step.subtitleFa : step.subtitleEn}</div>
                <p className={styles.loopStepBrief}>{isFa ? step.bodyFa : step.bodyEn}</p>
              </li>
            );
          })}
        </ol>

        {/* Dynamic Interactive Showcase */}
        <div className={styles.dynamicShowcase} key={activeStep.stepKey}>
          <div className={styles.showcaseTop}>
            <div className={styles.showcaseTitleGroup}>
              <div className={styles.showcaseBigIcon} aria-hidden="true">
                {activeStep.icon}
              </div>
              <div>
                <h4 className={styles.showcaseHeading}>
                  {activeStep.number}. {isFa ? activeStep.fa : activeStep.en}
                </h4>
                <p className={styles.showcaseSubheading}>
                  {isFa ? activeStep.subtitleFa : activeStep.subtitleEn}
                </p>
              </div>
            </div>
            <span className={styles.showcaseBadge}>
              {isFa ? activeStep.badgeFa : activeStep.badgeEn}
            </span>
          </div>

          <p className={styles.showcaseBodyText}>
            {isFa ? activeStep.bodyFa : activeStep.bodyEn}
          </p>

          {/* Specialized Interactive Detail Box */}
          <ShowcaseInteractiveDetail stepKey={activeStep.stepKey} isFa={isFa} />

          {/* Highlights Grid */}
          <div className={styles.showcaseHighlightsGrid}>
            {(isFa ? activeStep.highlightsFa : activeStep.highlightsEn).map((highlight) => (
              <div key={highlight} className={styles.showcaseHighlightItem}>
                <span>{highlight}</span>
              </div>
            ))}
          </div>

          <div className={styles.showcaseFooter}>
            <Link
              className={styles.primaryButton}
              href={
                activeStep.actionHref.startsWith("/auth/")
                  ? accountPath(locale, activeStep.actionHref as "/auth/login" | "/auth/register")
                  : localizedPath(locale, activeStep.actionHref)
              }
            >
              <span>{isFa ? activeStep.actionLabelFa : activeStep.actionLabelEn}</span>
              <span aria-hidden="true">{isFa ? "←" : "→"}</span>
            </Link>
            <Link
              className={styles.textLink}
              href={localizedPath(locale, "/how-it-works")}
            >
              <span>{isFa ? "راهنمای کامل مراحل یادگیری" : "Read complete learning loop guide"}</span>
              <span aria-hidden="true">{isFa ? "←" : "→"}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* <section id="features" /> */}

      <section className={styles.humanBand}>
        <div className={styles.humanCopy}>
          <span className={styles.sectionLabel}>{isFa ? "استاد واقعی + هوش مصنوعی" : "AI + human guidance"}</span>
          <h2>
            {isFa ? (
              <>
                <span className={styles.humanNavyText}>یادگیری هوشمند،</span>{" "}
                <span className={styles.humanTealHighlight}>همراهی واقعی</span>
              </>
            ) : (
              "AI for personalization, with human review where it matters"
            )}
          </h2>
          <p>{isFa ? "هر موقع خواستی با هوش مصنوعی تمرین کن و اشکالاتت رو بگیر؛ سر کلاس آنلاین هم استاد باهات کار می‌کنه و بهت بازخورد میده تا سریع‌تر پیشرفت کنی." : "Endoora’s teacher marketplace is built around verification, least-privilege data access, and clear links to learning evidence. AI supports—not replaces—professional judgment."}</p>
          <Link className={styles.textLink} href={localizedPath(locale, "/teachers")}>{isFa ? "دیدن لیست استادها" : "Explore the teacher pathway"}<span aria-hidden="true">{isFa ? "←" : "→"}</span></Link>
        </div>
        <ol className={styles.humanSteps}>
          <li><span>01</span><strong>{isFa ? "سنجش سطح تو" : "Learning evidence"}</strong><small>{isFa ? "دیدن توانایی‌های واقعی" : "Only relevant data"}</small></li>
          <li><span>02</span><strong>{isFa ? "تمرین هوشمند" : "AI suggestion"}</strong><small>{isFa ? "تمرین ۲۴ ساعته" : "With explicit limits"}</small></li>
          <li><span>03</span><strong>{isFa ? "کلاس با استاد" : "Teacher feedback"}</strong><small>{isFa ? "مکالمه و رفع اشکال" : "Within authorized access"}</small></li>
        </ol>
      </section>

      {/* <section id="faq" className={`${styles.section} ${styles.faqSection}`}><PublicFaq locale={locale} /></section> */}
    </>
  );
}
