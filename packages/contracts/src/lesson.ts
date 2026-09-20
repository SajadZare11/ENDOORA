/**
 * Lesson Architecture & JSON-Driven Design Contracts
 * Adheres strictly to the LessonData schema specifications.
 */

export type QuizQuestion =
  | {
      type: "multiple_choice";
      id: string;
      prompt: { en: string; fa: string };
      options: string[];
      correctIndex: number;
      explanation: { en?: string; fa: string };
    }
  | {
      type: "fill_blank";
      id: string;
      prompt: { en: string; fa: string };
      sentenceWithBlank: string; // e.g. "She ___ to school every morning."
      acceptedAnswers: string[]; // e.g. ["goes", "walks"]
      hintFa?: string;
      explanation: { en?: string; fa: string };
    };

export interface LessonSentence {
  id: string;
  en: string;
  fa: string;
  vocabulary: Array<{
    word: string; // Exact English word as it appears in the sentence
    fa: string; // Contextual Persian translation
  }>;
}

export interface LessonData {
  id: string;
  slug: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  title: {
    en: string;
    fa: string;
  };
  durationMinutes: number;
  vocabulary: Array<{
    word: string;
    fa: string;
    ipa?: string;
    example: {
      en: string;
      fa: string;
    };
  }>;
  grammar: {
    title: { en: string; fa: string };
    explanation_fa: string;
    rules: string[];
    examples: Array<{
      en: string;
      fa: string;
      highlight?: string;
    }>;
  };
  reading: {
    title: { en: string; fa: string };
    sentences: LessonSentence[];
  };
  quiz: QuizQuestion[];
}
