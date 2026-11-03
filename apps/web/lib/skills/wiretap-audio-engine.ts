/**
 * Web Audio Engine for Wiretap Cipher Arena
 * Provides real-time radio tuning static, bandpass telephone filters,
 * analog tape mechanical sfx, oscilloscope analyser, and speech playback.
 */

export class WiretapAudioEngine {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private voiceGain: GainNode | null = null;
  private bandpassFilter: BiquadFilterNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isStaticPlaying: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudio: HTMLAudioElement | null = null;

  constructor() {
    // Lazy initialized on first user interaction
  }

  private initContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx || this.ctx.state === "closed") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public getAnalyser(): AnalyserNode | null {
    const ctx = this.initContext();
    if (!ctx) return null;
    if (!this.analyser) {
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 128;
    }
    return this.analyser;
  }

  /**
   * Starts ambient radio static generator.
   * Noise volume modulates based on tuning distance from target MHz.
   */
  public startRadioStatic(targetMHz: number, currentMHz: number): void {
    const ctx = this.initContext();
    if (!ctx) return;
    if (this.isStaticPlaying) {
      this.updateTuningStatic(targetMHz, currentMHz);
      return;
    }

    try {
      // Create 2 seconds of white noise buffer
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.4;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Bandpass filter to sound like analog AM/FM radio static
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1800;
      filter.Q.value = 1.2;

      const gain = ctx.createGain();
      const delta = Math.abs(targetMHz - currentMHz);
      // Normalized static volume: 0.03 at locked, up to 0.35 when far off
      const vol = Math.min(0.35, Math.max(0.02, delta * 0.15));
      gain.gain.setValueAtTime(vol, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
      this.noiseNode = whiteNoise;
      this.noiseGain = gain;
      this.isStaticPlaying = true;
    } catch {}
  }

  public updateTuningStatic(targetMHz: number, currentMHz: number): void {
    if (!this.ctx || !this.noiseGain) return;
    const delta = Math.abs(targetMHz - currentMHz);
    const vol = Math.min(0.35, Math.max(0.015, delta * 0.18));
    try {
      this.noiseGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.noiseGain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.05);
    } catch {}
  }

  public stopRadioStatic(): void {
    if (this.noiseNode) {
      try {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
      } catch {}
      this.noiseNode = null;
    }
    this.isStaticPlaying = false;
  }

  /**
   * Plays tape reel mechanical clicks and motor start/stop sounds. (Disabled for clean audio)
   */
  public playTapeMotor(_isStarting: boolean): void {
    // Disabled: side-effect removed for clean modern audio
  }

  public playDialTick(): void {
    const ctx = this.initContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1400, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.02);
    } catch {}
  }

  public playLockSignalChime(): void {
    // Disabled: side-effects removed for clean modern audio
  }

  public playWordInterceptHit(): void {
    const ctx = this.initContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.08); // B5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {}
  }

  public playSignalLossWarning(): void {
    const ctx = this.initContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.setValueAtTime(190, now + 0.08);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }

  /**
   * Plays stage audio from high-fidelity Neural MP3 asset.
   * Gracefully falls back to browser SpeechSynthesis if asset is unavailable.
   */
  public playStageAudio(
    audioUrl: string | undefined,
    fallbackText: string,
    accent: string,
    rate: number = 1.0,
    onWordBoundary?: (word: string, charIndex: number) => void,
    onEnd?: () => void
  ): void {
    this.stopSpeaking();

    if (audioUrl && typeof window !== "undefined") {
      try {
        const audio = new Audio();
        audio.src = audioUrl;
        audio.preload = "auto";
        audio.playbackRate = Math.max(0.7, Math.min(1.5, rate));
        audio.volume = 1.0;

        audio.onended = () => {
          this.currentAudio = null;
          if (onEnd) onEnd();
        };

        audio.onerror = (e) => {
          console.warn("[WiretapAudio] Failed to load audio file, falling back to speech synthesis:", audioUrl, e);
          this.currentAudio = null;
          this.speakScript(fallbackText, accent, rate, onWordBoundary, onEnd);
        };

        this.currentAudio = audio;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("[WiretapAudio] audio.play() rejected (autoplay or device restriction), attempting fallback:", err);
            this.speakScript(fallbackText, accent, rate, onWordBoundary, onEnd);
          });
        }
        return;
      } catch (err) {
        console.warn("[WiretapAudio] Audio init error:", err);
      }
    }

    this.speakScript(fallbackText, accent, rate, onWordBoundary, onEnd);
  }

  public setPlaybackRate(rate: number): void {
    if (this.currentAudio) {
      this.currentAudio.playbackRate = Math.max(0.7, Math.min(1.5, rate));
    }
  }

  /**
   * Speak intercepted audio using SpeechSynthesis with accent selection.
   */
  public speakScript(
    text: string,
    accent: string,
    rate: number = 1.0,
    onWordBoundary?: (word: string, charIndex: number) => void,
    onEnd?: () => void
  ): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      if (onEnd) onEnd();
      return;
    }

    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = accent || "en-GB";
    utt.rate = Math.max(0.7, Math.min(1.4, rate));
    utt.pitch = 1.0;

    // Pick suitable voice matching accent if available
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const matched = voices.find((v) => v.lang.toLowerCase().startsWith(accent.toLowerCase()));
      if (matched) {
        utt.voice = matched;
      }
    }

    if (onWordBoundary) {
      utt.onboundary = (e) => {
        if (e.name === "word") {
          const spoken = text.substring(e.charIndex, e.charIndex + e.charLength);
          onWordBoundary(spoken.trim().toLowerCase(), e.charIndex);
        }
      };
    }

    utt.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utt.onerror = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    this.currentUtterance = utt;
    window.speechSynthesis.speak(utt);
  }

  public stopSpeaking(): void {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {}
      this.currentAudio = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
  }

  public dispose(): void {
    this.stopSpeaking();
    this.stopRadioStatic();
    if (this.ctx) {
      if (this.ctx.state !== "closed") {
        try {
          this.ctx.close().catch(() => {});
        } catch {}
      }
      this.ctx = null;
    }
  }
}

export const wiretapAudio = new WiretapAudioEngine();
