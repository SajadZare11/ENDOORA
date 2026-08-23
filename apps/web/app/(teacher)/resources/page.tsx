import type { Metadata } from "next";

import { GenericPublicPage } from "@/components/marketing/GenericPublicPage";
import { buildMetadata, publicPages } from "@/lib/public-site";

const copy = publicPages.resources.fa;

export const metadata: Metadata = buildMetadata("fa", "/resources", copy.title, copy.summary);

export default function PublicResourcesPage() {
  return <GenericPublicPage locale="fa" pageKey="resources" />;
}
