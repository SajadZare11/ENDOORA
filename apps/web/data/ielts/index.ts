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

export const ALL_IELTS_EXAMS: IeltsExam[] =
  loadedJsonExams.length > 0
    ? loadedJsonExams
    : [
        CAMBRIDGE_18_ACADEMIC_TEST_1,
        CAMBRIDGE_17_ACADEMIC_TEST_1,
        CAMBRIDGE_18_GENERAL_TEST_1,
      ];

export function getIeltsExamById(id: string): IeltsExam | undefined {
  return ALL_IELTS_EXAMS.find((e) => e.id === id);
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
