import type { ReactNode } from "react";
import { PublicShell } from "@/components/marketing/PublicShell";

export default function DesignSystemLayout({ children }: { children: ReactNode }) {
  return (
    <PublicShell locale="fa" currentPath="/design-system">
      {children}
    </PublicShell>
  );
}
