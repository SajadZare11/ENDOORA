import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";

import {
  getAiEngineData,
  updatePromptTemplate,
  updateRoutingRule,
  toggleGlobalKillSwitch,
  updateBudgetAndSafety,
  deployPromptToProduction,
  runPlaygroundTest,
  runBenchmarkTest,
  resetAiEngineDataToInitial,
  type AiCapabilityKey,
} from "@/lib/ai-engine-store";
import { recordAuditLog } from "@/lib/admin-ops";

export async function GET() {
  if (process.env.NODE_ENV === "production") return new Response(null, { status: 404 });
  try {
    const data = getAiEngineData();
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error("Error in GET /api/admin/ai:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "خطای سرور در واکشی داده‌های مرکز هوش مصنوعی" },
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
      case "update_prompt": {
        const { promptId, updates } = body;
        if (!promptId || !updates) {
          return NextResponse.json(
            { success: false, error: "شناسه پرامپت (promptId) و فیلدهای تغییرات الزامی هستند." },
            { status: 400 }
          );
        }
        const result = updatePromptTemplate(promptId, updates, "مدیر ارشد هوش مصنوعی");
        if (result.success) {
          recordAuditLog({
            actor_id: auth.user?.id || "admin",
            actor_email: "admin@endoora.com",
            actor_role: auth.user?.role || "administrator",
            target_app: "ai_engine",
            target_model: "AiPromptTemplate",
            target_pk: promptId,
            action: "update",
            before_summary: {},
            after_summary: { promptId, name: result.prompt.name, version: result.prompt.version },
            reason: `به‌روزرسانی پرامپت و پارامترهای مدل برای ${result.prompt.name}`,
            request_method: "POST",
            request_path: "/api/admin/ai",
            environment: "production",
          });
        }
        return NextResponse.json(result);
      }

      case "update_routing": {
        const { capabilityKey, updates } = body;
        if (!capabilityKey || !updates) {
          return NextResponse.json(
            { success: false, error: "کلید قابلیت (capabilityKey) و فیلدهای روتینگ الزامی هستند." },
            { status: 400 }
          );
        }
        const result = updateRoutingRule(capabilityKey as AiCapabilityKey, updates);
        if (result.success) {
          recordAuditLog({
            actor_id: auth.user?.id || "admin",
            actor_email: "admin@endoora.com",
            actor_role: auth.user?.role || "administrator",
            target_app: "ai_engine",
            target_model: "AiModelRoutingRule",
            target_pk: capabilityKey,
            action: "update",
            before_summary: {},
            after_summary: { capabilityKey, primaryModel: result.rule.primaryModel },
            reason: `تغییر مدل پیش‌فرض قابلیت ${result.rule.capabilityLabel} به ${result.rule.primaryModel}`,
            request_method: "POST",
            request_path: "/api/admin/ai",
            environment: "production",
          });
        }
        return NextResponse.json(result);
      }

      case "toggle_killswitch": {
        const { enabled, reason } = body;
        if (typeof enabled !== "boolean") {
          return NextResponse.json(
            { success: false, error: "وضعیت کلید قطع اضطراری (enabled) باید بولین باشد." },
            { status: 400 }
          );
        }
        const result = toggleGlobalKillSwitch(enabled, reason);
        recordAuditLog({
          actor_id: auth.user?.id || "admin",
          actor_email: "admin@endoora.com",
          actor_role: auth.user?.role || "administrator",
          target_app: "ai_engine",
          target_model: "AiSafetyAndBudgetConfig",
          target_pk: "global_kill_switch",
          action: "update",
          before_summary: { globalKillSwitch: !enabled },
          after_summary: { globalKillSwitch: enabled, reason },
          reason: enabled
            ? `فعال‌سازی کلید قطع اضطراری سراسری هوش مصنوعی (AI Kill-Switch): ${reason || "بدون توضیح"}`
            : "غیرفعال‌سازی کلید قطع اضطراری و برقراری مجدد ارتباط با سرویس‌های هوش مصنوعی",
          request_method: "POST",
          request_path: "/api/admin/ai",
          environment: "production",
        });
        return NextResponse.json(result);
      }

      case "update_budget": {
        const { updates } = body;
        if (!updates) {
          return NextResponse.json(
            { success: false, error: "فیلدهای بودجه الزامی هستند." },
            { status: 400 }
          );
        }
        const result = updateBudgetAndSafety(updates);
        if (result.success) {
          recordAuditLog({
            actor_id: auth.user?.id || "admin",
            actor_email: "admin@endoora.com",
            actor_role: auth.user?.role || "administrator",
            target_app: "ai_engine",
            target_model: "AiSafetyAndBudgetConfig",
            target_pk: "budget_settings",
            action: "update",
            before_summary: {},
            after_summary: updates,
            reason: "به‌روزرسانی سقف بودجه توکن و آستانه‌های امنیتی هوش مصنوعی",
            request_method: "POST",
            request_path: "/api/admin/ai",
            environment: "production",
          });
        }
        return NextResponse.json(result);
      }

      case "deploy_prompt": {
        const { promptId } = body;
        if (!promptId) {
          return NextResponse.json(
            { success: false, error: "شناسه پرامپت (promptId) الزامی است." },
            { status: 400 }
          );
        }
        const result = deployPromptToProduction(promptId);
        if (result.success) {
          recordAuditLog({
            actor_id: auth.user?.id || "admin",
            actor_email: "admin@endoora.com",
            actor_role: auth.user?.role || "administrator",
            target_app: "ai_engine",
            target_model: "AiPromptTemplate",
            target_pk: promptId,
            action: "update",
            before_summary: {},
            after_summary: { promptId, deployedVersion: result.prompt.version },
            reason: `استقرار رسمی نسخه جدید (v${result.prompt.version}) پرامپت ${result.prompt.name} روی پروداکشن`,
            request_method: "POST",
            request_path: "/api/admin/ai",
            environment: "production",
          });
        }
        return NextResponse.json(result);
      }

      case "run_playground_test": {
        const { promptId, capabilityKey, inputText, modelOverride, temperatureOverride } = body;
        if (!inputText) {
          return NextResponse.json(
            { success: false, error: "متن ورودی جهت تست الزامی است." },
            { status: 400 }
          );
        }
        const result = runPlaygroundTest({
          promptId,
          capabilityKey: capabilityKey as AiCapabilityKey,
          inputText,
          modelOverride,
          temperatureOverride,
        });
        return NextResponse.json(result);
      }

      case "run_benchmark": {
        const { benchmarkId } = body;
        if (!benchmarkId) {
          return NextResponse.json(
            { success: false, error: "شناسه بنچمارک (benchmarkId) الزامی است." },
            { status: 400 }
          );
        }
        const result = runBenchmarkTest(benchmarkId);
        return NextResponse.json(result);
      }

      case "reset_seed": {
      if ((process.env.NODE_ENV as string) === "production") {
        return NextResponse.json({ success: false, error: "عملیات بازنشانی داده‌های کارخانه در محیط عملیاتی غیرمجاز است." }, { status: 403 });
      }

        resetAiEngineDataToInitial();
        recordAuditLog({
          actor_id: auth.user?.id || "admin",
          actor_email: "admin@endoora.com",
          actor_role: auth.user?.role || "administrator",
          target_app: "ai_engine",
          target_model: "AiSeedData",
          target_pk: "seed_payload",
          action: "update",
          before_summary: {},
          after_summary: { reset: true },
          reason: "بازنشانی دیتای اولیه مرکز فرماندهی هوش مصنوعی و مدل‌های زبانی",
          request_method: "POST",
          request_path: "/api/admin/ai",
          environment: "production",
        });
        return NextResponse.json({
          success: true,
          message: "داده‌های مرکز هوش مصنوعی با موفقیت به حالت اولیه بازنشانی شدند.",
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: `عملیات نامعتبر: ${action}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Error in POST /api/admin/ai:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "خطای پردازش عملیات هوش مصنوعی" },
      { status: 500 }
    );
  }
}
