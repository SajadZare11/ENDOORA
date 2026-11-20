import { NextResponse } from "next/server";
import {
  getDictionaryItems,
  updateDictionaryItem,
} from "@/lib/admin-autonomous-ops-store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("q") || undefined;
    const category = searchParams.get("category") || undefined;

    const items = getDictionaryItems(search, category);
    return NextResponse.json({ success: true, items, count: items.length });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در واکشی دیکشنری متون سایت" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, key, faText, enText, items, adminUser } = body;

    if (action === "update") {
      if (!key) {
        return NextResponse.json({ success: false, error: "کلید عبارت الزامی است." }, { status: 400 });
      }
      const result = updateDictionaryItem(key, faText ?? "", enText ?? "", adminUser);
      return NextResponse.json({
        success: true,
        message: `عبارت مربوط به کلید «${key}» با موفقیت به‌روزرسانی شد.`,
        item: result.item,
      });
    }

    if (action === "bulk_import" && Array.isArray(items)) {
      for (const item of items) {
        if (item.key) {
          updateDictionaryItem(item.key, item.faText || "", item.enText || "", adminUser);
        }
      }
      return NextResponse.json({
        success: true,
        message: `${items.length} عبارت با موفقیت درون‌ریزی گردید.`,
        items: getDictionaryItems(),
      });
    }

    return NextResponse.json({ success: false, error: "عملیات نامعتبر است." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در به‌روزرسانی دیکشنری" },
      { status: 500 }
    );
  }
}
