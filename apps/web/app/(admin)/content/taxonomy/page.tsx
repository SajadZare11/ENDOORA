import { TaxonomyExplorer } from "../../../../components/taxonomy/TaxonomyExplorer";

export const metadata = {
  title: "مدیریت تاکسونومی | Endoora Operations",
  description: "مرور و انتخاب اهداف آموزشی، گرامر، واژگان و پیش‌نیازهای CEFR در Endoora",
};

export default function AdminTaxonomyPage() {
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--color-bg, #f8fafc)" }}>
      <TaxonomyExplorer initialLocale="fa" />
    </main>
  );
}
