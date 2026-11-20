import { NextResponse } from "next/server";
import { getServerTelemetry } from "@/lib/admin-server-ops-store";

export async function GET() {
  try {
    const telemetry = getServerTelemetry();
    return NextResponse.json({ success: true, telemetry });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در واکشی تله‌متری سرور" },
      { status: 500 }
    );
  }
}
