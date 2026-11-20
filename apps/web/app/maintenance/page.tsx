"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MaintenancePage() {
  const router = useRouter();
  const [config, setConfig] = useState({
    isEnabled: true,
    titleFa: "سیستم در حال به‌روزرسانی زیرساخت و نگهداری دوره‌ای است",
    titleEn: "System Upgrade & Scheduled Infrastructure Maintenance in Progress",
    messageFa:
      "پلتفرم آموزشی و هوش مصنوعی ایندورا برای ارتقای توان پردازشی و امنیت پایگاه داده به صورت موقت در حالت نگهداری قرار دارد. تمامی دوره‌ها و سوابق شما ایمن هستند و به زودی بازمی‌گردیم.",
    messageEn:
      "Endoora Educational Platform is temporarily undergoing infrastructure scaling and security optimization. All learner progress is secure.",
    estimatedCompletionIso: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
    contactSupportUrl: "https://t.me/endoora_support",
  });

  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 1,
    minutes: 59,
    seconds: 45,
  });

  const [showBypassModal, setShowBypassModal] = useState(false);
  const [bypassKey, setBypassKey] = useState("");
  const [bypassStatus, setBypassStatus] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    // Fetch live maintenance config
    fetch("/api/public/maintenance")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setConfig((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const target = new Date(config.estimatedCompletionIso).getTime();
      const now = Date.now();
      const diff = Math.max(0, target - now);

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [config.estimatedCompletionIso]);

  const handleVerifyBypass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bypassKey.trim()) return;

    setVerifying(true);
    setBypassStatus(null);
    try {
      const res = await fetch(`/api/public/maintenance?bypassKey=${encodeURIComponent(bypassKey.trim())}`);
      const data = await res.json();
      if (data.authorized) {
        setBypassStatus("احراز هویت موفقیت‌آمیز بود! در حال انتقال به پنل مدیریت...");
        if (typeof window !== "undefined") {
          localStorage.setItem("endoora_maintenance_bypassed", "true");
          document.cookie = "endoora_maintenance_bypassed=true; path=/; max-age=86400";
        }
        setTimeout(() => {
          router.push("/admin");
        }, 1200);
      } else {
        setBypassStatus("کلید گذر نامعتبر است. دسترسی رد شد.");
      }
    } catch {
      setBypassStatus("خطا در برقراری ارتباط با سرور احراز هویت.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at top, #131d36 0%, #090d16 100%)",
        color: "#f8fafc",
        fontFamily: "var(--font-vazirmatn, sans-serif)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow effects */}
      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
          top: "10%",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "760px",
          width: "100%",
          background: "rgba(18, 24, 38, 0.8)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "24px",
          padding: "3rem 2.5rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          textAlign: "center",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Pulsating status shield badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(234, 179, 8, 0.15)", border: "1px solid rgba(234, 179, 8, 0.4)", padding: "0.5rem 1.25rem", borderRadius: "999px", color: "#facc15", fontWeight: "700", fontSize: "0.95rem", marginBottom: "1.75rem" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#facc15", display: "inline-block", boxShadow: "0 0 10px #facc15" }} />
          <span>وضعیت: عملیات فنی زیرساخت و ارتقای سرور</span>
        </div>

        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "800",
            marginBottom: "1rem",
            color: "#ffffff",
            lineHeight: 1.4,
          }}
        >
          {config.titleFa}
        </h1>

        <p
          style={{
            fontSize: "1.1rem",
            color: "#94a3b8",
            lineHeight: 1.8,
            marginBottom: "2rem",
          }}
        >
          {config.messageFa}
        </p>

        {/* Live Countdown Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
            maxWidth: "460px",
            margin: "0 auto 2.5rem auto",
          }}
        >
          <div
            style={{
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              padding: "1rem 0.5rem",
            }}
          >
            <span
              style={{
                display: "block",
                fontSize: "2.25rem",
                fontWeight: "800",
                color: "#60a5fa",
                fontFamily: "monospace",
              }}
            >
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span style={{ fontSize: "0.85rem", color: "#64748b" }}>ساعت</span>
          </div>

          <div
            style={{
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              padding: "1rem 0.5rem",
            }}
          >
            <span
              style={{
                display: "block",
                fontSize: "2.25rem",
                fontWeight: "800",
                color: "#38bdf8",
                fontFamily: "monospace",
              }}
            >
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span style={{ fontSize: "0.85rem", color: "#64748b" }}>دقیقه</span>
          </div>

          <div
            style={{
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              padding: "1rem 0.5rem",
            }}
          >
            <span
              style={{
                display: "block",
                fontSize: "2.25rem",
                fontWeight: "800",
                color: "#818cf8",
                fontFamily: "monospace",
              }}
            >
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
            <span style={{ fontSize: "0.85rem", color: "#64748b" }}>ثانیه</span>
          </div>
        </div>

        {/* Action buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <a
            href={config.contactSupportUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "#ffffff",
              padding: "0.85rem 1.75rem",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "0.95rem",
              boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.4)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span>ارتباط با پشتیبانی فنی (تلگرام)</span>
            <span>💬</span>
          </a>

          <button
            type="button"
            onClick={() => setShowBypassModal(true)}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              color: "#94a3b8",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "0.85rem 1.5rem",
              borderRadius: "12px",
              fontWeight: "600",
              fontSize: "0.95rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            🛡️ گذرگاه اختصاصی مدیران (Bypass)
          </button>
        </div>

        {/* English note */}
        <div
          dir="ltr"
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            paddingTop: "1.25rem",
            color: "#64748b",
            fontSize: "0.85rem",
            lineHeight: 1.6,
          }}
        >
          <strong>{config.titleEn}</strong>
          <p style={{ margin: "0.25rem 0 0 0" }}>{config.messageEn}</p>
        </div>
      </div>

      {/* Bypass Key Modal */}
      {showBypassModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "#0f172a",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "20px",
              padding: "2rem",
              maxWidth: "460px",
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "700", color: "#f8fafc" }}>
                🔑 احراز هویت کلید اضطراری مدیران
              </h3>
              <button
                type="button"
                onClick={() => setShowBypassModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>

            <p style={{ fontSize: "0.9rem", color: "#94a3b8", marginBottom: "1.25rem" }}>
              مدیران ارشد با وارد کردن کلید عبور اختصاصی (Master Override Key) می‌توانند قفل نگهداری را گذر کرده و به داشبورد دسترسی یابند.
            </p>

            <form onSubmit={handleVerifyBypass}>
              <div style={{ marginBottom: "1.25rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    color: "#cbd5e1",
                    marginBottom: "0.5rem",
                  }}
                >
                  کلید امنیتی بای‌پس:
                </label>
                <input
                  type="password"
                  dir="ltr"
                  placeholder="Secret Bypass Key..."
                  value={bypassKey}
                  onChange={(e) => setBypassKey(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "10px",
                    color: "#ffffff",
                    fontFamily: "monospace",
                    fontSize: "0.95rem",
                  }}
                />
              </div>

              {bypassStatus && (
                <div
                  style={{
                    padding: "0.75rem",
                    borderRadius: "8px",
                    marginBottom: "1.25rem",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    background: bypassStatus.includes("موفقیت‌آمیز")
                      ? "rgba(16, 185, 129, 0.2)"
                      : "rgba(239, 68, 68, 0.2)",
                    color: bypassStatus.includes("موفقیت‌آمیز") ? "#34d399" : "#f87171",
                    border: bypassStatus.includes("موفقیت‌آمیز")
                      ? "1px solid rgba(16, 185, 129, 0.4)"
                      : "1px solid rgba(239, 68, 68, 0.4)",
                  }}
                >
                  {bypassStatus}
                </div>
              )}

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowBypassModal(false)}
                  style={{
                    padding: "0.75rem 1.25rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "10px",
                    color: "#94a3b8",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={verifying}
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    border: "none",
                    borderRadius: "10px",
                    color: "#ffffff",
                    fontWeight: "700",
                    cursor: verifying ? "not-allowed" : "pointer",
                    fontSize: "0.9rem",
                    boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.3)",
                  }}
                >
                  {verifying ? "در حال اعتبارسنجی..." : "تایید و ورود به سایت"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
