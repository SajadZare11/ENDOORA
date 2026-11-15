"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DiagnosticMemoryRadar } from "../../../../../components/skills/game/DiagnosticMemoryRadar";
import { useDktAdaptive } from "../../../../../lib/dkt-engine/useDktAdaptive";
import { AEF_60_CONCEPTS } from "../../../../../lib/dkt-engine/concepts";

export default function DktAdaptiveLabPage() {
  const { predictions, recordInteraction, resetDkt } = useDktAdaptive();
  const [selectedConceptId, setSelectedConceptId] = useState("a1-01");
  const [testLatencyMs, setTestLatencyMs] = useState(1200);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);

  const handleSimulate = (isCorrect: boolean, isTrap = false) => {
    const concept = AEF_60_CONCEPTS.find((c) => c.id === selectedConceptId) || AEF_60_CONCEPTS[0];
    const updated = recordInteraction({
      conceptId: concept.id,
      isCorrect,
      isTrap,
      latencyMs: testLatencyMs,
    });

    const prob = updated.conceptMastery[concept.id] ?? 0.5;
    const timeStr = new Date().toLocaleTimeString("fa-IR");
    const logEntry = `[${timeStr}] گام عصبی: ${concept.titleEn} (${concept.id}) | پاسخ: ${
      isCorrect ? "صحیح ✓" : isTrap ? "دام L1 ✕" : "غلط ✕"
    } | تأخیر: ${testLatencyMs}ms | احتمال یادآوری پس از گام: ${(prob * 100).toFixed(1)}%`;

    setSimulationLog((prev) => [logEntry, ...prev.slice(0, 19)]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <Link href="/dashboard" className="hover:text-sky-400 transition-colors">
              داشبورد
            </Link>
            <span>/</span>
            <Link href="/learn" className="hover:text-sky-400 transition-colors">
              مهارت‌ها و بازی‌ها
            </Link>
            <span>/</span>
            <span className="text-sky-400 font-semibold">
              آزمایشگاه ردیابی عمیق دانش (DKT-Forget GRU Lab)
            </span>
          </div>

          <Link
            href="/learn"
            className="text-xs bg-slate-900 border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-lg transition-colors"
          >
            ← بازگشت به مهارت‌ها
          </Link>
        </div>

        {/* Live Radar Component */}
        <div className="mb-8">
          <DiagnosticMemoryRadar />
        </div>

        {/* Interactive Neural Simulator Workbench */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <h4 className="font-bold text-lg text-sky-400 flex items-center gap-2">
              <span>🔬</span> میز شبیه‌سازی گام‌های عصبی شبکه بازگشتی GRU
            </h4>
            <span className="text-xs text-slate-400">
              استنتاج بلادرنگ در مرورگر (&lt; ۲ میلی‌ثانیه)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Concept Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">
                انتخاب مفهوم گرامری از ۶۰ مرحله AEF:
              </label>
              <select
                value={selectedConceptId}
                onChange={(e) => setSelectedConceptId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              >
                {AEF_60_CONCEPTS.map((c) => (
                  <option key={c.id} value={c.id}>
                    [{c.cefr} - مرحلـه {c.stageNumber}] {c.titleEn} ({c.titleFa})
                  </option>
                ))}
              </select>
            </div>

            {/* Reaction Latency Slider */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">
                تأخیر پاسخ و تردید شناختی (Latency): {testLatencyMs} میلی‌ثانیه
              </label>
              <input
                type="range"
                min="300"
                max="8000"
                step="100"
                value={testLatencyMs}
                onChange={(e) => setTestLatencyMs(Number(e.target.value))}
                className="w-full accent-sky-500 mt-2"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>۳۰۰ms (پاسخ آنی)</span>
                <span>۲۰۰۰ms (معمولی)</span>
                <span>۸۰۰۰ms (تردید بالا)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">
                تزریق تعامل به گیت حافظه:
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSimulate(true, false)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition duration-150"
                >
                  ✓ پاسخ صحیح
                </button>
                <button
                  onClick={() => handleSimulate(false, true)}
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition duration-150"
                >
                  ✕ به دام افتادن L1
                </button>
              </div>
            </div>
          </div>

          {/* Simulation Log Console */}
          <div>
            <div className="text-xs font-bold text-slate-400 mb-2 flex justify-between">
              <span>گزارش استنتاج‌های عصبی لحظه‌ای:</span>
              <button
                onClick={() => setSimulationLog([])}
                className="text-[11px] text-slate-500 hover:text-slate-300"
              >
                پاکسازی لاگ
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 max-h-48 overflow-y-auto space-y-1">
              {simulationLog.length === 0 ? (
                <div className="text-slate-600 text-center py-4">
                  هنوز هیچ گام تعاملی شبیه‌سازی نشده است. یکی از دکمه‌های بالا را کلیک کنید.
                </div>
              ) : (
                simulationLog.map((line, idx) => (
                  <div key={idx} className="border-b border-slate-900/60 pb-1">
                    {line}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
