'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./ielts-practice-hub.module.css";
import {
  fetchPublicIELTSTests,
  IELTSTestListItem,
  MANDATORY_IELTS_DISCLAIMER_TEXT,
} from "../../../../lib/ielts";
import {
  startIELTSSession,
  fetchSessionHistory,
  IELTSPracticeMode,
  SessionHistoryItem,
} from "../../../../lib/ielts-simulator";

export default function IELTSPracticeHubPage() {
  const router = useRouter();

  const [tests, setTests] = useState<IELTSTestListItem[]>([]);
  const [history, setHistory] = useState<SessionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Selected mode per test: { [testId]: mode }
  const [selectedModes, setSelectedModes] = useState<Record<string, IELTSPracticeMode>>({});
  const [startingTestId, setStartingTestId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [testsData, historyData] = await Promise.all([
        fetchPublicIELTSTests({ test_type: typeFilter !== "all" ? typeFilter : undefined }),
        fetchSessionHistory().catch(() => []),
      ]);
      setTests(testsData.results || []);
      setHistory(historyData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در بارگذاری آزمون‌های شبیه‌ساز آیلتس.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [typeFilter]);

  const handleStartExam = async (testId: string) => {
    setStartingTestId(testId);
    setError(null);
    try {
      const mode = selectedModes[testId] || "full_simulation";
      if (mode === "writing_practice") {
        router.push("/ielts/writing");
        return;
      }
      const session = await startIELTSSession(testId, mode);
      router.push(`/ielts/practice/${session.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در آغاز آزمون.");
      setStartingTestId(null);
    }
  };

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <header className={styles.header}>
        <span className={styles.kicker}>IELTS Academic & General Training Simulator</span>
        <h1 className={styles.title}>شبیه‌ساز رسمی و زمان‌بندی‌شده آزمون آیلتس</h1>
        <p className={styles.subtitle}>
          تمرین در محیط کامپیوتری واقعی آیلتس با زمان‌سنج استاندارد، تصحیح خودکار مهارت‌های شنیداری و خواندن،
          تبدیل نمرات خام به باند ۱ تا ۹ و تحلیل تشخیصی نقاط ضعف.
        </p>
      </header>

      {/* Mandatory Disclaimer Banner */}
      <aside className={styles.disclaimerBanner} role="note">
        <span className={styles.disclaimerBadge}>سلب مسئولیت قانونی</span>
        <div>
          <strong>{MANDATORY_IELTS_DISCLAIMER_TEXT}</strong>
          <div>
            محتوای این شبیه‌ساز ۱۰۰٪ اورجینال و تولید هیئت علمی اندورا است و آزمون رسمی نیست.
          </div>
        </div>
      </aside>

      {/* Error Notice */}
      {error && <div style={{ background: "var(--color-danger-bg)", color: "var(--color-danger-text)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", fontSize: "var(--font-size-sm)" }}>{error}</div>}

      {/* Writing Simulation Quick Entry Banner */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", paddingInline: "var(--space-4)", paddingBlock: "var(--space-3)", flexWrap: "wrap", gap: "var(--space-3)" }}>
        <div>
          <strong style={{ fontSize: "var(--font-size-sm)" }}>✍️ شبیه‌ساز نگارش آیلتس (Writing Tasks 1 & 2)</strong>
          <p style={{ margin: 0, fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
            محیط استاندارد کامپیوتری، شمارشگر زنده کلمات و ارزیابی چندمعیاره هوش مصنوعی بر پایه ۴ معیار رسمی.
          </p>
        </div>
        <Link href="/ielts/writing" className={styles.actionButton} style={{ textDecoration: "none", paddingInline: "var(--space-4)", paddingBlock: "var(--space-2)", margin: 0, inlineSize: "auto" }}>
          ورود به اتاق رایتینگ ➔
        </Link>
      </div>

      {/* Controls / Filter Bar */}
      <div className={styles.controlsBar}>
        <div className={styles.filterGroup}>
          <span style={{ fontSize: "var(--font-size-sm)", fontWeight: 700 }}>نوع آزمون:</span>
          <button
            type="button"
            className={`${styles.filterButton} ${typeFilter === "all" ? styles.filterButtonActive : ""}`}
            onClick={() => setTypeFilter("all")}
          >
            همه ماک‌ها
          </button>
          <button
            type="button"
            className={`${styles.filterButton} ${typeFilter === "academic" ? styles.filterButtonActive : ""}`}
            onClick={() => setTypeFilter("academic")}
          >
            IELTS Academic
          </button>
          <button
            type="button"
            className={`${styles.filterButton} ${typeFilter === "general_training" ? styles.filterButtonActive : ""}`}
            onClick={() => setTypeFilter("general_training")}
          >
            IELTS General Training
          </button>
        </div>
      </div>

      {/* Tests Grid */}
      <main className={styles.testGrid}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "var(--space-6)", gridColumn: "1 / -1" }}>
            در حال بارگذاری شبیه‌سازها...
          </div>
        ) : tests.length === 0 ? (
          <div style={{ textAlign: "center", padding: "var(--space-6)", gridColumn: "1 / -1" }}>
            هیچ آزمون فعالی یافت نشد.
          </div>
        ) : (
          tests.map((test) => {
            const currentMode = selectedModes[test.id] || "full_simulation";

            return (
              <article key={test.id} className={styles.testCard}>
                <div className={styles.cardHeader}>
                  <div>
                    <h2 className={styles.cardTitleFa}>{test.title_fa}</h2>
                    <p className={styles.cardTitleEn}>{test.title_en}</p>
                  </div>
                  <span className={styles.badgeType}>
                    {test.test_type === "academic" ? "Academic" : "General"}
                  </span>
                </div>

                <div className={styles.specRow}>
                  <div className={styles.specItem}>
                    <span>⏱️</span>
                    <span>{test.total_duration_minutes} دقیقه</span>
                  </div>
                  <div className={styles.specItem}>
                    <span>📝</span>
                    <span>{test.total_questions} سوال در {test.sections_count} بخش</span>
                  </div>
                  <div className={styles.specItem}>
                    <span>🎯</span>
                    <span>{test.difficulty_level}</span>
                  </div>
                </div>

                <div className={styles.modeSelection}>
                  <span className={styles.modeLabel}>نحوه شرکت در آزمون:</span>
                  <div className={styles.modeButtons}>
                    <button
                      type="button"
                      className={`${styles.modeBtn} ${currentMode === "full_simulation" ? styles.modeBtnSelected : ""}`}
                      onClick={() => setSelectedModes({ ...selectedModes, [test.id]: "full_simulation" })}
                    >
                      شبیه‌ساز کامل (Full Mock)
                    </button>
                    <button
                      type="button"
                      className={`${styles.modeBtn} ${currentMode === "reading_practice" ? styles.modeBtnSelected : ""}`}
                      onClick={() => setSelectedModes({ ...selectedModes, [test.id]: "reading_practice" })}
                    >
                      تمرین اختصاصی Reading
                    </button>
                    <button
                      type="button"
                      className={`${styles.modeBtn} ${currentMode === "listening_practice" ? styles.modeBtnSelected : ""}`}
                      onClick={() => setSelectedModes({ ...selectedModes, [test.id]: "listening_practice" })}
                    >
                      تمرین اختصاصی Listening
                    </button>
                    <button
                      type="button"
                      className={`${styles.modeBtn} ${currentMode === "writing_practice" ? styles.modeBtnSelected : ""}`}
                      onClick={() => setSelectedModes({ ...selectedModes, [test.id]: "writing_practice" })}
                    >
                      تمرین اختصاصی Writing
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.actionButton}
                  onClick={() => handleStartExam(test.id)}
                  disabled={startingTestId === test.id}
                >
                  {startingTestId === test.id ? "در حال آماده‌سازی آزمون..." : "ورود به اتاق آزمون (Start Exam) ➔"}
                </button>
              </article>
            );
          })
        )}
      </main>

      {/* Candidate Past Attempts / History */}
      {history.length > 0 && (
        <section className={styles.historySection} aria-label="Candidate Exam History">
          <h2 className={styles.historyTitle}>سوابق آزمون‌های شما (Exam History)</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>عنوان آزمون</th>
                  <th>حالت</th>
                  <th>وضعیت</th>
                  <th>نمره باند آیلتس</th>
                  <th>تاریخ برگزاری</th>
                  <th>کارنامه و تحلیل</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.id}>
                    <td>
                      <strong>{h.test_title_fa}</strong>
                    </td>
                    <td>
                      <span style={{ fontSize: "var(--font-size-xs)" }}>
                        {h.mode === "full_simulation" ? "شبیه‌ساز کامل" : h.mode}
                      </span>
                    </td>
                    <td>
                      {h.status === "in_progress" ? (
                        <span style={{ color: "var(--color-warning-text)", fontWeight: 700 }}>در جریان</span>
                      ) : h.status === "timed_out" ? (
                        <span style={{ color: "var(--color-danger-text)", fontWeight: 700 }}>اتمام زمان</span>
                      ) : (
                        <span style={{ color: "var(--color-success-text)", fontWeight: 700 }}>تکمیل‌شده</span>
                      )}
                    </td>
                    <td>
                      {h.scaled_band_score ? (
                        <span className={styles.bandScoreBadge}>Band {h.scaled_band_score}</span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td style={{ fontSize: "var(--font-size-xs)", direction: "ltr", textAlign: "right" }}>
                      {new Date(h.started_at).toLocaleDateString()}
                    </td>
                    <td>
                      {h.status === "in_progress" ? (
                        <Link href={`/ielts/practice/${h.id}`} className={styles.linkButton}>
                          ادامه آزمون ➔
                        </Link>
                      ) : (
                        <Link href={`/ielts/practice/${h.id}/report`} className={styles.linkButton}>
                          مشاهده کارنامه تشخیصی ➔
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
