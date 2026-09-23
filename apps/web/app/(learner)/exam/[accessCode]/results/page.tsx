"use client";

import React, { use } from "react";
import Link from "next/link";
import styles from "@/components/exam/exam.module.css";
import { Button } from "@endoora/ui";

export default function ExamResultsPage({ params }: { params: Promise<{ accessCode: string }> }) {
  const resolvedParams = use(params);
  const accessCode = resolvedParams.accessCode;

  return (
    <div className={styles.examContainer} dir="rtl">
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "1.25rem",
          padding: "3rem 2rem",
          maxWidth: "560px",
          margin: "3rem auto",
          textAlign: "center",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div
          style={{
            width: "4.5rem",
            height: "4.5rem",
            background: "#ecfdf5",
            color: "#059669",
            borderRadius: "9999px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.25rem",
            margin: "0 auto 1.5rem auto",
          }}
        >
          ✓
        </div>

        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.5rem 0" }}>
          آزمون شما با موفقیت ثبت شد!
        </h1>
        <p style={{ color: "#64748b", fontSize: "0.9375rem", lineHeight: 1.6, margin: "0 0 2rem 0" }}>
          پاسخ‌های شما در سامانه ثبت گردید و سوالات تستی به‌صورت خودکار تصحیح شدند. بخش‌های گفتاری و تشریحی پس از ارزیابی مدرس در کارنامه شما قرار خواهند گرفت.
        </p>

        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "0.75rem",
            padding: "1.25rem",
            marginBottom: "2rem",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <div>
            <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>وضعیت پاسخ‌نامه:</span>
            <div style={{ fontWeight: 700, color: "#047857", marginTop: "0.25rem" }}>
              ارسال‌شده و معتبر
            </div>
          </div>
          <div>
            <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>تأییدیه امنیتی:</span>
            <div style={{ fontWeight: 700, color: "#4338ca", marginTop: "0.25rem" }}>
              🛡️ لاگ بدون ابهام ثبت شد
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link href="/dashboard">
            <Button type="button" style={{ background: "#4f46e5", color: "#ffffff", fontWeight: 700, padding: "0.75rem 2rem" }}>
              بازگشت به داشبورد زبان‌آموز
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
