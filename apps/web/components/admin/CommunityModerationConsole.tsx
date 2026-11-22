"use client";

import { errorMessage } from "../../lib/error-message.ts";
import React, { useState, useEffect } from "react";
import styles from "./community-moderation.module.css";
import {
  type CommentModerationStatus,
  type SanctionType,
  type CommunityCommentItem,
  type BannedKeywordRule,
  type SanctionedUserRecord,
  type CommunityModerationStats,
  INITIAL_COMMUNITY_COMMENTS,
  INITIAL_BANNED_KEYWORD_RULES,
  INITIAL_SANCTIONED_USERS,
} from "@/lib/community-moderation-content";

type ActiveSubTab = "queue" | "replies" | "shield";

export function CommunityModerationConsole() {
  const [activeTab, setActiveTab] = useState<ActiveSubTab>("queue");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core Data
  const [comments, setComments] = useState<CommunityCommentItem[]>(INITIAL_COMMUNITY_COMMENTS);
  const [bannedKeywords, setBannedKeywords] = useState<BannedKeywordRule[]>(
    INITIAL_BANNED_KEYWORD_RULES
  );
  const [sanctionedUsers, setSanctionedUsers] = useState<SanctionedUserRecord[]>(
    INITIAL_SANCTIONED_USERS
  );
  const [stats, setStats] = useState<CommunityModerationStats>({
    totalCommentsToday: 48,
    pendingReviewsCount: 2,
    quarantinedCount: 1,
    autoApprovedPercent: 67,
    activeShadowbansCount: 1,
    avgResponseTimeMin: 14,
  });

  // Modals & Drawers
  const [rejectModalCommentId, setRejectModalCommentId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>("");

  const [replyModalCommentId, setReplyModalCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>("");
  const [staffName, setStaffName] = useState<string>("تیم آموزش ایندورا");
  const [staffRole, setStaffRole] = useState<string>("پاسخ رسمی پشتیبانی آموزشی");

  const [sanctionModalUser, setSanctionModalUser] = useState<{ id: string; name: string } | null>(
    null
  );
  const [sanctionType, setSanctionType] = useState<SanctionType>("shadowban");
  const [sanctionReason, setSanctionReason] = useState<string>("");

  // New Keyword Rule State
  const [newPattern, setNewPattern] = useState<string>("");
  const [newMatchType, setNewMatchType] = useState<"exact" | "contains" | "regex">("contains");
  const [newSeverity, setNewSeverity] = useState<"high" | "medium" | "low">("high");
  const [newWordAction, setNewWordAction] = useState<"quarantine" | "mask" | "reject">("quarantine");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/community");
      const json = await res.json();
      if (json.success && json.data) {
        setComments(json.data.comments);
        setBannedKeywords(json.data.bannedKeywords);
        setSanctionedUsers(json.data.sanctionedUsers);
        setStats(json.data.stats);
      }
    } catch (err) {
      console.warn("Could not fetch remote community moderation data, using seed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 1. Approve Comment
  const handleApprove = async (commentId: string) => {
    try {
      const res = await fetch("/api/admin/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve_comment", commentId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchData();
      } else {
        alert("خطا: " + (data.error || "تایید نشد"));
      }
    } catch (err: unknown) {
      alert("خطای ارتباط: " + errorMessage(err));
    }
  };

  // 2. Reject Comment Submit
  const handleRejectSubmit = async () => {
    if (!rejectModalCommentId || !rejectReason.trim()) {
      alert("لطفاً دلیل رد دیدگاه را مشخص فرمایید.");
      return;
    }
    try {
      const res = await fetch("/api/admin/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reject_comment",
          commentId: rejectModalCommentId,
          reason: rejectReason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setRejectModalCommentId(null);
        setRejectReason("");
        fetchData();
      } else {
        alert("خطا: " + (data.error || "رد نشد"));
      }
    } catch (err: unknown) {
      alert("خطای سرور: " + errorMessage(err));
    }
  };

  // 3. Post Official Reply Submit
  const handleReplySubmit = async () => {
    if (!replyModalCommentId || !replyText.trim()) {
      alert("لطفاً متن پاسخ رسمی را بنویسید.");
      return;
    }
    try {
      const res = await fetch("/api/admin/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "post_official_reply",
          commentId: replyModalCommentId,
          replyText,
          staffName,
          staffRole,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setReplyModalCommentId(null);
        setReplyText("");
        fetchData();
      } else {
        alert("خطا: " + (data.error || "ارسال نشد"));
      }
    } catch (err: unknown) {
      alert("خطای سرور: " + errorMessage(err));
    }
  };

  // 4. Toggle Pin
  const handleTogglePin = async (commentId: string, currentPin: boolean) => {
    try {
      const res = await fetch("/api/admin/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_pin",
          commentId,
          isPinned: !currentPin,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchData();
      }
    } catch (err: unknown) {
      alert("خطا در پین دیدگاه: " + errorMessage(err));
    }
  };

  // 5. Toggle Lock
  const handleToggleLock = async (commentId: string, currentLock: boolean) => {
    try {
      const res = await fetch("/api/admin/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_lock",
          commentId,
          isLocked: !currentLock,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchData();
      }
    } catch (err: unknown) {
      alert("خطا در قفل تاپیک: " + errorMessage(err));
    }
  };

  // 6. Add Keyword Rule
  const handleAddKeywordRule = async () => {
    if (!newPattern.trim()) {
      alert("لطفاً کلمه یا الگوی ممنوعه را وارد کنید.");
      return;
    }
    try {
      const res = await fetch("/api/admin/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_banned_word",
          pattern: newPattern.trim(),
          matchType: newMatchType,
          severity: newSeverity,
          ruleAction: newWordAction,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setNewPattern("");
        fetchData();
      } else {
        alert("خطا: " + (data.error || "ثبت نشد"));
      }
    } catch (err: unknown) {
      alert("خطای سرور: " + errorMessage(err));
    }
  };

  // 7. Delete Keyword Rule
  const handleDeleteKeywordRule = async (ruleId: string) => {
    if (!confirm("آیا از حذف این قانون فیلتر کلمه اطمینان دارید؟")) return;
    try {
      const res = await fetch("/api/admin/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_banned_word", ruleId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchData();
      }
    } catch (err: unknown) {
      alert("خطا در حذف قانون: " + errorMessage(err));
    }
  };

  // 8. Apply Sanction Submit
  const handleSanctionSubmit = async () => {
    if (!sanctionModalUser || !sanctionReason.trim()) {
      alert("لطفاً دلیل اقدام انضباطی را وارد فرمایید.");
      return;
    }
    try {
      const res = await fetch("/api/admin/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "apply_sanction",
          userId: sanctionModalUser.id,
          userName: sanctionModalUser.name,
          sanctionType,
          reason: sanctionReason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        setSanctionModalUser(null);
        setSanctionReason("");
        fetchData();
      } else {
        alert("خطا: " + (data.error || "ثبت نشد"));
      }
    } catch (err: unknown) {
      alert("خطای سرور: " + errorMessage(err));
    }
  };

  // 9. Lift Sanction
  const handleLiftSanction = async (sanctionId: string) => {
    if (!confirm("آیا از لغو محدودیت انضباطی این کاربر اطمینان دارید؟")) return;
    try {
      const res = await fetch("/api/admin/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "lift_sanction", sanctionId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchData();
      }
    } catch (err: unknown) {
      alert("خطا در لغو محدودیت: " + errorMessage(err));
    }
  };

  // 10. Reset Seed
  const handleResetSeed = async () => {
    if (!confirm("آیا از بازنشانی داده‌های تستی نظارت بر کامیونیتی به وضعیت اولیه اطمینان دارید؟")) return;
    try {
      const res = await fetch("/api/admin/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_seed" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchData();
      }
    } catch (err: unknown) {
      alert("خطا در بازنشانی داده‌ها: " + errorMessage(err));
    }
  };

  // Filtered comments
  const filteredComments = comments.filter((c) => {
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getToxicityClass = (score: number) => {
    if (score < 15) return styles.toxicitySafe;
    if (score <= 75) return styles.toxicityMedium;
    return styles.toxicityHigh;
  };

  const getStatusBadge = (status: CommentModerationStatus) => {
    switch (status) {
      case "pending":
        return <span className={styles.statusBadgePending}>در انتظار بررسی</span>;
      case "approved":
        return <span className={styles.statusBadgeApproved}>تایید و منتشر شده</span>;
      case "quarantined":
        return <span className={styles.statusBadgeQuarantined}>قرنطینه هوشمند</span>;
      case "rejected":
        return <span className={styles.statusBadgeRejected}>رد شده</span>;
    }
  };

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#10b981",
            color: "#ffffff",
            padding: "0.75rem 1.5rem",
            borderRadius: "10px",
            fontWeight: "bold",
            boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
            zIndex: 9999,
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalCommentId && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <h3 className={styles.modalTitle}>رد دیدگاه و خروج از انتشار</h3>
            <p className={styles.modalDesc}>
              دلیل رد این دیدگاه را برای ثبت در سوابق و اعلام به زبان‌آموز بنویسید:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className={styles.modalTextarea}
              placeholder="مثال: نقض قوانین گفتمان محترمانه یا ارسال لینک تبلیغاتی..."
            />
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.btnModalCancel}
                onClick={() => setRejectModalCommentId(null)}
              >
                انصراف
              </button>
              <button
                type="button"
                className={styles.btnModalSubmit}
                style={{ background: "#ef4444" }}
                onClick={handleRejectSubmit}
              >
                تایید رد دیدگاه
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Reply Modal */}
      {replyModalCommentId && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <h3 className={styles.modalTitle}>ارسال پاسخ رسمی مدیریت با نشان تایید</h3>
            <p className={styles.modalDesc}>
              این پاسخ با نشان متمایز «تاییدشده توسط تیم آموزش ایندورا» در زیر دیدگاه دانش‌آموز منتشر می‌شود.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              <div>
                <label style={{ fontSize: "0.75rem", color: "#9ca3af" }}>نام پاسخ‌دهنده:</label>
                <input
                  type="text"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className={styles.searchInput}
                  style={{ width: "100%", minWidth: "unset", marginTop: "0.2rem" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.75rem", color: "#9ca3af" }}>عنوان سازمانی:</label>
                <input
                  type="text"
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value)}
                  className={styles.searchInput}
                  style={{ width: "100%", minWidth: "unset", marginTop: "0.2rem" }}
                />
              </div>
            </div>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className={styles.modalTextarea}
              placeholder="پاسخ علمی، دقیق و مستند آموزشی را اینجا بنویسید..."
            />
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.btnModalCancel}
                onClick={() => setReplyModalCommentId(null)}
              >
                انصراف
              </button>
              <button
                type="button"
                className={styles.btnModalSubmit}
                style={{ background: "#6366f1" }}
                onClick={handleReplySubmit}
              >
                ثبت و انتشار پاسخ رسمی
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sanction User Modal */}
      {sanctionModalUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <h3 className={styles.modalTitle}>اعمال تنبیه انضباطی برای {sanctionModalUser.name}</h3>
            <p className={styles.modalDesc}>
              سطح محدودیت دسترسی کاربر به تالارها و بخش تعاملات را انتخاب کنید:
            </p>
            <div>
              <label style={{ fontSize: "0.75rem", color: "#9ca3af" }}>نوع اقدام انضباطی:</label>
              <select
                value={sanctionType}
                onChange={(e) => setSanctionType(e.target.value as SanctionType)}
                className={styles.searchInput}
                style={{ width: "100%", minWidth: "unset", marginTop: "0.3rem" }}
              >
                <option value="warning">اخطار انضباطی (ارسال هشدار به نوتیفیکیشن کاربر)</option>
                <option value="shadowban">
                  مسدودسازی نامحسوس (Shadowban) - دیدگاه‌ها فقط برای خودش نمایش داده می‌شود
                </option>
                <option value="mute_7_days">قطع موقت ارسال نظر در تمام دوره‌ها به مدت ۷ روز</option>
                <option value="permanent_ban">اخراج دائم و سلب کلیه امتیازات کامیونیتی</option>
              </select>
            </div>
            <textarea
              value={sanctionReason}
              onChange={(e) => setSanctionReason(e.target.value)}
              className={styles.modalTextarea}
              placeholder="علت تخلف (مثال: ارسال هرزنامه، توهین به اساتید، تبلیغات غیرمجاز)..."
            />
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.btnModalCancel}
                onClick={() => setSanctionModalUser(null)}
              >
                انصراف
              </button>
              <button
                type="button"
                className={styles.btnModalSubmit}
                style={{ background: "#dc2626" }}
                onClick={handleSanctionSubmit}
              >
                اعمال قطعی جریمه
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Card */}
      <div className={styles.headerCard}>
        <div className={styles.headerInfo}>
          <h1 className={styles.headerTitle}>
            <span>💬</span>
            <span>سامانه نظارت بر تعاملات، کامیونیتی زبان‌آموزان و ضد هرزنامه (Mod Ops)</span>
          </h1>
          <p className={styles.headerDesc}>
            پایش خودکار دیدگاه‌ها با سمیت‌سنجی هوش مصنوعی (AI Toxicity)، پاسخ رسمی مدیریت به پرسش‌های جلسات،
            مدیریت کلمات ممنوعه و مسدودسازی نامحسوس (Shadowban)
          </p>
        </div>

        <div className={styles.headerActions}>
          <button type="button" className={styles.btnResetSeed} onClick={handleResetSeed}>
            <span>🔄</span>
            <span>بازنشانی پیش‌فرض</span>
          </button>
          <button type="button" className={styles.btnRefresh} onClick={fetchData}>
            <span>⚡</span>
            <span>بروزرسانی زنده</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34d399" }}>
            💬
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>نظرات ثبت‌شده امروز</span>
            <span className={styles.statValue}>{stats.totalCommentsToday} مورد</span>
            <span className={styles.statSubtext}>میانگین پاسخ: {stats.avgResponseTimeMin} دقیقه</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24" }}>
            ⏳
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>در صف بررسی ناظر</span>
            <span className={styles.statValue}>{stats.pendingReviewsCount} دیدگاه</span>
            <span className={styles.statSubtext}>سمیت متوسط (۱۵٪ تا ۷۵٪)</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(239, 68, 68, 0.15)", color: "#f87171" }}>
            🛡️
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>قرنطینه شده با هوش مصنوعی</span>
            <span className={styles.statValue}>{stats.quarantinedCount} اسپم</span>
            <span className={styles.statSubtext}>سمیت بالای ۷۵٪ یا لینک ممنوع</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(99, 102, 241, 0.15)", color: "#818cf8" }}>
            👻
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>شدوبن‌های فعال (Shadowbans)</span>
            <span className={styles.statValue}>{stats.activeShadowbansCount} ترول</span>
            <span className={styles.statSubtext}>تایید خودکار: ٪{stats.autoApprovedPercent}</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className={styles.tabsBar}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "queue" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("queue")}
        >
          <span>📋</span>
          <span>صف زنده بررسی و سمیت‌سنجی (Moderation Queue)</span>
          <span className={styles.tabBadge}>{comments.length}</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "replies" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("replies")}
        >
          <span>📌</span>
          <span>پاسخ‌های رسمی و تاپیک‌های پین‌شده (Official Answers)</span>
          <span className={styles.tabBadge}>
            {comments.filter((c) => c.officialReply || c.isPinned).length}
          </span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "shield" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("shield")}
        >
          <span>🛡️</span>
          <span>شیلد ضد هرزنامه، کلمات ممنوعه و شدوبن (Spam Shield)</span>
          <span className={styles.tabBadge}>{bannedKeywords.length} قانون</span>
        </button>
      </div>

      {/* DESK 1: MODERATION QUEUE */}
      {activeTab === "queue" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Toolbar */}
          <div className={styles.filterToolbar}>
            <input
              type="text"
              placeholder="جستجو در متن نظر، نام زبان‌آموز یا عنوان دوره..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />

            <div className={styles.filterBtnGroup}>
              <button
                type="button"
                className={`${styles.filterBtn} ${statusFilter === "all" ? styles.filterBtnActive : ""}`}
                onClick={() => setStatusFilter("all")}
              >
                همه ({comments.length})
              </button>
              <button
                type="button"
                className={`${styles.filterBtn} ${statusFilter === "pending" ? styles.filterBtnActive : ""}`}
                onClick={() => setStatusFilter("pending")}
              >
                در انتظار بررسی ({comments.filter((c) => c.status === "pending").length})
              </button>
              <button
                type="button"
                className={`${styles.filterBtn} ${statusFilter === "quarantined" ? styles.filterBtnActive : ""}`}
                onClick={() => setStatusFilter("quarantined")}
              >
                قرنطینه اسپم ({comments.filter((c) => c.status === "quarantined").length})
              </button>
              <button
                type="button"
                className={`${styles.filterBtn} ${statusFilter === "approved" ? styles.filterBtnActive : ""}`}
                onClick={() => setStatusFilter("approved")}
              >
                تایید شده ({comments.filter((c) => c.status === "approved").length})
              </button>
              <button
                type="button"
                className={`${styles.filterBtn} ${statusFilter === "rejected" ? styles.filterBtnActive : ""}`}
                onClick={() => setStatusFilter("rejected")}
              >
                رد شده ({comments.filter((c) => c.status === "rejected").length})
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className={styles.commentsList}>
            {filteredComments.map((cmt) => (
              <div key={cmt.id} className={styles.commentCard}>
                <div className={styles.commentHeader}>
                  <div className={styles.authorBox}>
                    <span className={styles.authorName}>{cmt.authorName}</span>
                    <span className={styles.authorRoleBadge}>
                      {cmt.authorRole === "teacher"
                        ? "استاد"
                        : cmt.authorRole === "verified_learner"
                        ? "زبان‌آموز احرازشده"
                        : "دانش‌آموز"}
                    </span>
                    {getStatusBadge(cmt.status)}
                    {cmt.isPinned && (
                      <span style={{ color: "#facc15", fontSize: "0.8rem", fontWeight: "700" }}>
                        📌 پین‌شده در صدر
                      </span>
                    )}
                    {cmt.isLocked && (
                      <span style={{ color: "#ef4444", fontSize: "0.8rem", fontWeight: "700" }}>
                        🔒 تاپیک قفل‌شده
                      </span>
                    )}
                  </div>

                  {/* AI Toxicity Bar */}
                  <div className={styles.toxicityBarContainer}>
                    <span className={styles.toxicityLabel}>سمیت هوش مصنوعی:</span>
                    <div className={styles.toxicityTrack}>
                      <div
                        className={`${styles.toxicityFill} ${getToxicityClass(cmt.aiToxicityScore)}`}
                        style={{ width: `${cmt.aiToxicityScore}%` }}
                      />
                    </div>
                    <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "#f3f4f6" }}>
                      ٪{cmt.aiToxicityScore}
                    </span>
                  </div>
                </div>

                <p className={styles.commentBody}>{cmt.content}</p>

                {/* AI Flags if present */}
                {cmt.aiFlagReasons.length > 0 && (
                  <div className={styles.flagReasonsBox}>
                    <span style={{ fontSize: "0.75rem", color: "#fca5a5", fontWeight: "700" }}>
                      هشدارهای امنیتی مدل:
                    </span>
                    {cmt.aiFlagReasons.map((f, i) => (
                      <span key={i} className={styles.flagTag}>
                        ⚠️ {f}
                      </span>
                    ))}
                  </div>
                )}

                {/* Official Reply if present */}
                {cmt.officialReply && (
                  <div className={styles.replyBox}>
                    <div className={styles.replyHeader}>
                      <div className={styles.replyAuthor}>
                        <span>{cmt.officialReply.staffName}</span>
                        <span className={styles.verifiedPill}>پاسخ رسمی مدیریت</span>
                        <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                          ({cmt.officialReply.staffRole})
                        </span>
                      </div>
                      <span style={{ fontSize: "0.725rem", color: "#64748b" }}>
                        {new Date(cmt.officialReply.repliedAt).toLocaleDateString("fa-IR")}
                      </span>
                    </div>
                    <p className={styles.replyContent}>{cmt.officialReply.content}</p>
                  </div>
                )}

                {/* Metadata */}
                <div className={styles.commentMetaRow}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span className={styles.courseBadge}>{cmt.courseTitle}</span>
                    {cmt.lessonTitle && <span>| {cmt.lessonTitle}</span>}
                    {cmt.ratingStars && (
                      <span className={styles.ratingStars}>{"★".repeat(cmt.ratingStars)}</span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <span>پسندها: {cmt.upvotesCount}</span>
                    <span>{new Date(cmt.createdAt).toLocaleString("fa-IR")}</span>
                  </div>
                </div>

                {/* Actions Row */}
                <div className={styles.actionRow}>
                  {cmt.status !== "approved" && (
                    <button
                      type="button"
                      className={styles.btnApprove}
                      onClick={() => handleApprove(cmt.id)}
                    >
                      <span>✓</span>
                      <span>تایید و انتشار</span>
                    </button>
                  )}

                  {cmt.status !== "rejected" && (
                    <button
                      type="button"
                      className={styles.btnReject}
                      onClick={() => setRejectModalCommentId(cmt.id)}
                    >
                      <span>✕</span>
                      <span>رد دیدگاه</span>
                    </button>
                  )}

                  <button
                    type="button"
                    className={styles.btnOfficialReply}
                    onClick={() => setReplyModalCommentId(cmt.id)}
                  >
                    <span>✍️</span>
                    <span>{cmt.officialReply ? "ویرایش پاسخ رسمی" : "ارسال پاسخ رسمی مدیریت"}</span>
                  </button>

                  <button
                    type="button"
                    className={styles.btnPin}
                    onClick={() => handleTogglePin(cmt.id, cmt.isPinned)}
                  >
                    <span>📌</span>
                    <span>{cmt.isPinned ? "لغو پین" : "پین به عنوان پاسخ مرجع"}</span>
                  </button>

                  <button
                    type="button"
                    className={styles.btnLock}
                    onClick={() => handleToggleLock(cmt.id, cmt.isLocked)}
                  >
                    <span>{cmt.isLocked ? "🔓" : "🔒"}</span>
                    <span>{cmt.isLocked ? "باز کردن تاپیک" : "قفل تاپیک"}</span>
                  </button>

                  <button
                    type="button"
                    style={{
                      background: "rgba(239, 68, 68, 0.1)",
                      color: "#f87171",
                      border: "1px solid rgba(239, 68, 68, 0.25)",
                      padding: "0.45rem 0.8rem",
                      borderRadius: "8px",
                      fontSize: "0.775rem",
                      fontWeight: "700",
                      cursor: "pointer",
                      marginRight: "auto",
                    }}
                    onClick={() => setSanctionModalUser({ id: cmt.authorId, name: cmt.authorName })}
                  >
                    <span>🛑</span>
                    <span>اقدام انضباطی (شدوبن / اخطار)</span>
                  </button>
                </div>
              </div>
            ))}

            {filteredComments.length === 0 && (
              <div className={styles.emptyState}>
                <span>دیدگاهی مطابق با فیلتر انتخابی یافت نشد.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DESK 2: OFFICIAL REPLIES & PINNED THREADS */}
      {activeTab === "replies" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span>📌</span>
              <span>پاسخ‌های رسمی ثبت‌شده توسط تیم آموزش و تاپیک‌های مرجع</span>
            </h2>
            <span style={{ fontSize: "0.825rem", color: "#9ca3af" }}>
              پاسخ‌های تاییدشده که به عنوان مرجع علمی برای سایر زبان‌آموزان پین شده‌اند
            </span>
          </div>

          <div className={styles.commentsList}>
            {comments
              .filter((c) => c.officialReply || c.isPinned)
              .map((cmt) => (
                <div key={cmt.id} className={styles.commentCard}>
                  <div className={styles.commentHeader}>
                    <div className={styles.authorBox}>
                      <span className={styles.authorName}>{cmt.authorName}</span>
                      <span className={styles.courseBadge}>{cmt.courseTitle}</span>
                      {cmt.isPinned && (
                        <span style={{ color: "#facc15", fontSize: "0.8rem", fontWeight: "700" }}>
                          📌 پین‌شده در صدر جلسه
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: "0.775rem", color: "#94a3b8" }}>
                      {new Date(cmt.createdAt).toLocaleDateString("fa-IR")}
                    </span>
                  </div>

                  <p className={styles.commentBody}>{cmt.content}</p>

                  {cmt.officialReply ? (
                    <div className={styles.replyBox}>
                      <div className={styles.replyHeader}>
                        <div className={styles.replyAuthor}>
                          <span>{cmt.officialReply.staffName}</span>
                          <span className={styles.verifiedPill}>پاسخ رسمی مدیریت</span>
                          <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                            ({cmt.officialReply.staffRole})
                          </span>
                        </div>
                        <span style={{ fontSize: "0.725rem", color: "#64748b" }}>
                          {new Date(cmt.officialReply.repliedAt).toLocaleDateString("fa-IR")}
                        </span>
                      </div>
                      <p className={styles.replyContent}>{cmt.officialReply.content}</p>
                    </div>
                  ) : (
                    <div style={{ fontSize: "0.8rem", color: "#facc15" }}>
                      ⚠️ این دیدگاه پین شده است اما هنوز پاسخ رسمی مکتوب برای آن درج نشده است.
                    </div>
                  )}

                  <div className={styles.actionRow}>
                    <button
                      type="button"
                      className={styles.btnOfficialReply}
                      onClick={() => setReplyModalCommentId(cmt.id)}
                    >
                      ویرایش متن پاسخ رسمی
                    </button>
                    <button
                      type="button"
                      className={styles.btnPin}
                      onClick={() => handleTogglePin(cmt.id, cmt.isPinned)}
                    >
                      {cmt.isPinned ? "برداشتن از وضعیت پین" : "پین کردن"}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* DESK 3: SPAM SHIELD & SHADOWBAN STUDIO */}
      {activeTab === "shield" && (
        <div className={styles.spamShieldLayout}>
          {/* Add New Keyword Form Card */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span>🛡️</span>
                <span>تعریف فیلتر جدید برای شیلد کلمات ممنوعه (Banned Keyword Rules)</span>
              </h2>
            </div>

            <div className={styles.ruleFormRow}>
              <div>
                <label style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>کلمه یا الگوی Regex:</label>
                <input
                  type="text"
                  placeholder="مثال: شرط‌بندی یا (t\.me/)"
                  value={newPattern}
                  onChange={(e) => setNewPattern(e.target.value)}
                  className={styles.searchInput}
                  style={{ width: "100%", marginTop: "0.25rem" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>نوع تطابق:</label>
                <select
                  value={newMatchType}
                  onChange={(e) => setNewMatchType(e.target.value as typeof newMatchType)}
                  className={styles.searchInput}
                  style={{ width: "100%", marginTop: "0.25rem" }}
                >
                  <option value="contains">شامل کلمه (Contains)</option>
                  <option value="exact">تطابق دقیق (Exact)</option>
                  <option value="regex">عبارت باقاعده (Regex Pattern)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>اقدام سیستمی:</label>
                <select
                  value={newWordAction}
                  onChange={(e) => setNewWordAction(e.target.value as typeof newWordAction)}
                  className={styles.searchInput}
                  style={{ width: "100%", marginTop: "0.25rem" }}
                >
                  <option value="quarantine">قرنطینه و ارسال به صف ادمین</option>
                  <option value="reject">رد خودکار و مسدودسازی انتشار</option>
                  <option value="mask">ماسک‌گذاری خودکار کلمه (*)</option>
                </select>
              </div>

              <button type="button" className={styles.btnAddRule} onClick={handleAddKeywordRule}>
                + افزودن قانون به شیلد
              </button>
            </div>
          </div>

          {/* Banned Keywords Table Card */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>فهرست قوانین فعال فیلتر کلمات هرزنامه</h2>
              <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                نظرات شامل این الگوها مشمول اقدام متناظر می‌شوند
              </span>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>الگوی فیلتر</th>
                    <th>نوع تطابق</th>
                    <th>شدت حساسیت</th>
                    <th>اقدام خودکار</th>
                    <th>تعداد موارد کشف‌شده</th>
                    <th>تاریخ ثبت</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {bannedKeywords.map((kw) => (
                    <tr key={kw.id}>
                      <td style={{ fontWeight: "700", direction: "ltr", textAlign: "right" }}>
                        <code>{kw.pattern}</code>
                      </td>
                      <td>
                        {kw.matchType === "regex" ? (
                          <span className={styles.badgeRegex}>Regex</span>
                        ) : kw.matchType === "exact" ? (
                          <span className={styles.badgeExact}>دقیق</span>
                        ) : (
                          <span className={styles.badgeContains}>شامل کلمه</span>
                        )}
                      </td>
                      <td>
                        <span style={{ color: kw.severity === "high" ? "#f87171" : "#fbbf24" }}>
                          {kw.severity === "high" ? "بسیار بالا" : "متوسط"}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: "600" }}>
                          {kw.action === "quarantine"
                            ? "قرنطینه فوری"
                            : kw.action === "reject"
                            ? "رد مستقیم"
                            : "ماسک‌گذاری (*)"}
                        </span>
                      </td>
                      <td>{kw.hitCount} بار</td>
                      <td>{new Date(kw.addedAt).toLocaleDateString("fa-IR")}</td>
                      <td>
                        <button
                          type="button"
                          className={styles.btnActionDelete}
                          onClick={() => handleDeleteKeywordRule(kw.id)}
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sanctioned & Shadowbanned Users Card */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <span>👻</span>
                <span>کاربران متخلف و محدودیت‌های انضباطی (Shadowban & Sanctions)</span>
              </h2>
              <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                کاربران تحت شدوبن پیام خود را می‌بینند اما برای سایرین کاملاً مخفی است
              </span>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>کاربر</th>
                    <th>ایمیل</th>
                    <th>نوع محدودیت</th>
                    <th>دلیل انضباطی</th>
                    <th>ثبت‌کننده</th>
                    <th>تاریخ اعمال</th>
                    <th>وضعیت</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {sanctionedUsers.map((s) => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: "700" }}>{s.userName}</td>
                      <td>{s.userEmail}</td>
                      <td>
                        {s.sanctionType === "shadowban" ? (
                          <span className={styles.shadowbanBadge}>شدوبن نامحسوس</span>
                        ) : s.sanctionType === "mute_7_days" ? (
                          <span className={styles.muteBadge}>سکوت ۷ روزه</span>
                        ) : s.sanctionType === "permanent_ban" ? (
                          <span className={styles.banBadge}>اخراج دائم</span>
                        ) : (
                          <span>اخطار</span>
                        )}
                      </td>
                      <td style={{ fontSize: "0.8rem", maxWidth: "260px" }}>{s.reason}</td>
                      <td>{s.appliedBy}</td>
                      <td>{new Date(s.appliedAt).toLocaleDateString("fa-IR")}</td>
                      <td>
                        <span style={{ color: s.isActive ? "#ef4444" : "#10b981", fontWeight: "700" }}>
                          {s.isActive ? "فعال" : "لغوشده"}
                        </span>
                      </td>
                      <td>
                        {s.isActive && (
                          <button
                            type="button"
                            className={styles.btnActionLift}
                            onClick={() => handleLiftSanction(s.id)}
                          >
                            رفع محدودیت
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
