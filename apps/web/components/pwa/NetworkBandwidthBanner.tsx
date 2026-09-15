"use client";

import { useEffect, useState } from "react";
import {
  getNetworkQualityState,
  NetworkQualityState,
  setLowBandwidthMode,
  subscribeToNetworkQuality,
} from "../../lib/network-quality";
import styles from "./network-banner.module.css";

export function NetworkBandwidthBanner() {
  const [network, setNetwork] = useState<NetworkQualityState | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setNetwork(getNetworkQualityState());
    const unsub = subscribeToNetworkQuality((st) => {
      setNetwork(st);
    });
    return unsub;
  }, []);

  if (!network || dismissed) {
    return null;
  }

  // Display conditions: Offline, or Low-Bandwidth Mode active
  const isOffline = !network.isOnline;
  const isDegraded =
    network.effectiveType === "2g" ||
    network.effectiveType === "slow-2g" ||
    network.saveData;

  if (!isOffline && !network.isLowBandwidthMode && !isDegraded) {
    return null;
  }

  return (
    <aside
      className={styles.bannerContainer}
      role="status"
      aria-live="polite"
      aria-label="وضعیت اتصال شبکه و پهنای باند"
    >
      <div className={styles.bannerContent}>
        <div className={styles.bannerMessage}>
          {isOffline ? (
            <>
              <span className={styles.bannerBadge}>آفلاین</span>
              <span>
                اتصال اینترنت قطع است. تغییرات و پیش‌نویس‌های شما در حافظه محلی ذخیره
                می‌شوند.
              </span>
            </>
          ) : (
            <>
              <span className={styles.bannerBadge}>
                {network.effectiveType.toUpperCase()}
              </span>
              <span>
                حالت بهینه مصرف اینترنت فعال است. بارگذاری فایل‌های حجیم و انیمیشن‌ها
                محدود شده است.
              </span>
            </>
          )}
        </div>

        <div className={styles.actionsGroup}>
          {!isOffline && (
            <button
              type="button"
              className={styles.toggleButton}
              onClick={() => setLowBandwidthMode(!network.isLowBandwidthMode)}
            >
              {network.isLowBandwidthMode
                ? "خروج از حالت بهینه"
                : "فعال‌سازی حالت بهینه"}
            </button>
          )}

          {isOffline && (
            <button
              type="button"
              className={styles.toggleButton}
              onClick={() => {
                if (typeof window !== "undefined") window.location.reload();
              }}
            >
              تلاش مجدد اتصال
            </button>
          )}

          <button
            type="button"
            className={styles.dismissButton}
            onClick={() => setDismissed(true)}
            aria-label="بستن پیام"
          >
            ✕
          </button>
        </div>
      </div>
    </aside>
  );
}
