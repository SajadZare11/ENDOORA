import { pipeline, env } from "@huggingface/transformers";
import {
  cosineSimilarity,
  splitIntoParagraphs,
  splitIntoSentences,
  extractWords,
  analyzeVocabulary,
  evaluateIeltsCriteria,
  calculateOfficialIeltsRounding,
  bandToCefr,
} from "../lib/bert-evaluator/math";
import type {
  BertEvaluationResult,
  ParagraphAnalysis,
  SentenceCohesion,
  WorkerInMessage,
  WorkerOutMessage,
} from "../lib/bert-evaluator/types";

// Ensure browser-compatible caching and online CDN resolution
env.allowLocalModels = false;
env.useBrowserCache = true;

type FeatureExtractionPipeline = (
  text: string,
  options?: Record<string, unknown>
) => Promise<{ tolist: () => unknown[] }>;

class BertEmbeddingPipeline {
  private static instance: FeatureExtractionPipeline | null = null;
  private static loadingPromise: Promise<FeatureExtractionPipeline> | null = null;

  static async getInstance(
    progressCallback?: (progress: Record<string, unknown>) => void
  ): Promise<FeatureExtractionPipeline> {
    if (this.instance !== null) {
      return this.instance;
    }

    if (!this.loadingPromise) {
      this.loadingPromise = (pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2",
        {
          dtype: "q8",
          progress_callback: progressCallback,
        }
      ) as Promise<unknown>).then((pipe) => {
        const typedPipe = pipe as FeatureExtractionPipeline;
        this.instance = typedPipe;
        return typedPipe;
      });
    }

    return this.loadingPromise;
  }
}

// Helper to extract a normalized 1D embedding vector from feature extraction output
async function extractVector(
  extractor: FeatureExtractionPipeline,
  text: string
): Promise<number[]> {
  const output = await extractor(text, {
    pooling: "mean",
    normalize: true,
  });
  const list = output.tolist();
  return list[0] as number[];
}

self.addEventListener("message", async (event: MessageEvent<WorkerInMessage>) => {
  const data = event.data;

  if (data.type === "INIT") {
    try {
      await BertEmbeddingPipeline.getInstance((progress: Record<string, unknown>) => {
        const msg: WorkerOutMessage = {
          type: "PROGRESS",
          payload: {
            status: typeof progress.status === "string" ? progress.status : "loading",
            file: typeof progress.file === "string" ? progress.file : undefined,
            progress: typeof progress.progress === "number" ? Math.round(progress.progress) : undefined,
            loaded: typeof progress.loaded === "number" ? progress.loaded : undefined,
            total: typeof progress.total === "number" ? progress.total : undefined,
          },
        };
        self.postMessage(msg);
      });

      const readyMsg: WorkerOutMessage = { type: "READY" };
      self.postMessage(readyMsg);
    } catch (err: unknown) {
      const errMsg: WorkerOutMessage = {
        type: "ERROR",
        payload: {
          message: err instanceof Error ? err.message : "Failed to initialize BERT model in worker.",
        },
      };
      self.postMessage(errMsg);
    }
    return;
  }

  if (data.type === "EVALUATE_ESSAY") {
    const startTime = performance.now();
    const { text, promptText, targetWords = 250 } = data.payload;

    try {
      const extractor = await BertEmbeddingPipeline.getInstance();

      // 1. Token-level analysis (Lexical Richness)
      const words = extractWords(text);
      const vocab = analyzeVocabulary(words);

      // 2. Document-level Prompt Alignment (Task Response)
      const docVector = await extractVector(extractor, text);
      const promptVector = await extractVector(
        extractor,
        promptText.trim() || "Discuss advantages and disadvantages with reasons."
      );
      const promptSimilarity = cosineSimilarity(docVector, promptVector);

      // 3. Paragraph-level analysis (Coherence & Inter-paragraph Flow)
      const paragraphs = splitIntoParagraphs(text);
      const paragraphVectors: number[][] = [];

      for (const p of paragraphs) {
        const vec = await extractVector(extractor, p);
        paragraphVectors.push(vec);
      }

      const paragraphAnalyses: ParagraphAnalysis[] = [];
      const paragraphCohesionScores: number[] = [];

      for (let i = 0; i < paragraphs.length; i++) {
        let simWithNext: number | null = null;
        let flowQuality: ParagraphAnalysis["flowQuality"] = "none";
        let diagFa = "پاراگراف پایانی متن (نتیجه‌گیری).";
        let diagEn = "Conclusion paragraph.";

        if (i < paragraphs.length - 1) {
          simWithNext = cosineSimilarity(paragraphVectors[i], paragraphVectors[i + 1]);
          paragraphCohesionScores.push(simWithNext);

          if (simWithNext >= 0.7) {
            flowQuality = "high";
            diagFa = "پیوستگی مفهومی بسیار قوی و روان با پاراگراف بعد.";
            diagEn = "Strong semantic progression with following paragraph.";
          } else if (simWithNext >= 0.5) {
            flowQuality = "moderate";
            diagFa = "ارتباط موضوعی مطلوب با پاراگراف بعد؛ انتقال طبیعی است.";
            diagEn = "Good thematic linkage to next paragraph.";
          } else {
            flowQuality = "weak";
            diagFa = "انتقال موضوعی کمی ناگهانی است؛ نیاز به استفاده از واژگان ربطی بهتر دارد.";
            diagEn = "Abrupt topical jump; consider adding clear transition phrases.";
          }
        }

        paragraphAnalyses.push({
          paragraphIndex: i + 1,
          text: paragraphs[i],
          wordCount: extractWords(paragraphs[i]).length,
          cosineWithNext: simWithNext !== null ? Number(simWithNext.toFixed(3)) : null,
          flowQuality,
          diagnosticFeedbackFa: diagFa,
          diagnosticFeedbackEn: diagEn,
        });
      }

      const avgParagraphCohesion =
        paragraphCohesionScores.length > 0
          ? paragraphCohesionScores.reduce((a, b) => a + b, 0) / paragraphCohesionScores.length
          : 0.75;

      // 4. Sentence-level analysis for Cohesion Heatmap
      const allSentences = splitIntoSentences(text);
      const sentenceHeatmap: SentenceCohesion[] = [];
      const sampleSentences = allSentences.slice(0, 16); // Limit to 16 for swift inference
      const sentenceVectors: number[][] = [];

      for (const s of sampleSentences) {
        const sVec = await extractVector(extractor, s);
        sentenceVectors.push(sVec);
      }

      for (let j = 0; j < sampleSentences.length; j++) {
        if (j === 0) {
          sentenceHeatmap.push({
            sentence: sampleSentences[j],
            similarityWithPrevious: null,
            isCohesionDrop: false,
            flowStatus: "initial",
            feedbackFa: "جمله آغازین متن.",
          });
        } else {
          const sim = cosineSimilarity(sentenceVectors[j - 1], sentenceVectors[j]);
          const isDrop = sim < 0.42;
          sentenceHeatmap.push({
            sentence: sampleSentences[j],
            similarityWithPrevious: Number(sim.toFixed(3)),
            isCohesionDrop: isDrop,
            flowStatus: sim >= 0.65 ? "strong" : sim >= 0.42 ? "moderate" : "abrupt",
            feedbackFa: isDrop
              ? "افت پیوستگی: این جمله به صورت ناگهانی وارد شده است."
              : sim >= 0.65
              ? "جریان معنایی پیوسته و قوی."
              : "انتقال معنایی قابل قبول.",
          });
        }
      }

      // 5. Criteria Scoring & IELTS Rubric
      const criteria = evaluateIeltsCriteria({
        taskResponseSim: promptSimilarity,
        wordCount: words.length,
        targetWordCount: targetWords,
        avgCohesion: avgParagraphCohesion,
        ttr: vocab.ttr,
        academicCount: vocab.academicCount,
        paragraphCount: paragraphs.length,
      });

      const overallBand = calculateOfficialIeltsRounding([
        criteria.taskResponse.band,
        criteria.coherenceCohesion.band,
        criteria.lexicalResource.band,
        criteria.grammaticalAccuracy.band,
      ]);

      const cefrLevel = bandToCefr(overallBand);

      // Strengths & Diagnostic Tips
      const strengthsFa: string[] = [];
      const improvementsFa: string[] = [];

      if (words.length >= targetWords) {
        strengthsFa.push(`رعایت حداقل حجم استاندارد کلمات (${words.length} از ${targetWords} کلمه مطلوب).`);
      } else {
        improvementsFa.push(`طول متن (${words.length} کلمه) کمتر از حداقل استاندارد (${targetWords} کلمه) است.`);
      }

      if (promptSimilarity >= 0.6) {
        strengthsFa.push("ارتباط معنایی قوی با صورت‌سؤال و عدم انحراف از موضوع.");
      } else {
        improvementsFa.push("ارتباط برخی ایده‌ها با صورت‌سؤال حاشیه‌ای است؛ مستقیماً به پرسش پاسخ دهید.");
      }

      if (avgParagraphCohesion >= 0.6) {
        strengthsFa.push("انسجام ساختاری خوب و توالی منطقی بین پاراگراف‌ها.");
      } else {
        improvementsFa.push("نیاز به تقویت پیوندهای بین‌پاراگرافی با ادات ربط استاندارد آیلتس.");
      }

      if (vocab.ttr >= 0.45) {
        strengthsFa.push("تنوع واژگانی بالا و پرهیز از تکرار مکرر کلمات همسان.");
      } else {
        improvementsFa.push("تکرار کلمات زیاد است؛ دایره واژگان هم‌معنی را گسترش دهید.");
      }

      const endTime = performance.now();

      const evaluationResult: BertEvaluationResult = {
        overallBand,
        cefrLevel,
        wordCount: words.length,
        targetWordCount: targetWords,
        tokenCount: vocab.totalTokens,
        uniqueTokenCount: vocab.uniqueTokens,
        typeTokenRatio: vocab.ttr,
        promptAlignmentScore: Math.round(Math.max(0, Math.min(100, promptSimilarity * 100))),
        averageParagraphCohesion: Math.round(Math.max(0, Math.min(100, avgParagraphCohesion * 100))),
        paragraphs: paragraphAnalyses,
        sentenceHeatmap,
        criteria,
        strengthsFa,
        improvementsFa,
        executionTimeMs: Math.round(endTime - startTime),
      };

      const resultMsg: WorkerOutMessage = {
        type: "EVALUATION_RESULT",
        payload: evaluationResult,
      };
      self.postMessage(resultMsg);
    } catch (err: unknown) {
      const errMsg: WorkerOutMessage = {
        type: "ERROR",
        payload: {
          message: err instanceof Error ? err.message : "Error running Multi-Scale BERT essay evaluation.",
        },
      };
      self.postMessage(errMsg);
    }
  }
});
