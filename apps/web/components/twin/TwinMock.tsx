"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getLearnerTwin, TWIN_CATALOG } from "../../lib/ai/learner-twin-store";
import type {
  TwinMock as Mock,
  TwinMockResult,
} from "../../lib/ai/learner-twin-types";
import styles from "./twin.module.css";

interface Exam {
  id: string;
  title: string;
  modules: Array<{ skill: string; file: string; count: number }>;
}

const TwinWarmup = dynamic(() => import("./TwinWarmup"));

export default function TwinMock({ isFa }: { isFa: boolean }) {
  const [warmup, setWarmup] = useState(false);
  const [exams, setExams] = useState<Exam[]>([]);
  const [examId, setExamId] = useState("");
  const [skill, setSkill] = useState("reading");
  const [mock, setMock] = useState<Mock | null>(null);
  const [result, setResult] = useState<TwinMockResult | null>(null);
  const [error, setError] = useState("");

  const selected = exams.find((e) => e.id === examId);
  const file = selected?.modules.find((m) => m.skill === skill)?.file;

  useEffect(() => {
    const c = new AbortController();
    void fetch("/twin/manifest.json", { signal: c.signal })
      .then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then((data: Exam[]) => {
        setExams(data);
        setExamId(data[0]?.id ?? "");
      })
      .catch(() => {
        if (!c.signal.aborted) setError("Could not load mock catalog.");
      });
    return () => c.abort();
  }, []);

  useEffect(() => {
    if (!file) return;
    const c = new AbortController();
    void fetch(`/twin/mocks/${file}`, { signal: c.signal })
      .then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then((value) => {
        if (!c.signal.aborted) setMock(value);
      })
      .catch(() => {
        if (!c.signal.aborted) setError("Could not load selected mock.");
      });
    return () => c.abort();
  }, [file]);

  const run = () => {
    setWarmup(false);
    const model = getLearnerTwin();
    if (model && mock) setResult(model.simulateMock(mock));
  };

  const atRisk = result?.questions.filter((q) => q.atRisk) ?? [];

  return (
    <section className={styles.card}>
      <div className={styles.sectionHead}>
        <div>
          <span className={styles.eyebrow}>
            {isFa ? "شبیه‌ساز هوشمند ماک" : "SMART MOCK SIMULATOR"}
          </span>
          <h2 className={styles.sectionTitle}>
            {isFa ? "از دوقلو بخواه به جای تو آزمون آزمایشی بدهد!" : "Ask Your Twin to Take a Mock Test"}
          </h2>
          <p className={styles.sectionDesc}>
            {isFa
              ? "قبل از اینکه تایمر آزمون واقعی را شروع کنی، دوقلوی هوشمندت سوالات را شبیه‌سازی می‌کند تا نقاط چالش‌برانگیز را شناسایی کرده و با یک تمرین ۵ دقیقه‌ای ذهنت را کاملاً گرم کند."
              : "Before starting your timed mock exam, simulate your performance to spot risky questions and prepare with a focused 5-minute warm-up."}
          </p>
        </div>
      </div>

      <div className={styles.controlsBar}>
        <label className={styles.selectLabel}>
          <span>{isFa ? "انتخاب آزمون:" : "Select Exam:"}</span>
          <select
            value={examId}
            onChange={(e) => {
              setMock(null);
              setResult(null);
              setError("");
              setExamId(e.target.value);
            }}
            className={styles.styledSelect}
          >
            {exams.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.selectLabel}>
          <span>{isFa ? "بخش مهارت:" : "Section:"}</span>
          <select
            value={skill}
            onChange={(e) => {
              setMock(null);
              setResult(null);
              setError("");
              setSkill(e.target.value);
            }}
            className={styles.styledSelect}
          >
            <option value="reading">{isFa ? "درک مطلب (Reading)" : "Reading"}</option>
            <option value="listening">{isFa ? "شنیداری (Listening)" : "Listening"}</option>
          </select>
        </label>

        <button
          type="button"
          className={styles.btnPrimary}
          disabled={!mock}
          onClick={run}
        >
          <span>🚀</span>
          <span>{isFa ? "شروع شبیه‌سازی با دوقلو" : "Simulate with Twin"}</span>
        </button>
      </div>

      {error && <p role="alert" className={styles.errorAlert}>{error}</p>}

      {result && (
        <div aria-live="polite" className={styles.mockResultContainer}>
          <div className={styles.metricGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricIconBox}>🎯</div>
              <div className={styles.metricTextBox}>
                <span className={styles.metricLabel}>
                  {isFa ? "پاسخ‌های صحیح مورد انتظار" : "Expected Correct"}
                </span>
                <strong className={styles.metricValue}>
                  {result.expectedCorrect.toFixed(1)} / {result.questions.length}
                </strong>
                <span className={styles.metricNote}>
                  {isFa ? `درصد تخمینی: ${Math.round((result.expectedCorrect / result.questions.length) * 100)}٪` : "Estimated score rate"}
                </span>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIconBox}>⚠️</div>
              <div className={styles.metricTextBox}>
                <span className={styles.metricLabel}>
                  {isFa ? "سوالات نیازمند دقت بیشتر" : "Challenging Questions"}
                </span>
                <strong className={styles.metricValue}>
                  {atRisk.length} {isFa ? "سوال" : "questions"}
                </strong>
                <span className={styles.metricNote}>
                  {isFa ? "سوالاتی که احتمال خطا در آن‌ها بالاتر است" : "Questions with lower success probability"}
                </span>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIconBox}>⚡</div>
              <div className={styles.metricTextBox}>
                <span className={styles.metricLabel}>
                  {isFa ? "سرعت پردازش هوش مصنوعی" : "Simulation Latency"}
                </span>
                <strong className={styles.metricValue}>
                  {result.elapsedMs.toFixed(1)} ms
                </strong>
                <span className={styles.metricNote}>
                  {isFa ? "محاسبه آنی روی دستگاه شما" : "Instant local inference"}
                </span>
              </div>
            </div>
          </div>

          <h3 className={styles.mockGridTitle}>
            {isFa ? "نقشه شانس موفقیت در تک‌تک سوالات آزمون" : "Question-by-Question Success Probability"}
          </h3>

          <div className={styles.questionGrid}>
            {result.questions.map((q) => (
              <span
                key={q.id}
                className={q.atRisk ? styles.risk : styles.safe}
                title={`${q.id}: ${q.prompt}`}
                aria-label={`Question ${q.number}: ${Math.round(q.predictedProbability * 100)}%`}
              >
                <strong>Q{q.number}</strong>
                <span>{Math.round(q.predictedProbability * 100)}%</span>
              </span>
            ))}
          </div>

          {/* Warmup Section */}
          <div className={styles.warmupCard}>
            <div className={styles.warmupCardHeader}>
              <span className={styles.warmupIcon}>🔥</span>
              <div>
                <h3 className={styles.warmupTitle}>
                  {isFa ? "آماده‌سازی و گرم‌کردن ۵ دقیقه‌ای ذهن" : "5-Minute Pre-Exam Warm-Up"}
                </h3>
                <p className={styles.warmupSubtitle}>
                  {isFa
                    ? "قبل از ورود به امتحان، با حل این چند تمرین هدفمند مباحث پیش‌نیاز را مرور کن تا بهترین نتیجه را بگیری."
                    : "Sharpen your focus on targeted foundation topics before starting the timed exam."}
                </p>
              </div>
            </div>

            <ol className={styles.warmupList}>
              {result.warmupSkillIds.length ? (
                result.warmupSkillIds.map((id) => {
                  const c = TWIN_CATALOG.find((cat) => cat.skillId === id);
                  return (
                    <li key={id} className={styles.warmupListItem}>
                      <div className={styles.warmupItemInfo}>
                        <strong>{isFa ? c?.titleFa : c?.titleEn}</strong>
                        <span className={styles.warmupRef}>{c?.aefReference}</span>
                      </div>
                      <Link href={`/skills/grammar/game?cefr=${c?.cefr}`} className={styles.warmupActionLink}>
                        {isFa ? "تمرین سریع ⚡" : "Quick Practice ⚡"}
                      </Link>
                    </li>
                  );
                })
              ) : (
                <li className={styles.warmupListItem}>
                  <div className={styles.warmupItemInfo}>
                    <strong>{isFa ? "مرور کلینیک مهارت‌ها و دام‌های رایج" : "Review common exam traps"}</strong>
                    <span className={styles.warmupRef}>{isFa ? "۳ دقیقه مطالعه نکات کلیدی" : "3-minute strategic refresher"}</span>
                  </div>
                  <Link href={`/ielts/clinics`} className={styles.warmupActionLink}>
                    {isFa ? "ورود به کلینیک 📖" : "Open Clinic 📖"}
                  </Link>
                </li>
              )}
            </ol>

            <div className={styles.warmupActions}>
              {!!result.warmupSkillIds.length && (
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setWarmup(true)}
                >
                  <span>⏱️</span>
                  <span>{isFa ? "شروع تایمر گرم‌کردن ۵ دقیقه‌ای" : "Start 5-Minute Warm-Up Drill"}</span>
                </button>
              )}

              <Link
                className={styles.btnPrimary}
                href={`/ielts/exam/${examId}?skill=${skill}`}
              >
                <span>🏁</span>
                <span>{isFa ? "کاملاً آماده‌ام؛ ورود به آزمون واقعی" : "Ready — Enter Timed Exam"}</span>
              </Link>
            </div>

            {warmup && (
              <TwinWarmup skillIds={result.warmupSkillIds} isFa={isFa} />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
