import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";

import {
  getTeacherContractsData,
  createContract,
  sendContractForSignature,
  signContractOtp,
  terminateContract,
  setCustomCommission,
  evaluateTierPromotion,
  toggleLegalHold,
  updateWithholdingTax,
  isTeacherPayoutAllowed,
  resetTeacherContractsDataToInitial,
  type ContractType,
} from "@/lib/teacher-contracts-store";
import { recordAuditLog } from "@/lib/admin-ops";

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdminSession(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }
    const data = getTeacherContractsData();
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error("Error in GET /api/admin/teachers/contracts:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "خطای سرور در واکشی اطلاعات قراردادهای اساتید" },
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
    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: "فیلد action الزامی است." },
        { status: 400 }
      );
    }

    switch (action) {
      case "create_contract": {
        const { teacherId, contractType, contractTitle, termsSummary, commissionPercent } = body;
        if (!teacherId || !contractType || !contractTitle) {
          return NextResponse.json(
            { success: false, error: "شناسه استاد، نوع قرارداد و عنوان الزامی هستند." },
            { status: 400 }
          );
        }
        const result = createContract({
          teacherId,
          contractType: contractType as ContractType,
          contractTitle,
          termsSummary: termsSummary || "قرارداد همکاری استاندارد تدریس پلتفرم ایندورا",
          commissionPercent,
        });
        if (result.success) {
          recordAuditLog({
            actor_id: auth.user?.id || "admin",
            actor_email: "admin@endoora.com",
            actor_role: auth.user?.role || "administrator",
            target_app: "contracts",
            target_model: "TeacherContractItem",
            target_pk: result.contract.id,
            action: "create",
            before_summary: {},
            after_summary: { teacherId, contractTitle, contractType },
            reason: `صدور پیش‌نویس قرارداد ${contractTitle} برای استاد #${teacherId}`,
            request_method: "POST",
            request_path: "/api/admin/teachers/contracts",
            environment: "production",
          });
        }
        return NextResponse.json(result);
      }

      case "send_contract": {
        const { contractId } = body;
        if (!contractId) {
          return NextResponse.json(
            { success: false, error: "شناسه قرارداد الزامی است." },
            { status: 400 }
          );
        }
        const result = sendContractForSignature(contractId);
        return NextResponse.json(result);
      }

      case "sign_contract_otp": {
        const { contractId, otpCode, signerIp } = body;
        if (!contractId) {
          return NextResponse.json(
            { success: false, error: "شناسه قرارداد الزامی است." },
            { status: 400 }
          );
        }
        const result = signContractOtp({ contractId, otpCode, signerIp });
        if (result.success) {
          recordAuditLog({
            actor_id: auth.user?.id || "admin",
            actor_email: "admin@endoora.com",
            actor_role: auth.user?.role || "administrator",
            target_app: "contracts",
            target_model: "TeacherContractItem",
            target_pk: contractId,
            action: "update",
            before_summary: { status: "pending_signature" },
            after_summary: { status: "active_signed", signedAt: result.contract?.signedAt },
            reason: `ثبت امضای دیجیتال OTP قرارداد #${contractId}`,
            request_method: "POST",
            request_path: "/api/admin/teachers/contracts",
            environment: "production",
          });
        }
        return NextResponse.json(result);
      }

      case "terminate_contract": {
        const { contractId, reason } = body;
        if (!contractId || !reason) {
          return NextResponse.json(
            { success: false, error: "شناسه قرارداد و علت فسخ الزامی هستند." },
            { status: 400 }
          );
        }
        const result = terminateContract(contractId, reason);
        if (result.success) {
          recordAuditLog({
            actor_id: auth.user?.id || "admin",
            actor_email: "admin@endoora.com",
            actor_role: auth.user?.role || "administrator",
            target_app: "contracts",
            target_model: "TeacherContractItem",
            target_pk: contractId,
            action: "delete",
            before_summary: { status: "active_signed" },
            after_summary: { status: "terminated", reason },
            reason: `فسخ قرارداد #${contractId}: ${reason}`,
            request_method: "POST",
            request_path: "/api/admin/teachers/contracts",
            environment: "production",
          });
        }
        return NextResponse.json(result);
      }

      case "set_custom_commission": {
        const { teacherId, customPercent, reason } = body;
        if (!teacherId || typeof customPercent !== "number" || !reason) {
          return NextResponse.json(
            { success: false, error: "شناسه استاد، درصد جدید و دلیل توافق الزامی هستند." },
            { status: 400 }
          );
        }
        const result = setCustomCommission({ teacherId, customPercent, reason });
        if (result.success) {
          recordAuditLog({
            actor_id: auth.user?.id || "admin",
            actor_email: "admin@endoora.com",
            actor_role: auth.user?.role || "administrator",
            target_app: "contracts",
            target_model: "TeacherCommissionProfile",
            target_pk: teacherId,
            action: "update",
            before_summary: {},
            after_summary: { customPercent, reason },
            reason: `تنظیم سهم اختصاصی ${customPercent}٪ برای استاد #${teacherId}: ${reason}`,
            request_method: "POST",
            request_path: "/api/admin/teachers/contracts",
            environment: "production",
          });
        }
        return NextResponse.json(result);
      }

      case "evaluate_tier_promotion": {
        const { teacherId } = body;
        if (!teacherId) {
          return NextResponse.json(
            { success: false, error: "شناسه استاد الزامی است." },
            { status: 400 }
          );
        }
        const result = evaluateTierPromotion(teacherId);
        if (result.success && result.promoted) {
          recordAuditLog({
            actor_id: auth.user?.id || "admin",
            actor_email: "admin@endoora.com",
            actor_role: auth.user?.role || "administrator",
            target_app: "contracts",
            target_model: "TeacherCommissionProfile",
            target_pk: teacherId,
            action: "update",
            before_summary: { tier: result.previousTier },
            after_summary: { tier: result.newTier },
            reason: `ارتقای خودکار سطح کارمزد استاد #${teacherId} از ${result.previousTier} به ${result.newTier}`,
            request_method: "POST",
            request_path: "/api/admin/teachers/contracts",
            environment: "production",
          });
        }
        return NextResponse.json(result);
      }

      case "toggle_legal_hold": {
        const { teacherId, isHoldActive, reason } = body;
        if (!teacherId || typeof isHoldActive !== "boolean") {
          return NextResponse.json(
            { success: false, error: "شناسه استاد و وضعیت فریز حقوقی الزامی هستند." },
            { status: 400 }
          );
        }
        const result = toggleLegalHold({ teacherId, isHoldActive, reason });
        if (result.success) {
          recordAuditLog({
            actor_id: auth.user?.id || "admin",
            actor_email: "admin@endoora.com",
            actor_role: auth.user?.role || "administrator",
            target_app: "contracts",
            target_model: "TeacherCommissionProfile",
            target_pk: teacherId,
            action: "update",
            before_summary: { isLegalHoldActive: !isHoldActive },
            after_summary: { isLegalHoldActive: isHoldActive, reason },
            reason: isHoldActive
              ? `فعال‌سازی فریز حقوقی و مسدودسازی تسویه‌حساب استاد #${teacherId}: ${reason || "بدون توضیح"}`
              : `لغو فریز حقوقی استاد #${teacherId}`,
            request_method: "POST",
            request_path: "/api/admin/teachers/contracts",
            environment: "production",
          });
        }
        return NextResponse.json(result);
      }

      case "update_tax_rate": {
        const { teacherId, taxPercent } = body;
        if (!teacherId || typeof taxPercent !== "number") {
          return NextResponse.json(
            { success: false, error: "شناسه استاد و درصد مالیات الزامی هستند." },
            { status: 400 }
          );
        }
        const result = updateWithholdingTax({ teacherId, taxPercent });
        return NextResponse.json(result);
      }

      case "check_payout_gate": {
        const { teacherId } = body;
        if (!teacherId) {
          return NextResponse.json(
            { success: false, error: "شناسه استاد الزامی است." },
            { status: 400 }
          );
        }
        const gate = isTeacherPayoutAllowed(teacherId);
        return NextResponse.json({
          success: true,
          gate,
        });
      }

      case "reset_seed": {
      if ((process.env.NODE_ENV as string) === "production") {
        return NextResponse.json({ success: false, error: "عملیات بازنشانی داده‌های کارخانه در محیط عملیاتی غیرمجاز است." }, { status: 403 });
      }

        resetTeacherContractsDataToInitial();
        recordAuditLog({
          actor_id: auth.user?.id || "admin",
          actor_email: "admin@endoora.com",
          actor_role: auth.user?.role || "administrator",
          target_app: "contracts",
          target_model: "TeacherContractsSeed",
          target_pk: "seed_payload",
          action: "update",
          before_summary: {},
          after_summary: { reset: true },
          reason: "بازنشانی دیتای اولیه سامانه قراردادها و سطوح کارمزد اساتید",
          request_method: "POST",
          request_path: "/api/admin/teachers/contracts",
          environment: "production",
        });
        return NextResponse.json({
          success: true,
          message: "داده‌های قراردادها و کارمزد اساتید با موفقیت به حالت اولیه بازنشانی شدند.",
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: `عملیات نامعتبر: ${action}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Error in POST /api/admin/teachers/contracts:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "خطای پردازش عملیات قراردادهای اساتید" },
      { status: 500 }
    );
  }
}
