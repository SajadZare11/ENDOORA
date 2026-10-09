import type { ReactNode } from "react";
import { LearnerShell } from "../../components/learner/LearnerShell";
import "../../components/learner/learner.css";

export const metadata = {
  title: "حساب کاربری | ایندورا",
};

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <LearnerShell>{children}</LearnerShell>;
}
