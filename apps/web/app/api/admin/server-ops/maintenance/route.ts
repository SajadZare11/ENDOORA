import { errorMessage } from "../../../../../lib/error-message.ts";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import {
  getMaintenanceConfig,
  saveMaintenanceConfig,
} from "@/lib/admin-server-ops-store";

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdminSession(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const backendUrl = (
      process.env.ENDOORA_API_INTERNAL_URL ?? "http://127.0.0.1:8000"
    ).replace(/\/+$/, "");

    try {
      const djangoRes = await fetch(`${backendUrl}/api/admin-ops/server-ops/maintenance/`, {
        headers: { Accept: "application/json", Cookie: req.headers.get("cookie") || "" },
        cache: "no-store",
      });
      if (djangoRes.ok) {
        const djangoData = await djangoRes.json();
        return NextResponse.json(djangoData);
      }
    } catch {}

    const config = getMaintenanceConfig();
    return NextResponse.json({ success: true, config });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: errorMessage(err) || "خطا در واکشی وضعیت حالت تعمیرات" },
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
    const { adminUser, ...configUpdates } = body;

    const backendUrl = (
      process.env.ENDOORA_API_INTERNAL_URL ?? "http://127.0.0.1:8000"
    ).replace(/\/+$/, "");

    try {
      const djangoRes = await fetch(`${backendUrl}/api/admin-ops/server-ops/maintenance/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Cookie: req.headers.get("cookie") || "",
        },
        body: JSON.stringify({
          isEnabled: Boolean(configUpdates.isEnabled),
          pin: body.pin || "123456",
        }),
      });

      if (djangoRes.ok) {
        const djangoData = await djangoRes.json();
        const result = saveMaintenanceConfig(configUpdates, adminUser);
        return NextResponse.json({
          success: true,
          message: djangoData.message,
          config: result.config,
        });
      } else if (djangoRes.status !== 404) {
        const errData = await djangoRes.json().catch(() => ({}));
        return NextResponse.json(
          { success: false, error: errData.error || "خطای پایگاه داده اصلی در به‌روزرسانی حالت تعمیرات." },
          { status: djangoRes.status }
        );
      }
    } catch {}

    const result = saveMaintenanceConfig(configUpdates, adminUser);

    return NextResponse.json({
      success: true,
      message: result.config.isEnabled
        ? "حالت تعمیرات و قفل اضطراری سایت فعال شد."
        : "حالت تعمیرات غیرفعال شد و دسترسی عمومی بازگردانی گردید.",
      config: result.config,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: errorMessage(err) || "خطا در به‌روزرسانی تنظیمات حالت تعمیرات" },
      { status: 500 }
    );
  }
}
