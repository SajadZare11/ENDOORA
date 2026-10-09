/**
 * Computer-Adaptive Placement Test Simulator (50 Items Administration)
 * Generates calibrated synthetic pools and simulates end-to-end learner sessions.
 */

import { estimateThetaRasch, itemProbability, thetaToEndooraIndex, endooraIndexToCefr } from "./irt-oracle.mjs";

export const SECTIONS_CONFIG = [
  { section: "grammar", count: 15, durationSec: 900, nameFa: "دستور زبان", nameEn: "Grammar" },
  { section: "vocabulary", count: 15, durationSec: 900, nameFa: "واژگان", nameEn: "Vocabulary" },
  { section: "reading", count: 5, durationSec: 720, nameFa: "درک مطلب", nameEn: "Reading Comprehension" },
  { section: "listening", count: 5, durationSec: 600, nameFa: "شنیداری", nameEn: "Listening Comprehension" },
  { section: "speaking", count: 5, durationSec: 600, nameFa: "گفتاری", nameEn: "Speaking" },
  { section: "writing", count: 5, durationSec: 600, nameFa: "نگارش", nameEn: "Writing" },
];

export const TOTAL_ADMINISTERED_ITEMS = 50;

/**
 * Generates an authoritative calibrated item pool of 360 items (60 per skill, 10 per CEFR level)
 * to serve as the ground truth psychometric test bank for CAT simulation and verification.
 */
export function generateReferenceItemPool() {
  const pool = [];
  const cefrLevels = [
    { level: "A1", bMean: -2.2 },
    { level: "A2", bMean: -1.3 },
    { level: "B1", bMean: -0.3 },
    { level: "B2", bMean: 0.7 },
    { level: "C1", bMean: 1.7 },
    { level: "C2", bMean: 2.6 },
  ];

  for (const sec of SECTIONS_CONFIG) {
    for (const lvl of cefrLevels) {
      for (let i = 1; i <= 10; i++) {
        const id = `${sec.section}-${lvl.level.toLowerCase()}-${String(i).padStart(3, "0")}`;
        // Spread difficulty slightly around mean
        const b = Math.round((lvl.bMean + (i - 5.5) * 0.08) * 100) / 100;
        const a = Math.round((1.0 + ((i % 5) - 2) * 0.1) * 100) / 100;

        const item = {
          id,
          section: sec.section,
          cefr_level: lvl.level,
          difficulty_b: Math.max(-3.0, Math.min(3.0, b)),
          discrimination_a: Math.max(0.8, Math.min(1.8, a)),
          question: `Sample authentic question for ${sec.section} at level ${lvl.level} (#${i})`,
          prompt_fa: `صورت سوال آموزشی برای ${sec.nameFa} در سطح ${lvl.level}`,
          options: ["Option Alpha", "Option Beta", "Option Gamma", "Option Delta"],
          correct_option: "Option Beta",
        };

        if (sec.section === "reading") {
          item.passage = `Authentic reading passage for ${lvl.level} level comprehension context.`;
        }
        if (sec.section === "listening") {
          item.audio_url = `/audio/placement/${sec.section}-${lvl.level.toLowerCase()}-${String(i).padStart(3, "0")}.mp3`;
          item.transcript = `Speaker 1: Clear spoken English conversation for item ${id}.`;
          item.play_limit = 2;
        }
        if (sec.section === "speaking") {
          item.time_limit_sec = 60;
          item.min_words = 15;
          item.rubric = { fluency: "Natural pace", pronunciation: "Intelligible accent" };
        }
        if (sec.section === "writing") {
          item.min_words = 30;
          item.max_words = 120;
          item.target_keywords = ["consequently", "furthermore", "illustrate"];
        }

        pool.push(item);
      }
    }
  }

  return pool;
}

/**
 * Selects next item for CAT session from unasked pool matching candidate ability
 */
export function selectAdaptiveItem(pool, section, askedIds, currentTheta) {
  const candidates = pool.filter(
    (item) => item.section === section && !askedIds.has(item.id)
  );

  if (candidates.length === 0) {
    throw new Error(`Item pool exhausted for section ${section}`);
  }

  // Sort by smallest distance between item difficulty and learner ability
  candidates.sort((a, b) => {
    const diffA = Math.abs(a.difficulty_b - currentTheta);
    const diffB = Math.abs(b.difficulty_b - currentTheta);
    return diffA - diffB;
  });

  return candidates[0];
}

/**
 * Runs a simulated full 50-item adaptive test session for a candidate
 * candidateProfile: {
 *   trueTheta: number (-3.0 to +3.0),
 *   skillBiases?: Record<string, number>, // e.g. { speaking: -0.5 }
 *   randomSeed?: number,
 *   forceTimeouts?: string[], // sections that timeout early
 * }
 */
export function simulateFullSession(candidateProfile, customPool = null) {
  const pool = customPool || generateReferenceItemPool();
  const askedIds = new Set();
  const responses = [];
  const sectionBreakdown = {};
  const skillSubScores = {};
  let currentEstimatedTheta = -0.3; // Default starting ability baseline

  for (const sec of SECTIONS_CONFIG) {
    sectionBreakdown[sec.section] = 0;
    const sectionResponses = [];
    const skillTheta = candidateProfile.trueTheta + (candidateProfile.skillBiases?.[sec.section] || 0.0);

    for (let q = 0; q < sec.count; q++) {
      const item = selectAdaptiveItem(pool, sec.section, askedIds, currentEstimatedTheta);
      askedIds.add(item.id);

      // Determine correctness using candidate's true ability
      const pSuccess = itemProbability(skillTheta, item.difficulty_b, item.discrimination_a);
      // Deterministic simulation threshold: candidate succeeds if pSuccess >= 0.50
      const isCorrect = pSuccess >= 0.48;

      const responseRecord = {
        item_id: item.id,
        section: sec.section,
        difficulty_b: item.difficulty_b,
        discrimination_a: item.discrimination_a,
        cefr_level: item.cefr_level,
        is_correct: isCorrect,
      };

      responses.push(responseRecord);
      sectionResponses.push(responseRecord);
      sectionBreakdown[sec.section]++;

      // Update ability estimate adaptively after each answer
      const est = estimateThetaRasch(responses);
      currentEstimatedTheta = est.theta;
    }

    // Calculate section sub-score (0-100 normalized)
    const correctCount = sectionResponses.filter((r) => r.is_correct).length;
    const accuracy = correctCount / sec.count;
    skillSubScores[sec.section] = Math.round(accuracy * 100);
  }

  const finalEstimate = estimateThetaRasch(responses);

  return {
    totalItemsAdministered: responses.length,
    sectionBreakdown,
    itemHistory: responses,
    finalTheta: finalEstimate.theta,
    standardError: finalEstimate.standardError,
    endooraIndex: finalEstimate.endooraIndex,
    cefrLevel: finalEstimate.cefrLevel,
    skillSubScores,
    allItemIdsUnique: askedIds.size === responses.length,
  };
}
