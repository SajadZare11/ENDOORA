import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import {
  getIncidentsList,
  updateIncidentStatus,
  retryFailedIncident,
} from "@/lib/admin-autonomous-ops-store";

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const incidents = getIncidentsList();
    return NextResponse.json({ success: true, incidents });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در واکشی لیست حوادث و خطاهای سرور" },
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
    const { action, incidentId, status, resolutionNote, adminUser } = body;

    if (!incidentId) {
      return NextResponse.json({ success: false, error: "شناسه خطا الزامی است." }, { status: 400 });
    }

    if (action === "update_status") {
      const result = updateIncidentStatus(incidentId, status, resolutionNote, adminUser || auth.user?.email);
      return NextResponse.json(result);
    }

    if (action === "retry") {
      const result = retryFailedIncident(incidentId, adminUser || auth.user?.email);
      return NextResponse.json(result);
    }

    return NextResponse.json({ success: false, error: "عملیات مشخص شده نامعتبر است." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در پردازش درخواست حادثه" },
      { status: 500 }
    );
  }
}
