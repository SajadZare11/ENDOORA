"use client";

import Link from "next/link";
import { useState } from "react";
import EndooraBackground from "@/components/design/EndooraBackground";
import GlassCard from "@/components/design/GlassCard";
import styles from "../placement.module.css";

export default function ListeningReadyPage() {
  const [status, setStatus] = useState<string>("آماده بررسی دسترسی صوتی مرورگر");
  const [hasChecked, setHasChecked] = useState(false);
  const [isReady, setIsReady] = useState(false);

  async function checkMicrophone() {
    try {
      if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setStatus("دسترسی صوتی مرورگر تایید شد. آماده برای تعاملات شنیداری.");
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
    <EndooraBackground>
      <main className={styles.page} dir="rtl">
        <div className={styles.container}>
          <GlassCard>
            <div className={styles.card} style={{ textAlign: "center", maxWidth: "42rem", marginInline: "auto" }}>
              <p style={{ color: "var(--color-primary)", fontWeight: 700, fontSize: "var(--font-size-meta)" }}>
                پیش‌نیاز شنیداری و آزمایشگاه صوتی
              </p>
              <h1 style={{ fontSize: "var(--font-size-title-1)", marginBlock: "var(--space-3)" }}>
                بررسی آمادگی صوتی
              </h1>
              <p style={{ color: "var(--color-text-muted)", lineHeight: 1.8, marginBlockEnd: "var(--space-6)" }}>
                برای شرکت در بخش‌های شنیداری و تعاملی گفتاری در فازهای بعدی، می‌توانید اکنون وضعیت ضبط مرورگر خود را بسنجید.
              </p>

              <div
                style={{
                  background: isReady ? "var(--color-success-bg)" : "var(--color-surface-hover)",
                  border: `1px solid ${isReady ? "var(--color-success)" : "var(--color-border)"}`,
                  borderRadius: "var(--radius-card)",
                  padding: "var(--space-4)",
                  marginBlockEnd: "var(--space-6)",
                  color: "var(--color-text)",
                }}
              >
                {status}
              </div>

              <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className={styles.button}
                  onClick={checkMicrophone}
                  style={{ marginBlockStart: 0 }}
                >
                  {hasChecked ? "بررسی مجدد میکروفون" : "بررسی میکروفون"}
                </button>
                <Link
                  href="/placement/demo"
                  className={styles.button}
                  style={{ marginBlockStart: 0, background: "var(--color-surface)", color: "var(--color-text)", border: "1px solid var(--color-border)" }}
                >
                  بازگشت به آزمون تعیین سطح
                </Link>
              </div>
            </div>
          </GlassCard>
        </div>
      </main>
    </EndooraBackground>
  );
}
