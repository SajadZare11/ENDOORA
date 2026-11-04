import type { ReactNode } from "react";
import { PublicShell } from "@/components/marketing/PublicShell";
import styles from "./highschool.module.css";

export default function HighSchoolLayout({ children }: { children: ReactNode }) {
  return (
    <PublicShell locale="fa" currentPath="/high-school">
      <div className={styles.highSchoolRoot}>
        {children}
      </div>
    </PublicShell>
  );
}
