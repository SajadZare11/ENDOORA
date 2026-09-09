"use client";

import React, { useEffect, useState, useTransition, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "./booking-detail.module.css";
import {
  SessionBooking,
  TeacherReview,
  BookingDispute,
  DisputeReasonCategory,
  fetchBookingDetail,
  fetchBookingDispute,
  openBookingDispute,
  cancelBooking,
  startSession,
  completeSession,
  fetchBookingReview,
  submitBookingReview,
  replyToTeacherReview,
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

  // Review state
  const [review, setReview] = useState<TeacherReview | null>(null);
  const [canReview, setCanReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [teachingQuality, setTeachingQuality] = useState(5);
  const [punctuality, setPunctuality] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);

  // Teacher reply state
  const [teacherReplyText, setTeacherReplyText] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);

  // Dispute state (Day 41)
  const [dispute, setDispute] = useState<BookingDispute | null>(null);
  const [hasDispute, setHasDispute] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState<DisputeReasonCategory>("technical_difficulties");
  const [disputeDescription, setDisputeDescription] = useState("");
  const [disputeEvidence, setDisputeEvidence] = useState("");
  const [disputeSubmitting, setDisputeSubmitting] = useState(false);
  const [disputeError, setDisputeError] = useState<string | null>(null);

  const isLocalTehran = isSameTimezoneAsTehran();

  const loadDispute = useCallback(async (bId: string) => {
    try {
      const data = await fetchBookingDispute(bId);
      setHasDispute(data.has_dispute);
      setDispute(data.dispute);
    } catch {
      // ignore dispute fetch error
    }
  }, []);

  const loadReview = useCallback(async (bId: string) => {
    try {
      const data = await fetchBookingReview(bId);
      setReview(data.review);
      setCanReview(data.can_review);
    } catch {
      // ignore review fetch failure if not completed or unauthorized
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      if (!bookingId) return;
      try {
        const data = await fetchBookingDetail(bookingId);
        if (!cancelled) {
          setBooking(data);
          setLoading(false);
          loadDispute(data.id);
          if (data.status === "completed") {
            loadReview(data.id);
          }
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
  }, [bookingId, loadReview, loadDispute]);

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
        loadReview(updated.id);
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

  const handleOpenDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    if (disputeDescription.trim().length < 10) {
      setDisputeError("لطفاً حداقل ۱۰ کاراکتر شرح اختلاف یا نقص جلسه را بنویسید.");
      return;
    }

    setDisputeSubmitting(true);
    setDisputeError(null);
    try {
      const res = await openBookingDispute(booking.id, {
        reason_category: disputeReason,
        description: disputeDescription.trim(),
        evidence_notes: disputeEvidence.trim(),
      });
      setDispute(res.dispute);
      setHasDispute(true);
      setShowDisputeModal(false);
      setBooking((prev) => (prev ? { ...prev, status: "disputed", status_display: "در حال داوری اختلاف" } : prev));
      alert("پرونده اختلاف با موفقیت ثبت شد و به تیم داوری پلتفرم ارجاع گردید.");
    } catch (err: unknown) {
      const e = err as { message?: string };
      setDisputeError(e?.message || "خطا در ثبت پرونده اختلاف.");
    } finally {
      setDisputeSubmitting(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    if (reviewComment.trim().length < 10) {
      setReviewMessage("لطفاً حداقل ۱۰ کاراکتر نظر یا بازخورد بنویسید.");
      return;
    }

    setReviewSubmitting(true);
    setReviewMessage(null);
    try {
      const createdReview = await submitBookingReview(booking.id, {
        overall_rating: reviewRating,
        teaching_quality: teachingQuality,
        punctuality: punctuality,
        communication: communication,
        comment: reviewComment.trim(),
      });
      setReview(createdReview);
      setCanReview(false);
      setReviewMessage("نظر شما با موفقیت ثبت شد و پس از بررسی به نمایش درمی‌آید.");
    } catch (err: unknown) {
      const e = err as { message?: string };
      setReviewMessage(e?.message || "خطا در ثبت نظر. لطفاً دوباره امتحان کنید.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleTeacherReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!review || !teacherReplyText.trim()) return;
    setReplySubmitting(true);
    try {
      const updatedReview = await replyToTeacherReview(review.id, teacherReplyText.trim());
      setReview(updatedReview);
      setTeacherReplyText("");
    } catch (err: unknown) {
      const e = err as { message?: string };
      alert(e?.message || "خطا در ارسال پاسخ به نظر.");
    } finally {
      setReplySubmitting(false);
    }
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
      case "disputed":
        return <span className={`${styles.badge} ${styles.badgeDisputed}`}>⚖️ {display}</span>;
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

      {hasDispute && dispute && (
        <div className={styles.disputeCard}>
          <div className={styles.disputeHeader}>
            <h2 className={styles.disputeTitle}>
              ⚖️ پرونده داوری و حل اختلاف جلسه #{dispute.id.slice(0, 8)}
            </h2>
            <span className={`${styles.badge} ${styles.badgeDisputed}`}>
              وضعیت داوری: {dispute.status_display}
            </span>
          </div>
          <p className={styles.disputeText}>
            <strong>دلیل اختلاف:</strong> {dispute.reason_display}
          </p>
          <p className={styles.disputeText}>
            <strong>شرح ثبت‌شده:</strong> {dispute.description}
          </p>
          {dispute.evidence_notes && (
            <p className={styles.disputeText}>
              <strong>مستندات و توضیحات ضمیمه:</strong> {dispute.evidence_notes}
            </p>
          )}
          {dispute.resolution_notes && (
            <div className={styles.disputeResolvedBox}>
              <p className={styles.disputeText}>
                <strong>رأی نهایی داور پلتفرم ({dispute.resolved_by_name || "تیم داوری اندورا"}):</strong>
              </p>
              <p className={styles.disputeText}>{dispute.resolution_notes}</p>
              {dispute.refund_percentage > 0 && (
                <p className={styles.disputeText}>
                  <strong>میزان استرداد وجه به زبان‌آموز:</strong> {dispute.refund_percentage}٪ مبلغ جلسه
                </p>
              )}
            </div>
          )}
        </div>
      )}

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
                آغاز جلسه زنده ⚡
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

      {/* Day 39 Review & Rating Section (Only for completed sessions) */}
      {booking.status === "completed" && (
        <section className={styles.reviewSection} aria-labelledby="session-review-heading">
          <h2 id="session-review-heading" className={styles.cardHeading}>
            ارزیابی و بازخورد جلسه آموزشی
          </h2>

          {/* Existing Review Display */}
          {review ? (
            <div className={styles.submittedReviewBox}>
              <div className={styles.reviewPillRow}>
                <span className={styles.reviewPill}>
                  ★ امتیاز کلی: {review.overall_rating} از ۵
                </span>
                <span className={styles.reviewPill}>
                  کیفیت تدریس: {review.teaching_quality}
                </span>
                <span className={styles.reviewPill}>
                  وقت‌شناسی: {review.punctuality}
                </span>
                <span className={styles.reviewPill}>
                  ارتباط و تعامل: {review.communication}
                </span>
                <span className={styles.reviewPill}>
                  وضعیت: {review.status === "published" ? "منتشر شده" : "در حال بررسی"}
                </span>
              </div>

              <p style={{ marginBlock: "var(--space-2)", fontSize: "var(--font-size-sm)", lineHeight: 1.6 }}>
                <strong>دیدگاه ثبت‌شده:</strong> {review.comment}
              </p>

              {review.teacher_reply && (
                <div className={styles.replyCard}>
                  <span className={styles.replyTitle}>پاسخ رسمی مدرس:</span>
                  <p style={{ marginBlock: 0, fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                    {review.teacher_reply}
                  </p>
                </div>
              )}

              {/* Teacher reply form if not yet replied */}
              {!review.teacher_reply && (
                <form onSubmit={handleTeacherReply} style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginBlockStart: "var(--space-3)" }}>
                  <label htmlFor="teacher-reply-input" style={{ fontSize: "var(--font-size-xs)", fontWeight: 600 }}>
                    پاسخ مدرس به این نظر:
                  </label>
                  <textarea
                    id="teacher-reply-input"
                    value={teacherReplyText}
                    onChange={(e) => setTeacherReplyText(e.target.value)}
                    placeholder="متن پاسخ رسمی خود به نظر زبان‌آموز را بنویسید..."
                    className={styles.textareaField}
                  />
                  <button
                    type="submit"
                    disabled={replySubmitting || !teacherReplyText.trim()}
                    className={styles.btnPrimary}
                    style={{ alignSelf: "flex-start" }}
                  >
                    {replySubmitting ? "در حال ارسال..." : "ثبت پاسخ رسمی مدرس"}
                  </button>
                </form>
              )}
            </div>
          ) : canReview ? (
            /* Review Submission Form */
            <form onSubmit={handleSubmitReview} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <p className={styles.modalDesc}>
                از تجربه برگزاری این جلسه با {booking.teacher_name} رضایت داشتید؟ دیدگاه و امتیاز شما به دیگر زبان‌آموزان برای انتخاب استاد کمک می‌کند.
              </p>

              {reviewMessage && (
                <div style={{ padding: "var(--space-3)", borderRadius: "var(--radius-md)", backgroundColor: "var(--color-surface-subtle)", fontSize: "var(--font-size-xs)" }}>
                  {reviewMessage}
                </div>
              )}

              {/* Overall Rating Star Picker */}
              <div>
                <span className={styles.dimensionLabel}>امتیاز کلی به جلسه:</span>
                <div className={styles.starPickerRow} style={{ marginBlockStart: "var(--space-1)" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`${styles.starBtn} ${star <= reviewRating ? styles.starBtnActive : ""}`}
                      onClick={() => setReviewRating(star)}
                      aria-label={`${star} ستاره`}
                    >
                      ★
                    </button>
                  ))}
                  <span style={{ fontSize: "var(--font-size-sm)", marginInlineStart: "var(--space-2)" }}>
                    {reviewRating} از ۵
                  </span>
                </div>
              </div>

              {/* 3 Dimensions */}
              <div className={styles.dimensionGrid}>
                <div className={styles.dimensionControl}>
                  <label htmlFor="teach-quality" className={styles.dimensionLabel}>
                    کیفیت و تسلط در تدریس:
                  </label>
                  <select
                    id="teach-quality"
                    className={styles.dimensionSelect}
                    value={teachingQuality}
                    onChange={(e) => setTeachingQuality(Number(e.target.value))}
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} ستاره</option>
                    ))}
                  </select>
                </div>

                <div className={styles.dimensionControl}>
                  <label htmlFor="punctuality-select" className={styles.dimensionLabel}>
                    وقت‌شناسی و انضباط:
                  </label>
                  <select
                    id="punctuality-select"
                    className={styles.dimensionSelect}
                    value={punctuality}
                    onChange={(e) => setPunctuality(Number(e.target.value))}
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} ستاره</option>
                    ))}
                  </select>
                </div>

                <div className={styles.dimensionControl}>
                  <label htmlFor="communication-select" className={styles.dimensionLabel}>
                    ارتباط و تعامل سازنده:
                  </label>
                  <select
                    id="communication-select"
                    className={styles.dimensionSelect}
                    value={communication}
                    onChange={(e) => setCommunication(Number(e.target.value))}
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} ستاره</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Comment Textarea */}
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
                <label htmlFor="review-comment-input" className={styles.dimensionLabel}>
                  نظر و توضیح شما (حداقل ۱۰ کاراکتر):
                </label>
                <textarea
                  id="review-comment-input"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="نقاط قوت استاد، نحوه بیان مباحث و میزان رضایت خود از جلسه را بنویسید..."
                  className={styles.textareaField}
                />
                <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-tertiary)" }}>
                  نام شما به شکل امن و مخفف (مانند سارا م.) برای حفظ حریم خصوصی نمایش داده می‌شود.
                </span>
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting || reviewComment.trim().length < 10}
                className={styles.btnPrimary}
                style={{ alignSelf: "flex-start" }}
              >
                {reviewSubmitting ? "در حال ثبت نظر..." : "ثبت و انتشار نظر 🚀"}
              </button>
            </form>
          ) : (
            <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)", marginBlock: 0 }}>
              ارزیابی جلسه توسط شرکت‌کنندگان انجام می‌شود.
            </p>
          )}
        </section>
      )}

      <div className={styles.actionsCard}>
        <Link href="/bookings" className={styles.btnSecondary}>
          بازگشت به لیست جلسات
        </Link>

        {(!hasDispute || !dispute) &&
          (booking.status === "confirmed" || booking.status === "in_progress" || booking.status === "completed") && (
            <button
              type="button"
              onClick={() => setShowDisputeModal(true)}
              className={styles.btnWarningOutline}
            >
              ثبت اختلاف و داوری ⚖️
            </button>
          )}

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

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h2 className={styles.modalTitle}>ثبت اختلاف و درخواست داوری جلسه</h2>
            <p className={styles.modalDesc}>
              چنانچه در برگزاری جلسه نقصی نظیر عدم حضور طرف مقابل، اختلال فنی غیرقابل رفع، یا عدم رعایت استانداردهای آموزشی رخ داده است،
              می‌توانید پرونده داوری تشکیل دهید تا توسط کارشناسان پشتیبانی اندورا بررسی و تصمیم‌گیری شود.
            </p>

            <form onSubmit={handleOpenDispute} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {disputeError && (
                <div style={{ color: "var(--color-danger)", fontSize: "var(--font-size-xs)" }}>
                  ✕ {disputeError}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
                <label htmlFor="dispute-reason-category-select" className={styles.modalDesc}>
                  علت اصلی اختلاف:
                </label>
                <select
                  id="dispute-reason-category-select"
                  className={styles.dimensionSelect}
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value as DisputeReasonCategory)}
                >
                  <option value="technical_difficulties">قطع ارتباط یا اختلال فنی شدید پلتفرم</option>
                  <option value="teacher_absent">عدم حضور یا تاخیر غیرمجاز مدرس</option>
                  <option value="learner_absent">عدم حضور یا ترک زودهنگام جلسه توسط زبان‌آموز</option>
                  <option value="poor_quality">کیفیت نامناسب آموزش یا عدم تطابق با سرفصل</option>
                  <option value="unprofessional_behavior">رفتار غیرحرفه‌ای یا نقض کدهای رفتاری</option>
                  <option value="payment_disagreement">مغایرت در تسویه یا زمان جلسه</option>
                  <option value="other">سایر موارد</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
                <label htmlFor="dispute-description-input" className={styles.modalDesc}>
                  شرح کامل رویداد و دلایل اعتراض (حداقل ۱۰ کاراکتر):
                </label>
                <textarea
                  id="dispute-description-input"
                  required
                  value={disputeDescription}
                  onChange={(e) => setDisputeDescription(e.target.value)}
                  placeholder="دقیقاً چه مشکلی رخ داد؟ در چه دقیقه‌ای از جلسه اتفاق افتاد؟"
                  className={styles.textareaField}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
                <label htmlFor="dispute-evidence-input" className={styles.modalDesc}>
                  مستندات و لینک‌های تکمیلی (اختیاری):
                </label>
                <input
                  id="dispute-evidence-input"
                  type="text"
                  value={disputeEvidence}
                  onChange={(e) => setDisputeEvidence(e.target.value)}
                  placeholder="لینک تست سرعت اینترنت، تصویر اسکرین‌شات و..."
                  className={styles.dimensionSelect}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setShowDisputeModal(false)}
                  className={styles.btnSecondary}
                  disabled={disputeSubmitting}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className={styles.btnPrimary}
                  disabled={disputeSubmitting || disputeDescription.trim().length < 10}
                >
                  {disputeSubmitting ? "در حال ثبت پرونده..." : "ارسال به تیم داوری ⚖️"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
