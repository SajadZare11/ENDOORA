import { VersionedQuestionBankOperations } from "../../../../components/questions/VersionedQuestionBankOperations";

export const metadata = {
  title: "بانک سؤال | Endoora Operations",
  description: "پیش‌نمایش امن و نسخه‌بندی‌شده بانک سؤال Endoora",
};

export default function QuestionBankPage() {
  return (
    <main style={{ minBlockSize: "100vh", backgroundColor: "var(--color-canvas)" }}>
      <VersionedQuestionBankOperations />
    </main>
  );
}
