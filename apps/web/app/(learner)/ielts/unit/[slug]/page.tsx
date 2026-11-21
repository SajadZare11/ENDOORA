import { ReviewedPractice } from "@/components/ielts/ReviewedPractice";

export default async function UnitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ReviewedPractice key={slug} slug={slug} />;
}
