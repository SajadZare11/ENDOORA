import { errorMessage } from "../../../../lib/error-message.ts";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";

import {
  getBroadcastData,
  sendTestNotificationToAdmin,
  dispatchBroadcastCampaign,
  cancelScheduledCampaign,
  resetBroadcastDataToInitial,
  type BroadcastChannel,
  type BroadcastPriority,
  type AudienceSegmentKey,
} from "@/lib/broadcast-notifications-store";
import { recordAuditLog } from "@/lib/admin-ops";

export async function GET() {
  if (process.env.NODE_ENV === "production") return new Response(null, { status: 404 });
  try {
    const data = getBroadcastData();
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: unknown) {
    console.error("Error in GET /api/admin/broadcast:", error);
    return NextResponse.json(
      { success: false, error: errorMessage(error) || "خطای سرور در واکشی داده‌های مرکز اعلان" },
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
      case "send_test": {
        const { title, body: msgBody, channels, adminPhone } = body;
        if (!title || !msgBody) {
          return NextResponse.json(
            { success: false, error: "عنوان و متن پیام الزامی است." },
            { status: 400 }
          );
        }
        const result = sendTestNotificationToAdmin(
          {
            title,
            body: msgBody,
            channels: (channels as BroadcastChannel[]) || ["in_app", "sms"],
          },
          adminPhone || "09121234567"
        );
        if (result.success) {
          recordAuditLog({
            actor_id: auth.user?.id || "admin",
            actor_email: "admin@endoora.com",
            actor_role: auth.user?.role || "administrator",
            target_app: "broadcast",
            target_model: "BroadcastTest",
            target_pk: "admin_test",
            action: "create",
            before_summary: {},
            after_summary: { title, adminPhone },
            reason: `ارسال آزمایشی اعلان "${title}" به تلفن همراه ادمین`,
            request_method: "POST",
            request_path: "/api/admin/broadcast",
            environment: "production",
          });
        }
        return NextResponse.json(result);
      }

      case "dispatch_campaign": {
        const {
          title,
          body: msgBody,
          ctaText,
          ctaUrl,
          channels,
          priority,
          targetSegment,
          scheduledFor,
        } = body;

        if (!title || !msgBody || !channels || !channels.length || !targetSegment) {
          return NextResponse.json(
            { success: false, error: "فیلدهای عنوان، متن پیام، کانال‌ها و سگمنت هدف الزامی هستند." },
            { status: 400 }
          );
        }

        const result = dispatchBroadcastCampaign({
          title,
          body: msgBody,
          ctaText,
          ctaUrl,
          channels: channels as BroadcastChannel[],
          priority: (priority as BroadcastPriority) || "normal",
          targetSegment: targetSegment as AudienceSegmentKey,
          scheduledFor,
          createdBy: "مدیر ارشد ایندورا",
        });

        recordAuditLog({
          actor_id: auth.user?.id || "admin",
          actor_email: "admin@endoora.com",
          actor_role: auth.user?.role || "administrator",
          target_app: "broadcast",
          target_model: "BroadcastCampaign",
          target_pk: result.campaign.id,
          action: "create",
          before_summary: {},
          after_summary: {
            title,
            targetSegment,
            channels,
            estimatedRecipients: result.campaign.estimatedRecipients,
          },
          reason: `شلیک کمپین سراسری "${title}" به سگمنت ${targetSegment}`,
          request_method: "POST",
          request_path: "/api/admin/broadcast",
          environment: "production",
        });

        return NextResponse.json(result);
      }

      case "cancel_campaign": {
        const { campaignId } = body;
        if (!campaignId) {
          return NextResponse.json(
            { success: false, error: "شناسه کمپین (campaignId) الزامی است." },
            { status: 400 }
          );
        }
        const result = cancelScheduledCampaign(campaignId);
        if (result.success) {
          recordAuditLog({
            actor_id: auth.user?.id || "admin",
            actor_email: "admin@endoora.com",
            actor_role: auth.user?.role || "administrator",
            target_app: "broadcast",
            target_model: "BroadcastCampaign",
            target_pk: campaignId,
            action: "update",
            before_summary: { status: "scheduled" },
            after_summary: { status: "cancelled" },
            reason: `لغو ارسال زمان‌بندی‌شده کمپین #${campaignId}`,
            request_method: "POST",
            request_path: "/api/admin/broadcast",
            environment: "production",
          });
        }
        return NextResponse.json(result);
      }

      case "reset_seed": {
      if ((process.env.NODE_ENV as string) === "production") {
        return NextResponse.json({ success: false, error: "عملیات بازنشانی داده‌های کارخانه در محیط عملیاتی غیرمجاز است." }, { status: 403 });
      }

        resetBroadcastDataToInitial();
        recordAuditLog({
          actor_id: auth.user?.id || "admin",
          actor_email: "admin@endoora.com",
          actor_role: auth.user?.role || "administrator",
          target_app: "broadcast",
          target_model: "BroadcastSeed",
          target_pk: "seed_data",
          action: "update",
          before_summary: {},
          after_summary: { reset: true },
          reason: "بازنشانی داده‌های اولیه مرکز اعلان همگانی و نوتیفیکیشن",
          request_method: "POST",
          request_path: "/api/admin/broadcast",
          environment: "production",
        });
        return NextResponse.json({
          success: true,
          message: "داده‌های آزمایشی مرکز اعلان با موفقیت بازنشانی شدند.",
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: `عملیات نامعتبر: ${action}` },
          { status: 400 }
        );
    }
  } catch (error: unknown) {
    console.error("Error in POST /api/admin/broadcast:", error);
    return NextResponse.json(
      { success: false, error: errorMessage(error) || "خطای پردازش عملیات اعلان" },
      { status: 500 }
    );
  }
}
