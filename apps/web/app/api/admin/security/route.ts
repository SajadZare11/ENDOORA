import { NextRequest, NextResponse } from "next/server";
import {
  getSecurityCommandData,
  getSecurityCommandStats,
  killSession,
  forceLogoutAllUserSessions,
  blockIp,
  unblockIp,
  whitelistIp,
  updateMaintenanceConfig,
  resetSecurityCommandDataToInitial,
  type SessionRiskLevel,
  type IpRuleType,
  type AttackVectorType,
} from "@/lib/security-command-store";
import { recordAuditLog } from "@/lib/admin-ops";

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") return new Response(null, { status: 404 });
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || searchParams.get("q");
    const roleFilter = searchParams.get("role");
    const riskFilter = searchParams.get("risk");
    const ruleTypeFilter = searchParams.get("ruleType");

    const data = getSecurityCommandData();
    let sessions = [...data.sessions];
    let rules = [...data.rules];

    // Filter sessions
    if (roleFilter && roleFilter !== "all") {
      sessions = sessions.filter((s) => s.userRole === roleFilter);
    }
    if (riskFilter && riskFilter !== "all") {
      sessions = sessions.filter((s) => s.riskLevel === (riskFilter as SessionRiskLevel));
    }
    if (search) {
      const q = search.trim().toLowerCase();
      sessions = sessions.filter(
        (s) =>
          s.id.toLowerCase().includes(q) ||
          s.userName.toLowerCase().includes(q) ||
          s.userEmail.toLowerCase().includes(q) ||
          s.ipAddress.includes(q) ||
          s.location.toLowerCase().includes(q) ||
          s.deviceOs.toLowerCase().includes(q) ||
          s.browser.toLowerCase().includes(q) ||
          s.currentRoute.toLowerCase().includes(q) ||
          (s.riskReason && s.riskReason.toLowerCase().includes(q))
      );
    }

    // Filter firewall rules
    if (ruleTypeFilter && ruleTypeFilter !== "all") {
      rules = rules.filter((r) => r.ruleType === (ruleTypeFilter as IpRuleType));
    }
    if (search) {
      const q = search.trim().toLowerCase();
      rules = rules.filter(
        (r) =>
          r.ipAddress.includes(q) ||
          r.reason.toLowerCase().includes(q) ||
          r.createdBy.toLowerCase().includes(q) ||
          r.attackVector.toLowerCase().includes(q)
      );
    }

    const stats = getSecurityCommandStats();

    return NextResponse.json({
      success: true,
      sessions,
      rules,
      maintenanceConfig: data.maintenanceConfig,
      stats,
    });
  } catch (error: any) {
    console.error("Error in GET /api/admin/security:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "خطای سرور در واکشی داده‌های امنیتی" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") return new Response(null, { status: 404 });
  try {
    const body = await req.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: "فیلد action الزامی است." },
        { status: 400 }
      );
    }

    switch (action) {
      case "kill_session": {
        const { sessionId, reason } = body;
        if (!sessionId) {
          return NextResponse.json(
            { success: false, error: "شناسه نشست (sessionId) الزامی است." },
            { status: 400 }
          );
        }
        const result = killSession(sessionId);
        if (result.success) {
          recordAuditLog({
            actor_id: "usr-admin-1",
            actor_email: "admin@endoora.com",
            actor_role: "administrator",
            target_app: "security_command",
            target_model: "LiveUserSession",
            target_pk: sessionId,
            action: "delete",
            before_summary: { sessionId },
            after_summary: { active: false },
            reason: reason || "ابطال فوری نشست توسط مدیر ارشد در اتاق امنیت",
            request_method: "POST",
            request_path: "/api/admin/security",
            environment: "production",
          });
        }
        return NextResponse.json(result);
      }

      case "force_logout_user": {
        const { userId, reason } = body;
        if (!userId) {
          return NextResponse.json(
            { success: false, error: "شناسه کاربر (userId) الزامی است." },
            { status: 400 }
          );
        }
        const result = forceLogoutAllUserSessions(userId);
        if (result.success) {
          recordAuditLog({
            actor_id: "usr-admin-1",
            actor_email: "admin@endoora.com",
            actor_role: "administrator",
            target_app: "security_command",
            target_model: "UserActiveSessions",
            target_pk: userId,
            action: "delete",
            before_summary: { userId },
            after_summary: { removedCount: result.removedCount },
            reason: reason || "خروج اجباری کاربر از تمام دستگاه‌ها توسط مدیر ارشد",
            request_method: "POST",
            request_path: "/api/admin/security",
            environment: "production",
          });
        }
        return NextResponse.json(result);
      }

      case "block_ip": {
        const { ipAddress, reason, duration, attackVector, threatScore } = body;
        if (!ipAddress || !reason) {
          return NextResponse.json(
            { success: false, error: "آدرس IP و علت مسدودسازی الزامی هستند." },
            { status: 400 }
          );
        }
        const result = blockIp({
          ipAddress,
          reason,
          duration: duration || "permanent",
          attackVector: (attackVector as AttackVectorType) || "manual_admin_ban",
          threatScore: threatScore ? Number(threatScore) : 90,
          createdBy: "مدیر ارشد امنیت (پنل ادمین)",
        });
        recordAuditLog({
          actor_id: "usr-admin-1",
          actor_email: "admin@endoora.com",
          actor_role: "administrator",
          target_app: "security_command",
          target_model: "IpFirewallRule",
          target_pk: ipAddress,
          action: "create",
          before_summary: {},
          after_summary: { ipAddress, duration: duration || "permanent", threatScore: result.rule.threatScore },
          reason: `مسدودسازی IP ${ipAddress} با برچسب ${duration || "permanent"}: ${reason}`,
          request_method: "POST",
          request_path: "/api/admin/security",
          environment: "production",
        });
        return NextResponse.json(result);
      }

      case "unblock_ip": {
        const { ruleId } = body;
        if (!ruleId) {
          return NextResponse.json(
            { success: false, error: "شناسه قانون فایروال (ruleId) الزامی است." },
            { status: 400 }
          );
        }
        const result = unblockIp(ruleId);
        if (result.success) {
          recordAuditLog({
            actor_id: "usr-admin-1",
            actor_email: "admin@endoora.com",
            actor_role: "administrator",
            target_app: "security_command",
            target_model: "IpFirewallRule",
            target_pk: ruleId,
            action: "update",
            before_summary: { ruleId, status: "active" },
            after_summary: { status: "lifted" },
            reason: "لغو مسدودی آدرس IP از فایروال",
            request_method: "POST",
            request_path: "/api/admin/security",
            environment: "production",
          });
        }
        return NextResponse.json(result);
      }

      case "whitelist_ip": {
        const { ipAddress, reason } = body;
        if (!ipAddress || !reason) {
          return NextResponse.json(
            { success: false, error: "آدرس IP و دلیل مجازسازی الزامی هستند." },
            { status: 400 }
          );
        }
        const result = whitelistIp({
          ipAddress,
          reason,
          createdBy: "مدیر ارشد امنیت",
        });
        recordAuditLog({
          actor_id: "usr-admin-1",
          actor_email: "admin@endoora.com",
          actor_role: "administrator",
          target_app: "security_command",
          target_model: "IpFirewallRule",
          target_pk: ipAddress,
          action: "create",
          before_summary: {},
          after_summary: { ipAddress, ruleType: "whitelist" },
          reason: `ثبت آدرس مجاز وایت‌لیست ${ipAddress}: ${reason}`,
          request_method: "POST",
          request_path: "/api/admin/security",
          environment: "production",
        });
        return NextResponse.json(result);
      }

      case "toggle_maintenance": {
        const { isMaintenanceActive, headline, userMessage, estimatedEndTime, lockdownLevel } =
          body;
        if (typeof isMaintenanceActive !== "boolean") {
          return NextResponse.json(
            { success: false, error: "وضعیت isMaintenanceActive باید بولین باشد." },
            { status: 400 }
          );
        }
        const result = updateMaintenanceConfig({
          isMaintenanceActive,
          ...(headline && { headline }),
          ...(userMessage && { userMessage }),
          ...(estimatedEndTime && { estimatedEndTime }),
          ...(lockdownLevel && { lockdownLevel }),
          updatedBy: "مدیر ارشد ایندورا",
        });
        recordAuditLog({
          actor_id: "usr-admin-1",
          actor_email: "admin@endoora.com",
          actor_role: "administrator",
          target_app: "security_command",
          target_model: "MaintenanceConfig",
          target_pk: "platform_maintenance",
          action: "update",
          before_summary: { isMaintenanceActive: !isMaintenanceActive },
          after_summary: { isMaintenanceActive },
          reason: isMaintenanceActive
            ? "فعال‌سازی حالت اضطراری قرنطینه و تعمیرات پلتفرم"
            : "غیرفعال‌سازی حالت قرنطینه و بازگشت به سرویس‌دهی عادی",
          request_method: "POST",
          request_path: "/api/admin/security",
          environment: "production",
        });
        return NextResponse.json(result);
      }

      case "update_maintenance_config": {
        const { headline, userMessage, estimatedEndTime, whitelistedAdminIps, lockdownLevel } =
          body;
        const result = updateMaintenanceConfig({
          ...(headline && { headline }),
          ...(userMessage && { userMessage }),
          ...(estimatedEndTime && { estimatedEndTime }),
          ...(whitelistedAdminIps && { whitelistedAdminIps }),
          ...(lockdownLevel && { lockdownLevel }),
          updatedBy: "مدیر ارشد ایندورا",
        });
        recordAuditLog({
          actor_id: "usr-admin-1",
          actor_email: "admin@endoora.com",
          actor_role: "administrator",
          target_app: "security_command",
          target_model: "MaintenanceConfig",
          target_pk: "maintenance_config",
          action: "update",
          before_summary: {},
          after_summary: { headline, estimatedEndTime, whitelistedAdminIps },
          reason: "به‌روزرسانی تنظیمات پیام و IPهای مجاز حالت قرنطینه",
          request_method: "POST",
          request_path: "/api/admin/security",
          environment: "production",
        });
        return NextResponse.json(result);
      }

      case "reset_seed": {
        resetSecurityCommandDataToInitial();
        recordAuditLog({
          actor_id: "usr-admin-1",
          actor_email: "admin@endoora.com",
          actor_role: "administrator",
          target_app: "security_command",
          target_model: "SecurityStorageSeed",
          target_pk: "seed_data",
          action: "update",
          before_summary: {},
          after_summary: { reset: true },
          reason: "بازنشانی دیتای اولیه اتاق عملیات امنیت و فایروال",
          request_method: "POST",
          request_path: "/api/admin/security",
          environment: "production",
        });
        return NextResponse.json({
          success: true,
          message: "داده‌های آزمایشی امنیت و فایروال با موفقیت بازنشانی شدند.",
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: `عملیات نامعتبر: ${action}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Error in POST /api/admin/security:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "خطای پردازش عملیات امنیتی" },
      { status: 500 }
    );
  }
}
