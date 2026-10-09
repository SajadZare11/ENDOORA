import type { PersianL1Fix } from "@/data/skills/skills-content";
import styles from "./skills-components.module.css";

interface SkillL1FixesSectionProps {
  sectionTitleFa: string;
  sectionDescFa: string;
  fixes: PersianL1Fix[];
}

export function SkillL1FixesSection({
  sectionTitleFa,
  sectionDescFa,
  fixes,
}: SkillL1FixesSectionProps) {
  return (
    <section id="l1-fixes" className={styles.section} aria-labelledby="l1-title">
      <header className={styles.sectionHeader}>
        <div className={styles.sectionBadge}>💡 ستون سوم: حل چالش ما فارسی‌زبان‌ها</div>
        <h2 id="l1-title" className={styles.sectionTitle}>
          {sectionTitleFa}
        </h2>
        <p className={styles.sectionDesc}>
          {sectionDescFa}
        </p>
      </header>

      <div className={styles.l1Grid}>
        {fixes.map((fix) => (
          <div key={fix.id} className={styles.l1Card}>
            <div>
              <h3 className={styles.l1CardTitle}>
                {fix.titleFa}
              </h3>

              <div className={styles.persianRootBox}>
                <strong>ریشه در زبان مادری: </strong>
                <span>{fix.persianRootFa}</span>
              </div>

              <div className={styles.comparisonRow}>
                <div className={styles.wrongItem}>
                  <div>❌ <strong>اشتباه رایج:</strong></div>
                  <div className={styles.comparisonEnText}>{fix.wrongEn}</div>
                </div>

                <div className={styles.correctItem}>
                  <div>✅ <strong>شکل درست و طبیعی:</strong></div>
                  <div className={styles.comparisonEnText}>{fix.correctEn}</div>
                </div>
              </div>

              <div className={styles.l1WhyBox}>
                <strong>چرا این اصلاح لازمه؟ </strong>
                <span>{fix.whyFixFa}</span>
              </div>
            </div>

            <div className={styles.l1MindsetTip}>
              <strong>💡 تغییر ذهنیت: </strong>
              <span>{fix.goldenTipFa}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
