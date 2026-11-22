import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import {
  getRefundsList,
  issueOneClickRefund,
} from "@/lib/admin-financial-risk-store";

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const data = getRefundsList();
    return NextResponse.json({ success: true, ...data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در واکشی لیست استردادها" },
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
    const { action, transactionId, refundMethod, customAmountToman, reason, adminUser } = body;

    if (action === "issue_refund" || !action) {
      if (!transactionId || !refundMethod) {
        return NextResponse.json(
          { success: false, error: "شناسه تراکنش و روش استرداد الزامی است." },
          { status: 400 }
        );
      }

      const result = issueOneClickRefund(
        {
          transactionId,
          refundMethod,
          customAmountToman,
          reason,
        },
        adminUser || auth.user?.email
      );

      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: `استرداد وجه با موفقیت صادر شد (شناسه پیگیری: ${result.refund?.id}، سند مالیاتی: ${result.refund?.taxVoucherCode}).`,
        refund: result.refund,
      });
    }

    return NextResponse.json({ success: false, error: "عملیات نامعتبر است." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در پردازش استرداد وجه" },
      { status: 500 }
    );
  }
}
