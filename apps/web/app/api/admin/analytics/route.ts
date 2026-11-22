import { errorMessage } from "../../../../lib/error-message.ts";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";

import {
  getPlatformAnalyticsData,
  getPlatformAnalyticsStats,
  sendAbandonedCartRecoveryCoupon,
  sendLearnerMotivationNudge,
  resetPlatformAnalyticsDataToInitial,
  type AnalyticsTimeframe,
} from "@/lib/platform-analytics-store";
import { recordAuditLog } from "@/lib/admin-ops";

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") return new Response(null, { status: 404 });
  try {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

    const { searchParams } = new URL(req.url);
    const timeframeParam = (searchParams.get("timeframe") || "30d") as AnalyticsTimeframe;
    const timeframe: AnalyticsTimeframe = ["7d", "30d", "90d", "1y"].includes(timeframeParam)
      ? timeframeParam
      : "30d";

    const data = getPlatformAnalyticsData(timeframe);
    const stats = getPlatformAnalyticsStats(timeframe);

    return NextResponse.json({
      success: true,
      data,
      stats,
    });
  } catch (error: unknown) {
    console.error("Error in GET /api/admin/analytics:", error);
    return NextResponse.json(
      { success: false, error: errorMessage(error) || "خطای سرور در واکشی داده‌های تحلیلی پلتفرم" },
      { status: 500 }
    );
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
    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: "فیلد action الزامی است." },
        { status: 400 }
      );
    }

    switch (action) {
      case "send_recovery_coupon": {
        const { cartId, discountPercent } = body;
        if (!cartId) {
          return NextResponse.json(
            { success: false, error: "شناسه سبد خرید (cartId) الزامی است." },
            { status: 400 }
          );
        }
        const percent = discountPercent ? Number(discountPercent) : 25;
        const result = sendAbandonedCartRecoveryCoupon(cartId, percent);
        if (result.success) {
          recordAuditLog({
            actor_id: auth.user?.id || "admin",
            actor_email: "admin@endoora.com",
            actor_role: auth.user?.role || "administrator",
            target_app: "analytics",
            target_model: "AbandonedCart",
            target_pk: cartId,
            action: "update",
            before_summary: { recoveryStatus: "uncontacted" },
            after_summary: { recoveryStatus: "coupon_sent", couponCode: result.couponCode },
            reason: `ارسال کوپن تخفیف نجات ${percent}٪ برای سبد خرید رهاشده #${cartId}`,
            request_method: "POST",
            request_path: "/api/admin/analytics",
            environment: "production",
          });
        }
        return NextResponse.json(result);
      }

      case "send_motivation_nudge": {
        const { userId } = body;
        if (!userId) {
          return NextResponse.json(
            { success: false, error: "شناسه زبان‌آموز (userId) الزامی است." },
            { status: 400 }
          );
        }
        const result = sendLearnerMotivationNudge(userId);
        if (result.success) {
          recordAuditLog({
            actor_id: auth.user?.id || "admin",
            actor_email: "admin@endoora.com",
            actor_role: auth.user?.role || "administrator",
            target_app: "analytics",
            target_model: "AtRiskLearner",
            target_pk: userId,
            action: "update",
            before_summary: { nudgeSent: false },
            after_summary: { nudgeSent: true },
            reason: `ارسال پیامک و تلنگر انگیزشی برای پیشگیری از ریزش زبان‌آموز ${userId}`,
            request_method: "POST",
            request_path: "/api/admin/analytics",
            environment: "production",
          });
        }
        return NextResponse.json(result);
      }

      case "reset_seed": {
      if ((process.env.NODE_ENV as string) === "production") {
        return NextResponse.json({ success: false, error: "عملیات بازنشانی داده‌های کارخانه در محیط عملیاتی غیرمجاز است." }, { status: 403 });
      }

        resetPlatformAnalyticsDataToInitial();
        recordAuditLog({
          actor_id: auth.user?.id || "admin",
          actor_email: "admin@endoora.com",
          actor_role: auth.user?.role || "administrator",
          target_app: "analytics",
          target_model: "AnalyticsSeed",
          target_pk: "seed_data",
          action: "update",
          before_summary: {},
          after_summary: { reset: true },
          reason: "بازنشانی دیتای اولیه هوش تجاری و تحلیل قیف",
          request_method: "POST",
          request_path: "/api/admin/analytics",
          environment: "production",
        });
        return NextResponse.json({
          success: true,
          message: "داده‌های آزمایشی هوش تجاری و تحلیل قیف با موفقیت بازنشانی شدند.",
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: `عملیات نامعتبر: ${action}` },
          { status: 400 }
        );
    }
  } catch (error: unknown) {
    console.error("Error in POST /api/admin/analytics:", error);
    return NextResponse.json(
      { success: false, error: errorMessage(error) || "خطای پردازش عملیات هوش تجاری" },
      { status: 500 }
    );
  }
}
