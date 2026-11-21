import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { evaluateAnswer } from "../apps/web/lib/tamrin20-data.ts";
import { hasUsableGloss } from "../apps/web/data/cefr/quality.ts";

function* questions(node) {
  if (node && typeof node === "object") {
    if ("questionType" in node && "correctAnswer" in node) yield node;
    else for (const value of Object.values(node)) yield* questions(value);
  }
}
let tested = 0;
for (const id of [1, 2, 3]) {
  const input = JSON.parse(readFileSync(new URL("../apps/web/data/highschool/tamrin20/grade12-lesson"+id+"-tamrin20.json",import.meta.url)));
  for (const q of questions(input)) {
    const index = typeof q.correctAnswer === "number" ? q.correctAnswer : q.options?.indexOf(q.correctAnswer);
    const answer = q.options?.length && index >= 0 ? index : q.correctAnswer;
    assert.equal(evaluateAnswer(q, answer).isCorrect, true, q.id);
    tested++;
  }
}
assert.ok(tested >= 980);
let kept = 0, held = 0;
for (const level of ["a1","a2","b1","b2","c1","c2"]) {
  const cards = JSON.parse(readFileSync(new URL("../apps/web/data/cefr/"+level+"-vocab.json", import.meta.url)));
  kept += cards.filter(hasUsableGloss).length;
  held += cards.filter(c => !hasUsableGloss(c)).length;
}
assert.ok(kept > 0);
console.log({tamrinQuestions: tested, usableVocabulary: kept, heldVocabulary: held});
