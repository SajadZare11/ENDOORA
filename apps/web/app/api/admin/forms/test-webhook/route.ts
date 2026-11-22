import { errorMessage } from "../../../../../lib/error-message.ts";
import { NextResponse } from "next/server";
import { testWebhookEndpoint } from "@/lib/admin-forms-webhooks-store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, payload } = body;

    if (!url || !url.startsWith("http")) {
      return NextResponse.json(
        { success: false, error: "آدرس معتبر وب‌هوک (شروع شده با http یا https) الزامی است." },
        { status: 400 }
      );
    }

    const result = await testWebhookEndpoint(url, payload);
    return NextResponse.json({
      success: result.success,
      latencyMs: result.latencyMs,
      statusCode: result.statusCode,
      responseSnippet: result.responseSnippet,
      message: result.success
        ? `تست وب‌هوک با موفقیت انجام شد (کد وضعیت: ${result.statusCode}، تاخیر: ${result.latencyMs}ms).`
        : `تست وب‌هوک ناموفق بود (کد وضعیت: ${result.statusCode}).`,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: errorMessage(err) || "خطا در تست اتصال وب‌هوک" },
      { status: 500 }
    );
  }
}
