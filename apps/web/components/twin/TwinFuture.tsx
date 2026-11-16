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
  const [days, setDays] = useState(30),
    [minutes, setMinutes] = useState(15);
  const { result, error, pending } = useTwinFuture(snapshot, days, minutes);
  const id = useId();
  const points = pending ? [] : (result?.trajectory ?? []),
    end = points.at(-1);
  const x = (day: number) => 48 + (day / days) * 680,
    y = (band: number) => 280 - ((band - 1) / 8) * 240;
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
          <span className={styles.eyebrow}>FUTURE SELF</span>
          <h2>{isFa ? "شبیه‌ساز سفر در زمان" : "Time-travel simulator"}</h2>
        </div>
        <span className={styles.tag}>500 {isFa ? "مسیر" : "trajectories"}</span>
      </div>
      <div className={styles.controls}>
        {!snapshot.calibration.totalInteractions && (
          <p className={styles.muted}>
            {isFa
              ? "این سناریو از پیشین اولیه استفاده می‌کند؛ هنوز شاهد شخصی ثبت نشده است."
              : "Prior scenario: no personal observations have been recorded yet."}
          </p>
        )}
        <fieldset>
          <legend>{isFa ? "افق پیش‌بینی" : "Forecast horizon"}</legend>
          {[7, 14, 30, 90].map((n) => (
            <button
              key={n}
              aria-pressed={days === n}
              className={days === n ? styles.selected : styles.button}
              onClick={() => setDays(n)}
            >
              {n} {isFa ? "روز" : "days"}
            </button>
          ))}
        </fieldset>
        <label htmlFor={id}>
          {isFa ? "تمرین روزانه" : "Daily practice"}:{" "}
          <strong>
            {minutes} {isFa ? "دقیقه" : "min"}
          </strong>
          <input
            id={id}
            type="range"
            min="0"
            max="45"
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
          />
        </label>
      </div>
      {error && (
        <p role="alert">
          {isFa
            ? "شبیه‌سازی اجرا نشد. مرورگر دارای Web Worker لازم است."
            : error}
        </p>
      )}
      <div role="status" className={styles.muted}>
        {pending
          ? isFa
            ? "در حال محاسبه…"
            : "Simulating…"
          : result
            ? `${result.elapsedMs.toFixed(1)} ms · Web Worker`
            : isFa
              ? "در حال آماده‌سازی"
              : "Preparing worker"}
      </div>
      {!!points.length && (
        <>
          <svg
            viewBox="0 0 760 320"
            className={styles.chart}
            role="img"
            aria-label={
              isFa
                ? "مقایسه پیش‌بینی نمره با تمرین و بدون تمرین"
                : "IELTS forecast comparing daily practice with no study; shaded regions are 95% model intervals"
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
                <text x="22" y={y(v) + 4}>
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
              <text key={d} x={x(d)} y="308" textAnchor="middle">
                {d}d
              </text>
            ))}
          </svg>
          <div className={styles.legend}>
            <span>● {isFa ? "با تمرین" : "Daily practice"}</span>
            <span>┄ {isFa ? "بدون مطالعه" : "No study"}</span>
            <span>
              {isFa
                ? "نواحی سایه‌دار: بازه مدل ۹۵٪"
                : "Shading: 95% model intervals"}
            </span>
          </div>
        </>
      )}
      {end && !pending && (
        <div className={styles.metricGrid}>
          <div>
            <small>{isFa ? "نمره پیش‌بینی‌شده" : "Projected band"}</small>
            <strong>{end.projectedOverallBand.toFixed(1)}</strong>
            <small>
              {end.lowerBoundBand.toFixed(1)}–{end.upperBoundBand.toFixed(1)} ·
              95%
            </small>
          </div>
          <div>
            <small>
              {isFa
                ? "یادداری بدون مطالعه / با تمرین"
                : "Retention: no study / practice"}
            </small>
            <strong>
              {Math.round(end.retentionPctIfNoStudy)}% /{" "}
              {Math.round(end.retentionPctWithAdaptiveStudy)}%
            </strong>
          </div>
          <div>
            <small>{isFa ? "رسیدن به نمره ۷٫۵" : "Band 7.5 target"}</small>
            <strong>
              {targetDate ??
                (isFa ? "در این افق حاصل نشد" : "Outside this horizon")}
            </strong>
          </div>
        </div>
      )}
      <p className={styles.muted}>
        {isFa
          ? "این مسیرها سناریوهای احتمالی‌اند. بازه‌ها و تاریخ هدف به فرض‌های مدل وابسته‌اند و هنوز با نتایج رسمی آیلتس اعتبارسنجی نشده‌اند."
          : "These are conditional scenarios. Intervals and target dates depend on model assumptions and have not been validated against official IELTS outcomes."}
      </p>
      <details>
        <summary>
          {isFa ? "جدول قابل خواندن نمودار" : "Accessible forecast table"}
        </summary>
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th>{isFa ? "روز" : "Day"}</th>
                <th>{isFa ? "تمرین" : "Practice"}</th>
                <th>95%</th>
                <th>{isFa ? "بدون مطالعه" : "No study"}</th>
              </tr>
            </thead>
            <tbody>
              {points
                .filter((p) => p.dayOffset % 3 === 0 || p.dayOffset === days)
                .map((p) => (
                  <tr key={p.dayOffset}>
                    <td>{p.dayOffset}</td>
                    <td>{p.projectedOverallBand.toFixed(2)}</td>
                    <td>
                      {p.lowerBoundBand.toFixed(2)}–
                      {p.upperBoundBand.toFixed(2)}
                    </td>
                    <td>{p.noStudyBand.toFixed(2)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
