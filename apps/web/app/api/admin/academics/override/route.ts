import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import {
  toggleLessonCompletionState,
  updateLessonQuizScore,
  resetCourseProgress,
} from "@/lib/admin-academics-store";
import { recordAuditLog } from "@/lib/admin-ops";

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminSession(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }
    const adminUser = auth.user?.email || "مدیر ارشد ایندورا";

    const body = await req.json();
    const { action, learnerId, courseId, lessonId, newScore, reason } = body;

    if (!learnerId || !courseId) {
      return NextResponse.json(
        { success: false, error: "فیلدهای learnerId و courseId الزامی هستند." },
        { status: 400 }
      );
    }

    if (action === "toggle_lesson") {
      if (!lessonId) {
        return NextResponse.json(
          { success: false, error: "شناسه درس (lessonId) الزامی است." },
          { status: 400 }
        );
      }

      const res = toggleLessonCompletionState(
        learnerId,
        courseId,
        lessonId,
        adminUser,
        reason || "تغییر وضعیت درس توسط مدیریت آموزش"
      );
      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      recordAuditLog({
        actor_id: null,
        actor_email: adminUser,
        actor_role: "administrator",
        action: "update",
        target_app: "courses",
        target_model: "LearnerLessonProgress",
        target_pk: lessonId,
        before_summary: {},
        after_summary: { learnerId, courseId, reason },
        reason: reason || "تغییر وضعیت درس توسط مدیریت",
        request_method: "POST",
        request_path: "/api/admin/academics/override",
        environment: "production",
      });

      return NextResponse.json({ success: true, enrollment: res.enrollment });
    }

    if (action === "update_score") {
      if (!lessonId || typeof newScore !== "number") {
        return NextResponse.json(
          { success: false, error: "شناسه درس و نمره جدید الزامی هستند." },
          { status: 400 }
        );
      }

      const res = updateLessonQuizScore(
        learnerId,
        courseId,
        lessonId,
        newScore,
        adminUser,
        reason || "اصلاح نمره آزمونک توسط ادمین"
      );
      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      recordAuditLog({
        actor_id: null,
        actor_email: adminUser,
        actor_role: "administrator",
        action: "update",
        target_app: "courses",
        target_model: "LearnerLessonProgress",
        target_pk: lessonId,
        before_summary: {},
        after_summary: { learnerId, courseId, newScore, reason },
        reason: reason || "اصلاح نمره آزمونک توسط ادمین",
        request_method: "POST",
        request_path: "/api/admin/academics/override",
        environment: "production",
      });

      return NextResponse.json({ success: true, enrollment: res.enrollment });
    }

    if (action === "reset_progress") {
      const res = resetCourseProgress(
        learnerId,
        courseId,
        adminUser,
        reason || "بازنشانی صفر تا صد دوره به درخواست کاربر یا تصمیم مدیریت"
      );
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
        target_pk: `${learnerId}_${courseId}`,
        before_summary: {},
        after_summary: { learnerId, courseId, progress: 0, reason },
        reason: reason || "بازنشانی صفر تا صد پیشرفت دوره",
        request_method: "POST",
        request_path: "/api/admin/academics/override",
        environment: "production",
      });

      return NextResponse.json({ success: true, enrollment: res.enrollment });
    }

    return NextResponse.json({ success: false, error: "عملیات درخواست شده نامعتبر است." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در پردازش اورراید آموزشی" },
      { status: 500 }
    );
  }
}
