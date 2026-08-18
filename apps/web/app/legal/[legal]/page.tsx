import { notFound } from "next/navigation";
import { LegalPage } from "../../../components/marketing/LegalPage";
import { buildMetadata, legalKeys, legalPages, type LegalKey } from "../../../lib/public-site";

export function generateStaticParams() { return legalKeys.map((legal) => ({ legal })); }

export async function generateMetadata({ params }: { params: Promise<{ legal: string }> }) {
  const { legal } = await params;
  if (!legalKeys.includes(legal as LegalKey)) return {};
  const key = legal as LegalKey;
  const copy = legalPages[key].fa;
  return buildMetadata("fa", `/legal/${key}`, copy.title, copy.summary, { index: false });
}

export default async function LegalRoute({ params }: { params: Promise<{ legal: string }> }) {
  const { legal } = await params;
  if (!legalKeys.includes(legal as LegalKey)) notFound();
  return <LegalPage locale="fa" legalKey={legal as LegalKey} />;
}
