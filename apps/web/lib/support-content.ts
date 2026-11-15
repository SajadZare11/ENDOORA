export type TicketPriority = "low" | "medium" | "high" | "critical";

export type TicketCategory =
  | "payments"
  | "account"
  | "security"
  | "courses"
  | "technical"
  | "community"
  | "other";

export type TicketStatus =
  | "new"
  | "in_progress"
  | "ai_answered"
  | "escalated"
  | "resolved"
  | "closed";

export interface TicketMessage {
  id: string;
  senderType: "user" | "ai_agent" | "staff" | "internal_note";
  senderName: string;
  body: string;
  createdAt: string;
  isInternalNote?: boolean;
}

export interface AdminSupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  category: TicketCategory;
  priority: TicketPriority;
  title: string;
  description: string;
  status: TicketStatus;
  assignedStaffEmail?: string;
  escalatedToHuman: boolean;
  aiSuggestedReply?: string;
  messages: TicketMessage[];
  csatRating?: number; // 1 to 5
  csatFeedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CannedResponseTemplate {
  id: string;
  title: string;
  category: TicketCategory;
  shortcutCode: string;
  bodyTemplate: string;
}

export type FeedbackType = "bug_report" | "feature_request" | "general_praise" | "complaint";

export type FeedbackStatus = "new" | "under_review" | "resolved" | "archived";

export interface UserFeedbackItem {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  type: FeedbackType;
  rating: number; // 1 to 5
  pageUrl: string;
  message: string;
  status: FeedbackStatus;
  adminResponseNote?: string;
  createdAt: string;
}

export interface SupportHelpdeskStats {
  openTicketsCount: number;
  criticalTicketsCount: number;
  averageResponseTimeMinutes: number;
  csatAverageScore: number;
  totalFeedbacksCount: number;
  resolvedTicketsCount: number;
}

export const TICKET_CATEGORY_LABELS: Record<TicketCategory, string> = {
  payments: "امور مالی و پرداخت‌ها",
  account: "حساب کاربری و احراز هویت",
  security: "امنیت، گذرواژه و نشست‌ها",
  courses: "دوره‌ها و برنامه‌های آموزشی",
  technical: "مشکلات فنی سرور و پخش ویدیو",
  community: "تالار گفتگو و تعاملات",
  other: "سایر موارد و پیشنهادات",
};

export const TICKET_PRIORITY_LABELS: Record<
  TicketPriority,
  { labelFa: string; color: string; bgColor: string }
> = {
  critical: { labelFa: "بحرانی (فوریت آنی)", color: "#991b1b", bgColor: "#fee2e2" },
  high: { labelFa: "بالا (ضروری)", color: "#b45309", bgColor: "#fef3c7" },
  medium: { labelFa: "متوسط (عادی)", color: "#1d4ed8", bgColor: "#eff6ff" },
  low: { labelFa: "پایین (جهت اطلاع)", color: "#475569", bgColor: "#f1f5f9" },
};

export const TICKET_STATUS_LABELS: Record<
  TicketStatus,
  { labelFa: string; color: string; bgColor: string }
> = {
  new: { labelFa: "جدید (در انتظار پاسخ)", color: "#1d4ed8", bgColor: "#eff6ff" },
  in_progress: { labelFa: "در حال بررسی کارشناس", color: "#b45309", bgColor: "#fef3c7" },
  ai_answered: { labelFa: "پاسخ اولیه هوش مصنوعی", color: "#6d28d9", bgColor: "#f5f3ff" },
  escalated: { labelFa: "ارجاع‌شده به کارشناس ارشد", color: "#b91c1c", bgColor: "#fee2e2" },
  resolved: { labelFa: "حل‌شده و پاسخ‌داده‌شده", color: "#047857", bgColor: "#ecfdf5" },
  closed: { labelFa: "بسته‌شده و مختومه", color: "#475569", bgColor: "#f1f5f9" },
};

export function replaceTemplateVariables(
  template: string,
  variables: { userName?: string; ticketId?: string; staffName?: string }
): string {
  let result = template;
  if (variables.userName) {
    result = result.replace(/{نام}/g, variables.userName);
    result = result.replace(/{نام کاربر}/g, variables.userName);
  }
  if (variables.ticketId) {
    result = result.replace(/{کد تیکت}/g, variables.ticketId);
  }
  if (variables.staffName) {
    result = result.replace(/{نام کارشناس}/g, variables.staffName);
  }
  return result;
}

export const INITIAL_CANNED_TEMPLATES: CannedResponseTemplate[] = [
  {
    id: "cn-001",
    title: "تایید رفع مشکل پرداخت و شارژ کیف پول",
    category: "payments",
    shortcutCode: "/payment_fixed",
    bodyTemplate:
      "سلام {نام} عزیز،\nبا پیگیری کارشناسان مالی ایندورا، تراکنش بانکی شما استعلام و موجودی معادل فوراً به کیف پول کاربری شما اضافه گردید. از صبوری شما سپاسگزاریم.",
  },
  {
    id: "cn-002",
    title: "راهنمایی شروع تعیین سطح هوشمند",
    category: "courses",
    shortcutCode: "/placement_guide",
    bodyTemplate:
      "سلام {نام} گرامی،\nبرای شروع ارزیابی جامع، به صفحه «تعیین سطح» مراجعه کرده و آزمون تطبیقی را در محیطی آرام با هدفون آغاز نمایید. کارنامه تحلیلی شما بلافاصله صادر می‌شود.",
  },
  {
    id: "cn-003",
    title: "بررسی مدارک احراز هویت مدرسان",
    category: "account",
    shortcutCode: "/teacher_review",
    bodyTemplate:
      "همکار گرامی {نام} عزیز،\nمدارک بارگذاری‌شده شما در صف ارزیابی تخصصی دپارتمان جذب مدرسان قرار دارد و نتیجه ارزیابی حداکثر ظرف ۴۸ ساعت کاری به اطلاع شما خواهد رسید.",
  },
  {
    id: "cn-004",
    title: "راهکار رفع مشکل پخش ویدیوهای آموزشی",
    category: "technical",
    shortcutCode: "/video_fix",
    bodyTemplate:
      "سلام {نام} عزیز،\nجهت بهبود سرعت پخش ویدیو، لطفاً حافظه کش مرورگر را پاکسازی کرده و از به‌روز بودن مرورگر خود اطمینان حاصل فرمایید. در صورت استفاده از VPN آن را خاموش نمایید.",
  },
  {
    id: "cn-005",
    title: "استرداد وجه طبق ضوابط اسکرو",
    category: "payments",
    shortcutCode: "/escrow_refund",
    bodyTemplate:
      "سلام {نام} عزیز،\nپرونده عدم برگزاری جلسه در هیئت داوری بررسی شد و مبلغ ۱۰۰٪ کلاس به کیف پول کاربری شما عودت داده شد. می‌توانید برای جلسه بعدی مجدداً رزرو نمایید.",
  },
];

export const INITIAL_ADMIN_TICKETS: AdminSupportTicket[] = [
  {
    id: "tkt-101",
    userId: "usr-004",
    userName: "علی رضایی",
    userEmail: "ali.rezaei@gmail.com",
    userPhone: "09121234567",
    category: "payments",
    priority: "critical",
    title: "کسر مبلغ از حساب ولی عدم فعال‌سازی اشتراک طلایی",
    description: "مبلغ ۲۹۹ هزار تومان از حساب بنده کسر شد اما اشتراک هنوز به حالت فعال در نیامده است.",
    status: "escalated",
    assignedStaffEmail: "support.lead@endoora.ir",
    escalatedToHuman: true,
    aiSuggestedReply:
      "سلام علی عزیز، تراکنش شما بررسی شد و کد پیگیری در درگاه شاپرک تایید گردید. اشتراک طلایی ۱ ماهه شما به صورت دستی فعال شد و یک هفته اشتراک هدیه نیز بابت تاخیر به حسابتان منظور گردید.",
    messages: [
      {
        id: "msg-1",
        senderType: "user",
        senderName: "علی رضایی",
        body: "سلام، من اشتراک ۱ ماهه طلایی خریدم ولی پول کسر شد و اکانتم تمدید نشد. لطفا پیگیری کنید.",
        createdAt: "2026-11-14T10:15:00Z",
      },
      {
        id: "msg-2",
        senderType: "ai_agent",
        senderName: "دستیار هوشمند پشتیبانی ایندورا",
        body: "سلام علی عزیز، درخواست شما ثبت شد. در حال استعلام خودکار رسید بانکی از شاپرک هستیم. چنانچه مغایرتی وجود داشته باشد وجه ظرف ۷۲ ساعت توسط بانک مسترد می‌شود یا توسط کارشناس فعال خواهد شد.",
        createdAt: "2026-11-14T10:15:30Z",
      },
      {
        id: "msg-3",
        senderType: "user",
        senderName: "علی رضایی",
        body: "من کلاس دارم امروز، لطفا کارشناس انسانی بررسی کنه و سریعتر فعالش کنید.",
        createdAt: "2026-11-14T10:20:00Z",
      },
      {
        id: "msg-4",
        senderType: "internal_note",
        senderName: "مدیر مالی ارشد",
        body: "یادداشت محرمانه: شماره تراکنش بانکی TR-984210 تایید شد. شتاب مبلغ را به حساب واریز کرده. اشتراک باید دستی تمدید شود.",
        createdAt: "2026-11-14T10:35:00Z",
        isInternalNote: true,
      },
    ],
    csatRating: 5,
    csatFeedback: "پشتیبانی بسیار سریع و رسیدگی عالی بود.",
    createdAt: "2026-11-14T10:15:00Z",
    updatedAt: "2026-11-14T10:35:00Z",
  },
  {
    id: "tkt-102",
    userId: "usr-005",
    userName: "مریم احمدی",
    userEmail: "maryam.ahmadi@yahoo.com",
    userPhone: "09359876543",
    category: "courses",
    priority: "high",
    title: "عدم ثبت نمره تسک رایتینگ ۲ در پنل آزمون ماک آیلتس",
    description: "مقاله رایتینگ تسک ۲ را بارگذاری کردم اما تصحیح خودکار هوش مصنوعی متوقف مانده است.",
    status: "in_progress",
    assignedStaffEmail: "academic@endoora.ir",
    escalatedToHuman: true,
    aiSuggestedReply:
      "سلام مریم گرامی، صف ارزیابی پرامپت هوش مصنوعی مجدداً فعال گردید و گزارش نمره تحلیلی شما همراه با برآورد نمره باند ۷.۵ در پنل نتایج قرار گرفت.",
    messages: [
      {
        id: "msg-201",
        senderType: "user",
        senderName: "مریم احمدی",
        body: "رایتینگ من در وضعیت در حال تحلیل مانده و نمره‌ای ثبت نشده است.",
        createdAt: "2026-11-13T16:00:00Z",
      },
      {
        id: "msg-202",
        senderType: "staff",
        senderName: "کارشناس دپارتمان آیلتس",
        body: "سلام مریم عزیز، فایل متن رایتینگ شما به صف اولویت بالا منتقل شد و تا ساعتی دیگر کارنامه برای شما ارسال می‌شود.",
        createdAt: "2026-11-13T16:45:00Z",
      },
    ],
    createdAt: "2026-11-13T16:00:00Z",
    updatedAt: "2026-11-13T16:45:00Z",
  },
  {
    id: "tkt-103",
    userId: "usr-006",
    userName: "کامران کاظمی",
    userEmail: "kamran.kazemi@outlook.com",
    userPhone: "09124445566",
    category: "technical",
    priority: "medium",
    title: "خطای قطع صدای وب‌کم در اتاق کلاس زنده با استاد",
    description: "در میانه کلاس آنلاین صدای میکروفون قطع شد و نیاز به خروج و ورود مکرر بود.",
    status: "new",
    assignedStaffEmail: "tech@endoora.ir",
    escalatedToHuman: false,
    aiSuggestedReply:
      "سلام کامران عزیز، با بررسی لاگ سرور WebRTC مشخص شد مجوز مرورگر در دسترسی به میکروفون محدود شده بود. لطفا یکبار دسترسی سایت را ریست فرمایید.",
    messages: [
      {
        id: "msg-301",
        senderType: "user",
        senderName: "کامران کاظمی",
        body: "سلام، امروز در کلاس مکالمه مشکل اتصال صدا داشتم. لطفا بررسی کنید از سرور بوده یا اینترنت من.",
        createdAt: "2026-11-14T09:00:00Z",
      },
    ],
    createdAt: "2026-11-14T09:00:00Z",
    updatedAt: "2026-11-14T09:00:00Z",
  },
  {
    id: "tkt-104",
    userId: "usr-007",
    userName: "مهندس آرش شایگان",
    userEmail: "arash.shaygan@gmail.com",
    userPhone: "09127894561",
    category: "account",
    priority: "low",
    title: "درخواست تغییر شماره تماس حساب و آدرس ایمیل اصلی",
    description: "می‌خواهم شماره تلفن دریافت پیامک‌های ورود را تغییر دهم.",
    status: "resolved",
    assignedStaffEmail: "security@endoora.ir",
    escalatedToHuman: false,
    messages: [
      {
        id: "msg-401",
        senderType: "user",
        senderName: "مهندس آرش شایگان",
        body: "سلام، مایل به تغییر شماره تماس ثبت‌شده در سایت به شماره جدید شرکتی هستم.",
        createdAt: "2026-11-12T11:20:00Z",
      },
      {
        id: "msg-402",
        senderType: "staff",
        senderName: "پشتیبانی حساب کاربری",
        body: "سلام آقای شایگان، کد تایید دو مرحله‌ای به شماره پیشین ارسال و هویت شما تایید شد. شماره جدید در سیستم جایگزین گردید.",
        createdAt: "2026-11-12T11:40:00Z",
      },
    ],
    csatRating: 5,
    createdAt: "2026-11-12T11:20:00Z",
    updatedAt: "2026-11-12T11:40:00Z",
  },
  {
    id: "tkt-105",
    userId: "usr-008",
    userName: "نگار کریمی",
    userEmail: "negar.karimi@gmail.com",
    userPhone: "09129998877",
    category: "security",
    priority: "critical",
    title: "گزارش ورود مشکوک از آی‌پی ناشناس خارجی به حساب",
    description: "پیامک ورود با آی‌پی کشور آلمان دریافت کردم در صورتی که خودم وارد نشده بودم.",
    status: "in_progress",
    assignedStaffEmail: "security@endoora.ir",
    escalatedToHuman: true,
    aiSuggestedReply:
      "سلام نگار عزیز، تمامی نشست‌های فعال حساب شما از راه دور بسته شد و تغییر رمز عبور اجباری فعال گردید.",
    messages: [
      {
        id: "msg-501",
        senderType: "user",
        senderName: "نگار کریمی",
        body: "کمک کنید لطفا، پیامک لاگین اومده برام در حالی که من اصلا آنلاین نبودم!",
        createdAt: "2026-11-14T08:30:00Z",
      },
      {
        id: "msg-502",
        senderType: "internal_note",
        senderName: "کارشناس امنیت سایبری",
        body: "یادداشت محرمانه: آی‌پی ورودی مربوط به یک VPN دیتاسنتری بوده است. توکن‌های JWT کاربر باطل شد.",
        createdAt: "2026-11-14T08:45:00Z",
        isInternalNote: true,
      },
    ],
    createdAt: "2026-11-14T08:30:00Z",
    updatedAt: "2026-11-14T08:45:00Z",
  },
];

export const INITIAL_FEEDBACK_ITEMS: UserFeedbackItem[] = [
  {
    id: "fdb-001",
    userId: "usr-004",
    userName: "علی رضایی",
    userPhone: "09121234567",
    type: "feature_request",
    rating: 5,
    pageUrl: "/leitner",
    message: "جعبه لایتنر هوشمند فوق‌العاده است. لطفا امکان افزودن فایل صوتی دلخواه به فلش‌کارت‌ها را هم اضافه کنید.",
    status: "under_review",
    createdAt: "2026-11-13T14:20:00Z",
  },
  {
    id: "fdb-002",
    userId: "usr-005",
    userName: "مریم احمدی",
    userPhone: "09359876543",
    type: "bug_report",
    rating: 3,
    pageUrl: "/exam/take",
    message: "در حالت موبایل دکمه رفتن به سوال بعدی کمی زیر منوی ناوبری می‌افتد و لمس آن دشوار است.",
    status: "new",
    createdAt: "2026-11-14T11:00:00Z",
  },
  {
    id: "fdb-003",
    userId: "usr-009",
    userName: "دانیال زمانی",
    userPhone: "09192223344",
    type: "general_praise",
    rating: 5,
    pageUrl: "/high-school/grade-12/tamrin20",
    message: "پکیج تمرین تا ۲۰ دوازدهم نهایی عالی بود! با تمرین‌های ریدینگ نمره ۱۹.۵ گرفتم، تشکر از تیم ایندورا.",
    status: "resolved",
    adminResponseNote: "پاسخ تقدیرنامه برای کاربر ارسال شد.",
    createdAt: "2026-11-12T18:00:00Z",
  },
  {
    id: "fdb-004",
    userId: "usr-010",
    userName: "زهرا منصوری",
    userPhone: "09376665544",
    type: "complaint",
    rating: 2,
    pageUrl: "/teachers",
    message: "فیلتر قیمت در جستجوی اساتید بر اساس تومان کمی کُند کار می‌کند.",
    status: "resolved",
    adminResponseNote: "ایندکس دیتابیس بهینه‌سازی و سرعت فیلتر قیمت بهبود یافت.",
    createdAt: "2026-11-11T15:30:00Z",
  },
];

export const INITIAL_SUPPORT_STATS: SupportHelpdeskStats = {
  openTicketsCount: 3,
  criticalTicketsCount: 2,
  averageResponseTimeMinutes: 14,
  csatAverageScore: 4.8,
  totalFeedbacksCount: 4,
  resolvedTicketsCount: 2,
};
