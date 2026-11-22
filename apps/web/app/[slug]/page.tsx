import { notFound } from "next/navigation";
import { GenericPublicPage } from "../../components/marketing/GenericPublicPage";
import { buildMetadata, publicPageKeys, publicPages, type PublicPageKey } from "../../lib/public-site";

const dedicatedPages = new Set(["placement", "learn", "resources", "teachers", "skills", "ielts", "classes", "pricing"]);

export function generateStaticParams() {
  return publicPageKeys
    .filter((slug) =>  !dedicatedPages.has(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (dedicatedPages.has(slug) || !publicPageKeys.includes(slug as PublicPageKey)) return {};
  const key = slug as PublicPageKey;
  const copy = publicPages[key].fa;
  return buildMetadata("fa", `/${key}`, copy.title, copy.summary);
}

export default async function PublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (dedicatedPages.has(slug) || !publicPageKeys.includes(slug as PublicPageKey)) notFound();
  return <GenericPublicPage locale="fa" pageKey={slug as PublicPageKey} />;
}
