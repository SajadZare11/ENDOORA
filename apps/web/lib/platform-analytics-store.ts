import fs from "fs";
import path from "path";
export * from "./platform-analytics-content.ts";
import {
  type AnalyticsTimeframe,
  type FunnelStageData,
  type AcquisitionChannelMetric,
  type AbandonedCartItem,
  type CohortMonthData,
  type AtRiskLearner,
  type CourseUnitEconomic,
  type PlatformAnalyticsStats,
  INITIAL_FUNNEL_STAGES,
  INITIAL_ACQUISITION_CHANNELS,
  INITIAL_ABANDONED_CARTS,
  INITIAL_COHORTS_DATA,
  INITIAL_AT_RISK_LEARNERS,
  INITIAL_COURSE_ECONOMICS,
} from "./platform-analytics-content.ts";

interface AnalyticsStoragePayload {
  abandonedCarts: AbandonedCartItem[];
  cohorts: CohortMonthData[];
  atRiskLearners: AtRiskLearner[];
  courseEconomics: CourseUnitEconomic[];
}

let inMemoryAnalytics: AnalyticsStoragePayload | null = null;

function resolveStoragePath(): string {
  const candidateWeb = path.join(process.cwd(), "apps", "web", "data", "platform-analytics-operations.json");
  const candidateLocal = path.join(process.cwd(), "data", "platform-analytics-operations.json");
  if (fs.existsSync(path.dirname(candidateWeb))) {
    return candidateWeb;
  }
  return candidateLocal;
}

function persistToDisk(): void {
  if (!inMemoryAnalytics) return;
  try {
    const filePath = resolveStoragePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(inMemoryAnalytics, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not persist platform analytics data to disk:", err);
  }
}

export function getPlatformAnalyticsStorage(): AnalyticsStoragePayload {
  if (inMemoryAnalytics) {
    return inMemoryAnalytics;
  }

  const filePath = resolveStoragePath();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      inMemoryAnalytics = JSON.parse(raw);
      return inMemoryAnalytics!;
    }
  } catch (err) {
    console.warn("Could not read platform-analytics-operations.json, seeding initial data:", err);
  }

  inMemoryAnalytics = {
    abandonedCarts: [...INITIAL_ABANDONED_CARTS],
    cohorts: [...INITIAL_COHORTS_DATA],
    atRiskLearners: [...INITIAL_AT_RISK_LEARNERS],
    courseEconomics: [...INITIAL_COURSE_ECONOMICS],
  };

  persistToDisk();
  return inMemoryAnalytics;
}

export function getPlatformAnalyticsData(timeframe: AnalyticsTimeframe = "30d") {
  const storage = getPlatformAnalyticsStorage();
  const funnelStages = INITIAL_FUNNEL_STAGES[timeframe] || INITIAL_FUNNEL_STAGES["30d"];

  return {
    timeframe,
    funnelStages,
    acquisitionChannels: INITIAL_ACQUISITION_CHANNELS,
    abandonedCarts: storage.abandonedCarts,
    cohorts: storage.cohorts,
    atRiskLearners: storage.atRiskLearners,
    courseEconomics: storage.courseEconomics,
  };
}

export function getPlatformAnalyticsStats(timeframe: AnalyticsTimeframe = "30d"): PlatformAnalyticsStats {
  const data = getPlatformAnalyticsData(timeframe);
  const stages = data.funnelStages;
  const visitors = stages[0]?.visitorCount || 0;
  const checkouts = stages[2]?.visitorCount || 0;
  const paidOrders = stages[3]?.visitorCount || 0;

  const convRate = visitors > 0 ? Number(((paidOrders / visitors) * 100).toFixed(2)) : 0;

  const abandonedSum = data.abandonedCarts
    .filter((c) => c.recoveryStatus === "uncontacted" || c.recoveryStatus === "coupon_sent")
    .reduce((sum, c) => sum + c.cartValueToman, 0);

  const recoveredSum = data.abandonedCarts
    .filter((c) => c.recoveryStatus === "recovered")
    .reduce((sum, c) => sum + c.cartValueToman, 0);

  const totalGrossRev = data.courseEconomics.reduce((sum, c) => sum + c.grossRevenueToman, 0);

  return {
    totalVisitors: visitors,
    totalCheckouts: checkouts,
    totalPaidOrders: paidOrders,
    overallConversionRate: convRate,
    abandonedCartValueToman: abandonedSum,
    recoveredCartValueToman: recoveredSum,
    dauToMauRatio: 42.6, // چسبندگی سالم پلتفرم آموزشی
    avgDailyLearningMinutes: 28.5,
    grossPlatformRevenueToman: totalGrossRev,
  };
}

export function sendAbandonedCartRecoveryCoupon(
  cartId: string,
  discountPercent: number = 25
): { success: boolean; couponCode: string; message: string } {
  const storage = getPlatformAnalyticsStorage();
  const cart = storage.abandonedCarts.find((c) => c.id === cartId);

  if (!cart) {
    return { success: false, couponCode: "", message: "سبد خرید مورد نظر یافت نشد." };
  }

  const generatedCode = `WINBACK-${discountPercent}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  cart.recoveryStatus = "coupon_sent";
  cart.discountCouponCode = generatedCode;

  persistToDisk();

  return {
    success: true,
    couponCode: generatedCode,
    message: `کوپن نجات ${discountPercent}٪ با کد ${generatedCode} برای کاربر ${cart.userName} پیامک شد.`,
  };
}

export function sendLearnerMotivationNudge(userId: string): {
  success: boolean;
  message: string;
} {
  const storage = getPlatformAnalyticsStorage();
  const learner = storage.atRiskLearners.find((l) => l.userId === userId);

  if (!learner) {
    return { success: false, message: "زبان‌آموز در لیست پرخطر یافت نشد." };
  }

  learner.nudgeSent = true;
  persistToDisk();

  return {
    success: true,
    message: `تلنگر انگیزشی، یادآوری لایتنر و تمرین هفتگی برای ${learner.userName} ارسال گردید.`,
  };
}

export function resetPlatformAnalyticsDataToInitial(): void {
  inMemoryAnalytics = {
    abandonedCarts: JSON.parse(JSON.stringify(INITIAL_ABANDONED_CARTS)),
    cohorts: JSON.parse(JSON.stringify(INITIAL_COHORTS_DATA)),
    atRiskLearners: JSON.parse(JSON.stringify(INITIAL_AT_RISK_LEARNERS)),
    courseEconomics: JSON.parse(JSON.stringify(INITIAL_COURSE_ECONOMICS)),
  };
  persistToDisk();
}
