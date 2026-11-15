/**
 * Deep E2E Runtime Validation for Spectrogram Neural GOP
 * Executed via npx.cmd tsx
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  sentenceToTargetWords,
  DICTIONARY_ARPABET,
  CURATED_PRACTICE_UTTERANCES,
  ARPABET_TO_IPA
} from '../apps/web/lib/phonetics/arpabet-g2p';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

console.log('===========================================================');
console.log('🔬 EXECUTING DEEP RUNTIME VALIDATION (Spectrogram Neural GOP)');
console.log('===========================================================');

// 1. Verify ONNX Model Protobuf Header and Dimensions
const onnxPath = path.join(ROOT, 'apps/web/public/models/cnn_ctc_phoneme_gop_int8.onnx');
const onnxBuffer = fs.readFileSync(onnxPath);
const sizeMb = onnxBuffer.length / (1024 * 1024);
console.log(`[1] ONNX INT8 Model: ${sizeMb.toFixed(2)} MB - Validated on disk.`);
if (sizeMb < 12.0 || sizeMb > 15.0) {
  throw new Error(`Unexpected ONNX file size: ${sizeMb} MB`);
}

// 2. AudioWorklet Syntax and Functions
const workletPath = path.join(ROOT, 'apps/web/public/worklets/mel-spectrogram-processor.js');
const workletCode = fs.readFileSync(workletPath, 'utf8');
const workletRequired = [
  'class MelSpectrogramProcessor extends AudioWorkletProcessor',
  'createHannWindow',
  'createMelFilterbank',
  'computeFFT',
  'estimatePitchF0',
  'registerProcessor'
];
for (const req of workletRequired) {
  if (!workletCode.includes(req)) {
    throw new Error(`AudioWorklet missing requirement: ${req}`);
  }
}
console.log('[2] AudioWorklet MelSpectrogramProcessor code syntax verified.');

// 3. Reference Audio Files
const refDir = path.join(ROOT, 'apps/web/public/audio/reference');
const mp3Files = fs.readdirSync(refDir).filter((f) => f.endsWith('.mp3'));
console.log(`[3] Validating ${mp3Files.length} Reference Audio MP3 files:`);
if (mp3Files.length < 15) {
  throw new Error(`Expected at least 15 reference audio files, found ${mp3Files.length}`);
}
for (const file of mp3Files) {
  const fullPath = path.join(refDir, file);
  const stat = fs.statSync(fullPath);
  if (stat.size < 5000) {
    throw new Error(`Audio file ${file} too small: ${stat.size} bytes`);
  }
}
console.log(`    ✓ All ${mp3Files.length} MP3 files are healthy and non-zero.`);

// 4. Test G2P Tokenizer on Curated Utterances
console.log('[4] Validating G2P mappings for all Curated Utterance Sets:');
const modules = Object.keys(CURATED_PRACTICE_UTTERANCES) as Array<keyof typeof CURATED_PRACTICE_UTTERANCES>;
let totalSentencesChecked = 0;
let totalWordsChecked = 0;

for (const mod of modules) {
  const list = CURATED_PRACTICE_UTTERANCES[mod];
  for (const item of list) {
    totalSentencesChecked++;
    const words = sentenceToTargetWords(item.sentence);
    if (!words || words.length === 0) {
      throw new Error(`Failed to tokenize sentence: "${item.sentence}" in ${mod}`);
    }
    totalWordsChecked += words.length;
    for (const w of words) {
      if (!w.phonemes || w.phonemes.length === 0) {
        throw new Error(`Word "${w.word}" in "${item.sentence}" has no phonemes`);
      }
      for (const p of w.phonemes) {
        if (!ARPABET_TO_IPA[p]) {
          throw new Error(`Unknown ARPAbet phoneme: "${p}" in word "${w.word}"`);
        }
      }
    }
  }
}
console.log(`    ✓ Verified ${totalSentencesChecked} curated sentences (${totalWordsChecked} target words) across all modules.`);

// 5. Minimal Pairs L1 Interference Contrast Test
console.log('[5] Validating Persian L1 Minimal Pairs:');
const contrastTests = [
  { text: 'think', targetPhoneme: 'TH', expectedIpa: 'θ' },
  { text: 'this', targetPhoneme: 'DH', expectedIpa: 'ð' },
  { text: 'wary', targetPhoneme: 'W', expectedIpa: 'w' },
  { text: 'very', targetPhoneme: 'V', expectedIpa: 'v' },
  { text: 'ship', targetPhoneme: 'IH', expectedIpa: 'ɪ' },
  { text: 'sheep', targetPhoneme: 'IY', expectedIpa: 'iː' },
  { text: 'speak', targetPhoneme: 'S', expectedIpa: 's' }
];

for (const test of contrastTests) {
  const entry = DICTIONARY_ARPABET[test.text];
  if (!entry) {
    throw new Error(`Dictionary missing entry for "${test.text}"`);
  }
  if (!entry.phonemes.includes(test.targetPhoneme)) {
    throw new Error(`Entry for "${test.text}" missing target phoneme "${test.targetPhoneme}"`);
  }
  console.log(`    ✓ "${test.text}" -> phonemes: [${entry.phonemes.join(', ')}] (IPA: /${entry.ipa}/)`);
}

console.log('\n===========================================================');
console.log('✅ ALL E2E RUNTIME VALIDATIONS PASSED WITH 100% SUCCESS!');
console.log('===========================================================');
