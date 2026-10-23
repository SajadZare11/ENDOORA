'use client';

import React from "react";
import Link from "next/link";
import type { ClassroomSessionData } from "@endoora/contracts";
import { syncErrorToLeitner } from "@/lib/classroom-studio-storage";
import styles from "./classroom-studio.module.css";

interface StudioSessionSummaryModalProps {
  session: ClassroomSessionData;
  onClose: () => void;
  onUpdateSession: (updated: ClassroomSessionData) => void;
}

export function StudioSessionSummaryModal({
  session,
  onClose,
  onUpdateSession,
}: StudioSessionSummaryModalProps) {
  const totalErrors = session.loggedErrors.length;
  const syncedErrors = session.loggedErrors.filter((e) => e.syncedToLeitner).length;
  const totalVocab = session.vocabItems.length;

  const handleSyncAllErrors = () => {
    const updatedErrors = session.loggedErrors.map((err) => {
      syncErrorToLeitner(err, {
        bookingId: session.bookingId,
        teacherName: session.teacherName,
      });
      return { ...err, syncedToLeitner: true };
    });
    onUpdateSession({
      ...session,
      loggedErrors: updatedErrors,
    });
  };

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true">
      <div className={styles.modalCard}>
        <div className={styles.modalHeader}>
          <span className={styles.modalBadgeIcon}>🎓</span>
          <h2 className={styles.modalTitle}>گزارش و کارنامه نهایی جلسه آموزشی</h2>
          <p className={styles.modalSubtitle}>
            جلسه <strong>{session.skillNameFa}</strong> با <strong>{session.teacherName}</strong>{" "}
            با موفقیت پایان یافت.
          </p>
        </div>

        {/* Recap Stats Row */}
        <div className={styles.recapStatsRow}>
          <div>
            <span className={styles.recapStatNum}>{session.durationMinutes}</span>
            <span className={styles.recapStatLabel}>مدت جلسه (دقیقه)</span>
          </div>
          <div>
            <span className={styles.recapStatNum}>{totalErrors}</span>
            <span className={styles.recapStatLabel}>خطاهای کالبدشکافی‌شده</span>
          </div>
          <div>
            <span className={styles.recapStatNum}>{totalVocab}</span>
            <span className={styles.recapStatLabel}>واژگان طلایی آموخته‌شده</span>
          </div>
          <div>
            <span className={styles.recapStatNum}>
              {session.agenda.filter((a) => a.completed).length} / {session.agenda.length}
            </span>
            <span className={styles.recapStatLabel}>اهداف محقق‌شده</span>
          </div>
        </div>

        {/* Assigned Homework Section */}
        {session.homeworkAssigned && (
          <div>
            <h3 className={styles.recapSectionTitle}>📋 تکالیف و تمرین‌های تعیین‌شده برای جلسه بعد:</h3>
            <div className={styles.recapHomeworkBox}>{session.homeworkAssigned}</div>
          </div>
        )}

        {/* Teacher Final Notes */}
        {session.teacherFinalNotes && (
          <div>
            <h3 className={styles.recapSectionTitle}>💡 توصیه‌ها و جمع‌بندی استاد:</h3>
            <div className={styles.recapHomeworkBox} style={{ background: "rgba(56, 189, 248, 0.08)", borderColor: "#0284c7" }}>
              {session.teacherFinalNotes}
            </div>
          </div>
        )}

        {/* Leitner Sync Action */}
        {totalErrors > syncedErrors && (
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <button
              type="button"
              className={styles.syncLeitnerBtn}
              onClick={handleSyncAllErrors}
              style={{ fontSize: "0.85rem", padding: "0.5rem 1.25rem" }}
            >
              ⭐ افزودن یکجای تمام اشتباهات این جلسه به جعبه لایتنر ({totalErrors - syncedErrors} مورد)
            </button>
          </div>
        )}

        <div className={styles.modalActions}>
          <Link href={`/bookings/${session.bookingId}`} className={styles.btnDone}>
            ثبت نهایی و بازگشت به پرونده جلسه ←
          </Link>
          <button
            type="button"
            className={styles.notepadToolBtn}
            onClick={onClose}
          >
            ادامه کار در استودیو
          </button>
        </div>
      </div>
    </div>
  );
}
