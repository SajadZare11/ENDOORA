"use client";

import { useId, useState } from "react";
import type { TwinSnapshot } from "../../lib/ai/learner-twin-types";
import { useTwinFuture } from "./useTwin";
import styles from "./twin.module.css";

export default function TwinFuture({
  snapshot,
  isFa,
}: {
  snapshot: TwinSnapshot;
  isFa: boolean;
}) {
  const [referenceNow] = useState(Date.now);
  const [days, setDays] = useState(30);
  const [minutes, setMinutes] = useState(15);
  const { result, error, pending } = useTwinFuture(snapshot, days, minutes);
  const id = useId();
  const points = pending ? [] : (result?.trajectory ?? []);
  const end = points.at(-1);

  const x = (day: number) => 48 + (day / days) * 680;
  const y = (band: number) => 280 - ((band - 1) / 8) * 240;

  const line = (key: "projectedOverallBand" | "noStudyBand") =>
    points
      .map((p, i) => `${i ? "L" : "M"}${x(p.dayOffset)},${y(p[key])}`)
      .join(" ");

  const band = (
    lo: "lowerBoundBand" | "noStudyLowerBand",
    hi: "upperBoundBand" | "noStudyUpperBand",
  ) =>
    [
      ...points.map((p) => `${x(p.dayOffset)},${y(p[hi])}`),
      ...points.toReversed().map((p) => `${x(p.dayOffset)},${y(p[lo])}`),
    ].join(" ");

  const target = points.find((p) => p.projectedOverallBand >= 7.5);
  const targetDate = target
    ? new Date(referenceNow + target.dayOffset * 86_400_000).toLocaleDateString(
        isFa ? "fa-IR" : "en-GB",
        { timeZone: "Asia/Tehran" },
      )
    : null;

  return (
    <section className={styles.card}>
      <div className={styles.sectionHead}>
        <div>
          <span className={styles.eyebrow}>
            {isFa ? "ماشین زمان و شبیه‌سازی آینده" : "FUTURE SELF SIMULATION"}
          </span>
          <h2 className={styles.sectionTitle}>
            {isFa
              ? "پیش‌بینی رشد زبان تو با تمرین روزانه"
              : "How Fast You’ll Improve with Daily Practice"}
          </h2>
          <p className={styles.sectionDesc}>
            {isFa
              ? "دوقلوی هوشمند با اجرای ۵۰۰ سناریوی شبیه‌سازی، پیش‌بینی می‌کند که با هر میزان تمرین روزانه، سطح و نمره تو در روزها و ماه‌های آینده چقدر تغییر خواهد کرد."
              : "500 Monte Carlo simulated paths forecast your growth trajectory and memory retention based on daily practice minutes."}
          </p>
        </div>
      </div>

      <div className={styles.futureControls}>
        {!snapshot.calibration.totalInteractions && (
          <p className={styles.mutedTip}>
            💡{" "}
            {isFa
              ? "این پیش‌بینی در حال حاضر بر اساس الگوی استاندارد است؛ به مرور با انجام تمرینات، اختصاصی‌تر خواهد شد."
              : "Using initial baseline priors until your first few exercises are completed."}
          </p>
        )}

        <div className={styles.futureParamRow}>
          {/* Horizon Selection */}
          <div className={styles.futureParamCol}>
            <span className={styles.futureParamLabel}>
              {isFa ? "افق زمانی پیش‌بینی:" : "Forecast Horizon:"}
            </span>
            <div className={styles.futureHorizonPills}>
              {[7, 14, 30, 90].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-pressed={days === n}
                  className={`${styles.futureHorizonBtn} ${days === n ? styles.futureHorizonBtnActive : ""}`}
                  onClick={() => setDays(n)}
                >
                  {n} {isFa ? (n === 7 ? "روز (۱ هفته)" : n === 14 ? "روز (۲ هفته)" : n === 30 ? "روز (۱ ماه)" : "روز (۳ ماه)") : "days"}
                </button>
              ))}
            </div>
          </div>

          {/* Practice Minutes Slider */}
          <div className={styles.futureParamCol}>
            <label htmlFor={id} className={styles.futureParamLabel}>
              <span>{isFa ? "زمان مطالعه روزانه:" : "Daily Practice Time:"}</span>
              <strong className={styles.futureMinutesHighlight}>
                {minutes} {isFa ? "دقیقه در روز" : "min / day"}
              </strong>
            </label>
            <input
              id={id}
              type="range"
              min="0"
              max="45"
              step="5"
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className={styles.futureSlider}
            />
            <div className={styles.futureSliderLabels}>
              <span>{isFa ? "۰ (بدون مطالعه)" : "0 min"}</span>
              <span>{isFa ? "۱۵ دقیقه" : "15 min"}</span>
              <span>{isFa ? "۳۰ دقیقه" : "30 min"}</span>
              <span>{isFa ? "۴۵ دقیقه" : "45 min"}</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <p role="alert" className={styles.errorAlert}>
          {isFa ? "امکان اجرای شبیه‌سازی در این مرورگر وجود ندارد." : error}
        </p>
      )}

      {/* Trajectory Comparison Chart */}
      {!!points.length && (
        <div className={styles.chartWrapper}>
          <svg
            viewBox="0 0 760 320"
            className={styles.chart}
            role="img"
            aria-label={
              isFa
                ? "نمودار مقایسه رشد نمره با تمرین روزانه در برابر بدون مطالعه"
                : "Forecast chart comparing daily practice with forgetting curve"
            }
          >
            {[1, 3, 5, 7, 9].map((v) => (
              <g key={v}>
                <line
                  x1="48"
                  x2="728"
                  y1={y(v)}
                  y2={y(v)}
                  className={styles.gridLine}
                />
                <text x="22" y={y(v) + 4} className={styles.chartAxisLabel}>
                  {v}
                </text>
              </g>
            ))}
            <polygon
              points={band("noStudyLowerBand", "noStudyUpperBand")}
              className={styles.noStudyArea}
            />
            <polygon
              points={band("lowerBoundBand", "upperBoundBand")}
              className={styles.studyArea}
            />
            <path d={line("noStudyBand")} className={styles.noStudyLine} />
            <path
              d={line("projectedOverallBand")}
              className={styles.studyLine}
            />
            {[0, Math.round(days / 2), days].map((d) => (
              <text key={d} x={x(d)} y="308" textAnchor="middle" className={styles.chartAxisLabel}>
                {isFa ? `روز ${d}` : `${d}d`}
              </text>
            ))}
          </svg>

          <div className={styles.chartLegend}>
            <span className={styles.legendStudy}>
              <span className={styles.legendColorBoxStudy} />
              {isFa ? `با ${minutes} دقیقه تمرین روزانه` : `With ${minutes}m daily practice`}
            </span>
            <span className={styles.legendNoStudy}>
              <span className={styles.legendColorBoxNoStudy} />
              {isFa ? "مسیر بدون تمرین (افت و فراموشی)" : "No practice (forgetting curve)"}
            </span>
          </div>
        </div>
      )}

      {/* 3 Outcome Forecast Cards */}
      {end && !pending && (
        <div className={styles.futureResultGrid}>
          <div className={styles.futureResultCard}>
            <span className={styles.futureResultIcon}>📈</span>
            <span className={styles.futureResultLabel}>
              {isFa ? `نمره تخمینی پس از ${days} روز` : `Predicted Band in ${days} Days`}
            </span>
            <strong className={styles.futureResultVal}>
              Band {end.projectedOverallBand.toFixed(1)}
            </strong>
            <span className={styles.futureResultNote}>
              {isFa
                ? `محدوده محتمل: ${end.lowerBoundBand.toFixed(1)} تا ${end.upperBoundBand.toFixed(1)}`
                : `Confidence interval: ${end.lowerBoundBand.toFixed(1)}–${end.upperBoundBand.toFixed(1)}`}
            </span>
          </div>

          <div className={styles.futureResultCard}>
            <span className={styles.futureResultIcon}>🧠</span>
            <span className={styles.futureResultLabel}>
              {isFa ? "ماندگاری در حافظه بلندمدت" : "Long-Term Retention Rate"}
            </span>
            <strong className={styles.futureResultVal}>
              {Math.round(end.retentionPctWithAdaptiveStudy)}٪
            </strong>
            <span className={styles.futureResultNote}>
              {isFa
                ? `در مقایسه با فقط ${Math.round(end.retentionPctIfNoStudy)}٪ بدون مطالعه`
                : `vs only ${Math.round(end.retentionPctIfNoStudy)}% if you stop studying`}
            </span>
          </div>

          <div className={styles.futureResultCard}>
            <span className={styles.futureResultIcon}>🎯</span>
            <span className={styles.futureResultLabel}>
              {isFa ? "رسیدن به نمره هدف ۷.۵ (C1)" : "Estimated Band 7.5 Target"}
            </span>
            <strong className={styles.futureResultVal}>
              {targetDate ?? (isFa ? "نیاز به استمرار بیشتر" : "Keep practicing!")}
            </strong>
            <span className={styles.futureResultNote}>
              {targetDate
                ? (isFa ? "با حفظ همین نظم روزانه" : "Maintaining this daily pace")
                : (isFa ? "با افزایش زمان تمرین زودتر می‌رسی" : "Increase practice time to reach sooner")}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
