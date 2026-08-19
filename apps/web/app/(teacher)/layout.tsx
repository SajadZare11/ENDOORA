import type { Metadata } from "next";
import type { ReactNode } from "react";

import { TeacherShell } from "../../components/teacher/TeacherShell";
import "../../components/teacher/teacher.css";


export const metadata: Metadata = {
  title: "فضای مدرس | Endoora",
  description: "فضای کاری مدرس در Endoora برای اقدام‌های امروز، کلاس‌ها، درخواست‌ها و تصحیح.",
};

export default function TeacherLayout({ children }: { children: ReactNode }) {
  return <TeacherShell>{children}</TeacherShell>;
}
