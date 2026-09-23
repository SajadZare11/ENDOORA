"use client";

import Link from "next/link";
import { useState } from "react";

import {
  accountPath,
  localizedPath,
  type PublicLocale,
} from "../../lib/public-site";
import { PublicFaq } from "./PublicFaq";
import { WaitlistForm } from "./WaitlistForm";
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
    fa: "ورود و ارزیابی هدفمند",
    en: "Onboarding & Goal Profiling",
    subtitleFa: "رده سنی و تعیین هدف اصلی",
    subtitleEn: "Age group & core learner intent",
    bodyFa: "ثبت مشخصات و رده سنی (خردسال ۴-۷، کودک و نوجوان ۸-۱۲ یا بزرگسال) و هدف اصلی یادگیری (عمومی، مهاجرت، آیلتس یا تافل) جهت تنظیم اولیه نقشه راه.",
    bodyEn: "Profile registration, age bracket (young 4–7, 8–12, adult), and core learning goals to calibrate the personalized journey from day one.",
    icon: "🎯",
    badgeFa: "گام ۱: مشخصات هدفمند",
    badgeEn: "Step 1: Goal Profile",
    highlightsFa: [
      "خردسالان (۴ تا ۷ سال): شعر، داستان‌های صوتی و فونیکس قوی",
      "کودکان و نوجوانان (۸ تا ۱۲ سال): یادگیری تعاملی و داستان‌های جذاب",
      "بزرگسالان: مکالمه عمومی، کار، مهاجرت و آزمون‌های بین‌المللی",
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
    fa: "آزمون تعیین سطح ۶ مهارتی",
    en: "6-Skill Placement Test",
    subtitleFa: "سنجش متوازن، دقیق و تطبیقی",
    subtitleEn: "Adaptive 6-skill diagnostic assessment",
    bodyFa: "سنجش جامع ۶ مهارت (دستور زبان، واژگان، خواندن، شنیداری، گفتاری و نگارش) بر پایه هوش مصنوعی تطبیقی بدون تخمین تصادفی و داده ساختگی.",
    bodyEn: "Comprehensive adaptive assessment across Grammar, Vocabulary, Reading, Listening, Speaking, and Writing without synthetic score guesswork.",
    icon: "🧠",
    badgeFa: "گام ۲: ارزیابی ۶ مهارتی",
    badgeEn: "Step 2: 6-Skill Engine",
    highlightsFa: [
      "سنجش تطبیقی گرامر و واژگان بر مبنای هوش مصنوعی",
      "ارزیابی تلفظ و روانی کلام با تحلیل بلادرنگ صوت",
      "درک مطلب، شنیداری و تحلیل ساختار نگارش",
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
    fa: "کارنامه تحلیلی CEFR",
    en: "CEFR Diagnostic Report",
    subtitleFa: "تراز استاندارد بین‌المللی (A1 تا C2)",
    subtitleEn: "Standardized international CEFR benchmark",
    bodyFa: "ارائه نمودار تحلیلی نقاط قوت و نیازمند رشد، شواهد پاسخ‌ها و تعیین تراز دقیق استاندارد بین‌المللی CEFR از مبتدی تا پیشرفته.",
    bodyEn: "Transparent evidence summary, radar skill breakdown, and rigorous CEFR diagnostic classification from Beginner (A1) to Advanced (C2).",
    icon: "📊",
    badgeFa: "گام ۳: کارنامه استاندارد",
    badgeEn: "Step 3: CEFR Benchmark",
    highlightsFa: [
      "محاسبه تراز دقیق CEFR (A1, A2, B1, B2, C1, C2)",
      "نمودار راداری و نمرات تفکیکی هر ۶ مهارت",
      "مبنای علمی موثق برای انتخاب خودکار کتاب آموزشی",
    ],
    highlightsEn: [
      "Rigorous CEFR benchmark (A1, A2, B1, B2, C1, C2)",
      "Radar chart & separate diagnostic scores across all 6 skills",
      "Evidence-grounded baseline for automated textbook mapping",
    ],
    actionHref: "/placement/report",
    actionLabelFa: "مشاهده نمونه کارنامه تحلیلی",
    actionLabelEn: "View Diagnostic Report",
  },
  {
    number: "04",
    stepKey: "roadmap",
    fa: "مسیر اختصاصی و کتاب آموزشی",
    en: "Personalized Path & Book Mapping",
    subtitleFa: "نگاشت خودکار کتاب استاندارد و گراف مسیر",
    subtitleEn: "Automated textbook syllabus & progression graph",
    bodyFa: "سیستم بر اساس سطح دقیق دانشجو، معتبرترین کتاب درسی استاندارد را اختصاص داده و نمودارهای گراف پیشرفت فعلی و آتی، سرفصل‌ها، گرامرها و اهداف مکالمه را نمایش می‌دهد.",
    bodyEn: "Automated curriculum matching to standard coursebooks based on placement evidence, generating interactive visual progression roadmaps for present and future phases.",
    icon: "📚",
    badgeFa: "گام ۴: نقشه کتب درسی و سرفصل‌ها",
    badgeEn: "Step 4: Textbook & Syllabus Roadmap",
    highlightsFa: [
      "مبتدی (A1): American English File Starter (Oxford)",
      "مقدماتی (A2): American English File 1 & 2 (Oxford)",
      "پیش‌متوسط تا متوسط (B1): American English File 3 (Oxford)",
      "فوق‌متوسط (B2): American English File 4 (Oxford)",
      "پیشرفته (C1–C2): American English File 5 و کتب آزمون CAE",
      "خردسالان (۴–۷): Family and Friends — شعر، داستان، فونیکس قوی",
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
    actionLabelFa: "مشاهده مسیر اختصاصی و کتاب‌ها",
    actionLabelEn: "Explore Personalized Path & Books",
  },
  {
    number: "05",
    stepKey: "liveClass",
    fa: "ثبت‌نام در کلاس آنلاین زنده",
    en: "Live Online Class Enrollment",
    subtitleFa: "اتصال به مدرس و گروه‌های همسطح (تا ۴ نفر)",
    subtitleEn: "Smart teacher matching & cohort clustering (max 4)",
    bodyFa: "زبان‌آموز روزهای آزاد و نوع کلاس (انفرادی یا گروهی با تا ۳ همکلاسی همسطح، حداکثر ۴ نفر) را انتخاب می‌کند. درخواست به استخر کلاس‌های داشبورد مدرسان ارسال شده، مدرسان گروه‌ها را تایید و پس از هر جلسه، مباحث و تکالیف تدریس‌شده را در سیستم ثبت می‌کنند.",
    bodyEn: "Learners select weekly availability and preferred format (solo 1-on-1 or small group with up to 3 classmates, max 4 students). Requests appear in the teacher pool where smart cohorts cluster and teachers log taught units and homework.",
    icon: "👥",
    badgeFa: "گام ۵: کلاس زنده + داشبورد مدرسان",
    badgeEn: "Step 5: Live Cohort Matching",
    highlightsFa: [
      "کلاس انفرادی (خصوصی ۱ نفره) یا گروهی با حداکثر ۳ همکلاسی همسطح",
      "تنظیم روزها و سانس‌های زمانی آزاد هفتگی توسط زبان‌آموز",
      "استخر درخواست‌های کلاسی در داشبورد مدرسان برای پذیرش سریع",
      "پیشنهاد هوشمند سیستم برای گروه‌بندی زبان‌آموزان همسطح با زمان مشترک",
      "برگزاری در اسکای‌روم / گوگل میت و ثبت گزارش تدریس و تکالیف توسط مدرس",
    ],
    highlightsEn: [
      "1-on-1 solo private or small group with up to 3 classmates (4 students max)",
      "Learner selects weekly available days and time windows",
      "Class request pool in teacher dashboard for quick claim & acceptance",
      "Smart cohort clustering for learners with matching CEFR & common availability",
      "Skyroom / Google Meet live links and post-session teacher lesson & homework logs",
    ],
    actionHref: "/path#enroll",
    actionLabelFa: "ثبت‌نام و انتخاب زمان کلاس",
    actionLabelEn: "Enroll in a Live Class",
  },
  {
    number: "06",
    stepKey: "dailyMission",
    fa: "ماموریت روزانه انطباقی",
    en: "Adaptive Daily Mission",
    subtitleFa: "تکالیف مدرس در اولویت اول + مرور فاصله‌دار SRS",
    subtitleEn: "Priority teacher homework + Spaced Repetition (SRS)",
    bodyFa: "برنامه تمرین روزانه هوشمند و کوتاه؛ تکالیف محول‌شده توسط مدرس در آخرین جلسه زنده به عنوان اولویت اول در ماموریت امروز قرار می‌گیرد، همراه با مرور کارت‌های واژگان با متد SRS برای ماندگاری در حافظه بلندمدت.",
    bodyEn: "Manageable daily learning rhythm where homework assigned in the latest live teacher session takes priority #1, combined with spaced-repetition (SRS) vocabulary consolidation.",
    icon: "⚡",
    badgeFa: "گام ۶: تثبیت روزانه و تکالیف",
    badgeEn: "Step 6: Daily Mission & SRS",
    highlightsFa: [
      "اولویت اول یادگیری: تکالیف محول‌شده توسط مدرس در آخرین جلسه آنلاین",
      "مرور فاصله‌دار علمی کارت‌های واژگان (Spaced Repetition System)",
      "تمرین روزانه کوتاه ۱۰ تا ۱۵ دقیقه‌ای برای ایجاد عادت پایدار",
      "به‌روزرسانی خودکار پیشرفت و تطبیق مسیر با سرعت زبان‌آموز",
    ],
    highlightsEn: [
      "Priority #1: Live class homework assigned by your teacher in the latest session",
      "Spaced Repetition System (SRS) for long-term vocabulary retention",
      "Focused 10–15 minute daily practice rhythm for sustainable habit building",
      "Continuous adaptation to your pace and newly identified learning gaps",
    ],
    actionHref: "/today",
    actionLabelFa: "مشاهده ماموریت روزانه امروز",
    actionLabelEn: "View Today's Mission",
  },
  {
    number: "07",
    stepKey: "aiLabs",
    fa: "آزمایشگاه‌های تمرین عمیق AI",
    en: "AI Labs & Deep Practice",
    subtitleFa: "مربی نگارش، صوت، مکالمه تعاملی و ژنوم اشتباهات",
    subtitleEn: "Writing Mentor, Voice Lab, AI Roleplay & Mistake Genome",
    bodyFa: "تمرین نامحدود در مربی نگارش هوشمند (Writing Mentor)، آزمایشگاه صوت و تلفظ (Voice Lab)، شبیه‌ساز مکالمه در دنیای واقعی (AI Roleplay) و تمرین روی ژنوم اشتباهات پرتکرار (Mistake Genome).",
    bodyEn: "Unbounded interactive practice across the AI Writing Mentor, Voice & Pronunciation Lab, situational AI Roleplay conversations, and Mistake Genome remediation.",
    icon: "🔬",
    badgeFa: "گام ۷: آزمایشگاه‌های هوش مصنوعی",
    badgeEn: "Step 7: AI Labs & Deep Practice",
    highlightsFa: [
      "AI Writing Mentor: تحلیل هوشمند مقالات، پیشنهاد بازنویسی و اصلاح گرامری",
      "Voice & Pronunciation Lab: تحلیل تلفظ، اکسنت، روانی گفتار و ریتم کلام",
      "AI Roleplay: شبیه‌سازی مکالمات واقعی (مصاحبه کاری، فرودگاه، هتل، کافه)",
      "Mistake Genome: شناسایی الگوهای اشتباه پرتکرار و تمرین‌های میکرولرنینگ هدفمند",
    ],
    highlightsEn: [
      "AI Writing Mentor: Essay & paragraph analysis, rewriting suggestions & grammar check",
      "Voice & Pronunciation Lab: Real-time pronunciation, accent, rhythm, and fluency feedback",
      "AI Roleplay: Situational immersion (job interview, airport, hotel, restaurant)",
      "Mistake Genome: Recurring error pattern analysis and focused micro-drills",
    ],
    actionHref: "/practice-ai",
    actionLabelFa: "ورود به آزمایشگاه‌های هوش مصنوعی",
    actionLabelEn: "Open AI Practice Labs",
  },
];

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

function ShowcaseInteractiveDetail({ stepKey, isFa }: { stepKey: string; isFa: boolean }) {
  if (stepKey === "roadmap") {
    const books = [
      {
        level: isFa ? "مبتدی (A1)" : "Beginner (A1)",
        book: "American English File Starter (Oxford)",
        desc: isFa ? "مقدمات مکالمه، واژگان پایه و فونیکس صوتی" : "Foundational speaking, starter vocabulary & phonics",
      },
      {
        level: isFa ? "مقدماتی (A2)" : "Elementary (A2)",
        book: "American English File 1 & 2 (Oxford)",
        desc: isFa ? "تقویت مکالمه روزمره، جمله‌سازی و زمان‌های گذشته و آینده" : "Everyday fluency, sentence construction & past/future tenses",
      },
      {
        level: isFa ? "پیش‌متوسط تا متوسط (B1)" : "Pre-Intermediate to Intermediate (B1)",
        book: "American English File 3 (Oxford)",
        desc: isFa ? "توسعه بحث، افعال وجهی، واژگان موضوعی و اصطلاحات" : "Discussion skills, modals, topical vocab & natural idioms",
      },
      {
        level: isFa ? "فوق‌متوسط (B2)" : "Upper-Intermediate (B2)",
        book: "American English File 4 (Oxford)",
        desc: isFa ? "تسلط بر متون نیمه‌تخصصی، مناظره و ساختارهای پیچیده گرامری" : "Nuanced debate, semi-technical texts & complex grammar",
      },
      {
        level: isFa ? "پیشرفته (C1–C2)" : "Advanced (C1–C2)",
        book: "American English File 5 & Cambridge CAE",
        desc: isFa ? "تسلط بومی‌گونه، مهارت‌های آکادمیک و آمادگی عالی" : "Near-native mastery, academic nuance & CAE advanced prep",
      },
      {
        level: isFa ? "خردسالان (۴ تا ۷ سال)" : "Young Learners (4–7)",
        book: "Family and Friends (Oxford)",
        desc: isFa ? "آهنگ‌ها، داستان‌های شاد، آموزش قوی فونیکس و الفبا" : "Joyful songs, picture stories & solid phonics foundations",
      },
      {
        level: isFa ? "کودکان و نوجوانان (۸ تا ۱۲ سال)" : "Young Learners (8–12)",
        book: "Oxford Discover / Super Minds / Fly High",
        desc: isFa ? "کشف جهان، پروژه‌های تعاملی و داستان‌های تقویت مکالمه" : "Inquiry-based discovery, interactive projects & spoken confidence",
      },
      {
        level: isFa ? "آزمون آیلتس (IELTS)" : "IELTS Exam Prep",
        book: "Cambridge IELTS Series + Road to IELTS + Target Band 7",
        desc: isFa ? "تست‌های رسمی کمبریج، استراتژی‌های آکادمیک و لیسنینگ" : "Official Cambridge past papers, Academic strategies & timing drills",
      },
      {
        level: isFa ? "آزمون تافل (TOEFL)" : "TOEFL Exam Prep",
        book: "Barron's TOEFL iBT + Delta's Key to TOEFL",
        desc: isFa ? "تمرینات شبیه‌سازی‌شده iBT، نگارش و درک مطلب پیشرفته" : "iBT practice tests, integrated writing & advanced reading skills",
      },
      {
        level: isFa ? "واژگان تخصصی" : "Vocabulary Mastery",
        book: "4000 Essential English Words & Essential Words",
        desc: isFa ? "تثبیت واژگان پرکاربرد با روش علمی مرور فاصله‌دار" : "Spaced-repetition mastery of high-frequency frequency corpora",
      },
    ];

    return (
      <div className={styles.showcaseInteractiveBox}>
        <div style={{ marginBottom: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <strong style={{ fontSize: "0.92rem", color: "var(--color-text)" }}>
            {isFa ? "📚 نگاشت هوشمند کتب درسی معتبر بر اساس نتیجه تعیین سطح" : "📚 Smart Textbook Mapping Grounded in Diagnostic Level"}
          </strong>
          <small style={{ color: "var(--color-muted)" }}>
            {isFa ? "همراه با نمودار گراف پیشرفت مرحله فعلی و آتی" : "With present & future milestone progression graphs"}
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
            {isFa ? "👥 ثبت‌نام کلاس آنلاین زنده با مدرس و گروه‌بندی هوشمند" : "👥 Live Class Matching & Smart Cohort Clustering"}
          </strong>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))", gap: "0.75rem" }}>
          <div className={styles.showcaseBookCard}>
            <span className={styles.showcaseBookLevel}>{isFa ? "فرمت ۱: کلاس انفرادی" : "Format 1: Solo 1-on-1"}</span>
            <strong className={styles.showcaseBookTitle}>{isFa ? "کلاس خصوصی اختصاصی" : "Private Dedicated Class"}</strong>
            <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>
              {isFa ? "تمرکز ۱۰۰٪ مدرس بر نیازهای شما، زمان‌بندی کاملاً منعطف و رفع اشکال شخصی‌سازی‌شده." : "100% teacher focus on your exact pace, flexible schedule, and bespoke feedback."}
            </small>
          </div>
          <div className={styles.showcaseBookCard}>
            <span className={styles.showcaseBookLevel}>{isFa ? "فرمت ۲: گروه کوچک همسطح" : "Format 2: Small Cohort"}</span>
            <strong className={styles.showcaseBookTitle}>{isFa ? "تا ۳ همکلاسی (حداکثر ۴ نفر)" : "Up to 3 Classmates (Max 4 Students)"}</strong>
            <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>
              {isFa ? "مکالمه تعاملی همتا، شبیه‌سازی فضای زنده کلاسی، هزینه اقتصادی‌تر و انگیزه یادگیری گروهی." : "Peer roleplay, vibrant classroom dynamics, cost-effective pricing, and group energy."}
            </small>
          </div>
          <div className={styles.showcaseBookCard}>
            <span className={styles.showcaseBookLevel}>{isFa ? "اتصال خودکار به داشبورد" : "Teacher Request Pool"}</span>
            <strong className={styles.showcaseBookTitle}>{isFa ? "تایید مدرس و ثبت سرفصل و تکلیف" : "Teacher Claim & Post-Session Homework"}</strong>
            <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>
              {isFa ? "مدرس پس از هر جلسه آنلاین، دروس تدریس‌شده و تکالیف را ثبت کرده و مستقیماً وارد مأموریت روزانه شما می‌کند." : "Teachers log taught topics and homework after every session, feeding straight into your Daily Mission."}
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
            {isFa ? "⚡ ساختار مأموریت روزانه (انطباقی و متمرکز بر زمان)" : "⚡ Daily Mission Architecture (Adaptive & Habit-Forming)"}
          </strong>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))", gap: "0.75rem" }}>
          <div className={styles.showcaseBookCard}>
            <span className={styles.showcaseBookLevel} style={{ color: "#d97706" }}>{isFa ? "⭐ اولویت اول" : "⭐ Priority #1"}</span>
            <strong className={styles.showcaseBookTitle}>{isFa ? "تکالیف مدرس کلاس زنده" : "Teacher Live Class Homework"}</strong>
            <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>
              {isFa ? "تکالیف و تمرین‌های تعیین‌شده توسط مدرس در آخرین جلسه آنلاین جهت آمادگی برای جلسه بعدی." : "Direct homework tasks assigned by your teacher in the latest live session to prepare for your next class."}
            </small>
          </div>
          <div className={styles.showcaseBookCard}>
            <span className={styles.showcaseBookLevel}>{isFa ? "🔄 اولویت دوم" : "🔄 Priority #2"}</span>
            <strong className={styles.showcaseBookTitle}>{isFa ? "مرور فاصله‌دار واژگان (SRS)" : "Spaced Repetition Review (SRS)"}</strong>
            <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>
              {isFa ? "مرور کارت‌های واژگان فعال بر پایه الگوریتم فراموشی ابینگهاوس برای انتقال به حافظه بلندمدت." : "Scientific flashcard reviews scheduled at the optimal moment right before forgetting occurs."}
            </small>
          </div>
          <div className={styles.showcaseBookCard}>
            <span className={styles.showcaseBookLevel}>{isFa ? "⏱ ریتم پایدار" : "⏱ Sustainable Rhythm"}</span>
            <strong className={styles.showcaseBookTitle}>{isFa ? "۱۰ الی ۱۵ دقیقه در روز" : "10–15 Minutes Daily"}</strong>
            <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>
              {isFa ? "تمرینات کوتاه و پیوسته که در هر برنامه‌ای جا می‌گیرد و مانع از افت انگیزه می‌شود." : "Bite-sized, focused practice designed to fit busy lifestyles without burnout."}
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
            {isFa ? "🔬 ۴ آزمایشگاه تمرین عمیق هوش مصنوعی" : "🔬 4 Specialized AI Deep Practice Labs"}
          </strong>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(13rem, 1fr))", gap: "0.75rem" }}>
          <div className={styles.showcaseBookCard}>
            <span className={styles.showcaseBookLevel}>✍️ AI Writing Mentor</span>
            <strong className={styles.showcaseBookTitle}>{isFa ? "مربی هوشمند نگارش" : "Essay & Paragraph Mentor"}</strong>
            <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>
              {isFa ? "اصلاح گرامر، پیشنهاد بازنویسی روان‌تر و نمره‌دهی معیارهای آکادمیک." : "Grammar rectification, natural phrasing suggestions & band criterion feedback."}
            </small>
          </div>
          <div className={styles.showcaseBookCard}>
            <span className={styles.showcaseBookLevel}>🎙️ Voice Lab</span>
            <strong className={styles.showcaseBookTitle}>{isFa ? "آزمایشگاه صوت و تلفظ" : "Voice & Pronunciation Lab"}</strong>
            <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>
              {isFa ? "تحلیل فونتیک، استرس کلمات، سرعت کلام و روانی گفتار با بازخورد زنده." : "Phonetic breakdown, syllable stress, cadence, and real-time fluency scoring."}
            </small>
          </div>
          <div className={styles.showcaseBookCard}>
            <span className={styles.showcaseBookLevel}>🎭 AI Roleplay</span>
            <strong className={styles.showcaseBookTitle}>{isFa ? "شبیه‌ساز مکالمه تعاملی" : "Situational AI Roleplay"}</strong>
            <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>
              {isFa ? "مکالمه نامحدود در سناریوهای فرودگاه، هتل، مصاحبه شغلی و محیط‌های کاری." : "Interactive dialogues in job interviews, business negotiations, and travel scenarios."}
            </small>
          </div>
          <div className={styles.showcaseBookCard}>
            <span className={styles.showcaseBookLevel}>🧬 Mistake Genome</span>
            <strong className={styles.showcaseBookTitle}>{isFa ? "ژنوم اشتباهات پرتکرار" : "Mistake Pattern Genome"}</strong>
            <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>
              {isFa ? "ردیابی الگوهای خطای زبان‌آموزان ایرانی و طراحی تمرین‌های دقیق میکرولرنینگ." : "Pinpoints Iranian learner error patterns with surgical targeted micro-drills."}
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
            {isFa ? "🎯 دسته‌بندی هوشمند بر اساس سن و هدف" : "🎯 Calibrated Demographics & Learner Intent"}
          </strong>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))", gap: "0.75rem" }}>
          <div className={styles.showcaseBookCard}>
            <span className={styles.showcaseBookLevel}>{isFa ? "۴ تا ۷ سال" : "Ages 4–7"}</span>
            <strong className={styles.showcaseBookTitle}>{isFa ? "خردسالان (Kids Starter)" : "Early Childhood Learners"}</strong>
            <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>
              {isFa ? "آشنایی با صداها، حروف الفبا، شعرها و بازی‌های سرگرم‌کننده بصری." : "Engaging sounds, phonics fundamentals, playful songs, and illustrated stories."}
            </small>
          </div>
          <div className={styles.showcaseBookCard}>
            <span className={styles.showcaseBookLevel}>{isFa ? "۸ تا ۱۲ سال" : "Ages 8–12"}</span>
            <strong className={styles.showcaseBookTitle}>{isFa ? "کودکان و نوجوانان" : "Young Learners & Juniors"}</strong>
            <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>
              {isFa ? "ایجاد اعتمادبه‌نفس مکالمه، داستان‌های جذاب و تقویت دایره لغات فعال." : "Spoken confidence, curiosity-driven themes, and active contextual vocabulary."}
            </small>
          </div>
          <div className={styles.showcaseBookCard}>
            <span className={styles.showcaseBookLevel}>{isFa ? "بزرگسالان" : "Adult Learners"}</span>
            <strong className={styles.showcaseBookTitle}>{isFa ? "عمومی، مهاجرت و آزمون" : "Fluency, Career & Test Prep"}</strong>
            <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>
              {isFa ? "مکالمه سلیس، آمادگی مصاحبه کاری، پیشرفت شغلی و آمادگی آیلتس/تافل." : "Spoken fluency, career advancement, international study & exam credentials."}
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
            {isFa ? "🧠 ارزیابی تطبیقی ۶ مهارت زبانی بدون داده‌های تصادفی" : "🧠 Adaptive 6-Skill Diagnostic Testing Engine"}
          </strong>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(9.5rem, 1fr))", gap: "0.5rem" }}>
          {["Grammar", "Vocabulary", "Reading", "Listening", "Speaking", "Writing"].map((skill) => (
            <div key={skill} className={styles.showcaseBookCard} style={{ textAlign: "center", padding: "0.6rem" }}>
              <span className={styles.showcaseBookLevel} dir="ltr">{skill}</span>
              <strong style={{ fontSize: "0.82rem" }}>
                {isFa
                  ? skill === "Grammar" ? "دستور زبان تطبیقی"
                  : skill === "Vocabulary" ? "دایره واژگان"
                  : skill === "Reading" ? "درک مطلب متنی"
                  : skill === "Listening" ? "شنیداری چند لهجه"
                  : skill === "Speaking" ? "تلفظ و روان‌گویی"
                  : "نگارش و انسجام"
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
            {isFa ? "📊 کارنامه تحلیلی CEFR و نمودار راداری مهارت‌ها" : "📊 CEFR Benchmark & Radar Skill Profiling"}
          </strong>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(13rem, 1fr))", gap: "0.75rem" }}>
          <div className={styles.showcaseBookCard}>
            <span className={styles.showcaseBookLevel}>{isFa ? "تراز بین‌المللی" : "International Standard"}</span>
            <strong className={styles.showcaseBookTitle}>A1 → A2 → B1 → B2 → C1 → C2</strong>
            <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>
              {isFa ? "تعیین سطح مطابق با چارچوب اروپایی CEFR با تفکیک نقاط قوت و ضعف." : "Rigorous mapping against CEFR scales with full transparent evidence logs."}
            </small>
          </div>
          <div className={styles.showcaseBookCard}>
            <span className={styles.showcaseBookLevel}>{isFa ? "اتصال مستقیم" : "Seamless Handoff"}</span>
            <strong className={styles.showcaseBookTitle}>{isFa ? "انتقال داده به نقشه راه و کتاب" : "Handoff to Roadmap & Syllabus"}</strong>
            <small style={{ color: "var(--color-muted)", fontSize: "0.76rem", lineHeight: "1.4" }}>
              {isFa ? "نتیجه ارزیابی مستقیماً مبنای کتاب استاندارد در گام ۴ و کلاس در گام ۵ قرار می‌گیرد." : "Assessment scores seamlessly dictate textbook matching in Step 4 and cohort placement in Step 5."}
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
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(3);
  const activeStep = loop7Steps[selectedStepIndex] ?? loop7Steps[0];
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
          <h1>
            {isFa ? <>یادگیری انگلیسی را به مسیری شخصی برای <span className={styles.heroAccent}>فرصت‌های واقعی</span> تبدیل کن.</> : <>Turn English learning into a personal path toward <span className={styles.heroAccent}>real opportunities.</span></>}
          </h1>
          <p>{isFa ? "Endoora از سطح، هدف و الگوهای یادگیری تو یک مسیر روشن می‌سازد؛ از تعیین سطح تا تمرین روزانه و همراهی مدرس." : "Endoora turns your level, goals, and learning patterns into one clear path—from placement to daily practice and teacher guidance."}</p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryButton} href={localizedPath(locale, "/placement")}>
              <span>{isFa ? "شروع تعیین سطح رایگان" : "Start free placement"}</span><span aria-hidden="true">{isFa ? "←" : "→"}</span>
            </Link>
            <Link className={styles.secondaryButton} href={localizedPath(locale, "/how-it-works")}>
              <span>{isFa ? "مشاهده مسیر یادگیری" : "See how the path works"}</span><span aria-hidden="true">{isFa ? "←" : "→"}</span>
            </Link>
          </div>
        </div>

        <div className={styles.twinCard} aria-label={isFa ? "پیش‌نمایش محصول Learner Twin" : "Learner Twin product preview"}>
          <div className={styles.previewChrome}><span /><span /><span /><strong>Learner Twin</strong></div>
          <div className={styles.previewBody}>
            <aside className={styles.previewRail} aria-hidden="true"><b>E</b><span /><span /><span /><span /></aside>
            <div className={styles.previewContent}>
              <div className={styles.previewIntro}>
                <div>
                  <span>Learner Twin</span>
                  <h2>{isFa ? "مسیر یادگیری شما" : "Your learning path"}</h2>
                  <p>{isFa ? "یک نمای زنده و قابل اصلاح از پیشرفت تو" : "A living, correctable view of your progress"}</p>
                </div>
                <Link href={localizedPath(locale, "/features/learner-twin")}>{isFa ? "جزئیات" : "Details"}</Link>
              </div>
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
          <span className={styles.sectionLabel}>
            {isFa ? "چرخه یادگیری Endoora (مسیر ۷ مرحله‌ای)" : "The Endoora 7-Step Learning Loop"}
          </span>
          <h2>
            {isFa ? "از شناخت و تعیین سطح تا کلاس آنلاین و تثبیت روزانه" : "From Diagnostic Placement to Live Class & AI Deep Practice"}
          </h2>
          <p>
            {isFa
              ? "روی هر مرحله بروید یا کلیک کنید تا جزئیات کتب استاندارد، کلاس‌های آنلاین، مأموریت روزانه و آزمایشگاه‌های هوش مصنوعی را به صورت زنده مشاهده کنید."
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
              href={localizedPath(locale, activeStep.actionHref)}
            >
              <span>{isFa ? activeStep.actionLabelFa : activeStep.actionLabelEn}</span>
              <span aria-hidden="true">{isFa ? "←" : "→"}</span>
            </Link>
            <Link
              className={styles.textLink}
              href={localizedPath(locale, "/how-it-works")}
            >
              <span>{isFa ? "مطالعه راهنمای کامل چرخه یادگیری" : "Read complete learning loop guide"}</span>
              <span aria-hidden="true">{isFa ? "←" : "→"}</span>
            </Link>
          </div>
        </div>
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
        <div className={styles.waitlistActions}>
          <WaitlistForm locale={locale} source="homepage" />
          <Link href={accountPath(locale, "/auth/register")}>{isFa ? "همین حالا حساب Endoora را بساز" : "Create your Endoora account now"}<span aria-hidden="true">{isFa ? "←" : "→"}</span></Link>
        </div>
      </section>
    </>
  );
}
