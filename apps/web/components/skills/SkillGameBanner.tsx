"use client";

import React from "react";
import Link from "next/link";
import styles from "./game/skills-game.module.css";
import { SkillKey } from "../../data/skills/games/types";

interface Props {
  skill: SkillKey;
  skillTitleFa: string;
}

export function SkillGameBanner({ skill, skillTitleFa }: Props) {
  return (
    <section
      style={{
        marginBlock: "2rem",
        background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))",
        borderRadius: "1.5rem",
        padding: "1.75rem 2rem",
        color: "#ffffff",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1.5rem",
        flexWrap: "wrap",
      }}
      aria-label={`چالش بازی تعاملی ${skillTitleFa}`}
    >
      <div style={{ maxWidth: 540 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "1.75rem" }}>🕹️</span>
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 800,
              padding: "0.2rem 0.6rem",
              borderRadius: "9999px",
              background: "rgba(56, 189, 248, 0.15)",
              color: "#38bdf8",
              border: "1px solid rgba(56, 189, 248, 0.3)",
            }}
          >
            نردبان ۱۰ مرحله‌ای CEFR
          </span>
        </div>

        <h2 style={{ fontSize: "1.35rem", fontWeight: 800, margin: "0 0 0.5rem", color: "#f8fafc" }}>
          ورود به زمین بازی تعاملی {skillTitleFa}
        </h2>

        <p style={{ fontSize: "0.9rem", color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
          در هر سطح (از A1 تا C2) بازی‌های سرعتی و تعاملی را حل کن، با کسب امتیاز بالای ۷۰٪ قفل مراحل بعدی را باز کن و نامت را در جدول برترین‌ها ثبت کن!
        </p>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>⚡ صفر کیلوبایت دانلود صدا</span>
          <span style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>•</span>
          <span style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>🎯 فیدبک و تحلیل آنی</span>
          <span style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>•</span>
          <span style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>🏆 رقابت زنده کشوری</span>
        </div>
      </div>

      <Link
        href={`/skills/${skill}/game`}
        className={styles.playBtn}
        style={{
          width: "auto",
          padding: "0.9rem 1.75rem",
          fontSize: "1rem",
          boxShadow: "0 6px 20px rgba(37, 99, 235, 0.4)",
        }}
      >
        🎮 ورود به زمین بازی ➔
      </Link>
    </section>
  );
}
