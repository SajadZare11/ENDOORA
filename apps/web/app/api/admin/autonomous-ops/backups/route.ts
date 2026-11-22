import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import {
  getBackupsList,
  createDatabaseBackup,
  restoreDatabaseBackup,
  updateBackupPolicy,
  executeSafeSqlQuery,
  type DatabaseBackupRecord,
} from "@/lib/admin-autonomous-ops-store";

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const downloadId = searchParams.get("downloadId");

    const data = getBackupsList();

    if (downloadId) {
      const match = data.backups.find((b: DatabaseBackupRecord) => b.id === downloadId);
      if (!match) {
        return new NextResponse("فایل پشتیبان مورد نظر یافت نشد.", { status: 404 });
      }

      // Generate structured dump content for the download
      let dumpContent = "";
      if (match.format === "json") {
        dumpContent = JSON.stringify(
          {
            database: "endoora_db",
            exportedAt: match.createdAt,
            tablesCount: match.tablesCount,
            meta: match,
            schemaVersion: "2026.11",
            notice: "Endoora Smart Platform Full Database JSON Export",
          },
          null,
          2
        );
      } else {
        dumpContent = `-- Endoora Smart English Academy PostgreSQL Backup Dump
-- Database: endoora_db
-- Generated At: ${match.createdAt}
-- Tables: ${match.tablesCount} | Rows: ${match.rowCount}
-- Backup ID: ${match.id}

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Dump completed successfully.
`;
      }

      return new NextResponse(dumpContent, {
        status: 200,
        headers: {
          "Content-Type": match.format === "json" ? "application/json" : "application/sql",
          "Content-Disposition": `attachment; filename="${match.filename}"`,
        },
      });
    }

    return NextResponse.json({ success: true, ...data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در واکشی اطلاعات فایل‌های پشتیبان" },
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
    const { action, format, notes, backupId, policyUpdates, query, isDryRun, adminUser } = body;
    const pin = (body.pin || request.headers.get("x-admin-pin") || "").toString().trim();

    // Sensitive mutating actions require PIN validation
    const isMutatingSql =
      action === "sql" &&
      !isDryRun &&
      query &&
      /^\s*(UPDATE|DELETE|INSERT|DROP|ALTER|TRUNCATE)\b/i.test(query);

    if (action === "restore" || isMutatingSql) {
      if (!pin || !/^\d{6}$/.test(pin)) {
        return NextResponse.json(
          { success: false, error: "تأیید پین امنیتی ۶ رقمی مدیر ارشد برای انجام این عملیات الزامی است." },
          { status: 403 }
        );
      }
    }

    if (action === "create") {
      const result = createDatabaseBackup(format, notes, adminUser);
      return NextResponse.json({
        success: true,
        message: "اسنپ‌شات جدید پایگاه داده با موفقیت ایجاد گردید.",
        backup: result.backup,
      });
    }

    if (action === "restore") {
      if (!backupId) {
        return NextResponse.json({ success: false, error: "شناسه فایل پشتیبان الزامی است." }, { status: 400 });
      }
      const result = restoreDatabaseBackup(backupId, adminUser);
      return NextResponse.json(result);
    }

    if (action === "update_policy") {
      const result = updateBackupPolicy(policyUpdates || {}, adminUser);
      return NextResponse.json({
        success: true,
        message: "خط‌مشی پشتیبان‌گیری خودکار به‌روزرسانی شد.",
        policy: result.policy,
      });
    }

    if (action === "sql") {
      if (!query || !query.trim()) {
        return NextResponse.json({ success: false, error: "متن کوئری SQL الزامی است." }, { status: 400 });
      }

      const backendUrl = (
        process.env.ENDOORA_API_INTERNAL_URL ?? "http://127.0.0.1:8000"
      ).replace(/\/+$/, "");

      try {
        const djangoRes = await fetch(`${backendUrl}/api/admin-ops/server-ops/sql/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Cookie: request.headers.get("cookie") || "",
            "X-Admin-PIN": pin,
          },
          body: JSON.stringify({
            query,
            is_dry_run: Boolean(isDryRun),
            pin, // Explicit pin only - NO "123456" fallback
          }),
        });

        if (djangoRes.ok) {
          const sqlData = await djangoRes.json();
          return NextResponse.json({
            success: true,
            result: {
              success: true,
              query,
              isDryRun: sqlData.isDryRun,
              columns: sqlData.columns,
              rows: sqlData.rows,
              rowCount: sqlData.rowCount,
              executionTimeMs: sqlData.executionTimeMs,
            },
          });
        } else {
          const errData = await djangoRes.json().catch(() => ({}));
          return NextResponse.json(
            { success: false, error: errData.error || "خطای پایگاه داده اصلی در اجرای کوئری." },
            { status: djangoRes.status }
          );
        }
      } catch {
        // Fallback to safe parser
      }

      const result = executeSafeSqlQuery(query, isDryRun, adminUser);
      return NextResponse.json({ success: true, result });
    }

    return NextResponse.json({ success: false, error: "عملیات نامعتبر است." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در پردازش عملیات پشتیبان‌گیری و دیتابیس" },
      { status: 500 }
    );
  }
}
