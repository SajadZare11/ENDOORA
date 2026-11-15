/**
 * Phonetic Diagnostic Profile Client Sync Helper
 * Manages local storage persistence, cross-component reactive window events,
 * and asynchronous synchronization with the backend Mistake Genome and Learner Twin.
 */

import { GOPAssessmentPayload } from './arpabet-g2p';

export interface PhoneticDiagnosticProfile {
  lastUpdated: string;
  totalAssessments: number;
  weakPhonemes: string[];
  persianL1Flags: string[];
  history: Array<{
    date: string;
    sentence: string;
    source: string;
    score: number;
    band: string;
    weakCount: number;
  }>;
}

const STORAGE_KEY = 'endoora_phoneme_diagnostic_profile';
export const PHONEME_PROFILE_EVENT = 'endoora_phoneme_profile_updated';

/**
 * Persists GOP assessment to localStorage, dispatches reactive UI update event,
 * and asynchronously syncs to backend Mistake Genome.
 */
export async function syncPhoneticAssessment(
  assessment: GOPAssessmentPayload,
  moduleSource: string = 'PHONETICS_LAB',
  sentenceText: string = ''
): Promise<void> {
  if (typeof window === 'undefined') return;

  // 1. Update localStorage profile
  try {
    const existingRaw = localStorage.getItem(STORAGE_KEY);
    let profile: PhoneticDiagnosticProfile = existingRaw
      ? JSON.parse(existingRaw)
      : {
          lastUpdated: new Date().toISOString(),
          totalAssessments: 0,
          weakPhonemes: [],
          persianL1Flags: [],
          history: [],
        };

    const newWeak = assessment.weakPhonemes || [];
    const newFlags = assessment.persianL1Flags || [];

    // Deduplicate and prioritize weak phonemes
    const combinedWeak = Array.from(new Set([...newWeak, ...profile.weakPhonemes])).slice(0, 8);
    const combinedFlags = Array.from(new Set([...newFlags, ...(profile.persianL1Flags || [])]));

    profile = {
      lastUpdated: new Date().toISOString(),
      totalAssessments: (profile.totalAssessments || 0) + 1,
      weakPhonemes: combinedWeak,
      persianL1Flags: combinedFlags,
      history: [
        {
          date: new Date().toISOString(),
          sentence: sentenceText.slice(0, 100),
          source: moduleSource,
          score: assessment.overallScore,
          band: String(assessment.ieltsBandEstimate),
          weakCount: newWeak.length,
        },
        ...(profile.history || []).slice(0, 19), // Keep latest 20
      ],
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));

    // 2. Dispatch cross-component reactive window event
    window.dispatchEvent(
      new CustomEvent(PHONEME_PROFILE_EVENT, {
        detail: profile,
      })
    );
  } catch (err) {
    console.warn('Failed to update local phonetic diagnostic profile:', err);
  }

  // 3. Asynchronously sync to backend endpoint without blocking UI
  try {
    const payload = {
      sentence_text: sentenceText,
      module_source: moduleSource,
      overall_score: assessment.overallScore,
      fluency_score: assessment.fluencyScore,
      ielts_band_estimate: assessment.ieltsBandEstimate,
      total_phonemes: assessment.totalPhonemes,
      weak_phonemes: assessment.weakPhonemes,
      persian_l1_flags: assessment.persianL1Flags,
      words: assessment.words,
      backend: assessment.backend || 'edge',
      inference_time_ms: assessment.inferenceTimeMs,
    };

    // Use keepalive for reliable delivery even if user navigates away
    void fetch('/api/pronunciation/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      // Offline fallback: silent ignore, already saved in localStorage
    });
  } catch {
    // Non-blocking catch
  }
}

/**
 * Retrieves the currently saved diagnostic profile from localStorage.
 */
export function getSavedPhoneticProfile(): PhoneticDiagnosticProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
