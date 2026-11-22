import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "./lib/admin-auth";

export async function proxy(request: NextRequest) {
  const auth = await verifyAdminSession(request);
  if (!auth.authorized) return NextResponse.json({error:auth.error}, {status:auth.status});
  // Media is backed by Django. Other preview consoles still use process-local fixtures.
  if (process.env.NODE_ENV === "production" && !/^\/api\/admin\/media(?:\/|$)/.test(request.nextUrl.pathname)) {
    return NextResponse.json({error:"این ابزار پیش‌نمایش است. از پنل مدیریت جنگو استفاده کنید."}, {status:503});
  }
  return NextResponse.next();
}

export const config = {matcher:["/api/admin/:path*"]};
