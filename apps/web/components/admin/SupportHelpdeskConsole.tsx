"use client";

import React, { useState, useEffect, useMemo } from "react";
import styles from "./support-helpdesk.module.css";
import {
  type AdminSupportTicket,
  type CannedResponseTemplate,
  type UserFeedbackItem,
  type SupportHelpdeskStats,
  type TicketCategory,
  type TicketPriority,
  type TicketStatus,
  INITIAL_ADMIN_TICKETS,
  INITIAL_CANNED_TEMPLATES,
  INITIAL_FEEDBACK_ITEMS,
  INITIAL_SUPPORT_STATS,
  TICKET_CATEGORY_LABELS,
  TICKET_PRIORITY_LABELS,
  TICKET_STATUS_LABELS,
  replaceTemplateVariables,
} from "@/lib/support-content";

type ActiveDesk = "tickets" | "canned" | "feedbacks";

export default function SupportHelpdeskConsole() {
  const [activeDesk, setActiveDesk] = useState<ActiveDesk>("tickets");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core Data
  const [tickets, setTickets] = useState<AdminSupportTicket[]>(INITIAL_ADMIN_TICKETS);
  const [templates, setTemplates] = useState<CannedResponseTemplate[]>(INITIAL_CANNED_TEMPLATES);
  const [feedbacks, setFeedbacks] = useState<UserFeedbackItem[]>(INITIAL_FEEDBACK_ITEMS);
  const [stats, setStats] = useState<SupportHelpdeskStats>(INITIAL_SUPPORT_STATS);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<TicketCategory | "all">("all");

  // Selected Ticket Modal State
  const [activeTicket, setActiveTicket] = useState<AdminSupportTicket | null>(null);
  const [replyInput, setReplyInput] = useState("");
  const [isInternalNoteMode, setIsInternalNoteMode] = useState(false);
  const [markResolvedCheck, setMarkResolvedCheck] = useState(false);

  // New Canned Template Modal
  const [isNewCannedModalOpen, setIsNewCannedModalOpen] = useState(false);
  const [newCannedTitle, setNewCannedTitle] = useState("");
  const [newCannedCategory, setNewCannedCategory] = useState<TicketCategory>("payments");
  const [newCannedShortcut, setNewCannedShortcut] = useState("");
  const [newCannedBody, setNewCannedBody] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Fetch live support data
  const refreshData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/support");
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          if (json.tickets) {
            setTickets(json.tickets);
            // If activeTicket is open, update it
            if (activeTicket) {
              const updated = json.tickets.find((t: AdminSupportTicket) => t.id === activeTicket.id);
              if (updated) setActiveTicket(updated);
            }
          }
          if (json.templates) setTemplates(json.templates);
          if (json.feedbacks) setFeedbacks(json.feedbacks);
          if (json.stats) setStats(json.stats);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch support data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
      if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesUser = t.userName.toLowerCase().includes(q);
        const matchesEmail = t.userEmail.toLowerCase().includes(q);
        const matchesPhone = t.userPhone.includes(q);
        const matchesId = t.id.toLowerCase().includes(q);
        if (!matchesTitle && !matchesUser && !matchesEmail && !matchesPhone && !matchesId) return false;
      }
      return true;
    });
  }, [tickets, statusFilter, priorityFilter, categoryFilter, searchQuery]);

  // Actions: Send Reply or Add Internal Note
  const handleSendSubmit = async () => {
    if (!activeTicket || !replyInput.trim()) return;

    try {
      if (isInternalNoteMode) {
        // Internal Note
        const res = await fetch("/api/admin/support", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "add_internal_note",
            ticketId: activeTicket.id,
            note: replyInput.trim(),
            staffName: "کارشناس ادمین",
          }),
        });
        const data = await res.json();
        if (data.success) {
          showToast("🔒 یادداشت محرمانه داخلی با موفقیت افزوده شد.");
          setReplyInput("");
          refreshData();
        } else {
          showToast(`❌ خطا: ${data.error}`);
        }
      } else {
        // Public Staff Reply
        const res = await fetch("/api/admin/support", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "send_reply",
            ticketId: activeTicket.id,
            replyBody: replyInput.trim(),
            markResolved: markResolvedCheck,
          }),
        });
        const data = await res.json();
        if (data.success) {
          showToast("✅ پاسخ شما برای کاربر ارسال و ثبت شد.");
          setReplyInput("");
          setMarkResolvedCheck(false);
          refreshData();
        } else {
          showToast(`❌ خطا: ${data.error}`);
        }
      }
    } catch {
      showToast("❌ خطا در برقراری ارتباط با سرور");
    }
  };

  // Actions: Update Priority
  const handleUpdatePriority = async (newPriority: TicketPriority) => {
    if (!activeTicket) return;
    try {
      const res = await fetch("/api/admin/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_priority",
          ticketId: activeTicket.id,
          priority: newPriority,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("اولویت تیکت تغییر یافت.");
        refreshData();
      }
    } catch {
      showToast("خطا در تغییر اولویت");
    }
  };

  // Actions: Update Status
  const handleUpdateStatus = async (newStatus: TicketStatus) => {
    if (!activeTicket) return;
    try {
      const res = await fetch("/api/admin/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_status",
          ticketId: activeTicket.id,
          status: newStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("وضعیت تیکت به‌روزرسانی شد.");
        refreshData();
      }
    } catch {
      showToast("خطا در تغییر وضعیت");
    }
  };

  // Actions: Use Canned Response
  const handleSelectCanned = (template: CannedResponseTemplate) => {
    if (!activeTicket) return;
    const substituted = replaceTemplateVariables(template.bodyTemplate, {
      userName: activeTicket.userName,
      ticketId: activeTicket.id,
      staffName: "پشتیبانی ایندورا",
    });
    setReplyInput(substituted);
    setIsInternalNoteMode(false);
    showToast(`قالب «${template.title}» درج گردید.`);
  };

  // Actions: Create Canned Template
  const handleCreateCannedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCannedTitle.trim() || !newCannedBody.trim()) {
      showToast("عنوان و متن قالب الزامی است.");
      return;
    }

    try {
      const res = await fetch("/api/admin/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_canned_template",
          templateData: {
            title: newCannedTitle.trim(),
            category: newCannedCategory,
            shortcutCode: newCannedShortcut.trim() || "/template",
            bodyTemplate: newCannedBody.trim(),
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("قالب پاسخ آماده با موفقیت ذخیره شد.");
        setIsNewCannedModalOpen(false);
        setNewCannedTitle("");
        setNewCannedBody("");
        refreshData();
      }
    } catch {
      showToast("خطا در ذخیره قالب");
    }
  };

  // Actions: Resolve Feedback
  const handleResolveFeedback = async (feedbackId: string) => {
    try {
      const res = await fetch("/api/admin/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "resolve_feedback",
          feedbackId,
          adminNote: "رسیدگی شد و در اسپرینت رفع اشکال قرار گرفت.",
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("بازخورد به عنوان رسیدگی‌شده ثبت شد.");
        refreshData();
      }
    } catch {
      showToast("خطا در تغییر وضعیت بازخورد");
    }
  };

  // Reset seed
  const handleResetSeed = async () => {
    if (!window.confirm("آیا از بازنشانی داده‌های نمونه پشتیبانی به حالت اولیه اطمینان دارید؟")) return;
    try {
      const res = await fetch("/api/admin/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_seed" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("داده‌های میز پشتیبانی بازنشانی شدند.");
        refreshData();
      }
    } catch {
      showToast("خطا در بازنشانی");
    }
  };

  return (
    <div className={styles.container}>
      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            left: "2rem",
            background: "#0f172a",
            color: "#ffffff",
            padding: "0.85rem 1.5rem",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            zIndex: 9999,
            fontSize: "0.9rem",
            fontWeight: 700,
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Header Card */}
      <div className={styles.headerCard}>
        <div className={styles.headerInfo}>
          <h2 className={styles.headerTitle}>
            <span>🎧</span>
            کارتابل پشتیبانی، تریاژ تیکت‌ها و مرکز ارتباط با کاربران
          </h2>
          <p className={styles.headerDesc}>
            مدیریت تیکت‌های پشتیبانی با تریاژ هوشمند، پاسخ‌های آماده، یادداشت‌های محرمانه داخلی و صندوق فیدبک کاربران
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnResetSeed} onClick={handleResetSeed}>
            <span>🔄</span> بازنشانی داده‌ها
          </button>
        </div>
      </div>

      {/* KPI Summary Grid */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiTitle}>تیکت‌های باز و در حال بررسی</span>
            <span className={styles.kpiIcon}>📨</span>
          </div>
          <div className={styles.kpiValue} style={{ color: "#4f46e5" }}>
            {stats.openTicketsCount} تیکت
          </div>
          <div className={styles.kpiSub}>از میان {tickets.length} تیکت ثبت شده</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiTitle}>موارد دارای فوریت و بحرانی</span>
            <span className={styles.kpiIcon}>🚨</span>
          </div>
          <div className={styles.kpiValue} style={{ color: stats.criticalTicketsCount > 0 ? "#dc2626" : "#059669" }}>
            {stats.criticalTicketsCount} مورد نیازمند اقدام
          </div>
          <div className={styles.kpiSub}>اولویت بحرانی (مالی / امنیت / آزمون)</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiTitle}>میانگین زمان پاسخگویی</span>
            <span className={styles.kpiIcon}>⚡</span>
          </div>
          <div className={styles.kpiValue} style={{ color: "#059669" }}>
            {stats.averageResponseTimeMinutes} دقیقه
          </div>
          <div className={styles.kpiSub}>۸۲٪ سریع‌تر از میانگین هدف پلتفرم</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiTitle}>شاخص رضایت کاربران (CSAT)</span>
            <span className={styles.kpiIcon}>⭐</span>
          </div>
          <div className={styles.kpiValue} style={{ color: "#d97706" }}>
            {stats.csatAverageScore} <span style={{ fontSize: "0.85rem", color: "#64748b" }}>/ ۵.۰</span>
          </div>
          <div className={styles.kpiSub}>{stats.totalFeedbacksCount} بازخورد و ارزیابی ثبت شده</div>
        </div>
      </div>

      {/* Desk Switcher Bar */}
      <div className={styles.deskNavCard}>
        <button
          className={`${styles.deskNavBtn} ${activeDesk === "tickets" ? styles.deskNavBtnActive : ""}`}
          onClick={() => setActiveDesk("tickets")}
        >
          <span>🎫</span>
          کارتابل تیکت‌های پشتیبانی
          <span className={styles.deskBadge}>{stats.openTicketsCount} باز</span>
        </button>

        <button
          className={`${styles.deskNavBtn} ${activeDesk === "canned" ? styles.deskNavBtnActive : ""}`}
          onClick={() => setActiveDesk("canned")}
        >
          <span>💬</span>
          قالب‌های پاسخ سریع (Canned)
          <span className={styles.deskBadge}>{templates.length} قالب</span>
        </button>

        <button
          className={`${styles.deskNavBtn} ${activeDesk === "feedbacks" ? styles.deskNavBtnActive : ""}`}
          onClick={() => setActiveDesk("feedbacks")}
        >
          <span>⭐</span>
          صندوق بازخوردها و گزارش باگ
          <span className={styles.deskBadge}>{feedbacks.length} مورد</span>
        </button>
      </div>

      {/* DESK 1: TICKETS QUEUE */}
      {activeDesk === "tickets" && (
        <>
          <div className={styles.toolbarCard}>
            <div className={styles.searchRow}>
              <div className={styles.searchInputWrapper}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="جستجو در شناسه تیکت، عنوان، نام کاربر، ایمیل یا تلفن..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className={styles.select}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as TicketCategory | "all")}
              >
                <option value="all">همه دپارتمان‌ها</option>
                <option value="payments">امور مالی و پرداخت‌ها</option>
                <option value="courses">دوره‌ها و یادگیری</option>
                <option value="security">امنیت و حساب کاربری</option>
                <option value="technical">مشکلات فنی</option>
              </select>

              <select
                className={styles.select}
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as TicketPriority | "all")}
              >
                <option value="all">همه اولویت‌ها</option>
                <option value="critical">بحرانی (Critical)</option>
                <option value="high">فوری (High)</option>
                <option value="medium">متوسط (Medium)</option>
                <option value="low">عادی (Low)</option>
              </select>
            </div>

            <div className={styles.statusTabsRow}>
              <button
                className={`${styles.statusTabBtn} ${statusFilter === "all" ? styles.statusTabBtnActive : ""}`}
                onClick={() => setStatusFilter("all")}
              >
                همه ({tickets.length})
              </button>
              <button
                className={`${styles.statusTabBtn} ${statusFilter === "new" ? styles.statusTabBtnActive : ""}`}
                onClick={() => setStatusFilter("new")}
              >
                جدید ({tickets.filter((t) => t.status === "new").length})
              </button>
              <button
                className={`${styles.statusTabBtn} ${statusFilter === "escalated" ? styles.statusTabBtnActive : ""}`}
                onClick={() => setStatusFilter("escalated")}
              >
                ارجاع به انسان ({tickets.filter((t) => t.status === "escalated").length})
              </button>
              <button
                className={`${styles.statusTabBtn} ${statusFilter === "in_progress" ? styles.statusTabBtnActive : ""}`}
                onClick={() => setStatusFilter("in_progress")}
              >
                در حال بررسی ({tickets.filter((t) => t.status === "in_progress").length})
              </button>
              <button
                className={`${styles.statusTabBtn} ${statusFilter === "resolved" ? styles.statusTabBtnActive : ""}`}
                onClick={() => setStatusFilter("resolved")}
              >
                حل شده ({tickets.filter((t) => t.status === "resolved").length})
              </button>
            </div>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>کد و موضوع تیکت</th>
                    <th>کاربر ارسال‌کننده</th>
                    <th>دپارتمان</th>
                    <th>اولویت</th>
                    <th>وضعیت</th>
                    <th>کارشناس مسئول</th>
                    <th>آخرین بروزرسانی</th>
                    <th>اقدام</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => {
                    const priorityConfig = TICKET_PRIORITY_LABELS[ticket.priority];
                    const statusConfig = TICKET_STATUS_LABELS[ticket.status];

                    return (
                      <tr key={ticket.id} style={{ cursor: "pointer" }} onClick={() => setActiveTicket(ticket)}>
                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              <span style={{ fontFamily: "monospace", fontWeight: 800, color: "#4f46e5" }}>
                                #{ticket.id}
                              </span>
                              {ticket.escalatedToHuman && (
                                <span style={{ fontSize: "0.7rem", color: "#b91c1c", background: "#fee2e2", padding: "0.1rem 0.4rem", borderRadius: "4px", fontWeight: 700 }}>
                                  👤 ارجاع انسانی
                                </span>
                              )}
                            </div>
                            <strong style={{ color: "#0f172a", fontSize: "0.88rem" }}>{ticket.title}</strong>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                            <strong style={{ color: "#0f172a" }}>{ticket.userName}</strong>
                            <span style={{ fontSize: "0.72rem", color: "#64748b" }}>{ticket.userPhone}</span>
                          </div>
                        </td>
                        <td>
                          <span className={styles.categoryBadge}>{TICKET_CATEGORY_LABELS[ticket.category]}</span>
                        </td>
                        <td>
                          <span
                            className={styles.priorityBadge}
                            style={{ color: priorityConfig.color, background: priorityConfig.bgColor }}
                          >
                            {priorityConfig.labelFa}
                          </span>
                        </td>
                        <td>
                          <span
                            className={styles.statusBadge}
                            style={{ color: statusConfig.color, background: statusConfig.bgColor }}
                          >
                            {statusConfig.labelFa}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                            {ticket.assignedStaffEmail || "تخصیص نیافته"}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
                            {new Date(ticket.updatedAt).toLocaleDateString("fa-IR")}
                          </span>
                        </td>
                        <td>
                          <button
                            className={styles.btnPrimary}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTicket(ticket);
                            }}
                          >
                            پاسخ و تریاژ
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredTickets.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ textAlign: "center", padding: "2.5rem", color: "#64748b" }}>
                        هیچ تیکتی با این فیلترها یافت نشد.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* DESK 2: CANNED RESPONSES */}
      {activeDesk === "canned" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ margin: 0, fontSize: "0.88rem", color: "#64748b" }}>
              قالب‌های پاسخ سریع به اپراتورها اجازه می‌دهد با متغیرهای هوشمند ({`{نام}`} و {`{کد تیکت}`}) در چند ثانیه به پرسش‌های متداول پاسخ دهند.
            </p>
            <button className={styles.btnPrimary} onClick={() => setIsNewCannedModalOpen(true)}>
              + ایجاد قالب پاسخ جدید
            </button>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>کد میانبر</th>
                    <th>عنوان قالب پاسخ</th>
                    <th>دپارتمان</th>
                    <th>متن پیش‌نمایش پاسخ</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map((tpl) => (
                    <tr key={tpl.id}>
                      <td>
                        <span style={{ fontFamily: "monospace", fontWeight: 800, color: "#4f46e5", background: "#f5f3ff", padding: "0.25rem 0.5rem", borderRadius: "6px" }}>
                          {tpl.shortcutCode}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: "#0f172a" }}>{tpl.title}</strong>
                      </td>
                      <td>
                        <span className={styles.categoryBadge}>{TICKET_CATEGORY_LABELS[tpl.category]}</span>
                      </td>
                      <td>
                        <div style={{ maxWidth: "450px", fontSize: "0.82rem", color: "#475569", whiteSpace: "pre-wrap" }}>
                          {tpl.bodyTemplate}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DESK 3: FEEDBACK INBOX */}
      {activeDesk === "feedbacks" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <p style={{ margin: 0, fontSize: "0.88rem", color: "#64748b" }}>
            صندوق بازخوردها و گزارش باگ‌های ثبت‌شده توسط زبان‌آموزان در صفحات مختلف سایت همراه با امتیاز رضایت.
          </p>

          <div className={styles.feedbackGrid}>
            {feedbacks.map((fdb) => (
              <div key={fdb.id} className={styles.feedbackCard}>
                <div className={styles.feedbackTop}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        padding: "0.15rem 0.5rem",
                        borderRadius: "6px",
                        background: fdb.type === "bug_report" ? "#fee2e2" : fdb.type === "feature_request" ? "#eff6ff" : "#ecfdf5",
                        color: fdb.type === "bug_report" ? "#b91c1c" : fdb.type === "feature_request" ? "#1d4ed8" : "#047857",
                      }}
                    >
                      {fdb.type === "bug_report"
                        ? "گزارش باگ"
                        : fdb.type === "feature_request"
                        ? "پیشنهاد ویژگی"
                        : fdb.type === "complaint"
                        ? "شکایت"
                        : "تقدیر"}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "#64748b" }}>صفحه: {fdb.pageUrl}</span>
                  </div>
                  <div className={styles.starRating}>
                    {"★".repeat(fdb.rating)}
                    {"☆".repeat(5 - fdb.rating)}
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: "0.86rem", lineHeight: 1.6, color: "#1e293b" }}>{fdb.message}</p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.5rem", borderTop: "1px solid #f1f5f9" }}>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                    <span>ارسال توسط: </span>
                    <strong>{fdb.userName}</strong> ({fdb.userPhone})
                  </div>

                  {fdb.status === "resolved" ? (
                    <span style={{ fontSize: "0.75rem", color: "#047857", fontWeight: 700 }}>✓ برطرف شد</span>
                  ) : (
                    <button className={styles.btnSecondary} onClick={() => handleResolveFeedback(fdb.id)}>
                      علامت‌گذاری به عنوان رسیدگی‌شده
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2-PANE TICKET DETAIL MODAL */}
      {activeTicket && (
        <div className={styles.modalBackdrop} onClick={() => setActiveTicket(null)}>
          <div className={styles.ticketModalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.ticketModalHeader}>
              <h3 className={styles.ticketModalTitle}>
                <span>🎫</span>
                <span>تیکت #{activeTicket.id}: {activeTicket.title}</span>
              </h3>
              <button className={styles.modalCloseBtn} onClick={() => setActiveTicket(null)}>
                ✕
              </button>
            </div>

            <div className={styles.ticketModalBody}>
              {/* Left Pane: Chat Timeline */}
              <div className={styles.chatSection}>
                <div className={styles.chatTimeline}>
                  {activeTicket.messages.map((msg) => {
                    if (msg.isInternalNote || msg.senderType === "internal_note") {
                      return (
                        <div key={msg.id} className={styles.messageBubbleInternalNote}>
                          <div className={styles.msgHeader}>
                            <strong>🔒 {msg.senderName} (یادداشت محرمانه داخلی - مخفی از کاربر)</strong>
                            <span>{new Date(msg.createdAt).toLocaleTimeString("fa-IR")}</span>
                          </div>
                          <div className={styles.msgBody}>{msg.body}</div>
                        </div>
                      );
                    }

                    if (msg.senderType === "ai_agent") {
                      return (
                        <div key={msg.id} className={styles.messageBubbleAi}>
                          <div className={styles.msgHeader}>
                            <strong style={{ color: "#6d28d9" }}>🤖 {msg.senderName}</strong>
                            <span>{new Date(msg.createdAt).toLocaleTimeString("fa-IR")}</span>
                          </div>
                          <div className={styles.msgBody}>{msg.body}</div>
                        </div>
                      );
                    }

                    if (msg.senderType === "staff") {
                      return (
                        <div key={msg.id} className={styles.messageBubbleStaff}>
                          <div className={styles.msgHeader}>
                            <strong style={{ color: "#1d4ed8" }}>👨‍💼 {msg.senderName}</strong>
                            <span>{new Date(msg.createdAt).toLocaleTimeString("fa-IR")}</span>
                          </div>
                          <div className={styles.msgBody}>{msg.body}</div>
                        </div>
                      );
                    }

                    return (
                      <div key={msg.id} className={styles.messageBubbleUser}>
                        <div className={styles.msgHeader}>
                          <strong>👤 {msg.senderName} (کاربر)</strong>
                          <span>{new Date(msg.createdAt).toLocaleTimeString("fa-IR")}</span>
                        </div>
                        <div className={styles.msgBody}>{msg.body}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Pane: Meta & AI Co-Pilot */}
              <div className={styles.ticketMetaSidebar}>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>کاربر ارسال‌کننده:</span>
                  <strong style={{ fontSize: "0.9rem" }}>{activeTicket.userName}</strong>
                  <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{activeTicket.userEmail} | {activeTicket.userPhone}</span>
                </div>

                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>تغییر اولویت:</span>
                  <select
                    className={styles.select}
                    value={activeTicket.priority}
                    onChange={(e) => handleUpdatePriority(e.target.value as TicketPriority)}
                  >
                    <option value="critical">بحرانی (Critical)</option>
                    <option value="high">فوری (High)</option>
                    <option value="medium">متوسط (Medium)</option>
                    <option value="low">عادی (Low)</option>
                  </select>
                </div>

                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>تغییر وضعیت:</span>
                  <select
                    className={styles.select}
                    value={activeTicket.status}
                    onChange={(e) => handleUpdateStatus(e.target.value as TicketStatus)}
                  >
                    <option value="new">جدید</option>
                    <option value="in_progress">در حال بررسی</option>
                    <option value="escalated">ارجاع به کارشناس ارشد</option>
                    <option value="resolved">حل شده</option>
                    <option value="closed">بسته</option>
                  </select>
                </div>

                {activeTicket.aiSuggestedReply && (
                  <div className={styles.aiSuggestedBox}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#6d28d9" }}>
                        ✨ پیشنهاد پاسخ هوش مصنوعی
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#334155", lineHeight: 1.5 }}>
                      {activeTicket.aiSuggestedReply}
                    </p>
                    <button
                      className={styles.btnUseAiReply}
                      onClick={() => {
                        setReplyInput(activeTicket.aiSuggestedReply || "");
                        setIsInternalNoteMode(false);
                      }}
                    >
                      درج در پیام پاسخ
                    </button>
                  </div>
                )}

                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>درج سریع از قالب‌های آماده:</span>
                  <select
                    className={styles.select}
                    defaultValue=""
                    onChange={(e) => {
                      const tpl = templates.find((t) => t.id === e.target.value);
                      if (tpl) handleSelectCanned(tpl);
                    }}
                  >
                    <option value="" disabled>
                      انتخاب قالب پاسخ...
                    </option>
                    {templates.map((tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.shortcutCode} - {tpl.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Bottom: Reply Composer */}
            <div className={styles.replyComposerArea}>
              <div className={styles.composerTopRow}>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    className={!isInternalNoteMode ? styles.btnPrimary : styles.btnSecondary}
                    onClick={() => setIsInternalNoteMode(false)}
                  >
                    <span>💬</span> ارسال پاسخ به کاربر
                  </button>
                  <button
                    type="button"
                    className={isInternalNoteMode ? styles.btnPrimary : styles.btnSecondary}
                    style={{ background: isInternalNoteMode ? "#d97706" : undefined }}
                    onClick={() => setIsInternalNoteMode(true)}
                  >
                    <span>🔒</span> ثبت یادداشت محرمانه داخلی
                  </button>
                </div>

                {!isInternalNoteMode && (
                  <label style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8rem", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={markResolvedCheck}
                      onChange={(e) => setMarkResolvedCheck(e.target.checked)}
                    />
                    <span>پس از ارسال، تیکت به وضعیت «حل‌شده» تغییر یابد</span>
                  </label>
                )}
              </div>

              <textarea
                className={styles.textarea}
                placeholder={
                  isInternalNoteMode
                    ? "یادداشت محرمانه خود را بنویسید (این متن فقط برای تیم ادمین قابل مشاهده است)..."
                    : "پاسخ رسمی خود به زبان‌آموز را اینجا تایپ نمایید..."
                }
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
              />

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className={styles.btnPrimary}
                  style={{ background: isInternalNoteMode ? "#d97706" : undefined, padding: "0.6rem 1.5rem" }}
                  disabled={!replyInput.trim()}
                  onClick={handleSendSubmit}
                >
                  {isInternalNoteMode ? "ثبت یادداشت محرمانه" : "ارسال پاسخ نهایی به کاربر"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE CANNED RESPONSE */}
      {isNewCannedModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsNewCannedModalOpen(false)}>
          <div className={styles.ticketModalContent} style={{ maxWidth: "550px" }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.ticketModalHeader}>
              <h3 className={styles.ticketModalTitle}>
                <span>💬</span> ایجاد قالب پاسخ سریع جدید
              </h3>
              <button className={styles.modalCloseBtn} onClick={() => setIsNewCannedModalOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateCannedSubmit}>
              <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                    عنوان قالب پاسخ:
                  </label>
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="مثال: راهنمایی شروع دوره آیلتس"
                    value={newCannedTitle}
                    onChange={(e) => setNewCannedTitle(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                      دپارتمان:
                    </label>
                    <select
                      className={styles.select}
                      value={newCannedCategory}
                      onChange={(e) => setNewCannedCategory(e.target.value as TicketCategory)}
                    >
                      <option value="payments">امور مالی و پرداخت‌ها</option>
                      <option value="courses">دوره‌ها و یادگیری</option>
                      <option value="account">حساب کاربری</option>
                      <option value="technical">فنی</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                      کد میانبر:
                    </label>
                    <input
                      type="text"
                      className={styles.searchInput}
                      placeholder="/shortcut"
                      value={newCannedShortcut}
                      onChange={(e) => setNewCannedShortcut(e.target.value)}
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                    متن قالب (پشتیبانی از متغیرهای پویا نظیر {`{نام}`}):
                  </label>
                  <textarea
                    className={styles.textarea}
                    placeholder="سلام {نام} عزیز، با بررسی انجام شده..."
                    value={newCannedBody}
                    onChange={(e) => setNewCannedBody(e.target.value)}
                    style={{ minHeight: "120px" }}
                    required
                  />
                </div>
              </div>
              <div style={{ padding: "1rem 1.5rem", background: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                <button type="button" className={styles.btnSecondary} onClick={() => setIsNewCannedModalOpen(false)}>
                  انصراف
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  ذخیره قالب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
