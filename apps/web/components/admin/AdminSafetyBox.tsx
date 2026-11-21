"use client";

import React from "react";
import styles from "./admin-safety-box.module.css";

export interface AdminSafetyBoxProps {
  title?: string;
  impact: string;
  howToStaySafe: string;
  dangerLevel: "safe" | "medium" | "critical";
  thingsToAvoid?: string[];
  liveSiteUrl?: string;
}

export function AdminSafetyBox({
  title = "🚨 این تنظیمات چه اثری روی سایت می‌گذارد و چطور خرابکاری نکنیم؟",
  impact,
  howToStaySafe,
  dangerLevel,
  thingsToAvoid = [],
  liveSiteUrl,
}: AdminSafetyBoxProps) {
  const getBoxStyle = () => {
    switch (dangerLevel) {
      case "critical":
        return styles.boxCritical;
      case "medium":
        return styles.boxMedium;
      default:
        return styles.boxSafe;
    }
  };

  const getBadgeText = () => {
    switch (dangerLevel) {
      case "critical":
        return "🔴 منطقه فوق‌العاده حساس";
      case "medium":
        return "🟡 نیازمند دقت و بازبینی";
      default:
        return "🟢 تغییرات امن و کم‌ریسک";
    }
  };

  return (
    <div className={`${styles.box} ${getBoxStyle()}`} dir="rtl">
      <div className={styles.topRow}>
        <div className={styles.titleArea}>
          <span className={styles.icon}>
            {dangerLevel === "critical" ? "🚨" : dangerLevel === "medium" ? "⚠️" : "🛡️"}
          </span>
          <h4 className={styles.title}>{title}</h4>
        </div>
        <div className={styles.badgesArea}>
          <span className={styles.levelBadge}>{getBadgeText()}</span>
          {liveSiteUrl && (
            <a
              href={liveSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnVisit}
            >
              <span>مشاهده این بخش در سایت</span>
              <span>↗</span>
            </a>
          )}
        </div>
      </div>

      <div className={styles.grid}>
        {/* 1. Direct Impact */}
        <div className={styles.column}>
          <div className={styles.columnHeader}>
            <span>⚡</span>
            <strong>اثر مستقیم روی سایت:</strong>
          </div>
          <p className={styles.columnText}>{impact}</p>
        </div>

        {/* 2. How to Stay Safe */}
        <div className={styles.column}>
          <div className={styles.columnHeader}>
            <span>🛡️</span>
            <strong>چطور با خیال راحت کار کنم؟:</strong>
          </div>
          <p className={styles.columnText}>{howToStaySafe}</p>
        </div>
      </div>

      {/* 3. Red lines / Things to avoid */}
      {thingsToAvoid.length > 0 && (
        <div className={styles.avoidSection}>
          <div className={styles.avoidHeader}>
            <span>⛔</span>
            <strong>خط قرمزها (کارهایی که نباید اشتباهی انجام دهید):</strong>
          </div>
          <ul className={styles.avoidList}>
            {thingsToAvoid.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
