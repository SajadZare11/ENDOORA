"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { TWIN_CATALOG } from "../../lib/ai/learner-twin-store";
import type { TwinSnapshot, SkillBeliefNode } from "../../lib/ai/learner-twin-types";
import styles from "./twin.module.css";

const DOMAIN_LABELS: Record<string, { fa: string; en: string; icon: string }> = {
  tenses: { fa: "زمان‌ها و افعال", en: "Tenses & Verbs", icon: "⏳" },
  modals: { fa: "افعال کمکی و وجهی", en: "Modals & Deduction", icon: "🔑" },
  conditionals: { fa: "جملات شرطی", en: "Conditionals", icon: "🔀" },
  passive: { fa: "ساختار مجهول و سببی", en: "Passive Voice", icon: "🔄" },
  clauses: { fa: "بندها و ساختار جمله", en: "Clauses & Syntax", icon: "🧩" },
  discourse: { fa: "واژگان و مکالمه کاربردی", en: "Discourse & Fluency", icon: "💬" },
};

export default function TwinConstellation({
  snapshot,
  isFa,
}: {
  snapshot: TwinSnapshot;
  isFa: boolean;
}) {
  const [activeLevel, setActiveLevel] = useState<string>("ALL");
  const [activeDomain, setActiveDomain] = useState<string>("ALL");
  const [selectedSkillId, setSelectedSkillId] = useState<number>(20); // Default: b1-01 Second Conditional
  const [searchQuery, setSearchQuery] = useState("");

  const nodesMap = useMemo(() => {
    const map = new Map<number, SkillBeliefNode>();
    for (const node of snapshot.nodes) {
      map.set(node.skillId, node);
    }
    return map;
  }, [snapshot.nodes]);

  // Merge snapshot node state with TWIN_CATALOG metadata
  const catalogWithState = useMemo(() => {
    return TWIN_CATALOG.map((item) => {
      const node = nodesMap.get(item.skillId);
      const mean = node?.mean ?? 0.5;
      const variance = node?.variance ?? 0.08;
      const evidenceCount = node?.evidenceCount ?? 0;
      const confidencePct = Math.round(Math.max(10, (1 - Math.sqrt(variance)) * 100));

      let state: "untested" | "weak" | "learning" | "mastered";
      if (evidenceCount === 0) {
        state = "untested";
      } else if (mean >= 0.72) {
        state = "mastered";
      } else if (mean >= 0.45) {
        state = "learning";
      } else {
        state = "weak";
      }

      return {
        ...item,
        node,
        mean,
        confidencePct,
        evidenceCount,
        state,
      };
    });
  }, [nodesMap]);

  // Filtered skills
  const filteredSkills = useMemo(() => {
    return catalogWithState.filter((skill) => {
      if (activeLevel !== "ALL" && skill.cefr !== activeLevel) {
        if (activeLevel === "C1-C2" && (skill.cefr === "C1" || skill.cefr === "C2")) {
          // match C1-C2 group
        } else {
          return false;
        }
      }
      if (activeDomain !== "ALL" && skill.domain !== activeDomain) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesFa = skill.titleFa.toLowerCase().includes(q);
        const matchesEn = skill.titleEn.toLowerCase().includes(q);
        const matchesRef = skill.aefReference.toLowerCase().includes(q);
        const matchesId = skill.id.toLowerCase().includes(q);
        if (!matchesFa && !matchesEn && !matchesRef && !matchesId) return false;
      }
      return true;
    });
  }, [catalogWithState, activeLevel, activeDomain, searchQuery]);

  const selectedSkill = useMemo(() => {
    return catalogWithState.find((s) => s.skillId === selectedSkillId) ?? catalogWithState[0];
  }, [catalogWithState, selectedSkillId]);

  // Resolve prerequisites of selected skill
  const prerequisiteSkills = useMemo(() => {
    if (!selectedSkill) return [];
    const directPrereqIds = selectedSkill.prerequisites; // string array like ["a2-07"]
    return directPrereqIds
      .map((id) => catalogWithState.find((s) => s.id === id))
      .filter((s): s is NonNullable<typeof s> => s !== undefined);
  }, [selectedSkill, catalogWithState]);

  // Skills that require this skill as a prerequisite (Downstream unlocks)
  const unlocksSkills = useMemo(() => {
    if (!selectedSkill) return [];
    return catalogWithState.filter((s) => s.prerequisites.includes(selectedSkill.id));
  }, [selectedSkill, catalogWithState]);

  const levelTabs = [
    { id: "ALL", labelFa: "همه درس‌ها (۶۰ مبحث)", labelEn: "All Lessons (60)" },
    { id: "A1", labelFa: "A1 · استارتر", labelEn: "A1 · Starter" },
    { id: "A2", labelFa: "A2 · مقدماتی", labelEn: "A2 · Elementary" },
    { id: "B1", labelFa: "B1 · متوسط", labelEn: "B1 · Intermediate" },
    { id: "B2", labelFa: "B2 · بالاتر از متوسط", labelEn: "B2 · Upper-Inter" },
    { id: "C1-C2", labelFa: "C1/C2 · پیشرفته و تسلط", labelEn: "C1/C2 · Advanced" },
  ];

  return (
    <section className={styles.treeSection} aria-label={isFa ? "درخت مهارت‌ها و نقشه پیش‌نیازها" : "Skill Tree and Learning Map"}>
      {/* Header */}
      <div className={styles.treeSectionHeader}>
        <div>
          <span className={styles.treeEyebrow}>
            {isFa ? "نقشه یادگیری هوشمند · گام‌به‌گام" : "SMART LEARNING MAP & SKILL TREE"}
          </span>
          <h2 className={styles.treeTitle}>
            {isFa ? "درخت مهارت‌ها و پیش‌نیازهای درس‌ها" : "Your Skill Tree & Learning Foundations"}
          </h2>
          <p className={styles.treeSubtitle}>
            {isFa
              ? "هر درس زبان به درس‌های قبلی وابسته است. اینجا می‌توانی زنجیره یادگیری‌ات را ببینی و متوجه شوی برای یادگیری عالی هر مبحث، تسلط بر کدام پیش‌نیازها ضروری است."
              : "Every English topic builds upon earlier concepts. Explore your journey to see what to master next and check foundation prerequisites."}
          </p>
        </div>

        {/* Live Mastery Summary Badge */}
        <div className={styles.treeHeaderBadge}>
          <span className={styles.treeHeaderBadgeLabel}>
            {isFa ? "مباحث بررسی‌شده" : "Assessed Topics"}
          </span>
          <strong className={styles.treeHeaderBadgeValue}>
            {catalogWithState.filter((s) => s.evidenceCount > 0).length} / {catalogWithState.length}
          </strong>
        </div>
      </div>

      {/* Level Filter Tabs */}
      <div className={styles.treeFilterBar}>
        <div className={styles.treeLevelTabs} role="tablist">
          {levelTabs.map((tab) => {
            const isActive = activeLevel === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                className={`${styles.treeTabButton} ${isActive ? styles.treeTabButtonActive : ""}`}
                onClick={() => setActiveLevel(tab.id)}
              >
                {isFa ? tab.labelFa : tab.labelEn}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className={styles.treeSearchBox}>
          <span className={styles.treeSearchIcon} aria-hidden="true">🔍</span>
          <input
            type="search"
            placeholder={isFa ? "جستجوی درس، گرامر یا رفرنس…" : "Search lesson, topic, or book..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.treeSearchInput}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className={styles.treeSearchClear}
              aria-label={isFa ? "پاک کردن جستجو" : "Clear search"}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Layout: 2 Columns on Desktop */}
      <div className={styles.treeMainLayout}>
        {/* Left Column: Skill Grid Cards */}
        <div className={styles.treeGridCol}>
          <div className={styles.treeGridInfoRow}>
            <span>
              {isFa ? `نمایش ${filteredSkills.length} درس` : `Showing ${filteredSkills.length} topics`}
            </span>
            <div className={styles.treeLegendRow}>
              <span className={styles.treeLegendItem}>
                <span className={`${styles.treeLegendDot} ${styles.dotMastered}`} />
                {isFa ? "مسلط" : "Mastered"}
              </span>
              <span className={styles.treeLegendItem}>
                <span className={`${styles.treeLegendDot} ${styles.dotLearning}`} />
                {isFa ? "در حال یادگیری" : "Practicing"}
              </span>
              <span className={styles.treeLegendItem}>
                <span className={`${styles.treeLegendDot} ${styles.dotWeak}`} />
                {isFa ? "نیاز به مرور" : "Needs Review"}
              </span>
              <span className={styles.treeLegendItem}>
                <span className={`${styles.treeLegendDot} ${styles.dotUntested}`} />
                {isFa ? "شروع نشده" : "New"}
              </span>
            </div>
          </div>

          <div className={styles.treeCardsGrid}>
            {filteredSkills.map((skill) => {
              const isSelected = skill.skillId === selectedSkillId;
              const domainInfo = DOMAIN_LABELS[skill.domain] ?? {
                fa: "مهارت عمومی",
                en: "General Skill",
                icon: "📘",
              };
              const masteryPercent = Math.round(skill.mean * 100);

              return (
                <div
                  key={skill.skillId}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedSkillId(skill.skillId)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedSkillId(skill.skillId);
                    }
                  }}
                  className={`${styles.treeCard} ${isSelected ? styles.treeCardSelected : ""} ${
                    styles[`treeCardState_${skill.state}`]
                  }`}
                >
                  <div className={styles.treeCardTop}>
                    <span className={styles.treeCardCefr}>{skill.cefr}</span>
                    <span className={styles.treeCardDomain} title={isFa ? domainInfo.fa : domainInfo.en}>
                      <span>{domainInfo.icon}</span>
                      <span>{isFa ? domainInfo.fa : domainInfo.en}</span>
                    </span>
                    <span className={`${styles.treeCardStateBadge} ${styles[`badge_${skill.state}`]}`}>
                      {skill.state === "mastered" && (isFa ? "تسلط عالی ✨" : "Mastered ✨")}
                      {skill.state === "learning" && (isFa ? "در حال یادگیری ⚡" : "Learning ⚡")}
                      {skill.state === "weak" && (isFa ? "نیاز به مرور 🔄" : "Review 🔄")}
                      {skill.state === "untested" && (isFa ? "شروع نشده 🔒" : "New 🔒")}
                    </span>
                  </div>

                  <h3 className={styles.treeCardTitle}>
                    {isFa ? skill.titleFa : skill.titleEn}
                  </h3>
                  <span className={styles.treeCardSubTitle}>
                    {isFa ? skill.titleEn : skill.titleFa}
                  </span>

                  <div className={styles.treeCardFooter}>
                    <div className={styles.treeCardProgressBox}>
                      <div className={styles.treeCardProgressTrack}>
                        <div
                          className={`${styles.treeCardProgressFill} ${
                            skill.state === "mastered"
                              ? styles.fillMastered
                              : skill.state === "weak"
                                ? styles.fillWeak
                                : styles.fillLearning
                          }`}
                          style={{
                            width: skill.evidenceCount > 0 ? `${masteryPercent}%` : "12%",
                            opacity: skill.evidenceCount > 0 ? 1 : 0.35,
                          }}
                        />
                      </div>
                      <span className={styles.treeCardPercent}>
                        {skill.evidenceCount > 0 ? `${masteryPercent}٪` : (isFa ? "بدون آزمون" : "Pending")}
                      </span>
                    </div>

                    {skill.prerequisites.length > 0 && (
                      <span className={styles.treeCardPrereqTag} title={isFa ? "دارای پیش‌نیاز" : "Has prerequisites"}>
                        🔗 {skill.prerequisites.length} {isFa ? "پیش‌نیاز" : "prereq"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Skill Detail & Prerequisite Foundations */}
        {selectedSkill && (
          <aside className={styles.treeDetailDrawer} aria-live="polite">
            <div className={styles.treeDetailCard}>
              <div className={styles.treeDetailHeader}>
                <div className={styles.treeDetailBadgeRow}>
                  <span className={styles.treeDetailCefrBadge}>{selectedSkill.cefr}</span>
                  <span className={styles.treeDetailIdBadge}>{selectedSkill.id.toUpperCase()}</span>
                  <span className={`${styles.treeCardStateBadge} ${styles[`badge_${selectedSkill.state}`]}`}>
                    {selectedSkill.state === "mastered" && (isFa ? "تسلط عالی ✨" : "Mastered ✨")}
                    {selectedSkill.state === "learning" && (isFa ? "در حال تثبیت ⚡" : "In Progress ⚡")}
                    {selectedSkill.state === "weak" && (isFa ? "نیاز به تقویت 🔄" : "Needs Work 🔄")}
                    {selectedSkill.state === "untested" && (isFa ? "آماده شروع اولین تمرین" : "Ready to Start")}
                  </span>
                </div>

                <h3 className={styles.treeDetailMainTitle}>
                  {isFa ? selectedSkill.titleFa : selectedSkill.titleEn}
                </h3>
                <p className={styles.treeDetailEnglishSub}>
                  {isFa ? selectedSkill.titleEn : selectedSkill.titleFa}
                </p>

                <div className={styles.treeDetailSourceRef}>
                  <span className={styles.treeDetailBookIcon}>📖</span>
                  <span>{selectedSkill.aefReference}</span>
                </div>
              </div>

              {/* Mastery & Twin Confidence Metrics */}
              <div className={styles.treeDetailMetricsGrid}>
                <div className={styles.treeDetailMetricBox}>
                  <span className={styles.treeDetailMetricLabel}>
                    {isFa ? "میزان تسلط شما" : "Your Mastery"}
                  </span>
                  <strong className={styles.treeDetailMetricVal}>
                    {selectedSkill.evidenceCount > 0
                      ? `${Math.round(selectedSkill.mean * 100)}٪`
                      : (isFa ? "در انتظار تمرین" : "No practice yet")}
                  </strong>
                  <span className={styles.treeDetailMetricNote}>
                    {selectedSkill.evidenceCount > 0
                      ? (isFa ? `از روی ${selectedSkill.evidenceCount} پاسخ تمرینی` : `From ${selectedSkill.evidenceCount} answers`)
                      : (isFa ? "هنوز پاسخی ثبت نشده" : "Initial estimate")}
                  </span>
                </div>

                <div className={styles.treeDetailMetricBox}>
                  <span className={styles.treeDetailMetricLabel}>
                    {isFa ? "اطمینان شناخت دوقلو" : "Twin Certainty"}
                  </span>
                  <strong className={styles.treeDetailMetricVal}>
                    {selectedSkill.confidencePct}٪
                  </strong>
                  <span className={styles.treeDetailMetricNote}>
                    {isFa ? "دقت شبیه‌سازی مدل" : "Model certainty score"}
                  </span>
                </div>
              </div>

              {/* Section: Prerequisites (درس‌های پیش‌نیاز) */}
              <div className={styles.treePrereqSection}>
                <h4 className={styles.treePrereqSectionTitle}>
                  <span>🔗</span>
                  <span>{isFa ? "پیش‌نیازهای این درس" : "Prerequisites to Master First"}</span>
                </h4>

                {prerequisiteSkills.length > 0 ? (
                  <div className={styles.treePrereqList}>
                    <p className={styles.treePrereqDesc}>
                      {isFa
                        ? "برای اینکه این درس رو عمیق و سریع یاد بگیری، دوقلوی تو پیشنهاد می‌کنه اول این درس‌های پایه رو بررسی کنی:"
                        : "To build a rock-solid understanding of this lesson, make sure you are confident in these foundation topics:"}
                    </p>

                    {prerequisiteSkills.map((prereq) => {
                      const isPrereqWeak = prereq.state === "weak" || (prereq.evidenceCount > 0 && prereq.mean < 0.5);
                      return (
                        <div
                          key={prereq.skillId}
                          role="button"
                          tabIndex={0}
                          onClick={() => setSelectedSkillId(prereq.skillId)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setSelectedSkillId(prereq.skillId);
                            }
                          }}
                          className={`${styles.treePrereqCard} ${isPrereqWeak ? styles.treePrereqCardAlert : ""}`}
                        >
                          <div className={styles.treePrereqCardHeader}>
                            <span className={styles.treePrereqCardCefr}>{prereq.cefr}</span>
                            <span className={styles.treePrereqCardName}>
                              {isFa ? prereq.titleFa : prereq.titleEn}
                            </span>
                            <span className={styles.treePrereqCardPercent}>
                              {prereq.evidenceCount > 0
                                ? `${Math.round(prereq.mean * 100)}٪`
                                : (isFa ? "آزمون‌نشده" : "Untested")}
                            </span>
                          </div>

                          {isPrereqWeak ? (
                            <span className={styles.treePrereqAlertText}>
                              ⚠️ {isFa ? "تسلط بر این پیش‌نیاز هنوز کافی نیست؛ اول این را مرور کن!" : "Foundation needs practice before tackling this lesson!"}
                            </span>
                          ) : (
                            <span className={styles.treePrereqOkText}>
                              ✓ {isFa ? "وضعیت پیش‌نیاز مناسب است" : "Foundation ready"}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className={styles.treePrereqEmptyBox}>
                    <span className={styles.treePrereqEmptyIcon}>🌱</span>
                    <p>
                      {isFa
                        ? "این یک درس پایه‌ای و زیربنایی است و هیچ پیش‌نیازی ندارد؛ می‌توانی با خیال راحت شروعش کنی! ✨"
                        : "This is a foundational concept with no prior prerequisites. You can jump right in! ✨"}
                    </p>
                  </div>
                )}
              </div>

              {/* Section: Unlocks (مباحث بعدی که بعد از این درس باز می‌شوند) */}
              {unlocksSkills.length > 0 && (
                <div className={styles.treeUnlocksSection}>
                  <h4 className={styles.treeUnlocksTitle}>
                    <span>🚀</span>
                    <span>{isFa ? "درس‌های بعدی که به این مبحث وابسته‌اند" : "Unlocks Future Topics"}</span>
                  </h4>
                  <div className={styles.treeUnlocksTags}>
                    {unlocksSkills.slice(0, 4).map((unlocked) => (
                      <button
                        key={unlocked.skillId}
                        type="button"
                        className={styles.treeUnlockChip}
                        onClick={() => setSelectedSkillId(unlocked.skillId)}
                      >
                        <span className={styles.treeUnlockChipCefr}>{unlocked.cefr}</span>
                        <span>{isFa ? unlocked.titleFa : unlocked.titleEn}</span>
                      </button>
                    ))}
                    {unlocksSkills.length > 4 && (
                      <span className={styles.treeUnlockMore}>
                        +{unlocksSkills.length - 4} {isFa ? "درس دیگر" : "more"}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className={styles.treeDetailActions}>
                <Link href="/leitner" className={styles.treeActionBtnPrimary}>
                  <span>📚</span>
                  <span>{isFa ? "مرور واژگان و گرامر در لایتنر" : "Practice in Leitner Box"}</span>
                </Link>
                <Link href="/learn" className={styles.treeActionBtnSecondary}>
                  <span>🎯</span>
                  <span>{isFa ? "مشاهده جلسات آموزشی مرتبط" : "View Lesson Videos"}</span>
                </Link>
              </div>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
}
