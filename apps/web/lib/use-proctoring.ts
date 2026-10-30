"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { batchSendProctoringEvents, type AntiCheatConfig, type ProctoringEvent } from "./online-exams";

export interface ViolationWarning {
  reason: string;
  strike: number;
  maxStrikes: number;
  time: string;
}

export interface ProctoringState {
  violationsCount: number;
  tabSwitchCount: number;
  fullscreenExitsCount: number;
  pasteAttemptsCount: number;
  devtoolsAttemptsCount: number;
  estimatedIntegrity: number;
  isFullscreen: boolean;
  activeWarning: string | null;
  activeViolationWarning: ViolationWarning | null;
  warningLogs: string[];
}

export interface UseProctoringOptions {
  examId: string;
  submissionId: string;
  config: AntiCheatConfig;
  enabled?: boolean;
  onViolationThresholdReached?: () => void;
}

export function useProctoring({
  examId,
  submissionId,
  config,
  enabled = true,
  onViolationThresholdReached,
}: UseProctoringOptions) {
  const [state, setState] = useState<ProctoringState>({
    violationsCount: 0,
    tabSwitchCount: 0,
    fullscreenExitsCount: 0,
    pasteAttemptsCount: 0,
    devtoolsAttemptsCount: 0,
    estimatedIntegrity: 100,
    isFullscreen: false,
    activeWarning: null,
    activeViolationWarning: null,
    warningLogs: [],
  });

  const eventQueue = useRef<ProctoringEvent[]>([]);
  const blurStartTime = useRef<number | null>(null);
  const totalViolations = useRef(0);
  const tabSwitches = useRef(0);
  const isFlushing = useRef(false);

  // Helper to record an informational event (non-violation or lifecycle)
  const recordEvent = useCallback(
    (
      eventType: ProctoringEvent["event_type"],
      metadata?: Record<string, unknown>,
      durationSeconds?: number
    ) => {
      if (!enabled) return;

      const event: ProctoringEvent = {
        event_type: eventType,
        client_timestamp: new Date().toISOString(),
        duration_seconds: durationSeconds ?? null,
        metadata: metadata ?? {},
      };

      eventQueue.current.push(event);
    },
    [enabled]
  );

  // Helper to record an explicit violation with timestamped logging and strike tracking
  const recordViolation = useCallback(
    (
      reason: string,
      eventType: ProctoringEvent["event_type"],
      metadata?: Record<string, unknown>
    ) => {
      if (!enabled) return;

      const time = new Date().toLocaleTimeString("fa-IR");
      const logMessage = `${reason} در ساعت ${time}`;

      // Increment internal counters
      totalViolations.current += 1;
      const isTabOrBlur = eventType === "blur" || eventType === "tab_hidden";
      if (isTabOrBlur) {
        tabSwitches.current += 1;
      }

      // Calculate integrity deduction
      let penalty = 4;
      if (eventType === "fullscreen_exit") penalty = 12;
      else if (eventType === "devtools_attempt" || eventType === "print_screen_attempt") penalty = 10;
      else if (eventType === "paste_attempt" || eventType === "copy_attempt") penalty = 6;

      const maxStrikes = config.violation_threshold || config.max_blur_events || 3;
      const currentStrike = totalViolations.current;

      const warningModalData: ViolationWarning = {
        reason,
        strike: currentStrike,
        maxStrikes,
        time,
      };

      // Queue the proctoring event for backend transmission
      const event: ProctoringEvent = {
        event_type: eventType,
        client_timestamp: new Date().toISOString(),
        metadata: {
          ...(metadata ?? {}),
          reason,
          strike: currentStrike,
          max_strikes: maxStrikes,
          formatted_time: time,
        },
      };
      eventQueue.current.push(event);

      // Update state
      setState((prev) => ({
        ...prev,
        violationsCount: prev.violationsCount + 1,
        tabSwitchCount: isTabOrBlur ? prev.tabSwitchCount + 1 : prev.tabSwitchCount,
        fullscreenExitsCount: eventType === "fullscreen_exit" ? prev.fullscreenExitsCount + 1 : prev.fullscreenExitsCount,
        pasteAttemptsCount: eventType === "paste_attempt" ? prev.pasteAttemptsCount + 1 : prev.pasteAttemptsCount,
        devtoolsAttemptsCount:
          eventType === "devtools_attempt" || eventType === "shortcut_blocked" || eventType === "print_screen_attempt"
            ? prev.devtoolsAttemptsCount + 1
            : prev.devtoolsAttemptsCount,
        estimatedIntegrity: Math.max(0, prev.estimatedIntegrity - penalty),
        activeWarning: `هشدار امنیتی: ${logMessage}`,
        activeViolationWarning: warningModalData,
        warningLogs: [...prev.warningLogs, logMessage],
      }));

      // Check violation cap for forced auto-submit
      const thresholdReached =
        (config.auto_submit_on_violation && currentStrike >= maxStrikes) ||
        (config.max_blur_events > 0 && tabSwitches.current >= config.max_blur_events);

      if (thresholdReached && onViolationThresholdReached) {
        onViolationThresholdReached();
      }
    },
    [enabled, config, onViolationThresholdReached]
  );

  const dismissActiveWarning = useCallback(() => {
    setState((prev) => ({
      ...prev,
      activeViolationWarning: null,
      activeWarning: null,
    }));
  }, []);

  // Flush queued events to backend periodically
  const flushEvents = useCallback(async () => {
    if (eventQueue.current.length === 0 || isFlushing.current) return;
    isFlushing.current = true;
    const batch = [...eventQueue.current];
    eventQueue.current = [];

    try {
      await batchSendProctoringEvents(examId, submissionId, batch);
    } catch {
      // Re-queue events on failure so they aren't lost
      eventQueue.current = [...batch, ...eventQueue.current];
    } finally {
      isFlushing.current = false;
    }
  }, [examId, submissionId]);

  // Request fullscreen utility
  const requestFullscreen = useCallback(async () => {
    if (typeof document === "undefined") return;
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen request rejected or not supported:", err);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    if (typeof document === "undefined") return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore exit failure
    }
  }, []);

  // Periodic flush every 5s
  useEffect(() => {
    if (!enabled) return;
    const interval = setInterval(() => {
      void flushEvents();
    }, 5000);
    return () => {
      clearInterval(interval);
      void flushEvents();
    };
  }, [enabled, flushEvents]);

  // Event Listeners for Anti-Cheat Monitoring
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    // 1. Fullscreen change listener
    const handleFullscreenChange = () => {
      const isFs = Boolean(document.fullscreenElement);
      setState((prev) => ({ ...prev, isFullscreen: isFs }));

      if (!isFs) {
        if (config.enforce_fullscreen) {
          recordViolation("خروج از حالت تمام‌صفحه", "fullscreen_exit");
        } else {
          recordEvent("fullscreen_exit");
        }
      } else {
        recordEvent("fullscreen_enter");
      }
    };

    // 2. Visibility change (Tab-switch, Minimize)
    const handleVisibilityChange = () => {
      if (document.hidden || document.visibilityState === "hidden") {
        recordViolation("خروج از صفحه آزمون / تغییر تب", "tab_hidden");
      } else {
        recordEvent("tab_visible");
      }
    };

    // 3. Window Blur & Focus
    const handleBlur = () => {
      blurStartTime.current = Date.now();
      recordViolation("از دست رفتن فوکوس و کلیک خارج از مرورگر", "blur");
    };

    const handleFocus = () => {
      let durationSeconds: number | undefined;
      if (blurStartTime.current) {
        durationSeconds = (Date.now() - blurStartTime.current) / 1000;
        blurStartTime.current = null;
      }
      recordEvent("focus", undefined, durationSeconds);
    };

    // 4. Clipboard operations: Paste, Cut, Copy
    const handlePaste = (e: ClipboardEvent) => {
      if (config.block_clipboard) {
        e.preventDefault();
        recordViolation(
          "تلاش برای چسباندن متن (Paste)",
          "paste_attempt",
          { clipboard_length: e.clipboardData?.getData("text")?.length ?? 0 }
        );
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      if (config.block_clipboard) {
        e.preventDefault();
        recordViolation("تلاش برای کپی کردن محتوا (Copy)", "copy_attempt");
      }
    };

    const handleCut = (e: ClipboardEvent) => {
      if (config.block_clipboard) {
        e.preventDefault();
        recordViolation("تلاش برای برش محتوا (Cut)", "cut_attempt");
      }
    };

    // 5. Context Menu (Right Click)
    const handleContextMenu = (e: MouseEvent) => {
      if (config.block_devtools || config.block_clipboard) {
        e.preventDefault();
        recordViolation("کلیک راست در صفحه آزمون مسدود است", "shortcut_blocked", { action: "context_menu" });
      }
    };

    // 6. Sensitive Shortcuts & DevTools Keys
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen key
      if (e.key === "PrintScreen") {
        e.preventDefault();
        recordViolation("تلاش برای ثبت اسکرین‌شات (PrintScreen)", "print_screen_attempt");
        return;
      }

      // F12 key
      if (config.block_devtools && e.key === "F12") {
        e.preventDefault();
        recordViolation("تلاش برای باز کردن کنسول توسعه‌دهنده (F12)", "devtools_attempt", { key: e.key });
        return;
      }

      // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C (Inspect Element)
      if (
        config.block_devtools &&
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        ["I", "i", "J", "j", "C", "c"].includes(e.key)
      ) {
        e.preventDefault();
        recordViolation("تلاش برای باز کردن ابزار بازرسی (Inspect Element)", "devtools_attempt", { key: e.key });
        return;
      }

      // Ctrl + U (View Source)
      if (config.block_devtools && (e.ctrlKey || e.metaKey) && ["u", "U"].includes(e.key)) {
        e.preventDefault();
        recordViolation("تلاش برای مشاهده سورس صفحه (View Source)", "devtools_attempt", { key: e.key });
        return;
      }

      // Ctrl+C, Ctrl+V, Ctrl+A, Ctrl+P
      if (config.block_clipboard && (e.ctrlKey || e.metaKey)) {
        const key = e.key.toLowerCase();
        if (key === "c") {
          e.preventDefault();
          recordViolation("تلاش برای کپی کردن متن (Ctrl+C)", "copy_attempt");
        } else if (key === "v") {
          e.preventDefault();
          recordViolation("تلاش برای چسباندن متن (Ctrl+V)", "paste_attempt");
        } else if (key === "a") {
          e.preventDefault();
          recordViolation("تلاش برای انتخاب کل صفحه (Ctrl+A)", "shortcut_blocked", { action: "select_all" });
        } else if (key === "p") {
          e.preventDefault();
          recordViolation("تلاش برای چاپ صفحه (Ctrl+P)", "shortcut_blocked", { action: "print_page" });
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("paste", handlePaste, true);
    window.addEventListener("copy", handleCopy, true);
    window.addEventListener("cut", handleCut, true);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);

    // Initial lifecycle event: Exam started
    recordEvent("exam_started");

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("paste", handlePaste, true);
      window.removeEventListener("copy", handleCopy, true);
      window.removeEventListener("cut", handleCut, true);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, config, recordEvent, recordViolation]);

  return {
    ...state,
    requestFullscreen,
    exitFullscreen,
    flushEvents,
    recordCustomEvent: recordEvent,
    dismissActiveWarning,
  };
}
