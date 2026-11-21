import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";

import {
  getSeoMetadataData,
  updatePageSeoMetadata,
  createRedirectRule,
  toggleRedirectRule,
  deleteRedirectRule,
  updateSchemaJsonLd,
  resetSeoMetadataDataToInitial,
  type RedirectType,
} from "@/lib/seo-metadata-store";
import { recordAuditLog } from "@/lib/admin-ops";

export async function GET() {
  if (process.env.NODE_ENV === "production") return new Response(null, { status: 404 });
  try {
    const data = getSeoMetadataData();
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error("Error in GET /api/admin/seo:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "خطای سرور در واکشی داده‌های سئو" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") return new Response(null, { status: 404 });
  try {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

    const body = await req.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: "فیلد action الزامی است." },
        { status: 400 }
      );
    }

    switch (action) {
      case "update_page_meta": {
        const { pagePath, updates } = body;
        if (!pagePath || !updates) {
          return NextResponse.json(
            { success: false, error: "مسیر صفحه (pagePath) و فیلدهای متادیتا الزامی هستند." },
            { status: 400 }
          );
        }
        const result = updatePageSeoMetadata(pagePath, updates, "مدیر ارشد سئو");
        if (result.success) {
          recordAuditLog({
            actor_id: auth.user?.id || "admin",
            actor_email: "admin@endoora.com",
            actor_role: auth.user?.role || "administrator",
            target_app: "seo",
            target_model: "PageSeoMetadata",
            target_pk: pagePath,
            action: "update",
            before_summary: {},
            after_summary: { pagePath, metaTitle: result.page.metaTitle },
            reason: `به‌روزرسانی عنوان و متادیتای سئوی صفحه ${pagePath}`,
            request_method: "POST",
            request_path: "/api/admin/seo",
            environment: "production",
          });
        }
        return NextResponse.json(result);
      }

      case "create_redirect": {
        const { sourcePath, destinationPath, redirectType, notes } = body;
        if (!sourcePath || !destinationPath) {
          return NextResponse.json(
            { success: false, error: "مسیر مبدا و مقصد ریدایرکت الزامی هستند." },
            { status: 400 }
          );
        }

        const result = createRedirectRule({
          sourcePath,
          destinationPath,
          redirectType: (redirectType as RedirectType) || "301_permanent",
          notes,
        });

        if (!result.success) {
          return NextResponse.json(
            { success: false, error: result.error || "خطا در ایجاد ریدایرکت" },
            { status: 400 }
          );
        }

        recordAuditLog({
          actor_id: auth.user?.id || "admin",
          actor_email: "admin@endoora.com",
          actor_role: auth.user?.role || "administrator",
          target_app: "seo",
          target_model: "UrlRedirectRule",
          target_pk: result.rule.id,
          action: "create",
          before_summary: {},
          after_summary: { sourcePath, destinationPath, redirectType },
          reason: `ثبت ریدایرکت ${redirectType || "301"} از ${sourcePath} به ${destinationPath}`,
          request_method: "POST",
          request_path: "/api/admin/seo",
          environment: "production",
        });

        return NextResponse.json(result);
      }

      case "toggle_redirect": {
        const { ruleId, isActive } = body;
        if (!ruleId || typeof isActive !== "boolean") {
          return NextResponse.json(
            { success: false, error: "شناسه قاعده و وضعیت جدید الزامی هستند." },
            { status: 400 }
          );
        }
        const result = toggleRedirectRule(ruleId, isActive);
        if (result.success) {
          recordAuditLog({
            actor_id: auth.user?.id || "admin",
            actor_email: "admin@endoora.com",
            actor_role: auth.user?.role || "administrator",
            target_app: "seo",
            target_model: "UrlRedirectRule",
            target_pk: ruleId,
            action: "update",
            before_summary: { isActive: !isActive },
            after_summary: { isActive },
            reason: `تغییر وضعیت ریدایرکت #${ruleId} به ${isActive ? "فعال" : "غیرفعال"}`,
            request_method: "POST",
            request_path: "/api/admin/seo",
            environment: "production",
          });
        }
        return NextResponse.json(result);
      }

      case "delete_redirect": {
        const { ruleId } = body;
        if (!ruleId) {
          return NextResponse.json(
            { success: false, error: "شناسه قاعده (ruleId) الزامی است." },
            { status: 400 }
          );
        }
        const result = deleteRedirectRule(ruleId);
        if (result.success) {
          recordAuditLog({
            actor_id: auth.user?.id || "admin",
            actor_email: "admin@endoora.com",
            actor_role: auth.user?.role || "administrator",
            target_app: "seo",
            target_model: "UrlRedirectRule",
            target_pk: ruleId,
            action: "delete",
            before_summary: { ruleId },
            after_summary: { deleted: true },
            reason: `حذف دائمی قاعده ریدایرکت #${ruleId}`,
            request_method: "POST",
            request_path: "/api/admin/seo",
            environment: "production",
          });
        }
        return NextResponse.json(result);
      }

      case "update_schema": {
        const { schemaId, jsonLdPayload } = body;
        if (!schemaId || !jsonLdPayload) {
          return NextResponse.json(
            { success: false, error: "شناسه اسکیما و کد JSON-LD الزامی هستند." },
            { status: 400 }
          );
        }
        const result = updateSchemaJsonLd(schemaId, jsonLdPayload);
        if (result.success) {
          recordAuditLog({
            actor_id: auth.user?.id || "admin",
            actor_email: "admin@endoora.com",
            actor_role: auth.user?.role || "administrator",
            target_app: "seo",
            target_model: "SchemaJsonLd",
            target_pk: schemaId,
            action: "update",
            before_summary: {},
            after_summary: { schemaId },
            reason: `ویرایش داده ساختاریافته اسکیما #${schemaId}`,
            request_method: "POST",
            request_path: "/api/admin/seo",
            environment: "production",
          });
        }
        return NextResponse.json(result);
      }

      case "reset_seed": {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ success: false, error: "عملیات بازنشانی داده‌های کارخانه در محیط عملیاتی غیرمجاز است." }, { status: 403 });
      }

        resetSeoMetadataDataToInitial();
        recordAuditLog({
          actor_id: auth.user?.id || "admin",
          actor_email: "admin@endoora.com",
          actor_role: auth.user?.role || "administrator",
          target_app: "seo",
          target_model: "SeoSeed",
          target_pk: "seed_data",
          action: "update",
          before_summary: {},
          after_summary: { reset: true },
          reason: "بازنشانی دیتای اولیه استودیوی سئو و ریدایرکت‌ها",
          request_method: "POST",
          request_path: "/api/admin/seo",
          environment: "production",
        });
        return NextResponse.json({
          success: true,
          message: "داده‌های آزمایشی استودیوی سئو با موفقیت بازنشانی شدند.",
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: `عملیات نامعتبر: ${action}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Error in POST /api/admin/seo:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "خطای پردازش عملیات سئو" },
      { status: 500 }
    );
  }
}
