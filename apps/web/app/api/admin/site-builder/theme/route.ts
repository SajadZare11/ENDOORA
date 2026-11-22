import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import {
  getGlobalThemeConfig,
  saveGlobalThemeConfig,
} from "@/lib/admin-site-builder-store";

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdminSession(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const theme = getGlobalThemeConfig();
    return NextResponse.json({ success: true, theme });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در واکشی تم و برندینگ" },
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
    const adminUser = auth.user?.email || "مدیر ارشد ایندورا";

    const body = await req.json();
    const { themeData } = body;

    if (!themeData) {
      return NextResponse.json({ success: false, error: "تنظیمات تم (themeData) الزامی است." }, { status: 400 });
    }

    const res = saveGlobalThemeConfig(themeData, adminUser);
    return NextResponse.json({ success: true, theme: res.theme });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در ذخیره تم و برندینگ" },
      { status: 500 }
    );
  }
}
