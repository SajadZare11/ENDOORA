import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { saveLessonQuiz, getLessonQuiz } from "@/lib/admin-academics-store";
import { recordAuditLog } from "@/lib/admin-ops";
import type { QuizItem } from "@/lib/courses-cms";

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdminSession(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url);
    const lessonId = searchParams.get("lessonId");

    if (!lessonId) {
      return NextResponse.json(
        { success: false, error: "شناسه درس (lessonId) الزامی است." },
        { status: 400 }
      );
    }

    const questions = getLessonQuiz(lessonId);
    return NextResponse.json({
      success: true,
      lessonId,
      questions,
      count: questions.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در واکشی سوالات درس" },
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

    const body = await req.json();
    const { lessonId, questions } = body;

    if (!lessonId) {
      return NextResponse.json(
        { success: false, error: "شناسه درس (lessonId) الزامی است." },
        { status: 400 }
      );
    }

    if (!Array.isArray(questions)) {
      return NextResponse.json(
        { success: false, error: "آرایه سوالات (questions) الزامی است." },
        { status: 400 }
      );
    }

    saveLessonQuiz(lessonId, questions as QuizItem[]);

    // Record Audit Log
    recordAuditLog({
      actor_id: auth.user?.id ? String(auth.user.id) : null,
      actor_email: auth.user?.email || "مدیر ارشد ایندورا",
      actor_role: auth.user?.role || "administrator",
      action: "update",
      target_app: "courses",
      target_model: "LessonQuiz",
      target_pk: lessonId,
      before_summary: {},
      after_summary: { lessonId, questionCount: questions.length },
      reason: "ذخیره و پایدارسازی بانک سوالات آزمونک درس",
      request_method: "POST",
      request_path: "/api/admin/academics/quizzes",
      environment: "production",
    });

    // Dual-layer sync: proxy to Django course editor if available
    const backendUrl = (process.env.ENDOORA_API_INTERNAL_URL ?? "http://127.0.0.1:8000").replace(/\/+$/, "");
    try {
      await fetch(`${backendUrl}/api/courses/editor/lessons/${lessonId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: req.headers.get("cookie") || "",
        },
        body: JSON.stringify({ quiz_data: questions }),
        signal: AbortSignal.timeout(1500),
      }).catch(() => null);
    } catch {
      // Backend offline or non-blocking in development
    }

    return NextResponse.json({
      success: true,
      message: "بانک سوالات آزمونک با موفقیت ذخیره و در دیسک پایدارسازی گردید.",
      lessonId,
      count: questions.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در ذخیره بانک سوالات درس" },
      { status: 500 }
    );
  }
}
