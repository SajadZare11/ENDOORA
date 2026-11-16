import { NextRequest, NextResponse } from "next/server";
import {
  getExamIntegrityData,
  sendLiveWarning,
  suspendExamSession,
  resumeExamSession,
  pardonViolation,
  grantCompensationTime,
  invalidateExamSession,
  calibrateAiScore,
  confirmOriginalAiScore,
  quarantineQuestionItem,
  activateQuestionItem,
  regradeQuestionCompensation,
  resolveGradeAppeal,
  resetExamIntegrityDataToInitial,
} from "@/lib/exam-integrity-store";
import { recordAuditLog } from "@/lib/admin-ops";

export async function GET() {
  try {
    const data = getExamIntegrityData();
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error("Error in GET /api/admin/exams/integrity:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "خطای سرور در واکشی داده‌های مرکز ممیزی آزمون‌ها" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: "فیلد action الزامی است." },
        { status: 400 }
      );
    }

    switch (action) {
      case "send_warning": {
        const { sessionId, message } = body;
        if (!sessionId || !message) {
          return NextResponse.json(
            { success: false, error: "شناسه نشست و پیام اخطار الزامی هستند." },
            { status: 400 }
          );
        }
        const updated = sendLiveWarning(sessionId, message);
        recordAuditLog({
          actor_id: "usr-admin-1",
          actor_email: "admin@endoora.com",
          actor_role: "administrator",
          target_app: "exams",
          target_model: "LiveExamSession",
          target_pk: sessionId,
          action: "update",
          before_summary: {},
          after_summary: { warningMessage: message, integrityScore: updated.integrityScore },
          reason: `ارسال اخطار زنده به زبان‌آموز در نشست ${sessionId}`,
          request_method: "POST",
          request_path: "/api/admin/exams/integrity",
          environment: "production",
        });
        return NextResponse.json({ success: true, session: updated });
      }

      case "suspend_session": {
        const { sessionId, reason } = body;
        if (!sessionId || !reason) {
          return NextResponse.json(
            { success: false, error: "شناسه نشست و دلیل تعلیق الزامی هستند." },
            { status: 400 }
          );
        }
        const updated = suspendExamSession(sessionId, reason);
        recordAuditLog({
          actor_id: "usr-admin-1",
          actor_email: "admin@endoora.com",
          actor_role: "administrator",
          target_app: "exams",
          target_model: "LiveExamSession",
          target_pk: sessionId,
          action: "update",
          before_summary: {},
          after_summary: { status: "suspended", reason },
          reason: `تعلیق موقت نشست آزمون ${sessionId}`,
          request_method: "POST",
          request_path: "/api/admin/exams/integrity",
          environment: "production",
        });
        return NextResponse.json({ success: true, session: updated });
      }

      case "resume_session": {
        const { sessionId } = body;
        if (!sessionId) {
          return NextResponse.json(
            { success: false, error: "شناسه نشست الزامی است." },
            { status: 400 }
          );
        }
        const updated = resumeExamSession(sessionId);
        recordAuditLog({
          actor_id: "usr-admin-1",
          actor_email: "admin@endoora.com",
          actor_role: "administrator",
          target_app: "exams",
          target_model: "LiveExamSession",
          target_pk: sessionId,
          action: "update",
          before_summary: {},
          after_summary: { status: "active" },
          reason: `رفع تعلیق و ادامه آزمون در نشست ${sessionId}`,
          request_method: "POST",
          request_path: "/api/admin/exams/integrity",
          environment: "production",
        });
        return NextResponse.json({ success: true, session: updated });
      }

      case "pardon_violation": {
        const { sessionId, violationId, reason } = body;
        if (!sessionId || !violationId) {
          return NextResponse.json(
            { success: false, error: "شناسه نشست و شناسه تخلف الزامی هستند." },
            { status: 400 }
          );
        }
        const updated = pardonViolation(sessionId, violationId, reason || "توضیحات مورد قبول واقع شد");
        recordAuditLog({
          actor_id: "usr-admin-1",
          actor_email: "admin@endoora.com",
          actor_role: "administrator",
          target_app: "exams",
          target_model: "ProctoringViolationEvent",
          target_pk: violationId,
          action: "update",
          before_summary: {},
          after_summary: { violationId, isPardoned: true, reason },
          reason: `بخشش تخلف پروکتورینگ در نشست ${sessionId}`,
          request_method: "POST",
          request_path: "/api/admin/exams/integrity",
          environment: "production",
        });
        return NextResponse.json({ success: true, session: updated });
      }

      case "grant_compensation_time": {
        const { sessionId, additionalMinutes } = body;
        if (!sessionId || !additionalMinutes) {
          return NextResponse.json(
            { success: false, error: "شناسه نشست و دقایق جبرانی الزامی هستند." },
            { status: 400 }
          );
        }
        const updated = grantCompensationTime(sessionId, Number(additionalMinutes));
        recordAuditLog({
          actor_id: "usr-admin-1",
          actor_email: "admin@endoora.com",
          actor_role: "administrator",
          target_app: "exams",
          target_model: "LiveExamSession",
          target_pk: sessionId,
          action: "update",
          before_summary: {},
          after_summary: { additionalMinutes, durationMinutes: updated.durationMinutes },
          reason: `اعطای ${additionalMinutes} دقیقه وقت جبرانی در نشست ${sessionId}`,
          request_method: "POST",
          request_path: "/api/admin/exams/integrity",
          environment: "production",
        });
        return NextResponse.json({ success: true, session: updated });
      }

      case "invalidate_session": {
        const { sessionId, reason } = body;
        if (!sessionId || !reason) {
          return NextResponse.json(
            { success: false, error: "شناسه نشست و دلیل ابطال الزامی هستند." },
            { status: 400 }
          );
        }
        const updated = invalidateExamSession(sessionId, reason);
        recordAuditLog({
          actor_id: "usr-admin-1",
          actor_email: "admin@endoora.com",
          actor_role: "administrator",
          target_app: "exams",
          target_model: "LiveExamSession",
          target_pk: sessionId,
          action: "update",
          before_summary: {},
          after_summary: { status: "disqualified", reason },
          reason: `ابطال قطعی (Disqualification) آزمون در نشست ${sessionId}`,
          request_method: "POST",
          request_path: "/api/admin/exams/integrity",
          environment: "production",
        });
        return NextResponse.json({ success: true, session: updated });
      }

      case "calibrate_ai_score": {
        const { auditId, humanScores, examinerFeedback, reviewedBy } = body;
        if (!auditId || !humanScores) {
          return NextResponse.json(
            { success: false, error: "شناسه ممیزی و نمرات انسانی الزامی هستند." },
            { status: 400 }
          );
        }
        const updated = calibrateAiScore(
          auditId,
          humanScores,
          examinerFeedback || "کالیبره‌شده توسط اگزمینر ارشد",
          reviewedBy || "سرممیز آزمون‌های بین‌المللی"
        );
        recordAuditLog({
          actor_id: "usr-admin-1",
          actor_email: "admin@endoora.com",
          actor_role: "administrator",
          target_app: "exams",
          target_model: "AiGradeAuditRecord",
          target_pk: auditId,
          action: "update",
          before_summary: {},
          after_summary: { humanScores, status: "calibrated" },
          reason: `کالیبراسیون و اصلاح دستی نمره هوش مصنوعی در برگه ${auditId}`,
          request_method: "POST",
          request_path: "/api/admin/exams/integrity",
          environment: "production",
        });
        return NextResponse.json({ success: true, record: updated });
      }

      case "confirm_ai_score": {
        const { auditId, reviewedBy } = body;
        if (!auditId) {
          return NextResponse.json(
            { success: false, error: "شناسه ممیزی الزامی است." },
            { status: 400 }
          );
        }
        const updated = confirmOriginalAiScore(auditId, reviewedBy || "سرممیز آزمون‌های بین‌المللی");
        recordAuditLog({
          actor_id: "usr-admin-1",
          actor_email: "admin@endoora.com",
          actor_role: "administrator",
          target_app: "exams",
          target_model: "AiGradeAuditRecord",
          target_pk: auditId,
          action: "update",
          before_summary: {},
          after_summary: { status: "confirmed_original" },
          reason: `تایید قطعی نمره ارزیابی هوش مصنوعی در برگه ${auditId}`,
          request_method: "POST",
          request_path: "/api/admin/exams/integrity",
          environment: "production",
        });
        return NextResponse.json({ success: true, record: updated });
      }

      case "quarantine_question": {
        const { itemId, reason } = body;
        if (!itemId || !reason) {
          return NextResponse.json(
            { success: false, error: "شناسه سوال و دلیل قرنطینه الزامی هستند." },
            { status: 400 }
          );
        }
        const updated = quarantineQuestionItem(itemId, reason);
        recordAuditLog({
          actor_id: "usr-admin-1",
          actor_email: "admin@endoora.com",
          actor_role: "administrator",
          target_app: "exams",
          target_model: "QuestionPsychometricsItem",
          target_pk: itemId,
          action: "update",
          before_summary: {},
          after_summary: { status: "quarantined", reason },
          reason: `قرنطینه و خروج سوال ${itemId} از چرخه آزمون‌ها`,
          request_method: "POST",
          request_path: "/api/admin/exams/integrity",
          environment: "production",
        });
        return NextResponse.json({ success: true, item: updated });
      }

      case "activate_question": {
        const { itemId } = body;
        if (!itemId) {
          return NextResponse.json(
            { success: false, error: "شناسه سوال الزامی است." },
            { status: 400 }
          );
        }
        const updated = activateQuestionItem(itemId);
        recordAuditLog({
          actor_id: "usr-admin-1",
          actor_email: "admin@endoora.com",
          actor_role: "administrator",
          target_app: "exams",
          target_model: "QuestionPsychometricsItem",
          target_pk: itemId,
          action: "update",
          before_summary: {},
          after_summary: { status: "active" },
          reason: `فعال‌سازی مجدد سوال ${itemId} در بانک سوالات`,
          request_method: "POST",
          request_path: "/api/admin/exams/integrity",
          environment: "production",
        });
        return NextResponse.json({ success: true, item: updated });
      }

      case "regrade_question": {
        const { itemId } = body;
        if (!itemId) {
          return NextResponse.json(
            { success: false, error: "شناسه سوال الزامی است." },
            { status: 400 }
          );
        }
        const result = regradeQuestionCompensation(itemId);
        recordAuditLog({
          actor_id: "usr-admin-1",
          actor_email: "admin@endoora.com",
          actor_role: "administrator",
          target_app: "exams",
          target_model: "QuestionPsychometricsItem",
          target_pk: itemId,
          action: "update",
          before_summary: {},
          after_summary: { status: "regraded_compensated", affectedCount: result.affectedCandidatesCount },
          reason: `تصحیح عطف‌به‌ماسبق سوال معیوب ${itemId} برای ${result.affectedCandidatesCount} زبان‌آموز`,
          request_method: "POST",
          request_path: "/api/admin/exams/integrity",
          environment: "production",
        });
        return NextResponse.json({ success: true, ...result });
      }

      case "resolve_appeal": {
        const { appealId, decision, revisedBand, notes, refundIssued, adjudicatedBy } = body;
        if (!appealId || !decision) {
          return NextResponse.json(
            { success: false, error: "شناسه پرونده اعتراض و تصمیم نهایی الزامی هستند." },
            { status: 400 }
          );
        }
        const updated = resolveGradeAppeal(
          appealId,
          decision,
          revisedBand ? Number(revisedBand) : undefined,
          notes,
          Boolean(refundIssued),
          adjudicatedBy
        );
        recordAuditLog({
          actor_id: "usr-admin-1",
          actor_email: "admin@endoora.com",
          actor_role: "administrator",
          target_app: "exams",
          target_model: "GradeAppealCase",
          target_pk: appealId,
          action: "update",
          before_summary: {},
          after_summary: { decision, revisedBand, refundIssued },
          reason: `تعیین تکلیف پرونده اعتراض به نمره ${appealId} (${decision === "upgraded" ? "ارتقا یافت" : "رد شد"})`,
          request_method: "POST",
          request_path: "/api/admin/exams/integrity",
          environment: "production",
        });
        return NextResponse.json({ success: true, appeal: updated });
      }

      case "reset_data": {
        resetExamIntegrityDataToInitial();
        recordAuditLog({
          actor_id: "usr-admin-1",
          actor_email: "admin@endoora.com",
          actor_role: "administrator",
          target_app: "exams",
          target_model: "ExamIntegrityHub",
          target_pk: "seed",
          action: "update",
          before_summary: {},
          after_summary: { reset: true },
          reason: "بازنشانی داده‌های مرکز ممیزی آزمون‌ها به مقادیر اولیه",
          request_method: "POST",
          request_path: "/api/admin/exams/integrity",
          environment: "production",
        });
        return NextResponse.json({ success: true, message: "داده‌ها با موفقیت ریست شدند." });
      }

      default:
        return NextResponse.json(
          { success: false, error: `عملیات نامعتبر: ${action}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Error in POST /api/admin/exams/integrity:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "خطای سرور در انجام عملیات مرکز ممیزی آزمون‌ها" },
      { status: 500 }
    );
  }
}
