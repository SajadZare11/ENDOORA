import fs from "fs";
import { recordAuditLog } from "./admin-ops.ts";
import {
  resolveStoragePath,
  atomicWriteJsonSync,
  readJsonWithFallback,
} from "./admin-storage-engine.ts";

// ==============================================================================
// 1. Block-Based Page Composer Types
// ==============================================================================
export type PageBlockType =
  | "hero"
  | "features"
  | "video"
  | "pricing"
  | "testimonials"
  | "faq"
  | "custom_html";

export interface HeroBlockData {
  badgeFa?: string;
  badgeEn?: string;
  headlineFa: string;
  headlineEn: string;
  subheadlineFa: string;
  subheadlineEn: string;
  primaryCtaTextFa: string;
  primaryCtaTextEn: string;
  primaryCtaUrl: string;
  secondaryCtaTextFa?: string;
  secondaryCtaTextEn?: string;
  secondaryCtaUrl?: string;
  bgGradient?: string;
  imageUrl?: string;
}

export interface FeatureItem {
  icon: string;
  titleFa: string;
  titleEn: string;
  descriptionFa: string;
  descriptionEn: string;
  badgeText?: string;
}

export interface FeaturesBlockData {
  headlineFa: string;
  headlineEn: string;
  subheadlineFa?: string;
  subheadlineEn?: string;
  features: FeatureItem[];
}

export interface VideoBlockData {
  headlineFa: string;
  headlineEn: string;
  descriptionFa?: string;
  descriptionEn?: string;
  videoUrl: string;
  posterUrl?: string;
  transcriptSampleFa?: string;
  transcriptSampleEn?: string;
  downloadUrl?: string;
  downloadLabel?: string;
}

export interface PricingPlanItem {
  nameFa: string;
  nameEn: string;
  priceToman: number;
  periodTextFa: string;
  periodTextEn: string;
  featuresFa: string[];
  featuresEn: string[];
  ctaTextFa: string;
  ctaTextEn: string;
  ctaUrl: string;
  isPopular?: boolean;
}

export interface PricingBlockData {
  headlineFa: string;
  headlineEn: string;
  subheadlineFa?: string;
  subheadlineEn?: string;
  plans: PricingPlanItem[];
}

export interface TestimonialItem {
  nameFa: string;
  nameEn: string;
  roleFa: string;
  roleEn: string;
  avatar: string;
  quoteFa: string;
  quoteEn: string;
  cefrScoreBadge?: string;
}

export interface TestimonialsBlockData {
  headlineFa: string;
  headlineEn: string;
  testimonials: TestimonialItem[];
}

export interface FaqItem {
  questionFa: string;
  questionEn: string;
  answerFa: string;
  answerEn: string;
}

export interface FaqBlockData {
  headlineFa: string;
  headlineEn: string;
  items: FaqItem[];
}

export interface CustomHtmlBlockData {
  rawHtml: string;
  containerClass?: string;
}

export type PageBlockPayload =
  | { type: "hero"; data: HeroBlockData }
  | { type: "features"; data: FeaturesBlockData }
  | { type: "video"; data: VideoBlockData }
  | { type: "pricing"; data: PricingBlockData }
  | { type: "testimonials"; data: TestimonialsBlockData }
  | { type: "faq"; data: FaqBlockData }
  | { type: "custom_html"; data: CustomHtmlBlockData };

export interface PageBlock {
  id: string;
  order: number;
  enabled: boolean;
  block: PageBlockPayload;
}

export interface CustomDynamicPage {
  id: string;
  slug: string; // e.g. "exam-cram", "black-friday", "ielts-speaking" -> served at /p/[slug]
  titleFa: string;
  titleEn: string;
  metaTitleFa?: string;
  metaDescriptionFa?: string;
  metaTitleEn?: string;
  metaDescriptionEn?: string;
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  viewsCount: number;
  blocks: PageBlock[];
}

// ==============================================================================
// 2. Navigation & Menus Studio Types
// ==============================================================================
export interface NavItem {
  id: string;
  path: string;
  fa: string;
  en: string;
  order: number;
  badgeTextFa?: string;
  badgeColor?: string; // e.g. "#16a34a", "#dc2626"
  isExternal?: boolean;
  subItems?: {
    id: string;
    path: string;
    fa: string;
    en: string;
    descriptionFa?: string;
  }[];
}

export interface FooterColumn {
  id: string;
  titleFa: string;
  titleEn: string;
  links: {
    id: string;
    path: string;
    fa: string;
    en: string;
  }[];
}

export interface NavigationMenuConfig {
  version: number;
  headerNav: NavItem[];
  footerColumns: FooterColumn[];
  footerBrandTextFa: string;
  footerBrandTextEn: string;
  updatedAt: string;
  publishedAt?: string;
  updatedBy: string;
}

// ==============================================================================
// 3. Popups & Floating Banners Types
// ==============================================================================
export type PopupType = "center_modal" | "top_countdown_ribbon" | "bottom_toast_ribbon";

export interface SitePopupConfig {
  id: string;
  titleFa: string;
  titleEn: string;
  type: PopupType;
  isActive: boolean;
  messageFa: string;
  messageEn: string;
  imageUrl?: string;
  couponCode?: string;
  ctaTextFa?: string;
  ctaTextEn?: string;
  ctaUrl?: string;
  countdownTargetIso?: string; // for countdown ribbon
  triggerType: "time_delay" | "exit_intent" | "scroll_depth";
  triggerDelaySeconds?: number; // e.g. 5
  triggerScrollPercent?: number; // e.g. 50
  targetPaths: string[]; // ["*"] or ["/", "/pricing", "/skills/school"]
  frequencyCap: "once_per_session" | "once_per_day" | "every_time";
  impressionsCount: number;
  clicksCount: number;
  createdAt: string;
  updatedAt: string;
}

// ==============================================================================
// 4. Global Theme & Branding Types
// ==============================================================================
export interface GlobalThemeConfig {
  brandPrimaryColor: string; // e.g. "#2563eb"
  brandAccentColor: string; // e.g. "#059669"
  brandSecondaryAccent: string; // e.g. "#7c3aed"
  persianFontFamily: "Vazirmatn" | "Shabnam" | "Dana" | "Yekan Bakh" | "Sahel";
  englishFontFamily: "Inter" | "Roboto" | "Poppins" | "system-ui";
  baseFontSizePx: number; // e.g. 16
  borderRadiusScale: "sharp" | "moderate" | "rounded" | "pill"; // 0px, 6px, 12px, 24px
  customCssEnabled: boolean;
  customCssCode: string;
  headScriptsEnabled: boolean;
  headScriptsCode: string;
  updatedAt: string;
  updatedBy: string;
}

// ==============================================================================
// Initial Seed Data
// ==============================================================================
export const INITIAL_CUSTOM_PAGES: CustomDynamicPage[] = [
  {
    id: "page-konkur-cram-1403",
    slug: "exam-cram-1403",
    titleFa: "کمپ جمع‌بندی طلایی زبان دوازدهم نهایی",
    titleEn: "Grade 12 Final Exam Intensive Cram Camp",
    metaTitleFa: "کمپ طلایی نمره ۲۰ امتحان نهایی زبان انگلیسی دوازدهم | Endoora",
    metaDescriptionFa: "تحلیل موشکافانه نمونه سوالات کشوری خرداد و شهریور، مرور گرامر مجهول و واژگان پرتکرار با تصحیح هوش مصنوعی.",
    status: "published",
    createdAt: "1403/08/10",
    updatedAt: "1403/08/20",
    publishedAt: "1403/08/20",
    viewsCount: 3840,
    blocks: [
      {
        id: "b-hero-01",
        order: 1,
        enabled: true,
        block: {
          type: "hero",
          data: {
            badgeFa: "🔥 ویژه امتحان نهایی خرداد و دی",
            badgeEn: "National Final Exam Special",
            headlineFa: "نمره ۲۰ امتحان نهایی زبان دوازدهم در مشت شماست",
            headlineEn: "Score 20 in High School English Final Exam",
            subheadlineFa: "بررسی تمام نکات گرامری مجهول، افعال کمکی و درک مطلب درس‌های ۱ تا ۳ کتاب Vision 3 با متد تضمینی ایندورا",
            subheadlineEn: "Comprehensive review of passive voice, modal auxiliaries and reading strategies.",
            primaryCtaTextFa: "شروع دوره فشرده با تخفیف ۵۰٪",
            primaryCtaTextEn: "Enroll in Cram Camp",
            primaryCtaUrl: "/checkout?plan=cram12",
            secondaryCtaTextFa: "دانلود رایگان جزوه تست‌های نهایی",
            secondaryCtaTextEn: "Download Free Exam PDF",
            secondaryCtaUrl: "/downloads/vision3_final_exam.pdf",
            bgGradient: "linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)",
          },
        },
      },
      {
        id: "b-feat-01",
        order: 2,
        enabled: true,
        block: {
          type: "features",
          data: {
            headlineFa: "چرا این کمپ با بقیه کلاس‌ها متفاوت است؟",
            headlineEn: "Why this intensive camp stands out",
            subheadlineFa: "ترکیب آموزش خط به خط کتاب درسی با موتور تصحیح سوالات تشریحی هوش مصنوعی",
            features: [
              {
                icon: "🎯",
                titleFa: "تطابق ۱۰۰٪ با کلید مصححین کشوری",
                titleEn: "100% Aligned with National Exam Keys",
                descriptionFa: "پاسخ‌های نمونه دقیقا طبق بارم‌بندی رسمی آموزش و پرورش تدوین شده‌اند.",
                descriptionEn: "Sample answers adhere strictly to official grading rubrics.",
                badgeText: "استاندارد کشوری",
              },
              {
                icon: "🎧",
                titleFa: "شنیداری نهایی با تفکیک لهجه",
                titleEn: "Audio Listening Lab",
                descriptionFa: "تمام فایل‌های صوتی بخش لیسنینگ نهایی با کیفیت استودیویی و زیرنویس همگام.",
                descriptionEn: "Studio quality audio with synchronized transcripts.",
                badgeText: "لهجه استاندارد",
              },
              {
                icon: "🤖",
                titleFa: "تصحیح دستخط و نگارش با AI",
                titleEn: "AI Handwriting & Essay Evaluation",
                descriptionFa: "برگه امتحانی خود را آپلود کنید تا هوش مصنوعی خطاهای گرامری را مشخص کند.",
                descriptionEn: "Upload your practice sheet to get instant grammatical corrections.",
                badgeText: "فناوری انحصاری",
              },
            ],
          },
        },
      },
      {
        id: "b-faq-01",
        order: 3,
        enabled: true,
        block: {
          type: "faq",
          data: {
            headlineFa: "پرسش‌های پرتکرار دانش‌آموزان و اولیا",
            headlineEn: "Frequently Asked Questions",
            items: [
              {
                questionFa: "آیا این دوره برای دانش‌آموزان با پایه ضعیف هم پاسخگو است؟",
                questionEn: "Is this suitable for learners with weak foundations?",
                answerFa: "بله، تدریس از مفاهیم پایه قواعد آغاز شده و پله به پله به سمت حل سخت‌ترین سوالات خرداد هدایت می‌شود.",
                answerEn: "Yes, instructional steps begin from basics and scale towards challenging past exams.",
              },
              {
                questionFa: "آیا فایل‌های ویدیویی قابلیت دانلود دارند؟",
                questionEn: "Are video lessons downloadable?",
                answerFa: "بله، در کنار پخش آنلاین بدون قطعی، جزوات PDF و فایل‌های صوتی دروس قابل بارگیری آفلاین هستند.",
                answerEn: "Yes, alongside adaptive streaming, PDF study packs and audios can be saved offline.",
              },
            ],
          },
        },
      },
    ],
  },
  {
    id: "page-black-friday",
    slug: "black-friday",
    titleFa: "جشنواره جمعه شگفت‌انگیز ایندورا (۶۵٪ تخفیف)",
    titleEn: "Endoora Black Friday Mega Sale",
    metaTitleFa: "تخفیف شگفت‌انگیز سالانه اشتراک دوره‌های زبان انگلیسی | ایندورا",
    metaDescriptionFa: "بهترین فرصت یادگیری سال؛ اشتراک نامحدود تمام دوره‌های مکالمه، آیلتس و دبیرستان با ۶۵٪ تخفیف.",
    status: "published",
    createdAt: "1403/08/15",
    updatedAt: "1403/08/18",
    publishedAt: "1403/08/18",
    viewsCount: 6210,
    blocks: [
      {
        id: "b-hero-bf",
        order: 1,
        enabled: true,
        block: {
          type: "hero",
          data: {
            badgeFa: "⏰ فقط تا پایان هفته",
            badgeEn: "Limited Time Annual Event",
            headlineFa: "جشنواره طلایی یادگیری: ۶۵٪ تخفیف اشتراک نامحدود",
            headlineEn: "Mega Sale: 65% OFF All Access Pass",
            subheadlineFa: "دسترسی نامحدود به دوقلوی هوش مصنوعی، تمام سطوح Speakout، تاپیک‌های آیلتس و تصحیح رایتینگ",
            subheadlineEn: "Unlock AI Learner Twin, complete Speakout courses, and IELTS simulators.",
            primaryCtaTextFa: "دریافت اشتراک سالانه با کد BF1403",
            primaryCtaTextEn: "Get 1-Year Pass Now",
            primaryCtaUrl: "/pricing?coupon=BF1403",
            bgGradient: "linear-gradient(135deg, #450a0a 0%, #1e1b4b 100%)",
          },
        },
      },
    ],
  },
];

export const INITIAL_NAVIGATION_CONFIG: NavigationMenuConfig = {
  version: 1,
  headerNav: [
    {
      id: "nav-school",
      path: "/skills/school",
      fa: "زبان دبیرستان و نهایی",
      en: "High School English",
      order: 1,
      badgeTextFa: "امتحان نهایی",
      badgeColor: "#dc2626",
    },
    {
      id: "nav-teachers",
      path: "/teachers",
      fa: "اساتید برتر",
      en: "Teachers",
      order: 2,
    },
    {
      id: "nav-classes",
      path: "/classes",
      fa: "کلاس‌ها و کارگاه‌ها",
      en: "Classes",
      order: 3,
    },
    {
      id: "nav-skills",
      path: "/skills",
      fa: "هاب ۶ مهارت",
      en: "6 Skills Hub",
      order: 4,
    },
    {
      id: "nav-ielts",
      path: "/ielts",
      fa: "ماک آیلتس",
      en: "IELTS Prep",
      order: 5,
      badgeTextFa: "AI Grade",
      badgeColor: "#7c3aed",
    },
    {
      id: "nav-books",
      path: "/books",
      fa: "کتابخانه دوره‌ها",
      en: "Course Books",
      order: 6,
    },
    {
      id: "nav-pricing",
      path: "/pricing",
      fa: "خرید اشتراک",
      en: "Pricing & Plans",
      order: 7,
      badgeTextFa: "ویژه",
      badgeColor: "#16a34a",
    },
  ],
  footerColumns: [
    {
      id: "col-learn",
      titleFa: "آموزش و مهارت‌ها",
      titleEn: "Learning",
      links: [
        { id: "l-1", path: "/skills", fa: "مهارت‌های زبان انگلیسی", en: "Skills" },
        { id: "l-2", path: "/skills/school", fa: "دبیرستان و کنکور", en: "High School" },
        { id: "l-3", path: "/community", fa: "تالارهای گفتگو", en: "Community" },
        { id: "l-4", path: "/books", fa: "کتاب‌های Speakout و AEF", en: "Books" },
      ],
    },
    {
      id: "col-trust",
      titleFa: "قوانین و امنیت",
      titleEn: "Trust & Legal",
      links: [
        { id: "l-5", path: "/legal/privacy", fa: "حریم خصوصی کاربران", en: "Privacy Policy" },
        { id: "l-6", path: "/legal/terms", fa: "شرایط استفاده از خدمات", en: "Terms of Service" },
        { id: "l-7", path: "/legal/ai-limitations", fa: "شفافیت مدل‌های هوش مصنوعی", en: "AI Transparency" },
      ],
    },
    {
      id: "col-support",
      titleFa: "پشتیبانی و ارتباط",
      titleEn: "Support & Contact",
      links: [
        { id: "l-8", path: "/support", fa: "ارسال تیکت پشتیبانی", en: "Support Tickets" },
        { id: "l-9", path: "/contact", fa: "اطلاعات تماس با ما", en: "Contact Us" },
        { id: "l-10", path: "/about", fa: "درباره آکادمی ایندورا", en: "About Us" },
      ],
    },
  ],
  footerBrandTextFa: "ایندورا؛ درگاهی نو به تسلط زبان انگلیسی برای جامعه هوشمند فارسی‌زبان.",
  footerBrandTextEn: "Endoora; A new door to English mastery designed for Persian speakers.",
  updatedAt: "1403/08/20",
  updatedBy: "مدیر ارشد ایندورا",
};

export const INITIAL_SITE_POPUPS: SitePopupConfig[] = [
  {
    id: "pop-countdown-banner",
    titleFa: "نوار شمارش معکوس تخفیف ویژه بالای صفحه",
    titleEn: "Top Countdown Flash Ribbon",
    type: "top_countdown_ribbon",
    isActive: true,
    messageFa: "⚡ تخفیف ۵۰٪ ویژه اشتراک دوره‌های امتحان نهایی و آیلتس تا پایان امشب:",
    messageEn: "50% Flash Sale on Final Exam and IELTS courses expires tonight:",
    couponCode: "FINAL20",
    ctaTextFa: "خرید با تخفیف",
    ctaTextEn: "Claim Deal",
    ctaUrl: "/pricing?coupon=FINAL20",
    countdownTargetIso: new Date(Date.now() + 86400000 * 2).toISOString(),
    triggerType: "time_delay",
    triggerDelaySeconds: 1,
    targetPaths: ["*"],
    frequencyCap: "every_time",
    impressionsCount: 14200,
    clicksCount: 940,
    createdAt: "1403/08/18",
    updatedAt: "1403/08/20",
  },
  {
    id: "pop-center-modal-lead",
    titleFa: "پاپ‌آپ مدال جذب زبان‌آموز با دانلود رایگان",
    titleEn: "Center Lead Magnet Modal (Exam Cram Pack)",
    type: "center_modal",
    isActive: true,
    messageFa: "آیا برای امتحان نهایی دوازدهم آماده‌اید؟ جزوه ۲۵ صفحه‌ای تست‌های طلایی کشوری را رایگان دریافت کنید!",
    messageEn: "Get the Grade 12 Vision 3 Golden Exam pack for free!",
    couponCode: "VISION100",
    ctaTextFa: "دانلود رایگان جزوه PDF",
    ctaTextEn: "Download PDF Free",
    ctaUrl: "/downloads/vision3_final_exam.pdf",
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80",
    triggerType: "exit_intent",
    targetPaths: ["/skills/school", "/p/exam-cram-1403"],
    frequencyCap: "once_per_session",
    impressionsCount: 2310,
    clicksCount: 420,
    createdAt: "1403/08/19",
    updatedAt: "1403/08/20",
  },
];

export const INITIAL_GLOBAL_THEME: GlobalThemeConfig = {
  brandPrimaryColor: "#2563eb",
  brandAccentColor: "#059669",
  brandSecondaryAccent: "#7c3aed",
  persianFontFamily: "Vazirmatn",
  englishFontFamily: "Inter",
  baseFontSizePx: 16,
  borderRadiusScale: "rounded",
  customCssEnabled: false,
  customCssCode: "/* Custom CSS injected globally across all pages */\n.btn-glow {\n  box-shadow: 0 0 15px rgba(37, 99, 235, 0.4);\n}",
  headScriptsEnabled: false,
  headScriptsCode: "<!-- Analytics / Tracking tag injection placeholder -->\n<!-- <script>console.log('Endoora Live Analytics Initialized');</script> -->",
  updatedAt: "1403/08/20",
  updatedBy: "مدیر ارشد ایندورا",
};

// ==============================================================================
// Persistent State & Store Accessors (site-builder-operations.json)
// ==============================================================================
export interface SiteBuilderStoragePayload {
  pages: CustomDynamicPage[];
  draftMenu: NavigationMenuConfig;
  liveMenu: NavigationMenuConfig;
  menuHistory: NavigationMenuConfig[];
  popups: SitePopupConfig[];
  theme: GlobalThemeConfig;
}

let inMemorySiteBuilder: SiteBuilderStoragePayload | null = null;
let lastLoadedMtime = 0;

function getStoragePath(): string {
  return resolveStoragePath("site-builder-operations.json");
}

export function getSiteBuilderStorage(): SiteBuilderStoragePayload {
  const filePath = getStoragePath();
  if (inMemorySiteBuilder && fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    if (stats.mtimeMs <= lastLoadedMtime) {
      return inMemorySiteBuilder;
    }
  }

  const { data, mtime } = readJsonWithFallback<SiteBuilderStoragePayload>(
    filePath,
    () => ({
      pages: JSON.parse(JSON.stringify(INITIAL_CUSTOM_PAGES)),
      draftMenu: JSON.parse(JSON.stringify(INITIAL_NAVIGATION_CONFIG)),
      liveMenu: JSON.parse(JSON.stringify(INITIAL_NAVIGATION_CONFIG)),
      menuHistory: [JSON.parse(JSON.stringify(INITIAL_NAVIGATION_CONFIG))],
      popups: JSON.parse(JSON.stringify(INITIAL_SITE_POPUPS)),
      theme: JSON.parse(JSON.stringify(INITIAL_GLOBAL_THEME)),
    }),
    (p): p is SiteBuilderStoragePayload =>
      Array.isArray(p?.pages) && Array.isArray(p?.popups) && typeof p?.theme === "object"
  );

  inMemorySiteBuilder = data;
  lastLoadedMtime = mtime;
  return inMemorySiteBuilder;
}

function persistStorage(): void {
  if (!inMemorySiteBuilder) return;
  const filePath = getStoragePath();
  atomicWriteJsonSync(filePath, inMemorySiteBuilder);
  if (fs.existsSync(filePath)) {
    lastLoadedMtime = fs.statSync(filePath).mtimeMs;
  }
}

// ----------------- PAGES OPERATIONS -----------------
export function getCustomPages(): CustomDynamicPage[] {
  return [...getSiteBuilderStorage().pages];
}

export function getCustomPageBySlug(slug: string): CustomDynamicPage | null {
  const storage = getSiteBuilderStorage();
  const clean = slug.replace(/^\/+/, "");
  const found = storage.pages.find((p) => p.slug === clean && p.status === "published");
  if (found) {
    found.viewsCount = (found.viewsCount || 0) + 1;
    persistStorage();
    return found;
  }
  return null;
}

export function saveCustomPage(
  pageData: Partial<CustomDynamicPage>,
  adminUser = "مدیر ارشد ایندورا"
): { success: boolean; page?: CustomDynamicPage; error?: string } {
  if (!pageData.slug || !pageData.titleFa) {
    return { success: false, error: "عنوان فارسی و آدرس یکتا (Slug) الزامی است." };
  }

  const storage = getSiteBuilderStorage();
  const cleanSlug = pageData.slug.trim().toLowerCase().replace(/^\/+/, "").replace(/\s+/g, "-");

  const existingIdx = storage.pages.findIndex((p) => p.id === pageData.id || p.slug === cleanSlug);

  if (existingIdx >= 0) {
    const updated: CustomDynamicPage = {
      ...storage.pages[existingIdx],
      ...pageData,
      slug: cleanSlug,
      updatedAt: new Date().toLocaleDateString("fa-IR"),
    };
    if (pageData.status === "published" && !updated.publishedAt) {
      updated.publishedAt = new Date().toLocaleDateString("fa-IR");
    }
    storage.pages[existingIdx] = updated;
    persistStorage();

    recordAuditLog({
      actor_id: null,
      actor_email: adminUser,
      actor_role: "administrator",
      action: "update",
      target_app: "site_builder",
      target_model: "CustomDynamicPage",
      target_pk: updated.id,
      before_summary: {},
      after_summary: { slug: cleanSlug, titleFa: updated.titleFa, status: updated.status },
      reason: "به‌روزرسانی محتوای برگه سفارشی در استودیو ساخت سایت",
      request_method: "POST",
      request_path: "/api/admin/site-builder/pages",
      environment: "production",
    });

    return { success: true, page: updated };
  } else {
    const newPage: CustomDynamicPage = {
      id: pageData.id || `page-${Date.now()}`,
      slug: cleanSlug,
      titleFa: pageData.titleFa,
      titleEn: pageData.titleEn || pageData.titleFa,
      metaTitleFa: pageData.metaTitleFa,
      metaDescriptionFa: pageData.metaDescriptionFa,
      status: pageData.status || "draft",
      createdAt: new Date().toLocaleDateString("fa-IR"),
      updatedAt: new Date().toLocaleDateString("fa-IR"),
      publishedAt: pageData.status === "published" ? new Date().toLocaleDateString("fa-IR") : null,
      viewsCount: pageData.viewsCount ?? 0,
      blocks: pageData.blocks || [],
    };
    storage.pages.unshift(newPage);
    persistStorage();

    recordAuditLog({
      actor_id: null,
      actor_email: adminUser,
      actor_role: "administrator",
      action: "create",
      target_app: "site_builder",
      target_model: "CustomDynamicPage",
      target_pk: newPage.id,
      before_summary: {},
      after_summary: { slug: cleanSlug, titleFa: newPage.titleFa },
      reason: "ایجاد برگه اختصاصی جدید در استودیو ساخت سایت",
      request_method: "POST",
      request_path: "/api/admin/site-builder/pages",
      environment: "production",
    });

    return { success: true, page: newPage };
  }
}

export function deleteCustomPage(
  pageId: string,
  adminUser = "مدیر ارشد ایندورا"
): { success: boolean; error?: string } {
  const storage = getSiteBuilderStorage();
  const index = storage.pages.findIndex((p) => p.id === pageId);
  if (index === -1) {
    return { success: false, error: "برگه مورد نظر یافت نشد." };
  }

  const removed = storage.pages[index];
  storage.pages.splice(index, 1);
  persistStorage();

  recordAuditLog({
    actor_id: null,
    actor_email: adminUser,
    actor_role: "administrator",
    action: "delete",
    target_app: "site_builder",
    target_model: "CustomDynamicPage",
    target_pk: pageId,
    before_summary: { slug: removed.slug, titleFa: removed.titleFa },
    after_summary: {},
    reason: "حذف برگه سفارشی توسط مدیر ارشد",
    request_method: "DELETE",
    request_path: "/api/admin/site-builder/pages",
    environment: "production",
  });

  return { success: true };
}

// ----------------- MENUS OPERATIONS -----------------
export function getNavigationConfig(): {
  draft: NavigationMenuConfig;
  live: NavigationMenuConfig;
  history: NavigationMenuConfig[];
} {
  const storage = getSiteBuilderStorage();
  return {
    draft: storage.draftMenu,
    live: storage.liveMenu,
    history: storage.menuHistory,
  };
}

export function saveDraftNavigation(
  config: Partial<NavigationMenuConfig>,
  adminUser = "مدیر ارشد ایندورا"
): { success: boolean; draft: NavigationMenuConfig } {
  const storage = getSiteBuilderStorage();
  storage.draftMenu = {
    ...storage.draftMenu,
    ...config,
    updatedAt: new Date().toLocaleDateString("fa-IR"),
    updatedBy: adminUser,
  };
  persistStorage();
  return { success: true, draft: storage.draftMenu };
}

export function publishLiveNavigation(
  adminUser = "مدیر ارشد ایندورا"
): { success: boolean; live: NavigationMenuConfig } {
  const storage = getSiteBuilderStorage();
  const newVersion = (storage.liveMenu.version || 1) + 1;
  const published: NavigationMenuConfig = {
    ...storage.draftMenu,
    version: newVersion,
    publishedAt: new Date().toLocaleDateString("fa-IR"),
    updatedAt: new Date().toLocaleDateString("fa-IR"),
    updatedBy: adminUser,
  };

  storage.liveMenu = published;
  storage.draftMenu = { ...published };
  storage.menuHistory.unshift(published);
  if (storage.menuHistory.length > 10) storage.menuHistory.pop();
  persistStorage();

  recordAuditLog({
    actor_id: null,
    actor_email: adminUser,
    actor_role: "administrator",
    action: "update",
    target_app: "site_builder",
    target_model: "NavigationMenuConfig",
    target_pk: `version_${newVersion}`,
    before_summary: { previous_version: newVersion - 1 },
    after_summary: { published_version: newVersion, items_count: published.headerNav.length },
    reason: "انتشار عمومی منوهای هدر و فوتر جدید در سایت",
    request_method: "POST",
    request_path: "/api/admin/site-builder/menus",
    environment: "production",
  });

  return { success: true, live: published };
}

export function rollbackNavigation(
  targetVersion: number,
  adminUser = "مدیر ارشد ایندورا"
): { success: boolean; live?: NavigationMenuConfig; error?: string } {
  const storage = getSiteBuilderStorage();
  const match = storage.menuHistory.find((m) => m.version === targetVersion);
  if (!match) {
    return { success: false, error: `نسخه منوی ${targetVersion} در تاریخچه موجود نیست.` };
  }

  storage.liveMenu = { ...match, updatedAt: new Date().toLocaleDateString("fa-IR"), updatedBy: adminUser };
  storage.draftMenu = { ...storage.liveMenu };
  persistStorage();

  recordAuditLog({
    actor_id: null,
    actor_email: adminUser,
    actor_role: "administrator",
    action: "update",
    target_app: "site_builder",
    target_model: "NavigationMenuConfig",
    target_pk: `rollback_to_${targetVersion}`,
    before_summary: {},
    after_summary: { restored_version: targetVersion },
    reason: `بازگشت به نسخه قبلی منو (نسخه ${targetVersion})`,
    request_method: "POST",
    request_path: "/api/admin/site-builder/menus",
    environment: "production",
  });

  return { success: true, live: storage.liveMenu };
}

// ----------------- POPUPS OPERATIONS -----------------
export function getSitePopups(): SitePopupConfig[] {
  return [...getSiteBuilderStorage().popups];
}

export function getActivePublicPopups(currentPath: string): SitePopupConfig[] {
  const storage = getSiteBuilderStorage();
  return storage.popups.filter((p) => {
    if (!p.isActive) return false;
    if (p.targetPaths.includes("*")) return true;
    return p.targetPaths.some((tp) => currentPath.startsWith(tp));
  });
}

export function saveSitePopup(
  popupData: Partial<SitePopupConfig>,
  adminUser = "مدیر ارشد ایندورا"
): { success: boolean; popup?: SitePopupConfig; error?: string } {
  if (!popupData.titleFa || !popupData.messageFa) {
    return { success: false, error: "عنوان و پیام پاپ‌آپ الزامی است." };
  }

  const storage = getSiteBuilderStorage();
  const existingIdx = storage.popups.findIndex((p) => p.id === popupData.id);

  if (existingIdx >= 0) {
    const updated: SitePopupConfig = {
      ...storage.popups[existingIdx],
      ...popupData,
      updatedAt: new Date().toLocaleDateString("fa-IR"),
    };
    storage.popups[existingIdx] = updated;
    persistStorage();

    recordAuditLog({
      actor_id: null,
      actor_email: adminUser,
      actor_role: "administrator",
      action: "update",
      target_app: "site_builder",
      target_model: "SitePopupConfig",
      target_pk: updated.id,
      before_summary: {},
      after_summary: { titleFa: updated.titleFa, isActive: updated.isActive },
      reason: "به‌روزرسانی تنظیمات پاپ‌آپ یا بنر تبلیغاتی",
      request_method: "POST",
      request_path: "/api/admin/site-builder/popups",
      environment: "production",
    });

    return { success: true, popup: updated };
  } else {
    const newPopup: SitePopupConfig = {
      id: popupData.id || `pop-${Date.now()}`,
      titleFa: popupData.titleFa,
      titleEn: popupData.titleEn || popupData.titleFa,
      type: popupData.type || "center_modal",
      isActive: popupData.isActive ?? true,
      messageFa: popupData.messageFa,
      messageEn: popupData.messageEn || popupData.messageFa,
      imageUrl: popupData.imageUrl,
      couponCode: popupData.couponCode,
      ctaTextFa: popupData.ctaTextFa || "مشاهده پیشنهاد",
      ctaTextEn: popupData.ctaTextEn || "View Offer",
      ctaUrl: popupData.ctaUrl || "/pricing",
      countdownTargetIso: popupData.countdownTargetIso,
      triggerType: popupData.triggerType || "time_delay",
      triggerDelaySeconds: popupData.triggerDelaySeconds || 3,
      triggerScrollPercent: popupData.triggerScrollPercent || 50,
      targetPaths: popupData.targetPaths && popupData.targetPaths.length > 0 ? popupData.targetPaths : ["*"],
      frequencyCap: popupData.frequencyCap || "once_per_session",
      impressionsCount: 0,
      clicksCount: 0,
      createdAt: new Date().toLocaleDateString("fa-IR"),
      updatedAt: new Date().toLocaleDateString("fa-IR"),
    };
    storage.popups.unshift(newPopup);
    persistStorage();

    recordAuditLog({
      actor_id: null,
      actor_email: adminUser,
      actor_role: "administrator",
      action: "create",
      target_app: "site_builder",
      target_model: "SitePopupConfig",
      target_pk: newPopup.id,
      before_summary: {},
      after_summary: { titleFa: newPopup.titleFa, type: newPopup.type },
      reason: "ایجاد پاپ‌آپ تبلیغاتی یا بنر شناور جدید",
      request_method: "POST",
      request_path: "/api/admin/site-builder/popups",
      environment: "production",
    });

    return { success: true, popup: newPopup };
  }
}

export function deleteSitePopup(
  popupId: string,
  adminUser = "مدیر ارشد ایندورا"
): { success: boolean; error?: string } {
  const storage = getSiteBuilderStorage();
  const index = storage.popups.findIndex((p) => p.id === popupId);
  if (index === -1) {
    return { success: false, error: "پاپ‌آپ مورد نظر یافت نشد." };
  }

  const removed = storage.popups[index];
  storage.popups.splice(index, 1);
  persistStorage();

  recordAuditLog({
    actor_id: null,
    actor_email: adminUser,
    actor_role: "administrator",
    action: "delete",
    target_app: "site_builder",
    target_model: "SitePopupConfig",
    target_pk: popupId,
    before_summary: { titleFa: removed.titleFa },
    after_summary: {},
    reason: "حذف پاپ‌آپ تبلیغاتی توسط مدیریت",
    request_method: "DELETE",
    request_path: "/api/admin/site-builder/popups",
    environment: "production",
  });

  return { success: true };
}

// ----------------- THEME & BRANDING OPERATIONS -----------------
export function getGlobalThemeConfig(): GlobalThemeConfig {
  return { ...getSiteBuilderStorage().theme };
}

export function saveGlobalThemeConfig(
  themeData: Partial<GlobalThemeConfig>,
  adminUser = "مدیر ارشد ایندورا"
): { success: boolean; theme: GlobalThemeConfig } {
  const storage = getSiteBuilderStorage();
  storage.theme = {
    ...storage.theme,
    ...themeData,
    updatedAt: new Date().toLocaleDateString("fa-IR"),
    updatedBy: adminUser,
  };
  persistStorage();

  recordAuditLog({
    actor_id: null,
    actor_email: adminUser,
    actor_role: "administrator",
    action: "update",
    target_app: "site_builder",
    target_model: "GlobalThemeConfig",
    target_pk: "global_branding",
    before_summary: {},
    after_summary: {
      brandPrimaryColor: storage.theme.brandPrimaryColor,
      persianFontFamily: storage.theme.persianFontFamily,
      customCssEnabled: storage.theme.customCssEnabled,
    },
    reason: "شخصی‌سازی تم سراسری، فونت‌ها و رنگ سازمانی سایت",
    request_method: "POST",
    request_path: "/api/admin/site-builder/theme",
    environment: "production",
  });

  return { success: true, theme: storage.theme };
}
