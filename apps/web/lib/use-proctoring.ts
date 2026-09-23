"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { batchSendProctoringEvents, type AntiCheatConfig, type ProctoringEvent } from "./online-exams";

export interface ProctoringState {
  violationsCount: number;
  blurCount: number;
  fullscreenExitsCount: number;
  pasteAttemptsCount: number;
  estimatedIntegrity: number;
  isFullscreen: boolean;
  activeWarning: string | null;
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
    blurCount: 0,
    fullscreenExitsCount: 0,
    pasteAttemptsCount: 0,
    estimatedIntegrity: 100,
    isFullscreen: false,
    activeWarning: null,
  });

  const eventQueue = useRef<ProctoringEvent[]>([]);
  const blurStartTime = useRef<number | null>(null);
  const totalViolations = useRef(0);
  const isFlushing = useRef(false);

  // Helper to record an event
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

      // Penalties for immediate state update
      let penalty = 0;
      let isViolation = false;

      if (eventType === "blur" || eventType === "tab_hidden") {
        penalty = 3;
        isViolation = true;
      } else if (eventType === "fullscreen_exit") {
        penalty = 10;
        isViolation = true;
      } else if (eventType === "paste_attempt") {
        penalty = 5;
        isViolation = true;
      } else if (eventType === "devtools_attempt" || eventType === "shortcut_blocked") {
        penalty = 8;
        isViolation = true;
      }

      if (isViolation) {
        totalViolations.current += 1;
      }

      setState((prev) => {
        const nextViolations = isViolation ? prev.violationsCount + 1 : prev.violationsCount;
        const nextBlur = eventType === "blur" ? prev.blurCount + 1 : prev.blurCount;
        const nextFs = eventType === "fullscreen_exit" ? prev.fullscreenExitsCount + 1 : prev.fullscreenExitsCount;
        const nextPaste = eventType === "paste_attempt" ? prev.pasteAttemptsCount + 1 : prev.pasteAttemptsCount;
        const nextIntegrity = Math.max(0, Math.min(100, prev.estimatedIntegrity - penalty));

        return {
          ...prev,
          violationsCount: nextViolations,
          blurCount: nextBlur,
          fullscreenExitsCount: nextFs,
          pasteAttemptsCount: nextPaste,
          estimatedIntegrity: nextIntegrity,
        };
      });

      // Check auto-submit threshold
      if (
        config.auto_submit_on_violation &&
        config.violation_threshold > 0 &&
        totalViolations.current >= config.violation_threshold
      ) {
        if (onViolationThresholdReached) {
          onViolationThresholdReached();
        }
      }
    },
    [enabled, config, onViolationThresholdReached]
  );

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

  // Event Listeners
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    // Fullscreen monitor
    const handleFullscreenChange = () => {
      const isFs = Boolean(document.fullscreenElement);
      setState((prev) => ({ ...prev, isFullscreen: isFs }));

      if (!isFs) {
        recordEvent("fullscreen_exit");
        setState((prev) => ({
          ...prev,
          activeWarning: "هشدار: خروج از حالت تمام‌صفحه تخلف امنیتی محسوب می‌شود.",
        }));
      } else {
        recordEvent("fullscreen_enter");
        setState((prev) => ({ ...prev, activeWarning: null }));
      }
    };

    // Visibility & Tab monitor
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        recordEvent("tab_hidden");
        setState((prev) => ({
          ...prev,
          activeWarning: "هشدار: تغییر تب یا کوچک‌کردن پنجره آزمون ثبت شد.",
        }));
      } else {
        recordEvent("tab_visible");
      }
    };

    // Window Blur/Focus monitor
    const handleBlur = () => {
      blurStartTime.current = Date.now();
      recordEvent("blur");
      setState((prev) => ({
        ...prev,
        activeWarning: "هشدار: خارج‌شدن از پنجره آزمون ثبت گردید.",
      }));
    };

    const handleFocus = () => {
      let durationSeconds: number | undefined;
      if (blurStartTime.current) {
        durationSeconds = (Date.now() - blurStartTime.current) / 1000;
        blurStartTime.current = null;
      }
      recordEvent("focus", undefined, durationSeconds);
    };

    // Paste & Clipboard block
    const handlePaste = (e: ClipboardEvent) => {
      if (config.block_clipboard) {
        e.preventDefault();
        recordEvent("paste_attempt", {
          clipboard_data_length: e.clipboardData?.getData("text")?.length ?? 0,
        });
        setState((prev) => ({
          ...prev,
          activeWarning: "چسباندن متن (Paste) در طول آزمون مجاز نیست.",
        }));
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      if (config.block_clipboard) {
        e.preventDefault();
        recordEvent("shortcut_blocked", { action: "copy" });
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (config.block_devtools || config.block_clipboard) {
        e.preventDefault();
        recordEvent("shortcut_blocked", { action: "context_menu" });
      }
    };

    // DevTools & Shortcuts block (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U)
    const handleKeyDown = (e: KeyboardEvent) => {
      const isF12 = e.key === "F12";
      const isDevToolsCombo =
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        ["I", "i", "J", "j", "C", "c"].includes(e.key);
      const isViewSource = (e.ctrlKey || e.metaKey) && ["u", "U"].includes(e.key);

      if (config.block_devtools && (isF12 || isDevToolsCombo || isViewSource)) {
        e.preventDefault();
        recordEvent("devtools_attempt", { key: e.key });
        setState((prev) => ({
          ...prev,
          activeWarning: "دسترسی به ابزارهای توسعه‌دهنده در حین آزمون مسدود است.",
        }));
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("paste", handlePaste, true);
    window.addEventListener("copy", handleCopy, true);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);

    // Initial log: Exam started
    recordEvent("exam_started");

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("paste", handlePaste, true);
      window.removeEventListener("copy", handleCopy, true);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, config, recordEvent]);

  return {
    ...state,
    requestFullscreen,
    exitFullscreen,
    flushEvents,
    recordCustomEvent: recordEvent,
  };
}
