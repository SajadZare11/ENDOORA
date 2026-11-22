"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./teacher-cognitive-ai.module.css";

interface Props {
  isFa?: boolean;
}

type TabType = "causal" | "dkt_memory" | "traps_proctoring";

export function TeacherCognitiveAiPanel({ isFa = true }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("causal");
  const [assignedInterventions, setAssignedInterventions] = useState<Record<string, boolean>>({});

  const handleAssignIntervention = (conceptId: string) => {
    setAssignedInterventions((prev) => ({ ...prev, [conceptId]: true }));
  };

  return (
    <section className={styles.container} aria-label="مرکز هوش شناختی و تحلیل علّی معلم">
      {/* Header */}
      <div className={styles.headerRow}>
        <div className={styles.headerTitleBox}>
          <h2 className={styles.headerTitle}>
            <span>🧠</span>
            <span>
              {isFa
                ? "مرکز پایش شناختی و تحلیل علّی کلاس (Cognitive AI Diagnostics Hub)"
                : "Cognitive AI Diagnostics & Causal Analytics Hub"}
            </span>
          </h2>
          <p className={styles.headerSubtitle}>
            {isFa
              ? "مبتنی بر ۶ موتور یکپارچه Edge AI: تفکیک علّی بی‌دقتی از ضعف پیش‌نیازها، زوال حافظه و سلامت آزمون‌ها"
              : "Powered by 6 integrated Client-Side AI engines: Causal prerequisite diagnosis, memory decay radar, and zero-upload proctoring."}
          </p>
        </div>

        <div className={styles.engineBadgesCluster}>
          <span className={styles.engineBadge}>
            <span>⚡</span>
            <span>NeuralCDM + GAT</span>
          </span>
          <span className={styles.engineBadge}>
            <span>📉</span>
            <span>DKT-Forget GRU</span>
          </span>
          <span className={styles.engineBadge}>
            <span>🎯</span>
            <span>LinUCB Bandit</span>
          </span>
          <span className={styles.engineBadge}>
            <span>👁️</span>
            <span>BiLSTM Proctoring</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsBar}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "causal" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("causal")}
        >
          <span>🔍</span>
          <span>{isFa ? "تحلیل علّی گرامر و پیش‌نیازها (NeuralCDM)" : "Causal Prerequisite Analysis"}</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "dkt_memory" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("dkt_memory")}
        >
          <span>📉</span>
          <span>{isFa ? "رادار ماندگاری حافظه و زوال ۷ روزه (DKT-Forget)" : "Memory Retention & Decay Radar"}</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "traps_proctoring" ? styles.tabBtnActive : ""}`}
          onClick={() => setActiveTab("traps_proctoring")}
        >
          <span>🛡️</span>
          <span>{isFa ? "تله‌های زبان فارسی و سلامت آزمون (Bandit & Proctoring)" : "L1 Traps & Integrity"}</span>
        </button>
      </div>

      {/* TAB 1: CAUSAL PREREQUISITE DIAGNOSTICS (NEURALCDM + GAT) */}
      {activeTab === "causal" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className={styles.kpiMiniGrid}>
            <div className={styles.kpiMiniCard}>
              <span className={styles.kpiMiniLabel}>{isFa ? "نرخ لغزش تصادفی (Random Slip)" : "Random Slip Ratio"}</span>
              <span className={styles.kpiMiniVal} style={{ color: "#34d399" }}>٪۶۴</span>
              <span className={styles.kpiMiniSub}>
                {isFa ? "خطای بی‌دقتی بدون نقص علمی (عدم نیاز به آموزش مجدد)" : "Careless slips; learner already masters prerequisite"}
              </span>
            </div>

            <div className={styles.kpiMiniCard}>
              <span className={styles.kpiMiniLabel}>{isFa ? "نرخ فقدان پیش‌نیاز (Prerequisite Deficit)" : "Prerequisite Deficit"}</span>
              <span className={styles.kpiMiniVal} style={{ color: "#f87171" }}>٪۳۶</span>
              <span className={styles.kpiMiniSub}>
                {isFa ? "خطای ساختاری ناشی از نقص در دروس سطوح پایین‌تر" : "Foundational deficits rooted in lower CEFR levels"}
              </span>
            </div>

            <div className={styles.kpiMiniCard}>
              <span className={styles.kpiMiniLabel}>{isFa ? "گره‌های پیش‌نیاز بحرانی" : "Root Bottlenecks"}</span>
              <span className={styles.kpiMiniVal} style={{ color: "#fbbf24" }}>۳ مفهوم</span>
              <span className={styles.kpiMiniSub}>
                {isFa ? "عامل اصلی ۶۸٪ خطاهای ترکیبی در آزمون‌های اخیر" : "Accounting for 68% of compound test mistakes"}
              </span>
            </div>
          </div>

          <h3 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0.5rem 0 0.25rem 0", color: "#f1f5f9" }}>
            {isFa ? "گلوگاه‌های ریشه‌ای یادگیری در گراف جهت‌دار پیش‌نیازها (AEF Prerequisite DAG):" : "Top Root Prerequisite Bottlenecks:"}
          </h3>

          <div className={styles.bottlenecksList}>
            {/* Bottleneck 1 */}
            <div className={styles.bottleneckCard}>
              <div className={styles.bottleneckMeta}>
                <div className={styles.bottleneckTitleRow}>
                  <span className={styles.cefrPill}>B1</span>
                  <span className={styles.bottleneckTitle}>
                    {isFa ? "جملات شرطی نوع دوم (فرضیات و سناریوهای ناممکن)" : "Second Conditional (b1-01)"}
                  </span>
                </div>
                <p className={styles.bottleneckDesc}>
                  {isFa
                    ? "علت ریشه‌ای شکست ۸ دانش‌آموز در یادگیری ساختارهای وارونگی (Inversion) و شرطی‌های ترکیبی C1."
                    : "Root cause for 8 learners failing C1 Inversion & Mixed Conditionals."}
                </p>
                <span className={styles.causalPath}>
                  [b1-01 (B1)] → [b2-01 (B2)] → [c1-01 (C1)] → [c1-04 (C1 Inversion)]
                </span>
              </div>

              <div>
                {assignedInterventions["b1-01"] ? (
                  <span style={{ fontSize: "0.8rem", color: "#34d399", fontWeight: 700 }}>
                    ✓ {isFa ? "مداخله آموزشی ثبت شد" : "Intervention Assigned"}
                  </span>
                ) : (
                  <button
                    type="button"
                    className={styles.btnIntervention}
                    onClick={() => handleAssignIntervention("b1-01")}
                  >
                    <span>⚡</span>
                    <span>{isFa ? "تخصیص تمرین ترمیمی پیش‌نیاز" : "Assign Remedial Drill"}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Bottleneck 2 */}
            <div className={styles.bottleneckCard}>
              <div className={styles.bottleneckMeta}>
                <div className={styles.bottleneckTitleRow}>
                  <span className={styles.cefrPill}>A2</span>
                  <span className={styles.bottleneckTitle}>
                    {isFa ? "تمایز گذشته ساده و حال کامل (Present Perfect vs Past Simple)" : "Present Perfect vs Past Simple (a2-04)"}
                  </span>
                </div>
                <p className={styles.bottleneckDesc}>
                  {isFa
                    ? "عامل خطای ۱۱ دانش‌آموز در روایت‌های زمان گذشته رایتینگ تسک ۲ و اسپیکینگ پارت ۲ آیلتس."
                    : "Root cause for 11 learners struggling in IELTS Writing Task 2 & Speaking Part 2 narration."}
                </p>
                <span className={styles.causalPath}>
                  [a2-04 (A2)] → [b1-02 (B1 Tenses)] → [b2-03 (B2 Narrative)]
                </span>
              </div>

              <div>
                {assignedInterventions["a2-04"] ? (
                  <span style={{ fontSize: "0.8rem", color: "#34d399", fontWeight: 700 }}>
                    ✓ {isFa ? "مداخله آموزشی ثبت شد" : "Intervention Assigned"}
                  </span>
                ) : (
                  <button
                    type="button"
                    className={styles.btnIntervention}
                    onClick={() => handleAssignIntervention("a2-04")}
                  >
                    <span>⚡</span>
                    <span>{isFa ? "تخصیص تمرین ترمیمی پیش‌نیاز" : "Assign Remedial Drill"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DKT-FORGET MEMORY RETENTION RADAR */}
      {activeTab === "dkt_memory" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className={styles.kpiMiniGrid}>
            <div className={styles.kpiMiniCard}>
              <span className={styles.kpiMiniLabel}>{isFa ? "میانگین ماندگاری حافظه کلاس" : "Cohort Retention Index"}</span>
              <span className={styles.kpiMiniVal} style={{ color: "#38bdf8" }}>٪۸۱.۵</span>
              <span className={styles.kpiMiniSub}>
                {isFa ? "پیش‌بینی شبکه عصبی GRU با لحاظ منحنی فراموشی ابینگهاوس" : "GRU dynamic state considering retention decay"}
              </span>
            </div>

            <div className={styles.kpiMiniCard}>
              <span className={styles.kpiMiniLabel}>{isFa ? "مباحث در آستانه فراموشی (۷ روز آینده)" : "At-Risk Decay (Next 7 Days)"}</span>
              <span className={styles.kpiMiniVal} style={{ color: "#f59e0b" }}>۴ مبحث</span>
              <span className={styles.kpiMiniSub}>
                {isFa ? "احتمال یادآوری به زیر ۵۰٪ سقوط می‌کند مگر اینکه مرور شوند" : "Predicted recall < 50% without active spaced retrieval"}
              </span>
            </div>

            <div className={styles.kpiMiniCard}>
              <span className={styles.kpiMiniLabel}>{isFa ? "مفاهیم در ناحیه تقریبی رشد (ZPD)" : "Active ZPD Concepts"}</span>
              <span className={styles.kpiMiniVal} style={{ color: "#a855f7" }}>۶ مفهوم</span>
              <span className={styles.kpiMiniSub}>
                {isFa ? "زمان طلایی برای یادگیری و تثبیت در جلسه بعدی کلاس" : "Prime window for classroom induction and drills"}
              </span>
            </div>
          </div>

          <div style={{ background: "rgba(15, 23, 42, 0.5)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px", padding: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#f8fafc" }}>
                {isFa ? "مباحث اولویت‌دار جهت مرور فعال در جلسه بعدی کلاس (Spaced Retrieval Queue):" : "High-Priority Classroom Retrieval Queue:"}
              </span>
              <Link href="/teacher/assignments/new" className="teacher-button teacher-button--primary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}>
                {isFa ? "ایجاد کوییز بازیابی فعال کلاسی" : "Create Spaced Retrieval Quiz"}
              </Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.6rem" }}>
              <div style={{ background: "rgba(30, 41, 59, 0.6)", padding: "0.75rem", borderRadius: "8px", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fca5a5" }}>Phrasal Verbs with &apos;Get&apos; & &apos;Take&apos;</div>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{isFa ? "احتمال یادآوری فعلی: ۴۸٪ | سقوط پیش‌بینی: ۳۲٪" : "Current: 48% | 7-day Decay: 32%"}</div>
              </div>
              <div style={{ background: "rgba(30, 41, 59, 0.6)", padding: "0.75rem", borderRadius: "8px", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fde047" }}>Passive with Reporting Verbs</div>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{isFa ? "احتمال یادآوری فعلی: ۵۲٪ | سقوط پیش‌بینی: ۴۰٪" : "Current: 52% | 7-day Decay: 40%"}</div>
              </div>
              <div style={{ background: "rgba(30, 41, 59, 0.6)", padding: "0.75rem", borderRadius: "8px", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fde047" }}>Mixed Conditionals</div>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{isFa ? "احتمال یادآوری فعلی: ۵۵٪ | سقوط پیش‌بینی: ۴۲٪" : "Current: 55% | 7-day Decay: 42%"}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TRAPS & PROCTORING (LINUCB & BILSTM) */}
      {activeTab === "traps_proctoring" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0 0 0.5rem 0", color: "#f1f5f9" }}>
              {isFa ? "تحلیل هوشمند تله‌های گزینه‌ای (Siamese + LinUCB Bandit):" : "Distractor Trap Effectiveness Distribution:"}
            </h3>
            <p style={{ fontSize: "0.8rem", color: "#94a3b8", margin: "0 0 0.75rem 0" }}>
              {isFa
                ? "توزیع خطای گزینه‌های انحرافی انتخابی دانش‌آموزان در کوییزها و تمرینات تطبیقی:"
                : "Frequency of learners being trapped by different distractor dimensions:"}
            </p>

            <div className={styles.trapGrid}>
              <div className={styles.trapCard}>
                <div className={styles.trapHeader}>
                  <span className={styles.trapTitle}>{isFa ? "تداخل زبان فارسی (L1 Transfer)" : "L1 Persian Transfer"}</span>
                  <span className={styles.trapPercent}>٪۴۴</span>
                </div>
                <div className={styles.trapBarBg}>
                  <div className={styles.trapBarFill} style={{ width: "44%" }}></div>
                </div>
                <span className={styles.trapSub}>
                  {isFa ? "بیشترین تله اثرگذار: ترجمه تحت‌اللفظی و حذف حروف اضافه ساختاری" : "Literal Persian syntax & omitted prepositions"}
                </span>
              </div>

              <div className={styles.trapCard}>
                <div className={styles.trapHeader}>
                  <span className={styles.trapTitle}>{isFa ? "تله‌های صرفی/ساختاری" : "Morphological Traps"}</span>
                  <span className={styles.trapPercent} style={{ color: "#fb923c" }}>٪۲۲</span>
                </div>
                <div className={styles.trapBarBg}>
                  <div className={styles.trapBarFill} style={{ width: "22%", background: "#fb923c" }}></div>
                </div>
                <span className={styles.trapSub}>
                  {isFa ? "اشتباه در زمان افعال، پسوندها و فرم‌های بی‌قاعده" : "Irregular inflection and suffix errors"}
                </span>
              </div>

              <div className={styles.trapCard}>
                <div className={styles.trapHeader}>
                  <span className={styles.trapTitle}>{isFa ? "هم‌معنی‌های نزدیک" : "Near-Synonym Traps"}</span>
                  <span className={styles.trapPercent} style={{ color: "#38bdf8" }}>٪۲۱</span>
                </div>
                <div className={styles.trapBarBg}>
                  <div className={styles.trapBarFill} style={{ width: "21%", background: "#38bdf8" }}></div>
                </div>
                <span className={styles.trapSub}>
                  {isFa ? "انتخاب واژه با معنای مشابه بدون رعایت کالوکیشن صحیح" : "Collocation mismatch among close synonyms"}
                </span>
              </div>

              <div className={styles.trapCard}>
                <div className={styles.trapHeader}>
                  <span className={styles.trapTitle}>{isFa ? "تله‌های آوایی/املایی" : "Phonetic / Orthographic"}</span>
                  <span className={styles.trapPercent} style={{ color: "#a855f7" }}>٪۱۳</span>
                </div>
                <div className={styles.trapBarBg}>
                  <div className={styles.trapBarFill} style={{ width: "13%", background: "#a855f7" }}></div>
                </div>
                <span className={styles.trapSub}>
                  {isFa ? "شباهت نوشتاری و خطای تلفظی حروف صامت" : "Orthographic homophones & consonant confusion"}
                </span>
              </div>
            </div>
          </div>

          {/* Edge Proctoring & Cognitive Load Summary */}
          <div style={{ background: "rgba(15, 23, 42, 0.5)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "12px", padding: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#34d399" }}>
                🛡️ {isFa ? "پایش هوشمند سلامت آزمون‌های کلاسی (MobileNetV3 Edge Proctoring):" : "Edge Proctoring & Cognitive Integrity:"}
              </span>
              <span style={{ fontSize: "0.8rem", color: "#6ee7b7", background: "rgba(16, 185, 129, 0.15)", padding: "2px 8px", borderRadius: "6px" }}>
                {isFa ? "شاخص اصالت میانگین کلاس: ۹۲٪" : "Avg Class Integrity: 92%"}
              </span>
            </div>
            <p style={{ fontSize: "0.8rem", color: "#cbd5e1", margin: 0, lineHeight: 1.6 }}>
              {isFa
                ? "بر اساس تحلیل بیومتریک حرکات نگاه و ماوس (۱۰ FPS)، ۹۶٪ آزمون‌های کلاسی در وضعیت کاملاً استاندارد و با کمترین انحراف نگاه برگزار شده‌اند. میانگین زمان مکث شناختی در سؤالات دشوار ۲.۴ ثانیه برآورد شده است."
                : "Based on 10 FPS gaze & pointer dynamics, 96% of cohort sessions exhibit valid focused attention. Average hesitation dwell time is 2.4s."}
            </p>
          </div>
        </div>
      )}

      {/* Privacy Guarantee Footer */}
      <div className={styles.privacyFooter}>
        <span>🔒</span>
        <span>
          {isFa
            ? "تضمین حریم خصوصی و امنیت داده: تمامی فرآیندهای استنتاج شبکه عصبی و پردازش ویدیو به‌صورت محلی (Client-Side Edge AI) در مرورگر دانش‌آموز اجرا می‌شوند و هیچ تصویر یا فایل صوتی خامی در سرور ذخیره نمی‌شود."
            : "Zero Raw Video Upload Guarantee: All neural inference runs entirely client-side on the learner's device. No raw video or audio is ever uploaded to central servers."}
        </span>
      </div>
    </section>
  );
}
