"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./classes.module.css";
import {
  LiveClassCohort,
  EnrolledClassRecord,
  getUserPlacementLevel,
  verifyPlacementRequirement,
  enrollInCohort,
} from "../../lib/classes-storage";

interface EnrollmentModalProps {
  cohort: LiveClassCohort | null;
  onClose: () => void;
  onSuccess: (record: EnrolledClassRecord) => void;
}

export function EnrollmentModal({ cohort, onClose, onSuccess }: EnrollmentModalProps) {
  const [mounted, setMounted] = useState(false);
  const [userLevel, setUserLevel] = useState<string | null>(null);
  const [studentNotes, setStudentNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successRecord, setSuccessRecord] = useState<EnrolledClassRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const level = getUserPlacementLevel();
    setUserLevel(level);
  }, []);

  if (!cohort) return null;

  const placementCheck = mounted
    ? verifyPlacementRequirement(cohort.levelRequired, userLevel)
    : { allowed: true, requiredLevel: cohort.levelRequired };

  const handleConfirmEnrollment = () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const result = enrollInCohort(cohort.id, studentNotes);
    setIsSubmitting(false);

    if (result.success && result.record) {
      setSuccessRecord(result.record);
      onSuccess(result.record);
    } else {
      setErrorMessage(result.error || "خطایی در ثبت‌نام رخ داد.");
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>
            {successRecord ? "کارت ورود به کلاس" : `رزرو و ثبت‌نام در ${cohort.titleFa}`}
          </h3>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="بستن پنجره"
          >
            &times;
          </button>
        </div>

        {/* State 1: Success / Digital Admission Pass */}
        {successRecord ? (
          <div className={styles.successCard}>
            <div className={styles.successIcon}>🎉</div>
            <h4 className={styles.successTitle}>تبریک! صندلی شما با موفقیت رزرو شد</h4>
            <p style={{ color: "#64748b", fontSize: "0.9rem", margin: "0.5rem 0 1.25rem 0" }}>
              اطلاعات کلاس و لینک اختصاصی استودیوی تعاملی ایندورا برای شما ثبت گردید.
            </p>

            <div className={styles.digitalPassCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontWeight: 800, fontSize: "1rem", color: "#065f46" }}>کارت ورود دیجیتال</span>
                <span style={{ background: "#d1fae5", color: "#065f46", padding: "0.2rem 0.6rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700 }}>
                  تایید شده ✓
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span>کلاس:</span>
                <strong>{successRecord.cohortTitleFa}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>استاد:</span>
                <strong>{successRecord.teacherNameFa}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>زمان برگزاری:</span>
                <span>{successRecord.scheduleDays.join(" و ")} ساعت {successRecord.scheduleTime}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>جلسه نخست:</span>
                <span style={{ color: "#059669", fontWeight: 800 }}>{successRecord.nextSessionTextFa}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>کد رهگیری رزرو:</span>
                <span style={{ fontFamily: "monospace", direction: "ltr" }}>{successRecord.bookingId}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginTop: "1.5rem" }}>
              <Link
                href={`/bookings/${successRecord.bookingId}/room`}
                className={styles.enterStudioBtn}
              >
                🎥 ورود به استودیوی کلاس تعاملی
              </Link>
              <button
                type="button"
                onClick={onClose}
                className={styles.formatBtn}
                style={{ padding: "0.75rem 1.25rem", border: "1px solid #cbd5e1" }}
              >
                متوجه شدم، بازگشت به لیست
              </button>
            </div>
          </div>
        ) : !placementCheck.allowed ? (
          /* State 2: Mandatory Placement Gate Blocking */
          <div className={styles.placementWarningCard}>
            <div className={styles.placementWarningTitle}>
              <span>⚠️</span>
              <span>
                {placementCheck.reason === "unplaced"
                  ? "نیازمند تعیین سطح هوشمند قبل از ثبت‌نام"
                  : "عدم تطابق سطح پیش‌نیاز کلاس"}
              </span>
            </div>
            <p className={styles.placementWarningText}>
              {placementCheck.reason === "unplaced" ? (
                <>
                  این کلاس با استاندارد کیفی بالا و منحصراً برای زبان‌آموزان با سطح{" "}
                  <strong>{cohort.levelBadgeFa}</strong> طراحی شده است. برای حفظ کیفیت تعاملی کلاس و
                  هم‌سطح بودن با همکلاسی‌ها، لطفاً ابتدا آزمون ۶ دقیقه‌ای تعیین سطح هوشمند را تکمیل
                  کنید.
                </>
              ) : (
                <>
                  سطح ثبت‌شده شما در سامانه{" "}
                  <strong>({placementCheck.currentLevel})</strong> است؛ در حالی که پیش‌نیاز این دوره{" "}
                  <strong>{cohort.levelBadgeFa}</strong> می‌باشد. برای دریافت حداکثر نتیجه، ثبت‌نام در
                  دوره‌های هم‌سطح توصیه می‌شود.
                </>
              )}
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
              <Link href="/placement" className={styles.takePlacementBtn}>
                🎯 شرکت در آزمون تعیین سطح آنلاین (رایگان) &larr;
              </Link>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  color: "#64748b",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  textDecoration: "underline",
                }}
              >
                انصراف و انتخاب کلاس دیگر
              </button>
            </div>
          </div>
        ) : (
          /* State 3: Normal Enrollment Flow */
          <div>
            <div className={styles.bookingSummaryCard}>
              <div className={styles.summaryRow}>
                <span>مدرس:</span>
                <strong>
                  {cohort.teacher.nameFa} ({cohort.teacher.titleFa})
                </strong>
              </div>
              <div className={styles.summaryRow}>
                <span>فرمت برگزاری:</span>
                <span>{cohort.formatLabelFa}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>زمان‌بندی جلسات:</span>
                <span>
                  {cohort.scheduleDays.join(" و ")} ساعت {cohort.scheduleTime}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span>تعداد کل جلسات:</span>
                <span>{cohort.totalSessions} جلسه ({cohort.sessionDurationMinutes} دقیقه‌ای)</span>
              </div>
              <div className={styles.summaryRow}>
                <span>تاریخ شروع:</span>
                <span>{cohort.startDateFa}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>شهریه دوره:</span>
                <strong style={{ color: "#2563eb", fontSize: "1rem" }}>
                  {cohort.priceToman.toLocaleString("fa-IR")} تومان
                </strong>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="studentNotes" className={styles.formLabel}>
                یادداشت یا هدف اختصاصی برای استاد (اختیاری):
              </label>
              <textarea
                id="studentNotes"
                className={styles.formTextarea}
                rows={3}
                placeholder="مثال: من قصد شرکت در آزمون آیلتس دو ماه آینده را دارم و تمرکزم بر روی پارت ۲ اسپیکینگ و تسلط تلفظ است..."
                value={studentNotes}
                onChange={(e) => setStudentNotes(e.target.value)}
              />
            </div>

            {errorMessage && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  color: "#dc2626",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  marginBottom: "1rem",
                }}
              >
                {errorMessage}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={onClose}
                className={styles.formatBtn}
                style={{ padding: "0.75rem 1.25rem", border: "1px solid #cbd5e1" }}
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleConfirmEnrollment}
                disabled={isSubmitting}
                className={styles.enrollBtn}
              >
                {isSubmitting ? "در حال ثبت‌نام..." : "تأیید نهایی و رزرو صندلی"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
