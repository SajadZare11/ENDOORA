import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import {
  getFormSubmissions,
  getFormsWebhooksStorage,
  updateSubmissionWebhookStatus,
  testWebhookEndpoint,
} from "@/lib/admin-forms-webhooks-store";
import { validateWebhookUrl } from "@/lib/ssrf-protection";
import { recordAuditLog } from "@/lib/admin-ops";

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const formId = searchParams.get("formId") || "all";

    const submissions = getFormSubmissions(formId);
    return NextResponse.json({ success: true, submissions, count: submissions.length });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در واکشی پاسخ‌های فرم" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { action, submissionId } = body;

    if (action === "retry_webhook") {
      if (!submissionId) {
        return NextResponse.json(
          { success: false, error: "شناسه پاسخ (submissionId) الزامی است." },
          { status: 400 }
        );
      }

      const storage = getFormsWebhooksStorage();
      const submission = storage.submissions.find((s) => s.id === submissionId);
      if (!submission) {
        return NextResponse.json(
          { success: false, error: "پاسخ مورد نظر یافت نشد." },
          { status: 404 }
        );
      }

      const form = storage.forms.find(
        (f) => f.id === submission.formId || f.slug === submission.formSlug
      );
      if (!form) {
        return NextResponse.json(
          { success: false, error: "فرم مربوط به این پاسخ یافت نشد." },
          { status: 404 }
        );
      }

      const webhookUrl = form.automations?.webhookUrl?.trim();
      if (!webhookUrl) {
        return NextResponse.json(
          { success: false, error: "آدرس وب‌هوک برای این فرم تنظیم نشده است." },
          { status: 400 }
        );
      }

      const validation = await validateWebhookUrl(webhookUrl);
      if (!validation.isSafe) {
        updateSubmissionWebhookStatus(submissionId, "failed");
        return NextResponse.json(
          {
            success: false,
            error: validation.error || "آدرس وب‌هوک به دلایل امنیتی مسدود است.",
          },
          { status: 400 }
        );
      }

      const payload = {
        event: "form_submission.retry",
        submissionId: submission.id,
        formId: form.id,
        formSlug: form.slug,
        formTitle: form.titleFa,
        submittedAt: submission.submittedAt,
        respondent: {
          ip: submission.respondentIp,
          userAgent: submission.respondentUserAgent,
          phone: submission.respondentPhone,
          email: submission.respondentEmail,
        },
        answers: submission.answers,
        retriedAt: new Date().toISOString(),
        retriedBy: auth.user?.email || "مدیر ارشد",
      };

      const result = await testWebhookEndpoint(validation.url!.toString(), payload);
      updateSubmissionWebhookStatus(submissionId, result.success ? "success" : "failed");

      recordAuditLog({
        actor_id: auth.user?.id ? String(auth.user.id) : null,
        actor_email: auth.user?.email || "مدیر سیستم",
        actor_role: auth.user?.role || "administrator",
        action: "update",
        target_app: "dynamic_forms",
        target_model: "FormSubmission",
        target_pk: submissionId,
        before_summary: { webhookStatus: submission.webhookStatus },
        after_summary: {
          webhookStatus: result.success ? "success" : "failed",
          statusCode: result.statusCode,
        },
        reason: `تلاش مجدد ارسال وب‌هوک فرم ${form.titleFa}`,
        request_method: "POST",
        request_path: "/api/admin/forms/submissions",
        environment: "production",
      });

      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            error: `ارسال وب‌هوک ناموفق بود (کد وضعیت: ${result.statusCode})`,
            responseSnippet: result.responseSnippet,
            latencyMs: result.latencyMs,
          },
          { status: 502 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `وب‌هوک پاسخ ${submissionId} مجدداً با موفقیت به سیستم مقصد ارسال گردید.`,
        latencyMs: result.latencyMs,
        statusCode: result.statusCode,
        responseSnippet: result.responseSnippet,
      });
    }

    return NextResponse.json({ success: false, error: "عملیات نامعتبر است." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در پردازش عملیات پاسخ‌ها" },
      { status: 500 }
    );
  }
}
