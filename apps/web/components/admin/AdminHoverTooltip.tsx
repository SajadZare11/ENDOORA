"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./admin-hover-tooltip.module.css";

export interface AdminHoverTooltipProps {
  whatIsIt: string;
  siteLocation: string;
  sensitivity: "safe" | "medium" | "critical";
  highlightKey?: string;
  itemTitle?: string;
  isCollapsed?: boolean;
  onHoverTarget?: (target: string | null) => void;
  children: React.ReactNode;
  inline?: boolean;
}

export function AdminHoverTooltip({
  whatIsIt,
  siteLocation,
  sensitivity,
  highlightKey,
  itemTitle,
  isCollapsed = false,
  onHoverTarget,
  children,
  inline = false,
}: AdminHoverTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

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

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipWidth = 330;

    // In RTL layout, sidebar is on the right side of the screen.
    // Position the tooltip card to the left of the question button.
    let left = rect.left - tooltipWidth - 12;
    if (left < 16) {
      // If not enough room to the left, fallback within viewport bounds
      left = Math.max(16, Math.min(window.innerWidth - tooltipWidth - 16, rect.left));
    }

    const top = Math.max(16, Math.min(window.innerHeight - 260, rect.top - 18));
    setCoords({ top, left });
  }, []);

  const handleOpen = () => {
    updatePosition();
    setIsOpen(true);
    if (highlightKey && onHoverTarget) {
      onHoverTarget(highlightKey);
    }
  };

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (highlightKey && onHoverTarget) {
      onHoverTarget(null);
    }
  }, [highlightKey, onHoverTarget]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        handleClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    const handleReposition = () => {
      updatePosition();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [isOpen, handleClose, updatePosition]);

  const { label: sensitivityText, badgeClass } = getSensitivityDetails();

  if (isCollapsed) {
    return <div className={styles.collapsedWrapper}>{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      className={`${styles.wrapper} ${inline ? styles.inline : ""}`}
    >
      <div className={styles.mainItem}>{children}</div>

      <button
        ref={triggerRef}
        type="button"
        className={`${styles.questionBtn} ${isOpen ? styles.questionBtnActive : ""}`}
        onClick={handleToggle}
        title={`راهنما و توضیحات ${itemTitle || ""}`}
        aria-label={`توضیحات و راهنمای ${itemTitle || whatIsIt}`}
        aria-expanded={isOpen}
      >
        ?
      </button>

      {isOpen && (
        <div
          ref={tooltipRef}
          className={styles.tooltipCard}
          style={{
            position: "fixed",
            top: `${coords.top}px`,
            left: `${coords.left}px`,
          }}
          dir="rtl"
        >
          {/* Header */}
          <div className={styles.tooltipHeader}>
            <div className={styles.tooltipHeaderTitleRow}>
              <span className={styles.tooltipHeaderIcon}>💡</span>
              <strong className={styles.tooltipHeaderTitle}>
                {itemTitle ? `راهنمای «${itemTitle}»` : "راهنما و توضیحات بخش"}
              </strong>
            </div>
            <button
              type="button"
              className={styles.tooltipCloseBtn}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClose();
              }}
              title="بستن توضیحات"
              aria-label="بستن"
            >
              ✕
            </button>
          </div>

          {/* Line 1: What is it? */}
          <div className={styles.line}>
            <span className={styles.lineIcon}>ℹ️</span>
            <div className={styles.lineContent}>
              <strong className={styles.lineTitle}>این بخش چیه؟:</strong>
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
