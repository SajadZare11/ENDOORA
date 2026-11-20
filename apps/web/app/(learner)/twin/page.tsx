"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useLearnerHome } from "../../../components/learner/LearnerShell";
import { useTwin } from "../../../components/twin/useTwin";
import {
  getLearnerTwin,
  resetLearnerTwin,
} from "../../../lib/ai/learner-twin-store";
import { IELTS_SKILLS, type IELTSSkill } from "../../../lib/ai/learner-twin-types";
import styles from "../../../components/twin/twin.module.css";

const TwinConstellation = dynamic(
  () => import("../../../components/twin/TwinConstellation"),
);
const TwinRadarChart = dynamic(
  () => import("../../../components/twin/TwinRadarChart"),
);
const TwinFuture = dynamic(() => import("../../../components/twin/TwinFuture"));
const TwinMock = dynamic(() => import("../../../components/twin/TwinMock"));
const TwinPipeline = dynamic(
  () => import("../../../components/twin/TwinPipeline"),
);

const SKILL_META: Record<IELTSSkill, { fa: string; en: string; icon: string; colorClass: string }> = {
  listening: { fa: "شنیداری (Listening)", en: "Listening", icon: "🎧", colorClass: "skillListening" },
  reading: { fa: "درک مطلب (Reading)", en: "Reading", icon: "📖", colorClass: "skillReading" },
  writing: { fa: "نگارش (Writing)", en: "Writing", icon: "✍️", colorClass: "skillWriting" },
  speaking: { fa: "مکالمه (Speaking)", en: "Speaking", icon: "🎙️", colorClass: "skillSpeaking" },
};

export default function LearnerTwinPage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";
  const snapshot = useTwin();
  const [tab, setTab] = useState("overview");
  const [confirmReset, setConfirmReset] = useState(false);

  const forecast = snapshot ? getLearnerTwin()?.getIELTSForecast() : null;
  const c = snapshot?.calibration;

  function exportModel() {
    if (!snapshot) return;
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(snapshot, null, 2)], {
        type: "application/json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "endoora-learner-twin.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const tabs = isFa
    ? [
        ["overview", "دوقلوی من (نمای کلی)"],
        ["future", "ماشین زمان (پیش‌بینی رشد)"],
        ["mock", "شبیه‌ساز آزمون (ماک)"],
        ["pipeline", "پشت صحنه هوش مصنوعی"],
        ["evidence", "تنظیمات و سوابق دوقلو"],
      ]
    : [
        ["overview", "My Twin (Overview)"],
        ["future", "Time Machine (Future Self)"],
        ["mock", "Mock Exam Simulator"],
        ["pipeline", "Inside the AI Brain"],
        ["evidence", "Twin Memory & Settings"],
      ];

  const twinAccuracyPct = c?.totalInteractions
    ? Math.min(99, Math.max(35, Math.round((1 - c.rollingMAE) * 100)))
    : null;

  return (
    <div className={styles.dashboard}>
      <Link href="/dashboard" className={styles.back}>
        {isFa ? "← بازگشت به پنل دانش‌آموز" : "← Back to Student Panel"}
      </Link>

      {/* Vibrant Hero Header with AI Avatar */}
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroPillGroup}>
            <span className={styles.heroPill}>
              ✨ {isFa ? "هوش مصنوعی اختصاصی ایندورا" : "Endoora Personal AI"}
            </span>
            <span className={styles.heroPillSecondary}>
              🔒 {isFa ? "پردازش امن روی مرورگر تو" : "100% Private in Browser"}
            </span>
          </div>

          <h1 className={styles.heroTitle}>
            {isFa
              ? "دوقلوی هوشمند تو؛ همگام با یادگیری‌ات"
              : "Your Learner Twin — Learns Alongside You"}
          </h1>

          <p className={styles.heroSubtitle}>
            {isFa
              ? "اینجا یک نسخه هوشمند از ذهن آموزشی توست که با هر تمرین، مهارت و تسلطت را تحلیل می‌کند، نمره آزمونت را تخمین می‌زند و بهت می‌گوید برای جهش بعدی دقیقاً چه مباحثی را باید مرور کنی."
              : "A live, personalized model of your English cognition. It tracks your true mastery, predicts your exam readiness, and reveals the exact foundational topics you need to practice next."}
          </p>
        </div>

        {/* Modern Glowing AI Core Avatar */}
        <div className={styles.orb} aria-hidden="true">
          <div className={styles.orbCore}>
            <span className={styles.orbEmoji}>🧠</span>
            <span className={styles.orbPulseText}>AI TWIN</span>
          </div>
          <div className={styles.orbRingOne} />
          <div className={styles.orbRingTwo} />
          <div className={styles.orbGlow} />
        </div>
      </header>

      {!snapshot ? (
        <div className={styles.loadingCard} role="status">
          <span className={styles.loadingSpinner} aria-hidden="true" />
          <p>
            {isFa
              ? "در حال بیدارکردن و آماده‌سازی دوقلوی هوشمند تو…"
              : "Initializing your personal learning twin…"}
          </p>
        </div>
      ) : (
        <>
          {/* Top 3 Friendly & Vibrant Metric Cards */}
          <section
            className={styles.metricGrid}
            aria-label={isFa ? "خلاصه وضعیت شناخت دوقلو" : "Twin Intelligence Summary"}
          >
            {/* Metric 1 */}
            <div className={styles.metricCard}>
              <div className={styles.metricIconBox}>🎯</div>
              <div className={styles.metricTextBox}>
                <span className={styles.metricLabel}>
                  {isFa ? "میزان شناخت دوقلو از تو" : "How Well Twin Knows You"}
                </span>
                <strong className={styles.metricValue}>
                  {twinAccuracyPct ? `${twinAccuracyPct}٪` : (isFa ? "آماده شروع ✨" : "Ready ✨")}
                </strong>
                <span className={styles.metricNote}>
                  {c?.totalInteractions
                    ? (isFa ? "بر اساس پاسخ‌ها و دقت تمرین‌های ثبت‌شده" : "Calibrated from real practice responses")
                    : (isFa ? "با چند تمرین اول، دوقلو با سبک یادگیریت آشنا میشه" : "Start practicing to train your twin")}
                </span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className={styles.metricCard}>
              <div className={styles.metricIconBox}>📊</div>
              <div className={styles.metricTextBox}>
                <span className={styles.metricLabel}>
                  {isFa ? "تمرین‌ها و چالش‌های تحلیل‌شده" : "Practices Analyzed"}
                </span>
                <strong className={styles.metricValue}>
                  {c?.totalInteractions ?? 0} {isFa ? "مورد" : "items"}
                </strong>
                <span className={styles.metricNote}>
                  {c?.totalInteractions
                    ? (isFa ? "شواهد یادگیری فعال در حافظه مدل" : "Active learning evidence points")
                    : (isFa ? "از بخش گرامر یا لایتنر شروع کن" : "Begin in Leitner or Grammar")}
                </span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className={styles.metricCard}>
              <div className={styles.metricIconBox}>🛡️</div>
              <div className={styles.metricTextBox}>
                <span className={styles.metricLabel}>
                  {isFa ? "سپر فیلتر حواس‌پرتی و شانس" : "Distraction & Luck Shield"}
                </span>
                <strong className={styles.metricValue}>
                  {c?.shieldedInteractions ?? 0} {isFa ? "پاسخ" : "filtered"}
                </strong>
                <span className={styles.metricNote}>
                  {isFa
                    ? "حدس‌های شانسی یا مکث‌ها فیلتر شدند تا نتیجه واقعی باشه"
                    : "Lucky guesses and distracted slips safely filtered"}
                </span>
              </div>
            </div>
          </section>

          {/* Clean Pill Tab Navigation */}
          <nav
            className={styles.tabsNav}
            aria-label={isFa ? "بخش‌های دوقلو" : "Twin Navigation"}
          >
            {tabs.map(([id, label]) => {
              const isActive = tab === id;
              return (
                <button
                  key={id}
                  className={`${styles.tabPill} ${isActive ? styles.tabPillActive : ""}`}
                  aria-pressed={isActive}
                  onClick={() => setTab(id)}
                >
                  {label}
                </button>
              );
            })}
          </nav>

          {/* TAB 1: OVERVIEW */}
          {tab === "overview" && (
            <>
              {/* 6-Skill Radar Chart & Overall Power Hub (IELTS 1-9 Scale) */}
              <TwinRadarChart
                snapshot={snapshot}
                forecastBand={forecast?.overall.band}
                forecastCefr={forecast?.predictedCEFR}
                isFa={isFa}
              />

              {/* 4-Skill Exam Forecast Section */}
              <section className={styles.card}>
                <div className={styles.sectionHead}>
                  <div>
                    <span className={styles.eyebrow}>
                      {isFa ? "کارنامه هوشمند پیش‌بینی" : "FOUR-SKILL OUTLOOK"}
                    </span>
                    <h2 className={styles.sectionTitle}>
                      {isFa
                        ? "پیش‌بینی نمره مهارت‌های چهارگانه شما"
                        : "Predicted English Skills & IELTS Readiness"}
                    </h2>
                    <p className={styles.sectionDesc}>
                      {isFa
                        ? "این نمرات بر مبنای عملکرد واقعی شما در لایتنر، آزمون‌ها و تمرین‌های ویدیوها محاسبه شده است."
                        : "Skill bands are grounded in your real answers, audio checks, and quizzes across Endoora."}
                    </p>
                  </div>

                  {/* Overall Band Pill */}
                  <div className={styles.overallScoreBadge}>
                    <span className={styles.overallScoreLabel}>
                      {isFa ? "نمره تخمینی کل (Overall)" : "Overall Band"}
                    </span>
                    <strong className={styles.overallScoreValue}>
                      {forecast?.overall.band
                        ? `Band ${forecast.overall.band.toFixed(1)} · ${forecast.predictedCEFR}`
                        : "Band 6.0 · B2"}
                    </strong>
                  </div>
                </div>

                {/* 4 Skill Cards Grid */}
                <div className={styles.bandGrid}>
                  {IELTS_SKILLS.map((skill) => {
                    const b = forecast?.[skill];
                    const meta = SKILL_META[skill];
                    const count = snapshot.modalityMastery[skill].evidenceCount;

                    return (
                      <div key={skill} className={`${styles.bandCard} ${styles[meta.colorClass]}`}>
                        <div className={styles.bandCardTop}>
                          <span className={styles.bandSkillIcon}>{meta.icon}</span>
                          <span className={styles.bandSkillName}>{isFa ? meta.fa : meta.en}</span>
                        </div>

                        <strong className={styles.bandScore}>
                          {count ? b?.band.toFixed(1) : "—"}
                        </strong>

                        <div className={styles.bandCardFooter}>
                          <span className={styles.bandIntervalText}>
                            {count
                              ? `${isFa ? "محدوده نمره:" : "Range:"} ${b?.ci95[0].toFixed(1)} تا ${b?.ci95[1].toFixed(1)}`
                              : (isFa ? "در انتظار اولین تمرین ✨" : "Ready for practice")}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Skill Tree & Learning Map */}
              <TwinConstellation snapshot={snapshot} isFa={isFa} />
            </>
          )}

          {/* TAB 2: FUTURE SELF (TIME MACHINE) */}
          {tab === "future" && <TwinFuture snapshot={snapshot} isFa={isFa} />}

          {/* TAB 3: MOCK EXAM SIMULATOR */}
          {tab === "mock" && <TwinMock isFa={isFa} />}

          {/* TAB 4: INSIDE THE MODEL */}
          {tab === "pipeline" && <TwinPipeline isFa={isFa} />}

          {/* TAB 5: MEMORY & CONTROLS */}
          {tab === "evidence" && (
            <section className={styles.card}>
              <div className={styles.sectionHead}>
                <div>
                  <span className={styles.eyebrow}>
                    {isFa ? "حافظه و حریم خصوصی" : "MEMORY & PRIVACY"}
                  </span>
                  <h2 className={styles.sectionTitle}>
                    {isFa ? "تنظیمات، سوابق و حافظه دوقلو" : "Twin Memory & Data Controls"}
                  </h2>
                  <p className={styles.sectionDesc}>
                    {isFa
                      ? "دوقلوی یادگیرنده به طور اختصاصی روی مرورگر شما کار می‌کند. هیچ داده‌ای به سرورهای خارجی فروخته یا ارسال نمی‌شود."
                      : "Your learner model runs securely within this browser session, keeping your cognitive data private."}
                  </p>
                </div>
              </div>

              <div className={styles.controlsBar}>
                <button type="button" className={styles.btnSecondary} onClick={exportModel}>
                  <span>📥</span>
                  <span>{isFa ? "دانلود نسخه پشتیبان (JSON)" : "Export Snapshot (JSON)"}</span>
                </button>

                <button
                  type="button"
                  className={styles.btnDanger}
                  onClick={() => setConfirmReset(true)}
                >
                  <span>🔄</span>
                  <span>{isFa ? "شروع مجدد دوقلو از صفر" : "Reset Local Model"}</span>
                </button>

                <Link className={styles.btnOutline} href="/account/data-controls">
                  <span>🛡️</span>
                  <span>{isFa ? "مدیریت داده‌ها و حریم خصوصی" : "Account Privacy Controls"}</span>
                </Link>
              </div>

              {confirmReset && (
                <div className={styles.confirmBox}>
                  <p>
                    ⚠️{" "}
                    {isFa
                      ? "آیا مطمئن هستید که می‌خواهید تمام سوابق و آموخته‌های دوقلو پاک شود و از ابتدا شروع کنید؟"
                      : "Are you sure you want to clear your local Twin’s memory and start fresh?"}
                  </p>
                  <div className={styles.confirmActions}>
                    <button
                      type="button"
                      className={styles.btnDangerFilled}
                      onClick={() => {
                        resetLearnerTwin();
                        setConfirmReset(false);
                      }}
                    >
                      {isFa ? "بله، حافظه دوقلو پاک شود" : "Yes, Reset Model"}
                    </button>
                    <button
                      type="button"
                      className={styles.btnSecondary}
                      onClick={() => setConfirmReset(false)}
                    >
                      {isFa ? "انصراف" : "Cancel"}
                    </button>
                  </div>
                </div>
              )}

              <h3 className={styles.historyTitle}>
                {isFa ? "آخرین پاسخ‌ها و تعاملات ثبت‌شده" : "Latest Recorded Interactions"}
              </h3>

              {snapshot.history.length ? (
                <div className={styles.tableScroll}>
                  <table className={styles.friendlyTable}>
                    <thead>
                      <tr>
                        <th>{isFa ? "زمان" : "Time"}</th>
                        <th>{isFa ? "نوع چالش" : "Activity"}</th>
                        <th>{isFa ? "پیش‌بینی دوقلو → نتیجه تو" : "Predicted → Actual"}</th>
                        <th>{isFa ? "درجه اطمینان" : "Confidence"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {snapshot.history.toReversed().map((e, i) => (
                        <tr key={`${e.timestamp}-${i}`}>
                          <td>
                            {new Date(e.timestamp).toLocaleString(
                              isFa ? "fa-IR" : "en-GB",
                              { timeZone: "Asia/Tehran" },
                            )}
                          </td>
                          <td>
                            <span className={styles.modalityTag}>{e.modality}</span>
                            {e.itemId && (
                              <small className={styles.blockMuted}>{e.itemId}</small>
                            )}
                          </td>
                          <td>
                            <strong>
                              {Math.round(e.prediction * 100)}٪ → {Math.round(e.score * 100)}٪
                            </strong>
                          </td>
                          <td>
                            <span className={styles.reliabilityChip}>
                              {Math.round(e.reliability * 100)}٪
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={styles.emptyHistoryBox}>
                  <span>💡</span>
                  <p>
                    {isFa
                      ? "هنوز تمرینی انجام نداده‌اید. با حل چند سوال در لایتنر یا تمرین گرامر، اولین شواهد یادگیری ثبت می‌شود!"
                      : "No learning interactions recorded yet. Complete a quiz in Leitner or Grammar to start training your twin!"}
                  </p>
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}
