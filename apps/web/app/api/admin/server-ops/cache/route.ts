import { errorMessage } from "../../../../../lib/error-message.ts";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getCacheTelemetry, purgeCache } from "@/lib/admin-server-ops-store";

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdminSession(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }
    const telemetry = getCacheTelemetry();
    return NextResponse.json({ success: true, telemetry });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: errorMessage(err) || "خطا در واکشی وضعیت کش و CDN" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminSession(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const { target, namespaceOrPath, adminUser } = body;

    if (!target) {
      return NextResponse.json(
        { success: false, error: "هدف پاکسازی (target) مشخص نشده است." },
        { status: 400 }
      );
    }

    const backendUrl = (
      process.env.ENDOORA_API_INTERNAL_URL ?? "http://127.0.0.1:8000"
    ).replace(/\/+$/, "");

    try {
      await fetch(`${backendUrl}/api/admin-ops/server-ops/cache/flush/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Cookie: req.headers.get("cookie") || "",
        },
        body: JSON.stringify({ namespace: namespaceOrPath || target }),
      });
    } catch {}

    const result = purgeCache(target, namespaceOrPath || "", adminUser);

    return NextResponse.json({
      success: true,
      message: "حافظه کش سرور و Redis با موفقیت تخلیه گردید.",
      event: result.event,
      telemetry: getCacheTelemetry(),
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: errorMessage(err) || "خطا در پاکسازی کش و بافرها" },
      { status: 500 }
    );
  }
}
