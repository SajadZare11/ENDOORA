"use client";

import { Button } from "@endoora/ui";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./admin-dashboard.module.css";
import {
  AdminDashboardStats,
  AuditEventRecord,
  FeatureFlagRecord,
  fetchAdminAuditLogs,
  fetchAdminFeatureFlags,
  fetchAdminStats,
  toggleAdminFeatureFlag,
} from "../../lib/admin-ops";

export function AdminOperationsDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [flags, setFlags] = useState<FeatureFlagRecord[]>([]);
  const [recentAudits, setRecentAudits] = useState<AuditEventRecord[]>([]);

  // Toggle modal state
  const [selectedFlagForToggle, setSelectedFlagForToggle] = useState<FeatureFlagRecord | null>(null);
  const [toggleReason, setToggleReason] = useState<string>("");
  const [isSubmittingToggle, setIsSubmittingToggle] = useState<boolean>(false);

  const loadDashboardData = () => {
    Promise.all([
      fetchAdminStats(),
      fetchAdminFeatureFlags(),
      fetchAdminAuditLogs({ limit: 6 }),
    ])
      .then(([statsRes, flagsRes, auditRes]) => {
        setStats(statsRes);
        setFlags(flagsRes.results);
        setRecentAudits(auditRes.results);
      })
      .catch((err) => {
        console.error("Failed to load admin stats:", err);
      });
  };

  useEffect(() => {
    let ignore = false;
    Promise.all([
      fetchAdminStats(),
      fetchAdminFeatureFlags(),
      fetchAdminAuditLogs({ limit: 6 }),
    ])
      .then(([statsRes, flagsRes, auditRes]) => {
        if (!ignore) {
          setStats(statsRes);
          setFlags(flagsRes.results);
          setRecentAudits(auditRes.results);
        }
      })
      .catch((err) => {
        console.error("Failed to load admin stats:", err);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleOpenToggle = (flag: FeatureFlagRecord) => {
    setSelectedFlagForToggle(flag);
    setToggleReason("");
  };

  const handleConfirmToggle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFlagForToggle) return;

    if (!toggleReason.trim() || toggleReason.trim().length < 5) {
      alert("ذکر دلیل مستند ممیزی (حداقل ۵ کاراکتر) برای تغییر وضعیت کلید ویژگی الزامی است.");
      return;
    }

    setIsSubmittingToggle(true);
    try {
      await toggleAdminFeatureFlag(selectedFlagForToggle.key, {
        enabled: !selectedFlagForToggle.enabled,
        reason: toggleReason.trim(),
      });
      setSelectedFlagForToggle(null);
      setToggleReason("");
      loadDashboardData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "خطا در تغییر وضعیت ویژگی";
      alert(msg);
    } finally {
      setIsSubmittingToggle(false);
    }
  };

  return (
    <div className={styles.container} dir="rtl">
      {/* 1. Operations Navigation Ribbon */}
      <nav className={styles.opsRibbon} aria-label="ناوبری ارشد عملیاتی">
        <Link href="/admin" className={`${styles.opsTab} ${styles.opsTabActive}`}>
          میز مدیریت کل (Overview)
        </Link>
        <Link href="/operations/flags" className={styles.opsTab}>
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
        <Link href="/operations/ai" className={styles.opsTab}>
          🤖 مدل‌ها و پرامپت‌ها (OPS-005)
        </Link>
        <Link href="/operations/monitoring" className={styles.opsTab}>
          📊 پایش و لاگ‌ها (OPS-006)
        </Link>
        <Link href="/operations/analytics" className={styles.opsTab}>
          📈 تحلیل محصول و فانل (OPS-007)
        </Link>
        <Link href="/operations/pwa" className={styles.opsTab}>
          📱 PWA و تاب‌آوری آفلاین (OPS-008)
        </Link>
        <Link href="/operations/incidents" className={styles.opsTab}>
          🚨 مدیریت بحران و ران‌بوک‌ها (OPS-009)
        </Link>
        <Link href="/operations/launch" className={styles.opsTab}>
          🚀 پروداکشن و لانچ نهایی (LAUNCH-001)
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

      {/* 2. Executive Header */}
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>مرکز فرماندهی و مدیریت عملیات ایندورا (OPS-001)</h1>
            <div className={styles.statusBadgeLive}>
              <span className={styles.pulseDot} />
              <span>سامانه عملیاتی پایدار (99.98% SLA)</span>
            </div>
          </div>
          <p className={styles.subtitle}>
            پایش بلادرنگ کاربران، صف‌های بازبینی محتوا، احراز هویت اساتید، خزانه‌داری و کلیدهای اضطراری قطع خدمت
          </p>
        </div>

        <div className={styles.headerActions}>
          <Link href="/operations/flags" className={styles.secondaryBtn}>
            مدیریت کیل‌سوئیچ‌ها
          </Link>
          <Link href="/operations/audit" className={styles.secondaryBtn}>
            مشاهده گزارشات ممیزی
          </Link>
          <Button onClick={loadDashboardData} className={styles.primaryBtn}>
            به‌روزرسانی داده‌ها
          </Button>
        </div>
      </header>

      {/* 3. Primary Telemetry KPI Grid */}
      {stats && (
        <section className={styles.telemetryGrid}>
          {/* Card 1: Users */}
          <div className={styles.telemetryCard}>
            <div className={styles.telemetryCardTitle}>
              <span>کل کاربران پلتفرم</span>
              <span>👥</span>
            </div>
            <div className={styles.telemetryCardValue}>
              {stats.users.total.toLocaleString("fa-IR")}
            </div>
            <div className={styles.telemetryBreakdown}>
              <div className={styles.breakdownRow}>
                <span>زبان‌آموزان:</span>
                <strong>{stats.users.by_role.learner?.toLocaleString("fa-IR")}</strong>
              </div>
              <div className={styles.breakdownRow}>
                <span>مدرسان و اساتید:</span>
                <strong>{stats.users.by_role.teacher?.toLocaleString("fa-IR")}</strong>
              </div>
              <div className={styles.breakdownRow}>
                <span>دبیران تحریریه:</span>
                <strong>{stats.users.by_role.editor?.toLocaleString("fa-IR")}</strong>
              </div>
            </div>
          </div>

          {/* Card 2: Content Review Queues */}
          <div className={styles.telemetryCard}>
            <div className={styles.telemetryCardTitle}>
              <span>صف بازبینی محتوا و سوالات</span>
              <span>📋</span>
            </div>
            <div className={styles.telemetryCardValue} style={{ color: "var(--color-warning)" }}>
              {stats.review_queues.total_in_review.toLocaleString("fa-IR")}
            </div>
            <div className={styles.telemetryBreakdown}>
              <div className={styles.breakdownRow}>
                <span>دوره‌های آموزشی:</span>
                <strong>{stats.review_queues.courses_in_review}</strong>
              </div>
              <div className={styles.breakdownRow}>
                <span>مقالات و دروس مهارتی:</span>
                <strong>{stats.review_queues.content_items_in_review}</strong>
              </div>
              <div className={styles.breakdownRow}>
                <span>سوالات آزمونک‌ها:</span>
                <strong>{stats.review_queues.questions_in_review}</strong>
              </div>
            </div>
          </div>

          {/* Card 3: Teacher Verification & Moderation */}
          <div className={styles.telemetryCard}>
            <div className={styles.telemetryCardTitle}>
              <span>احراز صلاحیت و نظارت</span>
              <span>🛡️</span>
            </div>
            <div className={styles.telemetryCardValue}>
              {stats.teacher_verification.pending_verifications.toLocaleString("fa-IR")}
            </div>
            <div className={styles.telemetryBreakdown}>
              <div className={styles.breakdownRow}>
                <span>اساتید در انتظار تایید مدارک:</span>
                <strong style={{ color: "var(--color-warning)" }}>
                  {stats.teacher_verification.pending_verifications}
                </strong>
              </div>
              <div className={styles.breakdownRow}>
                <span>اساتید احراز هویت شده:</span>
                <strong>{stats.teacher_verification.verified_teachers}</strong>
              </div>
              <div className={styles.breakdownRow}>
                <span>گزارش‌های تخلف معلق:</span>
                <strong style={{ color: stats.moderation.pending_reports > 0 ? "var(--color-error)" : "inherit" }}>
                  {stats.moderation.pending_reports}
                </strong>
              </div>
            </div>
          </div>

          {/* Card 4: Treasury & Financial Reconciliation */}
          <div className={styles.telemetryCard}>
            <div className={styles.telemetryCardTitle}>
              <span>خزانه‌داری و گردش مالی</span>
              <span>💳</span>
            </div>
            <div className={styles.telemetryCardValue} style={{ color: "var(--color-success)" }}>
              {(stats.treasury.total_platform_commission_toman / 1000000).toLocaleString("fa-IR")}{" "}
              <span style={{ fontSize: "var(--font-size-small)" }}>م.ت</span>
            </div>
            <div className={styles.telemetryBreakdown}>
              <div className={styles.breakdownRow}>
                <span>کارمزد ناخالص پلتفرم:</span>
                <strong>{stats.treasury.total_platform_commission_toman.toLocaleString("fa-IR")} تومان</strong>
              </div>
              <div className={styles.breakdownRow}>
                <span>مطالبات قابل تسویه اساتید:</span>
                <strong>{stats.treasury.total_teacher_payables_toman.toLocaleString("fa-IR")} تومان</strong>
              </div>
              <div className={styles.breakdownRow}>
                <span>سپرده امانی معلق (Escrow):</span>
                <strong>{stats.treasury.pending_escrow_toman.toLocaleString("fa-IR")} تومان</strong>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Dual Column Panel: Emergency Kill Switches & Immutable Audit Trail */}
      <div className={styles.dualLayout}>
        {/* Panel A: Emergency Kill Switches */}
        <section className={styles.panelBox}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>کلیدهای فوری قطع خدمت (Kill Switches)</h2>
              <p className={styles.sectionSubtitle}>
                کنترل وضعیت فعال‌سازی قابلیت‌های حیاتی با امکان قطع فوری در زمان رخداد امنیتی یا قطعی سرویس
              </p>
            </div>
            <Link href="/operations/flags" className={styles.secondaryBtn}>
              مشاهده همه
            </Link>
          </div>

          <div className={styles.flagsList}>
            {flags.slice(0, 4).map((flag) => (
              <div key={flag.key} className={styles.flagItem}>
                <div className={styles.flagMeta}>
                  <span className={styles.flagKey}>{flag.key}</span>
                  <span className={styles.flagRationale}>{flag.rationale}</span>
                </div>
                <div className={styles.flagControls}>
                  <Button
                    onClick={() => handleOpenToggle(flag)}
                    className={`${styles.toggleSwitch} ${flag.enabled ? styles.toggleSwitchActive : ""}`}
                  >
                    {flag.enabled ? "فعال (Online)" : "غیرفعال (Offline)"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Panel B: Immutable Audit Log Stream */}
        <section className={styles.panelBox}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>ردپای ممیزی و تغییرات حساس (Audit Trail)</h2>
              <p className={styles.sectionSubtitle}>
                ثبت تغییرات غیرقابل‌حذف (Append-only) همراه با مشخصات کاربر، اقدام و دلیل مستند
              </p>
            </div>
            <Link href="/operations/audit" className={styles.secondaryBtn}>
              دفترچه رویدادها
            </Link>
          </div>

          <div className={styles.auditFeed}>
            {recentAudits.map((audit) => {
              const badgeClass =
                audit.action === "create"
                  ? styles.auditActionCreate
                  : audit.action === "delete"
                  ? styles.auditActionDelete
                  : styles.auditActionUpdate;

              return (
                <div key={audit.id} className={styles.auditRow}>
                  <div className={styles.auditHeader}>
                    <span>
                      {audit.actor_email} ({audit.actor_role})
                    </span>
                    <span className={`${styles.auditActionBadge} ${badgeClass}`}>{audit.action}</span>
                  </div>
                  <div className={styles.auditReason}>{audit.reason}</div>
                  <div className={styles.auditTarget}>
                    موجودیت: {audit.target_app}.{audit.target_model} [{audit.target_pk}]
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* 5. Infrastructure Health Telemetry */}
      {stats && (
        <section className={styles.panelBox} style={{ marginBlockStart: "var(--space-2)" }}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>وضعیت زیرساخت و سرویس‌های پشتیبان</h3>
            <span style={{ fontSize: "var(--font-size-micro)", color: "var(--color-text-muted)" }}>
              آخرین ارزیابی سلامت: {new Date(stats.system_health.evaluated_at).toLocaleTimeString("fa-IR")}
            </span>
          </div>
          <div style={{ display: "flex", gap: "var(--space-6)", flexWrap: "wrap", fontSize: "var(--font-size-small)" }}>
            <div>
              دیتابیس اصلی: <strong>{stats.system_health.database}</strong>
            </div>
            <div>
              سیستم کش توزیع‌شده: <strong>{stats.system_health.cache}</strong>
            </div>
            <div>
              صف کارگزاران ناهمگام: <strong>عملیاتی (Celery Workers: Healthy)</strong>
            </div>
          </div>
        </section>
      )}

      {/* 6. Feature Flag Toggle Confirmation Modal */}
      {selectedFlagForToggle && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                تغییر وضعیت کلید ویژگی: <code>{selectedFlagForToggle.key}</code>
              </h2>
              <Button onClick={() => setSelectedFlagForToggle(null)} className={styles.closeBtn}>
                ✕
              </Button>
            </div>

            <form onSubmit={handleConfirmToggle}>
              <div className={styles.modalBody}>
                <div className={`${styles.alertBox} ${styles.alertWarning}`}>
                  هشدار امنیتی: تغییر وضعیت این کلید بلافاصله در تمام لایه‌های وب، اپلیکیشن و سرور اعمال شده و به
                  عنوان یک رویداد حساس ممیزی با هویت شما ثبت خواهد شد.
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>اقدام اجرایی:</label>
                  <div>
                    تغییر از وضعیت{" "}
                    <strong>{selectedFlagForToggle.enabled ? "«فعال»" : "«غیرفعال»"}</strong> به وضعیت{" "}
                    <strong style={{ color: selectedFlagForToggle.enabled ? "var(--color-error)" : "var(--color-success)" }}>
                      {selectedFlagForToggle.enabled ? "«غیرفعال / قطع خدمت»" : "«فعال‌سازی»"}
                    </strong>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>دلیل مستند تغییر (Mandatory Audit Reason) *</label>
                  <textarea
                    required
                    value={toggleReason}
                    onChange={(e) => setToggleReason(e.target.value)}
                    className={styles.formTextarea}
                    rows={3}
                    placeholder="علت فعال‌سازی یا قطع فوری سرویس (مثلاً: رخداد قطعی پرووایدر صوتی، تست بارگذاری)..."
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <Button
                  type="button"
                  onClick={() => setSelectedFlagForToggle(null)}
                  className={styles.secondaryBtn}
                  disabled={isSubmittingToggle}
                >
                  انصراف
                </Button>
                <Button
                  type="submit"
                  className={styles.primaryBtn}
                  disabled={isSubmittingToggle}
                >
                  {isSubmittingToggle ? "در حال ثبت..." : "تایید و اعمال فوری تغییر"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
