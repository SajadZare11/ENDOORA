export type SessionRiskLevel = "low" | "medium" | "high" | "critical";

export interface LiveUserSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: "student" | "teacher" | "admin";
  ipAddress: string;
  location: string;
  deviceOs: string;
  browser: string;
  loginAt: string;
  lastActiveAt: string;
  currentRoute: string;
  riskLevel: SessionRiskLevel;
  riskReason?: string;
  isCurrentAdminSession?: boolean;
}

export type IpRuleType = "blacklist" | "whitelist" | "suspicious_flag";

export type AttackVectorType =
  | "brute_force_login"
  | "credential_stuffing"
  | "rate_limit_exceeded"
  | "sql_injection_attempt"
  | "malicious_crawler"
  | "manual_admin_ban"
  | "trusted_office_ip";

export interface IpFirewallRule {
  id: string;
  ipAddress: string;
  ruleType: IpRuleType;
  threatScore: number; // 1 to 100
  attackVector: AttackVectorType;
  reason: string;
  failedAttemptsCount: number;
  duration: "24_hours" | "7_days" | "permanent";
  expiresAt: string | null;
  createdAt: string;
  createdBy: string;
  status: "active" | "lifted";
}

export interface MaintenanceConfig {
  isMaintenanceActive: boolean;
  lockdownLevel: "maintenance_notice" | "strict_lockdown";
  headline: string;
  userMessage: string;
  estimatedEndTime: string;
  whitelistedAdminIps: string[];
  updatedAt: string;
  updatedBy: string;
}

export interface SecurityCommandStats {
  totalActiveSessions: number;
  suspiciousSessionsCount: number;
  activeBlockedIps: number;
  whitelistedIpsCount: number;
  attacksBlockedToday: number;
  isMaintenanceActive: boolean;
  avgThreatScore: number;
}

export const SESSION_RISK_LABELS: Record<SessionRiskLevel, { fa: string; color: string; badgeClass: string }> = {
  low: { fa: "عادی و امن", color: "#10b981", badgeClass: "riskLow" },
  medium: { fa: "متوسط (نیاز به پایش)", color: "#f59e0b", badgeClass: "riskMedium" },
  high: { fa: "پرخطر (رفتار مشکوک)", color: "#f97316", badgeClass: "riskHigh" },
  critical: { fa: "بحرانی (حمله یا نفوذ)", color: "#ef4444", badgeClass: "riskCritical" },
};

export const IP_RULE_TYPE_LABELS: Record<IpRuleType, { fa: string; color: string }> = {
  blacklist: { fa: "مسدود در فایروال (بلک‌لیست)", color: "#ef4444" },
  whitelist: { fa: "آدرس مجاز (وایت‌لیست)", color: "#10b981" },
  suspicious_flag: { fa: "تحت پایش و بازرسی (Flagged)", color: "#f59e0b" },
};

export const ATTACK_VECTOR_LABELS: Record<AttackVectorType, string> = {
  brute_force_login: "حمله حدس مکرر رمز عبور (Brute Force)",
  credential_stuffing: "تلاش با اطلاعات درزیافته (Credential Stuffing)",
  rate_limit_exceeded: "تخطی از سقف درخواست‌ها (DDoS Pattern)",
  sql_injection_attempt: "تلاش تزریق کد مخرب (SQL Injection)",
  malicious_crawler: "خزش مخرب و اسکرپ غیرمجاز (Bad Bot)",
  manual_admin_ban: "مسدودسازی دستی توسط مدیر ارشد",
  trusted_office_ip: "آدرس استاتیک دفتر مرکزی / مدیران مجاز",
};

export const DURATION_LABELS: Record<string, string> = {
  "24_hours": "۲۴ ساعت",
  "7_days": "۷ روز",
  permanent: "دائمی (تا لغو دستی)",
};

export const INITIAL_ACTIVE_SESSIONS: LiveUserSession[] = [
  {
    id: "sess-adm-001",
    userId: "usr-admin-master",
    userName: "مدیر ارشد ایندورا",
    userEmail: "admin@endoora.com",
    userRole: "admin",
    ipAddress: "5.200.14.88",
    location: "تهران، ایران",
    deviceOs: "Windows 11",
    browser: "Chrome 125",
    loginAt: "2026-11-15T08:15:00Z",
    lastActiveAt: "2026-11-15T12:45:00Z",
    currentRoute: "/admin?tab=security",
    riskLevel: "low",
    isCurrentAdminSession: true,
  },
  {
    id: "sess-stu-104",
    userId: "usr-stu-ali-reza",
    userName: "علیرضا رضایی",
    userEmail: "alireza.rezaei@gmail.com",
    userRole: "student",
    ipAddress: "178.252.189.44",
    location: "اصفهان، ایران",
    deviceOs: "Android 14",
    browser: "Chrome Mobile 125",
    loginAt: "2026-11-15T11:20:00Z",
    lastActiveAt: "2026-11-15T12:44:12Z",
    currentRoute: "/learn/ielts-band-7/module-3",
    riskLevel: "low",
  },
  {
    id: "sess-tea-202",
    userId: "usr-tea-sara-rad",
    userName: "استاد سارا رادمنش",
    userEmail: "sara.rad@endoora.com",
    userRole: "teacher",
    ipAddress: "2.180.95.12",
    location: "شیراز، ایران",
    deviceOs: "macOS Sonoma",
    browser: "Safari 17.4",
    loginAt: "2026-11-15T10:05:00Z",
    lastActiveAt: "2026-11-15T12:42:50Z",
    currentRoute: "/teacher/classes/live-room-c1",
    riskLevel: "low",
  },
  {
    id: "sess-stu-109",
    userId: "usr-stu-maryam-k",
    userName: "مریم کمالی",
    userEmail: "m.kamali99@yahoo.com",
    userRole: "student",
    ipAddress: "89.165.12.77",
    location: "مشهد، ایران",
    deviceOs: "iOS 17.5",
    browser: "Mobile Safari",
    loginAt: "2026-11-15T12:10:00Z",
    lastActiveAt: "2026-11-15T12:43:05Z",
    currentRoute: "/practice/shadowing-lab",
    riskLevel: "low",
  },
  {
    id: "sess-ano-881",
    userId: "usr-stu-farzad-b",
    userName: "فرزاد باقری",
    userEmail: "farzad.bagheri@gmail.com",
    userRole: "student",
    ipAddress: "194.26.29.130",
    location: "فرانکفورت، آلمان (VPN)",
    deviceOs: "Windows 10",
    browser: "Firefox 126",
    loginAt: "2026-11-15T12:30:00Z",
    lastActiveAt: "2026-11-15T12:44:55Z",
    currentRoute: "/courses/toefl-advanced/download-materials",
    riskLevel: "high",
    riskReason: "ورود همزمان با دو IP متفاوت (تهران و فرانکفورت) ظرف کمتر از ۵ دقیقه",
  },
  {
    id: "sess-ano-992",
    userId: "usr-unauth-probing",
    userName: "کاربر ناشناس (در حال احراز)",
    userEmail: "prober_bot98@tempmail.xyz",
    userRole: "student",
    ipAddress: "45.154.255.67",
    location: "آمستردام، هلند (Datacenter)",
    deviceOs: "Linux x86_64",
    browser: "HeadlessChrome",
    loginAt: "2026-11-15T12:38:00Z",
    lastActiveAt: "2026-11-15T12:41:10Z",
    currentRoute: "/api/auth/callback/credentials",
    riskLevel: "critical",
    riskReason: "شناسایی مرورگر رباتیک Headless و ارسال ۲۵ درخواست لاگین ظرف ۳۰ ثانیه",
  },
];

export const INITIAL_IP_FIREWALL_RULES: IpFirewallRule[] = [
  {
    id: "ip-rule-001",
    ipAddress: "45.154.255.67",
    ruleType: "blacklist",
    threatScore: 98,
    attackVector: "brute_force_login",
    reason: "حمله بروت‌فورس روی اندپوینت احراز هویت با بیش از ۳۰ پسورد اشتباه",
    failedAttemptsCount: 32,
    duration: "permanent",
    expiresAt: null,
    createdAt: "2026-11-15T12:41:30Z",
    createdBy: "سپر خودکار دفاعی (Threat Shield Bot)",
    status: "active",
  },
  {
    id: "ip-rule-002",
    ipAddress: "185.220.101.5",
    ruleType: "blacklist",
    threatScore: 92,
    attackVector: "sql_injection_attempt",
    reason: "ارسال پی‌لودهای مشکوک SQL Injection در فیلتر جستجوی مقالات",
    failedAttemptsCount: 8,
    duration: "7_days",
    expiresAt: "2026-11-22T10:00:00Z",
    createdAt: "2026-11-15T10:00:00Z",
    createdBy: "مدیر امنیت شبکه (سید احمد موسوی)",
    status: "active",
  },
  {
    id: "ip-rule-003",
    ipAddress: "103.145.13.201",
    ruleType: "blacklist",
    threatScore: 84,
    attackVector: "malicious_crawler",
    reason: "اسکرپ سنگین و دانلود غیرمجاز ویدیوهای آزمایشی با دور زدن محدودیت نرخ",
    failedAttemptsCount: 120,
    duration: "24_hours",
    expiresAt: "2026-11-16T04:30:00Z",
    createdAt: "2026-11-15T04:30:00Z",
    createdBy: "سپر خودکار دفاعی (Threat Shield Bot)",
    status: "active",
  },
  {
    id: "ip-rule-004",
    ipAddress: "194.26.29.130",
    ruleType: "suspicious_flag",
    threatScore: 68,
    attackVector: "credential_stuffing",
    reason: "استفاده از سرور پروکسی ناشناخته و ورودهای متوالی بدون ثبت نام",
    failedAttemptsCount: 4,
    duration: "24_hours",
    expiresAt: "2026-11-16T12:00:00Z",
    createdAt: "2026-11-15T12:00:00Z",
    createdBy: "سپر خودکار دفاعی (Threat Shield Bot)",
    status: "active",
  },
  {
    id: "ip-rule-005",
    ipAddress: "5.200.14.88",
    ruleType: "whitelist",
    threatScore: 1,
    attackVector: "trusted_office_ip",
    reason: "آدرس IP استاتیک و ایمن دفتر مرکزی آکادمی ایندورا",
    failedAttemptsCount: 0,
    duration: "permanent",
    expiresAt: null,
    createdAt: "2026-11-01T00:00:00Z",
    createdBy: "مدیر ارشد سیستم",
    status: "active",
  },
];

export const INITIAL_MAINTENANCE_CONFIG: MaintenanceConfig = {
  isMaintenanceActive: false,
  lockdownLevel: "maintenance_notice",
  headline: "به‌روزرسانی و ارتقای زیرساخت پلتفرم زبان ایندورا",
  userMessage:
    "کاربر گرامی، پلتفرم در حال انجام عملیات نگهداری دوره‌ای، ارتقای هسته پردازش هوش مصنوعی و بهینه‌سازی دیتابیس است. دسترسی تا دقایقی دیگر به حالت عادی بازخواهد گشت.",
  estimatedEndTime: "تا حدود ۳۰ دقیقه دیگر",
  whitelistedAdminIps: ["127.0.0.1", "::1", "192.168.1.100", "5.200.14.88"],
  updatedAt: "2026-11-15T08:00:00Z",
  updatedBy: "مدیر ارشد ایندورا",
};
