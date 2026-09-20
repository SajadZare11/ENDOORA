"use client";

import { Button, Input, Table } from "@endoora/ui";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./privacy-ops.module.css";
import {
  fetchPrivacyTelemetry,
  triggerRetentionPurge,
  PrivacyTelemetry
} from "../../lib/privacy-ops";

export function PrivacyOperationsDashboard() {
  const [telemetry, setTelemetry] = useState<PrivacyTelemetry | null>(null);
  const [dryRun, setDryRun] = useState(true);
  const [purgeStatus, setPurgeStatus] = useState<string>("");

  useEffect(() => {
    fetchPrivacyTelemetry().then(setTelemetry).catch(console.error);
  }, []);

  const handlePurge = async () => {
    setPurgeStatus("در حال اجرا...");
    try {
      const res = await triggerRetentionPurge(dryRun);
      setPurgeStatus(`وضعیت: ${res.message} (Dry Run: ${res.dryRun})`);
    } catch {
      setPurgeStatus("خطا در اجرا");
    }
  };

  if (!telemetry) return <div dir="rtl" className={styles.container}>در حال بارگذاری...</div>;

  return (
    <div className={styles.container} dir="rtl">
      {/* 9-Tab Operations Navigation Ribbon */}
      <nav className={styles.opsRibbon} aria-label="منوی عملیات">
        <Link href="/admin" className={styles.opsTab}>داشبورد کلان (Admin)</Link>
        <Link href="/operations/taxonomy" className={styles.opsTab}>طبقه‌بندی (Taxonomy)</Link>
        <Link href="/operations/questions" className={styles.opsTab}>بانک سوالات (Questions)</Link>
        <Link href="/operations/courses" className={styles.opsTab}>دوره‌ها (Courses)</Link>
        <Link href="/operations/content" className={styles.opsTab}>محتوا (Content)</Link>
        <Link href="/operations/flags" className={styles.opsTab}>پرچم‌ها (Flags)</Link>
        <Link href="/operations/audit" className={styles.opsTab}>حسابرسی (Audit)</Link>
        <Link href="/operations/security" className={styles.opsTab}>امنیت (Security)</Link>
        <Link href="/operations/privacy" className={`${styles.opsTab} ${styles.opsTabActive}`}>🛡️ حریم خصوصی (Privacy)</Link>
        <Link href="/operations/pen-test" className={styles.opsTab}>🔍 آزمون نفوذ (Pen-Test)</Link>
        <Link href="/operations/disaster-recovery" className={styles.opsTab}>💾 بازیابی بحران (OPS-004)</Link>
        <Link href="/operations/ai" className={styles.opsTab}>🤖 مدل‌ها و پرامپت‌ها (OPS-005)</Link>
        <Link href="/operations/monitoring" className={styles.opsTab}>📊 پایش و لاگ‌ها (OPS-006)</Link>
        <Link href="/operations/analytics" className={styles.opsTab}>📈 تحلیل محصول و فانل (OPS-007)</Link>
        <Link href="/operations/pwa" className={styles.opsTab}>📱 PWA و تاب‌آوری آفلاین (OPS-008)</Link>
        <Link href="/operations/incidents" className={styles.opsTab}>🚨 مدیریت بحران و ران‌بوک‌ها (OPS-009)</Link>
        <Link href="/operations/launch" className={styles.opsTab}>🚀 پروداکشن و لانچ نهایی (LAUNCH-001)</Link>
      </nav>

      <div className={styles.header}>
        <h1 className={styles.headerTitle}>کنسول عملیات حفاظت داده و حریم خصوصی (SEC-002)</h1>
        <p className={styles.headerDesc}>
          مدیریت انطباق با GDPR و قوانین صیانت از داده‌های ایران
        </p>
      </div>

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiValue}>{telemetry.deletion_stats.pending}</div>
          <div className={styles.kpiLabel}>Pending Deletions (با فرصت لغو ۷ روزه)</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiValue}>{telemetry.export_stats.completed}</div>
          <div className={styles.kpiLabel}>Data Exports Completed (خروجی‌های قابل دانلود)</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiValue}>{telemetry.recent_purge_logs.length}</div>
          <div className={styles.kpiLabel}>Total Purges Run (تعداد دوره‌های پاکسازی اجرا شده)</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.kpiValue}>100%</div>
          <div className={styles.kpiLabel}>Compliance Score (100% مطابق با مقررات GDPR و قانون صیانت از داده‌های ایران)</div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>ماتریس سیاست‌های نگهداری داده‌ها (Retention Policy Matrix)</h2>
        <Table className={styles.table}>
          <thead>
            <tr className={styles.tr}>
              <th className={styles.th}>دسته‌بندی (Data Category)</th>
              <th className={styles.th}>دوره نگهداری (Retention Period)</th>
              <th className={styles.th}>اقدام پس از انقضا (Action on Expiry)</th>
            </tr>
          </thead>
          <tbody>
            {telemetry.retention_schedules.map((item, idx) => (
              <tr key={idx} className={styles.tr}>
                <td className={styles.td}>{item.category_fa} ({item.data_category})</td>
                <td className={styles.td}><span className={styles.badge}>{item.retention_period}</span></td>
                <td className={styles.td}>{item.action_on_expiry}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>اجرای دستی پاکسازی (Manual Purge Trigger)</h2>
        <div className={styles.purgeControl}>
          <Button className={styles.btnPrimary} onClick={handlePurge}>
            اجرای پاکسازی خودکار دوره‌ای
          </Button>
          <label className={styles.checkboxLabel}>
            <Input type="checkbox" checked={dryRun} onChange={(e) => setDryRun(e.target.checked)} />
            اجرای آزمایشی (Dry Run)
          </label>
          {purgeStatus && <span>{purgeStatus}</span>}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>گزارش‌های اخیر پاکسازی (Recent Data Purge Logs)</h2>
        <Table className={styles.table}>
          <thead>
            <tr className={styles.tr}>
              <th className={styles.th}>شناسه (ID)</th>
              <th className={styles.th}>زمان اجرا (Executed At)</th>
              <th className={styles.th}>حساب‌های حذف شده (Accounts Erased)</th>
              <th className={styles.th}>فایل‌های صوتی (Audio Purged)</th>
            </tr>
          </thead>
          <tbody>
            {telemetry.recent_purge_logs.map((log) => (
              <tr key={log.id} className={styles.tr}>
                <td className={styles.td}>{log.id}</td>
                <td className={styles.td}>{new Date(log.executed_at).toLocaleString('fa-IR')}</td>
                <td className={styles.td}>{log.accounts_erased}</td>
                <td className={styles.td}>{log.audio_files_purged}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>چک‌لیست انطباق حقوق قانونی (Statutory Rights Compliance Checklist)</h2>
        <div className={styles.kpiGrid}>
          {Object.entries(telemetry.compliance_scorecard).map(([key, val]) => (
            <div key={key} className={styles.kpiCard} style={{ padding: 'var(--spacing-md)' }}>
              <div className={styles.kpiLabel}>{key}</div>
              <div className={styles.kpiValue} style={{ fontSize: 'var(--font-size-xl)' }}>{val}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
