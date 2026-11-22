import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import {
  getAffiliatesData,
  saveAffiliatePartnerAction,
} from "@/lib/admin-gamification-affiliates-store";

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const data = getAffiliatesData();
    return NextResponse.json({ success: true, ...data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در واکشی همکاران بازاریابی" },
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
    const { action, partnerData, adminUser } = body;

    if (action === "create" || !action) {
      if (!partnerData || !partnerData.partnerName || !partnerData.referralCode) {
        return NextResponse.json(
          { success: false, error: "نام همکار و کد رفرال اختصاصی الزامی هستند." },
          { status: 400 }
        );
      }

      const result = saveAffiliatePartnerAction(partnerData, adminUser || auth.user?.email);
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: `همکار بازاریابی جدید با موفقیت ثبت شد (لینک اختصاصی: ?ref=${result.partner?.referralCode}).`,
        partner: result.partner,
      });
    }

    return NextResponse.json({ success: false, error: "عملیات نامعتبر است." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در ثبت همکار بازاریابی" },
      { status: 500 }
    );
  }
}
