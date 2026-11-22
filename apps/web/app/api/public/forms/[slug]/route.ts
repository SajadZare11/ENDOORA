import { errorMessage } from "../../../../../lib/error-message.ts";
import { NextResponse } from "next/server";
import {
  getCustomFormBySlug,
  submitPublicFormResponse,
} from "@/lib/admin-forms-webhooks-store";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const form = getCustomFormBySlug(slug);

    if (!form || form.status === "draft") {
      return NextResponse.json(
        { success: false, error: "فرم مورد نظر یافت نشد یا در وضعیت پیش‌نویس است." },
        { status: 404 }
      );
    }

    // Return public-safe fields (omit secret tokens)
    return NextResponse.json({
      success: true,
      form: {
        id: form.id,
        slug: form.slug,
        titleFa: form.titleFa,
        titleEn: form.titleEn,
        descriptionFa: form.descriptionFa,
        coverBannerUrl: form.coverBannerUrl,
        status: form.status,
        fields: form.fields,
        deadlineIso: form.deadlineIso,
        successMessageFa: form.successMessageFa,
        redirectUrl: form.redirectUrl,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: errorMessage(err) || "خطا در واکشی فرم" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { answers } = body;

    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "Mozilla/5.0";

    const result = submitPublicFormResponse(slug, answers || {}, ip, userAgent);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.messageFa,
      submissionId: result.submission?.id,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: errorMessage(err) || "خطا در ثبت پاسخ‌های فرم" },
      { status: 500 }
    );
  }
}
