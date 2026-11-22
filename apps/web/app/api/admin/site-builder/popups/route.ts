import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import {
  getSitePopups,
  saveSitePopup,
  deleteSitePopup,
} from "@/lib/admin-site-builder-store";

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdminSession(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const popups = getSitePopups();
    return NextResponse.json({ success: true, popups });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در واکشی پاپ‌آپ‌ها" },
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
    const { action, popupData, popupId } = body;

    if (action === "delete") {
      if (!popupId) {
        return NextResponse.json({ success: false, error: "شناسه پاپ‌آپ الزامی است." }, { status: 400 });
      }
      const res = deleteSitePopup(popupId, adminUser);
      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: "پاپ‌آپ با موفقیت حذف گردید." });
    }

    if (action === "save" || !action) {
      if (!popupData) {
        return NextResponse.json({ success: false, error: "اطلاعات پاپ‌آپ الزامی است." }, { status: 400 });
      }
      const res = saveSitePopup(popupData, adminUser);
      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, popup: res.popup });
    }

    return NextResponse.json({ success: false, error: "عملیات نامعتبر است." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در ذخیره پاپ‌آپ" },
      { status: 500 }
    );
  }
}
