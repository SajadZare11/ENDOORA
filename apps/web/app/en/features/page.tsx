import type { Metadata } from "next";
import { buildMetadata } from "../../../lib/public-site";
import { FeaturesCatalog } from "../../../components/marketing/FeaturesCatalog";

export const metadata: Metadata = buildMetadata(
  "en",
  "/features",
  "Endoora Platform Capabilities & Features",
  "Explore Endoora's connected learning capabilities: Learner Twin cognitive model, Daily Mission, Mistake Genome, Writing Mentor, Real-time Voice Roleplay, and IELTS Simulator.",
);

export default function EnglishFeaturesPage() {
  return <FeaturesCatalog locale="en" />;
}
