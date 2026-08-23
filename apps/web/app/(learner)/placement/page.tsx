import type { Metadata } from "next";

import { GenericPublicPage } from "@/components/marketing/GenericPublicPage";
import { buildMetadata, publicPages } from "@/lib/public-site";

const copy = publicPages.placement.fa;

export const metadata: Metadata = buildMetadata("fa", "/placement", copy.title, copy.summary);

export default function PlacementPublicPage() {
  return <GenericPublicPage locale="fa" pageKey="placement" />;
}
