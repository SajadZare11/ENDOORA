// Comprehensive validation script for all 6 CEFR grammar spec modules
import { A1_SPECS } from './grammar-specs/a1.mjs';
import { A2_SPECS } from './grammar-specs/a2.mjs';
import { B1_SPECS } from './grammar-specs/b1.mjs';
import { B2_SPECS } from './grammar-specs/b2.mjs';
import { C1_SPECS } from './grammar-specs/c1.mjs';
import { C2_SPECS } from './grammar-specs/c2.mjs';

const allSpecs = {
  A1: A1_SPECS,
  A2: A2_SPECS,
  B1: B1_SPECS,
  B2: B2_SPECS,
  C1: C1_SPECS,
  C2: C2_SPECS,
};

let totalStages = 0;
let totalSentences = 0;
let totalErrors = 0;

for (const [tier, stages] of Object.entries(allSpecs)) {
  const stageKeys = Object.keys(stages);
  console.log(`\nValidating Tier ${tier}: ${stageKeys.length} stages found.`);
  
  if (stageKeys.length !== 10) {
    console.error(`ERROR: Tier ${tier} has ${stageKeys.length} stages, expected 10!`);
    totalErrors++;
  }
  
  for (let stageNum = 1; stageNum <= 10; stageNum++) {
    const list = stages[stageNum] || stages[String(stageNum)];
    totalStages++;
    
    if (!list) {
      console.error(`ERROR: Tier ${tier} stage ${stageNum} is missing!`);
      totalErrors++;
      continue;
    }
    
    if (list.length !== 20) {
      console.error(`ERROR: Tier ${tier} stage ${stageNum} has ${list.length} sentences, expected 20!`);
      totalErrors++;
    }
    
    list.forEach((item, idx) => {
      totalSentences++;
      
      // Check prompt
      if (!item.prompt || typeof item.prompt !== 'string') {
        console.error(`ERROR: Tier ${tier}.${stageNum}[${idx}] missing prompt`);
        totalErrors++;
      }
      
      // Check translation
      if (!item.trans || typeof item.trans !== 'string') {
        console.error(`ERROR: Tier ${tier}.${stageNum}[${idx}] missing trans`);
        totalErrors++;
      } else {
        if (item.trans.includes('جمله تمرینی') || item.trans.includes('مبحث گرامری')) {
          console.error(`ERROR: Tier ${tier}.${stageNum}[${idx}] has placeholder translation: ${item.trans}`);
          totalErrors++;
        }
      }
      
      // Check steps
      if (!Array.isArray(item.steps) || item.steps.length === 0) {
        console.error(`ERROR: Tier ${tier}.${stageNum}[${idx}] has no steps`);
        totalErrors++;
      } else {
        item.steps.forEach((step, stepIdx) => {
          if (!step.corr) {
            console.error(`ERROR: Tier ${tier}.${stageNum}[${idx}] step ${stepIdx} missing corr`);
            totalErrors++;
          }
          if (!Array.isArray(step.dist) || step.dist.length < 2) {
            console.error(`ERROR: Tier ${tier}.${stageNum}[${idx}] step ${stepIdx} dist length < 2`);
            totalErrors++;
          }
          if (step.dist && step.dist.includes(step.corr)) {
            console.error(`ERROR: Tier ${tier}.${stageNum}[${idx}] step ${stepIdx} corr found in dist`);
            totalErrors++;
          }
        });
      }
    });
  }
}

console.log(`\n================ SUMMARY ================`);
console.log(`Total Stages: ${totalStages} / 60`);
console.log(`Total Sentences: ${totalSentences} / 1200`);
console.log(`Total Errors: ${totalErrors}`);

if (totalErrors === 0 && totalSentences === 1200) {
  console.log(`🎉 ALL 1,200 SENTENCES AND 60 STAGES ARE 100% VALID AND COMPLETE!`);
} else {
  process.exit(1);
}
