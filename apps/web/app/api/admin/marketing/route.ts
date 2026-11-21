import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";

import {
  getMarketingData,
  getMarketingStats,
  createCoupon,
  toggleCouponStatus,
  deleteCoupon,
  createReferralPartner,
  updateCampaign,
  toggleCampaignStatus,
  saveMarketingDataToDisk,
  INITIAL_COUPONS,
  INITIAL_REFERRAL_PARTNERS,
  INITIAL_FLASH_CAMPAIGN,
  PRODUCT_SCOPE_LABELS,
  PARTNER_TIER_LABELS,
  type ReferralPartnerTier,
} from "@/lib/marketing-store";
import { recordAuditLog } from "@/lib/admin-ops";

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") return new Response(null, { status: 404 });
  try {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || searchParams.get("q");
    const couponStatus = searchParams.get("coupon_status");
    const partnerTier = searchParams.get("partner_tier");

    const data = getMarketingData();
    let coupons = [...data.coupons];
    let partners = [...data.partners];
    const campaign = data.campaign;

    // Filter coupons
    if (couponStatus && couponStatus !== "all") {
      if (couponStatus === "active") coupons = coupons.filter((c) => c.isActive);
      else if (couponStatus === "inactive") coupons = coupons.filter((c) => !c.isActive);
    }

    // Filter partners
    if (partnerTier && partnerTier !== "all") {
      partners = partners.filter((p) => p.tier === (partnerTier as ReferralPartnerTier));
    }

    // Search query
    if (search) {
      const q = search.trim().toLowerCase();
      coupons = coupons.filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );

      partners = partners.filter(
        (p) =>
          p.partnerName.toLowerCase().includes(q) ||
          p.referralCode.toLowerCase().includes(q) ||
          p.partnerPhone.includes(q)
      );
    }

    const stats = getMarketingStats();

    return NextResponse.json({
      success: true,
      coupons,
      partners,
      campaign,
      stats,
      productScopeLabels: PRODUCT_SCOPE_LABELS,
      partnerTierLabels: PARTNER_TIER_LABELS,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "خطا در دریافت داده‌های بازاریابی";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") return new Response(null, { status: 404 });
  try {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

    const body = await req.json();
    const { action, actor } = body;

    if (!action) {
      return NextResponse.json({ success: false, error: "فیلد action الزامی است." }, { status: 400 });
    }

    // 1. Create Coupon
    if (action === "create_coupon") {
      const res = createCoupon(body.couponData);
      if (!res.success || !res.coupon) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      try {
        recordAuditLog({
          actor_id: auth.user?.id || "admin",
          actor_email: actor || "growth@endoora.ir",
          actor_role: auth.user?.role || "administrator",
          action: "create",
          target_app: "marketing",
          target_model: "Coupon",
          target_pk: res.coupon.id,
          before_summary: {},
          after_summary: { code: res.coupon.code, discountValue: res.coupon.discountValue },
          reason: `ایجاد کد تخفیف جدید «${res.coupon.code}»`,
          request_method: "POST",
          request_path: "/api/admin/marketing",
          environment: "production",
        });
      } catch (logErr) {
        console.warn("Audit log error:", logErr);
      }

      return NextResponse.json({
        success: true,
        message: `کد تخفیف «${res.coupon.code}» با موفقیت تعریف گردید.`,
        coupon: res.coupon,
        stats: getMarketingStats(),
      });
    }

    // 2. Toggle Coupon Status
    if (action === "toggle_coupon") {
      const { couponId } = body;
      const res = toggleCouponStatus(couponId);
      if (!res.success || !res.coupon) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      try {
        recordAuditLog({
          actor_id: auth.user?.id || "admin",
          actor_email: actor || "growth@endoora.ir",
          actor_role: auth.user?.role || "administrator",
          action: "update",
          target_app: "marketing",
          target_model: "Coupon",
          target_pk: couponId,
          before_summary: { isActive: !res.coupon.isActive },
          after_summary: { isActive: res.coupon.isActive },
          reason: `تغییر وضعیت کد تخفیف «${res.coupon.code}» به ${res.coupon.isActive ? "فعال" : "غیرفعال"}`,
          request_method: "POST",
          request_path: "/api/admin/marketing",
          environment: "production",
        });
      } catch (logErr) {
        console.warn("Audit log error:", logErr);
      }

      return NextResponse.json({
        success: true,
        message: `وضعیت کد تخفیف به ${res.coupon.isActive ? "فعال" : "غیرفعال"} تغییر یافت.`,
        coupon: res.coupon,
        stats: getMarketingStats(),
      });
    }

    // 3. Delete Coupon
    if (action === "delete_coupon") {
      const { couponId } = body;
      const res = deleteCoupon(couponId);
      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: "کد تخفیف با موفقیت حذف گردید.",
        stats: getMarketingStats(),
      });
    }

    // 4. Create Referral Partner
    if (action === "create_partner") {
      const res = createReferralPartner(body.partnerData);
      if (!res.success || !res.partner) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      try {
        recordAuditLog({
          actor_id: auth.user?.id || "admin",
          actor_email: actor || "growth@endoora.ir",
          actor_role: auth.user?.role || "administrator",
          action: "create",
          target_app: "referral",
          target_model: "ReferralPartner",
          target_pk: res.partner.id,
          before_summary: {},
          after_summary: { code: res.partner.referralCode, name: res.partner.partnerName },
          reason: `ثبت معرف و پارتنر جدید «${res.partner.partnerName}» با کد «${res.partner.referralCode}»`,
          request_method: "POST",
          request_path: "/api/admin/marketing",
          environment: "production",
        });
      } catch (logErr) {
        console.warn("Audit log error:", logErr);
      }

      return NextResponse.json({
        success: true,
        message: `پارتنر جدید «${res.partner.partnerName}» با کد «${res.partner.referralCode}» ثبت شد.`,
        partner: res.partner,
        stats: getMarketingStats(),
      });
    }

    // 5. Update Flash Sale Campaign
    if (action === "update_campaign") {
      const res = updateCampaign(body.campaignData);
      return NextResponse.json({
        success: true,
        message: "تنظیمات کمپین شگفت‌انگیز با موفقیت ذخیره شد.",
        campaign: res.campaign,
        stats: getMarketingStats(),
      });
    }

    // 6. Toggle Flash Sale Campaign Status
    if (action === "toggle_campaign") {
      const res = toggleCampaignStatus();
      return NextResponse.json({
        success: true,
        message: `وضعیت کمپین شگفت‌انگیز به ${res.campaign?.isActive ? "فعال" : "غیرفعال"} تغییر یافت.`,
        campaign: res.campaign,
        stats: getMarketingStats(),
      });
    }

    // 7. Reset Seed
    if (action === "reset_seed") {
      if ((process.env.NODE_ENV as string) === "production") {
        return NextResponse.json({ success: false, error: "عملیات بازنشانی داده‌های کارخانه در محیط عملیاتی غیرمجاز است." }, { status: 403 });
      }

      saveMarketingDataToDisk({
        coupons: [...INITIAL_COUPONS],
        partners: [...INITIAL_REFERRAL_PARTNERS],
        campaign: { ...INITIAL_FLASH_CAMPAIGN },
      });

      return NextResponse.json({
        success: true,
        message: "داده‌های ماژول بازاریابی به مقادیر اولیه بازنشانی شدند.",
        stats: getMarketingStats(),
      });
    }

    return NextResponse.json({ success: false, error: "عملیات ارسالی نامعتبر است." }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "خطا در پردازش عملیات بازاریابی";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
