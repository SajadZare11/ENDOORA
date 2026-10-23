import { ALL_IELTS_CLINICS, getClinicById, getClinicsBySkill, CLINIC_SKILL_META } from "../apps/web/data/ielts/clinics/index.ts";

console.log("=== RUNNING IELTS SKILL CLINICS VERIFICATION ===");

// 1. Verify Total Clinic Count
const clinics = ALL_IELTS_CLINICS;
if (clinics.length !== 9) {
  throw new Error(`Expected exactly 9 clinics, got ${clinics.length}`);
}
console.log(`✓ Exactly 9 IELTS Foundation Clinics loaded.`);

// 2. Verify Skill Distribution
const requiredSkills = ["reading", "writing", "listening", "speaking"];
for (const skill of requiredSkills) {
  const skillClinics = getClinicsBySkill(skill);
  if (skillClinics.length === 0) {
    throw new Error(`Skill '${skill}' has 0 clinics!`);
  }
  const meta = CLINIC_SKILL_META[skill];
  if (!meta) {
    throw new Error(`Missing skill metadata for '${skill}'`);
  }
  if (skillClinics.length !== meta.count) {
    throw new Error(`Mismatch count for ${skill}: metadata says ${meta.count}, got ${skillClinics.length}`);
  }
  console.log(`✓ Skill '${skill}': ${skillClinics.length} clinics verified (${meta.labelFa})`);
}

// 3. Deep Data Integrity Check for Every Clinic
let totalDrills = 0;
let totalTraps = 0;

for (const clinic of clinics) {
  if (!clinic.id || typeof clinic.id !== "string") {
    throw new Error(`Clinic missing valid id: ${JSON.stringify(clinic)}`);
  }
  if (!clinic.titleFa || !clinic.titleEn) {
    throw new Error(`Clinic ${clinic.id} missing bilingual titles`);
  }
  if (!clinic.targetBands || !clinic.heroIcon || !clinic.hurdleSummaryFa) {
    throw new Error(`Clinic ${clinic.id} missing target bands, hero icon, or summary`);
  }

  // Stage 1: Strategy Guide
  const guide = clinic.strategyGuide;
  if (!guide) {
    throw new Error(`Clinic ${clinic.id} missing strategyGuide`);
  }
  if (!Array.isArray(guide.corePrinciplesFa) || guide.corePrinciplesFa.length < 3) {
    throw new Error(`Clinic ${clinic.id} must have at least 3 corePrinciplesFa, got ${guide.corePrinciplesFa?.length}`);
  }
  if (!guide.goldenFormulaFa || guide.goldenFormulaFa.trim() === "") {
    throw new Error(`Clinic ${clinic.id} missing goldenFormulaFa`);
  }
  if (!guide.timeManagementTipFa || guide.timeManagementTipFa.trim() === "") {
    throw new Error(`Clinic ${clinic.id} missing timeManagementTipFa`);
  }

  // Stage 2: Trap Deconstructions
  const traps = clinic.trapDeconstructions;
  if (!Array.isArray(traps) || traps.length === 0) {
    throw new Error(`Clinic ${clinic.id} must have at least 1 trap deconstruction`);
  }
  totalTraps += traps.length;

  for (const trap of traps) {
    if (!trap.id || !trap.trapTitleFa || !trap.trapTitleEn) {
      throw new Error(`Clinic ${clinic.id} trap missing titles or id: ${JSON.stringify(trap)}`);
    }
    if (!trap.commonWrongChoice || !trap.whyWrongFa) {
      throw new Error(`Clinic ${clinic.id} trap ${trap.id} missing wrong choice or explanation`);
    }
    if (!trap.correctChoice || !trap.whyCorrectFa) {
      throw new Error(`Clinic ${clinic.id} trap ${trap.id} missing correct choice or explanation`);
    }
    if (!trap.examinerSecretFa) {
      throw new Error(`Clinic ${clinic.id} trap ${trap.id} missing examiner secret`);
    }
  }

  // Stage 3: Live Drills
  const drills = clinic.drills;
  if (!Array.isArray(drills) || drills.length < 2) {
    throw new Error(`Clinic ${clinic.id} must have at least 2 practice drills, got ${drills?.length}`);
  }
  totalDrills += drills.length;

  for (const q of drills) {
    if (!q.id || typeof q.orderNumber !== "number") {
      throw new Error(`Clinic ${clinic.id} drill missing id or orderNumber: ${JSON.stringify(q)}`);
    }
    if (!q.promptFa || !q.promptEn) {
      throw new Error(`Clinic ${clinic.id} question ${q.id} missing bilingual prompt`);
    }
    if (!Array.isArray(q.options) || q.options.length < 3) {
      throw new Error(`Clinic ${clinic.id} question ${q.id} must have at least 3 options`);
    }
    if (typeof q.correctAnswerIndex !== "number" || q.correctAnswerIndex < 0 || q.correctAnswerIndex >= q.options.length) {
      throw new Error(`Clinic ${clinic.id} question ${q.id} has invalid correctAnswerIndex: ${q.correctAnswerIndex}`);
    }
    if (!q.trapTypeBadge || !q.trapTypeBadge.startsWith("#")) {
      throw new Error(`Clinic ${clinic.id} question ${q.id} trapTypeBadge must start with '#'`);
    }
    if (!q.explanation || !q.explanation.briefFa || !q.explanation.detailedFa || !q.explanation.cambridgeTipFa) {
      throw new Error(`Clinic ${clinic.id} question ${q.id} missing complete pedagogical explanation`);
    }
  }

  // Check lookup helper
  const lookedUp = getClinicById(clinic.id);
  if (!lookedUp || lookedUp.id !== clinic.id) {
    throw new Error(`getClinicById failed for ${clinic.id}`);
  }
}

console.log(`✓ All 9 clinics passed deep schema validation!`);
console.log(`✓ Total Deconstructed Cambridge Traps: ${totalTraps}`);
console.log(`✓ Total Live Diagnostic Drills: ${totalDrills}`);
console.log("=== ALL IELTS SKILL CLINICS TESTS PASSED SUCCESSFULLY! ===");
