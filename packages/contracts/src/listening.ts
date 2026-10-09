/**
 * Comprehensive CEFR-Based Listening Ecosystem Contracts
 * Supporting progressive listening mastery from A1 to C2.
 */

export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type ListeningTopic =
  | "Daily Life"
  | "Travel & Transport"
  | "Food & Dining"
  | "Work & Career"
  | "Technology & AI"
  | "Education & Campus"
  | "Culture & Society"
  | "Science & Environment"
  | "Arts & Entertainment"
  | "Health & Wellness";

export type ListeningContentType =
  | "Conversation"
  | "Interview"
  | "Announcement"
  | "Short Story"
  | "Podcast"
  | "Lecture"
  | "News Report"
  | "Discussion"
  | "Debate";

export type EnglishAccent =
  | "American"
  | "British"
  | "Australian"
  | "Canadian"
  | "Irish"
  | "International";

export type ListeningSkillTag =
  | "gist"
  | "specific_information"
  | "detail"
  | "main_idea"
  | "inference"
  | "speaker_intention"
  | "speaker_attitude"
  | "paraphrase"
  | "note_taking"
  | "prediction"
  | "sequencing"
  | "dictation"
  | "pronunciation"
  | "connected_speech"
  | "implicit_meaning"
  | "pragmatics"
  | "discourse"
  | "argumentation"
  | "nuance"
  | "rhetorical_purpose";

/**
 * Multi-dimensional CEFR Difficulty Profile
 * Refined beyond superficial vocabulary metrics.
 */
export interface CEFRDifficultyProfile {
  cefrLevel: CEFRLevel;
  vocabularyLevel: CEFRLevel;
  grammarLevel: CEFRLevel;
  speechRateWpm: number;
  durationSeconds: number;
  sentenceComplexity: "simple" | "compound" | "complex" | "highly_complex";
  numberOfSpeakers: number;
  accent: EnglishAccent;
  vocabularyDensity: "low" | "moderate" | "high" | "dense";
  idiomaticLanguage: "none" | "rare" | "limited" | "moderate" | "frequent" | "dense";
  inferenceRequirement: "direct" | "low" | "moderate" | "high" | "sophisticated";
  informationDensity: "low" | "moderate" | "high" | "dense";
  backgroundNoise: "clean_studio" | "light_ambient" | "cafe_office" | "authentic_street";
  repetition: "high" | "moderate" | "minimal" | "none";
  speakerTurnFrequency: "none" | "low" | "moderate" | "high" | "rapid";
  pragmaticComplexity: "literal" | "basic_politeness" | "moderate" | "indirect_irony" | "nuanced_rhetoric";
}

/**
 * Exercise Types supported across the listening platform
 */
export type ListeningExerciseType =
  | "multiple_choice"
  | "true_false"
  | "multiple_answer"
  | "fill_blank"
  | "sentence_completion"
  | "matching"
  | "ordering"
  | "short_answer"
  | "dictation"
  | "speaker_identification"
  | "main_idea"
  | "detail_recognition"
  | "inference"
  | "speaker_attitude"
  | "note_taking"
  | "summary_completion";

export interface ExerciseExplanation {
  briefFa: string;
  detailedFa: string;
  targetQuoteEn?: string;
  pedagogicalTipFa?: string;
}

export interface BaseExercise {
  id: string;
  type: ListeningExerciseType;
  skillFocus: ListeningSkillTag;
  promptEn: string;
  promptFa: string;
  explanation: ExerciseExplanation;
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: "multiple_choice" | "main_idea" | "detail_recognition" | "inference" | "speaker_attitude" | "speaker_identification";
  options: string[];
  correctIndex: number;
}

export interface TrueFalseExercise extends BaseExercise {
  type: "true_false";
  statementEn: string;
  statementFa?: string;
  isTrue: boolean;
}

export interface MultipleAnswerExercise extends BaseExercise {
  type: "multiple_answer";
  options: string[];
  correctIndices: number[];
}

export interface FillBlankExercise extends BaseExercise {
  type: "fill_blank" | "sentence_completion" | "summary_completion";
  sentenceWithBlank: string; // e.g. "The train departs from platform {blank} at 3 PM."
  acceptedAnswers: string[];
  hintFa?: string;
}

export interface MatchingExercise extends BaseExercise {
  type: "matching";
  pairs: Array<{
    leftEn: string;
    rightEn: string;
    leftFa?: string;
    rightFa?: string;
  }>;
}

export interface OrderingExercise extends BaseExercise {
  type: "ordering";
  items: Array<{
    id: string;
    textEn: string;
    textFa?: string;
    correctOrder: number; // 0-based index
  }>;
}

export interface ShortAnswerExercise extends BaseExercise {
  type: "short_answer";
  acceptedPhrases: string[];
  keywordsRequired?: string[];
}

export interface DictationExerciseItem extends BaseExercise {
  type: "dictation";
  audioSnippetUrl?: string;
  targetSentenceEn: string;
  audioTimestamp?: {
    startSeconds: number;
    endSeconds: number;
  };
}

export interface NoteTakingExercise extends BaseExercise {
  type: "note_taking";
  categories: Array<{
    headerEn: string;
    headerFa: string;
    expectedItems: string[];
  }>;
}

export type ListeningExercise =
  | MultipleChoiceExercise
  | TrueFalseExercise
  | MultipleAnswerExercise
  | FillBlankExercise
  | MatchingExercise
  | OrderingExercise
  | ShortAnswerExercise
  | DictationExerciseItem
  | NoteTakingExercise;

/**
 * Interactive Timed Transcript Sentence
 */
export interface TranscriptSentence {
  id: string;
  startSeconds: number;
  endSeconds: number;
  speaker?: string;
  speakerRole?: string;
  textEn: string;
  textFa: string;
  connectedSpeechNotes?: string[];
}

/**
 * Curated High-Yield Vocabulary Item
 */
export interface ListeningVocabularyItem {
  id: string;
  wordOrPhrase: string;
  partOfSpeech: string;
  ipa?: string;
  meaningEn: string;
  meaningFa: string;
  contextualMeaningFa: string;
  exampleSentenceEn: string;
  exampleSentenceFa: string;
  collocations?: string[];
  audioTimestampSeconds?: number;
}

/**
 * Stage 1: Before Listening
 */
export interface PreListeningStage {
  titleFa: string;
  introductionEn: string;
  introductionFa: string;
  contextFa: string;
  predictionQuestion: {
    promptEn: string;
    promptFa: string;
    options: string[];
    guidingNoteFa: string;
  };
  keyVocabularyPrep: Array<{
    word: string;
    meaningFa: string;
  }>;
}

/**
 * Stage 2: First Listening (Gist / Global Understanding)
 */
export interface FirstListeningStage {
  titleFa: string;
  instructionFa: string;
  exercises: ListeningExercise[];
}

/**
 * Stage 3: Second Listening (Specific Information)
 */
export interface SecondListeningStage {
  titleFa: string;
  instructionFa: string;
  exercises: ListeningExercise[];
}

/**
 * Stage 4: Third Listening (Deep Comprehension, Attitude, Inference & Connected Speech)
 */
export interface ThirdListeningStage {
  titleFa: string;
  instructionFa: string;
  levelFocusFa: string;
  exercises: ListeningExercise[];
  connectedSpeechSection?: {
    titleFa: string;
    descriptionFa: string;
    examples: Array<{
      canonicalEn: string; // e.g. "going to"
      connectedEn: string; // e.g. "gonna"
      timestampSeconds?: number;
      explanationFa: string;
    }>;
  };
}

/**
 * Stage 7: Post-Listening Activity & Output
 */
export interface PostListeningStage {
  titleFa: string;
  instructionFa: string;
  activityType: "speaking_prompt" | "discussion" | "summary" | "shadowing_challenge" | "role_play";
  promptEn: string;
  promptFa: string;
  guidingQuestionsFa: string[];
  suggestedPhrasesEn: string[];
}

/**
 * Audio Asset Reference & Licensing
 */
export interface ListeningAudioConfig {
  primaryAudioUrl: string;
  fallbackAudioUrl?: string;
  durationSeconds: number;
  speechSynthesisText: string;
  speechRateMultiplier: number;
  sourceType: "indora_original" | "licensed" | "creative_commons" | "public_domain";
  attribution?: string;
  licenseInfo?: string;
}

/**
 * Complete 7-Stage Listening Lesson
 */
export interface ListeningLesson {
  id: string;
  slug: string;
  titleEn: string;
  titleFa: string;
  subtitleFa: string;
  level: CEFRLevel;
  topic: ListeningTopic;
  contentType: ListeningContentType;
  durationSeconds: number;
  accent: EnglishAccent;
  speechRateWpm: number;
  skillTags: ListeningSkillTag[];
  difficulty: CEFRDifficultyProfile;
  audio: ListeningAudioConfig;
  preListening: PreListeningStage;
  firstListening: FirstListeningStage;
  secondListening: SecondListeningStage;
  thirdListening: ThirdListeningStage;
  transcript: TranscriptSentence[];
  vocabulary: ListeningVocabularyItem[];
  postListening: PostListeningStage;
  metadata: {
    createdAt: string;
    version: string;
    authorOrSource: string;
    isReviewed: boolean;
    isPublished: boolean;
  };
}

/**
 * Progress & Analytics Tracking
 */
export interface ListeningLessonAttempt {
  lessonId: string;
  startedAt: string;
  completedAt?: string;
  isCompleted: boolean;
  scorePercent: number;
  attemptNumber: number;
  listeningTimeSeconds: number;
  completedStages: number[]; // 1 through 7
  exerciseAnswers: Record<string, any>;
  difficultQuestionIds: string[];
  lastPlaybackPositionSeconds: number;
}

export interface ListeningProgressRecord {
  summary: {
    totalLessonsCompleted: number;
    totalListeningSeconds: number;
    overallAccuracyPercent: number;
    lastActiveAt: string;
    currentStreakDays: number;
  };
  byLevel: Record<
    CEFRLevel,
    {
      totalAvailable: number;
      completedCount: number;
      averageScorePercent: number;
    }
  >;
  skillMastery: Record<
    ListeningSkillTag,
    {
      attemptsCount: number;
      correctCount: number;
      accuracyPercent: number;
    }
  >;
  lessonAttempts: Record<string, ListeningLessonAttempt>;
  recommendedLessonId?: string;
  currentActiveLessonId?: string;
}

/**
 * Personalized Recommendation Item
 */
export interface ListeningRecommendation {
  lessonId: string;
  reasonFa: string;
  reasonEn: string;
  targetSkill: ListeningSkillTag;
  urgency: "high" | "medium" | "bridge";
}
