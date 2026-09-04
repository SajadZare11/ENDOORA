import { TaxonomyExplorer } from "../../../components/taxonomy/TaxonomyExplorer";

export const metadata = {
  title: "تاکسونومی یادگیری | Endoora Operations",
  description: "کاوشگر و انتخابگر یکپارچه مهارت‌ها، اهداف و موضوعات آموزشی CEFR در Endoora",
};

export default function OperationsTaxonomyPage() {
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--color-bg, #f8fafc)" }}>
      <TaxonomyExplorer initialLocale="fa" />
    </main>
  );
}
