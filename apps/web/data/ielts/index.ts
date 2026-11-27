import type {
  IeltsExam,
  IeltsExamCategory,
  IeltsSkill,
} from "@endoora/contracts";

import ieltsMockExamsJson from "./ielts-mock-exams.json" with { type: "json" };
import { CAMBRIDGE_18_ACADEMIC_TEST_1 } from "./mock-test-1-acad.ts";
import { CAMBRIDGE_17_ACADEMIC_TEST_1 } from "./mock-test-2-acad.ts";
import { CAMBRIDGE_18_GENERAL_TEST_1 } from "./mock-test-3-gen.ts";

const loadedJsonExams = (ieltsMockExamsJson as unknown as IeltsExam[]) || [];

export const FLAGSHIP_AUTHENTIC_EXAMS: IeltsExam[] = [
  CAMBRIDGE_18_ACADEMIC_TEST_1,
  CAMBRIDGE_17_ACADEMIC_TEST_1,
  CAMBRIDGE_18_GENERAL_TEST_1,
];

// Combine flagship verified tests with remaining catalog items, avoiding duplicates
const remainingJsonExams = loadedJsonExams.filter(
  (e) =>
    ![
      "c18-acad-t1",
      "c17-acad-t1",
      "c18-gen-t1",
      "cambridge-18-academic-test-1",
      "cambridge-17-academic-test-1",
      "cambridge-18-general-test-1",
    ].includes(e.id)
);

export const ALL_IELTS_EXAMS: IeltsExam[] = [
  ...FLAGSHIP_AUTHENTIC_EXAMS,
  ...remainingJsonExams,
];

const ID_ALIASES: Record<string, string> = {
  "c18-acad-t1": "cambridge-18-academic-test-1",
  "c17-acad-t1": "cambridge-17-academic-test-1",
  "c18-gen-t1": "cambridge-18-general-test-1",
  "cambridge-18-academic-test-1": "c18-acad-t1",
  "cambridge-17-academic-test-1": "c17-acad-t1",
  "cambridge-18-general-test-1": "c18-gen-t1",
};

export function getIeltsExamById(id: string): IeltsExam | undefined {
  if (!id) return undefined;
  const target = id.toLowerCase().trim();
  const alias = ID_ALIASES[target] || ID_ALIASES[id];
  return ALL_IELTS_EXAMS.find(
    (e) =>
      e.id === id ||
      e.id.toLowerCase() === target ||
      (alias && (e.id === alias || e.id.toLowerCase() === alias.toLowerCase())) ||
      e.id.replace(/-/g, "") === target.replace(/-/g, "")
  );
}

export function filterIeltsExams(params?: {
  skill?: IeltsSkill | "all";
  category?: IeltsExamCategory | "all";
  source?: string | "all";
  searchQuery?: string;
}): IeltsExam[] {
  let list = [...ALL_IELTS_EXAMS];

  if (params?.category && params.category !== "all") {
    list = list.filter((e) => e.category === params.category);
  }

  if (params?.source && params.source !== "all") {
    list = list.filter((e) => e.source.toLowerCase() === params.source?.toLowerCase());
  }

  if (params?.skill && params.skill !== "all") {
    list = list.filter((e) =>
      e.modules.some((m) => m.skill === params.skill)
    );
  }

  if (params?.searchQuery && params.searchQuery.trim() !== "") {
    const q = params.searchQuery.toLowerCase().trim();
    list = list.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        (e.description && e.description.toLowerCase().includes(q))
    );
  }

  return list;
}
