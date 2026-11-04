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
        background: "linear-gradient(135deg, #064e3b 0%, #047857 50%, #065f46 100%)",
        borderRadius: "1.5rem",
        padding: "1.75rem 2rem",
        color: "#ffffff",
        border: "1px solid rgba(167, 243, 208, 0.25)",
        boxShadow: "0 12px 32px -8px rgba(4, 120, 87, 0.4)",
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
              padding: "0.2rem 0.65rem",
              borderRadius: "9999px",
              background: "rgba(245, 158, 11, 0.2)",
              color: "#fef3c7",
              border: "1px solid rgba(245, 158, 11, 0.4)",
            }}
          >
            {isListening ? "استودیوی شنیداری رادیویی (Radio Wave Studio)" : "نردبان ۱۰ مرحله‌ای CEFR"}
          </span>
        </div>

        <h2 style={{ fontSize: "1.35rem", fontWeight: 800, margin: "0 0 0.5rem", color: "#f8fafc" }}>
          {isListening ? "ورود به استودیوی شنیداری رادیویی (Radio Wave Studio)" : `ورود به زمین بازی تعاملی ${skillTitleFa}`}
        </h2>

        <p style={{ fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.92)", margin: 0, lineHeight: 1.6 }}>
          {isListening
            ? "تنظیم موج رادیو، شنیدن مکالمات روزمره انگلیسی، شکار کلمات کلیدی، تکمیل جاهای خالی و آزمون درک مطلب در محیطی روشن و دوستانه از A1 تا C2!"
            : "در هر سطح (از A1 تا C2) بازی‌های سرعتی و تعاملی را حل کن، با کسب امتیاز بالای ۷۰٪ قفل مراحل بعدی را باز کن و نامت را در جدول برترین‌ها ثبت کن!"}
        </p>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.85)" }}>
            {isListening ? "📻 تنظیم فرکانس رادیویی" : "⚡ صفر کیلوبایت دانلود صدا"}
          </span>
          <span style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.85)" }}>•</span>
          <span style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.85)" }}>
            {isListening ? "🎙️ شکار زنده کلمات کلیدی" : "🎯 فیدبک و تحلیل آنی"}
          </span>
          <span style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.85)" }}>•</span>
          <span style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.85)" }}>
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
          background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
          color: "#ffffff",
          boxShadow: "0 6px 20px rgba(245, 158, 11, 0.45)",
          border: "none",
        }}
      >
        {isListening ? "🎧 اتصال به خط شنود و رهگیری ➔" : "🎮 ورود به زمین بازی ➔"}
      </Link>
    </section>
  );
}
