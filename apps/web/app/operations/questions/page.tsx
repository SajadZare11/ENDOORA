import { Suspense } from "react";
import { VersionedQuestionBankOperations } from "../../../components/questions/VersionedQuestionBankOperations";

export const metadata = {
  title: "بانک سؤال نسخه‌بندی‌شده | Endoora Operations",
  description: "حاکمیت، ممیزی، بازبینی و مدیریت نسخه‌های ماندگار بانک سؤالات در Endoora",
};

interface PageProps {
  searchParams?: Promise<{ objective?: string }>;
}

export default async function OperationsQuestionsPage({ searchParams }: PageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const objective = resolvedParams.objective || "";

  return (
    <main style={{ minBlockSize: "100vh", backgroundColor: "var(--color-canvas)" }}>
      <Suspense fallback={
        <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-muted)" }}>
          در حال بارگذاری بانک سؤال...
        </div>
      }>
        <VersionedQuestionBankOperations initialObjectiveSlug={objective} />
      </Suspense>
    </main>
  );
}
