"use client";

import React, { useState, useEffect, useMemo } from "react";
import styles from "./avatar-studio.module.css";
import CartoonAvatar from "./CartoonAvatar";
import {
  type CartoonAvatarConfig,
  SKIN_TONES,
  HAIR_COLORS,
  EYE_COLORS,
  CLOTHING_COLORS,
  BACKGROUNDS,
  AVATAR_PRESETS,
  ALL_HAIR_STYLES,
  normalizeHairStyle,
  getDefaultAvatarConfig,
  getRandomAvatarConfig,
  getStoredCartoonAvatar,
  setStoredCartoonAvatar,
} from "../../lib/cartoon-avatar";

interface AvatarStudioWizardProps {
  onSaveSuccess?: (config: CartoonAvatarConfig) => void;
  studentName?: string;
}

export default function AvatarStudioWizard({
  onSaveSuccess,
  studentName = "دانش‌آموز",
}: AvatarStudioWizardProps) {
  const [config, setConfig] = useState<CartoonAvatarConfig>(getDefaultAvatarConfig());
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [hairCategoryFilter, setHairCategoryFilter] = useState<"all" | "short" | "long">("all");

  const displayedHairStyles = useMemo(() => {
    if (hairCategoryFilter === "short") {
      return ALL_HAIR_STYLES.filter((h) => h.category === "short");
    }
    if (hairCategoryFilter === "long") {
      return ALL_HAIR_STYLES.filter((h) => h.category === "long");
    }
    return ALL_HAIR_STYLES;
  }, [hairCategoryFilter]);

  useEffect(() => {
    const saved = getStoredCartoonAvatar();
    setConfig(saved);
  }, []);

  const steps = useMemo(() => {
    const list = [
      { id: 1, title: "صورت و پوست", icon: "👤" },
      { id: 2, title: "مو", icon: "💇" },
      { id: 3, title: "چشم و ابرو", icon: "👀" },
      { id: 4, title: "حالت چهره", icon: "😃" },
    ];
    if (config.gender === "male") {
      list.push({ id: 5, title: "ریش و سبیل", icon: "🧔" });
    }
    list.push(
      { id: 6, title: "عینک و کلاه", icon: "🕶️" },
      { id: 7, title: "لباس و زمینه", icon: "👔" }
    );
    return list;
  }, [config.gender]);

  useEffect(() => {
    if (config.gender === "female" && currentStep === 5) {
      setCurrentStep(4);
    }
  }, [config.gender, currentStep]);

  const updateConfig = (patch: Partial<CartoonAvatarConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  };

  const showNotice = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleRandomize = () => {
    const randomConfig = getRandomAvatarConfig();
    setConfig(randomConfig);
    showNotice("آواتار شانسی ساخته شد 🎲");
  };

  const handleReset = () => {
    setConfig(getDefaultAvatarConfig());
    showNotice("تنظیمات ریست شد 🔄");
  };

  const handleApplyPreset = (presetConfig: CartoonAvatarConfig, name: string) => {
    setConfig({ ...presetConfig });
    showNotice(`قالب «${name}» انتخاب شد ✨`);
  };

  const handleSave = () => {
    setStoredCartoonAvatar(config);
    showNotice("آواتار ذخیره شد ✓");
    if (onSaveSuccess) {
      onSaveSuccess(config);
    }
  };

  const handleDownloadPng = () => {
    try {
      const container = document.getElementById("avatar-preview-container");
      const svg = container?.querySelector("svg");
      if (!svg) {
        showNotice("خطا در ایجاد تصویر");
        return;
      }
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const DOMURL = window.URL || window.webkitURL || window;
      const url = DOMURL.createObjectURL(svgBlob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, 512, 512);
          DOMURL.revokeObjectURL(url);
          const pngUrl = canvas.toDataURL("image/png");
          const dl = document.createElement("a");
          dl.href = pngUrl;
          dl.download = `avatar-${studentName || "profile"}.png`;
          document.body.appendChild(dl);
          dl.click();
          document.body.removeChild(dl);
          showNotice("عکس دانلود شد ⬇️");
        }
      };
      img.src = url;
    } catch {
      showNotice("خطا در دانلود تصویر");
    }
  };

  return (
    <div className={styles.studioContainer} dir="rtl">
      {/* Top Bar with Tools and Presets */}
      <div className={styles.topBar}>
        <div className={styles.topBarHeader}>
          <div className={styles.topBarTitle}>
            <span className={styles.topBarTitleIcon}>🎨</span>
            <span>طراحی آواتار</span>
          </div>

          <div className={styles.quickActions}>
            <button
              type="button"
              className={`${styles.quickBtn} ${styles.quickBtnRandom}`}
              onClick={handleRandomize}
            >
              <span>🎲</span>
              <span>شانسی</span>
            </button>

            <button
              type="button"
              className={`${styles.quickBtn} ${styles.quickBtnDownload}`}
              onClick={handleDownloadPng}
            >
              <span>⬇️</span>
              <span>دانلود عکس</span>
            </button>

            <button
              type="button"
              className={`${styles.quickBtn} ${styles.quickBtnReset}`}
              onClick={handleReset}
            >
              <span>🔄</span>
              <span>ریست</span>
            </button>
          </div>
        </div>

        {/* Presets Row */}
        <div className={styles.presetsRow}>
          <span className={styles.presetsLabel}>قالب‌ها:</span>
          {AVATAR_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={styles.presetChip}
              onClick={() => handleApplyPreset(p.config, p.name_fa)}
            >
              <span>{p.icon}</span>
              <span>{p.name_fa}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Layout */}
      <div className={styles.studioSplit}>
        {/* Left: Preview Sticky Card */}
        <aside className={styles.previewStickyCard} aria-label="پیش‌نمایش آواتار">
          <div id="avatar-preview-container" className={styles.previewAvatarFrame}>
            <CartoonAvatar config={config} size={170} rounded={true} bordered={true} />
          </div>

          <div>
            <div className={styles.previewBadgeName}>{studentName}</div>
          </div>

          <button
            type="button"
            className={styles.saveButtonLarge}
            onClick={handleSave}
          >
            <span>💾</span>
            <span>ذخیره آواتار</span>
          </button>

          {saveToast && (
            <div
              style={{
                fontSize: "0.85rem",
                background: "#ecfdf5",
                color: "#065f46",
                padding: "0.5rem 0.8rem",
                borderRadius: "10px",
                border: "1px solid #a7f3d0",
                marginTop: "0.25rem",
                fontWeight: 700,
              }}
            >
              {saveToast}
            </div>
          )}
        </aside>

        {/* Right: Stepper & Options */}
        <div className={styles.stepperWrapper}>
          {/* Steps Navigation Bar */}
          <nav className={styles.stepsNavigation} aria-label="مراحل طراحی">
            {steps.map((s) => {
              const isActive = currentStep === s.id;
              const isDone = currentStep > s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`${styles.stepTab} ${isActive ? styles.stepTabActive : ""} ${
                    isDone ? styles.stepTabDone : ""
                  }`}
                  onClick={() => setCurrentStep(s.id)}
                >
                  <div className={styles.stepIconCircle}>
                    {isDone ? "✓" : s.icon}
                  </div>
                  <span className={styles.stepTitle}>{s.title}</span>
                </button>
              );
            })}
          </nav>

          {/* Step 1: Face & Skin */}
          {currentStep === 1 && (
            <div className={styles.stepContentBox}>
              <div className={styles.stepHeading}>
                <div className={styles.stepHeadingTitle}>
                  <span>👤</span>
                  <span>صورت و پوست</span>
                </div>
              </div>

              <div>
                <label className={styles.paletteTitle}>جنسیت:</label>
                <div className={styles.optionGrid} style={{ marginTop: "0.5rem" }}>
                  <div
                    className={`${styles.optionCard} ${config.gender === "male" ? styles.optionCardActive : ""}`}
                    onClick={() => updateConfig({ gender: "male" })}
                  >
                    {config.gender === "male" && <span className={styles.optionCheckmark}>✓</span>}
                    <span className={styles.optionIcon}>👦</span>
                    <span className={styles.optionLabel}>پسر</span>
                  </div>
                  <div
                    className={`${styles.optionCard} ${config.gender === "female" ? styles.optionCardActive : ""}`}
                    onClick={() => updateConfig({ gender: "female", facialHair: "none" })}
                  >
                    {config.gender === "female" && <span className={styles.optionCheckmark}>✓</span>}
                    <span className={styles.optionIcon}>👧</span>
                    <span className={styles.optionLabel}>دختر</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "0.5rem" }}>
                <label className={styles.paletteTitle}>فرم صورت:</label>
                <div className={styles.optionGrid} style={{ marginTop: "0.5rem" }}>
                  {[
                    { id: "oval", label: "بیضی", icon: "🥚" },
                    { id: "round", label: "گرد", icon: "🌝" },
                    { id: "square", label: "مربعی", icon: "⏹️" },
                    { id: "heart", label: "کشیده", icon: "💖" },
                  ].map((f) => (
                    <div
                      key={f.id}
                      className={`${styles.optionCard} ${config.faceShape === f.id ? styles.optionCardActive : ""}`}
                      onClick={() => updateConfig({ faceShape: f.id as CartoonAvatarConfig["faceShape"] })}
                    >
                      {config.faceShape === f.id && <span className={styles.optionCheckmark}>✓</span>}
                      <span className={styles.optionIcon}>{f.icon}</span>
                      <span className={styles.optionLabel}>{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.paletteSection}>
                <span className={styles.paletteTitle}>رنگ پوست:</span>
                <div className={styles.swatchesRow}>
                  {SKIN_TONES.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      className={`${styles.swatchBtn} ${config.skinColor === st.hex ? styles.swatchBtnActive : ""}`}
                      style={{ background: st.hex }}
                      onClick={() => updateConfig({ skinColor: st.hex })}
                      title={st.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Hair Style & Hair Color */}
          {currentStep === 2 && (
            <div className={styles.stepContentBox}>
              <div className={styles.stepHeading}>
                <div className={styles.stepHeadingTitle}>
                  <span>💇</span>
                  <span>مو</span>
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <label className={styles.paletteTitle} style={{ margin: 0 }}>مدل مو:</label>
                  <div className={styles.filterPillsRow}>
                    <button
                      type="button"
                      className={`${styles.filterPillBtn} ${hairCategoryFilter === "all" ? styles.filterPillBtnActive : ""}`}
                      onClick={() => setHairCategoryFilter("all")}
                    >
                      همه (۱۶)
                    </button>
                    <button
                      type="button"
                      className={`${styles.filterPillBtn} ${hairCategoryFilter === "short" ? styles.filterPillBtnActive : ""}`}
                      onClick={() => setHairCategoryFilter("short")}
                    >
                      کوتاه (۸)
                    </button>
                    <button
                      type="button"
                      className={`${styles.filterPillBtn} ${hairCategoryFilter === "long" ? styles.filterPillBtnActive : ""}`}
                      onClick={() => setHairCategoryFilter("long")}
                    >
                      بلند (۸)
                    </button>
                  </div>
                </div>
                <div className={styles.optionGrid}>
                  {displayedHairStyles.map((h) => {
                    const isSelected = normalizeHairStyle(config.hairStyle, config.gender) === h.id;
                    return (
                      <div
                        key={h.id}
                        className={`${styles.optionCard} ${isSelected ? styles.optionCardActive : ""}`}
                        onClick={() => updateConfig({ hairStyle: h.id })}
                      >
                        {isSelected && <span className={styles.optionCheckmark}>✓</span>}
                        <span className={styles.optionIcon}>{h.icon}</span>
                        <span className={styles.optionLabel}>{h.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={styles.paletteSection}>
                <span className={styles.paletteTitle}>رنگ مو:</span>
                <div className={styles.swatchesRow}>
                  {HAIR_COLORS.map((hc) => (
                    <button
                      key={hc.id}
                      type="button"
                      className={`${styles.swatchBtn} ${config.hairColor === hc.hex ? styles.swatchBtnActive : ""}`}
                      style={{ background: hc.hex }}
                      onClick={() => updateConfig({ hairColor: hc.hex })}
                      title={hc.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Eyes & Eyebrows */}
          {currentStep === 3 && (
            <div className={styles.stepContentBox}>
              <div className={styles.stepHeading}>
                <div className={styles.stepHeadingTitle}>
                  <span>👀</span>
                  <span>چشم و ابرو</span>
                </div>
              </div>

              <div>
                <label className={styles.paletteTitle}>فرم چشم:</label>
                <div className={styles.optionGrid} style={{ marginTop: "0.5rem" }}>
                  {[
                    { id: "happy", label: "خندان", icon: "😄" },
                    { id: "focused", label: "عادی", icon: "🎯" },
                    { id: "wink", label: "چشمک", icon: "😉" },
                    { id: "sparkle", label: "براق", icon: "✨" },
                    { id: "serious", label: "جدی", icon: "🧐" },
                    { id: "angry", label: "اخم", icon: "😠" },
                  ].map((e) => (
                    <div
                      key={e.id}
                      className={`${styles.optionCard} ${config.eyes === e.id ? styles.optionCardActive : ""}`}
                      onClick={() => updateConfig({ eyes: e.id as CartoonAvatarConfig["eyes"] })}
                    >
                      {config.eyes === e.id && <span className={styles.optionCheckmark}>✓</span>}
                      <span className={styles.optionIcon}>{e.icon}</span>
                      <span className={styles.optionLabel}>{e.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: "0.5rem" }}>
                <label className={styles.paletteTitle}>فرم ابرو:</label>
                <div className={styles.optionGrid} style={{ marginTop: "0.5rem" }}>
                  {[
                    { id: "natural", label: "معمولی", icon: "〰️" },
                    { id: "thick", label: "پهن", icon: "➖" },
                    { id: "arched", label: "کمانی", icon: "🌙" },
                    { id: "angry", label: "زاویه‌دار", icon: "⚡" },
                  ].map((eb) => (
                    <div
                      key={eb.id}
                      className={`${styles.optionCard} ${config.eyebrows === eb.id ? styles.optionCardActive : ""}`}
                      onClick={() => updateConfig({ eyebrows: eb.id as CartoonAvatarConfig["eyebrows"] })}
                    >
                      {config.eyebrows === eb.id && <span className={styles.optionCheckmark}>✓</span>}
                      <span className={styles.optionIcon}>{eb.icon}</span>
                      <span className={styles.optionLabel}>{eb.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.paletteSection}>
                <span className={styles.paletteTitle}>رنگ چشم:</span>
                <div className={styles.swatchesRow}>
                  {EYE_COLORS.map((ec) => (
                    <button
                      key={ec.id}
                      type="button"
                      className={`${styles.swatchBtn} ${config.eyeColor === ec.hex ? styles.swatchBtnActive : ""}`}
                      style={{ background: ec.hex }}
                      onClick={() => updateConfig({ eyeColor: ec.hex })}
                      title={ec.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Facial Expressions */}
          {currentStep === 4 && (
            <div className={styles.stepContentBox}>
              <div className={styles.stepHeading}>
                <div className={styles.stepHeadingTitle}>
                  <span>😃</span>
                  <span>حالت چهره</span>
                </div>
              </div>

              <div>
                <label className={styles.paletteTitle}>انتخاب حالت چهره:</label>
                <div className={styles.optionGrid} style={{ marginTop: "0.5rem" }}>
                  {[
                    { id: "smile", label: "لبخند", icon: "🙂", eyes: "sparkle", eyebrows: "natural" },
                    { id: "laugh", label: "خنده", icon: "😃", eyes: "happy", eyebrows: "arched" },
                    { id: "smirk", label: "نیشخند", icon: "😏", eyes: "wink", eyebrows: "natural" },
                    { id: "neutral", label: "خنثی", icon: "😐", eyes: "serious", eyebrows: "thick" },
                    { id: "surprised", label: "تعجب", icon: "😲", eyes: "focused", eyebrows: "arched" },
                    { id: "angry", label: "اخم", icon: "😡", eyes: "angry", eyebrows: "angry" },
                  ].map((exp) => (
                    <div
                      key={exp.id}
                      className={`${styles.optionCard} ${config.expression === exp.id ? styles.optionCardActive : ""}`}
                      onClick={() =>
                        updateConfig({
                          expression: exp.id as CartoonAvatarConfig["expression"],
                          eyes: exp.eyes as CartoonAvatarConfig["eyes"],
                          eyebrows: exp.eyebrows as CartoonAvatarConfig["eyebrows"],
                        })
                      }
                    >
                      {config.expression === exp.id && <span className={styles.optionCheckmark}>✓</span>}
                      <span className={styles.optionIcon}>{exp.icon}</span>
                      <span className={styles.optionLabel}>{exp.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Facial Hair */}
          {currentStep === 5 && (
            <div className={styles.stepContentBox}>
              <div className={styles.stepHeading}>
                <div className={styles.stepHeadingTitle}>
                  <span>🧔</span>
                  <span>ریش و سبیل</span>
                </div>
              </div>

              <div>
                <label className={styles.paletteTitle}>مدل ریش و سبیل:</label>
                <div className={styles.optionGrid} style={{ marginTop: "0.5rem" }}>
                  {[
                    { id: "none", label: "بدون ریش", icon: "🧼" },
                    { id: "stubble", label: "ته‌ریش", icon: "🧔‍♂️" },
                    { id: "mustache", label: "سبیل", icon: "👨" },
                    { id: "goatee", label: "پروفسوری", icon: "🐐" },
                    { id: "full_beard", label: "ریش کامل", icon: "🧔" },
                  ].map((fh) => (
                    <div
                      key={fh.id}
                      className={`${styles.optionCard} ${config.facialHair === fh.id ? styles.optionCardActive : ""}`}
                      onClick={() => updateConfig({ facialHair: fh.id as CartoonAvatarConfig["facialHair"] })}
                    >
                      {config.facialHair === fh.id && <span className={styles.optionCheckmark}>✓</span>}
                      <span className={styles.optionIcon}>{fh.icon}</span>
                      <span className={styles.optionLabel}>{fh.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {config.facialHair !== "none" && (
                <div className={styles.paletteSection}>
                  <span className={styles.paletteTitle}>رنگ ریش:</span>
                  <div className={styles.swatchesRow}>
                    {HAIR_COLORS.slice(0, 5).map((hc) => (
                      <button
                        key={hc.id}
                        type="button"
                        className={`${styles.swatchBtn} ${
                          (config.facialHairColor || config.hairColor) === hc.hex ? styles.swatchBtnActive : ""
                        }`}
                        style={{ background: hc.hex }}
                        onClick={() => updateConfig({ facialHairColor: hc.hex })}
                        title={hc.label}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 6: Glasses & Accessories */}
          {currentStep === 6 && (
            <div className={styles.stepContentBox}>
              <div className={styles.stepHeading}>
                <div className={styles.stepHeadingTitle}>
                  <span>🕶️</span>
                  <span>عینک و کلاه</span>
                </div>
              </div>

              <div>
                <label className={styles.paletteTitle}>عینک:</label>
                <div className={styles.optionGrid} style={{ marginTop: "0.5rem" }}>
                  {[
                    { id: "none", label: "بدون عینک", icon: "❌" },
                    { id: "round", label: "گرد", icon: "👓" },
                    { id: "classic", label: "مستطیلی", icon: "🕶️" },
                    { id: "cat_eye", label: "گربه‌ای", icon: "🎀" },
                    { id: "sunglasses", label: "دودی", icon: "😎" },
                  ].map((g) => (
                    <div
                      key={g.id}
                      className={`${styles.optionCard} ${config.glasses === g.id ? styles.optionCardActive : ""}`}
                      onClick={() => updateConfig({ glasses: g.id as CartoonAvatarConfig["glasses"] })}
                    >
                      {config.glasses === g.id && <span className={styles.optionCheckmark}>✓</span>}
                      <span className={styles.optionIcon}>{g.icon}</span>
                      <span className={styles.optionLabel}>{g.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: "0.5rem" }}>
                <label className={styles.paletteTitle}>کلاه:</label>
                <div className={styles.optionGrid} style={{ marginTop: "0.5rem" }}>
                  {[
                    { id: "none", label: "بدون کلاه", icon: "❌" },
                    { id: "cap_forward", label: "کپ", icon: "🧢" },
                    { id: "cap_backward", label: "کپ برعکس", icon: "🧢" },
                    { id: "beanie", label: "بافتنی", icon: "🧶" },
                    { id: "grad_cap", label: "فارغ‌التحصیلی", icon: "🎓" },
                    { id: "headband", label: "هدبند", icon: "🎗️" },
                  ].map((hw) => (
                    <div
                      key={hw.id}
                      className={`${styles.optionCard} ${config.headwear === hw.id ? styles.optionCardActive : ""}`}
                      onClick={() => updateConfig({ headwear: hw.id as CartoonAvatarConfig["headwear"] })}
                    >
                      {config.headwear === hw.id && <span className={styles.optionCheckmark}>✓</span>}
                      <span className={styles.optionIcon}>{hw.icon}</span>
                      <span className={styles.optionLabel}>{hw.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: "0.5rem" }}>
                <label className={styles.paletteTitle}>اکسسوری:</label>
                <div className={styles.optionGrid} style={{ marginTop: "0.5rem" }}>
                  {[
                    { id: "none", label: "بدون اکسسوری", icon: "❌" },
                    { id: "headphones", label: "هدفون", icon: "🎧" },
                    { id: "earring_gold", label: "گوشواره طلا", icon: "🪙" },
                    { id: "earring_silver", label: "گوشواره نقره", icon: "🔘" },
                  ].map((acc) => (
                    <div
                      key={acc.id}
                      className={`${styles.optionCard} ${config.accessories === acc.id ? styles.optionCardActive : ""}`}
                      onClick={() => updateConfig({ accessories: acc.id as CartoonAvatarConfig["accessories"] })}
                    >
                      {config.accessories === acc.id && <span className={styles.optionCheckmark}>✓</span>}
                      <span className={styles.optionIcon}>{acc.icon}</span>
                      <span className={styles.optionLabel}>{acc.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Clothing & Background */}
          {currentStep === 7 && (
            <div className={styles.stepContentBox}>
              <div className={styles.stepHeading}>
                <div className={styles.stepHeadingTitle}>
                  <span>👔</span>
                  <span>لباس و زمینه</span>
                </div>
              </div>

              <div>
                <label className={styles.paletteTitle}>مدل لباس:</label>
                <div className={styles.optionGrid} style={{ marginTop: "0.5rem" }}>
                  {[
                    { id: "hoodie", label: "هودی", icon: "🧥" },
                    { id: "tshirt", label: "تیشرت", icon: "👕" },
                    { id: "school_uniform", label: "فرم مدرسه", icon: "👔" },
                    { id: "jacket", label: "کاپشن", icon: "🦺" },
                    { id: "suit", label: "کت", icon: "🤵" },
                  ].map((cl) => (
                    <div
                      key={cl.id}
                      className={`${styles.optionCard} ${config.clothing === cl.id ? styles.optionCardActive : ""}`}
                      onClick={() => updateConfig({ clothing: cl.id as CartoonAvatarConfig["clothing"] })}
                    >
                      {config.clothing === cl.id && <span className={styles.optionCheckmark}>✓</span>}
                      <span className={styles.optionIcon}>{cl.icon}</span>
                      <span className={styles.optionLabel}>{cl.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.paletteSection}>
                <span className={styles.paletteTitle}>رنگ لباس:</span>
                <div className={styles.swatchesRow}>
                  {CLOTHING_COLORS.map((cc) => (
                    <button
                      key={cc.id}
                      type="button"
                      className={`${styles.swatchBtn} ${config.clothingColor === cc.hex ? styles.swatchBtnActive : ""}`}
                      style={{ background: cc.hex }}
                      onClick={() => updateConfig({ clothingColor: cc.hex, clothingAccent: cc.accent })}
                      title={cc.label}
                    />
                  ))}
                </div>
              </div>

              <div style={{ marginTop: "0.5rem" }}>
                <label className={styles.paletteTitle}>رنگ پس‌زمینه:</label>
                <div className={styles.optionGrid} style={{ marginTop: "0.5rem" }}>
                  {Object.entries(BACKGROUNDS).map(([bgKey, bgObj]) => (
                    <div
                      key={bgKey}
                      className={`${styles.optionCard} ${config.background === bgKey ? styles.optionCardActive : ""}`}
                      style={{ background: bgObj.gradient, color: "#ffffff" }}
                      onClick={() => updateConfig({ background: bgKey as CartoonAvatarConfig["background"] })}
                    >
                      {config.background === bgKey && <span className={styles.optionCheckmark}>✓</span>}
                      <span className={styles.optionLabel} style={{ color: "#ffffff", textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>
                        {bgObj.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Stepper Footer Controls */}
          {(() => {
            const stepIndex = steps.findIndex((s) => s.id === currentStep);
            const isFirst = stepIndex <= 0;
            const isLast = stepIndex >= steps.length - 1;
            return (
              <div className={styles.stepperFooter}>
                <button
                  type="button"
                  className={`${styles.stepperBtn} ${styles.stepperBtnPrev}`}
                  disabled={isFirst}
                  onClick={() => !isFirst && setCurrentStep(steps[stepIndex - 1].id)}
                >
                  <span>🠔</span>
                  <span>قبلی</span>
                </button>

                {!isLast ? (
                  <button
                    type="button"
                    className={`${styles.stepperBtn} ${styles.stepperBtnNext}`}
                    onClick={() => setCurrentStep(steps[stepIndex + 1].id)}
                  >
                    <span>بعدی</span>
                    <span>➔</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className={`${styles.stepperBtn} ${styles.stepperBtnNext}`}
                    style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}
                    onClick={handleSave}
                  >
                    <span>💾</span>
                    <span>ذخیره آواتار</span>
                  </button>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
