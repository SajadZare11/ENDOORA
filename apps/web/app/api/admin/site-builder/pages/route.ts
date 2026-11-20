import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import {
  getCustomPages,
  saveCustomPage,
  deleteCustomPage,
} from "@/lib/admin-site-builder-store";

export async function GET() {
  try {
    const pages = getCustomPages();
    return NextResponse.json({ success: true, pages });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در واکشی برگه‌های سفارشی" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminSession(req);
    const adminUser = auth.user?.email || "مدیر ارشد ایندورا";

    const body = await req.json();
    const { action, pageData, pageId } = body;

    if (action === "delete") {
      if (!pageId) {
        return NextResponse.json({ success: false, error: "شناسه برگه الزامی است." }, { status: 400 });
      }
      const res = deleteCustomPage(pageId, adminUser);
      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: "برگه با موفقیت حذف گردید." });
    }

    if (action === "save" || !action) {
      if (!pageData) {
        return NextResponse.json({ success: false, error: "اطلاعات برگه (pageData) الزامی است." }, { status: 400 });
      }
      const res = saveCustomPage(pageData, adminUser);
      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, page: res.page });
    }

    return NextResponse.json({ success: false, error: "عملیات نامعتبر است." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در پردازش برگه سفارشی" },
      { status: 500 }
    );
  }
}
