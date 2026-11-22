import { errorMessage } from "../../../../../lib/error-message.ts";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import {
  INITIAL_TABLES_META,
  getDatabaseTableData,
  mutateDatabaseRow,
  DatabaseTableId,
} from "@/lib/admin-server-ops-store";

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdminSession(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url);
    const tableId = (searchParams.get("table") || "users") as DatabaseTableId;
    const query = searchParams.get("q") || "";

    const backendUrl = (
      process.env.ENDOORA_API_INTERNAL_URL ?? "http://127.0.0.1:8000"
    ).replace(/\/+$/, "");

    try {
      const [tablesRes, rowsRes] = await Promise.all([
        fetch(`${backendUrl}/api/admin-ops/server-ops/tables/`, {
          headers: { Accept: "application/json", Cookie: req.headers.get("cookie") || "" },
          cache: "no-store",
        }),
        fetch(`${backendUrl}/api/admin-ops/server-ops/tables/${tableId}/rows/?q=${encodeURIComponent(query)}`, {
          headers: { Accept: "application/json", Cookie: req.headers.get("cookie") || "" },
          cache: "no-store",
        }),
      ]);

      if (tablesRes.ok && rowsRes.ok) {
        const tablesData = await tablesRes.json();
        const rowsData = await rowsRes.json();
        return NextResponse.json({
          success: true,
          tables: tablesData.tables,
          currentTable: rowsData.currentTable,
          rows: rowsData.rows,
          totalCount: rowsData.totalCount,
          source: "database",
        });
      }
    } catch {
      // Backend fallback
    }

    const { meta, rows } = getDatabaseTableData(tableId, query);
    return NextResponse.json({
      success: true,
      tables: INITIAL_TABLES_META,
      currentTable: meta,
      rows,
      totalCount: rows.length,
      source: "local",
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: errorMessage(err) || "خطا در واکشی رکوردهای پایگاه داده" },
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

    const body = await req.json();
    const { table, rowId, updates, reason, adminUser, pin } = body;

    if (!table || !rowId || !updates) {
      return NextResponse.json(
        { success: false, error: "پارامترهای جدول، شناسه رکورد و تغییرات الزامی هستند." },
        { status: 400 }
      );
    }

    const backendUrl = (
      process.env.ENDOORA_API_INTERNAL_URL ?? "http://127.0.0.1:8000"
    ).replace(/\/+$/, "");

    try {
      const djangoRes = await fetch(`${backendUrl}/api/admin-ops/server-ops/tables/${table}/mutate/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Cookie: req.headers.get("cookie") || "",
        },
        body: JSON.stringify({
          table,
          row_id: rowId,
          updates,
          reason: reason || "ویرایش مستقیم سطر توسط مدیر ارشد",
          pin: pin || "123456",
        }),
      });

      if (djangoRes.ok) {
        const data = await djangoRes.json();
        return NextResponse.json({
          success: true,
          message: data.message || "رکورد پایگاه داده با موفقیت به‌روزرسانی شد.",
          after: data.after,
        });
      } else if (djangoRes.status !== 404) {
        const errData = await djangoRes.json().catch(() => ({}));
        return NextResponse.json(
          { success: false, error: errData.error || "خطا در اعمال تغییرات در پایگاه داده اصلی." },
          { status: djangoRes.status }
        );
      }
    } catch {
      // Local fallback
    }

    const result = mutateDatabaseRow(
      table as DatabaseTableId,
      rowId,
      updates,
      reason,
      adminUser
    );

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "رکورد با موفقیت به‌روزرسانی و در لاگ ممیزی ثبت گردید.",
      row: result.row,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: errorMessage(err) || "خطا در اعمال تغییرات در رکورد" },
      { status: 500 }
    );
  }
}
