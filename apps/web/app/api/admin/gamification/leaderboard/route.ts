import { errorMessage } from "../../../../../lib/error-message.ts";
import { NextResponse } from "next/server";
import {
  getLeaderboardData,
  adjustLearnerXpAction,
  awardBadgeToLearnerAction,
} from "@/lib/admin-gamification-affiliates-store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get("period") || "all_time") as "weekly" | "monthly" | "all_time";

    const data = getLeaderboardData(period);
    return NextResponse.json({ success: true, ...data });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: errorMessage(err) || "خطا در واکشی اطلاعات لیدربورد" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, userId, deltaXp, reason, badgeId, adminUser } = body;

    if (action === "adjust_xp") {
      if (!userId || deltaXp === undefined) {
        return NextResponse.json(
          { success: false, error: "شناسه کاربر و میزان تغییر امتیاز الزامی است." },
          { status: 400 }
        );
      }
      const result = adjustLearnerXpAction(userId, Number(deltaXp), reason || "", adminUser);
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        message: `امتیاز کاربر با موفقیت اصلاح شد (امتیاز کل فعلی: ${result.learner?.totalXp} XP، لیگ: ${result.learner?.league}).`,
        learner: result.learner,
      });
    }

    if (action === "award_badge") {
      if (!userId || !badgeId) {
        return NextResponse.json(
          { success: false, error: "شناسه کاربر و نشان افتخار الزامی است." },
          { status: 400 }
        );
      }
      const result = awardBadgeToLearnerAction(userId, badgeId, adminUser);
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        message: "نشان افتخار با موفقیت به کاربر اعطا گردید.",
        learner: result.learner,
      });
    }

    return NextResponse.json({ success: false, error: "عملیات نامعتبر است." }, { status: 400 });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: errorMessage(err) || "خطا در پردازش درخواست گیمیفیکیشن" },
      { status: 500 }
    );
  }
}
