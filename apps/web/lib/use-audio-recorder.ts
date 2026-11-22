"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export interface UseAudioRecorderOptions {
  timeLimitSeconds?: number | null;
  onTimeLimitReached?: () => void;
}

export interface AudioRecorderState {
  isRecording: boolean;
  isPaused: boolean;
  recordingDuration: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
  waveformData: number[];
  error: string | null;
}

export function useAudioRecorder(options: UseAudioRecorderOptions = {}) {
  const { timeLimitSeconds, onTimeLimitReached } = options;

  const [state, setState] = useState<AudioRecorderState>({
    isRecording: false,
    isPaused: false,
    recordingDuration: 0,
    audioBlob: null,
    audioUrl: null,
    waveformData: new Array(24).fill(0.1),
    error: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const activeRequest = useRef(0);
  const starting = useRef(false);
  const blobUrl = useRef<string | null>(null);

  const releaseResources = useCallback(() => {
    if (timerRef.current !== null) clearInterval(timerRef.current);
    if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
    timerRef.current = null;
    animationFrameRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    const context = audioContextRef.current;
    if (context && context.state !== "closed") void context.close().catch(() => {});
    audioContextRef.current = null;
    analyserRef.current = null;
  }, []);

  const discard = useCallback(() => {
    activeRequest.current += 1;
    starting.current = false;
    const recorder = mediaRecorderRef.current;
    if (recorder) {
      recorder.onstop = null;
      recorder.ondataavailable = null;
      if (recorder.state !== "inactive") recorder.stop();
    }
    mediaRecorderRef.current = null;
    releaseResources();
    if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
    blobUrl.current = null;
  }, [releaseResources]);

  useEffect(() => discard, [discard]);

  const updateWaveform = useCallback(function drawWaveform() {
    if (!analyserRef.current || !mediaRecorderRef.current || mediaRecorderRef.current.state !== "recording") {
      return;
    }

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Sample down to 24 bars
    const samples = 24;
    const step = Math.floor(bufferLength / samples);
    const bars: number[] = [];

    for (let i = 0; i < samples; i++) {
      let sum = 0;
      for (let j = 0; j < step; j++) {
        sum += dataArray[i * step + j] || 0;
      }
      const avg = sum / step / 255; // Normalize 0..1
      bars.push(Math.max(0.08, avg));
    }

    setState((prev) => ({ ...prev, waveformData: bars }));
    animationFrameRef.current = requestAnimationFrame(drawWaveform);
  }, []);

  const startRecording = useCallback(async () => {
    if (starting.current || mediaRecorderRef.current) return;
    discard();
    starting.current = true;
    const request = activeRequest.current;
    try {
      setState((prev) => ({ ...prev, error: null, audioBlob: null, audioUrl: null }));
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (request !== activeRequest.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;

      // Audio analysis for waveform visualizer
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const mimeType = ["audio/webm", "audio/mp4", "audio/ogg"].find((type) => MediaRecorder.isTypeSupported(type));
      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType });
        releaseResources();
        mediaRecorderRef.current = null;
        const url = URL.createObjectURL(blob);
        blobUrl.current = url;
        setState((prev) => ({
          ...prev,
          isRecording: false,
          audioBlob: blob,
          audioUrl: url,
        }));

      };

      mediaRecorder.start(250); // Collect data every 250ms
      setState((prev) => ({ ...prev, isRecording: true, recordingDuration: 0 }));

      // Duration counter
      let duration = 0;
      timerRef.current = setInterval(() => {
        duration += 1;
        setState((prev) => ({ ...prev, recordingDuration: duration }));

        if (timeLimitSeconds && duration >= timeLimitSeconds) {
          if (timerRef.current) clearInterval(timerRef.current);
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
          }
          if (onTimeLimitReached) onTimeLimitReached();
        }
      }, 1000);

      // Start waveform loop
      animationFrameRef.current = requestAnimationFrame(updateWaveform);
    } catch (err: unknown) {
      if (request !== activeRequest.current) return;
      discard();
      const msg = err instanceof Error ? err.message : "دسترسی به میکروفون با خطا مواجه شد.";
      setState((prev) => ({ ...prev, error: msg, isRecording: false }));
    } finally {
      if (request === activeRequest.current) starting.current = false;
    }
  }, [discard, releaseResources, timeLimitSeconds, onTimeLimitReached, updateWaveform]);

  const stopRecording = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const resetRecording = useCallback(() => {
    discard();
    setState({
      isRecording: false,
      isPaused: false,
      recordingDuration: 0,
      audioBlob: null,
      audioUrl: null,
      waveformData: new Array(24).fill(0.1),
      error: null,
    });
  }, [discard]);

  return {
    ...state,
    startRecording,
    stopRecording,
    resetRecording,
  };
}
