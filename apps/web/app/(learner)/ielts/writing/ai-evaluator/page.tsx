"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IELTSWritingEvaluator } from "../../../../../components/ielts/IELTSWritingEvaluator";

const SAMPLE_PROMPTS = [
  {
    id: "task2-technology",
    type: "task2" as const,
    title: "Task 2: Education & Technology",
    prompt:
      "Some people believe that computers and artificial intelligence will completely replace teachers in classrooms in the near future. To what extent do you agree or disagree? Give reasons and examples from your own experience.",
    targetWords: 250,
  },
  {
    id: "task2-environment",
    type: "task2" as const,
    title: "Task 2: Environmental Protection",
    prompt:
      "The increase in the production of consumer goods causes serious damage to the natural environment. What can individuals and governments do to address this problem?",
    targetWords: 250,
  },
  {
    id: "task1-academic",
    type: "task1" as const,
    title: "Task 1: Renewable Energy Trends",
    prompt:
      "The chart below shows global investment in renewable energy sources between 2010 and 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    targetWords: 150,
  },
];

export default function IELTSAiEvaluatorPage() {
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);
  const activePrompt = SAMPLE_PROMPTS[selectedPromptIndex];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <Link href="/ielts" className="hover:text-emerald-400 transition-colors">
              IELTS Hub
            </Link>
            <span>/</span>
            <Link href="/ielts/writing" className="hover:text-emerald-400 transition-colors">
              Writing Room
            </Link>
            <span>/</span>
            <span className="text-emerald-400 font-semibold">
              موتور استنتاج چندمقیاسه BERT (Edge AI)
            </span>
          </div>

          <Link
            href="/ielts/writing"
            className="text-xs bg-slate-900 border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-lg transition-colors"
          >
            ← بازگشت به اتاق آزمون
          </Link>
        </div>

        {/* Prompt Selection Buttons */}
        <div className="mb-6 flex flex-wrap gap-2">
          {SAMPLE_PROMPTS.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setSelectedPromptIndex(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedPromptIndex === idx
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>

        {/* Evaluator Component */}
        <IELTSWritingEvaluator
          key={activePrompt.id}
          promptText={activePrompt.prompt}
          targetWords={activePrompt.targetWords}
          taskType={activePrompt.type}
        />
      </div>
    </div>
  );
}
