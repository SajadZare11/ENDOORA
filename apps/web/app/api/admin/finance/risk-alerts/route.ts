import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import {
  getRiskAlertsList,
  mitigateRiskAlertAction,
} from "@/lib/admin-financial-risk-store";

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const alerts = getRiskAlertsList();
    return NextResponse.json({ success: true, alerts });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در واکشی هشدارهای ریسک مالی" },
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
    const { action, alertId, mitigationAction, adminUser } = body;

    if (action === "mitigate" || !action) {
      if (!alertId || !mitigationAction) {
        return NextResponse.json(
          { success: false, error: "شناسه هشدار و اقدام واکنشی الزامی است." },
          { status: 400 }
        );
      }

      const result = mitigateRiskAlertAction(alertId, mitigationAction, adminUser || auth.user?.email);
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: result.messageFa,
        alert: result.alert,
      });
    }

    return NextResponse.json({ success: false, error: "عملیات نامعتبر است." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در اجرای اقدام واکنشی ریسک" },
      { status: 500 }
    );
  }
}
