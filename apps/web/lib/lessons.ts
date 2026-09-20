import fs from "node:fs";
import path from "node:path";
import type { LessonData } from "@endoora/contracts";

export type { LessonData, QuizQuestion, LessonSentence } from "@endoora/contracts";

/**
 * Resolves the directory where standalone lesson JSON files live.
 */
function getLessonsDirectory(): string {
  const primary = path.join(process.cwd(), "apps", "web", "data", "lessons");
  if (fs.existsSync(primary)) return primary;

  const fallbackWeb = path.join(process.cwd(), "data", "lessons");
  if (fs.existsSync(fallbackWeb)) return fallbackWeb;

  // Fallback relative to __dirname / compiled location
  return path.join(process.cwd(), "apps", "web", "data", "lessons");
}

/**
 * Validates that a parsed JSON object matches the LessonData contract.
 */
function validateLessonData(data: any, fileName: string): LessonData {
  if (!data || typeof data !== "object") {
    throw new Error(`Invalid lesson JSON in ${fileName}: root must be an object`);
  }
  if (!data.id || !data.slug || !data.level || !data.title?.en || !data.title?.fa) {
    throw new Error(`Invalid lesson JSON in ${fileName}: missing core metadata (id, slug, level, title)`);
  }
  if (!Array.isArray(data.vocabulary)) {
    throw new Error(`Invalid lesson JSON in ${fileName}: vocabulary must be an array`);
  }
  if (!data.grammar || !data.grammar.title || !data.grammar.explanation_fa || !Array.isArray(data.grammar.rules)) {
    throw new Error(`Invalid lesson JSON in ${fileName}: grammar structure incomplete`);
  }
  if (!data.reading || !Array.isArray(data.reading.sentences)) {
    throw new Error(`Invalid lesson JSON in ${fileName}: reading sentences must be an array`);
  }
  if (!Array.isArray(data.quiz)) {
    throw new Error(`Invalid lesson JSON in ${fileName}: quiz must be an array`);
  }
  return data as LessonData;
}

/**
 * Reads all standalone lesson JSON files dynamically.
 * Adding a new lesson requires creating only a standalone JSON file—no layout code changes.
 */
export function getAllLessonsSync(): LessonData[] {
  const dir = getLessonsDirectory();
  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = fs.readdirSync(dir).filter((file) => file.endsWith(".json"));
  const lessons: LessonData[] = [];

  for (const file of files) {
    try {
      const fullPath = path.join(dir, file);
      const raw = fs.readFileSync(fullPath, "utf8");
      const parsed = JSON.parse(raw);
      lessons.push(validateLessonData(parsed, file));
    } catch (err) {
      console.error(`Failed to load lesson JSON from ${file}:`, err);
    }
  }

  return lessons;
}

export async function getAllLessons(): Promise<LessonData[]> {
  return getAllLessonsSync();
}

export async function getLessonBySlug(slug: string): Promise<LessonData | null> {
  const lessons = getAllLessonsSync();
  const found = lessons.find((lesson) => lesson.slug === slug);
  return found ?? null;
}

export async function getLessonById(id: string): Promise<LessonData | null> {
  const lessons = getAllLessonsSync();
  const found = lessons.find((lesson) => lesson.id === id);
  return found ?? null;
}

export async function getAllLessonSlugs(): Promise<string[]> {
  const lessons = getAllLessonsSync();
  return lessons.map((l) => l.slug);
}
