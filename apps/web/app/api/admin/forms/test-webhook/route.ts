import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { validateWebhookUrl } from "@/lib/ssrf-protection";
import { testWebhookEndpoint } from "@/lib/admin-forms-webhooks-store";

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error || "دسترسی غیرمجاز. احراز هویت الزامی است." },
        { status: auth.status }
      );
    }

    const body = await request.json();
    const { url, payload } = body;

    const validation = await validateWebhookUrl(url);
    if (!validation.isSafe) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const result = await testWebhookEndpoint(validation.url!.toString(), payload);
    return NextResponse.json({
      success: result.success,
      latencyMs: result.latencyMs,
      statusCode: result.statusCode,
      responseSnippet: result.responseSnippet,
      message: result.success
        ? `تست وب‌هوک با موفقیت انجام شد (کد وضعیت: ${result.statusCode}، تاخیر: ${result.latencyMs}ms).`
        : `تست وب‌هوک ناموفق بود (کد وضعیت: ${result.statusCode}).`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در تست اتصال وب‌هوک" },
      { status: 500 }
    );
  }
}
