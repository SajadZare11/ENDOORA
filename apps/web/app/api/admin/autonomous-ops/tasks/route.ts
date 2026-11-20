import { NextResponse } from "next/server";
import {
  getBackgroundTasksList,
  runBackgroundTaskNow,
  toggleTaskStatus,
  createCustomTask,
} from "@/lib/admin-autonomous-ops-store";

export async function GET() {
  try {
    const data = getBackgroundTasksList();
    return NextResponse.json({ success: true, ...data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در واکشی تسک‌های پس‌زمینه" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, taskId, isEnabled, taskData, adminUser } = body;

    if (action === "run_now") {
      if (!taskId) {
        return NextResponse.json({ success: false, error: "شناسه تسک الزامی است." }, { status: 400 });
      }
      const result = runBackgroundTaskNow(taskId, adminUser);
      return NextResponse.json({
        success: true,
        message: `تسک با موفقیت اجرا شد (${result.log.durationMs}ms).`,
        task: result.task,
        log: result.log,
      });
    }

    if (action === "toggle") {
      if (!taskId) {
        return NextResponse.json({ success: false, error: "شناسه تسک الزامی است." }, { status: 400 });
      }
      const result = toggleTaskStatus(taskId, Boolean(isEnabled), adminUser);
      return NextResponse.json(result);
    }

    if (action === "create") {
      if (!taskData || !taskData.titleFa || !taskData.targetEndpoint) {
        return NextResponse.json(
          { success: false, error: "عنوان تسک و آدرس اندپوینت الزامی است." },
          { status: 400 }
        );
      }
      const result = createCustomTask(taskData, adminUser);
      return NextResponse.json({
        success: true,
        message: "تسک خودکار جدید با موفقیت به زمان‌بند اضافه شد.",
        task: result.task,
      });
    }

    return NextResponse.json({ success: false, error: "عملیات نامعتبر است." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "خطا در پردازش عملیات تسک" },
      { status: 500 }
    );
  }
}
