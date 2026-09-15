"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./admin-dashboard.module.css";
import {
  AuditEventRecord,
  fetchAdminAuditLogs,
} from "../../lib/admin-ops";

export function AuditLogsOperations() {
  const [logs, setLogs] = useState<AuditEventRecord[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [targetApp, setTargetApp] = useState<string>("all");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Inspect Modal
  const [selectedAudit, setSelectedAudit] = useState<AuditEventRecord | null>(null);

  const loadAuditLogs = () => {
    setLoading(true);
    fetchAdminAuditLogs({
      target_app: targetApp,
      action: actionFilter,
      search: searchQuery,
      limit: 100,
    })
      .then((data) => {
        setLogs(data.results);
        setTotalCount(data.count);
      })
      .catch((err) => {
        console.error("Failed to load audit logs:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let ignore = false;
    fetchAdminAuditLogs({
      target_app: targetApp,
      action: actionFilter,
      search: searchQuery,
      limit: 100,
    })
      .then((data) => {
        if (!ignore) {
          setLogs(data.results);
          setTotalCount(data.count);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Failed to load audit logs:", err);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [targetApp, actionFilter, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadAuditLogs();
  };

  return (
    <div className={styles.container} dir="rtl">
      {/* Navigation Ribbon */}
      <nav className={styles.opsRibbon} aria-label="ناوبری ارشد عملیاتی">
        <Link href="/admin" className={styles.opsTab}>
          میز مدیریت کل (Overview)
        </Link>
        <Link href="/operations/flags" className={styles.opsTab}>
          کلیدهای ویژگی و کیل‌سوئیچ (OPS-002)
        </Link>
        <Link href="/operations/audit" className={`${styles.opsTab} ${styles.opsTabActive}`}>
          ردپای ممیزی تغییرات (OPS-003)
          <span style={{ fontSize: "var(--font-size-micro)", paddingInline: "6px", backgroundColor: "var(--color-surface-muted)", borderRadius: "var(--radius-pill)" }}>
            {totalCount}
          </span>
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

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>دفتر کل ممیزی و تاریخچه تغییرات امنیتی (OPS-003)</h1>
          <p className={styles.subtitle}>
            ثبت غیرقابل‌حذف (Immutable Append-Only) تمام تغییرات در دوره‌ها، کلیدهای ویژگی، حسابداری و تنظیمات پایه
          </p>
        </div>

        <div className={styles.headerActions}>
          <select
            value={targetApp}
            onChange={(e) => setTargetApp(e.target.value)}
            className={styles.formSelect}
            aria-label="فیلتر بخش پلتفرم"
          >
            <option value="all">همه بخش‌ها (All Modules)</option>
            <option value="core">هسته سیستم و کلیدها (core)</option>
            <option value="content">محتوا و فرهنگ (content)</option>
            <option value="courses">دوره‌های آموزشی (courses)</option>
            <option value="questions">بانک سوالات (questions)</option>
            <option value="marketplace">مارکت‌پلیس (marketplace)</option>
            <option value="ledger">دفتر کل مالی (ledger)</option>
            <option value="moderation">نظارت و پالایش (moderation)</option>
          </select>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className={styles.formSelect}
            aria-label="فیلتر نوع اقدام"
          >
            <option value="all">همه اقدام‌ها</option>
            <option value="create">ایجاد (Create)</option>
            <option value="update">ویرایش (Update)</option>
            <option value="delete">حذف (Delete)</option>
          </select>

          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="جستجو در دلیل، ایمیل، یا شناسه..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.formInput}
              style={{ inlineSize: "240px" }}
            />
          </form>
        </div>
      </header>

      {/* Audit Feed Panel */}
      <section className={styles.panelBox}>
        {loading ? (
          <div style={{ textAlign: "center", paddingBlock: "var(--space-8)" }}>در حال بارگذاری لاگ‌های ممیزی...</div>
        ) : logs.length === 0 ? (
          <div style={{ textAlign: "center", paddingBlock: "var(--space-8)" }}>هیچ رخداد ممیزی با فیلترهای انتخابی یافت نشد.</div>
        ) : (
          <div className={styles.auditFeed}>
            {logs.map((audit) => {
              const badgeClass =
                audit.action === "create"
                  ? styles.auditActionCreate
                  : audit.action === "delete"
                  ? styles.auditActionDelete
                  : styles.auditActionUpdate;

              return (
                <div key={audit.id} className={styles.auditRow}>
                  <div className={styles.auditHeader}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                      <span className={`${styles.auditActionBadge} ${badgeClass}`}>{audit.action}</span>
                      <strong>
                        {audit.actor_email} ({audit.actor_role})
                      </strong>
                    </div>
                    <span>{new Date(audit.occurred_at).toLocaleString("fa-IR")}</span>
                  </div>

                  <div className={styles.auditReason}>{audit.reason}</div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-2)", marginBlockStart: "var(--space-1)" }}>
                    <div className={styles.auditTarget}>
                      ماژول: <strong>{audit.target_app}</strong> | مدل: <strong>{audit.target_model}</strong> [شناسه:{" "}
                      <code>{audit.target_pk}</code>] | محیط: {audit.environment}
                    </div>

                    <button
                      onClick={() => setSelectedAudit(audit)}
                      className={styles.secondaryBtn}
                      style={{ paddingInline: "var(--space-2)", paddingBlock: "2px", fontSize: "var(--font-size-micro)" }}
                    >
                      مشاهده بار داده (JSON Diff)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Inspect Modal */}
      {selectedAudit && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer} style={{ maxInlineSize: "720px" }}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>جزئیات رویداد ممیزی: {selectedAudit.target_pk}</h2>
              <button onClick={() => setSelectedAudit(null)} className={styles.closeBtn}>
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <div>
                <strong>دلیل ثبت:</strong> {selectedAudit.reason}
              </div>
              <div style={{ fontSize: "var(--font-size-small)", color: "var(--color-text-secondary)" }}>
                مسیر فراخوانی: <code>{selectedAudit.request_method} {selectedAudit.request_path}</code>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)", marginBlockStart: "var(--space-3)" }}>
                <div>
                  <h4 style={{ margin: "0 0 var(--space-1) 0", fontSize: "var(--font-size-small)" }}>وضعیت قبل (Before Summary):</h4>
                  <pre
                    dir="ltr"
                    style={{
                      padding: "var(--space-2)",
                      backgroundColor: "var(--color-surface-subtle)",
                      borderRadius: "var(--radius-control)",
                      fontSize: "11px",
                      overflowX: "auto",
                      maxBlockSize: "200px",
                    }}
                  >
                    {JSON.stringify(selectedAudit.before_summary, null, 2)}
                  </pre>
                </div>

                <div>
                  <h4 style={{ margin: "0 0 var(--space-1) 0", fontSize: "var(--font-size-small)" }}>وضعیت بعد (After Summary):</h4>
                  <pre
                    dir="ltr"
                    style={{
                      padding: "var(--space-2)",
                      backgroundColor: "var(--color-surface-subtle)",
                      borderRadius: "var(--radius-control)",
                      fontSize: "11px",
                      overflowX: "auto",
                      maxBlockSize: "200px",
                    }}
                  >
                    {JSON.stringify(selectedAudit.after_summary, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={() => setSelectedAudit(null)} className={styles.secondaryBtn}>
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
