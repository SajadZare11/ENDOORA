"use client";
import { useEffect, useRef, useState } from "react";
import { TWIN_CATALOG, getLearnerTwin } from "../../lib/ai/learner-twin-store";
import type { TwinPrediction } from "../../lib/ai/learner-twin-types";
import type { HexEdgeOption } from "../../data/skills/games/types";
import styles from "./twin.module.css";
interface Drill {
  id: string;
  conceptId: string;
  skillId: number;
  prompt: string;
  reference: string;
  options: HexEdgeOption[];
}
export default function TwinWarmup({
  skillIds,
  isFa,
}: {
  skillIds: number[];
  isFa: boolean;
}) {
  const [drills, setDrills] = useState<Drill[]>([]),
    [index, setIndex] = useState(0),
    [selected, setSelected] = useState<number | null>(null),
    [remaining, setRemaining] = useState(300),
    [error, setError] = useState("");
  const prediction = useRef<TwinPrediction | undefined>(undefined),
    entered = useRef(0),
    answered = useRef(false);
  const drill = drills[index];
  useEffect(() => {
    let active = true;
    void import("../../data/skills/games/grammar-aef-curriculum")
      .then(({ GRAMMAR_AEF_CURRICULUM }) => {
        const next: Drill[] = [];
        for (const id of skillIds) {
          const c = TWIN_CATALOG.find((c) => c.skillId === id);
          if (!c) continue;
          const stage =
            GRAMMAR_AEF_CURRICULUM[
              c.cefr as keyof typeof GRAMMAR_AEF_CURRICULUM
            ][c.stageNumber];
          for (const circuit of stage.circuits.slice(0, 1))
            for (const node of circuit.nodes
              .filter(
                (n) =>
                  n.options.some((o) => o.isCorrect) &&
                  n.options.some((o) => !o.isCorrect),
              )
              .slice(0, 3))
              next.push({
                id: `${circuit.id}:${node.id}`,
                conceptId: c.id,
                skillId: id,
                prompt: node.label ?? circuit.startingPrompt,
                reference: circuit.aefReference ?? c.aefReference,
                options: node.options,
              });
        }
        if (active) setDrills(next);
      })
      .catch(() => {
        if (active) setError("Could not load warm-up exercises.");
      });
    const deadline = Date.now() + 300000;
    const timer = setInterval(
      () =>
        setRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000))),
      1000,
    );
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [skillIds]);
  useEffect(() => {
    if (!drill) return;
    answered.current = false;
    entered.current = performance.now();
    prediction.current = getLearnerTwin()?.predictOutcomeBeforeInteraction(
      [drill.skillId],
      drill.options.filter((o) => o.isCorrect).length / drill.options.length,
      Date.now(),
      { itemId: drill.id },
    );
  }, [drill]);
  async function choose(i: number, eventTimestamp: number) {
    if (!drill || answered.current || !remaining) return;
    answered.current = true;
    setSelected(i);
    const model = getLearnerTwin(),
      ticket = prediction.current,
      latencyMs = Math.max(0, eventTimestamp - entered.current);
    const { DktEngine } = await import("../../lib/dkt-engine/dkt-engine");
    if (getLearnerTwin() !== model) return;
    DktEngine.getInstance().recordInteraction({
      conceptId: drill.conceptId,
      isCorrect: drill.options[i].isCorrect,
      latencyMs,
      twinContext: {
        prediction: ticket,
        guessingFloor:
          drill.options.filter((o) => o.isCorrect).length /
          drill.options.length,
        itemId: drill.id,
      },
    });
  }
  return (
    <div
      className={styles.details}
      aria-label={isFa ? "تمرین گرم‌کردن" : "Warm-up exercises"}
    >
      <h3>
        {isFa ? "گرم‌کردن هدفمند" : "Targeted warm-up"} ·{" "}
        {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}
      </h3>
      {error && <p role="alert">{error}</p>}
      {!remaining ? (
        <p role="status">
          {isFa
            ? "پنج دقیقه تمام شد. برای آزمون آماده‌ای."
            : "Five minutes complete. You can enter your exam."}
        </p>
      ) : drill ? (
        <>
          <p>
            {index + 1}/{drills.length} · {drill.reference}
          </p>
          <strong dir="ltr">{drill.prompt} …</strong>
          <div className={styles.controls}>
            {drill.options.map((option, i) => (
              <button
                key={option.id}
                className={selected === i ? styles.selected : styles.button}
                disabled={selected !== null}
                onClick={(event) => void choose(i, event.timeStamp)}
                dir="ltr"
              >
                {option.text}
              </button>
            ))}
          </div>
          {selected !== null && (
            <div role="status">
              <p>
                {drill.options[selected].isCorrect
                  ? isFa
                    ? "درست است."
                    : "Correct."
                  : (isFa ? "پاسخ درست: " : "Correct options: ") +
                    drill.options
                      .filter((o) => o.isCorrect)
                      .map((o) => o.text)
                      .join(" / ")}
              </p>
              <p>
                {isFa
                  ? drill.options[selected].trapExplanationFa
                  : drill.reference}
              </p>
              {index < drills.length - 1 ? (
                <button
                  className={styles.button}
                  onClick={() => {
                    setSelected(null);
                    setIndex((i) => i + 1);
                  }}
                >
                  {isFa ? "تمرین بعد" : "Next exercise"}
                </button>
              ) : (
                <p>
                  {isFa
                    ? "تمرین‌ها تمام شد؛ تا پایان زمان مثال‌ها را با صدای بلند تکرار کن."
                    : "Drills complete. Use the remaining time to repeat the corrected sentences aloud."}
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        <p role="status">
          {isFa ? "در حال آماده‌سازی تمرین…" : "Loading targeted exercises…"}
        </p>
      )}
    </div>
  );
}
