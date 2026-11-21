"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./admin-hover-tooltip.module.css";

export interface AdminHoverTooltipProps {
  whatIsIt: string;
  siteLocation: string;
  sensitivity: "safe" | "medium" | "critical";
  highlightKey?: string;
  onHoverTarget?: (target: string | null) => void;
  children: React.ReactNode;
  inline?: boolean;
}

export function AdminHoverTooltip({
  whatIsIt,
  siteLocation,
  sensitivity,
  highlightKey,
  onHoverTarget,
  children,
  inline = false,
}: AdminHoverTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; position: "top" | "bottom" }>({
    top: 0,
    left: 0,
    position: "bottom",
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getSensitivityDetails = () => {
    switch (sensitivity) {
      case "critical":
        return {
          label: "🔴 خیلی حساس و پرخطر (دستکاری در موتور سایت)",
          badgeClass: styles.badgeCritical,
        };
      case "medium":
        return {
          label: "🟡 نیازمند دقت (تغییر عمومی در دید همه کاربران)",
          badgeClass: styles.badgeMedium,
        };
      default:
        return {
          label: "🟢 بی‌خطر و امن (با خیال راحت تست کنید)",
          badgeClass: styles.badgeSafe,
        };
    }
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const position = spaceBelow < 170 ? "top" : "bottom";
        
        setCoords({
          top: position === "bottom" ? rect.bottom + 8 : rect.top - 8,
          left: Math.max(10, Math.min(window.innerWidth - 320, rect.left + rect.width / 2 - 150)),
          position,
        });
        setIsVisible(true);
      }
      if (highlightKey && onHoverTarget) {
        onHoverTarget(highlightKey);
      }
    }, 120);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
    if (highlightKey && onHoverTarget) {
      onHoverTarget(null);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const { label: sensitivityText, badgeClass } = getSensitivityDetails();

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${inline ? styles.inline : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {isVisible && (
        <div
          className={`${styles.tooltipCard} ${
            coords.position === "top" ? styles.positionTop : styles.positionBottom
          }`}
          style={{
            position: "fixed",
            top: coords.position === "top" ? undefined : `${coords.top}px`,
            bottom: coords.position === "top" ? `${window.innerHeight - coords.top}px` : undefined,
            left: `${coords.left}px`,
          }}
          dir="rtl"
        >
          {/* Line 1: What is it? (5-year-old explanation) */}
          <div className={styles.line}>
            <span className={styles.lineIcon}>💡</span>
            <div className={styles.lineContent}>
              <strong className={styles.lineTitle}>این چیه؟:</strong>
              <span className={styles.lineText}>{whatIsIt}</span>
            </div>
          </div>

          {/* Line 2: Where does it appear on the site? */}
          <div className={styles.line}>
            <span className={styles.lineIcon}>📍</span>
            <div className={styles.lineContent}>
              <strong className={styles.lineTitle}>کجای سایت عوض میشه؟:</strong>
              <span className={styles.lineHighlight}>{siteLocation}</span>
            </div>
          </div>

          {/* Line 3: Sensitivity Level */}
          <div className={`${styles.line} ${styles.sensitivityLine}`}>
            <span className={styles.lineIcon}>🚦</span>
            <div className={styles.lineContent}>
              <strong className={styles.lineTitle}>میزان حساسیت:</strong>
              <span className={`${styles.badge} ${badgeClass}`}>{sensitivityText}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
