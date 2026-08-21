import type { ReactNode } from "react";
import { LearnerShell } from "../../components/learner/LearnerShell";
import { EndooraShell } from "../../components/layout/EndooraShell";

export default function Layout({children}:{children:ReactNode}){
 return <EndooraShell><LearnerShell>{children}</LearnerShell></EndooraShell>;
}
