"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { EndooraWordmark } from "@endoora/ui";
import styles from "./information-architecture.module.css";

type Locale = "fa" | "en";
type NavItem = { fa: string; en: string; href: string };
type Flow = { fa: string; en: string; pathFa: string; pathEn: string; targetFa: string; targetEn: string };

const t = {
  fa: {
    day: "روز ۰۵ · تجربه محصول",
    pageTitle: "معماری اطلاعات و نمونه مسیرهای اصلی",
    intro:
      "این صفحه مخصوص توسعه و آزمایش است و مشخص می‌کند کاربران از کجا شروع کنند، ابزارهای حساب کاربری کجا باشند و شش مسیر اصلی چگونه پیدا شوند. نمایش یک مسیر در این صفحه به معنی پیاده‌سازی کامل آن قابلیت نیست.",
    findabilityGate: "معیار پیدا کردن مسیرها",
    findability1: "کارهای اصلی: حداکثر ۳ انتخاب در منو",
    findability2: "منوی اصلی موبایل: حداکثر ۵ گزینه برای هر نقش",
    roleNavEyebrow: "۰۱ · منوی هر نقش",
    roleNavTitle: "برای هر نقش یک منوی ساده و روشن",
    public: "عمومی",
    learner: "زبان‌آموز",
    teacher: "مدرس",
    targetsEyebrow: "۰۲ · مسیرهای قابل پیدا کردن",
    targetsTitle: "این بخش برای پنج آزمون پیدا کردن مسیر استفاده می‌شود",
    placement: "تعیین سطح",
    placementText: "از منوی عمومی و وضعیت شروع زبان‌آموز باید کاملاً در دسترس باشد.",
    today: "امروز",
    todayText: "صفحه خانه فقط یک اقدام اصلی را برجسته می‌کند، نه فهرستی از تمام قابلیت‌های Endoora.",
    continueMission: "ادامه برنامه امروز",
    teachingWork: "کارهای تدریس",
    teachingWorkText: "کلاس‌ها، زبان‌آموزان، تکالیف، تصحیح و بانک سؤال در یک فضای مرتبط قرار می‌گیرند.",
    createAssignment: "ساخت تکلیف",
    createAssignmentText: "انتخاب زبان‌آموز/کلاس ← هدف‌ها و محتوا ← تنظیمات ← بازبینی ← انتشار",
    teachersClasses: "مدرس‌ها و کلاس‌ها",
    teachersClassesText: "ارتباط با مدرس از مسیر یادگیری شخصی جدا می‌ماند.",
    learnNow: "یادگیری با مدرس (Learn Now)",
    browseClasses: "مشاهده کلاس‌ها",
    laterBeta: "نسخه آزمایشی در روزهای بعد",
    learnNowText: "درخواست ← تطبیق امن ← پیشنهاد مدرس ← رزرو؛ بدون وعده «مدرس فوری».",
    accountHub: "مرکز حساب کاربری",
    accountHubText: "ابزارهای مدیریتی اینجا جمع می‌شوند تا صفحه خانه شلوغ نشود.",
    billing: "صورتحساب",
    billingText: "رسیدها، تاریخچه سفارش و بازیابی پرداخت داخل حساب کاربری قرار می‌گیرند.",
    secondaryEyebrow: "۰۳ · مقصدهای فرعی",
    secondaryTitle: "اطلاعات لازم بدون تبدیل صفحه خانه به داشبورد شلوغ",
    publicHome: "خانه",
    publicHomeText: "معرفی ارزش Endoora، اعتمادسازی و مسیر روشن برای شروع.",
    howItWorks: "نحوه کار Endoora",
    howItWorksText: "ارزیابی ← مدل زبان‌آموز ← برنامه ← تمرین ← سازگاری ← مدرس ← پیشرفت",
    teachers: "مدرس‌ها",
    teachersText: "جست‌وجو و اطلاعات عمومی مدرس‌های تأییدشده.",
    classes: "کلاس‌ها",
    classesText: "مشاهده کلاس‌های ثابت؛ ثبت‌نام کامل در روزهای بعد ساخته می‌شود.",
    courses: "دوره‌ها",
    coursesText: "محتوای آموزشی تولیدشده یا دارای مجوز.",
    ielts: "IELTS",
    ieltsText: "تمرین IELTS؛ بدون ادعای نمره رسمی.",
    pricing: "تعرفه‌ها",
    pricingText: "نمایش پلن Premium؛ مبلغ واقعی بعداً از بک‌اند/پایگاه داده خوانده می‌شود.",
    help: "راهنما",
    helpText: "سؤالات متداول، پشتیبانی و توضیح محدودیت‌ها.",
    learn: "یادگیری",
    learnText: "مسیر شخصی، واژگان و پیشرفت.",
    practice: "تمرین",
    practiceText: "برنامه روزانه و بعداً Writing Mentor، Roleplay و تمرین صوتی.",
    teacherHome: "خانه مدرس",
    teacherHomeText: "یک کار فوری: تکمیل تأیید، تدریس، پاسخ به درخواست یا تصحیح.",
    marketplace: "بازار مدرس‌ها",
    marketplaceText: "درخواست‌های مجاز، پیشنهادها و رزروها.",
    resources: "منابع",
    resourcesText: "منابع آموزشی بازبینی‌شده برای مدرس.",
    teacherAccount: "حساب مدرس",
    teacherAccountText: "تأیید هویت، سابقه، استفاده، درآمد، حریم خصوصی، تنظیمات و پشتیبانی.",
    flowsEyebrow: "۰۴ · شش مسیر اصلی",
    flowsTitle: "وایرفریم مسیرها قبل از پیاده‌سازی کامل",
    statesEyebrow: "۰۵ · وضعیت‌های اجباری هر مسیر",
    statesTitle: "بازیابی خطا بخشی از طراحی مسیر است",
    statesText:
      "لینک مستقیم ابتدا ورود و مجوز دسترسی را بررسی می‌کند و سپس کاربر را به مقصد درست می‌برد. نقش اشتباه باید پیام عدم دسترسی ببیند، نه اینکه نقش کاربر به‌صورت پنهانی تغییر کند.",
    states: ["در حال بارگذاری", "حالت خالی", "خطا / تلاش دوباره", "آفلاین / قطع‌شده", "نشست منقضی", "عدم دسترسی"],
    languageLabel: "زبان",
    persian: "فارسی",
    english: "English",
  },
  en: {
    day: "DAY 05 · PRODUCT UX",
    pageTitle: "Information architecture and critical-flow prototype",
    intro:
      "This developer-only page freezes where users start, where Account tools live, and how six critical journeys are found. A route shown here is not a claim that the later product feature is already implemented.",
    findabilityGate: "Findability gate",
    findability1: "Core tasks: ≤ 3 navigation decisions",
    findability2: "Mobile primary nav: ≤ 5 items per signed-in role",
    roleNavEyebrow: "01 · ROLE NAVIGATION",
    roleNavTitle: "One calm navigation model per role",
    public: "Public",
    learner: "Learner",
    teacher: "Teacher",
    targetsEyebrow: "02 · FINDABILITY TARGETS",
    targetsTitle: "Use these destinations for the five hallway-test tasks",
    placement: "Placement Test",
    placementText: "Prominent from public navigation and the learner first-time Home state.",
    today: "Today",
    todayText: "Home exposes one dominant next action instead of a grid of all Endoora features.",
    continueMission: "Continue today's mission",
    teachingWork: "Teaching work",
    teachingWorkText: "Classes, students, assignments, grading and question-bank work live together.",
    createAssignment: "Create Assignment",
    createAssignmentText: "Choose learners/class → objectives/content → settings → review → publish",
    teachersClasses: "Teachers & Classes",
    teachersClassesText: "Human-learning options stay distinct from the personal learning path.",
    learnNow: "Learn Now",
    browseClasses: "Browse fixed classes",
    laterBeta: "Validated Beta · later day",
    learnNowText: "Request → safe matching → teacher offer → booking. No instant-dispatch promise.",
    accountHub: "Account hub",
    accountHubText: "Administrative tools are grouped here so they do not compete with Today.",
    billing: "Billing",
    billingText: "Receipts, order history and payment recovery live in Account.",
    secondaryEyebrow: "03 · SECONDARY DESTINATIONS",
    secondaryTitle: "Prototype context without turning Home into a mega-dashboard",
    publicHome: "Home",
    publicHomeText: "Promise, trust and one clear CTA hierarchy.",
    howItWorks: "How it works",
    howItWorksText: "Assess → Twin → Plan → Practise → Adapt → Teacher → Progress",
    teachers: "Teachers",
    teachersText: "Discovery and verified public information.",
    classes: "Classes",
    classesText: "Fixed-class discovery; enrollment is a later-day beta flow.",
    courses: "Courses",
    coursesText: "Original/licensed learning content.",
    ielts: "IELTS",
    ieltsText: "Practice context only; no official-score claim.",
    pricing: "Pricing",
    pricingText: "Premium offer presentation; value comes from backend configuration later.",
    help: "Help",
    helpText: "FAQ, support entry and limitations.",
    learn: "Learn",
    learnText: "Personal path, vocabulary and progress.",
    practice: "Practice",
    practiceText: "Mission and later writing/roleplay/voice practice.",
    teacherHome: "Teacher Home",
    teacherHomeText: "One urgency-driven action: verify, teach, respond or grade.",
    marketplace: "Marketplace",
    marketplaceText: "Eligible requests, offers and bookings.",
    resources: "Resources",
    resourcesText: "Reviewed teacher resources.",
    teacherAccount: "Teacher Account",
    teacherAccountText: "Verification, history, usage, earnings, privacy, settings and support.",
    flowsEyebrow: "04 · SIX CRITICAL FLOWS",
    flowsTitle: "Implementation-independent journey wireframes",
    statesEyebrow: "05 · REQUIRED ROUTE STATES",
    statesTitle: "Recovery is part of the route contract",
    statesText:
      "Deep links authenticate and authorize before returning to the requested destination. Wrong-role access gets explicit denial; it is never “fixed” by silently switching role.",
    states: ["Loading", "Empty", "Error / Retry", "Offline / Interrupted", "Expired session", "Permission denied"],
    languageLabel: "Language",
    persian: "فارسی",
    english: "English",
  },
} as const;

const publicNavigation: NavItem[] = [
  { fa: "خانه", en: "Home", href: "#public-home" },
  { fa: "نحوه کار", en: "How it works", href: "#public-how" },
  { fa: "تعیین سطح", en: "Placement", href: "#placement" },
  { fa: "مدرس‌ها", en: "Teachers", href: "#teachers" },
  { fa: "کلاس‌ها", en: "Classes", href: "#classes" },
  { fa: "دوره‌ها", en: "Courses", href: "#courses" },
  { fa: "IELTS", en: "IELTS", href: "#ielts" },
  { fa: "تعرفه‌ها", en: "Pricing", href: "#pricing" },
  { fa: "راهنما", en: "Help", href: "#help" },
];

const learnerNavigation: NavItem[] = [
  { fa: "خانه", en: "Home", href: "#learner-home" },
  { fa: "یادگیری", en: "Learn", href: "#learner-learn" },
  { fa: "تمرین", en: "Practice", href: "#learner-practice" },
  { fa: "مدرس‌ها و کلاس‌ها", en: "Teachers & Classes", href: "#learner-teachers" },
  { fa: "حساب کاربری", en: "Account", href: "#learner-account" },
];

const teacherNavigation: NavItem[] = [
  { fa: "خانه", en: "Home", href: "#teacher-home" },
  { fa: "تدریس", en: "Teach", href: "#teacher-teach" },
  { fa: "بازار مدرس‌ها", en: "Marketplace", href: "#teacher-marketplace" },
  { fa: "منابع", en: "Resources", href: "#teacher-resources" },
  { fa: "حساب کاربری", en: "Account", href: "#teacher-account" },
];

const learnerAccount: NavItem[] = [
  { fa: "کتابخانه", en: "Library", href: "#account-library" },
  { fa: "میزان استفاده", en: "Usage", href: "#account-usage" },
  { fa: "Premium", en: "Premium", href: "#account-premium" },
  { fa: "صورتحساب", en: "Billing", href: "#billing" },
  { fa: "پروفایل", en: "Profile", href: "#account-profile" },
  { fa: "نشست‌ها", en: "Sessions", href: "#account-sessions" },
  { fa: "اعلان‌ها", en: "Notifications", href: "#account-notifications" },
  { fa: "حریم خصوصی و کنترل داده", en: "Privacy / Data Controls", href: "#account-privacy" },
  { fa: "تنظیمات", en: "Settings", href: "#account-settings" },
  { fa: "پشتیبانی", en: "Support", href: "#account-support" },
];

const flows: Flow[] = [
  {
    fa: "تعیین سطح ← مسیر شخصی",
    en: "Placement → Path",
    pathFa: "خانه ← تعیین سطح ← نتیجه ← مسیر شخصی ← امروز",
    pathEn: "Home → Placement → Result → Path → Today",
    targetFa: "شروع مسیر شخصی یادگیری",
    targetEn: "Start personal learning path",
  },
  {
    fa: "برنامه روزانه",
    en: "Daily Mission",
    pathFa: "خانه زبان‌آموز ← امروز ← تمرین ← بازخورد ← اقدام بعدی",
    pathEn: "Learner Home → Today → Task → Feedback → Next action",
    targetFa: "تکمیل تمرین مفید امروز",
    targetEn: "Complete useful practice",
  },
  {
    fa: "یادگیری با مدرس",
    en: "Learn Now",
    pathFa: "مدرس‌ها و کلاس‌ها ← درخواست ← پیشنهادها ← رزرو",
    pathEn: "Teachers & Classes → Learn Now → Request → Offers → Booking",
    targetFa: "رسیدن به پیشنهاد یک مدرس واجد شرایط",
    targetEn: "Reach an eligible teacher offer",
  },
  {
    fa: "ساخت تکلیف مدرس",
    en: "Teacher Assignment",
    pathFa: "تدریس ← تکالیف ← ساخت ← بازبینی ← انتشار",
    pathEn: "Teach → Assignments → Create → Review → Publish",
    targetFa: "انتشار تکلیف بازبینی‌شده",
    targetEn: "Publish reviewed assignment",
  },
  {
    fa: "ثبت‌نام کلاس ثابت",
    en: "Fixed Class",
    pathFa: "کلاس‌ها ← جزئیات ← ثبت‌نام ← ظرفیت/پرداخت ← تأیید",
    pathEn: "Classes → Detail → Enroll → Capacity/payment → Confirmation",
    targetFa: "ثبت‌نام تأییدشده یا لیست انتظار",
    targetEn: "Confirmed enrollment or waitlist",
  },
  {
    fa: "تمرین IELTS",
    en: "IELTS Attempt",
    pathFa: "IELTS ← نوع تمرین ← راهنما ← آزمون ← ارسال ← گزارش",
    pathEn: "IELTS → Practice → Instructions → Attempt → Submit → Report",
    targetFa: "ارسال امن تمرین و دریافت گزارش",
    targetEn: "Safe submitted practice attempt",
  },
];

function Nav({ label, items, locale }: { label: string; items: NavItem[]; locale: Locale }) {
  return (
    <nav className={styles.nav} aria-label={label}>
      <ul>
        {items.map((item) => (
          <li key={`${label}-${item.en}`}>
            <a href={item.href}>{item[locale]}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Destination({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={styles.destination} tabIndex={-1}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h3>{title}</h3>
      {children}
    </section>
  );
}

export default function InformationArchitecturePage() {
  const [locale, setLocale] = useState<Locale>("fa");
  const copy = t[locale];

  useEffect(() => {
    const root = document.documentElement;
    const previousLang = root.lang;
    const previousDir = root.dir;

    root.lang = locale;
    root.dir = locale === "fa" ? "rtl" : "ltr";

    return () => {
      root.lang = previousLang;
      root.dir = previousDir;
    };
  }, [locale]);

  return (
    <div className={styles.page} lang={locale} dir={locale === "fa" ? "rtl" : "ltr"}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <EndooraWordmark compact />
          <span className={styles.motto} dir="ltr">A new door to your English</span>
        </div>

        <div className={styles.headerTools}>
          <div className={styles.languageSwitcher} aria-label={copy.languageLabel}>
            <button
              type="button"
              className={locale === "fa" ? styles.languageActive : undefined}
              aria-pressed={locale === "fa"}
              onClick={() => setLocale("fa")}
            >
              فارسی
            </button>
            <button
              type="button"
              className={locale === "en" ? styles.languageActive : undefined}
              aria-pressed={locale === "en"}
              onClick={() => setLocale("en")}
            >
              English
            </button>
          </div>

          <nav className={styles.utilityNav} aria-label={locale === "fa" ? "صفحات توسعه" : "Developer pages"}>
            <Link href="/design-system">{locale === "fa" ? "توکن‌ها" : "Tokens"}</Link>
            <Link href="/design-system/components">{locale === "fa" ? "کامپوننت‌ها" : "Components"}</Link>
            <Link href="/design-system/information-architecture" aria-current="page">
              {locale === "fa" ? "معماری اطلاعات" : "Information architecture"}
            </Link>
            <Link href="/">{locale === "fa" ? "خانه محلی" : "Local home"}</Link>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>{copy.day}</p>
            <h1 className="text-hero">{copy.pageTitle}</h1>
            <p className="text-body">{copy.intro}</p>
          </div>
          <aside className={styles.gateCard}>
            <strong>{copy.findabilityGate}</strong>
            <span>{copy.findability1}</span>
            <span>{copy.findability2}</span>
          </aside>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>{copy.roleNavEyebrow}</p>
            <h2>{copy.roleNavTitle}</h2>
          </div>

          <div className={styles.roleGrid}>
            <article className={styles.roleCard}>
              <h3>{copy.public}</h3>
              <Nav label={copy.public} items={publicNavigation} locale={locale} />
            </article>
            <article className={styles.roleCard}>
              <h3>{copy.learner}</h3>
              <Nav label={copy.learner} items={learnerNavigation} locale={locale} />
            </article>
            <article className={styles.roleCard}>
              <h3>{copy.teacher}</h3>
              <Nav label={copy.teacher} items={teacherNavigation} locale={locale} />
            </article>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>{copy.targetsEyebrow}</p>
            <h2>{copy.targetsTitle}</h2>
          </div>

          <div className={styles.destinationGrid}>
            <Destination id="placement" eyebrow={locale === "fa" ? "عمومی / زبان‌آموز" : "PUBLIC / LEARNER"} title={copy.placement}>
              <p>{copy.placementText}</p>
              <code dir="ltr">/placement</code>
            </Destination>

            <Destination id="learner-home" eyebrow={locale === "fa" ? "زبان‌آموز · خانه" : "LEARNER · HOME"} title={copy.today}>
              <p>{copy.todayText}</p>
              <a className={styles.action} href="#daily-mission">{copy.continueMission}</a>
            </Destination>

            <Destination id="teacher-teach" eyebrow={locale === "fa" ? "مدرس · تدریس" : "TEACHER · TEACH"} title={copy.teachingWork}>
              <p>{copy.teachingWorkText}</p>
              <a className={styles.action} href="#create-assignment">{copy.createAssignment}</a>
            </Destination>

            <Destination id="create-assignment" eyebrow={locale === "fa" ? "مدرس · تدریس · تکالیف" : "TEACHER · TEACH · ASSIGNMENTS"} title={copy.createAssignment}>
              <p>{copy.createAssignmentText}</p>
              <code dir="ltr">/teacher/assignments</code>
            </Destination>

            <Destination id="learner-teachers" eyebrow={locale === "fa" ? "زبان‌آموز · مدرس‌ها و کلاس‌ها" : "LEARNER · TEACHERS & CLASSES"} title={copy.teachersClasses}>
              <p>{copy.teachersClassesText}</p>
              <a className={styles.action} href="#learn-now">{copy.learnNow}</a>
              <a href="#classes">{copy.browseClasses}</a>
            </Destination>

            <Destination id="learn-now" eyebrow={copy.laterBeta} title={copy.learnNow}>
              <p>{copy.learnNowText}</p>
              <code dir="ltr">/marketplace/requests</code>
            </Destination>

            <Destination id="learner-account" eyebrow={locale === "fa" ? "زبان‌آموز · حساب کاربری" : "LEARNER · ACCOUNT"} title={copy.accountHub}>
              <p>{copy.accountHubText}</p>
              <Nav label={copy.accountHub} items={learnerAccount} locale={locale} />
            </Destination>

            <Destination id="billing" eyebrow={locale === "fa" ? "حساب کاربری" : "ACCOUNT"} title={copy.billing}>
              <p>{copy.billingText}</p>
              <code dir="ltr">/account/billing</code>
            </Destination>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>{copy.secondaryEyebrow}</p>
            <h2>{copy.secondaryTitle}</h2>
          </div>
          <div className={styles.destinationGrid}>
            <Destination id="public-home" eyebrow={copy.public} title={copy.publicHome}><p>{copy.publicHomeText}</p></Destination>
            <Destination id="public-how" eyebrow={copy.public} title={copy.howItWorks}><p>{copy.howItWorksText}</p></Destination>
            <Destination id="teachers" eyebrow={copy.public} title={copy.teachers}><p>{copy.teachersText}</p></Destination>
            <Destination id="classes" eyebrow={locale === "fa" ? "عمومی / زبان‌آموز" : "PUBLIC / LEARNER"} title={copy.classes}><p>{copy.classesText}</p></Destination>
            <Destination id="courses" eyebrow={copy.public} title={copy.courses}><p>{copy.coursesText}</p></Destination>
            <Destination id="ielts" eyebrow={locale === "fa" ? "عمومی / زبان‌آموز" : "PUBLIC / LEARNER"} title={copy.ielts}><p>{copy.ieltsText}</p></Destination>
            <Destination id="pricing" eyebrow={copy.public} title={copy.pricing}><p>{copy.pricingText}</p></Destination>
            <Destination id="help" eyebrow={copy.public} title={copy.help}><p>{copy.helpText}</p></Destination>
            <Destination id="learner-learn" eyebrow={copy.learner} title={copy.learn}><p>{copy.learnText}</p></Destination>
            <Destination id="learner-practice" eyebrow={copy.learner} title={copy.practice}><p>{copy.practiceText}</p></Destination>
            <Destination id="teacher-home" eyebrow={copy.teacher} title={copy.teacherHome}><p>{copy.teacherHomeText}</p></Destination>
            <Destination id="teacher-marketplace" eyebrow={copy.teacher} title={copy.marketplace}><p>{copy.marketplaceText}</p></Destination>
            <Destination id="teacher-resources" eyebrow={copy.teacher} title={copy.resources}><p>{copy.resourcesText}</p></Destination>
            <Destination id="teacher-account" eyebrow={copy.teacher} title={copy.teacherAccount}><p>{copy.teacherAccountText}</p></Destination>
          </div>
        </section>

        <section className={styles.section} id="daily-mission">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>{copy.flowsEyebrow}</p>
            <h2>{copy.flowsTitle}</h2>
          </div>
          <div className={styles.flowGrid}>
            {flows.map((flow) => (
              <article className={styles.flowCard} key={flow.en}>
                <h3>{locale === "fa" ? flow.fa : flow.en}</h3>
                <p>{locale === "fa" ? flow.pathFa : flow.pathEn}</p>
                <strong>{locale === "fa" ? flow.targetFa : flow.targetEn}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>{copy.statesEyebrow}</p>
            <h2>{copy.statesTitle}</h2>
          </div>
          <ul className={styles.stateList}>
            {copy.states.map((state) => <li key={state}>{state}</li>)}
          </ul>
          <p>{copy.statesText}</p>
        </section>
      </main>
    </div>
  );
}
