import { NextResponse } from "next/server";
import { ALL_LISTENING_LESSONS, filterListeningLessons } from "@/data/listening";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level") || "all";
  const topic = searchParams.get("topic") || "all";
  const accent = searchParams.get("accent") || "all";
  const query = searchParams.get("q") || "";

  const lessons = filterListeningLessons({
    level: level as any,
    topic: topic as any,
    accent: accent as any,
    searchQuery: query,
  });

  return NextResponse.json({
    total: lessons.length,
    lessons: lessons.map((l) => ({
      id: l.id,
      slug: l.slug,
      titleEn: l.titleEn,
      titleFa: l.titleFa,
      subtitleFa: l.subtitleFa,
      level: l.level,
      topic: l.topic,
      contentType: l.contentType,
      durationSeconds: l.durationSeconds,
      accent: l.accent,
      speechRateWpm: l.speechRateWpm,
      skillTags: l.skillTags,
      difficulty: l.difficulty,
      metadata: l.metadata,
    })),
  });
}
