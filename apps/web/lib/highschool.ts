import fs from "node:fs";
import path from "node:path";
import type { HighSchoolLessonModule } from "@endoora/contracts";

/**
 * Resolves the directory where high school lesson JSON files live.
 */
function getHighSchoolDirectory(): string {
  const primary = path.join(process.cwd(), "apps", "web", "data", "highschool");
  if (fs.existsSync(primary)) return primary;

  const fallbackWeb = path.join(process.cwd(), "data", "highschool");
  if (fs.existsSync(fallbackWeb)) return fallbackWeb;

  return path.join(process.cwd(), "apps", "web", "data", "highschool");
}

/**
 * Returns all high school lessons.
 */
export function getAllHighSchoolLessonsSync(): HighSchoolLessonModule[] {
  const dir = getHighSchoolDirectory();
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const modules: HighSchoolLessonModule[] = [];

  for (const file of files) {
    try {
      const fullPath = path.join(dir, file);
      const raw = fs.readFileSync(fullPath, "utf8");
      const parsed = JSON.parse(raw) as HighSchoolLessonModule;
      if (parsed.id && parsed.grade && parsed.sections) {
        modules.push(parsed);
      }
    } catch (err) {
      console.error(`Failed to load high school lesson from ${file}:`, err);
    }
  }

  return modules;
}

export async function getAllHighSchoolLessons(): Promise<HighSchoolLessonModule[]> {
  return getAllHighSchoolLessonsSync();
}

export async function getHighSchoolLesson(grade: number, lessonNumber: number): Promise<HighSchoolLessonModule | null> {
  const all = getAllHighSchoolLessonsSync();
  const found = all.find((l) => l.grade === grade && l.lessonNumber === lessonNumber);
  return found ?? null;
}

export async function getHighSchoolLessonById(id: string): Promise<HighSchoolLessonModule | null> {
  const all = getAllHighSchoolLessonsSync();
  const found = all.find((l) => l.id === id);
  return found ?? null;
}
