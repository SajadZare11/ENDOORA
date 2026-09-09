"use client";

import React, { useEffect, useState, useId } from "react";
import Link from "next/link";
import styles from "./learn-now.module.css";
import {
  createLearnNowRequest,
  fetchLearnerRequests,
  fetchRequestDetail,
  cancelLearnerRequest,
  acceptTeacherOffer,
  type MarketplaceRequest,
  type TeacherOffer,
} from "../../../../lib/marketplace";

type WizardStep = "details" | "review" | "searching" | "confirmed";

const SKILL_CHOICES = [
  { value: "speaking", label: "اسپیکینگ و مکالمه فشرده" },
  { value: "writing", label: "رایتینگ و تصحیح انشاء / آیلتس" },
  { value: "grammar", label: "گرامر تحلیلی و رفع اشکال" },
  { value: "vocabulary", label: "واژگان کاربردی و اصطلاحات" },
  { value: "ielts_prep", label: "آمادگی آزمون آیلتس (۴ مهارت)" },
  { value: "pronunciation", label: "تلفظ، استرس کلمات و لهجه" },
  { value: "general_english", label: "انگلیسی روزمره و عمومی" },
];

const CEFR_CHOICES = [
  { value: "unspecified", label: "مشخص نیست / نیاز به ارزیابی مدرس" },
  { value: "A1", label: "A1 - مقدماتی و پایه‌ای" },
  { value: "A2", label: "A2 - پیش‌متوسطه" },
  { value: "B1", label: "B1 - متوسطه" },
  { value: "B2", label: "B2 - بالاتر از متوسطه" },
  { value: "C1", label: "C1 - پیشرفته" },
  { value: "C2", label: "C2 - مسلط کامل" },
];

const TIME_CHOICES = [
  { value: "flexible", label: "منعطف / هماهنگی با وقت مدرس" },
  { value: "today_afternoon", label: "امروز بعدازظهر (۱۴ تا ۱۸)" },
  { value: "today_evening", label: "امروز عصر و شب (۱۸ تا ۲۲)" },
  { value: "tomorrow_morning", label: "فردا صبح (۹ تا ۱۳)" },
  { value: "tomorrow_afternoon", label: "فردا بعدازظهر (۱۴ تا ۱۸)" },
  { value: "tomorrow_evening", label: "فردا عصر و شب (۱۸ تا ۲۲)" },
];

const FORMAT_CHOICES = [
  { value: "video", label: "تماس تصویری زنده (پیشنهادی)" },
  { value: "audio", label: "تماس صوتی متمرکز" },
  { value: "async_review", label: "بررسی و ارسال فیدبک صوتی/متنی آفلاین" },
  { value: "text_chat", label: "گفتگوی متنی آموزشی" },
];

export default function LearnNowWizardPage() {
  const [step, setStep] = useState<WizardStep>("details");
  const [activeRequest, setActiveRequest] = useState<MarketplaceRequest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [acceptedOffer, setAcceptedOffer] = useState<TeacherOffer | null>(null);

  // Form fields
  const [targetSkill, setTargetSkill] = useState<string>("speaking");
  const [targetSubskill, setTargetSubskill] = useState<string>("");
  const [targetCefrLevel, setTargetCefrLevel] = useState<string>("B1");
  const [shortDescription, setShortDescription] = useState<string>("");
  const [preferredTimeWindow, setPreferredTimeWindow] = useState<string>("flexible");
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [onlineFormat, setOnlineFormat] = useState<string>("video");
  const [budgetMaxToman, setBudgetMaxToman] = useState<number | "">(350000);

  const skillId = useId();
  const subskillId = useId();
  const cefrId = useId();
  const descId = useId();
  const timeId = useId();
  const durationId = useId();
  const formatId = useId();
  const budgetId = useId();

  // Load active request on mount (Interruption safe recovery)
  useEffect(() => {
    let cancelled = false;
    async function loadActive() {
      try {
        setLoading(true);
        const res = await fetchLearnerRequests();
        const active = res.requests.find(
          (r) => r.status === "open" || r.status === "matched"
        );
        if (!cancelled && active) {
          // Fetch complete details with offers
          const detailed = await fetchRequestDetail(active.id);
          setActiveRequest(detailed);
          setStep("searching");
        }
      } catch {
        // Fallback: stay on details form
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadActive();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleNextToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shortDescription.trim() || shortDescription.trim().length < 10) {
      setErrorMsg("لطفاً هدف یا سوال یادگیری خود را در حداقل ۱۰ کاراکتر شرح دهید.");
      return;
    }
    setErrorMsg(null);
    setStep("review");
  };

  const handlePublishRequest = async () => {
    try {
      setSubmitting(true);
      setErrorMsg(null);

      const created = await createLearnNowRequest({
        target_skill: targetSkill,
        target_subskill: targetSubskill.trim(),
        target_cefr_level: targetCefrLevel,
        short_description: shortDescription.trim(),
        preferred_time_window: preferredTimeWindow,
        duration_minutes: durationMinutes,
        online_format: onlineFormat,
        budget_max_toman: budgetMaxToman ? Number(budgetMaxToman) : null,
      });

      const detailed = await fetchRequestDetail(created.id);
      setActiveRequest(detailed);
      setStep("searching");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("خطا در انتشار درخواست. لطفاً مجدداً تلاش کنید.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!activeRequest) return;
    if (!window.confirm("آیا از لغو این درخواست یادگیری اطمینان دارید؟")) return;

    try {
      setSubmitting(true);
      await cancelLearnerRequest(activeRequest.id);
      setActiveRequest(null);
      setStep("details");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("خطا در لغو درخواست.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptOffer = async (offer: TeacherOffer) => {
    if (!window.confirm(`آیا پیشنهاد مدرس ${offer.teacher_name} با مبلغ ${Number(offer.rate_toman).toLocaleString("fa-IR")} تومان را می‌پذیرید؟`)) {
      return;
    }

    try {
      setSubmitting(true);
      await acceptTeacherOffer(offer.id);
      setAcceptedOffer(offer);
      setStep("confirmed");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("خطا در پذیرش پیشنهاد مدرس.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const refreshRequestOffers = async () => {
    if (!activeRequest) return;
    try {
      const detailed = await fetchRequestDetail(activeRequest.id);
      setActiveRequest(detailed);
    } catch {
      // ignore
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>یادگیری سریع با مدرس (Learn Now)</h1>
        <p className={styles.subtitle}>
          در کمتر از چند دقیقه نیاز آموزشی خود را ثبت کنید؛ مدرسین تأییدشده اندورا پیشنهادهای خود را برای
          شما ارسال خواهند کرد.
        </p>
      </header>

      {/* Stepper */}
      <nav className={styles.stepperBar} aria-label="مراحل درخواست">
        <div
          className={`${styles.stepItem} ${
            step === "details" ? styles.stepItemActive : styles.stepItemDone
          }`}
        >
          <span
            className={`${styles.stepBadge} ${
              step === "details"
                ? styles.stepBadgeActive
                : styles.stepBadgeDone
            }`}
          >
            ۱
          </span>
          <span>جزئیات درخواست</span>
        </div>
        <span>→</span>
        <div
          className={`${styles.stepItem} ${
            step === "review"
              ? styles.stepItemActive
              : ["searching", "confirmed"].includes(step)
              ? styles.stepItemDone
              : ""
          }`}
        >
          <span
            className={`${styles.stepBadge} ${
              step === "review"
                ? styles.stepBadgeActive
                : ["searching", "confirmed"].includes(step)
                ? styles.stepBadgeDone
                : ""
            }`}
          >
            ۲
          </span>
          <span>بازبینی و تأیید</span>
        </div>
        <span>→</span>
        <div
          className={`${styles.stepItem} ${
            step === "searching"
              ? styles.stepItemActive
              : step === "confirmed"
              ? styles.stepItemDone
              : ""
          }`}
        >
          <span
            className={`${styles.stepBadge} ${
              step === "searching"
                ? styles.stepBadgeActive
                : step === "confirmed"
                ? styles.stepBadgeDone
                : ""
            }`}
          >
            ۳
          </span>
          <span>تطبیق و دریافت پیشنهادها</span>
        </div>
        <span>→</span>
        <div
          className={`${styles.stepItem} ${
            step === "confirmed" ? styles.stepItemActive : ""
          }`}
        >
          <span
            className={`${styles.stepBadge} ${
              step === "confirmed" ? styles.stepBadgeActive : ""
            }`}
          >
            ۴
          </span>
          <span>تأیید نهایی رزرو</span>
        </div>
      </nav>

      {errorMsg && (
        <div style={{ padding: "var(--space-3)", backgroundColor: "var(--color-danger-50)", border: "1px solid var(--color-danger-500)", borderRadius: "var(--radius-md)", color: "var(--color-danger-700)" }}>
          {errorMsg}
        </div>
      )}

      {loading && (
        <div className={styles.wizardCard} style={{ textAlign: "center", paddingBlock: "var(--space-8)" }}>
          <p style={{ fontSize: "var(--font-size-base)", color: "var(--color-text-secondary)", margin: 0 }}>
            در حال بارگذاری وضعیت درخواست‌های شما...
          </p>
        </div>
      )}

      {/* Step 1: Request Details */}
      {!loading && step === "details" && (
        <div className={styles.wizardCard}>
          <form onSubmit={handleNextToReview} className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor={skillId} className={styles.formLabel}>
                مهارت مورد نیاز:
              </label>
              <select
                id={skillId}
                value={targetSkill}
                onChange={(e) => setTargetSkill(e.target.value)}
                className={styles.formSelect}
              >
                {SKILL_CHOICES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor={cefrId} className={styles.formLabel}>
                سطح تقریبی زبان شما:
              </label>
              <select
                id={cefrId}
                value={targetCefrLevel}
                onChange={(e) => setTargetCefrLevel(e.target.value)}
                className={styles.formSelect}
              >
                {CEFR_CHOICES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor={subskillId} className={styles.formLabel}>
                موضوع مشخص یا عنوان تمرین (اختیاری):
              </label>
              <input
                id={subskillId}
                type="text"
                placeholder="مثلاً: تمرین اسپیکینگ پارت ۲ آیلتس یا مصاحبه شغلی"
                value={targetSubskill}
                onChange={(e) => setTargetSubskill(e.target.value)}
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor={timeId} className={styles.formLabel}>
                زمان ترجیحی شما:
              </label>
              <select
                id={timeId}
                value={preferredTimeWindow}
                onChange={(e) => setPreferredTimeWindow(e.target.value)}
                className={styles.formSelect}
              >
                {TIME_CHOICES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor={durationId} className={styles.formLabel}>
                مدت زمان جلسه:
              </label>
              <select
                id={durationId}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className={styles.formSelect}
              >
                <option value={30}>۳۰ دقیقه (رفع اشکال سریع)</option>
                <option value={45}>۴۵ دقیقه (جلسه استاندارد)</option>
                <option value={60}>۶۰ دقیقه (تحلیل عمیق و شبیه‌سازی)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor={formatId} className={styles.formLabel}>
                شیوه آنلاین جلسه:
              </label>
              <select
                id={formatId}
                value={onlineFormat}
                onChange={(e) => setOnlineFormat(e.target.value)}
                className={styles.formSelect}
              >
                {FORMAT_CHOICES.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor={budgetId} className={styles.formLabel}>
                حداکثر سقف بودجه پیشنهادی (تومان، اختیاری):
              </label>
              <input
                id={budgetId}
                type="number"
                step={10000}
                placeholder="مثلاً: 350000"
                value={budgetMaxToman}
                onChange={(e) =>
                  setBudgetMaxToman(e.target.value ? Number(e.target.value) : "")
                }
                className={styles.formInput}
              />
            </div>

            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label htmlFor={descId} className={styles.formLabel}>
                شرح دقیق هدف یا چالش آموزشی شما:
              </label>
              <textarea
                id={descId}
                rows={4}
                placeholder="توضیح دهید در این جلسه دقیقاً چه موضوعی را می‌خواهید یاد بگیرید، چه سوالاتی دارید و چه کمکی از استاد انتظار دارید..."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className={styles.formTextarea}
                required
              />
            </div>

            <div className={`${styles.actionsRow} ${styles.formGroupFull}`}>
              <button type="submit" className={styles.primaryButton}>
                مرحله بعد: بازبینی درخواست ←
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 2: Review Request */}
      {step === "review" && (
        <div className={styles.wizardCard}>
          <h2 style={{ fontSize: "var(--font-size-lg)", fontWeight: 700, margin: 0 }}>
            بازبینی و تأیید درخواست قبل از ارسال به بازار
          </h2>

          <div className={styles.summaryBox}>
            <div className={styles.summaryRow}>
              <span>مهارت انتخابی:</span>
              <span className={styles.summaryValue}>
                {SKILL_CHOICES.find((s) => s.value === targetSkill)?.label}
              </span>
            </div>
            {targetSubskill && (
              <div className={styles.summaryRow}>
                <span>موضوع تخصصی:</span>
                <span className={styles.summaryValue}>{targetSubskill}</span>
              </div>
            )}
            <div className={styles.summaryRow}>
              <span>سطح شما:</span>
              <span className={styles.summaryValue}>سطح {targetCefrLevel}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>زمان ترجیحی:</span>
              <span className={styles.summaryValue}>
                {TIME_CHOICES.find((t) => t.value === preferredTimeWindow)?.label}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span>مدت جلسه و شیوه:</span>
              <span className={styles.summaryValue}>
                {durationMinutes} دقیقه ·{" "}
                {FORMAT_CHOICES.find((f) => f.value === onlineFormat)?.label}
              </span>
            </div>
            {budgetMaxToman && (
              <div className={styles.summaryRow}>
                <span>سقف بودجه:</span>
                <span className={styles.summaryValue}>
                  {Number(budgetMaxToman).toLocaleString("fa-IR")} تومان
                </span>
              </div>
            )}
            <div style={{ paddingBlockStart: "var(--space-2)", borderBlockStart: "1px dashed var(--color-border-subtle)" }}>
              <strong style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>
                شرح درخواست:
              </strong>
              <p style={{ margin: "var(--space-1) 0 0 0", fontSize: "var(--font-size-sm)" }}>
                {shortDescription}
              </p>
            </div>
          </div>

          <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)", margin: 0 }}>
            🛡️ <strong>حفاظت از حریم خصوصی:</strong> اطلاعات تماس مستقیم (شماره موبایل و ایمیل) شما هرگز به مدرسین
            نمایش داده نمی‌شود و تنها خلاصهٔ آموزشی در بازار قرار می‌گیرد.
          </p>

          <div className={styles.actionsRow}>
            <button
              type="button"
              onClick={() => setStep("details")}
              className={styles.secondaryButton}
              disabled={submitting}
            >
              ← ویرایش اطلاعات
            </button>
            <button
              type="button"
              onClick={handlePublishRequest}
              className={styles.primaryButton}
              disabled={submitting}
            >
              {submitting ? "در حال ثبت درخواست..." : "انتشار درخواست در بازار تدریس ✓"}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Searching & Eligible Teacher Offers */}
      {step === "searching" && activeRequest && (
        <div className={styles.wizardCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-2)" }}>
            <h2 style={{ fontSize: "var(--font-size-lg)", fontWeight: 700, margin: 0 }}>
              درخواست فعال: {activeRequest.skill_display || activeRequest.target_skill}
            </h2>
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <button
                type="button"
                onClick={refreshRequestOffers}
                className={styles.secondaryButton}
                style={{ fontSize: "var(--font-size-xs)" }}
              >
                🔄 بروزرسانی پیشنهادها
              </button>
              <button
                type="button"
                onClick={handleCancelRequest}
                className={styles.dangerButton}
                disabled={submitting}
              >
                لغو درخواست
              </button>
            </div>
          </div>

          {/* Offers status */}
          {(!activeRequest.offers || activeRequest.offers.length === 0) ? (
            <div className={styles.matchingSpinnerArea}>
              <div className={styles.pulseCircle} aria-hidden="true">
                📡
              </div>
              <h3 style={{ fontSize: "var(--font-size-base)", fontWeight: 700, margin: 0 }}>
                درخواست شما در بازار برای مدرسین واجد شرایط فعال شد
              </h3>
              <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)", maxInlineSize: "500px", margin: 0 }}>
                سیستم هوشمند تطبیق اندورا درخواست شما را به مدرسین متخصص این مهارت نمایش می‌دهد.
                به محض ارسال پیشنهاد، کارت مدرس در این بخش ظاهر می‌شود.
              </p>
            </div>
          ) : (
            <div className={styles.offersGrid}>
              <p style={{ fontSize: "var(--font-size-sm)", fontWeight: 600, color: "var(--color-text-primary)", margin: 0 }}>
                {activeRequest.offers.length} پیشنهاد از مدرسین تأییدشده دریافت شد:
              </p>

              {activeRequest.offers.map((offer) => (
                <article key={offer.id} className={styles.offerCard}>
                  <div className={styles.teacherProfileRow}>
                    <div className={styles.teacherAvatarGroup}>
                      <div className={styles.teacherAvatar} aria-hidden="true">
                        {offer.teacher_name[0]}
                      </div>
                      <div className={styles.teacherMeta}>
                        <span className={styles.teacherName}>
                          {offer.teacher_name} {offer.teacher_verified && "✓"}
                        </span>
                        <span className={styles.teacherHeadline}>{offer.teacher_headline}</span>
                      </div>
                    </div>

                    <div className={styles.offerRateTag}>
                      {Number(offer.rate_toman).toLocaleString("fa-IR")} تومان
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "var(--space-3)", fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                    <span>مدت: {offer.duration_minutes} دقیقه</span>
                    <span>·</span>
                    <span>شیوه: {offer.format_display || offer.online_format}</span>
                    <span>·</span>
                    <span>
                      ارسال شده در {new Date(offer.created_at).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  {offer.intro_note && (
                    <div className={styles.introNoteBox}>
                      <strong>پیام و راهکار مدرس:</strong>
                      <p style={{ margin: "var(--space-1) 0 0 0" }}>{offer.intro_note}</p>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "flex-end", paddingBlockStart: "var(--space-2)" }}>
                    <button
                      type="button"
                      onClick={() => handleAcceptOffer(offer)}
                      className={styles.primaryButton}
                      disabled={submitting}
                    >
                      {submitting ? "در حال ثبت رزرو..." : "انتخاب این پیشنهاد و تأیید جلسه ←"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 4: Confirmed & Booked */}
      {step === "confirmed" && (
        <div className={styles.confirmationBox}>
          <div style={{ fontSize: "40px" }}>🎉</div>
          <h2 className={styles.confirmTitle}>رزرو جلسه با موفقیت قطعی شد!</h2>
          <p className={styles.confirmText}>
            پیشنهاد مدرس {acceptedOffer?.teacher_name} تأیید گردید. جلسه شما طبق زمان و شیوه توافق‌شده در سامانه
            ثبت شده است.
          </p>
          <div style={{ display: "flex", gap: "var(--space-3)", marginBlockStart: "var(--space-2)" }}>
            <Link href="/bookings" className={styles.primaryButton}>
              مشاهده رزروها و اتاق جلسه
            </Link>
            <button
              type="button"
              onClick={() => {
                setActiveRequest(null);
                setAcceptedOffer(null);
                setStep("details");
              }}
              className={styles.secondaryButton}
            >
              ثبت یک درخواست دیگر
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
