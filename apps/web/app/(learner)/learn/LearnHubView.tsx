"use client";

import Link from "next/link";
import styles from "./learn.module.css";

export interface HubDestination {
  title: string;
  desc: string;
  href: string;
  icon: string;
  action: string;
  badge?: string;
  highlightText?: string;
}

const COURSES_AND_PATHS: HubDestination[] = [
  {
    title: "یادگیری با ویدیو",
    desc: "تماشای ویدیوهای آموزشی کتب Family and Friends (کودکان) و American English File (بزرگسالان) همراه با سنجش تعاملی هر ۶ مهارت زبانی از محتوای ویدیو.",
    href: "/learn/video",
    icon: "🎬",
    action: "شروع یادگیری با ویدیو",
    badge: "سنجش ۶ مهارت اصلی",
    highlightText: "Family & Friends + American English File",
  },
  {
    title: "زبان انگلیسی دبیرستان",
    desc: "آموزش خط‌به‌خط، استقرایی و تعاملی کتب رسمی Vision 1 (دهم)، Vision 2 (یازدهم) و Vision 3 (دوازدهم) شامل هر ۷ بخش استاندارد، کارگاه واژگان، صوت مکالمه و گرامر استقرایی.",
    href: "/high-school",
    icon: "🏫",
    action: "ورود به پایه‌های دبیرستان",
    badge: "پایه‌های ۱۰، ۱۱ و ۱۲ فعال",
    highlightText: "آموزش کامل Vision 1، Vision 2 و Vision 3 (۱۰ درس کامل)",
  },
];

export function LearnHubView() {
  return (
    <div className={styles.hubWrapper}>
      {/* Featured Section Header */}
      <section className={styles.categorySection} aria-labelledby="cat-title-courses">
        <header className={styles.categoryHeader}>
          <div className={styles.categoryHeaderTitleRow}>
            <span className={styles.categoryIconBadge} aria-hidden="true">
              🎓
            </span>
            <div>
              <h2 id="cat-title-courses" className={styles.categoryTitle}>
                دوره‌ها و مسیرهای آموزشی
              </h2>
              <p className={styles.categoryDesc}>
                برنامه‌ها و متدهای یادگیری ساختاریافته از سطح پایه تا تسلط کامل، به تفکیک یادگیری ویدیویی و زبان دبیرستان
              </p>
            </div>
          </div>
          <span className={styles.categoryCountBadge}>
            ۲ زیرمجموعه آموزشی
          </span>
        </header>

        {/* 2-Column Responsive Grid */}
        <div className={styles.hubGrid}>
          {COURSES_AND_PATHS.map((item, idx) => (
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
    </div>
  );
}
