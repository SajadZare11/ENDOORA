// Standalone browser Web Worker for Multi-Scale BERT essay evaluation
// Can be served statically from /workers/bert-evaluator.worker.js

let pipelineInstance = null;

async function getPipeline(progressCallback) {
  if (pipelineInstance) return pipelineInstance;
  const { pipeline, env } = await import("https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.3.3");
  env.allowLocalModels = false;
  env.useBrowserCache = true;
  pipelineInstance = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
    dtype: "q8",
    progress_callback: progressCallback,
  });
  return pipelineInstance;
}

function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || !vecA.length || !vecB.length) return 0;
  let dot = 0, normA = 0, normB = 0;
  const len = Math.min(vecA.length, vecB.length);
  for (let i = 0; i < len; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] ** 2;
    normB += vecB[i] ** 2;
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

self.addEventListener("message", async (e) => {
  const data = e.data;
  if (data.type === "INIT") {
    try {
      await getPipeline((p) => {
        self.postMessage({ type: "PROGRESS", payload: p });
      });
      self.postMessage({ type: "READY" });
    } catch (err) {
      self.postMessage({ type: "ERROR", payload: { message: err.message } });
    }
  } else if (data.type === "EVALUATE_ESSAY") {
    try {
      const pipe = await getPipeline();
      const { text, promptText } = data.payload;
      const docOut = await pipe(text, { pooling: "mean", normalize: true });
      const promptOut = await pipe(promptText || "General IELTS Prompt", { pooling: "mean", normalize: true });
      const docVec = docOut.tolist()[0];
      const promptVec = promptOut.tolist()[0];
      const sim = cosineSimilarity(docVec, promptVec);

      self.postMessage({
        type: "EVALUATION_RESULT",
        payload: {
          promptAlignmentScore: Math.round(Math.max(0, Math.min(100, sim * 100))),
        },
      });
    } catch (err) {
      self.postMessage({ type: "ERROR", payload: { message: err.message } });
    }
  }
});
