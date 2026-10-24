"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CURRICULUM_UNITS,
  CEFRTier,
  PathUnit,
  PathNode,
  LearnerPathProgress,
  getInitialProgress,
  getNodeStatus,
  completePathNode,
  passBossGate,
} from "../../../lib/learning-path-storage";
import { PathHeroBanner } from "./PathHeroBanner";
import { BossGateModal } from "./BossGateModal";
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
  const [activeBossModalUnit, setActiveBossModalUnit] = useState<{
    unit: PathUnit;
    isTestOut: boolean;
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

  const handleNodeClick = (node: PathNode, unit: PathUnit) => {
    const status = getNodeStatus(node.id, unit.id, progress);
    if (status === "locked") return;

    if (node.type === "boss") {
      setActiveBossModalUnit({ unit, isTestOut: false });
    } else {
      // Mark node completed and navigate to its dedicated engine!
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
      {/* Hero Stats & Next Step Callout */}
      <PathHeroBanner progress={progress} />

      {/* Tier Switcher Navigation */}
      <div className={styles.tierNavTrack} role="tablist" aria-label="انتخاب سطح آموزشی">
        {TIERS.map((tier) => {
          const isActive = activeTier === tier.id;
          // Check if any unit in this tier is unlocked
          const tierUnits = CURRICULUM_UNITS.filter((u) => u.tier === tier.id);
          const isTierUnlocked = tierUnits.some((u) => progress.unlockedUnitIds.includes(u.id));

          return (
            <button
              key={tier.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.tierTabBtn} ${isActive ? styles.tierTabActive : ""}`}
              onClick={() => setActiveTier(tier.id)}
            >
              <span>{isTierUnlocked ? "🔓" : "🔒"}</span>
              <span>{tier.labelFa}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tier Units */}
      {filteredUnits.map((unit) => {
        const isUnitUnlocked = progress.unlockedUnitIds.includes(unit.id);
        const allNodesDone = unit.nodes.every((n) => progress.completedNodeIds.includes(n.id));

        return (
          <section key={unit.id} className={styles.unitSection}>
            {/* Unit Header Card */}
            <div className={styles.unitCardHeader}>
              <div className={styles.unitTitleGroup}>
                <span className={styles.unitBadgeIcon}>{unit.badgeIcon}</span>
                <div>
                  <h2 className={styles.unitTitleText}>
                    {unit.titleFa}
                    {allNodesDone && <span style={{ color: "#10b981", marginRight: "0.5rem" }}>✅ فتح‌شده</span>}
                  </h2>
                  <p className={styles.unitDescText}>{unit.descriptionFa}</p>
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

            {/* Serpentine Nodes Track */}
            <div className={styles.serpentineTrack}>
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
                    tabIndex={status === "locked" ? -1 : 0}
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
