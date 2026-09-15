"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./ai-operations.module.css";
import {
  fetchAIOperationsOverview,
  fetchPromptRegistry,
  fetchAIRequestLogs,
  testPromptTemplate,
  resetCircuitBreaker,
  updateAIBudget,
  AIOperationsOverview,
  PromptRegistryItem,
  AIRequestLogItem,
  PromptTestResult,
} from "../../lib/ai-ops";

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
];

export function AIModelPromptRegistryOperations() {
  const pathname = usePathname();
  const [overview, setOverview] = useState<AIOperationsOverview | null>(null);
  const [prompts, setPrompts] = useState<PromptRegistryItem[]>([]);
  const [logs, setLogs] = useState<AIRequestLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [testModalPrompt, setTestModalPrompt] = useState<PromptRegistryItem | null>(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<PromptTestResult | null>(null);

  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [newBudget, setNewBudget] = useState<number>(5.0);
  const [updatingBudget, setUpdatingBudget] = useState(false);

  const [resettingCb, setResettingCb] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [ovData, prData, logData] = await Promise.all([
          fetchAIOperationsOverview(),
          fetchPromptRegistry(),
          fetchAIRequestLogs(),
        ]);
        setOverview(ovData);
        setPrompts(prData);
        setLogs(logData);
        if (ovData?.budget_controls) {
          setNewBudget(ovData.budget_controls.daily_budget_usd);
        }
      } catch (err) {
        console.error("Failed loading AI ops data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleTestPrompt = async (prompt: PromptRegistryItem) => {
    setTestModalPrompt(prompt);
    setTestResult(null);
    setTesting(true);
    try {
      const res = await testPromptTemplate(prompt.id);
      setTestResult(res);
    } catch (err) {
      console.error("Error testing prompt:", err);
    } finally {
      setTesting(false);
    }
  };

  const handleResetCircuitBreaker = async () => {
    setResettingCb(true);
    try {
      await resetCircuitBreaker();
      if (overview) {
        setOverview({
          ...overview,
          circuit_breaker: {
            ...overview.circuit_breaker,
            state: "CLOSED",
            is_healthy: true,
          },
        });
      }
      setNotification("کلید مدارشکن هوش مصنوعی با موفقیت بازنشانی شد.");
      setTimeout(() => setNotification(null), 5000);
    } catch (err) {
      console.error("Error resetting circuit breaker:", err);
    } finally {
      setResettingCb(false);
    }
  };

  const handleUpdateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingBudget(true);
    try {
      await updateAIBudget(newBudget);
      if (overview) {
        setOverview({
          ...overview,
          budget_controls: {
            ...overview.budget_controls,
            daily_budget_usd: newBudget,
            remaining_budget_usd: Math.max(0, newBudget - overview.budget_controls.current_spend_usd),
          },
        });
      }
      setBudgetModalOpen(false);
      setNotification(`سقف بودجه روزانه به $${newBudget.toFixed(2)} به‌روزرسانی شد.`);
      setTimeout(() => setNotification(null), 5000);
    } catch (err) {
      console.error("Error updating budget:", err);
    } finally {
      setUpdatingBudget(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p>در حال دریافت اطلاعات راهبری رجیستری پرامپت و تلمتری هوش مصنوعی...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 12-Tab Operations Navigation Ribbon */}
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
            کنسول راهبری مدل‌ها و رجیستری پرامپت هوش مصنوعی (OPS-005)
          </h1>
          <p className={styles.headerDesc}>
            مدیریت نسخه‌های پرامپت، نظارت بر سقف بودجه توکن روزانه، زنجیره مسیریابی مدل‌ها، توزیع تاخیر و بودجه خطا (SLA: 99.5%)
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => setBudgetModalOpen(true)}
          >
            <span>💰</span> تنظیم سقف بودجه روزانه
          </button>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={handleResetCircuitBreaker}
            disabled={resettingCb}
          >
            <span>⚡</span> {resettingCb ? "در حال بازنشانی..." : "بازنشانی مدارشکن (Circuit Breaker)"}
          </button>
        </div>
      </header>

      {/* Notification Toast */}
      {notification && (
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
          ✅ {notification}
        </div>
      )}

      {/* KPI Cards */}
      <section className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>بودجه خطا (Error Budget Remaining)</span>
          <span className={styles.kpiValue}>
            {overview?.sla_metrics.error_budget_remaining_pct}%
          </span>
          <span className={styles.badgeSuccess}>
            SLA: {overview?.sla_metrics.target_sla_pct}% (پایداری فعلی: {overview?.sla_metrics.current_success_rate_pct}%)
          </span>
          <span className={styles.kpiDetail}>
            خطای مجاز: {overview?.sla_metrics.error_budget_allowed_pct}% | نرخ خطای واقعی: {overview?.sla_metrics.error_rate_pct}%
          </span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>بودجه مصرفی روزانه (LLM Spend)</span>
          <span className={styles.kpiValue}>
            ${overview?.budget_controls.current_spend_usd.toFixed(2)}
          </span>
          <span className={styles.badgeSuccess}>
            سقف مجاز: ${overview?.budget_controls.daily_budget_usd.toFixed(2)} ({overview?.budget_controls.spend_percentage}٪ مصرف)
          </span>
          <span className={styles.kpiDetail}>
            موجودی باقیمانده: ${overview?.budget_controls.remaining_budget_usd.toFixed(2)}
          </span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>توزیع تاخیر (Latency Distribution)</span>
          <span className={styles.kpiValue}>
            {overview?.latency_percentiles_ms.p50} ms
          </span>
          <span className={styles.badgeSuccess}>
            P50: {overview?.latency_percentiles_ms.p50}ms | P95: {overview?.latency_percentiles_ms.p95}ms
          </span>
          <span className={styles.kpiDetail}>
            P99: {overview?.latency_percentiles_ms.p99}ms | P90: {overview?.latency_percentiles_ms.p90}ms
          </span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>قالب‌های رجیستری پرامپت</span>
          <span className={styles.kpiValue}>
            {overview?.prompt_count} پرامپت
          </span>
          <span className={styles.badgeSuccess}>
            ۱۰۰٪ انطباق با اسکیما (Validated)
          </span>
          <span className={styles.kpiDetail}>
            توکن مصرفی امروز: {overview?.budget_controls.total_tokens_today.toLocaleString()} توکن
          </span>
        </div>
      </section>

      {/* Model Router & Fallback Cascade */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span>🌐</span> توپولوژی زنجیره مسیریابی مدل‌ها (Model Router & Fallback Cascade)
        </h2>
        <p className={styles.sectionSubtitle}>
          آبشار سلسله‌مراتبی از مدل‌های پردازش زبان باز برای تضمین پایداری بدون وقفه همراه با کلید خودکار مدارشکن
        </p>

        <div className={styles.tierGrid}>
          {overview?.model_tiers.map((tier) => {
            const cardClass = tier.tier === 1
              ? `${styles.tierCard} ${styles.tierCardPrimary}`
              : tier.tier === 2
              ? `${styles.tierCard} ${styles.tierCardSecondary}`
              : tier.tier === 3 || tier.tier === 4
              ? `${styles.tierCard} ${styles.tierCardStandard}`
              : `${styles.tierCard} ${styles.tierCardFallback}`;

            return (
              <div key={tier.tier} className={cardClass}>
                <div className={styles.tierHeader}>
                  <span className={styles.tierTitle}>سطح {tier.tier}: {tier.name}</span>
                  <span className={tier.status === "ACTIVE" ? styles.badgeSuccess : styles.badgeWarning}>
                    {tier.status === "ACTIVE" ? "فعال" : "آماده‌باش"}
                  </span>
                </div>
                <div className={styles.tierDetails}>
                  <div><strong>نقش در آبشار:</strong> {tier.role}</div>
                  <div><strong>تأمین‌کننده:</strong> {tier.provider} ({tier.is_free ? "رایگان / Free" : "تجاری"})</div>
                  <div><strong>شناسه مدل:</strong> <code>{tier.model_id}</code></div>
                  <div><strong>تاخیر میانه (P50):</strong> {tier.latency_p50_ms} میلی‌ثانیه</div>
                  <div><strong>هزینه هر ۱,۰۰۰ توکن:</strong> {tier.cost_per_1k_tokens}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Circuit Breaker Status Bar */}
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
            <strong>وضعیت کلید مدارشکن (Circuit Breaker):</strong>{" "}
            <span style={{ color: overview?.circuit_breaker.state === "CLOSED" ? "var(--color-success-text)" : "var(--color-error-text)", fontWeight: 700 }}>
              {overview?.circuit_breaker.state === "CLOSED" ? "بسته / سالم (CLOSED)" : "قطع‌شده / فعال (OPEN)"}
            </span>{" "}
            | مهلت تایم‌اوت: {overview?.circuit_breaker.timeout_seconds} ثانیه | آستانه خطا: ۳ بار متوالی
          </div>
          <div>
            تعداد قطع در ۲۴ ساعت: {overview?.circuit_breaker.trip_count_24h} مرتبه
          </div>
        </div>
      </section>

      {/* Prompt Registry Catalog */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span>📑</span> کاتالوگ قالب‌های رجیستری پرامپت (Versioned Prompt Templates)
        </h2>
        <p className={styles.sectionSubtitle}>
          کلیه پرامپت‌های سامانه‌های هوش مصنوعی اندورا به‌صورت نسخه‌دار و با اعتبارسنجی ساختار JSON نگهداری می‌شوند.
        </p>

        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>شناسه پرامپت</th>
                <th>ویژگی پلتفرم</th>
                <th>نسخه</th>
                <th>شرح پداگوژیک</th>
                <th>سقف توکن</th>
                <th>نمره بنچمارک</th>
                <th>وضعیت اعتبارسنجی</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {prompts.map((p) => (
                <tr key={p.id}>
                  <td><code>{p.id}</code></td>
                  <td>{p.feature}</td>
                  <td>v{p.version}</td>
                  <td style={{ maxWidth: 280, whiteSpace: "normal" }}>{p.description}</td>
                  <td>{p.token_budget} توکن</td>
                  <td>
                    <span style={{ fontWeight: 600, color: "var(--color-success-text)" }}>
                      {p.benchmark_score}%
                    </span>
                  </td>
                  <td>
                    <span className={styles.badgeSuccess}>
                      ✅ {p.evaluation_status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={styles.secondaryBtn}
                      onClick={() => handleTestPrompt(p)}
                    >
                      🧪 آزمون و ارزیابی
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Structured LLM Traces & Logs Table */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span>🔍</span> ردپای ممیزی درخواست‌های هوش مصنوعی (Structured LLM Traces)
        </h2>
        <p className={styles.sectionSubtitle}>
          رهگیری توکن‌ها، زمان پاسخ، مصرف بودجه، و وضعیت فعال‌سازی فال‌بک برای هر فراخوانی موتور هوش مصنوعی
        </p>

        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>شناسه</th>
                <th>ویژگی</th>
                <th>مدل مصرفی</th>
                <th>تاخیر (ms)</th>
                <th>توکن پرامپت</th>
                <th>توکن پاسخ</th>
                <th>مجموع توکن</th>
                <th>هزینه ($)</th>
                <th>وضعیت</th>
                <th>زمان ثبت</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td><code>#{log.id}</code></td>
                  <td>{log.feature}</td>
                  <td><code>{log.model_name.split("/").pop() || log.model_name}</code></td>
                  <td>{log.response_time_ms} ms</td>
                  <td>{log.prompt_tokens}</td>
                  <td>{log.completion_tokens}</td>
                  <td><strong>{log.total_tokens}</strong></td>
                  <td>${log.total_cost_usd.toFixed(4)}</td>
                  <td>
                    {log.is_fallback ? (
                      <span className={styles.badgeWarning}>فال‌بک فعال</span>
                    ) : log.success ? (
                      <span className={styles.badgeSuccess}>موفق</span>
                    ) : (
                      <span className={styles.badgeDanger}>خطا</span>
                    )}
                  </td>
                  <td>{new Date(log.created_at).toLocaleTimeString("fa-IR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Prompt Testing Modal */}
      {testModalPrompt && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>
              ارزیابی و تست پرامپت: <code>{testModalPrompt.id}</code>
            </h2>
            <div className={styles.formGroup}>
              <span className={styles.label}>ویژگی هدف: {testModalPrompt.feature}</span>
              <span className={styles.label}>نسخه: v{testModalPrompt.version}</span>
              <span className={styles.label}>سقف توکن مجاز: {testModalPrompt.token_budget}</span>
            </div>

            <div className={styles.formGroup}>
              <span className={styles.label}>پیش‌نمایش پرامپت سیستم (System Prompt):</span>
              <div className={styles.promptSnippet}>
                {testModalPrompt.system_prompt_snippet}
              </div>
            </div>

            {testing ? (
              <p>در حال اجرای ارزیابی ترکیبی اسکیما و سنجش کیفیت...</p>
            ) : testResult ? (
              <div
                style={{
                  background: "var(--color-canvas)",
                  padding: "var(--space-4)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                  marginBlock: "var(--space-4)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBlockEnd: "var(--space-2)" }}>
                  <strong>نتیجه اعتبارسنجی اسکیما:</strong>
                  <span className={testResult.status === "PASS" ? styles.badgeSuccess : styles.badgeDanger}>
                    {testResult.status === "PASS" ? "✅ تأیید ۱۰۰٪" : "❌ رد شده"}
                  </span>
                </div>
                <div><strong>تخمین توکن:</strong> {testResult.token_estimate} توکن</div>
                <div><strong>مدت ارزیابی:</strong> {testResult.evaluation_duration_ms} میلی‌ثانیه</div>
                <div><strong>نمره بنچمارک پداگوژیک:</strong> {testResult.benchmark_score}%</div>
                <div><strong>بررسی انطباق:</strong> {testResult.validation_check}</div>
              </div>
            ) : null}

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setTestModalPrompt(null)}
              >
                بستن
              </button>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => handleTestPrompt(testModalPrompt)}
                disabled={testing}
              >
                {testing ? "در حال ارزیابی..." : "اجرای مجدد آزمون"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Daily Budget Update Modal */}
      {budgetModalOpen && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>تنظیم سقف بودجه روزانه مصرف هوش مصنوعی</h2>
            <form onSubmit={handleUpdateBudget}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="ai-daily-budget">
                  سقف بودجه روزانه به دلار (USD):
                </label>
                <input
                  id="ai-daily-budget"
                  type="number"
                  step="0.5"
                  min="1"
                  max="100"
                  className={styles.input}
                  value={newBudget}
                  onChange={(e) => setNewBudget(parseFloat(e.target.value) || 1.0)}
                />
              </div>
              <p style={{ fontSize: "0.8125rem", color: "var(--color-muted)", marginBlockEnd: "var(--space-4)" }}>
                در صورت رسیدن مصرف روزانه به این سقف، کلید مدارشکن به‌صورت خودکار ترافیک را به کش استاتیک پداگوژیک منتقل می‌کند.
              </p>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => setBudgetModalOpen(false)}
                  disabled={updatingBudget}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className={styles.primaryBtn}
                  disabled={updatingBudget}
                >
                  {updatingBudget ? "در حال ذخیره..." : "ذخیره سقف بودجه"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
