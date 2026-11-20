import { recordAuditLog } from "./admin-ops";

// ==============================================================================
// 1. Database Backup & SQL Query Studio Types
// ==============================================================================
export interface DatabaseBackupRecord {
  id: string;
  filename: string;
  format: "sql" | "json" | "schema_only";
  sizeMb: number;
  tablesCount: number;
  rowCount: number;
  status: "completed" | "in_progress" | "failed";
  storageLocation: "local_disk" | "arvan_s3" | "both";
  isAutomatic: boolean;
  createdAt: string;
  createdIso: string;
  createdBy: string;
  downloadUrl?: string;
  notes?: string;
}

export interface BackupPolicyConfig {
  autoBackupEnabled: boolean;
  scheduleFrequency: "daily" | "every_12h" | "weekly";
  preferredExecutionTime: string; // e.g. "03:00"
  retentionDays: number;
  syncToS3: boolean;
  s3Bucket: string;
  s3Prefix: string;
  notifyOnFailure: boolean;
  notificationTarget: string; // e.g. "SMS & Telegram"
}

export interface SqlQueryExecutionResult {
  query: string;
  isDryRun: boolean;
  executionTimeMs: number;
  affectedRows: number;
  columns: string[];
  rows: any[];
  error?: string;
}

// ==============================================================================
// 2. Incident & Error Streamer Types (Sentry-like)
// ==============================================================================
export type IncidentSeverity = "critical" | "warning" | "info";
export type IncidentStatus = "unresolved" | "investigating" | "resolved" | "ignored";

export interface ServerIncidentRecord {
  id: string;
  errorName: string;
  errorMessage: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  occurredCount: number;
  firstSeenAt: string;
  lastSeenAt: string;
  requestUrl: string;
  requestMethod: "GET" | "POST" | "PUT" | "DELETE";
  statusCode: number;
  clientIp: string;
  userId?: string;
  userEmail?: string;
  userAgent: string;
  requestPayload?: any;
  stackTrace: string[];
  retryable: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNote?: string;
}

// ==============================================================================
// 3. Background Task & Cron Engine Types
// ==============================================================================
export type TaskScheduleType = "every_15m" | "every_hour" | "every_6h" | "daily" | "weekly" | "custom_cron";

export interface BackgroundTaskRecord {
  id: string;
  titleFa: string;
  titleEn: string;
  descriptionFa: string;
  category: "backup" | "finance" | "auth" | "notifications" | "maintenance" | "custom";
  scheduleType: TaskScheduleType;
  cronExpression: string;
  isEnabled: boolean;
  lastRunAt: string;
  lastRunDurationMs: number;
  lastStatus: "success" | "failure" | "running";
  nextScheduledRun: string;
  targetEndpoint: string;
  totalRunCount: number;
  successRatePercent: number;
  lastOutputSummary?: string;
}

export interface TaskExecutionLog {
  id: string;
  taskId: string;
  taskTitleFa: string;
  triggeredBy: "cron_scheduler" | "manual_admin" | "system_event";
  startedAt: string;
  durationMs: number;
  status: "success" | "failure";
  output: string;
}

// ==============================================================================
// 4. Live Translation & UI String Dictionary Types
// ==============================================================================
export interface DictionaryItem {
  key: string;
  category: "general" | "auth" | "courses" | "checkout" | "errors" | "lms" | "marketing";
  faText: string;
  enText: string;
  lastUpdatedAt: string;
  updatedBy: string;
  isCustom?: boolean;
}

// ==============================================================================
// Initial In-Memory State
// ==============================================================================

export const INITIAL_BACKUPS: DatabaseBackupRecord[] = [
  {
    id: "bkp_20261120_0300",
    filename: "endoora_db_full_20261120_030000.sql",
    format: "sql",
    sizeMb: 84.5,
    tablesCount: 28,
    rowCount: 142850,
    status: "completed",
    storageLocation: "both",
    isAutomatic: true,
    createdAt: "1403/08/20 03:00",
    createdIso: "2026-11-20T03:00:00Z",
    createdBy: "کران‌جاب پشتیبان‌گیری شبانه",
    notes: "پشتیبان‌گیری خودکار روزانه کلاستر اصلی دیتابیس",
  },
  {
    id: "bkp_20261119_0300",
    filename: "endoora_db_full_20261119_030000.sql",
    format: "sql",
    sizeMb: 83.9,
    tablesCount: 28,
    rowCount: 141200,
    status: "completed",
    storageLocation: "both",
    isAutomatic: true,
    createdAt: "1403/08/19 03:00",
    createdIso: "2026-11-19T03:00:00Z",
    createdBy: "کران‌جاب پشتیبان‌گیری شبانه",
    notes: "اسنپ‌شات معتبر پیش از استقرار نسخه جدید",
  },
  {
    id: "bkp_20261118_1845",
    filename: "endoora_db_manual_20261118_184512.json",
    format: "json",
    sizeMb: 36.2,
    tablesCount: 14,
    rowCount: 68400,
    status: "completed",
    storageLocation: "local_disk",
    isAutomatic: false,
    createdAt: "1403/08/18 18:45",
    createdIso: "2026-11-18T18:45:12Z",
    createdBy: "مدیر ارشد ایندورا",
    notes: "اسنپ‌شات دستی داده‌های کاربری و دوره‌ها پیش از تغییر تخفیفات",
  },
];

export const INITIAL_BACKUP_POLICY: BackupPolicyConfig = {
  autoBackupEnabled: true,
  scheduleFrequency: "daily",
  preferredExecutionTime: "03:00",
  retentionDays: 14,
  syncToS3: true,
  s3Bucket: "endoora-media-vault",
  s3Prefix: "db-backups/daily/",
  notifyOnFailure: true,
  notificationTarget: "09121111111 (پیامک) و بات تلگرام SOC",
};

export const INITIAL_INCIDENTS: ServerIncidentRecord[] = [
  {
    id: "inc-001",
    errorName: "ZarinpalGatewayTimeoutException",
    errorMessage: "خطای تاخیر پاسخگویی از درگاه پرداخت زرین‌پال / شاپرک در تایید تراکنش #tx_9814",
    severity: "critical",
    status: "unresolved",
    occurredCount: 3,
    firstSeenAt: "۱۴۰۳/۰۸/۲۰ ۱۴:۱۰",
    lastSeenAt: "۱۴۰۳/۰۸/۲۰ ۱۵:۴۵",
    requestUrl: "/api/checkout/verify",
    requestMethod: "POST",
    statusCode: 504,
    clientIp: "5.127.42.18",
    userId: "usr_04",
    userEmail: "niloofar.karimi@example.com",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X)",
    requestPayload: { authority: "A00000000000000000000000000481729", amount: 790000, courseId: "crs_02" },
    stackTrace: [
      "Error: Zarinpal Gateway connection timed out after 10000ms",
      "    at ZarinpalClient.verifyTransaction (lib/payments/zarinpal.ts:142:15)",
      "    at POST (app/api/checkout/verify/route.ts:58:24)",
      "    at async NextEdgeRuntime.handleRequest (node_modules/next/server/base-server.js:410:12)",
    ],
    retryable: true,
  },
  {
    id: "inc-002",
    errorName: "GeminiQuotaExceededRateLimit",
    errorMessage: "محدودیت نرخ توکن در دقیقه (TPM) در مدل هوش مصنوعی برای تولید سوال هوشمند آزمونک",
    severity: "warning",
    status: "investigating",
    occurredCount: 14,
    firstSeenAt: "۱۴۰۳/۰۸/۲۰ ۱۱:۳۰",
    lastSeenAt: "۱۴۰۳/۰۸/۲۰ ۱۲:۱۵",
    requestUrl: "/api/admin/academics/ai-quiz",
    requestMethod: "POST",
    statusCode: 429,
    clientIp: "192.168.1.1",
    userId: "usr_05",
    userEmail: "admin@endoora.ir",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0",
    requestPayload: { topic: "IELTS Speaking Part 2 Cue Card", count: 5 },
    stackTrace: [
      "GoogleGenerativeAIError: [429 Too Many Requests] Resource has been exhausted (e.g. check quota).",
      "    at generateQuiz (lib/gemini.ts:89:12)",
      "    at POST (app/api/admin/academics/ai-quiz/route.ts:24:30)",
    ],
    retryable: true,
  },
  {
    id: "inc-003",
    errorName: "AudioGopWorkerDegraded",
    errorMessage: "تاخیر بیش از حد پردازش فایل صوتی در ماژول تلفظ ONNX Acoustic GOP",
    severity: "info",
    status: "resolved",
    occurredCount: 1,
    firstSeenAt: "۱۴۰۳/۰۸/۱۹ ۱۶:۲۰",
    lastSeenAt: "۱۴۰۳/۰۸/۱۹ ۱۶:۲۰",
    requestUrl: "/api/evaluations/phoneme-score",
    requestMethod: "POST",
    statusCode: 200,
    clientIp: "94.182.88.10",
    userId: "usr_01",
    userEmail: "sara.mohammadi@example.com",
    userAgent: "Mozilla/5.0 (Android 14; Mobile)",
    stackTrace: [
      "WorkerLog: High CPU load during ONNX audio matrix transformation (1420ms duration)",
      "    at scoreSpeech (services/acoustic.py:210)",
    ],
    retryable: false,
    resolvedAt: "۱۴۰۳/۰۸/۱۹ ۱۷:۰۰",
    resolvedBy: "مدیر ارشد ایندورا",
    resolutionNote: "تخصیص هسته پردازشی اختصاصی و ریست وورکر ONNX انجام گردید.",
  },
];

export const INITIAL_TASKS: BackgroundTaskRecord[] = [
  {
    id: "task_backup_nightly",
    titleFa: "پشتیبان‌گیری خودکار شبانه و همگام‌سازی ابری S3",
    titleEn: "Nightly Automated DB Dump & S3 Mirroring",
    descriptionFa: "تولید فایل پشتیبان کامل PostgreSQL، فشرده‌سازی با GZIP و ارسال به سطل ابری امن ابر آروان",
    category: "backup",
    scheduleType: "daily",
    cronExpression: "0 3 * * *",
    isEnabled: true,
    lastRunAt: "۱۴۰۳/۰۸/۲۰ ۰۳:۰۰",
    lastRunDurationMs: 4200,
    lastStatus: "success",
    nextScheduledRun: "فردا ساعت ۰۳:۰۰ بامداد",
    targetEndpoint: "/api/admin/autonomous-ops/backups/trigger",
    totalRunCount: 124,
    successRatePercent: 99.2,
    lastOutputSummary: "اسنپ‌شات ۸۴.۵ مگابایتی تولید و به باکت endoora-media-vault ارسال شد.",
  },
  {
    id: "task_teacher_settlement",
    titleFa: "محاسبه تسویه حساب و کارمزد هفتگی اساتید",
    titleEn: "Weekly Teacher Commission Settlement Calculation",
    descriptionFa: "بررسی دوره‌های خریداری شده، کسر سهم پلتفرم و ثبت اسناد آماده به واریز در خزانه‌داری",
    category: "finance",
    scheduleType: "weekly",
    cronExpression: "0 0 * * 5",
    isEnabled: true,
    lastRunAt: "۱۴۰۳/۰۸/۱۸ ۰۰:۰۰",
    lastRunDurationMs: 1850,
    lastStatus: "success",
    nextScheduledRun: "جمعه آینده ساعت ۰۰:۰۰",
    targetEndpoint: "/api/admin/treasury/calculate-commissions",
    totalRunCount: 18,
    successRatePercent: 100,
    lastOutputSummary: "تعداد ۱۴ مدرس محاسبه گردید و مبلغ ۴۲,۵۰۰,۰۰۰ تومان سند پایا ایجاد شد.",
  },
  {
    id: "task_session_cleanup",
    titleFa: "پاکسازی توکن‌ها و نشست‌های منقضی‌شده کاربران",
    titleEn: "Expired Sessions & Refresh Tokens Purge",
    descriptionFa: "حذف سشن‌های غیرفعال بیش از ۳۰ روز و آزادسازی حافظه ایندکس دیتابیس و ردیس",
    category: "auth",
    scheduleType: "daily",
    cronExpression: "0 4 * * *",
    isEnabled: true,
    lastRunAt: "۱۴۰۳/۰۸/۲۰ ۰۴:۰۰",
    lastRunDurationMs: 310,
    lastStatus: "success",
    nextScheduledRun: "فردا ساعت ۰۴:۰۰ بامداد",
    targetEndpoint: "/api/admin/system/purge-expired-sessions",
    totalRunCount: 124,
    successRatePercent: 100,
    lastOutputSummary: "تعداد ۴۱۸ توکن منقضی شده با موفقیت از پایگاه داده پاکسازی شد.",
  },
  {
    id: "task_learner_reminders",
    titleFa: "ارسال پیامک یادآوری آزمونک‌های معوقه زبان‌آموزان",
    titleEn: "Student Incomplete Lesson & Quiz Reminder SMS",
    descriptionFa: "استعلام زبان‌آموزانی که در آزمونک‌های دوره‌های فعال خود بیش از ۴ روز وقفه داشته‌اند و ارسال پیامک تشویقی",
    category: "notifications",
    scheduleType: "daily",
    cronExpression: "0 18 * * *",
    isEnabled: true,
    lastRunAt: "۱۴۰۳/۰۸/۱۹ ۱۸:۰۰",
    lastRunDurationMs: 2400,
    lastStatus: "success",
    nextScheduledRun: "امروز ساعت ۱۸:۰۰",
    targetEndpoint: "/api/admin/broadcast/send-reminders",
    totalRunCount: 85,
    successRatePercent: 98.8,
    lastOutputSummary: "تعداد ۶۲ پیامک یادآوری با موفقیت از طریق کاوه‌نگار ارسال گردید.",
  },
  {
    id: "task_cache_cleanup",
    titleFa: "پاکسازی فایل‌های چندرسانه‌ای موقت و لاگ‌های زائد",
    titleEn: "Temp Media & Stale S3 Uploads Garbage Collector",
    descriptionFa: "حذف وویس‌های ضبط شده ناموفق، فایل‌های آزمایشی و لاگ‌های ممیزی قدیمی‌تر از ۹۰ روز",
    category: "maintenance",
    scheduleType: "weekly",
    cronExpression: "0 2 * * 6",
    isEnabled: true,
    lastRunAt: "۱۴۰۳/۰۸/۱۹ ۰۲:۰۰",
    lastRunDurationMs: 5120,
    lastStatus: "success",
    nextScheduledRun: "شنبه آینده ساعت ۰۲:۰۰",
    targetEndpoint: "/api/admin/storage/cleanup-orphaned",
    totalRunCount: 16,
    successRatePercent: 100,
    lastOutputSummary: "حجم ۱.۲ گیگابایت فضای موقت ذخیره‌سازی با موفقیت آزادسازی شد.",
  },
];

export const INITIAL_DICTIONARY: DictionaryItem[] = [
  { key: "site_title", category: "general", faText: "ایندورا | آکادمی هوشمند زبان انگلیسی و آیلتس", enText: "Endoora | Smart English & IELTS Academy", lastUpdatedAt: "1403/08/20", updatedBy: "مدیر ارشد" },
  { key: "cta_enroll_now", category: "general", faText: "ثبت‌نام و شروع یادگیری", enText: "Enroll & Start Learning", lastUpdatedAt: "1403/08/20", updatedBy: "مدیر ارشد" },
  { key: "cta_free_placement", category: "general", faText: "تعیین سطح رایگان با هوش مصنوعی", enText: "Free AI Placement Test", lastUpdatedAt: "1403/08/18", updatedBy: "مدیر ارشد" },
  { key: "auth_login_title", category: "auth", faText: "ورود به حساب کاربری ایندورا", enText: "Sign in to Endoora Account", lastUpdatedAt: "1403/08/15", updatedBy: "مدیر ارشد" },
  { key: "auth_otp_sent", category: "auth", faText: "کد تایید ۵ رقمی به شماره شما پیامک شد", enText: "5-digit verification code sent via SMS", lastUpdatedAt: "1403/08/15", updatedBy: "مدیر ارشد" },
  { key: "checkout_guarantee_badge", category: "checkout", faText: "گارانتی بازگشت ۱۰۰٪ وجه در صورت عدم رضایت تا ۷ روز", enText: "100% 7-day Money Back Satisfaction Guarantee", lastUpdatedAt: "1403/08/19", updatedBy: "مدیر ارشد" },
  { key: "checkout_pay_button", category: "checkout", faText: "اتصال امن به درگاه شاپرک و پرداخت", enText: "Secure Checkout with Shaparak", lastUpdatedAt: "1403/08/19", updatedBy: "مدیر ارشد" },
  { key: "error_payment_failed", category: "errors", faText: "تراکنش توسط کاربر لغو شد یا با خطا مواجه گردید. وجهی از حساب کسر نشده است.", enText: "Payment was cancelled or failed. No funds deducted.", lastUpdatedAt: "1403/08/18", updatedBy: "مدیر ارشد" },
  { key: "error_network_offline", category: "errors", faText: "اتصال اینترنت شما قطع است. لطفاً وضعیت شبکه را بررسی کنید.", enText: "You are offline. Please check your internet connection.", lastUpdatedAt: "1403/08/18", updatedBy: "مدیر ارشد" },
  { key: "lms_quiz_passed", category: "lms", faText: "تبریک! شما این آزمونک را با نمره عالی با موفقیت پشت سر گذاشتید.", enText: "Congratulations! You passed this quiz with an excellent score.", lastUpdatedAt: "1403/08/20", updatedBy: "مدیر ارشد" },
  { key: "lms_audio_recording", category: "lms", faText: "در حال ضبط پاسخ صوتی... واضح و رسا صحبت کنید", enText: "Recording audio response... Speak clearly", lastUpdatedAt: "1403/08/19", updatedBy: "مدیر ارشد" },
];

let memoryBackups = [...INITIAL_BACKUPS];
let memoryPolicy = { ...INITIAL_BACKUP_POLICY };
let memoryIncidents = [...INITIAL_INCIDENTS];
let memoryTasks = [...INITIAL_TASKS];
let memoryTaskLogs: TaskExecutionLog[] = [
  { id: "log-1", taskId: "task_backup_nightly", taskTitleFa: "پشتیبان‌گیری خودکار شبانه", triggeredBy: "cron_scheduler", startedAt: "۱۴۰۳/۰۸/۲۰ ۰۳:۰۰", durationMs: 4200, status: "success", output: "بکاپ با موفقیت ایجاد و به S3 منتقل شد." },
  { id: "log-2", taskId: "task_session_cleanup", taskTitleFa: "پاکسازی توکن‌های منقضی‌شده", triggeredBy: "cron_scheduler", startedAt: "۱۴۰۳/۰۸/۲۰ ۰۴:۰۰", durationMs: 310, status: "success", output: "تعداد ۴۱۸ توکن پاکسازی شد." },
];
let memoryDictionary = [...INITIAL_DICTIONARY];

// ==============================================================================
// Store Handlers
// ==============================================================================

// 1. Backups
export function getBackupsList() {
  return {
    backups: [...memoryBackups],
    policy: { ...memoryPolicy },
  };
}

export function createDatabaseBackup(
  format: "sql" | "json" | "schema_only" = "sql",
  notes = "",
  adminUser = "مدیر ارشد ایندورا"
): { success: boolean; backup: DatabaseBackupRecord } {
  const timestamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
  const ext = format === "json" ? "json" : "sql";
  const newBackup: DatabaseBackupRecord = {
    id: `bkp_${timestamp}`,
    filename: `endoora_db_${format}_${timestamp}.${ext}`,
    format,
    sizeMb: Math.round((78 + Math.random() * 12) * 10) / 10,
    tablesCount: format === "schema_only" ? 28 : 28,
    rowCount: format === "schema_only" ? 0 : 143200,
    status: "completed",
    storageLocation: memoryPolicy.syncToS3 ? "both" : "local_disk",
    isAutomatic: false,
    createdAt: new Date().toLocaleString("fa-IR"),
    createdIso: new Date().toISOString(),
    createdBy: adminUser,
    notes: notes || "پشتیبان‌گیری دستی توسط مدیر ارشد از طریق پنل گاد مود",
    downloadUrl: `/api/admin/autonomous-ops/backups?downloadId=bkp_${timestamp}`,
  };

  memoryBackups.unshift(newBackup);

  recordAuditLog({
    actor_id: null,
    actor_email: adminUser,
    actor_role: "administrator",
    action: "create",
    target_app: "database_backup_studio",
    target_model: "DatabaseBackupRecord",
    target_pk: newBackup.id,
    before_summary: {},
    after_summary: { filename: newBackup.filename, sizeMb: newBackup.sizeMb, format },
    reason: "ایجاد اسنپ‌شات دستی دیتابیس توسط مدیر",
    request_method: "POST",
    request_path: "/api/admin/autonomous-ops/backups",
    environment: "production",
  });

  return { success: true, backup: newBackup };
}

export function restoreDatabaseBackup(
  backupId: string,
  adminUser = "مدیر ارشد ایندورا"
): { success: boolean; message: string } {
  const match = memoryBackups.find((b) => b.id === backupId);
  if (!match) return { success: false, message: "فایل پشتیبان مورد نظر یافت نشد." };

  recordAuditLog({
    actor_id: null,
    actor_email: adminUser,
    actor_role: "administrator",
    action: "update",
    target_app: "database_backup_studio",
    target_model: "DatabaseBackupRecord",
    target_pk: backupId,
    before_summary: { currentStatus: "online" },
    after_summary: { restoredFrom: match.filename, restoredAt: new Date().toISOString() },
    reason: `بازگردانی کامل پایگاه داده به وضعیت اسنپ‌شات ${match.filename}`,
    request_method: "POST",
    request_path: "/api/admin/autonomous-ops/backups/restore",
    environment: "production",
  });

  return {
    success: true,
    message: `پایگاه داده با موفقیت به اسنپ‌شات ${match.filename} بازگردانی شد. تمامی جداول بازیابی گردیدند.`,
  };
}

export function updateBackupPolicy(
  policyUpdates: Partial<BackupPolicyConfig>,
  adminUser = "مدیر ارشد ایندورا"
) {
  memoryPolicy = { ...memoryPolicy, ...policyUpdates };

  recordAuditLog({
    actor_id: null,
    actor_email: adminUser,
    actor_role: "administrator",
    action: "update",
    target_app: "database_backup_studio",
    target_model: "BackupPolicyConfig",
    target_pk: "active_policy",
    before_summary: {},
    after_summary: memoryPolicy,
    reason: "به‌روزرسانی خط‌مشی پشتیبان‌گیری خودکار و فضای S3",
    request_method: "POST",
    request_path: "/api/admin/autonomous-ops/backups/policy",
    environment: "production",
  });

  return { success: true, policy: memoryPolicy };
}

export function executeSafeSqlQuery(
  query: string,
  isDryRun = true,
  adminUser = "مدیر ارشد ایندورا"
): SqlQueryExecutionResult {
  const clean = query.trim();
  const isSelect = clean.toLowerCase().startsWith("select");
  const isExplain = clean.toLowerCase().startsWith("explain");

  // Sample mock query executor
  if (!isSelect && !isExplain && isDryRun) {
    return {
      query: clean,
      isDryRun: true,
      executionTimeMs: 12,
      affectedRows: 4,
      columns: ["transaction_status", "simulated_affected_rows", "dry_run_safety"],
      rows: [
        {
          transaction_status: "ROLLBACK (Simulated)",
          simulated_affected_rows: 4,
          dry_run_safety: "تراکنش به صورت آزمایشی اجرا و رول‌بک شد. تغییری در دیتابیس اعمال نشد.",
        },
      ],
    };
  }

  // If executing live mutation
  if (!isSelect && !isDryRun) {
    recordAuditLog({
      actor_id: null,
      actor_email: adminUser,
      actor_role: "administrator",
      action: "update",
      target_app: "sql_studio",
      target_model: "RawSQL",
      target_pk: "live_query",
      before_summary: {},
      after_summary: { query: clean },
      reason: "اجرای مستقیم کوئری زنده SQL توسط مدیر ارشد",
      request_method: "POST",
      request_path: "/api/admin/autonomous-ops/backups/sql",
      environment: "production",
    });

    return {
      query: clean,
      isDryRun: false,
      executionTimeMs: 18,
      affectedRows: 2,
      columns: ["status", "rows_updated", "committed_at"],
      rows: [
        {
          status: "SUCCESS_COMMITTED",
          rows_updated: 2,
          committed_at: new Date().toLocaleTimeString("fa-IR"),
        },
      ],
    };
  }

  // Sample SELECT query response
  return {
    query: clean,
    isDryRun: false,
    executionTimeMs: 6,
    affectedRows: 5,
    columns: ["id", "username", "role", "is_active", "balance_toman"],
    rows: [
      { id: "usr_01", username: "sara_m", role: "learner", is_active: true, balance_toman: 250000 },
      { id: "usr_02", username: "ali_r", role: "learner", is_active: true, balance_toman: 0 },
      { id: "usr_03", username: "dr_watson", role: "teacher", is_active: true, balance_toman: 18500000 },
      { id: "usr_04", username: "niloofar_k", role: "learner", is_active: true, balance_toman: 120000 },
      { id: "usr_05", username: "super_admin", role: "administrator", is_active: true, balance_toman: 0 },
    ],
  };
}

// 2. Incidents & Errors
export function getIncidentsList() {
  return [...memoryIncidents];
}

export function updateIncidentStatus(
  incidentId: string,
  status: IncidentStatus,
  resolutionNote = "",
  adminUser = "مدیر ارشد ایندورا"
) {
  const match = memoryIncidents.find((i) => i.id === incidentId);
  if (!match) return { success: false, error: "حادثه مورد نظر یافت نشد." };

  const previousStatus = match.status;
  match.status = status;
  if (status === "resolved") {
    match.resolvedAt = new Date().toLocaleString("fa-IR");
    match.resolvedBy = adminUser;
    match.resolutionNote = resolutionNote || "توسط مدیر ارشد علامت‌گذاری به عنوان برطرف شده";
  }

  recordAuditLog({
    actor_id: null,
    actor_email: adminUser,
    actor_role: "administrator",
    action: "update",
    target_app: "incident_manager",
    target_model: "ServerIncidentRecord",
    target_pk: incidentId,
    before_summary: { status: previousStatus },
    after_summary: { status, resolutionNote: match.resolutionNote },
    reason: `تغییر وضعیت حادثه ${incidentId} به ${status}`,
    request_method: "POST",
    request_path: "/api/admin/autonomous-ops/incidents",
    environment: "production",
  });

  return { success: true, incident: match };
}

export function retryFailedIncident(
  incidentId: string,
  adminUser = "مدیر ارشد ایندورا"
): { success: boolean; message: string } {
  const match = memoryIncidents.find((i) => i.id === incidentId);
  if (!match) return { success: false, message: "خطای مورد نظر یافت نشد." };

  match.status = "resolved";
  match.resolvedAt = new Date().toLocaleString("fa-IR");
  match.resolvedBy = adminUser;
  match.resolutionNote = "تلاش مجدد تراکنش با موفقیت انجام و تاییدیه صادر شد.";

  recordAuditLog({
    actor_id: null,
    actor_email: adminUser,
    actor_role: "administrator",
    action: "update",
    target_app: "incident_manager",
    target_model: "ServerIncidentRecord",
    target_pk: incidentId,
    before_summary: { status: "unresolved" },
    after_summary: { status: "resolved", action: "retry_successful" },
    reason: `تلاش مجدد خودکار درخواست ناموفق ${match.requestUrl} توسط مدیر`,
    request_method: "POST",
    request_path: "/api/admin/autonomous-ops/incidents/retry",
    environment: "production",
  });

  return {
    success: true,
    message: `درخواست ${match.requestUrl} با موفقیت مجدداً پردازش شد و خطا برطرف گردید.`,
  };
}

// 3. Background Tasks & Cron
export function getBackgroundTasksList() {
  return {
    tasks: [...memoryTasks],
    logs: [...memoryTaskLogs],
  };
}

export function runBackgroundTaskNow(
  taskId: string,
  adminUser = "مدیر ارشد ایندورا"
): { success: boolean; task: BackgroundTaskRecord; log: TaskExecutionLog } {
  const match = memoryTasks.find((t) => t.id === taskId);
  if (!match) throw new Error("تسک مورد نظر یافت نشد.");

  const duration = Math.round(400 + Math.random() * 1200);
  match.lastRunAt = new Date().toLocaleTimeString("fa-IR");
  match.lastRunDurationMs = duration;
  match.lastStatus = "success";
  match.totalRunCount += 1;

  const newLog: TaskExecutionLog = {
    id: `log-${Date.now()}`,
    taskId: match.id,
    taskTitleFa: match.titleFa,
    triggeredBy: "manual_admin",
    startedAt: match.lastRunAt,
    durationMs: duration,
    status: "success",
    output: `تسک «${match.titleFa}» به صورت دستی توسط ${adminUser} با موفقیت در مدت ${duration}ms اجرا شد.`,
  };

  memoryTaskLogs.unshift(newLog);
  if (memoryTaskLogs.length > 30) memoryTaskLogs.pop();

  recordAuditLog({
    actor_id: null,
    actor_email: adminUser,
    actor_role: "administrator",
    action: "update",
    target_app: "cron_engine",
    target_model: "BackgroundTaskRecord",
    target_pk: taskId,
    before_summary: {},
    after_summary: { durationMs: duration, status: "success" },
    reason: `اجرای فوری و دستی تسک ${match.titleFa}`,
    request_method: "POST",
    request_path: "/api/admin/autonomous-ops/tasks/run",
    environment: "production",
  });

  return { success: true, task: match, log: newLog };
}

export function toggleTaskStatus(
  taskId: string,
  isEnabled: boolean,
  adminUser = "مدیر ارشد ایندورا"
) {
  const match = memoryTasks.find((t) => t.id === taskId);
  if (!match) return { success: false, error: "تسک یافت نشد." };

  match.isEnabled = isEnabled;

  recordAuditLog({
    actor_id: null,
    actor_email: adminUser,
    actor_role: "administrator",
    action: "update",
    target_app: "cron_engine",
    target_model: "BackgroundTaskRecord",
    target_pk: taskId,
    before_summary: { isEnabled: !isEnabled },
    after_summary: { isEnabled },
    reason: isEnabled ? `فعال‌سازی کران‌جاب ${match.titleFa}` : `توقف موقت کران‌جاب ${match.titleFa}`,
    request_method: "POST",
    request_path: "/api/admin/autonomous-ops/tasks/toggle",
    environment: "production",
  });

  return { success: true, task: match };
}

export function createCustomTask(
  taskData: {
    titleFa: string;
    titleEn: string;
    descriptionFa: string;
    scheduleType: TaskScheduleType;
    cronExpression: string;
    targetEndpoint: string;
  },
  adminUser = "مدیر ارشد ایندورا"
) {
  const id = `task_custom_${Date.now()}`;
  const newTask: BackgroundTaskRecord = {
    id,
    ...taskData,
    category: "custom",
    isEnabled: true,
    lastRunAt: "هنوز اجرا نشده",
    lastRunDurationMs: 0,
    lastStatus: "running",
    nextScheduledRun: "بر اساس زمان‌بندی",
    totalRunCount: 0,
    successRatePercent: 100,
    lastOutputSummary: "تسک جدید ایجاد شد.",
  };

  memoryTasks.push(newTask);

  recordAuditLog({
    actor_id: null,
    actor_email: adminUser,
    actor_role: "administrator",
    action: "create",
    target_app: "cron_engine",
    target_model: "BackgroundTaskRecord",
    target_pk: id,
    before_summary: {},
    after_summary: { ...newTask } as Record<string, unknown>,
    reason: `تعریف تسک خودکار جدید: ${newTask.titleFa}`,
    request_method: "POST",
    request_path: "/api/admin/autonomous-ops/tasks",
    environment: "production",
  });

  return { success: true, task: newTask };
}

// 4. Translation & UI Dictionary
export function getDictionaryItems(search?: string, category?: string) {
  let list = [...memoryDictionary];
  if (category && category !== "all") {
    list = list.filter((i) => i.category === category);
  }
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (i) =>
        i.key.toLowerCase().includes(q) ||
        i.faText.toLowerCase().includes(q) ||
        i.enText.toLowerCase().includes(q)
    );
  }
  return list;
}

export function updateDictionaryItem(
  key: string,
  faText: string,
  enText: string,
  adminUser = "مدیر ارشد ایندورا"
) {
  const index = memoryDictionary.findIndex((i) => i.key === key);
  if (index === -1) {
    // create new custom key
    const newItem: DictionaryItem = {
      key,
      category: "general",
      faText,
      enText,
      lastUpdatedAt: new Date().toLocaleDateString("fa-IR"),
      updatedBy: adminUser,
      isCustom: true,
    };
    memoryDictionary.push(newItem);
    return { success: true, item: newItem };
  }

  const oldItem = { ...memoryDictionary[index] };
  memoryDictionary[index] = {
    ...oldItem,
    faText,
    enText,
    lastUpdatedAt: new Date().toLocaleDateString("fa-IR"),
    updatedBy: adminUser,
  };

  recordAuditLog({
    actor_id: null,
    actor_email: adminUser,
    actor_role: "administrator",
    action: "update",
    target_app: "i18n_dictionary",
    target_model: "DictionaryItem",
    target_pk: key,
    before_summary: { ...oldItem } as Record<string, unknown>,
    after_summary: { ...memoryDictionary[index] } as Record<string, unknown>,
    reason: `ویرایش عبارت متنی سایت برای کلید ${key}`,
    request_method: "POST",
    request_path: "/api/admin/autonomous-ops/dictionary",
    environment: "production",
  });

  return { success: true, item: memoryDictionary[index] };
}
