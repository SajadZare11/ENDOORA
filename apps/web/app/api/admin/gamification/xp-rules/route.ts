import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import {
  getLeaderboardData,
  updateXpRulesAction,
} from "@/lib/admin-gamification-affiliates-store";

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { rules } = getLeaderboardData();
    return NextResponse.json({ success: true, rules });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در واکشی قوانین امتیاز" },
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
    const { rules, adminUser } = body;

    if (!rules) {
      return NextResponse.json(
        { success: false, error: "تنظیمات قوانین الزامی است." },
        { status: 400 }
      );
    }

    const result = updateXpRulesAction(rules, adminUser || auth.user?.email);
    return NextResponse.json({
      success: true,
      message: "ضرایب و قوانین امتیازدهی پلتفرم با موفقیت به‌روزرسانی شد.",
      rules: result.rules,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در به‌روزرسانی قوانین" },
      { status: 500 }
    );
  }
}
