import Link from "next/link";
import type { Metadata } from "next";
import { PublicShell } from "@/components/marketing/PublicShell";
import { GameHubArcade } from "@/components/skills/game/GameHubArcade";
import { buildMetadata } from "@/lib/public-site";
import styles from "./skills.module.css";

export const metadata: Metadata = buildMetadata(
  "fa",
  "/skills",
  "آرکید و بازی‌های مهارت‌های زبان انگلیسی | ایندورا",
  "آموزش تعاملی و پرانرژی مهارت‌های زبان انگلیسی در سطوح A1 تا C2 همراه با چالش‌های واژگان، مترادف‌ها، مکالمه سرعتی و لیدربورد کشوری."
);

interface SkillNavLink {
  href: string;
  titleFa: string;
  titleEn: string;
  icon: string;
}

const SKILL_NAV_LINKS: SkillNavLink[] = [
  { href: "/skills/listening", titleFa: "شنیداری", titleEn: "Listening", icon: "🎧" },
  { href: "/skills/speaking", titleFa: "گفتاری", titleEn: "Speaking", icon: "🎙️" },
  { href: "/skills/reading", titleFa: "خواندن", titleEn: "Reading", icon: "📖" },
  { href: "/skills/writing", titleFa: "نوشتن", titleEn: "Writing", icon: "✍️" },
  { href: "/skills/vocabulary", titleFa: "واژگان", titleEn: "Vocabulary", icon: "📚" },
  { href: "/skills/grammar", titleFa: "گرامر", titleEn: "Grammar", icon: "⚡" },
  { href: "/skills/culture", titleFa: "فرهنگ و روابط اجتماعی", titleEn: "Culture", icon: "🌐" },
  { href: "/skills/school", titleFa: "مدرسه و نهایی", titleEn: "School", icon: "🎓" },
];

export default function SkillsHubPage() {
  return (
    <PublicShell locale="fa" currentPath="/skills">
      <div className={styles.container} dir="rtl">
        {/* Interactive Skills Games & CEFR Arcade */}
        <GameHubArcade />

        {/* Bottom Skills Hub Quick Navigation & Learning Centers */}
        <nav aria-label="مراکز یادگیری و آموزش مهارت‌ها" className={styles.skillsNavSection}>
          <div className={styles.skillsNavHeader}>
            <div className={styles.skillsNavBadge}>
              <span aria-hidden="true">🧭</span>
              <span>مراکز یادگیری تخصصی</span>
            </div>
            <h2 className={styles.skillsNavTitle}>مراکز جامع آموزش و درس‌نامه‌های مهارت‌ها</h2>
            <p className={styles.skillsNavSubtitle}>
              برای دسترسی به مقالات آموزشی، تحلیل ساختارها، نکات طلایی و تمرین‌های تعاملی هر مهارت وارد شوید:
            </p>
          </div>
          <div className={styles.skillsButtonsGrid}>
            {SKILL_NAV_LINKS.map((skill) => (
              <Link key={skill.href} href={skill.href} className={styles.skillButtonCard}>
                <div className={styles.skillButtonIconBox} aria-hidden="true">
                  {skill.icon}
                </div>
                <div className={styles.skillButtonText}>
                  <span className={styles.skillButtonTitleFa}>{skill.titleFa}</span>
                  <span className={styles.skillButtonTitleEn}>{skill.titleEn}</span>
                </div>
                <span className={styles.skillButtonArrow} aria-hidden="true">←</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </PublicShell>
  );
}
