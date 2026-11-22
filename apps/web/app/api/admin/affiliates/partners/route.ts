import { errorMessage } from "../../../../../lib/error-message.ts";
import { NextResponse } from "next/server";
import {
  getAffiliatesData,
  saveAffiliatePartnerAction,
} from "@/lib/admin-gamification-affiliates-store";

export async function GET() {
  try {
    const data = getAffiliatesData();
    return NextResponse.json({ success: true, ...data });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: errorMessage(err) || "خطا در واکشی همکاران بازاریابی" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, partnerData, adminUser } = body;

    if (action === "create" || !action) {
      if (!partnerData || !partnerData.partnerName || !partnerData.referralCode) {
        return NextResponse.json(
          { success: false, error: "نام همکار و کد رفرال اختصاصی الزامی هستند." },
          { status: 400 }
        );
      }

      const result = saveAffiliatePartnerAction(partnerData, adminUser);
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
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: errorMessage(err) || "خطا در ثبت همکار بازاریابی" },
      { status: 500 }
    );
  }
}
