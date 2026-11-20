import { recordAuditLog } from "./admin-ops";

// ==============================================================================
// 1. Data Models & Types
// ==============================================================================

export type RefundMethod = "shaparak_card_reversal" | "wallet_credit";

export interface RefundRecord {
  id: string; // e.g. "REF-20261120-4821"
  transactionId: string;
  learnerId: string;
  learnerName: string;
  learnerPhone: string;
  courseId: string;
  courseTitle: string;
  amountToman: number;
  refundMethod: RefundMethod;
  bonusAmountToman: number; // e.g. +5% bonus if wallet refund
  reason: string;
  status: "completed" | "processing" | "failed";
  teacherCommissionReversedToman: number;
  teacherId: string;
  teacherName: string;
  taxVoucherCode: string;
  createdAt: string;
  createdIso: string;
  issuedBy: string;
}

export type RiskType =
  | "multi_ip_sharing"
  | "card_velocity_abuse"
  | "abnormal_geo_jump"
  | "chargeback_risk";

export interface RiskAlertRecord {
  id: string;
  riskType: RiskType;
  severity: "critical" | "high" | "medium";
  userId: string;
  userEmail: string;
  userPhone: string;
  descriptionFa: string;
  detectedAt: string;
  status: "active" | "mitigated" | "whitelisted";
  indicators: {
    concurrentIps?: string[];
    cities?: string[];
    failedAttemptsCount?: number;
    deviceFingerprints?: string[];
    associatedCourse?: string;
  };
  mitigationActionTaken?: string;
  mitigatedAt?: string;
  mitigatedBy?: string;
}

export interface EligibleTransaction {
  id: string; // e.g. "tx_9812"
  trackingCode: string;
  learnerId: string;
  learnerName: string;
  learnerPhone: string;
  courseId: string;
  courseTitle: string;
  amountToman: number;
  teacherId: string;
  teacherName: string;
  teacherCommissionToman: number;
  paidAt: string;
  paidVia: string;
  isRefunded: boolean;
}

// ==============================================================================
// 2. Pre-Configured Data & In-Memory State
// ==============================================================================

export const INITIAL_REFUNDS: RefundRecord[] = [
  {
    id: "REF-20261119-1042",
    transactionId: "tx_9799",
    learnerId: "usr_02",
    learnerName: "علی رضایی",
    learnerPhone: "09124445566",
    courseId: "crs_01",
    courseTitle: "تمرین تا ۲۰ (انگلیسی دوازدهم نهایی)",
    amountToman: 420000,
    refundMethod: "wallet_credit",
    bonusAmountToman: 21000, // 5% bonus credit
    reason: "ثبت‌نام اشتباه توسط کاربر و انتقال به دوره مکالمه جامع",
    status: "completed",
    teacherCommissionReversedToman: 294000,
    teacherId: "dr_watson",
    teacherName: "دکتر مسعود رضایی",
    taxVoucherCode: "REV-TAX-1403-9081",
    createdAt: "۱۴۰۳/۰۸/۱۹ ۱۶:۳۰",
    createdIso: "2026-11-19T16:30:00Z",
    issuedBy: "مدیر ارشد ایندورا",
  },
  {
    id: "REF-20261118-0915",
    transactionId: "tx_9750",
    learnerId: "usr_04",
    learnerName: "نیلوفر کریمی",
    learnerPhone: "09351112233",
    courseId: "crs_03",
    courseTitle: "دوره جامع مستری اسپیکینگ آیلتس (Band 7.5+)",
    amountToman: 1850000,
    refundMethod: "shaparak_card_reversal",
    bonusAmountToman: 0,
    reason: "تراکنش ناموفق درگاه که از حساب کاربر کسر شده بود و ریورس شاپرک صادر شد",
    status: "completed",
    teacherCommissionReversedToman: 1295000,
    teacherId: "dr_watson",
    teacherName: "دکتر مسعود رضایی",
    taxVoucherCode: "REV-TAX-1403-8820",
    createdAt: "۱۴۰۳/۰۸/۱۸ ۰۹:۱۵",
    createdIso: "2026-11-18T09:15:00Z",
    issuedBy: "مدیر ارشد ایندورا",
  },
];

export const INITIAL_RISK_ALERTS: RiskAlertRecord[] = [
  {
    id: "risk-001",
    riskType: "multi_ip_sharing",
    severity: "critical",
    userId: "usr_09",
    userEmail: "hesam.sharing@example.com",
    userPhone: "09129998877",
    descriptionFa: "شناسایی ورود همزمان فعال از ۳ شهر مجزا در بازه کمتر از ۴۵ دقیقه (اشتراک غیرمجاز اکانت و ویدیوها)",
    detectedAt: "۱۴۰۳/۰۸/۲۰ ۱۶:۱۵",
    status: "active",
    indicators: {
      concurrentIps: ["5.127.18.90 (تهران)", "89.198.40.12 (شیراز)", "188.253.11.4 (مشهد)"],
      cities: ["تهران", "شیراز", "مشهد"],
      deviceFingerprints: ["Windows 11 / Chrome 130", "Android 14 / Samsung", "iPhone 15 Pro / Safari"],
      associatedCourse: "دوره جامع مستری اسپیکینگ آیلتس (Band 7.5+)",
    },
  },
  {
    id: "risk-002",
    riskType: "card_velocity_abuse",
    severity: "high",
    userId: "usr_14",
    userEmail: "unknown.carder@proton.me",
    userPhone: "09301110099",
    descriptionFa: "تلاش‌های متوالی ناموفق برای خرید دوره با ۶ کارت بانکی مختلف در کمتر از ۳ دقیقه (مشکوک به حمله کارتینگ)",
    detectedAt: "۱۴۰۳/۰۸/۲۰ ۱۵:۰۵",
    status: "active",
    indicators: {
      concurrentIps: ["185.165.241.10 (DataCenter IP)"],
      failedAttemptsCount: 6,
      associatedCourse: "تمرین تا ۲۰ (انگلیسی دوازدهم نهایی)",
    },
  },
  {
    id: "risk-003",
    riskType: "abnormal_geo_jump",
    severity: "medium",
    userId: "usr_01",
    userEmail: "sara.mohammadi@example.com",
    userPhone: "09121112233",
    descriptionFa: "تغییر سریع IP از اتصال همراه اول به سرور VPN آلمان حین تماشای آزمونک",
    detectedAt: "۱۴۰۳/۰۸/۱۹ ۲۰:۴۰",
    status: "mitigated",
    indicators: {
      concurrentIps: ["2.188.10.42 (ایرانسل تهران)", "194.26.29.112 (Frankfurt VPN)"],
      cities: ["تهران", "Frankfurt"],
    },
    mitigationActionTaken: "بررسی شد و تایید گردید کاربر از ابزار دورزدن تحریم برای بارگذاری تسک اسپیکینگ استفاده کرده است.",
    mitigatedAt: "۱۴۰۳/۰۸/۱۹ ۲۱:۰۰",
    mitigatedBy: "مدیر پشتیبانی ایندورا",
  },
];

export const INITIAL_TRANSACTIONS: EligibleTransaction[] = [
  {
    id: "tx_9820",
    trackingCode: "SHP-4829104",
    learnerId: "usr_01",
    learnerName: "سارا محمدی",
    learnerPhone: "09121112233",
    courseId: "crs_03",
    courseTitle: "دوره جامع مستری اسپیکینگ آیلتس (Band 7.5+)",
    amountToman: 1850000,
    teacherId: "dr_watson",
    teacherName: "دکتر مسعود رضایی",
    teacherCommissionToman: 1295000,
    paidAt: "۱۴۰۳/۰۸/۲۰ ۱۰:۰۰",
    paidVia: "شاپرک (کارت به کارت درگاه)",
    isRefunded: false,
  },
  {
    id: "tx_9821",
    trackingCode: "SHP-4829105",
    learnerId: "usr_04",
    learnerName: "نیلوفر کریمی",
    learnerPhone: "09351112233",
    courseId: "crs_02",
    courseTitle: "دوره مکالمه و گرامر جامع (Speakout B1)",
    amountToman: 790000,
    teacherId: "dr_watson",
    teacherName: "دکتر مسعود رضایی",
    teacherCommissionToman: 553000,
    paidAt: "۱۴۰۳/۰۸/۲۰ ۱۲:۳۰",
    paidVia: "زرین‌پال شتابی",
    isRefunded: false,
  },
  {
    id: "tx_9822",
    trackingCode: "SHP-4829106",
    learnerId: "usr_09",
    learnerName: "حسام اشتراکی (اکانت پرخطر)",
    learnerPhone: "09129998877",
    courseId: "crs_03",
    courseTitle: "دوره جامع مستری اسپیکینگ آیلتس (Band 7.5+)",
    amountToman: 1850000,
    teacherId: "dr_watson",
    teacherName: "دکتر مسعود رضایی",
    teacherCommissionToman: 1295000,
    paidAt: "۱۴۰۳/۰۸/۱۹ ۱۸:۰۰",
    paidVia: "زرین‌پال شتابی",
    isRefunded: false,
  },
];

let memoryRefunds: RefundRecord[] = [...INITIAL_REFUNDS];
let memoryRiskAlerts: RiskAlertRecord[] = [...INITIAL_RISK_ALERTS];
let memoryTransactions: EligibleTransaction[] = [...INITIAL_TRANSACTIONS];

// ==============================================================================
// 3. Store Handlers
// ==============================================================================

// 1. Get Refunds List
export function getRefundsList(): { refunds: RefundRecord[]; eligibleTransactions: EligibleTransaction[] } {
  return {
    refunds: [...memoryRefunds],
    eligibleTransactions: memoryTransactions.filter((t) => !t.isRefunded),
  };
}

// 2. Issue 1-Click Refund
export function issueOneClickRefund(
  params: {
    transactionId: string;
    refundMethod: RefundMethod;
    customAmountToman?: number;
    reason: string;
  },
  adminUser = "مدیر ارشد ایندورا"
): { success: boolean; refund?: RefundRecord; error?: string } {
  const tx = memoryTransactions.find((t) => t.id === params.transactionId);
  if (!tx) return { success: false, error: "تراکنش مورد نظر یافت نشد." };
  if (tx.isRefunded) return { success: false, error: "این تراکنش قبلاً استرداد شده است." };

  const finalAmount = params.customAmountToman && params.customAmountToman > 0
    ? params.customAmountToman
    : tx.amountToman;

  // 5% bonus if wallet refund
  const bonusAmount = params.refundMethod === "wallet_credit" ? Math.round(finalAmount * 0.05) : 0;

  // Proportional teacher commission reversed (70% standard)
  const teacherCommissionReversed = Math.round(finalAmount * 0.7);

  const timestamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
  const refundId = `REF-${timestamp.slice(0, 8)}-${Math.floor(1000 + Math.random() * 9000)}`;
  const taxVoucherCode = `REV-TAX-1403-${Math.floor(1000 + Math.random() * 9000)}`;

  const newRefund: RefundRecord = {
    id: refundId,
    transactionId: tx.id,
    learnerId: tx.learnerId,
    learnerName: tx.learnerName,
    learnerPhone: tx.learnerPhone,
    courseId: tx.courseId,
    courseTitle: tx.courseTitle,
    amountToman: finalAmount,
    refundMethod: params.refundMethod,
    bonusAmountToman: bonusAmount,
    reason: params.reason || "استرداد آنی وجه با تشخیص مستقیم مدیر ارشد",
    status: "completed",
    teacherCommissionReversedToman: teacherCommissionReversed,
    teacherId: tx.teacherId,
    teacherName: tx.teacherName,
    taxVoucherCode,
    createdAt: new Date().toLocaleString("fa-IR"),
    createdIso: new Date().toISOString(),
    issuedBy: adminUser,
  };

  memoryRefunds.unshift(newRefund);
  tx.isRefunded = true;

  recordAuditLog({
    actor_id: null,
    actor_email: adminUser,
    actor_role: "administrator",
    action: "create",
    target_app: "financial_risk_refund_hub",
    target_model: "RefundRecord",
    target_pk: refundId,
    before_summary: { transactionId: tx.id, originalAmount: tx.amountToman },
    after_summary: {
      refundId,
      amountToman: finalAmount,
      method: params.refundMethod,
      bonusAmount,
      teacherCommissionReversed,
      taxVoucherCode,
    },
    reason: `صدور استرداد وجه ${finalAmount.toLocaleString()} تومانی به روش ${params.refundMethod}: ${params.reason}`,
    request_method: "POST",
    request_path: "/api/admin/finance/refunds",
    environment: "production",
  });

  return { success: true, refund: newRefund };
}

// 3. Get Risk Alerts List
export function getRiskAlertsList(): RiskAlertRecord[] {
  return [...memoryRiskAlerts];
}

// 4. Mitigate Risk Alert
export function mitigateRiskAlertAction(
  alertId: string,
  action: "force_logout" | "freeze_account" | "revoke_enrollment" | "blacklist_ip" | "whitelist",
  adminUser = "مدیر ارشد ایندورا"
): { success: boolean; alert?: RiskAlertRecord; messageFa?: string; error?: string } {
  const alert = memoryRiskAlerts.find((a) => a.id === alertId);
  if (!alert) return { success: false, error: "هشدار امنیتی یافت نشد." };

  let actionSummaryFa = "";
  if (action === "force_logout") {
    actionSummaryFa = "تمامی نشست‌های فعال و توکن‌های ورود کاربر باطل و کاربر فوراً از سامانه خارج شد.";
    alert.status = "mitigated";
  } else if (action === "freeze_account") {
    actionSummaryFa = "حساب کاربری موقتاً مسدود گردید و پیام هشدار امنیتی روی پنل کاربر قرار گرفت.";
    alert.status = "mitigated";
  } else if (action === "revoke_enrollment") {
    actionSummaryFa = "دسترسی کاربر به دوره آموزشی مذکور فوراً لغو گردید.";
    alert.status = "mitigated";
  } else if (action === "blacklist_ip") {
    actionSummaryFa = "آی‌پی‌های شناسایی شده به لیست سیاه فایروال سرور (IP Blocklist) اضافه شدند.";
    alert.status = "mitigated";
  } else if (action === "whitelist") {
    actionSummaryFa = "فعالیت کاربر به عنوان رفتار مجاز (Whitelist) تایید و پرچم ریسک برداشته شد.";
    alert.status = "whitelisted";
  }

  alert.mitigationActionTaken = actionSummaryFa;
  alert.mitigatedAt = new Date().toLocaleString("fa-IR");
  alert.mitigatedBy = adminUser;

  recordAuditLog({
    actor_id: null,
    actor_email: adminUser,
    actor_role: "administrator",
    action: "update",
    target_app: "financial_risk_refund_hub",
    target_model: "RiskAlertRecord",
    target_pk: alertId,
    before_summary: { status: "active" },
    after_summary: { status: alert.status, actionTaken: actionSummaryFa },
    reason: `اجرای اقدام واکنشی ضدتقلب: ${actionSummaryFa}`,
    request_method: "POST",
    request_path: "/api/admin/finance/risk-alerts",
    environment: "production",
  });

  return { success: true, alert, messageFa: actionSummaryFa };
}
