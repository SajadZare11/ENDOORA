"use client";

import React from "react";
import { type CartoonAvatarConfig, BACKGROUNDS, normalizeHairStyle } from "../../lib/cartoon-avatar";

interface CartoonAvatarProps {
  config: CartoonAvatarConfig;
  size?: number;
  className?: string;
  rounded?: boolean;
  bordered?: boolean;
}

export default function CartoonAvatar({
  config,
  size = 120,
  className = "",
  rounded = true,
  bordered = true,
}: CartoonAvatarProps) {
  const bgData = BACKGROUNDS[config.background] || BACKGROUNDS.blue;
  const hairStyle = normalizeHairStyle(config.hairStyle, config.gender);

  // Face shape paths (calibrated around center x=100)
  let facePath = "M 60,65 C 60,40 140,40 140,65 C 140,115 130,145 100,150 C 70,145 60,115 60,65 Z";
  if (config.faceShape === "round") {
    facePath = "M 55,70 C 55,40 145,40 145,70 C 145,115 135,148 100,150 C 65,148 55,115 55,70 Z";
  } else if (config.faceShape === "square") {
    facePath = "M 58,60 C 58,42 142,42 142,60 C 142,110 138,145 100,148 C 62,145 58,110 58,60 Z";
  } else if (config.faceShape === "heart") {
    facePath = "M 56,60 C 56,38 144,38 144,60 C 144,105 125,142 100,152 C 75,142 56,105 56,60 Z";
  }

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      style={{
        borderRadius: rounded ? "50%" : "20px",
        overflow: "hidden",
        boxShadow: bordered ? `0 8px 24px ${bgData.glow}, 0 0 0 3px #ffffff44` : "none",
        display: "inline-block",
        verticalAlign: "middle",
        flexShrink: 0,
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Background Gradients */}
        <linearGradient id="bg-blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#93c5fd" />
        </linearGradient>
        <linearGradient id="bg-purple" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4c1d95" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#d8b4fe" />
        </linearGradient>
        <linearGradient id="bg-sunset" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#991b1b" />
          <stop offset="50%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#fde047" />
        </linearGradient>
        <linearGradient id="bg-emerald" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#064e3b" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#6ee7b7" />
        </linearGradient>
        <linearGradient id="bg-amber" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="50%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#fef08a" />
        </linearGradient>
        <linearGradient id="bg-dark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="50%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <linearGradient id="bg-rose" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#831843" />
          <stop offset="50%" stopColor="#db2777" />
          <stop offset="100%" stopColor="#fbcfe8" />
        </linearGradient>

        {/* Studio Lighting Aura Glow */}
        <radialGradient id="studio-aura" cx="50%" cy="38%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.32" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>

        <clipPath id="avatar-clip">
          <circle cx="100" cy="100" r="100" />
        </clipPath>
      </defs>

      {/* 1. Background Rect */}
      <rect
        width="200"
        height="200"
        fill={`url(#bg-${config.background || "blue"})`}
      />

      {/* Studio Lighting Aura Glow (Pop & rim depth without random noisy debris) */}
      <circle cx="100" cy="85" r="95" fill="url(#studio-aura)" />

      {/* Subtle modern geometric ring accent */}
      <circle
        cx="100"
        cy="100"
        r="92"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.12"
        strokeWidth="1.5"
        strokeDasharray="5 4"
      />

      {/* Clipped Avatar Group */}
      <g clipPath="url(#avatar-clip)">
        {/* ====================================================================
            BACK HAIR LAYER (Rendered behind head and body for volume & drape)
            ==================================================================== */}
        <g id="back-hair">
          {/* Base cranium dome behind head for short styles to eliminate any gaps */}
          {["fade", "spiky", "pompadour", "curly_short", "classic_part", "buzz_cut", "man_bun", "pixie"].includes(hairStyle) && (
            <path
              d="M 52,65 C 46,20 154,20 148,65 Z"
              fill={config.hairColor}
            />
          )}

          {/* Man Bun: Top Knot */}
          {hairStyle === "man_bun" && (
            <g fill={config.hairColor}>
              <circle cx="100" cy="14" r="11" />
              <rect x="94" y="21" width="12" height="5" rx="2" fill={config.clothingColor || "#0f172a"} />
              {/* Highlight */}
              <circle cx="98" cy="12" r="3.5" fill="#ffffff" fillOpacity="0.22" />
            </g>
          )}

          {/* Wavy Long Hair Back Curtain */}
          {hairStyle === "wavy_long" && (
            <g fill={config.hairColor}>
              <path d="M 46,55 C 32,20 168,20 154,55 C 168,95 174,150 160,195 C 145,195 140,165 142,120 C 135,100 135,70 135,60 C 65,60 65,100 58,120 C 60,165 55,195 40,195 C 26,150 32,95 46,55 Z" />
              {/* Wave depth highlights */}
              <path
                d="M 38,100 Q 32,145 44,185"
                stroke="#ffffff"
                strokeOpacity="0.18"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 162,100 Q 168,145 156,185"
                stroke="#ffffff"
                strokeOpacity="0.18"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Straight Long Hair Back */}
          {hairStyle === "straight_long" && (
            <g fill={config.hairColor}>
              <path d="M 48,50 C 35,18 165,18 152,50 C 164,100 168,155 164,198 L 138,198 C 140,140 138,80 135,60 C 65,60 62,80 62,140 L 36,198 C 32,155 36,100 48,50 Z" />
              <line x1="42" y1="105" x2="40" y2="185" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="158" y1="105" x2="160" y2="185" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          )}

          {/* Ponytail Back Tail */}
          {hairStyle === "ponytail" && (
            <g fill={config.hairColor}>
              <path d="M 50,55 C 44,18 156,18 150,55 Z" />
              {/* High arching ponytail plume */}
              <path
                d="M 132,38 C 165,30 188,58 184,105 C 180,135 168,148 160,142 C 162,120 170,95 158,75 C 148,62 136,54 130,48 Z"
              />
              {/* Hair band */}
              <rect x="127" y="38" width="8" height="12" rx="3" transform="rotate(-25 131 44)" fill={config.clothingColor || "#f59e0b"} />
              {/* Ponytail shine */}
              <path
                d="M 148,46 Q 175,58 174,98"
                stroke="#ffffff"
                strokeOpacity="0.25"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Bob Cut Back Volume */}
          {hairStyle === "bob" && (
            <path
              d="M 48,60 C 38,20 162,20 152,60 C 158,95 154,120 144,122 C 138,85 136,65 135,60 C 65,60 64,85 56,122 C 46,120 42,95 48,60 Z"
              fill={config.hairColor}
            />
          )}

          {/* Top Bun: Big Donut Bun */}
          {hairStyle === "top_bun" && (
            <g fill={config.hairColor}>
              <path d="M 50,55 C 44,20 156,20 150,55 Z" />
              <ellipse cx="100" cy="18" rx="19" ry="14" />
              <ellipse cx="100" cy="18" rx="7" ry="5" fill="#000000" fillOpacity="0.25" />
              {/* Bun highlight */}
              <path d="M 88,14 Q 100,8 112,14" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>
          )}

          {/* Braids Back Dome (Volume behind skull) */}
          {hairStyle === "braids" && (
            <path d="M 48,55 C 40,20 160,20 152,55 Z" fill={config.hairColor} />
          )}

          {/* Curly Volume Big Cloud */}
          {hairStyle === "curly_volume" && (
            <g fill={config.hairColor}>
              <path d="M 40,70 C 22,25 65,10 100,10 C 135,10 178,25 160,70 C 178,110 172,165 150,185 C 138,150 140,110 135,70 C 65,70 60,110 50,185 C 28,165 22,110 40,70 Z" />
              {/* Curls texture bubbles */}
              <circle cx="34" cy="90" r="14" />
              <circle cx="38" cy="130" r="14" />
              <circle cx="166" cy="90" r="14" />
              <circle cx="162" cy="130" r="14" />
              <circle cx="50" cy="40" r="15" />
              <circle cx="150" cy="40" r="15" />
              <circle cx="100" cy="16" r="16" />
            </g>
          )}
        </g>

        {/* 2. Neck & Clothing (Calibrated below chin y=150 with anatomical shoulder slope) */}
        {/* Continuous neck down to chest line */}
        <path
          d="M 82,120 L 82,174 C 82,176 118,176 118,174 L 118,120 Z"
          fill={config.skinColor}
        />
        {/* Under-chin shadow cast on neck */}
        <ellipse cx="100" cy="148" rx="18" ry="6" fill="#000000" fillOpacity="0.14" />

        {/* Clothing Models */}
        {config.clothing === "hoodie" && (
          <g id="clothing-hoodie">
            {/* Hood rim draping around neck */}
            <path
              d="M 68,144 C 64,158 74,170 100,170 C 126,170 136,158 132,144 C 122,154 78,154 68,144 Z"
              fill={config.clothingAccent}
            />

            {/* Torso & Shoulders: Ergonomic anatomical slope */}
            <path
              d="M 12,200 L 12,186 C 18,168 48,156 78,148 L 122,148 C 152,156 182,168 188,186 L 188,200 Z"
              fill={config.clothingColor}
            />

            {/* Shoulder raglan / seam lines */}
            <path
              d="M 78,152 Q 62,172 46,200"
              stroke="#000000"
              strokeOpacity="0.14"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 122,152 Q 138,172 154,200"
              stroke="#000000"
              strokeOpacity="0.14"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            {/* Front crossover collar pouch */}
            <path
              d="M 78,148 C 76,164 88,172 100,172 C 112,172 124,164 122,148 C 115,160 85,160 78,148 Z"
              fill={config.clothingAccent}
            />
            {/* Inner neck collar shadow */}
            <path
              d="M 85,150 C 90,161 110,161 115,150 Z"
              fill="#000000"
              fillOpacity="0.18"
            />

            {/* Kangaroo pocket top arc at bottom */}
            <path
              d="M 62,200 C 66,186 134,186 138,200"
              fill="none"
              stroke="#000000"
              strokeOpacity="0.15"
              strokeWidth="2"
            />

            {/* Drawstrings with metal aglets */}
            <path
              d="M 93,166 Q 90,178 92,189"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
            <rect x="90.5" y="188" width="3" height="5.5" rx="1.5" fill={config.clothingAccent} />

            <path
              d="M 107,166 Q 110,178 108,189"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
            <rect x="106.5" y="188" width="3" height="5.5" rx="1.5" fill={config.clothingAccent} />
          </g>
        )}

        {config.clothing === "tshirt" && (
          <g id="clothing-tshirt">
            {/* Torso & Shoulders: Ergonomic anatomical slope */}
            <path
              d="M 12,200 L 12,186 C 18,168 48,156 78,148 L 122,148 C 152,156 182,168 188,186 L 188,200 Z"
              fill={config.clothingColor}
            />

            {/* Sleeve shoulder seams */}
            <path
              d="M 50,172 Q 42,185 38,200"
              stroke="#ffffff"
              strokeOpacity="0.16"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 150,172 Q 158,185 162,200"
              stroke="#ffffff"
              strokeOpacity="0.16"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            {/* Crew neck opening cutout showing neck */}
            <path
              d="M 80,148 C 80,166 120,166 120,148 Z"
              fill={config.skinColor}
            />
            {/* Crew neck collar ribbing band */}
            <path
              d="M 79,147 C 79,168 121,168 121,147"
              fill="none"
              stroke={config.clothingAccent}
              strokeWidth="4.2"
              strokeLinecap="round"
            />

            {/* Chest pocket detail on left breast */}
            <path
              d="M 58,178 L 74,178 L 72,193 L 66,196 L 60,193 Z"
              fill="#000000"
              fillOpacity="0.12"
              stroke={config.clothingAccent}
              strokeWidth="1.2"
            />
          </g>
        )}

        {config.clothing === "school_uniform" && (
          <g id="clothing-school_uniform">
            {/* Uniform Vest / Blazer Torso */}
            <path
              d="M 12,200 L 12,186 C 18,168 48,156 78,148 L 122,148 C 152,156 182,168 188,186 L 188,200 Z"
              fill={config.clothingColor}
            />

            {/* White dress shirt V-insert */}
            <polygon points="100,185 78,148 122,148" fill="#ffffff" />

            {/* Crisp shirt collars */}
            <polygon
              points="78,148 94,161 100,154 88,148"
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="1"
            />
            <polygon
              points="122,148 106,161 100,154 112,148"
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="1"
            />

            {/* Uniform School Tie */}
            <polygon points="96,154 104,154 103,161 97,161" fill={config.clothingAccent} />
            <polygon points="97,161 103,161 106,192 100,200 94,192" fill={config.clothingAccent} />
            {/* Prep diagonal stripes */}
            <line x1="96" y1="170" x2="104" y2="173" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1.5" />
            <line x1="95" y1="180" x2="105" y2="183" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1.5" />

            {/* V-neck collar trim of uniform sweater */}
            <path
              d="M 78,148 L 100,185 L 122,148"
              fill="none"
              stroke={config.clothingAccent}
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* School Crest Badge on chest */}
            <circle cx="54" cy="184" r="5" fill="#f59e0b" fillOpacity="0.9" />
            <polygon points="54,181 57,185 51,185" fill="#ffffff" />
          </g>
        )}

        {config.clothing === "jacket" && (
          <g id="clothing-jacket">
            {/* Dark inner crew-neck t-shirt */}
            <path
              d="M 78,148 L 78,200 L 122,200 L 122,148 Z"
              fill="#1e293b"
            />
            {/* Inner t-shirt collar opening */}
            <path
              d="M 88,148 C 88,160 112,160 112,148 Z"
              fill={config.skinColor}
            />

            {/* Jacket Left Panel */}
            <path
              d="M 12,200 L 12,186 C 18,168 46,156 76,148 L 84,152 L 84,200 L 12,200 Z"
              fill={config.clothingColor}
            />
            {/* Jacket Right Panel */}
            <path
              d="M 188,200 L 188,186 C 182,168 154,156 124,148 L 116,152 L 116,200 L 188,200 Z"
              fill={config.clothingColor}
            />

            {/* Stand-up athletic collar flaps */}
            <polygon points="76,146 88,142 86,160 76,155" fill={config.clothingAccent} />
            <polygon points="124,146 112,142 114,160 124,155" fill={config.clothingAccent} />

            {/* Sporty athletic shoulder stripes */}
            <path
              d="M 40,166 Q 34,183 30,200"
              stroke={config.clothingAccent}
              strokeWidth="3.2"
              fill="none"
            />
            <path
              d="M 46,166 Q 40,183 36,200"
              stroke="#ffffff"
              strokeWidth="2"
              strokeOpacity="0.75"
              fill="none"
            />
            <path
              d="M 160,166 Q 166,183 170,200"
              stroke={config.clothingAccent}
              strokeWidth="3.2"
              fill="none"
            />
            <path
              d="M 154,166 Q 160,183 164,200"
              stroke="#ffffff"
              strokeWidth="2"
              strokeOpacity="0.75"
              fill="none"
            />

            {/* Zipper tracks & slider */}
            <line x1="84" y1="158" x2="84" y2="200" stroke={config.clothingAccent} strokeWidth="1.8" strokeDasharray="3 2" />
            <line x1="116" y1="158" x2="116" y2="200" stroke={config.clothingAccent} strokeWidth="1.8" strokeDasharray="3 2" />
            {/* Metal zipper pull */}
            <rect x="82" y="161" width="4.5" height="8" rx="2" fill="#cbd5e1" stroke="#475569" strokeWidth="0.8" />
          </g>
        )}

        {config.clothing === "suit" && (
          <g id="clothing-suit">
            {/* Suit Blazer Torso Base */}
            <path
              d="M 12,200 L 12,186 C 18,168 48,156 78,148 L 122,148 C 152,156 182,168 188,186 L 188,200 Z"
              fill={config.clothingColor}
            />

            {/* Crisp white dress shirt V-opening */}
            <polygon points="100,188 80,148 120,148" fill="#f8fafc" />

            {/* Dress shirt collar tabs */}
            <polygon
              points="80,148 93,158 98,152 86,148"
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth="1"
            />
            <polygon
              points="120,148 107,158 102,152 114,148"
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth="1"
            />

            {/* Formal Necktie */}
            <polygon points="96,152 104,152 103,160 97,160" fill={config.clothingAccent} />
            <polygon points="97,160 103,160 105,195 100,200 95,195" fill={config.clothingAccent} />
            <polygon points="97,160 100,160 100,200 95,195" fill="#000000" fillOpacity="0.14" />

            {/* Notched Suit Lapels */}
            <polygon
              points="76,148 88,168 84,171 99,193 78,193 68,165"
              fill={config.clothingColor}
              stroke="#000000"
              strokeOpacity="0.22"
              strokeWidth="1.2"
            />
            <polygon
              points="124,148 112,168 116,171 101,193 122,193 132,165"
              fill={config.clothingColor}
              stroke="#000000"
              strokeOpacity="0.22"
              strokeWidth="1.2"
            />

            {/* Breast Pocket & Folded Pocket Square */}
            <line x1="48" y1="184" x2="64" y2="181" stroke="#000000" strokeOpacity="0.25" strokeWidth="2.2" strokeLinecap="round" />
            <polygon points="52,182 56,174 60,182" fill="#ffffff" />
            <polygon points="57,182 61,172 64,182" fill={config.clothingAccent} />
          </g>
        )}

        {/* 3. Ears & Earrings */}
        <circle cx="58" cy="85" r="10" fill={config.skinColor} />
        <circle cx="58" cy="85" r="6" fill="#000000" fillOpacity="0.1" />
        <circle cx="142" cy="85" r="10" fill={config.skinColor} />
        <circle cx="142" cy="85" r="6" fill="#000000" fillOpacity="0.1" />

        {config.accessories === "earring_gold" && (
          <g>
            <circle cx="56" cy="94" r="3.5" fill="none" stroke="#fbbf24" strokeWidth="2" />
            <circle cx="144" cy="94" r="3.5" fill="none" stroke="#fbbf24" strokeWidth="2" />
          </g>
        )}
        {config.accessories === "earring_silver" && (
          <g>
            <circle cx="56" cy="94" r="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
            <circle cx="144" cy="94" r="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
          </g>
        )}

        {/* 4. Face Base */}
        <path d={facePath} fill={config.skinColor} />

        {/* Cheeks Blush */}
        <ellipse cx="72" cy="98" rx="8" ry="4.5" fill="#f43f5e" fillOpacity="0.22" />
        <ellipse cx="128" cy="98" rx="8" ry="4.5" fill="#f43f5e" fillOpacity="0.22" />

        {/* 5. Eyebrows */}
        {config.eyebrows === "natural" && (
          <g stroke={config.hairColor} strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 72,66 Q 82,62 90,66" />
            <path d="M 110,66 Q 118,62 128,66" />
          </g>
        )}
        {config.eyebrows === "thick" && (
          <g stroke={config.hairColor} strokeWidth="4.5" strokeLinecap="round" fill="none">
            <path d="M 70,66 L 90,64" />
            <path d="M 110,64 L 130,66" />
          </g>
        )}
        {config.eyebrows === "arched" && (
          <g stroke={config.hairColor} strokeWidth="2.8" strokeLinecap="round" fill="none">
            <path d="M 72,67 Q 80,59 90,65" />
            <path d="M 110,65 Q 120,59 128,67" />
          </g>
        )}
        {config.eyebrows === "angry" && (
          <g stroke={config.hairColor} strokeWidth="4" strokeLinecap="round" fill="none">
            <path d="M 72,62 L 91,69" />
            <path d="M 109,69 L 128,62" />
          </g>
        )}

        {/* 6. Eyes */}
        {config.eyes === "happy" && (
          <g stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" fill="none">
            <path d="M 73,78 Q 82,70 91,78" />
            <path d="M 109,78 Q 118,70 127,78" />
          </g>
        )}

        {config.eyes === "focused" && (
          <g>
            <ellipse cx="81" cy="77" rx="9" ry="8" fill="#ffffff" />
            <ellipse cx="119" cy="77" rx="9" ry="8" fill="#ffffff" />
            <circle cx="81" cy="77" r="5" fill={config.eyeColor} />
            <circle cx="119" cy="77" r="5" fill={config.eyeColor} />
            <circle cx="81" cy="77" r="2.8" fill="#0f172a" />
            <circle cx="119" cy="77" r="2.8" fill="#0f172a" />
            <circle cx="79.5" cy="75" r="1.6" fill="#ffffff" />
            <circle cx="117.5" cy="75" r="1.6" fill="#ffffff" />
            <path d="M 71,76 Q 81,70 91,76" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 109,76 Q 119,70 129,76" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        )}

        {config.eyes === "sparkle" && (
          <g>
            <ellipse cx="81" cy="77" rx="9.5" ry="9" fill="#ffffff" />
            <ellipse cx="119" cy="77" rx="9.5" ry="9" fill="#ffffff" />
            <circle cx="81" cy="77" r="6" fill={config.eyeColor} />
            <circle cx="119" cy="77" r="6" fill={config.eyeColor} />
            <circle cx="81" cy="77" r="3.5" fill="#0f172a" />
            <circle cx="119" cy="77" r="3.5" fill="#0f172a" />
            <circle cx="79" cy="74" r="2.2" fill="#ffffff" />
            <circle cx="83" cy="79" r="1.2" fill="#ffffff" />
            <circle cx="117" cy="74" r="2.2" fill="#ffffff" />
            <circle cx="121" cy="79" r="1.2" fill="#ffffff" />
            <path d="M 70,75 Q 81,68 92,75" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 108,75 Q 119,68 130,75" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        )}

        {config.eyes === "wink" && (
          <g>
            <ellipse cx="81" cy="77" rx="9" ry="8" fill="#ffffff" />
            <circle cx="81" cy="77" r="5" fill={config.eyeColor} />
            <circle cx="81" cy="77" r="2.8" fill="#0f172a" />
            <circle cx="79.5" cy="75" r="1.6" fill="#ffffff" />
            <path d="M 71,75 Q 81,69 91,75" stroke="#1e293b" strokeWidth="2.8" fill="none" strokeLinecap="round" />
            <path d="M 110,78 Q 120,70 129,78" stroke="#1e293b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <line x1="129" y1="78" x2="132" y2="75" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {config.eyes === "serious" && (
          <g>
            <ellipse cx="81" cy="78" rx="8" ry="5.5" fill="#ffffff" />
            <ellipse cx="119" cy="78" rx="8" ry="5.5" fill="#ffffff" />
            <circle cx="81" cy="78" r="4" fill={config.eyeColor} />
            <circle cx="119" cy="78" r="4" fill={config.eyeColor} />
            <circle cx="81" cy="78" r="2" fill="#0f172a" />
            <circle cx="119" cy="78" r="2" fill="#0f172a" />
            <path d="M 72,75 L 90,75" stroke="#1e293b" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M 110,75 L 128,75" stroke="#1e293b" strokeWidth="2.8" strokeLinecap="round" />
          </g>
        )}

        {config.eyes === "angry" && (
          <g>
            <path d="M 73,73 L 90,78 L 73,81 Z" fill="#ffffff" />
            <path d="M 127,73 L 110,78 L 127,81 Z" fill="#ffffff" />
            <circle cx="83" cy="76" r="3" fill="#dc2626" />
            <circle cx="117" cy="76" r="3" fill="#dc2626" />
            <circle cx="83" cy="76" r="1.5" fill="#000000" />
            <circle cx="117" cy="76" r="1.5" fill="#000000" />
          </g>
        )}

        {/* 7. Nose */}
        <path
          d="M 100,82 Q 102,93 98,96 Q 103,96 104,94"
          stroke="#000000"
          strokeOpacity="0.28"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* 8. Mouth / Expressions (Engineered for cartoon depth and emotion) */}
        {config.expression === "smile" && (
          <g>
            <path d="M 87,108 Q 100,120 113,108" stroke="#b91c1c" strokeWidth="3.2" fill="none" strokeLinecap="round" />
            {/* Smile dimple ticks */}
            <path d="M 85,106 L 88,110" stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 115,106 L 112,110" stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round" />
            {/* Subtle lower lip shadow */}
            <path d="M 94,118 Q 100,121 106,118" stroke="#b91c1c" strokeWidth="1.8" strokeOpacity="0.35" strokeLinecap="round" fill="none" />
          </g>
        )}

        {config.expression === "laugh" && (
          <g>
            {/* Open laughing mouth cavity */}
            <path d="M 85,106 C 85,106 88,127 100,127 C 112,127 115,106 115,106 Z" fill="#7f1d1d" />
            {/* Top row of teeth */}
            <path d="M 87,106 C 92,111 108,111 113,106 Z" fill="#ffffff" />
            {/* Rosy tongue */}
            <path d="M 92,122 C 95,117 105,117 108,122 C 105,127 95,127 92,122 Z" fill="#f43f5e" />
            {/* Outer smile curve & corners */}
            <path d="M 84,106 Q 100,107 116,106" stroke="#b91c1c" strokeWidth="2.8" fill="none" strokeLinecap="round" />
            <path d="M 83,103 L 86,107" stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 117,103 L 114,107" stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {config.expression === "smirk" && (
          <g>
            {/* Cool asymmetric smirk */}
            <path d="M 88,110 Q 102,115 114,104" stroke="#b91c1c" strokeWidth="3.2" fill="none" strokeLinecap="round" />
            {/* Cheek smirk corner tick on the right */}
            <path d="M 113,102 L 116,106" stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round" />
            {/* Subtle lower lip */}
            <path d="M 96,114 Q 105,117 110,111" stroke="#b91c1c" strokeWidth="1.8" strokeOpacity="0.4" strokeLinecap="round" fill="none" />
          </g>
        )}

        {config.expression === "neutral" && (
          <g>
            <path d="M 89,110 L 111,110" stroke="#991b1b" strokeWidth="3" strokeLinecap="round" />
            <circle cx="89" cy="110" r="1.5" fill="#991b1b" />
            <circle cx="111" cy="110" r="1.5" fill="#991b1b" />
            <path d="M 95,116 Q 100,117 105,116" stroke="#991b1b" strokeWidth="1.5" strokeOpacity="0.3" strokeLinecap="round" fill="none" />
          </g>
        )}

        {config.expression === "surprised" && (
          <g>
            {/* Expressive open cartoon O-mouth */}
            <ellipse cx="100" cy="113" rx="7" ry="9.5" fill="#7f1d1d" stroke="#b91c1c" strokeWidth="2.5" />
            {/* Upper tooth glow */}
            <path d="M 95,106 Q 100,108 105,106" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Inner mouth shadow */}
            <ellipse cx="100" cy="116" rx="4.5" ry="3" fill="#f43f5e" />
          </g>
        )}

        {config.expression === "angry" && (
          <g>
            {/* Clenched teeth grit box */}
            <path d="M 86,110 Q 100,106 114,110 L 112,117 Q 100,113 88,117 Z" fill="#ffffff" stroke="#991b1b" strokeWidth="2.5" />
            {/* Gritted teeth vertical notch lines */}
            <line x1="93" y1="109" x2="93" y2="116" stroke="#991b1b" strokeWidth="1.5" />
            <line x1="100" y1="108" x2="100" y2="115" stroke="#991b1b" strokeWidth="1.5" />
            <line x1="107" y1="109" x2="107" y2="116" stroke="#991b1b" strokeWidth="1.5" />
            {/* Downward frown corner marks */}
            <path d="M 85,114 L 88,110" stroke="#991b1b" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 115,114 L 112,110" stroke="#991b1b" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {/* 9. Facial Hair (Sculpted to fit jawline, nose, and mouth) */}
        {config.facialHair === "mustache" && (
          <g fill={config.facialHairColor || config.hairColor}>
            <path d="M 82,105 C 84,99 93,97 100,100 C 107,97 116,99 118,105 C 114,107 106,103 100,104 C 94,103 86,107 82,105 Z" />
            <line x1="100" y1="99" x2="100" y2="104" stroke="#000000" strokeOpacity="0.25" strokeWidth="1" />
          </g>
        )}

        {config.facialHair === "stubble" && (
          <g>
            <path
              d="M 64,88 C 64,128 76,148 100,152 C 124,148 136,128 136,88 C 130,118 120,136 100,137 C 80,136 70,118 64,88 Z"
              fill={config.facialHairColor || config.hairColor}
              fillOpacity="0.16"
            />
            <path
              d="M 84,103 C 88,98 112,98 116,103 C 112,105 88,105 84,103 Z"
              fill={config.facialHairColor || config.hairColor}
              fillOpacity="0.18"
            />
            <g fill={config.facialHairColor || config.hairColor} fillOpacity="0.35">
              <circle cx="78" cy="115" r="1.2" />
              <circle cx="86" cy="122" r="1.2" />
              <circle cx="94" cy="126" r="1.2" />
              <circle cx="100" cy="127" r="1.2" />
              <circle cx="106" cy="126" r="1.2" />
              <circle cx="114" cy="122" r="1.2" />
              <circle cx="122" cy="115" r="1.2" />
              <circle cx="92" cy="103" r="1" />
              <circle cx="100" cy="103" r="1" />
              <circle cx="108" cy="103" r="1" />
            </g>
          </g>
        )}

        {config.facialHair === "goatee" && (
          <g fill={config.facialHairColor || config.hairColor}>
            <path d="M 83,105 C 85,99 93,97 100,100 C 107,97 115,99 117,105 C 112,107 106,103 100,104 C 94,103 88,107 83,105 Z" />
            <path d="M 83,105 C 82,118 84,130 90,138 L 94,136 C 88,128 86,118 87,106 Z" />
            <path d="M 117,105 C 118,118 116,130 110,138 L 106,136 C 112,128 114,118 113,106 Z" />
            <path d="M 89,136 C 92,150 108,150 111,136 C 106,140 94,140 89,136 Z" />
            <polygon points="98,120 102,120 101,126 99,126" />
          </g>
        )}

        {config.facialHair === "full_beard" && (
          <g fill={config.facialHairColor || config.hairColor}>
            <path
              d="M 58,78 C 58,135 72,154 100,154 C 128,154 142,135 142,78 C 137,85 132,100 128,112 C 120,128 110,136 100,136 C 90,136 80,128 72,112 C 68,100 63,85 58,78 Z"
            />
            <path d="M 82,105 C 84,99 93,97 100,100 C 107,97 116,99 118,105 C 113,107 106,103 100,104 C 94,103 87,107 82,105 Z" />
            <polygon points="97,121 103,121 101,128 99,128" />
            <path d="M 90,146 Q 100,151 110,146" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        )}

        {/* ====================================================================
            FRONT HAIR LAYER (Engineered to fit cranium, hairline & sideburns)
            ==================================================================== */}
        <g id="front-hair">
          {/* MALE 1: Fade (فید مدرن) */}
          {hairStyle === "fade" && (
            <g fill={config.hairColor}>
              {/* Top volume & clean crop */}
              <path d="M 52,62 C 48,22 152,22 148,62 C 144,52 135,46 118,48 C 98,46 80,50 68,54 C 58,56 52,62 52,62 Z" />
              {/* Left Sideburn */}
              <polygon points="52,62 56,76 60,76 58,62" />
              {/* Right Sideburn */}
              <polygon points="148,62 144,76 140,76 142,62" />
              {/* Highlight */}
              <path d="M 72,32 Q 100,24 130,32" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          )}

          {/* MALE 2: Spiky (اسپایک / تیغ‌تیغی) */}
          {hairStyle === "spiky" && (
            <g fill={config.hairColor}>
              {/* Spikes contour with high crest points */}
              <path d="M 52,62 L 56,38 L 66,44 L 74,22 L 86,34 L 98,14 L 110,32 L 124,18 L 132,38 L 144,28 L 148,62 C 142,54 132,50 120,53 C 108,49 92,54 82,50 C 70,54 58,56 52,62 Z" />
              {/* Sideburns */}
              <polygon points="52,62 55,75 59,75 57,62" />
              <polygon points="148,62 145,75 141,75 143,62" />
              {/* Spike edge glints */}
              <line x1="97" y1="16" x2="103" y2="28" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="2" strokeLinecap="round" />
              <line x1="123" y1="20" x2="127" y2="32" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}

          {/* MALE 3: Pompadour (پمپادور شانه به بالا) */}
          {hairStyle === "pompadour" && (
            <g fill={config.hairColor}>
              {/* High swept wave */}
              <path d="M 52,62 C 46,18 78,10 102,12 C 132,14 154,26 148,62 C 144,52 135,46 116,46 C 96,44 76,48 64,54 C 56,58 52,62 52,62 Z" />
              <polygon points="52,62 55,76 60,76 57,62" />
              <polygon points="148,62 145,76 140,76 143,62" />
              {/* Sweeping crest highlight */}
              <path d="M 68,26 Q 98,16 132,24" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </g>
          )}

          {/* MALE 4: Curly Short (فر کوتاه پسرانه) */}
          {hairStyle === "curly_short" && (
            <g fill={config.hairColor}>
              {/* Curly crown puff bubbles */}
              <circle cx="62" cy="40" r="14" />
              <circle cx="80" cy="28" r="15" />
              <circle cx="100" cy="24" r="16" />
              <circle cx="120" cy="28" r="15" />
              <circle cx="138" cy="40" r="14" />
              <circle cx="54" cy="56" r="10" />
              <circle cx="146" cy="56" r="10" />
              {/* Front forehead curls */}
              <path d="M 54,62 Q 68,50 78,54 Q 90,48 100,53 Q 112,48 122,54 Q 134,50 146,62 C 135,52 118,50 100,50 C 82,50 65,52 54,62 Z" />
              {/* Sideburns */}
              <polygon points="52,60 55,75 59,75 57,60" />
              <polygon points="148,60 145,75 141,75 143,60" />
            </g>
          )}

          {/* MALE 5: Classic Part (کلاسیک بغل‌باز) */}
          {hairStyle === "classic_part" && (
            <g fill={config.hairColor}>
              <path d="M 52,62 C 48,24 150,24 148,62 C 142,50 120,44 100,46 C 84,46 76,52 74,56 C 70,52 60,54 52,62 Z" />
              {/* Part line groove */}
              <line x1="74" y1="36" x2="72" y2="55" stroke="#000000" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
              {/* Sideburns */}
              <polygon points="52,62 55,77 60,77 57,62" />
              <polygon points="148,62 145,77 140,77 143,62" />
              {/* Highlight */}
              <path d="M 85,32 Q 115,26 138,36" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          )}

          {/* MALE 6: Buzz Cut (بوکسوری / خیلی کوتاه) */}
          {hairStyle === "buzz_cut" && (
            <g fill={config.hairColor}>
              <path d="M 52,62 C 50,30 150,30 148,62 C 142,54 125,52 100,52 C 75,52 58,54 52,62 Z" />
              <polygon points="52,62 55,73 59,73 57,62" />
              <polygon points="148,62 145,73 141,73 143,62" />
            </g>
          )}

          {/* MALE 7: Man Bun Front (سامورایی) */}
          {hairStyle === "man_bun" && (
            <g fill={config.hairColor}>
              <path d="M 52,62 C 48,26 152,26 148,62 C 140,50 120,46 100,46 C 80,46 60,50 52,62 Z" />
              {/* Pull lines */}
              <path d="M 68,50 Q 85,32 96,22" stroke="#000000" strokeOpacity="0.2" strokeWidth="1.5" fill="none" />
              <path d="M 132,50 Q 115,32 104,22" stroke="#000000" strokeOpacity="0.2" strokeWidth="1.5" fill="none" />
              <polygon points="52,62 55,75 59,75 57,62" />
              <polygon points="148,62 145,75 141,75 143,62" />
            </g>
          )}

          {/* MALE 8: Bald (کچل با درخشش) */}
          {hairStyle === "bald" && (
            <path d="M 75,34 Q 90,26 105,28" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="3" fill="none" strokeLinecap="round" />
          )}

          {/* FEMALE 1: Wavy Long Front (موج‌دار بلند) */}
          {hairStyle === "wavy_long" && (
            <g fill={config.hairColor}>
              <path d="M 50,60 C 44,22 156,22 150,60 C 144,52 128,48 108,52 C 98,54 88,48 72,50 C 60,52 52,56 50,60 Z" />
              {/* Left front cascading wave */}
              <path d="M 50,60 C 56,80 64,105 60,135 C 54,120 48,95 46,75 Z" />
              {/* Right front cascading wave */}
              <path d="M 150,60 C 144,80 136,105 140,135 C 146,120 152,95 154,75 Z" />
              {/* Highlight */}
              <path d="M 70,30 Q 100,22 130,30" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          )}

          {/* FEMALE 2: Straight Long Front (صاف بلند) */}
          {hairStyle === "straight_long" && (
            <g fill={config.hairColor}>
              <path d="M 50,60 C 44,22 156,22 150,60 C 142,48 125,46 100,48 C 75,46 58,48 50,60 Z" />
              {/* Straight side curtains framing cheeks */}
              <path d="M 50,60 L 56,140 L 62,140 L 56,70 Z" />
              <path d="M 150,60 L 144,140 L 138,140 L 144,70 Z" />
              {/* Halo shine */}
              <path d="M 68,32 Q 100,24 132,32" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          )}

          {/* FEMALE 3: Ponytail Front (دم‌اسبی) */}
          {hairStyle === "ponytail" && (
            <g fill={config.hairColor}>
              <path d="M 50,60 C 44,22 156,22 150,60 C 140,48 120,46 100,48 C 80,46 60,48 50,60 Z" />
              <polygon points="50,60 54,73 57,73 55,60" />
              <polygon points="150,60 146,73 143,73 145,60" />
              <path d="M 70,34 Q 100,26 128,34" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>
          )}

          {/* FEMALE 4: Bob / Bangs (چتری / باب فرانسوی) */}
          {hairStyle === "bob" && (
            <g fill={config.hairColor}>
              {/* Thick full bangs covering forehead to just above brows (y=56) */}
              <path d="M 48,58 C 42,20 158,20 152,58 C 150,75 146,105 138,116 C 134,100 134,60 134,56 C 115,55 85,55 66,56 C 66,60 66,100 62,116 C 54,105 50,75 48,58 Z" />
              {/* Bangs fringe detail lines */}
              <line x1="82" y1="44" x2="82" y2="56" stroke="#000000" strokeOpacity="0.2" strokeWidth="1.5" />
              <line x1="118" y1="44" x2="118" y2="56" stroke="#000000" strokeOpacity="0.2" strokeWidth="1.5" />
              {/* Highlight */}
              <path d="M 66,32 Q 100,22 134,32" stroke="#ffffff" strokeOpacity="0.24" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          )}

          {/* FEMALE 5: Top Bun Front (گوجه‌ای) */}
          {hairStyle === "top_bun" && (
            <g fill={config.hairColor}>
              <path d="M 50,60 C 44,24 156,24 150,60 C 140,50 120,48 100,50 C 80,48 60,50 50,60 Z" />
              {/* Cute wisps dangling in front of ears */}
              <path d="M 53,62 Q 56,76 52,88 Q 50,76 51,62" stroke={config.hairColor} strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 147,62 Q 144,76 148,88 Q 150,76 149,62" stroke={config.hairColor} strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M 72,36 Q 100,28 128,36" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>
          )}

          {/* Braids (بافت دوتایی روی شانه با دانه‌های زیگزاگی سه‌بعدی و کش مو) */}
          {hairStyle === "braids" && (
            <g id="hair-braids">
              {/* 1. Crown / Forehead Hair with Clean Middle Part */}
              <g fill={config.hairColor}>
                <path d="M 50,60 C 44,22 156,22 150,60 C 140,50 120,46 100,50 C 80,46 60,50 50,60 Z" />
                {/* Temple sweeps framing ears into the braids */}
                <path d="M 50,60 C 48,72 45,82 48,90 L 54,88 C 52,78 53,70 56,60 Z" />
                <path d="M 150,60 C 152,72 155,82 152,90 L 146,88 C 148,78 147,70 144,60 Z" />
              </g>

              {/* Parting line & crown highlights */}
              <line x1="100" y1="26" x2="100" y2="50" stroke="#000000" strokeOpacity="0.28" strokeWidth="2" strokeLinecap="round" />
              <path d="M 66,32 Q 85,25 96,30" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 134,32 Q 115,25 104,30" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="2.5" fill="none" strokeLinecap="round" />

              {/* 2. Left Front Braid (Draping gracefully forward over left shoulder & chest) */}
              <g id="left-braid">
                {/* Scalloped Plait Body */}
                <path
                  d="M 47,88 C 40,94 40,104 47,108 C 39,114 39,124 46,128 C 38,134 38,144 45,148 C 38,154 39,164 47,168 C 44,172 46,178 50,178 C 54,178 56,172 53,168 C 61,164 61,154 53,148 C 62,144 62,134 54,128 C 63,124 63,114 55,108 C 64,104 64,94 54,88 Z"
                  fill={config.hairColor}
                />
                {/* Plait internal diagonal herringbone creases */}
                <g stroke="#000000" strokeOpacity="0.28" strokeWidth="1.8" strokeLinecap="round" fill="none">
                  <path d="M 47,108 Q 50,113 54,116" />
                  <path d="M 46,128 Q 49,133 53,136" />
                  <path d="M 45,148 Q 49,153 52,156" />
                  <path d="M 54,98 Q 50,103 46,106" />
                  <path d="M 55,118 Q 51,123 46,126" />
                  <path d="M 54,138 Q 50,143 45,146" />
                  <path d="M 53,158 Q 49,163 46,166" />
                </g>
                {/* Lobe 3D gloss glints */}
                <g stroke="#ffffff" strokeOpacity="0.22" strokeWidth="2" strokeLinecap="round" fill="none">
                  <path d="M 42,101 Q 44,105 43,107" />
                  <path d="M 56,111 Q 57,115 55,117" />
                  <path d="M 41,121 Q 43,125 42,127" />
                  <path d="M 55,131 Q 56,135 54,137" />
                  <path d="M 40,141 Q 42,145 41,147" />
                </g>
                {/* Colored Hair Tie Band */}
                <rect x="44" y="176" width="12" height="6" rx="2.5" fill={config.clothingAccent || "#f43f5e"} />
                <rect x="46" y="177" width="8" height="2" rx="1" fill="#ffffff" fillOpacity="0.45" />
                {/* Flared Ponytail Tufts below band */}
                <path
                  d="M 46,182 C 43,188 41,194 44,198 C 47,196 49,190 50,186 C 51,191 54,197 57,198 C 59,194 56,188 54,182 Z"
                  fill={config.hairColor}
                />
              </g>

              {/* 3. Right Front Braid (Symmetrical over right shoulder & chest) */}
              <g id="right-braid">
                {/* Scalloped Plait Body */}
                <path
                  d="M 153,88 C 160,94 160,104 153,108 C 161,114 161,124 154,128 C 162,134 162,144 155,148 C 162,154 161,164 153,168 C 156,172 154,178 150,178 C 146,178 144,172 147,168 C 139,164 139,154 147,148 C 138,144 138,134 146,128 C 137,124 137,114 145,108 C 136,104 136,94 146,88 Z"
                  fill={config.hairColor}
                />
                {/* Plait internal diagonal herringbone creases */}
                <g stroke="#000000" strokeOpacity="0.28" strokeWidth="1.8" strokeLinecap="round" fill="none">
                  <path d="M 153,108 Q 150,113 146,116" />
                  <path d="M 154,128 Q 151,133 147,136" />
                  <path d="M 155,148 Q 151,153 148,156" />
                  <path d="M 146,98 Q 150,103 154,106" />
                  <path d="M 145,118 Q 149,123 154,126" />
                  <path d="M 146,138 Q 150,143 155,146" />
                  <path d="M 147,158 Q 151,163 154,166" />
                </g>
                {/* Lobe 3D gloss glints */}
                <g stroke="#ffffff" strokeOpacity="0.22" strokeWidth="2" strokeLinecap="round" fill="none">
                  <path d="M 158,101 Q 156,105 157,107" />
                  <path d="M 144,111 Q 143,115 145,117" />
                  <path d="M 159,121 Q 157,125 158,127" />
                  <path d="M 145,131 Q 144,135 146,137" />
                  <path d="M 160,141 Q 158,145 159,147" />
                </g>
                {/* Colored Hair Tie Band */}
                <rect x="144" y="176" width="12" height="6" rx="2.5" fill={config.clothingAccent || "#f43f5e"} />
                <rect x="146" y="177" width="8" height="2" rx="1" fill="#ffffff" fillOpacity="0.45" />
                {/* Flared Ponytail Tufts below band */}
                <path
                  d="M 154,182 C 157,188 159,194 156,198 C 153,196 151,190 150,186 C 149,191 146,197 143,198 C 141,194 144,188 146,182 Z"
                  fill={config.hairColor}
                />
              </g>
            </g>
          )}

          {/* FEMALE 7: Curly Volume Front (فر پرپشت) */}
          {hairStyle === "curly_volume" && (
            <g fill={config.hairColor}>
              {/* Front bouncy curl puffs */}
              <circle cx="68" cy="48" r="10" />
              <circle cx="86" cy="44" r="11" />
              <circle cx="104" cy="42" r="11" />
              <circle cx="122" cy="46" r="11" />
              <circle cx="136" cy="52" r="9" />
            </g>
          )}

          {/* FEMALE 8: Pixie (کوتاه پیکسی) */}
          {hairStyle === "pixie" && (
            <g fill={config.hairColor}>
              {/* Side-swept textured bangs */}
              <path d="M 50,60 C 46,24 154,24 150,60 C 142,50 125,54 105,48 C 85,52 68,54 50,60 Z" />
              {/* Tapered side strands */}
              <polygon points="50,60 54,74 58,74 56,60" />
              <polygon points="150,60 146,74 142,74 144,60" />
              <path d="M 70,30 Q 100,22 128,30" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          )}
        </g>

        {/* 11. Glasses */}
        {config.glasses === "round" && (
          <g stroke="#334155" strokeWidth="2.8" fill="none">
            <circle cx="79" cy="77" r="12" fill="#ffffff" fillOpacity="0.2" />
            <circle cx="121" cy="77" r="12" fill="#ffffff" fillOpacity="0.2" />
            <line x1="91" y1="77" x2="109" y2="77" strokeWidth="2.5" />
            <line x1="57" y1="76" x2="67" y2="76" strokeWidth="2" />
            <line x1="133" y1="76" x2="143" y2="76" strokeWidth="2" />
            <line x1="74" y1="71" x2="82" y2="71" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <line x1="116" y1="71" x2="124" y2="71" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {config.glasses === "classic" && (
          <g stroke="#0f172a" strokeWidth="3" fill="none">
            <rect x="68" y="68" width="24" height="17" rx="3" fill="#ffffff" fillOpacity="0.2" />
            <rect x="108" y="68" width="24" height="17" rx="3" fill="#ffffff" fillOpacity="0.2" />
            <line x1="92" y1="76" x2="108" y2="76" strokeWidth="2.5" />
            <line x1="56" y1="74" x2="68" y2="74" strokeWidth="2" />
            <line x1="132" y1="74" x2="144" y2="74" strokeWidth="2" />
          </g>
        )}

        {config.glasses === "cat_eye" && (
          <g stroke="#be185d" strokeWidth="3" fill="none">
            <path d="M 66,66 L 92,72 L 90,83 L 70,82 Z" fill="#ffffff" fillOpacity="0.2" />
            <path d="M 134,66 L 108,72 L 110,83 L 130,82 Z" fill="#ffffff" fillOpacity="0.2" />
            <line x1="92" y1="72" x2="108" y2="72" strokeWidth="2" />
          </g>
        )}

        {config.glasses === "sunglasses" && (
          <g stroke="#000000" strokeWidth="2.5" fill="#0f172a">
            <rect x="67" y="67" width="26" height="19" rx="4" />
            <rect x="107" y="67" width="26" height="19" rx="4" />
            <line x1="93" y1="76" x2="107" y2="76" stroke="#000000" strokeWidth="3" />
            <line x1="72" y1="83" x2="84" y2="70" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="112" y1="83" x2="124" y2="70" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {/* 12. Headwear */}
        {config.headwear === "cap_forward" && (
          <g>
            <path d="M 52,58 C 50,30 80,24 100,24 C 120,24 150,30 148,58 Z" fill={config.clothingColor} />
            <ellipse cx="100" cy="56" rx="50" ry="7" fill={config.clothingAccent} />
            <circle cx="100" cy="23" r="3.5" fill={config.clothingAccent} />
          </g>
        )}

        {config.headwear === "cap_backward" && (
          <g>
            <path d="M 54,60 C 50,32 78,24 100,24 C 122,24 150,32 146,60 Z" fill={config.clothingColor} />
            <path d="M 85,58 C 88,52 112,52 115,58 Z" fill="#ffffff" fillOpacity="0.4" />
            <circle cx="100" cy="24" r="3.5" fill={config.clothingAccent} />
          </g>
        )}

        {config.headwear === "beanie" && (
          <g>
            <path d="M 52,60 C 48,26 75,18 100,18 C 125,18 152,26 148,60 Z" fill={config.clothingAccent} />
            <rect x="50" y="50" width="100" height="12" rx="4" fill={config.clothingColor} />
            <circle cx="100" cy="15" r="7" fill={config.clothingColor} />
          </g>
        )}

        {config.headwear === "grad_cap" && (
          <g>
            <path d="M 68,48 C 68,38 132,38 132,48 L 126,58 L 74,58 Z" fill="#0f172a" />
            <polygon points="100,22 152,38 100,52 48,38" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
            <circle cx="100" cy="37" r="2.5" fill="#f59e0b" />
            <path d="M 100,37 Q 128,40 134,60" stroke="#f59e0b" strokeWidth="2" fill="none" />
            <rect x="131" y="60" width="6" height="10" rx="1" fill="#f59e0b" />
          </g>
        )}

        {config.headwear === "headband" && (
          <path d="M 54,54 C 60,42 140,42 146,54 L 145,62 C 139,50 61,50 55,62 Z" fill={config.clothingAccent} />
        )}

        {/* 13. Headphones */}
        {config.accessories === "headphones" && (
          <g>
            <path d="M 46,90 C 42,20 158,20 154,90" stroke="#0f172a" strokeWidth="6" fill="none" strokeLinecap="round" />
            <rect x="42" y="75" width="12" height="24" rx="6" fill={config.clothingAccent} stroke="#0f172a" strokeWidth="2" />
            <rect x="146" y="75" width="12" height="24" rx="6" fill={config.clothingAccent} stroke="#0f172a" strokeWidth="2" />
            <rect x="51" y="78" width="4" height="18" rx="2" fill="#0f172a" />
            <rect x="145" y="78" width="4" height="18" rx="2" fill="#0f172a" />
          </g>
        )}
      </g>

      {/* Outer border glow stroke */}
      {bordered && (
        <circle
          cx="100"
          cy="100"
          r="98.5"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.3"
          strokeWidth="3"
        />
      )}
    </svg>
  );
}
