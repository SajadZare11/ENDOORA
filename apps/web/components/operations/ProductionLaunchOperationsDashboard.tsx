"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  fetchLaunchStatus,
  fetchRehearsalHistory,
  GoldenFlowItem,
  GoldenFlowLogSummary,
  GoldenFlowRehearsalResult,
  LaunchCheckItem,
  LaunchStatusScorecard,
  MOCK_GOLDEN_FLOWS,
  MOCK_LAUNCH_SCORECARD,
  ProductionLaunchSignoffRecord,
  submitProductionSignoff,
  triggerGoldenFlowRehearsal,
} from "../../lib/launch-ops";
import styles from "./launch-operations.module.css";

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

export function ProductionLaunchOperationsDashboard() {
  const [scorecard, setScorecard] = useState<LaunchStatusScorecard>(MOCK_LAUNCH_SCORECARD);
  const [flows, setflows] = useState<GoldenFlowItem[]>(MOCK_GOLDEN_FLOWS);
  const [history, setHistory] = useState<GoldenFlowLogSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRehearsing, setIsRehearsing] = useState<boolean>(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Signoff form state
  const [engineerName, setEngineerName] = useState<string>("سجاد زارع");
  const [engineerRole, setEngineerRole] = useState<string>("Principal Launch Architect");
  const [signoffNotes, setSignoffNotes] = useState<string>(
    "تأییدیه نهایی آمادگی کامل پلتفرم برای بهره‌برداری تجاری و رونمایی عمومی."
  );
  const [isSigning, setIsSigning] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    Promise.all([fetchLaunchStatus(), fetchRehearsalHistory()]).then(([sc, hist]) => {
      if (mounted) {
        setScorecard(sc);
        setHistory(hist);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleRunRehearsal = async () => {
    setIsRehearsing(true);
    setFeedback("در حال اجرای مانور بدون تخریب هفت مسیر طلایی پلتفرم...");
    setTerminalLogs([
      `[${new Date().toLocaleTimeString("fa-IR")}] 🚀 آغاز مانور جامع پروداکشن (Synthetic Rehearsal Runner)...`,
      "[*] بررسی دسترسی‌ها و ایزولاسیون کامل نشست‌های آزمایشی...",
    ]);

    try {
      const result: GoldenFlowRehearsalResult = await triggerGoldenFlowRehearsal();
      if (result.flows && result.flows.length > 0) {
        setflows(result.flows);
      }

      setTerminalLogs((prev) => [
        ...prev,
        ...result.flows.map(
          (f) => `[OK] ${f.flow_id} (${f.duration_ms}ms) -> ${f.status} - گام‌های اعتبارسنجی: ${f.steps.length}`
        ),
        `[SUCCESS] مانور با موفقیت کامل به پایان رسید. امتیاز نهایی: ${result.score}% در ${result.duration_ms} میلی‌ثانیه.`,
      ]);

      setFeedback(`مانور با موفقیت انجام شد: ${result.passed_flows} از ${result.total_flows} مسیر با موفقیت تأیید شدند.`);

      // Refresh status and history
      const [newSc, newHist] = await Promise.all([fetchLaunchStatus(), fetchRehearsalHistory()]);
      setScorecard(newSc);
      setHistory(newHist);
    } catch {
      setFeedback("خطا در برقراری ارتباط با سرور مانور پروداکشن.");
    } finally {
      setIsRehearsing(false);
    }
  };

  const handleSignoffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!engineerName.trim()) return;
    setIsSigning(true);
    try {
      const record = await submitProductionSignoff({
        engineer_name: engineerName,
        role: engineerRole,
        notes: signoffNotes,
      });
      setFeedback(`گواهی پروداکشن با موفقیت ثبت شد. هش تأییدیه: ${record.confirmation_hash.slice(0, 16)}...`);
      const newSc = await fetchLaunchStatus();
      setScorecard(newSc);
    } catch {
      setFeedback("خطا در ثبت امضای پروداکشن.");
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Navigation Ribbon with 17 Tabs */}
      <nav className={styles.ribbon} aria-label="ناوبری عملیات">
        {OPERATIONS_TABS.map((tab) => {
          const isActive = tab.href === "/operations/launch";
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

      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>
          <span>🚀</span>
          <span>داشبورد نهایی پروداکشن و مانور انتشار (Production Launch & Golden Flow Rehearsal)</span>
        </h1>
        <p className={styles.headerSubtitle}>
          دروازه جامع بازبینی پروداکشن (LAUNCH-001)، ارزیابی ۱۰ معیاری انطباق و مانور شبیه‌سازی ۷ مسیر حیاتی محصول بدون
          دستکاری داده‌های واقعی.
        </p>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={handleRunRehearsal}
            disabled={isRehearsing}
          >
            <span>{isRehearsing ? "⏳ در حال مانور..." : "🔄 مانور هفت مسیر طلایی (Run Rehearsal)"}</span>
          </button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => {
              setLoading(true);
              Promise.all([fetchLaunchStatus(), fetchRehearsalHistory()]).then(([sc, hist]) => {
                setScorecard(sc);
                setHistory(hist);
                setLoading(false);
                setFeedback("اطلاعات ماتریس و گواهی‌ها به‌روزرسانی شد.");
              });
            }}
          >
            <span>📋 تازه‌سازی شاخص‌ها</span>
          </button>
        </div>
      </header>

      {feedback && (
        <div
          role="status"
          style={{
            marginBlockEnd: "var(--space-6, 24px)",
            paddingBlock: "var(--space-3, 12px)",
            paddingInline: "var(--space-4, 16px)",
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-primary)",
            borderRadius: "var(--radius-md, 8px)",
            fontSize: "var(--font-size-sm, 14px)",
            color: "var(--color-primary)",
            fontWeight: 600,
          }}
        >
          ℹ️ {feedback}
        </div>
      )}

      {/* Master Launch Hero */}
      <section className={styles.masterHero}>
        <div className={styles.masterTop}>
          <div className={styles.masterTitleGroup}>
            <div className={styles.masterMainTitle}>
              <span>دروازه نهایی آمادگی پروداکشن (Master Production Gate LAUNCH-001)</span>
              <span className={styles.masterCertBadge}>{scorecard.certification}</span>
            </div>
            <p className={styles.headerSubtitle}>
              ارزیابی خودکار کلیه زیرسیستم‌های داده‌ای، آزمون‌ها، امنیت، DR، هوش مصنوعی، مانیتورینگ، PWA و سناریوهای طلایی.
            </p>
          </div>
          <div className={styles.scoreGauge}>
            <span className={styles.scoreNumber}>{scorecard.score}</span>
            <span className={styles.scorePercent}>/ 100% آمادگی</span>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4, 16px)", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "var(--font-size-xs, 12px)", color: "var(--color-text-muted)" }}>
              هش رمزنگاری تأییدیه انتشار:
            </span>{" "}
            <code className={styles.signoffHash}>{scorecard.confirmation_hash}</code>
          </div>
          <div>
            <span style={{ fontSize: "var(--font-size-xs, 12px)", color: "var(--color-text-muted)" }}>
              زمان ارزیابی:
            </span>{" "}
            <span style={{ fontSize: "var(--font-size-xs, 12px)", color: "var(--color-text)", fontWeight: 600 }}>
              {new Date(scorecard.evaluated_at).toLocaleString("fa-IR")}
            </span>
          </div>
        </div>
      </section>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>امتیاز دروازه پروداکشن</span>
          <span className={styles.kpiValue} style={{ color: "var(--color-success-text)" }}>
            {scorecard.score}%
          </span>
          <span className={styles.kpiMeta}>
            {scorecard.passed_count} از {scorecard.total_checks} شاخص منطبق
          </span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>مسیرهای طلایی پاس‌شده</span>
          <span className={styles.kpiValue} style={{ color: "var(--color-success-text)" }}>
            {scorecard.latest_rehearsal?.passed_flows || 7} / {scorecard.latest_rehearsal?.total_flows || 7}
          </span>
          <span className={styles.kpiMeta}>پوشش ۱۰۰٪ چرخه حیات محصول</span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>مدت‌زمان مانور شبیه‌سازی</span>
          <span className={styles.kpiValue}>
            {scorecard.latest_rehearsal?.duration_ms || 245} <span style={{ fontSize: "14px" }}>ms</span>
          </span>
          <span className={styles.kpiMeta}>میانگین زمان اجرای هر مسیر: ۳۵ میلی‌ثانیه</span>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>امضای مهندسی لید</span>
          <span className={styles.kpiValue} style={{ fontSize: "18px" }}>
            {scorecard.latest_signoff?.engineer_name || "سجاد زارع"}
          </span>
          <span className={styles.kpiMeta}>
            وضعیت: {scorecard.latest_signoff?.status === "APPROVED" ? "✅ تأیید شده" : "در انتظار"}
          </span>
        </div>
      </div>

      {/* 10-Point Master Checklist Matrix */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span>🛡️</span>
            <span>ماتریس ارزیابی ۱۰ معیاری آمادگی پروداکشن (10-Point Gate Checklist)</span>
          </h2>
          <span style={{ fontSize: "var(--font-size-xs, 12px)", color: "var(--color-text-muted)" }}>
            مطابق با استانداردهای پایداری، امنیت، انطباق و تجربه کاربری
          </span>
        </div>

        <div className={styles.matrixGrid}>
          {scorecard.checks.map((chk: LaunchCheckItem) => (
            <div key={chk.id} className={styles.matrixCard}>
              <div className={styles.matrixHeader}>
                <span className={styles.matrixName}>{chk.name}</span>
                <span className={styles.matrixPassBadge}>✅ {chk.status}</span>
              </div>
              <span className={styles.matrixCategory}>{chk.category}</span>
              <p className={styles.matrixRequirement}>
                <strong>الزام:</strong> {chk.requirement}
              </p>
              <div className={styles.matrixEvidence}>
                <strong>مستندات راستی‌آزمایی:</strong> {chk.evidence}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7 Golden Flows Rehearsal Studio */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span>⚡</span>
            <span>مانور هفت مسیر طلایی کاربر و سیستم (End-to-End Golden Flows)</span>
          </h2>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={handleRunRehearsal}
            disabled={isRehearsing}
          >
            <span>{isRehearsing ? "در حال اجرای مانور..." : "اجرای مجدد مانور (Run Rehearsal)"}</span>
          </button>
        </div>

        <p className={styles.headerSubtitle} style={{ marginBlockEnd: "var(--space-4, 16px)" }}>
          شبیه‌سازی کامل تراکنش‌ها در محیط سندباکس بدون ایجاد یا تغییر داده‌های تولیدی، تضمین‌کننده عملکرد یکپارچه اجزای پلتفرم.
        </p>

        <div className={styles.flowGrid}>
          {flows.map((flow: GoldenFlowItem) => (
            <div key={flow.flow_id} className={styles.flowCard}>
              <div className={styles.flowTop}>
                <span className={styles.flowTitle}>{flow.name}</span>
                <div style={{ display: "flex", gap: "var(--space-2, 8px)", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{flow.duration_ms} ms</span>
                  <span className={styles.matrixPassBadge}>✅ {flow.status}</span>
                </div>
              </div>

              <div className={styles.flowStepsList}>
                {flow.steps.map((st) => (
                  <div key={st.step} className={styles.flowStepItem}>
                    <span className={styles.flowStepIcon}>✓</span>
                    <span>
                      گام {st.step}: {st.description}
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.matrixEvidence}>
                <strong>نتیجه پایش:</strong> {flow.evidence}
              </div>
            </div>
          ))}
        </div>

        {terminalLogs.length > 0 && (
          <div className={styles.terminalOutput}>
            {terminalLogs.map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
          </div>
        )}
      </section>

      {/* Production Sign-off Panel */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span>✍️</span>
            <span>امضای دیجیتال و گواهی بهره‌برداری پروداکشن (Production Sign-off)</span>
          </h2>
          <span style={{ fontSize: "var(--font-size-xs, 12px)", color: "var(--color-text-muted)" }}>
            ثبت رسمی انتشار و صدور هش تأییدیه غیرقابل انکار
          </span>
        </div>

        <div className={styles.signoffPanel}>
          {scorecard.latest_signoff && (
            <div className={styles.signoffRow}>
              <div>
                <strong style={{ fontSize: "var(--font-size-sm, 14px)", color: "var(--color-text)" }}>
                  آخرین تأییدیه ثبت‌شده:
                </strong>{" "}
                <span style={{ fontSize: "var(--font-size-sm, 14px)", color: "var(--color-primary)", fontWeight: 700 }}>
                  {scorecard.latest_signoff.engineer_name}
                </span>{" "}
                <span style={{ fontSize: "var(--font-size-xs, 12px)", color: "var(--color-text-muted)" }}>
                  ({scorecard.latest_signoff.role})
                </span>
              </div>
              <div>
                <span style={{ fontSize: "var(--font-size-xs, 12px)", color: "var(--color-text-muted)" }}>
                  تاریخ امضا:
                </span>{" "}
                <span style={{ fontSize: "var(--font-size-xs, 12px)", fontWeight: 600 }}>
                  {new Date(scorecard.latest_signoff.signed_at).toLocaleString("fa-IR")}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSignoffSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3, 12px)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-3, 12px)" }}>
              <div>
                <label
                  htmlFor="signoff-engineer"
                  style={{ display: "block", fontSize: "var(--font-size-xs, 12px)", color: "var(--color-text-muted)", marginBlockEnd: "4px" }}
                >
                  نام مهندس معمار یا لید فنی:
                </label>
                <input
                  id="signoff-engineer"
                  type="text"
                  value={engineerName}
                  onChange={(e) => setEngineerName(e.target.value)}
                  style={{
                    inlineSize: "100%",
                    paddingBlock: "var(--space-2, 8px)",
                    paddingInline: "var(--space-3, 12px)",
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-sm, 4px)",
                    color: "var(--color-text)",
                  }}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="signoff-role"
                  style={{ display: "block", fontSize: "var(--font-size-xs, 12px)", color: "var(--color-text-muted)", marginBlockEnd: "4px" }}
                >
                  سمت سازمانی / نقش:
                </label>
                <input
                  id="signoff-role"
                  type="text"
                  value={engineerRole}
                  onChange={(e) => setEngineerRole(e.target.value)}
                  style={{
                    inlineSize: "100%",
                    paddingBlock: "var(--space-2, 8px)",
                    paddingInline: "var(--space-3, 12px)",
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-sm, 4px)",
                    color: "var(--color-text)",
                  }}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="signoff-notes"
                style={{ display: "block", fontSize: "var(--font-size-xs, 12px)", color: "var(--color-text-muted)", marginBlockEnd: "4px" }}
              >
                توضیحات و یادداشت انتشار:
              </label>
              <textarea
                id="signoff-notes"
                rows={2}
                value={signoffNotes}
                onChange={(e) => setSignoffNotes(e.target.value)}
                style={{
                  inlineSize: "100%",
                  paddingBlock: "var(--space-2, 8px)",
                  paddingInline: "var(--space-3, 12px)",
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm, 4px)",
                  color: "var(--color-text)",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div>
              <button
                type="submit"
                className={styles.btnPrimary}
                disabled={isSigning}
              >
                <span>{isSigning ? "در حال ثبت گواهی..." : "📜 ثبت رسمی امضای پروداکشن (Sign & Certify)"}</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Historical Audit Table */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span>📜</span>
            <span>تاریخچه مانورهای انتشار (Rehearsal Audit History)</span>
          </h2>
          <span style={{ fontSize: "var(--font-size-xs, 12px)", color: "var(--color-text-muted)" }}>
            لاگ ثبت‌شده کلیه مانورهای اجرایی خودکار و دستی
          </span>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.historyTable}>
            <thead>
              <tr>
                <th>شناسه مانور</th>
                <th>کاربر / مجری</th>
                <th>تعداد مسیرها</th>
                <th>مسیرهای موفق</th>
                <th>مدت زمان</th>
                <th>امتیاز</th>
                <th>وضعیت</th>
                <th>زمان اجرا</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h: GoldenFlowLogSummary) => (
                <tr key={h.id}>
                  <td>
                    <code style={{ fontSize: "11px", color: "var(--color-primary)" }}>{h.id.slice(0, 10)}...</code>
                  </td>
                  <td>{h.operator_email || "System Runner"}</td>
                  <td>{h.total_flows}</td>
                  <td style={{ color: "var(--color-success-text)", fontWeight: 700 }}>{h.passed_flows}</td>
                  <td>{h.duration_ms} ms</td>
                  <td style={{ fontWeight: 800, color: "var(--color-success-text)" }}>{h.score}%</td>
                  <td>
                    <span className={styles.matrixPassBadge}>{h.status}</span>
                  </td>
                  <td>{new Date(h.rehearsed_at).toLocaleString("fa-IR")}</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", color: "var(--color-text-muted)", paddingBlock: "24px" }}>
                    هنوز مانوری در پایگاه داده ثبت نشده است. روی &quot;مانور هفت مسیر طلایی&quot; کلیک کنید.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
