import fs from "node:fs";
import { AEF_60_CONCEPTS } from "../apps/web/lib/dkt-engine/concepts.ts";
import { GRAMMAR_AEF_CURRICULUM } from "../apps/web/data/skills/games/grammar-aef-curriculum.ts";
// Keep the Twin's initial bundle independent of the full curriculum and exam answer keys.
const catalog = AEF_60_CONCEPTS.map((c, i) => ({
  ...c,
  skillId: i,
  aefReference: GRAMMAR_AEF_CURRICULUM[c.cefr][c.stageNumber].aefUnit,
}));
fs.writeFileSync(
  "apps/web/lib/ai/learner-twin-catalog.json",
  JSON.stringify(catalog),
);
const matrix = JSON.parse(
  fs.readFileSync("apps/web/data/cdm/neural_cdm_dag_matrix.json", "utf8"),
);
const index = new Map(
  matrix.q_matrix.items.map((q: { item_id: string }) => [q.item_id, q]),
);
const ids = new Map(catalog.map((c) => [c.id, c.skillId]));
const exams = JSON.parse(
  fs.readFileSync("apps/web/data/ielts/ielts-mock-exams.json", "utf8"),
);
const root = "apps/web/public/twin";
fs.mkdirSync(`${root}/mocks`, { recursive: true });
const manifest = [];
for (const exam of exams) {
  const modules = [];
  for (const module of exam.modules) {
    if (!["listening", "reading"].includes(module.skill)) continue;
    const questions = module.sections
      .flatMap((s: { questions: Record<string, unknown>[] }) => s.questions)
      .map((q: Record<string, unknown>) => {
        const item = index.get(
          `ielts_${String(q.id).replace(/[-:]/g, "_")}`,
        ) as
          | {
              required_concepts: string[];
              guess_rate: number;
              discrimination: number;
              slip_rate: number;
            }
          | undefined;
        return {
          id: q.id,
          number: q.question_number,
          prompt: q.question_text ?? q.prompt ?? "",
          skillIds:
            item?.required_concepts
              .map((c) => ids.get(c))
              .filter((id) => id !== undefined) ?? [],
          guessingFloor:
            item?.guess_rate ??
            (Array.isArray(q.options) && q.options.length > 1
              ? 1 / q.options.length
              : ["true_false_not_given", "yes_no_not_given"].includes(
                    String(q.question_type),
                  )
                ? 1 / 3
                : 0.02),
          discrimination: item?.discrimination ?? 1,
          slipRate: item?.slip_rate ?? 0.04,
          mapped: !!item,
        };
      });
    const file = `${exam.id}-${module.skill}.json`;
    fs.writeFileSync(
      `${root}/mocks/${file}`,
      JSON.stringify({
        id: exam.id,
        title: exam.title,
        skill: module.skill,
        questions,
      }),
    );
    modules.push({ skill: module.skill, file, count: questions.length });
  }
  manifest.push({ id: exam.id, title: exam.title, modules });
}
fs.writeFileSync(`${root}/manifest.json`, JSON.stringify(manifest));
console.log(
  `Generated ${catalog.length} skill nodes and ${manifest.length} answer-free mock manifests.`,
);
