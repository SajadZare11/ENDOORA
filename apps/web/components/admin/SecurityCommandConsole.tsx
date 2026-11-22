"use client";

import { errorMessage } from "../../lib/error-message.ts";
import React, { useState, useEffect, useCallback } from "react";
import styles from "./security-command.module.css";
import {
  type LiveUserSession,
  type IpFirewallRule,
  type MaintenanceConfig,
  type SecurityCommandStats,
  type SessionRiskLevel,
  type IpRuleType,
  type AttackVectorType,
  SESSION_RISK_LABELS,
  IP_RULE_TYPE_LABELS,
  ATTACK_VECTOR_LABELS,
  DURATION_LABELS,
} from "@/lib/security-command-content";

export function SecurityCommandConsole() {
  const [activeTab, setActiveTab] = useState<"sessions" | "firewall" | "maintenance">("sessions");
  const [sessions, setSessions] = useState<LiveUserSession[]>([]);
  const [rules, setRules] = useState<IpFirewallRule[]>([]);
  const [maintenanceConfig, setMaintenanceConfig] = useState<MaintenanceConfig | null>(null);
  const [stats, setStats] = useState<SecurityCommandStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [ruleTypeFilter, setRuleTypeFilter] = useState("all");

  // Block Modal State
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockIpAddress, setBlockIpAddress] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [blockDuration, setBlockDuration] = useState<"24_hours" | "7_days" | "permanent">("permanent");
  const [blockVector, setBlockVector] = useState<AttackVectorType>("manual_admin_ban");
  const [blockScore, setBlockScore] = useState(90);

  // Whitelist Modal State
  const [isWhitelistModalOpen, setIsWhitelistModalOpen] = useState(false);
  const [whitelistIpAddress, setWhitelistIpAddress] = useState("");
  const [whitelistReason, setWhitelistReason] = useState("");

  // Maintenance form drafts
  const [mHeadline, setMHeadline] = useState("");
  const [mMessage, setMMessage] = useState("");
  const [mEta, setMEta] = useState("");
  const [mAdminIps, setMAdminIps] = useState("");

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (roleFilter !== "all") params.set("role", roleFilter);
      if (riskFilter !== "all") params.set("risk", riskFilter);
      if (ruleTypeFilter !== "all") params.set("ruleType", ruleTypeFilter);

      const res = await fetch(`/api/admin/security?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setSessions(json.sessions);
        setRules(json.rules);
        setMaintenanceConfig(json.maintenanceConfig);
        setStats(json.stats);

        // Pre-fill maintenance drafts
        if (json.maintenanceConfig) {
          setMHeadline(json.maintenanceConfig.headline);
          setMMessage(json.maintenanceConfig.userMessage);
          setMEta(json.maintenanceConfig.estimatedEndTime);
          setMAdminIps(json.maintenanceConfig.whitelistedAdminIps?.join(", ") || "");
        }
      } else {
        showToast(json.error || "خطا در واکشی داده‌های امنیتی", "error");
      }
    } catch (err: unknown) {
      showToast(errorMessage(err) || "خطای غیرمنتظره ارتباط با سرور", "error");
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, riskFilter, ruleTypeFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Actions
  const handleKillSession = async (sessionId: string) => {
    if (!confirm(`آیا از ابطال فوری نشست ${sessionId} اطمینان دارید؟ کاربر بلافاصله لاگ‌اوت خواهد شد.`)) {
      return;
    }
    try {
      const res = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "kill_session", sessionId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        loadData();
      } else {
        showToast(data.error || data.message || "خطا در ابطال نشست", "error");
      }
    } catch (err: unknown) {
      showToast(errorMessage(err) || "خطا در ابطال نشست", "error");
    }
  };

  const handleForceLogoutUser = async (userId: string, userName: string) => {
    if (!confirm(`آیا مایلید تمام نشست‌های فعال کاربر "${userName}" لغو شوند؟`)) {
      return;
    }
    try {
      const res = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "force_logout_user", userId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        loadData();
      } else {
        showToast(data.error || data.message || "خطا در خروج اجباری کاربر", "error");
      }
    } catch (err: unknown) {
      showToast(errorMessage(err) || "خطا در خروج کاربر", "error");
    }
  };

  const handleOpenBlockModal = (presetIp?: string) => {
    setBlockIpAddress(presetIp || "");
    setBlockReason(presetIp ? `مسدودسازی پیرو ناهماهنگی امنیتی نشست آدرس ${presetIp}` : "");
    setBlockDuration("permanent");
    setBlockVector("manual_admin_ban");
    setBlockScore(90);
    setIsBlockModalOpen(true);
  };

  const handleSubmitBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockIpAddress.trim() || !blockReason.trim()) {
      showToast("لطفاً آدرس IP و دلیل مسدودسازی را کامل وارد نمایید.", "error");
      return;
    }
    try {
      const res = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "block_ip",
          ipAddress: blockIpAddress.trim(),
          reason: blockReason.trim(),
          duration: blockDuration,
          attackVector: blockVector,
          threatScore: blockScore,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`آدرس ${blockIpAddress} با موفقیت در فایروال مسدود گردید.`, "success");
        setIsBlockModalOpen(false);
        loadData();
      } else {
        showToast(data.error || "خطا در مسدودسازی IP", "error");
      }
    } catch (err: unknown) {
      showToast(errorMessage(err) || "خطا در ثبت فایروال", "error");
    }
  };

  const handleUnblock = async (ruleId: string, ip: string) => {
    if (!confirm(`آیا از رفع مسدودیت آدرس ${ip} در فایروال اطمینان دارید؟`)) {
      return;
    }
    try {
      const res = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unblock_ip", ruleId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        loadData();
      } else {
        showToast(data.error || "خطا در رفع انسداد", "error");
      }
    } catch (err: unknown) {
      showToast(errorMessage(err) || "خطا در ارتباط با سرور", "error");
    }
  };

  const handleSubmitWhitelist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whitelistIpAddress.trim() || !whitelistReason.trim()) {
      showToast("لطفاً آدرس IP و علت ثبت در فهرست سفید را وارد نمایید.", "error");
      return;
    }
    try {
      const res = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "whitelist_ip",
          ipAddress: whitelistIpAddress.trim(),
          reason: whitelistReason.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`آدرس ${whitelistIpAddress} با موفقیت به وایت‌لیست اضافه شد.`, "success");
        setIsWhitelistModalOpen(false);
        loadData();
      } else {
        showToast(data.error || "خطا در ثبت وایت‌لیست", "error");
      }
    } catch (err: unknown) {
      showToast(errorMessage(err) || "خطا در ثبت وایت‌لیست", "error");
    }
  };

  const handleToggleMaintenance = async (isActive: boolean) => {
    const actionText = isActive ? "فعال‌سازی حالت اضطراری قرنطینه" : "غیرفعال‌سازی حالت قرنطینه و بازگشت به فعالیت عادی";
    if (!confirm(`آیا از ${actionText} مطمئن هستید؟`)) {
      return;
    }
    try {
      const res = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_maintenance",
          isMaintenanceActive: isActive,
          headline: mHeadline,
          userMessage: mMessage,
          estimatedEndTime: mEta,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(isActive ? "پلتفرم در وضعیت قرنطینه و تعمیرات قرار گرفت." : "وضعیت قرنطینه لغو و سیستم به حالت عادی بازگشت.", "success");
        loadData();
      } else {
        showToast(data.error || "خطا در تغییر وضعیت قرنطینه", "error");
      }
    } catch (err: unknown) {
      showToast(errorMessage(err) || "خطای ارتباط با سرور", "error");
    }
  };

  const handleSaveMaintenanceConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const ipsArray = mAdminIps
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_maintenance_config",
          headline: mHeadline,
          userMessage: mMessage,
          estimatedEndTime: mEta,
          whitelistedAdminIps: ipsArray,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("تنظیمات و پیام‌های عمومی حالت قرنطینه با موفقیت ذخیره گردید.", "success");
        loadData();
      } else {
        showToast(data.error || "خطا در ذخیره تنظیمات", "error");
      }
    } catch (err: unknown) {
      showToast(errorMessage(err) || "خطا در ذخیره تنظیمات", "error");
    }
  };

  const handleResetSeed = async () => {
    if (!confirm("آیا مایلید تمام داده‌های اتاق عملیات امنیت، نشست‌ها و قوانین فایروال به داده‌های پیش‌فرض آزمایشی بازنشانی شوند؟")) {
      return;
    }
    try {
      const res = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_seed" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        loadData();
      } else {
        showToast(data.error || "خطا در بازنشانی داده‌ها", "error");
      }
    } catch (err: unknown) {
      showToast(errorMessage(err) || "خطا در بازنشانی", "error");
    }
  };

  return (
    <div className={styles.container}>
      {/* Toast Alert */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            left: "24px",
            zIndex: 9999,
            backgroundColor: toast.type === "success" ? "#10b981" : "#ef4444",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "10px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            fontWeight: 700,
            fontSize: "0.9rem",
            direction: "rtl",
          }}
        >
          {toast.message}
        </div>
      )}

      {/* Header Card */}
      <div className={styles.headerCard}>
        <div className={styles.headerInfo}>
          <h2 className={styles.headerTitle}>
            <span>🛡️</span>
            اتاق عملیات امنیت، مانیتورینگ زنده کاربران و فایروال IP (Security Command)
          </h2>
          <p className={styles.headerDesc}>
            مرکز پایش بلادرنگ نشست‌های آنلاین کاربران، ابطال فوری توکن‌های نفوذ، فایروال لایه ۷ و کلید اضطراری قرنطینه پلتفرم.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnResetSeed} onClick={handleResetSeed} title="بازنشانی اطلاعات اولیه">
            <span>🔄</span>
            بازنشانی دیتای اولیه
          </button>
          <button className={styles.btnRefresh} onClick={loadData}>
            <span>⚡</span>
            به‌روزرسانی آنی
          </button>
        </div>
      </div>

      {/* Emergency Alert Banner when maintenance is active */}
      {maintenanceConfig?.isMaintenanceActive && (
        <div className={styles.maintenanceAlertBanner}>
          <div className={styles.maintenanceAlertContent}>
            <div className={styles.alertIcon}>🚨</div>
            <div className={styles.alertText}>
              <h4>حالت اضطراری قرنطینه و تعمیرات پلتفرم فعال است!</h4>
              <p>
                تمامی دسترسی‌های عمومی و دانشجویی به وبسایت قطع گردیده و تنها IPهای مجاز ادمین امکان دسترسی دارند.
              </p>
            </div>
          </div>
          <button className={styles.btnEndLockdown} onClick={() => handleToggleMaintenance(false)}>
            پایان قرنطینه و بازگشت به سرویس عادی
          </button>
        </div>
      )}

      {/* Stats Summary Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(59, 130, 246, 0.15)", color: "#38bdf8" }}>
            👥
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>نشست‌های فعال آنلاین</p>
            <p className={styles.statValue}>{stats?.totalActiveSessions ?? "..."}</p>
            <p className={styles.statSubtext}>دستگاه‌های متصل در لحظه</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(239, 68, 68, 0.15)", color: "#f87171" }}>
            ⚠️
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>نشست‌های مشکوک / پرخطر</p>
            <p className={styles.statValue} style={{ color: (stats?.suspiciousSessionsCount || 0) > 0 ? "#f87171" : "#34d399" }}>
              {stats?.suspiciousSessionsCount ?? "..."}
            </p>
            <p className={styles.statSubtext}>نیازمند اقدام و بازرسی</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24" }}>
            🧱
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>آدرس‌های مسدود در فایروال</p>
            <p className={styles.statValue}>{stats?.activeBlockedIps ?? "..."}</p>
            <p className={styles.statSubtext}>{stats?.whitelistedIpsCount ?? 0} آدرس در وایت‌لیست</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(168, 85, 247, 0.15)", color: "#c084fc" }}>
            🛡️
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>حملات خنثی‌شده امروز</p>
            <p className={styles.statValue}>{stats?.attacksBlockedToday ?? "..."}</p>
            <p className={styles.statSubtext}>میانگین Threat Score: {stats?.avgThreatScore ?? 0}%</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{
              background: maintenanceConfig?.isMaintenanceActive ? "rgba(239, 68, 68, 0.2)" : "rgba(16, 185, 129, 0.15)",
              color: maintenanceConfig?.isMaintenanceActive ? "#ef4444" : "#10b981",
            }}
          >
            {maintenanceConfig?.isMaintenanceActive ? "🔒" : "🟢"}
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>وضعیت امنیتی پلتفرم</p>
            <p
              className={styles.statValue}
              style={{
                fontSize: "1.1rem",
                color: maintenanceConfig?.isMaintenanceActive ? "#ef4444" : "#10b981",
              }}
            >
              {maintenanceConfig?.isMaintenanceActive ? "قرنطینه اضطراری" : "عادی و تحت حفاظت"}
            </p>
            <p className={styles.statSubtext}>
              {maintenanceConfig?.isMaintenanceActive ? "تعمیرات فعال" : "دسترسی آزاد دانشجویان"}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className={styles.tabsBar}>
        <button
          className={`${styles.tabBtn} ${activeTab === "sessions" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("sessions")}
        >
          <span>📡</span>
          مانیتورینگ نشست‌های فعال زنده
          <span className={styles.tabBadge}>{sessions.length}</span>
        </button>

        <button
          className={`${styles.tabBtn} ${activeTab === "firewall" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("firewall")}
        >
          <span>🧱</span>
          فایروال و مسدودسازی IP
          <span className={styles.tabBadge}>{rules.length}</span>
        </button>

        <button
          className={`${styles.tabBtn} ${activeTab === "maintenance" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("maintenance")}
        >
          <span>🚨</span>
          حالت اضطراری قرنطینه و تعمیرات پلتفرم
          {maintenanceConfig?.isMaintenanceActive && (
            <span style={{ backgroundColor: "#ef4444", color: "#fff", padding: "2px 8px", borderRadius: "10px", fontSize: "0.75rem", fontWeight: 800 }}>
              فعال
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: LIVE ACTIVE SESSIONS */}
      {activeTab === "sessions" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Filters */}
          <div className={styles.filterBar}>
            <input
              type="text"
              placeholder="جستجو بر اساس نام کاربر، ایمیل، IP، موقعیت مکانی، سیستم‌عامل..."
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className={styles.selectInput}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">همه نقش‌ها</option>
              <option value="student">دانش‌آموزان</option>
              <option value="teacher">اساتید</option>
              <option value="admin">مدیران ارشد</option>
            </select>

            <select
              className={styles.selectInput}
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
            >
              <option value="all">همه سطوح ریسک</option>
              <option value="low">عادی و امن</option>
              <option value="medium">ریسک متوسط</option>
              <option value="high">پرخطر (High Risk)</option>
              <option value="critical">بحرانی (Critical)</option>
            </select>
          </div>

          {/* Sessions Table */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>کاربر و مشخصات حساب</th>
                  <th>دستگاه و مرورگر</th>
                  <th>آدرس IP و موقعیت</th>
                  <th>مسیر جاری / آخرین فعالیت</th>
                  <th>سطح ریسک امنیتی</th>
                  <th>عملیات امنیتی</th>
                </tr>
              </thead>
              <tbody>
                {sessions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.emptyState}>
                      {loading ? "در حال دریافت لیست نشست‌های فعال..." : "هیچ نشستی با این مشخصات یافت نشد."}
                    </td>
                  </tr>
                ) : (
                  sessions.map((sess) => {
                    const riskMeta = SESSION_RISK_LABELS[sess.riskLevel] || SESSION_RISK_LABELS.low;
                    return (
                      <tr key={sess.id}>
                        <td>
                          <div className={styles.userInfoCell}>
                            <div className={styles.userName}>
                              {sess.userName}
                              {sess.isCurrentAdminSession && (
                                <span style={{ marginRight: "6px", fontSize: "0.75rem", color: "#38bdf8", fontWeight: 700 }}>
                                  (نشست جاری شما)
                                </span>
                              )}
                            </div>
                            <div className={styles.userSub}>{sess.userEmail}</div>
                            <div>
                              <span
                                className={`${styles.badge} ${
                                  sess.userRole === "admin"
                                    ? styles.badgeRoleAdmin
                                    : sess.userRole === "teacher"
                                    ? styles.badgeRoleTeacher
                                    : styles.badgeRoleStudent
                                }`}
                              >
                                {sess.userRole === "admin"
                                  ? "مدیر سیستم"
                                  : sess.userRole === "teacher"
                                  ? "مدرس"
                                  : "دانش‌آموز"}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className={styles.deviceInfoCell}>
                            <span className={styles.devicePrimary}>
                              💻 {sess.deviceOs}
                            </span>
                            <span className={styles.deviceSecondary}>
                              🌐 {sess.browser}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className={styles.userInfoCell}>
                            <span className={styles.ipCell}>{sess.ipAddress}</span>
                            <span className={styles.locationCell}>📍 {sess.location}</span>
                          </div>
                        </td>

                        <td>
                          <div className={styles.userInfoCell}>
                            <code style={{ fontSize: "0.8rem", color: "#a5b4fc", direction: "ltr", textAlign: "right" }}>
                              {sess.currentRoute}
                            </code>
                            <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                              ورود: {new Date(sess.loginAt).toLocaleTimeString("fa-IR")}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                            <span className={`${styles.badge} ${styles[riskMeta.badgeClass]}`}>
                              {riskMeta.fa}
                            </span>
                            {sess.riskReason && (
                              <span style={{ fontSize: "0.725rem", color: "#fca5a5", maxWidth: "200px" }}>
                                {sess.riskReason}
                              </span>
                            )}
                          </div>
                        </td>

                        <td>
                          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                            {!sess.isCurrentAdminSession && (
                              <>
                                <button
                                  className={styles.btnActionKill}
                                  onClick={() => handleKillSession(sess.id)}
                                  title="ابطال این نشست و خروج از حساب"
                                >
                                  ❌ ابطال نشست
                                </button>
                                <button
                                  className={styles.btnActionForceLogout}
                                  onClick={() => handleForceLogoutUser(sess.userId, sess.userName)}
                                  title="خروج از تمام دستگاه‌های دیگر"
                                >
                                  🚪 خروج کلی
                                </button>
                                <button
                                  className={styles.btnAddRule}
                                  style={{ padding: "0.45rem 0.75rem", fontSize: "0.775rem" }}
                                  onClick={() => handleOpenBlockModal(sess.ipAddress)}
                                  title="مسدودسازی IP در فایروال"
                                >
                                  🚫 مسدودسازی IP
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: IP FIREWALL & THREAT SHIELD */}
      {activeTab === "firewall" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Action Bar */}
          <div className={styles.filterBar}>
            <input
              type="text"
              placeholder="جستجو در قوانین فایروال (IP، علت مسدودی، ایجادکننده)..."
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className={styles.selectInput}
              value={ruleTypeFilter}
              onChange={(e) => setRuleTypeFilter(e.target.value)}
            >
              <option value="all">همه قوانین فایروال</option>
              <option value="blacklist">بلک‌لیست (مسدودشده‌ها)</option>
              <option value="whitelist">وایت‌لیست (آدرس‌های معتبر)</option>
              <option value="suspicious_flag">تحت پایش و بررسی</option>
            </select>

            <button className={styles.btnAddRule} onClick={() => handleOpenBlockModal()}>
              <span>🚫</span>
              مسدودسازی دستی آدرس IP
            </button>

            <button className={styles.btnAddWhitelist} onClick={() => setIsWhitelistModalOpen(true)}>
              <span>✅</span>
              افزودن به فهرست سفید (Whitelist)
            </button>
          </div>

          {/* Firewall Table */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>آدرس IP هدف</th>
                  <th>نوع قانون</th>
                  <th>امتیاز تهدید (Threat Score)</th>
                  <th>بردار حمله و علت</th>
                  <th>تلاش‌های ناموفق</th>
                  <th>مدت زمان / انقضا</th>
                  <th>ایجادکننده</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {rules.length === 0 ? (
                  <tr>
                    <td colSpan={8} className={styles.emptyState}>
                      {loading ? "در حال دریافت قوانین فایروال..." : "هیچ قانونی با این شرایط ثبت نشده است."}
                    </td>
                  </tr>
                ) : (
                  rules.map((rule) => {
                    const typeMeta = IP_RULE_TYPE_LABELS[rule.ruleType] || { fa: rule.ruleType, color: "#fff" };
                    const vectorFa = ATTACK_VECTOR_LABELS[rule.attackVector] || rule.attackVector;
                    const durationFa = DURATION_LABELS[rule.duration] || rule.duration;

                    let scoreClass = styles.threatScoreLow;
                    if (rule.threatScore >= 80) scoreClass = styles.threatScoreHigh;
                    else if (rule.threatScore >= 50) scoreClass = styles.threatScoreMed;

                    return (
                      <tr key={rule.id}>
                        <td>
                          <span className={styles.ipCell} style={{ fontSize: "0.95rem" }}>
                            {rule.ipAddress}
                          </span>
                        </td>

                        <td>
                          <span
                            className={styles.badge}
                            style={{
                              backgroundColor: `${typeMeta.color}22`,
                              color: typeMeta.color,
                              border: `1px solid ${typeMeta.color}44`,
                            }}
                          >
                            {typeMeta.fa}
                          </span>
                        </td>

                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span className={`${styles.threatScoreBadge} ${scoreClass}`}>
                              {rule.threatScore}
                            </span>
                            <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>از ۱۰۰</span>
                          </div>
                        </td>

                        <td>
                          <div className={styles.userInfoCell}>
                            <span style={{ fontWeight: 600, color: "#f3f4f6" }}>{vectorFa}</span>
                            <span style={{ fontSize: "0.775rem", color: "#94a3b8" }}>{rule.reason}</span>
                          </div>
                        </td>

                        <td>
                          <span style={{ fontWeight: 700, color: rule.failedAttemptsCount > 10 ? "#ef4444" : "#f3f4f6" }}>
                            {rule.failedAttemptsCount} مرتبه
                          </span>
                        </td>

                        <td>
                          <div className={styles.userInfoCell}>
                            <span style={{ fontWeight: 600 }}>{durationFa}</span>
                            <span style={{ fontSize: "0.725rem", color: "#6b7280" }}>
                              {rule.expiresAt ? new Date(rule.expiresAt).toLocaleDateString("fa-IR") : "بدون تاریخ انقضا"}
                            </span>
                          </div>
                        </td>

                        <td>
                          <span style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>{rule.createdBy}</span>
                        </td>

                        <td>
                          {rule.status === "active" && rule.ruleType === "blacklist" ? (
                            <button
                              className={styles.btnActionUnblock}
                              onClick={() => handleUnblock(rule.id, rule.ipAddress)}
                              title="لغو مسدودی آدرس از فایروال"
                            >
                              🔓 رفع مسدودیت
                            </button>
                          ) : (
                            <span style={{ fontSize: "0.8rem", color: "#10b981", fontWeight: 600 }}>
                              {rule.status === "lifted" ? "لغو شده" : "مجاز"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PLATFORM LOCKDOWN & MAINTENANCE */}
      {activeTab === "maintenance" && (
        <div className={styles.maintenanceGrid}>
          {/* Controls & Configuration */}
          <div className={styles.maintenanceCard}>
            <h3 className={styles.maintenanceCardTitle}>
              <span>🚨</span>
              کلید اضطراری قرنطینه و پیکربندی تعمیرات (Emergency Lockdown)
            </h3>
            <p className={styles.maintenanceCardDesc}>
              با فعال کردن این حالت، تمامی دسترسی‌های عمومی وبسایت بلافاصله به صفحه تعمیرات هدایت خواهند شد. ادمین‌های با IPهای سفید دسترسی بدون وقفه خواهند داشت.
            </p>

            {/* Toggle Switch */}
            <div className={styles.toggleSwitchContainer}>
              <div className={styles.toggleSwitchLabel}>
                <span className={styles.toggleSwitchTitle}>
                  {maintenanceConfig?.isMaintenanceActive ? "حالت قرنطینه فعال است (سایت مسدود)" : "پلتفرم در وضعیت عادی (فعال)"}
                </span>
                <span className={styles.toggleSwitchSubtitle}>
                  {maintenanceConfig?.isMaintenanceActive
                    ? "کاربران عادی صفحه تعمیرات را مشاهده می‌کنند."
                    : "کلیه کاربران به تمام دوره‌ها و صفحات دسترسی دارند."}
                </span>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={maintenanceConfig?.isMaintenanceActive ?? false}
                  onChange={(e) => handleToggleMaintenance(e.target.checked)}
                />
                <span className={styles.slider} />
              </label>
            </div>

            <form onSubmit={handleSaveMaintenanceConfig} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>عنوان پیام برای کاربران (Headline):</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={mHeadline}
                  onChange={(e) => setMHeadline(e.target.value)}
                  placeholder="مثال: به‌روزرسانی و ارتقای زیرساخت سرورها"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>متن کامل پیام اطلاع‌رسانی:</label>
                <textarea
                  className={styles.formTextarea}
                  value={mMessage}
                  onChange={(e) => setMMessage(e.target.value)}
                  placeholder="توضیحات و دلایل انجام عملیات نگهداری برای کاربران..."
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>زمان تخمینی پایان تعمیرات (ETA):</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={mEta}
                  onChange={(e) => setMEta(e.target.value)}
                  placeholder="مثال: تا ۲۰ دقیقه دیگر یا ساعت ۱۴:۰۰"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>فهرست آدرس‌های IP مجاز ادمین (Admin IP Whitelist Bypass):</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={mAdminIps}
                  onChange={(e) => setMAdminIps(e.target.value)}
                  placeholder="آدرس‌های IP را با ویرگول جدا کنید (مثال: 127.0.0.1, 5.200.14.88)"
                />
                <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                  این آدرس‌ها هنگام فعال بودن قرنطینه، به تمامی بخش‌ها و پنل مدیریت دسترسی کامل دارند.
                </span>
              </div>

              <button
                type="submit"
                className={styles.btnRefresh}
                style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}
              >
                <span>💾</span>
                ذخیره تنظیمات و پیام تعمیرات
              </button>
            </form>
          </div>

          {/* Live Preview of User-Facing Screen */}
          <div className={styles.maintenanceCard}>
            <h3 className={styles.maintenanceCardTitle}>
              <span>👁️</span>
              پیش‌نمایش زنده صفحه نمایش‌داده‌شده به کاربران (Live User Preview)
            </h3>
            <p className={styles.maintenanceCardDesc}>
              کاربران غیر ادمین در صورت فعال بودن کلید قرنطینه با نمای زیر مواجه خواهند شد:
            </p>

            <div className={styles.previewContainer}>
              <span className={styles.previewBadge}>Endoora Platform Status</span>
              <div className={styles.previewIcon}>⏳</div>
              <h2 className={styles.previewTitle}>{mHeadline || "به‌روزرسانی و نگهداری سرورها"}</h2>
              <p className={styles.previewBody}>
                {mMessage || "پلتفرم هم‌اکنون در حال ارتقا و بهینه‌سازی دیتابیس است."}
              </p>
              <div className={styles.previewEta}>
                ⏱️ زمان تقریبی بازگشت به سرویس: {mEta || "به‌زودی"}
              </div>
              <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                سامانه آموزش هوشمند زبان انگلیسی ایندورا (Endoora)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BLOCK IP */}
      {isBlockModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsBlockModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <span>🚫</span>
                مسدودسازی آدرس IP در فایروال
              </h3>
              <button className={styles.modalCloseBtn} onClick={() => setIsBlockModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitBlock}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>آدرس IP مقصد:</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={blockIpAddress}
                    onChange={(e) => setBlockIpAddress(e.target.value)}
                    placeholder="مثال: 194.26.29.130"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>بردار حمله یا دلیل مسدودسازی:</label>
                  <select
                    className={styles.selectInput}
                    value={blockVector}
                    onChange={(e) => setBlockVector(e.target.value as AttackVectorType)}
                  >
                    <option value="manual_admin_ban">مسدودسازی دستی توسط مدیر ارشد</option>
                    <option value="brute_force_login">حمله حدس مکرر رمز عبور (Brute Force)</option>
                    <option value="credential_stuffing">تلاش با اطلاعات درزیافته (Credential Stuffing)</option>
                    <option value="rate_limit_exceeded">تخطی از سقف درخواست‌ها (DDoS Pattern)</option>
                    <option value="sql_injection_attempt">تلاش تزریق کد مخرب (SQL Injection)</option>
                    <option value="malicious_crawler">خزش مخرب و اسکرپ غیرمجاز (Bad Bot)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>توضیحات تکمیلی / مستندات تخلف:</label>
                  <textarea
                    className={styles.formTextarea}
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    placeholder="علت مسدودسازی را بنویسید..."
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>مدت زمان مسدودسازی در فایروال:</label>
                  <select
                    className={styles.selectInput}
                    value={blockDuration}
                    onChange={(e) => setBlockDuration(e.target.value as typeof blockDuration)}
                  >
                    <option value="24_hours">۲۴ ساعت</option>
                    <option value="7_days">۷ روز</option>
                    <option value="permanent">دائمی (تا لغو دستی توسط ادمین)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>امتیاز تهدید (Threat Score از ۱ تا ۱۰۰):</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    className={styles.formInput}
                    value={blockScore}
                    onChange={(e) => setBlockScore(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.btnModalCancel} onClick={() => setIsBlockModalOpen(false)}>
                  انصراف
                </button>
                <button type="submit" className={styles.btnModalSubmit}>
                  اعمال مسدودسازی در فایروال
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: WHITELIST IP */}
      {isWhitelistModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsWhitelistModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <span>✅</span>
                افزودن آدرس معتبر به فهرست سفید (Whitelist)
              </h3>
              <button className={styles.modalCloseBtn} onClick={() => setIsWhitelistModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitWhitelist}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>آدرس IP مجاز:</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={whitelistIpAddress}
                    onChange={(e) => setWhitelistIpAddress(e.target.value)}
                    placeholder="مثال: 5.200.14.88"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>علت یا مالک آدرس:</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={whitelistReason}
                    onChange={(e) => setWhitelistReason(e.target.value)}
                    placeholder="مثال: اینترنت دفتر مرکزی تهران / مدیر فنی"
                    required
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.btnModalCancel} onClick={() => setIsWhitelistModalOpen(false)}>
                  انصراف
                </button>
                <button type="submit" className={styles.btnAddWhitelist}>
                  تأیید و افزودن به وایت‌لیست
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
