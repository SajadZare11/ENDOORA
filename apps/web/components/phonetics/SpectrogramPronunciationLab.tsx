// apps/web/components/phonetics/SpectrogramPronunciationLab.tsx
'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import type {
  TargetWordPhonemes,
  GOPAssessmentPayload,
  PhonemeGOPResult
} from '../../workers/gop-cnn-ctc.worker';
import { sentenceToTargetWords } from '../../lib/phonetics/arpabet-g2p';
import { syncPhoneticAssessment } from '../../lib/phonetics/phonetic-sync';
import { ensureTwinLearnerScope, beginTwinAssessment, finishTwinAssessment, type TwinAssessment } from '../../lib/ai/learner-twin-store';
import styles from './spectrogram-lab.module.css';

export interface SpectrogramPronunciationLabProps {
  sentenceId?: string;
  sentenceText: string;
  nativeAudioUrl?: string;
  cefrLevel?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  moduleSource?: 'AEF_Practical_English' | 'Speakout_BBC' | 'IELTS_Speaking' | 'Phonetics_Lab';
  targetWords?: TargetWordPhonemes[];
  onAssessmentComplete?: (result: GOPAssessmentPayload) => void;
  className?: string;
}

const STORAGE_KEY_DIAGNOSTICS = 'endoora_phoneme_diagnostic_profile';

export const SpectrogramPronunciationLab: React.FC<SpectrogramPronunciationLabProps> = ({
  sentenceText,
  nativeAudioUrl,
  cefrLevel = 'B2',
  moduleSource = 'AEF_Practical_English',
  targetWords: customTargetWords,
  onAssessmentComplete,
  className
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [backendStatus, setBackendStatus] = useState<string>('Initializing Edge AI...');
  const [assessment, setAssessment] = useState<GOPAssessmentPayload | null>(null);
  const [selectedPhoneme, setSelectedPhoneme] = useState<PhonemeGOPResult | null>(null);
  const [trackedWeakPhonemes, setTrackedWeakPhonemes] = useState<string[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [workerError, setWorkerError] = useState<string | null>(null);

  const audioInstanceRef = useRef<HTMLAudioElement | null>(null);

  // Automatically tokenize sentence into ARPAbet target words if not provided
  const targetWords = useMemo<TargetWordPhonemes[]>(() => {
    if (customTargetWords && customTargetWords.length > 0) {
      return customTargetWords;
    }
    return sentenceToTargetWords(sentenceText);
  }, [customTargetWords, sentenceText]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const twinAssessmentRef=useRef<TwinAssessment|null>(null);
  useEffect(()=>{void ensureTwinLearnerScope();},[]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Accumulated audio feature buffers for current utterance
  const melChunksRef = useRef<Float32Array[]>([]);
  const pitchChunksRef = useRef<Float32Array[]>([]);
  const rmsChunksRef = useRef<Float32Array[]>([]);
  const totalFramesRef = useRef<number>(0);

  // Load weak phoneme history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DIAGNOSTICS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.weakPhonemes)) {
          setTrackedWeakPhonemes(parsed.weakPhonemes.slice(0, 8));
        }
      }
    } catch {
      // Ignore localStorage read failures in sandboxed contexts
    }
  }, []);

  // Save detected weak phonemes into persistent user diagnostic profile
  const persistPhonemeDiagnostics = useCallback((newResult: GOPAssessmentPayload) => {
    try {
      const newlyFailedPhonemes: string[] = [];
      newResult.words.forEach((w) => {
        w.phonemes.forEach((p) => {
          if (p.status !== 'native' && !newlyFailedPhonemes.includes(p.ipaSymbol)) {
            newlyFailedPhonemes.push(p.ipaSymbol);
          }
        });
      });

      if (newlyFailedPhonemes.length > 0) {
        const currentSaved = localStorage.getItem(STORAGE_KEY_DIAGNOSTICS);
        const prevList: string[] = currentSaved ? JSON.parse(currentSaved).weakPhonemes || [] : [];
        const combined = Array.from(new Set([...newlyFailedPhonemes, ...prevList])).slice(0, 10);
        localStorage.setItem(
          STORAGE_KEY_DIAGNOSTICS,
          JSON.stringify({
            weakPhonemes: combined,
            lastUpdated: new Date().toISOString()
          })
        );
        setTrackedWeakPhonemes(combined);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Initialize Web Worker with fallback and comprehensive error handling
  useEffect(() => {
    let worker: Worker | null = null;
    let isTerminated = false;

    const handleWorkerError = (errorMessage: string) => {
      if (isTerminated) return;
      console.error('[SpectrogramPronunciationLab] Worker error:', errorMessage);
      setIsProcessing(false);
      setIsRecording(false);
      setBackendStatus('Edge AI Error');
      twinAssessmentRef.current = null;
      setWorkerError(errorMessage);
    };

    try {
      try {
        worker = new Worker(
          new URL('../../workers/gop-cnn-ctc.worker.ts', import.meta.url),
          { type: 'module' }
        );
      } catch {
        worker = new Worker('/workers/gop-cnn-ctc.worker.js', { type: 'module' });
      }

      worker.onmessage = (e: MessageEvent) => {
        if (isTerminated) return;
        const { type, backend, payload } = e.data;

        if (type === 'MODEL_READY') {
          const backendName = backend === 'webgpu' ? 'WebGPU' : backend === 'wasm' ? 'WASM' : 'Acoustic DSP';
          setBackendStatus(`2D-CNN + CTC (${backendName})`);
          setWorkerError(null);
        } else if (type === 'ASSESSMENT_COMPLETE') {
          const result = payload as GOPAssessmentPayload;
          finishTwinAssessment(twinAssessmentRef.current, result.overallScore / 100);
          twinAssessmentRef.current = null;
          setAssessment(result);
          setIsProcessing(false);
          setWorkerError(null);
          persistPhonemeDiagnostics(result);
          void syncPhoneticAssessment(result, moduleSource, sentenceText);

          // Auto-select first non-native phoneme for immediate diagnostic feedback
          for (const w of result.words) {
            const weak = w.phonemes.find((p: PhonemeGOPResult) => p.status !== 'native');
            if (weak) {
              setSelectedPhoneme(weak);
              break;
            }
          }
          onAssessmentComplete?.(result);
        } else if (type === 'ERROR') {
          handleWorkerError(
            payload?.message || 'خطا در ارزیابی و استنتاج مدل واج‌شناسی هوش مصنوعی.'
          );
        }
      };

      worker.onerror = (e: ErrorEvent) => {
        const errorDetails = e.message || 'Worker runtime error';
        handleWorkerError(
          `خطا در بارگذاری یا پردازش مدل هوش مصنوعی صوت: ${errorDetails}`
        );
      };

      worker.postMessage({ type: 'INIT_MODEL' });
      workerRef.current = worker;
    } catch {
      handleWorkerError(
        'مرورگر شما از وب‌ورکرها یا پردازش صوت در سمت کاربر پشتیبانی نمی‌کند.'
      );
    }

    return () => {
      isTerminated = true;
      if (worker) {
        worker.terminate();
      }
      workerRef.current = null;
    };
  }, [moduleSource, onAssessmentComplete, persistPhonemeDiagnostics, sentenceText]);

  // Real-time 80-Bin Mel-Spectrogram + F0 Pitch Contour Canvas Renderer (60 FPS)
  const drawSpectrogramChunk = useCallback(
    (melFrames: Float32Array, pitchFrames: Float32Array, frameCount: number, numBins: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const colWidth = 3;
      const shiftPx = frameCount * colWidth;

      // Shift existing spectrogram left
      const imageData = ctx.getImageData(shiftPx, 0, width - shiftPx, height);
      ctx.putImageData(imageData, 0, 0);

      // Draw new Mel-Spectrogram columns on the right edge
      const binHeight = height / numBins;
      for (let f = 0; f < frameCount; f++) {
        const x = width - shiftPx + f * colWidth;
        for (let b = 0; b < numBins; b++) {
          const logEnergy = melFrames[f * numBins + b]; // Typically [-23, 2]
          const normalized = Math.max(0, Math.min(1, (logEnergy + 18) / 18));

          // Thermal acoustic palette
          const r = Math.floor(Math.min(255, normalized * 310));
          const g = Math.floor(Math.pow(normalized, 1.6) * 230);
          const bCol = Math.floor(60 + (1 - normalized) * 140);

          ctx.fillStyle = `rgb(${r}, ${g}, ${bCol})`;
          const y = height - (b + 1) * binHeight;
          ctx.fillRect(x, y, colWidth, Math.ceil(binHeight));
        }

        // Overlay F0 Pitch Contour Dot (Cyan dot for pitch in 75-450 Hz)
        const pitchHz = pitchFrames[f];
        if (pitchHz >= 75 && pitchHz <= 450) {
          const pitchY = height - ((pitchHz - 75) / (450 - 75)) * (height * 0.85) - 10;
          ctx.fillStyle = '#22d3ee';
          ctx.beginPath();
          ctx.arc(x + colWidth / 2, pitchY, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
    []
  );

  // Play Native English Reference Audio (Tier 1: prop url -> Tier 2: speech synthesis API -> Tier 3: Web Speech API)
  const handleToggleReferenceAudio = useCallback(() => {
    if (isPlayingAudio) {
      if (audioInstanceRef.current) {
        audioInstanceRef.current.pause();
        audioInstanceRef.current.currentTime = 0;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      return;
    }

    const fallbackToSpeechSynthesis = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(sentenceText);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setIsPlayingAudio(false);
      }
    };

    const playUrl =
      nativeAudioUrl ||
      `/api/speech/synthesize?text=${encodeURIComponent(sentenceText)}&lang=en-US`;

    const audio = new Audio(playUrl);
    audioInstanceRef.current = audio;
    setIsPlayingAudio(true);

    audio.onended = () => {
      setIsPlayingAudio(false);
    };

    audio.onerror = () => {
      fallbackToSpeechSynthesis();
    };

    audio.play().catch(() => {
      fallbackToSpeechSynthesis();
    });
  }, [isPlayingAudio, nativeAudioUrl, sentenceText]);

  // Teardown audio when unmounting
  useEffect(() => {
    return () => {
      if (audioInstanceRef.current) {
        audioInstanceRef.current.pause();
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setWorkerError(null);
      twinAssessmentRef.current=beginTwinAssessment('cnn_pronunciation');
      setAssessment(null);
      setSelectedPhoneme(null);
      melChunksRef.current = [];
      pitchChunksRef.current = [];
      rmsChunksRef.current = [];
      totalFramesRef.current = 0;

      // Clear canvas with dark background
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#020617';
          ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      mediaStreamRef.current = stream;

      const audioCtx = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;

      await audioCtx.audioWorklet.addModule('/worklets/mel-spectrogram-processor.js');
      const source = audioCtx.createMediaStreamSource(stream);
      const workletNode = new AudioWorkletNode(audioCtx, 'mel-spectrogram-processor');

      workletNode.port.onmessage = (event: MessageEvent) => {
        if (event.data.type === 'SPECTROGRAM_CHUNK') {
          const { melFrames, pitchFrames, rmsFrames, frameCount, numBins } = event.data;
          melChunksRef.current.push(melFrames);
          pitchChunksRef.current.push(pitchFrames);
          rmsChunksRef.current.push(rmsFrames);
          totalFramesRef.current += frameCount;

          drawSpectrogramChunk(melFrames, pitchFrames, frameCount, numBins);
        }
      };

      source.connect(workletNode);
      workletNodeRef.current = workletNode;
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start microphone or AudioWorklet:', err);
      alert('دسترسی به میکروفون امکان‌پذیر نشد. لطفاً مجوز میکروفون در مرورگر را بررسی کنید.');
    }
  };

  const stopRecordingAndEvaluate = async () => {
    setIsRecording(false);
    setIsProcessing(true);

    try {
      workletNodeRef.current?.disconnect();
      mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
      await audioContextRef.current?.close();
    } catch {
      // Ignore teardown errors
    }

    const numFrames = totalFramesRef.current;
    const numBins = 80;

    if (numFrames === 0 || !workerRef.current) {
      setIsProcessing(false);
      return;
    }

    // Concatenate recorded chunks into flat Float32Arrays
    const fullMel = new Float32Array(numFrames * numBins);
    const fullPitch = new Float32Array(numFrames);
    const fullRms = new Float32Array(numFrames);

    let melOffset = 0;
    let frameOffset = 0;
    for (let i = 0; i < melChunksRef.current.length; i++) {
      fullMel.set(melChunksRef.current[i], melOffset);
      fullPitch.set(pitchChunksRef.current[i], frameOffset);
      fullRms.set(rmsChunksRef.current[i], frameOffset);
      melOffset += melChunksRef.current[i].length;
      frameOffset += pitchChunksRef.current[i].length;
    }

    try {
      workerRef.current.postMessage(
        {
          type: 'EVALUATE_UTTERANCE',
          payload: {
            melSpectrogram: fullMel,
            pitchFrames: fullPitch,
            rmsFrames: fullRms,
            numFrames,
            numBins,
            targetWords
          }
        },
        [fullMel.buffer, fullPitch.buffer, fullRms.buffer]
      );
    } catch (postErr) {
      console.error('Failed to dispatch audio buffers to worker:', postErr);
      setIsProcessing(false);
      setWorkerError('خطا در ارسال داده‌های صوتی به ورکر پردازش واج.');
    }
  };

  return (
    <div className={`${styles.container} ${className || ''}`} dir="ltr">
      {/* Header Bar */}
      <div className={styles.headerBar}>
        <div className={styles.headerLeft}>
          <div className={styles.badgesRow}>
            <span className={styles.sourceBadge}>{moduleSource.replace(/_/g, ' ')}</span>
            <span className={styles.cefrBadge}>CEFR {cefrLevel}</span>
          </div>
          <h3 className={styles.title}>Spectrogram Neural GOP Pronunciation Lab</h3>
        </div>
        <div className={styles.engineBadge} title="Client-Side Zero-Server Edge AI Engine">
          Engine: {backendStatus}
        </div>
      </div>

      {/* Target Utterance & Phoneme Cards */}
      <div className={styles.targetCard}>
        <div className={styles.targetHeader}>
          <span className={styles.targetLabel}>
            Target Utterance (Click any phoneme for Persian articulatory diagnosis)
          </span>
        </div>

        {!assessment ? (
          <p className={styles.sentenceText}>{sentenceText}</p>
        ) : (
          <div className={styles.wordsGrid}>
            {assessment.words.map((w, wIdx) => (
              <div key={wIdx} className={styles.wordCard}>
                <span className={styles.wordText}>{w.word}</span>
                <div className={styles.phonemesRow}>
                  <span className={styles.slash}>/</span>
                  {w.phonemes.map((p, pIdx) => {
                    const statusClass =
                      p.status === 'native'
                        ? styles.statusNative
                        : p.status === 'Needs_Work'
                        ? styles.statusNeedsWork
                        : styles.statusMispronounced;
                    const isSelected = selectedPhoneme === p;
                    return (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => setSelectedPhoneme(p)}
                        className={`${styles.phonemeBtn} ${statusClass}`}
                        style={isSelected ? { outline: '2px solid #6366f1', transform: 'scale(1.08)' } : undefined}
                        title={`GOP: ${p.gopScore}% | Produced: /${p.detectedPhoneme}/ | Raw: ${p.rawLogRatio}`}
                      >
                        {p.ipaSymbol}
                      </button>
                    );
                  })}
                  <span className={styles.slash}>/</span>
                </div>
                <span className={styles.wordScoreBadge}>{w.wordScore}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Real-Time 80-Bin Mel-Spectrogram & F0 Pitch Canvas */}
      <div className={styles.spectrogramContainer}>
        <canvas ref={canvasRef} width={800} height={180} className={styles.canvas} />
        <div className={styles.canvasLegend}>
          <span>80-Bin Log-Mel Spectrogram (2D-CNN Input)</span>
          <span className={styles.pitchIndicator}>
            <span className={styles.pitchDot} />
            F0 Pitch Contour (Intonation)
          </span>
        </div>
      </div>

      {/* Worker Error Notification Banner */}
      {workerError && (
        <div
          className="p-3.5 bg-rose-950/50 border border-rose-800/80 rounded-xl text-rose-200 text-sm flex items-center justify-between gap-3 shadow-lg transition-all"
          role="alert"
          dir="rtl"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-rose-400 text-lg leading-none">⚠️</span>
            <span className="font-medium">{workerError}</span>
          </div>
          <button
            type="button"
            onClick={() => setWorkerError(null)}
            className="text-xs text-rose-300 hover:text-white px-2.5 py-1 rounded-md bg-rose-900/60 hover:bg-rose-800 border border-rose-700/60 transition-colors"
          >
            بستن
          </button>
        </div>
      )}

      {/* Controls & Metrics Row */}
      <div className={styles.controlsRow}>
        <div className={styles.buttonsGroup}>
          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              disabled={isProcessing}
              className={styles.btnPrimary}
            >
              {isProcessing ? 'Analyzing Spectrogram...' : '🎙️ Start Shadowing (Mic)'}
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecordingAndEvaluate}
              className={styles.btnRecording}
            >
              ⏹️ Stop & Run Neural GOP
            </button>
          )}

          <button
            type="button"
            onClick={handleToggleReferenceAudio}
            className={`${styles.btnSecondary} ${isPlayingAudio ? styles.btnPlayingAudio : ''}`}
            title="Listen to authentic native pronunciation reference"
          >
            {isPlayingAudio ? '⏹️ Stop Reference' : '🔊 Play Native Reference'}
          </button>
        </div>

        {assessment && (
          <div className={styles.metricsSummary}>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>GOP Accuracy:</span>
              <span className={styles.metricValueGOP}>{assessment.overallScore}%</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>Fluency:</span>
              <span className={styles.metricValueFluency}>{assessment.fluencyScore}%</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricLabel}>IELTS Band:</span>
              <span className={styles.metricValueBand}>{assessment.ieltsBandEstimate}</span>
            </div>
            <span className={styles.metricLatency}>{assessment.inferenceTimeMs}ms (0% Server Load)</span>
          </div>
        )}
      </div>

      {/* Persian Articulatory Diagnostic Drawer for Selected Phoneme */}
      {selectedPhoneme && (
        <div className={styles.diagnosticDrawer}>
          <div className={styles.drawerHeader}>
            <span className={styles.drawerTitle}>
              تحلیل آواشناختی واج انتخاب‌شده: /{selectedPhoneme.ipaSymbol}/
            </span>
            <span className={styles.drawerMeta} dir="ltr">
              Produced: /{selectedPhoneme.detectedPhoneme}/ · GOP: {selectedPhoneme.gopScore}% · Log-Ratio: {selectedPhoneme.rawLogRatio} · [{selectedPhoneme.startTimeMs}ms - {selectedPhoneme.endTimeMs}ms]
            </span>
          </div>
          <p className={styles.drawerTipFa}>
            {selectedPhoneme.diagnosticTipFa}
          </p>
          <p className={styles.drawerRuleEn}>
            Articulatory Target: {selectedPhoneme.articulatoryRuleEn}
          </p>
        </div>
      )}

      {/* Tracked Weak Phonemes Across Sessions */}
      {trackedWeakPhonemes.length > 0 && (
        <div className={styles.weakPhonemesList}>
          <span>پروفایل تشخیصی واج‌های پرتکرار کاربر:</span>
          {trackedWeakPhonemes.map((sym, i) => (
            <span key={i} className={styles.weakTag}>
              /{sym}/
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpectrogramPronunciationLab;
