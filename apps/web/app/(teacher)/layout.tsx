import type { Metadata } from "next";
import type { ReactNode } from "react";
import { TeacherShell } from "../../components/teacher/TeacherShell";
import { EndooraShell } from "../../components/layout/EndooraShell";
import "../../components/teacher/teacher.css";

export const metadata: Metadata={title:"فضای مدرس | Endoora"};

export default function Layout({children}:{children:ReactNode}){
 return <EndooraShell><TeacherShell>{children}</TeacherShell></EndooraShell>;
}
