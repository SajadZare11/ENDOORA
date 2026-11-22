"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./promo-announcement-bar.module.css";
import { AnnouncementBannerConfig } from "@/lib/site-cms-content";

export interface ExtendedBannerConfig extends AnnouncementBannerConfig {
  type?: "info" | "warning" | "urgent" | "sale";
  countdownEnd?: string;
  dismissible?: boolean;
  targetPaths?: string[];
}

interface PromoAnnouncementBarProps {
  banner?: ExtendedBannerConfig;
  currentPath?: string;
  locale?: string;
}

export function PromoAnnouncementBar({
  banner,
  currentPath = "/",
  locale = "fa",
}: PromoAnnouncementBarProps) {
  const [isDismissed, setIsDismissed] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  const isFa = locale === "fa";

  useEffect(() => {
    if (!banner || !banner.enabled) {
      setIsDismissed(true);
      return;
    }

    // Check targeting
    if (banner.targetPaths && banner.targetPaths.length > 0) {
      const match = banner.targetPaths.some(
        (p) => p === "all" || p === currentPath || currentPath.startsWith(`${p}/`)
      );
      if (!match) {
        setIsDismissed(true);
        return;
      }
    }

    // Check dismissal in localStorage
    const bannerKey = `endoora_banner_dismissed_${banner.textFa?.slice(0, 20)}`;
    const dismissed = localStorage.getItem(bannerKey);
    if (dismissed && (banner.dismissible !== false)) {
      setIsDismissed(true);
      return;
    }

    setIsDismissed(false);

    // Setup countdown timer if countdownEnd is present
    if (banner.countdownEnd) {
      const updateTimer = () => {
        const diff = new Date(banner.countdownEnd!).getTime() - Date.now();
        if (diff <= 0) {
          setTimeLeft(null);
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft({ hours, minutes, seconds });
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [banner, currentPath]);

  if (isDismissed || !banner || !banner.enabled || !banner.type || banner.type === "sale" || (banner.countdownEnd && Date.parse(banner.countdownEnd) <= Date.now())) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    const bannerKey = `endoora_banner_dismissed_${banner.textFa?.slice(0, 20)}`;
    localStorage.setItem(bannerKey, "true");
  };

  const bannerType = banner.type || "sale";
  const typeClass =
    bannerType === "info"
      ? styles.typeInfo
      : bannerType === "warning"
      ? styles.typeWarning
      : bannerType === "urgent"
      ? styles.typeUrgent
      : styles.typeSale;

  const customStyle: React.CSSProperties = {};
  if (banner.bgColor) customStyle.background = banner.bgColor;
  if (banner.textColor) customStyle.color = banner.textColor;

  const text = isFa ? banner.textFa : banner.textEn || banner.textFa;
  const badge = isFa ? banner.badgeFa : banner.badgeEn;
  const actionLabel = isFa ? banner.actionLabelFa : banner.actionLabelEn;
  const actionHref = banner.actionHref;

  return (
    <aside
      className={`${styles.bar} ${typeClass}`}
      style={customStyle}
      role="region"
      aria-label="اعلان ویژه ایندورا"
      dir={isFa ? "rtl" : "ltr"}
    >
      <div className={styles.inner}>
        {badge && <span className={styles.badge}>{badge}</span>}
        <span className={styles.text}>{text}</span>

        {timeLeft && (
          <div className={styles.countdownWrap} title="زمان باقی‌مانده">
            <span>⏳</span>
            <span>
              {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
          </div>
        )}

        {actionLabel && actionHref && (
          <Link href={actionHref} className={styles.actionBtn}>
            {actionLabel}
          </Link>
        )}
      </div>

      {banner.dismissible !== false && (
        <button
          type="button"
          className={styles.btnClose}
          onClick={handleDismiss}
          aria-label="بستن اعلان"
          title="بستن اعلان"
        >
          ×
        </button>
      )}
    </aside>
  );
}
