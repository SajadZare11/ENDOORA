import { NextRequest, NextResponse } from "next/server";
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
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || searchParams.get("q");
    const roleFilter = searchParams.get("role");
    const statusFilter = searchParams.get("status");

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
    const body = await req.json();
    const action = body.action as string;
    const actor = body.actor || "مدیر ارشد ایندورا";

    if (action === "reset_seed") {
      saveUsers360ToDisk([...INITIAL_USERS_360]);
      const stats = getUserOperationsStats();
      return NextResponse.json({
        success: true,
        message: "داده‌های کاربران با موفقیت به مقادیر اولیه کارخانه بازنشانی شد.",
        users: INITIAL_USERS_360,
        stats,
      });
    }

    const userId = body.userId as string;
    if (!userId) {
      return NextResponse.json({ success: false, error: "شناسه کاربر الزامی است." }, { status: 400 });
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
        actor_id: "usr-admin-1",
        actor_email: "founder@endoora.ir",
        actor_role: "administrator",
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
        actor_id: "usr-admin-1",
        actor_email: "founder@endoora.ir",
        actor_role: "administrator",
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
        actor_id: "usr-admin-1",
        actor_email: "founder@endoora.ir",
        actor_role: "administrator",
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
        actor_id: "usr-admin-1",
        actor_email: "founder@endoora.ir",
        actor_role: "administrator",
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
