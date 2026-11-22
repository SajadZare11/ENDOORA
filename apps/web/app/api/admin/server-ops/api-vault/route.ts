import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import {
  getApiIntegrations,
  pingApiIntegration,
  ApiIntegrationServiceId,
} from "@/lib/admin-server-ops-store";

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const services = getApiIntegrations();
    return NextResponse.json({ success: true, services });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در واکشی وضعیت درگاه‌های کلید و API" },
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
    const { serviceId } = body;

    if (!serviceId) {
      return NextResponse.json(
        { success: false, error: "شناسه سرویس الزامی است." },
        { status: 400 }
      );
    }

    const result = await pingApiIntegration(serviceId as ApiIntegrationServiceId);

    return NextResponse.json({
      success: true,
      message: `تست اتصال و پینگ سرویس ${result.service.nameFa} با موفقیت انجام شد.`,
      service: result.service,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در انجام تست اتصال سرویس" },
      { status: 500 }
    );
  }
}
