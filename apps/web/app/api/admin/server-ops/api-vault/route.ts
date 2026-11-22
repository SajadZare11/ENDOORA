import { errorMessage } from "../../../../../lib/error-message.ts";
import { NextResponse } from "next/server";
import {
  getApiIntegrations,
  pingApiIntegration,
  ApiIntegrationServiceId,
} from "@/lib/admin-server-ops-store";

export async function GET() {
  try {
    const services = getApiIntegrations();
    return NextResponse.json({ success: true, services });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: errorMessage(err) || "خطا در واکشی وضعیت درگاه‌های کلید و API" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { serviceId } = body;

    if (!serviceId) {
      return NextResponse.json(
        { success: false, error: "شناسه سرویس الزامی است." },
        { status: 400 }
      );
    }

    const result = pingApiIntegration(serviceId as ApiIntegrationServiceId);

    return NextResponse.json({
      success: true,
      message: `تست اتصال و پینگ سرویس ${result.service.nameFa} با موفقیت انجام شد.`,
      service: result.service,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: errorMessage(err) || "خطا در انجام تست اتصال سرویس" },
      { status: 500 }
    );
  }
}
