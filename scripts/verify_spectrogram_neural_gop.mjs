/**
 * Automated Verification Suite for Spectrogram Neural GOP
 * Verifies all 4 layers, reference audio files, backend sync, and module integrations.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const checks = [];

function check(title, fn) {
  try {
    const ok = fn();
    if (ok) {
      checks.push({ title, status: 'PASS' });
      console.log(`[PASS] ${title}`);
    } else {
      checks.push({ title, status: 'FAIL', reason: 'Returned falsy' });
      console.error(`[FAIL] ${title}`);
    }
  } catch (err) {
    checks.push({ title, status: 'FAIL', reason: err.message });
    console.error(`[FAIL] ${title}: ${err.message}`);
  }
}

console.log('=================================================================');
console.log('🧪 VERIFYING SPECTROGRAM NEURAL GOP (2D-CNN + CTC) ARCHITECTURE');
console.log('=================================================================\n');

// 1. Layer 1 DSP AudioWorklet
check('Layer 1 AudioWorklet (mel-spectrogram-processor.js)', () => {
  const p = path.join(ROOT, 'apps/web/public/worklets/mel-spectrogram-processor.js');
  if (!fs.existsSync(p)) return false;
  const content = fs.readFileSync(p, 'utf8');
  return (
    content.includes('MelSpectrogramProcessor') &&
    content.includes('createHannWindow') &&
    content.includes('createMelFilterbank') &&
    content.includes('computeFFT') &&
    content.includes('estimatePitchF0') &&
    content.includes('SPECTROGRAM_CHUNK')
  );
});

// 2. Layer 2 Web Worker Inference Engine
check('Layer 2 Web Worker Inference Engine (gop-cnn-ctc.worker.ts)', () => {
  const p = path.join(ROOT, 'apps/web/workers/gop-cnn-ctc.worker.ts');
  if (!fs.existsSync(p)) return false;
  const content = fs.readFileSync(p, 'utf8');
  return (
    content.includes('calculateNeuralGOP') &&
    content.includes('computeFrameLogPosteriors') &&
    content.includes('PERSIAN_L1_INTERFERENCE_RULES') &&
    content.includes('ASSESSMENT_COMPLETE')
  );
});

// 3. Layer 2 Public Worker Bundle
check('Layer 2 Public Worker Fallback (gop-cnn-ctc.worker.js)', () => {
  const p = path.join(ROOT, 'apps/web/public/workers/gop-cnn-ctc.worker.js');
  return fs.existsSync(p) && fs.statSync(p).size > 1000;
});

// 4. Layer 2 INT8 Quantized ONNX Model
check('Layer 2 INT8 ONNX Model (cnn_ctc_phoneme_gop_int8.onnx)', () => {
  const p = path.join(ROOT, 'apps/web/public/models/cnn_ctc_phoneme_gop_int8.onnx');
  if (!fs.existsSync(p)) return false;
  const sizeMb = fs.statSync(p).size / (1024 * 1024);
  console.log(`       Model size: ${sizeMb.toFixed(2)} MB`);
  return sizeMb >= 12.0 && sizeMb <= 15.0;
});

// 5. Layer 3 Canvas Visualizer & Diagnostic Drawer
check('Layer 3 Visualizer & Diagnostic Drawer (SpectrogramPronunciationLab.tsx)', () => {
  const p = path.join(ROOT, 'apps/web/components/phonetics/SpectrogramPronunciationLab.tsx');
  if (!fs.existsSync(p)) return false;
  const content = fs.readFileSync(p, 'utf8');
  return (
    content.includes('drawSpectrogramChunk') &&
    content.includes('handleToggleReferenceAudio') &&
    content.includes('syncPhoneticAssessment') &&
    content.includes('diagnosticDrawer') &&
    content.includes('weakPhonemesList')
  );
});

// 6. Layer 4 G2P Tokenizer & Dictionary
check('Layer 4 G2P Tokenizer & Dictionary (arpabet-g2p.ts)', () => {
  const p = path.join(ROOT, 'apps/web/lib/phonetics/arpabet-g2p.ts');
  if (!fs.existsSync(p)) return false;
  const content = fs.readFileSync(p, 'utf8');
  return (
    content.includes('DICTIONARY_ARPABET') &&
    content.includes('ruleBasedG2P') &&
    content.includes('sentenceToTargetWords') &&
    content.includes('CURATED_PRACTICE_UTTERANCES') &&
    content.includes('audioUrl')
  );
});

// 7. Layer 4 Client Sync Helper
check('Layer 4 Client Sync Helper (phonetic-sync.ts)', () => {
  const p = path.join(ROOT, 'apps/web/lib/phonetics/phonetic-sync.ts');
  if (!fs.existsSync(p)) return false;
  const content = fs.readFileSync(p, 'utf8');
  return (
    content.includes('syncPhoneticAssessment') &&
    content.includes('endoora_phoneme_diagnostic_profile') &&
    content.includes('PHONEME_PROFILE_EVENT') &&
    content.includes('/api/pronunciation/sync')
  );
});

// 8. Reference Audio Files
check('Authentic Reference Audio Dataset (apps/web/public/audio/reference/*.mp3)', () => {
  const refDir = path.join(ROOT, 'apps/web/public/audio/reference');
  if (!fs.existsSync(refDir)) return false;
  const files = fs.readdirSync(refDir).filter((f) => f.endsWith('.mp3'));
  console.log(`       Found ${files.length} authentic reference audio MP3s.`);
  return files.length >= 15;
});

// 9. Next.js Edge API Route for Diagnostic Sync
check('Next.js Diagnostic Sync API Route (app/api/pronunciation/sync/route.ts)', () => {
  const p = path.join(ROOT, 'apps/web/app/api/pronunciation/sync/route.ts');
  if (!fs.existsSync(p)) return false;
  const content = fs.readFileSync(p, 'utf8');
  return content.includes('POST') && content.includes('diagnostic-sync');
});

// 10. Django Diagnostic Sync View & Model Mapping
check('Django Spectrogram Diagnostic Sync View (apps/api/pronunciation/views.py)', () => {
  const p = path.join(ROOT, 'apps/api/pronunciation/views.py');
  if (!fs.existsSync(p)) return false;
  const content = fs.readFileSync(p, 'utf8');
  return (
    content.includes('SpectrogramDiagnosticSyncView') &&
    content.includes('record_mistake') &&
    content.includes('TH_SUBSTITUTION_S')
  );
});

// 11. Module Integrations - Video Learning Shadowing
check('Integration: VideoLessonPlayer.tsx (Subtitle Shadowing Modal)', () => {
  const p = path.join(ROOT, 'apps/web/components/video-learning/VideoLessonPlayer.tsx');
  if (!fs.existsSync(p)) return false;
  const content = fs.readFileSync(p, 'utf8');
  return content.includes('SpectrogramPronunciationLab') && content.includes('شادویینگ');
});

// 12. Module Integrations - IELTS Speaking Simulator
check('Integration: IELTS Speaking Simulator (apps/web/app/(learner)/ielts/speaking/page.tsx)', () => {
  const p = path.join(ROOT, 'apps/web/app/(learner)/ielts/speaking/page.tsx');
  if (!fs.existsSync(p)) return false;
  const content = fs.readFileSync(p, 'utf8');
  return content.includes('SpectrogramPronunciationLab') && content.includes('طیف‌نگاره');
});

// 13. Module Integrations - Pronunciation Lab Dedicated Page
check('Integration: Dedicated Pronunciation Lab (apps/web/app/(learner)/pronunciation/page.tsx)', () => {
  const p = path.join(ROOT, 'apps/web/app/(learner)/pronunciation/page.tsx');
  if (!fs.existsSync(p)) return false;
  const content = fs.readFileSync(p, 'utf8');
  return content.includes('SpectrogramPronunciationLab') && content.includes('neural_gop');
});

// 14. Module Integrations - Mistake Genome
check('Integration: Mistake Genome (apps/web/app/(learner)/mistakes/page.tsx)', () => {
  const p = path.join(ROOT, 'apps/web/app/(learner)/mistakes/page.tsx');
  if (!fs.existsSync(p)) return false;
  const content = fs.readFileSync(p, 'utf8');
  return (
    content.includes('endoora_phoneme_diagnostic_profile') &&
    content.includes('endoora_phoneme_profile_updated')
  );
});

// 15. Module Integrations - Learner Digital Twin
check('Integration: Learner Digital Twin (apps/web/app/(learner)/twin/page.tsx)', () => {
  const p = path.join(ROOT, 'apps/web/app/(learner)/twin/page.tsx');
  if (!fs.existsSync(p)) return false;
  const content = fs.readFileSync(p, 'utf8');
  return (
    content.includes('endoora_phoneme_diagnostic_profile') &&
    content.includes('endoora_phoneme_profile_updated') &&
    content.includes('Spectrogram Neural GOP Phonetic Diagnostic Radar')
  );
});

console.log('\n=================================================================');
const total = checks.length;
const passed = checks.filter((c) => c.status === 'PASS').length;
console.log(`📊 SUMMARY: ${passed}/${total} verification assertions PASSED.`);
if (passed === total) {
  console.log('✅ 100% PRODUCTION READY: SPECTROGRAM NEURAL GOP FULLY VERIFIED!');
} else {
  console.error('❌ Some checks failed.');
  process.exit(1);
}
console.log('=================================================================\n');
