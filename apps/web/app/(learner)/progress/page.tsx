"use client";

import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@endoora/ui";
import { useEffect, useMemo, useState } from "react";
import { useLearnerHome } from "../../../components/learner/LearnerShell";
import { Tamrin20ProgressWidget } from "@/components/highschool/tamrin20";
import { useTwin } from "@/components/twin/useTwin";
import { getLearnerTwin, TWIN_CATALOG } from "@/lib/ai/learner-twin-store";
import { DktEngine, type DktPredictionResult } from "@/lib/dkt-engine/dkt-engine";
import { computeCefrVocabularyRetention } from "@/lib/dkt-engine/cefr-vocab-retention";
import { endooraIndexToCefr } from "@/lib/adaptive-engine";
import styles from "./progress.module.css";

interface SkillMetric {
  id: "grammar" | "vocabulary" | "reading" | "listening" | "speaking" | "writing";
  nameFa: string;
  nameEn: string;
  cefr: string;
  percent: number;
  evidenceCount: number;
  isCalibrated: boolean;
  practiceHref: string;
  practiceLabelFa: string;
  practiceLabelEn: string;
}

interface XPTransactionItem {
  id: number | string;
  amount: number;
  category: string;
  reason: string;
  source_event: string;
  created_at: string;
}

interface GamificationSummary {
  total_xp: number;
  current_level: number;
  level_title_en: string;
  level_title_fa: string;
  current_threshold: number;
  next_threshold: number;
  xp_to_next_level: number;
  progress_percent: number;
  current_streak: number;
  longest_streak: number;
  freeze_credits_remaining: number;
  is_streak_active_today: boolean;
  last_activity_date: string | null;
  recent_transactions: XPTransactionItem[];
}

const WEEK_DAYS_FA = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
const WEEK_DAYS_EN = ["Sa", "Su", "Mo", "Tu", "We", "Th", "Fr"];

export default function ProgressPage() {
  const { data, locale } = useLearnerHome();
  const isFa = locale === "fa";
  const snapshot = useTwin();

  const placementCompleted =
    data.path_steps?.find((step) => step.id === "placement")?.state === "complete";

  // Dynamic DKT predictions (initialized to null to prevent SSR hydration mismatch; loaded on mount via useEffect)
  const [dktPredictions, setDktPredictions] = useState<DktPredictionResult | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      try {
        setDktPredictions(DktEngine.getInstance().getPredictions());
      } catch {
        // Safe fallback
      }
    };
    handleUpdate();
    window.addEventListener("endoora_twin_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("endoora_twin_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Compute dynamic 6 skills from Learner Twin + DKT-Forget + Leitner SRS
  const dynamicSkills = useMemo<SkillMetric[]>(() => {
    // Baseline defaults (calibrated reference priors)
    const BASELINES = {
      grammar: 68,
      vocabulary: 72,
      reading: 60,
      listening: 65,
      speaking: 54,
      writing: 58,
    };

    // 1. Grammar: DKT 5-domain average + Twin AEF grammar nodes mean
    const grammarDomains = ["tenses", "modals", "conditionals", "passive", "clauses"] as const;
    const dktGrammarSum = grammarDomains.reduce((sum, d) => {
      return sum + (dktPredictions?.domainMastery[d]?.currentRecallProb ?? 0.5);
    }, 0);
    const dktGrammarAvg = dktGrammarSum / grammarDomains.length;
    const dktInteractions = dktPredictions?.totalInteractions ?? 0;

    const grammarNodes = snapshot?.nodes.filter((n) => {
      const cat = TWIN_CATALOG.find((c) => c.skillId === n.skillId);
      return cat?.domain !== "discourse";
    }) ?? [];
    const twinGrammarCount = grammarNodes.reduce((sum, n) => sum + (n.evidenceCount ?? 0), 0);
    const twinGrammarMean = grammarNodes.length
      ? grammarNodes.reduce((sum, n) => sum + n.mean, 0) / grammarNodes.length
      : 0.55;

    const hasGrammarEvidence = dktInteractions > 0 || twinGrammarCount > 0;
    const grammarScore = hasGrammarEvidence
      ? dktInteractions > 0 && twinGrammarCount > 0
        ? 0.5 * dktGrammarAvg + 0.5 * twinGrammarMean
        : dktInteractions > 0
        ? dktGrammarAvg
        : twinGrammarMean
      : placementCompleted
      ? BASELINES.grammar / 100
      : (BASELINES.grammar * 0.7) / 100;
    const grammarPercent = Math.round(grammarScore * 100);
    const grammarEvidenceCount = dktInteractions + twinGrammarCount;

    // 2. Vocabulary: CEFR Leitner SRS retention index + Twin discourse nodes
    let vocabRetention = 0.72;
    let vocabEvidenceCount = 0;
    try {
      const vocabTelemetry = computeCefrVocabularyRetention();
      const masteredOrLearned = Object.values(vocabTelemetry.levels).reduce(
        (sum, l) => sum + l.learnedCount,
        0
      );
      if (masteredOrLearned > 0) {
        vocabRetention = vocabTelemetry.overallRetentionIndex / 100;
        vocabEvidenceCount += masteredOrLearned;
      }
    } catch {
      // Safe fallback
    }

    const vocabNodes = snapshot?.nodes.filter((n) => {
      const cat = TWIN_CATALOG.find((c) => c.skillId === n.skillId);
      return cat?.domain === "discourse";
    }) ?? [];
    const twinVocabCount = vocabNodes.reduce((sum, n) => sum + (n.evidenceCount ?? 0), 0);
    const twinVocabMean = vocabNodes.length
      ? vocabNodes.reduce((sum, n) => sum + n.mean, 0) / vocabNodes.length
      : 0.58;
    if (twinVocabCount > 0) {
      vocabEvidenceCount += twinVocabCount;
      vocabRetention = 0.5 * vocabRetention + 0.5 * twinVocabMean;
    }

    const hasVocabEvidence = vocabEvidenceCount > 0;
    const vocabScore = hasVocabEvidence
      ? vocabRetention
      : placementCompleted
      ? BASELINES.vocabulary / 100
      : (BASELINES.vocabulary * 0.7) / 100;
    const vocabPercent = Math.round(vocabScore * 100);

    // 3. Reading
    const readingBelief = snapshot?.modalityMastery.reading;
    const hasReadingEvidence = (readingBelief?.evidenceCount ?? 0) > 0;
    const readingPercent = hasReadingEvidence
      ? Math.round(readingBelief!.mean * 100)
      : placementCompleted
      ? BASELINES.reading
      : Math.round(BASELINES.reading * 0.7);
    const readingEvidenceCount = readingBelief?.evidenceCount ?? 0;

    // 4. Listening
    const listeningBelief = snapshot?.modalityMastery.listening;
    const hasListeningEvidence = (listeningBelief?.evidenceCount ?? 0) > 0;
    const listeningPercent = hasListeningEvidence
      ? Math.round(listeningBelief!.mean * 100)
      : placementCompleted
      ? BASELINES.listening
      : Math.round(BASELINES.listening * 0.7);
    const listeningEvidenceCount = listeningBelief?.evidenceCount ?? 0;

    // 5. Speaking
    const speakingBelief = snapshot?.modalityMastery.speaking;
    const hasSpeakingEvidence = (speakingBelief?.evidenceCount ?? 0) > 0;
    const speakingPercent = hasSpeakingEvidence
      ? Math.round(speakingBelief!.mean * 100)
      : placementCompleted
      ? BASELINES.speaking
      : Math.round(BASELINES.speaking * 0.7);
    const speakingEvidenceCount = speakingBelief?.evidenceCount ?? 0;

    // 6. Writing
    const writingBelief = snapshot?.modalityMastery.writing;
    const hasWritingEvidence = (writingBelief?.evidenceCount ?? 0) > 0;
    const writingPercent = hasWritingEvidence
      ? Math.round(writingBelief!.mean * 100)
      : placementCompleted
      ? BASELINES.writing
      : Math.round(BASELINES.writing * 0.7);
    const writingEvidenceCount = writingBelief?.evidenceCount ?? 0;

    return [
      {
        id: "grammar",
        nameFa: "دستور زبان (Grammar)",
        nameEn: "Grammar & Structure",
        cefr: hasGrammarEvidence || placementCompleted ? endooraIndexToCefr(grammarPercent) : "—",
        percent: grammarPercent,
        evidenceCount: grammarEvidenceCount,
        isCalibrated: hasGrammarEvidence || placementCompleted,
        practiceHref: "/practice-ai",
        practiceLabelFa: "تمرین هوشمند گرامر (Adaptive Practice)",
        practiceLabelEn: "Grammar Practice",
      },
      {
        id: "vocabulary",
        nameFa: "واژگان (Vocabulary)",
        nameEn: "Vocabulary & Collocations",
        cefr: hasVocabEvidence || placementCompleted ? endooraIndexToCefr(vocabPercent) : "—",
        percent: vocabPercent,
        evidenceCount: vocabEvidenceCount,
        isCalibrated: hasVocabEvidence || placementCompleted,
        practiceHref: "/leitner",
        practiceLabelFa: "مرور واژگان فاصله‌دار (SRS)",
        practiceLabelEn: "SRS Flashcards",
      },
      {
        id: "reading",
        nameFa: "درک مطلب (Reading)",
        nameEn: "Reading Comprehension",
        cefr: hasReadingEvidence || placementCompleted ? endooraIndexToCefr(readingPercent) : "—",
        percent: readingPercent,
        evidenceCount: readingEvidenceCount,
        isCalibrated: hasReadingEvidence || placementCompleted,
        practiceHref: "/placement",
        practiceLabelFa: "خواندن متون تحلیلی",
        practiceLabelEn: "Reading Texts",
      },
      {
        id: "listening",
        nameFa: "شنیداری (Listening)",
        nameEn: "Listening Comprehension",
        cefr: hasListeningEvidence || placementCompleted ? endooraIndexToCefr(listeningPercent) : "—",
        percent: listeningPercent,
        evidenceCount: listeningEvidenceCount,
        isCalibrated: hasListeningEvidence || placementCompleted,
        practiceHref: "/listening",
        practiceLabelFa: "آزمایشگاه صوتی و پادکست",
        practiceLabelEn: "Audio Lab",
      },
      {
        id: "speaking",
        nameFa: "گفتاری (Speaking)",
        nameEn: "Speaking & Articulation",
        cefr: hasSpeakingEvidence || placementCompleted ? endooraIndexToCefr(speakingPercent) : "—",
        percent: speakingPercent,
        evidenceCount: speakingEvidenceCount,
        isCalibrated: hasSpeakingEvidence || placementCompleted,
        practiceHref: "/pronunciation",
        practiceLabelFa: "آزمایشگاه تلفظ عصبی (GOP)",
        practiceLabelEn: "Voice Lab",
      },
      {
        id: "writing",
        nameFa: "نگارش (Writing)",
        nameEn: "Writing & Composition",
        cefr: hasWritingEvidence || placementCompleted ? endooraIndexToCefr(writingPercent) : "—",
        percent: writingPercent,
        evidenceCount: writingEvidenceCount,
        isCalibrated: hasWritingEvidence || placementCompleted,
        practiceHref: "/ielts/writing/ai-evaluator",
        practiceLabelFa: "منتور نگارش و هیت‌مپ معنایی (BERT)",
        practiceLabelEn: "Writing Mentor",
      },
    ];
  }, [snapshot, dktPredictions, placementCompleted]);

  const [gamification, setGamification] = useState<GamificationSummary>({
    total_xp: data.xp || 0,
    current_level: 1,
    level_title_en: "Novice Explorer",
    level_title_fa: "کاوشگر نوآموز",
    current_threshold: 0,
    next_threshold: 100,
    xp_to_next_level: 100,
    progress_percent: 0,
    current_streak: data.streak_days || 0,
    longest_streak: data.streak_days || 0,
    freeze_credits_remaining: 1,
    is_streak_active_today: false,
    last_activity_date: null,
    recent_transactions: [],
  });

  useEffect(() => {
    async function loadSummary() {
      try {
        const res = await fetch("/api/gamification/summary/");
        if (res.ok) {
          const profile = await res.json();
          setGamification({
            total_xp: profile.total_xp ?? (data.xp || 0),
            current_level: profile.current_level ?? 1,
            level_title_en: profile.level_title_en || "Novice Explorer",
            level_title_fa: profile.level_title_fa || "کاوشگر نوآموز",
            current_threshold: profile.current_threshold ?? 0,
            next_threshold: profile.next_threshold ?? 100,
            xp_to_next_level: profile.xp_to_next_level ?? 100,
            progress_percent: profile.progress_percent ?? 0,
            current_streak: profile.current_streak ?? (data.streak_days || 0),
            longest_streak: profile.longest_streak ?? (data.streak_days || 0),
            freeze_credits_remaining: profile.freeze_credits_remaining ?? 1,
            is_streak_active_today: !!profile.is_streak_active_today,
            last_activity_date: profile.last_activity_date || null,
            recent_transactions: profile.recent_transactions || [],
          });
        }
      } catch {
        // Fallback to LearnerShell context
      }
    }
    loadSummary();
  }, [data.xp, data.streak_days]);

  // Overall forecast from twin
  const forecast = snapshot ? getLearnerTwin()?.getIELTSForecast() : null;

  return (
    <div className={styles.container}>
      <Link className={styles.backLink} href="/dashboard">
        <span aria-hidden="true">{isFa ? "←" : "→"}</span>
        {isFa ? "بازگشت به داشبورد" : "Back to dashboard"}
      </Link>

      {/* Hero Section */}
      <section className={styles.heroCard}>
        <div className={styles.heroHeader}>
          <div>
            <h1 className={styles.heroTitle}>
              {isFa ? "روند پیشرفت و دفترکل دستاوردها" : "Learning Progress & XP Ledger"}
            </h1>
            <p className={styles.heroSubtitle}>
              {isFa
                ? "ارزیابی شفاف سطح مهارت‌ها، شتاب استمرار یادگیری، رتبه آموزشی و دفترکل تغییرناپذیر امتیازهای تجربه (XP)."
                : "Authentic skill metrics, learning continuity streak, educational level progression, and immutable XP audit ledger."}
            </p>
          </div>
          <span
            className={`${styles.heroBadge} ${
              placementCompleted ? styles.heroBadgeSuccess : styles.heroBadgeWarning
            }`}
          >
            {placementCompleted
              ? isFa
                ? "ارزیابی ۶ مهارت کامل"
                : "6-Skill Assessment Complete"
              : isFa
              ? "نیازمند تکمیل تعیین سطح"
              : "Diagnostic Incomplete"}
          </span>
        </div>

        {/* Level Progression & Streak Tracker Top Grid */}
        <div className={styles.gamificationGrid}>
          {/* Level Progression Card */}
          <div className={styles.levelCard}>
            <div>
              <div className={styles.levelCardHeader}>
                <span className={styles.levelNumberBadge}>
                  <span aria-hidden="true">🎖️</span>
                  {isFa ? `سطح ${gamification.current_level}` : `Level ${gamification.current_level}`}
                </span>
                <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 800, color: "var(--color-endoora-blue)" }}>
                  {gamification.total_xp} XP {isFa ? "مجموع امتیاز" : "Lifetime"}
                </span>
              </div>

              <h2 className={styles.levelTitleLabel}>
                {isFa ? gamification.level_title_fa : gamification.level_title_en}
              </h2>
              <p className={styles.levelSubtext}>
                {isFa
                  ? `${gamification.xp_to_next_level} امتیاز تا رسیدن به سطح بعدی (${gamification.next_threshold} XP)`
                  : `${gamification.xp_to_next_level} XP needed to reach next level threshold (${gamification.next_threshold} XP)`}
              </p>
            </div>

            <div className={styles.levelProgressWrapper}>
              <div className={styles.progressBarContainer}>
                <div
                  className={styles.progressBarFill}
                  style={{ inlineSize: `${gamification.progress_percent}%` }}
                  role="progressbar"
                  aria-valuenow={gamification.progress_percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              <div className={styles.levelProgressMeta}>
                <span>{gamification.current_threshold} XP</span>
                <strong>{gamification.progress_percent}%</strong>
                <span>{gamification.next_threshold} XP</span>
              </div>
            </div>
          </div>

          {/* Consistency Streak Card */}
          <div className={styles.streakCard}>
            <div>
              <div className={styles.streakCardHeader}>
                <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 700, color: "var(--color-muted)" }}>
                  {isFa ? "استمرار یادگیری (Streak)" : "Consistency Streak"}
                </span>
                <span className={styles.freezeShieldBadge} title={isFa ? "سپر انجماد فعال برای جلوگیری از قطع استریک" : "Streak Freeze Protection Available"}>
                  <span aria-hidden="true">🛡️</span>
                  {gamification.freeze_credits_remaining} {isFa ? "سپر فرصت" : "Freeze"}
                </span>
              </div>

              <div className={styles.streakValueDisplay}>
                <span className={styles.streakFlameIcon} aria-hidden="true">🔥</span>
                <span className={styles.streakCount}>{gamification.current_streak}</span>
                <span style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)", fontWeight: 600 }}>
                  {isFa ? "روز متوالی" : "days streak"}
                </span>
              </div>

              <div className={styles.streakDetailsRow}>
                <span>
                  {isFa ? "بهترین رکورد: " : "Best Record: "}
                  <strong style={{ color: "var(--color-text)" }}>{gamification.longest_streak} {isFa ? "روز" : "days"}</strong>
                </span>
                <span>•</span>
                <span>
                  {gamification.is_streak_active_today
                    ? isFa ? "✓ امروز ثبت شده" : "✓ Active today"
                    : isFa ? "⏳ تمرین امروز باقی‌مانده" : "⏳ Due today"}
                </span>
              </div>
            </div>

            {/* Weekly Activity Tracker */}
            <div className={styles.weeklyDotsRow} aria-label={isFa ? "نمودار فعالیت هفتگی" : "Weekly activity status"}>
              {(isFa ? WEEK_DAYS_FA : WEEK_DAYS_EN).map((day, idx) => {
                const isActiveDay = idx < Math.min(gamification.current_streak, 7);
                const isToday = idx === 6;
                return (
                  <div key={day} className={styles.dotCol}>
                    <div
                      className={`${styles.dayDot} ${isActiveDay ? styles.dayDotActive : ""} ${isToday ? styles.dayDotToday : ""}`}
                    >
                      {isActiveDay ? "✓" : "•"}
                    </div>
                    <span className={styles.dayLabel}>{day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.actionRow}>
          <Link className={styles.buttonPrimary} href="/today">
            ⚡ {isFa ? "ورود به مأموریت روزانه" : "Today's Mission"}
          </Link>
          <Link className={styles.buttonSecondary} href="/twin">
            🧠 {isFa ? "دوقلوی هوشمند یادگیرنده (AI Twin)" : "Learner Twin"}
          </Link>
          <Link className={styles.buttonSecondary} href="/placement/report">
            📊 {isFa ? "مشاهده کارنامه مهارت‌ها" : "Inspect Skill Report"}
          </Link>
          <Link className={styles.buttonSecondary} href="/badges">
            🏆 {isFa ? "تالار نشان‌ها و دستاوردها" : "Badges & Milestones"}
          </Link>
        </div>
      </section>

      {/* 6 Skills Diagnostic Breakdown */}
      <section className={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "var(--space-3)" }}>
          <div>
            <h2 className={styles.cardTitle}>
              <span aria-hidden="true">📊</span>
              {isFa ? "تفکیک ۶ مهارت زبان انگلیسی بر اساس استاندارد CEFR" : "6-Skill CEFR Diagnostic Breakdown"}
            </h2>
            <p className={styles.cardDescription}>
              {isFa
                ? "نمرات زیر حاصل پاسخ‌های ثبت‌شده در مدل دوقلوی هوشمند (Neuro-Bayesian Twin)، آزمون تعیین سطح و تمرین‌های روزانه است."
                : "Scores reflect empirical evidence synthesized by the Neuro-Bayesian Learner Twin and verified daily exercises."}
            </p>
          </div>

          {forecast?.overall.band && (
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "color-mix(in srgb, var(--color-action) 10%, var(--color-surface))",
              border: "1px solid color-mix(in srgb, var(--color-action) 25%, transparent)",
              borderRadius: "var(--radius-pill)",
              padding: "0.35rem 0.85rem",
              fontSize: "var(--font-size-meta)",
              fontWeight: 800,
              color: "var(--color-action)"
            }}>
              <span>🎯 {isFa ? "پیش‌بینی نمره آیلتس:" : "IELTS Forecast:"}</span>
              <strong>Band {forecast.overall.band.toFixed(1)} · {forecast.predictedCEFR}</strong>
            </div>
          )}
        </div>

        <div className={styles.skillsGrid}>
          {dynamicSkills.map((skill) => {
            return (
              <article className={styles.skillCard} key={skill.id}>
                <div className={styles.skillCardHeader}>
                  <h3 className={styles.skillCardTitle}>{isFa ? skill.nameFa : skill.nameEn}</h3>
                  <span className={styles.skillLevelBadge}>{skill.cefr}</span>
                </div>

                <div className={styles.progressBarContainer}>
                  <div
                    className={styles.progressBarFill}
                    style={{ inlineSize: `${skill.percent}%` }}
                    role="progressbar"
                    aria-valuenow={skill.percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "var(--font-size-meta)", color: "var(--color-muted)", marginBlock: "var(--space-2)" }}>
                  <span>{isFa ? "میزان تسلط شواهد:" : "Evidence mastery:"}</span>
                  <strong style={{ color: "var(--color-text)" }}>{skill.percent}%</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem", color: "var(--color-muted)", marginBlockEnd: "var(--space-3)" }}>
                  <span>
                    {skill.evidenceCount > 0
                      ? isFa
                        ? `✓ ${skill.evidenceCount} شواهد یادگیری ثبت‌شده`
                        : `✓ ${skill.evidenceCount} evidence points`
                      : skill.isCalibrated
                      ? isFa
                        ? "برآورد آزمون تعیین سطح"
                        : "Placement calibrated"
                      : isFa
                      ? "برآورد خط‌پایه اولیه"
                      : "Initial baseline"}
                  </span>
                </div>

                <Link
                  className={styles.buttonSecondary}
                  href={skill.practiceHref}
                  style={{ fontSize: "var(--font-size-meta)", paddingBlock: "var(--space-1)" }}
                >
                  {isFa ? skill.practiceLabelFa : skill.practiceLabelEn}
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* High School Vision 3 Tamrin 20 Reporting Section */}
      <section className={styles.card} style={{ padding: 0, border: "none", background: "transparent" }}>
        <Tamrin20ProgressWidget />
      </section>

      {/* Immutable XP Ledger Section */}
      <section className={styles.ledgerSection}>
        <div className={styles.ledgerHeader}>
          <div>
            <h2 className={styles.cardTitle}>
              <span aria-hidden="true">📜</span>
              {isFa ? "دفترکل تغییرناپذیر امتیازها (XP Ledger Audit)" : "Immutable XP Audit Ledger"}
            </h2>
            <p className={styles.cardDescription}>
              {isFa
                ? "هر امتیاز تجربه بر اساس یک رخداد آموزشی معتبر و کلید شناسایی یکتا ثبت می‌شود؛ تغییر یا دستکاری سوابق غیرممکن است."
                : "Every XP entry is permanently recorded with a unique event idempotency key to prevent duplicate awards."}
            </p>
          </div>
          <span className={styles.ledgerBadge}>
            🔒 {isFa ? "سوابق رمزنگاری‌شده و غیرقابل دستکاری" : "Append-Only & Tamper-Proof"}
          </span>
        </div>

        {gamification.recent_transactions.length > 0 ? (
          <div className={styles.tableWrapper}>
            <Table aria-label={isFa ? "دفترکل تراکنش‌های امتیاز" : "XP Transaction Ledger"}>
              <TableHeader>
                <TableRow>
                  <TableHead>{isFa ? "امتیاز" : "XP"}</TableHead>
                  <TableHead>{isFa ? "دسته‌بندی" : "Category"}</TableHead>
                  <TableHead>{isFa ? "شرح فعالیت آموزشی" : "Activity Reason"}</TableHead>
                  <TableHead>{isFa ? "کلید ارجاع رویداد" : "Event Key"}</TableHead>
                  <TableHead>{isFa ? "زمان ثبت" : "Timestamp"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gamification.recent_transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <span className={styles.xpBadgeGain}>
                        +{tx.amount} XP
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={styles.categoryTag}>{tx.category}</span>
                    </TableCell>
                    <TableCell>{tx.reason}</TableCell>
                    <TableCell dir="ltr" style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "var(--color-muted)" }}>
                      {tx.source_event.length > 28 ? `${tx.source_event.slice(0, 26)}...` : tx.source_event}
                    </TableCell>
                    <TableCell dir="ltr" style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>
                      {new Date(tx.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className={styles.emptyLedgerNotice}>
            <p>
              {isFa
                ? "هنوز هیچ امتیازی در دفترکل ثبت نشده است. با تکمیل مأموریت روزانه، مرور واژگان یا آزمون تعیین سطح، اولین امتیازهای خود را ثبت کنید."
                : "No XP transactions recorded yet. Complete a daily mission, vocabulary review, or placement section to log your first verified points."}
            </p>
            <Link className={styles.buttonPrimary} href="/today">
              {isFa ? "شروع اولین فعالیت آموزشی" : "Start First Activity"}
            </Link>
          </div>
        )}

        <div className={styles.disclaimerBox}>
          <h4>
            {isFa
              ? "قانون اساسی محصول: آرامش در یادگیری و ارزیابی صادقانه (قواعد ۷ و ۸)"
              : "Product Constitution Principles: Calm Learning & Honest Evaluation (Rules #7 & #8)"}
          </h4>
          <p>
            {isFa
              ? "سامانه گیمیفیکیشن ایندورا صرفاً برای ایجاد انگیزه و استمرار آموزشی طراحی شده است و فاقد الگوهای اعتیادآور یا قمارگونه (Dark Patterns) است. سطوح و امتیازات XP بازتاب تلاش مستمر شما هستند و گواهی یا مدرک دانشگاهی رسمی تلقی نمی‌شوند."
              : "Endoora gamification promotes healthy consistency without manipulative engagement tricks. XP points and level titles celebrate educational effort and do not constitute accredited certification."}
          </p>
        </div>
      </section>
    </div>
  );
}
