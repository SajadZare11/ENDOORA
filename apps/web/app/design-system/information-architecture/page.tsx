"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { EndooraWordmark } from "@endoora/ui";
import styles from "./information-architecture.module.css";

type Locale = "fa" | "en";
type Localized = { fa: string; en: string };
type NavItem = Localized & { href: string; mobileFa?: string; mobileEn?: string };
type RouteStatus = "current" | "planned" | "foundation";
type FlowStep = Localized & { route: string; actionFa: string; actionEn: string; status: RouteStatus };
type Recovery = Localized & { stateFa: string; stateEn: string };
type Flow = Localized & {
  id: string;
  entryFa: string;
  entryEn: string;
  ownerFa: string;
  ownerEn: string;
  targetFa: string;
  targetEn: string;
  maturityFa: string;
  maturityEn: string;
  decisions: number;
  steps: FlowStep[];
  recovery: Recovery[];
};

const t = {
  fa: {
    day: "روز ۰۵ · تجربه محصول",
    pageTitle: "معماری اطلاعات و نمونه مسیرهای اصلی",
    intro: "این صفحهٔ توسعه، مالکیت مسیرها، منوی هر نقش و شش سفر حیاتی را پیش از پیاده‌سازی کامل تثبیت می‌کند. «برنامه‌ریزی‌شده» به معنی قابلیت آماده یا وعدهٔ عرضه نیست.",
    gate: "معیار پیدا کردن مسیرها",
    gateOne: "کار اصلی با حداکثر ۳ تصمیم ناوبری پیدا می‌شود.",
    gateTwo: "منوی اصلی موبایل برای هر نقش حداکثر ۵ گزینه دارد.",
    roleEyebrow: "۰۱ · منوی هر نقش",
    roleTitle: "هر نقش فقط مقصدهای مرتبط با خودش را می‌بیند",
    public: "عمومی",
    learner: "زبان‌آموز",
    teacher: "مدرس",
    admin: "عملیات / مدیر",
    adminNote: "صف‌های عملیاتی و کنترل‌های حساس؛ نه داشبورد زبان‌آموز یا مدرس.",
    mobileEyebrow: "۰۲ · منوی موبایل",
    mobileTitle: "پیش‌نمایش پنج مقصد اصلی در عرض ۳۶۰ پیکسل",
    mobileNote: "ابزارهای کم‌کاربرد در حساب کاربری می‌مانند و به نوار پایین اضافه نمی‌شوند.",
    targetsEyebrow: "۰۳ · پنج هدف پیدا کردن",
    targetsTitle: "مقصدهایی که در آزمون راهرو باید در سه تصمیم یا کمتر پیدا شوند",
    placement: "تعیین سطح",
    placementText: "شروع اصلی کاربر جدید؛ در خانهٔ عمومی و حالت شروع زبان‌آموز برجسته است.",
    today: "امروز",
    todayText: "خانه فقط یک اقدام اصلی را برجسته می‌کند: ادامهٔ مفیدترین کار امروز.",
    continueMission: "ادامه برنامهٔ امروز",
    teachingWork: "کارهای تدریس",
    teachingWorkText: "کلاس، زبان‌آموز، تکلیف، تصحیح و بانک سؤال در فضای تدریس قرار می‌گیرند.",
    createAssignment: "ساخت تکلیف",
    learnNow: "یادگیری با مدرس (Learn Now)",
    learnNowText: "درخواست ← تطبیق امن ← پیشنهاد مدرس ← رزرو؛ بدون وعدهٔ «مدرس فوری».",
    accountHub: "مرکز حساب کاربری",
    accountHubText: "کتابخانه، مصرف، پلن، صورتحساب، پروفایل، نشست‌ها، کنترل داده و پشتیبانی اینجا جمع می‌شوند.",
    billing: "صورتحساب",
    secondaryEyebrow: "۰۴ · مقصدهای فرعی و قرارداد مسیر",
    secondaryTitle: "مسیر فعلی با مسیر برنامه‌ریزی‌شده اشتباه گرفته نمی‌شود",
    current: "فعلی",
    planned: "برنامه‌ریزی‌شده",
    foundation: "پایه / آزمایشی",
    flowsEyebrow: "۰۵ · شش مسیر قابل کلیک",
    flowsTitle: "هر مرحله، اقدام اصلی و بازیابی آن را بررسی کنید",
    chooseFlow: "انتخاب مسیر",
    entry: "ورودی",
    owner: "مالک تجربه",
    outcome: "نتیجهٔ موفق",
    maturity: "وضعیت محصول",
    decisions: "تصمیم ناوبری",
    step: "مرحله",
    of: "از",
    primaryAction: "اقدام اصلی",
    previous: "مرحلهٔ قبل",
    next: "مرحلهٔ بعد",
    saveHint: "در مسیرهای طولانی، بازگشت، ذخیره و ادامه در آینده و لغو باید پیامد روشن داشته باشند.",
    recovery: "بازیابی همین مسیر",
    statesEyebrow: "۰۶ · قرارداد وضعیت‌ها",
    statesTitle: "خطا و وقفه بخشی از طراحی مسیر است",
    statesText: "لینک مستقیم ابتدا ورود و مجوز را بررسی می‌کند و سپس مقصد درخواست‌شده یا منع دسترسی روشن را نشان می‌دهد. نقش کاربر هرگز پنهانی عوض نمی‌شود.",
    states: ["در حال بارگذاری", "حالت خالی", "خطا / تلاش دوباره", "آفلاین / قطع‌شده", "نشست منقضی", "عدم دسترسی"],
    language: "زبان",
  },
  en: {
    day: "DAY 05 · PRODUCT UX",
    pageTitle: "Information architecture and critical-flow prototype",
    intro: "This developer surface freezes route ownership, role navigation, and six critical journeys before full implementation. “Planned” is not a claim that a feature is ready or promised for launch.",
    gate: "Findability gate",
    gateOne: "A core task is found in three or fewer navigation decisions.",
    gateTwo: "Each signed-in mobile primary nav contains at most five items.",
    roleEyebrow: "01 · ROLE NAVIGATION",
    roleTitle: "Each role sees only destinations relevant to its work",
    public: "Public",
    learner: "Learner",
    teacher: "Teacher",
    admin: "Operations / Admin",
    adminNote: "Operational queues and permission-scoped controls—not a learner or teacher dashboard.",
    mobileEyebrow: "02 · MOBILE NAVIGATION",
    mobileTitle: "Five-primary-destination preview at 360 px",
    mobileNote: "Low-frequency tools remain in Account and do not become bottom-navigation items.",
    targetsEyebrow: "03 · FIVE FINDABILITY TARGETS",
    targetsTitle: "Hallway-test destinations that must be found in three decisions or fewer",
    placement: "Placement Test",
    placementText: "The new-user start: prominent from public Home and the learner first-time state.",
    today: "Today",
    todayText: "Home emphasizes one action: continue the most useful thing to do today.",
    continueMission: "Continue today's mission",
    teachingWork: "Teaching work",
    teachingWorkText: "Classes, learners, assignments, grading, and the question bank live under Teach.",
    createAssignment: "Create Assignment",
    learnNow: "Learn Now",
    learnNowText: "Request → safe matching → teacher offer → booking. No instant-teacher promise.",
    accountHub: "Account hub",
    accountHubText: "Library, usage, plan, billing, profile, sessions, data controls, and support are consolidated here.",
    billing: "Billing",
    secondaryEyebrow: "04 · SECONDARY DESTINATIONS & ROUTE CONTRACT",
    secondaryTitle: "Current routes are not confused with planned destinations",
    current: "Current",
    planned: "Planned",
    foundation: "Foundation / Beta",
    flowsEyebrow: "05 · SIX CLICKABLE FLOWS",
    flowsTitle: "Inspect every step, primary action, and recovery path",
    chooseFlow: "Choose a flow",
    entry: "Entry",
    owner: "Experience owner",
    outcome: "Successful outcome",
    maturity: "Product status",
    decisions: "navigation decisions",
    step: "Step",
    of: "of",
    primaryAction: "Primary action",
    previous: "Previous step",
    next: "Next step",
    saveHint: "Long workflows provide Back, Save and Continue Later, and Cancel with an explicit consequence.",
    recovery: "Recovery for this flow",
    statesEyebrow: "06 · ROUTE-STATE CONTRACT",
    statesTitle: "Failure and interruption are part of the journey",
    statesText: "A deep link authenticates and authorizes before opening the requested destination or showing explicit denial. The application never silently switches a user's role.",
    states: ["Loading", "Empty", "Error / Retry", "Offline / Interrupted", "Expired session", "Permission denied"],
    language: "Language",
  },
} as const;

const publicNavigation: NavItem[] = [
  { fa: "خانه", en: "Home", href: "#public-home" }, { fa: "نحوه کار", en: "How it works", href: "#public-how" },
  { fa: "تعیین سطح", en: "Placement", href: "#placement" }, { fa: "مدرس‌ها", en: "Teachers", href: "#teachers" },
  { fa: "کلاس‌ها", en: "Classes", href: "#classes" }, { fa: "دوره‌ها", en: "Courses", href: "#courses" },
  { fa: "IELTS", en: "IELTS", href: "#ielts" }, { fa: "تعرفه‌ها", en: "Pricing", href: "#pricing" },
  { fa: "راهنما", en: "Help", href: "#help" },
];
const learnerNavigation: NavItem[] = [
  { fa: "خانه", en: "Home", href: "#learner-home" }, { fa: "یادگیری", en: "Learn", href: "#learner-learn" },
  { fa: "تمرین", en: "Practice", href: "#learner-practice" }, { fa: "مدرس‌ها و کلاس‌ها", en: "Teachers & Classes", mobileFa: "مدرس/کلاس", mobileEn: "Teachers", href: "#learner-teachers" },
  { fa: "حساب کاربری", en: "Account", href: "#learner-account" },
];
const teacherNavigation: NavItem[] = [
  { fa: "خانه", en: "Home", href: "#teacher-home" }, { fa: "تدریس", en: "Teach", href: "#teacher-teach" },
  { fa: "بازار مدرس‌ها", en: "Marketplace", mobileFa: "بازار", mobileEn: "Market", href: "#teacher-marketplace" }, { fa: "منابع", en: "Resources", href: "#teacher-resources" },
  { fa: "حساب کاربری", en: "Account", href: "#teacher-account" },
];
const adminNavigation: NavItem[] = [
  { fa: "نمای کلی", en: "Overview", href: "#operations-overview" }, { fa: "کاربران", en: "People", href: "#operations-people" },
  { fa: "محتوا", en: "Content", href: "#operations-content" }, { fa: "پشتیبانی", en: "Support", href: "#operations-support" },
  { fa: "ممیزی و کنترل", en: "Audit & controls", href: "#operations-audit" },
];
const learnerAccount: NavItem[] = [
  { fa: "کتابخانه", en: "Library", href: "#account-library" }, { fa: "میزان استفاده", en: "Usage", href: "#account-usage" },
  { fa: "Premium", en: "Premium", href: "#account-premium" }, { fa: "صورتحساب", en: "Billing", href: "#billing" },
  { fa: "پروفایل", en: "Profile", href: "#account-profile" }, { fa: "نشست‌ها", en: "Sessions", href: "#account-sessions" },
  { fa: "اعلان‌ها", en: "Notifications", href: "#account-notifications" }, { fa: "حریم خصوصی و کنترل داده", en: "Privacy / Data Controls", href: "#account-privacy" },
  { fa: "تنظیمات", en: "Settings", href: "#account-settings" }, { fa: "پشتیبانی", en: "Support", href: "#account-support" },
];

const flows: Flow[] = [
  {
    id: "placement-path", fa: "تعیین سطح ← مسیر شخصی", en: "Placement → Path", entryFa: "خانهٔ عمومی", entryEn: "Public Home",
    ownerFa: "زبان‌آموز", ownerEn: "Learner", targetFa: "رسیدن به مسیر شخصی و برنامهٔ امروز", targetEn: "Reach the personal path and today's mission",
    maturityFa: "مسیر اصلی؛ تکمیل در روزهای ۱۴ تا ۲۰", maturityEn: "Core journey; completed on Days 14–20", decisions: 1,
    steps: [
      { fa: "خانه", en: "Home", route: "/", actionFa: "شروع تعیین سطح رایگان", actionEn: "Start free assessment", status: "current" },
      { fa: "ورود یا ثبت‌نام", en: "Sign in or register", route: "/auth/login?next=/placement", actionFa: "ادامهٔ امن", actionEn: "Continue securely", status: "current" },
      { fa: "تعیین سطح", en: "Placement", route: "/placement", actionFa: "شروع / ادامه آزمون", actionEn: "Start / resume assessment", status: "current" },
      { fa: "نتیجهٔ شفاف", en: "Transparent result", route: "/placement/report", actionFa: "ساخت مسیر من", actionEn: "Build my path", status: "current" },
      { fa: "مسیر شخصی", en: "Personal path", route: "/path", actionFa: "شروع برنامهٔ امروز", actionEn: "Start today's mission", status: "current" },
    ],
    recovery: [
      { stateFa: "قطع اتصال", stateEn: "Disconnected", fa: "آخرین پاسخ تأییدشده بازیابی می‌شود؛ ارسال خودکار ممنوع است.", en: "Resume the last server-confirmed answer; never auto-submit." },
      { stateFa: "نشست منقضی", stateEn: "Expired session", fa: "ورود دوباره و بازگشت امن به همان نشست.", en: "Re-authenticate and return safely to the same attempt." },
      { stateFa: "نتیجه در دسترس نیست", stateEn: "Result unavailable", fa: "آزمون حفظ می‌شود و تولید نتیجه دوباره تلاش می‌شود.", en: "Preserve the attempt and retry result generation." },
    ],
  },
  {
    id: "daily-mission", fa: "برنامهٔ روزانه", en: "Daily Mission", entryFa: "خانهٔ زبان‌آموز", entryEn: "Learner Home",
    ownerFa: "زبان‌آموز", ownerEn: "Learner", targetFa: "تکمیل تمرین مفید و دیدن اقدام بعدی", targetEn: "Complete useful practice and see the next action",
    maturityFa: "مسیر اصلی؛ مالک روز ۲۰", maturityEn: "Core journey; Day 20 owner", decisions: 1,
    steps: [
      { fa: "خانهٔ زبان‌آموز", en: "Learner Home", route: "/dashboard", actionFa: "ادامه برنامهٔ امروز", actionEn: "Continue today's mission", status: "current" },
      { fa: "نمای کلی امروز", en: "Today overview", route: "/today", actionFa: "شروع تمرین بعدی", actionEn: "Start next task", status: "current" },
      { fa: "تمرین", en: "Task", route: "/practice-ai", actionFa: "ثبت پاسخ", actionEn: "Submit answer", status: "current" },
      { fa: "بازخورد", en: "Feedback", route: "/today#feedback", actionFa: "اقدام بعدی", actionEn: "Next action", status: "foundation" },
    ],
    recovery: [
      { stateFa: "برنامه خالی", stateEn: "Empty mission", fa: "ابتدا تعیین سطح یا یک اقدام محدود و روشن پیشنهاد می‌شود.", en: "Offer Placement first or one bounded next action." },
      { stateFa: "خطای بارگذاری", stateEn: "Load error", fa: "تلاش دوباره بدون از دست رفتن موارد تکمیل‌شده.", en: "Retry without losing completed mission items." },
      { stateFa: "آفلاین", stateEn: "Offline", fa: "فقط کار واقعاً ذخیره‌شده قابل انجام نشان داده می‌شود.", en: "Expose only work that is genuinely available offline." },
    ],
  },
  {
    id: "learn-now", fa: "یادگیری با مدرس", en: "Learn Now", entryFa: "مدرس‌ها و کلاس‌ها", entryEn: "Teachers & Classes",
    ownerFa: "زبان‌آموز / مدرس واجد شرایط", ownerEn: "Learner / eligible teacher", targetFa: "پیشنهاد معتبر و رزرو تأییدشده", targetEn: "Eligible offer and confirmed booking",
    maturityFa: "نسخهٔ آزمایشی؛ روزهای ۳۷ تا ۳۹", maturityEn: "Validated Beta; Days 37–39", decisions: 2,
    steps: [
      { fa: "مدرس‌ها و کلاس‌ها", en: "Teachers & Classes", route: "/teachers", actionFa: "یادگیری با مدرس", actionEn: "Learn Now", status: "planned" },
      { fa: "جزئیات درخواست", en: "Request details", route: "/marketplace/requests", actionFa: "بازبینی درخواست", actionEn: "Review request", status: "current" },
      { fa: "تطبیق امن", en: "Safe matching", route: "/marketplace/requests/:id", actionFa: "دیدن پیشنهادها", actionEn: "View offers", status: "planned" },
      { fa: "پیشنهاد مدرس", en: "Teacher offer", route: "/marketplace/offers/:id", actionFa: "انتخاب پیشنهاد", actionEn: "Choose offer", status: "planned" },
      { fa: "رزرو", en: "Booking", route: "/bookings/:id", actionFa: "تأیید رزرو", actionEn: "Confirm booking", status: "planned" },
    ],
    recovery: [
      { stateFa: "مدرس مناسب نیست", stateEn: "No eligible teacher", fa: "درخواست حفظ و گزینه‌های بعدی توضیح داده می‌شود.", en: "Preserve the request and explain the next options." },
      { stateFa: "ارسال تکراری", stateEn: "Duplicate submit", fa: "فقط یک درخواست ساخته می‌شود.", en: "Create only one request." },
      { stateFa: "قطع شبکه", stateEn: "Network interruption", fa: "وضعیت درخواست از سرور خوانده می‌شود، نه حدس زده.", en: "Fetch request status from the server instead of guessing." },
    ],
  },
  {
    id: "teacher-assignment", fa: "ساخت تکلیف مدرس", en: "Teacher Assignment", entryFa: "فضای تدریس", entryEn: "Teach",
    ownerFa: "مدرس", ownerEn: "Teacher", targetFa: "انتشار تکلیف بازبینی‌شده", targetEn: "Publish a reviewed assignment",
    maturityFa: "برنامه‌ریزی‌شده؛ روزهای ۳۳ تا ۳۶", maturityEn: "Planned; Days 33–36", decisions: 3,
    steps: [
      { fa: "کلاس‌ها", en: "Classes", route: "/teacher/classes", actionFa: "تکالیف", actionEn: "Assignments", status: "current" },
      { fa: "فهرست تکالیف", en: "Assignments", route: "/teacher/assignments", actionFa: "ساخت تکلیف", actionEn: "Create Assignment", status: "planned" },
      { fa: "کلاس و هدف‌ها", en: "Class and objectives", route: "/teacher/assignments/new", actionFa: "انتخاب محتوا", actionEn: "Choose content", status: "planned" },
      { fa: "تنظیمات تحویل", en: "Delivery settings", route: "/teacher/assignments/new#settings", actionFa: "بازبینی", actionEn: "Review", status: "planned" },
      { fa: "بازبینی", en: "Review", route: "/teacher/assignments/new#review", actionFa: "انتشار", actionEn: "Publish", status: "planned" },
    ],
    recovery: [
      { stateFa: "کلاس وجود ندارد", stateEn: "No class", fa: "راه ساخت یا انتخاب کلاس نشان داده می‌شود.", en: "Explain how to create or select a class." },
      { stateFa: "سؤال ناموجود", stateEn: "Unavailable question", fa: "پیش‌نویس حفظ و مورد آسیب‌دیده مشخص می‌شود.", en: "Preserve the draft and identify the affected item." },
      { stateFa: "نشست منقضی", stateEn: "Expired session", fa: "ورود دوباره و ادامهٔ پیش‌نویس؛ ذخیره هرگز انتشار نیست.", en: "Re-authenticate and resume the draft; saving never publishes." },
    ],
  },
  {
    id: "fixed-class", fa: "ثبت‌نام کلاس ثابت", en: "Fixed Class Enrollment", entryFa: "کلاس‌ها", entryEn: "Classes",
    ownerFa: "بازدیدکننده / زبان‌آموز", ownerEn: "Visitor / learner", targetFa: "ثبت‌نام تأییدشده یا لیست انتظار روشن", targetEn: "Confirmed enrollment or explicit waitlist",
    maturityFa: "نسخهٔ آزمایشی؛ مالک روز ۴۰", maturityEn: "Validated Beta; Day 40 owner", decisions: 1,
    steps: [
      { fa: "فهرست کلاس‌ها", en: "Classes", route: "/classes", actionFa: "دیدن جزئیات", actionEn: "View details", status: "planned" },
      { fa: "جزئیات کلاس", en: "Class detail", route: "/classes/:id", actionFa: "ثبت‌نام", actionEn: "Enroll", status: "planned" },
      { fa: "ظرفیت و شرایط", en: "Capacity and eligibility", route: "/classes/:id/enroll", actionFa: "ادامه به پرداخت", actionEn: "Continue to payment", status: "planned" },
      { fa: "بازبینی قیمت و سیاست", en: "Price and policy review", route: "/checkout/:id", actionFa: "پرداخت", actionEn: "Pay", status: "planned" },
      { fa: "تأیید", en: "Confirmation", route: "/enrollments/:id", actionFa: "دیدن کلاس", actionEn: "View class", status: "planned" },
    ],
    recovery: [
      { stateFa: "کلاس پر است", stateEn: "Class full", fa: "پرداخت متوقف و پیوستن به لیست انتظار پیشنهاد می‌شود.", en: "Stop before payment and offer the waitlist." },
      { stateFa: "پرداخت ناموفق", stateEn: "Payment failed", fa: "هیچ دسترسی کاذب ساخته نمی‌شود؛ تلاش دوباره روشن است.", en: "Create no false entitlement and provide a clear retry." },
      { stateFa: "ظرفیت تغییر کرد", stateEn: "Capacity changed", fa: "ظرفیت پیش از پرداخت دوباره بررسی می‌شود.", en: "Revalidate capacity before payment." },
    ],
  },
  {
    id: "ielts-attempt", fa: "تمرین IELTS", en: "IELTS Attempt", entryFa: "مرکز IELTS", entryEn: "IELTS Hub",
    ownerFa: "زبان‌آموز", ownerEn: "Learner", targetFa: "ارسال امن تمرین و گزارش شفاف", targetEn: "Safely submit practice and receive a transparent report",
    maturityFa: "تمرین غیررسمی؛ روزهای ۴۴ تا ۴۸", maturityEn: "Unofficial practice; Days 44–48", decisions: 1,
    steps: [
      { fa: "مرکز IELTS", en: "IELTS Hub", route: "/ielts", actionFa: "انتخاب نوع تمرین", actionEn: "Choose practice type", status: "planned" },
      { fa: "راهنما و محدودیت", en: "Instructions and limitations", route: "/ielts/practice/:type", actionFa: "شروع تمرین", actionEn: "Start attempt", status: "planned" },
      { fa: "بخش آزمون", en: "Attempt section", route: "/ielts/attempts/:id", actionFa: "ذخیره و ادامه", actionEn: "Save and continue", status: "planned" },
      { fa: "بازبینی پاسخ‌ها", en: "Review answers", route: "/ielts/attempts/:id/review", actionFa: "ارسال نهایی", actionEn: "Submit attempt", status: "planned" },
      { fa: "گزارش", en: "Report", route: "/ielts/attempts/:id/report", actionFa: "تمرین هدفمند بعدی", actionEn: "Next targeted practice", status: "planned" },
    ],
    recovery: [
      { stateFa: "قطع اتصال", stateEn: "Disconnected", fa: "آخرین پاسخ تأییدشده بازیابی می‌شود.", en: "Resume the last server-confirmed answer." },
      { stateFa: "ارسال تکراری", stateEn: "Duplicate submit", fa: "ارسال نهایی تکرارپذیر امن است و تلاش دوم آزمون تازه نمی‌سازد.", en: "Submission is idempotent and a retry does not create a new attempt." },
      { stateFa: "ارزیابی در دسترس نیست", stateEn: "Evaluation unavailable", fa: "آزمون ارسال‌شده حفظ و گزارش دوباره تلاش می‌شود.", en: "Preserve the submitted attempt and retry the report." },
    ],
  },
];

function Nav({ label, items, locale, compact = false }: { label: string; items: NavItem[]; locale: Locale; compact?: boolean }) {
  return <nav className={styles.nav} aria-label={label}><ul>{items.map((item) => {
    const fullLabel = item[locale];
    const mobileLabel = locale === "fa" ? item.mobileFa : item.mobileEn;
    return <li key={`${label}-${item.en}`}><a href={item.href} aria-label={compact && mobileLabel ? fullLabel : undefined}>{compact && mobileLabel ? mobileLabel : fullLabel}</a></li>;
  })}</ul></nav>;
}
function Destination({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: ReactNode }) {
  return <section id={id} className={styles.destination} tabIndex={-1}><p className={styles.eyebrow}>{eyebrow}</p><h3>{title}</h3>{children}</section>;
}
function RouteBadge({ route, status, locale }: { route: string; status: RouteStatus; locale: Locale }) {
  const copy = t[locale];
  return <div className={styles.routeBadge}><code dir="ltr">{route}</code><span data-status={status}>{copy[status]}</span></div>;
}

export default function InformationArchitecturePage() {
  const [locale, setLocale] = useState<Locale>("fa");
  const [activeFlowId, setActiveFlowId] = useState(flows[0].id);
  const [activeStep, setActiveStep] = useState(0);
  const copy = t[locale];
  const activeFlow = flows.find((flow) => flow.id === activeFlowId) ?? flows[0];
  const currentStep = activeFlow.steps[activeStep] ?? activeFlow.steps[0];

  useEffect(() => {
    const root = document.documentElement;
    const previousLang = root.lang;
    const previousDir = root.dir;
    root.lang = locale;
    root.dir = locale === "fa" ? "rtl" : "ltr";
    return () => { root.lang = previousLang; root.dir = previousDir; };
  }, [locale]);

  function selectFlow(id: string) { setActiveFlowId(id); setActiveStep(0); }

  const routeCards: [string, string, string, string, RouteStatus][] = [
    ["public-home", copy.public, locale === "fa" ? "خانه" : "Home", "/", "current"],
    ["public-how", copy.public, locale === "fa" ? "نحوه کار" : "How it works", "/how-it-works", "current"],
    ["teachers", copy.public, locale === "fa" ? "مدرس‌ها" : "Teachers", "/teachers", "current"],
    ["classes", copy.public, locale === "fa" ? "کلاس‌ها" : "Classes", "/classes", "planned"],
    ["courses", copy.public, locale === "fa" ? "دوره‌ها" : "Courses", "/learn", "current"],
    ["ielts", copy.public, "IELTS", "/ielts", "planned"],
    ["pricing", copy.public, locale === "fa" ? "تعرفه‌ها" : "Pricing", "/pricing", "current"],
    ["help", copy.public, locale === "fa" ? "راهنما" : "Help", "/help", "current"],
    ["learner-learn", copy.learner, locale === "fa" ? "یادگیری" : "Learn", "/path", "current"],
    ["learner-practice", copy.learner, locale === "fa" ? "تمرین" : "Practice", "/practice-ai", "current"],
    ["teacher-home", copy.teacher, locale === "fa" ? "خانه مدرس" : "Teacher Home", "/teacher", "current"],
    ["teacher-marketplace", copy.teacher, locale === "fa" ? "بازار مدرس‌ها" : "Marketplace", "/marketplace/requests", "current"],
    ["teacher-resources", copy.teacher, locale === "fa" ? "منابع" : "Resources", "/teacher/resources", "current"],
    ["teacher-account", copy.teacher, locale === "fa" ? "حساب مدرس" : "Teacher Account", "/teacher/account", "current"],
    ["operations-overview", copy.admin, locale === "fa" ? "نمای عملیات" : "Operations overview", "/operations", "planned"],
    ["operations-people", copy.admin, locale === "fa" ? "کاربران" : "People", "/operations/users", "planned"],
    ["operations-content", copy.admin, locale === "fa" ? "صف محتوای فعلی" : "Current content queue", "/content/questions", "foundation"],
    ["operations-support", copy.admin, locale === "fa" ? "پشتیبانی" : "Support", "/operations/support", "planned"],
    ["operations-audit", copy.admin, locale === "fa" ? "ممیزی و کنترل" : "Audit & controls", "/operations/audit", "planned"],
  ];

  return (
    <div className={styles.page} lang={locale} dir={locale === "fa" ? "rtl" : "ltr"}>
      <header className={styles.header}>
        <div className={styles.brand}><EndooraWordmark compact /><span className={styles.motto} dir="ltr">A new door to your English</span></div>
        <div className={styles.headerTools}>
          <div className={styles.languageSwitcher} aria-label={copy.language}>
            <button type="button" className={locale === "fa" ? styles.languageActive : undefined} aria-pressed={locale === "fa"} onClick={() => setLocale("fa")}>فارسی</button>
            <button type="button" className={locale === "en" ? styles.languageActive : undefined} aria-pressed={locale === "en"} onClick={() => setLocale("en")}>English</button>
          </div>
          <nav className={styles.utilityNav} aria-label={locale === "fa" ? "صفحات توسعه" : "Developer pages"}>
            <Link href="/design-system">{locale === "fa" ? "توکن‌ها" : "Tokens"}</Link>
            <Link href="/design-system/components">{locale === "fa" ? "کامپوننت‌ها" : "Components"}</Link>
            <Link href="/design-system/information-architecture" aria-current="page">{locale === "fa" ? "معماری اطلاعات" : "Information architecture"}</Link>
            <Link href="/">{locale === "fa" ? "خانه محلی" : "Local home"}</Link>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div><p className={styles.eyebrow}>{copy.day}</p><h1 className="text-hero">{copy.pageTitle}</h1><p className="text-body">{copy.intro}</p></div>
          <aside className={styles.gateCard}><strong>{copy.gate}</strong><span>{copy.gateOne}</span><span>{copy.gateTwo}</span></aside>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}><p className={styles.eyebrow}>{copy.roleEyebrow}</p><h2>{copy.roleTitle}</h2></div>
          <div className={styles.roleGrid}>
            <article className={styles.roleCard}><h3>{copy.public}</h3><Nav label={copy.public} items={publicNavigation} locale={locale} /></article>
            <article className={styles.roleCard}><h3>{copy.learner}</h3><Nav label={copy.learner} items={learnerNavigation} locale={locale} /></article>
            <article className={styles.roleCard}><h3>{copy.teacher}</h3><Nav label={copy.teacher} items={teacherNavigation} locale={locale} /></article>
            <article className={styles.roleCard}><h3>{copy.admin}</h3><p>{copy.adminNote}</p><Nav label={copy.admin} items={adminNavigation} locale={locale} /></article>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}><p className={styles.eyebrow}>{copy.mobileEyebrow}</p><h2>{copy.mobileTitle}</h2><p>{copy.mobileNote}</p></div>
          <div className={styles.mobilePreviewGrid}>
            <article className={styles.phonePreview}><div className={styles.phoneTop}><span>{copy.learner}</span><span dir="ltr">360 px</span></div><Nav label={`${copy.learner} mobile`} items={learnerNavigation} locale={locale} compact /></article>
            <article className={styles.phonePreview}><div className={styles.phoneTop}><span>{copy.teacher}</span><span dir="ltr">360 px</span></div><Nav label={`${copy.teacher} mobile`} items={teacherNavigation} locale={locale} compact /></article>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}><p className={styles.eyebrow}>{copy.targetsEyebrow}</p><h2>{copy.targetsTitle}</h2></div>
          <div className={styles.destinationGrid}>
            <Destination id="placement" eyebrow={locale === "fa" ? "عمومی / زبان‌آموز · ۱ تصمیم" : "PUBLIC / LEARNER · 1 DECISION"} title={copy.placement}><p>{copy.placementText}</p><RouteBadge route="/placement" status="current" locale={locale} /></Destination>
            <Destination id="learner-home" eyebrow={locale === "fa" ? "زبان‌آموز · ۱ تصمیم" : "LEARNER · 1 DECISION"} title={copy.today}><p>{copy.todayText}</p><a className={styles.action} href="#daily-mission">{copy.continueMission}</a><RouteBadge route="/dashboard → /today" status="current" locale={locale} /></Destination>
            <Destination id="teacher-teach" eyebrow={locale === "fa" ? "مدرس · ۳ تصمیم" : "TEACHER · 3 DECISIONS"} title={copy.teachingWork}><p>{copy.teachingWorkText}</p><a className={styles.action} href="#teacher-assignment">{copy.createAssignment}</a><RouteBadge route="/teacher/classes → /teacher/assignments" status="planned" locale={locale} /></Destination>
            <Destination id="learner-teachers" eyebrow={locale === "fa" ? "زبان‌آموز · ۲ تصمیم" : "LEARNER · 2 DECISIONS"} title={copy.learnNow}><p>{copy.learnNowText}</p><a className={styles.action} href="#learn-now">{copy.learnNow}</a><RouteBadge route="/marketplace/requests" status="current" locale={locale} /></Destination>
            <Destination id="learner-account" eyebrow={locale === "fa" ? "زبان‌آموز · ۲ تصمیم" : "LEARNER · 2 DECISIONS"} title={copy.accountHub}><p>{copy.accountHubText}</p><Nav label={copy.accountHub} items={learnerAccount} locale={locale} /></Destination>
            <Destination id="billing" eyebrow={locale === "fa" ? "حساب کاربری" : "ACCOUNT"} title={copy.billing}><RouteBadge route="/account/billing" status="current" locale={locale} /></Destination>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}><p className={styles.eyebrow}>{copy.secondaryEyebrow}</p><h2>{copy.secondaryTitle}</h2></div>
          <div className={styles.routeGrid}>{routeCards.map(([id, eyebrow, title, route, status]) => <Destination id={id} eyebrow={eyebrow} title={title} key={id}><RouteBadge route={route} status={status} locale={locale} /></Destination>)}</div>
        </section>

        <section className={styles.section} id="daily-mission">
          <div className={styles.sectionHeading}><p className={styles.eyebrow}>{copy.flowsEyebrow}</p><h2>{copy.flowsTitle}</h2></div>
          <div className={styles.flowWorkbench}>
            <div className={styles.flowSelector} aria-label={copy.chooseFlow}>
              {flows.map((flow, index) => (
                <button type="button" id={flow.id} key={flow.id} aria-pressed={flow.id === activeFlow.id} onClick={() => selectFlow(flow.id)}>
                  <span>{String(index + 1).padStart(2, "0")}</span><strong>{flow[locale]}</strong><small>{flow.decisions} {copy.decisions}</small>
                </button>
              ))}
            </div>

            <article className={styles.flowDetail} aria-live="polite">
              <div className={styles.flowDetailHeader}><div><p className={styles.eyebrow}>{copy.chooseFlow}</p><h3>{activeFlow[locale]}</h3></div><span className={styles.decisionBadge}>{activeFlow.decisions} {copy.decisions}</span></div>
              <dl className={styles.flowMeta}>
                <div><dt>{copy.entry}</dt><dd>{locale === "fa" ? activeFlow.entryFa : activeFlow.entryEn}</dd></div>
                <div><dt>{copy.owner}</dt><dd>{locale === "fa" ? activeFlow.ownerFa : activeFlow.ownerEn}</dd></div>
                <div><dt>{copy.outcome}</dt><dd>{locale === "fa" ? activeFlow.targetFa : activeFlow.targetEn}</dd></div>
                <div><dt>{copy.maturity}</dt><dd>{locale === "fa" ? activeFlow.maturityFa : activeFlow.maturityEn}</dd></div>
              </dl>
              <div className={styles.stepCounter}>{copy.step} {activeStep + 1} {copy.of} {activeFlow.steps.length}</div>
              <ol className={styles.stepList}>{activeFlow.steps.map((step, index) => <li key={`${activeFlow.id}-${step.route}`}><button type="button" aria-current={index === activeStep ? "step" : undefined} onClick={() => setActiveStep(index)}><span>{index + 1}</span>{step[locale]}</button></li>)}</ol>
              <section className={styles.stepPanel} aria-label={`${copy.step} ${activeStep + 1}`}>
                <div><p className={styles.eyebrow}>{copy.step} {activeStep + 1}</p><h4>{currentStep[locale]}</h4></div>
                <RouteBadge route={currentStep.route} status={currentStep.status} locale={locale} />
                <div className={styles.primaryAction}><span>{copy.primaryAction}</span><strong>{locale === "fa" ? currentStep.actionFa : currentStep.actionEn}</strong></div>
                <div className={styles.stepControls}><button type="button" disabled={activeStep === 0} onClick={() => setActiveStep((step) => Math.max(0, step - 1))}>{copy.previous}</button><button type="button" disabled={activeStep === activeFlow.steps.length - 1} onClick={() => setActiveStep((step) => Math.min(activeFlow.steps.length - 1, step + 1))}>{copy.next}</button></div>
                <p className={styles.saveHint}>{copy.saveHint}</p>
              </section>
              <section className={styles.recoveryPanel}><h4>{copy.recovery}</h4><div>{activeFlow.recovery.map((item) => <article key={item.stateEn}><strong>{locale === "fa" ? item.stateFa : item.stateEn}</strong><p>{item[locale]}</p></article>)}</div></section>
            </article>
          </div>
        </section>

        <section className={styles.section}><div className={styles.sectionHeading}><p className={styles.eyebrow}>{copy.statesEyebrow}</p><h2>{copy.statesTitle}</h2></div><ul className={styles.stateList}>{copy.states.map((state) => <li key={state}>{state}</li>)}</ul><p>{copy.statesText}</p></section>
      </main>
    </div>
  );
}
