"use client";

import React, { useEffect, useState, useId } from "react";
import Link from "next/link";
import styles from "./requests.module.css";
import {
  fetchTeacherEligibility,
  fetchTeacherFeed,
  submitTeacherOffer,
  type MarketplaceRequest,
  type TeacherEligibility,
  type TeacherFeedFilters,
} from "../../../../lib/marketplace";

const SKILL_OPTIONS = [
  { value: "", label: "همه مهارت‌ها" },
  { value: "speaking", label: "اسپیکینگ و مکالمه" },
  { value: "writing", label: "رایتینگ و نگارش" },
  { value: "grammar", label: "گرامر تحلیلی" },
  { value: "vocabulary", label: "واژگان و اصطلاحات" },
  { value: "ielts_prep", label: "آمادگی آیلتس" },
  { value: "pronunciation", label: "تلفظ و لهجه" },
];

const CEFR_OPTIONS = [
  { value: "all", label: "همه سطوح" },
  { value: "A1", label: "A1" },
  { value: "A2", label: "A2" },
  { value: "B1", label: "B1" },
  { value: "B2", label: "B2" },
  { value: "C1", label: "C1" },
  { value: "C2", label: "C2" },
];

const FORMAT_OPTIONS = [
  { value: "all", label: "همه شیوه‌ها" },
  { value: "video", label: "تماس تصویری" },
  { value: "audio", label: "تماس صوتی" },
  { value: "async_review", label: "بررسی آفلاین" },
];

export default function MarketplaceRequestsPage() {
  const [eligibility, setEligibility] = useState<TeacherEligibility | null>(null);
  const [requests, setRequests] = useState<MarketplaceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [filters, setFilters] = useState<TeacherFeedFilters>({
    skill: "",
    cefr_level: "all",
    format: "all",
    timing: "all",
    status: "",
  });

  // Offer modal state
  const [selectedRequest, setSelectedRequest] = useState<MarketplaceRequest | null>(null);
  const [rateToman, setRateToman] = useState<number>(300000);
  const [introNote, setIntroNote] = useState<string>("");
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [onlineFormat, setOnlineFormat] = useState<string>("video");
  const [submittingOffer, setSubmittingOffer] = useState<boolean>(false);
  const [offerError, setOfferError] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  const rateInputId = useId();
  const durationSelectId = useId();
  const formatSelectId = useId();
  const noteTextareaId = useId();

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const elig = await fetchTeacherEligibility();
      setEligibility(elig);

      if (elig.can_access_feed) {
        const feedData = await fetchTeacherFeed(filters);
        setRequests(feedData.requests || []);
      } else {
        setRequests([]);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("خطا در بارگذاری فهرست درخواست‌های بازار");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const elig = await fetchTeacherEligibility();
        if (cancelled) return;
        setEligibility(elig);

        if (elig.can_access_feed) {
          const feedData = await fetchTeacherFeed(filters);
          if (!cancelled) {
            setRequests(feedData.requests || []);
            setLoading(false);
          }
        } else {
          if (!cancelled) {
            setRequests([]);
            setLoading(false);
          }
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "خطا در بارگذاری فهرست درخواست‌های بازار");
          setLoading(false);
        }
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, [filters]);

  const handleOpenOfferModal = (req: MarketplaceRequest) => {
    setSelectedRequest(req);
    setRateToman(req.budget_max_toman ? Number(req.budget_max_toman) : 300000);
    setDurationMinutes(req.duration_minutes || 45);
    setOnlineFormat(req.online_format || "video");
    setIntroNote("");
    setOfferError(null);
  };

  const handleCloseOfferModal = () => {
    setSelectedRequest(null);
    setOfferError(null);
  };

  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    if (!introNote.trim() || introNote.trim().length < 10) {
      setOfferError("لطفاً پیام و راهکار تدریس خود را در حداقل ۱۰ کاراکتر بنویسید.");
      return;
    }
    if (rateToman < 10000) {
      setOfferError("مبلغ پیشنهادی باید حداقل ۱۰,۰۰۰ تومان باشد.");
      return;
    }

    try {
      setSubmittingOffer(true);
      setOfferError(null);

      await submitTeacherOffer(selectedRequest.id, {
        rate_toman: rateToman,
        intro_note: introNote.trim(),
        duration_minutes: durationMinutes,
        online_format: onlineFormat,
      });

      setFeedbackSuccess("پیشنهاد شما با موفقیت برای زبان‌آموز ارسال شد.");
      handleCloseOfferModal();
      // Reload feed to update offer status
      loadData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setOfferError(err.message);
      } else {
        setOfferError("خطا در ارسال پیشنهاد. لطفاً مجدداً تلاش کنید.");
      }
    } finally {
      setSubmittingOffer(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>بازار درخواست‌های تدریس (Learn Now)</h1>
          <p className={styles.subtitle}>
            درخواست‌های فعال زبان‌آموزان برای کلاس‌های سریع و جلسات متمرکز یادگیری
          </p>
        </div>

        <nav className={styles.navLinks} aria-label="ناوبری بازار">
          <Link
            href="/marketplace/requests"
            className={`${styles.navLink} ${styles.navLinkActive}`}
          >
            📋 درخواست‌های فعال بازار
          </Link>
          <Link
            href="/marketplace/offers"
            className={styles.navLink}
          >
            💼 پیشنهادهای ارسال‌شده من
          </Link>
        </nav>
      </header>

      {/* Success Notification */}
      {feedbackSuccess && (
        <div className={styles.banner} style={{ borderColor: "var(--color-success-500)" }}>
          <p className={styles.bannerTitle} style={{ color: "var(--color-success-700)" }}>
            عملیات موفق
          </p>
          <p className={styles.bannerText}>{feedbackSuccess}</p>
        </div>
      )}

      {/* Eligibility Gating Banner */}
      {eligibility && !eligibility.can_access_feed && (
        <div className={styles.banner}>
          <h2 className={styles.bannerTitle}>دسترسی به بازار نیازمند تکمیل شرایط است</h2>
          <p className={styles.bannerText}>
            جهت مشاهده درخواست‌های فعال زبان‌آموزان و ارسال پیشنهاد تدریس، حساب کاربری شما باید دارای
            تأییدیه مدارک و مجوز فعالیت در بازار باشد. این کنترل‌ها جهت حفظ کیفیت آموزشی و امنیت کاربران
            اعمال می‌شوند.
          </p>
          <div className={styles.bannerMetrics}>
            <span
              className={`${styles.bannerBadge} ${
                eligibility.is_teacher_verified ? styles.badgeVerified : styles.badgeUnverified
              }`}
            >
              {eligibility.is_teacher_verified ? "✓ هویت و مدارک تأیید شده" : "✕ نیاز به تأیید مدارک مدرس"}
            </span>
            <span
              className={`${styles.bannerBadge} ${
                eligibility.marketplace_eligible ? styles.badgeVerified : styles.badgeUnverified
              }`}
            >
              {eligibility.marketplace_eligible ? "✓ مجوز بازار فعال است" : "✕ مجوز بازار غیرفعال است"}
            </span>
          </div>
        </div>
      )}

      {/* Metrics Bar */}
      {eligibility?.can_access_feed && (
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <p className={styles.kpiValue}>{requests.length}</p>
            <p className={styles.kpiLabel}>درخواست‌های مطابق با فیلتر</p>
          </div>
          <div className={styles.kpiCard}>
            <p className={styles.kpiValue}>
              {requests.filter((r) => !r.has_my_offer).length}
            </p>
            <p className={styles.kpiLabel}>در انتظار پیشنهاد شما</p>
          </div>
          <div className={styles.kpiCard}>
            <p className={styles.kpiValue}>
              {requests.filter((r) => r.has_my_offer).length}
            </p>
            <p className={styles.kpiLabel}>پیشنهادهای فعال ارسال‌شده</p>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      {eligibility?.can_access_feed && (
        <div className={styles.filtersBar}>
          <div className={styles.filterRow}>
            <span className={styles.filterLabel}>مهارت:</span>
            <div className={styles.chipGroup}>
              {SKILL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFilters((f) => ({ ...f, skill: opt.value }))}
                  className={`${styles.filterChip} ${
                    filters.skill === opt.value ? styles.filterChipActive : ""
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterRow}>
            <span className={styles.filterLabel}>سطح زبان:</span>
            <div className={styles.chipGroup}>
              {CEFR_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFilters((f) => ({ ...f, cefr_level: opt.value }))}
                  className={`${styles.filterChip} ${
                    filters.cefr_level === opt.value ? styles.filterChipActive : ""
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterRow}>
            <span className={styles.filterLabel}>شیوه برگزاری:</span>
            <div className={styles.chipGroup}>
              {FORMAT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFilters((f) => ({ ...f, format: opt.value }))}
                  className={`${styles.filterChip} ${
                    filters.format === opt.value ? styles.filterChipActive : ""
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className={styles.banner} style={{ borderColor: "var(--color-danger-500)" }}>
          <p className={styles.bannerTitle} style={{ color: "var(--color-danger-500)" }}>خطا در ارتباط با سرور</p>
          <p className={styles.bannerText}>{error}</p>
          <button type="button" onClick={loadData} className={styles.secondaryButton}>
            تلاش مجدد
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>در حال بارگذاری درخواست‌های بازار...</p>
        </div>
      )}

      {/* Requests Feed List */}
      {!loading && eligibility?.can_access_feed && requests.length === 0 && (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>هیچ درخواستی با فیلترهای انتخابی یافت نشد</p>
          <p className={styles.emptyText}>
            درخواست‌های جدید زبان‌آموزان به محض ثبت به این لیست اضافه می‌شوند. می‌توانید فیلترها را ریست کنید.
          </p>
          <button
            type="button"
            onClick={() => setFilters({ skill: "", cefr_level: "all", format: "all", timing: "all", status: "" })}
            className={styles.secondaryButton}
          >
            پاک کردن فیلترها
          </button>
        </div>
      )}

      {!loading && eligibility?.can_access_feed && requests.length > 0 && (
        <div className={styles.requestsList}>
          {requests.map((req) => (
            <article key={req.id} className={styles.requestCard}>
              <div className={styles.cardTop}>
                <div className={styles.learnerInfo}>
                  <div className={styles.avatarCircle} aria-hidden="true">
                    {(req.learner_display_name || "ز")[0]}
                  </div>
                  <div className={styles.learnerMeta}>
                    <span className={styles.learnerName}>{req.learner_display_name}</span>
                    <span className={styles.requestTime}>
                      {new Date(req.created_at).toLocaleDateString("fa-IR")}
                    </span>
                  </div>
                </div>

                <div className={styles.tagRow}>
                  <span className={styles.skillBadge}>{req.skill_display || req.target_skill}</span>
                  {req.target_cefr_level && req.target_cefr_level !== "unspecified" && (
                    <span className={styles.cefrBadge}>سطح {req.target_cefr_level}</span>
                  )}
                  <span className={styles.formatBadge}>{req.format_display || req.online_format}</span>
                  <span className={styles.timeBadge}>{req.duration_minutes} دقیقه</span>
                </div>
              </div>

              {req.target_subskill && (
                <div className={styles.tagRow}>
                  <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                    موضوع تخصصی: <strong>{req.target_subskill}</strong>
                  </span>
                </div>
              )}

              <p className={styles.cardDescription}>{req.short_description}</p>

              <div className={styles.cardFooter}>
                <div className={styles.budgetOfferArea}>
                  <span>
                    زمان مدنظر: <strong>{req.time_window_display || req.preferred_time_window}</strong>
                  </span>
                  <span>·</span>
                  <span>
                    بودجه پیشنهادی:{" "}
                    {req.budget_max_toman ? (
                      <span className={styles.budgetHighlight}>
                        تا {Number(req.budget_max_toman).toLocaleString("fa-IR")} تومان
                      </span>
                    ) : (
                      "توافقی"
                    )}
                  </span>
                  <span>·</span>
                  <span>{req.offer_count || 0} پیشنهاد ثبت شده</span>
                </div>

                <div>
                  {req.has_my_offer ? (
                    <span className={styles.offeredBadge}>✓ پیشنهاد شما ارسال شده است</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenOfferModal(req)}
                      className={styles.primaryButton}
                    >
                      ارسال پیشنهاد تدریس
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Offer Submission Modal */}
      {selectedRequest && (
        <div
          className={styles.modalBackdrop}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-offer-title"
        >
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h2 id="modal-offer-title" className={styles.modalTitle}>
                ارسال پیشنهاد تدریس برای {selectedRequest.learner_display_name}
              </h2>
              <button
                type="button"
                onClick={handleCloseOfferModal}
                className={styles.closeButton}
                aria-label="بستن"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitOffer} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label htmlFor={rateInputId} className={styles.formLabel}>
                  مبلغ پیشنهادی جلسه (تومان):
                </label>
                <input
                  id={rateInputId}
                  type="number"
                  min={10000}
                  step={10000}
                  value={rateToman}
                  onChange={(e) => setRateToman(Number(e.target.value))}
                  className={styles.formInput}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor={durationSelectId} className={styles.formLabel}>
                  مدت جلسه:
                </label>
                <select
                  id={durationSelectId}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className={styles.formSelect}
                >
                  <option value={30}>۳۰ دقیقه</option>
                  <option value={45}>۴۵ دقیقه</option>
                  <option value={60}>۶۰ دقیقه</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor={formatSelectId} className={styles.formLabel}>
                  شیوه برگزاری:
                </label>
                <select
                  id={formatSelectId}
                  value={onlineFormat}
                  onChange={(e) => setOnlineFormat(e.target.value)}
                  className={styles.formSelect}
                >
                  <option value="video">تماس تصویری زنده</option>
                  <option value="audio">تماس صوتی متمرکز</option>
                  <option value="async_review">بررسی و تصحیح جامع آفلاین</option>
                  <option value="text_chat">گفتگوی متنی آموزشی</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor={noteTextareaId} className={styles.formLabel}>
                  پیام اختصاصی و راهکار تدریس شما:
                </label>
                <textarea
                  id={noteTextareaId}
                  value={introNote}
                  onChange={(e) => setIntroNote(e.target.value)}
                  placeholder="توضیح کوتاه در مورد روش کار، منابع پیشنهادی و رویکرد شما برای حل نیاز این زبان‌آموز..."
                  className={styles.formTextarea}
                  rows={4}
                  required
                />
              </div>

              {offerError && <p className={styles.errorMessage}>{offerError}</p>}

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={handleCloseOfferModal}
                  className={styles.secondaryButton}
                  disabled={submittingOffer}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className={styles.primaryButton}
                  disabled={submittingOffer}
                >
                  {submittingOffer ? "در حال ثبت..." : "ثبت و ارسال پیشنهاد"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
