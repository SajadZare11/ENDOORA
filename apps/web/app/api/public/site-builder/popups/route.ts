import { errorMessage } from "../../../../../lib/error-message.ts";
import { NextRequest, NextResponse } from "next/server";
import { getActivePublicPopups } from "@/lib/admin-site-builder-store";

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") return NextResponse.json({success:true,popups:[]});
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path") || "/";
    const popups = getActivePublicPopups(path);
    return NextResponse.json({ success: true, popups });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: errorMessage(err) || "خطا در واکشی پاپ‌آپ‌ها" }, { status: 500 });
  }
}
