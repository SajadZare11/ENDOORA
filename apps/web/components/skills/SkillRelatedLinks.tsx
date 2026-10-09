import Link from "next/link";
import styles from "./skills-components.module.css";

interface RelatedModule {
  title: string;
  desc: string;
  href: string;
  badge: string;
  icon: string;
}

interface SkillRelatedLinksProps {
  modules: RelatedModule[];
}

export function SkillRelatedLinks({ modules }: SkillRelatedLinksProps) {
  return (
    <section className={styles.section} aria-labelledby="related-modules-title">
      <header className={styles.sectionHeader}>
        <div className={styles.sectionBadge}>🚀 ابزارهای مکمل و هوشمند ایندورا</div>
        <h2 id="related-modules-title" className={styles.sectionTitle}>
          تمرین عملی با ابزارهای تعاملی
        </h2>
        <p className={styles.sectionDesc}>
          این مهارت را با ابزارهای اختصاصی ایندورا به مرحله تسلط کامل برسانید:
        </p>
      </header>

      <div className={styles.relatedGrid}>
        {modules.map((mod) => (
          <Link key={mod.href} href={mod.href} className={styles.relatedCard}>
            <div>
              <div className={styles.relatedTop}>
                <span className={styles.relatedIcon} aria-hidden="true">
                  {mod.icon}
                </span>
                <span className={styles.relatedBadge}>{mod.badge}</span>
              </div>
              <h3 className={styles.relatedTitle}>{mod.title}</h3>
              <p className={styles.relatedDesc}>{mod.desc}</p>
            </div>
            <div className={styles.relatedAction}>
              <span>ورود به بخش</span>
              <span aria-hidden="true">←</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
