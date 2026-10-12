import { NextResponse } from "next/server";
import { getIeltsExamById } from "@/data/ielts/index.ts";
import { gradeExamModule, mapBandToCEFR } from "@/lib/ielts-grading.ts";
import type { IeltsSkill } from "@endoora/contracts";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { examId, skill, userAnswers } = body;

    if (!examId || !skill) {
      return NextResponse.json(
        { success: false, error: "examId and skill are required" },
        { status: 400 }
      );
    }

    const exam = getIeltsExamById(examId);
    if (!exam) {
      return NextResponse.json(
        { success: false, error: "Exam not found" },
        { status: 404 }
      );
    }

    const moduleObj = exam.modules.find((m) => m.skill === (skill as IeltsSkill));
    if (!moduleObj) {
      return NextResponse.json(
        { success: false, error: `Module for skill '${skill}' not found in exam` },
        { status: 404 }
      );
    }

    const graded = gradeExamModule(moduleObj, userAnswers || {}, exam.category);
    const cefr = mapBandToCEFR(graded.summary.band_score);

    return NextResponse.json({
      success: true,
      exam_id: exam.id,
      exam_title: exam.title,
      skill,
      category: exam.category,
      summary: graded.summary,
      grading_results: graded.gradingResults,
      question_type_stats: graded.questionTypeStats,
      recommendations: graded.recommendations,
      cefr,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
