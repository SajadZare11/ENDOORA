"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DEFAULT_SITE_CONTENT, type AnnouncementBannerConfig } from "../../lib/site-cms-content";

export function PublicTopBanner({ locale = "fa" }: { locale?: string }) {
  const [banner, setBanner] = useState<AnnouncementBannerConfig>(DEFAULT_SITE_CONTENT.banner);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    let ignore = false;
    fetch("/api/admin/site-content")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!ignore && json?.live?.banner) {
          setBanner(json.live.banner);
        }
      })
      .catch(() => {
        // Fallback to initial
      });

    return () => {
      ignore = true;
    };
  }, []);

  if (!banner.enabled || dismissed) {
    return null;
  }

  const isFa = locale === "fa";
  const text = isFa ? banner.textFa : banner.textEn || banner.textFa;
  const badge = isFa ? banner.badgeFa : banner.badgeEn || banner.badgeFa;
  const actionLabel = isFa ? banner.actionLabelFa : banner.actionLabelEn || banner.actionLabelFa;

  return (
    <div
      role="region"
      aria-label="اعلان ویژه سایت"
      style={{
        background: banner.bgColor || "linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)",
        color: banner.textColor || "#ffffff",
        padding: "0.55rem 1rem",
        fontSize: "0.85rem",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        textAlign: "center",
        flexWrap: "wrap",
        position: "relative",
        zIndex: 50,
      }}
    >
      {badge && (
        <span
          style={{
            background: "rgba(255, 255, 255, 0.22)",
            color: "#ffffff",
            padding: "0.15rem 0.5rem",
            borderRadius: "9999px",
            fontSize: "0.75rem",
            fontWeight: "700",
          }}
        >
          {badge}
        </span>
      )}

      <span>{text}</span>

      {actionLabel && banner.actionHref && (
        <Link
          href={banner.actionHref}
          style={{
            color: "#ffffff",
            textDecoration: "underline",
            fontWeight: "700",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          <span>{actionLabel}</span>
          <span style={{ fontSize: "0.8rem" }}>←</span>
        </Link>
      )}

      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="بستن اعلان"
        style={{
          background: "transparent",
          border: "none",
          color: "rgba(255, 255, 255, 0.8)",
          fontSize: "1rem",
          cursor: "pointer",
          marginRight: "auto",
          padding: "0 0.4rem",
        }}
      >
        ×
      </button>
    </div>
  );
}
