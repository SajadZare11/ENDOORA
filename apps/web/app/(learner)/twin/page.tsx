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
import { IELTS_SKILLS } from "../../../lib/ai/learner-twin-types";
import styles from "../../../components/twin/twin.module.css";
const TwinConstellation = dynamic(
  () => import("../../../components/twin/TwinConstellation"),
);
const TwinFuture = dynamic(() => import("../../../components/twin/TwinFuture"));
const TwinMock = dynamic(() => import("../../../components/twin/TwinMock"));
const TwinPipeline = dynamic(
  () => import("../../../components/twin/TwinPipeline"),
);
export default function LearnerTwinPage() {
  const { locale } = useLearnerHome(),
    isFa = locale === "fa",
    snapshot = useTwin();
  const [tab, setTab] = useState("overview"),
    [confirmReset, setConfirmReset] = useState(false);
  const forecast = snapshot ? getLearnerTwin()?.getIELTSForecast() : null,
    c = snapshot?.calibration;
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
        ["overview", "دوقلوی من"],
        ["future", "آینده من"],
        ["mock", "آزمون دوقلو"],
        ["pipeline", "درون مدل"],
        ["evidence", "شواهد و کنترل‌ها"],
      ]
    : [
        ["overview", "My Twin"],
        ["future", "Future self"],
        ["mock", "Mock autoplay"],
        ["pipeline", "Inside the model"],
        ["evidence", "Evidence & controls"],
      ];
  return (
    <div className={styles.dashboard}>
      <Link href="/dashboard" className={styles.back}>
        {isFa ? "← بازگشت به داشبورد" : "← Back to dashboard"}
      </Link>
      <header className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>ENDOORA / LEARNER TWIN</span>
          <h1>
            {isFa
              ? "نسخه‌ای از تو که با تو یاد می‌گیرد."
              : "A Twin that learns with you."}
          </h1>
          <p>
            {isFa
              ? "تسلط، عدم قطعیت و مسیر آینده‌ات؛ بر پایه شواهد آموزشی خودت."
              : "Your mastery, uncertainty, and possible futures — grounded in your learning evidence."}
          </p>
          <span className={styles.tag}>
            {isFa
              ? "پردازش محلی · بدون وزن عصبی تازه"
              : "Local computation · no new neural weights"}
          </span>
        </div>
        <div className={styles.orb} aria-hidden="true">
          <span>μ</span>
          <i />
          <i />
        </div>
      </header>
      {!snapshot ? (
        <p role="status">
          {isFa ? "در حال آماده‌سازی مدل شخصی…" : "Preparing your local model…"}
        </p>
      ) : (
        <>
          <section
            className={styles.metricGrid}
            aria-label={isFa ? "کالیبراسیون زنده" : "Live calibration"}
          >
            <div>
              <small>{isFa ? "امتیاز ۱۰۰ منهای MAE" : "100 − MAE score"}</small>
              <strong>
                {c?.totalInteractions
                  ? `${((1 - c.rollingMAE) * 100).toFixed(1)}%`
                  : "—"}
              </strong>
              <small>
                {isFa
                  ? "خطای واقعی پیش‌بینی؛ نه دقت اعتبارسنجی‌شده"
                  : "Observed prediction error; not validated accuracy"}
              </small>
            </div>
            <div>
              <small>
                {isFa ? "خطای کالیبراسیون Brier" : "Brier calibration error"}
              </small>
              <strong>
                {c?.totalInteractions ? c.rollingBrierError.toFixed(4) : "—"}
              </strong>
              <small>
                {c?.totalInteractions ?? 0} {isFa ? "مشاهده" : "observations"}
              </small>
            </div>
            <div>
              <small>{isFa ? "سپر نویز کالمن" : "Kalman noise shield"}</small>
              <strong>{c?.shieldedInteractions ?? 0}</strong>
              <small>
                {isFa
                  ? "مشاهده با قابلیت اعتماد پایین مهار شد"
                  : "Low-reliability observations attenuated"}
              </small>
            </div>
          </section>
          <nav
            className={styles.tabs}
            aria-label={isFa ? "بخش‌های دوقلو" : "Twin views"}
          >
            {tabs.map(([id, label]) => (
              <button
                key={id}
                className={tab === id ? styles.selected : styles.button}
                aria-pressed={tab === id}
                onClick={() => setTab(id)}
              >
                {label}
              </button>
            ))}
          </nav>
          {tab === "overview" && (
            <>
              <section className={styles.card}>
                <div className={styles.sectionHead}>
                  <div>
                    <span className={styles.eyebrow}>IELTS / CEFR</span>
                    <h2>
                      {isFa
                        ? "برآورد مهارت‌های چهارگانه"
                        : "Four-skill IELTS outlook"}
                    </h2>
                  </div>
                  <span className={styles.tag}>
                    {isFa ? "برآورد آزمایشی" : "Experimental estimate"}
                  </span>
                </div>
                <div className={styles.bandGrid}>
                  {IELTS_SKILLS.map((skill) => {
                    const b = forecast?.[skill],
                      count = snapshot.modalityMastery[skill].evidenceCount;
                    return (
                      <div key={skill}>
                        <small>{skill}</small>
                        <strong>{count ? b?.band.toFixed(1) : "—"}</strong>
                        <small>
                          {count
                            ? `95%: ${b?.ci95[0].toFixed(1)}–${b?.ci95[1].toFixed(1)}`
                            : isFa
                              ? "در انتظار شاهد"
                              : "Awaiting evidence"}
                        </small>
                      </div>
                    );
                  })}
                </div>
                <p>
                  {isFa ? "کلی" : "Overall"}:{" "}
                  <strong>
                    {IELTS_SKILLS.every(
                      (k) => snapshot.modalityMastery[k].evidenceCount > 0,
                    )
                      ? `${forecast?.overall.band.toFixed(1)} · ${forecast?.predictedCEFR}`
                      : isFa
                        ? "برای هر چهار مهارت شاهد لازم است"
                        : "Evidence needed in all four skills"}
                  </strong>
                </p>
                <p className={styles.muted}>
                  {isFa
                    ? "رابطه تسلط با نمره آیلتس یک تقریب اولیه است. هدف خطای ۲٫۵٪ و ±۰٫۲۰ هنوز با داده واقعی سنجیده نشده است."
                    : "The mastery-to-band mapping is provisional. The 2.5% mastery RMSE and ±0.20 band targets require held-out learner validation."}
                </p>
              </section>
              <TwinConstellation snapshot={snapshot} isFa={isFa} />
            </>
          )}
          {tab === "future" && <TwinFuture snapshot={snapshot} isFa={isFa} />}
          {tab === "mock" && <TwinMock isFa={isFa} />}
          {tab === "pipeline" && <TwinPipeline isFa={isFa} />}
          {tab === "evidence" && (
            <section className={styles.card}>
              <h2>
                {isFa ? "شواهد و اختیار مدل" : "Evidence and model controls"}
              </h2>
              <p>
                {isFa
                  ? "این مدل برای حساب تو در همین مرورگر ذخیره می‌شود. خروجی نسخه فعلی را پیش از بازنشانی نگه دار."
                  : "This account’s model lives in this browser. Export a readable snapshot before resetting it."}
              </p>
              <div className={styles.controls}>
                <button className={styles.button} onClick={exportModel}>
                  {isFa ? "خروجی JSON" : "Export JSON snapshot"}
                </button>
                <button
                  className={styles.button}
                  onClick={() => setConfirmReset(true)}
                >
                  {isFa ? "بازنشانی مدل محلی" : "Reset local model"}
                </button>
                <Link className={styles.button} href="/account/data-controls">
                  {isFa ? "کنترل داده‌ها" : "Data controls"}
                </Link>
              </div>
              {confirmReset && (
                <div className={styles.details}>
                  <p>
                    {isFa
                      ? "همه شواهد و پارامترهای یادگرفته‌شده این دوقلوی محلی پاک شوند؟"
                      : "Clear this local Twin’s evidence and learned parameters?"}
                  </p>
                  <button
                    className={styles.selected}
                    onClick={() => {
                      resetLearnerTwin();
                      setConfirmReset(false);
                    }}
                  >
                    {isFa ? "بله، بازنشانی کن" : "Clear local model"}
                  </button>{" "}
                  <button
                    className={styles.button}
                    onClick={() => setConfirmReset(false)}
                  >
                    {isFa ? "انصراف" : "Cancel"}
                  </button>
                </div>
              )}
              <h3>{isFa ? "آخرین ۶۴ مشاهده" : "Latest 64 observations"}</h3>
              {snapshot.history.length ? (
                <div className={styles.tableScroll}>
                  <table>
                    <thead>
                      <tr>
                        <th>{isFa ? "زمان" : "Time"}</th>
                        <th>{isFa ? "منبع" : "Source"}</th>
                        <th>ŷ → y</th>
                        <th>{isFa ? "قابلیت اعتماد" : "Reliability"}</th>
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
                            {e.modality}
                            {e.itemId && (
                              <small className={styles.block}>{e.itemId}</small>
                            )}
                          </td>
                          <td>
                            {e.prediction.toFixed(2)} → {e.score.toFixed(2)}
                          </td>
                          <td>{Math.round(e.reliability * 100)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>
                  {isFa
                    ? "هنوز مشاهده‌ای ثبت نشده. تمرین دستور، نوشتن یا تلفظ را شروع کن."
                    : "No observations yet. Start a grammar, writing, or pronunciation activity."}
                </p>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}
