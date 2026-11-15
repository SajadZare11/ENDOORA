"use client";

import React, { useState, useEffect, useMemo } from "react";
import styles from "./marketing-growth.module.css";
import {
  type CouponRecord,
  type ReferralPartnerRecord,
  type FlashSaleCampaignRecord,
  type MarketingStats,
  type DiscountType,
  type ProductScope,
  type ReferralPartnerTier,
  type BannerTheme,
  INITIAL_COUPONS,
  INITIAL_REFERRAL_PARTNERS,
  INITIAL_FLASH_CAMPAIGN,
  INITIAL_MARKETING_STATS,
  PRODUCT_SCOPE_LABELS,
  PARTNER_TIER_LABELS,
} from "@/lib/marketing-content";

type ActiveDesk = "coupons" | "referral" | "campaign";

export default function MarketingGrowthConsole() {
  const [activeDesk, setActiveDesk] = useState<ActiveDesk>("coupons");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core data states
  const [coupons, setCoupons] = useState<CouponRecord[]>(INITIAL_COUPONS);
  const [partners, setPartners] = useState<ReferralPartnerRecord[]>(INITIAL_REFERRAL_PARTNERS);
  const [campaign, setCampaign] = useState<FlashSaleCampaignRecord>(INITIAL_FLASH_CAMPAIGN);
  const [stats, setStats] = useState<MarketingStats>(INITIAL_MARKETING_STATS);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [couponStatusFilter, setCouponStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [partnerTierFilter, setPartnerTierFilter] = useState<ReferralPartnerTier | "all">("all");

  // Modals state
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDesc, setNewCouponDesc] = useState("");
  const [newDiscountType, setNewDiscountType] = useState<DiscountType>("percentage");
  const [newDiscountValue, setNewDiscountValue] = useState<number>(20);
  const [newMaxCap, setNewMaxCap] = useState<string>("150000");
  const [newMinBasket, setNewMinBasket] = useState<string>("300000");
  const [newScope, setNewScope] = useState<ProductScope>("all");
  const [newMaxUsage, setNewMaxUsage] = useState<string>("200");
  const [newExpiresAt, setNewExpiresAt] = useState<string>("2026-12-31");
  const [newRestrictedPhones, setNewRestrictedPhones] = useState<string>("");

  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState("");
  const [newPartnerPhone, setNewPartnerPhone] = useState("");
  const [newReferralCode, setNewReferralCode] = useState("");
  const [newPartnerTier, setNewPartnerTier] = useState<ReferralPartnerTier>("influencer_gold");
  const [newFriendDiscount, setNewFriendDiscount] = useState<number>(20);
  const [newCommissionRate, setNewCommissionRate] = useState<number>(25);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Fetch live marketing data
  const refreshData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/marketing");
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          if (json.coupons) setCoupons(json.coupons);
          if (json.partners) setPartners(json.partners);
          if (json.campaign) setCampaign(json.campaign);
          if (json.stats) setStats(json.stats);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch marketing data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Filtered coupons
  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      if (couponStatusFilter === "active" && !c.isActive) return false;
      if (couponStatusFilter === "inactive" && c.isActive) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesCode = c.code.toLowerCase().includes(q);
        const matchesDesc = c.description.toLowerCase().includes(q);
        if (!matchesCode && !matchesDesc) return false;
      }
      return true;
    });
  }, [coupons, couponStatusFilter, searchQuery]);

  // Filtered partners
  const filteredPartners = useMemo(() => {
    return partners.filter((p) => {
      if (partnerTierFilter !== "all" && p.tier !== partnerTierFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesName = p.partnerName.toLowerCase().includes(q);
        const matchesCode = p.referralCode.toLowerCase().includes(q);
        const matchesPhone = p.partnerPhone.includes(q);
        if (!matchesName && !matchesCode && !matchesPhone) return false;
      }
      return true;
    });
  }, [partners, partnerTierFilter, searchQuery]);

  // Actions: Create Coupon
  const handleCreateCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) {
      showToast("❌ کد تخفیف الزامی است.");
      return;
    }

    try {
      const phones = newRestrictedPhones
        .split(/[,،\n]+/)
        .map((p) => p.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_coupon",
          couponData: {
            code: newCouponCode.trim(),
            description: newCouponDesc.trim() || `کد تخفیف ${newCouponCode}`,
            discountType: newDiscountType,
            discountValue: Number(newDiscountValue),
            maxDiscountCapToman: newDiscountType === "percentage" && newMaxCap ? Number(newMaxCap) : undefined,
            minBasketValueToman: Number(newMinBasket) || 0,
            scope: newScope,
            maxUsageTotal: Number(newMaxUsage) || 100,
            maxUsagePerUser: 1,
            startsAt: new Date().toISOString(),
            expiresAt: new Date(newExpiresAt).toISOString(),
            isActive: true,
            restrictedToPhones: phones.length > 0 ? phones : undefined,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`✅ ${data.message}`);
        setIsCouponModalOpen(false);
        setNewCouponCode("");
        setNewCouponDesc("");
        refreshData();
      } else {
        showToast(`❌ خطا: ${data.error}`);
      }
    } catch {
      showToast("❌ خطا در برقراری ارتباط با سرور");
    }
  };

  // Actions: Toggle Coupon
  const handleToggleCoupon = async (couponId: string) => {
    try {
      const res = await fetch("/api/admin/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_coupon", couponId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`🔄 ${data.message}`);
        refreshData();
      }
    } catch {
      showToast("❌ خطا در تغییر وضعیت کد تخفیف");
    }
  };

  // Actions: Delete Coupon
  const handleDeleteCoupon = async (couponId: string) => {
    if (!window.confirm("آیا از حذف این کد تخفیف اطمینان دارید؟")) return;
    try {
      const res = await fetch("/api/admin/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_coupon", couponId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("🗑️ کد تخفیف حذف گردید.");
        refreshData();
      }
    } catch {
      showToast("❌ خطا در حذف کد تخفیف");
    }
  };

  // Actions: Create Partner
  const handleCreatePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerName.trim() || !newReferralCode.trim()) {
      showToast("❌ نام و کد معرف الزامی است.");
      return;
    }

    try {
      const res = await fetch("/api/admin/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_partner",
          partnerData: {
            partnerUserId: `usr-part-${Date.now().toString(36)}`,
            partnerName: newPartnerName.trim(),
            partnerPhone: newPartnerPhone.trim() || "09120000000",
            referralCode: newReferralCode.trim(),
            tier: newPartnerTier,
            friendDiscountPercent: Number(newFriendDiscount),
            commissionRatePercent: Number(newCommissionRate),
            isActive: true,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`✅ ${data.message}`);
        setIsPartnerModalOpen(false);
        setNewPartnerName("");
        setNewReferralCode("");
        refreshData();
      } else {
        showToast(`❌ خطا: ${data.error}`);
      }
    } catch {
      showToast("❌ خطا در ثبت همکار جدید");
    }
  };

  // Actions: Toggle Campaign
  const handleToggleCampaign = async () => {
    try {
      const res = await fetch("/api/admin/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_campaign" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`🔥 ${data.message}`);
        refreshData();
      }
    } catch {
      showToast("❌ خطا در تغییر وضعیت کمپین");
    }
  };

  // Actions: Update Campaign
  const handleSaveCampaignDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_campaign",
          campaignData: campaign,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✅ ${data.message}`);
        refreshData();
      }
    } catch {
      showToast("❌ خطا در ذخیره تنظیمات کمپین");
    }
  };

  // Reset seed
  const handleResetSeed = async () => {
    if (!window.confirm("آیا از بازنشانی داده‌های نمونه بازاریابی به حالت اولیه اطمینان دارید؟")) return;
    try {
      const res = await fetch("/api/admin/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_seed" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("🔄 داده‌های بازاریابی بازنشانی شدند.");
        refreshData();
      }
    } catch {
      showToast("❌ خطا در بازنشانی");
    }
  };

  // Theme helper
  const getBannerThemeClass = (theme: BannerTheme) => {
    if (theme === "crimson") return styles.bannerThemeCrimson;
    if (theme === "gold_luxury") return styles.bannerThemeGold;
    if (theme === "emerald") return styles.bannerThemeEmerald;
    return styles.bannerThemeMidnight;
  };

  return (
    <div className={styles.container}>
      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            left: "2rem",
            background: "#0f172a",
            color: "#ffffff",
            padding: "0.85rem 1.5rem",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            zIndex: 9999,
            fontSize: "0.9rem",
            fontWeight: 700,
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Header Card */}
      <div className={styles.headerCard}>
        <div className={styles.headerInfo}>
          <h2 className={styles.headerTitle}>
            <span>🚀</span>
            مرکز فرماندهی بازاریابی و رشد (Marketing & Growth Engine)
          </h2>
          <p className={styles.headerDesc}>
            مدیریت هوشمند کدهای تخفیف، سیستم دوطرفه معرف و افیلیت، و راهبری کمپین‌های فروش شگفت‌انگیز با شمارش معکوس
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnNewCoupon} onClick={() => setIsCouponModalOpen(true)}>
            <span>+</span> ایجاد کد تخفیف جدید
          </button>
          <button className={styles.btnResetSeed} onClick={handleResetSeed}>
            <span>🔄</span> بازنشانی داده‌ها
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiTitle}>کدهای تخفیف فعال پلتفرم</span>
            <span className={styles.kpiIcon}>🎟️</span>
          </div>
          <div className={styles.kpiValue} style={{ color: "#db2777" }}>
            {stats.activeCouponsCount} کد معتبر
          </div>
          <div className={styles.kpiSub}>از میان {coupons.length} کوپن تعریف شده</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiTitle}>مجموع تخفیف‌های اعطا شده</span>
            <span className={styles.kpiIcon}>📉</span>
          </div>
          <div className={styles.kpiValue} style={{ color: "#059669" }}>
            {stats.totalDiscountsGivenToman.toLocaleString()}
            <span style={{ fontSize: "0.8rem", marginRight: "0.25rem", color: "#64748b" }}>تومان</span>
          </div>
          <div className={styles.kpiSub}>میانگین صرفه‌جویی هر کاربر: ۸۴,۰۰۰ ت</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiTitle}>درآمد از شبکه معرف‌ها (Affiliate)</span>
            <span className={styles.kpiIcon}>🤝</span>
          </div>
          <div className={styles.kpiValue} style={{ color: "#2563eb" }}>
            {stats.totalReferralRevenueToman.toLocaleString()}
            <span style={{ fontSize: "0.8rem", marginRight: "0.25rem", color: "#64748b" }}>تومان</span>
          </div>
          <div className={styles.kpiSub}>{stats.activePartnersCount} همکار و اینفلوئنسر فعال</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiTitle}>فروش کمپین شگفت‌انگیز جاری</span>
            <span className={styles.kpiIcon}>🔥</span>
          </div>
          <div className={styles.kpiValue} style={{ color: "#d97706" }}>
            {campaign.isActive ? campaign.totalRevenueGeneratedToman.toLocaleString() : "غیرفعال"}
            {campaign.isActive && (
              <span style={{ fontSize: "0.8rem", marginRight: "0.25rem", color: "#64748b" }}>تومان</span>
            )}
          </div>
          <div className={styles.kpiSub}>
            {campaign.isActive ? `${campaign.totalOrdersCount} سفارش ثبت شده` : "کمپین در حالت خاموش است"}
          </div>
        </div>
      </div>

      {/* Desk Switcher */}
      <div className={styles.deskNavCard}>
        <button
          className={`${styles.deskNavBtn} ${activeDesk === "coupons" ? styles.deskNavBtnActive : ""}`}
          onClick={() => setActiveDesk("coupons")}
        >
          <span>🎟️</span>
          کدهای تخفیف و کوپن‌ها
          <span className={styles.deskBadge}>{coupons.filter((c) => c.isActive).length} فعال</span>
        </button>

        <button
          className={`${styles.deskNavBtn} ${activeDesk === "referral" ? styles.deskNavBtnActive : ""}`}
          onClick={() => setActiveDesk("referral")}
        >
          <span>🤝</span>
          سیستم معرف و افیلیت
          <span className={styles.deskBadge}>{partners.length} همکار</span>
        </button>

        <button
          className={`${styles.deskNavBtn} ${activeDesk === "campaign" ? styles.deskNavBtnActive : ""}`}
          onClick={() => setActiveDesk("campaign")}
        >
          <span>🔥</span>
          کمپین شگفت‌انگیز و بنر تایمردار
          {campaign.isActive && (
            <span className={styles.deskBadge} style={{ background: "#fef3c7", color: "#92400e" }}>
              فعال روی سایت
            </span>
          )}
        </button>
      </div>

      {/* DESK 1: COUPONS */}
      {activeDesk === "coupons" && (
        <>
          <div className={styles.toolbarCard}>
            <div className={styles.searchRow}>
              <div className={styles.searchInputWrapper}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="جستجو در نام کد تخفیف یا توضیحات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.statusTabsRow}>
              <button
                className={`${styles.statusTabBtn} ${couponStatusFilter === "all" ? styles.statusTabBtnActive : ""}`}
                onClick={() => setCouponStatusFilter("all")}
              >
                همه ({coupons.length})
              </button>
              <button
                className={`${styles.statusTabBtn} ${couponStatusFilter === "active" ? styles.statusTabBtnActive : ""}`}
                onClick={() => setCouponStatusFilter("active")}
              >
                کدهای فعال ({coupons.filter((c) => c.isActive).length})
              </button>
              <button
                className={`${styles.statusTabBtn} ${couponStatusFilter === "inactive" ? styles.statusTabBtnActive : ""}`}
                onClick={() => setCouponStatusFilter("inactive")}
              >
                منقضی یا خاموش ({coupons.filter((c) => !c.isActive).length})
              </button>
            </div>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>کد تخفیف</th>
                    <th>شرح و هدف</th>
                    <th>میزان تخفیف</th>
                    <th>حداقل سبد و دامنه</th>
                    <th>میزان مصرف</th>
                    <th>مهلت انقضا</th>
                    <th>وضعیت</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoupons.map((coupon) => (
                    <tr key={coupon.id}>
                      <td>
                        <span className={styles.codeBadge}>{coupon.code}</span>
                      </td>
                      <td>
                        <div style={{ maxWidth: "230px" }}>
                          <strong style={{ color: "#0f172a", fontSize: "0.85rem" }}>{coupon.description}</strong>
                          {coupon.restrictedToPhones && (
                            <div style={{ fontSize: "0.72rem", color: "#db2777", marginTop: "0.2rem" }}>
                              🔒 انحصاری ({coupon.restrictedToPhones.length} شماره)
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                          <strong style={{ color: "#db2777", fontSize: "0.95rem" }}>
                            {coupon.discountType === "percentage"
                              ? `${coupon.discountValue}٪ تخفیف`
                              : `${coupon.discountValue.toLocaleString()} تومان`}
                          </strong>
                          {coupon.maxDiscountCapToman && (
                            <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                              سقف: {coupon.maxDiscountCapToman.toLocaleString()} ت
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                          <span className={styles.scopeBadge}>{PRODUCT_SCOPE_LABELS[coupon.scope]}</span>
                          <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                            حداقل سبد: {coupon.minBasketValueToman.toLocaleString()} ت
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <span style={{ fontWeight: 800 }}>
                            {coupon.usedCountTotal} / {coupon.maxUsageTotal}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                          {new Date(coupon.expiresAt).toLocaleDateString("fa-IR")}
                        </div>
                      </td>
                      <td>
                        {coupon.isActive ? (
                          <span className={`${styles.statusBadge} ${styles.statusActive}`}>فعال</span>
                        ) : (
                          <span className={`${styles.statusBadge} ${styles.statusInactive}`}>غیرفعال</span>
                        )}
                      </td>
                      <td>
                        <div className={styles.actionBtnsRow}>
                          <button
                            className={styles.btnSecondary}
                            onClick={() => handleToggleCoupon(coupon.id)}
                            title="تغییر وضعیت فعال/غیرفعال"
                          >
                            {coupon.isActive ? "خاموش" : "روشن"}
                          </button>
                          <button
                            className={styles.btnDanger}
                            onClick={() => handleDeleteCoupon(coupon.id)}
                            title="حذف کوپن"
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCoupons.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
                        هیچ کد تخفیفی با این مشخصات یافت نشد.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* DESK 2: REFERRAL PARTNERS */}
      {activeDesk === "referral" && (
        <>
          <div className={styles.toolbarCard}>
            <div className={styles.searchRow}>
              <div className={styles.searchInputWrapper}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="جستجو در نام همکار، شماره تماس یا کد معرف..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className={styles.btnNewCoupon} onClick={() => setIsPartnerModalOpen(true)}>
                <span>+</span> ثبت معرف / همکار جدید
              </button>
            </div>

            <div className={styles.statusTabsRow}>
              <button
                className={`${styles.statusTabBtn} ${partnerTierFilter === "all" ? styles.statusTabBtnActive : ""}`}
                onClick={() => setPartnerTierFilter("all")}
              >
                همه سطوح ({partners.length})
              </button>
              <button
                className={`${styles.statusTabBtn} ${partnerTierFilter === "influencer_gold" ? styles.statusTabBtnActive : ""}`}
                onClick={() => setPartnerTierFilter("influencer_gold")}
              >
                اینفلوئنسرها ({partners.filter((p) => p.tier === "influencer_gold").length})
              </button>
              <button
                className={`${styles.statusTabBtn} ${partnerTierFilter === "school_partner" ? styles.statusTabBtnActive : ""}`}
                onClick={() => setPartnerTierFilter("school_partner")}
              >
                مدارس و موسسات ({partners.filter((p) => p.tier === "school_partner").length})
              </button>
              <button
                className={`${styles.statusTabBtn} ${partnerTierFilter === "standard" ? styles.statusTabBtnActive : ""}`}
                onClick={() => setPartnerTierFilter("standard")}
              >
                کاربران عادی ({partners.filter((p) => p.tier === "standard").length})
              </button>
            </div>
          </div>

          <div className={styles.tableCard}>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>نام همکار / اینفلوئنسر</th>
                    <th>کد معرف اختصاصی</th>
                    <th>سطح همکاری</th>
                    <th>نرخ پاداش دوطرفه</th>
                    <th>تعداد دعوت و تبدیل‌ها</th>
                    <th>درآمد کل واریزی</th>
                    <th>طلب در انتظار تسویه</th>
                    <th>وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPartners.map((partner) => (
                    <tr key={partner.id}>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                          <strong style={{ color: "#0f172a" }}>{partner.partnerName}</strong>
                          <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{partner.partnerPhone}</span>
                        </div>
                      </td>
                      <td>
                        <span className={styles.codeBadge}>{partner.referralCode}</span>
                      </td>
                      <td>
                        <span
                          className={styles.scopeBadge}
                          style={{
                            background: partner.tier === "influencer_gold" ? "#fef3c7" : "#eff6ff",
                            color: partner.tier === "influencer_gold" ? "#b45309" : "#1d4ed8",
                          }}
                        >
                          {PARTNER_TIER_LABELS[partner.tier].labelFa}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: "0.8rem", display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                          <span>
                            تخفیف دوست: <strong>{partner.friendDiscountPercent}٪</strong>
                          </span>
                          <span style={{ color: "#059669" }}>
                            پورسانت معرف: <strong>{partner.commissionRatePercent}٪</strong>
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: "0.85rem" }}>
                          <strong>{partner.successfulConversionsCount}</strong> خرید از میان {partner.totalInvitedCount} کلیک
                        </div>
                      </td>
                      <td>
                        <strong style={{ color: "#059669" }}>
                          {partner.totalEarningsToman.toLocaleString()} تومان
                        </strong>
                      </td>
                      <td>
                        <strong style={{ color: "#d97706" }}>
                          {partner.pendingPayoutToman.toLocaleString()} تومان
                        </strong>
                      </td>
                      <td>
                        {partner.isActive ? (
                          <span className={`${styles.statusBadge} ${styles.statusActive}`}>فعال</span>
                        ) : (
                          <span className={`${styles.statusBadge} ${styles.statusInactive}`}>مسدود</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* DESK 3: FLASH SALE CAMPAIGN */}
      {activeDesk === "campaign" && (
        <div className={styles.campaignContainer}>
          {/* Live Preview Box */}
          <div className={`${styles.campaignBannerPreview} ${getBannerThemeClass(campaign.bannerTheme)}`}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", maxWidth: "450px" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 700, opacity: 0.9 }}>
                ⚡ پیش‌نمایش بنر سراسری در هدر سایت
              </span>
              <h3 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800 }}>{campaign.titleFa}</h3>
              <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.9 }}>{campaign.taglineFa}</p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
              <div className={styles.timerBox}>
                <div className={styles.timerSegment}>
                  <span className={styles.timerNumber}>۰۴</span>
                  <span className={styles.timerLabel}>روز</span>
                </div>
                <div className={styles.timerSegment}>
                  <span className={styles.timerNumber}>۱۸</span>
                  <span className={styles.timerLabel}>ساعت</span>
                </div>
                <div className={styles.timerSegment}>
                  <span className={styles.timerNumber}>۳۲</span>
                  <span className={styles.timerLabel}>دقیقه</span>
                </div>
                <div className={styles.timerSegment}>
                  <span className={styles.timerNumber}>۱۵</span>
                  <span className={styles.timerLabel}>ثانیه</span>
                </div>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  color: "#0f172a",
                  padding: "0.6rem 1.25rem",
                  borderRadius: "10px",
                  fontWeight: 800,
                  fontSize: "0.88rem",
                }}
              >
                {campaign.ctaButtonTextFa}
              </div>
            </div>
          </div>

          {/* Campaign Form */}
          <div className={styles.tableCard} style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div>
                <h3 style={{ margin: "0 0 0.35rem 0", fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>
                  تنظیمات کمپین شگفت‌انگیز و تخفیف سراسری پلن‌ها
                </h3>
                <p style={{ margin: 0, fontSize: "0.82rem", color: "#64748b" }}>
                  با فعال‌سازی این بخش، بنر فوق در بالای تمامی صفحات نمایش داده شده و قیمت اشتراک‌ها به صورت خودکار خط‌خورده محاسبه می‌شود.
                </p>
              </div>
              <button
                type="button"
                className={campaign.isActive ? styles.btnDanger : styles.btnPrimary}
                style={{ padding: "0.65rem 1.25rem", fontSize: "0.9rem" }}
                onClick={handleToggleCampaign}
              >
                {campaign.isActive ? "🔴 غیرفعال‌سازی فوری کمپین (Kill Switch)" : "🟢 فعال‌سازی کمپین روی سایت"}
              </button>
            </div>

            <form onSubmit={handleSaveCampaignDetails} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div className={styles.campaignEditGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>عنوان اصلی جشنواره یا کمپین:</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={campaign.titleFa}
                    onChange={(e) => setCampaign({ ...campaign, titleFa: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>شعار تبلیغاتی بنر:</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={campaign.taglineFa}
                    onChange={(e) => setCampaign({ ...campaign, taglineFa: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>درصد تخفیف سراسری (خط‌خورده روی پلن‌ها):</label>
                  <input
                    type="number"
                    min={5}
                    max={80}
                    className={styles.input}
                    value={campaign.discountPercent}
                    onChange={(e) => setCampaign({ ...campaign, discountPercent: Number(e.target.value) })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>تم رنگی بنر شمارش معکوس:</label>
                  <select
                    className={styles.select}
                    value={campaign.bannerTheme}
                    onChange={(e) => setCampaign({ ...campaign, bannerTheme: e.target.value as BannerTheme })}
                  >
                    <option value="midnight">شب پرتوانی (Midnight Indigo)</option>
                    <option value="gold_luxury">طلایی فاخر (Luxury Gold)</option>
                    <option value="crimson">زرشکی جشنواره (Crimson Rose)</option>
                    <option value="emerald">سبز زمردی (Emerald Green)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>متن دکمه هدایت (CTA):</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={campaign.ctaButtonTextFa}
                    onChange={(e) => setCampaign({ ...campaign, ctaButtonTextFa: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>لینک دکمه:</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={campaign.ctaLink}
                    onChange={(e) => setCampaign({ ...campaign, ctaLink: e.target.value })}
                    dir="ltr"
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
                <button type="submit" className={styles.btnPrimary} style={{ padding: "0.75rem 2rem", fontSize: "0.9rem" }}>
                  ذخیره تغییرات کمپین
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE COUPON */}
      {isCouponModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsCouponModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <span>🎟️</span> ایجاد کد تخفیف جدید
              </h3>
              <button className={styles.modalCloseBtn} onClick={() => setIsCouponModalOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateCouponSubmit}>
              <div className={styles.modalBody}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>کد تخفیف (حروف انگلیسی/اعداد):</label>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="مثال: YALDA35"
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value)}
                      dir="ltr"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>نوع محاسبه تخفیف:</label>
                    <select
                      className={styles.select}
                      value={newDiscountType}
                      onChange={(e) => setNewDiscountType(e.target.value as DiscountType)}
                    >
                      <option value="percentage">درصدی (٪)</option>
                      <option value="fixed_toman">مبلغ ثابت تومانی</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>شرح و توضیحات کوپن:</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="مثال: تخفیف ویژه اشتراک طلایی برای آزمون جامع آیلتس"
                    value={newCouponDesc}
                    onChange={(e) => setNewCouponDesc(e.target.value)}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      مقدار تخفیف {newDiscountType === "percentage" ? "(درصد)" : "(تومان)"}:
                    </label>
                    <input
                      type="number"
                      className={styles.input}
                      value={newDiscountValue}
                      onChange={(e) => setNewDiscountValue(Number(e.target.value))}
                      required
                    />
                  </div>

                  {newDiscountType === "percentage" && (
                    <div className={styles.formGroup}>
                      <label className={styles.label}>سقف تخفیف (تومان - اختیاری):</label>
                      <input
                        type="number"
                        className={styles.input}
                        placeholder="مثال: 150000"
                        value={newMaxCap}
                        onChange={(e) => setNewMaxCap(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>حداقل مبلغ سفارش (تومان):</label>
                    <input
                      type="number"
                      className={styles.input}
                      value={newMinBasket}
                      onChange={(e) => setNewMinBasket(e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>دامنه مصرف در پلتفرم:</label>
                    <select
                      className={styles.select}
                      value={newScope}
                      onChange={(e) => setNewScope(e.target.value as ProductScope)}
                    >
                      <option value="all">تمامی خدمات پلتفرم</option>
                      <option value="subscription">فقط اشتراک‌های طلایی</option>
                      <option value="session_1on1">فقط جلسات خصوصی ۱ به ۱</option>
                      <option value="course_package">فقط بسته‌های دوره‌ای و ماک</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>حداکثر سقف کل استفاده:</label>
                    <input
                      type="number"
                      className={styles.input}
                      value={newMaxUsage}
                      onChange={(e) => setNewMaxUsage(e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>تاریخ انقضا:</label>
                    <input
                      type="date"
                      className={styles.input}
                      value={newExpiresAt}
                      onChange={(e) => setNewExpiresAt(e.target.value)}
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    شماره موبایل‌های انحصاری Win-Back (اختیاری - با ویرگول جدا شود):
                  </label>
                  <textarea
                    className={styles.textarea}
                    placeholder="مثال: 09121112233, 09354445566 (در صورت خالی بودن، برای همه مجاز است)"
                    value={newRestrictedPhones}
                    onChange={(e) => setNewRestrictedPhones(e.target.value)}
                    dir="ltr"
                  />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.btnSecondary} onClick={() => setIsCouponModalOpen(false)}>
                  انصراف
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  ثبت و انتشار کد تخفیف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE PARTNER */}
      {isPartnerModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsPartnerModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <span>🤝</span> ثبت همکار و اینفلوئنسر جدید (Affiliate)
              </h3>
              <button className={styles.modalCloseBtn} onClick={() => setIsPartnerModalOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleCreatePartnerSubmit}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>نام کامل همکار یا عنوان چنل / پیج:</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="مثال: استاد مریم راد (پیج اینستاگرام MaryamEnglish)"
                    value={newPartnerName}
                    onChange={(e) => setNewPartnerName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>شماره موبایل همکار:</label>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="0912..."
                      value={newPartnerPhone}
                      onChange={(e) => setNewPartnerPhone(e.target.value)}
                      dir="ltr"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>کد معرف اختصاصی:</label>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="مثال: MARYAM-VIP"
                      value={newReferralCode}
                      onChange={(e) => setNewReferralCode(e.target.value)}
                      dir="ltr"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>سطح همکار (Tier):</label>
                  <select
                    className={styles.select}
                    value={newPartnerTier}
                    onChange={(e) => setNewPartnerTier(e.target.value as ReferralPartnerTier)}
                  >
                    <option value="influencer_gold">اینفلوئنسر و پارتنر ارشد (طلایی)</option>
                    <option value="school_partner">مدرسه و موسسه آموزشی همکار</option>
                    <option value="standard">معرف عادی (دانشجویان و سفرا)</option>
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>درصد تخفیف دوست دعوت‌شده:</label>
                    <input
                      type="number"
                      min={5}
                      max={50}
                      className={styles.input}
                      value={newFriendDiscount}
                      onChange={(e) => setNewFriendDiscount(Number(e.target.value))}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>درصد پورسانت معرف از خرید:</label>
                    <input
                      type="number"
                      min={5}
                      max={50}
                      className={styles.input}
                      value={newCommissionRate}
                      onChange={(e) => setNewCommissionRate(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.btnSecondary} onClick={() => setIsPartnerModalOpen(false)}>
                  انصراف
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  ثبت نهایی همکار
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
