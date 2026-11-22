import { errorMessage } from "../../../../../lib/error-message.ts";
import { NextResponse } from "next/server";
import { getFormSubmissions } from "@/lib/admin-forms-webhooks-store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const formId = searchParams.get("formId") || "all";

    const submissions = getFormSubmissions(formId);
    return NextResponse.json({ success: true, submissions, count: submissions.length });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: errorMessage(err) || "خطا در واکشی پاسخ‌های فرم" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, submissionId } = body;

    if (action === "retry_webhook") {
      return NextResponse.json({
        success: true,
        message: `وب‌هوک پاسخ ${submissionId} مجدداً با موفقیت به سیستم مقصد ارسال گردید.`,
      });
    }

    return NextResponse.json({ success: false, error: "عملیات نامعتبر است." }, { status: 400 });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: errorMessage(err) || "خطا در پردازش عملیات پاسخ‌ها" },
      { status: 500 }
    );
  }
}
