import { NextResponse } from "next/server";
import { ALL_IELTS_EXAMS, filterIeltsExams } from "@/data/ielts/index.ts";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "all";
    const skill = searchParams.get("skill") || "all";
    const source = searchParams.get("source") || "all";
    const q = searchParams.get("q") || "";

    const filtered = filterIeltsExams({
      category: category as any,
      skill: skill as any,
      source: source as any,
      searchQuery: q,
    });

    const summaries = filtered.map((exam) => {
      const skills = exam.modules.map((m) => m.skill);
      const totalQuestions = exam.modules.reduce(
        (sum, m) => sum + (m.total_questions || 0),
        0
      );

      return {
        id: exam.id,
        title: exam.title,
        category: exam.category,
        source: exam.source,
        description: exam.description,
        total_duration_minutes: exam.total_duration_minutes,
        skills,
        total_questions: totalQuestions,
        modules_count: exam.modules.length,
        created_at: exam.created_at,
        updated_at: exam.updated_at,
      };
    });

    return NextResponse.json({
      success: true,
      total: summaries.length,
      exams: summaries,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
