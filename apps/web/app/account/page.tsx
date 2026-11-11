"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import styles from "./account.module.css";
import {
  STUDENT_AVATARS,
  getStoredAvatarId,
  setStoredAvatarId,
  getAvatarById,
  type StudentAvatar,
} from "../../lib/student-avatars";
import { endooraApi, type EndooraLocale } from "../../lib/endoora-api";

export type AccountTab =
  | "profile"
  | "library"
  | "plan"
  | "usage"
  | "wallet"
  | "security"
  | "notifications"
  | "data";

interface StudentProfileData {
  fullName: string;
  email: string;
  phone: string;
  phoneVerified: boolean;
  academicGrade: string;
  learningGoal: string;
  dailyStudyMinutes: number;
  studyDays: string[];
  locale: EndooraLocale;
  avatarId: string;
  isVip: boolean;
  vipDaysLeft: number;
  streakDays: number;
  level: number;
  xp: number;
  balanceRial: number;
}

const DEFAULT_PROFILE: StudentProfileData = {
  fullName: "علی رضایی",
  email: "ali.rezaei@student.ir",
  phone: "۰۹۱۲۳۴۵۶۷۸۹",
  phoneVerified: true,
  academicGrade: "grade12_math", // پایه دوازدهم ریاضی و فیزیک
  learningGoal: "final_exam_20", // کسب نمره ۲۰ در امتحان نهایی
  dailyStudyMinutes: 30,
  studyDays: ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday"],
  locale: "fa",
  avatarId: "owl",
  isVip: true,
  vipDaysLeft: 45,
  streakDays: 7,
  level: 4,
  xp: 1420,
  balanceRial: 1250000,
};

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<AccountTab>("profile");
  const [profile, setProfile] = useState<StudentProfileData>(DEFAULT_PROFILE);
  const [selectedAvatar, setSelectedAvatar] = useState<StudentAvatar>(STUDENT_AVATARS[0]);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Sub-tab for library
  const [libraryFilter, setLibraryFilter] = useState<"exams" | "videos" | "vocab">("exams");

  // Notifications filter
  const [notifFilter, setNotifFilter] = useState<"all" | "learning" | "finance" | "system">("all");

  // Receipt Modal State
  const [activeReceipt, setActiveReceipt] = useState<{
    id: string;
    title: string;
    amount: string;
    date: string;
    refId: string;
    gateway: string;
    status: string;
  } | null>(null);

  // Password Change Form
  const [pwdForm, setPwdForm] = useState({ current: "", next: "", confirm: "" });
  const [pwdFeedback, setPwdFeedback] = useState<string | null>(null);

  // Quick Top-up amount
  const [customTopup, setCustomTopup] = useState<string>("100000");

  // Support Ticket Form
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSent, setTicketSent] = useState(false);

  // Sync tab from URL query params on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as AccountTab;
      if (
        tabParam &&
        [
          "profile",
          "library",
          "plan",
          "usage",
          "wallet",
          "security",
          "notifications",
          "data",
        ].includes(tabParam)
      ) {
        setActiveTab(tabParam);
      }

      // Initialize avatar from storage
      const storedId = getStoredAvatarId();
      setSelectedAvatar(getAvatarById(storedId));

      // Attempt to load profile from localStorage if present
      try {
        const cached = localStorage.getItem("endoora_student_profile");
        if (cached) {
          const parsed = JSON.parse(cached);
          setProfile((prev) => ({ ...prev, ...parsed }));
        }
      } catch {
        // use default profile
      }
    }
  }, []);

  // Try fetching backend summary if logged in
  useEffect(() => {
    let cancelled = false;
    endooraApi<{
      account?: { email?: string; phone?: string; preferred_locale?: EndooraLocale };
      profile?: { full_name?: string };
    }>("/profiles/account-summary/")
      .then((res) => {
        if (cancelled || !res) return;
        setProfile((prev) => ({
          ...prev,
          email: res.account?.email || prev.email,
          fullName: res.profile?.full_name || prev.fullName,
          phone: res.account?.phone || prev.phone,
          locale: res.account?.preferred_locale || prev.locale,
        }));
      })
      .catch(() => {
        // Fallback gracefully to student profile
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function handleTabChange(tab: AccountTab) {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState({}, "", url.toString());
    }
  }

  function handleSelectAvatar(avatar: StudentAvatar) {
    setSelectedAvatar(avatar);
    setStoredAvatarId(avatar.id);
    setProfile((prev) => ({ ...prev, avatarId: avatar.id }));
    setShowAvatarModal(false);

    showToast(`نماد پروفایل شما با موفقیت به «${avatar.name_fa} ${avatar.symbol}» تغییر یافت! ✨`);
  }

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  }

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("endoora_student_profile", JSON.stringify(profile));
      }
    } catch {
      // ignore
    }

    setTimeout(() => {
      setSaving(false);
      showToast("اطلاعات پروفایل و تنظیمات تحصیلی شما با موفقیت ذخیره شد. 🌸");
    }, 400);
  }

  function handleToggleDay(day: string) {
    setProfile((prev) => {
      const exists = prev.studyDays.includes(day);
      const updated = exists
        ? prev.studyDays.filter((d) => d !== day)
        : [...prev.studyDays, day];
      return { ...prev, studyDays: updated };
    });
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pwdForm.current || !pwdForm.next || !pwdForm.confirm) {
      setPwdFeedback("لطفاً تمامی فیلدهای کلمه عبور را تکمیل نمایید.");
      return;
    }
    if (pwdForm.next !== pwdForm.confirm) {
      setPwdFeedback("کلمه عبور جدید با تکرار آن یکسان نیست.");
      return;
    }
    if (pwdForm.next.length < 8) {
      setPwdFeedback("کلمه عبور جدید باید حداقل ۸ کاراکتر باشد.");
      return;
    }

    setPwdFeedback(null);
    setPwdForm({ current: "", next: "", confirm: "" });
    showToast("کلمه عبور شما با موفقیت به‌روزرسانی شد. 🔒");
  }

  function handleSendTicket(e: React.FormEvent) {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;
    setTicketSent(true);
    setTicketSubject("");
    setTicketMessage("");
    showToast("پیام شما برای پشتیبان آموزشی ارسال شد. پاسخ حداکثر تا ۲ ساعت دیگر در بخش اعلان‌ها قرار می‌گیرد.");
  }

  function handleExportData() {
    const exportObject = {
      profile,
      avatar: selectedAvatar,
      exportDate: new Date().toISOString(),
      platform: "Endoora Academic Learner Portal",
      completedExams: [
        { title: "آزمون شبیه‌ساز نهایی درس ۱ (پایه ۱۲)", score: "۱۹.۵ از ۲۰", date: "۱۴۰۳/۰۸/۱۰" },
        { title: "کوییز تستی واژگان ۵۰۴ درس ۲", score: "۱۰۰٪", date: "۱۴۰۳/۰۸/۱۵" },
      ],
      flashcardsMastered: 342,
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `endoora-student-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast("فایل پشتیبان سوابق آموزشی با موفقیت دانلود شد. 📥");
  }

  // Calculate profile completeness
  const completenessPercent = useMemo(() => {
    let score = 40;
    if (profile.fullName) score += 15;
    if (profile.phoneVerified) score += 15;
    if (profile.academicGrade) score += 10;
    if (profile.learningGoal) score += 10;
    if (profile.studyDays.length > 0) score += 10;
    return Math.min(score, 100);
  }, [profile]);

  return (
    <div className={styles.container} dir="rtl">
      {/* --------------------------------------------------------------------------
          1. Hero Card: Student Identity & Active Symbol
          -------------------------------------------------------------------------- */}
      <section className={styles.heroCard} aria-label="مشخصات کلی حساب دانش‌آموز">
        <div className={styles.heroLeft}>
          <div className={styles.avatarContainer}>
            <div
              className={styles.avatarCircle}
              style={{
                background: selectedAvatar.gradient,
                boxShadow: `0 8px 24px ${selectedAvatar.glow}, 0 0 0 3px ${selectedAvatar.borderColor}`,
              }}
              onClick={() => setShowAvatarModal(true)}
              title="کلیک برای انتخاب از میان ۱۰ نماد پروفایل"
            >
              <span>{selectedAvatar.symbol}</span>
              <span className={styles.avatarBadgeOverlay}>
                <span>★</span> {selectedAvatar.name_fa}
              </span>
            </div>
            <button
              type="button"
              className={styles.changeAvatarBtn}
              onClick={() => setShowAvatarModal(true)}
            >
              🔄 تغییر نماد (۱۰ نماد)
            </button>
          </div>

          <div className={styles.heroInfo}>
            <div className={styles.heroNameRow}>
              <h1 className={styles.studentName}>{profile.fullName}</h1>
              {profile.isVip && (
                <span className={styles.vipBadge}>
                  ⭐ اشتراک ویژه VIP (پایه دوازدهم)
                </span>
              )}
            </div>

            <div className={styles.heroMetaRow}>
              <span className={styles.metaItem} dir="ltr">
                ✉️ {profile.email}
              </span>
              <span>•</span>
              <span className={styles.metaItem}>
                📱 {profile.phone}
                {profile.phoneVerified && (
                  <span style={{ color: "#10b981", fontWeight: 700 }} title="شماره تایید شده">
                    (تأیید شده ✓)
                  </span>
                )}
              </span>
              <span>•</span>
              <span className={styles.metaItem}>
                🔥 استریک: <strong>{profile.streakDays} روز پیاپی</strong>
              </span>
              <span>•</span>
              <span className={styles.metaItem}>
                🎯 سطح {profile.level} ({profile.xp} XP)
              </span>
            </div>
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.completenessBox}>
            <div className={styles.completenessHeader}>
              <span>تکمیل حساب کاربری</span>
              <strong style={{ color: "#1e40af" }}>{completenessPercent}٪</strong>
            </div>
            <div className={styles.completenessTrack}>
              <div
                className={styles.completenessFill}
                style={{ width: `${completenessPercent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toastBanner} role="alert">
          <span>🔔</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* --------------------------------------------------------------------------
          2. Navigation Tabs Bar (8 Complete Sections)
          -------------------------------------------------------------------------- */}
      <nav className={styles.tabsBar} aria-label="منوهای پنل دانش‌آموزی">
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "profile" ? styles.tabBtnActive : ""}`}
          onClick={() => handleTabChange("profile")}
        >
          <span>👤</span>
          <span>مشخصات و نماد</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "library" ? styles.tabBtnActive : ""}`}
          onClick={() => handleTabChange("library")}
        >
          <span>📚</span>
          <span>کتابخانه و جزوات</span>
          <span className={styles.tabBadge}>نهایی</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "plan" ? styles.tabBtnActive : ""}`}
          onClick={() => handleTabChange("plan")}
        >
          <span>💎</span>
          <span>اشتراک و پلن</span>
          <span className={styles.tabBadge}>VIP</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "usage" ? styles.tabBtnActive : ""}`}
          onClick={() => handleTabChange("usage")}
        >
          <span>📊</span>
          <span>آمار و کارنامه</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "wallet" ? styles.tabBtnActive : ""}`}
          onClick={() => handleTabChange("wallet")}
        >
          <span>💳</span>
          <span>کیف پول و مالی</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "security" ? styles.tabBtnActive : ""}`}
          onClick={() => handleTabChange("security")}
        >
          <span>🛡️</span>
          <span>امنیت و نشست‌ها</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "notifications" ? styles.tabBtnActive : ""}`}
          onClick={() => handleTabChange("notifications")}
        >
          <span>🔔</span>
          <span>اعلان‌ها و پیامک</span>
          <span className={styles.tabBadge}>۵</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === "data" ? styles.tabBtnActive : ""}`}
          onClick={() => handleTabChange("data")}
        >
          <span>🔐</span>
          <span>پشتیبانی و داده‌ها</span>
        </button>
      </nav>

      {/* --------------------------------------------------------------------------
          Tab 1: مشخصات و پروفایل (Profile & 10 Avatars)
          -------------------------------------------------------------------------- */}
      {activeTab === "profile" && (
        <div className={styles.tabContent}>
          <div className={styles.cardSection}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>
                  <span>{selectedAvatar.symbol}</span>
                  <span>انتخاب نماد و تصویر پروفایل دانش‌آموز</span>
                </h2>
                <p className={styles.sectionSubtitle}>
                  یک نماد از میان ۱۰ نماد اختصاصی یادگیری انتخاب کنید تا در کنار نام شما در پنل، کارنامه و هدر بدرخشد.
                </p>
              </div>
              <button
                type="button"
                className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
                onClick={() => setShowAvatarModal(true)}
              >
                مشاهده همه ۱۰ نماد در اندازه بزرگ 🔍
              </button>
            </div>

            {/* Quick 10 Avatar Inline Strip */}
            <div className={styles.avatarGrid}>
              {STUDENT_AVATARS.map((avatar) => {
                const isSelected = selectedAvatar.id === avatar.id;
                return (
                  <div
                    key={avatar.id}
                    className={`${styles.avatarOptionCard} ${isSelected ? styles.avatarOptionActive : ""}`}
                    onClick={() => handleSelectAvatar(avatar)}
                  >
                    {isSelected && <span className={styles.activeCheckmark}>✓</span>}
                    <div
                      className={styles.avatarOptionSymbol}
                      style={{
                        background: avatar.gradient,
                        boxShadow: `0 6px 16px ${avatar.glow}`,
                      }}
                    >
                      {avatar.symbol}
                    </div>
                    <div className={styles.avatarOptionName}>{avatar.name_fa}</div>
                    <div className={styles.avatarOptionTitle}>{avatar.title_fa}</div>
                    <div className={styles.avatarOptionMeaning}>{avatar.meaning_fa}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.cardSection}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>
                  <span>📝</span>
                  <span>اطلاعات فردی و تنظیمات تحصیلی</span>
                </h2>
                <p className={styles.sectionSubtitle}>
                  مشخصات دانش‌آموزی، پایه تحصیلی و اهداف آموزشی خود را مدیریت کنید.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>نام و نام خانوادگی</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>نشانی ایمیل</label>
                  <input
                    type="email"
                    dir="ltr"
                    className={styles.formInput}
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>
                    <span>شماره تلفن همراه</span>
                    <span style={{ fontSize: "0.75rem", color: "#10b981" }}>تأیید شده برای دریافت پیامک آزمون</span>
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    className={styles.formInput}
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>پایه و مقطع تحصیلی</label>
                  <select
                    className={styles.formSelect}
                    value={profile.academicGrade}
                    onChange={(e) => setProfile({ ...profile, academicGrade: e.target.value })}
                  >
                    <option value="grade12_math">پایه دوازدهم ریاضی و فیزیک (امتحان نهایی و کنکور)</option>
                    <option value="grade12_exp">پایه دوازدهم علوم تجربی (امتحان نهایی و کنکور)</option>
                    <option value="grade12_hum">پایه دوازدهم علوم انسانی (امتحان نهایی)</option>
                    <option value="grade11">پایه یازدهم متوسطه دوم</option>
                    <option value="grade10">پایه دهم متوسطه دوم</option>
                    <option value="konkur_lang">کنکور منحصراً زبان تخصصی</option>
                    <option value="general_adults">دوره‌های عمومی و آمادگی آیلتس</option>
                  </select>
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>هدف اصلی یادگیری</label>
                  <select
                    className={styles.formSelect}
                    value={profile.learningGoal}
                    onChange={(e) => setProfile({ ...profile, learningGoal: e.target.value })}
                  >
                    <option value="final_exam_20">کسب نمره کامل ۲۰ در امتحان نهایی زبان انگلیسی</option>
                    <option value="speaking_fluency">تسلط بر مکالمه روزمره و روان شدن اسپیکینگ</option>
                    <option value="ielts_prep">کسب نمره ۷+ در آزمون آیلتس آکادمیک</option>
                    <option value="grammar_vocab">تقویت عمیق گرامر و واژگان تخصصی</option>
                  </select>
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>زمان مطالعه روزانه پیشنهادی</label>
                  <div className={styles.pillsRow}>
                    {[15, 30, 45, 60].map((mins) => (
                      <button
                        type="button"
                        key={mins}
                        className={`${styles.pillBtn} ${profile.dailyStudyMinutes === mins ? styles.pillBtnActive : ""}`}
                        onClick={() => setProfile({ ...profile, dailyStudyMinutes: mins })}
                      >
                        ⏱️ {mins} دقیقه در روز
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "1.25rem" }}>
                <label className={styles.formLabel} style={{ marginBottom: "0.5rem" }}>
                  روزهای برنامه‌ریزی مطالعه در هفته
                </label>
                <div className={styles.pillsRow}>
                  {[
                    { id: "saturday", label: "شنبه" },
                    { id: "sunday", label: "یک‌شنبه" },
                    { id: "monday", label: "دوشنبه" },
                    { id: "tuesday", label: "سه‌شنبه" },
                    { id: "wednesday", label: "چهارشنبه" },
                    { id: "thursday", label: "پنج‌شنبه" },
                    { id: "friday", label: "جمعه (مرور)" },
                  ].map((day) => {
                    const isSelected = profile.studyDays.includes(day.id);
                    return (
                      <button
                        key={day.id}
                        type="button"
                        className={`${styles.pillBtn} ${isSelected ? styles.pillBtnActive : ""}`}
                        onClick={() => handleToggleDay(day.id)}
                      >
                        {isSelected ? "✓ " : ""}{day.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                <button
                  type="submit"
                  disabled={saving}
                  className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                >
                  {saving ? "در حال ذخیره‌سازی…" : "💾 ذخیره تغییرات مشخصات"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------------
          Tab 2: کتابخانه و محتوای ذخیره‌شده (Library & Grade 12 Resources)
          -------------------------------------------------------------------------- */}
      {activeTab === "library" && (
        <div className={styles.tabContent}>
          <div className={styles.cardSection}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>
                  <span>📚</span>
                  <span>کتابخانه تخصصی و منابع آموزشی زبان‌آموز</span>
                </h2>
                <p className={styles.sectionSubtitle}>
                  جزوات نهایی، نمونه‌سوالات امتحانات ۵ سال گذشته، فایل‌های صوتی و ویدیوهای نشان‌شده شما.
                </p>
              </div>

              <div className={styles.pillsRow}>
                <button
                  type="button"
                  className={`${styles.pillBtn} ${libraryFilter === "exams" ? styles.pillBtnActive : ""}`}
                  onClick={() => setLibraryFilter("exams")}
                >
                  📑 جزوات و سوالات نهایی (۴)
                </button>
                <button
                  type="button"
                  className={`${styles.pillBtn} ${libraryFilter === "videos" ? styles.pillBtnActive : ""}`}
                  onClick={() => setLibraryFilter("videos")}
                >
                  🎬 ویدیوهای نشان‌شده (۳)
                </button>
                <button
                  type="button"
                  className={`${styles.pillBtn} ${libraryFilter === "vocab" ? styles.pillBtnActive : ""}`}
                  onClick={() => setLibraryFilter("vocab")}
                >
                  ⭐ واژگان لایتنر ستاره‌دار (۵)
                </button>
              </div>
            </div>

            {/* Sub-section: Exams & PDFs */}
            {libraryFilter === "exams" && (
              <div className={styles.resourceGrid}>
                <div className={styles.resourceCard}>
                  <span className={styles.resourceTypeBadge}>PDF جامع</span>
                  <h3 className={styles.resourceTitle}>جزوه طلایی گرامر درس ۱ تا ۳ پایه دوازدهم</h3>
                  <p className={styles.resourceDesc}>
                    آموزش کامل ساختار مجهول (Passive)، جملات سوالی ضمیمه (Tag Questions) و افعال وجهی گذشته با تکنیک حل سوالات تشریحی نهایی.
                  </p>
                  <div className={styles.resourceFooter}>
                    <span>حجم: ۳.۴ مگابایت · به‌روزرسانی نهایی</span>
                    <a
                      className={styles.downloadLink}
                      href="/scratch/grammar_grade12_golden.pdf"
                      download
                      onClick={(e) => {
                        e.preventDefault();
                        showToast("دریافت جزوه گرامر پایه دوازدهم آغاز شد 📥");
                      }}
                    >
                      دانلود PDF ⬇️
                    </a>
                  </div>
                </div>

                <div className={styles.resourceCard}>
                  <span className={styles.resourceTypeBadge}>واژگان نهایی</span>
                  <h3 className={styles.resourceTitle}>۵۰۴ واژه پرتکرار امتحانات نهایی خرداد و شهریور</h3>
                  <p className={styles.resourceDesc}>
                    فهرست طبقه‌بندی‌شده واژگان پرتکرار ۵ سال اخیر امتحانات نهایی کشوری همراه با معنی، هم‌نشینی‌ها (Collocations) و مترادف‌ها.
                  </p>
                  <div className={styles.resourceFooter}>
                    <span>حجم: ۲.۸ مگابایت · فرمت کتابچه</span>
                    <a
                      className={styles.downloadLink}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        showToast("دریافت کتابچه واژگان ۵۰۴ نهایی آغاز شد 📥");
                      }}
                    >
                      دانلود PDF ⬇️
                    </a>
                  </div>
                </div>

                <div className={styles.resourceCard}>
                  <span className={styles.resourceTypeBadge}>سوالات رسمی</span>
                  <h3 className={styles.resourceTitle}>مجموعه سوالات نهایی خرداد و شهریور ۱۴۰۲ و ۱۴۰۳</h3>
                  <p className={styles.resourceDesc}>
                    اصل سوالات نهایی همراه با کلید تصحیح دقیق دبیرخانه راهبری کشوری و بارم‌بندی رسمی آموزش و پرورش.
                  </p>
                  <div className={styles.resourceFooter}>
                    <span>حجم: ۴.۱ مگابایت · همراه پاسخنامه</span>
                    <a
                      className={styles.downloadLink}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        showToast("دریافت مجموعه سوالات نهایی آغاز شد 📥");
                      }}
                    >
                      دانلود PDF ⬇️
                    </a>
                  </div>
                </div>

                <div className={styles.resourceCard}>
                  <span className={styles.resourceTypeBadge}>صوت Listening</span>
                  <h3 className={styles.resourceTitle}>فایل‌های صوتی آزمون شنیداری نهایی (Official Audio)</h3>
                  <p className={styles.resourceDesc}>
                    ترک‌های صوتی رسمی امتحان شنیداری با کیفیت استودیویی جهت تمرین بخش Listening امتحان نهایی زبان دوازدهم.
                  </p>
                  <div className={styles.resourceFooter}>
                    <span>حجم: ۱۵ مگابایت · ۴ فایل صوتی MP3</span>
                    <a
                      className={styles.downloadLink}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        showToast("دانلود فایل‌های صوتی لیسنینگ نهایی آغاز شد 🎧");
                      }}
                    >
                      دانلود صوتی ⬇️
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-section: Bookmarked Videos */}
            {libraryFilter === "videos" && (
              <div className={styles.resourceGrid}>
                <div className={styles.resourceCard}>
                  <span className={styles.resourceTypeBadge}>ویدیو ۴۰ دقیقه</span>
                  <h3 className={styles.resourceTitle}>درس اول: Sense of Appreciation & Passive Rules</h3>
                  <p className={styles.resourceDesc}>
                    تدریس ویدیویی جامع متن درس اول، ریدینگ تجلیل از دانشمندان، و بررسی موشکافانه نکات گرامری نهایی.
                  </p>
                  <div className={styles.resourceFooter}>
                    <span>مدرس: استاد حسینی · کیفیت 1080p</span>
                    <Link href="/learn/video" className={styles.downloadLink}>
                      تماشای ویدیو ▶️
                    </Link>
                  </div>
                </div>

                <div className={styles.resourceCard}>
                  <span className={styles.resourceTypeBadge}>کارگاه ۳۵ دقیقه</span>
                  <h3 className={styles.resourceTitle}>تکنیک‌های طلایی حل درک مطلب و کلوز تست نهایی</h3>
                  <p className={styles.resourceDesc}>
                    آموزش روش Skimming و Scanning برای پاسخ‌گویی بدون غلط به سوالات درک مطلب امتحانات نهایی.
                  </p>
                  <div className={styles.resourceFooter}>
                    <span>مبحث کلیدی ریدینگ · کیفیت HD</span>
                    <Link href="/learn/video" className={styles.downloadLink}>
                      تماشای ویدیو ▶️
                    </Link>
                  </div>
                </div>

                <div className={styles.resourceCard}>
                  <span className={styles.resourceTypeBadge}>حل سوالات ۵۰ دقیقه</span>
                  <h3 className={styles.resourceTitle}>تحلیل تشریحی سوالات نهایی خرداد ۱۴۰۳</h3>
                  <p className={styles.resourceDesc}>
                    بررسی خط به خط دام‌های طراحان سوال در بخش املا، لغات و نگارش تشریحی با ارائه نکات نمره‌آور.
                  </p>
                  <div className={styles.resourceFooter}>
                    <span>تحلیل آزمون اخیر · کیفیت HD</span>
                    <Link href="/learn/video" className={styles.downloadLink}>
                      تماشای ویدیو ▶️
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-section: Starred Vocabulary Flashcards */}
            {libraryFilter === "vocab" && (
              <div className={styles.resourceGrid}>
                {[
                  { word: "dedicate", ipa: "/ˈdedɪkeɪt/", fa: "وقف کردن / اختصاص دادن به هدف والا", ex: "He dedicated his life to helping needy people." },
                  { word: "distinguish", ipa: "/dɪˈstɪŋɡwɪʃ/", fa: "تشخیص دادن / متمایز کردن", ex: "Can you distinguish between these two structures?" },
                  { word: "comprehend", ipa: "/ˌkɒmprɪˈhend/", fa: "درک و فهم عمیق مطلب", ex: "He failed to comprehend the seriousness of the exam." },
                  { word: "magnificent", ipa: "/mæɡˈnɪfɪsnt/", fa: "باشکوه، عالی و بی‌نظیر", ex: "She showed magnificent progress in writing." },
                  { word: "perseverance", ipa: "/ˌpɜːsɪˈvɪərəns/", fa: "پشتکار مداوم و اراده آهنین", ex: "Perseverance is the secret to scoring 20 in finals." },
                ].map((item, idx) => (
                  <div key={idx} className={styles.resourceCard}>
                    <span className={styles.resourceTypeBadge}>واژه لایتنر</span>
                    <h3 className={styles.resourceTitle} style={{ fontSize: "1.1rem" }}>
                      <span dir="ltr">{item.word}</span> <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{item.ipa}</span>
                    </h3>
                    <p className={styles.resourceDesc} style={{ fontWeight: 600, color: "#1e40af" }}>
                      {item.fa}
                    </p>
                    <p style={{ fontSize: "0.8rem", color: "#475569", fontStyle: "italic", marginBottom: "0.75rem" }} dir="ltr">
                      &quot;{item.ex}&quot;
                    </p>
                    <div className={styles.resourceFooter}>
                      <button
                        type="button"
                        className={styles.changeAvatarBtn}
                        onClick={() => {
                          if (typeof window !== "undefined" && "speechSynthesis" in window) {
                            const utt = new SpeechSynthesisUtterance(item.word);
                            utt.lang = "en-US";
                            window.speechSynthesis.speak(utt);
                          }
                          showToast(`تلفظ صوتی واژه «${item.word}» پخش شد 🔊`);
                        }}
                      >
                        🔊 شنیدن تلفظ
                      </button>
                      <Link href="/leitner" className={styles.downloadLink}>
                        مرور در جعبه لایتنر 📦
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------------
          Tab 3: اشتراک و پلن (Plan & VIP Subscription)
          -------------------------------------------------------------------------- */}
      {activeTab === "plan" && (
        <div className={styles.tabContent}>
          <div className={styles.planActiveBanner}>
            <div>
              <span style={{ fontSize: "0.85rem", opacity: 0.9 }}>وضعیت حساب شما:</span>
              <h2 style={{ margin: "0.25rem 0", fontSize: "1.45rem" }}>
                ⭐ پلن طلایی VIP دانش‌آموزی (آمادگی امتحان نهایی ۲۰)
              </h2>
              <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.95 }}>
                ۴۵ روز باقی‌مانده تا تمدید بعدی · تاریخ انقضا: ۲۵ آذر ۱۴۰۵ · دسترسی نامحدود به تمامی آزمون‌ها
              </p>
            </div>
            <button
              type="button"
              className={`${styles.actionBtn}`}
              style={{ background: "#ffffff", color: "#1e40af" }}
              onClick={() => showToast("اشتراک شما در حال حاضر فعال و معتبر است.")}
            >
              تمدید زودهنگام با ۲۰٪ تخفیف ✨
            </button>
          </div>

          <div className={styles.cardSection}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>
                  <span>⚖️</span>
                  <span>مقایسه سطح دسترسی پلن‌های آموزشی ایندورا</span>
                </h2>
                <p className={styles.sectionSubtitle}>
                  امکانات در نظر گرفته شده برای هر سطح از دانش‌آموزان و زبان‌آموزان.
                </p>
              </div>
            </div>

            <div className={styles.planTierCards}>
              {/* Free Tier */}
              <div className={styles.tierCard}>
                <h3 className={styles.tierTitle}>پلن پایه (مقدماتی)</h3>
                <div className={styles.tierPrice}>رایگان</div>
                <ul className={styles.tierFeatures}>
                  <li className={styles.tierFeatureItem}>✓ آزمون تعیین سطح آنلاین</li>
                  <li className={styles.tierFeatureItem}>✓ دسترسی به درس اول پایه دوازدهم</li>
                  <li className={styles.tierFeatureItem}>✓ جعبه لایتنر محدود (تا ۵۰ واژه)</li>
                  <li className={styles.tierFeatureItem} style={{ color: "#94a3b8" }}>✕ بدون ویدیوهای تحلیلی نهایی</li>
                  <li className={styles.tierFeatureItem} style={{ color: "#94a3b8" }}>✕ بدون تصحیح رایتینگ هوش مصنوعی</li>
                </ul>
                <button
                  type="button"
                  className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
                  disabled
                >
                  پلن پیش‌فرض
                </button>
              </div>

              {/* Pro Tier */}
              <div className={styles.tierCard}>
                <h3 className={styles.tierTitle}>پلن حرفه‌ای (استاندارد)</h3>
                <div className={styles.tierPrice}>۱۴۹,۰۰۰ تومان <span style={{ fontSize: "0.8rem", color: "#64748b" }}>/ ماهانه</span></div>
                <ul className={styles.tierFeatures}>
                  <li className={styles.tierFeatureItem}>✓ دسترسی به تمام دروس پایه‌های ۱۰، ۱۱، ۱۲</li>
                  <li className={styles.tierFeatureItem}>✓ جعبه لایتنر نامحدود ۵۰۴ و ۱۱۰۰ واژه</li>
                  <li className={styles.tierFeatureItem}>✓ دانلود تمامی جزوات و سوالات نهایی</li>
                  <li className={styles.tierFeatureItem}>✓ آزمون‌های شنیداری نهایی با تحلیل</li>
                  <li className={styles.tierFeatureItem} style={{ color: "#94a3b8" }}>✕ بدون کلاس رفع اشکال آنلاین</li>
                </ul>
                <button
                  type="button"
                  className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
                  onClick={() => showToast("درخواست انتخاب پلن ثبت شد.")}
                >
                  ارتقا به حرفه‌ای
                </button>
              </div>

              {/* VIP Tier */}
              <div className={`${styles.tierCard} ${styles.tierCardHighlight}`}>
                <span className={styles.tierRibbon}>پلن فعال شما ⭐</span>
                <h3 className={styles.tierTitle}>پلن طلایی VIP نهایی ۲۰</h3>
                <div className={styles.tierPrice}>۲۹۰,۰۰۰ تومان <span style={{ fontSize: "0.8rem", color: "#64748b" }}>/ سه‌ماهه</span></div>
                <ul className={styles.tierFeatures}>
                  <li className={styles.tierFeatureItem}>✓ تمام امکانات پلن حرفه‌ای</li>
                  <li className={styles.tierFeatureItem}>✓ تحلیل هوشمند تلفظ و اسپیکینگ با AI</li>
                  <li className={styles.tierFeatureItem}>✓ تصحیح تشریحی رایتینگ امتحان نهایی</li>
                  <li className={styles.tierFeatureItem}>✓ شرکت در ۳ مرحله آزمون شبیه‌ساز کشوری</li>
                  <li className={styles.tierFeatureItem}>✓ وبینار شب امتحان با اساتید برتر کشوری</li>
                </ul>
                <button
                  type="button"
                  className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                  onClick={() => showToast("پلن طلایی VIP روی حساب شما فعال است. لذت ببرید! 🎉")}
                >
                  مدیریت اشتراک فعال
                </button>
              </div>
            </div>

            {/* Voucher Box */}
            <div style={{ marginTop: "2rem", padding: "1.25rem", background: "#f8fafc", borderRadius: "1rem", border: "1px dashed #cbd5e1" }}>
              <h4 style={{ margin: "0 0 0.5rem", fontSize: "1rem" }}>🎁 کد هدیه یا کوپن تخفیف دارید؟</h4>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", maxWidth: "28rem" }}>
                <input
                  type="text"
                  placeholder="مثال: ENDOORA20"
                  dir="ltr"
                  className={styles.formInput}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                  onClick={() => showToast("کد تخفیف معتبر است: ۲۰٪ تخفیف برای تمدید لحاظ شد. 🏷️")}
                >
                  بررسی و اعمال
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------------
          Tab 4: آمار و گزارش پیشرفت (Usage & Growth Analytics)
          -------------------------------------------------------------------------- */}
      {activeTab === "usage" && (
        <div className={styles.tabContent}>
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricIconBox} style={{ background: "#fef3c7", color: "#d97706" }}>
                🔥
              </div>
              <div>
                <div className={styles.metricValue}>{profile.streakDays} روز</div>
                <div className={styles.metricLabel}>استریک پیوسته مطالعه</div>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIconBox} style={{ background: "#eff6ff", color: "#1e40af" }}>
                ⏱️
              </div>
              <div>
                <div className={styles.metricValue}>۱۸ ساعت و ۴۵ دقیقه</div>
                <div className={styles.metricLabel}>زمان مطالعه ماه جاری</div>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIconBox} style={{ background: "#ecfdf5", color: "#059669" }}>
                📚
              </div>
              <div>
                <div className={styles.metricValue}>۳۴۲ واژه</div>
                <div className={styles.metricLabel}>لغات مسلط شده در لایتنر</div>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIconBox} style={{ background: "#fdf2f8", color: "#db2777" }}>
                🎯
              </div>
              <div>
                <div className={styles.metricValue}>۱۹.۲۵ از ۲۰</div>
                <div className={styles.metricLabel}>میانگین نمره آزمون‌های نهایی</div>
              </div>
            </div>
          </div>

          <div className={styles.cardSection}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>
                  <span>📈</span>
                  <span>نمودار ساعت مطالعه هفتگی (شنبه تا جمعه)</span>
                </h2>
                <p className={styles.sectionSubtitle}>
                  توزیع زمانی مطالعه و تمرین‌های انجام شده در طول هفته اخیر.
                </p>
              </div>
            </div>

            <div className={styles.chartContainer}>
              <div className={styles.barChart}>
                {[
                  { day: "شنبه", mins: 45, height: "75%" },
                  { day: "یک‌شنبه", mins: 35, height: "58%" },
                  { day: "دوشنبه", mins: 50, height: "83%" },
                  { day: "سه‌شنبه", mins: 60, height: "100%" },
                  { day: "چهارشنبه", mins: 40, height: "66%" },
                  { day: "پنج‌شنبه", mins: 55, height: "91%" },
                  { day: "جمعه (مرور)", mins: 30, height: "50%" },
                ].map((col, idx) => (
                  <div key={idx} className={styles.barCol}>
                    <div className={styles.bar} style={{ height: col.height }}>
                      <span className={styles.barValue}>{col.mins}دقیقه</span>
                    </div>
                    <span className={styles.barLabel}>{col.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.cardSection}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>
                  <span>🎯</span>
                  <span>تسلط بر مهارت‌های چهارگانه زبان انگلیسی</span>
                </h2>
                <p className={styles.sectionSubtitle}>
                  میزان آمادگی تشخیصی شما بر اساس تمرین‌های هوش مصنوعی و حل نمونه‌سوالات نهایی.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {[
                { name: "گرامر و ساختار جملات (Grammar)", percent: 92, color: "#3b82f6" },
                { name: "واژگان، هم‌نشینی‌ها و املا (Vocabulary)", percent: 88, color: "#10b981" },
                { name: "درک مطلب شنیداری (Listening)", percent: 85, color: "#f59e0b" },
                { name: "درک متن، کلوزتست و نگارش (Reading & Writing)", percent: 80, color: "#8b5cf6" },
              ].map((skill, idx) => (
                <div key={idx}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem", fontSize: "0.9rem", fontWeight: 700 }}>
                    <span>{skill.name}</span>
                    <span style={{ color: skill.color }}>{skill.percent}٪</span>
                  </div>
                  <div className={styles.completenessTrack} style={{ height: "0.65rem" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${skill.percent}%`,
                        background: skill.color,
                        borderRadius: "9999px",
                        transition: "width 0.8s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------------
          Tab 5: کیف پول و تراکنش‌ها (Wallet & Invoices)
          -------------------------------------------------------------------------- */}
      {activeTab === "wallet" && (
        <div className={styles.tabContent}>
          <div className={styles.walletHero}>
            <div>
              <div className={styles.walletBalanceText}>موجودی فعلی کیف پول شما:</div>
              <div className={styles.walletBalanceAmount}>
                {profile.balanceRial.toLocaleString("fa-IR")} ریال
                <span style={{ fontSize: "1rem", fontWeight: 500, marginRight: "0.5rem" }}>
                  ({(profile.balanceRial / 10).toLocaleString("fa-IR")} تومان)
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                type="button"
                className={styles.actionBtn}
                style={{ background: "#ffffff", color: "#065f46" }}
                onClick={() => {
                  setProfile((prev) => ({ ...prev, balanceRial: prev.balanceRial + 500000 }));
                  showToast("کیف پول شما با موفقیت ۵۰,۰۰۰ تومان شارژ آزمایشی شد! 💳");
                }}
              >
                + شارژ سریع کیف پول 💳
              </button>
            </div>
          </div>

          <div className={styles.cardSection}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>
                  <span>💰</span>
                  <span>افزایش موجودی کیف پول</span>
                </h2>
                <p className={styles.sectionSubtitle}>
                  مبالغ پیشنهادی را انتخاب کنید یا مبلغ مورد نظر خود را وارد کنید.
                </p>
              </div>
            </div>

            <div className={styles.quickTopupRow}>
              {[
                { label: "۱۰۰,۰۰۰ تومان", val: "100000" },
                { label: "۲۵۰,۰۰۰ تومان", val: "250000" },
                { label: "۵۰۰,۰۰۰ تومان", val: "500000" },
                { label: "۱,۰۰۰,۰۰۰ تومان", val: "1000000" },
              ].map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  className={`${styles.pillBtn} ${customTopup === opt.val ? styles.pillBtnActive : ""}`}
                  onClick={() => setCustomTopup(opt.val)}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", maxWidth: "26rem", flexWrap: "wrap" }}>
              <input
                type="number"
                className={styles.formInput}
                value={customTopup}
                onChange={(e) => setCustomTopup(e.target.value)}
                placeholder="مبلغ به تومان"
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                onClick={() => {
                  const added = Number(customTopup) * 10;
                  setProfile((prev) => ({ ...prev, balanceRial: prev.balanceRial + added }));
                  showToast(`مبلغ ${Number(customTopup).toLocaleString("fa-IR")} تومان با موفقیت به موجودی اضافه شد. ✅`);
                }}
              >
                انتقال به درگاه پرداخت شتاب
              </button>
            </div>
          </div>

          <div className={styles.cardSection}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>
                  <span>🧾</span>
                  <span>تاریخچه تراکنش‌ها و فاکتورهای رسمی</span>
                </h2>
                <p className={styles.sectionSubtitle}>
                  سوابق خرید بسته‌ها، شارژها و رسیدهای پرداخت موفق.
                </p>
              </div>
            </div>

            <div className={styles.tableWrap}>
              <table className={styles.customTable}>
                <thead>
                  <tr>
                    <th>ردیف</th>
                    <th>عنوان تراکنش</th>
                    <th>تاریخ و ساعت</th>
                    <th>مبلغ</th>
                    <th>شماره پیگیری</th>
                    <th>وضعیت</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      id: "1",
                      title: "خرید اشتراک طلایی VIP امتحان نهایی ۲۰ (۳ ماهه)",
                      date: "۱۴۰۳/۰۸/۰۱ - ۱۶:۳۰",
                      amount: "۲۹۰,۰۰۰ تومان",
                      refId: "TRX-9842104",
                      gateway: "سامان الکترونیک",
                      status: "موفق",
                    },
                    {
                      id: "2",
                      title: "شارژ آنلاین موجودی کیف پول",
                      date: "۱۴۰۳/۰۷/۱۵ - ۱۰:۱۴",
                      amount: "۱۰۰,۰۰۰ تومان",
                      refId: "TRX-7761092",
                      gateway: "زرین‌پال",
                      status: "موفق",
                    },
                    {
                      id: "3",
                      title: "ثبت‌نام آزمون شبیه‌ساز جامع کشوری نهایی",
                      date: "۱۴۰۳/۰۶/۲۸ - ۱۸:۴۵",
                      amount: "۷۵,۰۰۰ تومان",
                      refId: "TRX-5531980",
                      gateway: "پرداخت از کیف پول",
                      status: "موفق",
                    },
                    {
                      id: "4",
                      title: "پاداش استریک ۷ روزه پیوسته مطالعه",
                      date: "۱۴۰۳/۰۶/۱۰ - ۰۸:۰۰",
                      amount: "+۵,۰۰۰ تومان هدیه",
                      refId: "REW-110294",
                      gateway: "سیستم پاداش ایندورا",
                      status: "واریز شد",
                    },
                  ].map((tx, idx) => (
                    <tr key={tx.id}>
                      <td>{idx + 1}</td>
                      <td style={{ fontWeight: 600 }}>{tx.title}</td>
                      <td>{tx.date}</td>
                      <td style={{ fontWeight: 700, color: "#1e40af" }}>{tx.amount}</td>
                      <td dir="ltr" style={{ fontSize: "0.82rem" }}>{tx.refId}</td>
                      <td>
                        <span style={{ color: "#10b981", fontWeight: 700, background: "#ecfdf5", padding: "2px 8px", borderRadius: "9999px" }}>
                          ✓ {tx.status}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={styles.changeAvatarBtn}
                          onClick={() => setActiveReceipt(tx)}
                        >
                          مشاهده رسید 📄
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------------
          Tab 6: امنیت و نشست‌های فعال (Security & Devices)
          -------------------------------------------------------------------------- */}
      {activeTab === "security" && (
        <div className={styles.tabContent}>
          <div className={styles.cardSection}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>
                  <span>🔒</span>
                  <span>تغییر کلمه عبور حساب کاربری</span>
                </h2>
                <p className={styles.sectionSubtitle}>
                  برای حفظ امنیت حساب خود، کلمه عبور قوی شامل حروف و اعداد انتخاب کنید.
                </p>
              </div>
            </div>

            {pwdFeedback && (
              <div style={{ padding: "0.75rem", background: "#fef2f2", color: "#991b1b", borderRadius: "0.5rem", marginBottom: "1rem", fontSize: "0.875rem" }}>
                ⚠️ {pwdFeedback}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} style={{ maxWidth: "30rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>کلمه عبور فعلی</label>
                  <input
                    type="password"
                    dir="ltr"
                    className={styles.formInput}
                    value={pwdForm.current}
                    onChange={(e) => setPwdForm({ ...pwdForm, current: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>کلمه عبور جدید (حداقل ۸ نویسه)</label>
                  <input
                    type="password"
                    dir="ltr"
                    className={styles.formInput}
                    value={pwdForm.next}
                    onChange={(e) => setPwdForm({ ...pwdForm, next: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>تکرار کلمه عبور جدید</label>
                  <input
                    type="password"
                    dir="ltr"
                    className={styles.formInput}
                    value={pwdForm.confirm}
                    onChange={(e) => setPwdForm({ ...pwdForm, confirm: e.target.value })}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                  style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}
                >
                  🔐 به‌روزرسانی کلمه عبور
                </button>
              </div>
            </form>
          </div>

          <div className={styles.cardSection}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>
                  <span>💻</span>
                  <span>دستگاه‌ها و نشست‌های فعال</span>
                </h2>
                <p className={styles.sectionSubtitle}>
                  فهرست دستگاه‌هایی که در حال حاضر به حساب کاربری شما وارد شده‌اند.
                </p>
              </div>

              <button
                type="button"
                className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
                style={{ color: "#b91c1c", borderColor: "#fecaca" }}
                onClick={() => showToast("تمام نشست‌ها به جز دستگاه فعلی با موفقیت لغو شدند. 🚪")}
              >
                خروج از تمامی دستگاه‌های دیگر 🚪
              </button>
            </div>

            <div className={styles.sessionsList}>
              {/* Current Device */}
              <div className={styles.sessionItem} style={{ borderRight: "4px solid #10b981" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div className={styles.sessionIconBox}>💻</div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <strong style={{ fontSize: "0.95rem" }}>ویندوز — مرورگر Chrome</strong>
                      <span className={styles.activeDot} />
                      <span style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 700 }}>همین دستگاه (آنلاین)</span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.2rem" }} dir="ltr">
                      IP: 192.168.1.105 · Tehran, Iran · آخرین فعالیت: هم‌اکنون
                    </div>
                  </div>
                </div>
              </div>

              {/* Second Device */}
              <div className={styles.sessionItem}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div className={styles.sessionIconBox}>📱</div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <strong style={{ fontSize: "0.95rem" }}>سامسونگ گلکسی — اپلیکیشن ایندورا</strong>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.2rem" }} dir="ltr">
                      IP: 5.120.45.18 · Tehran, Iran · آخرین فعالیت: ۲ ساعت پیش
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.changeAvatarBtn}
                  style={{ color: "#b91c1c" }}
                  onClick={() => showToast("دسترسی نشست گوشی سامسونگ با موفقیت قطع شد.")}
                >
                  قطع دسترسی ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------------
          Tab 7: مرکز اعلان‌ها و پیام‌ها (Notifications & SMS)
          -------------------------------------------------------------------------- */}
      {activeTab === "notifications" && (
        <div className={styles.tabContent}>
          <div className={styles.cardSection}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>
                  <span>🔔</span>
                  <span>مرکز اعلان‌ها، پیام‌های آموزشی و تراکنش‌ها</span>
                </h2>
                <p className={styles.sectionSubtitle}>
                  هشدارهای یادگیری، یادآور آزمون‌ها، رسیدهای مالی و تنظیمات پیامکی.
                </p>
              </div>

              <div className={styles.pillsRow}>
                <button
                  type="button"
                  className={`${styles.pillBtn} ${notifFilter === "all" ? styles.pillBtnActive : ""}`}
                  onClick={() => setNotifFilter("all")}
                >
                  همه اعلان‌ها (۵)
                </button>
                <button
                  type="button"
                  className={`${styles.pillBtn} ${notifFilter === "learning" ? styles.pillBtnActive : ""}`}
                  onClick={() => setNotifFilter("learning")}
                >
                  🎓 آموزشی
                </button>
                <button
                  type="button"
                  className={`${styles.pillBtn} ${notifFilter === "finance" ? styles.pillBtnActive : ""}`}
                  onClick={() => setNotifFilter("finance")}
                >
                  💳 مالی و رسید
                </button>
                <button
                  type="button"
                  className={`${styles.pillBtn} ${notifFilter === "system" ? styles.pillBtnActive : ""}`}
                  onClick={() => setNotifFilter("system")}
                >
                  ⚙️ سیستم
                </button>
              </div>
            </div>

            <div className={styles.notifList}>
              {[
                {
                  id: "n1",
                  type: "learning",
                  icon: "🎓",
                  title: "وبینار حل تشریحی سوالات نهایی خرداد ماه",
                  text: "امروز ساعت ۱۸:۰۰ کارگاه آنلاین تحلیل نکات ریدینگ و کلوزتست با تدریس استاد حسینی برگزار می‌شود.",
                  time: "۱ ساعت پیش",
                  unread: true,
                },
                {
                  id: "n2",
                  type: "learning",
                  icon: "🔥",
                  title: "تبریک! نشان «شعله تمرکز» را به دست آوردید",
                  text: "شما با ۷ روز مطالعه مداوم استریک هفتگی را تکمیل کردید و ۱۰۰ امتیاز تجربه (XP) هدیه گرفتید.",
                  time: "امروز صبح",
                  unread: true,
                },
                {
                  id: "n3",
                  type: "finance",
                  icon: "🧾",
                  title: "فاکتور اشتراک طلایی VIP با موفقیت صادر شد",
                  text: "رسید رسمی اشتراک ۳ ماهه شما به مبلغ ۲۹۰,۰۰۰ تومان ثبت و در بخش کیف پول قابل دریافت است.",
                  time: "دیروز",
                  unread: false,
                },
                {
                  id: "n4",
                  type: "learning",
                  icon: "📚",
                  title: "جزوه جدید واژگان ۵۰۴ به کتابخانه شما اضافه شد",
                  text: "نسخه ویرایش‌شده خلاصه واژگان نهایی پایه دوازدهم اکنون در تب کتابخانه برای دانلود قرار دارد.",
                  time: "۲ روز پیش",
                  unread: false,
                },
                {
                  id: "n5",
                  type: "system",
                  icon: "⚡",
                  title: "به‌روزرسانی موتور صوتی و تشخیص گفتار هوش مصنوعی",
                  text: "دقت تحلیل اسپیکینگ و ارزیابی تلفظ بریتیش/امریکن در بخش مرور واژگان ارتقا یافت.",
                  time: "۳ روز پیش",
                  unread: false,
                },
              ]
                .filter((n) => notifFilter === "all" || n.type === notifFilter)
                .map((n) => (
                  <div
                    key={n.id}
                    className={`${styles.notifItem} ${n.unread ? styles.notifUnread : ""}`}
                  >
                    <div style={{ fontSize: "1.5rem" }}>{n.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <strong style={{ fontSize: "0.95rem" }}>{n.title}</strong>
                        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{n.time}</span>
                      </div>
                      <p style={{ margin: "0.35rem 0 0", fontSize: "0.85rem", color: "#475569", lineHeight: 1.45 }}>
                        {n.text}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
              <button
                type="button"
                className={styles.changeAvatarBtn}
                onClick={() => showToast("تمامی اعلان‌ها به عنوان خوانده‌شده علامت‌گذاری شدند. ✨")}
              >
                ✓ علامت‌گذاری همه به عنوان خوانده‌شده
              </button>

              <div style={{ display: "flex", gap: "1rem", fontSize: "0.85rem", color: "#475569" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.35rem", cursor: "pointer" }}>
                  <input type="checkbox" defaultChecked /> دریافت پیامک یادآوری آزمون‌ها
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.35rem", cursor: "pointer" }}>
                  <input type="checkbox" defaultChecked /> پیامک تکمیل استریک
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------------
          Tab 8: پشتیبانی و حریم خصوصی (Support & Data Controls)
          -------------------------------------------------------------------------- */}
      {activeTab === "data" && (
        <div className={styles.tabContent}>
          <div className={styles.cardSection}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>
                  <span>📥</span>
                  <span>دانلود نسخه پشتیبان از اطلاعات و سوابق تحصیلی</span>
                </h2>
                <p className={styles.sectionSubtitle}>
                  یک نسخه کامل و ساختاریافته از تمامی سوابق مطالعه، واژگان ذخیره‌شده و کارنامه آزمون‌های خود را دانلود کنید.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", padding: "1.25rem", background: "#f8fafc", borderRadius: "1rem" }}>
              <div>
                <strong style={{ fontSize: "1rem" }}>خروجی کامل حساب (Export JSON)</strong>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#64748b" }}>
                  شامل اطلاعات فردی، تنظیمات تحصیلی، نماد انتخابی و تاریخچه پیشرفت در جعبه لایتنر.
                </p>
              </div>

              <button
                type="button"
                className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                onClick={handleExportData}
              >
                دانلود فایل سوابق من (JSON) ⬇️
              </button>
            </div>
          </div>

          <div className={styles.cardSection}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>
                  <span>💬</span>
                  <span>ارسال تیکت و پیام به پشتیبان آموزشی ایندورا</span>
                </h2>
                <p className={styles.sectionSubtitle}>
                  اگر در دسترسی به دروس، آزمون‌ها یا سوالات گرامر مشکلی دارید، مستقیماً برای ما پیام بگذارید.
                </p>
              </div>
            </div>

            <form onSubmit={handleSendTicket} style={{ maxWidth: "34rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>موضوع پیام</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="مثال: سوال درباره تست‌های ریدینگ آزمون نهایی"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>متن پیام یا سوال درسی</label>
                  <textarea
                    rows={4}
                    className={styles.formTextarea}
                    placeholder="متن پیام خود را به دقت بنویسید..."
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                  style={{ alignSelf: "flex-start" }}
                >
                  📩 ارسال تیکت به پشتیبان آموزشی
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------------
          Modal: 10-Avatar Selector Grid (پنجره بزرگ انتخاب ۱۰ نماد)
          -------------------------------------------------------------------------- */}
      {showAvatarModal && (
        <div
          className={styles.avatarModalBackdrop}
          onClick={() => setShowAvatarModal(false)}
        >
          <div
            className={styles.avatarModalCard}
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.75rem" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 800 }}>
                  🌟 انتخاب یکی از ۱۰ نماد قهرمانی و یادگیری پروفایل
                </h3>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#64748b" }}>
                  نمادی که متناسب با روحیه و هدف یادگیری شماست را انتخاب کنید:
                </p>
              </div>
              <button
                type="button"
                className={styles.changeAvatarBtn}
                style={{ fontSize: "1.25rem", color: "#64748b" }}
                onClick={() => setShowAvatarModal(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.avatarGrid}>
              {STUDENT_AVATARS.map((avatar) => {
                const isSelected = selectedAvatar.id === avatar.id;
                return (
                  <div
                    key={avatar.id}
                    className={`${styles.avatarOptionCard} ${isSelected ? styles.avatarOptionActive : ""}`}
                    onClick={() => handleSelectAvatar(avatar)}
                  >
                    {isSelected && <span className={styles.activeCheckmark}>✓</span>}
                    <div
                      className={styles.avatarOptionSymbol}
                      style={{
                        background: avatar.gradient,
                        boxShadow: `0 6px 16px ${avatar.glow}`,
                      }}
                    >
                      {avatar.symbol}
                    </div>
                    <div className={styles.avatarOptionName}>{avatar.name_fa}</div>
                    <div className={styles.avatarOptionTitle}>{avatar.title_fa}</div>
                    <div className={styles.avatarOptionMeaning}>{avatar.meaning_fa}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
              <button
                type="button"
                className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                onClick={() => setShowAvatarModal(false)}
              >
                تأیید و بستن پنجره ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------------
          Modal: فاکتور رسمی / رسید تراکنش
          -------------------------------------------------------------------------- */}
      {activeReceipt && (
        <div
          className={styles.avatarModalBackdrop}
          onClick={() => setActiveReceipt(null)}
        >
          <div
            className={`${styles.avatarModalCard} ${styles.receiptModal}`}
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div style={{ textAlign: "center", borderBottom: "2px dashed #cbd5e1", paddingBottom: "1rem", marginBottom: "1rem" }}>
              <span style={{ fontSize: "2rem" }}>🧾</span>
              <h3 style={{ margin: "0.25rem 0", fontSize: "1.2rem", fontWeight: 800 }}>
                رسید رسمی تراکنش آموزشی ایندورا
              </h3>
              <span style={{ fontSize: "0.8rem", color: "#10b981", fontWeight: 700 }}>
                ✓ پرداخت با موفقیت ثبت شد
              </span>
            </div>

            <div className={styles.receiptRow}>
              <span>عنوان خدمت:</span>
              <strong style={{ maxWidth: "16rem", textAlign: "left" }}>{activeReceipt.title}</strong>
            </div>

            <div className={styles.receiptRow}>
              <span>مبلغ پرداختی:</span>
              <strong style={{ color: "#1e40af" }}>{activeReceipt.amount}</strong>
            </div>

            <div className={styles.receiptRow}>
              <span>تاریخ و ساعت:</span>
              <span>{activeReceipt.date}</span>
            </div>

            <div className={styles.receiptRow}>
              <span>شناسه مرجع پیگیری:</span>
              <strong dir="ltr">{activeReceipt.refId}</strong>
            </div>

            <div className={styles.receiptRow}>
              <span>درگاه / شیوه پرداخت:</span>
              <span>{activeReceipt.gateway}</span>
            </div>

            <div className={styles.receiptRow}>
              <span>نام زبان‌آموز:</span>
              <span>{profile.fullName} ({profile.email})</span>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem", justifyContent: "flex-end" }}>
              <button
                type="button"
                className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
                onClick={() => {
                  window.print();
                }}
              >
                چاپ رسید 🖨️
              </button>
              <button
                type="button"
                className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                onClick={() => setActiveReceipt(null)}
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
