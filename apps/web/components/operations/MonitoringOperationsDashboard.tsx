"use client";

import { Button, Input } from "@endoora/ui";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./monitoring-ops.module.css";
import {
  acknowledgeIncidentAlert,
  fetchObservabilityOverview,
  fetchStructuredLogs,
  fetchWaterfallTraces,
  simulateLatencyDrill,
  FALLBACK_OBSERVABILITY_OVERVIEW,
  FALLBACK_WATERFALL_TRACES,
  IncidentAlertItem,
  ObservabilityOverview,
  StructuredLogItem,
  WaterfallTrace,
} from "@/lib/monitoring-ops";

export function MonitoringOperationsDashboard() {
  const [overview, setOverview] = useState<ObservabilityOverview>(FALLBACK_OBSERVABILITY_OVERVIEW);
  const [traces, setTraces] = useState<WaterfallTrace[]>(FALLBACK_WATERFALL_TRACES);
  const [logs, setLogs] = useState<StructuredLogItem[]>([]);
  const [logLevel, setLogLevel] = useState<string>("ALL");
  const [logSearch, setLogSearch] = useState<string>("");
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>("trc-98a2f1c84b10");
  const [loading, setLoading] = useState<boolean>(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [ovData, trData, logData] = await Promise.all([
          fetchObservabilityOverview(),
          fetchWaterfallTraces(10),
          fetchStructuredLogs(30),
        ]);
        setOverview(ovData);
        setTraces(trData);
        setLogs(logData);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAcknowledgeAlert = async (alertId: string) => {
    const res = await acknowledgeIncidentAlert(alertId);
    if (res.success) {
      setActionMessage("هشدار با موفقیت تایید گردید.");
      const updated = await fetchObservabilityOverview();
      setOverview(updated);
    } else {
      setActionMessage(res.message || "خطا در تایید هشدار");
    }
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handleSimulateDrill = async () => {
    const res = await simulateLatencyDrill(460);
    if (res.success) {
      setActionMessage("مانور شبیه‌سازی تاخیر با موفقیت اجرا شد و هشدار نظارتی به سیستم اضافه گردید.");
      const [ovData, trData] = await Promise.all([
        fetchObservabilityOverview(),
        fetchWaterfallTraces(10),
      ]);
      setOverview(ovData);
      setTraces(trData);
    } else {
      setActionMessage(res.message || "خطا در اجرای مانور");
    }
    setTimeout(() => setActionMessage(null), 5000);
  };

  const handleFilterLogs = async (level: string, search: string) => {
    setLogLevel(level);
    const filtered = await fetchStructuredLogs(30, level, search);
    setLogs(filtered);
  };

  const toggleTrace = (id: string) => {
    setExpandedTraceId(expandedTraceId === id ? null : id);
  };

  const apm = overview.apm_metrics;
  const db = overview.database_pool;
  const redis = overview.redis_cache;
  const workers = overview.worker_queues;
  const alerts = overview.alerts_summary;

  return (
    <div className={styles.container}>
      {/* 1. 13-Tab Synchronized Operations Ribbon */}
      <nav className={styles.ribbon} aria-label="ناوبری عملیات ایندورا">
        <Link href="/operations/taxonomy" className={styles.opsTab}>
          تاکسونومی (CONTENT-001)
        </Link>
        <Link href="/operations/questions" className={styles.opsTab}>
          بانک سوالات (CONTENT-002)
        </Link>
        <Link href="/operations/courses" className={styles.opsTab}>
          دوره‌ها (CONTENT-003)
        </Link>
        <Link href="/operations/content" className={styles.opsTab}>
          محتوا و فرهنگ (CONTENT-004)
        </Link>
        <Link href="/admin" className={styles.opsTab}>
          مدیریت عملیات (OPS-001)
        </Link>
        <Link href="/operations/flags" className={styles.opsTab}>
          پرچم‌های قابلیت (OPS-002)
        </Link>
        <Link href="/operations/audit" className={styles.opsTab}>
          ردپای ممیزی (OPS-003)
        </Link>
        <Link href="/operations/security" className={styles.opsTab}>
          🛡️ امنیت (SEC-001)
        </Link>
        <Link href="/operations/privacy" className={styles.opsTab}>
          🛡️ حریم خصوصی (SEC-002)
        </Link>
        <Link href="/operations/pen-test" className={styles.opsTab}>
          🔍 آزمون نفوذ (SEC-003)
        </Link>
        <Link href="/operations/disaster-recovery" className={styles.opsTab}>
          💾 بازیابی بحران (OPS-004)
        </Link>
        <Link href="/operations/ai" className={styles.opsTab}>
          🤖 مدل‌ها و پرامپت‌ها (OPS-005)
        </Link>
        <Link href="/operations/monitoring" className={`${styles.opsTab} ${styles.opsTabActive}`}>
          📊 پایش و لاگ‌های ساختاریافته (OPS-006)
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
      </nav>

      {/* 2. Header Section */}
      <header className={styles.headerSection}>
        <div className={styles.headerTitleGroup}>
          <h1 className={styles.headerTitle}>
            <span>📊 پایش بلادرنگ تولید، لاگ‌های ساختاریافته و ردگیری توزیع‌شده (OPS-006)</span>
          </h1>
          <p className={styles.headerSubtitle}>
            نظارت سرتاسری بر عملکرد سرویس‌ها (APM)، صدک‌های تاخیر p50/p95/p99، زنجیره ردیابی درخواست‌ها و هشدارها
          </p>
        </div>
        <div className={styles.headerBadgeGroup}>
          <span className={styles.statusBadge}>
            <span className={styles.statusDot} />
            وضعیت کلی: {overview.status === "OPTIMAL" ? "سالم و بهینه (OPTIMAL)" : overview.status}
          </span>
          <Button className={styles.secondaryButton} onClick={handleSimulateDrill}>
            ⚡ اجرای مانور آزمایشی تاخیر
          </Button>
          <Button
            className={styles.actionButton}
            onClick={async () => {
              setLoading(true);
              const ov = await fetchObservabilityOverview();
              setOverview(ov);
              setLoading(false);
            }}
          >
            {loading ? "در حال دریافت..." : "🔄 بروزرسانی زنده"}
          </Button>
        </div>
      </header>

      {actionMessage && (
        <div className={styles.alertCardInfo}>
          <span>{actionMessage}</span>
        </div>
      )}

      {/* 3. APM Posture KPI Cards */}
      <section className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span>پایداری سیستم (Uptime SLA)</span>
            <span>🎯 ۹۹.۵۰٪</span>
          </div>
          <div className={styles.kpiValue}>{apm.uptime_percentage}%</div>
          <div className={styles.kpiSubtext}>مطابق با تعهد SLA استاندارد سازمانی</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span>تاخیر پردازش صدک ۹۵ (p95 Latency)</span>
            <span>⚡ p50: {apm.p50_latency_ms}ms</span>
          </div>
          <div className={styles.kpiValue}>{apm.p95_latency_ms} ms</div>
          <div className={styles.kpiSubtext}>صدک ۹۹: {apm.p99_latency_ms}ms (محدوده مجاز زیر ۴۰۰ms)</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span>نرخ درخواست‌ها (Throughput)</span>
            <span>🌐 ترافیک فعال</span>
          </div>
          <div className={styles.kpiValue}>{apm.requests_per_second} RPS</div>
          <div className={styles.kpiSubtext}>میانگین بار همزمان روی سرورهای وب</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span>نرخ خطای سرویس‌ها (Error Rate)</span>
            <span>🛡️ سقف مجاز: ۰.۵۰٪</span>
          </div>
          <div className={styles.kpiValue}>{apm.error_rate_percentage}%</div>
          <div className={styles.kpiSubtext}>مجموع خطاهای ۴xx و ۵xx در ۲۴ ساعت گذشته</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span>نرخ اصابت حافظه نهان (Redis Hit)</span>
            <span>⚡ سنتینل فعال</span>
          </div>
          <div className={styles.kpiValue}>{redis.hit_ratio_percentage}%</div>
          <div className={styles.kpiSubtext}>{redis.keys_count.toLocaleString("fa-IR")} کلید در حافظه نهان</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span>صف‌های کار پردازش (Worker Queues)</span>
            <span>⚙️ ۶ ورکر فعال</span>
          </div>
          <div className={styles.kpiValue}>{workers.queue_depth} وظیفه</div>
          <div className={styles.kpiSubtext}>{workers.active_tasks} تسک در حال اجرا / ۱ خطا در ۲۴h</div>
        </div>
      </section>

      {/* 4. Infrastructure Health & Connection Pools */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>🖥️ سلامت کلاسترها و استخرهای ارتباطی زیرساخت</h2>
          <span className={styles.sectionSubtitle}>وضعیت پایگاه داده، رپلیکاها، صفوف سلری و حافظه نهان</span>
        </div>
        <div className={styles.infraGrid}>
          <div className={styles.infraCard}>
            <div className={styles.infraCardTitle}>
              <span>کلاستر پایگاه داده PostgreSQL 16</span>
              <span className={styles.statusBadge}>سالم ({db.status})</span>
            </div>
            <div className={styles.infraMetaRow}>
              <span>استخر ارتباطات فعال (PgBouncer):</span>
              <span style={{ direction: "ltr" }}>{db.active_connections} / {db.max_connections}</span>
            </div>
            <div className={styles.infraMetaRow}>
              <span>اتصالات در دسترس:</span>
              <span style={{ direction: "ltr" }}>{db.available_connections}</span>
            </div>
            <div className={styles.infraMetaRow}>
              <span>کوئری‌های کند در ساعت اخیر:</span>
              <span>{db.slow_queries_last_hour} مورد (&gt;100ms)</span>
            </div>
          </div>

          <div className={styles.infraCard}>
            <div className={styles.infraCardTitle}>
              <span>کلاستر ردیس و سنتینل (Redis Sentinel)</span>
              <span className={styles.statusBadge}>سالم ({redis.status})</span>
            </div>
            <div className={styles.infraMetaRow}>
              <span>توپولوژی دسترسی‌پذیری:</span>
              <span>{redis.topology}</span>
            </div>
            <div className={styles.infraMetaRow}>
              <span>حافظه مصرفی:</span>
              <span style={{ direction: "ltr" }}>{redis.memory_used_mb} MB</span>
            </div>
            <div className={styles.infraMetaRow}>
              <span>نرخ اصابت کش:</span>
              <span style={{ direction: "ltr" }}>{redis.hit_ratio_percentage}%</span>
            </div>
          </div>

          <div className={styles.infraCard}>
            <div className={styles.infraCardTitle}>
              <span>پردازش صف‌های پس‌زمینه (Celery)</span>
              <span className={styles.statusBadge}>سالم ({workers.status})</span>
            </div>
            <div className={styles.infraMetaRow}>
              <span>صف اصلی:</span>
              <span style={{ direction: "ltr" }}>{workers.queue_name}</span>
            </div>
            <div className={styles.infraMetaRow}>
              <span>تعداد ورکر فعال:</span>
              <span style={{ direction: "ltr" }}>{workers.active_workers} Workers</span>
            </div>
            <div className={styles.infraMetaRow}>
              <span>خطاهای ۲۴ ساعت گذشته:</span>
              <span>{workers.failed_tasks_24h} مورد</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Incident Alerts & Active Triggers */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>🚨 مرکز مدیریت رویدادها و هشدارهای فعال (Active Incidents)</h2>
          <span className={styles.sectionSubtitle}>
            {alerts.active_count} هشدار فعال | {alerts.acknowledged_count} تایید شده | {alerts.resolved_count} برطرف شده
          </span>
        </div>

        {alerts.active_items.length === 0 ? (
          <div className={styles.alertCardResolved}>
            <span>✅ در حال حاضر هیچ هشدار فعالی در سیستم وجود ندارد و تمامی سرویس‌ها در وضعیت پایدار هستند.</span>
          </div>
        ) : (
          alerts.active_items.map((item: IncidentAlertItem) => (
            <div
              key={item.id}
              className={`${styles.alertCard} ${
                item.severity === "CRITICAL"
                  ? styles.alertCardCritical
                  : item.severity === "INFO"
                  ? styles.alertCardInfo
                  : ""
              }`}
            >
              <div className={styles.alertInfoGroup}>
                <div className={styles.alertTitle}>
                  [{item.severity}] {item.title_fa} ({item.title})
                </div>
                <div className={styles.alertDetails}>
                  محیط: {item.component} | علت رویداد: {item.threshold_breach}
                </div>
                <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                  {item.details}
                </div>
              </div>
              <Button
                className={styles.secondaryButton}
                onClick={() => handleAcknowledgeAlert(item.id)}
              >
                تایید دریافت هشدار (Acknowledge)
              </Button>
            </div>
          ))
        )}
      </section>

      {/* 6. Distributed Traces Waterfall Inspector */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>🧭 ناظر ردگیری توزیع‌شده و آبشار پردازش (Distributed Traces)</h2>
          <span className={styles.sectionSubtitle}>ردگیری ارتباطات بین درگاه وب، دیتابیس، کش و هوش مصنوعی با شناسه یکتای Trace ID</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {traces.map((trace) => {
            const isExpanded = expandedTraceId === trace.trace_id;
            return (
              <div key={trace.trace_id} className={styles.traceItem}>
                <div className={styles.traceSummary} onClick={() => toggleTrace(trace.trace_id)}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                    <span style={{ fontSize: "var(--font-size-xs)" }}>{isExpanded ? "▼" : "◀"}</span>
                    <span className={styles.traceOperation}>{trace.root_operation}</span>
                    <span className={styles.statusBadge} style={{ fontSize: "11px", padding: "2px 6px" }}>
                      HTTP {trace.http_status}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                    <span className={styles.traceDuration}>کل تاخیر: {trace.total_duration_ms} ms</span>
                    <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)" }}>
                      {trace.span_count} اسپن
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-primary)" }}>
                      #{trace.trace_id.slice(0, 12)}
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className={styles.spanList}>
                    {trace.spans.map((sp) => (
                      <div key={sp.id} className={styles.spanRow}>
                        <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
                          <span style={{ color: "var(--color-primary)", fontWeight: "bold" }}>[{sp.service_name}]</span>
                          <span>{sp.operation_name}</span>
                        </div>
                        <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
                          <span>{sp.duration_ms} ms</span>
                          <span style={{ color: sp.status === "OK" ? "var(--color-success)" : "var(--color-warning)" }}>
                            {sp.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Structured JSON Log Stream Viewer */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>📋 جریان لاگ‌های ساختاریافته بلادرنگ (Structured JSON Logs)</h2>
          <div className={styles.logFilters}>
            <Input
              type="text"
              placeholder="جستجو در مسیر، آی‌پی یا شناسه..."
              className={styles.logSearchInput}
              value={logSearch}
              onChange={(e) => {
                setLogSearch(e.target.value);
                handleFilterLogs(logLevel, e.target.value);
              }}
            />
            {["ALL", "INFO", "WARNING", "ERROR"].map((lvl) => (
              <Button
                key={lvl}
                className={logLevel === lvl ? styles.actionButton : styles.secondaryButton}
                style={{ fontSize: "11px", padding: "4px 8px" }}
                onClick={() => handleFilterLogs(lvl, logSearch)}
              >
                {lvl}
              </Button>
            ))}
          </div>
        </div>

        <div className={styles.logTerminal}>
          {logs.length === 0 ? (
            <div style={{ color: "var(--color-text-muted)", padding: "var(--space-2)" }}>
              لاگی منطبق با فیلترهای انتخابی یافت نشد.
            </div>
          ) : (
            logs.map((item, idx) => (
              <div key={idx} className={styles.logRow}>
                <span style={{ color: "var(--color-text-muted)" }}>{item.timestamp.slice(11, 19)}</span>
                <span
                  className={`${styles.logBadge} ${
                    item.level === "ERROR"
                      ? styles.logError
                      : item.level === "WARNING"
                      ? styles.logWarn
                      : styles.logInfo
                  }`}
                >
                  [{item.level}]
                </span>
                <span style={{ color: "var(--color-primary)" }}>{item.method}</span>
                <span style={{ color: "var(--color-text-primary)" }}>{item.path}</span>
                <span style={{ color: item.status_code >= 400 ? "var(--color-warning)" : "var(--color-success)" }}>
                  {item.status_code}
                </span>
                <span style={{ color: "var(--color-text-secondary)" }}>{item.duration_ms}ms</span>
                <span style={{ color: "var(--color-text-muted)" }}>ip={item.client_ip}</span>
                <span style={{ color: "var(--color-text-muted)" }}>trace={item.trace_id.slice(0, 8)}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
