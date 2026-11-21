import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";

import {
  getTreasuryData,
  getTreasuryStats,
  disbursePayout,
  rejectPayout,
  markPayoutProcessing,
  arbitrateEscrow,
  saveTreasuryDataToDisk,
  INITIAL_PAYOUT_REQUESTS,
  INITIAL_ESCROW_RECORDS,
  IRANIAN_BANKS_CODE_MAP,
  type TeacherPayoutStatus,
  type EscrowStatus,
} from "@/lib/treasury-store";
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
    const payoutStatus = searchParams.get("payout_status");
    const escrowStatus = searchParams.get("escrow_status");

    const data = getTreasuryData();
    let payouts = [...data.payouts];
    let escrows = [...data.escrows];

    // Filter payouts
    if (payoutStatus && payoutStatus !== "all") {
      payouts = payouts.filter((p) => p.status === (payoutStatus as TeacherPayoutStatus));
    }

    // Filter escrows
    if (escrowStatus && escrowStatus !== "all") {
      escrows = escrows.filter((e) => e.status === (escrowStatus as EscrowStatus));
    }

    // Global or targeted search
    if (search) {
      const q = search.trim().toLowerCase();
      payouts = payouts.filter(
        (p) =>
          p.teacherName.toLowerCase().includes(q) ||
          p.teacherEmail.toLowerCase().includes(q) ||
          p.teacherPhone.includes(q) ||
          p.accountHolderName.toLowerCase().includes(q) ||
          p.bankShabaNumber.toLowerCase().includes(q) ||
          (p.bankTrackingCode && p.bankTrackingCode.toLowerCase().includes(q))
      );

      escrows = escrows.filter(
        (e) =>
          e.sessionTopic.toLowerCase().includes(q) ||
          e.learnerName.toLowerCase().includes(q) ||
          e.teacherName.toLowerCase().includes(q) ||
          e.bookingId.toLowerCase().includes(q) ||
          (e.disputeReason && e.disputeReason.toLowerCase().includes(q))
      );
    }

    const stats = getTreasuryStats();

    return NextResponse.json({
      success: true,
      payouts,
      escrows,
      stats,
      banksMap: IRANIAN_BANKS_CODE_MAP,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "خطا در دریافت داده‌های خزانه‌داری";
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
    const { action } = body;

    if (!action) {
      return NextResponse.json({ success: false, error: "فیلد action الزامی است." }, { status: 400 });
    }

    // 1. Disburse Payout (Satna/Paya completion)
    if (action === "disburse_payout") {
      const { payoutId, bankTrackingCode, adminNotes, actor } = body;
      if (!payoutId || !bankTrackingCode) {
        return NextResponse.json(
          { success: false, error: "شناسه تسویه و شماره ارجاع بانکی (پایا/ساتنا) الزامی است." },
          { status: 400 }
        );
      }

      const res = disbursePayout(payoutId, {
        bankTrackingCode,
        adminNotes,
        actor: actor || "مدیر ارشد خزانه‌داری ایندورا",
      });

      if (!res.success || !res.payout) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      // Record Audit Log
      try {
        recordAuditLog({
          actor_id: auth.user?.id || "admin",
          actor_email: actor || "treasury@endoora.ir",
          actor_role: auth.user?.role || "administrator",
          action: "update",
          target_app: "treasury",
          target_model: "TeacherPayout",
          target_pk: payoutId,
          before_summary: { status: "pending" },
          after_summary: {
            status: "completed",
            bankTrackingCode: res.payout.bankTrackingCode,
            amountToman: res.payout.amountToman,
          },
          reason: `واریز تسویه حساب ${res.payout.amountToman.toLocaleString()} تومانی استاد ${res.payout.teacherName} با کد پیگیری بانکی ${res.payout.bankTrackingCode}`,
          request_method: "POST",
          request_path: "/api/admin/treasury",
          environment: "production",
        });
      } catch (logErr) {
        console.warn("Failed to record audit log for payout disbursement:", logErr);
      }

      return NextResponse.json({
        success: true,
        message: `تسویه حساب استاد ${res.payout.teacherName} با موفقیت ثبت و واریز شد.`,
        payout: res.payout,
        stats: getTreasuryStats(),
      });
    }

    // 2. Reject Payout
    if (action === "reject_payout") {
      const { payoutId, rejectionReason, adminNotes, actor } = body;
      if (!payoutId || !rejectionReason) {
        return NextResponse.json(
          { success: false, error: "شناسه تسویه و درج دلیل رد درخواست الزامی است." },
          { status: 400 }
        );
      }

      const res = rejectPayout(payoutId, {
        rejectionReason,
        adminNotes,
        actor: actor || "مدیر ارشد خزانه‌داری ایندورا",
      });

      if (!res.success || !res.payout) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      try {
        recordAuditLog({
          actor_id: auth.user?.id || "admin",
          actor_email: actor || "treasury@endoora.ir",
          actor_role: auth.user?.role || "administrator",
          action: "update",
          target_app: "treasury",
          target_model: "TeacherPayout",
          target_pk: payoutId,
          before_summary: { status: "pending" },
          after_summary: { status: "rejected", rejectionReason: res.payout.rejectionReason },
          reason: `رد تسویه حساب استاد ${res.payout.teacherName} به دلیل: ${rejectionReason}`,
          request_method: "POST",
          request_path: "/api/admin/treasury",
          environment: "production",
        });
      } catch (logErr) {
        console.warn("Failed to record audit log for payout rejection:", logErr);
      }

      return NextResponse.json({
        success: true,
        message: `درخواست تسویه حساب با موفقیت رد شد.`,
        payout: res.payout,
        stats: getTreasuryStats(),
      });
    }

    // 3. Mark Payout Processing
    if (action === "mark_payout_processing") {
      const { payoutId } = body;
      if (!payoutId) {
        return NextResponse.json({ success: false, error: "شناسه تسویه الزامی است." }, { status: 400 });
      }

      const res = markPayoutProcessing(payoutId);
      if (!res.success || !res.payout) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: `وضعیت تسویه به «در حال پردازش بانکی» تغییر یافت.`,
        payout: res.payout,
        stats: getTreasuryStats(),
      });
    }

    // 4. Arbitrate Escrow
    if (action === "arbitrate_escrow") {
      const { escrowId, decision, verdictMessage, splitLearnerPercent, actor } = body;
      if (!escrowId || !decision || !verdictMessage) {
        return NextResponse.json(
          { success: false, error: "شناسه پرونده اسکرو، نوع رأی داوری و شرح رأی الزامی است." },
          { status: 400 }
        );
      }

      const res = arbitrateEscrow(escrowId, {
        decision,
        verdictMessage,
        splitLearnerPercent,
        actor: actor || "داور ارشد مرکز اختلاف ایندورا",
      });

      if (!res.success || !res.escrow) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      try {
        recordAuditLog({
          actor_id: auth.user?.id || "admin",
          actor_email: actor || "disputes@endoora.ir",
          actor_role: auth.user?.role || "administrator",
          action: "update",
          target_app: "escrow",
          target_model: "EscrowSettlement",
          target_pk: escrowId,
          before_summary: { status: "disputed" },
          after_summary: {
            status: res.escrow.status,
            verdict: verdictMessage,
            decision,
          },
          reason: `داوری و مختومه نمودن پرونده ضمانت اسکرو #${res.escrow.bookingId} با رأی: ${decision}`,
          request_method: "POST",
          request_path: "/api/admin/treasury",
          environment: "production",
        });
      } catch (logErr) {
        console.warn("Failed to record audit log for escrow arbitration:", logErr);
      }

      return NextResponse.json({
        success: true,
        message: `پرونده اسکرو #${res.escrow.bookingId} با موفقیت داوری و مختومه گردید.`,
        escrow: res.escrow,
        stats: getTreasuryStats(),
      });
    }

    // 5. Reset Seed Data
    if (action === "reset_seed") {
      if ((process.env.NODE_ENV as string) === "production") {
        return NextResponse.json({ success: false, error: "عملیات بازنشانی داده‌های کارخانه در محیط عملیاتی غیرمجاز است." }, { status: 403 });
      }

      saveTreasuryDataToDisk({
        payouts: [...INITIAL_PAYOUT_REQUESTS],
        escrows: [...INITIAL_ESCROW_RECORDS],
      });

      return NextResponse.json({
        success: true,
        message: "داده‌های خزانه‌داری و اسکرو به تنظیمات کارخانه بازگردانده شدند.",
        stats: getTreasuryStats(),
      });
    }

    return NextResponse.json({ success: false, error: "عملیات ارسالی نامعتبر است." }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "خطا در پردازش درخواست خزانه‌داری";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
