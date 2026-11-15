export type BertEvaluatorStatus = 'idle' | 'loading' | 'ready' | 'evaluating' | 'error';

export interface ModelLoadingProgress {
  status: string;
  file?: string;
  progress?: number;
  loaded?: number;
  total?: number;
}

export interface ParagraphAnalysis {
  paragraphIndex: number;
  text: string;
  wordCount: number;
  cosineWithNext: number | null;
  flowQuality: 'high' | 'moderate' | 'weak' | 'none';
  diagnosticFeedbackFa: string;
  diagnosticFeedbackEn: string;
}

export interface SentenceCohesion {
  sentence: string;
  similarityWithPrevious: number | null;
  isCohesionDrop: boolean;
  flowStatus: 'strong' | 'moderate' | 'abrupt' | 'initial';
  feedbackFa: string;
}

export interface CriterionScore {
  score: number; // 0 - 100
  band: number;  // 1.0 - 9.0
  descriptorEn: string;
  guidanceFa: string;
}

export interface CriteriaBreakdown {
  taskResponse: CriterionScore;
  coherenceCohesion: CriterionScore;
  lexicalResource: CriterionScore;
  grammaticalAccuracy: CriterionScore;
}

export interface BertEvaluationResult {
  overallBand: number;
  cefrLevel: 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  wordCount: number;
  targetWordCount: number;
  tokenCount: number;
  uniqueTokenCount: number;
  typeTokenRatio: number; // Lexical richness (TTR)
  promptAlignmentScore: number; // 0 - 100
  averageParagraphCohesion: number; // 0 - 100
  paragraphs: ParagraphAnalysis[];
  sentenceHeatmap: SentenceCohesion[];
  criteria: CriteriaBreakdown;
  strengthsFa: string[];
  improvementsFa: string[];
  executionTimeMs: number;
}

export type WorkerInMessage =
  | { type: 'INIT' }
  | {
      type: 'EVALUATE_ESSAY';
      payload: {
        text: string;
        promptText: string;
        targetWords?: number;
      };
    };

export type WorkerOutMessage =
  | { type: 'PROGRESS'; payload: ModelLoadingProgress }
  | { type: 'READY' }
  | { type: 'EVALUATION_RESULT'; payload: BertEvaluationResult }
  | { type: 'ERROR'; payload: { message: string } };
