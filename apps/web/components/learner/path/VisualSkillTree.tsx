"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
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
import { BossGateModal } from "./BossGateModal";
import { LessonPreviewModal } from "./LessonPreviewModal";
import { InteractiveLessonModal } from "./InteractiveLessonModal";
import styles from "./learning-path.module.css";

const TIERS: {
  id: CEFRTier;
  code: string;
  labelFa: string;
  subFa: string;
  descFa: string;
}[] = [
  { id: "A1", code: "A1", labelFa: "سطح A1", subFa: "مقدماتی", descFa: "مکالمه پایه و نیازهای اولیه" },
  { id: "A2", code: "A2", labelFa: "سطح A2", subFa: "پیش‌متوسط", descFa: "توصیف گذشته، سفر و سلامت" },
  { id: "B1", code: "B1", labelFa: "سطح B1", subFa: "متوسط", descFa: "استقلال در مکالمه و آینده" },
  { id: "B2", code: "B2", labelFa: "سطح B2", subFa: "فوق‌متوسط", descFa: "استدلال، مباحثه و زبان رسمی" },
  { id: "C1", code: "C1", labelFa: "سطح C1", subFa: "پیشرفته", descFa: "تسلط آکادمیک و نمره ۷.۵+" },
];

export const VisualSkillTree: React.FC = () => {
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

  // In-App Interactive Lesson Runner state
  const [interactiveModal, setInteractiveModal] = useState<{
    node: PathNode;
    unit: PathUnit;
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
      setInteractiveModal({ node, unit });
    }
  };

  const handleInteractiveComplete = (starsCount: number, xpReward: number) => {
    if (!interactiveModal) return;
    completePathNode(interactiveModal.node.id, starsCount, xpReward);
    setInteractiveModal(null);
    refreshProgress();
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

  // Identify the currently in-progress active unit in the active tier
  const activeUnitInTier = useMemo(() => {
    const inProgress = filteredUnits.find(
      (u) =>
        progress.unlockedUnitIds.includes(u.id) &&
        !u.nodes.every((n) => progress.completedNodeIds.includes(n.id))
    );
    if (inProgress) return inProgress.id;
    return filteredUnits[0]?.id;
  }, [filteredUnits, progress]);

  // Collapsible state for units: active unit in progress is open by default
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (activeUnitInTier) {
      setExpandedUnits((prev) => {
        if (prev[activeUnitInTier] === undefined) {
          return { ...prev, [activeUnitInTier]: true };
        }
        return prev;
      });
    }
  }, [activeTier, activeUnitInTier]);

  const toggleUnitCollapse = (unitId: string) => {
    setExpandedUnits((prev) => {
      const isCurrentlyExpanded =
        prev[unitId] !== undefined ? prev[unitId] : unitId === activeUnitInTier;
      return { ...prev, [unitId]: !isCurrentlyExpanded };
    });
  };

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
      {/* Modern 5-Tier Level Navigation (No horizontal scrolling) */}
      <div className={styles.tierNavGrid} role="tablist" aria-label="انتخاب سطح آموزشی">
        {TIERS.map((tier) => {
          const isActive = activeTier === tier.id;
          const stat = tierStats[tier.id];

          return (
            <button
              key={tier.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.tierCardBtn} ${isActive ? styles.tierCardActive : ""}`}
              onClick={() => setActiveTier(tier.id)}
            >
              <div className={styles.tierCardTop}>
                <span className={styles.tierCodeBadge}>{tier.code}</span>
                <span className={styles.tierLockIcon} title={stat.isUnlocked ? "سطح باز است" : "سطح قفل است"}>
                  {stat.isUnlocked ? "🔓" : "🔒"}
                </span>
              </div>
              <div className={styles.tierCardMeta}>
                <span className={styles.tierLabelMain}>{tier.labelFa}</span>
                <span className={styles.tierDescSub}>{tier.subFa}</span>
              </div>
              <div className={styles.tierCardFooter}>
                <span className={styles.tierPercentBadge}>
                  {stat.percent === 100 ? "✅ ۱۰۰٪" : `${stat.percent}٪`}
                </span>
              </div>
              <div className={styles.tierMiniProgressTrack}>
                <div
                  className={styles.tierMiniProgressFill}
                  style={{ width: `${stat.percent}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Tier Units - Collapsible Accordion Style */}
      {filteredUnits.map((unit) => {
        const isUnitUnlocked = progress.unlockedUnitIds.includes(unit.id);
        const unitCompletedNodes = unit.nodes.filter((n) =>
          progress.completedNodeIds.includes(n.id)
        ).length;
        const allNodesDone = unit.nodes.every((n) => progress.completedNodeIds.includes(n.id));
        const unitPercent = Math.round((unitCompletedNodes / unit.nodes.length) * 100);
        const isExpanded =
          expandedUnits[unit.id] !== undefined ? expandedUnits[unit.id] : unit.id === activeUnitInTier;

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
          <section
            key={unit.id}
            className={`${styles.unitSection} ${!isExpanded ? styles.unitSectionCollapsed : ""}`}
          >
            {/* Unit Header Card - Clickable to expand/collapse */}
            <div
              className={`${styles.unitCardHeader} ${styles.unitCardHeaderClickable}`}
              onClick={() => toggleUnitCollapse(unit.id)}
              role="button"
              tabIndex={0}
              aria-expanded={isExpanded}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleUnitCollapse(unit.id);
                }
              }}
            >
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
                          padding: "0.2rem 0.6rem",
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

              {/* Action buttons & Collapse trigger */}
              <div className={styles.unitHeaderActions}>
                {isUnitUnlocked && !allNodesDone && (
                  <button
                    type="button"
                    className={styles.testOutBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTestOutClick(unit);
                    }}
                    title="اگر به مباحث این یونیت مسلط هستید، با یک آزمون سریع از آن عبور کنید."
                  >
                    <span>⚡</span>
                    <span>جهش به جلو (آزمون میانبر)</span>
                  </button>
                )}

                <div
                  className={`${styles.unitTogglePill} ${isExpanded ? styles.unitTogglePillActive : ""}`}
                >
                  <span>{isExpanded ? "بستن درس‌ها" : "مشاهده درس‌ها"}</span>
                  <svg
                    className={`${styles.unitChevronIcon} ${isExpanded ? styles.unitChevronRotated : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Collapsible Content: Serpentine Nodes & Side Quest */}
            {isExpanded && (
              <div className={styles.unitCollapsibleBody}>
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
                              marginBlockStart: "0.4rem",
                              background: "linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)",
                              color: "#ffffff",
                              fontSize: "0.72rem",
                              fontWeight: 850,
                              padding: "0.2rem 0.65rem",
                              borderRadius: "9999px",
                              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.45)",
                              whiteSpace: "nowrap",
                              border: "1px solid rgba(255, 255, 255, 0.3)",
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
                    <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                      <span style={{ fontSize: "1.75rem" }}>{unit.sideQuest.icon}</span>
                      <div>
                        <h4 className={styles.sideQuestTitle}>
                          ماموریت جانبی: {unit.sideQuest.titleFa}
                        </h4>
                        <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.82rem", color: "#64748b" }}>
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

      {/* In-App Interactive Lesson Runner Modal */}
      {interactiveModal && (
        <InteractiveLessonModal
          node={interactiveModal.node}
          unit={interactiveModal.unit}
          onClose={() => setInteractiveModal(null)}
          onComplete={handleInteractiveComplete}
        />
      )}
    </div>
  );
};
