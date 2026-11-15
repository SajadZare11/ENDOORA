"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { type FlashSaleCampaignRecord, INITIAL_FLASH_CAMPAIGN } from "@/lib/marketing-content";

export function FlashSaleCountdownBar() {
  const [campaign, setCampaign] = useState<FlashSaleCampaignRecord | null>(INITIAL_FLASH_CAMPAIGN);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 4,
    hours: 18,
    minutes: 30,
    seconds: 0,
  });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    async function loadCampaign() {
      try {
        const res = await fetch("/api/admin/marketing");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.campaign) {
            setCampaign(json.campaign);
          }
        }
      } catch {
        // Fallback to initial
      }
    }
    loadCampaign();
  }, []);

  useEffect(() => {
    if (!campaign || !campaign.isActive) return;

    const targetDate = new Date(campaign.expiresAt).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [campaign]);

  if (!campaign || !campaign.isActive || !isVisible) {
    return null;
  }

  // Theme styling
  let backgroundGradient = "linear-gradient(135deg, #090d16 0%, #1e1b4b 60%, #31104b 100%)";
  let borderHighlight = "#4338ca";

  if (campaign.bannerTheme === "gold_luxury") {
    backgroundGradient = "linear-gradient(135deg, #451a03 0%, #78350f 50%, #b45309 100%)";
    borderHighlight = "#f59e0b";
  } else if (campaign.bannerTheme === "crimson") {
    backgroundGradient = "linear-gradient(135deg, #4c0519 0%, #881337 50%, #1e293b 100%)";
    borderHighlight = "#be123c";
  } else if (campaign.bannerTheme === "emerald") {
    backgroundGradient = "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #065f46 100%)";
    borderHighlight = "#10b981";
  }

  return (
    <div
      dir="rtl"
      style={{
        background: backgroundGradient,
        borderBottom: `2px solid ${borderHighlight}`,
        color: "#ffffff",
        padding: "0.6rem 1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "0.75rem",
        zIndex: 50,
        position: "relative",
        fontSize: "0.85rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
        <span style={{ fontSize: "1.1rem" }}>🔥</span>
        <strong style={{ fontWeight: 800 }}>{campaign.titleFa}:</strong>
        <span style={{ opacity: 0.9 }}>{campaign.taglineFa}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Timer */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", direction: "ltr" }}>
          <div
            style={{
              background: "rgba(0,0,0,0.4)",
              padding: "0.2rem 0.45rem",
              borderRadius: "6px",
              fontWeight: 800,
              fontFamily: "monospace",
            }}
          >
            {String(timeLeft.days).padStart(2, "0")}d
          </div>
          :
          <div
            style={{
              background: "rgba(0,0,0,0.4)",
              padding: "0.2rem 0.45rem",
              borderRadius: "6px",
              fontWeight: 800,
              fontFamily: "monospace",
            }}
          >
            {String(timeLeft.hours).padStart(2, "0")}h
          </div>
          :
          <div
            style={{
              background: "rgba(0,0,0,0.4)",
              padding: "0.2rem 0.45rem",
              borderRadius: "6px",
              fontWeight: 800,
              fontFamily: "monospace",
            }}
          >
            {String(timeLeft.minutes).padStart(2, "0")}m
          </div>
          :
          <div
            style={{
              background: "rgba(0,0,0,0.4)",
              padding: "0.2rem 0.45rem",
              borderRadius: "6px",
              fontWeight: 800,
              fontFamily: "monospace",
            }}
          >
            {String(timeLeft.seconds).padStart(2, "0")}s
          </div>
        </div>

        {/* CTA */}
        <Link
          href={campaign.ctaLink}
          style={{
            background: "#ffffff",
            color: "#0f172a",
            padding: "0.35rem 0.85rem",
            borderRadius: "8px",
            fontWeight: 800,
            fontSize: "0.8rem",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          {campaign.ctaButtonTextFa}
        </Link>

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.7)",
            fontSize: "1rem",
            cursor: "pointer",
            padding: "0.2rem",
          }}
          title="بستن اعلان"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
