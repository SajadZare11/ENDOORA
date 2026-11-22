import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdminSession(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url);
    const backendUrl = (
      process.env.ENDOORA_API_INTERNAL_URL ?? "http://127.0.0.1:8000"
    ).replace(/\/+$/, "");

    const djangoRes = await fetch(`${backendUrl}/api/admin-ops/media/?${searchParams.toString()}`, {
      headers: {
        Accept: "application/json",
        Cookie: req.headers.get("cookie") || "",
        "X-Forwarded-Proto": process.env.NODE_ENV === "production" ? "https" : "http",
        "X-CSRFToken": req.headers.get("x-csrftoken") || "",
      },
      cache: "no-store",
    });

    const data = await djangoRes.json();
    return NextResponse.json(data, { status: djangoRes.status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "خطا در واکشی رسانه‌ها";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminSession(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const formData = await req.formData();
    const backendUrl = (
      process.env.ENDOORA_API_INTERNAL_URL ?? "http://127.0.0.1:8000"
    ).replace(/\/+$/, "");

    const djangoRes = await fetch(`${backendUrl}/api/admin-ops/media/`, {
      method: "POST",
      headers: {
        Cookie: req.headers.get("cookie") || "",
        "X-Forwarded-Proto": process.env.NODE_ENV === "production" ? "https" : "http",
        "X-CSRFToken": req.headers.get("x-csrftoken") || "",
      },
      body: formData,
    });

    const data = await djangoRes.json();
    return NextResponse.json(data, { status: djangoRes.status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "خطا در بارگذاری فایل";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
