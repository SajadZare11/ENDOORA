import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import {
  getCustomFormsList,
  getCustomFormById,
  getCustomFormBySlug,
  saveCustomForm,
  deleteCustomForm,
} from "@/lib/admin-forms-webhooks-store";

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");

    if (id) {
      const form = getCustomFormById(id);
      if (!form) return NextResponse.json({ success: false, error: "فرم یافت نشد." }, { status: 404 });
      return NextResponse.json({ success: true, form });
    }

    if (slug) {
      const form = getCustomFormBySlug(slug);
      if (!form) return NextResponse.json({ success: false, error: "فرم یافت نشد." }, { status: 404 });
      return NextResponse.json({ success: true, form });
    }

    const forms = getCustomFormsList();
    return NextResponse.json({ success: true, forms, count: forms.length });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در واکشی فرم‌ها" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { action, form, id, adminUser } = body;

    if (action === "save" || !action) {
      if (!form || !form.titleFa || !form.slug) {
        return NextResponse.json(
          { success: false, error: "عنوان فارسی و نامک (Slug) فرم الزامی هستند." },
          { status: 400 }
        );
      }
      const result = saveCustomForm(form, adminUser || auth.user?.email);
      return NextResponse.json({
        success: true,
        message: "فرم پویا با موفقیت ذخیره و منتشر گردید.",
        form: result.form,
      });
    }

    if (action === "delete") {
      if (!id) {
        return NextResponse.json({ success: false, error: "شناسه فرم الزامی است." }, { status: 400 });
      }
      const result = deleteCustomForm(id, adminUser || auth.user?.email);
      return NextResponse.json({
        success: result.success,
        message: result.success ? "فرم با موفقیت حذف شد." : "فرم یافت نشد.",
      });
    }

    return NextResponse.json({ success: false, error: "عملیات نامعتبر است." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در ذخیره‌سازی فرم" },
      { status: 500 }
    );
  }
}
