import type { ReactNode } from "react";
import { EndooraShell } from "../../components/layout/EndooraShell";

export default function Layout({ children }: { children: ReactNode }) {
  return <EndooraShell>{children}</EndooraShell>;
}
