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
  const isListening = skill === "listening";

  return (
    <section
      style={{
        marginBlock: "2rem",
        background: isListening
          ? "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)"
          : "linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))",
        borderRadius: "1.5rem",
        padding: "1.75rem 2rem",
        color: "#ffffff",
        border: isListening
          ? "1px solid rgba(255, 255, 255, 0.2)"
          : "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: isListening
          ? "0 10px 30px -10px rgba(37, 99, 235, 0.35)"
          : "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
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
          <span style={{ fontSize: "1.75rem" }}>{isListening ? "📻" : "🕹️"}</span>
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 800,
              padding: "0.2rem 0.6rem",
              borderRadius: "9999px",
              background: isListening ? "rgba(255, 255, 255, 0.18)" : "rgba(56, 189, 248, 0.15)",
              color: isListening ? "#ffffff" : "#38bdf8",
              border: isListening ? "1px solid rgba(255, 255, 255, 0.3)" : "1px solid rgba(56, 189, 248, 0.3)",
            }}
          >
            {isListening ? "استودیوی شنیداری رادیویی (Radio Wave Studio)" : "نردبان ۱۰ مرحله‌ای CEFR"}
          </span>
        </div>

        <h2 style={{ fontSize: "1.35rem", fontWeight: 800, margin: "0 0 0.5rem", color: "#f8fafc" }}>
          {isListening ? "ورود به استودیوی شنیداری رادیویی (Radio Wave Studio)" : `ورود به زمین بازی تعاملی ${skillTitleFa}`}
        </h2>

        <p style={{ fontSize: "0.9rem", color: isListening ? "rgba(255, 255, 255, 0.9)" : "#94a3b8", margin: 0, lineHeight: 1.6 }}>
          {isListening
            ? "تنظیم موج رادیو، شنیدن مکالمات روزمره انگلیسی، شکار کلمات کلیدی، تکمیل جاهای خالی و آزمون درک مطلب در محیطی روشن و دوستانه از A1 تا C2!"
            : "در هر سطح (از A1 تا C2) بازی‌های سرعتی و تعاملی را حل کن، با کسب امتیاز بالای ۷۰٪ قفل مراحل بعدی را باز کن و نامت را در جدول برترین‌ها ثبت کن!"}
        </p>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.8rem", color: isListening ? "rgba(255, 255, 255, 0.85)" : "#cbd5e1" }}>
            {isListening ? "📻 تنظیم فرکانس رادیویی" : "⚡ صفر کیلوبایت دانلود صدا"}
          </span>
          <span style={{ fontSize: "0.8rem", color: isListening ? "rgba(255, 255, 255, 0.85)" : "#cbd5e1" }}>•</span>
          <span style={{ fontSize: "0.8rem", color: isListening ? "rgba(255, 255, 255, 0.85)" : "#cbd5e1" }}>
            {isListening ? "🎙️ شکار زنده کلمات کلیدی" : "🎯 فیدبک و تحلیل آنی"}
          </span>
          <span style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>•</span>
          <span style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>
            {isListening ? "🕵️ پرونده‌های ۶۰ گانه کارآگاهی" : "🏆 رقابت زنده کشوری"}
          </span>
        </div>
      </div>

      <Link
        href={`/skills/${skill}/game`}
        className={styles.playBtn}
        style={{
          width: "auto",
          padding: "0.9rem 1.75rem",
          fontSize: "1rem",
          background: isListening
            ? "linear-gradient(135deg, #059669 0%, #10b981 100%)"
            : undefined,
          boxShadow: isListening
            ? "0 6px 20px rgba(16, 185, 129, 0.4)"
            : "0 6px 20px rgba(37, 99, 235, 0.4)",
        }}
      >
        {isListening ? "🎧 اتصال به خط شنود و رهگیری ➔" : "🎮 ورود به زمین بازی ➔"}
      </Link>
    </section>
  );
}
