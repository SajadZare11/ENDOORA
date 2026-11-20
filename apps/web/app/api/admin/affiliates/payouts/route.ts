import { NextResponse } from "next/server";
import {
  getAffiliatesData,
  processAffiliatePayoutAction,
} from "@/lib/admin-gamification-affiliates-store";

export async function GET() {
  try {
    const { payoutRequests, conversionLogs } = getAffiliatesData();
    return NextResponse.json({ success: true, payoutRequests, conversionLogs });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در واکشی درخواست‌های تسویه" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payoutId, bankTrackingCode, rejectionReason, adminUser } = body;

    if (!payoutId || !action) {
      return NextResponse.json(
        { success: false, error: "شناسه تسویه و نوع اقدام الزامی است." },
        { status: 400 }
      );
    }

    const result = processAffiliatePayoutAction(
      payoutId,
      action,
      { bankTrackingCode, rejectionReason },
      adminUser
    );

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message:
        action === "approve_bank"
          ? `حواله بانکی پایا با کد پیگیری ${result.payout?.trackingCode} تایید شد.`
          : action === "approve_wallet"
          ? `شارژ کیف پول همراه با ۱۰٪ بونوس تشویقی (${result.payout?.bonusAmountToman?.toLocaleString()} تومان مازاد) انجام گردید.`
          : "درخواست تسویه رد گردید.",
      payout: result.payout,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در پردازش تسویه کمیسیون" },
      { status: 500 }
    );
  }
}
