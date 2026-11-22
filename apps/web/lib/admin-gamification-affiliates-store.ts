import { recordAuditLog } from "./admin-ops";

// ==============================================================================
// 1. Gamification & Leaderboard Types
// ==============================================================================

export type LeagueTier = "bronze" | "silver" | "gold" | "diamond" | "master";

export interface BadgeRecord {
  id: string;
  titleFa: string;
  titleEn: string;
  icon: string; // Emoji or visual icon
  category: "streak" | "academic" | "social" | "mastery";
  descriptionFa: string;
  awardedCount: number;
  xpBonus: number;
}

export interface LearnerGamificationProfile {
  userId: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  totalXp: number;
  weeklyXp: number;
  monthlyXp: number;
  currentStreakDays: number;
  league: LeagueTier;
  rank: number;
  badges: string[]; // array of badge ids
  completedLessonsCount: number;
  passedQuizzesCount: number;
}

export interface XpRuleConfig {
  dailyLoginStreak: number;
  lessonCompleted: number;
  quizPassed: number;
  quizPerfectScore: number;
  speakingPracticeSubmitted: number;
  firstCourseEnrollment: number;
}

// ==============================================================================
// 2. Affiliate & Referral Network Types
// ==============================================================================

export interface AffiliatePartner {
  id: string;
  userId: string;
  partnerName: string;
  phone: string;
  email: string;
  referralCode: string; // e.g. "ielts_pro"
  commissionRatePercent: number; // e.g. 15%
  totalClicks: number;
  successfulConversionsCount: number;
  totalSalesVolumeToman: number;
  totalCommissionEarnedToman: number;
  pendingPayoutToman: number;
  paidOutToman: number;
  status: "active" | "suspended";
  joinedAt: string;
  shebaNumber: string;
  bankName: string;
}

export interface AffiliatePayoutRequest {
  id: string;
  affiliateId: string;
  affiliateName: string;
  amountToman: number;
  requestedAt: string;
  status: "pending" | "approved_bank" | "approved_wallet" | "rejected";
  shebaNumber: string;
  bankName: string;
  bonusAmountToman?: number; // e.g. +10% bonus if wallet settlement
  trackingCode?: string;
  processedAt?: string;
  processedBy?: string;
  rejectionReason?: string;
}

export interface ReferralConversionLog {
  id: string;
  affiliateCode: string;
  affiliateName: string;
  studentName: string;
  coursePurchased: string;
  amountPaidToman: number;
  commissionEarnedToman: number;
  occurredAt: string;
}

// ==============================================================================
// 3. Initial In-Memory State
// ==============================================================================

export const INITIAL_BADGES: BadgeRecord[] = [
  {
    id: "badge_speaking_champ",
    titleFa: "قهرمان اسپیکینگ آیلتس",
    titleEn: "IELTS Speaking Champion",
    icon: "🎙️",
    category: "mastery",
    descriptionFa: "ارسال بیش از ۲۰ پاسخ صوتی موفق با تایید نمره تلفظ بالای Band 7.5",
    awardedCount: 14,
    xpBonus: 500,
  },
  {
    id: "badge_streak_30",
    titleFa: "استریک ۳۰ روزه مطالعه پیوسته",
    titleEn: "30-Day Streak Master",
    icon: "🔥",
    category: "streak",
    descriptionFa: "ورود و مطالعه حداقل یک درس به مدت ۳۰ روز متوالی بدون وقفه",
    awardedCount: 28,
    xpBonus: 1000,
  },
  {
    id: "badge_perfect_quiz",
    titleFa: "کمال‌گرا (نمره ۱۰۰٪ آزمونک‌ها)",
    titleEn: "Perfectionist 100%",
    icon: "🎯",
    category: "academic",
    descriptionFa: "کسب نمره کامل ۱۰۰٪ در ۱۰ آزمونک متوالی بدون هیچ پاسخ غلط",
    awardedCount: 42,
    xpBonus: 400,
  },
  {
    id: "badge_first_step",
    titleFa: "گام نخست یادگیری",
    titleEn: "First Step",
    icon: "🌱",
    category: "academic",
    descriptionFa: "تکمیل اولین درس و آزمونک دوره با موفقیت کامل",
    awardedCount: 310,
    xpBonus: 100,
  },
  {
    id: "badge_ambassador",
    titleFa: "سفیر آکادمی ایندورا",
    titleEn: "Community Ambassador",
    icon: "👑",
    category: "social",
    descriptionFa: "دعوت از حداقل ۵ دوست فعال با لینک اختصاصی رفرال",
    awardedCount: 19,
    xpBonus: 750,
  },
];

export const INITIAL_LEARNERS_GAMIFICATION: LearnerGamificationProfile[] = [
  {
    userId: "usr_01",
    name: "سارا محمدی",
    email: "sara.mohammadi@example.com",
    phone: "09121112233",
    totalXp: 8450,
    weeklyXp: 920,
    monthlyXp: 3400,
    currentStreakDays: 34,
    league: "master",
    rank: 1,
    badges: ["badge_speaking_champ", "badge_streak_30", "badge_perfect_quiz", "badge_first_step"],
    completedLessonsCount: 48,
    passedQuizzesCount: 22,
  },
  {
    userId: "usr_04",
    name: "نیلوفر کریمی",
    email: "niloofar.karimi@example.com",
    phone: "09351112233",
    totalXp: 6200,
    weeklyXp: 810,
    monthlyXp: 2900,
    currentStreakDays: 18,
    league: "diamond",
    rank: 2,
    badges: ["badge_streak_30", "badge_perfect_quiz", "badge_first_step"],
    completedLessonsCount: 36,
    passedQuizzesCount: 18,
  },
  {
    userId: "usr_02",
    name: "علی رضایی",
    email: "ali.rezaei@example.com",
    phone: "09124445566",
    totalXp: 3100,
    weeklyXp: 450,
    monthlyXp: 1650,
    currentStreakDays: 9,
    league: "gold",
    rank: 3,
    badges: ["badge_first_step", "badge_perfect_quiz"],
    completedLessonsCount: 20,
    passedQuizzesCount: 11,
  },
  {
    userId: "usr_07",
    name: "امیرحسین پارسا",
    email: "amir.parsa@example.com",
    phone: "09387776655",
    totalXp: 1420,
    weeklyXp: 310,
    monthlyXp: 980,
    currentStreakDays: 5,
    league: "silver",
    rank: 4,
    badges: ["badge_first_step"],
    completedLessonsCount: 12,
    passedQuizzesCount: 6,
  },
  {
    userId: "usr_08",
    name: "مهسا ابراهیمی",
    email: "mahsa.eb@example.com",
    phone: "09192223344",
    totalXp: 480,
    weeklyXp: 210,
    monthlyXp: 480,
    currentStreakDays: 2,
    league: "bronze",
    rank: 5,
    badges: ["badge_first_step"],
    completedLessonsCount: 4,
    passedQuizzesCount: 2,
  },
];

export const INITIAL_XP_RULES: XpRuleConfig = {
  dailyLoginStreak: 50,
  lessonCompleted: 30,
  quizPassed: 100,
  quizPerfectScore: 200,
  speakingPracticeSubmitted: 150,
  firstCourseEnrollment: 300,
};

export const INITIAL_AFFILIATES: AffiliatePartner[] = [
  {
    id: "aff_01",
    userId: "usr_aff_01",
    partnerName: "کانال تلگرام آیلتس کلاب (مهندس تقوی)",
    phone: "09128889900",
    email: "taghavi.ielts@example.com",
    referralCode: "ielts_club",
    commissionRatePercent: 18,
    totalClicks: 1420,
    successfulConversionsCount: 48,
    totalSalesVolumeToman: 42500000,
    totalCommissionEarnedToman: 7650000,
    pendingPayoutToman: 2850000,
    paidOutToman: 4800000,
    status: "active",
    joinedAt: "۱۴۰۳/۰۶/۱۵",
    shebaNumber: "IR020120000000001234567890",
    bankName: "بانک ملت",
  },
  {
    id: "aff_02",
    userId: "usr_aff_02",
    partnerName: "پیج اینستاگرام انگلیسی سریع (سارا نیکزاد)",
    phone: "09359991122",
    email: "sara.english@example.com",
    referralCode: "fast_english",
    commissionRatePercent: 15,
    totalClicks: 890,
    successfulConversionsCount: 26,
    totalSalesVolumeToman: 24200000,
    totalCommissionEarnedToman: 3630000,
    pendingPayoutToman: 1450000,
    paidOutToman: 2180000,
    status: "active",
    joinedAt: "۱۴۰۳/۰۷/۰۱",
    shebaNumber: "IR980180000000009876543210",
    bankName: "بانک سامان",
  },
  {
    id: "aff_03",
    userId: "usr_aff_03",
    partnerName: "امیرحسین رضایی (دانشجوی برتر و معرف)",
    phone: "09127774433",
    email: "amir.rezaei@example.com",
    referralCode: "amir_vip",
    commissionRatePercent: 12,
    totalClicks: 320,
    successfulConversionsCount: 9,
    totalSalesVolumeToman: 7900000,
    totalCommissionEarnedToman: 948000,
    pendingPayoutToman: 0,
    paidOutToman: 948000,
    status: "active",
    joinedAt: "۱۴۰۳/۰۷/۲۰",
    shebaNumber: "IR440170000000005544332211",
    bankName: "بانک ملی ایران",
  },
];

export const INITIAL_PAYOUT_REQUESTS: AffiliatePayoutRequest[] = [
  {
    id: "req_payout_01",
    affiliateId: "aff_01",
    affiliateName: "کانال تلگرام آیلتس کلاب",
    amountToman: 2850000,
    requestedAt: "۱۴۰۳/۰۸/۱۹ ۱۸:۳۰",
    status: "pending",
    shebaNumber: "IR020120000000001234567890",
    bankName: "بانک ملت",
  },
  {
    id: "req_payout_02",
    affiliateId: "aff_02",
    affiliateName: "پیج اینستاگرام انگلیسی سریع",
    amountToman: 1450000,
    requestedAt: "۱۴۰۳/۰۸/۲۰ ۱۲:۱۵",
    status: "pending",
    shebaNumber: "IR980180000000009876543210",
    bankName: "بانک سامان",
  },
  {
    id: "req_payout_03",
    affiliateId: "aff_03",
    affiliateName: "امیرحسین رضایی",
    amountToman: 948000,
    requestedAt: "۱۴۰۳/۰۸/۱۵ ۱۰:۰۰",
    status: "approved_wallet",
    shebaNumber: "IR440170000000005544332211",
    bankName: "بانک ملی ایران",
    bonusAmountToman: 94800, // 10% bonus
    trackingCode: "WLT-BONUS-9480",
    processedAt: "۱۴۰۳/۰۸/۱۵ ۱۱:۳۰",
    processedBy: "مدیر ارشد ایندورا",
  },
];

export const INITIAL_CONVERSION_LOGS: ReferralConversionLog[] = [
  {
    id: "conv-101",
    affiliateCode: "ielts_club",
    affiliateName: "کانال تلگرام آیلتس کلاب",
    studentName: "پوریا علیزاده",
    coursePurchased: "دوره جامع مستری اسپیکینگ آیلتس (Band 7.5+)",
    amountPaidToman: 1850000,
    commissionEarnedToman: 333000,
    occurredAt: "۱۴۰۳/۰۸/۲۰ ۱۴:۱۰",
  },
  {
    id: "conv-102",
    affiliateCode: "fast_english",
    affiliateName: "پیج اینستاگرام انگلیسی سریع",
    studentName: "مونا کاظمی",
    coursePurchased: "دوره مکالمه و گرامر جامع (Speakout B1)",
    amountPaidToman: 790000,
    commissionEarnedToman: 118500,
    occurredAt: "۱۴۰۳/۰۸/۲۰ ۱۰:۲۵",
  },
  {
    id: "conv-103",
    affiliateCode: "ielts_club",
    affiliateName: "کانال تلگرام آیلتس کلاب",
    studentName: "فرهاد سلیمانی",
    coursePurchased: "تمرین تا ۲۰ (انگلیسی دوازدهم نهایی)",
    amountPaidToman: 420000,
    commissionEarnedToman: 75600,
    occurredAt: "۱۴۰۳/۰۸/۱۹ ۱۹:۵۰",
  },
];

const memoryBadges = [...INITIAL_BADGES];
const memoryLearners = [...INITIAL_LEARNERS_GAMIFICATION];
let memoryXpRules = { ...INITIAL_XP_RULES };
const memoryAffiliates = [...INITIAL_AFFILIATES];
const memoryPayoutRequests = [...INITIAL_PAYOUT_REQUESTS];
const memoryConversionLogs = [...INITIAL_CONVERSION_LOGS];

// ==============================================================================
// 4. Store Handlers
// ==============================================================================

// 1. Leaderboard & Gamification Profile Handlers
export function getLeaderboardData(period: "weekly" | "monthly" | "all_time" = "all_time") {
  const sorted = [...memoryLearners].sort((a, b) => {
    if (period === "weekly") return b.weeklyXp - a.weeklyXp;
    if (period === "monthly") return b.monthlyXp - a.monthlyXp;
    return b.totalXp - a.totalXp;
  });

  return {
    learners: sorted.map((l, idx) => ({ ...l, rank: idx + 1 })),
    badges: [...memoryBadges],
    rules: { ...memoryXpRules },
  };
}

export function adjustLearnerXpAction(
  userId: string,
  deltaXp: number,
  reason: string,
  adminUser = "مدیر ارشد ایندورا"
): { success: boolean; learner?: LearnerGamificationProfile; error?: string } {
  const match = memoryLearners.find((l) => l.userId === userId);
  if (!match) return { success: false, error: "زبان‌آموز مورد نظر یافت نشد." };

  const oldXp = match.totalXp;
  match.totalXp = Math.max(0, match.totalXp + deltaXp);
  match.weeklyXp = Math.max(0, match.weeklyXp + deltaXp);
  match.monthlyXp = Math.max(0, match.monthlyXp + deltaXp);

  // Recalculate league
  if (match.totalXp >= 7000) match.league = "master";
  else if (match.totalXp >= 3500) match.league = "diamond";
  else if (match.totalXp >= 1500) match.league = "gold";
  else if (match.totalXp >= 500) match.league = "silver";
  else match.league = "bronze";

  recordAuditLog({
    actor_id: null,
    actor_email: adminUser,
    actor_role: "administrator",
    action: "update",
    target_app: "gamification_hub",
    target_model: "LearnerGamificationProfile",
    target_pk: userId,
    before_summary: { totalXp: oldXp },
    after_summary: { totalXp: match.totalXp, deltaXp, newLeague: match.league },
    reason: reason || "اصلاح و تغییر دستی امتیاز XP توسط مدیر ارشد",
    request_method: "POST",
    request_path: "/api/admin/gamification/leaderboard",
    environment: "production",
  });

  return { success: true, learner: match };
}

export function awardBadgeToLearnerAction(
  userId: string,
  badgeId: string,
  adminUser = "مدیر ارشد ایندورا"
): { success: boolean; learner?: LearnerGamificationProfile; error?: string } {
  const learner = memoryLearners.find((l) => l.userId === userId);
  const badge = memoryBadges.find((b) => b.id === badgeId);

  if (!learner || !badge) return { success: false, error: "کاربر یا نشان افتخار یافت نشد." };
  if (learner.badges.includes(badgeId)) {
    return { success: false, error: "این نشان افتخار قبلاً به این کاربر اعطا شده است." };
  }

  learner.badges.push(badgeId);
  badge.awardedCount += 1;
  learner.totalXp += badge.xpBonus;

  recordAuditLog({
    actor_id: null,
    actor_email: adminUser,
    actor_role: "administrator",
    action: "update",
    target_app: "gamification_hub",
    target_model: "LearnerGamificationProfile",
    target_pk: userId,
    before_summary: {},
    after_summary: { badgeAwarded: badge.titleFa, xpBonus: badge.xpBonus },
    reason: `اعطای اختصاصی نشان افتخار «${badge.titleFa}» توسط مدیر`,
    request_method: "POST",
    request_path: "/api/admin/gamification/leaderboard",
    environment: "production",
  });

  return { success: true, learner };
}

export function updateXpRulesAction(
  rulesUpdates: Partial<XpRuleConfig>,
  adminUser = "مدیر ارشد ایندورا"
) {
  memoryXpRules = { ...memoryXpRules, ...rulesUpdates };

  recordAuditLog({
    actor_id: null,
    actor_email: adminUser,
    actor_role: "administrator",
    action: "update",
    target_app: "gamification_hub",
    target_model: "XpRuleConfig",
    target_pk: "active_rules",
    before_summary: {},
    after_summary: { ...memoryXpRules } as Record<string, unknown>,
    reason: "به‌روزرسانی ضرایب و قوانین کسب امتیاز پلتفرم",
    request_method: "POST",
    request_path: "/api/admin/gamification/xp-rules",
    environment: "production",
  });

  return { success: true, rules: memoryXpRules };
}

// 2. Affiliate & Referral Handlers
export function getAffiliatesData() {
  const totalSales = memoryAffiliates.reduce((acc, a) => acc + a.totalSalesVolumeToman, 0);
  const totalCommission = memoryAffiliates.reduce((acc, a) => acc + a.totalCommissionEarnedToman, 0);
  const pendingPayouts = memoryPayoutRequests.filter((p) => p.status === "pending");

  return {
    affiliates: [...memoryAffiliates],
    payoutRequests: [...memoryPayoutRequests],
    conversionLogs: [...memoryConversionLogs],
    stats: {
      totalAffiliatesCount: memoryAffiliates.length,
      totalSalesVolumeToman: totalSales,
      totalCommissionEarnedToman: totalCommission,
      pendingPayoutsCount: pendingPayouts.length,
      pendingPayoutsAmountToman: pendingPayouts.reduce((acc, p) => acc + p.amountToman, 0),
    },
  };
}

export function saveAffiliatePartnerAction(
  partnerData: {
    partnerName: string;
    phone: string;
    email: string;
    referralCode: string;
    commissionRatePercent: number;
    shebaNumber: string;
    bankName: string;
  },
  adminUser = "مدیر ارشد ایندورا"
) {
  const existing = memoryAffiliates.find(
    (a) => a.referralCode.toLowerCase() === partnerData.referralCode.toLowerCase()
  );
  if (existing) {
    return { success: false, error: "این کد رفرال قبلاً ثبت شده است. لطفاً کد دیگری انتخاب کنید." };
  }

  const id = `aff_${Date.now()}`;
  const newPartner: AffiliatePartner = {
    id,
    userId: `usr_${id}`,
    ...partnerData,
    referralCode: partnerData.referralCode.trim().toLowerCase(),
    totalClicks: 0,
    successfulConversionsCount: 0,
    totalSalesVolumeToman: 0,
    totalCommissionEarnedToman: 0,
    pendingPayoutToman: 0,
    paidOutToman: 0,
    status: "active",
    joinedAt: new Date().toLocaleDateString("fa-IR"),
  };

  memoryAffiliates.unshift(newPartner);

  recordAuditLog({
    actor_id: null,
    actor_email: adminUser,
    actor_role: "administrator",
    action: "create",
    target_app: "affiliates_hub",
    target_model: "AffiliatePartner",
    target_pk: id,
    before_summary: {},
    after_summary: { partnerName: newPartner.partnerName, code: newPartner.referralCode },
    reason: `تعریف همکار بازاریابی جدید: ${newPartner.partnerName}`,
    request_method: "POST",
    request_path: "/api/admin/affiliates/partners",
    environment: "production",
  });

  return { success: true, partner: newPartner };
}

export function processAffiliatePayoutAction(
  payoutId: string,
  action: "approve_bank" | "approve_wallet" | "reject",
  details?: { bankTrackingCode?: string; rejectionReason?: string },
  adminUser = "مدیر ارشد ایندورا"
) {
  const payout = memoryPayoutRequests.find((p) => p.id === payoutId);
  if (!payout) return { success: false, error: "درخواست تسویه یافت نشد." };

  const affiliate = memoryAffiliates.find((a) => a.id === payout.affiliateId);

  if (action === "approve_bank") {
    payout.status = "approved_bank";
    payout.trackingCode = details?.bankTrackingCode || `PAYA-${Math.floor(100000 + Math.random() * 900000)}`;
    payout.processedAt = new Date().toLocaleString("fa-IR");
    payout.processedBy = adminUser;
    if (affiliate) {
      affiliate.pendingPayoutToman = Math.max(0, affiliate.pendingPayoutToman - payout.amountToman);
      affiliate.paidOutToman += payout.amountToman;
    }
  } else if (action === "approve_wallet") {
    const bonus = Math.round(payout.amountToman * 0.1); // +10% bonus
    payout.status = "approved_wallet";
    payout.bonusAmountToman = bonus;
    payout.trackingCode = `WLT-BONUS-${Math.floor(1000 + Math.random() * 9000)}`;
    payout.processedAt = new Date().toLocaleString("fa-IR");
    payout.processedBy = adminUser;
    if (affiliate) {
      affiliate.pendingPayoutToman = Math.max(0, affiliate.pendingPayoutToman - payout.amountToman);
      affiliate.paidOutToman += payout.amountToman;
    }
  } else if (action === "reject") {
    payout.status = "rejected";
    payout.rejectionReason = details?.rejectionReason || "عدم تطابق اطلاعات هویتی و شماره شبا";
    payout.processedAt = new Date().toLocaleString("fa-IR");
    payout.processedBy = adminUser;
  }

  recordAuditLog({
    actor_id: null,
    actor_email: adminUser,
    actor_role: "administrator",
    action: "update",
    target_app: "affiliates_hub",
    target_model: "AffiliatePayoutRequest",
    target_pk: payoutId,
    before_summary: { status: "pending" },
    after_summary: { status: payout.status, trackingCode: payout.trackingCode },
    reason: `تعیین تکلیف درخواست تسویه کمیسیون افیلیت: ${action}`,
    request_method: "POST",
    request_path: "/api/admin/affiliates/payouts",
    environment: "production",
  });

  return { success: true, payout };
}
