import type { Metadata } from "next";
import type { ReactNode } from "react";

import { LearnerShell } from "../../components/learner/LearnerShell";
import "../../components/learner/learner.css";


export const metadata: Metadata = {
  title: "خانه زبان‌آموز",
  description: "داشبورد فارسی‌اول زبان‌آموز Endoora با یک اقدام اصلی برای امروز.",
  robots: { index: false, follow: false },
};

export default function LearnerLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <LearnerShell>{children}</LearnerShell>;
}
