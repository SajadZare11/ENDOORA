import { errorMessage } from "../../../../../lib/error-message.ts";
import { NextResponse } from "next/server";
import { getServerTelemetry } from "@/lib/admin-server-ops-store";

export async function GET() {
  try {
    const telemetry = getServerTelemetry();
    return NextResponse.json({ success: true, telemetry });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: errorMessage(err) || "خطا در واکشی تله‌متری سرور" },
      { status: 500 }
    );
  }
}
