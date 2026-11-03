"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { VisualSkillTree } from "@/components/learner/path";
import { Tamrin20HubView } from "@/components/highschool/tamrin20";
import styles from "./learn.module.css";

export type LearnTab = "cefr" | "tamrin20" | "video";

export interface HubDestination {
  title: string;
  desc: string;
  href: string;
  icon: string;
  action: string;
  badge?: string;
  highlightText?: string;
}

const VIDEO_COURSES: HubDestination[] = [
  {
    title: "یادگیری با ویدیو (American English File & Family and Friends)",
    desc: "تماشای ویدیوهای آموزشی کتب Family and Friends (کودکان) و American English File (بزرگسالان) همراه با سنجش تعاملی هر ۶ مهارت زبانی از محتوای ویدیو.",
    href: "/learn/video",
    icon: "🎬",
    action: "شروع یادگیری با ویدیو",
    badge: "سنجش ۶ مهارت اصلی",
    highlightText: "Family & Friends + American English File",
  },
  {
    title: "دوره‌های موضوعی و لیسنینگ اختصاصی",
    desc: "درس‌های شنیداری استاندارد همراه با ترنسکریپت دو زبانه، واژگان کلیدی، و سوالات مفهومی استخراج‌شده از منابع معتبر بین‌المللی.",
    href: "/listening",
    icon: "🎧",
    action: "ورود به دوره‌های شنیداری",
    badge: "پادکست‌ها و لیسنینگ",
    highlightText: "همراه با پادکست‌های طبقه‌بندی‌شده CEFR",
  },
];

export function LearnHubView() {
  const [activeTab, setActiveTab] = useState<LearnTab>("cefr");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as LearnTab | null;
      if (tabParam === "cefr" || tabParam === "tamrin20" || tabParam === "video") {
        setActiveTab(tabParam);
      }
    }
  }, []);

  function handleTabChange(tab: LearnTab) {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState({}, "", url.toString());
    }
  }

  return (
    <div className={styles.hubWrapper}>
      {/* Sticky Segmented Switcher for 3 Learning Tracks */}
      <nav
        className={styles.stickySwitcherContainer}
        role="tablist"
        aria-label="مسیرهای آموزشی ایندورا"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "cefr"}
          className={`${styles.segmentedTab} ${activeTab === "cefr" ? styles.segmentedTabActive : ""}`}
          onClick={() => handleTabChange("cefr")}
        >
          <span className={styles.tabIcon} aria-hidden="true">🗺️</span>
          <span>مسیر جامع CEFR</span>
          <span className={styles.tabBadge}>A1–C2</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "tamrin20"}
          className={`${styles.segmentedTab} ${activeTab === "tamrin20" ? styles.segmentedTabActive : ""}`}
          onClick={() => handleTabChange("tamrin20")}
        >
          <span className={styles.tabIcon} aria-hidden="true">🏫</span>
          <span>تمرین تا ۲۰ (نهایی ۱۲)</span>
          <span className={styles.tabBadge}>Vision 3</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "video"}
          className={`${styles.segmentedTab} ${activeTab === "video" ? styles.segmentedTabActive : ""}`}
          onClick={() => handleTabChange("video")}
        >
          <span className={styles.tabIcon} aria-hidden="true">🎬</span>
          <span>دوره‌های ویدیویی</span>
          <span className={styles.tabBadge}>AEF</span>
        </button>
      </nav>

      {/* Tab 1: Visual CEFR Skill Tree & Serpentine Learning Path */}
      {activeTab === "cefr" && (
        <section aria-label="درخت مهارت‌های CEFR">
          <VisualSkillTree />
        </section>
      )}

      {/* Tab 2: High School Tamrin 20 Hub */}
      {activeTab === "tamrin20" && (
        <section aria-label="تمرین تا ۲۰ دبیرستان">
          <Tamrin20HubView />
        </section>
      )}

      {/* Tab 3: Video Courses */}
      {activeTab === "video" && (
        <section className={styles.categorySection} aria-labelledby="cat-title-courses">
          <header className={styles.categoryHeader}>
            <div className={styles.categoryHeaderTitleRow}>
              <span className={styles.categoryIconBadge} aria-hidden="true">
                🎓
              </span>
              <div>
                <h2 id="cat-title-courses" className={styles.categoryTitle}>
                  دوره‌های ویدیویی و مهارت‌محور
                </h2>
                <p className={styles.categoryDesc}>
                  یادگیری تعاملی از طریق تماشای ویدیوهای استاندارد بین‌المللی همراه با تمرین‌های در لحظه
                </p>
              </div>
            </div>
            <span className={styles.categoryCountBadge}>
              ۲ دوره فعال
            </span>
          </header>

          <div className={styles.hubGrid}>
            {VIDEO_COURSES.map((item, idx) => (
              <Link key={idx} href={item.href} className={styles.hubCard}>
                <div className={styles.cardTop}>
                  <div className={styles.cardHeaderRow}>
                    <span className={styles.cardIcon} aria-hidden="true">{item.icon}</span>
                    {item.badge && (
                      <span className={styles.cardBadge}>{item.badge}</span>
                    )}
                  </div>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDesc}>{item.desc}</p>
                  {item.highlightText && (
                    <div className={styles.cardHighlight}>
                      <span aria-hidden="true">✨</span>
                      <span>{item.highlightText}</span>
                    </div>
                  )}
                </div>
                <div className={styles.cardAction}>
                  <span>{item.action}</span>
                  <span aria-hidden="true" className={styles.arrowIcon}>←</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
