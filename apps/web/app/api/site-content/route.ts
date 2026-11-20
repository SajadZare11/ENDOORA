import { NextResponse } from "next/server";
import { getLiveSiteContent } from "@/lib/site-cms-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const backendUrl = (
    process.env.ENDOORA_API_INTERNAL_URL ?? "http://127.0.0.1:8000"
  ).replace(/\/+$/, "");

  try {
    const res = await fetch(`${backendUrl}/api/admin-ops/cms/public/`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.content) {
        return NextResponse.json({
          success: true,
          content: data.content,
          source: "database",
        });
      }
    }
  } catch {
    // Backend unreachable, fallback to local file
  }

  const content = getLiveSiteContent();
  return NextResponse.json({
    success: true,
    content,
    source: "local",
  });
}
