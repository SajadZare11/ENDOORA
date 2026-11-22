import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { generateAiQuizForLesson } from "@/lib/admin-academics-store";

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminSession(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }
    const body = await req.json();
    const { topic, lessonBody, transcript, cefrLevel } = body;

    if (!topic && !lessonBody && !transcript) {
      return NextResponse.json(
        { success: false, error: "عنوان درس، متن محتوا یا متن پیاده‌شده جهت تحلیل الزامی است." },
        { status: 400 }
      );
    }

    const questions = generateAiQuizForLesson({
      topic: topic || "English Lesson",
      lessonBody,
      transcript,
      cefrLevel: cefrLevel || "B1",
    });

    return NextResponse.json({
      success: true,
      questions,
      generatedCount: questions.length,
      modelUsed: "Endoora Pedagogical AI v3.2",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در تولید آزمونک هوشمند" },
      { status: 500 }
    );
  }
}
