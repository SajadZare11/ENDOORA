"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CURRICULUM_UNITS,
  CEFRTier,
  PathUnit,
  PathNode,
  PathNodeStatus,
  LearnerPathProgress,
  getInitialProgress,
  getNodeStatus,
  completePathNode,
  passBossGate,
} from "../../../lib/learning-path-storage";
import { PathHeroBanner } from "./PathHeroBanner";
import { BossGateModal } from "./BossGateModal";
import { LessonPreviewModal } from "./LessonPreviewModal";
import styles from "./learning-path.module.css";

const TIERS: { id: CEFRTier; labelFa: string; descFa: string }[] = [
  { id: "A1", labelFa: "سطح A1 مقدماتی", descFa: "مکالمه پایه و نیازهای اولیه" },
  { id: "A2", labelFa: "سطح A2 پیش‌متوسطه", descFa: "توصیف گذشته، سفر و سلامت" },
  { id: "B1", labelFa: "سطح B1 متوسطه", descFa: "استقلال در مکالمه و آینده" },
  { id: "B2", labelFa: "سطح B2 فوق‌متوسط", descFa: "استدلال، مباحثه و زبان رسمی" },
  { id: "C1", labelFa: "سطح C1 پیشرفته و آیلتس", descFa: "تسلط آکادمیک و نمره ۷.۵+" },
];

export const VisualSkillTree: React.FC = () => {
  const router = useRouter();
  const [progress, setProgress] = useState<LearnerPathProgress>({
    completedNodeIds: [],
    unlockedUnitIds: ["unit-1"],
    nodeStars: {},
    totalXp: 0,
    currentStreak: 1,
    lastActiveDate: new Date().toISOString(),
  });
  const [activeTier, setActiveTier] = useState<CEFRTier>("A1");

  // Boss modal state
  const [activeBossModalUnit, setActiveBossModalUnit] = useState<{
    unit: PathUnit;
    isTestOut: boolean;
  } | null>(null);

  // Lesson preview modal state
  const [previewModal, setPreviewModal] = useState<{
    node: PathNode;
    unit: PathUnit;
    status: PathNodeStatus;
    starsCount: number;
  } | null>(null);

  const refreshProgress = () => {
    const loaded = getInitialProgress();
    setProgress(loaded);

    // Auto-select tier matching learner's highest unlocked unit
    let highestTier: CEFRTier = "A1";
    for (const u of CURRICULUM_UNITS) {
      if (loaded.unlockedUnitIds.includes(u.id)) {
        highestTier = u.tier;
      }
    }
    setActiveTier(highestTier);
  };

  useEffect(() => {
    refreshProgress();
  }, []);

  // Compute live completion stats for each tier
  const tierStats = useMemo(() => {
    const stats: Record<
      CEFRTier,
      { totalNodes: number; completedNodes: number; percent: number; isUnlocked: boolean }
    > = {
      A1: { totalNodes: 0, completedNodes: 0, percent: 0, isUnlocked: false },
      A2: { totalNodes: 0, completedNodes: 0, percent: 0, isUnlocked: false },
      B1: { totalNodes: 0, completedNodes: 0, percent: 0, isUnlocked: false },
      B2: { totalNodes: 0, completedNodes: 0, percent: 0, isUnlocked: false },
      C1: { totalNodes: 0, completedNodes: 0, percent: 0, isUnlocked: false },
    };

    for (const unit of CURRICULUM_UNITS) {
      const t = unit.tier;
      const isUnitUnlocked = progress.unlockedUnitIds.includes(unit.id);
      if (isUnitUnlocked) stats[t].isUnlocked = true;

      unit.nodes.forEach((n) => {
        stats[t].totalNodes++;
        if (progress.completedNodeIds.includes(n.id)) {
          stats[t].completedNodes++;
        }
      });
    }

    for (const t of Object.keys(stats) as CEFRTier[]) {
      stats[t].percent =
        stats[t].totalNodes > 0
          ? Math.round((stats[t].completedNodes / stats[t].totalNodes) * 100)
          : 0;
    }

    return stats;
  }, [progress]);

  const handleNodeClick = (node: PathNode, unit: PathUnit) => {
    const status = getNodeStatus(node.id, unit.id, progress);
    const starsCount = progress.nodeStars[node.id] || 0;
    setPreviewModal({ node, unit, status, starsCount });
  };

  const handleStartFromPreview = () => {
    if (!previewModal) return;
    const { node, unit } = previewModal;
    setPreviewModal(null);

    if (node.type === "boss") {
      setActiveBossModalUnit({ unit, isTestOut: false });
    } else {
      completePathNode(node.id, 3);
      refreshProgress();
      router.push(node.deepLinkHref);
    }
  };

  const handleTestOutClick = (unit: PathUnit) => {
    setActiveBossModalUnit({ unit, isTestOut: true });
  };

  const handleBossPass = (scorePercent: number) => {
    if (!activeBossModalUnit) return;
    passBossGate(activeBossModalUnit.unit.id, scorePercent);
    refreshProgress();
  };

  const filteredUnits = CURRICULUM_UNITS.filter((u) => u.tier === activeTier);

  // Serpentine offset pattern for 5 nodes: Center -> Right -> Center -> Left -> Center
  const offsetClasses = [
    styles.nodePosCenter,
    styles.nodePosRight,
    styles.nodePosCenter,
    styles.nodePosLeft,
    styles.nodePosCenter,
  ];

  return (
    <div className={styles.pathContainer}>
      {/* Master Command Center Hero Banner */}
      <PathHeroBanner progress={progress} />

      {/* Tier Switcher Navigation with Live Progress */}
      <div className={styles.tierNavTrack} role="tablist" aria-label="انتخاب سطح آموزشی">
        {TIERS.map((tier) => {
          const isActive = activeTier === tier.id;
          const stat = tierStats[tier.id];

          return (
            <button
              key={tier.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.tierTabBtn} ${isActive ? styles.tierTabActive : ""}`}
              onClick={() => setActiveTier(tier.id)}
            >
              <span>{stat.isUnlocked ? "🔓" : "🔒"}</span>
              <span>{tier.labelFa}</span>
              <span className={styles.tierTabProgressBadge}>
                {stat.percent === 100 ? "✅ ۱۰۰٪" : `${stat.percent}٪`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Tier Units */}
      {filteredUnits.map((unit) => {
        const isUnitUnlocked = progress.unlockedUnitIds.includes(unit.id);
        const unitCompletedNodes = unit.nodes.filter((n) =>
          progress.completedNodeIds.includes(n.id)
        ).length;
        const allNodesDone = unit.nodes.every((n) => progress.completedNodeIds.includes(n.id));
        const unitPercent = Math.round((unitCompletedNodes / unit.nodes.length) * 100);

        // Calculate connecting road statuses between 5 nodes
        // Segment 0: Node 0 -> 1
        const s0Done =
          progress.completedNodeIds.includes(unit.nodes[0]?.id) &&
          progress.completedNodeIds.includes(unit.nodes[1]?.id);
        const s0Active = progress.completedNodeIds.includes(unit.nodes[0]?.id) && !s0Done;

        // Segment 1: Node 1 -> 2
        const s1Done =
          progress.completedNodeIds.includes(unit.nodes[1]?.id) &&
          progress.completedNodeIds.includes(unit.nodes[2]?.id);
        const s1Active = progress.completedNodeIds.includes(unit.nodes[1]?.id) && !s1Done;

        // Segment 2: Node 2 -> 3
        const s2Done =
          progress.completedNodeIds.includes(unit.nodes[2]?.id) &&
          progress.completedNodeIds.includes(unit.nodes[3]?.id);
        const s2Active = progress.completedNodeIds.includes(unit.nodes[2]?.id) && !s2Done;

        // Segment 3: Node 3 -> 4
        const s3Done =
          progress.completedNodeIds.includes(unit.nodes[3]?.id) &&
          progress.completedNodeIds.includes(unit.nodes[4]?.id);
        const s3Active = progress.completedNodeIds.includes(unit.nodes[3]?.id) && !s3Done;

        return (
          <section key={unit.id} className={styles.unitSection}>
            {/* Unit Header Card */}
            <div className={styles.unitCardHeader}>
              <div className={styles.unitTitleGroup} style={{ flex: 1, minWidth: "260px" }}>
                <span className={styles.unitBadgeIcon}>{unit.badgeIcon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    <h2 className={styles.unitTitleText}>{unit.titleFa}</h2>
                    {allNodesDone && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 800,
                          padding: "0.15rem 0.5rem",
                          borderRadius: "9999px",
                          background: "#10b98118",
                          color: "#059669",
                          border: "1px solid #10b98135",
                        }}
                      >
                        ✅ فتح‌شده
                      </span>
                    )}
                  </div>

                  <p className={styles.unitDescText}>{unit.descriptionFa}</p>

                  {/* Unit Progress Meter */}
                  <div style={{ marginBlockStart: "0.75rem", maxWidth: "340px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.75rem",
                        color: "var(--color-text-muted, #64748b)",
                        fontWeight: 700,
                      }}
                    >
                      <span>میزان تسلط یونیت:</span>
                      <span style={{ color: allNodesDone ? "#10b981" : "#2563eb" }}>
                        {unitCompletedNodes} از {unit.nodes.length} مرحله ({unitPercent}٪)
                      </span>
                    </div>
                    <div className={styles.unitProgressBarTrack}>
                      <div
                        className={styles.unitProgressBarFill}
                        style={{
                          width: `${unitPercent}%`,
                          background: allNodesDone
                            ? "#10b981"
                            : "linear-gradient(90deg, #2563eb, #10b981)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {isUnitUnlocked && !allNodesDone && (
                <button
                  type="button"
                  className={styles.testOutBtn}
                  onClick={() => handleTestOutClick(unit)}
                  title="اگر به مباحث این یونیت مسلط هستید، با یک آزمون سریع از آن عبور کنید."
                >
                  <span>⚡</span>
                  <span>جهش به جلو (آزمون میانبر)</span>
                </button>
              )}
            </div>

            {/* Serpentine Nodes Track with Connected SVG Road */}
            <div className={styles.serpentineTrack}>
              {/* SVG Curved Road Connecting the 5 nodes */}
              <svg
                className={styles.svgRoadLayer}
                viewBox="0 0 320 580"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {/* Segment 0: 0 -> 1 */}
                <path
                  d="M 160 48 C 160 110, 75 110, 75 170"
                  className={
                    s0Done
                      ? styles.svgRoadPathCompleted
                      : s0Active
                      ? styles.svgRoadPathActive
                      : styles.svgRoadPathLocked
                  }
                />
                {/* Segment 1: 1 -> 2 */}
                <path
                  d="M 75 170 C 75 230, 160 230, 160 292"
                  className={
                    s1Done
                      ? styles.svgRoadPathCompleted
                      : s1Active
                      ? styles.svgRoadPathActive
                      : styles.svgRoadPathLocked
                  }
                />
                {/* Segment 2: 2 -> 3 */}
                <path
                  d="M 160 292 C 160 350, 245 350, 245 414"
                  className={
                    s2Done
                      ? styles.svgRoadPathCompleted
                      : s2Active
                      ? styles.svgRoadPathActive
                      : styles.svgRoadPathLocked
                  }
                />
                {/* Segment 3: 3 -> 4 */}
                <path
                  d="M 245 414 C 245 475, 160 475, 160 536"
                  className={
                    s3Done
                      ? styles.svgRoadPathCompleted
                      : s3Active
                      ? styles.svgRoadPathActive
                      : styles.svgRoadPathLocked
                  }
                />
              </svg>

              {/* Node Bubbles */}
              {unit.nodes.map((node, nodeIdx) => {
                const status = getNodeStatus(node.id, unit.id, progress);
                const isBoss = node.type === "boss";
                const offsetClass = offsetClasses[nodeIdx % offsetClasses.length];
                const starsCount = progress.nodeStars[node.id] || 0;

                return (
                  <div
                    key={node.id}
                    className={`${styles.nodeWrapper} ${offsetClass}`}
                    onClick={() => handleNodeClick(node, unit)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${node.titleFa} (${node.typeLabelFa})`}
                  >
                    <div
                      className={`
                        ${styles.nodeBubble}
                        ${isBoss ? styles.bossGateBubble : ""}
                        ${
                          status === "completed"
                            ? styles.nodeCompleted
                            : status === "available"
                            ? styles.nodeAvailable
                            : styles.nodeLocked
                        }
                      `}
                    >
                      <span>{status === "locked" ? "🔒" : node.icon}</span>
                    </div>

                    {/* Stars Earned */}
                    {status === "completed" && (
                      <div className={styles.nodeStarsRow}>
                        {Array.from({ length: starsCount || 3 }).map((_, i) => (
                          <span key={i} role="img" aria-label="ستاره">
                            ⭐
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Active Pulsing Indicator Badge */}
                    {status === "available" && (
                      <div
                        style={{
                          marginBlockStart: "0.35rem",
                          background: "#2563eb",
                          color: "#ffffff",
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          padding: "0.15rem 0.5rem",
                          borderRadius: "9999px",
                          boxShadow: "0 2px 8px rgba(37, 99, 235, 0.4)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        ⚡ نوبت شماست
                      </div>
                    )}

                    {/* Tooltip Title */}
                    <div className={styles.nodeLabelTooltip}>
                      <span>{node.titleFa}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Optional Side Quest Branch */}
            {unit.sideQuest && isUnitUnlocked && (
              <div className={styles.sideQuestCard}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "1.5rem" }}>{unit.sideQuest.icon}</span>
                  <div>
                    <h4 className={styles.sideQuestTitle}>
                      ماموریت جانبی: {unit.sideQuest.titleFa}
                    </h4>
                    <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.78rem", color: "#64748b" }}>
                      {unit.sideQuest.descriptionFa}
                    </p>
                  </div>
                </div>
                <Link href={unit.sideQuest.deepLinkHref} className={styles.sideQuestBtn}>
                  <span>شروع ماجراجویی</span>
                  <span aria-hidden="true">←</span>
                </Link>
              </div>
            )}
          </section>
        );
      })}

      {/* Lesson Preview Drawer / Modal */}
      {previewModal && (
        <LessonPreviewModal
          node={previewModal.node}
          unit={previewModal.unit}
          status={previewModal.status}
          starsCount={previewModal.starsCount}
          onClose={() => setPreviewModal(null)}
          onStart={handleStartFromPreview}
        />
      )}

      {/* Boss Gate / Test-Out Modal */}
      {activeBossModalUnit && (
        <BossGateModal
          unit={activeBossModalUnit.unit}
          isTestOut={activeBossModalUnit.isTestOut}
          onClose={() => {
            setActiveBossModalUnit(null);
            refreshProgress();
          }}
          onPass={handleBossPass}
        />
      )}
    </div>
  );
};
