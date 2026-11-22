import { errorMessage } from "../../../../lib/error-message.ts";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";

import {
  getCommunityModerationData,
  approveComment,
  rejectComment,
  postOfficialReply,
  toggleCommentPin,
  toggleCommentLock,
  addBannedKeywordRule,
  toggleBannedKeywordRule,
  deleteBannedKeywordRule,
  applyUserSanction,
  liftUserSanction,
  resetCommunityModerationDataToInitial,
  type SanctionType,
} from "@/lib/community-moderation-store";
import { recordAuditLog } from "@/lib/admin-ops";

export async function GET() {
  if (process.env.NODE_ENV === "production") return new Response(null, { status: 404 });
  try {
    const data = getCommunityModerationData();
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: unknown) {
    console.error("Error in GET /api/admin/community:", error);
    return NextResponse.json(
      { success: false, error: errorMessage(error) || "خطای سرور در واکشی داده‌های نظارت بر کامیونیتی" },
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
      case "approve_comment": {
        const { commentId } = body;
        if (!commentId) {
          return NextResponse.json(
            { success: false, error: "شناسه دیدگاه (commentId) الزامی است." },
            { status: 400 }
          );
        }
        const result = approveComment(commentId, "مدیر ارشد نظارت");
        if (result.success) {
          recordAuditLog({
            actor_id: auth.user?.id || "admin",
            actor_email: "admin@endoora.com",
            actor_role: auth.user?.role || "administrator",
            target_app: "community",
            target_model: "CommunityComment",
            target_pk: commentId,
            action: "update",
            before_summary: { status: "pending" },
            after_summary: { status: "approved" },
            reason: `تایید و انتشار عمومی دیدگاه #${commentId} از ${result.comment.authorName}`,
            request_method: "POST",
            request_path: "/api/admin/community",
            environment: "production",
          });
        }
        return NextResponse.json(result);
      }

      case "reject_comment": {
        const { commentId, reason } = body;
        if (!commentId || !reason) {
          return NextResponse.json(
            { success: false, error: "شناسه دیدگاه و دلیل رد الزامی هستند." },
            { status: 400 }
          );
        }
        const result = rejectComment(commentId, reason, "مدیر ارشد نظارت");
        if (result.success) {
          recordAuditLog({
            actor_id: auth.user?.id || "admin",
            actor_email: "admin@endoora.com",
            actor_role: auth.user?.role || "administrator",
            target_app: "community",
            target_model: "CommunityComment",
            target_pk: commentId,
            action: "update",
            before_summary: { status: "pending" },
            after_summary: { status: "rejected", reason },
            reason: `رد دیدگاه #${commentId}: ${reason}`,
            request_method: "POST",
            request_path: "/api/admin/community",
            environment: "production",
          });
        }
        return NextResponse.json(result);
      }

      case "post_official_reply": {
        const { commentId, replyText, staffName, staffRole } = body;
        if (!commentId || !replyText) {
          return NextResponse.json(
            { success: false, error: "شناسه دیدگاه و متن پاسخ رسمی الزامی هستند." },
            { status: 400 }
          );
        }
        const result = postOfficialReply(commentId, replyText, staffName, staffRole);
        if (result.success) {
          recordAuditLog({
            actor_id: auth.user?.id || "admin",
            actor_email: "admin@endoora.com",
            actor_role: auth.user?.role || "administrator",
            target_app: "community",
            target_model: "CommunityComment",
            target_pk: commentId,
            action: "create",
            before_summary: {},
            after_summary: { commentId, hasOfficialReply: true },
            reason: `ارسال پاسخ رسمی مدیریت به دیدگاه #${commentId}`,
            request_method: "POST",
            request_path: "/api/admin/community",
            environment: "production",
          });
        }
        return NextResponse.json(result);
      }

      case "toggle_pin": {
        const { commentId, isPinned } = body;
        if (!commentId || typeof isPinned !== "boolean") {
          return NextResponse.json(
            { success: false, error: "شناسه دیدگاه و وضعیت پین الزامی هستند." },
            { status: 400 }
          );
        }
        const result = toggleCommentPin(commentId, isPinned);
        if (result.success) {
          recordAuditLog({
            actor_id: auth.user?.id || "admin",
            actor_email: "admin@endoora.com",
            actor_role: auth.user?.role || "administrator",
            target_app: "community",
            target_model: "CommunityComment",
            target_pk: commentId,
            action: "update",
            before_summary: { isPinned: !isPinned },
            after_summary: { isPinned },
            reason: isPinned ? `پین دیدگاه #${commentId} در صدر تاپیک` : `لغو پین دیدگاه #${commentId}`,
            request_method: "POST",
            request_path: "/api/admin/community",
            environment: "production",
          });
        }
        return NextResponse.json(result);
      }

      case "toggle_lock": {
        const { commentId, isLocked } = body;
        if (!commentId || typeof isLocked !== "boolean") {
          return NextResponse.json(
            { success: false, error: "شناسه دیدگاه و وضعیت قفل الزامی هستند." },
            { status: 400 }
          );
        }
        const result = toggleCommentLock(commentId, isLocked);
        if (result.success) {
          recordAuditLog({
            actor_id: auth.user?.id || "admin",
            actor_email: "admin@endoora.com",
            actor_role: auth.user?.role || "administrator",
            target_app: "community",
            target_model: "CommunityComment",
            target_pk: commentId,
            action: "update",
            before_summary: { isLocked: !isLocked },
            after_summary: { isLocked },
            reason: isLocked ? `قفل تاپیک گفتگو #${commentId}` : `باز کردن قفل تاپیک #${commentId}`,
            request_method: "POST",
            request_path: "/api/admin/community",
            environment: "production",
          });
        }
        return NextResponse.json(result);
      }

      case "add_banned_word": {
        const { pattern, matchType, severity, ruleAction } = body;
        if (!pattern) {
          return NextResponse.json(
            { success: false, error: "الگوی کلمه الزامی است." },
            { status: 400 }
          );
        }
        const result = addBannedKeywordRule({
          pattern,
          matchType,
          severity,
          action: ruleAction || "quarantine",
        });
        if (result.success) {
          recordAuditLog({
            actor_id: auth.user?.id || "admin",
            actor_email: "admin@endoora.com",
            actor_role: auth.user?.role || "administrator",
            target_app: "community",
            target_model: "BannedKeywordRule",
            target_pk: result.rule.id,
            action: "create",
            before_summary: {},
            after_summary: { pattern, severity, action: ruleAction || "quarantine" },
            reason: `ثبت کلمه فیلترشده جدید در شیلد هرزنامه: "${pattern}"`,
            request_method: "POST",
            request_path: "/api/admin/community",
            environment: "production",
          });
        }
        return NextResponse.json(result);
      }

      case "toggle_banned_word": {
        const { ruleId, isActive } = body;
        if (!ruleId || typeof isActive !== "boolean") {
          return NextResponse.json(
            { success: false, error: "شناسه قانون و وضعیت جدید الزامی هستند." },
            { status: 400 }
          );
        }
        const result = toggleBannedKeywordRule(ruleId, isActive);
        return NextResponse.json(result);
      }

      case "delete_banned_word": {
        const { ruleId } = body;
        if (!ruleId) {
          return NextResponse.json(
            { success: false, error: "شناسه قانون (ruleId) الزامی است." },
            { status: 400 }
          );
        }
        const result = deleteBannedKeywordRule(ruleId);
        if (result.success) {
          recordAuditLog({
            actor_id: auth.user?.id || "admin",
            actor_email: "admin@endoora.com",
            actor_role: auth.user?.role || "administrator",
            target_app: "community",
            target_model: "BannedKeywordRule",
            target_pk: ruleId,
            action: "delete",
            before_summary: { ruleId },
            after_summary: { deleted: true },
            reason: `حذف قانون فیلتر کلمه #${ruleId}`,
            request_method: "POST",
            request_path: "/api/admin/community",
            environment: "production",
          });
        }
        return NextResponse.json(result);
      }

      case "apply_sanction": {
        const { userId, userName, userEmail, sanctionType, reason } = body;
        if (!userId || !userName || !sanctionType || !reason) {
          return NextResponse.json(
            { success: false, error: "اطلاعات کاربر، نوع محدودیت انضباطی و دلیل الزامی هستند." },
            { status: 400 }
          );
        }
        const result = applyUserSanction({
          userId,
          userName,
          userEmail: userEmail || `${userId}@user.endoora`,
          sanctionType: sanctionType as SanctionType,
          reason,
          appliedBy: "مدیر ارشد نظارت",
        });
        if (result.success) {
          recordAuditLog({
            actor_id: auth.user?.id || "admin",
            actor_email: "admin@endoora.com",
            actor_role: auth.user?.role || "administrator",
            target_app: "community",
            target_model: "SanctionedUserRecord",
            target_pk: result.record.id,
            action: "create",
            before_summary: {},
            after_summary: { userId, sanctionType, reason },
            reason: `اعمال تنبیه انضباطی ${sanctionType} برای کاربر ${userName}: ${reason}`,
            request_method: "POST",
            request_path: "/api/admin/community",
            environment: "production",
          });
        }
        return NextResponse.json(result);
      }

      case "lift_sanction": {
        const { sanctionId } = body;
        if (!sanctionId) {
          return NextResponse.json(
            { success: false, error: "شناسه پرونده انضباطی (sanctionId) الزامی است." },
            { status: 400 }
          );
        }
        const result = liftUserSanction(sanctionId);
        if (result.success) {
          recordAuditLog({
            actor_id: auth.user?.id || "admin",
            actor_email: "admin@endoora.com",
            actor_role: auth.user?.role || "administrator",
            target_app: "community",
            target_model: "SanctionedUserRecord",
            target_pk: sanctionId,
            action: "update",
            before_summary: { isActive: true },
            after_summary: { isActive: false },
            reason: `لغو محدودیت انضباطی و رفع شدوبن #${sanctionId}`,
            request_method: "POST",
            request_path: "/api/admin/community",
            environment: "production",
          });
        }
        return NextResponse.json(result);
      }

      case "reset_seed": {
      if ((process.env.NODE_ENV as string) === "production") {
        return NextResponse.json({ success: false, error: "عملیات بازنشانی داده‌های کارخانه در محیط عملیاتی غیرمجاز است." }, { status: 403 });
      }

        resetCommunityModerationDataToInitial();
        recordAuditLog({
          actor_id: auth.user?.id || "admin",
          actor_email: "admin@endoora.com",
          actor_role: auth.user?.role || "administrator",
          target_app: "community",
          target_model: "CommunitySeed",
          target_pk: "seed_payload",
          action: "update",
          before_summary: {},
          after_summary: { reset: true },
          reason: "بازنشانی دیتای اولیه سامانه نظارت بر کامیونیتی و تعاملات",
          request_method: "POST",
          request_path: "/api/admin/community",
          environment: "production",
        });
        return NextResponse.json({
          success: true,
          message: "داده‌های نظارت بر کامیونیتی با موفقیت به حالت اولیه بازنشانی شدند.",
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: `عملیات نامعتبر: ${action}` },
          { status: 400 }
        );
    }
  } catch (error: unknown) {
    console.error("Error in POST /api/admin/community:", error);
    return NextResponse.json(
      { success: false, error: errorMessage(error) || "خطای پردازش عملیات نظارت بر کامیونیتی" },
      { status: 500 }
    );
  }
}
