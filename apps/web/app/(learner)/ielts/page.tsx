import type { Metadata } from "next";
import { PublicShell } from "../../../components/marketing/PublicShell";
import { IELTSCatalog } from "../../../components/ielts/IELTSCatalog";
import { buildMetadata, publicPages } from "../../../lib/public-site";

export const metadata: Metadata = buildMetadata(
  "fa",
  "/ielts",
  publicPages.ielts.fa.title,
  publicPages.ielts.fa.summary,
);

export default function IELTSPage() {
  return (
    <PublicShell locale="fa" currentPath="/ielts">
      <IELTSCatalog />
    </PublicShell>
  );
}
