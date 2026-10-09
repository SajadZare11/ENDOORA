import type { ReactNode } from "react";
import { PublicShell } from "@/components/marketing/PublicShell";

export default function AdminGroupLayout({ children }: { children: ReactNode }) {
  return (
    <PublicShell locale="fa" currentPath="/admin">
      {children}
    </PublicShell>
  );
}
