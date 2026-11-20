import { NextRequest, NextResponse } from "next/server";
import { getActivePublicPopups } from "@/lib/admin-site-builder-store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path") || "/";
    const popups = getActivePublicPopups(path);
    return NextResponse.json({ success: true, popups });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "خطا در واکشی پاپ‌آپ‌ها" }, { status: 500 });
  }
}
