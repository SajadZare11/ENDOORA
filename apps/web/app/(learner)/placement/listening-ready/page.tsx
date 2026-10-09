"use client";

import Link from "next/link";
import { useState } from "react";
import EndooraBackground from "@/components/design/EndooraBackground";
import GlassCard from "@/components/design/GlassCard";
import { Button } from "@endoora/ui";
import { PublicShell } from "@/components/marketing/PublicShell";
import styles from "../placement.module.css";

export default function ListeningReadyPage() {
  const [status, setStatus] = useState<string>("آماده بررسی دسترسی صوتی مرورگر");
  const [hasChecked, setHasChecked] = useState(false);
  const [isReady, setIsReady] = useState(false);

  async function checkMicrophone() {
    try {
      if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setStatus("دسترسی صوتی مرورگر تایید شد. آماده برای تعاملات شنیداری و گفتاری.");
        setIsReady(true);
      } else {
        setStatus("مرورگر شما از ورودی صوتی پشتیبانی نمی‌کند یا دسترسی محدود است.");
      }
    } catch {
      setStatus("دسترسی میکروفون داده نشد. نگران نباشید؛ می‌توانید بخش‌های متنی را ادامه دهید.");
    } finally {
      setHasChecked(true);
    }
  }

  return (
    <PublicShell locale="fa" currentPath="/placement/listening-ready">
      <EndooraBackground>
        <div className={styles.page} dir="rtl">
          <div className={styles.container}>
            <GlassCard>
              <div className={styles.card} style={{ textAlign: "center", maxWidth: "44rem", marginInline: "auto" }}>
                <div className={styles.heroTag}>
                  🎧 پیش‌نیاز شنیداری و گفتاری
                </div>
                <h1 style={{ fontSize: "clamp(1.75rem, 3vw, 2.4rem)", fontWeight: 900, marginBlock: "var(--space-2) var(--space-3)" }}>
                  <span className={styles.heroBrandWrap}>
                    <svg className={styles.heroSpark} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M12 2C12 7.523 7.523 12 2 12C7.523 12 12 16.477 12 22C12 16.477 16.477 12 22 12C16.477 12 12 7.523 12 2Z"
                        fill="url(#sparkGradMic)"
                      />
                      <circle cx="12" cy="12" r="1.5" fill="#ffffff" opacity="0.9" />
                      <defs>
                        <linearGradient id="sparkGradMic" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#06b6d4" />
                          <stop offset="1" stopColor="#0284c7" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className={styles.heroBrandText}>سنجش،</span>
                  </span>{" "}
                  <span className={styles.heroSubText}>آمادگی صوتی</span>{" "}
                  <span className={styles.heroAccent}>و میکروفون</span>
                </h1>
                <p style={{ color: "var(--color-muted)", lineHeight: 1.9, marginBlockEnd: "var(--space-6)", fontSize: "1rem" }}>
                  برای شرکت در بخش‌های شنیداری آزمون تعیین سطح و تعاملات گفتاری هوش مصنوعی، می‌توانید وضعیت ضبط و پخش صوتی مرورگر خود را بسنجید.
                </p>

                <div
                  style={{
                    background: isReady ? "var(--color-success-bg, #ecfdf5)" : "var(--color-surface-hover)",
                    border: `1.5px solid ${isReady ? "var(--color-success, #10b981)" : "var(--color-border)"}`,
                    borderRadius: "var(--radius-card)",
                    padding: "var(--space-5)",
                    marginBlockEnd: "var(--space-6)",
                    color: isReady ? "var(--color-success-text, #065f46)" : "var(--color-text)",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "var(--space-2)",
                  }}
                >
                  <span style={{ fontSize: "1.25rem" }}>{isReady ? "✅" : "🎙️"}</span>
                  <span>{status}</span>
                </div>

                <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap" }}>
                  <Button type="button" variant="primary" onClick={checkMicrophone} className={styles.button}>
                    {hasChecked ? "بررسی مجدد میکروفون" : "تست و فعال‌سازی میکروفون"}
                  </Button>
                  <Link
                    href="/placement/demo"
                    className={styles.button}
                    style={{
                      background: "var(--color-surface)",
                      color: "var(--color-text)",
                      border: "1px solid var(--color-border)",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                    }}
                  >
                    <span>ورود به آزمون تعیین سطح</span>
                    <span aria-hidden="true">←</span>
                  </Link>
                  <Link
                    href="/skills/listening"
                    className={styles.button}
                    style={{
                      background: "var(--color-surface)",
                      color: "var(--color-muted)",
                      border: "1px solid var(--color-border)",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                    }}
                  >
                    <span>مهارت شنیداری</span>
                  </Link>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </EndooraBackground>
    </PublicShell>
  );
}
