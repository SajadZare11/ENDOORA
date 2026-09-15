"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  fetchPWAOperationsTelemetry,
  MOCK_PWA_TELEMETRY,
  PWAOperationsTelemetry,
} from "../../lib/pwa-ops";
import styles from "./pwa-operations.module.css";

const OPERATIONS_TABS = [
  { href: "/operations/taxonomy", label: "🗂️ تاکسونومی" },
  { href: "/operations/questions", label: "❓ بانک سوالات" },
  { href: "/operations/courses", label: "📚 دوره‌ها" },
  { href: "/operations/content", label: "📝 مهارت‌ها و مقالات" },
  { href: "/admin", label: "⚙️ مدیریت" },
  { href: "/operations/flags", label: "🚩 فیچرفلگ‌ها" },
  { href: "/operations/audit", label: "📜 لاگ بازرسی" },
  { href: "/operations/security", label: "🛡️ امنیت" },
  { href: "/operations/privacy", label: "🔒 حریم خصوصی" },
  { href: "/operations/pen-test", label: "🧪 آزمون نفوذ" },
  { href: "/operations/disaster-recovery", label: "💾 بازیابی و DR" },
  { href: "/operations/ai", label: "🤖 رجیستری هوش مصنوعی" },
  { href: "/operations/monitoring", label: "📊 مانیتورینگ" },
  { href: "/operations/analytics", label: "📈 تحلیل محصول و رویدادها" },
  { href: "/operations/pwa", label: "📱 PWA و تاب‌آوری آفلاین" },
  { href: "/operations/incidents", label: "🚨 مدیریت بحران و ران‌بوک‌ها" },
  { href: "/operations/launch", label: "🚀 پروداکشن و لانچ نهایی" },
];

export function PWAOperationsDashboard() {
  const [telemetry, setTelemetry] = useState<PWAOperationsTelemetry>(MOCK_PWA_TELEMETRY);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchPWAOperationsTelemetry().then((data) => {
      if (mounted) {
        setTelemetry(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSimulateSync = () => {
    setFeedback("درخواست همگام‌سازی آزمایشی ارسال شد. ۳ پیش‌نویس با موفقیت پردازش شدند.");
    setTelemetry((prev) => ({
      ...prev,
      total_drafts_synced: prev.total_drafts_synced + 3,
      total_sync_sessions: prev.total_sync_sessions + 1,
    }));
  };

  const handleSimulateConflict = () => {
    setFeedback("یک تداخل همزمانی شبیه‌سازی شد (نسخه کلاینت v1 در برابر سرور v2). نسخه پشتیبان در conflict_backup ثبت گردید.");
    setTelemetry((prev) => ({
      ...prev,
      pending_conflicts_count: prev.pending_conflicts_count + 1,
    }));
  };

  const handleCachePurge = () => {
    setFeedback("دستور بازنشانی کش سرویس‌ورکر (endoora-sw-v1) به کلاینت‌ها ارسال شد.");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>
          <span>📱</span> کنسول عملیات PWA، بهینه‌سازی پهنای باند و تاب‌آوری آفلاین (OPS-008)
        </h1>
        <p className={styles.headerSubtitle}>
          پایش بلادرنگ وضعیت وب‌اپلیکیشن پیش‌رونده، صف‌های همگام‌سازی پیش‌نویس‌های محلی،
          تداخل‌های همزمانی، رفتار شبکه در اینترنت کم‌سرعت و پایداری ذخیره‌سازی داده‌ها.
        </p>
      </header>

      {/* 15-Tab Operations Navigation Ribbon */}
      <nav className={styles.ribbon} aria-label="ناوبری عملیات اندورا">
        {OPERATIONS_TABS.map((tab) => {
          const isActive = tab.href === "/operations/pwa";
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`${styles.ribbonLink} ${isActive ? styles.ribbonLinkActive : ""}`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {/* Posture KPI Cards */}
      <section className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiValue}>
            {loading ? "..." : telemetry.total_drafts_synced.toLocaleString("fa-IR")}
          </div>
          <div className={styles.kpiLabel}>پیش‌نویس‌های همگام‌شده (کل)</div>
          <div className={styles.kpiSubtext}>
            {telemetry.active_drafts_24h} مورد در ۲۴ ساعت گذشته
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiValue}>
            {loading ? "..." : telemetry.pending_conflicts_count.toLocaleString("fa-IR")}
          </div>
          <div className={styles.kpiLabel}>تداخل نسخه‌های همزمان</div>
          <div className={styles.kpiSubtext}>
            نرخ تداخل: {telemetry.conflict_rate_percent}% (بسیار مطلوب)
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiValue}>
            {loading ? "..." : telemetry.low_bandwidth_percentage.toLocaleString("fa-IR")}%
          </div>
          <div className={styles.kpiLabel}>نشست‌های با اینترنت ضعیف (2G/SaveData)</div>
          <div className={styles.kpiSubtext}>
            {telemetry.low_bandwidth_sessions_count} نشست تحت حالت بهینه
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiValue}>
            {loading ? "..." : `${telemetry.offline_cache_hit_rate}%`}
          </div>
          <div className={styles.kpiLabel}>نرخ موفقیت کش سرویس‌ورکر</div>
          <div className={styles.kpiSubtext}>
            استراتژی Stale-While-Revalidate فعال
          </div>
        </div>
      </section>

      {/* PWA Architecture & Posture Banner */}
      <section className={styles.postureBanner}>
        <div className={styles.postureGrid}>
          <div className={styles.postureItem}>
            <span className={styles.postureItemTitle}>نسخه سرویس‌ورکر (Service Worker)</span>
            <span className={styles.postureItemVal}>{telemetry.pwa_posture.service_worker_version} (فعال)</span>
          </div>
          <div className={styles.postureItem}>
            <span className={styles.postureItemTitle}>مانیفست وب‌اپلیکیشن (Web App Manifest)</span>
            <span className={styles.postureItemVal}>/manifest.webmanifest (W3C Standard)</span>
          </div>
          <div className={styles.postureItem}>
            <span className={styles.postureItemTitle}>صفحه پشتیبان آفلاین (Offline Fallback)</span>
            <span className={styles.postureItemVal}>{telemetry.pwa_posture.offline_fallback_route} (Pre-cached)</span>
          </div>
          <div className={styles.postureItem}>
            <span className={styles.postureItemTitle}>امنیت کش و عدم ذخیره داده‌های حساس</span>
            <span className={styles.postureItemVal}>{telemetry.pwa_posture.compliance_status}</span>
          </div>
        </div>
      </section>

      {/* Two Column Grid */}
      <div className={styles.twoColumnGrid}>
        {/* Draft Distribution */}
        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>
            <span>📊 توزیع پیش‌نویس‌های آفلاین بر اساس بخش</span>
          </h2>
          <div className={styles.distributionList}>
            {telemetry.draft_distribution.map((item) => {
              const total = Math.max(1, telemetry.total_drafts_synced);
              const pct = Math.round((item.count / total) * 100);
              return (
                <div key={item.type} className={styles.distRow}>
                  <div className={styles.distHeader}>
                    <span>{item.label}</span>
                    <span>{item.count} پیش‌نویس ({pct}%)</span>
                  </div>
                  <div className={styles.distBar}>
                    <div
                      className={styles.distFill}
                      style={{ inlineSize: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Network Conditions */}
        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>
            <span>📶 وضعیت و کیفیت اتصال کاربران</span>
          </h2>
          <div className={styles.distributionList}>
            {telemetry.network_distribution.map((net) => {
              const total = Math.max(1, telemetry.total_sync_sessions);
              const pct = Math.round((net.count / total) * 100);
              return (
                <div key={net.type} className={styles.distRow}>
                  <div className={styles.distHeader}>
                    <span>شبکه {net.type.toUpperCase()}</span>
                    <span>{net.count} نشست ({pct}%)</span>
                  </div>
                  <div className={styles.distBar}>
                    <div
                      className={styles.distFill}
                      style={{
                        inlineSize: `${pct}%`,
                        backgroundColor:
                          net.type === "2g" || net.type === "slow-2g"
                            ? "var(--color-warning, #D97706)"
                            : "var(--color-primary, #0D9488)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Recent Sync Events Table */}
      <section className={styles.panel} style={{ marginBlockEnd: "var(--space-8, 32px)" }}>
        <h2 className={styles.panelTitle}>
          <span>📜 آخرین رویدادهای همگام‌سازی صف کلاینت</span>
        </h2>
        <div className={styles.tableWrapper}>
          <table className={styles.eventsTable}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>شناسه نشست همگام‌سازی</th>
                <th className={styles.tableHeader}>نوع شبکه</th>
                <th className={styles.tableHeader}>پیش‌نویس‌های دریافتی</th>
                <th className={styles.tableHeader}>به‌روزرسانی شده</th>
                <th className={styles.tableHeader}>تداخل</th>
                <th className={styles.tableHeader}>حجم بسته</th>
                <th className={styles.tableHeader}>زمان ثبت</th>
              </tr>
            </thead>
            <tbody>
              {telemetry.recent_sync_events.map((ev) => (
                <tr key={ev.id} className={styles.tableRow}>
                  <td className={styles.tableCell} style={{ fontFamily: "monospace" }}>
                    {ev.sync_session_id}
                  </td>
                  <td className={styles.tableCell}>
                    <span className={`${styles.badge} ${ev.is_low_bandwidth ? styles.badgeWarning : styles.badgePrimary}`}>
                      {ev.network_effective_type.toUpperCase()}
                      {ev.is_low_bandwidth ? " (بهینه)" : ""}
                    </span>
                  </td>
                  <td className={styles.tableCell}>{ev.drafts_received}</td>
                  <td className={styles.tableCell}>{ev.drafts_updated}</td>
                  <td className={styles.tableCell}>
                    {ev.conflicts_detected > 0 ? (
                      <span className={`${styles.badge} ${styles.badgeWarning}`}>
                        {ev.conflicts_detected} مورد
                      </span>
                    ) : (
                      "۰"
                    )}
                  </td>
                  <td className={styles.tableCell}>{ev.payload_bytes} بایت</td>
                  <td className={styles.tableCell}>
                    {new Date(ev.created_at).toLocaleTimeString("fa-IR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Resilience & Sync Simulator */}
      <section className={styles.simulatorCard}>
        <h2 className={styles.panelTitle}>
          <span>🧪 جعبه‌ابزار آزمایش تاب‌آوری و شبیه‌سازی همگام‌سازی</span>
        </h2>
        <div className={styles.simActions}>
          <button
            type="button"
            onClick={handleSimulateSync}
            className={styles.simButton}
          >
            ⚡ شبیه‌سازی دریافت پیش‌نویس آفلاین (Batch Sync)
          </button>
          <button
            type="button"
            onClick={handleSimulateConflict}
            className={styles.simButton}
          >
            ⚠️ شبیه‌سازی تداخل همزمانی نسخه (Conflict Simulation)
          </button>
          <button
            type="button"
            onClick={handleCachePurge}
            className={styles.simButton}
          >
            🧹 تست ارسال دستور ابطال کش کلاینت‌ها (Cache Invalidation)
          </button>
        </div>

        {feedback && <div className={styles.feedbackBox}>{feedback}</div>}
      </section>
    </div>
  );
}
