"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./admin-dashboard.module.css";
import {
  FeatureFlagRecord,
  fetchAdminFeatureFlags,
  toggleAdminFeatureFlag,
} from "../../lib/admin-ops";

export function FeatureFlagsOperations() {
  const [flags, setFlags] = useState<FeatureFlagRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal
  const [selectedFlagForToggle, setSelectedFlagForToggle] = useState<FeatureFlagRecord | null>(null);
  const [toggleReason, setToggleReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [rolloutVal, setRolloutVal] = useState<number>(100);
  const [killSwitchBehavior, setKillSwitchBehavior] = useState<string>("reviewed_fallback");

  const loadFlags = (query = searchQuery) => {
    setLoading(true);
    fetchAdminFeatureFlags(query)
      .then((data) => {
        setFlags(data.results);
      })
      .catch((err) => {
        console.error("Failed to load flags:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let ignore = false;
    fetchAdminFeatureFlags(searchQuery)
      .then((data) => {
        if (!ignore) {
          setFlags(data.results);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Failed to load flags:", err);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [searchQuery]);

  const handleOpenToggle = (flag: FeatureFlagRecord) => {
    setSelectedFlagForToggle(flag);
    setToggleReason("");
    setRolloutVal(flag.rollout_percentage);
    setKillSwitchBehavior(flag.kill_switch_behavior);
  };

  const handleConfirmToggle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFlagForToggle) return;

    if (!toggleReason.trim() || toggleReason.trim().length < 5) {
      alert("ذکر دلیل مستند ممیزی (حداقل ۵ کاراکتر) الزامی است.");
      return;
    }

    setIsSubmitting(true);
    try {
      await toggleAdminFeatureFlag(selectedFlagForToggle.key, {
        enabled: !selectedFlagForToggle.enabled,
        rollout_percentage: rolloutVal,
        kill_switch_behavior: killSwitchBehavior,
        reason: toggleReason.trim(),
      });
      setSelectedFlagForToggle(null);
      loadFlags();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطا در به‌روزرسانی کلید ویژگی";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container} dir="rtl">
      {/* Navigation Ribbon */}
      <nav className={styles.opsRibbon} aria-label="ناوبری ارشد عملیاتی">
        <Link href="/admin" className={styles.opsTab}>
          میز مدیریت کل (Overview)
        </Link>
        <Link href="/operations/flags" className={`${styles.opsTab} ${styles.opsTabActive}`}>
          کلیدهای ویژگی و کیل‌سوئیچ (OPS-002)
        </Link>
        <Link href="/operations/audit" className={styles.opsTab}>
          ردپای ممیزی تغییرات (OPS-003)
        </Link>
        <Link href="/operations/security" className={styles.opsTab}>
          🛡️ امنیت (SEC-001)
        </Link>
        <Link href="/operations/privacy" className={styles.opsTab}>
          🛡️ حریم خصوصی (Privacy)
        </Link>
        <Link href="/operations/pen-test" className={styles.opsTab}>
          🔍 آزمون نفوذ (Pen-Test)
        </Link>
        <Link href="/operations/disaster-recovery" className={styles.opsTab}>
          💾 بازیابی بحران (OPS-004)
        </Link>
        <Link href="/operations/courses" className={styles.opsTab}>
          مدیریت دوره‌ها (CONTENT-003)
        </Link>
        <Link href="/operations/content" className={styles.opsTab}>
          محتوا و فرهنگ (CONTENT-004)
        </Link>
        <Link href="/operations/questions" className={styles.opsTab}>
          بانک سوالات (QUESTION-001)
        </Link>
        <Link href="/operations/taxonomy" className={styles.opsTab}>
          درخت مهارت‌ها (TAXONOMY-001)
        </Link>
      </nav>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>مدیریت کلیدهای ویژگی و کیل‌سوئیچ‌ها (OPS-002)</h1>
          <p className={styles.subtitle}>
            پیکربندی قابلیت‌های نرم‌افزاری، درصد انتشار تدریجی (Canary Rollout)، و رفتارهای اضطراری قطعی خدمت
          </p>
        </div>

        <div className={styles.headerActions}>
          <input
            type="text"
            placeholder="جستجوی کلید ویژگی یا مالک..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.formInput}
            style={{ inlineSize: "280px" }}
          />
        </div>
      </header>

      {/* Flags List Panel */}
      <section className={styles.panelBox}>
        {loading ? (
          <div style={{ textAlign: "center", paddingBlock: "var(--space-8)" }}>در حال بارگذاری کلیدهای ویژگی...</div>
        ) : flags.length === 0 ? (
          <div style={{ textAlign: "center", paddingBlock: "var(--space-8)" }}>هیچ کلید ویژگی یافت نشد.</div>
        ) : (
          <div className={styles.flagsList}>
            {flags.map((flag) => (
              <div key={flag.key} className={styles.flagItem}>
                <div className={styles.flagMeta}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                    <span className={styles.flagKey}>{flag.key}</span>
                    <span
                      style={{
                        fontSize: "var(--font-size-micro)",
                        paddingInline: "var(--space-2)",
                        paddingBlock: "2px",
                        borderRadius: "var(--radius-pill)",
                        backgroundColor: "var(--color-surface-muted)",
                      }}
                    >
                      مالک: {flag.owner}
                    </span>
                    <span
                      style={{
                        fontSize: "var(--font-size-micro)",
                        paddingInline: "var(--space-2)",
                        paddingBlock: "2px",
                        borderRadius: "var(--radius-pill)",
                        backgroundColor: "var(--color-surface-muted)",
                      }}
                    >
                      انتشار: {flag.rollout_percentage}%
                    </span>
                  </div>
                  <span className={styles.flagRationale}>{flag.rationale}</span>
                  <div style={{ fontSize: "var(--font-size-micro)", color: "var(--color-text-muted)", marginBlockStart: "4px" }}>
                    محیط‌ها: {flag.environments.join(", ")} | رفتار کیل‌سوئیچ: <code>{flag.kill_switch_behavior}</code>
                  </div>
                </div>

                <div className={styles.flagControls}>
                  <button
                    onClick={() => handleOpenToggle(flag)}
                    className={`${styles.toggleSwitch} ${flag.enabled ? styles.toggleSwitchActive : ""}`}
                  >
                    {flag.enabled ? "فعال (Online)" : "غیرفعال (Offline)"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Toggle Modal */}
      {selectedFlagForToggle && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                تنظیم وضعیت کلید ویژگی: <code>{selectedFlagForToggle.key}</code>
              </h2>
              <button onClick={() => setSelectedFlagForToggle(null)} className={styles.closeBtn}>
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmToggle}>
              <div className={styles.modalBody}>
                <div className={`${styles.alertBox} ${styles.alertWarning}`}>
                  توجه: هرگونه تغییر در کلیدهای ویژگی پلتفرم به صورت دائمی در لاگ ممیزی امنیتی با آدرس IP و شناسه
                  حساب کاربری شما ذخیره خواهد شد.
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>تغییر وضعیت فعال‌سازی:</label>
                  <div>
                    از وضعیت <strong>{selectedFlagForToggle.enabled ? "«فعال»" : "«غیرفعال»"}</strong> به وضعیت{" "}
                    <strong style={{ color: selectedFlagForToggle.enabled ? "var(--color-error)" : "var(--color-success)" }}>
                      {selectedFlagForToggle.enabled ? "«غیرفعال»" : "«فعال»"}
                    </strong>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>درصد انتشار تدریجی (Rollout Percentage): {rolloutVal}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={rolloutVal}
                    onChange={(e) => setRolloutVal(Number(e.target.value))}
                    style={{ inlineSize: "100%" }}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>رفتار اضطراری کیل‌سوئیچ (Kill-Switch Behavior):</label>
                  <select
                    value={killSwitchBehavior}
                    onChange={(e) => setKillSwitchBehavior(e.target.value)}
                    className={styles.formSelect}
                  >
                    <option value="disable_feature">قطع کامل ویژگی (Disable Feature)</option>
                    <option value="reviewed_fallback">استفاده از محتوای بازبینی‌شده جایگزین (Reviewed Fallback)</option>
                    <option value="read_only">حالت فقط‌خواندنی (Read-Only)</option>
                    <option value="retry_later">تلاش مجدد در آینده (Retry Later)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>دلیل مستند ممیزی (Mandatory Reason) *</label>
                  <textarea
                    required
                    value={toggleReason}
                    onChange={(e) => setToggleReason(e.target.value)}
                    className={styles.formTextarea}
                    rows={3}
                    placeholder="علت تغییر وضعیت و ارجاع به تیکت یا مصوبه عملیاتی..."
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setSelectedFlagForToggle(null)}
                  className={styles.secondaryBtn}
                  disabled={isSubmitting}
                >
                  انصراف
                </button>
                <button type="submit" className={styles.primaryBtn} disabled={isSubmitting}>
                  {isSubmitting ? "در حال ثبت..." : "ثبت و اعمال تغییر"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
