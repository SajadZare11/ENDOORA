import { notFound } from "next/navigation";
import { FeaturePage } from "../../../../components/marketing/FeaturePage";
import { buildMetadata, featureKeys, featurePages, type FeatureKey } from "../../../../lib/public-site";

export function generateStaticParams() { return featureKeys.map((feature) => ({ feature })); }

export async function generateMetadata({ params }: { params: Promise<{ feature: string }> }) {
  const { feature } = await params;
  if (!featureKeys.includes(feature as FeatureKey)) return {};
  const key = feature as FeatureKey;
  const copy = featurePages[key].en;
  return buildMetadata("en", `/features/${key}`, copy.title, copy.summary);
}

export default async function EnglishFeatureRoute({ params }: { params: Promise<{ feature: string }> }) {
  const { feature } = await params;
  if (!featureKeys.includes(feature as FeatureKey)) notFound();
  return <FeaturePage locale="en" featureKey={feature as FeatureKey} />;
}
