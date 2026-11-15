"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import styles from "./admin-users.module.css";
import {
  type AdminUser360Record,
  type UserOperationsStats,
  type UserRole,
  type CEFRLevel,
  AVAILABLE_COURSES_CATALOG,
  STRIKE_REASON_PRESETS,
  INITIAL_USERS_360,
} from "@/lib/admin-users-content";

export function AdminUsersManager() {
  const [users, setUsers] = useState<AdminUser360Record[]>(INITIAL_USERS_360);
  const [stats, setStats] = useState<UserOperationsStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [toast, setToast] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // 360 Dossier Modal State
  const [selectedUser, setSelectedUser] = useState<AdminUser360Record | null>(null);
  const [activeDossierTab, setActiveDossierTab] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Quick Role Edit Modal State
  const [editRoleModalUser, setEditRoleModalUser] = useState<AdminUser360Record | null>(null);
  const [newRole, setNewRole] = useState<UserRole>("learner");

  // Tab 1: Level override
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>("B1");

  // Tab 2: Grant course
  const [grantCourseId, setGrantCourseId] = useState<string>(AVAILABLE_COURSES_CATALOG[0]?.id || "");

  // Tab 4: Wallet adjustment form
  const [walletAmountToman, setWalletAmountToman] = useState<number>(100000);
  const [walletAdjustmentType, setWalletAdjustmentType] = useState<"credit" | "debit">("credit");
  const [walletReasonCategory, setWalletReasonCategory] = useState<
    "compensation" | "loyalty_gift" | "refund" | "accounting_adjustment"
  >("loyalty_gift");
  const [walletAdminNote, setWalletAdminNote] = useState<string>("");

  // Tab 5: Issue strike form
  const [newStrikePreset, setNewStrikePreset] = useState<string>(STRIKE_REASON_PRESETS[0]?.labelFa || "");
  const [newStrikeDetail, setNewStrikeDetail] = useState<string>("");

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setUsers(json.users);
          setStats(json.stats);
        }
      }
    } catch {
      // In-memory fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleResetSeed = async () => {
    if (!confirm("آیا از بازنشانی داده‌های کاربران به مقادیر پیش‌فرض کارخانه اطمینان دارید؟")) {
      return;
    }
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_seed" }),
      });
      const json = await res.json();
      if (json.success) {
        setUsers(json.users);
        setStats(json.stats);
        showToast("فهرست کاربران با موفقیت بازنشانی شد.");
      }
    } catch {
      showToast("خطا در بازنشانی داده‌ها", "error");
    }
  };

  const handleOpenDossier = (user: AdminUser360Record, tab: 1 | 2 | 3 | 4 | 5 = 1) => {
    setSelectedUser(user);
    setActiveDossierTab(tab);
    setSelectedLevel(user.learningLevel);
    setWalletAdminNote("");
    setNewStrikeDetail("");
  };

  const handleCloseDossier = () => {
    setSelectedUser(null);
  };

  const handleToggleActive = async (userId: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_active", userId }),
      });
      const json = await res.json();
      if (json.success) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? json.user : u)));
        if (selectedUser?.id === userId) setSelectedUser(json.user);
        if (json.stats) setStats(json.stats);
        showToast(json.message);
      } else {
        showToast(json.error || "خطا در تغییر وضعیت حساب", "error");
      }
    } catch {
      showToast("خطا در برقراری ارتباط با سرور", "error");
    }
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRoleModalUser) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_role", userId: editRoleModalUser.id, role: newRole }),
      });
      const json = await res.json();
      if (json.success) {
        setUsers((prev) => prev.map((u) => (u.id === editRoleModalUser.id ? json.user : u)));
        if (selectedUser?.id === editRoleModalUser.id) setSelectedUser(json.user);
        showToast(json.message);
        setEditRoleModalUser(null);
      } else {
        showToast(json.error || "خطا در تغییر نقش", "error");
      }
    } catch {
      showToast("خطا در تغییر نقش", "error");
    }
  };

  const handleSaveLevel = async () => {
    if (!selectedUser) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_level", userId: selectedUser.id, level: selectedLevel }),
      });
      const json = await res.json();
      if (json.success) {
        setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? json.user : u)));
        setSelectedUser(json.user);
        showToast(json.message);
      } else {
        showToast(json.error || "خطا در تغییر سطح", "error");
      }
    } catch {
      showToast("خطا در تغییر سطح", "error");
    }
  };

  const handleGrantCourse = async () => {
    if (!selectedUser || !grantCourseId) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "grant_course", userId: selectedUser.id, courseId: grantCourseId }),
      });
      const json = await res.json();
      if (json.success) {
        setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? json.user : u)));
        setSelectedUser(json.user);
        showToast(json.message);
      } else {
        showToast(json.error || "خطا در ثبت‌نام دوره", "error");
      }
    } catch {
      showToast("خطا در ثبت‌نام دوره", "error");
    }
  };

  const handleResetQuiz = async (courseId: string) => {
    if (!selectedUser) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_quiz", userId: selectedUser.id, courseId }),
      });
      const json = await res.json();
      if (json.success) {
        setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? json.user : u)));
        setSelectedUser(json.user);
        showToast(json.message);
      }
    } catch {
      showToast("خطا در بازنشانی آزمون", "error");
    }
  };

  const handleAdjustWalletSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    if (!walletAdminNote.trim()) {
      alert("ثبت یادداشت و دلیل ممیزی الزامی است.");
      return;
    }

    const finalAmount = walletAdjustmentType === "credit" ? Math.abs(walletAmountToman) : -Math.abs(walletAmountToman);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "adjust_wallet",
          userId: selectedUser.id,
          amountToman: finalAmount,
          reasonCategory: walletReasonCategory,
          adminNote: walletAdminNote,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? json.user : u)));
        setSelectedUser(json.user);
        if (json.stats) setStats(json.stats);
        showToast(json.message);
        setWalletAdminNote("");
      } else {
        showToast(json.error || "خطا در تغییر موجودی", "error");
      }
    } catch {
      showToast("خطا در ثبت تراکنش", "error");
    }
  };

  const handleIssueStrikeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    if (!newStrikeDetail.trim()) {
      alert("لطفاً شرح دقیق تخلف را یادداشت نمایید.");
      return;
    }

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "issue_strike",
          userId: selectedUser.id,
          reasonPreset: newStrikePreset,
          detailMessage: newStrikeDetail,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? json.user : u)));
        setSelectedUser(json.user);
        if (json.stats) setStats(json.stats);
        showToast(json.message);
        setNewStrikeDetail("");
      } else {
        showToast(json.error || "خطا در ثبت اخطار", "error");
      }
    } catch {
      showToast("خطا در ثبت اخطار انضباطی", "error");
    }
  };

  const handlePardonStrike = async (strikeId: string) => {
    if (!selectedUser) return;
    const pardonReason = prompt("لطفاً دلیل بخشش یا لغو اخطار را وارد نمایید:") || "بخشش توسط مدیریت پلتفرم";
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "pardon_strike",
          userId: selectedUser.id,
          strikeId,
          pardonReason,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? json.user : u)));
        setSelectedUser(json.user);
        if (json.stats) setStats(json.stats);
        showToast(json.message);
      } else {
        showToast(json.error || "خطا در بخشش اخطار", "error");
      }
    } catch {
      showToast("خطا در بخشش اخطار", "error");
    }
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        (u.nationalId && u.nationalId.includes(q)) ||
        (u.city && u.city.toLowerCase().includes(q));

      const matchesRole = roleFilter === "all" || u.role === roleFilter;

      let matchesStatus = true;
      if (statusFilter === "active") matchesStatus = u.isActive;
      else if (statusFilter === "banned") matchesStatus = !u.isActive;
      else if (statusFilter === "has_strikes") matchesStatus = u.warningStrikes.some((s) => s.isActive);
      else if (statusFilter === "premium")
        matchesStatus = u.subscriptionTier === "pro_vip" || u.subscriptionTier === "plus";

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalUsers = stats?.totalUsers ?? users.length;
  const activeLearners = stats?.activeLearners ?? users.filter((u) => u.role === "learner" && u.isActive).length;
  const proVipCount = stats?.proVipSubscribers ?? users.filter((u) => u.subscriptionTier === "pro_vip").length;
  const usersWithStrikes =
    stats?.usersWithActiveStrikes ?? users.filter((u) => u.warningStrikes.some((s) => s.isActive)).length;
  const totalWalletSum = stats?.totalWalletBalancesToman ?? users.reduce((acc, u) => acc + (u.walletBalanceToman || 0), 0);

  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case "administrator":
        return styles.roleAdmin;
      case "teacher":
        return styles.roleTeacher;
      case "editor":
        return styles.roleEditor;
      case "support":
        return styles.roleSupport;
      default:
        return styles.roleLearner;
    }
  };

  const getRoleLabelFa = (role: UserRole) => {
    switch (role) {
      case "administrator":
        return "👑 مدیر ارشد";
      case "teacher":
        return "🧑‍🏫 مدرس";
      case "editor":
        return "✍️ ویرایشگر";
      case "support":
        return "🎧 پشتیبانی";
      default:
        return "🎒 زبان‌آموز";
    }
  };

  return (
    <div className={styles.container} dir="rtl">
      {/* Toast Alert */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: toast.type === "success" ? "#16a34a" : "#dc2626",
            color: "#ffffff",
            padding: "0.75rem 1.5rem",
            borderRadius: "10px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            zIndex: 9999,
            fontWeight: 700,
            fontSize: "0.9rem",
          }}
        >
          {toast.text}
        </div>
      )}

      {/* 1. Header Card */}
      <div className={styles.headerCard}>
        <div className={styles.headerInfo}>
          <h2 className={styles.headerTitle}>
            <span>👥</span>
            <span>سامانه عملیات کاربران و پرونده ۳۶۰ درجه زبان‌آموزان</span>
          </h2>
          <p className={styles.headerDesc}>
            مدیریت نقش‌های دسترسی، بازرسی سوابق آموزشی و پیشرفت دوره‌ها، شارژ و کسر مستقیم کیف پول با ثبت ممیزی، و
            اعمال سیاست ۳ اخطاره انضباطی
          </p>
        </div>
        <div>
          <button type="button" className={styles.btnResetSeed} onClick={handleResetSeed} title="بازنشانی داده‌های تستی">
            <span>🔄 بازنشانی داده‌های نمونه</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiTitle}>کل کاربران ثبت‌شده</span>
            <span className={styles.kpiIcon}>👥</span>
          </div>
          <div className={styles.kpiValue}>{totalUsers}</div>
          <div className={styles.kpiSub}>حساب‌های کاربری پلتفرم</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiTitle}>زبان‌آموزان فعال</span>
            <span className={styles.kpiIcon}>🎒</span>
          </div>
          <div className={styles.kpiValue} style={{ color: "#16a34a" }}>
            {activeLearners}
          </div>
          <div className={styles.kpiSub}>در حال مطالعه دوره‌ها و رزرو کلاس</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiTitle}>مشترکین Pro و VIP</span>
            <span className={styles.kpiIcon}>⭐</span>
          </div>
          <div className={styles.kpiValue} style={{ color: "#d97706" }}>
            {proVipCount}
          </div>
          <div className={styles.kpiSub}>دارای دسترسی نامحدود به ابزارها</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiTitle}>کاربران دارای اخطار</span>
            <span className={styles.kpiIcon}>⚠️</span>
          </div>
          <div className={styles.kpiValue} style={{ color: "#dc2626" }}>
            {usersWithStrikes}
          </div>
          <div className={styles.kpiSub}>
            {usersWithStrikes > 0 ? (
              <span className={styles.pulseWarningBadge}>نیازمند نظارت انضباطی</span>
            ) : (
              <span>بدون تخلف فعال</span>
            )}
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiTitle}>مجموع موجودی کیف‌پول‌ها</span>
            <span className={styles.kpiIcon}>💳</span>
          </div>
          <div className={styles.kpiValue} style={{ fontSize: "1.4rem", color: "#4f46e5" }}>
            {totalWalletSum.toLocaleString("fa-IR")} ت
          </div>
          <div className={styles.kpiSub}>اعتبار ریالی آماده مصرف زبان‌آموزان</div>
        </div>
      </div>

      {/* 3. Toolbar & Filters */}
      <div className={styles.toolbarCard}>
        <div className={styles.searchRow}>
          <div className={styles.searchInputWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="جستجو بر اساس نام کاربر، ایمیل، شماره تماس، کد ملی یا شهر..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className={styles.select}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            aria-label="فیلتر بر اساس نقش کاربری"
          >
            <option value="all">همه نقش‌های کاربری</option>
            <option value="learner">🎒 زبان‌آموزان</option>
            <option value="teacher">🧑‍🏫 اساتید و مدرسان</option>
            <option value="editor">✍️ ویرایشگران محتوا</option>
            <option value="support">🎧 کارشناسان پشتیبانی</option>
            <option value="administrator">👑 مدیران ارشد</option>
          </select>
        </div>

        {/* Status Tabs Row */}
        <div className={styles.statusTabsRow}>
          {[
            { key: "all", label: "همه کاربران", count: users.length },
            { key: "active", label: "کاربران فعال", count: users.filter((u) => u.isActive).length },
            { key: "banned", label: "مسدود شده", count: users.filter((u) => !u.isActive).length },
            {
              key: "has_strikes",
              label: "دارای اخطار انضباطی",
              count: users.filter((u) => u.warningStrikes.some((s) => s.isActive)).length,
            },
            {
              key: "premium",
              label: "پلن‌های ویژه (Plus / Pro)",
              count: users.filter((u) => u.subscriptionTier === "pro_vip" || u.subscriptionTier === "plus").length,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`${styles.statusTabBtn} ${statusFilter === tab.key ? styles.statusTabBtnActive : ""}`}
              onClick={() => setStatusFilter(tab.key)}
            >
              <span>{tab.label}</span>
              <span className={styles.tabCountBadge}>{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Users Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>مشخصات کاربر</th>
                <th>اطلاعات تماس</th>
                <th>نقش و دسترسی</th>
                <th>وضعیت حساب</th>
                <th>سطح CEFR و پلن</th>
                <th>موجودی و اخطارها</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                    هیچ کاربری با فیلترهای انتخابی یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const activeStrikes = u.warningStrikes.filter((s) => s.isActive).length;
                  return (
                    <tr key={u.id} className={styles.tableRow}>
                      {/* User Cell */}
                      <td>
                        <div className={styles.userCell}>
                          {u.avatarUrl ? (
                            <Image
                              src={u.avatarUrl}
                              alt={u.name}
                              width={44}
                              height={44}
                              className={styles.userAvatar}
                              unoptimized
                            />
                          ) : (
                            <div className={styles.userAvatarFallback}>{u.name.charAt(0)}</div>
                          )}
                          <div>
                            <span className={styles.userName}>{u.name}</span>
                            <div className={styles.userSub}>
                              <span>📍 {u.city || "تهران"}</span>
                              <span>•</span>
                              <span>عضویت: {new Date(u.createdAt).toLocaleDateString("fa-IR")}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td>
                        <div style={{ fontWeight: 600, color: "#0f172a" }}>{u.email}</div>
                        <div style={{ fontSize: "0.78rem", color: "#64748b" }} dir="ltr">
                          {u.phone}
                        </div>
                      </td>

                      {/* Role */}
                      <td>
                        <span className={`${styles.roleBadge} ${getRoleBadgeClass(u.role)}`}>
                          {getRoleLabelFa(u.role)}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        {u.isActive ? (
                          <span style={{ color: "#16a34a", fontWeight: 700, fontSize: "0.8rem" }}>● فعال</span>
                        ) : (
                          <span style={{ color: "#dc2626", fontWeight: 700, fontSize: "0.8rem" }}>● مسدود</span>
                        )}
                      </td>

                      {/* CEFR & Subscription */}
                      <td>
                        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                          <span className={styles.cefrBadge}>{u.learningLevel}</span>
                          <span
                            className={
                              u.subscriptionTier === "pro_vip"
                                ? styles.tierPillPro
                                : u.subscriptionTier === "plus"
                                ? styles.tierPillPlus
                                : styles.tierPillFree
                            }
                          >
                            {u.subscriptionTier === "pro_vip"
                              ? "👑 VIP"
                              : u.subscriptionTier === "plus"
                              ? "⚡ Plus"
                              : "رایگان"}
                          </span>
                        </div>
                      </td>

                      {/* Wallet & Strikes */}
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                          <span style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.85rem" }}>
                            {u.walletBalanceToman.toLocaleString("fa-IR")} ت
                          </span>
                          {activeStrikes > 0 ? (
                            <span className={`${styles.strikesPill} ${styles.strikesPillActive}`}>
                              🔴 {activeStrikes} اخطار فعال
                            </span>
                          ) : (
                            <span className={styles.strikesPillClean}>بدون اخطار</span>
                          )}
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td>
                        <div className={styles.actionsCell}>
                          <button
                            type="button"
                            className={styles.btnDossier}
                            onClick={() => handleOpenDossier(u, 1)}
                            title="مشاهده پرونده کامل ۳۶۰ درجه"
                          >
                            <span>📋</span>
                            <span>پرونده ۳۶۰</span>
                          </button>

                          <button
                            type="button"
                            className={styles.btnActionIcon}
                            onClick={() => {
                              setEditRoleModalUser(u);
                              setNewRole(u.role);
                            }}
                            title="تغییر نقش دسترسی"
                          >
                            <span>🔄</span>
                          </button>

                          <button
                            type="button"
                            className={u.isActive ? styles.btnDangerToggle : styles.btnActivateToggle}
                            onClick={() => handleToggleActive(u.id)}
                            title={u.isActive ? "مسدودسازی حساب" : "فعال‌سازی حساب"}
                          >
                            {u.isActive ? "مسدود" : "فعال"}
                          </button>
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

      {/* 5. Full 5-Tab 360 Dossier Modal */}
      {selectedUser && (
        <div className={styles.modalBackdrop} onClick={handleCloseDossier}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <div className={styles.modalUserTitle}>
                {selectedUser.avatarUrl ? (
                  <Image
                    src={selectedUser.avatarUrl}
                    alt={selectedUser.name}
                    width={52}
                    height={52}
                    className={styles.modalAvatar}
                    unoptimized
                  />
                ) : (
                  <div className={styles.userAvatarFallback}>{selectedUser.name.charAt(0)}</div>
                )}
                <div>
                  <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.15rem", fontWeight: 800, color: "#0f172a" }}>
                    پرونده جامع ۳۶۰ درجه: {selectedUser.name}
                  </h3>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <span className={`${styles.roleBadge} ${getRoleBadgeClass(selectedUser.role)}`}>
                      {getRoleLabelFa(selectedUser.role)}
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                      ایمیل: {selectedUser.email} | تماس: {selectedUser.phone}
                    </span>
                  </div>
                </div>
              </div>

              <button type="button" className={styles.modalCloseBtn} onClick={handleCloseDossier} title="بستن پرونده">
                ✕
              </button>
            </div>

            {/* Stepper Navigation */}
            <div className={styles.stepperNav}>
              <button
                type="button"
                className={`${styles.stepTab} ${activeDossierTab === 1 ? styles.stepTabActive : ""}`}
                onClick={() => setActiveDossierTab(1)}
              >
                <span className={styles.stepNumberBadge}>۱</span>
                <span>مشخصات و سطح CEFR</span>
              </button>

              <button
                type="button"
                className={`${styles.stepTab} ${activeDossierTab === 2 ? styles.stepTabActive : ""}`}
                onClick={() => setActiveDossierTab(2)}
              >
                <span className={styles.stepNumberBadge}>۲</span>
                <span>دوره‌ها و پیشرفت تحصیلی ({selectedUser.enrolledCourses?.length || 0})</span>
              </button>

              <button
                type="button"
                className={`${styles.stepTab} ${activeDossierTab === 3 ? styles.stepTabActive : ""}`}
                onClick={() => setActiveDossierTab(3)}
              >
                <span className={styles.stepNumberBadge}>۳</span>
                <span>جلسات و حضور و غیاب ({selectedUser.sessionHistory?.length || 0})</span>
              </button>

              <button
                type="button"
                className={`${styles.stepTab} ${activeDossierTab === 4 ? styles.stepTabActive : ""}`}
                onClick={() => setActiveDossierTab(4)}
              >
                <span className={styles.stepNumberBadge}>۴</span>
                <span>کیف پول و تراکنش‌ها ({selectedUser.walletBalanceToman.toLocaleString("fa-IR")} ت)</span>
              </button>

              <button
                type="button"
                className={`${styles.stepTab} ${activeDossierTab === 5 ? styles.stepTabActive : ""}`}
                onClick={() => setActiveDossierTab(5)}
              >
                <span className={styles.stepNumberBadge}>۵</span>
                <span>انضباط و اخطارها ({selectedUser.warningStrikes?.filter((s) => s.isActive).length || 0})</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className={styles.modalBody}>
              {/* TAB 1: IDENTITY & CEFR */}
              {activeDossierTab === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>
                    👤 مشخصات هویتی و تنظیمات پروفایل
                  </h4>

                  <div className={styles.dossierGrid}>
                    <div className={styles.dossierField}>
                      <span className={styles.dossierLabel}>نام و نام خانوادگی</span>
                      <span className={styles.dossierValue}>{selectedUser.name}</span>
                    </div>

                    <div className={styles.dossierField}>
                      <span className={styles.dossierLabel}>پست الکترونیک (ایمیل)</span>
                      <span className={styles.dossierValue} dir="ltr" style={{ textAlign: "right" }}>
                        {selectedUser.email}
                      </span>
                    </div>

                    <div className={styles.dossierField}>
                      <span className={styles.dossierLabel}>شماره تماس همراه</span>
                      <span className={styles.dossierValue} dir="ltr" style={{ textAlign: "right" }}>
                        {selectedUser.phone}
                      </span>
                    </div>

                    <div className={styles.dossierField}>
                      <span className={styles.dossierLabel}>کد ملی</span>
                      <span className={styles.dossierValue}>{selectedUser.nationalId || "ثبت نشده"}</span>
                    </div>

                    <div className={styles.dossierField}>
                      <span className={styles.dossierLabel}>شهر محل سکونت</span>
                      <span className={styles.dossierValue}>{selectedUser.city || "تهران"}</span>
                    </div>

                    <div className={styles.dossierField}>
                      <span className={styles.dossierLabel}>پلن فعال اشتراک</span>
                      <span className={styles.dossierValue} style={{ color: "#d97706" }}>
                        {selectedUser.subscriptionTier === "pro_vip"
                          ? "👑 Pro VIP"
                          : selectedUser.subscriptionTier === "plus"
                          ? "⚡ Plus"
                          : "رایگان"}
                      </span>
                    </div>
                  </div>

                  {/* CEFR Level Override Box */}
                  <div
                    style={{
                      background: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      borderRadius: "12px",
                      padding: "1.25rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                    }}
                  >
                    <span style={{ fontWeight: 800, color: "#166534", fontSize: "0.95rem" }}>
                      🎯 تعیین و تغییر دستی سطح زبان‌آموز بر اساس استاندارد CEFR:
                    </span>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#15803d" }}>
                      سطح فعلی کاربر: <strong>{selectedUser.learningLevel}</strong>. تغییر سطح باعث تطابق خودکار
                      پیش‌نیاز دوره‌ها و آزمون‌های تمرین تا ۲۰ با توانایی زبان‌آموز می‌شود.
                    </p>

                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                      <select
                        className={styles.select}
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value as CEFRLevel)}
                      >
                        <option value="A1">A1 - مبتدی (Elementary)</option>
                        <option value="A2">A2 - پیش‌متوسطه (Pre-Intermediate)</option>
                        <option value="B1">B1 - متوسطه (Intermediate)</option>
                        <option value="B2">B2 - فوق‌متوسطه (Upper-Intermediate)</option>
                        <option value="C1">C1 - پیشرفته (Advanced)</option>
                        <option value="C2">C2 - تسلط کامل نیتیو (Proficiency)</option>
                      </select>

                      <button
                        type="button"
                        className={styles.btnDossier}
                        onClick={handleSaveLevel}
                        style={{ padding: "0.65rem 1.25rem" }}
                      >
                        ذخیره سطح جدید
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ACADEMICS & ENROLLED COURSES */}
              {activeDossierTab === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>
                      📚 دوره‌های ثبت‌نامی و پیشرفت آموزشی
                    </h4>
                  </div>

                  {/* Manual Course Grant Card */}
                  <div
                    style={{
                      background: "#f8fafc",
                      border: "1px dashed #cbd5e1",
                      borderRadius: "12px",
                      padding: "1rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "0.75rem",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0f172a", display: "block" }}>
                        🎁 اعطای مستقیم دسترسی به دوره (Manual Course Grant):
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                        اعطای دسترسی رایگان یا بورسیه به دوره‌های پولی بدون نیاز به تراکنش بانکی
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <select
                        className={styles.select}
                        value={grantCourseId}
                        onChange={(e) => setGrantCourseId(e.target.value)}
                        style={{ minWidth: "260px" }}
                      >
                        {AVAILABLE_COURSES_CATALOG.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>

                      <button type="button" className={styles.btnDossier} onClick={handleGrantCourse}>
                        + ثبت‌نام کاربر در دوره
                      </button>
                    </div>
                  </div>

                  {/* Enrolled Courses List */}
                  {selectedUser.enrolledCourses && selectedUser.enrolledCourses.length > 0 ? (
                    <div className={styles.coursesList}>
                      {selectedUser.enrolledCourses.map((crs) => (
                        <div key={crs.id} className={styles.courseCard}>
                          <div className={styles.courseCardTop}>
                            <div>
                              <span className={styles.courseCardTitle}>{crs.courseTitle}</span>
                              <span style={{ fontSize: "0.75rem", color: "#64748b", marginRight: "0.5rem" }}>
                                ({crs.category})
                              </span>
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                              {crs.certificateEarned && (
                                <span style={{ color: "#16a34a", fontSize: "0.75rem", fontWeight: 700 }}>
                                  📜 گواهی صادر شد
                                </span>
                              )}
                              <button
                                type="button"
                                className={styles.btnActionIcon}
                                onClick={() => handleResetQuiz(crs.id)}
                                title="بازنشانی دفعات شرکت در آزمون این دوره"
                              >
                                🔄 بازنشانی کوییزها
                              </button>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.3rem" }}>
                              <span>
                                {crs.completedLessons} از {crs.totalLessons} جلسه تکمیل شده
                              </span>
                              <span style={{ fontWeight: 800, color: "#16a34a" }}>{crs.progressPercent}٪</span>
                            </div>
                            <div className={styles.progressBarContainer}>
                              <div className={styles.progressBarFill} style={{ width: `${crs.progressPercent}%` }} />
                            </div>
                          </div>

                          <div style={{ display: "flex", gap: "1rem", fontSize: "0.75rem", color: "#64748b" }}>
                            <span>تاریخ ثبت‌نام: {new Date(crs.enrolledAt).toLocaleDateString("fa-IR")}</span>
                            <span>•</span>
                            <span>میانگین نمرات آزمون‌ها: {crs.quizScoreAverage || 0} از ۲۰</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>
                      کاربر در حال حاضر در هیچ دوره‌ای ثبت‌نام نکرده است.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SESSIONS & ATTENDANCE */}
              {activeDossierTab === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>
                    🗓️ سوابق حضور و غیاب در کلاس‌های خصوصی اساتید
                  </h4>

                  {selectedUser.sessionHistory && selectedUser.sessionHistory.length > 0 ? (
                    <div className={styles.sessionsList}>
                      {selectedUser.sessionHistory.map((ses) => (
                        <div key={ses.id} className={styles.sessionCard}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                              <span style={{ fontWeight: 700, color: "#0f172a" }}>{ses.topic}</span>
                              <span style={{ fontSize: "0.8rem", color: "#4f46e5" }}>({ses.teacherName})</span>
                            </div>
                            <div>
                              {ses.status === "attended" ? (
                                <span style={{ color: "#16a34a", fontWeight: 700, fontSize: "0.8rem" }}>
                                  ✅ حضور یافته ({ses.durationMinutes} دقیقه)
                                </span>
                              ) : ses.status === "no_show" ? (
                                <span style={{ color: "#dc2626", fontWeight: 700, fontSize: "0.8rem" }}>
                                  ❌ غیبت بدون اطلاع
                                </span>
                              ) : (
                                <span style={{ color: "#d97706", fontWeight: 700, fontSize: "0.8rem" }}>
                                  ⚠️ لغو شده توسط زبان‌آموز
                                </span>
                              )}
                            </div>
                          </div>

                          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                            تاریخ برگزاری: {new Date(ses.date).toLocaleDateString("fa-IR")}
                            {ses.teacherRating && (
                              <span style={{ marginRight: "1rem" }}>
                                امتیاز ارزیابی استاد: {ses.teacherRating} از ۵ ⭐
                              </span>
                            )}
                          </div>

                          {ses.teacherFeedback && (
                            <div className={styles.sessionFeedback}>
                              <strong>یادداشت بازخورد مدرس:</strong> {ses.teacherFeedback}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>
                      هیچ سابقه کلاسی برای این کاربر ثبت نشده است.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: WALLET & DIRECT ADJUSTMENT */}
              {activeDossierTab === 4 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {/* Balance Banner */}
                  <div className={styles.walletBanner}>
                    <div>
                      <span style={{ fontSize: "0.85rem", opacity: 0.8, display: "block" }}>
                        موجودی نقدی قابل مصرف کیف پول
                      </span>
                      <span style={{ fontSize: "2rem", fontWeight: 900 }}>
                        {selectedUser.walletBalanceToman.toLocaleString("fa-IR")} تومان
                      </span>
                    </div>

                    <div style={{ fontSize: "0.8rem", opacity: 0.85 }}>
                      شناسه کیف‌پول: <code>wlt-{selectedUser.id}</code>
                    </div>
                  </div>

                  {/* Direct Adjustment Form */}
                  <div className={styles.walletAdjustCard}>
                    <h5 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#0f172a" }}>
                      ⚡ شارژ یا کسر مستقیم اعتبار کیف پول (Direct Admin Ledger)
                    </h5>

                    <form onSubmit={handleAdjustWalletSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                            نوع عملیات:
                          </label>
                          <select
                            className={styles.select}
                            style={{ width: "100%" }}
                            value={walletAdjustmentType}
                            onChange={(e) => setWalletAdjustmentType(e.target.value as "credit" | "debit")}
                          >
                            <option value="credit">➕ افزایش اعتبار (شارژ دستی)</option>
                            <option value="debit">➖ کسر اعتبار (تعدیل بدهی)</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                            مبلغ (تومان):
                          </label>
                          <input
                            type="number"
                            step={10000}
                            min={10000}
                            className={styles.searchInput}
                            value={walletAmountToman}
                            onChange={(e) => setWalletAmountToman(Number(e.target.value))}
                            required
                          />
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                            دلیل سیستمی تراکنش:
                          </label>
                          <select
                            className={styles.select}
                            style={{ width: "100%" }}
                            value={walletReasonCategory}
                            onChange={(e) =>
                              setWalletReasonCategory(
                                e.target.value as "compensation" | "loyalty_gift" | "refund" | "accounting_adjustment"
                              )
                            }
                          >
                            <option value="loyalty_gift">🎁 هدیه وفاداری / مسابقه / پروموشن</option>
                            <option value="compensation">⚖️ جبران خسارت لغو جلسه توسط مدرس</option>
                            <option value="refund">↩️ بازگشت وجه دوره یا آزمون</option>
                            <option value="accounting_adjustment">📊 اصلاح حسابداری و تسویه دستی</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                          یادداشت توضیحی مدیر (جهت ثبت در دفتر کل ممیزی):
                        </label>
                        <input
                          type="text"
                          className={styles.searchInput}
                          placeholder="مثلاً: شارژ هدیه به دلیل کسب رتبه اول در کوییز ریدینگ آیلتس..."
                          value={walletAdminNote}
                          onChange={(e) => setWalletAdminNote(e.target.value)}
                          required
                        />
                      </div>

                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button
                          type="submit"
                          className={styles.btnDossier}
                          style={{
                            background: walletAdjustmentType === "credit" ? "#16a34a" : "#dc2626",
                            padding: "0.75rem 1.5rem",
                          }}
                        >
                          {walletAdjustmentType === "credit" ? "تایید و شارژ کیف‌پول" : "تایید و کسر اعتبار"}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Transaction History Table */}
                  <div>
                    <h5 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", fontWeight: 700, color: "#0f172a" }}>
                      📜 ریز تراکنش‌های کیف‌پول کاربر:
                    </h5>
                    {selectedUser.walletTransactions && selectedUser.walletTransactions.length > 0 ? (
                      <table className={styles.table} style={{ border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                        <thead>
                          <tr>
                            <th>تاریخ</th>
                            <th>مبلغ</th>
                            <th>مانده پس از تراکنش</th>
                            <th>علت و یادداشت مدیر</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedUser.walletTransactions.map((tx) => (
                            <tr key={tx.id}>
                              <td>{new Date(tx.createdAt).toLocaleDateString("fa-IR")}</td>
                              <td style={{ fontWeight: 800, color: tx.amountToman > 0 ? "#16a34a" : "#dc2626" }}>
                                {tx.amountToman > 0 ? `+${tx.amountToman.toLocaleString("fa-IR")}` : tx.amountToman.toLocaleString("fa-IR")} تومان
                              </td>
                              <td>{tx.balanceAfterToman.toLocaleString("fa-IR")} تومان</td>
                              <td style={{ fontSize: "0.8rem", color: "#64748b" }}>
                                {tx.adminNote} ({tx.adminActor})
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div style={{ padding: "1.5rem", textAlign: "center", color: "#94a3b8" }}>
                        هیچ تراکنشی در سوابق کیف پول موجود نیست.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: STRIKES, MODERATION & SECURITY */}
              {activeDossierTab === 5 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {/* Automated Strike System Notice */}
                  <div
                    style={{
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      borderRadius: "12px",
                      padding: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.4rem",
                    }}
                  >
                    <span style={{ fontWeight: 800, color: "#991b1b", fontSize: "0.9rem" }}>
                      ⚖️ سیاست خودکار ۳ اخطاره انضباطی پلتفرم ایندورا:
                    </span>
                    <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.8rem", color: "#7f1d1d", flexWrap: "wrap" }}>
                      <span>🔴 اخطار ۱: ارسال تذکر کتبی رسمی</span>
                      <span>🔴🔴 اخطار ۲: تعلیق ۷ روزه رزرو کلاس</span>
                      <span>⛔ اخطار ۳: مسدودسازی خودکار حساب (Auto-Ban)</span>
                    </div>
                  </div>

                  {/* Active Strikes List */}
                  <div>
                    <h5 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem", fontWeight: 700, color: "#0f172a" }}>
                      اخطارهای انضباطی ثبت‌شده در پرونده:
                    </h5>

                    {selectedUser.warningStrikes && selectedUser.warningStrikes.length > 0 ? (
                      <div className={styles.strikesList}>
                        {selectedUser.warningStrikes.map((strk) => (
                          <div
                            key={strk.id}
                            className={`${styles.strikeCard} ${strk.isActive ? styles.strikeCardActive : styles.strikeCardPardoned}`}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span className={styles.strikeNumberBadge}>
                                ⚠️ اخطار شماره {strk.strikeNumber} {strk.isActive ? "(فعال)" : "(بخشیده شده)"}
                              </span>
                              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                                  ثبت: {new Date(strk.issuedAt).toLocaleDateString("fa-IR")} توسط {strk.issuedBy}
                                </span>
                                {strk.isActive && (
                                  <button
                                    type="button"
                                    className={styles.btnActionIcon}
                                    onClick={() => handlePardonStrike(strk.id)}
                                    title="بخشش اخطار انضباطی"
                                    style={{ color: "#16a34a", borderColor: "#bbf7d0" }}
                                  >
                                    🕊️ بخشش اخطار
                                  </button>
                                )}
                              </div>
                            </div>

                            <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0f172a" }}>
                              عنوان تخلف: {strk.reasonPreset}
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "#475569", lineHeight: 1.6 }}>
                              شرح تخلف: {strk.detailMessage}
                            </div>

                            {!strk.isActive && strk.pardonReason && (
                              <div style={{ fontSize: "0.75rem", color: "#166534", background: "#f0fdf4", padding: "0.4rem", borderRadius: "6px" }}>
                                علّت بخشش: {strk.pardonReason} ({strk.pardonedBy})
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ padding: "1.5rem", textAlign: "center", color: "#16a34a", fontWeight: 600 }}>
                        ✅ هیچ اخطار انضباطی برای این کاربر ثبت نشده است. پرونده کاملاً سفید می‌باشد.
                      </div>
                    )}
                  </div>

                  {/* Issue New Strike Form */}
                  <div className={styles.newStrikeBox}>
                    <h5 style={{ margin: 0, fontSize: "0.9rem", fontWeight: 800, color: "#991b1b" }}>
                      ➕ ثبت اخطار انضباطی جدید برای کاربر
                    </h5>

                    <form onSubmit={handleIssueStrikeSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                          انتخاب عنوان تخلف:
                        </label>
                        <select
                          className={styles.select}
                          style={{ width: "100%" }}
                          value={newStrikePreset}
                          onChange={(e) => setNewStrikePreset(e.target.value)}
                        >
                          {STRIKE_REASON_PRESETS.map((p) => (
                            <option key={p.code} value={p.labelFa}>
                              {p.labelFa}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                          شرح جزئیات تخلف:
                        </label>
                        <textarea
                          rows={2}
                          className={styles.searchInput}
                          placeholder="توضیح گزارش، تاریخ وقوع و مستندات تخلف..."
                          value={newStrikeDetail}
                          onChange={(e) => setNewStrikeDetail(e.target.value)}
                          required
                        />
                      </div>

                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button
                          type="submit"
                          className={styles.btnDossier}
                          style={{ background: "#dc2626", padding: "0.6rem 1.25rem" }}
                        >
                          ⚠️ اعمال اخطار در پرونده کاربر
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Role Change Modal */}
      {editRoleModalUser && (
        <div className={styles.modalBackdrop} onClick={() => setEditRoleModalUser(null)}>
          <div
            className={styles.modalContent}
            style={{ maxWidth: "420px", padding: "1.5rem" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem", fontWeight: "800" }}>
              تغییر نقش دسترسی {editRoleModalUser.name}
            </h3>
            <p style={{ margin: "0 0 1rem 0", fontSize: "0.85rem", color: "#64748b" }}>
              ایمیل: {editRoleModalUser.email}
            </p>

            <form onSubmit={handleSaveRole} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", marginBottom: "0.35rem" }}>
                  نقش دسترسی جدید:
                </label>
                <select
                  className={styles.select}
                  style={{ width: "100%" }}
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                >
                  <option value="learner">🎒 زبان‌آموز (Learner)</option>
                  <option value="teacher">🧑‍🏫 مدرس و استاد (Teacher)</option>
                  <option value="editor">✍️ ویرایشگر محتوا (Content Editor)</option>
                  <option value="support">🎧 کارشناس پشتیبانی (Support)</option>
                  <option value="administrator">👑 مدیر ارشد سیستم (Administrator)</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  className={styles.btnActionIcon}
                  onClick={() => setEditRoleModalUser(null)}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className={styles.btnDossier}
                >
                  ذخیره تغییرات نقش
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
