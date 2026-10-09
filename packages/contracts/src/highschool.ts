/**
 * High School English Curriculum Contracts (Vision 1, 2, 3)
 * Implements the pedagogical specification for Iranian High School English.
 */

export interface HighSchoolVocabItem {
  id: string;
  word: string;
  phonetic?: string;
  persianMeaning: string;
  imagePromptOrUrl: string;
  audioUrl?: string; // If empty, will use Web Speech / TTS
  options: [string, string, string]; // 3 choices for interactive recognition
  correctOptionIndex: number;
  exampleSentence: {
    en: string;
    fa: string;
    audioUrl?: string;
  };
}

export interface ConversationLine {
  id: string;
  speaker: string;
  speakerRole: "student" | "expert" | "teacher";
  speakerAvatar: string;
  enText: string;
  faText: string;
  audioUrl?: string;
  orderIndex: number;
}

export interface HighSchoolConversationSection {
  title: string;
  situationFa: string; // e.g., "مریم در موزه طبیعت و حیات‌وحش در حال گفتگو با آقای رضوی است."
  vocabulary: HighSchoolVocabItem[]; // Blue box words
  fullAudioUrl?: string;
  dialogueLines: ConversationLine[];
}

export type ReadingQuestionType =
  | "mcq_general"
  | "true_false"
  | "reference"
  | "context_meaning"
  | "open_ended";

export interface ReadingQuestion {
  id: string;
  type: ReadingQuestionType;
  prompt: string;
  options?: string[]; // For mcq / true_false
  correctAnswer: string | number; // index or "True"/"False"
  requiredKeywordsForEvaluation?: string[]; // For open_ended keyword matching
  modelAnswerEn?: string;
  modelAnswerFa?: string;
  explanationFa: string;
}

export interface HighSchoolReadingSection {
  title: string;
  persianTitle: string;
  passageTextEn: string;
  passageParagraphs: string[];
  audioUrl?: string;
  questions: ReadingQuestion[];
}

export interface CCQItem {
  question: string;
  options: [string, string];
  correctIndex: number;
  explanationFa: string;
}

export interface GrammarTransformation {
  formType: "negative" | "wh_question";
  titleFa: string;
  stepByStepExplanationFa: string[];
  interactiveChallenge: {
    originalSentence: string;
    questionPrompt: string;
    options: [string, string];
    correctIndex: number;
    explanationFa: string;
  };
}

export interface HighSchoolGrammarSection {
  topic: string;
  persianTopic: string;
  discovery: {
    sentenceA: { text: string; highlightedPart: string; translation: string };
    sentenceB: { text: string; highlightedPart: string; translation: string };
    ccqQuestions: CCQItem[];
  };
  ruleBoxFa: string; // 1-2 lines concise formula summary
  transformations: GrammarTransformation[];
  practices: {
    controlled: {
      id: string;
      prompt: string;
      options: string[];
      correctIndex: number;
      explanationFa: string;
    }[];
    production: {
      imageUrl: string;
      imageDescriptionFa: string;
      promptInstructionFa: string;
      targetKeywords: string[];
      modelSentence: string;
      persianTranslation: string;
    };
  };
}

export interface PronunciationExample {
  sentence: string;
  intonation: "falling" | "rising";
  patternDescriptionFa: string;
  audioUrl?: string;
}

export interface HighSchoolListeningSection {
  title: string;
  preListeningQuestions: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
  }[];
  audioUrl?: string;
  conversations: {
    id: string;
    title: string;
    transcriptEn: string;
    transcriptFa: string;
  }[];
  pronunciation: {
    title: string;
    ruleExplanationFa: string;
    examples: PronunciationExample[];
    quiz: {
      id: string;
      sentence: string;
      correctIntonation: "falling" | "rising";
      explanationFa: string;
    }[];
  };
}

export interface HighSchoolWritingSection {
  nounClassification: {
    title: string;
    explanationFa: string;
    categories: {
      categoryEn: string;
      categoryFa: string;
      examples: string[];
    }[];
    quiz: {
      id: string;
      prompt: string;
      options: string[];
      correctIndex: number;
      explanationFa: string;
    }[];
  };
  singularPlural: {
    title: string;
    rulesSummaryFa: string;
    regularPairs: { singular: string; plural: string }[];
    irregularPairs: { singular: string; plural: string }[];
    exercise: {
      id: string;
      prompt: string;
      options: string[];
      correctIndex: number;
      explanationFa: string;
    }[];
  };
  properNouns: {
    title: string;
    explanationFa: string;
    examples: { common: string; proper: string }[];
    paragraphFillInTheBlank: {
      id: string;
      sentenceWithBlank: string;
      options: [string, string];
      correctIndex: number;
      explanationFa: string;
    }[];
  };
  nounMarkers: {
    title: string;
    explanationFa: string;
    markersList: {
      type: string;
      typeFa: string;
      items: string[];
      exampleSentence: string;
    }[];
    quiz: {
      id: string;
      prompt: string;
      options: string[];
      correctIndex: number;
      explanationFa: string;
    }[];
  };
}

export interface HighSchoolLessonModule {
  id: string; // e.g. "vision-1-lesson-1"
  grade: 10 | 11 | 12;
  bookTitle: string; // "Vision 1"
  lessonNumber: number; // 1
  slug: string; // "grade-10/lesson-1"
  title: {
    en: string;
    fa: string;
  };
  cefrLevel: string; // "A2"
  sections: {
    getReady: HighSchoolVocabItem[];
    conversation: HighSchoolConversationSection;
    newWords: HighSchoolVocabItem[];
    reading: HighSchoolReadingSection;
    grammar: HighSchoolGrammarSection;
    listening: HighSchoolListeningSection;
    writing: HighSchoolWritingSection;
  };
}
