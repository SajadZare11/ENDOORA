import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Edge API Route for Spectrogram Neural GOP Diagnostic Sync
 * Persists Edge AI phoneme assessment results, forward to Django backend
 * (if reachable) for Mistake Genome & Learner Twin aggregation, and returns
 * a resilient status.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const sentenceText = body.sentence_text || '';
    const overallScore = typeof body.overall_score === 'number' ? body.overall_score : 0;
    const fluencyScore = typeof body.fluency_score === 'number' ? body.fluency_score : 0;
    const ieltsBand = body.ielts_band_estimate || '6.5';
    const weakPhonemes = Array.isArray(body.weak_phonemes) ? body.weak_phonemes : [];
    const persianL1Flags = Array.isArray(body.persian_l1_flags) ? body.persian_l1_flags : [];

    // Attempt to proxy to Django API if configured and reachable
    const djangoBaseUrl =
      process.env.DJANGO_API_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://127.0.0.1:8000';

    let backendSynced = false;
    let attemptId: number | null = null;
    let recordedToGenome = false;

    try {
      const authHeader = request.headers.get('authorization') || '';
      const cookieHeader = request.headers.get('cookie') || '';

      const djangoRes = await fetch(`${djangoBaseUrl}/api/pronunciation/diagnostic-sync/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader ? { Authorization: authHeader } : {}),
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(3000), // Fast 3-second timeout to avoid blocking client
      });

      if (djangoRes.ok) {
        const djangoData = await djangoRes.json();
        backendSynced = true;
        attemptId = djangoData.attempt_id || null;
        recordedToGenome = Boolean(djangoData.recorded_to_genome);
      }
    } catch {
      // Backend not running or timeout; client-side Edge AI state handles persistence gracefully
      backendSynced = false;
    }

    return NextResponse.json(
      {
        status: 'success',
        synced_at: new Date().toISOString(),
        sentence_text: sentenceText,
        overall_score: overallScore,
        fluency_score: fluencyScore,
        ielts_band_estimate: ieltsBand,
        weak_phonemes_count: weakPhonemes.length,
        persian_l1_flags: persianL1Flags,
        backend_synced: backendSynced,
        attempt_id: attemptId,
        recorded_to_genome: recordedToGenome,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error handling pronunciation diagnostic sync:', error);
    return NextResponse.json(
      { error: 'Failed to process diagnostic sync' },
      { status: 500 }
    );
  }
}
