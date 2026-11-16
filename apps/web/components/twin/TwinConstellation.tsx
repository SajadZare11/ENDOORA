"use client";
import { useState } from "react";
import { TWIN_CATALOG } from "../../lib/ai/learner-twin-store";
import type { TwinSnapshot } from "../../lib/ai/learner-twin-types";
import styles from "./twin.module.css";
export default function TwinConstellation({
  snapshot,
  isFa,
}: {
  snapshot: TwinSnapshot;
  isFa: boolean;
}) {
  const [selected, setSelected] = useState(40);
  const nodes = snapshot.nodes;
  const current = nodes.find((n) => n.skillId === selected) ?? nodes[0];
  const ancestors = new Set<number>();
  const visit = (id: number) => {
    if (ancestors.has(id)) return;
    ancestors.add(id);
    nodes.find((n) => n.skillId === id)?.prerequisites.forEach(visit);
  };
  if (current) visit(current.skillId);
  const point = (id: number) => ({
    x: 48 + 88 * (id % 10),
    y: 48 + 80 * Math.floor(id / 10),
  });
  const weak = nodes
    .filter((n) => ancestors.has(n.skillId) && n.skillId !== selected)
    .sort((a, b) => a.mean - b.mean);
  const name = (id: number) => {
    const c = TWIN_CATALOG.find((c) => c.skillId === id);
    return isFa ? c?.titleFa : c?.titleEn;
  };
  return (
    <section className={styles.card}>
      <div className={styles.sectionHead}>
        <div>
          <span className={styles.eyebrow}>AEF → IELTS</span>
          <h2>
            {isFa
              ? "صورت فلکی پیش‌نیازها"
              : "Causal prerequisite constellation"}
          </h2>
        </div>
        <span className={styles.tag}>
          {nodes.length} {isFa ? "گره" : "nodes"}
        </span>
      </div>
      <p>
        {isFa
          ? "گره را انتخاب کن؛ مسیر پیش‌نیازهای آن روشن می‌شود. رنگ = میانگین تسلط، حلقه = عدم قطعیت. گره خاکستری هنوز شاهدی ندارد."
          : "Select a node to trace its foundations. Color shows mastery; halo width shows uncertainty. Gray nodes have no observations."}
      </p>
      <div className={styles.graphScroll}>
        <svg
          viewBox="0 0 900 490"
          className={styles.constellation}
          role="group"
          aria-label={
            isFa ? "نمودار تعاملی پیش‌نیازها" : "Interactive prerequisite graph"
          }
        >
          {nodes.flatMap((n) =>
            n.prerequisites.map((p) => {
              const a = point(p),
                b = point(n.skillId);
              return (
                <line
                  key={`${p}-${n.skillId}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  className={
                    ancestors.has(p) && ancestors.has(n.skillId)
                      ? styles.activeEdge
                      : styles.edge
                  }
                />
              );
            }),
          )}
          {nodes.map((n) => {
            const p = point(n.skillId),
              meta = TWIN_CATALOG.find((c) => c.skillId === n.skillId);
            const state = !(n.evidenceCount ?? 0)
              ? "prior"
              : n.mean < 0.45
                ? "weak"
                : n.mean < 0.7
                  ? "learning"
                  : "strong";
            return (
              <g
                key={n.skillId}
                transform={`translate(${p.x} ${p.y})`}
                tabIndex={0}
                role="button"
                aria-pressed={n.skillId === selected}
                aria-label={`${name(n.skillId)}, ${Math.round(n.mean * 100)}%, ${meta?.id}`}
                onClick={() => setSelected(n.skillId)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(n.skillId);
                  }
                }}
                className={styles.graphNode}
                data-state={state}
                data-active={ancestors.has(n.skillId)}
              >
                <title>
                  {name(n.skillId)} · {n.aefReference} · μ {n.mean.toFixed(2)} ·
                  σ² {n.variance.toFixed(3)}
                </title>
                <circle
                  r={23 + Math.sqrt(n.variance) * 18}
                  className={styles.halo}
                />
                <circle r="19" className={styles.node} />
                <text textAnchor="middle" y="4">
                  {n.cefr}
                </text>
                <text textAnchor="middle" y="44" className={styles.nodeLabel}>
                  {meta?.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      {current && (
        <div className={styles.details} aria-live="polite">
          <strong>{name(current.skillId)}</strong>
          <span dir="ltr">
            {current.aefReference} · μ {current.mean.toFixed(3)} · σ²{" "}
            {current.variance.toFixed(3)}
          </span>
          <p>
            {isFa
              ? "پایه‌های نیازمند بررسی (برآورد، نه تشخیص قطعی):"
              : "Foundations to review (estimated, not confirmed deficits):"}
          </p>
          {weak.length ? (
            <ul>
              {weak.slice(0, 4).map((n) => (
                <li key={n.skillId}>
                  <button
                    className={styles.textButton}
                    onClick={() => setSelected(n.skillId)}
                  >
                    {name(n.skillId)}
                  </button>{" "}
                  · {n.aefReference} · {Math.round(n.mean * 100)}%
                  {!(n.evidenceCount ?? 0) && " (prior)"}
                </li>
              ))}
            </ul>
          ) : (
            <p>
              {isFa
                ? "این گره پیش‌نیاز مستقیمی ندارد."
                : "This foundation has no prerequisites."}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
