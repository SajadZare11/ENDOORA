/**
 * Multi-Provider High-Performance Audio Engine for Listening Mastery
 * Supports:
 * - HTML5 Audio playback for real audio assets
 * - Web Speech API synthesis fallback for universal zero-broken-audio guarantee
 * - Sentence-level precision jumping and synchronization
 * - "-5s replay" and "replay current sentence"
 * - Variable playback speeds (0.75x, 1x, 1.25x, 1.5x, 2x)
 */

import type { TranscriptSentence } from "@endoora/contracts";
import { getBestNaturalVoice } from "../speech";

export interface AudioEngineState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  currentSentenceIndex: number;
  isUsingSynthesis: boolean;
  isLoading: boolean;
  error: string | null;
}

export type AudioEngineListener = (state: AudioEngineState) => void;

export class ListeningAudioEngine {
  private audioElement: HTMLAudioElement | null = null;
  private synthesisUtterance: SpeechSynthesisUtterance | null = null;
  private sentences: TranscriptSentence[] = [];
  private synthesisFullText: string = "";
  private listeners: Set<AudioEngineListener> = new Set();

  private isPlaying = false;
  private currentTime = 0;
  private duration = 0;
  private playbackRate = 1.0;
  private volume = 1.0;
  private isMuted = false;
  private currentSentenceIndex = 0;
  private isUsingSynthesis = false;
  private isLoading = false;
  private error: string | null = null;
  private synthesisTimer: NodeJS.Timeout | null = null;
  private hasAudioFileError = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.audioElement = new Audio();
      this.attachAudioElementListeners();
    }
  }

  private attachAudioElementListeners() {
    if (!this.audioElement) return;

    this.audioElement.addEventListener("loadedmetadata", () => {
      this.duration = this.audioElement?.duration || 0;
      this.isLoading = false;
      this.error = null;
      this.notify();
    });

    this.audioElement.addEventListener("timeupdate", () => {
      if (!this.audioElement) return;
      this.currentTime = this.audioElement.currentTime;
      this.updateActiveSentenceIndex();
      this.notify();
    });

    this.audioElement.addEventListener("ended", () => {
      this.isPlaying = false;
      this.currentTime = 0;
      this.currentSentenceIndex = 0;
      this.notify();
    });

    this.audioElement.addEventListener("error", () => {
      console.warn("Native audio asset failed or unavailable. Falling back to SpeechSynthesis Engine.");
      this.hasAudioFileError = true;
      this.isUsingSynthesis = true;
      this.isLoading = false;
      this.notify();
    });
  }

  public loadLesson(
    audioUrl: string,
    fallbackText: string,
    sentences: TranscriptSentence[],
    expectedDuration: number
  ) {
    this.stop();
    this.sentences = sentences;
    this.synthesisFullText = fallbackText;
    this.duration = expectedDuration || 120;
    this.currentTime = 0;
    this.currentSentenceIndex = 0;
    this.hasAudioFileError = false;
    this.isUsingSynthesis = false;

    if (this.audioElement) {
      this.isLoading = true;
      this.audioElement.src = audioUrl;
      this.audioElement.playbackRate = this.playbackRate;
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
      this.audioElement.load();
    } else {
      this.isUsingSynthesis = true;
    }

    this.notify();
  }

  public play() {
    if (this.isUsingSynthesis || this.hasAudioFileError || !this.audioElement) {
      this.playSynthesis();
    } else {
      this.audioElement
        .play()
        .then(() => {
          this.isPlaying = true;
          this.notify();
        })
        .catch((err) => {
          console.warn("Audio element play error, falling back to synthesis:", err);
          this.isUsingSynthesis = true;
          this.playSynthesis();
        });
    }
  }

  public pause() {
    this.isPlaying = false;
    if (this.audioElement && !this.isUsingSynthesis) {
      this.audioElement.pause();
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.pause();
    }
    if (this.synthesisTimer) {
      clearInterval(this.synthesisTimer);
      this.synthesisTimer = null;
    }
    this.notify();
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public stop() {
    this.pause();
    this.currentTime = 0;
    this.currentSentenceIndex = 0;
    if (this.audioElement) {
      try {
        this.audioElement.currentTime = 0;
      } catch (_) {}
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.notify();
  }

  public seek(seconds: number) {
    const clamped = Math.max(0, Math.min(seconds, this.duration || 1));
    this.currentTime = clamped;

    if (this.audioElement && !this.isUsingSynthesis) {
      try {
        this.audioElement.currentTime = clamped;
      } catch (_) {}
    }

    this.updateActiveSentenceIndex();
    this.notify();

    if (this.isUsingSynthesis && this.isPlaying) {
      // Re-trigger synthesis from new sentence position
      this.playSynthesis();
    }
  }

  public replaySeconds(deltaSeconds: number = 5) {
    this.seek(this.currentTime - deltaSeconds);
  }

  public replaySentence() {
    if (this.sentences.length === 0) {
      this.seek(0);
      return;
    }
    const current = this.sentences[this.currentSentenceIndex];
    if (current) {
      this.seek(current.startSeconds);
    } else {
      this.seek(0);
    }
  }

  public jumpToSentence(index: number) {
    if (index >= 0 && index < this.sentences.length) {
      this.currentSentenceIndex = index;
      const target = this.sentences[index];
      this.seek(target.startSeconds);
    }
  }

  public setPlaybackRate(rate: number) {
    this.playbackRate = rate;
    if (this.audioElement) {
      this.audioElement.playbackRate = rate;
    }
    if (this.isUsingSynthesis && this.isPlaying) {
      this.playSynthesis();
    }
    this.notify();
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(vol, 1));
    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
    }
    this.notify();
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
    }
    this.notify();
  }

  private playSynthesis() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      this.error = "مرورگر شما از پخش صدا یا SpeechSynthesis پشتیبانی نمی‌کند.";
      this.notify();
      return;
    }

    window.speechSynthesis.cancel();
    if (this.synthesisTimer) clearInterval(this.synthesisTimer);

    // Determine starting sentence or text slice
    const remainingSentences = this.sentences.slice(this.currentSentenceIndex);
    const textToSpeak =
      remainingSentences.length > 0
        ? remainingSentences.map((s) => (s.speaker ? `${s.speaker}: ${s.textEn}` : s.textEn)).join(" ")
        : this.synthesisFullText;

    const utterance = new SpeechSynthesisUtterance(textToSpeak || "Audio playback simulation.");
    utterance.lang = "en-US";
    utterance.rate = Math.max(0.7, Math.min(this.playbackRate * 0.95, 1.8));

    // Choose guaranteed natural English voice
    const englishVoice = getBestNaturalVoice("en-US");
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      this.isPlaying = true;
      this.isUsingSynthesis = true;
      this.notify();

      // Simulated timeline ticker
      this.synthesisTimer = setInterval(() => {
        if (!this.isPlaying) return;
        this.currentTime += 0.25 * this.playbackRate;
        if (this.currentTime >= this.duration) {
          this.pause();
          this.currentTime = 0;
          this.currentSentenceIndex = 0;
        } else {
          this.updateActiveSentenceIndex();
        }
        this.notify();
      }, 250);
    };

    utterance.onend = () => {
      this.isPlaying = false;
      if (this.synthesisTimer) clearInterval(this.synthesisTimer);
      this.currentTime = 0;
      this.currentSentenceIndex = 0;
      this.notify();
    };

    utterance.onerror = (e) => {
      console.warn("SpeechSynthesis error:", e);
      this.isPlaying = false;
      if (this.synthesisTimer) clearInterval(this.synthesisTimer);
      this.notify();
    };

    this.synthesisUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  private updateActiveSentenceIndex() {
    if (this.sentences.length === 0) return;
    const idx = this.sentences.findIndex(
      (s) => this.currentTime >= s.startSeconds && this.currentTime <= s.endSeconds
    );
    if (idx !== -1 && idx !== this.currentSentenceIndex) {
      this.currentSentenceIndex = idx;
    }
  }

  public subscribe(listener: AudioEngineListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): AudioEngineState {
    return {
      isPlaying: this.isPlaying,
      currentTime: this.currentTime,
      duration: this.duration,
      playbackRate: this.playbackRate,
      volume: this.volume,
      isMuted: this.isMuted,
      currentSentenceIndex: this.currentSentenceIndex,
      isUsingSynthesis: this.isUsingSynthesis,
      isLoading: this.isLoading,
      error: this.error,
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }

  public destroy() {
    this.stop();
    if (this.audioElement) {
      this.audioElement.src = "";
      this.audioElement = null;
    }
    this.listeners.clear();
  }
}
