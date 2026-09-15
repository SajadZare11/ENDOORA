"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./security-ops.module.css";
import {
  fetchSecurityAudit,
  fetchSecurityHealth,
  SecurityAuditData,
  SecurityHealthStatus,
} from "../../lib/security-ops";

export function SecurityOperationsDashboard() {
  const [auditData, setAuditData] = useState<SecurityAuditData | null>(null);
  const [healthStatus, setHealthStatus] = useState<SecurityHealthStatus | null>(null);

  const loadData = () => {
    Promise.all([fetchSecurityAudit(), fetchSecurityHealth()])
      .then(([auditRes, healthRes]) => {
        setAuditData(auditRes);
        setHealthStatus(healthRes);
      })
      .catch((err) => {
        console.error("Failed to load security data:", err);
      });
  };

  useEffect(() => {
    let ignore = false;
    Promise.all([fetchSecurityAudit(), fetchSecurityHealth()])
      .then(([auditRes, healthRes]) => {
        if (!ignore) {
          setAuditData(auditRes);
          setHealthStatus(healthRes);
        }
      })
      .catch((err) => {
        console.error("Failed to load security data:", err);
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className={styles.container} dir="rtl">
      {/* 1. Operations Navigation Ribbon */}
      <nav className={styles.opsRibbon} aria-label="ناوبری ارشد عملیاتی">
        <Link href="/admin" className={styles.opsTab}>
          میز مدیریت کل (Overview)
        </Link>
        <Link href="/operations/flags" className={styles.opsTab}>
          کلیدهای ویژگی و کیل‌سوئیچ (OPS-002)
        </Link>
        <Link href="/operations/audit" className={styles.opsTab}>
          ردپای ممیزی تغییرات (OPS-003)
        </Link>
        <Link href="/operations/security" className={`${styles.opsTab} ${styles.opsTabActive}`}>
          🛡️ امنیت (SEC-001)
        </Link>
        <Link href="/operations/privacy" className={styles.opsTab}>
          🛡️ حریم خصوصی (Privacy)
        </Link>
        <Link href="/operations/pen-test" className={styles.opsTab}>
          🔍 آزمون نفوذ (Pen-Test)
        </Link>
        <Link href="/operations/disaster-recovery" className={styles.opsTab}>
          💾 بازیابی بحران (OPS-004)
        </Link>
        <Link href="/operations/courses" className={styles.opsTab}>
          مدیریت دوره‌ها (CONTENT-003)
        </Link>
        <Link href="/operations/content" className={styles.opsTab}>
          محتوا و فرهنگ (CONTENT-004)
        </Link>
        <Link href="/operations/questions" className={styles.opsTab}>
          بانک سوالات (QUESTION-001)
        </Link>
        <Link href="/operations/taxonomy" className={styles.opsTab}>
          درخت مهارت‌ها (TAXONOMY-001)
        </Link>
      </nav>

      {/* 2. Executive Header */}
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>داشبورد عملیات امنیت و پیکربندی (SEC-001)</h1>
            {healthStatus?.status === "operational" && (
              <div className={styles.statusBadgeLive}>
                <span className={styles.pulseDot} />
                <span>ماژول امنیت فعال و پایدار</span>
              </div>
            )}
          </div>
          <p className={styles.subtitle}>
            پایش بلادرنگ هدرهای امنیتی، محدودیت‌های نرخ درخواست، سیاست‌های CORS و کوکی‌ها
          </p>
        </div>

        <div className={styles.headerActions}>
          <button onClick={loadData} className={styles.primaryBtn}>
            به‌روزرسانی وضعیت
          </button>
        </div>
      </header>

      {/* 3. Security KPI Cards */}
      {auditData && (
        <section className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiTitle}>
              <span>محدودیت نرخ (IP Rate Limit)</span>
              <span>🛡️</span>
            </div>
            <div className={styles.kpiValue} style={{ color: "var(--color-primary)" }}>
              {auditData.throttle_config.ip_rate_limit} <span style={{ fontSize: "var(--font-size-small)" }}>/دقیقه</span>
            </div>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiTitle}>
              <span>سطوح محدودیت (Throttle Tiers)</span>
              <span>⚡</span>
            </div>
            <div className={styles.kpiValue}>
              {Object.keys(auditData.throttle_config.role_rates).length} <span style={{ fontSize: "var(--font-size-small)" }}>نقش</span>
            </div>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiTitle}>
              <span>سیاست‌های رمز عبور (Validators)</span>
              <span>🔑</span>
            </div>
            <div className={styles.kpiValue} style={{ color: "var(--color-success)" }}>
              {auditData.password_validators} <span style={{ fontSize: "var(--font-size-small)" }}>اعتبارسنج</span>
            </div>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiTitle}>
              <span>دامنه‌های مجاز (CORS Origins)</span>
              <span>🌐</span>
            </div>
            <div className={styles.kpiValue} style={{ color: "var(--color-warning)" }}>
              {auditData.cors_config.allowed_origins_count}
            </div>
          </div>
        </section>
      )}

      {/* 4. Dual Panel Layout */}
      {auditData && (
        <div className={styles.dualLayout}>
          {/* Panel A: Security Headers Compliance */}
          <section className={styles.panelBox}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>انطباق هدرهای امنیتی</h2>
                <p className={styles.sectionSubtitle}>بررسی وضعیت فعال‌بودن هدرهای محافظتی در سطح سرور</p>
              </div>
            </div>

            <div className={styles.complianceGrid}>
              <div className={styles.complianceItem}>
                <span className={styles.complianceLabel}>X-Content-Type-Options</span>
                {auditData.security_headers.x_content_type_options ? (
                  <span className={`${styles.complianceBadge} ${styles.complianceEnabled}`}>✅ فعال (nosniff)</span>
                ) : (
                  <span className={`${styles.complianceBadge} ${styles.complianceDisabled}`}>❌ غیرفعال</span>
                )}
              </div>
              <div className={styles.complianceItem}>
                <span className={styles.complianceLabel}>X-Frame-Options</span>
                <span className={`${styles.complianceBadge} ${styles.complianceEnabled}`}>
                  ✅ {auditData.security_headers.x_frame_options}
                </span>
              </div>
              <div className={styles.complianceItem}>
                <span className={styles.complianceLabel}>Content-Security-Policy</span>
                {auditData.security_headers.csp_enabled ? (
                  <span className={`${styles.complianceBadge} ${styles.complianceEnabled}`}>
                    ✅ فعال {auditData.security_headers.csp_report_only ? "(Report Only)" : "(Enforced)"}
                  </span>
                ) : (
                  <span className={`${styles.complianceBadge} ${styles.complianceDisabled}`}>❌ غیرفعال</span>
                )}
              </div>
              <div className={styles.complianceItem}>
                <span className={styles.complianceLabel}>Strict-Transport-Security</span>
                {auditData.security_headers.hsts_enabled ? (
                  <span className={`${styles.complianceBadge} ${styles.complianceEnabled}`}>✅ فعال (HSTS)</span>
                ) : (
                  <span className={`${styles.complianceBadge} ${styles.complianceDisabled}`}>❌ غیرفعال</span>
                )}
              </div>
            </div>
          </section>

          {/* Panel B: Configuration Tables */}
          <section className={styles.panelBox}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>پیکربندی کوکی‌ها و نشست‌ها</h2>
                <p className={styles.sectionSubtitle}>تنظیمات امنیتی ذخیره‌سازی داده‌های حساس در مرورگر</p>
              </div>
            </div>

            <table className={styles.configTable}>
              <thead>
                <tr>
                  <th>نوع کوکی</th>
                  <th>HttpOnly</th>
                  <th>SameSite</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>کوکی نشست (Session)</td>
                  <td>
                    {auditData.cookie_security.session_httponly ? "✅ فعال" : "❌ غیرفعال"}
                  </td>
                  <td>
                    <span className={styles.monoValue}>{auditData.cookie_security.session_samesite}</span>
                  </td>
                </tr>
                <tr>
                  <td>کوکی محافظت CSRF</td>
                  <td>
                    {auditData.cookie_security.csrf_httponly ? "✅ فعال" : "❌ غیرفعال"}
                  </td>
                  <td>
                    <span className={styles.monoValue}>{auditData.cookie_security.csrf_samesite}</span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className={styles.sectionHeader} style={{ marginBlockStart: "var(--space-4)" }}>
              <h3 className={styles.sectionTitle} style={{ fontSize: "var(--font-size-card-title)" }}>محدودیت نرخ بر اساس نقش</h3>
            </div>
            
            <table className={styles.configTable}>
              <thead>
                <tr>
                  <th>گروه کاربری</th>
                  <th>نرخ مجاز (Requests)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(auditData.throttle_config.role_rates).map(([role, rate]) => (
                  <tr key={role}>
                    <td style={{ textTransform: "capitalize" }}>{role === "anonymous" ? "کاربر مهمان" : role === "learner" ? "زبان‌آموز" : role === "teacher" ? "مدرس" : role === "admin" ? "مدیر سیستم" : role}</td>
                    <td>
                      <span className={styles.monoValue}>{rate}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      )}

      {/* 5. Health & Footer */}
      {healthStatus && auditData && (
        <footer className={styles.footer}>
          <div className={styles.healthStatus}>
            <span className={styles.timestamp}>
              آخرین ارزیابی: {new Date(auditData.evaluated_at).toLocaleTimeString("fa-IR")}
            </span>
            <span>|</span>
            <span className={styles.timestamp}>نسخه ماژول: {auditData.module_version}</span>
          </div>
        </footer>
      )}
    </div>
  );
}
