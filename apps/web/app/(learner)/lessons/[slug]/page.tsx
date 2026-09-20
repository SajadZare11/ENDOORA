import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLessonBySlug, getAllLessons } from "@/lib/lessons";
import { LessonPlayer } from "@/components/learning/LessonPlayer";

export async function generateStaticParams() {
  const lessons = await getAllLessons();
  return lessons.map((lesson) => ({
    slug: lesson.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lesson = await getLessonBySlug(slug);
  if (!lesson) return {};

  return {
    title: `${lesson.title.fa} | ${lesson.title.en} - ایندورا`,
    description: lesson.grammar.explanation_fa,
  };
}

export default async function DynamicLessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = await getLessonBySlug(slug);
  if (!lesson) notFound();

  return <LessonPlayer lesson={lesson} />;
}
