"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "./booking-detail.module.css";
import {
  SessionBooking,
  fetchBookingDetail,
  cancelBooking,
  startSession,
  completeSession,
  formatTehranDateTime,
  formatTehranTimeOnly,
  formatUserLocalTime,
  isSameTimezoneAsTehran,
} from "../../../lib/marketplace";

export default function BookingDetailPage() {
  const params = useParams();
  const bookingId = (params?.id as string) || "";

  const [booking, setBooking] = useState<SessionBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Complete modal
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [sessionNotes, setSessionNotes] = useState("");
  const [isPending, startTransition] = useTransition();

  const isLocalTehran = isSameTimezoneAsTehran();


  useEffect(() => {
    let cancelled = false;
    async function init() {
      if (!bookingId) return;
      try {
        const data = await fetchBookingDetail(bookingId);
        if (!cancelled) {
          setBooking(data);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const e = err as { message?: string };
          setError(e?.message || "خطا در دریافت مشخصات جلسه رزرو شده.");
          setLoading(false);
        }
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  const handleStart = () => {
    if (!booking) return;
    startTransition(async () => {
      try {
        const updated = await startSession(booking.id);
        setBooking(updated);
        if (updated.meeting_room_url) {
          window.open(updated.meeting_room_url, "_blank");
        }
      } catch (err: unknown) {
        const e = err as { message?: string };
        alert(e?.message || "خطا در آغاز جلسه.");
      }
    });
  };

  const handleComplete = () => {
    if (!booking) return;
    startTransition(async () => {
      try {
        const updated = await completeSession(booking.id, sessionNotes);
        setBooking(updated);
        setShowCompleteModal(false);
      } catch (err: unknown) {
        const e = err as { message?: string };
        alert(e?.message || "خطا در ثبت تکمیل جلسه.");
      }
    });
  };

  const handleCancel = () => {
    if (!booking) return;
    const reason = prompt("لطفاً دلیل لغو جلسه را وارد نمایید:");
    if (!reason || !reason.trim()) return;
    startTransition(async () => {
      try {
        const updated = await cancelBooking(booking.id, reason.trim());
        setBooking(updated);
      } catch (err: unknown) {
        const e = err as { message?: string };
        alert(e?.message || "امکان لغو جلسه وجود ندارد.");
      }
    });
  };

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

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.infoCard}>
          <p>در حال بارگذاری مشخصات جلسه #{bookingId.slice(0, 8)}...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className={styles.container}>
        <div className={styles.infoCard}>
          <h2>یافت نشد</h2>
          <p>{error || "جلسه‌ای با این شناسه یافت نشد."}</p>
          <Link href="/bookings" className={styles.btnSecondary}>
            بازگشت به تقویم جلسات
          </Link>
        </div>
      </div>
    );
  }

  const tehranStart = formatTehranDateTime(booking.scheduled_start);
  const tehranEndTime = formatTehranTimeOnly(booking.scheduled_end);
  const localStart = !isLocalTehran ? formatUserLocalTime(booking.scheduled_start) : "";

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumbs}>
        <Link href="/bookings" className={styles.breadcrumbLink}>
          جلسات و رزروها
        </Link>
        <span>/</span>
        <span>جلسه #{booking.id.slice(0, 8)}</span>
      </div>

      <div className={styles.headerCard}>
        <div className={styles.headerTop}>
          <div className={styles.titleArea}>
            <h1 className={styles.title}>
              جلسه {booking.skill_display} با {booking.teacher_name}
            </h1>
            <span className={styles.sessionCode}>کد رزرو یکتا: {booking.id}</span>
          </div>
          {getStatusBadge(booking.status, booking.status_display)}
        </div>
      </div>

      {(booking.status === "confirmed" || booking.status === "in_progress") && (
        <div className={styles.roomCard}>
          <h2 className={styles.roomTitle}>اتاق گفتگوی زنده اختصاصی</h2>
          <p className={styles.roomDesc}>
            لینک اتاق جلسه به صورت خودکار ایجاد شده است. در زمان آغاز جلسه می‌توانید با زدن دکمه زیر وارد اتاق شوید.
          </p>
          <div className={styles.roomActions}>
            {booking.can_start && (
              <button
                type="button"
                onClick={handleStart}
                disabled={isPending}
                className={styles.btnPrimary}
              >
                آغاز رسمی جلسه و ورود به کلاس
              </button>
            )}
            {booking.meeting_room_url && (
              <a
                href={booking.meeting_room_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnPrimary}
              >
                ورود به اتاق جلسه زنده ↗
              </a>
            )}
          </div>
        </div>
      )}

      <div className={styles.detailsGrid}>
        <div className={styles.infoCard}>
          <h2 className={styles.cardHeading}>اطلاعات زمان‌بندی و مکان</h2>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>زمان برگزاری (تهران):</span>
            <span className={styles.infoValue}>
              {tehranStart} تا {tehranEndTime}
            </span>
          </div>
          {localStart && (
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>ساعت محلی دستگاه شما:</span>
              <span className={styles.infoValue}>{localStart}</span>
            </div>
          )}
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>مدت جلسه:</span>
            <span className={styles.infoValue}>{booking.duration_minutes} دقیقه</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>فرمت برگزاری:</span>
            <span className={styles.infoValue}>{booking.format_display}</span>
          </div>
        </div>

        <div className={styles.infoCard}>
          <h2 className={styles.cardHeading}>طرفین و مالیات توافقی</h2>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>استاد:</span>
            <span className={styles.infoValue}>{booking.teacher_name}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>زبان‌آموز:</span>
            <span className={styles.infoValue}>{booking.learner_name}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>هزینه جلسه:</span>
            <span className={styles.infoValue}>
              {booking.rate_toman.toLocaleString("fa-IR")} تومان
            </span>
          </div>
        </div>
      </div>

      <div className={styles.timelineCard}>
        <h2 className={styles.cardHeading}>تاریخچه و تایم‌لاین وضعیت جلسه</h2>
        <div className={styles.timelineItem}>
          <div className={styles.timelineDot} />
          <div className={styles.timelineContent}>
            <span className={styles.timelineTitle}>جلسه رزرو و زمان‌بندی شد</span>
            <span className={styles.timelineTime}>{formatTehranDateTime(booking.created_at)}</span>
          </div>
        </div>

        {booking.reschedule_proposed_start && (
          <div className={styles.timelineItem}>
            <div className={styles.timelineDot} />
            <div className={styles.timelineContent}>
              <span className={styles.timelineTitle}>
                درخواست تغییر زمان به {formatTehranDateTime(booking.reschedule_proposed_start)}
              </span>
              {booking.reschedule_note && (
                <span className={styles.timelineTime}>توضیحات: {booking.reschedule_note}</span>
              )}
            </div>
          </div>
        )}

        {booking.status === "in_progress" && (
          <div className={styles.timelineItem}>
            <div className={styles.timelineDot} />
            <div className={styles.timelineContent}>
              <span className={styles.timelineTitle}>جلسه در حال برگزاری است</span>
            </div>
          </div>
        )}

        {booking.status === "completed" && (
          <div className={styles.timelineItem}>
            <div className={styles.timelineDot} />
            <div className={styles.timelineContent}>
              <span className={styles.timelineTitle}>جلسه با موفقیت تکمیل شد</span>
              {booking.teacher_notes && (
                <span className={styles.timelineTime}>یادداشت استاد: {booking.teacher_notes}</span>
              )}
            </div>
          </div>
        )}

        {(booking.status === "cancelled_by_learner" || booking.status === "cancelled_by_teacher") && (
          <div className={styles.timelineItem}>
            <div className={styles.timelineDot} />
            <div className={styles.timelineContent}>
              <span className={styles.timelineTitle}>{booking.status_display}</span>
              {booking.cancellation_reason && (
                <span className={styles.timelineTime}>دلیل لغو: {booking.cancellation_reason}</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className={styles.actionsCard}>
        <Link href="/bookings" className={styles.btnSecondary}>
          بازگشت به لیست جلسات
        </Link>

        {booking.can_complete && (
          <button
            type="button"
            onClick={() => setShowCompleteModal(true)}
            disabled={isPending}
            className={styles.btnPrimary}
          >
            تکمیل و پایان جلسه
          </button>
        )}

        {booking.can_cancel && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={isPending}
            className={styles.btnDangerOutline}
          >
            لغو جلسه
          </button>
        )}
      </div>

      {/* Complete Modal */}
      {showCompleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h2 className={styles.modalTitle}>ثبت اتمام جلسه آموزشی</h2>
            <p className={styles.modalDesc}>
              خسته نباشید! می‌توانید در صورت تمایل بازخورد کوتاه یا یادداشت خلاصه جلسه را برای بایگانی وارد کنید.
            </p>

            <label htmlFor="session-notes-input" className={styles.modalDesc}>یادداشت یا خلاصه مباحث تدریس شده:</label>
            <textarea
              id="session-notes-input"
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="نکات مطرح شده، تمرین‌های داده شده برای جلسه آینده و..."
              className={styles.textareaField}
            />

            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() => setShowCompleteModal(false)}
                className={styles.btnSecondary}
                disabled={isPending}
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleComplete}
                className={styles.btnPrimary}
                disabled={isPending}
              >
                {isPending ? "در حال ثبت..." : "تایید و اتمام جلسه"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
