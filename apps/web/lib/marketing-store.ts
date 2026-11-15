import fs from "fs";
import path from "path";
export * from "./marketing-content.ts";
import {
  type CouponRecord,
  type ReferralPartnerRecord,
  type FlashSaleCampaignRecord,
  type MarketingStats,
  type ProductScope,
  INITIAL_COUPONS,
  INITIAL_REFERRAL_PARTNERS,
  INITIAL_FLASH_CAMPAIGN,
} from "./marketing-content.ts";

interface MarketingStoragePayload {
  coupons: CouponRecord[];
  partners: ReferralPartnerRecord[];
  campaign: FlashSaleCampaignRecord;
}

let inMemoryMarketing: MarketingStoragePayload | null = null;

function resolveStoragePath(): string {
  const candidateWeb = path.join(process.cwd(), "apps", "web", "data", "marketing-operations.json");
  const candidateLocal = path.join(process.cwd(), "data", "marketing-operations.json");
  if (fs.existsSync(path.dirname(candidateWeb))) {
    return candidateWeb;
  }
  return candidateLocal;
}

export function getMarketingData(): MarketingStoragePayload {
  if (inMemoryMarketing) {
    return inMemoryMarketing;
  }

  const filePath = resolveStoragePath();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      inMemoryMarketing = JSON.parse(raw);
      return inMemoryMarketing!;
    }
  } catch (err) {
    console.warn("Could not read marketing-operations.json from disk, seeding with initial data:", err);
  }

  inMemoryMarketing = {
    coupons: [...INITIAL_COUPONS],
    partners: [...INITIAL_REFERRAL_PARTNERS],
    campaign: { ...INITIAL_FLASH_CAMPAIGN },
  };
  saveMarketingDataToDisk(inMemoryMarketing);
  return inMemoryMarketing;
}

export function saveMarketingDataToDisk(data: MarketingStoragePayload): boolean {
  inMemoryMarketing = data;
  try {
    const filePath = resolveStoragePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.warn("Failed to write marketing-operations.json to disk:", err);
    return false;
  }
}

export function getMarketingStats(): MarketingStats {
  const data = getMarketingData();
  const coupons = data.coupons;
  const partners = data.partners;
  const campaign = data.campaign;

  const activeCoupons = coupons.filter((c) => c.isActive);
  const activePartners = partners.filter((p) => p.isActive);

  const totalReferralEarnings = partners.reduce((sum, p) => sum + (p.totalEarningsToman || 0), 0);

  return {
    activeCouponsCount: activeCoupons.length,
    totalDiscountsGivenToman: 18450000,
    activePartnersCount: activePartners.length,
    totalReferralRevenueToman: totalReferralEarnings,
    campaignsActiveCount: campaign.isActive ? 1 : 0,
    totalFlashSaleRevenueToman: campaign.totalRevenueGeneratedToman || 0,
  };
}

// 1. Coupon Validation Engine
export function validateCouponForBasket(params: {
  code: string;
  basketAmountToman: number;
  scope?: ProductScope;
  userPhone?: string;
}): {
  valid: boolean;
  discountAmountToman: number;
  finalPayableToman: number;
  error?: string;
  coupon?: CouponRecord;
} {
  const { code, basketAmountToman, scope, userPhone } = params;

  if (!code || !code.trim()) {
    return {
      valid: false,
      discountAmountToman: 0,
      finalPayableToman: basketAmountToman,
      error: "لطفاً کد تخفیف را وارد نمایید.",
    };
  }

  const data = getMarketingData();
  const normalizedCode = code.trim().toUpperCase();
  const coupon = data.coupons.find((c) => c.code.toUpperCase() === normalizedCode);

  if (!coupon) {
    return {
      valid: false,
      discountAmountToman: 0,
      finalPayableToman: basketAmountToman,
      error: "کد تخفیف وارد شده معتبر نبوده یا یافت نشد.",
    };
  }

  if (!coupon.isActive) {
    return {
      valid: false,
      discountAmountToman: 0,
      finalPayableToman: basketAmountToman,
      error: "این کد تخفیف در حال حاضر غیرفعال شده است.",
    };
  }

  const now = new Date();
  const startsAt = new Date(coupon.startsAt);
  const expiresAt = new Date(coupon.expiresAt);

  if (now < startsAt) {
    return {
      valid: false,
      discountAmountToman: 0,
      finalPayableToman: basketAmountToman,
      error: "زمان فعال‌سازی این کد تخفیف هنوز فرا نرسیده است.",
    };
  }

  if (now > expiresAt) {
    return {
      valid: false,
      discountAmountToman: 0,
      finalPayableToman: basketAmountToman,
      error: "مهلت استفاده از این کد تخفیف به پایان رسیده است.",
    };
  }

  if (coupon.usedCountTotal >= coupon.maxUsageTotal) {
    return {
      valid: false,
      discountAmountToman: 0,
      finalPayableToman: basketAmountToman,
      error: "ظرفیت استفاده از این کد تخفیف تکمیل شده است.",
    };
  }

  if (basketAmountToman < coupon.minBasketValueToman) {
    return {
      valid: false,
      discountAmountToman: 0,
      finalPayableToman: basketAmountToman,
      error: `حداقل مبلغ سفارش برای اعمال این کد تخفیف ${coupon.minBasketValueToman.toLocaleString()} تومان است.`,
    };
  }

  // Scope check
  if (coupon.scope !== "all" && scope && coupon.scope !== scope) {
    return {
      valid: false,
      discountAmountToman: 0,
      finalPayableToman: basketAmountToman,
      error: "این کد تخفیف برای محصول یا خدمت انتخاب‌شده در سبد خرید معتبر نیست.",
    };
  }

  // Win-back phone restriction check
  if (coupon.restrictedToPhones && coupon.restrictedToPhones.length > 0) {
    if (!userPhone || !coupon.restrictedToPhones.includes(userPhone.trim())) {
      return {
        valid: false,
        discountAmountToman: 0,
        finalPayableToman: basketAmountToman,
        error: "این کد تخفیف انحصاری بوده و برای حساب کاربری شما مجاز نیست.",
      };
    }
  }

  // Compute discount amount
  let discountAmountToman = 0;
  if (coupon.discountType === "fixed_toman") {
    discountAmountToman = Math.min(coupon.discountValue, basketAmountToman);
  } else if (coupon.discountType === "percentage") {
    const rawDiscount = Math.round((basketAmountToman * coupon.discountValue) / 100);
    if (coupon.maxDiscountCapToman && coupon.maxDiscountCapToman > 0) {
      discountAmountToman = Math.min(rawDiscount, coupon.maxDiscountCapToman);
    } else {
      discountAmountToman = rawDiscount;
    }
  }

  const finalPayableToman = Math.max(0, basketAmountToman - discountAmountToman);

  return {
    valid: true,
    discountAmountToman,
    finalPayableToman,
    coupon,
  };
}

// 2. Coupon Management
export function createCoupon(data: Omit<CouponRecord, "id" | "usedCountTotal" | "createdAt">): {
  success: boolean;
  coupon?: CouponRecord;
  error?: string;
} {
  if (!data.code || !data.code.trim()) {
    return { success: false, error: "کد تخفیف نمی‌تواند خالی باشد." };
  }

  const store = getMarketingData();
  const normalized = data.code.trim().toUpperCase();
  if (store.coupons.some((c) => c.code.toUpperCase() === normalized)) {
    return { success: false, error: `کد تخفیف «${normalized}» از قبل در سیستم وجود دارد.` };
  }

  const newCoupon: CouponRecord = {
    ...data,
    id: `cpn-${Date.now().toString(36)}`,
    code: normalized,
    usedCountTotal: 0,
    createdAt: new Date().toISOString(),
  };

  store.coupons.unshift(newCoupon);
  saveMarketingDataToDisk(store);
  return { success: true, coupon: newCoupon };
}

export function toggleCouponStatus(id: string): { success: boolean; coupon?: CouponRecord; error?: string } {
  const store = getMarketingData();
  const coupon = store.coupons.find((c) => c.id === id);
  if (!coupon) {
    return { success: false, error: "کوپن یافت نشد." };
  }

  coupon.isActive = !coupon.isActive;
  saveMarketingDataToDisk(store);
  return { success: true, coupon };
}

export function deleteCoupon(id: string): { success: boolean; error?: string } {
  const store = getMarketingData();
  const idx = store.coupons.findIndex((c) => c.id === id);
  if (idx === -1) {
    return { success: false, error: "کوپن یافت نشد." };
  }

  store.coupons.splice(idx, 1);
  saveMarketingDataToDisk(store);
  return { success: true };
}

// 3. Referral Management
export function createReferralPartner(
  data: Omit<
    ReferralPartnerRecord,
    "id" | "totalInvitedCount" | "successfulConversionsCount" | "totalEarningsToman" | "pendingPayoutToman" | "createdAt"
  >
): {
  success: boolean;
  partner?: ReferralPartnerRecord;
  error?: string;
} {
  if (!data.referralCode || !data.referralCode.trim()) {
    return { success: false, error: "کد معرف الزامی است." };
  }

  const store = getMarketingData();
  const normalizedCode = data.referralCode.trim().toUpperCase();
  if (store.partners.some((p) => p.referralCode.toUpperCase() === normalizedCode)) {
    return { success: false, error: `کد معرف «${normalizedCode}» تکراری است.` };
  }

  const newPartner: ReferralPartnerRecord = {
    ...data,
    id: `ref-${Date.now().toString(36)}`,
    referralCode: normalizedCode,
    totalInvitedCount: 0,
    successfulConversionsCount: 0,
    totalEarningsToman: 0,
    pendingPayoutToman: 0,
    createdAt: new Date().toISOString(),
  };

  store.partners.unshift(newPartner);
  saveMarketingDataToDisk(store);
  return { success: true, partner: newPartner };
}

export function recordReferralConversion(
  referralCode: string,
  orderAmountToman: number
): { success: boolean; partner?: ReferralPartnerRecord; error?: string } {
  const store = getMarketingData();
  const partner = store.partners.find(
    (p) => p.referralCode.toUpperCase() === referralCode.trim().toUpperCase() && p.isActive
  );

  if (!partner) {
    return { success: false, error: "کد معرف معتبر یا فعال یافت نشد." };
  }

  const commission = Math.round((orderAmountToman * partner.commissionRatePercent) / 100);
  partner.successfulConversionsCount += 1;
  partner.totalEarningsToman += commission;
  partner.pendingPayoutToman += commission;

  saveMarketingDataToDisk(store);
  return { success: true, partner };
}

// 4. Flash Sale Campaign Management
export function updateCampaign(data: Partial<FlashSaleCampaignRecord>): {
  success: boolean;
  campaign?: FlashSaleCampaignRecord;
} {
  const store = getMarketingData();
  store.campaign = {
    ...store.campaign,
    ...data,
  };
  saveMarketingDataToDisk(store);
  return { success: true, campaign: store.campaign };
}

export function toggleCampaignStatus(): { success: boolean; campaign?: FlashSaleCampaignRecord } {
  const store = getMarketingData();
  store.campaign.isActive = !store.campaign.isActive;
  saveMarketingDataToDisk(store);
  return { success: true, campaign: store.campaign };
}
