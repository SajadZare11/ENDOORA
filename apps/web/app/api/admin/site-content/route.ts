import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import {
  DEFAULT_SITE_CONTENT,
  discardDraftSiteContent,
  getDraftSiteContent,
  getLiveSiteContent,
  getSiteContentVersions,
  publishDraftSiteContent,
  rollbackSiteContentVersion,
  saveDraftSiteContent,
  type SiteContentData,
} from "@/lib/site-cms-store";

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdminSession(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }
    const backendUrl = (
      process.env.ENDOORA_API_INTERNAL_URL ?? "http://127.0.0.1:8000"
    ).replace(/\/+$/, "");

    try {
      const djangoRes = await fetch(`${backendUrl}/api/admin-ops/cms/`, {
        headers: {
          Accept: "application/json",
          Cookie: req.headers.get("cookie") || "",
        },
        cache: "no-store",
      });
      if (djangoRes.ok) {
        const djangoData = await djangoRes.json();
        if (djangoData.success) {
          // Sync live content to local disk memory store as backup
          if (djangoData.live) {
            saveDraftSiteContent(djangoData.live, "همگام‌سازی از پایگاه داده جنگو");
          }
          return NextResponse.json({
            success: true,
            live: djangoData.live,
            draft: djangoData.draft,
            versions: djangoData.versions,
            source: "authoritative_database",
          });
        }
      }
    } catch {
      // Fallback to local store if backend unreachable
    }

    const live = getLiveSiteContent();
    const draft = getDraftSiteContent();
    const versions = getSiteContentVersions();

    return NextResponse.json({
      success: true,
      live,
      draft,
      versions,
      source: "local_store",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "خطا در دریافت اطلاعات محتوا";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminSession(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const action = body.action as string;
    const user = body.user || "مدیر ارشد ایندورا";
    const backendUrl = (
      process.env.ENDOORA_API_INTERNAL_URL ?? "http://127.0.0.1:8000"
    ).replace(/\/+$/, "");

    // Forward to Django authoritative database
    try {
      const djangoRes = await fetch(`${backendUrl}/api/admin-ops/cms/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Cookie: req.headers.get("cookie") || "",
        },
        body: JSON.stringify(body),
      });

      if (djangoRes.ok) {
        const djangoData = await djangoRes.json();
        // Also keep local fallback synced
        if (action === "save_draft" && body.data) {
          saveDraftSiteContent(body.data, user);
        } else if (action === "publish") {
          publishDraftSiteContent(user, body.summary || "انتشار از دیتابیس");
        } else if (action === "rollback" && djangoData.rolledBackTo) {
          saveDraftSiteContent(djangoData.rolledBackTo, user);
        }
        return NextResponse.json(djangoData);
      }
    } catch {
      // Fallback to local file store
    }

    if (action === "save_draft") {
      const data = body.data as SiteContentData;
      if (!data) {
        return NextResponse.json({ success: false, error: "داده‌های پیش‌نویس ارسال نشده است." }, { status: 400 });
      }
      const res = saveDraftSiteContent(data, user);
      return NextResponse.json({ success: true, message: "پیش‌نویس با موفقیت ذخیره شد.", draft: res.draft });
    }

    if (action === "publish") {
      const summary = body.summary || "انتشار نسخه جدید محتوای سایت";
      const res = publishDraftSiteContent(user, summary);
      return NextResponse.json({
        success: true,
        message: `نسخه ${res.published.version} با موفقیت در سراسر سایت منتشر شد.`,
        published: res.published,
      });
    }

    if (action === "rollback") {
      const version = Number(body.version);
      if (!version) {
        return NextResponse.json({ success: false, error: "شماره نسخه برای بازگشت مشخص نشده است." }, { status: 400 });
      }
      const res = rollbackSiteContentVersion(version, user);
      return NextResponse.json({
        success: true,
        message: `سایت با موفقیت به نسخه شماره ${version} بازگردانده شد.`,
        rolledBackTo: res.rolledBackTo,
      });
    }

    if (action === "discard_draft") {
      discardDraftSiteContent();
      return NextResponse.json({ success: true, message: "پیش‌نویس لغو و حذف شد." });
    }

    if (action === "reset_default") {
      const res = publishDraftSiteContent(user, "بازنشانی کلیه تنظیمات به مقادیر اولیه کارخانه");
      saveDraftSiteContent(DEFAULT_SITE_CONTENT, user);
      return NextResponse.json({
        success: true,
        message: "محتوا با موفقیت به حالت پیش‌فرض اولیه کارخانه بازگردانده شد.",
        data: res.published,
      });
    }

    return NextResponse.json({ success: false, error: "عملیات نامعتبر است." }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "خطا در پردازش عملیات";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
