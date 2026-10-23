'use client';

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ALL_IELTS_CLINICS, CLINIC_SKILL_META } from "@/data/ielts/clinics";
import {
  getStoredClinicProgress,
  calculateClinicsOverallStats,
  type ClinicsOverallStats,
} from "@/lib/ielts-clinic-storage";
import type { ClinicSkill, ClinicProgressRecord } from "@endoora/contracts";
import styles from "./ielts-clinics.module.css";

export function IELTSClinicsHub() {
  const [selectedSkill, setSelectedSkill] = useState<ClinicSkill | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [progressMap, setProgressMap] = useState<Record<string, ClinicProgressRecord>>({});
  const [stats, setStats] = useState<ClinicsOverallStats>({
    totalClinics: ALL_IELTS_CLINICS.length,
    completedCount: 0,
    badgesUnlockedCount: 0,
    overallAccuracy: 0,
    totalTimeSpentSeconds: 0,
    skillBreakdown: {
      reading: { total: 3, completed: 0, accuracy: 0 },
      writing: { total: 2, completed: 0, accuracy: 0 },
      listening: { total: 2, completed: 0, accuracy: 0 },
      speaking: { total: 2, completed: 0, accuracy: 0 },
    },
  });

  useEffect(() => {
    const progress = getStoredClinicProgress();
    setProgressMap(progress);
    setStats(calculateClinicsOverallStats(ALL_IELTS_CLINICS.length));
  }, []);

  const filteredClinics = useMemo(() => {
    return ALL_IELTS_CLINICS.filter((clinic) => {
      if (selectedSkill !== "all" && clinic.skill !== selectedSkill) {
        return false;
      }
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchesFa = clinic.titleFa.toLowerCase().includes(q);
        const matchesEn = clinic.titleEn.toLowerCase().includes(q);
        const matchesSummary = clinic.hurdleSummaryFa.toLowerCase().includes(q);
        if (!matchesFa && !matchesEn && !matchesSummary) return false;
      }
      return true;
    });
  }, [selectedSkill, searchQuery]);

  return (
    <div className={styles.container}>
      {/* Header Navigation Tabs between IELTS modules */}
      <nav className={styles.headerNavTabs} aria-label="بخش‌های آیلتس اندورا">
        <Link href="/ielts" className={styles.navTab}>
          📑 بانک آزمون‌های ماک
        </Link>
        <Link href="/ielts/clinics" className={`${styles.navTab} ${styles.navTabActive}`}>
          🎯 کلینیک‌های استراتژی و تله‌زدایی
        </Link>
        <Link href="/ielts/writing" className={styles.navTab}>
          ✍️ شبیه‌ساز رایتینگ
        </Link>
        <Link href="/ielts/speaking" className={styles.navTab}>
          🎙️ شبیه‌ساز اسپیکینگ
        </Link>
      </nav>

      {/* Main Hub Header */}
      <header className={styles.hubHeader}>
        <span className={styles.kicker}>IELTS Trap-Decryption Masterclasses</span>
        <h1 className={styles.title}>کلینیک‌های تخصصی استراتژی و تله‌زدایی آیلتس</h1>
        <p className={styles.subtitle}>
          آموزش متمرکز فرمول‌های طلایی بند ۷+ برای عبور از پرتکرارترین تله‌های کمبریج؛ شامل
          کالبدشکافی خطاهای متداول فارسی‌زبان‌ها، منطق اگزمینر، و تمرین‌های تعاملی با فیدبک آنی.
        </p>
      </header>

      {/* Stats and Mastery Banner */}
      <section className={styles.statsBanner} aria-label="آمار پیشرفت کلینیک‌ها">
        <div className={styles.statsText}>
          <h3>نقشه تسلط بر آزمون آیلتس (Mastery Radar)</h3>
          <p>
            با تکمیل هر کلینیک و پاسخ به تمرین‌های تشخیصی، مدال رسمی <strong>«شکار تله کمبریج»</strong>{" "}
            را دریافت کرده و دقت تحلیلی خود را تا نمره بند ۸ ارتقا دهید.
          </p>
        </div>
        <div className={styles.statsPills}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>
              {stats.completedCount} / {stats.totalClinics}
            </span>
            <span className={styles.statLabel}>کلینیک‌های فتح‌شده</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>
              {stats.overallAccuracy > 0 ? `${stats.overallAccuracy}٪` : "---"}
            </span>
            <span className={styles.statLabel}>میانگین دقت تمرین</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{stats.badgesUnlockedCount}</span>
            <span className={styles.statLabel}>مدال‌های افتخار</span>
          </div>
        </div>
      </section>

      {/* Skill Filters and Search Bar */}
      <section className={styles.filterSection} aria-label="فیلترهای مهارتی">
        <div className={styles.filterPills}>
          <button
            type="button"
            className={`${styles.filterPill} ${selectedSkill === "all" ? styles.filterPillActive : ""}`}
            onClick={() => setSelectedSkill("all")}
          >
            همه مهارت‌ها <span className={styles.filterCount}>{ALL_IELTS_CLINICS.length}</span>
          </button>
          {(Object.keys(CLINIC_SKILL_META) as ClinicSkill[]).map((skill) => {
            const meta = CLINIC_SKILL_META[skill];
            const isSelected = selectedSkill === skill;
            return (
              <button
                key={skill}
                type="button"
                className={`${styles.filterPill} ${isSelected ? styles.filterPillActive : ""}`}
                onClick={() => setSelectedSkill(skill)}
              >
                <span>{meta.icon}</span>
                <span>{meta.labelEn}</span>
                <span className={styles.filterCount}>{meta.count}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.searchBar}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="جستجوی تله یا مهارت (مثلاً: Not Given, Overview, Map)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      {/* Clinic Cards Grid */}
      <section className={styles.clinicGrid} aria-label="لیست کلینیک‌های آیلتس">
        {filteredClinics.map((clinic) => {
          const record = progressMap[clinic.id];
          const isCompleted = record?.completed;

          return (
            <Link
              key={clinic.id}
              href={`/ielts/clinics/${clinic.id}`}
              className={styles.clinicCard}
            >
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>{clinic.heroIcon}</span>
                <div className={styles.cardBadges}>
                  <span className={styles.targetBandBadge}>{clinic.targetBands}</span>
                  {isCompleted && (
                    <span className={styles.statusBadgeCompleted}>
                      تکمیل شده ✓ ({record.accuracyPercentage}٪)
                    </span>
                  )}
                </div>
              </div>

              <h2 className={styles.cardTitleFa}>{clinic.titleFa}</h2>
              <p className={styles.cardTitleEn}>{clinic.titleEn}</p>
              <p className={styles.cardSummary}>{clinic.hurdleSummaryFa}</p>

              <div className={styles.cardFooter}>
                <span className={styles.cardMetaItem}>
                  ⏱️ {clinic.estimatedMinutes} دقیقه
                </span>
                <span className={styles.cardMetaItem}>
                  📝 {clinic.drills.length} تمرین زنده
                </span>
                <span className={styles.enterAction}>
                  ورود به کلینیک ←
                </span>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
