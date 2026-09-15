"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./disaster-recovery.module.css";
import {
  fetchDRTelemetry,
  fetchBackups,
  triggerBackup,
  verifyBackup,
  fetchFailoverDrill,
  DisasterRecoveryTelemetry,
  DatabaseBackupSnapshot,
  FailoverDrillReport,
} from "../../lib/dr-ops";

const OPERATIONS_TABS = [
  { label: "طبقه‌بندی", href: "/operations/taxonomy" },
  { label: "سوالات", href: "/operations/questions" },
  { label: "دوره‌ها", href: "/operations/courses" },
  { label: "محتوا", href: "/operations/content" },
  { label: "مدیریت", href: "/admin" },
  { label: "پرچم‌ها", href: "/operations/flags" },
  { label: "حسابرسی", href: "/operations/audit" },
  { label: "امنیت", href: "/operations/security" },
  { label: "حریم خصوصی", href: "/operations/privacy" },
  { label: "آزمون نفوذ", href: "/operations/pen-test" },
  { label: "بازیابی بحران", href: "/operations/disaster-recovery" },
  { label: "مدل‌ها و پرامپت‌ها", href: "/operations/ai" },
  { label: "پایش و لاگ‌ها", href: "/operations/monitoring" },
  { label: "تحلیل محصول", href: "/operations/analytics" },
  { label: "PWA و آفلاین", href: "/operations/pwa" },
  { label: "مدیریت بحران", href: "/operations/incidents" },
];

export function DisasterRecoveryOperationsDashboard() {
  const pathname = usePathname();
  const [telemetry, setTelemetry] = useState<DisasterRecoveryTelemetry | null>(null);
  const [backups, setBackups] = useState<DatabaseBackupSnapshot[]>([]);
  const [drill, setDrill] = useState<FailoverDrillReport | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [backupType, setBackupType] = useState<"full" | "differential" | "wal_archive">("full");
  const [verifyImmediately, setVerifyImmediately] = useState(true);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [telData, backupData, drillData] = await Promise.all([
          fetchDRTelemetry(),
          fetchBackups(),
          fetchFailoverDrill(),
        ]);
        setTelemetry(telData);
        setBackups(backupData);
        setDrill(drillData);
      } catch (err) {
        console.error("Failed loading DR data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleTriggerBackup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newSnapshot = await triggerBackup({
        backup_type: backupType,
        verify_immediately: verifyImmediately,
        notes,
      });
      setBackups((prev) => [newSnapshot, ...prev]);
      setIsModalOpen(false);
      setNotes("");
      setActionSuccessMessage(`بکاپ جدید (${newSnapshot.backup_type}) با موفقیت ایجاد گردید.`);
      setTimeout(() => setActionSuccessMessage(null), 5000);
    } catch (err) {
      console.error("Failed triggering backup:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyBackup = async (id: string) => {
    setVerifyingId(id);
    try {
      const res = await verifyBackup(id);
      setBackups((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...res.snapshot } : b))
      );
      setActionSuccessMessage(`صحت هش SHA-256 برای بکاپ با موفقیت تأیید شد (${res.verification.verification_duration_ms}ms).`);
      setTimeout(() => setActionSuccessMessage(null), 5000);
    } catch (err) {
      console.error("Failed verifying backup:", err);
    } finally {
      setVerifyingId(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p>در حال بارگذاری وضعیت زیرساخت پایداری و بازیابی بحران...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 11-Tab Operations Ribbon */}
      <nav className={styles.opsRibbon} aria-label="ناوبری عملیات پلتفرم">
        {OPERATIONS_TABS.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`${styles.opsTab} ${isActive ? styles.opsTabActive : ""}`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>
            کنسول بازیابی بحران و تکرار پایگاه داده (OPS-004)
          </h1>
          <p className={styles.headerDesc}>
            نظارت بر تکرار جاری PostgreSQL 16، وضعیت افزونگی Redis Sentinel، مدیریت نسخه‌های پشتیبان رمزنگاری‌شده و شبیه‌سازی مانور بازیابی
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() => setIsModalOpen(true)}
          >
            <span>💾</span> ایجاد بکاپ فوری (On-Demand Backup)
          </button>
        </div>
      </header>

      {/* Feedback Banner */}
      {actionSuccessMessage && (
        <div
          role="status"
          style={{
            background: "var(--color-success-bg)",
            color: "var(--color-success-text)",
            padding: "var(--space-3) var(--space-4)",
            borderRadius: "var(--radius-md)",
            marginBlockEnd: "var(--space-6)",
            fontSize: "var(--font-size-meta)",
            fontWeight: 600,
          }}
        >
          ✅ {actionSuccessMessage}
        </div>
      )}

      {/* Posture KPIs */}
      <section className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>وضعیت کلاستر پایگاه داده</span>
          <span className={styles.kpiValue}>
            {telemetry?.cluster_health === "OPTIMAL" ? "سالم و بهینه" : "نیاز به بررسی"}
          </span>
          <span className={styles.badgeSuccess}>
            {telemetry?.cluster_health} ({telemetry?.topology.healthy_nodes}/{telemetry?.topology.total_nodes} نود فعال)
          </span>
          <span className={styles.kpiDetail}>
            کلاستر {telemetry?.cluster_name} با Patroni 3.2
          </span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>هدف RPO (حداکثر زمان اتلاف داده)</span>
          <span className={styles.kpiValue}>
            {telemetry?.sla_metrics.rpo_current_display.includes("صفر") ? "صفر ثانیه" : "کمتر از ۵ دقیقه"}
          </span>
          <span className={styles.badgeSuccess}>
            SLA: {telemetry?.sla_metrics.rpo_target_display} (تأیید شده)
          </span>
          <span className={styles.kpiDetail}>
            تاخیر همگام‌سازی فعلی: {telemetry?.sla_metrics.rpo_current_exposure_seconds}s
          </span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>هدف RTO (زمان بازگشت به سرویس)</span>
          <span className={styles.kpiValue}>
            {telemetry?.sla_metrics.rto_projected_display.split(" ")[0]}
          </span>
          <span className={styles.badgeSuccess}>
            SLA: {telemetry?.sla_metrics.rto_target_display} (تأیید شده)
          </span>
          <span className={styles.kpiDetail}>
            انتقال خودکار لیدر و تغییر مسیر در PgBouncer
          </span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>سلامت نسخه‌های پشتیبان</span>
          <span className={styles.kpiValue}>
            {telemetry?.backup_summary.health_percentage}٪
          </span>
          <span className={styles.badgeSuccess}>
            {telemetry?.backup_summary.verified_backups} نسخه تأیید شده
          </span>
          <span className={styles.kpiDetail}>
            حجم کل: {((telemetry?.backup_summary.total_storage_bytes || 0) / (1024 * 1024)).toFixed(1)} مگابایت
          </span>
        </div>
      </section>

      {/* HA Cluster Topology Visualizer */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span>🌐</span> توپولوژی کلاستر پایگاه داده (PostgreSQL 16 HA Cluster)
        </h2>
        <p className={styles.sectionSubtitle}>
          پیکربندی تکرار جریانی با نود اصلی (Read/Write)، نود همگام (Synchronous Standby) و نود غیرهمگام بین‌مرکزداده‌ای (Cross-DC Async Replica)
        </p>

        <div className={styles.topologyGrid}>
          {telemetry?.nodes.map((node) => {
            const isPrimary = node.role === "primary";
            const isSync = node.role === "standby_sync";
            const cardClass = isPrimary
              ? `${styles.nodeCard} ${styles.nodeCardPrimary}`
              : isSync
              ? `${styles.nodeCard} ${styles.nodeCardSync}`
              : `${styles.nodeCard} ${styles.nodeCardAsync}`;

            return (
              <div key={node.id} className={cardClass}>
                <div className={styles.nodeHeader}>
                  <span className={styles.nodeTitle}>{node.name}</span>
                  <span className={node.is_healthy ? styles.badgeSuccess : styles.badgeWarning}>
                    {node.is_healthy ? "فعال و برخط" : "خطا"}
                  </span>
                </div>
                <div className={styles.nodeDetails}>
                  <div><strong>نقش:</strong> {node.role_display}</div>
                  <div><strong>مرکز داده:</strong> {node.metadata?.datacenter || "tehran-dc1"}</div>
                  <div><strong>نسخه:</strong> {node.metadata?.pg_version || "PostgreSQL 16"}</div>
                  <div><strong>آدرس داخلی:</strong> <code>{node.endpoint}</code></div>
                  <div>
                    <strong>تاخیر تکرار (Lag):</strong>{" "}
                    {node.replication_lag_ms} میلی‌ثانیه ({node.replication_lag_bytes} بایت)
                  </div>
                  <div>
                    <strong>وضعیت همگام‌سازی:</strong> {node.metadata?.sync_state || "master"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Redis Sentinel Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "var(--space-3) var(--space-4)",
            background: "var(--color-canvas)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
            fontSize: "var(--font-size-meta)",
            flexWrap: "wrap",
            gap: "var(--space-2)",
          }}
        >
          <div>
            <strong>افزونگی حافظه نهان (Redis Sentinel HA):</strong> وضعیت {telemetry?.redis_sentinel.status} | حد نصاب {telemetry?.redis_sentinel.quorum}
          </div>
          <div>
            مستر فعال: <code>{telemetry?.redis_sentinel.master}</code> ({telemetry?.redis_sentinel.replicas_count} رپلیکا)
          </div>
        </div>
      </section>

      {/* Backups Inventory & Verification Table */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span>📦</span> تاریخچه نسخه‌های پشتیبان و اعتبارسنجی رمزنگاری (Encrypted Backups)
        </h2>
        <p className={styles.sectionSubtitle}>
          نسخه‌های پشتیبان با الگوریتم AES-256-GCM رمزنگاری شده و هش SHA-256 جهت اطمینان از یکپارچگی داده‌ها ذخیره می‌گردد.
        </p>

        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>شناسه</th>
                <th>نوع نسخه</th>
                <th>اندازه</th>
                <th>تعداد جدول</th>
                <th>محل ذخیره‌سازی</th>
                <th>هش یکپارچگی (SHA-256)</th>
                <th>وضعیت</th>
                <th>زمان ایجاد</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((b) => (
                <tr key={b.id}>
                  <td><code>{b.id.slice(0, 8)}...</code></td>
                  <td>{b.backup_type_display || b.backup_type}</td>
                  <td>{(b.file_size_bytes / (1024 * 1024)).toFixed(1)} MB</td>
                  <td>{b.table_count} جدول</td>
                  <td><code>{b.storage_location}</code></td>
                  <td className={styles.checksumCell} title={b.checksum_sha256}>
                    {b.checksum_sha256 ? `${b.checksum_sha256.slice(0, 16)}...` : "-"}
                  </td>
                  <td>
                    <span className={b.status === "verified" ? styles.badgeSuccess : styles.badgeWarning}>
                      {b.status === "verified" ? "✅ تأیید شده" : "⏳ تکمیل شده"}
                    </span>
                  </td>
                  <td>{new Date(b.created_at).toLocaleString("fa-IR")}</td>
                  <td>
                    {b.status === "verified" ? (
                      <span style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>
                        تأیید شده ({b.verification_duration_ms}ms)
                      </span>
                    ) : (
                      <button
                        type="button"
                        className={styles.secondaryBtn}
                        onClick={() => handleVerifyBackup(b.id)}
                        disabled={verifyingId === b.id}
                      >
                        {verifyingId === b.id ? "در حال بررسی..." : "🔍 بررسی صحت"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Failover Drill Runbook & Simulation */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span>⚡</span> شبیه‌سازی مانور انتقال خودکار در بحران (Failover Simulation Drill)
        </h2>
        <p className={styles.sectionSubtitle}>
          راه‌کنش و توالی عملیات خودکار جابجایی لیدر در هنگام قطعی نود اصلی پایگاه داده بدون توقف سرویس و حفظ تغییرناپذیری دفترکل
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "var(--space-3) var(--space-4)",
            background: "var(--color-canvas)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
            marginBlockEnd: "var(--space-4)",
            fontSize: "var(--font-size-meta)",
            flexWrap: "wrap",
            gap: "var(--space-2)",
          }}
        >
          <div>
            <strong>چارچوب مدیریت بحران:</strong> {drill?.framework}
          </div>
          <div>
            <strong>زمان کل مانور:</strong> {drill?.estimated_total_time_seconds} ثانیه (
            <span style={{ color: "var(--color-success-text)", fontWeight: 600 }}>
              {drill?.compliance_result}
            </span>
            )
          </div>
        </div>

        <div className={styles.drillStepList}>
          {drill?.steps.map((step) => (
            <div key={step.step_number} className={styles.drillStep}>
              <div className={styles.stepNumber}>{step.step_number}</div>
              <div className={styles.stepInfo}>
                <div className={styles.stepTitle}>
                  {step.name} <span style={{ color: "var(--color-muted)", fontSize: "0.8125rem" }}>({step.name_en})</span>
                </div>
                <div className={styles.stepDesc}>
                  مکانیسم تأیید: <code>{step.verification_check}</code>
                </div>
              </div>
              <div className={styles.stepDuration}>
                ~{step.estimated_duration_sec} ثانیه
              </div>
              <span className={styles.badgeSuccess}>{step.status}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Modal for Creating Instant Backup */}
      {isModalOpen && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>ایجاد نسخه پشتیبان فوری (On-Demand Backup)</h2>
            <form onSubmit={handleTriggerBackup}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="dr-backup-type">
                  نوع نسخه پشتیبان:
                </label>
                <select
                  id="dr-backup-type"
                  className={styles.select}
                  value={backupType}
                  onChange={(e) => setBackupType(e.target.value as any)}
                >
                  <option value="full">نسخه کامل پایگاه داده (Full Snapshot - ~48MB)</option>
                  <option value="differential">نسخه تفاضلی (Differential - ~12MB)</option>
                  <option value="wal_archive">بایگانی تراکنش‌های تغییر (WAL Segment - ~2MB)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="dr-backup-notes">
                  توضیحات یا دلیل عملیاتی:
                </label>
                <input
                  id="dr-backup-notes"
                  type="text"
                  className={styles.input}
                  placeholder="مثال: بکاپ پیش از ارتقای سیستم یا مهاجرت طرح..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={verifyImmediately}
                    onChange={(e) => setVerifyImmediately(e.target.checked)}
                  />
                  اعتبارسنجی خودکار هش SHA-256 بلافاصله پس از ایجاد
                </label>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className={styles.primaryBtn}
                  disabled={submitting}
                >
                  {submitting ? "در حال ایجاد..." : "تأیید و شروع ایجاد بکاپ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
