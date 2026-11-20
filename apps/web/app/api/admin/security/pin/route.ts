import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminSession(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const action = body.action || "verify"; // verify or change
    const backendUrl = (
      process.env.ENDOORA_API_INTERNAL_URL ?? "http://127.0.0.1:8000"
    ).replace(/\/+$/, "");

    const endpoint = action === "change"
      ? `${backendUrl}/api/admin-ops/security/pin/change/`
      : `${backendUrl}/api/admin-ops/security/pin/verify/`;

    const djangoRes = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: req.headers.get("cookie") || "",
      },
      body: JSON.stringify(body),
    });

    const data = await djangoRes.json();
    return NextResponse.json(data, { status: djangoRes.status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "خطا در پردازش پین امنیتی";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
