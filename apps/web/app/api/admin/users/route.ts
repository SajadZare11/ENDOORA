import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";

import {
  getUsers360,
  getUserOperationsStats,
  saveUsers360ToDisk,
  adjustUserWallet,
  issueWarningStrike,
  pardonWarningStrike,
  grantUserCourse,
  resetUserCourseQuiz,
  updateUserLevel,
  updateUserRole,
  toggleUserActive,
  AVAILABLE_COURSES_CATALOG,
  STRIKE_REASON_PRESETS,
  INITIAL_USERS_360,
  type CEFRLevel,
  type UserRole,
} from "@/lib/admin-users-store";
import { recordAuditLog } from "@/lib/admin-ops";

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") return new Response(null, { status: 404 });
  try {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || searchParams.get("q");
    const roleFilter = searchParams.get("role");
    const statusFilter = searchParams.get("status");

    const backendUrl = (
      process.env.ENDOORA_API_INTERNAL_URL ?? "http://127.0.0.1:8000"
    ).replace(/\/+$/, "");

    try {
      const qs = searchParams.toString();
      const djangoRes = await fetch(`${backendUrl}/api/admin-ops/users/?${qs}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Cookie: req.headers.get("cookie") || "",
        },
        cache: "no-store",
      });
      if (djangoRes.ok) {
        const djangoData = await djangoRes.json();
        if (djangoData.users && djangoData.users.length > 0) {
          return NextResponse.json({
            success: true,
            users: djangoData.users,
            stats: djangoData.stats || getUserOperationsStats(),
            availableCourses: AVAILABLE_COURSES_CATALOG,
            strikePresets: STRIKE_REASON_PRESETS,
          });
        }
      }
    } catch {
      // Fallback to store
    }

    let users = getUsers360();

    if (search) {
      const q = search.trim().toLowerCase();
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.phone.includes(q) ||
          (u.nationalId && u.nationalId.includes(q)) ||
          (u.city && u.city.toLowerCase().includes(q))
      );
    }

    if (roleFilter && roleFilter !== "all") {
      users = users.filter((u) => u.role === roleFilter);
    }

    if (statusFilter && statusFilter !== "all") {
      if (statusFilter === "active") users = users.filter((u) => u.isActive);
      else if (statusFilter === "banned") users = users.filter((u) => !u.isActive);
      else if (statusFilter === "has_strikes")
        users = users.filter((u) => u.warningStrikes.some((s) => s.isActive));
      else if (statusFilter === "premium")
        users = users.filter((u) => u.subscriptionTier === "pro_vip" || u.subscriptionTier === "plus");
    }

    const stats = getUserOperationsStats();

    return NextResponse.json({
      success: true,
      users,
      stats,
      availableCourses: AVAILABLE_COURSES_CATALOG,
      strikePresets: STRIKE_REASON_PRESETS,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "خطا در دریافت لیست کاربران";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
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
    const action = body.action as string;
    const actor = auth.user ? `${auth.user.first_name || ""} ${auth.user.last_name || ""}`.trim() || auth.user.email : "مدیر سامانه";

    if (action === "reset_seed") {
      if ((process.env.NODE_ENV as string) === "production") {
        return NextResponse.json({ success: false, error: "عملیات بازنشانی داده‌های کارخانه در محیط عملیاتی غیرمجاز است." }, { status: 403 });
      }

      saveUsers360ToDisk([...INITIAL_USERS_360]);
      const stats = getUserOperationsStats();
      return NextResponse.json({
        success: true,
        message: "داده‌های کاربران با موفقیت به مقادیر اولیه کارخانه بازنشانی شد.",
        users: INITIAL_USERS_360,
        stats,
      });
    }

    if (action === "exit_impersonation") {
      const backendUrl = (
        process.env.ENDOORA_API_INTERNAL_URL ?? "http://127.0.0.1:8000"
      ).replace(/\/+$/, "");
      try {
        await fetch(`${backendUrl}/api/admin-ops/users/impersonate/exit/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Cookie: req.headers.get("cookie") || "",
          },
        });
      } catch {}
      const resObj = NextResponse.json({ success: true, message: "خروج از حالت شبیه‌سازی با موفقیت انجام شد." });
      resObj.cookies.delete("endoora_impersonation");
      return resObj;
    }

    const userId = body.userId as string;
    if (!userId) {
      return NextResponse.json({ success: false, error: "شناسه کاربر الزامی است." }, { status: 400 });
    }

    const backendUrl = (
      process.env.ENDOORA_API_INTERNAL_URL ?? "http://127.0.0.1:8000"
    ).replace(/\/+$/, "");

    // Authoritative Django mutation
    if (["adjust_wallet", "update_role", "toggle_active", "ban", "impersonate", "kill_sessions", "grant_subscription"].includes(action)) {
      try {
        const djangoRes = await fetch(`${backendUrl}/api/admin-ops/users/${userId}/action/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Cookie: req.headers.get("cookie") || "",
            "X-CSRFToken": req.cookies.get("csrftoken")?.value || "",
          },
          body: JSON.stringify(body),
        });
        if (djangoRes.ok) {
          const djangoData = await djangoRes.json();
          if (action === "adjust_wallet") {
            adjustUserWallet(userId, { amountToman: Number(body.amountToman), reasonCategory: body.reasonCategory, adminNote: body.adminNote, actor });
          } else if (action === "update_role") {
            updateUserRole(userId, body.role);
          } else if (action === "toggle_active" || action === "ban") {
            toggleUserActive(userId);
          }
          const response = NextResponse.json({
            success: true,
            ...djangoData,
            stats: getUserOperationsStats(),
          });

          if (action === "impersonate" && djangoData.impersonation) {
            response.cookies.set("endoora_impersonation", JSON.stringify(djangoData.impersonation), {
              path: "/",
              maxAge: 3600,
              httpOnly: false,
              sameSite: "lax",
            });
          }

          const setCookieHeaders = djangoRes.headers.getSetCookie?.() || [];
          for (const cookieStr of setCookieHeaders) {
            response.headers.append("Set-Cookie", cookieStr);
          }

          return response;
        } else if (djangoRes.status !== 404) {
          const errData = await djangoRes.json().catch(() => ({}));
          return NextResponse.json(
            { success: false, error: errData.error || "خطای پایگاه داده اصلی در ثبت تغییرات." },
            { status: djangoRes.status }
          );
        }
      } catch {
        // Backend not directly reachable in isolated environment, proceed with local store
      }
    }

    if (action === "adjust_wallet") {
      const amountToman = Number(body.amountToman);
      const reasonCategory = body.reasonCategory;
      const adminNote = body.adminNote || "";

      if (isNaN(amountToman) || amountToman === 0) {
        return NextResponse.json({ success: false, error: "مبلغ وارد شده معتبر نمی‌باشد." }, { status: 400 });
      }

      if (!adminNote.trim()) {
        return NextResponse.json(
          { success: false, error: "ثبت یادداشت و دلیل تراکنش برای ممیزی حسابداری الزامی است." },
          { status: 400 }
        );
      }

      const res = adjustUserWallet(userId, { amountToman, reasonCategory, adminNote, actor });
      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      recordAuditLog({
        actor_id: auth.user?.id || "admin",
        actor_email: auth.user?.email || "admin@endoora.ir",
        actor_role: auth.user?.role || "administrator",
        action: "update",
        target_app: "ledger",
        target_model: "UserWallet",
        target_pk: userId,
        before_summary: { walletAction: amountToman > 0 ? "credit" : "debit" },
        after_summary: { balanceAfter: res.user?.walletBalanceToman, amount: amountToman },
        reason: `تعدیل کیف‌پول ${res.user?.name}: ${amountToman.toLocaleString("fa-IR")} تومان | ${adminNote}`,
        request_method: "POST",
        request_path: "/api/admin/users",
        environment: "production",
      });

      return NextResponse.json({
        success: true,
        message: `موجودی کیف پول با موفقیت به ${res.user?.walletBalanceToman.toLocaleString("fa-IR")} تومان تغییر یافت.`,
        user: res.user,
        stats: getUserOperationsStats(),
      });
    }

    if (action === "issue_strike") {
      const reasonPreset = body.reasonPreset;
      const detailMessage = body.detailMessage || "";

      if (!reasonPreset || !detailMessage.trim()) {
        return NextResponse.json(
          { success: false, error: "انتخاب عنوان تخلف و درج متن اخطار الزامی است." },
          { status: 400 }
        );
      }

      const res = issueWarningStrike(userId, { reasonPreset, detailMessage, actor });
      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      recordAuditLog({
        actor_id: auth.user?.id || "admin",
        actor_email: auth.user?.email || "admin@endoora.ir",
        actor_role: auth.user?.role || "administrator",
        action: "create",
        target_app: "moderation",
        target_model: "WarningStrike",
        target_pk: userId,
        before_summary: { strikesCount: (res.user?.warningStrikes.length || 1) - 1 },
        after_summary: { strikeNumber: res.strike?.strikeNumber, isActive: res.user?.isActive },
        reason: `ثبت اخطار انضباطی شماره ${res.strike?.strikeNumber} برای ${res.user?.name}: ${reasonPreset}`,
        request_method: "POST",
        request_path: "/api/admin/users",
        environment: "production",
      });

      let msg = `اخطار شماره ${res.strike?.strikeNumber} با موفقیت در پرونده ثبت شد.`;
      if (res.strike?.strikeNumber === 2) {
        msg += " (تعلیق ۷ روزه رزرو کلاس برای کاربر اعمال گردید)";
      } else if (res.strike?.strikeNumber === 3) {
        msg += " (حساب کاربری به دلیل دریافت ۳ اخطار خودکار مسدود گردید)";
      }

      return NextResponse.json({
        success: true,
        message: msg,
        user: res.user,
        stats: getUserOperationsStats(),
      });
    }

    if (action === "pardon_strike") {
      const strikeId = body.strikeId as string;
      const pardonReason = body.pardonReason || "بخشش انضباطی توسط مدیر";

      if (!strikeId) {
        return NextResponse.json({ success: false, error: "شناسه اخطار نامعتبر است." }, { status: 400 });
      }

      const res = pardonWarningStrike(userId, strikeId, { pardonReason, actor });
      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      recordAuditLog({
        actor_id: auth.user?.id || "admin",
        actor_email: auth.user?.email || "admin@endoora.ir",
        actor_role: auth.user?.role || "administrator",
        action: "update",
        target_app: "moderation",
        target_model: "WarningStrike",
        target_pk: strikeId,
        before_summary: { active: true },
        after_summary: { active: false, pardoned: true },
        reason: `لغو و بخشش اخطار انضباطی برای ${res.user?.name}: ${pardonReason}`,
        request_method: "POST",
        request_path: "/api/admin/users",
        environment: "production",
      });

      return NextResponse.json({
        success: true,
        message: `اخطار انضباطی با موفقیت بخشیده شد و محدودیت‌های مربوطه رفع گردید.`,
        user: res.user,
        stats: getUserOperationsStats(),
      });
    }

    if (action === "grant_course") {
      const courseId = body.courseId as string;
      const res = grantUserCourse(userId, courseId, actor);
      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      recordAuditLog({
        actor_id: auth.user?.id || "admin",
        actor_email: auth.user?.email || "admin@endoora.ir",
        actor_role: auth.user?.role || "administrator",
        action: "create",
        target_app: "courses",
        target_model: "CourseEnrollment",
        target_pk: courseId,
        before_summary: {},
        after_summary: { enrolledCourse: courseId },
        reason: `اعطای مستقیم دسترسی به دوره ${courseId} برای ${res.user?.name}`,
        request_method: "POST",
        request_path: "/api/admin/users",
        environment: "production",
      });

      return NextResponse.json({
        success: true,
        message: `دسترسی به دوره با موفقیت به زبان‌آموز اعطا شد.`,
        user: res.user,
        stats: getUserOperationsStats(),
      });
    }

    if (action === "reset_quiz") {
      const courseId = body.courseId as string;
      const res = resetUserCourseQuiz(userId, courseId);
      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: `دفعات آزمون‌های دوره برای کاربر بازنشانی شد.`,
        user: res.user,
      });
    }

    if (action === "update_level") {
      const level = body.level as CEFRLevel;
      const res = updateUserLevel(userId, level);
      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: `سطح یادگیری زبان‌آموز با موفقیت به ${level} به‌روزرسانی شد.`,
        user: res.user,
      });
    }

    if (action === "update_role") {
      const role = body.role as UserRole;
      const res = updateUserRole(userId, role);
      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: `نقش کاربری با موفقیت به ${role} تغییر یافت.`,
        user: res.user,
      });
    }

    if (action === "toggle_active") {
      const res = toggleUserActive(userId);
      if (!res.success) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      const statusText = res.user?.isActive ? "فعال" : "مسدود";
      return NextResponse.json({
        success: true,
        message: `حساب کاربری با موفقیت ${statusText} شد.`,
        user: res.user,
        stats: getUserOperationsStats(),
      });
    }

    return NextResponse.json({ success: false, error: "عملیات نامعتبر است." }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "خطا در پردازش عملیات کاربر";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
