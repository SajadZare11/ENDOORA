import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";

import {
  getSupportData,
  getSupportStats,
  replyToTicket,
  addInternalNote,
  updateTicketStatus,
  updateTicketPriority,
  assignTicketStaff,
  createCannedTemplate,
  resolveFeedbackItem,
  saveSupportDataToDisk,
  INITIAL_ADMIN_TICKETS,
  INITIAL_CANNED_TEMPLATES,
  INITIAL_FEEDBACK_ITEMS,
  TICKET_CATEGORY_LABELS,
  TICKET_PRIORITY_LABELS,
  TICKET_STATUS_LABELS,
  type TicketCategory,
  type TicketPriority,
  type TicketStatus,
} from "@/lib/support-store";
import { recordAuditLog } from "@/lib/admin-ops";

export async function GET(req: NextRequest) {
  try {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || searchParams.get("q");
    const categoryFilter = searchParams.get("category");
    const statusFilter = searchParams.get("status");
    const priorityFilter = searchParams.get("priority");

    const data = getSupportData();
    let tickets = [...data.tickets];
    const templates = data.templates;
    const feedbacks = data.feedbacks;

    // Filter tickets
    if (categoryFilter && categoryFilter !== "all") {
      tickets = tickets.filter((t) => t.category === (categoryFilter as TicketCategory));
    }

    if (statusFilter && statusFilter !== "all") {
      tickets = tickets.filter((t) => t.status === (statusFilter as TicketStatus));
    }

    if (priorityFilter && priorityFilter !== "all") {
      tickets = tickets.filter((t) => t.priority === (priorityFilter as TicketPriority));
    }

    if (search) {
      const q = search.trim().toLowerCase();
      tickets = tickets.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.userName.toLowerCase().includes(q) ||
          t.userEmail.toLowerCase().includes(q) ||
          t.userPhone.includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }

    const stats = getSupportStats();

    return NextResponse.json({
      success: true,
      tickets,
      templates,
      feedbacks,
      stats,
      categoryLabels: TICKET_CATEGORY_LABELS,
      priorityLabels: TICKET_PRIORITY_LABELS,
      statusLabels: TICKET_STATUS_LABELS,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "خطا در دریافت تیکت‌های پشتیبانی";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
  const auth = await verifyAdminSession(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
  }

    const body = await req.json();
    const { action, actor } = body;

    if (!action) {
      return NextResponse.json({ success: false, error: "فیلد action الزامی است." }, { status: 400 });
    }

    // 1. Reply to Ticket
    if (action === "send_reply") {
      const { ticketId, replyBody, senderName, staffEmail, markResolved } = body;
      const res = replyToTicket(ticketId, {
        body: replyBody,
        senderName: senderName || "پشتیبان ارشد ایندورا",
        staffEmail: staffEmail || actor,
        markResolved: Boolean(markResolved),
      });

      if (!res.success || !res.ticket) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      try {
        recordAuditLog({
          actor_id: auth.user?.id || "admin",
          actor_email: actor || "support@endoora.ir",
          actor_role: "support",
          action: "update",
          target_app: "support",
          target_model: "SupportTicket",
          target_pk: ticketId,
          before_summary: { status: "pending" },
          after_summary: { status: res.ticket.status, lastReplier: senderName },
          reason: `ارسال پاسخ به تیکت #${ticketId} کاربر ${res.ticket.userName}`,
          request_method: "POST",
          request_path: "/api/admin/support",
          environment: "production",
        });
      } catch (logErr) {
        console.warn("Audit log error:", logErr);
      }

      return NextResponse.json({
        success: true,
        message: "پاسخ با موفقیت برای کاربر ارسال و ثبت گردید.",
        ticket: res.ticket,
        stats: getSupportStats(),
      });
    }

    // 2. Add Confidential Internal Note
    if (action === "add_internal_note") {
      const { ticketId, note, staffName } = body;
      const res = addInternalNote(ticketId, {
        note,
        staffName: staffName || "کارشناس ادمین",
      });

      if (!res.success || !res.ticket) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: "یادداشت محرمانه داخلی با موفقیت در پرونده تیکت ثبت شد.",
        ticket: res.ticket,
      });
    }

    // 3. Update Status
    if (action === "update_status") {
      const { ticketId, status } = body;
      const res = updateTicketStatus(ticketId, status);
      if (!res.success || !res.ticket) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: `وضعیت تیکت به ${status} تغییر یافت.`,
        ticket: res.ticket,
        stats: getSupportStats(),
      });
    }

    // 4. Update Priority
    if (action === "update_priority") {
      const { ticketId, priority } = body;
      const res = updateTicketPriority(ticketId, priority);
      if (!res.success || !res.ticket) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: `اولویت تیکت با موفقیت به‌روزرسانی شد.`,
        ticket: res.ticket,
        stats: getSupportStats(),
      });
    }

    // 5. Assign Staff
    if (action === "assign_staff") {
      const { ticketId, staffEmail } = body;
      const res = assignTicketStaff(ticketId, staffEmail);
      if (!res.success || !res.ticket) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: `تیکت به ${staffEmail} ارجاع داده شد.`,
        ticket: res.ticket,
      });
    }

    // 6. Create Canned Response Template
    if (action === "create_canned_template") {
      const res = createCannedTemplate(body.templateData);
      if (!res.success || !res.template) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: `قالب پاسخ آماده «${res.template.title}» ثبت شد.`,
        template: res.template,
      });
    }

    // 7. Resolve Feedback
    if (action === "resolve_feedback") {
      const { feedbackId, adminNote } = body;
      const res = resolveFeedbackItem(feedbackId, adminNote);
      if (!res.success || !res.feedback) {
        return NextResponse.json({ success: false, error: res.error }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: "بازخورد کاربر به عنوان رسیدگی‌شده ثبت شد.",
        feedback: res.feedback,
      });
    }

    // 8. Reset Seed
    if (action === "reset_seed") {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ success: false, error: "عملیات بازنشانی داده‌های کارخانه در محیط عملیاتی غیرمجاز است." }, { status: 403 });
      }

      saveSupportDataToDisk({
        tickets: [...INITIAL_ADMIN_TICKETS],
        templates: [...INITIAL_CANNED_TEMPLATES],
        feedbacks: [...INITIAL_FEEDBACK_ITEMS],
      });

      return NextResponse.json({
        success: true,
        message: "داده‌های میز پشتیبانی و بازخورد به مقادیر اولیه بازنشانی شدند.",
        stats: getSupportStats(),
      });
    }

    return NextResponse.json({ success: false, error: "عملیات ارسالی نامعتبر است." }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "خطا در پردازش عملیات پشتیبانی";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
