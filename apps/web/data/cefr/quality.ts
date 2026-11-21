import type { CEFRWord } from "./types.ts";

const templateGloss = /^(?:انجام عمل|دارای ویژگی|مفهوم \/ واژه|کاربرد ساختاری) «/u;

export function hasUsableGloss(word: CEFRWord): boolean {
  const meaning = word.meaningFa.trim();
  return meaning.length > 0 && !templateGloss.test(meaning);
}
