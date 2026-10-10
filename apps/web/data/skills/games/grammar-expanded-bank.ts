import type { CefrLevel, GrammarCircuitRound, HexEdgeOption, HexCircuitNode } from "./types.ts";
import type { TierSpecMap, GrammarSentenceSpec } from "./specs/spec-types.ts";
import { A1_SPECS } from "./specs/a1-specs.ts";
import { A2_SPECS } from "./specs/a2-specs.ts";
import { B1_SPECS } from "./specs/b1-specs.ts";
import { B2_SPECS } from "./specs/b2-specs.ts";
import { C1_SPECS } from "./specs/c1-specs.ts";
import { C2_SPECS } from "./specs/c2-specs.ts";

/**
 * American English File (Starter to Level 5) - Authentic Grammar Sentence Corpus Bank.
 * Generates and provides 20 authentic sentences for EVERY one of the 60 CEFR micro-levels (1,200 total circuits).
 * Features granular 2-4 node routing and authentic Persian translations with zero placeholders.
 */

const TIER_SPECS: Record<CefrLevel, TierSpecMap> = {
  A1: A1_SPECS,
  A2: A2_SPECS,
  B1: B1_SPECS,
  B2: B2_SPECS,
  C1: C1_SPECS,
  C2: C2_SPECS,
};

// Stage metadata covering all 60 CEFR micro-levels based on American English File
const STAGE_METADATA: Record<CefrLevel, Record<number, { titleFa: string; titleEn: string; concept: string; aefRef: string }>> = {
  A1: {
    1: { titleFa: "فعل بودن و ضمایر فاعلی", titleEn: "To Be & Subject Pronouns", concept: "Present Simple of To Be (am/is/are)", aefRef: "AEF Starter Unit 1" },
    2: { titleFa: "حال ساده و افعال کمکی", titleEn: "Present Simple with Do / Does", concept: "Present Simple Affirmative & Negative", aefRef: "AEF Starter Unit 2" },
    3: { titleFa: "قیود تکرار و روزمرگی", titleEn: "Adverbs of Frequency", concept: "Position of Adverbs of Frequency", aefRef: "AEF Starter Unit 3" },
    4: { titleFa: "توانایی با Can و Can't", titleEn: "Can & Can't for Ability", concept: "Modal Can for Ability & Permission", aefRef: "AEF Starter Unit 4" },
    5: { titleFa: "حروف اضافه زمان", titleEn: "Prepositions of Time", concept: "At, On, In for Time Expressions", aefRef: "AEF Starter Unit 5" },
    6: { titleFa: "وجود داشتن با There is/are", titleEn: "There is & There are", concept: "There is / There are & Quantifiers", aefRef: "AEF Starter Unit 6" },
    7: { titleFa: "گذشته ساده فعل بودن", titleEn: "Past Simple of To Be", concept: "Was & Were", aefRef: "AEF Starter Unit 7" },
    8: { titleFa: "گذشته ساده افعال باقاعده و بی‌قاعده", titleEn: "Past Simple Regular & Irregular", concept: "Past Simple Past Actions with Did / Didn't", aefRef: "AEF Starter Unit 8" },
    9: { titleFa: "برنامه‌های آینده با Be Going To", titleEn: "Future with Be Going To", concept: "Future Intentions & Predictions with Be Going To", aefRef: "AEF Starter Unit 9" },
    10: { titleFa: "حال استمراری برای رویدادهای جاری", titleEn: "Present Continuous", concept: "Actions in Progress with Am/Is/Are + -ing", aefRef: "AEF Starter Unit 10" },
  },
  A2: {
    1: { titleFa: "گذشته استمراری در برابر گذشته ساده", titleEn: "Past Continuous vs Past Simple", concept: "Interrupted Actions in the Past", aefRef: "AEF Level 1 Unit 1" },
    2: { titleFa: "جمله‌واره‌های موصولی توصیفی", titleEn: "Defining Relative Clauses", concept: "Relative Pronouns who, which, that, where", aefRef: "AEF Level 1 Unit 2" },
    3: { titleFa: "حال کامل با Ever و Never", titleEn: "Present Perfect with Ever & Never", concept: "Life Experiences with Have/Has + Past Participle", aefRef: "AEF Level 1 Unit 3" },
    4: { titleFa: "صفات تفضیلی و عالی", titleEn: "Comparatives & Superlatives", concept: "Comparison Structures and Irregular Forms", aefRef: "AEF Level 1 Unit 4" },
    5: { titleFa: "افعال مدال اجبار و نصیحت", titleEn: "Modals of Obligation & Advice", concept: "Must, Have to, and Should", aefRef: "AEF Level 1 Unit 5" },
    6: { titleFa: "جملات شرطی نوع اول", titleEn: "First Conditional", concept: "Real Possibilities with If + Present Simple, Will + Verb", aefRef: "AEF Level 1 Unit 6" },
    7: { titleFa: "اسم مصدر در برابر مصدر با to", titleEn: "Gerunds vs Infinitives", concept: "Verbs followed by -ing vs to + base", aefRef: "AEF Level 1 Unit 7" },
    8: { titleFa: "ساختار مجهول مقدماتی", titleEn: "Passive Voice Basics", concept: "Present & Past Passive with Be + Past Participle", aefRef: "AEF Level 1 Unit 8" },
    9: { titleFa: "عادت‌های گذشته با Used to", titleEn: "Used to for Past Habits", concept: "Contrasting Past Habits with Present Realities", aefRef: "AEF Level 1 Unit 9" },
    10: { titleFa: "مرور جامع گرامر سطح A2", titleEn: "A2 Master Integration", concept: "Synthesis of A2 Grammar Structures", aefRef: "AEF Level 1 Unit 10" },
  },
  B1: {
    1: { titleFa: "جملات شرطی نوع دوم فرضی", titleEn: "Second Conditional", concept: "Hypothetical Present & Future with If + Past, Would + Base", aefRef: "AEF Level 2 Unit 1" },
    2: { titleFa: "حال کامل استمراری در برابر ساده", titleEn: "Present Perfect Continuous vs Simple", concept: "Duration & Completed Results with Have been -ing", aefRef: "AEF Level 2 Unit 2" },
    3: { titleFa: "افعال مدال استنتاج در زمان حال", titleEn: "Modals of Deduction", concept: "Must, Might, and Can't for Logical Deductions", aefRef: "AEF Level 2 Unit 3" },
    4: { titleFa: "مجهول پیشرفته در زمان‌های مختلف", titleEn: "Advanced Passive Voice", concept: "Passive Structures with Agents and Complex Tenses", aefRef: "AEF Level 2 Unit 4" },
    5: { titleFa: "نقل‌قول غیرمستقیم و تغییر زمان‌ها", titleEn: "Reported Speech", concept: "Indirect Speech and Reporting Verbs", aefRef: "AEF Level 2 Unit 5" },
    6: { titleFa: "افعال دومفعولی و عبارتی", titleEn: "Phrasal Verbs", concept: "Separable & Inseparable Phrasal Verb Syntax", aefRef: "AEF Level 2 Unit 6" },
    7: { titleFa: "کلمات ربط تضاد و هدف", titleEn: "Linkers of Contrast & Purpose", concept: "Although, In spite of, Despite, In order to", aefRef: "AEF Level 2 Unit 7" },
    8: { titleFa: "گذشته کامل و گذشته مقدم", titleEn: "Past Perfect Simple & Continuous", concept: "Actions Preceding Other Past Actions with Had + P.P.", aefRef: "AEF Level 2 Unit 8" },
    9: { titleFa: "افعال ادراکی و متمم‌های حسی", titleEn: "Verbs of Perception", concept: "Sense Verbs followed by Bare Infinitive or -ing", aefRef: "AEF Level 2 Unit 9" },
    10: { titleFa: "مرور جامع گرامر سطح B1", titleEn: "B1 Master Integration", concept: "Comprehensive B1 Syntactic Synthesis", aefRef: "AEF Level 2 Unit 10" },
  },
  B2: {
    1: { titleFa: "شرطی نوع سوم و حسرت‌های گذشته", titleEn: "Third Conditional & Past Regrets", concept: "Unfulfilled Past Hypotheses with If + Had Done, Would Have Done", aefRef: "AEF Level 3 Unit 1" },
    2: { titleFa: "آرزوها و حسرت‌ها با Wish و If Only", titleEn: "Wish & If Only", concept: "Expressing Regrets & Hypothetical Desires", aefRef: "AEF Level 3 Unit 2" },
    3: { titleFa: "مدال‌های استنتاج در زمان گذشته", titleEn: "Past Modals of Deduction", concept: "Must have, Can't have, Might have done", aefRef: "AEF Level 3 Unit 3" },
    4: { titleFa: "مجهول با افعال گزارشی", titleEn: "Passive with Reporting Verbs", concept: "It is said that / He is thought to have done", aefRef: "AEF Level 3 Unit 4" },
    5: { titleFa: "جمله‌واره‌های موصولی غیرتوصیفی", titleEn: "Non-defining Relative Clauses", concept: "Adding Parenthetical Information with Commas", aefRef: "AEF Level 3 Unit 5" },
    6: { titleFa: "جمله‌واره‌های هدف و نتیجه", titleEn: "Clauses of Purpose & Result", concept: "So that, In order that, Such... that, So... that", aefRef: "AEF Level 3 Unit 6" },
    7: { titleFa: "ترجیحات و توصیه‌ها با Would rather و Had better", titleEn: "Would rather & Had better", concept: "Preferences and Urgent Warnings with Bare Infinitive", aefRef: "AEF Level 3 Unit 7" },
    8: { titleFa: "افعال سه کلمه‌ای و اصطلاحات عبارتی", titleEn: "Three-part Phrasal Verbs", concept: "Complex Prepositional Phrasal Verbs", aefRef: "AEF Level 3 Unit 8" },
    9: { titleFa: "جملات شرطی ترکیبی", titleEn: "Mixed Conditionals", concept: "Combining Past Hypotheses with Present Consequences", aefRef: "AEF Level 3 Unit 9" },
    10: { titleFa: "مرور جامع گرامر سطح B2", titleEn: "B2 Master Integration", concept: "High-level B2 Complex Syntax Synthesis", aefRef: "AEF Level 3 Unit 10" },
  },
  C1: {
    1: { titleFa: "وارونگی پس از قیود منفی و محدودکننده", titleEn: "Inversion after Negative Adverbials", concept: "Rarely, Seldom, Little, Under no circumstances + Aux + Subject", aefRef: "AEF Level 4 Unit 1" },
    2: { titleFa: "جملات شکافته برای تاکید و تمرکز", titleEn: "Cleft Sentences for Emphasis", concept: "What struck me was... / It was X that...", aefRef: "AEF Level 4 Unit 2" },
    3: { titleFa: "جمله‌واره‌های وجهی و تقدم زمانی", titleEn: "Participle Clauses & Precedence", concept: "Having done, Realizing, Deprived of...", aefRef: "AEF Level 4 Unit 3" },
    4: { titleFa: "وارونگی در جملات شرطی رسمی", titleEn: "Advanced Conditional Inversions", concept: "Had I known, Should you require, Were you to agree", aefRef: "AEF Level 4 Unit 4" },
    5: { titleFa: "قیود موضع‌گیری و نشانگرهای گفتمان", titleEn: "Advanced Discourse Markers", concept: "Truth be told, Paradoxically enough, As far as... is concerned", aefRef: "AEF Level 4 Unit 5" },
    6: { titleFa: "ساختارهای همبسته مقدم و وارونگی", titleEn: "Fronted Correlatives with Inversion", concept: "Not only... but also, Scarcely... when, No sooner... than", aefRef: "AEF Level 4 Unit 6" },
    7: { titleFa: "حذف و جایگزینی نحوی", titleEn: "Ellipsis & Syntactic Substitution", concept: "If any, Whenever possible, Do so, As requested", aefRef: "AEF Level 4 Unit 7" },
    8: { titleFa: "قیود حصر زمانی و وارونگی", titleEn: "Limiting Time Inversions", concept: "Only after, Only when, Only by, Not until", aefRef: "AEF Level 4 Unit 8" },
    9: { titleFa: "شروط خلاف واقع با But for و Were it not for", titleEn: "Counterfactual Prepositions", concept: "But for, Were it not for, Had it not been for", aefRef: "AEF Level 4 Unit 9" },
    10: { titleFa: "مدار جامع و کلان سطح C1", titleEn: "C1 Grand Master Synthesis", concept: "Advanced Academic Syntax & Rhetorical Packaging", aefRef: "AEF Level 4 Unit 10" },
  },
  C2: {
    1: { titleFa: "وجه التزامی امری و رسمی", titleEn: "The Mandative Subjunctive", concept: "Demand that he do, Imperative that she be, Insist that they submit", aefRef: "AEF Level 5 Unit 1" },
    2: { titleFa: "وارونگی زمانی با بندهای دوگانه", titleEn: "Dual-Clause Temporal Inversions", concept: "Not until X happened did Y occur / Not since... has...", aefRef: "AEF Level 5 Unit 2" },
    3: { titleFa: "جمله‌واره‌های مطلق نحوی", titleEn: "Absolute Clauses (Nominative Absolute)", concept: "The crisis having deepened, Weather permitting, Her hands trembling", aefRef: "AEF Level 5 Unit 3" },
    4: { titleFa: "وارونگی مکانی و جهتی در نگارش ادبی", titleEn: "Locative & Directional Inversion", concept: "At the summit stood..., Down the slope rolled...", aefRef: "AEF Level 5 Unit 4" },
    5: { titleFa: "وجه التزامی قالبی و اصطلاحات کهن", titleEn: "Formulaic Subjunctive & Archaic Inversion", concept: "Be that as it may, Come what may, Suffice it to say that, Far be it", aefRef: "AEF Level 5 Unit 5" },
    6: { titleFa: "جملات شبه‌شکافته پیشرفته و بسته‌بندی اطلاعات", titleEn: "Advanced Pseudo-Cleft Variations", concept: "What little remained was..., All that is required is that...", aefRef: "AEF Level 5 Unit 6" },
    7: { titleFa: "اسم‌سازی فشرده آکادمیک و تراکم نحوی", titleEn: "Dense Academic Nominalization", concept: "Complex Syntactic Compression in Scientific & Formal Registers", aefRef: "AEF Level 5 Unit 7" },
    8: { titleFa: "دوری مدال با It is high time و Would sooner", titleEn: "Modal Remoteness & Strong Preference", concept: "It is high time we took action / Would sooner forfeit than betray", aefRef: "AEF Level 5 Unit 8" },
    9: { titleFa: "شرطی‌های وارونه منفی و بسط خلاف واقع", titleEn: "Negative Inverted Conditionals", concept: "Had we not acted..., Were it not for...", aefRef: "AEF Level 5 Unit 9" },
    10: { titleFa: "اوج یکپارچگی نحوی سطح تسلط کامل C2", titleEn: "Master Syntax Synthesis Climax", concept: "Proficiency-level Integration of All High-Tier Rhetorical Syntax", aefRef: "AEF Level 5 Unit 10" },
  },
};

// Helper to assemble a clean, validated GrammarCircuitRound graph from step definitions
function buildCircuitFromSteps(
  circuitId: string,
  titleFa: string,
  titleEn: string,
  targetConcept: string,
  aefReference: string,
  prompt: string,
  translationFa: string,
  steps: GrammarSentenceSpec["steps"]
): GrammarCircuitRound {
  const nodes: HexCircuitNode[] = [];
  const numSteps = steps.length;

  for (let s = 0; s < numSteps; s++) {
    const step = steps[s];
    const nodeId = `n${s}`;
    const nextNodeId = s + 1 < numSteps ? `n${s + 1}` : "n_goal";

    const options: HexEdgeOption[] = [];

    // 1. Correct standard option
    options.push({
      id: `${circuitId}-s${s}-opt-corr`,
      text: step.corr,
      isCorrect: true,
      nextNodeId,
    });

    // 2. Branching combo option if defined
    if (step.branching) {
      options.push({
        id: `${circuitId}-s${s}-opt-branch`,
        text: step.branching.text,
        isCorrect: true,
        isBranchingClause: true,
        comboBoost: step.branching.comboBoost || 2.0,
        nextNodeId,
      });
    }

    // 3. Persian L1 Trap option if defined
    if (step.trap) {
      options.push({
        id: `${circuitId}-s${s}-opt-trap`,
        text: step.trap.text,
        isCorrect: false,
        isTrap: true,
        trapExplanationFa: step.trap.exp,
      });
    }

    // 4. Distractors to reach full options
    for (let d = 0; d < step.dist.length; d++) {
      if (options.length >= 6) break;
      const distText = step.dist[d];
      if (!options.some((o) => o.text.trim().toLowerCase() === distText.trim().toLowerCase())) {
        options.push({
          id: `${circuitId}-s${s}-opt-dist-${d}`,
          text: distText,
          isCorrect: false,
        });
      }
    }

    // 5. If still less than 6 options, pad with natural grammatical variants
    const naturalFallbacks = [
      `not ${step.corr}`,
      `always ${step.corr}`,
      `to ${step.corr}`,
      `never ${step.corr}`,
      `being ${step.corr}`,
    ];
    let fbIndex = 0;
    while (options.length < 6) {
      const fbText = naturalFallbacks[fbIndex % naturalFallbacks.length];
      fbIndex++;
      if (!options.some((o) => o.text.trim().toLowerCase() === fbText.trim().toLowerCase())) {
        options.push({
          id: `${circuitId}-s${s}-pad-${options.length}`,
          text: fbText,
          isCorrect: false,
        });
      }
    }

    nodes.push({
      id: nodeId,
      stepIndex: s,
      label: s === 0 ? prompt : `Step ${s}`,
      options,
    });
  }

  // Final goal node
  nodes.push({
    id: "n_goal",
    stepIndex: numSteps,
    label: "Goal",
    options: [],
    isGoal: true,
  });

  return {
    id: circuitId,
    titleFa,
    titleEn,
    targetConcept,
    aefReference,
    startingPrompt: prompt,
    translationFa,
    nodes,
  };
}

// Generate 20 authentic circuits for a specific CEFR stage
export function generate20CircuitsForStage(cefr: CefrLevel, stageNum: number): GrammarCircuitRound[] {
  const stageSpecs = TIER_SPECS[cefr]?.[stageNum];
  if (!stageSpecs || stageSpecs.length === 0) {
    throw new Error(`CRITICAL: Missing grammar specs for CEFR ${cefr} Stage ${stageNum}!`);
  }

  const meta = STAGE_METADATA[cefr]?.[stageNum] || {
    titleFa: `مدار گرامری ${cefr}.${stageNum}`,
    titleEn: `Grammar Circuit ${cefr}.${stageNum}`,
    concept: `American English File ${cefr} Unit ${stageNum}`,
    aefRef: `AEF Level ${cefr} Stage ${stageNum}`,
  };

  const circuits: GrammarCircuitRound[] = [];

  for (let i = 0; i < stageSpecs.length; i++) {
    const spec = stageSpecs[i];
    const circuitId = `cir-${cefr.toLowerCase()}-s${stageNum}-v${i + 1}`;

    circuits.push(
      buildCircuitFromSteps(
        circuitId,
        `${meta.titleFa} - سناریوی ${i + 1}`,
        `${meta.titleEn} - Scenario #${i + 1}`,
        meta.concept,
        meta.aefRef,
        spec.prompt,
        spec.trans,
        spec.steps
      )
    );
  }

  return circuits;
}

// Pre-generated map of 20 circuits for all 60 stages (1,200 total circuits)
export const GRAMMAR_EXPANDED_BANK: Record<CefrLevel, Record<number, GrammarCircuitRound[]>> = {
  A1: {},
  A2: {},
  B1: {},
  B2: {},
  C1: {},
  C2: {},
};

// Populate the bank for all 6 tiers x 10 levels
const TIERS: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
for (const tier of TIERS) {
  for (let lvl = 1; lvl <= 10; lvl++) {
    GRAMMAR_EXPANDED_BANK[tier][lvl] = generate20CircuitsForStage(tier, lvl);
  }
}
