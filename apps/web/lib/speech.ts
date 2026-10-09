/**
 * High-Fidelity Native-like Audio Speech Engine for Endoora
 * 
 * Provides human, natural, native-like English pronunciation by:
 * 1. Primary Engine: Real Human Native Audio Streaming via /api/speech/synthesize (MP3)
 * 2. Secondary Engine: Browser Neural/Natural Voice selection (filtering out robotic desktop voices like Microsoft David)
 */

let activeAudio: HTMLAudioElement | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

// Initialize voices cache when browser loads voices
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  const updateVoices = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
  updateVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }
}

/**
 * Finds the most natural, human-sounding native English voice in the browser.
 * Explicitly avoids robotic legacy voices (e.g., Microsoft David Desktop).
 */
export function getBestNaturalVoice(preferredAccent: "en-US" | "en-GB" = "en-US"): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;

  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  const isUK = preferredAccent === "en-GB";

  // Tier 1: Microsoft Online Natural Neural Voices (Edge / Windows 11) - Ultra Realistic
  const msNatural = voices.find((v) => {
    const n = v.name.toLowerCase();
    const matchesAccent = isUK ? (v.lang.includes("GB") || n.includes("united kingdom")) : (v.lang.includes("US") || n.includes("united states"));
    return matchesAccent && (n.includes("natural") || n.includes("neural") || n.includes("online"));
  });
  if (msNatural) return msNatural;

  // Tier 2: Google Chrome Natural Cloud Voices (Google US English, Google UK English)
  const googleNatural = voices.find((v) => {
    const n = v.name.toLowerCase();
    const matchesAccent = isUK ? (v.lang.includes("GB") || n.includes("uk")) : (v.lang.includes("US") || n.includes("us"));
    return matchesAccent && n.includes("google");
  });
  if (googleNatural) return googleNatural;

  // Tier 3: Apple Siri / Enhanced Voices (macOS / iOS)
  const appleEnhanced = voices.find((v) => {
    const n = v.name.toLowerCase();
    return (v.lang.startsWith("en")) && (n.includes("enhanced") || n.includes("samantha") || n.includes("daniel") || n.includes("serena"));
  });
  if (appleEnhanced) return appleEnhanced;

  // Tier 4: Any voice labeled "Natural"
  const anyNatural = voices.find((v) => v.name.toLowerCase().includes("natural") && v.lang.startsWith("en"));
  if (anyNatural) return anyNatural;

  // Tier 5: Modern female voices (Zira, Jenny, etc.) avoiding David
  const modernFallback = voices.find((v) => {
    const n = v.name.toLowerCase();
    return v.lang.startsWith("en") && !n.includes("david") && !n.includes("espeak") && !n.includes("desktop");
  });
  if (modernFallback) return modernFallback;

  // Tier 6: General English voice fallback
  return voices.find((v) => v.lang.startsWith("en")) || null;
}

export interface SpeechPlayOptions {
  accent?: "en-US" | "en-GB";
  rate?: number;
  onEnd?: () => void;
}

/**
 * Plays speech using the primary native audio stream or high-grade natural synthesis fallback.
 * Supports both options object or numeric rate for complete backward compatibility.
 */
export function playEnglishSpeech(
  text: string,
  rateOrOptions?: number | SpeechPlayOptions
): void {
  if (typeof window === "undefined" || !text.trim()) return;

  let accent: "en-US" | "en-GB" = "en-US";
  let rate = 0.94;
  let onEnd: (() => void) | undefined = undefined;

  if (typeof rateOrOptions === "number") {
    rate = rateOrOptions;
  } else if (rateOrOptions && typeof rateOrOptions === "object") {
    if (rateOrOptions.accent) accent = rateOrOptions.accent;
    if (rateOrOptions.rate) rate = rateOrOptions.rate;
    if (rateOrOptions.onEnd) onEnd = rateOrOptions.onEnd;
  }

  // Stop any currently playing speech or audio
  stopEnglishSpeech();

  // Primary: Native MP3 streaming via audio proxy
  try {
    const audioUrl = `/api/speech/synthesize?text=${encodeURIComponent(text.trim())}&lang=${accent}`;
    const audio = new Audio(audioUrl);
    activeAudio = audio;
    audio.playbackRate = rate;

    let hasStarted = false;

    audio.onplay = () => {
      hasStarted = true;
    };

    audio.onended = () => {
      activeAudio = null;
      if (onEnd) onEnd();
    };

    audio.onerror = () => {
      // If streaming fails or blocked, gracefully fallback to browser natural voice
      if (!hasStarted) {
        fallbackToBrowserSpeech(text, accent, rate, onEnd);
      }
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy or network error -> use browser synthesis
        fallbackToBrowserSpeech(text, accent, rate, onEnd);
      });
    }
  } catch {
    fallbackToBrowserSpeech(text, accent, rate, onEnd);
  }
}

/**
 * Fallback to browser SpeechSynthesis with guaranteed best natural voice
 */
function fallbackToBrowserSpeech(
  text: string,
  accent: "en-US" | "en-GB",
  rate: number,
  onEnd?: () => void
): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = accent;
    utterance.rate = rate;
    utterance.pitch = 1.0;

    const naturalVoice = getBestNaturalVoice(accent);
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn("Browser speech playback failed:", err);
  }
}

/**
 * Immediately stops any currently playing audio or speech.
 */
export function stopEnglishSpeech(): void {
  if (typeof window === "undefined") return;

  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
