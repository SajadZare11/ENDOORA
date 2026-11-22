import { NextRequest, NextResponse } from "next/server";
import { validateCouponForBasket, type ProductScope } from "@/lib/marketing-store";

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") return NextResponse.json({valid:false,error:"تخفیف در پرداخت فعلی فعال نیست."},{status:503});
  try {
    const body = await req.json();
    const { code, basketAmountToman, scope, userPhone } = body;

    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json(
        { success: false, valid: false, error: "کد تخفیف نمی‌تواند خالی باشد." },
        { status: 400 }
      );
    }

    const amount = Number(basketAmountToman) || 0;
    if (amount <= 0) {
      return NextResponse.json(
        { success: false, valid: false, error: "مبلغ سبد خرید برای اعمال تخفیف نامعتبر است." },
        { status: 400 }
      );
    }

    const result = validateCouponForBasket({
      code,
      basketAmountToman: amount,
      scope: scope as ProductScope,
      userPhone,
    });

    if (!result.valid) {
      return NextResponse.json({
        success: true,
        valid: false,
        discountAmountToman: 0,
        finalPayableToman: amount,
        error: result.error,
      });
    }

    return NextResponse.json({
      success: true,
      valid: true,
      discountAmountToman: result.discountAmountToman,
      finalPayableToman: result.finalPayableToman,
      couponCode: result.coupon?.code,
      description: result.coupon?.description,
      discountType: result.coupon?.discountType,
      discountValue: result.coupon?.discountValue,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "خطا در اعتبارسنجی کد تخفیف";
    return NextResponse.json({ success: false, valid: false, error: message }, { status: 500 });
  }
}
