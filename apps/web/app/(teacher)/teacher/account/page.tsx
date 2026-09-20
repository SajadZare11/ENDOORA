"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./account.module.css";
import { Button, Input } from "@endoora/ui";
import { useTeacherHome } from "@/components/teacher/TeacherShell";
import {
  fetchTeacherAccountSummary,
  updateTeacherPreferences,
  upgradeTeacherPlan,
} from "@/lib/teacheros-api";
import type {
  TeacherAccountSummary,
  PlanTierOption,
  TeacherPreferences,
} from "@endoora/contracts";

export default function TeacherAccountPage() {
  const { locale } = useTeacherHome();
  const isFa = locale === "fa";

  const [summary, setSummary] = useState<TeacherAccountSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Preferences Form State
  const [preferences, setPreferences] = useState<TeacherPreferences | null>(null);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefsMessage, setPrefsMessage] = useState<string | null>(null);

  // Upgrade Modal State
  const [upgradeTarget, setUpgradeTarget] = useState<PlanTierOption | null>(null);
  const [upgrading, setUpgrading] = useState(false);
  const [receipt, setReceipt] = useState<{ ref_id: string; plan_name: string } | null>(null);

  const loadData = () => {
    fetchTeacherAccountSummary()
      .then((data) => {
        setSummary(data);
        setPreferences(data.preferences);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load teacher account summary:", err);
        setError(err.message || "Failed to load account information");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save Preferences Handler
  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferences) return;
    setSavingPrefs(true);
    try {
      const res = await updateTeacherPreferences(preferences);
      setPreferences(res.preferences);
      setPrefsMessage(
        isFa
          ? "✅ تنظیمات پداگوژیک و پیش‌فرض‌های تدریس با موفقیت ذخیره شد."
          : "✅ Pedagogical preferences saved successfully."
      );
      setTimeout(() => setPrefsMessage(null), 4000);
    } catch (err) {
      console.error("Failed to update preferences:", err);
      alert(isFa ? "خطا در ذخیره تنظیمات." : "Failed to update preferences.");
    } finally {
      setSavingPrefs(false);
    }
  };

  // Confirm Upgrade Simulation
  const handleConfirmUpgrade = async () => {
    if (!upgradeTarget) return;
    setUpgrading(true);
    try {
      const res = await upgradeTeacherPlan(upgradeTarget.code, "zarinpal");
      setReceipt({
        ref_id: res.transaction.ref_id,
        plan_name: upgradeTarget.name_fa,
      });
      loadData();
    } catch (err) {
      console.error("Upgrade failed:", err);
      alert(isFa ? "خطا در ارتقای طرح کاربری." : "Failed to upgrade subscription plan.");
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: "center", padding: "64px", color: "var(--color-muted)" }}>
          {isFa ? "در حال دریافت اطلاعات حساب کاربری و اشتراک..." : "Loading account details and quotas..."}
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: "center", padding: "48px", color: "#ef4444" }}>
          <p>{error || (isFa ? "خطا در بارگذاری حساب کاربری" : "Failed to load account")}</p>
          <Button variant="secondary" size="sm" onClick={loadData}>
            {isFa ? "تلاش مجدد" : "Try Again"}
          </Button>
        </div>
      </div>
    );
  }

  const { teacher, plan, usage, productivity, available_plans } = summary;
  const usedToday = usage.used_today;
  const limitToday = usage.daily_limit;
  const usagePercent = Math.min(100, Math.round((usedToday / Math.max(1, limitToday)) * 100));
  const progressStatus = usagePercent > 90 ? "danger" : usagePercent > 70 ? "warning" : "normal";

  return (
    <div className={styles.container}>
      {/* Teacher Profile & Plan Header */}
      <div className={styles.profileCard}>
        <div className={styles.profileInfo}>
          <div className={styles.avatarCircle}>
            {teacher.name.charAt(0).toUpperCase()}
          </div>
          <div className={styles.profileMeta}>
            <h1 className={styles.teacherName}>
              {teacher.name}
              {teacher.is_verified && (
                <span className={styles.verifiedBadge}>
                  ✓ {isFa ? "مدرس تأییدشده" : "Verified Teacher"}
                </span>
              )}
            </h1>
            <p className={styles.teacherEmail}>{teacher.email}</p>
            <span style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}>
              {isFa
                ? `عضویت از: ${teacher.date_joined}`
                : `Member since: ${teacher.date_joined}`}
            </span>
          </div>
        </div>

        <div className={styles.profileActions}>
          <div className={styles.planPill} data-plan={plan.code}>
            <span>⭐</span>
            <span>{isFa ? plan.name_fa : plan.name}</span>
          </div>
          <Link href="/account" className={styles.securityLink}>
            🛡️ {isFa ? "تنظیمات عمومی و امنیت" : "Security & General"}
          </Link>
        </div>
      </div>

      {/* Productivity Stats Ribbon */}
      <div className={styles.productivityGrid}>
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <span>{isFa ? "صرفه‌جویی در زمان" : "Hours Saved"}</span>
            <span className={styles.statIcon}>⏱️</span>
          </div>
          <div className={styles.statValue}>
            {productivity.hours_saved} <span style={{ fontSize: "1rem", fontWeight: 600 }}>{isFa ? "ساعت" : "hrs"}</span>
          </div>
          <p className={styles.statSubtext}>
            {isFa
              ? "صرفه‌جویی شده با تولید خودکار هوش مصنوعی"
              : "Saved through automated AI material generation"}
          </p>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <span>{isFa ? "منابع تولید شده" : "Materials Created"}</span>
            <span className={styles.statIcon}>✨</span>
          </div>
          <div className={styles.statValue}>{productivity.materials_count}</div>
          <p className={styles.statSubtext}>
            {isFa
              ? "طرح درس، کاربرگ، فعالیت و آزمون فعال"
              : "Lessons, activities, worksheets & assessments"}
          </p>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <span>{isFa ? "کلاس‌های متصل" : "Active Classes"}</span>
            <span className={styles.statIcon}>🎓</span>
          </div>
          <div className={styles.statValue}>{productivity.classes_count}</div>
          <p className={styles.statSubtext}>
            {isFa
              ? "کلاس‌های تحت مدیریت در Endoora"
              : "Managed student cohorts and classes"}
          </p>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <span>{isFa ? "خروجی‌های رسمی" : "Official Exports"}</span>
            <span className={styles.statIcon}>📄</span>
          </div>
          <div className={styles.statValue}>
            {usage.all_time.word_exports + usage.all_time.pdf_exports}
          </div>
          <p className={styles.statSubtext}>
            {isFa
              ? "اسناد رسمی Word (.docx) و PDF ایجاد شده"
              : "Formal Word and PDF documents generated"}
          </p>
        </div>
      </div>

      {/* Quota & Daily Limit Meter */}
      <div className={styles.quotaCard}>
        <div className={styles.quotaHeader}>
          <div>
            <h2 className={styles.quotaTitle}>
              {isFa ? "سهمیه روزانه هوش مصنوعی (Daily AI Quota)" : "Daily AI Quota & Limits"}
            </h2>
            <p className={styles.quotaSubtitle}>
              {isFa
                ? "سهمیه مصرف بر اساس طرح اشتراک روزانه محاسبه شده و هر روز ساعت ۰۰:۰۰ بامداد بازنشانی می‌گردد."
                : "Quotas reset daily at midnight IRST. Upgrade your tier for expanded limits."}
            </p>
          </div>
          <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--color-endoora-blue)" }}>
            {isFa
              ? `${usage.remaining_today} تولید باقی‌مانده امروز`
              : `${usage.remaining_today} generations remaining today`}
          </div>
        </div>

        <div className={styles.progressBarContainer}>
          <div className={styles.progressNumbers}>
            <span>{isFa ? "استفاده امروز:" : "Used Today:"} {usedToday}</span>
            <span>{usagePercent}%</span>
            <span>{isFa ? "سقف روزانه:" : "Daily Cap:"} {limitToday >= 999 ? (isFa ? "نامحدود" : "Unlimited") : limitToday}</span>
          </div>
          <div className={styles.progressBarTrack}>
            <div
              className={styles.progressBarFill}
              data-status={progressStatus}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>

        <div className={styles.quotaBreakdownGrid}>
          <div className={styles.breakdownItem}>
            <span>📖 {isFa ? "طرح درس‌ها:" : "Lessons:"}</span>
            <strong>{usage.breakdown.lesson}</strong>
          </div>
          <div className={styles.breakdownItem}>
            <span>🎭 {isFa ? "فعالیت‌ها:" : "Activities:"}</span>
            <strong>{usage.breakdown.activity}</strong>
          </div>
          <div className={styles.breakdownItem}>
            <span>📝 {isFa ? "کاربرگ‌ها:" : "Worksheets:"}</span>
            <strong>{usage.breakdown.worksheet}</strong>
          </div>
          <div className={styles.breakdownItem}>
            <span>📊 {isFa ? "کوییز و ارزیابی:" : "Assessments:"}</span>
            <strong>{usage.breakdown.assessment}</strong>
          </div>
          <div className={styles.breakdownItem}>
            <span>📑 {isFa ? "خروجی Word امروز:" : "Word Exports:"}</span>
            <strong>{usage.today.word_exports}</strong>
          </div>
          <div className={styles.breakdownItem}>
            <span>📄 {isFa ? "خروجی PDF امروز:" : "PDF Exports:"}</span>
            <strong>{usage.today.pdf_exports}</strong>
          </div>
        </div>
      </div>

      {/* Subscription Plans & Iranian Domestic Billing */}
      <div className={styles.plansSection}>
        <div className={styles.plansHeader}>
          <h2 className={styles.plansTitle}>
            {isFa ? "طرح‌های اشتراک حرفه‌ای مدرسین" : "TeacherOS Subscription Plans"}
          </h2>
          <p className={styles.plansSubtitle}>
            {isFa
              ? "امکان پرداخت مستقیم و آنی با کلیه کارت‌های عضو شبکه شتاب از طریق درگاه امن شاپرک / زرین‌پال"
              : "Instant activation with Iranian domestic Shetab payment cards via Zarinpal"}
          </p>
        </div>

        <div className={styles.plansGrid}>
          {available_plans.map((p) => {
            const isCurrent = plan.code === p.code;
            return (
              <div
                key={p.code}
                className={`${styles.planCard} ${p.is_popular ? styles.planCardPopular : ""}`}
              >
                {p.is_popular && (
                  <div className={styles.popularBadge}>
                    {isFa ? "محبوب‌ترین انتخاب مدرسین" : "Most Popular Choice"}
                  </div>
                )}

                <div>
                  <h3 className={styles.planName}>{isFa ? p.name_fa : p.name}</h3>
                  <div className={styles.planPrice}>
                    <span className={styles.priceAmount}>
                      {p.price_toman === 0
                        ? (isFa ? "رایگان" : "Free")
                        : p.price_toman.toLocaleString(isFa ? "fa-IR" : "en-US")}
                    </span>
                    {p.price_toman > 0 && (
                      <span className={styles.priceUnit}>
                        {isFa ? "تومان / ماهانه" : "Toman / month"}
                      </span>
                    )}
                  </div>

                  <ul className={styles.featuresList}>
                    {(isFa ? p.features_fa : p.features_en).map((feat, idx) => (
                      <li key={idx} className={styles.featureItem}>
                        <span className={styles.featureCheck}>✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: "auto", paddingTop: "16px" }}>
                  {isCurrent ? (
                    <div className={styles.currentPlanBadge}>
                      ✓ {isFa ? "طرح فعال فعلی شما" : "Current Active Plan"}
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      className={styles.upgradeBtn}
                      onClick={() => {
                        setReceipt(null);
                        setUpgradeTarget(p);
                      }}
                    >
                      💳 {isFa ? `ارتقا به ${p.name_fa}` : `Upgrade to ${p.name}`}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pedagogical Defaults Form */}
      {preferences && (
        <div className={styles.preferencesCard}>
          <div>
            <h2 className={styles.quotaTitle}>
              {isFa ? "پیش‌فرض‌ها و تنظیمات پداگوژیک (Pedagogical Defaults)" : "Pedagogical Preferences"}
            </h2>
            <p className={styles.quotaSubtitle}>
              {isFa
                ? "تنظیمات پیش‌فرض برای کلیه تولیدات هوش مصنوعی، استودیوی طرح درس و تصحیح رایتینگ"
                : "Default configurations applied across AI generation studios and feedback rubrics"}
            </p>
          </div>

          {prefsMessage && (
            <div style={{ padding: "12px 16px", background: "rgba(16,185,129,0.1)", border: "1px solid #10b981", borderRadius: "8px", color: "#10b981", fontSize: "0.9rem", fontWeight: 600 }}>
              {prefsMessage}
            </div>
          )}

          <form onSubmit={handleSavePreferences} className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{isFa ? "سطح پیش‌فرض CEFR:" : "Default CEFR Level:"}</label>
              <select
                className={styles.formSelect}
                value={preferences.default_cefr}
                onChange={(e) =>
                  setPreferences({ ...preferences, default_cefr: e.target.value })
                }
              >
                <option value="A1">A1 - Beginner</option>
                <option value="A2">A2 - Elementary</option>
                <option value="B1">B1 - Intermediate</option>
                <option value="B2">B2 - Upper-Intermediate</option>
                <option value="C1">C1 - Advanced</option>
                <option value="C2">C2 - Mastery</option>
              </select>
              <p className={styles.formHelp}>
                {isFa ? "سطح زبانی مبنا در استودیوی تولید طرح درس" : "Default proficiency level"}
              </p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{isFa ? "مدت زمان پیش‌فرض جلسه (دقیقه):" : "Default Duration (mins):"}</label>
              <select
                className={styles.formSelect}
                value={preferences.default_duration}
                onChange={(e) =>
                  setPreferences({ ...preferences, default_duration: Number(e.target.value) })
                }
              >
                <option value={45}>{isFa ? "۴۵ دقیقه" : "45 minutes"}</option>
                <option value={60}>{isFa ? "۶۰ دقیقه" : "60 minutes"}</option>
                <option value={90}>{isFa ? "۹۰ دقیقه" : "90 minutes"}</option>
                <option value={120}>{isFa ? "۱۲۰ دقیقه" : "120 minutes"}</option>
              </select>
              <p className={styles.formHelp}>
                {isFa ? "تقسیم‌بندی گام‌های زمانی کلاس" : "Timing distribution"}
              </p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{isFa ? "متدولوژی و چارچوب تدریس:" : "Teaching Framework:"}</label>
              <select
                className={styles.formSelect}
                value={preferences.preferred_methodology}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    preferred_methodology: e.target.value as "ppp" | "esa" | "tbl",
                  })
                }
              >
                <option value="ppp">PPP (Presentation, Practice, Production)</option>
                <option value="esa">ESA (Engage, Study, Activate)</option>
                <option value="tbl">TBL (Task-Based Learning)</option>
              </select>
              <p className={styles.formHelp}>
                {isFa ? "الگوی ساختاری طرح درس‌های تولیدی" : "Core lesson methodology"}
              </p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>{isFa ? "لحن بازخورد و تصحیح رایتینگ:" : "Marking & Feedback Tone:"}</label>
              <select
                className={styles.formSelect}
                value={preferences.feedback_tone}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    feedback_tone: e.target.value as "encouraging" | "balanced" | "rigorous",
                  })
                }
              >
                <option value="encouraging">{isFa ? "تشویقی و انگیزشی (Encouraging)" : "Encouraging"}</option>
                <option value="balanced">{isFa ? "متعادل و تحلیلی (Balanced)" : "Balanced"}</option>
                <option value="rigorous">{isFa ? "آکادمیک و دقیق (Rigorous / Academic)" : "Rigorous"}</option>
              </select>
              <p className={styles.formHelp}>
                {isFa ? "سبک بازخورد هوش مصنوعی در استودیوی نگارش" : "Feedback demeanor"}
              </p>
            </div>

            <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
              <label className={styles.checkboxLabel}>
                <Input
                  type="checkbox"
                  className={styles.checkboxInput}
                  checked={preferences.auto_generate_ccqs}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPreferences({ ...preferences, auto_generate_ccqs: e.target.checked })
                  }
                />
                <span>
                  {isFa
                    ? "تولید خودکار سوالات بررسی مفهوم (Concept Checking Questions - CCQs) در کلیه طرح درس‌ها"
                    : "Automatically generate Concept Checking Questions (CCQs) for vocabulary and grammar"}
                </span>
              </label>
            </div>

            <div style={{ gridColumn: "1 / -1", paddingTop: "8px" }}>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className={styles.savePreferencesBtn}
                loading={savingPrefs}
                disabled={savingPrefs}
              >
                {savingPrefs
                  ? (isFa ? "در حال ذخیره..." : "Saving...")
                  : (isFa ? "💾 ذخیره تنظیمات پداگوژیک" : "💾 Save Pedagogical Preferences")}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Upgrade Simulation Modal (Zarinpal) */}
      {upgradeTarget && (
        <div className={styles.modalOverlay} onClick={() => setUpgradeTarget(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 className={styles.modalTitle}>
                💳 {isFa ? "پرداخت امن شاپرک و زرین‌پال" : "Domestic Payment Simulation"}
              </h3>
              <Button
                type="button"
                variant="tertiary"
                size="sm"
                onClick={() => setUpgradeTarget(null)}
                style={{ background: "transparent", border: "none", color: "var(--color-muted)", fontSize: "1.4rem", cursor: "pointer" }}
              >
                ✕
              </Button>
            </div>

            {receipt ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "center", padding: "16px 0" }}>
                <div style={{ fontSize: "3rem" }}>🎉</div>
                <h4 style={{ margin: 0, fontSize: "1.2rem", color: "#10b981", fontWeight: 800 }}>
                  {isFa ? "پرداخت با موفقیت انجام و طرح فعال شد!" : "Payment successful & plan activated!"}
                </h4>
                <p style={{ margin: 0, color: "var(--color-muted)", fontSize: "0.9rem" }}>
                  {isFa
                    ? `اشتراک شما به ${receipt.plan_name} ارتقا یافت و سهمیه روزانه بلافاصله افزایش پیدا کرد.`
                    : `Your subscription has been upgraded to ${upgradeTarget.name}.`}
                </p>
                <div style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.88rem" }}>
                  <span>{isFa ? "کد پیگیری تراکنش (Ref ID):" : "Transaction Ref ID:"} </span>
                  <strong style={{ fontFamily: "monospace", color: "var(--color-endoora-blue)" }}>
                    {receipt.ref_id}
                  </strong>
                </div>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  className={styles.upgradeBtn}
                  onClick={() => setUpgradeTarget(null)}
                >
                  {isFa ? "متوجه شدم و بازگشت" : "Done"}
                </Button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className={styles.gatewayBadge}>
                  🔒 {isFa ? "درگاه پرداخت الکترونیک زرین‌پال (شاپرک)" : "Zarinpal Secure Shetab Gateway"}
                </div>

                <div style={{ background: "rgba(255,255,255,0.02)", padding: "14px", borderRadius: "8px", border: "1px solid var(--color-border)", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--color-muted)" }}>{isFa ? "طرح انتخابی:" : "Target Plan:"}</span>
                    <strong>{isFa ? upgradeTarget.name_fa : upgradeTarget.name}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--color-muted)" }}>{isFa ? "سهمیه روزانه جدید:" : "New Daily Cap:"}</span>
                    <strong style={{ color: "#10b981" }}>
                      {upgradeTarget.daily_limit >= 999 ? (isFa ? "نامحدود" : "Unlimited") : `${upgradeTarget.daily_limit} در روز`}
                    </strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "8px" }}>
                    <span style={{ color: "var(--color-muted)" }}>{isFa ? "مبلغ قابل پرداخت:" : "Total Payable:"}</span>
                    <strong style={{ fontSize: "1.2rem", color: "var(--color-endoora-blue)" }}>
                      {upgradeTarget.price_toman.toLocaleString(isFa ? "fa-IR" : "en-US")} {isFa ? "تومان" : "Toman"}
                    </strong>
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--color-muted)", lineHeight: 1.5 }}>
                  {isFa
                    ? "در محیط عملیاتی، این تراکنش مستقیماً به صفحه پرداخت اینترنتی شاپرک هدایت می‌شود. در این شبیه‌سازی، فعال‌سازی بلافاصله با کد پیگیری معتبر انجام می‌گیرد."
                    : "Simulated sandbox domestic payment with immediate activation."}
                </p>

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setUpgradeTarget(null)}
                    disabled={upgrading}
                  >
                    {isFa ? "انصراف" : "Cancel"}
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    className={styles.upgradeBtn}
                    onClick={handleConfirmUpgrade}
                    loading={upgrading}
                    disabled={upgrading}
                  >
                    {upgrading
                      ? (isFa ? "در حال اتصال به درگاه..." : "Connecting...")
                      : (isFa ? "تایید و پرداخت آنلاین" : "Confirm & Pay")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
