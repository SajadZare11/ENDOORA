import Link from "next/link";
import type { SkillPageData } from "@/data/skills/skills-content";
import styles from "./skills-components.module.css";

interface SkillHeroSectionProps {
  data: SkillPageData;
}

export function SkillHeroSection({ data }: SkillHeroSectionProps) {
  return (
    <header className={styles.heroContainer}>
      <div className={styles.heroTopRow}>
        <Link href="/skills" className={styles.backLink}>
          <span>← بازگشت به مرکز مهارت‌ها</span>
        </Link>
        <div className={styles.heroBadgeGroup}>
          <span className={styles.levelBadge}>سطح هدف: {data.cefrRange}</span>
        </div>
      </div>

      <div className={styles.heroTitleRow}>
        <div className={styles.heroIconBox} aria-hidden="true">
          {data.icon}
        </div>
        <div>
          <h1 className={styles.heroTitle}>آموزش {data.titleFa}</h1>
          <div style={{ color: "var(--color-muted)", fontFamily: "var(--font-family-latin)", fontSize: "var(--font-size-meta)", direction: "ltr", textAlign: "start" }}>
            {data.titleEn}
          </div>
        </div>
      </div>

      <p className={styles.heroCatchphrase}>
        ✨ {data.heroCatchphraseFa}
      </p>

      <p className={styles.heroDescription}>
        {data.heroDescriptionFa}
      </p>

      <nav className={styles.heroNavPills} aria-label="بخش‌های آموزشی">
        <a href="#quick-toolkit" className={styles.navPill}>
          <span>⚡ جعبه ابزار فوری</span>
        </a>
        <a href="#mini-practice" className={styles.navPill}>
          <span>🎯 کارگاه تمرین تعاملی</span>
        </a>
        <a href="#l1-fixes" className={styles.navPill}>
          <span>💡 حل چالش ما ایرانی‌ها</span>
        </a>
        <a href="#action-plan" className={styles.navPill}>
          <span>🗺️ نقشه راه تسلط</span>
        </a>
      </nav>
    </header>
  );
}
