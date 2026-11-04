import type { ReactNode } from "react";
import styles from "./skills-root.module.css";

export default function SkillsRootLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.skillsRoot}>
      {children}
    </div>
  );
}
