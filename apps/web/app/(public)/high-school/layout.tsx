import type { ReactNode } from "react";
import { PublicShell } from "@/components/marketing/PublicShell";

export default function HighSchoolLayout({ children }: { children: ReactNode }) {
  return (
    <PublicShell locale="fa" currentPath="/high-school">
      {children}
    </PublicShell>
  );
}
