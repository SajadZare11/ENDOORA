import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAdminSession(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    const backendUrl = (
      process.env.ENDOORA_API_INTERNAL_URL ?? "http://127.0.0.1:8000"
    ).replace(/\/+$/, "");

    const djangoRes = await fetch(`${backendUrl}/api/admin-ops/media/${id}/`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Cookie: req.headers.get("cookie") || "",
        "X-Forwarded-Proto": process.env.NODE_ENV === "production" ? "https" : "http",
        "X-CSRFToken": req.headers.get("x-csrftoken") || "",
      },
    });

    const data = await djangoRes.json();
    return NextResponse.json(data, { status: djangoRes.status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "خطا در حذف فایل";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
