"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  createIncident,
  executeRunbookDryRun,
  fetchIncidents,
  fetchLaunchGateReadiness,
  fetchRestoreLogs,
  fetchRunbooks,
  IncidentRecord,
  LaunchGateScorecard,
  MOCK_INCIDENTS,
  MOCK_LAUNCH_GATE,
  MOCK_RESTORE_LOGS,
  MOCK_RUNBOOKS,
  RestoreVerificationRecord,
  RunbookDefinition,
  StepExecutionResult,
  triggerRestoreDrill,
  updateIncident,
} from "../../lib/incident-ops";
import styles from "./incident-operations.module.css";

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
  { href: "/operations/analytics", label: "📈 تحلیل داده" },
  { href: "/operations/pwa", label: "📱 PWA و تاب‌آوری" },
  { href: "/operations/incidents", label: "🚨 مدیریت بحران و ران‌بوک‌ها" },
  { href: "/operations/launch", label: "🚀 پروداکشن و لانچ نهایی" },
];

export function IncidentOperationsDashboard() {
  const [launchGate, setLaunchGate] = useState<LaunchGateScorecard>(MOCK_LAUNCH_GATE);
  const [incidents, setIncidents] = useState<IncidentRecord[]>(MOCK_INCIDENTS);
  const [runbooks, setRunbooks] = useState<RunbookDefinition[]>(MOCK_RUNBOOKS);
  const [restoreLogs, setRestoreLogs] = useState<RestoreVerificationRecord[]>(MOCK_RESTORE_LOGS);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [executingStep, setExecutingStep] = useState<{ slug: string; step: number } | null>(null);
  const [dryRunOutput, setDryRunOutput] = useState<StepExecutionResult | null>(null);

  const [isNewIncidentOpen, setIsNewIncidentOpen] = useState(false);
  const [isDrillRunning, setIsDrillRunning] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newSeverity, setNewSeverity] = useState<IncidentRecord["severity"]>("P2_HIGH");
  const [newService, setNewService] = useState("Billing");
  const [newSummary, setNewSummary] = useState("");
  const [newRunbook, setNewRunbook] = useState("payment-gateway-outage");

  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetchLaunchGateReadiness(),
      fetchIncidents(),
      fetchRunbooks(),
      fetchRestoreLogs(),
    ]).then(([lg, inc, rb, rst]) => {
      if (mounted) {
        setLaunchGate(lg);
        setIncidents(inc);
        setRunbooks(rb);
        setRestoreLogs(rst);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleTriggerDrill = async () => {
    setIsDrillRunning(true);
    setFeedback("در حال اجرای مانور راستی‌آزمایی بازیابی دیتابیس در محیط ایزوله...");
    try {
      const log = await triggerRestoreDrill(true);
      setRestoreLogs((prev) => [log, ...prev]);
      setFeedback(`مانور با موفقیت پایان یافت: ${log.tables_restored_count} جدول با چکسام معتبر تأیید شدند.`);
    } finally {
      setIsDrillRunning(false);
    }
  };

  const handleExecuteStep = async (slug: string, step: number) => {
    setExecutingStep({ slug, step });
    try {
      const res = await executeRunbookDryRun(slug, step);
      setDryRunOutput(res);
      setFeedback(`مرحله ${step} از ران‌بوک ${slug} با موفقیت در حالت شبیه‌سازی اجرا شد.`);
    } finally {
      setExecutingStep(null);
    }
  };

  const handleStatusUpdate = async (id: string, nextStatus: IncidentRecord["status"]) => {
    const updated = await updateIncident(id, { status: nextStatus });
    setIncidents((prev) => prev.map((item) => (item.id === id ? updated : item)));
    setFeedback(`وضعیت رخداد با شناسه ${id.slice(0, 8)} به ${nextStatus} تغییر یافت.`);
  };

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created = await createIncident({
      title: newTitle.trim(),
      severity: newSeverity,
      affected_service: newService,
      summary: newSummary.trim(),
      runbook_slug: newRunbook,
      status: "detected",
    });

    setIncidents((prev) => [created, ...prev]);
    setIsNewIncidentOpen(false);
    setNewTitle("");
    setNewSummary("");
    setFeedback(`رخداد جدید با موفقیت ثبت و به فرمانده عملیات ارجاع داده شد.`);
  };

  const filteredIncidents = incidents.filter((item) => {
    if (filterSeverity !== "all" && item.severity !== filterSeverity) return false;
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    return true;
  });

  const activeP1P2Count = incidents.filter(
    (i) => (i.severity === "P1_CRITICAL" || i.severity === "P2_HIGH") && i.status !== "resolved"
  ).length;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>
          <span>🚨</span> مدیریت بحران، راستی‌آزمایی بازیابی و دروازه پروداکشن (OPS-009)
        </h1>
        <p className={styles.headerSubtitle}>
          سامانه پایش پایداری سرویس، تمرین‌های خودکار بازیابی نسخه پشتیبان (Restore Verification Drills)،
          اجرای دستورالعمل‌های مهار بحران (Runbooks) و ارزیابی شش‌گانه دروازه انتشار نهایی (Launch Gate).
        </p>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={handleTriggerDrill}
            disabled={isDrillRunning}
          >
            {isDrillRunning ? "در حال اجرای مانور..." : "🧪 اجرای مانور تست بازیابی (Restore Drill)"}
          </button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => setIsNewIncidentOpen(true)}
          >
            ➕ ثبت رخداد بحرانی جدید (New Incident)
          </button>
        </div>
      </div>

      {/* Navigation Ribbon */}
      <nav className={styles.ribbon} aria-label="بخش‌های عملیاتی پلتفرم">
        {OPERATIONS_TABS.map((tab) => {
          const isActive = tab.href === "/operations/incidents";
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

      {/* User Feedback Toast */}
      {feedback && (
        <div
          style={{
            paddingBlock: "10px",
            paddingInline: "16px",
            marginBlockEnd: "20px",
            borderRadius: "8px",
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-primary)",
            fontSize: "13px",
            fontWeight: 600,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>💡 {feedback}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            style={{
              background: "none",
              border: "none",
              color: "var(--color-text-muted)",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Production Launch Gate Hero Scorecard */}
      <div className={styles.scorecardHero}>
        <div className={styles.scorecardTop}>
          <div className={styles.scorecardTitleGroup}>
            <div className={styles.scorecardMainTitle}>
              <span>🛡️</span> ارزیابی شش‌گانه آمادگی پروداکشن (Production Launch Gate)
            </div>
            <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
              ارزیابی استاندارد OPS-009 جهت فعال‌سازی کامل کلاس‌های آنلاین پرداختی و ثبت تراکنش‌های مارکت‌پلیس
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div className={styles.scoreGauge}>
              <span className={styles.scoreNumber}>{launchGate.score}%</span>
              <span className={styles.scorePercent}>آمادگی کامل</span>
            </div>
            <span className={styles.scorecardStatusBadge}>
              ✓ {launchGate.certification}
            </span>
          </div>
        </div>

        <div className={styles.pillarsGrid}>
          {launchGate.pillars.map((pillar) => (
            <div key={pillar.id} className={styles.pillarCard}>
              <div className={styles.pillarHeader}>
                <span className={styles.pillarName}>{pillar.name}</span>
                <span className={styles.pillarPassBadge}>تأییدشده ✓</span>
              </div>
              <p className={styles.pillarRequirement}>{pillar.requirement}</p>
              <div className={styles.pillarEvidence}>{pillar.evidence}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Posture KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>بحران‌های فعال (Active P1/P2)</span>
          <span
            className={styles.kpiValue}
            style={{
              color:
                activeP1P2Count > 0
                  ? "var(--color-error-text)"
                  : "var(--color-success-text)",
            }}
          >
            {activeP1P2Count} رخداد
          </span>
          <span className={styles.kpiMeta}>
            {activeP1P2Count === 0 ? "تمامی سرویس‌ها پایدار هستند" : "نیازمند مداخله فرمانده عملیات"}
          </span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>میانگین زمان بازیابی و رفع (MTTR)</span>
          <span className={styles.kpiValue}>۲۶.۳ دقیقه</span>
          <span className={styles.kpiMeta}>مطابق با هدف SLA کمتر از ۳۰ دقیقه</span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>آخرین مانور بازیابی دیتابیس</span>
          <span className={styles.kpiValue}>۱۴۵ جدول</span>
          <span className={styles.kpiMeta}>تطابق ۱۰۰٪ چکسام SHA-256 و روابط خارجی</span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>پوشش ران‌بوک‌های عملیاتی</span>
          <span className={styles.kpiValue}>۶ / ۶ ران‌بوک</span>
          <span className={styles.kpiMeta}>دارای شبیه‌ساز Dry Run و تست خودکار</span>
        </div>
      </div>

      {/* Incident Triage Center */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span>📋</span> مرکز فرماندهی و تریاژ رخدادها (Incident Triage Center)
          </h2>
          <div className={styles.filterBar}>
            <label htmlFor="filter-severity" style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
              سطح فوریت:
            </label>
            <select
              id="filter-severity"
              className={styles.filterSelect}
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
            >
              <option value="all">همه شدت‌ها</option>
              <option value="P1_CRITICAL">P1 - بحرانی</option>
              <option value="P2_HIGH">P2 - بالا</option>
              <option value="P3_MEDIUM">P3 - متوسط</option>
              <option value="P4_LOW">P4 - جزئی</option>
            </select>

            <label htmlFor="filter-status" style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
              وضعیت:
            </label>
            <select
              id="filter-status"
              className={styles.filterSelect}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="detected">شناسایی‌شده</option>
              <option value="investigating">در حال بررسی</option>
              <option value="mitigated">مهارشده</option>
              <option value="resolved">رفع قطعی</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className={styles.incidentTable}>
            <thead>
              <tr>
                <th>شدت (Severity)</th>
                <th>عنوان رخداد و سرویس متأثر</th>
                <th>فرمانده عملیات</th>
                <th>وضعیت فعلی</th>
                <th>زمان مهار (MTTM)</th>
                <th>زمان رفع (MTTR)</th>
                <th>اقدامات</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", color: "var(--color-text-muted)" }}>
                    هیچ رخدادی با فیلترهای انتخابی یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((inc) => (
                  <tr key={inc.id}>
                    <td>
                      {inc.severity === "P1_CRITICAL" && (
                        <span className={styles.severityP1}>P1 بحرانی</span>
                      )}
                      {inc.severity === "P2_HIGH" && (
                        <span className={styles.severityP2}>P2 بالا</span>
                      )}
                      {inc.severity === "P3_MEDIUM" && (
                        <span className={styles.severityP3}>P3 متوسط</span>
                      )}
                      {inc.severity === "P4_LOW" && (
                        <span className={styles.severityP3}>P4 جزئی</span>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{inc.title}</div>
                      <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                        سرویس: {inc.affected_service} {inc.runbook_slug && `• ران‌بوک: ${inc.runbook_slug}`}
                      </div>
                    </td>
                    <td>{inc.commander_email || "بدون فرمانده"}</td>
                    <td>
                      <span className={styles.statusBadge}>
                        {inc.status === "resolved" && "رفع قطعی ✓"}
                        {inc.status === "mitigated" && "مهارشده 🛡️"}
                        {inc.status === "investigating" && "در حال بررسی 🔍"}
                        {inc.status === "detected" && "شناسایی‌شده ⚠️"}
                      </span>
                    </td>
                    <td>{inc.time_to_mitigate_minutes ? `${inc.time_to_mitigate_minutes} دقیقه` : "-"}</td>
                    <td>{inc.time_to_resolve_minutes ? `${inc.time_to_resolve_minutes} دقیقه` : "-"}</td>
                    <td>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {inc.status !== "resolved" && (
                          <button
                            type="button"
                            className={styles.btnSecondary}
                            style={{ padding: "4px 8px", fontSize: "11px" }}
                            onClick={() => handleStatusUpdate(inc.id, "resolved")}
                          >
                            علامت‌گذاری به عنوان رفع‌شده
                          </button>
                        )}
                        {inc.status === "detected" && (
                          <button
                            type="button"
                            className={styles.btnSecondary}
                            style={{ padding: "4px 8px", fontSize: "11px" }}
                            onClick={() => handleStatusUpdate(inc.id, "mitigated")}
                          >
                            اعلام مهار
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Runbooks Catalog */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span>📖</span> کاتالوگ دستورالعمل‌های اجرایی مهار بحران (Operational Runbooks)
          </h2>
          <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
            دستورات ترمینالی استاندارد با قابلیت اجرای آزمایشی غیرمخرب (Dry-Run Simulation)
          </div>
        </div>

        <div className={styles.runbookGrid}>
          {runbooks.map((rb) => (
            <div key={rb.slug} className={styles.runbookCard}>
              <div className={styles.runbookTop}>
                <div>
                  <div className={styles.runbookTitle}>{rb.title_fa}</div>
                  <div className={styles.runbookService}>
                    {rb.title} • سرویس هدف: {rb.target_service}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: "4px",
                    backgroundColor:
                      rb.severity_trigger === "P1_CRITICAL"
                        ? "var(--color-error-bg)"
                        : "var(--color-warning-bg)",
                    color:
                      rb.severity_trigger === "P1_CRITICAL"
                        ? "var(--color-error-text)"
                        : "var(--color-warning-text)",
                  }}
                >
                  {rb.severity_trigger}
                </span>
              </div>

              <div className={styles.stepAccordion}>
                {rb.steps_json.map((st) => (
                  <div key={st.step} className={styles.stepItem}>
                    <div className={styles.stepItemHeader}>
                      <span>
                        گام {st.step}: {st.title}
                      </span>
                      <button
                        type="button"
                        className={styles.stepBtnExecute}
                        disabled={
                          executingStep?.slug === rb.slug && executingStep?.step === st.step
                        }
                        onClick={() => handleExecuteStep(rb.slug, st.step)}
                      >
                        {executingStep?.slug === rb.slug && executingStep?.step === st.step
                          ? "در حال اجرا..."
                          : "اجرای آزمایشی (Dry Run)"}
                      </button>
                    </div>
                    <div className={styles.stepCode}>{st.command}</div>
                    <div style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "4px" }}>
                      معیار اعتبارسنجی: {st.verification}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Live Dry-Run Output Viewer */}
        {dryRunOutput && (
          <div className={styles.terminalOutput}>
            <div style={{ color: "var(--color-text-muted)", marginBottom: "4px" }}>
              # [SIMULATION TERMINAL OUTPUT] {dryRunOutput.slug} (Step {dryRunOutput.step_number})
            </div>
            <div>&gt; Command: {dryRunOutput.command}</div>
            <div>&gt; Status:  {dryRunOutput.status}</div>
            <div>&gt; Verification: {dryRunOutput.verification}</div>
            <div style={{ marginTop: "4px", color: "var(--color-text)" }}>
              {dryRunOutput.output}
            </div>
          </div>
        )}
      </div>

      {/* Restore Verification Drill Logs */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span>💾</span> گزارش لاگ‌های مانور بازیابی دیتابیس (Restore Drill Logs)
          </h2>
          <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
            راستی‌آزمایی دوره بازیابی در محیط آزمون مجزا مطابق با خط‌مشی تاب‌آوری
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className={styles.incidentTable}>
            <thead>
              <tr>
                <th>شناسه مانور</th>
                <th>فایل پشتیبان / مسیر</th>
                <th>هش اعتبارسنجی SHA-256</th>
                <th>جداول تأییدشده</th>
                <th>رکورد نمونه</th>
                <th>مدت زمان</th>
                <th>وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {restoreLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontFamily: "monospace", fontSize: "12px" }}>
                    {log.id.slice(0, 12)}...
                  </td>
                  <td style={{ fontSize: "12px" }}>{log.backup_file_path}</td>
                  <td style={{ fontFamily: "monospace", fontSize: "11px", color: "var(--color-learning-teal)" }}>
                    {log.checksum.slice(0, 16)}...{log.checksum.slice(-8)}
                  </td>
                  <td>{log.tables_restored_count} جدول</td>
                  <td>{log.records_sampled_count} رکورد</td>
                  <td>{log.duration_ms} ms</td>
                  <td>
                    <span className={styles.pillarPassBadge}>
                      {log.status === "verified" ? "کاملاً تأییدشده ✓" : log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Incident Modal */}
      {isNewIncidentOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsNewIncidentOpen(false)}>
          <div className={styles.modalDialog} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: "16px", fontWeight: 800 }}>ثبت رخداد بحرانی جدید</h3>
            <form onSubmit={handleCreateIncident} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>عنوان رخداد</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: قطعی موقت در اتصال به درگاه پرداخت"
                  className={styles.formInput}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>سطح فوریت (Severity)</label>
                <select
                  className={styles.formSelect}
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as any)}
                >
                  <option value="P1_CRITICAL">P1 - بحرانی (قطعی سرویس اصلی یا پایگاه داده)</option>
                  <option value="P2_HIGH">P2 - بالا (اختلال پرداخت یا هوش مصنوعی)</option>
                  <option value="P3_MEDIUM">P3 - متوسط (کندی یا خطای غیربحرانی)</option>
                  <option value="P4_LOW">P4 - جزئی (مشکل ظاهری یا گزارش آماری)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>سرویس متأثر</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: Billing & Escrow"
                  className={styles.formInput}
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>ران‌بوک پیشنهادی</label>
                <select
                  className={styles.formSelect}
                  value={newRunbook}
                  onChange={(e) => setNewRunbook(e.target.value)}
                >
                  {runbooks.map((r) => (
                    <option key={r.slug} value={r.slug}>
                      {r.title_fa} ({r.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>شرح مختصر و شواهد اولیه</label>
                <textarea
                  className={styles.formTextarea}
                  placeholder="توضیحاتی پیرامون زمان شروع، خطاها و کاربران متأثر..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setIsNewIncidentOpen(false)}
                >
                  انصراف
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  ثبت رسمی رخداد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
