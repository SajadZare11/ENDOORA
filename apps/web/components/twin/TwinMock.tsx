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
  const [exams, setExams] = useState<Exam[]>([]),
    [examId, setExamId] = useState(""),
    [skill, setSkill] = useState("reading");
  const [mock, setMock] = useState<Mock | null>(null),
    [result, setResult] = useState<TwinMockResult | null>(null),
    [error, setError] = useState("");
  const selected = exams.find((e) => e.id === examId),
    file = selected?.modules.find((m) => m.skill === skill)?.file;
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
      <span className={styles.eyebrow}>TWIN AUTO-PLAY</span>
      <h2>
        {isFa ? "از دوقلو بخواه آزمون بدهد" : "Ask my Twin to take a mock test"}
      </h2>
      <p>
        {isFa
          ? "پیش از شروع تایمر، احتمال موفقیت هر سؤال و یک گرم‌کردن پنج‌دقیقه‌ای را ببین."
          : "Inspect question probabilities and a five-minute warm-up before starting the timer."}
      </p>
      <div className={styles.controls}>
        <label>
          {isFa ? "آزمون" : "Mock exam"}
          <select
            value={examId}
            onChange={(e) => {
              setMock(null);
              setResult(null);
              setError("");
              setExamId(e.target.value);
            }}
          >
            {exams.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          {isFa ? "مهارت" : "Section"}
          <select
            value={skill}
            onChange={(e) => {
              setMock(null);
              setResult(null);
              setError("");
              setSkill(e.target.value);
            }}
          >
            <option value="reading">Reading</option>
            <option value="listening">Listening</option>
          </select>
        </label>
        <button className={styles.selected} disabled={!mock} onClick={run}>
          {isFa ? "شبیه‌سازی آزمون من" : "Simulate on my Twin"}
        </button>
      </div>
      {error && <p role="alert">{error}</p>}
      {result && (
        <div aria-live="polite">
          <div className={styles.metricGrid}>
            <div>
              <small>
                {isFa ? "پاسخ صحیح مورد انتظار" : "Expected correct"}
              </small>
              <strong>
                {result.expectedCorrect.toFixed(1)} / {result.questions.length}
              </strong>
            </div>
            <div>
              <small>{isFa ? "سؤال نیازمند مرور" : "Questions at risk"}</small>
              <strong>{atRisk.length}</strong>
            </div>
            <div>
              <small>
                {isFa ? "زمان محاسبه محلی" : "Local prediction time"}
              </small>
              <strong>{result.elapsedMs.toFixed(2)} ms</strong>
            </div>
          </div>
          <p className={styles.muted}>
            {isFa
              ? "این‌ها احتمال‌اند، نه پیش‌بینی قطعی شکست. نگاشت اختصاصی سؤال:"
              : "Probabilities indicate risk, not certain failures. Questions with explicit Q-matrix mappings:"}{" "}
            {result.mappedCount}/{result.questions.length}.{" "}
            {isFa
              ? "سایر سؤال‌ها از پیشین مهارت استفاده می‌کنند."
              : "Other questions use the section prior."}
          </p>
          <div className={styles.questionGrid}>
            {result.questions.map((q) => (
              <span
                key={q.id}
                className={q.atRisk ? styles.risk : styles.safe}
                title={`${q.id}: ${q.prompt}`}
                aria-label={`Question ${q.number}: ${Math.round(q.predictedProbability * 100)}%, ${q.mapped ? "Q-matrix" : "section prior"}`}
              >
                Q{q.number}
                <strong>{Math.round(q.predictedProbability * 100)}%</strong>
                <small>
                  {q.mapped ? "Q-matrix" : isFa ? "پیشین" : "prior"}
                </small>
              </span>
            ))}
          </div>
          <h3>
            {isFa ? "گرم‌کردن پنج‌دقیقه‌ای" : "Five-minute surgical warm-up"}
          </h3>
          <ol className={styles.warmup}>
            {result.warmupSkillIds.length ? (
              result.warmupSkillIds.map((id) => {
                const c = TWIN_CATALOG.find((c) => c.skillId === id);
                return (
                  <li key={id}>
                    <strong>
                      {300 / result.warmupSkillIds.length}{" "}
                      {isFa ? "ثانیه" : "sec"} ·{" "}
                      {isFa ? c?.titleFa : c?.titleEn}
                    </strong>
                    <span>{c?.aefReference}</span>
                    <Link href={`/skills/grammar/game?cefr=${c?.cefr}`}>
                      {isFa ? "مرور دستور زبان" : "Review grammar foundations"}
                    </Link>
                  </li>
                );
              })
            ) : (
              <>
                <li>
                  <strong>3 min</strong>
                  <Link href={`/ielts/clinics`}>
                    {isFa
                      ? "مرور کلینیک مهارت و دام‌ها"
                      : "Review a section clinic and common traps"}
                  </Link>
                </li>
                <li>
                  <strong>2 min</strong>
                  {isFa
                    ? "دو سؤال با زمان‌سنج تمرین کن و دلیل پاسخ را توضیح بده."
                    : "Rehearse two timed questions and explain each answer."}
                </li>
              </>
            )}
          </ol>
          {!!result.warmupSkillIds.length && (
            <button className={styles.button} onClick={() => setWarmup(true)}>
              {isFa
                ? "شروع گرم‌کردن پنج‌دقیقه‌ای"
                : "Start five-minute warm-up"}
            </button>
          )}
          {warmup && (
            <TwinWarmup skillIds={result.warmupSkillIds} isFa={isFa} />
          )}
          <Link
            className={styles.selected}
            href={`/ielts/exam/${examId}?skill=${skill}`}
          >
            {isFa ? "آماده‌ام؛ ورود به آزمون" : "Ready — enter the exam"}
          </Link>
        </div>
      )}
    </section>
  );
}
