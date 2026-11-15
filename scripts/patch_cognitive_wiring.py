#!/usr/bin/env python3
"""
Patch script to wire Engine 5 (MobileNetV3 + BiLSTM Gaze & Saccade Tracker)
into:
1. SherlockSpeakingArena.tsx (Dr. Watson proactive assistance)
2. GrammarHexArena.tsx (Cognitive load tracking & DKT modulation)
3. ielts/exam/[id]/page.tsx (Proctoring telemetry collection)
4. ielts/results/[attemptId]/page.tsx (Proctoring diagnostics display)
"""

import sys
from pathlib import Path

ROOT = Path(r"E:\0\Work\Website\The General Website\Endoora")

def patch_sherlock():
    path = ROOT / "apps" / "web" / "components" / "skills" / "game" / "SherlockSpeakingArena.tsx"
    text = path.read_text(encoding="utf-8")
    
    # 1. Import
    import_needle = 'import { playEnglishSpeech, stopEnglishSpeech } from "../../../lib/speech";'
    import_patch = import_needle + '\nimport { useGazeCognitive } from "../../../lib/ai/useGazeCognitive.ts";'
    if 'useGazeCognitive' not in text:
        assert import_needle in text, "Sherlock import needle not found"
        text = text.replace(import_needle, import_patch, 1)

    # 2. Hook invocation
    hook_needle = '  const storageKey = `endoora_sherlock_${(level.cefr || "a1").toLowerCase()}_decisions`;'
    hook_patch = (
        '  // Cognitive Gaze & Saccade Tracking for proactive Dr. Watson assistance\n'
        '  const {\n'
        '    saccadicRegressionRate,\n'
        '    isWatsonHintActive,\n'
        '    dismissWatsonHint,\n'
        '  } = useGazeCognitive({\n'
        '    autoStart: true,\n'
        '    useMouseFallback: true,\n'
        '  });\n\n'
        + hook_needle
    )
    if 'saccadicRegressionRate' not in text:
        assert hook_needle in text, "Sherlock hook needle not found"
        text = text.replace(hook_needle, hook_patch, 1)

    # 3. Proactive Watson Hint UI Banner before mic zone
    ui_needle = '                /* ACTIVE CHALLENGE: MICROPHONE FIRST (NO OPTIONS / NO KEYWORDS INITIALLY) */\n                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>'
    
    watson_card = '''                {/* ACTIVE CHALLENGE: MICROPHONE FIRST (NO OPTIONS / NO KEYWORDS INITIALLY) */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {/* PROACTIVE COGNITIVE ASSISTANCE: DR. WATSON READING SACCADE HINT */}
                  {(isWatsonHintActive || saccadicRegressionRate > 0.65) && !taskHasMistake && !isTaskSuccess && (
                    <div
                      className={styles.whiteHintCard}
                      style={{
                        borderColor: "#0284c7",
                        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                        boxShadow: "0 4px 14px rgba(2, 132, 199, 0.15)",
                      }}
                    >
                      <div style={{ fontSize: "2.2rem" }}>🩺</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span className={styles.whiteHintName} style={{ color: "#0369a1" }}>
                            دکتر واتسون (راهنمای هوشمند شناختی):
                          </span>
                          <button
                            type="button"
                            onClick={dismissWatsonHint}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#64748b",
                              cursor: "pointer",
                              fontSize: "1.1rem",
                              padding: "0.2rem 0.5rem",
                            }}
                            title="بستن راهنما"
                          >
                            ✕
                          </button>
                        </div>
                        <span className={styles.whiteHintSpeech} style={{ color: "#0c4a6e" }}>
                          {currentTask.whiteHintFa || "به نظر می‌رسه تحلیل این سرنخ چالش‌برانگیز شده! روی کلمات کلیدی جمله تمرکز کن و فرضیه‌ات رو بگو."}
                        </span>
                        <div className={styles.keywordsBadgeCluster} style={{ marginTop: "0.25rem" }}>
                          {currentTask.targetKeywords.slice(0, 2).map((kw, i) => (
                            <span key={i} className={styles.keywordGoldenPill}>
                              <span>{kw.phrase}</span>
                              <small style={{ opacity: 0.85 }}>{kw.hintFa}</small>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}'''

    if 'PROACTIVE COGNITIVE ASSISTANCE' not in text:
        assert ui_needle in text, "Sherlock UI needle not found"
        text = text.replace(ui_needle, watson_card, 1)

    path.write_text(text, encoding="utf-8")
    print("SherlockSpeakingArena.tsx patched successfully!")

def patch_grammar_hex():
    path = ROOT / "apps" / "web" / "components" / "skills" / "game" / "GrammarHexArena.tsx"
    text = path.read_text(encoding="utf-8")

    # 1. Import
    import_needle = 'import type { CdmDiagnosticResult } from "../../../lib/ai/neural-cdm-types.ts";'
    import_patch = import_needle + '\nimport { useGazeCognitive } from "../../../lib/ai/useGazeCognitive.ts";'
    if 'useGazeCognitive' not in text:
        assert import_needle in text, "GrammarHex import needle not found"
        text = text.replace(import_needle, import_patch, 1)

    # 2. Hook
    hook_needle = '  const { recordInteraction, pickCircuit } = useDktAdaptive();'
    hook_patch = (
        hook_needle + '\n'
        '  // Edge Cognitive Load & Saccade Tracking (MobileNetV3 + BiLSTM)\n'
        '  const { cognitiveLoadIndex, isHighCognitiveLoad } = useGazeCognitive({\n'
        '    autoStart: true,\n'
        '    useMouseFallback: true,\n'
        '  });'
    )
    if 'isHighCognitiveLoad' not in text:
        assert hook_needle in text, "GrammarHex hook needle not found"
        text = text.replace(hook_needle, hook_patch, 1)

    path.write_text(text, encoding="utf-8")
    print("GrammarHexArena.tsx patched successfully!")

def patch_ielts_exam():
    path = ROOT / "apps" / "web" / "app" / "(learner)" / "ielts" / "exam" / "[id]" / "page.tsx"
    text = path.read_text(encoding="utf-8")

    # 1. Import
    import_needle = 'import { gradeExamModule, mapBandToCEFR } from "@/lib/ielts-grading.ts";'
    import_patch = import_needle + '\nimport { useGazeCognitive } from "@/lib/ai/useGazeCognitive.ts";'
    if 'useGazeCognitive' not in text:
        assert import_needle in text, "IELTS exam import needle not found"
        text = text.replace(import_needle, import_patch, 1)

    # 2. Hook
    hook_needle = '  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});'
    hook_patch = (
        '  // Engine 5: Real-time Edge Proctoring & Cognitive Tracking (10 FPS, Zero Video Upload)\n'
        '  const {\n'
        '    telemetry: gazeTelemetry,\n'
        '    proctoring: gazeProctoring,\n'
        '  } = useGazeCognitive({\n'
        '    autoStart: true,\n'
        '    useMouseFallback: true,\n'
        '  });\n\n'
        + hook_needle
    )
    if 'gazeProctoring' not in text:
        assert hook_needle in text, "IELTS exam hook needle not found"
        text = text.replace(hook_needle, hook_patch, 1)

    # 3. Proctoring in attempt record
    diag_needle = '          cdmCausalDiagnosis: graded.cdmDiagnosis,'
    diag_patch = '''          cdmCausalDiagnosis: graded.cdmDiagnosis,
          proctoringTelemetry: {
            integrityScore: Math.round((1 - gazeProctoring.suspiciousScore) * 100),
            cheatSuspicionLevel:
              gazeProctoring.suspiciousScore > 0.6
                ? "high"
                : gazeProctoring.suspiciousScore > 0.25
                ? "medium"
                : "low",
            gazeAwayCount: gazeProctoring.anomaliesRecorded.filter((a) => a === "looking_away").length,
            longAbsenceCount: gazeProctoring.anomaliesRecorded.filter((a) => a === "face_absent").length,
            multipleFacesDetected: gazeProctoring.multipleFaces,
            flags: gazeProctoring.anomaliesRecorded,
          },'''

    bad_diag = '''          proctoringTelemetry: {
            integrityScore: gazeProctoring.integrityScore,
            cheatSuspicionLevel: gazeProctoring.cheatSuspicionLevel,
            gazeAwayCount: gazeProctoring.gazeAwayCount,
            longAbsenceCount: gazeProctoring.longAbsenceCount,
            multipleFacesDetected: gazeProctoring.multipleFacesDetected,
            flags: gazeProctoring.flags,
          },'''
    if bad_diag in text:
        text = text.replace(bad_diag, diag_patch.replace(diag_needle + '\n', ''), 1)
    elif 'proctoringTelemetry:' not in text:
        assert diag_needle in text, "IELTS exam diag needle not found"
        text = text.replace(diag_needle, diag_patch, 1)

    path.write_text(text, encoding="utf-8")
    print("ielts/exam/[id]/page.tsx patched successfully!")

def patch_ielts_results():
    path = ROOT / "apps" / "web" / "app" / "(learner)" / "ielts" / "results" / "[attemptId]" / "page.tsx"
    text = path.read_text(encoding="utf-8")

    # Display Proctoring Card under NeuralCDM
    target_needle = '            {/* Engine 4: NeuralCDM Causal Diagnostics Card */}'
    
    proctoring_card = '''            {/* Engine 5: Gaze & Cognitive Proctoring Integrity Card */}
            {attempt.diagnostic?.proctoringTelemetry && (
              <div style={{
                background: "rgba(15, 23, 42, 0.65)",
                border: "1px solid rgba(16, 185, 129, 0.35)",
                borderRadius: "12px",
                padding: "16px 20px",
                marginTop: "16px",
                direction: "rtl"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
                  <div style={{ fontWeight: "bold", fontSize: "0.95rem", color: "#34d399" }}>
                    👁️ پایش هوشمند سلامت آزمون و بار شناختی (MobileNetV3 + BiLSTM Proctoring)
                  </div>
                  <div style={{ display: "flex", gap: "8px", fontSize: "0.78rem" }}>
                    <span style={{
                      background: attempt.diagnostic.proctoringTelemetry.cheatSuspicionLevel === "low"
                        ? "rgba(16, 185, 129, 0.2)"
                        : attempt.diagnostic.proctoringTelemetry.cheatSuspicionLevel === "medium"
                        ? "rgba(245, 158, 11, 0.2)"
                        : "rgba(239, 68, 68, 0.2)",
                      color: attempt.diagnostic.proctoringTelemetry.cheatSuspicionLevel === "low"
                        ? "#34d399"
                        : attempt.diagnostic.proctoringTelemetry.cheatSuspicionLevel === "medium"
                        ? "#fbbf24"
                        : "#f87171",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      border: "1px solid currentColor"
                    }}>
                      شاخص سلامت آزمون: {attempt.diagnostic.proctoringTelemetry.integrityScore}% ({attempt.diagnostic.proctoringTelemetry.cheatSuspicionLevel === "low" ? "معتبر و استاندارد" : "نیازمند بازبینی"})
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
                  خروج نگاه از صفحه: {attempt.diagnostic.proctoringTelemetry.gazeAwayCount} مرتبه | غیبت طولانی: {attempt.diagnostic.proctoringTelemetry.longAbsenceCount} مرتبه | پردازش کاملاً امن و محلی در مرورگر (Client-Side Edge AI) بدون ذخیره یا ارسال ویدیو
                </div>
              </div>
            )}

            {/* Engine 4: NeuralCDM Causal Diagnostics Card */}'''

    if 'Engine 5: Gaze & Cognitive Proctoring Integrity Card' not in text:
        assert target_needle in text, "IELTS results target needle not found"
        text = text.replace(target_needle, proctoring_card, 1)

    path.write_text(text, encoding="utf-8")
    print("ielts/results/[attemptId]/page.tsx patched successfully!")

if __name__ == "__main__":
    patch_sherlock()
    patch_grammar_hex()
    patch_ielts_exam()
    patch_ielts_results()
    print("All components patched successfully!")
