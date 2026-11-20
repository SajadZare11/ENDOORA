import { NextResponse } from "next/server";
import { getNavigationConfig, getGlobalThemeConfig } from "@/lib/admin-site-builder-store";

export async function GET() {
  try {
    const { live } = getNavigationConfig();
    const theme = getGlobalThemeConfig();
    return NextResponse.json({
      success: true,
      menu: live,
      theme,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "خطا در واکشی منوهای فعال" }, { status: 500 });
  }
}
