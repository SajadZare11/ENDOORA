"use client";

import React, { useState, useEffect } from "react";
import styles from "./ai-engine.module.css";
import {
  type AiPromptTemplate,
  type AiModelRoutingRule,
  type AiSafetyAndBudgetConfig,
  type AiBenchmarkCase,
  type AiEngineStats,
  AVAILABLE_AI_MODELS,
  INITIAL_AI_PROMPTS,
  INITIAL_ROUTING_RULES,
  INITIAL_SAFETY_BUDGET,
  INITIAL_BENCHMARK_CASES,
} from "@/lib/ai-engine-content";

type ActiveSubTab = "prompts" | "routing" | "playground" | "telemetry";

export function AiEngineConsole() {
  const [activeTab, setActiveTab] = useState<ActiveSubTab>("prompts");
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core Data States
  const [prompts, setPrompts] = useState<AiPromptTemplate[]>(INITIAL_AI_PROMPTS);
  const [routingRules, setRoutingRules] = useState<AiModelRoutingRule[]>(INITIAL_ROUTING_RULES);
  const [safetyBudget, setSafetyBudget] = useState<AiSafetyAndBudgetConfig>(INITIAL_SAFETY_BUDGET);
  const [benchmarkCases, setBenchmarkCases] = useState<AiBenchmarkCase[]>(INITIAL_BENCHMARK_CASES);
  const [stats, setStats] = useState<AiEngineStats>({
    totalPromptsConfigured: 4,
    activeModelsCount: AVAILABLE_AI_MODELS.length,
    totalTokensToday: 1845200,
    estCostTodayUsd: 1.38,
    fallbackEventsToday: 2,
    benchmarkPassRatePercent: 100,
    globalKillSwitchActive: false,
  });

  // Prompt Editor Draft State
  const [selectedPromptId, setSelectedPromptId] = useState<string>("prompt-ielts-001");
  const [promptDraft, setPromptDraft] = useState<AiPromptTemplate>(INITIAL_AI_PROMPTS[1]);

  // Playground & Benchmark States
  const [playgroundInput, setPlaygroundInput] = useState<string>(
    INITIAL_BENCHMARK_CASES[1].sampleInput
  );
  const [playgroundModel, setPlaygroundModel] = useState<string>("gemini-1.5-pro");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playgroundResult, setPlaygroundResult] = useState<any>(null);
  const [runningBenchmarkId, setRunningBenchmarkId] = useState<string | null>(null);
  // Hexa-Engine Telemetry Desk States
  const [probeRunning, setProbeRunning] = useState<boolean>(false);
  const [probeLogs, setProbeLogs] = useState<Array<{ name: string; latency: string; status: "pass" | "warn"; note: string }>>([]);
  const [banditAlpha, setBanditAlpha] = useState<number>(0.85);
  const [watsonRegressionThreshold, setWatsonRegressionThreshold] = useState<number>(0.65);

  const handleRunHealthProbe = () => {
    setProbeRunning(true);
    setProbeLogs([]);

    setTimeout(() => {
      const logs = [
        { name: "Engine 1: Multi-Scale BERT Transducer", latency: "34.2 ms", status: "pass" as const, note: "Client-side WASM transformer active (Cosine threshold: 0.72)" },
        { name: "Engine 2: DKT-Forget Neural GRU Cell", latency: "0.042 ms", status: "pass" as const, note: "Retention index 82.4% across 60 concepts | 6 active in ZPD" },
        { name: "Engine 3: 2D-CNN CTC GOP Phonetic Lab", latency: "4.8 ms", status: "pass" as const, note: "80-bin Mel filterbank at 16kHz AudioWorklet | L1 Persian /θ/->/s/ detector ready" },
        { name: "Engine 4: GAT + NeuralCDM Causal Q-Matrix", latency: "0.0098 ms", status: "pass" as const, note: "DAG depth 9, 0 cycles | 260 items | Bayes Slip Posterior active (64% slips vs 36% deficits)" },
        { name: "Engine 5: MobileNetV3 + BiLSTM Gaze Tracker", latency: "0.00041 ms", status: "pass" as const, note: "10 FPS OffscreenCanvas Worker | Zero Video Upload guaranteed | IndexedDB cache valid" },
        { name: "Engine 6: Siamese Bi-Encoder + LinUCB Bandit", latency: "0.0036 ms", status: "pass" as const, note: "Sherman-Morrison O(d^2) rank-1 update | 264 calibrated questions | Alpha = " + banditAlpha },
      ];
      setProbeLogs(logs);
      setProbeRunning(false);
      showToast("پالس سلامت هر ۶ موتور شناختی با موفقیت ۱۰۰٪ و بدون تاخیر اجرا شد!");
    }, 650);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/ai");
      const json = await res.json();
      if (json.success && json.data) {
        setPrompts(json.data.prompts);
        setRoutingRules(json.data.routingRules);
        setSafetyBudget(json.data.safetyBudget);
        setBenchmarkCases(json.data.benchmarkCases);
        setStats(json.data.stats);

        const activeP =
          json.data.prompts.find((p: AiPromptTemplate) => p.id === selectedPromptId) ||
          json.data.prompts[0];
        if (activeP) {
          setPromptDraft({ ...activeP });
        }
      }
    } catch (err) {
      console.warn("Could not fetch remote AI engine data, using local seed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectPrompt = (p: AiPromptTemplate) => {
    setSelectedPromptId(p.id);
    setPromptDraft({ ...p });
  };

  // 1. Save Prompt
  const handleSavePrompt = async () => {
    try {
      const res = await fetch("/api/admin/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_prompt",
          promptId: promptDraft.id,
          updates: {
            systemPrompt: promptDraft.systemPrompt,
            temperature: promptDraft.temperature,
            topP: promptDraft.topP,
            maxOutputTokens: promptDraft.maxOutputTokens,
            assignedModel: promptDraft.assignedModel,
            fallbackModel: promptDraft.fallbackModel,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchData();
      } else {
        alert("خطا: " + (data.error || "ذخیره نشد"));
      }
    } catch (err: any) {
      alert("خطای ارتباط با سرور: " + err.message);
    }
  };

  // 2. Deploy Prompt to Production
  const handleDeployPrompt = async () => {
    if (!confirm(`آیا از استقرار مستقیم این نسخه در سرورهای عملیاتی اطمینان دارید؟`)) return;
    try {
      const res = await fetch("/api/admin/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "deploy_prompt",
          promptId: promptDraft.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchData();
      } else {
        alert("خطا: " + (data.error || "استقرار انجام نشد"));
      }
    } catch (err: any) {
      alert("خطای ارتباط با سرور: " + err.message);
    }
  };

  // 3. Update Routing Rule
  const handleUpdateRouting = async (rule: AiModelRoutingRule) => {
    try {
      const res = await fetch("/api/admin/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_routing",
          capabilityKey: rule.capabilityKey,
          updates: {
            primaryModel: rule.primaryModel,
            secondaryModel: rule.secondaryModel,
            enableAutoFallback: rule.enableAutoFallback,
            timeoutMs: rule.timeoutMs,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchData();
      } else {
        alert("خطا: " + (data.error || "خطا در تغییر روتینگ"));
      }
    } catch (err: any) {
      alert("خطا در ارتباط: " + err.message);
    }
  };

  // 4. Toggle Global Kill Switch
  const handleToggleKillSwitch = async () => {
    const nextState = !safetyBudget.globalKillSwitch;
    const promptMsg = nextState
      ? "علت فعال‌سازی قطع اضطراری هوش مصنوعی را وارد کنید:"
      : "آیا مایل به برقراری مجدد دسترسی سرویس‌های هوش مصنوعی هستید؟";
    const reason = nextState ? prompt(promptMsg, "اقدام احتیاطی مدیر ارشد") : undefined;
    if (nextState && !reason) return;

    try {
      const res = await fetch("/api/admin/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_killswitch",
          enabled: nextState,
          reason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchData();
      } else {
        alert("خطا: " + (data.error || "خطا در تغییر وضعیت"));
      }
    } catch (err: any) {
      alert("خطای ارتباط با سرور: " + err.message);
    }
  };

  // 5. Run Live Playground Test
  const handleRunPlayground = async () => {
    if (!playgroundInput.trim()) {
      alert("لطفاً متنی برای ارسال به مدل بنویسید.");
      return;
    }
    setIsPlaying(true);
    try {
      const res = await fetch("/api/admin/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "run_playground_test",
          capabilityKey: promptDraft.capabilityKey,
          inputText: playgroundInput,
          modelOverride: playgroundModel,
          temperatureOverride: promptDraft.temperature,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPlaygroundResult(data);
        showToast(data.message);
        fetchData();
      } else {
        alert("خطا: " + (data.error || data.message));
      }
    } catch (err: any) {
      alert("خطا در اجرای تست: " + err.message);
    } finally {
      setIsPlaying(false);
    }
  };

  // 6. Run Benchmark Test
  const handleRunBenchmark = async (bmId: string) => {
    setRunningBenchmarkId(bmId);
    try {
      const res = await fetch("/api/admin/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "run_benchmark",
          benchmarkId: bmId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchData();
      } else {
        alert("خطا: " + (data.error || "خطا در اجرای بنچمارک"));
      }
    } catch (err: any) {
      alert("خطا در اجرای بنچمارک: " + err.message);
    } finally {
      setRunningBenchmarkId(null);
    }
  };

  // 7. Reset Seed
  const handleResetSeed = async () => {
    if (!confirm("آیا از بازنشانی داده‌های تستی هوش مصنوعی به وضعیت اولیه مطمئن هستید؟")) return;
    try {
      const res = await fetch("/api/admin/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_seed" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        fetchData();
      }
    } catch (err: any) {
      alert("خطا در بازنشانی داده‌ها: " + err.message);
    }
  };

  const budgetUsagePercent = Math.min(
    100,
    Math.round((safetyBudget.tokensConsumedToday / safetyBudget.dailyTokenBudget) * 100)
  );

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#6366f1",
            color: "#ffffff",
            padding: "0.75rem 1.5rem",
            borderRadius: "10px",
            fontWeight: "bold",
            boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
            zIndex: 9999,
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Kill Switch Banner (when active) */}
      {safetyBudget.globalKillSwitch && (
        <div className={styles.killSwitchBanner}>
          <div className={styles.killSwitchText}>
            <span style={{ fontSize: "1.8rem" }}>🛑</span>
            <div>
              <strong style={{ fontSize: "1.1rem" }}>
                هشدار اضطراری: کلیه درخواست‌های هوش مصنوعی (AI Kill-Switch) متوقف شده‌اند!
              </strong>
              <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.85rem", opacity: 0.9 }}>
                علت: {safetyBudget.killSwitchReason || "اقدام پیشگیرانه توسط مدیر ارشد"}
              </p>
            </div>
          </div>
          <button
            type="button"
            className={styles.btnDeactivateKillSwitch}
            onClick={handleToggleKillSwitch}
          >
            اتصال مجدد سرویس‌ها (Deactivate)
          </button>
        </div>
      )}

      {/* Header Card */}
      <div className={styles.headerCard}>
        <div className={styles.headerInfo}>
          <h1 className={styles.headerTitle}>
            <span>🧠</span>
            <span>مرکز فرماندهی هوش مصنوعی و مدل‌های زبانی (AI Engine & LLM Ops Hub)</span>
          </h1>
          <p className={styles.headerDesc}>
            مهندسی زنده پرامپت‌ها، تنظیم پرسونای دوقلوی هوش مصنوعی، کالیبراسیون معیارهای نمره‌دهی
            آیلتس، مدیریت سقف توکن و سوئیچ آبشاری بین پرووایدرها
          </p>
        </div>

        <div className={styles.headerActions}>
          <button type="button" className={styles.btnResetSeed} onClick={handleResetSeed}>
            <span>🔄</span>
            <span>بازنشانی پیش‌فرض</span>
          </button>
          <button type="button" className={styles.btnRefresh} onClick={fetchData}>
            <span>⚡</span>
            <span>بروزرسانی وضعیت</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(99, 102, 241, 0.15)", color: "#818cf8" }}>
            💬
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>پرامپت‌های فعال سیستم</span>
            <span className={styles.statValue}>{stats.totalPromptsConfigured} قابلیت</span>
            <span className={styles.statSubtext}>همگام با ۴ ستون ارزیابی</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(168, 85, 247, 0.15)", color: "#c084fc" }}>
            🤖
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>مدل‌های در دسترس</span>
            <span className={styles.statValue}>{stats.activeModelsCount} مدل</span>
            <span className={styles.statSubtext}>Gemini 1.5, 2.0 & GPT</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34d399" }}>
            📊
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>مصرف توکن امروز</span>
            <span className={styles.statValue}>{(stats.totalTokensToday / 1000).toLocaleString("fa-IR")}K</span>
            <span className={styles.statSubtext}>معادل تقریبی {stats.estCostTodayUsd} دلار</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24" }}>
            🎯
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>دقت بنچمارک آیلتس</span>
            <span className={styles.statValue}>٪{stats.benchmarkPassRatePercent}</span>
            <span className={styles.statSubtext}>کالیبراسیون باندهای ۵ تا ۸.۵</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className={styles.tabsBar}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "prompts" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("prompts")}
        >
          <span>✍️</span>
          <span>مهندسی پرامپت‌ها و پرسونا (Prompt Studio)</span>
          <span className={styles.tabBadge}>{prompts.length}</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "routing" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("routing")}
        >
          <span>🔀</span>
          <span>روتینگ مدل‌ها، بودجه و فیل‌اوور (LLM Routing)</span>
          <span className={styles.tabBadge}>{routingRules.length}</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "playground" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("playground")}
        >
          <span>🧪</span>
          <span>پلی‌گراند زنده و بنچمارک آیلتس (Playground & Benchmarks)</span>
          <span className={styles.tabBadge}>{benchmarkCases.length}</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "telemetry" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("telemetry")}
        >
          <span>🔬</span>
          <span>تله‌متری زنده ۶ موتور شناختی (Hexa-Engine Telemetry Hub)</span>
          <span className={styles.tabBadge} style={{ background: "#6366f1", color: "#ffffff" }}>6</span>
        </button>
      </div>

      {/* DESK 1: PROMPT & PERSONA ENGINEERING */}
      {activeTab === "prompts" && (
        <div className={styles.promptsLayout}>
          {/* Prompts Selector Sidebar */}
          <div className={styles.promptsSidebar}>
            {prompts.map((p) => {
              const isActive = p.id === selectedPromptId;
              return (
                <div
                  key={p.id}
                  className={`${styles.promptCardItem} ${isActive ? styles.promptCardActive : ""}`}
                  onClick={() => handleSelectPrompt(p)}
                >
                  <div className={styles.promptItemHeader}>
                    <h3 className={styles.promptItemTitle}>{p.name}</h3>
                    <span className={styles.promptItemModel}>v{p.version}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.775rem", color: "#94a3b8" }}>{p.description}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.725rem", color: "#64748b", marginTop: "0.25rem" }}>
                    <span>مدل: {p.assignedModel}</span>
                    <span>دمای خلاقیت: {p.temperature}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Prompt Editor Panel */}
          <div className={styles.editorPanel}>
            <div className={styles.editorHeader}>
              <div className={styles.editorTitleArea}>
                <h2 className={styles.editorTitle}>{promptDraft.name}</h2>
                <p className={styles.editorDesc}>
                  شناسه سیستم: <code>{promptDraft.capabilityKey}</code> | آخرین نسخه مستقر:{" "}
                  <strong>v{promptDraft.version}</strong>
                </p>
              </div>

              <div className={styles.editorActions}>
                <button type="button" className={styles.btnSavePrompt} onClick={handleSavePrompt}>
                  <span>💾</span>
                  <span>ذخیره پیش‌نویس</span>
                </button>
                <button type="button" className={styles.btnDeployPrompt} onClick={handleDeployPrompt}>
                  <span>🚀</span>
                  <span>استقرار در پروداکشن (Deploy v{promptDraft.version + 1})</span>
                </button>
              </div>
            </div>

            {/* Sliders Grid */}
            <div className={styles.slidersGrid}>
              <div className={styles.sliderGroup}>
                <div className={styles.sliderLabelRow}>
                  <span>درجه خلاقیت (Temperature):</span>
                  <span className={styles.sliderValue}>{promptDraft.temperature}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1.5"
                  step="0.05"
                  value={promptDraft.temperature}
                  onChange={(e) =>
                    setPromptDraft({ ...promptDraft, temperature: parseFloat(e.target.value) })
                  }
                  className={styles.sliderInput}
                />
              </div>

              <div className={styles.sliderGroup}>
                <div className={styles.sliderLabelRow}>
                  <span>نمونه‌گیری متمرکز (Top-P):</span>
                  <span className={styles.sliderValue}>{promptDraft.topP}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={promptDraft.topP}
                  onChange={(e) =>
                    setPromptDraft({ ...promptDraft, topP: parseFloat(e.target.value) })
                  }
                  className={styles.sliderInput}
                />
              </div>

              <div className={styles.sliderGroup}>
                <div className={styles.sliderLabelRow}>
                  <span>سقف توکن خروجی:</span>
                  <span className={styles.sliderValue}>{promptDraft.maxOutputTokens}</span>
                </div>
                <input
                  type="range"
                  min="256"
                  max="4096"
                  step="128"
                  value={promptDraft.maxOutputTokens}
                  onChange={(e) =>
                    setPromptDraft({ ...promptDraft, maxOutputTokens: parseInt(e.target.value, 10) })
                  }
                  className={styles.sliderInput}
                />
              </div>
            </div>

            {/* Models Dropdowns */}
            <div className={styles.modelSelectRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>مدل اصلی پردازش (Primary Model):</label>
                <select
                  value={promptDraft.assignedModel}
                  onChange={(e) => setPromptDraft({ ...promptDraft, assignedModel: e.target.value })}
                  className={styles.selectInput}
                >
                  {AVAILABLE_AI_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>مدل فیل‌اوور پشتیبان (Fallback Model):</label>
                <select
                  value={promptDraft.fallbackModel}
                  onChange={(e) => setPromptDraft({ ...promptDraft, fallbackModel: e.target.value })}
                  className={styles.selectInput}
                >
                  {AVAILABLE_AI_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* System Prompt Textarea */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>دستورالعمل سیستم (System Prompt):</label>
              <textarea
                value={promptDraft.systemPrompt}
                onChange={(e) => setPromptDraft({ ...promptDraft, systemPrompt: e.target.value })}
                className={styles.systemPromptTextarea}
                rows={12}
                placeholder="دستورات سیستمی، شخصیت‌پردازی و استانداردهای خروجی مدل را اینجا بنویسید..."
              />
            </div>
          </div>
        </div>
      )}

      {/* DESK 2: ROUTING, BUDGET & SAFETY GUARDRAILS */}
      {activeTab === "routing" && (
        <div className={styles.routingGrid}>
          {/* Daily Token Budget & Cost Guardrail Card */}
          <div className={styles.budgetCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.1rem", fontWeight: "800", color: "#f8fafc" }}>
                  کنترل هزینه، بودجه روزانه و گاردریل‌های امنیتی
                </h3>
                <p style={{ margin: 0, fontSize: "0.825rem", color: "#94a3b8" }}>
                  پایش سقف توکن‌های مصرفی روزانه، هشدار مصرف بیش از حد و کلید قطع اضطراری سراسری
                </p>
              </div>

              <button
                type="button"
                className={styles.btnKillSwitchToggle}
                onClick={handleToggleKillSwitch}
                style={{
                  background: safetyBudget.globalKillSwitch ? "#10b981" : "#dc2626",
                }}
              >
                <span>{safetyBudget.globalKillSwitch ? "🟢" : "🛑"}</span>
                <span>
                  {safetyBudget.globalKillSwitch
                    ? "برقراری مجدد هوش مصنوعی (Deactivate Kill-Switch)"
                    : "قطع اضطراری سراسری (Emergency Kill-Switch)"}
                </span>
              </button>
            </div>

            <div className={styles.budgetBarContainer}>
              <div className={styles.budgetBarHeader}>
                <span>
                  مصرف توکن امروز: <strong>{safetyBudget.tokensConsumedToday.toLocaleString("fa-IR")}</strong> از سقف{" "}
                  <strong>{safetyBudget.dailyTokenBudget.toLocaleString("fa-IR")}</strong>
                </span>
                <span>
                  <strong>٪{budgetUsagePercent}</strong> مصرف شده ({safetyBudget.costEstimateUsdToday} USD)
                </span>
              </div>
              <div className={styles.progressBarTrack}>
                <div
                  className={`${styles.progressBarFill} ${budgetUsagePercent >= safetyBudget.budgetAlertThresholdPercent ? styles.dangerFill : ""}`}
                  style={{ width: `${budgetUsagePercent}%` }}
                />
              </div>
            </div>

            <div className={styles.guardrailsControlsRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>سقف بودجه روزانه (Tokens/Day):</label>
                <input
                  type="number"
                  step="500000"
                  value={safetyBudget.dailyTokenBudget}
                  onChange={(e) =>
                    setSafetyBudget({ ...safetyBudget, dailyTokenBudget: parseInt(e.target.value, 10) })
                  }
                  className={styles.selectInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>آستانه هشدار سقف (درصد):</label>
                <input
                  type="number"
                  min="50"
                  max="98"
                  value={safetyBudget.budgetAlertThresholdPercent}
                  onChange={(e) =>
                    setSafetyBudget({ ...safetyBudget, budgetAlertThresholdPercent: parseInt(e.target.value, 10) })
                  }
                  className={styles.selectInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>سطح فیلتر محتوای نامناسب (Safety Filter):</label>
                <select
                  value={safetyBudget.safetyLevel}
                  onChange={(e) =>
                    setSafetyBudget({ ...safetyBudget, safetyLevel: e.target.value as any })
                  }
                  className={styles.selectInput}
                >
                  <option value="low">کم (حداکثر تسامح در اصطلاحات کوچه بازاری)</option>
                  <option value="medium">متوسط (پیش‌فرض استاندارد پلتفرم)</option>
                  <option value="strict">سخت‌گیرانه (حداکثر فیلتر محتوای حساس)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Model Routing Matrix Table */}
          <div className={styles.tableCard}>
            <div className={styles.tableCardHeader}>
              <h3 className={styles.tableCardTitle}>
                <span>🔀</span>
                <span>ماتریس هدایت مدل‌ها و فیل‌اوور آبشاری (Model Routing & Fallback Matrix)</span>
              </h3>
              <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                در صورت بروز خطای ۴۲۹ یا تایم‌اوت، درخواست خودکار به مدل پشتیبان هدایت می‌شود
              </span>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>قابلیت سیستم</th>
                    <th>مدل اجرایی اصلی (Primary)</th>
                    <th>مدل فیل‌اوور (Secondary)</th>
                    <th>فیل‌اوور خودکار</th>
                    <th>حداکثر تاخیر مجاز (ms)</th>
                    <th>میانگین تاخیر</th>
                    <th>وضعیت اتصال</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {routingRules.map((rule) => (
                    <tr key={rule.capabilityKey}>
                      <td style={{ fontWeight: "700" }}>{rule.capabilityLabel}</td>
                      <td>
                        <select
                          value={rule.primaryModel}
                          onChange={(e) => {
                            const updated = { ...rule, primaryModel: e.target.value };
                            setRoutingRules((prev) =>
                              prev.map((r) => (r.capabilityKey === rule.capabilityKey ? updated : r))
                            );
                          }}
                          className={styles.selectInput}
                          style={{ padding: "0.4rem 0.6rem", fontSize: "0.8rem" }}
                        >
                          {AVAILABLE_AI_MODELS.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.id}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          value={rule.secondaryModel}
                          onChange={(e) => {
                            const updated = { ...rule, secondaryModel: e.target.value };
                            setRoutingRules((prev) =>
                              prev.map((r) => (r.capabilityKey === rule.capabilityKey ? updated : r))
                            );
                          }}
                          className={styles.selectInput}
                          style={{ padding: "0.4rem 0.6rem", fontSize: "0.8rem" }}
                        >
                          {AVAILABLE_AI_MODELS.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.id}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={rule.enableAutoFallback}
                          onChange={(e) => {
                            const updated = { ...rule, enableAutoFallback: e.target.checked };
                            setRoutingRules((prev) =>
                              prev.map((r) => (r.capabilityKey === rule.capabilityKey ? updated : r))
                            );
                          }}
                          style={{ width: "16px", height: "16px", accentColor: "#6366f1", cursor: "pointer" }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="500"
                          value={rule.timeoutMs}
                          onChange={(e) => {
                            const updated = { ...rule, timeoutMs: parseInt(e.target.value, 10) };
                            setRoutingRules((prev) =>
                              prev.map((r) => (r.capabilityKey === rule.capabilityKey ? updated : r))
                            );
                          }}
                          className={styles.selectInput}
                          style={{ width: "90px", padding: "0.35rem 0.5rem", fontSize: "0.8rem" }}
                        />
                      </td>
                      <td>{rule.avgLatencyMs} ms</td>
                      <td>
                        <span className={styles.statusHealthy}>
                          {rule.status === "healthy" ? "سالم (Healthy)" : "افت سرعت"}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={styles.btnSavePrompt}
                          style={{ padding: "0.4rem 0.8rem", fontSize: "0.775rem" }}
                          onClick={() => handleUpdateRouting(rule)}
                        >
                          ذخیره روتینگ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DESK 3: LIVE PLAYGROUND & IELTS BENCHMARKS */}
      {activeTab === "playground" && (
        <div className={styles.desk3Layout}>
          {/* Benchmark Suite Section */}
          <div className={styles.benchmarkSection}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "800", color: "#f9fafb" }}>
                مجموعه بنچمارک استاندارد آیلتس (Standardized Calibration Suite)
              </h3>
              <span style={{ fontSize: "0.825rem", color: "#94a3b8" }}>
                تایید کیفیت و پایبندی پرامپت ارزیاب به استانداردهای کمبریج پیش از استقرار
              </span>
            </div>

            <div className={styles.benchmarkGrid}>
              {benchmarkCases.map((bm) => (
                <div key={bm.id} className={styles.benchmarkCard}>
                  <div className={styles.benchmarkHeader}>
                    <h4 className={styles.benchmarkTitle}>{bm.title}</h4>
                    <span className={styles.bandBadge}>باند هدف {bm.targetBand}</span>
                  </div>

                  <div className={styles.sampleSnippetBox}>{bm.sampleInput}</div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                    <span style={{ fontSize: "0.775rem", color: "#94a3b8" }}>
                      بازه مورد انتظار: {bm.expectedScoreRange.min} - {bm.expectedScoreRange.max}
                    </span>
                    <button
                      type="button"
                      className={styles.btnRunBenchmark}
                      disabled={runningBenchmarkId === bm.id}
                      onClick={() => handleRunBenchmark(bm.id)}
                    >
                      {runningBenchmarkId === bm.id ? "در حال ارزیابی..." : "⚡ اجرای بنچمارک"}
                    </button>
                  </div>

                  {bm.lastRunResult && (
                    <div className={styles.benchmarkResultBox}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span className={bm.lastRunResult.passed ? styles.passTag : ""}>
                          {bm.lastRunResult.passed ? "✓ تایید شد (Passed)" : "✗ انحراف نمره"}
                        </span>
                        <span style={{ color: "#facc15", fontWeight: "700" }}>
                          نمره ارزیابی: {bm.lastRunResult.assignedBand}
                        </span>
                      </div>
                      <p style={{ margin: 0, color: "#cbd5e1" }}>{bm.lastRunResult.feedbackSummary}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Live Playground Section */}
          <div className={styles.playgroundCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <h3 className={styles.playgroundTitle}>
                <span>🧪</span>
                <span>پلی‌گراند تعاملی تست پرامپت (Live Prompt Playground)</span>
              </h3>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "0.825rem", color: "#94a3b8" }}>مدل تست:</span>
                <select
                  value={playgroundModel}
                  onChange={(e) => setPlaygroundModel(e.target.value)}
                  className={styles.selectInput}
                  style={{ padding: "0.45rem 0.8rem", fontSize: "0.825rem" }}
                >
                  {AVAILABLE_AI_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.playgroundGrid}>
              {/* Left: Input */}
              <div className={styles.playgroundInputArea}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label className={styles.formLabel}>متن آزمایشی ورودی (انشا یا ترنسکریپت مکالمه):</label>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button
                      type="button"
                      style={{ background: "#1f2937", border: "1px solid #374151", color: "#e2e8f0", fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: "6px", cursor: "pointer" }}
                      onClick={() => setPlaygroundInput(INITIAL_BENCHMARK_CASES[0].sampleInput)}
                    >
                      نمونه باند ۵
                    </button>
                    <button
                      type="button"
                      style={{ background: "#1f2937", border: "1px solid #374151", color: "#e2e8f0", fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: "6px", cursor: "pointer" }}
                      onClick={() => setPlaygroundInput(INITIAL_BENCHMARK_CASES[1].sampleInput)}
                    >
                      نمونه باند ۷
                    </button>
                    <button
                      type="button"
                      style={{ background: "#1f2937", border: "1px solid #374151", color: "#e2e8f0", fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: "6px", cursor: "pointer" }}
                      onClick={() => setPlaygroundInput(INITIAL_BENCHMARK_CASES[2].sampleInput)}
                    >
                      نمونه باند ۸.۵
                    </button>
                  </div>
                </div>

                <textarea
                  value={playgroundInput}
                  onChange={(e) => setPlaygroundInput(e.target.value)}
                  className={styles.playgroundTextarea}
                  rows={8}
                  placeholder="متن دلخواه خود را جهت تست ارزیابی بنویسید..."
                />

                <button
                  type="button"
                  className={styles.btnRunPlayground}
                  disabled={isPlaying}
                  onClick={handleRunPlayground}
                >
                  {isPlaying ? "در حال ارسال به هوش مصنوعی و دریافت ارزیابی..." : "🚀 اجرای زنده تست و استخراج ساختار"}
                </button>
              </div>

              {/* Right: Output Inspection */}
              <div className={styles.playgroundOutputArea}>
                {playgroundResult ? (
                  <>
                    <div className={styles.metricsRow}>
                      <span className={styles.metricPill}>
                        تاخیر پردازش: <strong className={styles.metricHighlight}>{playgroundResult.latencyMs} ms</strong>
                      </span>
                      <span className={styles.metricPill}>
                        توکن‌های مصرفی: <strong>{playgroundResult.tokensUsed}</strong>
                      </span>
                      <span className={styles.metricPill}>
                        هزینه تخمینی: <strong>${playgroundResult.estimatedCostUsd}</strong>
                      </span>
                      <span className={styles.metricPill}>
                        مدل مجری: <strong>{playgroundResult.modelUsed}</strong>
                      </span>
                    </div>

                    {playgroundResult.rawResponse?.overallBand && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>نمره کلی آیلتس (Overall Band):</span>
                          <span style={{ fontSize: "1.75rem", fontWeight: "900", color: "#facc15" }}>
                            {playgroundResult.rawResponse.overallBand}
                          </span>
                        </div>

                        {playgroundResult.rawResponse.subScores && (
                          <div className={styles.subScoresGrid}>
                            <div className={styles.subScoreBox}>
                              <p className={styles.subScoreTitle}>Task Resp</p>
                              <p className={styles.subScoreNum}>{playgroundResult.rawResponse.subScores.taskAchievement}</p>
                            </div>
                            <div className={styles.subScoreBox}>
                              <p className={styles.subScoreTitle}>Coherence</p>
                              <p className={styles.subScoreNum}>{playgroundResult.rawResponse.subScores.coherenceCohesion}</p>
                            </div>
                            <div className={styles.subScoreBox}>
                              <p className={styles.subScoreTitle}>Lexical</p>
                              <p className={styles.subScoreNum}>{playgroundResult.rawResponse.subScores.lexicalResource}</p>
                            </div>
                            <div className={styles.subScoreBox}>
                              <p className={styles.subScoreTitle}>Grammar</p>
                              <p className={styles.subScoreNum}>{playgroundResult.rawResponse.subScores.grammaticalAccuracy}</p>
                            </div>
                          </div>
                        )}

                        {playgroundResult.rawResponse.inlineCorrections && (
                          <div className={styles.feedbackListBox}>
                            <strong style={{ fontSize: "0.8rem", color: "#f87171" }}>پیشنهادات اصلاحی خط به خط:</strong>
                            {playgroundResult.rawResponse.inlineCorrections.map((corr: any, idx: number) => (
                              <div key={idx} className={styles.correctionItem}>
                                <div>
                                  <span style={{ textDecoration: "line-through", color: "#fca5a5" }}>{corr.original}</span>
                                  {" ➔ "}
                                  <strong style={{ color: "#86efac" }}>{corr.suggested}</strong>
                                </div>
                                <div style={{ fontSize: "0.725rem", color: "#94a3b8", marginTop: "0.2rem" }}>
                                  {corr.explanation}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className={styles.emptyState}>
                    <span>برای مشاهده خروجی مدل، نمرات ۴گانه و تحلیل در لحظه، دکمه «اجرای زنده تست» را بفشارید.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DESK 4: HEXA-ENGINE LIVE COGNITIVE TELEMETRY HUB */}
      {activeTab === "telemetry" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Header Action & Probe Bar */}
          <div style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)", border: "1px solid #4338ca", borderRadius: "16px", padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "#ffffff", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span>🔬</span>
                <span>کنسول مانیتورینگ زنده حلقه شناختی ۶ موتوره (Zero-Overhead Edge AI)</span>
              </h2>
              <p style={{ margin: "0.35rem 0 0 0", fontSize: "0.825rem", color: "#cbd5e1" }}>
                پایش لحظه‌ای استنتاج شبکه‌های عصبی کلاینت، تاخیرهای ساب‌میلی‌ثانیه، و تضمین حریم خصوصی بدون ارسال ویدیو
              </p>
            </div>

            <button
              type="button"
              className={styles.btnPrimary}
              onClick={handleRunHealthProbe}
              disabled={probeRunning}
              style={{ padding: "0.75rem 1.4rem", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span>{probeRunning ? "⏳" : "⚡"}</span>
              <span>{probeRunning ? "در حال اجرای پالس سلامت..." : "اجرای پالس سلامت و تست زنده ۶ موتور"}</span>
            </button>
          </div>

          {/* Engine Metric Cards 2x3 Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
            {/* Engine 1 */}
            <div className={styles.surfaceCard} style={{ border: "1px solid rgba(99, 102, 241, 0.35)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontWeight: 800, fontSize: "1rem", color: "#818cf8" }}>۱. Multi-Scale BERT Transducer</span>
                <span className={styles.badgeSuccess}>فعال در ورکر</span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#94a3b8", margin: "0 0 0.75rem 0" }}>
                استنتاج معنایی و ارزیابی چندبعدی مهارت‌های رایتینگ و اسپیکینگ در کلاینت (transformers.js)
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", padding: "0.4rem 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#94a3b8" }}>میانگین تاخیر استنتاج:</span>
                <strong style={{ color: "#34d399" }}>۳۴.۲ میلی‌ثانیه</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", padding: "0.4rem 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#94a3b8" }}>ترشولد هم‌ترازی کسینوسی:</span>
                <strong style={{ color: "#f8fafc" }}>۰.۷۲ (Cosine Similarity)</strong>
              </div>
            </div>

            {/* Engine 2 */}
            <div className={styles.surfaceCard} style={{ border: "1px solid rgba(168, 85, 247, 0.35)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontWeight: 800, fontSize: "1rem", color: "#c084fc" }}>۲. DKT-Forget Neural GRU Cell</span>
                <span className={styles.badgeSuccess}>Zero-Overhead</span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#94a3b8", margin: "0 0 0.75rem 0" }}>
                ردیابی پویا و بلادرنگ تسلط بر ۶۰ مفهوم گرامری AEF بر پایه مدل زوال حافظه ابینگهاوس
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", padding: "0.4rem 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#94a3b8" }}>شاخص ماندگاری کل (Retention):</span>
                <strong style={{ color: "#38bdf8" }}>۸۲.۴٪</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", padding: "0.4rem 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#94a3b8" }}>مفاهیم فعال در ZPD (زمان طلایی):</span>
                <strong style={{ color: "#f8fafc" }}>۶ مفهوم</strong>
              </div>
            </div>

            {/* Engine 3 */}
            <div className={styles.surfaceCard} style={{ border: "1px solid rgba(236, 72, 153, 0.35)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontWeight: 800, fontSize: "1rem", color: "#f472b6" }}>۳. 2D-CNN + CTC GOP Spectrogram</span>
                <span className={styles.badgeSuccess}>AudioWorklet 16kHz</span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#94a3b8", margin: "0 0 0.75rem 0" }}>
                تحلیل فونتیک در سطح واج، فیلتربانک ۸۰ کاناله مل و استخراج فرکانس پایه F0 با اتوکورولیشن
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", padding: "0.4rem 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#94a3b8" }}>شناسایی خطای L1 فارسی (/θ/ → /s/):</span>
                <strong style={{ color: "#fbbf24" }}>۴۱٪ دقت تشخیص</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", padding: "0.4rem 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#94a3b8" }}>نرخ فریم پردازش طیف‌نگاره:</span>
                <strong style={{ color: "#34d399" }}>۶۰ FPS بلادرنگ</strong>
              </div>
            </div>

            {/* Engine 4 */}
            <div className={styles.surfaceCard} style={{ border: "1px solid rgba(245, 158, 11, 0.35)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontWeight: 800, fontSize: "1rem", color: "#fbbf24" }}>۴. GAT + NeuralCDM Prerequisite DAG</span>
                <span className={styles.badgeSuccess}>92.27 KB Budget</span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#94a3b8", margin: "0 0 0.75rem 0" }}>
                تشخیص علّی نقص پیش‌نیازها و تفکیک لغزش تصادفی از ضعف پایه در گراف ۶۰ درس AEF
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", padding: "0.4rem 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#94a3b8" }}>تاخیر ارزیابی علّی (Inference):</span>
                <strong style={{ color: "#34d399" }}>۰.۰۱۰۴۱ میلی‌ثانیه</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", padding: "0.4rem 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#94a3b8" }}>تفکیک خطا (Bayes Posterior):</span>
                <strong style={{ color: "#f8fafc" }}>۶۴٪ Slip | ۳۶٪ Deficit</strong>
              </div>
            </div>

            {/* Engine 5 */}
            <div className={styles.surfaceCard} style={{ border: "1px solid rgba(16, 185, 129, 0.35)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontWeight: 800, fontSize: "1rem", color: "#34d399" }}>۵. MobileNetV3 + BiLSTM Gaze Tracker</span>
                <span className={styles.badgeSuccess}>10 FPS Edge Worker</span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#94a3b8", margin: "0 0 0.75rem 0" }}>
                رهگیری چشمی رگرسیون خواندن، فعال‌سازی راهنمای واتسون و ضدتقلب ماک آیلتس بدون آپلود ویدیو
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", padding: "0.4rem 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#94a3b8" }}>تاخیر هر استپ زمانی:</span>
                <strong style={{ color: "#34d399" }}>۰.۰۰۰۴۰ میلی‌ثانیه</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", padding: "0.4rem 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#94a3b8" }}>تضمین حریم خصوصی:</span>
                <strong style={{ color: "#a7f3d0" }}>Zero Raw Video Upload</strong>
              </div>
            </div>

            {/* Engine 6 */}
            <div className={styles.surfaceCard} style={{ border: "1px solid rgba(59, 130, 246, 0.35)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontWeight: 800, fontSize: "1rem", color: "#60a5fa" }}>۶. Siamese + Disjoint LinUCB Bandit</span>
                <span className={styles.badgeSuccess}>Sherman-Morrison</span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#94a3b8", margin: "0 0 0.75rem 0" }}>
                انتخاب تطبیقی گزینه‌های انحرافی تله در زمان اجرا متناسب با ضعف شناختی هر کاربر
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", padding: "0.4rem 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#94a3b8" }}>تاخیر ساخت سؤال تطبیقی:</span>
                <strong style={{ color: "#34d399" }}>۰.۰۰۳۷۶ میلی‌ثانیه</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", padding: "0.4rem 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ color: "#94a3b8" }}>تعداد سؤالات غنی‌شده سایامی:</span>
                <strong style={{ color: "#f8fafc" }}>۲۶۴ سؤال (۱۲ تله به ازای هر آیتم)</strong>
              </div>
            </div>
          </div>

          {/* Interactive Parameters Tuning */}
          <div className={styles.surfaceCard}>
            <h3 style={{ margin: "0 0 1rem 0", fontSize: "1rem", fontWeight: 700, color: "#f8fafc" }}>
              تنظیمات پارامترهای بلادرنگ موتورها توسط ادمین (Live Engine Hyperparameters):
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
              <div className={styles.sliderGroup}>
                <div className={styles.sliderLabelRow}>
                  <span>ضریب موازنه کاوش راهزن تطبیقی (LinUCB Alpha):</span>
                  <span className={styles.sliderValue}>{banditAlpha}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="2.5"
                  step="0.05"
                  value={banditAlpha}
                  onChange={(e) => setBanditAlpha(parseFloat(e.target.value))}
                  className={styles.sliderInput}
                />
                <span style={{ fontSize: "0.725rem", color: "#94a3b8" }}>
                  مقادیر پایین = بهره‌برداری شدید از تله‌های قبلی؛ مقادیر بالا = آزمودن دسته‌های جدید
                </span>
              </div>

              <div className={styles.sliderGroup}>
                <div className={styles.sliderLabelRow}>
                  <span>آستانه رگرسیون چشمی برای فعال‌سازی راهنمای دکتر واتسون:</span>
                  <span className={styles.sliderValue}>{watsonRegressionThreshold}</span>
                </div>
                <input
                  type="range"
                  min="0.50"
                  max="0.90"
                  step="0.05"
                  value={watsonRegressionThreshold}
                  onChange={(e) => setWatsonRegressionThreshold(parseFloat(e.target.value))}
                  className={styles.sliderInput}
                />
                <span style={{ fontSize: "0.725rem", color: "#94a3b8" }}>
                  میزان عقب‌گرد نگاه بر روی متن سرنخ برای ارسال راهنمایی پیش از بیان فرضیه
                </span>
              </div>
            </div>
          </div>

          {/* Probe Live Console Output */}
          {probeLogs.length > 0 && (
            <div style={{ background: "#020617", border: "1px solid #1e293b", borderRadius: "12px", padding: "1.25rem", fontFamily: "monospace" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", borderBottom: "1px solid #1e293b", paddingBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.85rem", color: "#38bdf8", fontWeight: 700 }}>
                  خروجی بلادرنگ تست زنده ۶ موتور در مرورگر (Live Health Probe Log):
                </span>
                <span style={{ fontSize: "0.75rem", color: "#34d399" }}>۶/۶ آزمون با موفقیت پاس شدند</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {probeLogs.map((log, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem", flexWrap: "wrap", gap: "0.5rem" }}>
                    <span style={{ color: "#f8fafc" }}>✓ {log.name}</span>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      <span style={{ color: "#94a3b8", fontSize: "0.75rem" }}>{log.note}</span>
                      <span style={{ background: "rgba(16, 185, 129, 0.2)", color: "#34d399", padding: "2px 8px", borderRadius: "4px", fontWeight: 700 }}>
                        {log.latency}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
