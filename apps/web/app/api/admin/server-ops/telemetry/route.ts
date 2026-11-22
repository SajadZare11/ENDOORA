import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getServerTelemetry } from "@/lib/admin-server-ops-store";

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdminSession(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const telemetry = getServerTelemetry();
    return NextResponse.json({ success: true, telemetry });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در واکشی تله‌متری سرور" },
      { status: 500 }
    );
  }
}
