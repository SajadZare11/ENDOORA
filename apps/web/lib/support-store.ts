import fs from "fs";
import path from "path";
export * from "./support-content.ts";
import {
  type AdminSupportTicket,
  type CannedResponseTemplate,
  type UserFeedbackItem,
  type SupportHelpdeskStats,
  type TicketStatus,
  type TicketPriority,
  INITIAL_ADMIN_TICKETS,
  INITIAL_CANNED_TEMPLATES,
  INITIAL_FEEDBACK_ITEMS,
} from "./support-content.ts";

interface SupportStoragePayload {
  tickets: AdminSupportTicket[];
  templates: CannedResponseTemplate[];
  feedbacks: UserFeedbackItem[];
}

let inMemorySupport: SupportStoragePayload | null = null;

function resolveStoragePath(): string {
  const candidateWeb = path.join(process.cwd(), "apps", "web", "data", "support-operations.json");
  const candidateLocal = path.join(process.cwd(), "data", "support-operations.json");
  if (fs.existsSync(path.dirname(candidateWeb))) {
    return candidateWeb;
  }
  return candidateLocal;
}

export function getSupportData(): SupportStoragePayload {
  if (inMemorySupport) {
    return inMemorySupport;
  }

  const filePath = resolveStoragePath();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      inMemorySupport = JSON.parse(raw);
      return inMemorySupport!;
    }
  } catch (err) {
    console.warn("Could not read support-operations.json from disk, seeding with initial data:", err);
  }

  inMemorySupport = {
    tickets: [...INITIAL_ADMIN_TICKETS],
    templates: [...INITIAL_CANNED_TEMPLATES],
    feedbacks: [...INITIAL_FEEDBACK_ITEMS],
  };
  saveSupportDataToDisk(inMemorySupport);
  return inMemorySupport;
}

export function saveSupportDataToDisk(data: SupportStoragePayload): boolean {
  inMemorySupport = data;
  try {
    const filePath = resolveStoragePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.warn("Failed to write support-operations.json to disk:", err);
    return false;
  }
}

export function getSupportStats(): SupportHelpdeskStats {
  const data = getSupportData();
  const tickets = data.tickets;
  const feedbacks = data.feedbacks;

  const openTickets = tickets.filter((t) => t.status === "new" || t.status === "in_progress" || t.status === "escalated");
  const criticalTickets = tickets.filter((t) => (t.priority === "critical" || t.priority === "high") && t.status !== "closed" && t.status !== "resolved");
  const resolvedTickets = tickets.filter((t) => t.status === "resolved" || t.status === "closed");

  const csatItems = tickets.filter((t) => t.csatRating && t.csatRating > 0);
  const csatSum = csatItems.reduce((sum, t) => sum + (t.csatRating || 0), 0);
  const csatAvg = csatItems.length > 0 ? parseFloat((csatSum / csatItems.length).toFixed(1)) : 4.8;

  return {
    openTicketsCount: openTickets.length,
    criticalTicketsCount: criticalTickets.length,
    averageResponseTimeMinutes: 14,
    csatAverageScore: csatAvg,
    totalFeedbacksCount: feedbacks.length,
    resolvedTicketsCount: resolvedTickets.length,
  };
}

// 1. Reply to Ticket
export function replyToTicket(
  ticketId: string,
  data: {
    body: string;
    senderName?: string;
    staffEmail?: string;
    markResolved?: boolean;
  }
): { success: boolean; ticket?: AdminSupportTicket; error?: string } {
  if (!data.body || !data.body.trim()) {
    return { success: false, error: "متن پاسخ نمی‌تواند خالی باشد." };
  }

  const store = getSupportData();
  const ticket = store.tickets.find((t) => t.id === ticketId);
  if (!ticket) {
    return { success: false, error: "تیکت یافت نشد." };
  }

  const newMsg = {
    id: `msg-${Date.now().toString(36)}`,
    senderType: "staff" as const,
    senderName: data.senderName || "کارشناس ارشد پشتیبانی ایندورا",
    body: data.body.trim(),
    createdAt: new Date().toISOString(),
  };

  ticket.messages.push(newMsg);
  ticket.updatedAt = new Date().toISOString();
  if (data.markResolved) {
    ticket.status = "resolved";
  } else if (ticket.status === "new" || ticket.status === "ai_answered") {
    ticket.status = "in_progress";
  }

  if (data.staffEmail) {
    ticket.assignedStaffEmail = data.staffEmail;
  }

  saveSupportDataToDisk(store);
  return { success: true, ticket };
}

// 2. Add Confidential Internal Note
export function addInternalNote(
  ticketId: string,
  data: {
    note: string;
    staffName?: string;
  }
): { success: boolean; ticket?: AdminSupportTicket; error?: string } {
  if (!data.note || !data.note.trim()) {
    return { success: false, error: "متن یادداشت محرمانه نمی‌تواند خالی باشد." };
  }

  const store = getSupportData();
  const ticket = store.tickets.find((t) => t.id === ticketId);
  if (!ticket) {
    return { success: false, error: "تیکت یافت نشد." };
  }

  const newMsg = {
    id: `note-${Date.now().toString(36)}`,
    senderType: "internal_note" as const,
    senderName: data.staffName || "کارشناس ادمین",
    body: `یادداشت محرمانه: ${data.note.trim()}`,
    createdAt: new Date().toISOString(),
    isInternalNote: true,
  };

  ticket.messages.push(newMsg);
  ticket.updatedAt = new Date().toISOString();

  saveSupportDataToDisk(store);
  return { success: true, ticket };
}

// 3. Update Status
export function updateTicketStatus(
  ticketId: string,
  status: TicketStatus
): { success: boolean; ticket?: AdminSupportTicket; error?: string } {
  const store = getSupportData();
  const ticket = store.tickets.find((t) => t.id === ticketId);
  if (!ticket) {
    return { success: false, error: "تیکت یافت نشد." };
  }

  ticket.status = status;
  ticket.updatedAt = new Date().toISOString();
  saveSupportDataToDisk(store);
  return { success: true, ticket };
}

// 4. Update Priority
export function updateTicketPriority(
  ticketId: string,
  priority: TicketPriority
): { success: boolean; ticket?: AdminSupportTicket; error?: string } {
  const store = getSupportData();
  const ticket = store.tickets.find((t) => t.id === ticketId);
  if (!ticket) {
    return { success: false, error: "تیکت یافت نشد." };
  }

  ticket.priority = priority;
  if (priority === "critical" || priority === "high") {
    ticket.escalatedToHuman = true;
  }
  ticket.updatedAt = new Date().toISOString();
  saveSupportDataToDisk(store);
  return { success: true, ticket };
}

// 5. Assign Staff
export function assignTicketStaff(
  ticketId: string,
  staffEmail: string
): { success: boolean; ticket?: AdminSupportTicket; error?: string } {
  const store = getSupportData();
  const ticket = store.tickets.find((t) => t.id === ticketId);
  if (!ticket) {
    return { success: false, error: "تیکت یافت نشد." };
  }

  ticket.assignedStaffEmail = staffEmail;
  ticket.updatedAt = new Date().toISOString();
  saveSupportDataToDisk(store);
  return { success: true, ticket };
}

// 6. Create Canned Response Template
export function createCannedTemplate(
  data: Omit<CannedResponseTemplate, "id">
): { success: boolean; template?: CannedResponseTemplate; error?: string } {
  if (!data.title || !data.bodyTemplate || !data.shortcutCode) {
    return { success: false, error: "عنوان، کد میانبر و متن قالب الزامی است." };
  }

  const store = getSupportData();
  const newTemplate: CannedResponseTemplate = {
    ...data,
    id: `cn-${Date.now().toString(36)}`,
  };

  store.templates.push(newTemplate);
  saveSupportDataToDisk(store);
  return { success: true, template: newTemplate };
}

// 7. Resolve Feedback Item
export function resolveFeedbackItem(
  feedbackId: string,
  adminNote?: string
): { success: boolean; feedback?: UserFeedbackItem; error?: string } {
  const store = getSupportData();
  const item = store.feedbacks.find((f) => f.id === feedbackId);
  if (!item) {
    return { success: false, error: "بازخورد یافت نشد." };
  }

  item.status = "resolved";
  if (adminNote) {
    item.adminResponseNote = adminNote;
  }
  saveSupportDataToDisk(store);
  return { success: true, feedback: item };
}
