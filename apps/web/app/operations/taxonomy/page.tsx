import { TaxonomyExplorer } from "../../../components/taxonomy/TaxonomyExplorer";

export const metadata = {
  title: "تاکسونومی یادگیری | Endoora Operations",
  description: "کاوشگر و انتخابگر یکپارچه مهارت‌ها، اهداف و موضوعات آموزشی CEFR در Endoora",
};

export default function OperationsTaxonomyPage() {
  return (
    <main style={{ minBlockSize: "100vh", backgroundColor: "var(--color-canvas)" }}>
      <TaxonomyExplorer initialLocale="fa" />
    </main>
  );
}
