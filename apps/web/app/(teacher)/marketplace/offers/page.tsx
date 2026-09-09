"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./offers.module.css";
import {
  fetchTeacherOffers,
  withdrawTeacherOffer,
  type TeacherOffer,
} from "../../../../lib/marketplace";

export default function TeacherOffersPage() {
  const [offers, setOffers] = useState<TeacherOffer[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchTeacherOffers(activeTab === "all" ? undefined : activeTab);
      setOffers(res.offers || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("خطا در بارگذاری پیشنهادهای تدریس");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const res = await fetchTeacherOffers(activeTab === "all" ? undefined : activeTab);
        if (!cancelled) {
          setOffers(res.offers || []);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "خطا در بارگذاری پیشنهادهای تدریس");
          setLoading(false);
        }
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  const handleWithdraw = async (offerId: string) => {
    if (!window.confirm("آیا از پس‌گرفتن این پیشنهاد تدریس اطمینان دارید؟")) return;

    try {
      await withdrawTeacherOffer(offerId);
      setActionMsg("پیشنهاد با موفقیت پس گرفته شد.");
      loadOffers();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("خطا در پس‌گرفتن پیشنهاد.");
      }
    }
  };

  const getStatusBadge = (status: string, statusDisplay?: string) => {
    if (status === "accepted") {
      return (
        <span className={`${styles.statusBadge} ${styles.statusAccepted}`}>
          ✓ پذیرفته شده ({statusDisplay || "رزرو قطعی"})
        </span>
      );
    }
    if (status === "pending") {
      return (
        <span className={`${styles.statusBadge} ${styles.statusPending}`}>
          ⏳ در انتظار تصمیم زبان‌آموز
        </span>
      );
    }
    return (
      <span className={`${styles.statusBadge} ${styles.statusDeclined}`}>
        {statusDisplay || status}
      </span>
    );
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>پیشنهادهای تدریس من</h1>
          <p className={styles.subtitle}>
            پیگیری وضعیت، نرخ‌های پیشنهادی و مدیریت پیشنهادهای ارسالی به بازار
          </p>
        </div>

        <nav className={styles.navLinks} aria-label="ناوبری بازار">
          <Link href="/marketplace/requests" className={styles.navLink}>
            📋 درخواست‌های فعال بازار
          </Link>
          <Link
            href="/marketplace/offers"
            className={`${styles.navLink} ${styles.navLinkActive}`}
          >
            💼 پیشنهادهای ارسال‌شده من
          </Link>
        </nav>
      </header>

      {actionMsg && (
        <div style={{ padding: "var(--space-3)", backgroundColor: "var(--color-success-50)", border: "1px solid var(--color-success-500)", borderRadius: "var(--radius-md)", color: "var(--color-success-700)" }}>
          {actionMsg}
        </div>
      )}

      {/* Tabs */}
      <div className={styles.tabBar} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "all"}
          onClick={() => setActiveTab("all")}
          className={`${styles.tabButton} ${activeTab === "all" ? styles.tabButtonActive : ""}`}
        >
          همه پیشنهادها
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "pending"}
          onClick={() => setActiveTab("pending")}
          className={`${styles.tabButton} ${activeTab === "pending" ? styles.tabButtonActive : ""}`}
        >
          در انتظار پاسخ زبان‌آموز
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "accepted"}
          onClick={() => setActiveTab("accepted")}
          className={`${styles.tabButton} ${activeTab === "accepted" ? styles.tabButtonActive : ""}`}
        >
          پذیرفته‌شده و رزرو قطعی
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div style={{ padding: "var(--space-4)", backgroundColor: "var(--color-danger-50)", border: "1px solid var(--color-danger-500)", borderRadius: "var(--radius-md)", color: "var(--color-danger-700)" }}>
          <p>{error}</p>
          <button type="button" onClick={loadOffers} className={styles.actionButton}>
            تلاش مجدد
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>در حال بارگذاری پیشنهادها...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && offers.length === 0 && (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>هیچ پیشنهادی در این دسته یافت نشد</p>
          <p className={styles.emptyText}>
            با بررسی درخواست‌های فعال بازار، می‌توانید به زبان‌آموزان پیشنهاد تدریس ارسال کنید.
          </p>
          <Link href="/marketplace/requests" className={styles.primaryButton}>
            مشاهده درخواست‌های فعال بازار
          </Link>
        </div>
      )}

      {/* Offers list */}
      {!loading && offers.length > 0 && (
        <div className={styles.offersList}>
          {offers.map((offer) => (
            <article key={offer.id} className={styles.offerCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.skillTitle}>
                  {offer.request_summary?.skill_display || "جلسه تدریس زبان انگلیسی"}
                  {offer.request_summary?.target_cefr_level && ` · سطح ${offer.request_summary.target_cefr_level}`}
                </h2>
                {getStatusBadge(offer.status, offer.status_display)}
              </div>

              {offer.request_summary?.short_description && (
                <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)", margin: 0 }}>
                  خلاصه درخواست: {offer.request_summary.short_description}
                </p>
              )}

              <div className={styles.offerDetailsRow}>
                <div className={styles.offerDetailItem}>
                  <span>مبلغ پیشنهادی:</span>
                  <strong className={styles.rateHighlight}>
                    {Number(offer.rate_toman).toLocaleString("fa-IR")} تومان
                  </strong>
                </div>
                <div className={styles.offerDetailItem}>
                  <span>مدت زمان:</span>
                  <strong>{offer.duration_minutes} دقیقه</strong>
                </div>
                <div className={styles.offerDetailItem}>
                  <span>شیوه برگزاری:</span>
                  <strong>{offer.format_display || offer.online_format}</strong>
                </div>
              </div>

              {offer.intro_note && (
                <div className={styles.noteBox}>
                  <strong>پیام شما به زبان‌آموز:</strong>
                  <p style={{ margin: "var(--space-1) 0 0 0" }}>{offer.intro_note}</p>
                </div>
              )}

              <div className={styles.cardFooter}>
                <span className={styles.timestamp}>
                  ثبت شده در {new Date(offer.created_at).toLocaleDateString("fa-IR")}
                </span>

                <div>
                  {offer.status === "pending" && (
                    <button
                      type="button"
                      onClick={() => handleWithdraw(offer.id)}
                      className={styles.actionButton}
                    >
                      پس‌گرفتن پیشنهاد
                    </button>
                  )}
                  {offer.status === "accepted" && (
                    <Link
                      href="/bookings"
                      className={styles.primaryButton}
                      style={{ paddingInline: "var(--space-3)", paddingBlock: "var(--space-1)", fontSize: "var(--font-size-xs)" }}
                    >
                      مشاهده جزئیات رزرو
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
