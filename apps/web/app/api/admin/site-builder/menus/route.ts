import { errorMessage } from "../../../../../lib/error-message.ts";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import {
  getNavigationConfig,
  saveDraftNavigation,
  publishLiveNavigation,
  rollbackNavigation,
} from "@/lib/admin-site-builder-store";

export async function GET() {
  try {
    const config = getNavigationConfig();
    return NextResponse.json({ success: true, ...config });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: errorMessage(err) || "خطا در واکشی تنظیمات منوها" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminSession(req);
    const adminUser = auth.user?.email || "مدیر ارشد ایندورا";

    const body = await req.json();
    const { action, draftConfig, targetVersion } = body;

    if (action === "save_draft") {
      const res = saveDraftNavigation(draftConfig || {}, adminUser);
      return NextResponse.json({ success: true, draft: res.draft });
    }

    if (action === "publish") {
      const res = publishLiveNavigation(adminUser);
      return NextResponse.json({ success: true, live: res.live });
    }

    if (action === "rollback") {
      if (typeof targetVersion !== "number") {
        return NextResponse.json({ success: false, error: "نسخه هدف (targetVersion) الزامی است." }, { status: 400 });
      }
      const res = rollbackNavigation(targetVersion, adminUser);
      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, live: res.live });
    }

    return NextResponse.json({ success: false, error: "عملیات منو نامعتبر است." }, { status: 400 });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: errorMessage(err) || "خطا در مدیریت منوها" },
      { status: 500 }
    );
  }
}
