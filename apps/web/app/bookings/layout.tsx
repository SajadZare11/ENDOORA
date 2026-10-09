import type { ReactNode } from "react";
import { PublicShell } from "@/components/marketing/PublicShell";

export default function BookingsLayout({ children }: { children: ReactNode }) {
  return (
    <PublicShell locale="fa" currentPath="/bookings">
      {children}
    </PublicShell>
  );
}
