import type { ReactNode } from "react";
import { LearnerShell } from "../../components/learner/LearnerShell";
import "../../components/learner/learner.css";

export default function Layout({children}:{children:ReactNode}){
 return <LearnerShell>{children}</LearnerShell>;
}
