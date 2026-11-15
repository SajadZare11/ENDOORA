import { NextRequest, NextResponse } from "next/server";
import { getSupportData, saveSupportDataToDisk, type AdminSupportTicket } from "@/lib/support-store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || searchParams.get("user_id");

    const data = getSupportData();
    let tickets = data.tickets;

    if (userId) {
      tickets = tickets.filter((t) => t.userId === userId);
    }

    // Filter out internal notes for public user consumption
    const sanitizedTickets = tickets.map((t) => ({
      ...t,
      messages: t.messages.filter((m) => !m.isInternalNote && m.senderType !== "internal_note"),
    }));

    return NextResponse.json({ success: true, tickets: sanitizedTickets });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "خطا در دریافت تیکت‌ها";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, userName, userEmail, userPhone, category, title, description } = body;

    if (!title || !description || !category) {
      return NextResponse.json(
        { success: false, error: "عنوان، دسته‌بندی و شرح تیکت الزامی است." },
        { status: 400 }
      );
    }

    const store = getSupportData();
    const newTicket: AdminSupportTicket = {
      id: `tkt-${Date.now().toString(36)}`,
      userId: userId || "usr-anon",
      userName: userName || "کاربر پلتفرم",
      userEmail: userEmail || "user@endoora.ir",
      userPhone: userPhone || "09000000000",
      category,
      priority: category === "payments" || category === "security" ? "high" : "medium",
      title: title.trim(),
      description: description.trim(),
      status: "new",
      escalatedToHuman: false,
      aiSuggestedReply: `سلام ${userName || "کاربر گرامی"}، پیام شما در رابطه با ${title} دریافت شد و کارشناسان پشتیبانی به زودی پاسخ خواهند داد.`,
      messages: [
        {
          id: `msg-${Date.now().toString(36)}`,
          senderType: "user",
          senderName: userName || "کاربر",
          body: description.trim(),
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.tickets.unshift(newTicket);
    saveSupportDataToDisk(store);

    return NextResponse.json({
      success: true,
      message: "تیکت پشتیبانی شما با موفقیت ثبت شد و در صف پیگیری قرار گرفت.",
      ticket: newTicket,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "خطا در ثبت تیکت پشتیبانی";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
