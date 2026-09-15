"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWARegistration() {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    // Register service worker
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        if (reg.waiting) {
          setWaitingWorker(reg.waiting);
          setHasUpdate(true);
        }

        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                setWaitingWorker(newWorker);
                setHasUpdate(true);
              }
            });
          }
        });
      })
      .catch((err) => {
        // Safe development catch (e.g. unsupported origin or private mode)
        console.debug("PWA service worker registration skipped:", err);
      });

    // Capture beforeinstallprompt for custom install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
    }
    window.location.reload();
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setCanInstall(false);
      setDeferredPrompt(null);
    }
  };

  if (!hasUpdate && !canInstall) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="اعلان‌های وب‌اپلیکیشن"
      style={{
        position: "fixed",
        insetBlockEnd: "var(--space-4, 16px)",
        insetInlineStart: "var(--space-4, 16px)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2, 8px)",
      }}
    >
      {hasUpdate && (
        <div
          style={{
            background: "var(--color-surface, #1E293B)",
            border: "1px solid var(--color-primary, #0D9488)",
            borderRadius: "var(--radius-md, 8px)",
            padding: "var(--space-3, 12px) var(--space-4, 16px)",
            boxShadow: "var(--shadow-lg, 0 10px 15px -3px rgba(0,0,0,0.3))",
            color: "var(--color-text, #F8FAFC)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3, 12px)",
            fontSize: "var(--font-size-sm, 14px)",
          }}
        >
          <span>🚀 نسخه جدید اندورا در دسترس است.</span>
          <button
            type="button"
            onClick={handleUpdate}
            style={{
              background: "var(--color-primary, #0D9488)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "var(--radius-sm, 6px)",
              padding: "4px 10px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            به‌روزرسانی
          </button>
        </div>
      )}

      {canInstall && (
        <div
          style={{
            background: "var(--color-surface, #1E293B)",
            border: "1px solid var(--color-border, #334155)",
            borderRadius: "var(--radius-md, 8px)",
            padding: "var(--space-3, 12px) var(--space-4, 16px)",
            boxShadow: "var(--shadow-md, 0 4px 6px -1px rgba(0,0,0,0.2))",
            color: "var(--color-text, #F8FAFC)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3, 12px)",
            fontSize: "var(--font-size-sm, 14px)",
          }}
        >
          <span>📲 نصب اندورا به عنوان برنامه مستقل</span>
          <button
            type="button"
            onClick={handleInstallClick}
            style={{
              background: "var(--color-primary, #0D9488)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "var(--radius-sm, 6px)",
              padding: "4px 10px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            نصب (Install)
          </button>
          <button
            type="button"
            onClick={() => setCanInstall(false)}
            aria-label="بستن اعلان"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--color-text-muted, #94A3B8)",
              cursor: "pointer",
              padding: "2px 6px",
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
