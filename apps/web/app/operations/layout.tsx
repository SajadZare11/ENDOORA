import type { ReactNode } from "react";
import { PublicShell } from "@/components/marketing/PublicShell";

export default function OperationsLayout({ children }: { children: ReactNode }) {
  return (
    <PublicShell locale="fa" currentPath="/operations">
      {children}
    </PublicShell>
  );
}
