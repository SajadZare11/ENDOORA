import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getCustomPageBySlug, getCustomPages } from "../../../lib/admin-site-builder-store";
import { PublicShell } from "../../../components/marketing/PublicShell";
import { DynamicPageRenderer } from "../../../components/marketing/DynamicPageRenderer";

export function generateStaticParams() {
  const pages = getCustomPages();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getCustomPageBySlug(slug);
  if (!page) return {};

  return {
    title: page.metaTitleFa || `${page.titleFa} | Endoora`,
    description: page.metaDescriptionFa || page.titleFa,
    alternates: {
      canonical: `/p/${page.slug}`,
    },
  };
}

export default async function DynamicCustomPublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getCustomPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <PublicShell locale="fa" currentPath={`/p/${page.slug}`}>
      <DynamicPageRenderer page={page} locale="fa" />
    </PublicShell>
  );
}
