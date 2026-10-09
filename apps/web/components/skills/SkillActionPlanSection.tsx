import Link from "next/link";
import type { ActionPlanMilestone } from "@/data/skills/skills-content";
import styles from "./skills-components.module.css";

interface SkillActionPlanSectionProps {
  sectionTitleFa: string;
  sectionDescFa: string;
  milestones: ActionPlanMilestone[];
}

export function SkillActionPlanSection({
  sectionTitleFa,
  sectionDescFa,
  milestones,
}: SkillActionPlanSectionProps) {
  return (
    <section id="action-plan" className={styles.section} aria-labelledby="action-plan-title">
      <header className={styles.sectionHeader}>
        <div className={styles.sectionBadge}>🗺️ ستون چهارم: نقشه راه تسلط و تمرین روزانه</div>
        <h2 id="action-plan-title" className={styles.sectionTitle}>
          {sectionTitleFa}
        </h2>
        <p className={styles.sectionDesc}>
          {sectionDescFa}
        </p>
      </header>

      <div className={styles.roadmapGrid}>
        {milestones.map((m) => (
          <div key={m.step} className={styles.roadmapCard}>
            <div>
              <div className={styles.stepNumberBadge}>
                {m.step}
              </div>
              <div className={styles.roadmapLevelBadge}>
                {m.levelBadge}
              </div>
              <h3 className={styles.roadmapTitle}>
                {m.titleFa}
              </h3>

              <div className={styles.dailyRoutineTag}>
                <span>⏱️ {m.dailyRoutineFa}</span>
              </div>

              <ul className={styles.actionsList}>
                {m.coreActionsFa.map((act, idx) => (
                  <li key={idx} className={styles.actionItem}>
                    <span className={styles.actionBullet}>•</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.recommendedToolBox}>
              <span className={styles.toolLinkLabel}>ابزار پیشنهادی ایندورا:</span>
              <Link href={m.recommendedTool.href} className={styles.toolLink}>
                <span>{m.recommendedTool.icon}</span>
                <span>{m.recommendedTool.titleFa}</span>
                <span aria-hidden="true">←</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
