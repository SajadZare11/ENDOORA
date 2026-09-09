"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import styles from "./bookings.module.css";
import {
  SessionBooking,
  fetchUserBookings,
  requestBookingReschedule,
  respondBookingReschedule,
  cancelBooking,
  startSession,
  formatTehranDateTime,
  formatTehranTimeOnly,
  formatUserLocalTime,
  isSameTimezoneAsTehran,
} from "../../lib/marketplace";

export default function BookingsWorkspacePage() {
  const [bookings, setBookings] = useState<SessionBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "in_progress" | "completed" | "cancelled">("all");
  const [roleFilter, setRoleFilter] = useState<"all" | "learner" | "teacher">("all");

  // Modal states
  const [rescheduleModalId, setRescheduleModalId] = useState<string | null>(null);
  const [newStartTime, setNewStartTime] = useState("");
  const [rescheduleNote, setRescheduleNote] = useState("");
  const [cancelModalId, setCancelModalId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isLocalTehran = isSameTimezoneAsTehran();

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchUserBookings();
      setBookings(res.bookings || []);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e?.message || "خطا در دریافت لیست جلسات و رزروها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const res = await fetchUserBookings();
        if (!cancelled) {
          setBookings(res.bookings || []);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const e = err as { message?: string };
          setError(e?.message || "خطا در دریافت لیست جلسات و رزروها");
          setLoading(false);
        }
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleOpenReschedule = (booking: SessionBooking) => {
    setActionError(null);
    setRescheduleModalId(booking.id);
    // Suggest current start or +1 day
    try {
      const current = new Date(booking.scheduled_start);
      current.setDate(current.getDate() + 1);
      setNewStartTime(current.toISOString().slice(0, 16));
    } catch {
      setNewStartTime("");
    }
    setRescheduleNote("");
  };

  const handleSubmitReschedule = () => {
    if (!rescheduleModalId || !newStartTime) {
      setActionError("لطفاً زمان جدید پیشنهادی را مشخص کنید.");
      return;
    }
    startTransition(async () => {
      try {
        setActionError(null);
        // Ensure ISO UTC format
        const iso = new Date(newStartTime).toISOString();
        await requestBookingReschedule(rescheduleModalId, iso, rescheduleNote);
        setRescheduleModalId(null);
        await loadBookings();
      } catch (err: unknown) {
        const e = err as { message?: string };
        setActionError(e?.message || "امکان ثبت درخواست تغییر زمان وجود ندارد.");
      }
    });
  };

  const handleRespondReschedule = (bookingId: string, action: "accept" | "decline") => {
    startTransition(async () => {
      try {
        await respondBookingReschedule(bookingId, action);
        await loadBookings();
      } catch (err: unknown) {
        const e = err as { message?: string };
        alert(e?.message || "خطا در پاسخ به تغییر زمان جلسه.");
      }
    });
  };

  const handleOpenCancel = (booking: SessionBooking) => {
    setActionError(null);
    setCancelModalId(booking.id);
    setCancelReason("");
  };

  const handleSubmitCancel = () => {
    if (!cancelModalId || !cancelReason.trim()) {
      setActionError("لطفاً دلیل لغو جلسه را وارد نمایید.");
      return;
    }
    startTransition(async () => {
      try {
        setActionError(null);
        await cancelBooking(cancelModalId, cancelReason.trim());
        setCancelModalId(null);
        await loadBookings();
      } catch (err: unknown) {
        const e = err as { message?: string };
        setActionError(e?.message || "امکان لغو جلسه وجود ندارد.");
      }
    });
  };

  const handleStartSession = (bookingId: string) => {
    startTransition(async () => {
      try {
        const updated = await startSession(bookingId);
        if (updated.meeting_room_url) {
          window.open(updated.meeting_room_url, "_blank");
        }
        await loadBookings();
      } catch (err: unknown) {
        const e = err as { message?: string };
        alert(e?.message || "امکان شروع جلسه در این بازه زمانی وجود ندارد.");
      }
    });
  };

  // Tab filtering
  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "upcoming") {
      return b.status === "confirmed" || b.status === "reschedule_requested";
    }
    if (activeTab === "in_progress") {
      return b.status === "in_progress";
    }
    if (activeTab === "completed") {
      return b.status === "completed";
    }
    if (activeTab === "cancelled") {
      return (
        b.status === "cancelled_by_learner" ||
        b.status === "cancelled_by_teacher" ||
        b.status === "no_show"
      );
    }
    return true;
  });

  const getStatusBadge = (status: string, display: string) => {
    switch (status) {
      case "confirmed":
        return <span className={`${styles.badge} ${styles.badgeConfirmed}`}>● {display}</span>;
      case "reschedule_requested":
        return <span className={`${styles.badge} ${styles.badgeReschedule}`}>◷ {display}</span>;
      case "in_progress":
        return <span className={`${styles.badge} ${styles.badgeInProgress}`}>▶ {display}</span>;
      case "completed":
        return <span className={`${styles.badge} ${styles.badgeCompleted}`}>✓ {display}</span>;
      default:
        return <span className={`${styles.badge} ${styles.badgeCancelled}`}>✕ {display}</span>;
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <div>
            <h1 className={styles.title}>مدیریت جلسات و زمان‌بندی (MKT-004)</h1>
            <p className={styles.subtitle}>
              تقویم جلسات تعاملی، اتاق گفتگوی زنده، مذاکره تغییر زمان و مدیریت منطقه‌های زمانی
            </p>
          </div>
          <div className={styles.headerActions}>
            <Link href="/learn/now" className={styles.btnPrimary}>
              + رزرو جلسه جدید (Learn Now)
            </Link>
          </div>
        </div>

        <div className={styles.tzBanner}>
          <div className={styles.tzTag}>
            <span>🕒 مبنای زمان سامانه:</span>
            <strong>تهران (Asia/Tehran - IRST/UTC+03:30)</strong>
          </div>
          {!isLocalTehran && (
            <div className={styles.tzNotice}>
              ساعت محلی دستگاه شما با تهران متفاوت است؛ معادل ساعت محلی شما در کنار تاریخ نمایش داده می‌شود.
            </div>
          )}
        </div>
      </header>

      <div className={styles.controlsBar}>
        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "all" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("all")}
          >
            همه ({bookings.length})
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "upcoming" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            پیش‌رو (
            {bookings.filter((b) => b.status === "confirmed" || b.status === "reschedule_requested").length}
            )
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "in_progress" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("in_progress")}
          >
            در حال برگزاری ({bookings.filter((b) => b.status === "in_progress").length})
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "completed" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            تکمیل‌شده ({bookings.filter((b) => b.status === "completed").length})
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "cancelled" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("cancelled")}
          >
            لغوشده (
            {
              bookings.filter(
                (b) =>
                  b.status === "cancelled_by_learner" ||
                  b.status === "cancelled_by_teacher" ||
                  b.status === "no_show"
              ).length
            }
            )
          </button>
        </div>

        <div className={styles.roleFilter}>
          <span>فیلتر نقش:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as "all" | "learner" | "teacher")}
            className={styles.roleSelect}
          >
            <option value="all">همه جلسات من</option>
            <option value="learner">به عنوان زبان‌آموز</option>
            <option value="teacher">به عنوان استاد</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>در حال دریافت لیست جلسات و هماهنگی‌ها...</p>
        </div>
      )}

      {error && (
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>خطا در بارگذاری</h2>
          <p className={styles.emptyText}>{error}</p>
          <button type="button" onClick={loadBookings} className={styles.btnSecondary}>
            تلاش مجدد
          </button>
        </div>
      )}

      {!loading && !error && filteredBookings.length === 0 && (
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>جلسه‌ای در این بخش یافت نشد</h2>
          <p className={styles.emptyText}>
            شما می‌توانید از طریق سیستم درخواست آنی یادگیری، استاد مورد نظر خود را انتخاب و زمان جلسه را رزرو کنید.
          </p>
          <Link href="/learn/now" className={styles.btnPrimary}>
            ثبت درخواست یادگیری آنی
          </Link>
        </div>
      )}

      <div className={styles.bookingList}>
        {filteredBookings.map((booking) => {
          const tehranStart = formatTehranDateTime(booking.scheduled_start);
          const tehranEndTime = formatTehranTimeOnly(booking.scheduled_end);
          const localStartTime = !isLocalTehran ? formatUserLocalTime(booking.scheduled_start) : "";

          return (
            <article key={booking.id} className={styles.bookingCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitleSection}>
                  {getStatusBadge(booking.status, booking.status_display)}
                  <div className={styles.partnerInfo}>
                    <span>استاد: {booking.teacher_name}</span>
                    <span className={styles.partnerRole}>| زبان‌آموز: {booking.learner_name}</span>
                  </div>
                </div>
                <span className={styles.infoLabel}>شناسه: #{booking.id.slice(0, 8)}</span>
              </div>

              {booking.status === "reschedule_requested" && (
                <div className={styles.rescheduleNotice}>
                  <div>
                    <strong>درخواست تغییر زمان به ثبت رسیده است:</strong>
                    <div>
                      زمان جدید پیشنهادی: {formatTehranDateTime(booking.reschedule_proposed_start || "")}
                    </div>
                    {booking.reschedule_note && <div>یادداشت: {booking.reschedule_note}</div>}
                  </div>
                  {booking.can_respond_reschedule && (
                    <div className={styles.rescheduleActions}>
                      <button
                        type="button"
                        onClick={() => handleRespondReschedule(booking.id, "accept")}
                        disabled={isPending}
                        className={styles.btnSuccess}
                      >
                        ✓ پذیرش زمان جدید
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRespondReschedule(booking.id, "decline")}
                        disabled={isPending}
                        className={styles.btnDanger}
                      >
                        ✕ رد پیشنهاد و حفظ زمان قبلی
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className={styles.cardBody}>
                <div className={styles.infoBlock}>
                  <span className={styles.infoLabel}>مهارت و مبحث</span>
                  <span className={styles.infoValue}>
                    {booking.skill_display} {booking.target_subskill ? `(${booking.target_subskill})` : ""}
                  </span>
                </div>

                <div className={styles.infoBlock}>
                  <span className={styles.infoLabel}>زمان برگزاری (به وقت تهران)</span>
                  <span className={styles.infoValue}>
                    {tehranStart} تا {tehranEndTime}
                    {localStartTime && (
                      <span className={styles.tzNotice}> (ساعت محلی شما: {localStartTime})</span>
                    )}
                  </span>
                </div>

                <div className={styles.infoBlock}>
                  <span className={styles.infoLabel}>مدت و بستر جلسه</span>
                  <span className={styles.infoValue}>
                    {booking.duration_minutes} دقیقه • {booking.format_display}
                  </span>
                </div>

                <div className={styles.infoBlock}>
                  <span className={styles.infoLabel}>هزینه جلسه</span>
                  <div className={styles.priceTag}>
                    <span>{booking.rate_toman.toLocaleString("fa-IR")}</span>
                    <span className={styles.currency}>تومان</span>
                  </div>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.actionButtons}>
                  <Link href={`/bookings/${booking.id}`} className={styles.btnSecondary}>
                    مشاهده جزئیات و صفحه جلسه
                  </Link>

                  {booking.can_start && (
                    <button
                      type="button"
                      onClick={() => handleStartSession(booking.id)}
                      disabled={isPending}
                      className={styles.btnPrimary}
                    >
                      ورود به کلاس آنلاین
                    </button>
                  )}

                  {booking.status === "in_progress" && booking.meeting_room_url && (
                    <a
                      href={booking.meeting_room_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.btnPrimary}
                    >
                      ورود به اتاق زنده
                    </a>
                  )}

                  {booking.can_reschedule && (
                    <button
                      type="button"
                      onClick={() => handleOpenReschedule(booking)}
                      disabled={isPending}
                      className={styles.btnSecondary}
                    >
                      درخواست تغییر زمان
                    </button>
                  )}

                  {booking.can_cancel && (
                    <button
                      type="button"
                      onClick={() => handleOpenCancel(booking)}
                      disabled={isPending}
                      className={styles.btnDangerOutline}
                    >
                      لغو جلسه
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Reschedule Modal */}
      {rescheduleModalId && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h2 className={styles.modalTitle}>درخواست تغییر زمان جلسه</h2>
            <p className={styles.modalDesc}>
              زمان جدید پیشنهادی خود را انتخاب کنید. پس از ارسال، طرف مقابل می‌تواند زمان جدید را تایید یا رد کند.
            </p>

            {actionError && <div className={styles.alertError}>{actionError}</div>}

            <div className={styles.formGroup}>
              <label htmlFor="reschedule-time-input" className={styles.inputLabel}>تاریخ و زمان جدید پیشنهادی:</label>
              <input
                id="reschedule-time-input"
                type="datetime-local"
                value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)}
                className={styles.inputField}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="reschedule-note-input" className={styles.inputLabel}>علت یا یادداشت تغییر زمان (اختیاری):</label>
              <textarea
                id="reschedule-note-input"
                value={rescheduleNote}
                onChange={(e) => setRescheduleNote(e.target.value)}
                placeholder="توضیح کوتاه برای هماهنگی بهتر..."
                className={styles.textareaField}
              />
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() => setRescheduleModalId(null)}
                className={styles.btnSecondary}
                disabled={isPending}
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleSubmitReschedule}
                className={styles.btnPrimary}
                disabled={isPending}
              >
                {isPending ? "در حال ثبت..." : "ارسال درخواست جابجایی"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModalId && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h2 className={styles.modalTitle}>لغو رزرو جلسه</h2>
            <p className={styles.modalDesc}>
              با لغو جلسه، زمان رزرو شده برای طرف مقابل آزاد خواهد شد. لطفاً علت لغو را به صورت شفاف بنویسید.
            </p>

            {actionError && <div className={styles.alertError}>{actionError}</div>}

            <div className={styles.formGroup}>
              <label htmlFor="cancel-reason-input" className={styles.inputLabel}>دلیل لغو جلسه (الزامی):</label>
              <textarea
                id="cancel-reason-input"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="علت لغو هماهنگی را بنویسید..."
                className={styles.textareaField}
              />
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() => setCancelModalId(null)}
                className={styles.btnSecondary}
                disabled={isPending}
              >
                بازگشت
              </button>
              <button
                type="button"
                onClick={handleSubmitCancel}
                className={styles.btnDanger}
                disabled={isPending}
              >
                {isPending ? "در حال لغو..." : "تایید و لغو قطعی"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
