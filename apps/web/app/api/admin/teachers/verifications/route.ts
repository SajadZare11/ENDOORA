import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";

import {
  getTeacherApplications,
  getVerificationStats,
  applyReviewDecision,
  saveApplicationsToDisk,
  INITIAL_TEACHER_APPLICATIONS,
  OFFICIAL_BADGE_CATALOG,
  type ReviewDecisionPayload,
  type TeacherVerificationStatus,
} from "@/lib/teacher-verifications-store";
import { recordAuditLog } from "@/lib/admin-ops";

export async function GET(req: NextRequest) {
  try {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");
    const searchQuery = searchParams.get("q") || searchParams.get("search");
    const badgeFilter = searchParams.get("badge");

    let applications = getTeacherApplications();

    if (statusFilter && statusFilter !== "all") {
      applications = applications.filter((app) => app.status === (statusFilter as TeacherVerificationStatus));
    }

    if (badgeFilter && badgeFilter !== "all") {
      applications = applications.filter(
        (app) => app.assignedBadges.includes(badgeFilter) || app.customBadges.includes(badgeFilter)
      );
    }

    if (searchQuery) {
      const q = searchQuery.trim().toLowerCase();
      applications = applications.filter(
        (app) =>
          app.fullName.toLowerCase().includes(q) ||
          app.email.toLowerCase().includes(q) ||
          app.phone.includes(q) ||
          app.nationalId.includes(q) ||
          app.city.toLowerCase().includes(q) ||
          app.degree.toLowerCase().includes(q) ||
          app.specialties.some((s) => s.toLowerCase().includes(q))
      );
    }

    const stats = getVerificationStats();

    return NextResponse.json({
      success: true,
      applications,
      stats,
      badgesCatalog: OFFICIAL_BADGE_CATALOG,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "خطا در دریافت فهرست متقاضیان تدریس";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

    const body = await req.json();
    const action = body.action as string;

    if (action === "reset_seed") {
      if ((process.env.NODE_ENV as string) === "production") {
        return NextResponse.json({ success: false, error: "عملیات بازنشانی داده‌های کارخانه در محیط عملیاتی غیرمجاز است." }, { status: 403 });
      }

      saveApplicationsToDisk([...INITIAL_TEACHER_APPLICATIONS]);
      const stats = getVerificationStats();
      return NextResponse.json({
        success: true,
        message: "فهرست متقاضیان با موفقیت به مقادیر اولیه کارخانه بازنشانی شد.",
        applications: INITIAL_TEACHER_APPLICATIONS,
        stats,
      });
    }

    if (action === "review_decision") {
      const appId = body.applicationId as string;
      const payload = body.payload as ReviewDecisionPayload;

      if (!appId || !payload || !payload.decision) {
        return NextResponse.json(
          { success: false, error: "شناسه درخواست یا اطلاعات تصمیم ارزیابی نامعتبر است." },
          { status: 400 }
        );
      }

      const res = applyReviewDecision(appId, payload);
      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 404 });
      }

      const stats = getVerificationStats();

      let successMessage = "تصمیم ارزیابی با موفقیت ثبت گردید.";
      if (payload.decision === "approve") {
        successMessage = `صلاحیت ${res.application?.fullName} با موفقیت تایید و نشان‌های مربوطه اعطا شد.`;
      } else if (payload.decision === "request_revision") {
        successMessage = `درخواست اصلاح مدارک برای ${res.application?.fullName} ارسال شد.`;
      } else if (payload.decision === "reject") {
        successMessage = `درخواست متقاضی با موفقیت رد و در سوابق ممیزی بایگانی شد.`;
      } else if (payload.decision === "suspend") {
        successMessage = `فعالیت ${res.application?.fullName} به صورت موقت به حالت تعلیق درآمد.`;
      }

      // Record in Admin Audit Log
      try {
        recordAuditLog({
          actor_id: auth.user?.id || "admin",
          actor_email: auth.user?.email || "admin@endoora.ir",
          actor_role: auth.user?.role || "administrator",
          action: "update",
          target_app: "teachers",
          target_model: "TeacherVerification",
          target_pk: res.application?.id || appId,
          before_summary: { status: "previous_evaluation" },
          after_summary: {
            status: res.application?.status,
            commissionRate: res.application?.commissionRatePercent,
            badges: res.application?.assignedBadges,
          },
          reason: `${successMessage} | کارمزد: ${res.application?.commissionRatePercent}٪`,
          request_method: "POST",
          request_path: "/api/admin/teachers/verifications",
          environment: "production",
        });
      } catch (logErr) {
        console.warn("Failed to record audit log for teacher verification:", logErr);
      }

      return NextResponse.json({
        success: true,
        message: successMessage,
        application: res.application,
        stats,
      });
    }

    return NextResponse.json({ success: false, error: "عملیات ارسالی ناشناخته است." }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "خطا در پردازش درخواست ارزیابی استاد";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
