import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import {
  getLearnerEnrollments,
  grantCourseEnrollment,
  revokeCourseEnrollment,
  getAcademicAuditLogs,
  MEDIA_PRESET_ASSETS,
} from "@/lib/admin-academics-store";
import { recordAuditLog } from "@/lib/admin-ops";

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdminSession(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || searchParams.get("query") || undefined;
    const courseId = searchParams.get("course_id") || undefined;

    // Check if Django backend is available
    const backendUrl = (process.env.ENDOORA_API_INTERNAL_URL ?? "http://127.0.0.1:8000").replace(/\/+$/, "");
    try {
      const djangoRes = await fetch(`${backendUrl}/api/courses/editor/admin-enrollments/?${searchParams.toString()}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Cookie: req.headers.get("cookie") || "",
        },
        cache: "no-store",
      });
      if (djangoRes.ok) {
        const djangoData = await djangoRes.json();
        if (djangoData.enrollments && djangoData.enrollments.length > 0) {
          return NextResponse.json({
            success: true,
            enrollments: djangoData.enrollments,
            auditLogs: djangoData.audit_logs || getAcademicAuditLogs(),
            mediaPresets: MEDIA_PRESET_ASSETS,
            source: "django",
          });
        }
      }
    } catch {
      // Backend not running; fallback smoothly to local store
    }

    const enrollments = getLearnerEnrollments({ query, courseId });
    const auditLogs = getAcademicAuditLogs();

    return NextResponse.json({
      success: true,
      enrollments,
      auditLogs,
      mediaPresets: MEDIA_PRESET_ASSETS,
      source: "local-store",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در بارگذاری پرونده‌های ثبت‌نام زبان‌آموزان" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminSession(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }
    const adminUser = auth.user?.email || "مدیر ارشد ایندورا";

    const body = await req.json();
    const { action, enrollmentId, learnerName, learnerEmail, learnerPhone, courseId, courseTitleFa, courseTitleEn, cefrLevel, reason } = body;

    if (action === "revoke") {
      if (!enrollmentId) {
        return NextResponse.json({ success: false, error: "شناسه ثبت‌نام (enrollmentId) الزامی است." }, { status: 400 });
      }
      const res = revokeCourseEnrollment(enrollmentId, adminUser, reason || "لغو ثبت‌نام با تصمیم مدیریت");
      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      recordAuditLog({
        actor_id: null,
        actor_email: adminUser,
        actor_role: "administrator",
        action: "delete",
        target_app: "courses",
        target_model: "LearnerCourseEnrollment",
        target_pk: enrollmentId,
        before_summary: { status: "active" },
        after_summary: { status: "revoked" },
        reason: reason || "لغو دسترسی دوره توسط مدیریت",
        request_method: "POST",
        request_path: "/api/admin/academics/enrollments",
        environment: "production",
      });

      return NextResponse.json({ success: true, message: "ثبت‌نام با موفقیت لغو گردید." });
    }

    if (action === "grant") {
      if (!learnerName || !courseId || !courseTitleFa) {
        return NextResponse.json({ success: false, error: "مشخصات زبان‌آموز و دوره الزامی است." }, { status: 400 });
      }

      const res = grantCourseEnrollment(
        learnerName,
        learnerEmail || "learner@endoora.ir",
        learnerPhone || "09120000000",
        courseId,
        courseTitleFa,
        courseTitleEn || courseTitleFa,
        cefrLevel || "B1",
        [],
        adminUser,
        reason || "اعطای ثبت‌نام مستقیم دوره"
      );

      recordAuditLog({
        actor_id: null,
        actor_email: adminUser,
        actor_role: "administrator",
        action: "create",
        target_app: "courses",
        target_model: "LearnerCourseEnrollment",
        target_pk: res.enrollment.id,
        before_summary: {},
        after_summary: { learnerName, courseTitleFa, reason },
        reason: reason || "اعطای ثبت‌نام مستقیم دوره",
        request_method: "POST",
        request_path: "/api/admin/academics/enrollments",
        environment: "production",
      });

      return NextResponse.json({ success: true, enrollment: res.enrollment });
    }

    return NextResponse.json({ success: false, error: "عملیات نامعتبر است." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در پردازش درخواست ثبت‌نام" },
      { status: 500 }
    );
  }
}
