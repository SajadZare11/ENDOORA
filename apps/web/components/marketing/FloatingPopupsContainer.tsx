"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SitePopupConfig } from "../../lib/admin-site-builder-store";

export function FloatingPopupsContainer({ currentPath }: { currentPath: string }) {
  const [popups, setPopups] = useState<SitePopupConfig[]>([]);
  const [activeModal, setActiveModal] = useState<SitePopupConfig | null>(null);
  const [activeRibbon, setActiveRibbon] = useState<SitePopupConfig | null>(null);
  const [activeToast, setActiveToast] = useState<SitePopupConfig | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Countdown timer state for countdown ribbons
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 12,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    async function fetchPopups() {
      try {
        const res = await fetch(`/api/public/site-builder/popups?path=${encodeURIComponent(currentPath)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.popups) {
            setPopups(json.popups);
          }
        }
      } catch {
        // ignore public fetch errors
      }
    }
    fetchPopups();
  }, [currentPath]);

  // Setup triggers
  useEffect(() => {
    if (popups.length === 0) return;

    popups.forEach((p) => {
      const storageKey = `endoora_pop_dismissed_${p.id}`;
      const dismissed = typeof window !== "undefined" && window.sessionStorage.getItem(storageKey);
      if (dismissed && p.frequencyCap === "once_per_session") return;

      if (p.type === "top_countdown_ribbon") {
        setActiveRibbon(p);
      } else if (p.type === "bottom_toast_ribbon") {
        setActiveToast(p);
      } else if (p.type === "center_modal") {
        if (p.triggerType === "time_delay") {
          const timer = setTimeout(() => {
            setActiveModal(p);
          }, (p.triggerDelaySeconds || 3) * 1000);
          return () => clearTimeout(timer);
        } else if (p.triggerType === "exit_intent") {
          const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0) {
              setActiveModal(p);
            }
          };
          document.addEventListener("mouseleave", handleMouseLeave);
          return () => document.removeEventListener("mouseleave", handleMouseLeave);
        }
      }
    });
  }, [popups]);

  // Countdown ticker
  useEffect(() => {
    if (!activeRibbon) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeRibbon]);

  const handleDismiss = (popup: SitePopupConfig) => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(`endoora_pop_dismissed_${popup.id}`, "true");
    }
    if (popup.type === "top_countdown_ribbon") setActiveRibbon(null);
    if (popup.type === "center_modal") setActiveModal(null);
    if (popup.type === "bottom_toast_ribbon") setActiveToast(null);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <>
      {/* 1. TOP COUNTDOWN RIBBON */}
      {activeRibbon && (
        <aside
          role="region"
          aria-label="اعلان و تخفیف ویژه بالای صفحه"
          style={{
            background: "linear-gradient(90deg, #dc2626 0%, #b91c1c 100%)",
            color: "#ffffff",
            padding: "0.6rem 1rem",
            fontSize: "0.85rem",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15)",
            zIndex: 9998,
            direction: "rtl",
          }}
        >
          <span>{activeRibbon.messageFa}</span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              background: "rgba(0,0,0,0.25)",
              padding: "0.2rem 0.6rem",
              borderRadius: "6px",
              fontFamily: "monospace",
              fontSize: "0.95rem",
              fontWeight: "bold",
            }}
          >
            <span>{String(timeLeft.hours).padStart(2, "0")}</span>:
            <span>{String(timeLeft.minutes).padStart(2, "0")}</span>:
            <span>{String(timeLeft.seconds).padStart(2, "0")}</span>
          </div>

          {activeRibbon.couponCode && (
            <button
              type="button"
              onClick={() => handleCopy(activeRibbon.couponCode!)}
              style={{
                background: "#ffffff",
                color: "#dc2626",
                border: "none",
                borderRadius: "4px",
                padding: "0.2rem 0.6rem",
                fontWeight: "bold",
                fontSize: "0.78rem",
                cursor: "pointer",
              }}
            >
              {copiedCode === activeRibbon.couponCode ? "کد کپی شد! ✓" : `کد: ${activeRibbon.couponCode} (کپی)`}
            </button>
          )}

          {activeRibbon.ctaUrl && (
            <Link
              href={activeRibbon.ctaUrl}
              style={{
                background: "#ffffff",
                color: "#b91c1c",
                padding: "0.25rem 0.75rem",
                borderRadius: "6px",
                fontWeight: "bold",
                fontSize: "0.8rem",
                textDecoration: "none",
              }}
            >
              {activeRibbon.ctaTextFa || "مشاهده پیشنهاد"}
            </Link>
          )}

          <button
            type="button"
            onClick={() => handleDismiss(activeRibbon)}
            style={{
              background: "transparent",
              border: "none",
              color: "#ffffff",
              fontSize: "1.1rem",
              cursor: "pointer",
              marginRight: "0.5rem",
              lineHeight: 1,
            }}
            title="بستن اعلان"
          >
            ✕
          </button>
        </aside>
      )}

      {/* 2. CENTER PROMOTIONAL MODAL */}
      {activeModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            direction: "rtl",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              maxWidth: "500px",
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <button
              type="button"
              onClick={() => handleDismiss(activeModal)}
              style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                background: "rgba(0,0,0,0.4)",
                color: "#ffffff",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                cursor: "pointer",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
              }}
            >
              ✕
            </button>

            {activeModal.imageUrl && (
              <img
                src={activeModal.imageUrl}
                alt={activeModal.titleFa}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
              />
            )}

            <div style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1rem", textAlign: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "900", color: "#0f172a" }}>
                {activeModal.titleFa}
              </h3>
              <p style={{ margin: 0, fontSize: "0.92rem", color: "#475569", lineHeight: "1.6" }}>
                {activeModal.messageFa}
              </p>

              {activeModal.couponCode && (
                <div
                  style={{
                    background: "#f1f5f9",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "1px dashed #cbd5e1",
                  }}
                >
                  <span style={{ fontSize: "0.85rem", color: "#64748b" }}>کد تخفیف اختصاصی شما:</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(activeModal.couponCode!)}
                    style={{
                      background: "#2563eb",
                      color: "#ffffff",
                      border: "none",
                      padding: "0.3rem 0.8rem",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    {copiedCode === activeModal.couponCode ? "کپی شد! ✓" : activeModal.couponCode}
                  </button>
                </div>
              )}

              {activeModal.ctaUrl && (
                <Link
                  href={activeModal.ctaUrl}
                  onClick={() => handleDismiss(activeModal)}
                  style={{
                    background: "#2563eb",
                    color: "#ffffff",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    fontWeight: "800",
                    fontSize: "0.95rem",
                    textDecoration: "none",
                  }}
                >
                  {activeModal.ctaTextFa || "ورود و دریافت"}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
