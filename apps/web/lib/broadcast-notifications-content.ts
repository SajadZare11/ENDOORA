export type BroadcastChannel = "in_app" | "sms" | "urgent_banner" | "email";
export type BroadcastPriority = "normal" | "important" | "critical";

export type AudienceSegmentKey =
  | "all_users"
  | "active_students"
  | "inactive_students_7d"
  | "verified_teachers"
  | "abandoned_cart_users";

export interface AudienceSegment {
  key: AudienceSegmentKey;
  label: string;
  description: string;
  estimatedCount: number;
  availableChannels: BroadcastChannel[];
}

export interface BroadcastCampaign {
  id: string;
  title: string;
  body: string;
  ctaText?: string;
  ctaUrl?: string;
  channels: BroadcastChannel[];
  priority: BroadcastPriority;
  targetSegment: AudienceSegmentKey;
  targetSegmentLabel: string;
  estimatedRecipients: number;
  actualDeliveredCount: number;
  deliveryRatePercent: number;
  status: "completed" | "scheduled" | "cancelled" | "draft";
  scheduledFor?: string | null;
  sentAt?: string | null;
  createdBy: string;
  isTestSentToAdmin: boolean;
  createdAt: string;
}

export interface BroadcastTemplate {
  id: string;
  title: string;
  category: "promotional" | "academic" | "retention" | "system";
  channels: BroadcastChannel[];
  priority: BroadcastPriority;
  defaultTitle: string;
  defaultBody: string;
  defaultCtaText: string;
  defaultCtaUrl: string;
}

export interface BroadcastStats {
  totalCampaignsSent: number;
  totalNotificationsDelivered: number;
  totalSmsDispatched: number;
  avgDeliveryRatePercent: number;
  activeUrgentBannersCount: number;
  scheduledCampaignsCount: number;
}

export const CHANNEL_LABELS: Record<BroadcastChannel, { fa: string; icon: string; color: string }> = {
  in_app: { fa: "نوتیفیکیشن درون‌برنامه‌ای (زنگوله)", icon: "🔔", color: "#38bdf8" },
  sms: { fa: "پیامک خدماتی مستقیم (SMS)", icon: "📱", color: "#10b981" },
  urgent_banner: { fa: "بنر اعلان اضطراری بالای سایت", icon: "🚨", color: "#ef4444" },
  email: { fa: "ایمیل اطلاع‌رسانی (Newsletter)", icon: "✉️", color: "#a855f7" },
};

export const PRIORITY_LABELS: Record<BroadcastPriority, { fa: string; color: string; badgeClass: string }> = {
  normal: { fa: "عادی و اطلاع‌رسانی", color: "#3b82f6", badgeClass: "priorityNormal" },
  important: { fa: "مهم و اولویت‌دار", color: "#f59e0b", badgeClass: "priorityImportant" },
  critical: { fa: "بحرانی و اضطراری", color: "#ef4444", badgeClass: "priorityCritical" },
};

export const INITIAL_AUDIENCE_SEGMENTS: AudienceSegment[] = [
  {
    key: "all_users",
    label: "همه کاربران پلتفرم",
    description: "تمامی کاربران ثبت‌نام شده اعم از دانش‌آموزان، مدرسان و متقاضیان",
    estimatedCount: 28450,
    availableChannels: ["in_app", "sms", "urgent_banner", "email"],
  },
  {
    key: "active_students",
    label: "زبان‌آموزان فعال روزانه (Daily Active)",
    description: "کاربرانی که در ۲۴ ساعت گذشته حداقل یک درس، تمرین یا کوییز را تکمیل کرده‌اند",
    estimatedCount: 1420,
    availableChannels: ["in_app", "sms", "email"],
  },
  {
    key: "inactive_students_7d",
    label: "زبان‌آموزان در معرض ریزش (غیرفعال ۷ روز+)",
    description: "دانش‌آموزانی که ثبت‌نام کرده‌اند اما در یک هفته اخیر هیچ فعالیتی نداشته‌اند",
    estimatedCount: 380,
    availableChannels: ["in_app", "sms", "email"],
  },
  {
    key: "verified_teachers",
    label: "اساتید و مدرسان تایید صلاحیت شده",
    description: "مدرسان رسمی دارای نشان تایید ایندورا و کلاس‌های فعال",
    estimatedCount: 38,
    availableChannels: ["in_app", "sms", "email"],
  },
  {
    key: "abandoned_cart_users",
    label: "کاربران دارای سبد خرید رهاشده",
    description: "افرادی که به صفحه پرداخت رفته‌اند اما تراکنش را نهایی نکرده‌اند",
    estimatedCount: 45,
    availableChannels: ["in_app", "sms"],
  },
];

export const INITIAL_BROADCAST_TEMPLATES: BroadcastTemplate[] = [
  {
    id: "tpl-sale-launch",
    title: "آغاز جشنواره فروش شگفت‌انگیز",
    category: "promotional",
    channels: ["in_app", "sms", "urgent_banner"],
    priority: "important",
    defaultTitle: "جشنواره بزرگ پاییزه ایندورا آغاز شد! ۴۰٪ تخفیف",
    defaultBody: "کلیه پکیج‌های مسترکلاس آیلتس و کنکور با کد تخفیف FALL40 به مدت ۴۸ ساعت در دسترس هستند.",
    defaultCtaText: "مشاهده و ثبت‌نام دوره‌ها",
    defaultCtaUrl: "/courses",
  },
  {
    id: "tpl-live-webinar",
    title: "یادآوری شروع وبینار یا کلاس زنده",
    category: "academic",
    channels: ["in_app", "sms"],
    priority: "important",
    defaultTitle: "کلاس زنده اسپیکینگ آیلتس تا ۱۵ دقیقه دیگر آغاز می‌شود",
    defaultBody: "استاد منتظر حضور شماست! لطفاً میکروفون و هدست خود را آماده کرده و وارد اتاق شوید.",
    defaultCtaText: "ورود به کلاس زنده",
    defaultCtaUrl: "/teacher/classes/live",
  },
  {
    id: "tpl-leitner-retention",
    title: "تلنگر مطالعه و مرور لایتنر هفتگی",
    category: "retention",
    channels: ["in_app", "sms"],
    priority: "normal",
    defaultTitle: "جعبه لایتنر شما منتظر مرور کلمات جدید است!",
    defaultBody: "تنها ۱۰ دقیقه تمرین امروز، ماندگاری لغات سطح B2 شما را تا ۳ برابر افزایش می‌دهد.",
    defaultCtaText: "مرور ۱۰ کلمه طلایی",
    defaultCtaUrl: "/leitner",
  },
  {
    id: "tpl-system-maintenance",
    title: "اطلاعیه به‌روزرسانی و ارتقای سرور",
    category: "system",
    channels: ["in_app", "urgent_banner"],
    priority: "critical",
    defaultTitle: "عملیات ارتقای هسته پردازش هوش مصنوعی ساعت ۲ بامداد",
    defaultBody: "به جهت بهبود سرعت تصحیح اسپیکینگ، پلتفرم امشب به مدت ۲۰ دقیقه در دسترس نخواهد بود.",
    defaultCtaText: "جزئیات به‌روزرسانی",
    defaultCtaUrl: "/support",
  },
];

export const INITIAL_BROADCAST_CAMPAIGNS: BroadcastCampaign[] = [
  {
    id: "camp-001",
    title: "رونمایی از آزمایشگاه پیشرفته تلفظ و لهجه (Street Vibe)",
    body: "ویژگی جدید تمرین اصطلاحات خیابانی و تحلیل لهجه بومی فعال شد. همین حالا تست کنید!",
    ctaText: "ورود به آزمایشگاه تلفظ",
    ctaUrl: "/skills/streetvibe/validate",
    channels: ["in_app", "sms", "urgent_banner"],
    priority: "important",
    targetSegment: "all_users",
    targetSegmentLabel: "همه کاربران پلتفرم",
    estimatedRecipients: 28450,
    actualDeliveredCount: 27980,
    deliveryRatePercent: 98.3,
    status: "completed",
    sentAt: "2026-11-14T10:00:00Z",
    createdBy: "مدیر ارشد ایندورا",
    isTestSentToAdmin: true,
    createdAt: "2026-11-14T09:30:00Z",
  },
  {
    id: "camp-002",
    title: "یادآوری تمرین نهایی دوازدهم تا بیست (ویژن ۳)",
    body: "امتحان نهایی نزدیک است! حل نمونه سوالات درس اول و دوم با پاسخ تشریحی هم‌اکنون در دسترس است.",
    ctaText: "حل سوالات تمرین ۲۰",
    ctaUrl: "/high-school/grade-12/tamrin20",
    channels: ["in_app", "sms"],
    priority: "normal",
    targetSegment: "active_students",
    targetSegmentLabel: "زبان‌آموزان فعال روزانه",
    estimatedRecipients: 1420,
    actualDeliveredCount: 1405,
    deliveryRatePercent: 98.9,
    status: "completed",
    sentAt: "2026-11-15T08:30:00Z",
    createdBy: "مدیر آموزش دبیرستان",
    isTestSentToAdmin: true,
    createdAt: "2026-11-15T08:00:00Z",
  },
  {
    id: "camp-003",
    title: "جلسه هم‌اندیشی و هماهنگی اساتید آیلتس ماه آذر",
    body: "اساتید محترم، جلسه آنلاین بررسی معیارهای جدید نمره‌دهی رایتینگ فردا ساعت ۱۸ برگزار می‌گردد.",
    ctaText: "لینک اتاق وبینار اساتید",
    ctaUrl: "/teacher/classes",
    channels: ["in_app", "sms", "email"],
    priority: "important",
    targetSegment: "verified_teachers",
    targetSegmentLabel: "اساتید تایید صلاحیت شده",
    estimatedRecipients: 38,
    actualDeliveredCount: 0,
    deliveryRatePercent: 0,
    status: "scheduled",
    scheduledFor: "2026-11-16T14:30:00Z",
    createdBy: "مدیر دپارتمان زبان",
    isTestSentToAdmin: true,
    createdAt: "2026-11-15T12:00:00Z",
  },
];
