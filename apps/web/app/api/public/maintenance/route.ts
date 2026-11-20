import { NextResponse } from "next/server";
import { getMaintenanceConfig } from "@/lib/admin-server-ops-store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bypassCandidate = searchParams.get("bypassKey");

    const config = getMaintenanceConfig();

    if (bypassCandidate) {
      const isAuthorized = bypassCandidate.trim() === config.secretBypassKey;
      return NextResponse.json({
        success: true,
        authorized: isAuthorized,
        message: isAuthorized ? "کلید گذر مجاز است." : "کلید نامعتبر است.",
      });
    }

    return NextResponse.json({
      success: true,
      isEnabled: config.isEnabled,
      titleFa: config.titleFa,
      titleEn: config.titleEn,
      messageFa: config.messageFa,
      messageEn: config.messageEn,
      estimatedCompletionIso: config.estimatedCompletionIso,
      contactSupportUrl: config.contactSupportUrl,
      updatedAt: config.updatedAt,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در بررسی وضعیت نگهداری" },
      { status: 500 }
    );
  }
}
