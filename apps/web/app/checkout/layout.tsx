import type { ReactNode } from "react";
import { PublicShell } from "@/components/marketing/PublicShell";

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <PublicShell locale="fa" currentPath="/checkout">
      {children}
    </PublicShell>
  );
}
