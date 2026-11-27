import Link from "next/link";
import type { Metadata } from "next";
import { PublicShell } from "@/components/marketing/PublicShell";
import { GameHubArcade } from "@/components/skills/game/GameHubArcade";
import { buildMetadata } from "@/lib/public-site";
import styles from "../../(public)/skills/skills.module.css";

export const metadata: Metadata = buildMetadata(
  "en",
  "/skills",
  "English Skills Arcade & Interactive Games | Endoora",
  "High-energy interactive English skills practice across CEFR A1-C2 with vocabulary challenges, speed dialogues, idioms, and national leaderboards."
);

interface EnSkillLink {
  href: string;
  title: string;
  sub: string;
  icon: string;
}

const EN_SKILL_LINKS: EnSkillLink[] = [
  { href: "/skills/listening", title: "Listening", sub: "Audio & Phonetics", icon: "🎧" },
  { href: "/skills/speaking", title: "Speaking", sub: "Fluency & Cases", icon: "🎙️" },
  { href: "/skills/reading", title: "Reading", sub: "Comprehension & Quests", icon: "📖" },
  { href: "/skills/writing", title: "Writing", sub: "Composition & Arena", icon: "✍️" },
  { href: "/skills/vocabulary", title: "Vocabulary", sub: "Lexicon & Collocations", icon: "📚" },
  { href: "/skills/grammar", title: "Grammar", sub: "Structures & Syntax", icon: "⚡" },
  { href: "/skills/culture", title: "Culture & Society", sub: "Global Communication", icon: "🌐" },
  { href: "/skills/school", title: "School & Exams", sub: "Curriculum Prep", icon: "🎓" },
];

export default function EnglishSkillsHubPage() {
  return (
    <PublicShell locale="en" currentPath="/en/skills">
      <div className={styles.container} dir="ltr">
        {/* Interactive Skills Games & CEFR Arcade */}
        <GameHubArcade />

        {/* Bottom Skills Hub Quick Navigation & Learning Centers */}
        <nav aria-label="Language Skill Learning Centers" className={styles.skillsNavSection}>
          <div className={styles.skillsNavHeader}>
            <div className={styles.skillsNavBadge}>
              <span aria-hidden="true">🧭</span>
              <span>Specialized Learning Hubs</span>
            </div>
            <h2 className={styles.skillsNavTitle}>Comprehensive Skill Guides & Curricula</h2>
            <p className={styles.skillsNavSubtitle}>
              Explore step-by-step masterclasses, actionable toolkits, and golden rules for each core language skill:
            </p>
          </div>
          <div className={styles.skillsButtonsGrid}>
            {EN_SKILL_LINKS.map((skill) => (
              <Link key={skill.href} href={skill.href} className={styles.skillButtonCard}>
                <div className={styles.skillButtonIconBox} aria-hidden="true">
                  {skill.icon}
                </div>
                <div className={styles.skillButtonText}>
                  <span className={styles.skillButtonTitleFa}>{skill.title}</span>
                  <span className={styles.skillButtonTitleEn}>{skill.sub}</span>
                </div>
                <span className={styles.skillButtonArrow} aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </PublicShell>
  );
}
