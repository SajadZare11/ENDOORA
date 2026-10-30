"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./classes.module.css";
import { EnrolledClassRecord, getEnrolledCohorts } from "../../lib/classes-storage";

interface EnrolledCohortsBannerProps {
  refreshTrigger?: number;
}

export function EnrolledCohortsBanner({ refreshTrigger = 0 }: EnrolledCohortsBannerProps) {
  const [enrolled, setEnrolled] = useState<EnrolledClassRecord[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setEnrolled(getEnrolledCohorts());
  }, [refreshTrigger]);

  if (!mounted || enrolled.length === 0) {
    return null;
  }

  const active = enrolled[0];

  return (
    <div className={styles.enrolledBanner} role="region" aria-label="کلاس‌های ثبت‌نام شده فعال">
      <div className={styles.enrolledContent}>
        <div className={styles.enrolledIcon}>🎙️</div>
        <div>
          <h4 className={styles.enrolledTitle}>
            کلاس فعال شما: {active.cohortTitleFa}
            {enrolled.length > 1 && (
              <span
                style={{
                  fontSize: "0.75rem",
                  marginRight: "0.5rem",
                  background: "rgba(255,255,255,0.25)",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "6px",
                }}
              >
                +{enrolled.length - 1} کلاس دیگر
              </span>
            )}
          </h4>
          <p className={styles.enrolledSub}>
            مدرس: <strong>{active.teacherNameFa}</strong> &bull; زمان جلسه بعدی:{" "}
            <strong>{active.nextSessionTextFa}</strong>
          </p>
        </div>
      </div>
      <div>
        <Link
          href={`/bookings/${active.bookingId}/room`}
          className={styles.enterStudioBtn}
          title="ورود مستقیم به اتاق کلاس با تخته تعاملی و وایت‌بورد"
        >
          <span>ورود به استودیوی کلاس</span>
          <span>&larr;</span>
        </Link>
      </div>
    </div>
  );
}
