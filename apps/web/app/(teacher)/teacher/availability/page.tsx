"use client";

import React, { useState, useEffect } from "react";
import styles from "./availability.module.css";
import {
  fetchTeacherAvailability,
  saveTeacherWeeklySchedule,
  fetchTeacherTimeOff,
  addTeacherTimeOff,
  deleteTeacherTimeOff,
  updateTeacherAvailabilitySettings,
  TeacherTimeOff,
  TeacherAvailabilitySetting,
} from "@/lib/marketplace";

interface DayScheduleState {
  day_of_week: number;
  day_name: string;
  is_active: boolean;
  slots: Array<{
    id?: string;
    start_time: string;
    end_time: string;
  }>;
}

const PERSIAN_DAYS: Array<{ day: number; name: string }> = [
  { day: 0, name: "شنبه" },
  { day: 1, name: "یک‌شنبه" },
  { day: 2, name: "دوشنبه" },
  { day: 3, name: "سه‌شنبه" },
  { day: 4, name: "چهارشنبه" },
  { day: 5, name: "پنج‌شنبه" },
  { day: 6, name: "جمعه" },
];

export default function TeacherAvailabilityPage() {
  const [activeTab, setActiveTab] = useState<"schedule" | "timeoff" | "settings">("schedule");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [isVerified, setIsVerified] = useState(false);
  const [marketplaceEligible, setMarketplaceEligible] = useState(false);

  // Weekly schedule state: map 0..6
  const [weekSchedule, setWeekSchedule] = useState<Record<number, DayScheduleState>>(() => {
    const initial: Record<number, DayScheduleState> = {};
    PERSIAN_DAYS.forEach((d) => {
      initial[d.day] = {
        day_of_week: d.day,
        day_name: d.name,
        is_active: d.day !== 6, // Default Friday inactive
        slots: [{ start_time: "09:00", end_time: "13:00" }],
      };
    });
    return initial;
  });

  // Time off state
  const [timeOffs, setTimeOffs] = useState<TeacherTimeOff[]>([]);
  const [toStart, setToStart] = useState("");
  const [toEnd, setToEnd] = useState("");
  const [toReason, setToReason] = useState("");
  const [toFullDay, setToFullDay] = useState(false);
  const [toConflict, setToConflict] = useState<string | null>(null);

  // Settings state
  const [settings, setSettings] = useState<TeacherAvailabilitySetting>({
    notice_lead_time_hours: 12,
    max_booking_ahead_days: 14,
    default_session_duration_minutes: 45,
    default_buffer_minutes: 15,
    auto_accept_bookings: true,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [availData, toData] = await Promise.all([
          fetchTeacherAvailability(),
          fetchTeacherTimeOff(),
        ]);

        if (cancelled) return;

        setIsVerified(availData.is_verified);
        setMarketplaceEligible(availData.marketplace_eligible);

        if (availData.settings) {
          setSettings(availData.settings);
        }

        // Populate weekSchedule
        if (availData.schedule && availData.schedule.length > 0) {
          const updated: Record<number, DayScheduleState> = {};
          PERSIAN_DAYS.forEach((d) => {
            const daySlots = availData.schedule.filter((s) => s.day_of_week === d.day);
            if (daySlots.length > 0) {
              updated[d.day] = {
                day_of_week: d.day,
                day_name: d.name,
                is_active: daySlots.some((s) => s.is_active),
                slots: daySlots.map((s) => ({
                  id: s.id,
                  start_time: s.start_time_str || s.start_time.slice(0, 5),
                  end_time: s.end_time_str || s.end_time.slice(0, 5),
                })),
              };
            } else {
              updated[d.day] = {
                day_of_week: d.day,
                day_name: d.name,
                is_active: false,
                slots: [],
              };
            }
          });
          setWeekSchedule(updated);
        }

        setTimeOffs(toData.time_offs || []);
      } catch (err: unknown) {
        if (!cancelled) {
          const errMsg = err instanceof Error ? err.message : "خطا در بارگذاری اطلاعات زمان‌بندی";
          setMessage({ text: errMsg, type: "error" });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  // Schedule slot actions
  const toggleDayActive = (day: number) => {
    setWeekSchedule((prev) => {
      const current = prev[day];
      const newActive = !current.is_active;
      return {
        ...prev,
        [day]: {
          ...current,
          is_active: newActive,
          slots:
            newActive && current.slots.length === 0
              ? [{ start_time: "09:00", end_time: "13:00" }]
              : current.slots,
        },
      };
    });
  };

  const addSlotToDay = (day: number) => {
    setWeekSchedule((prev) => {
      const current = prev[day];
      return {
        ...prev,
        [day]: {
          ...current,
          is_active: true,
          slots: [...current.slots, { start_time: "14:00", end_time: "18:00" }],
        },
      };
    });
  };

  const removeSlotFromDay = (day: number, slotIndex: number) => {
    setWeekSchedule((prev) => {
      const current = prev[day];
      const updatedSlots = current.slots.filter((_, idx) => idx !== slotIndex);
      return {
        ...prev,
        [day]: {
          ...current,
          slots: updatedSlots,
          is_active: updatedSlots.length > 0 ? current.is_active : false,
        },
      };
    });
  };

  const updateSlotTimes = (
    day: number,
    slotIndex: number,
    field: "start_time" | "end_time",
    value: string
  ) => {
    setWeekSchedule((prev) => {
      const current = prev[day];
      const updatedSlots = current.slots.map((s, idx) =>
        idx === slotIndex ? { ...s, [field]: value } : s
      );
      return {
        ...prev,
        [day]: {
          ...current,
          slots: updatedSlots,
        },
      };
    });
  };

  // Presets
  const applyPreset = (type: "morning" | "evening" | "full" | "clear") => {
    setWeekSchedule((prev) => {
      const updated: Record<number, DayScheduleState> = {};
      PERSIAN_DAYS.forEach((d) => {
        if (type === "clear") {
          updated[d.day] = {
            ...prev[d.day],
            is_active: false,
            slots: [],
          };
        } else if (d.day === 6) {
          // Friday off
          updated[d.day] = {
            ...prev[d.day],
            is_active: false,
            slots: [],
          };
        } else {
          let slots: Array<{ start_time: string; end_time: string }> = [];
          if (type === "morning") {
            slots = [{ start_time: "09:00", end_time: "13:00" }];
          } else if (type === "evening") {
            slots = [{ start_time: "14:00", end_time: "19:00" }];
          } else if (type === "full") {
            slots = [
              { start_time: "09:00", end_time: "13:00" },
              { start_time: "15:00", end_time: "19:00" },
            ];
          }
          updated[d.day] = {
            ...prev[d.day],
            is_active: true,
            slots,
          };
        }
      });
      return updated;
    });
    setMessage({ text: "الگوی زمانی با موفقیت اعمال شد. برای نهایی‌سازی، دکمه ذخیره را بزنید.", type: "success" });
  };

  // Save Schedule
  const handleSaveSchedule = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const slotsPayload: Array<{
        day_of_week: number;
        start_time: string;
        end_time: string;
        is_active: boolean;
      }> = [];

      Object.values(weekSchedule).forEach((dayState) => {
        if (dayState.is_active) {
          dayState.slots.forEach((s) => {
            slotsPayload.push({
              day_of_week: dayState.day_of_week,
              start_time: s.start_time.length === 5 ? `${s.start_time}:00` : s.start_time,
              end_time: s.end_time.length === 5 ? `${s.end_time}:00` : s.end_time,
              is_active: true,
            });
          });
        }
      });

      const res = await saveTeacherWeeklySchedule(slotsPayload);
      setMessage({ text: res.message || "برنامه هفتگی با موفقیت ذخیره شد.", type: "success" });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "خطا در ذخیره‌سازی برنامه هفتگی";
      setMessage({ text: errMsg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // Add Time-Off
  const handleAddTimeOff = async (e: React.FormEvent) => {
    e.preventDefault();
    setToConflict(null);
    if (!toStart || !toEnd) {
      setMessage({ text: "لطفاً تاریخ و زمان آغاز و پایان مرخصی را وارد کنید.", type: "error" });
      return;
    }

    setSaving(true);
    try {
      const startIso = new Date(toStart).toISOString();
      const endIso = new Date(toEnd).toISOString();

      await addTeacherTimeOff({
        start_datetime: startIso,
        end_datetime: endIso,
        reason: toReason,
        is_full_day: toFullDay,
      });

      setMessage({ text: "بازه مرخصی با موفقیت ثبت شد.", type: "success" });
      setToStart("");
      setToEnd("");
      setToReason("");
      setToFullDay(false);

      const toData = await fetchTeacherTimeOff();
      setTimeOffs(toData.time_offs || []);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "خطا در ثبت مرخصی";
      setToConflict(errMsg);
      setMessage({ text: errMsg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // Delete Time-Off
  const handleDeleteTimeOff = async (id: string) => {
    if (!confirm("آیا از حذف این بازه مرخصی اطمینان دارید؟")) return;
    setSaving(true);
    try {
      await deleteTeacherTimeOff(id);
      setTimeOffs((prev) => prev.filter((item) => item.id !== id));
      setMessage({ text: "بازه مرخصی حذف شد.", type: "success" });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "خطا در حذف مرخصی";
      setMessage({ text: errMsg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await updateTeacherAvailabilitySettings(settings);
      setMessage({ text: res.message || "تنظیمات رزرو با موفقیت بروزرسانی شد.", type: "success" });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "خطا در ذخیره‌سازی تنظیمات";
      setMessage({ text: errMsg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header Card */}
      <section className={styles.headerCard}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>مدیریت دسترسی و ساعات تدریس</h1>
          <div
            className={`${styles.statusBadge} ${
              isVerified && marketplaceEligible
                ? styles.statusBadgeSuccess
                : styles.statusBadgeWarning
            }`}
          >
            {isVerified && marketplaceEligible
              ? "✓ مدرس مجاز به رزرو در بازارگاه"
              : "⚠ نیازمند تکمیل مدارک و احراز هویت"}
          </div>
        </div>
        <p className={styles.description}>
          ساعات هفتگی تکرارشونده تدریس خود را تعیین کنید، بازه‌های مرخصی و تعطیلات را مشخص نمایید، و سیاست‌های رزرو جلسات را شخصی‌سازی کنید.
        </p>

        {/* Tab Navigation */}
        <div className={styles.tabBar}>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === "schedule" ? styles.tabButtonActive : ""}`}
            onClick={() => setActiveTab("schedule")}
          >
            📅 برنامه هفتگی تکرارشونده
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === "timeoff" ? styles.tabButtonActive : ""}`}
            onClick={() => setActiveTab("timeoff")}
          >
            🏖️ مرخصی‌ها و تعطیلات ({timeOffs.length})
          </button>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === "settings" ? styles.tabButtonActive : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            ⚙️ سیاست‌ها و تنظیمات رزرو
          </button>
        </div>
      </section>

      {/* Global Status Message */}
      {message && (
        <div
          className={`${styles.alertBox} ${
            message.type === "success" ? styles.alertSuccess : styles.alertError
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <div className={styles.card}>
          <p className={styles.description}>در حال دریافت اطلاعات ساعات کاری...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: WEEKLY SCHEDULE */}
          {activeTab === "schedule" && (
            <div className={styles.daysList}>
              {/* Presets Toolbar */}
              <div className={styles.presetsBar}>
                <span className={styles.presetLabel}>الگوهای سریع:</span>
                <button
                  type="button"
                  className={styles.presetBtn}
                  onClick={() => applyPreset("morning")}
                >
                  صبح‌ها (۰۹:۰۰ تا ۱۳:۰۰)
                </button>
                <button
                  type="button"
                  className={styles.presetBtn}
                  onClick={() => applyPreset("evening")}
                >
                  عصرها (۱۴:۰۰ تا ۱۹:۰۰)
                </button>
                <button
                  type="button"
                  className={styles.presetBtn}
                  onClick={() => applyPreset("full")}
                >
                  تمام‌وقت (صبح و عصر)
                </button>
                <button
                  type="button"
                  className={styles.presetBtn}
                  onClick={() => applyPreset("clear")}
                >
                  پاک‌کردن همه
                </button>
              </div>

              {/* Day Cards */}
              {PERSIAN_DAYS.map(({ day, name }) => {
                const dayState = weekSchedule[day];
                return (
                  <div
                    key={day}
                    className={`${styles.dayCard} ${
                      dayState.is_active ? styles.dayCardActive : styles.dayCardInactive
                    }`}
                  >
                    <div className={styles.dayHeader}>
                      <div className={styles.dayTitleWrap}>
                        <input
                          type="checkbox"
                          id={`day-${day}`}
                          className={styles.dayCheckbox}
                          checked={dayState.is_active}
                          onChange={() => toggleDayActive(day)}
                        />
                        <label htmlFor={`day-${day}`} className={styles.dayName}>
                          {name}
                        </label>
                      </div>

                      {dayState.is_active && (
                        <button
                          type="button"
                          className={styles.addSlotBtn}
                          onClick={() => addSlotToDay(day)}
                        >
                          + بازه جدید
                        </button>
                      )}
                    </div>

                    {/* Slots in Day */}
                    {dayState.is_active ? (
                      dayState.slots.length > 0 ? (
                        <div className={styles.slotsRowList}>
                          {dayState.slots.map((slot, sIdx) => (
                            <div key={sIdx} className={styles.slotItem}>
                              <input
                                type="time"
                                className={styles.slotTimeInput}
                                value={slot.start_time}
                                onChange={(e) =>
                                  updateSlotTimes(day, sIdx, "start_time", e.target.value)
                                }
                              />
                              <span className={styles.slotSeparator}>تا</span>
                              <input
                                type="time"
                                className={styles.slotTimeInput}
                                value={slot.end_time}
                                onChange={(e) =>
                                  updateSlotTimes(day, sIdx, "end_time", e.target.value)
                                }
                              />
                              <button
                                type="button"
                                className={styles.deleteSlotBtn}
                                onClick={() => removeSlotFromDay(day, sIdx)}
                                title="حذف این بازه"
                              >
                                ✕ حذف
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className={styles.noSlotsText}>
                          هیچ بازه فعالی برای این روز تعریف نشده است.
                        </span>
                      )
                    ) : (
                      <span className={styles.noSlotsText}>غیرفعال در این روز</span>
                    )}
                  </div>
                );
              })}

              {/* Actions Footer */}
              <div className={styles.actionsFooter}>
                <button
                  type="button"
                  className={styles.primaryBtn}
                  disabled={saving}
                  onClick={handleSaveSchedule}
                >
                  {saving ? "در حال ذخیره..." : "ذخیره تغییرات برنامه هفتگی"}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: TIME OFF */}
          {activeTab === "timeoff" && (
            <div className={styles.daysList}>
              {/* Add Time-Off Form */}
              <form onSubmit={handleAddTimeOff} className={styles.card}>
                <h2 className={styles.cardTitle}>ثبت مرخصی یا بازه تعطیلی جدید</h2>
                <p className={styles.description}>
                  در طول بازه مرخصی، اسلات‌های مربوطه در تقویم رزرو زبان‌آموزان مسدود شده و امکان دریافت رزرو نخواهد بود.
                </p>

                {toConflict && (
                  <div className={`${styles.alertBox} ${styles.alertError}`}>
                    <strong>خطای هم‌پوشانی: </strong>
                    {toConflict}
                  </div>
                )}

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>آغاز مرخصی</label>
                    <input
                      type="datetime-local"
                      className={styles.input}
                      value={toStart}
                      onChange={(e) => setToStart(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>پایان مرخصی</label>
                    <input
                      type="datetime-local"
                      className={styles.input}
                      value={toEnd}
                      onChange={(e) => setToEnd(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>علت یا یادداشت (اختیاری)</label>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="مثلاً: سفر خانوادگی، امتحانات دانشگاه"
                      value={toReason}
                      onChange={(e) => setToReason(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.toggleRow}>
                  <input
                    type="checkbox"
                    id="toFullDay"
                    className={styles.dayCheckbox}
                    checked={toFullDay}
                    onChange={(e) => setToFullDay(e.target.checked)}
                  />
                  <label htmlFor="toFullDay" className={styles.label}>
                    مرخصی به صورت تمام‌روز است
                  </label>
                </div>

                <div className={styles.actionsFooter}>
                  <button type="submit" className={styles.primaryBtn} disabled={saving}>
                    {saving ? "در حال ثبت..." : "+ ثبت بازه مرخصی"}
                  </button>
                </div>
              </form>

              {/* Time-Off List */}
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>مرخصی‌های فعال و ثبت‌شده</h2>
                {timeOffs.length === 0 ? (
                  <p className={styles.noSlotsText}>هیچ بازه مرخصی فعالی ثبت نشده است.</p>
                ) : (
                  <div className={styles.timeOffList}>
                    {timeOffs.map((item) => (
                      <div key={item.id} className={styles.timeOffItem}>
                        <div className={styles.timeOffInfo}>
                          <span className={styles.timeOffDates}>
                            از {item.start_display} تا {item.end_display}
                          </span>
                          {item.reason && (
                            <span className={styles.timeOffReason}>علت: {item.reason}</span>
                          )}
                        </div>
                        <button
                          type="button"
                          className={styles.dangerBtn}
                          onClick={() => handleDeleteTimeOff(item.id)}
                          disabled={saving}
                        >
                          ✕ لغو مرخصی
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: BOOKING SETTINGS */}
          {activeTab === "settings" && (
            <form onSubmit={handleSaveSettings} className={styles.card}>
              <h2 className={styles.cardTitle}>تنظیمات و سیاست‌های زمان‌بندی جلسات</h2>
              <p className={styles.description}>
                این پارامترها تعیین می‌کنند زبان‌آموزان با چه پیش‌شرط‌هایی قادر به رزرو اسلات‌های آزاد شما باشند.
              </p>

              <div className={styles.settingsGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>حداقل فاصله رزرو تا شروع جلسه (Lead Time)</label>
                  <select
                    className={styles.select}
                    value={settings.notice_lead_time_hours}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notice_lead_time_hours: Number(e.target.value),
                      })
                    }
                  >
                    <option value={6}>۶ ساعت قبل از جلسه</option>
                    <option value={12}>۱۲ ساعت قبل از جلسه (پیش‌فرض)</option>
                    <option value={24}>۲۴ ساعت قبل از جلسه (یک روز کامل)</option>
                    <option value={48}>۴۸ ساعت قبل از جلسه (دو روز قبل)</option>
                  </select>
                  <span className={styles.helperText}>
                    اسلات‌های کمتر از این فاصله زمانی به عنوان رزرو فوری مسدود می‌شوند.
                  </span>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>افق مجاز رزرو از قبل (Booking Horizon)</label>
                  <select
                    className={styles.select}
                    value={settings.max_booking_ahead_days}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        max_booking_ahead_days: Number(e.target.value),
                      })
                    }
                  >
                    <option value={7}>تا ۷ روز آینده (۱ هفته)</option>
                    <option value={14}>تا ۱۴ روز آینده (۲ هفته - پیش‌فرض)</option>
                    <option value={30}>تا ۳۰ روز آینده (۱ ماه)</option>
                    <option value={60}>تا ۶۰ روز آینده (۲ ماه)</option>
                  </select>
                  <span className={styles.helperText}>
                    زبان‌آموز حداکثر تا چند روز آینده می‌تواند زمان‌های شما را مشاهده و رزرو کند.
                  </span>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>مدت پیش‌فرض هر جلسه تدریس</label>
                  <select
                    className={styles.select}
                    value={settings.default_session_duration_minutes}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        default_session_duration_minutes: Number(e.target.value),
                      })
                    }
                  >
                    <option value={30}>۳۰ دقیقه</option>
                    <option value={45}>۴۵ دقیقه (استاندارد اندورا)</option>
                    <option value={60}>۶۰ دقیقه (۱ ساعت کامل)</option>
                    <option value={90}>۹۰ دقیقه</option>
                  </select>
                  <span className={styles.helperText}>
                    طول هر جلسه برای برش‌زدن بلوک‌های کاری هفتگی.
                  </span>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>فاصله استراحت بین دو جلسه (Buffer)</label>
                  <select
                    className={styles.select}
                    value={settings.default_buffer_minutes}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        default_buffer_minutes: Number(e.target.value),
                      })
                    }
                  >
                    <option value={0}>بدون استراحت (۰ دقیقه)</option>
                    <option value={10}>۱۰ دقیقه استراحت</option>
                    <option value={15}>۱۵ دقیقه استراحت (توصیه‌شده)</option>
                    <option value={30}>۳۰ دقیقه استراحت</option>
                  </select>
                  <span className={styles.helperText}>
                    فاصله زمانی خودکار جهت استراحت و آماده‌سازی بین دو کلاس پیوسته.
                  </span>
                </div>
              </div>

              <div className={styles.toggleRow}>
                <input
                  type="checkbox"
                  id="autoAccept"
                  className={styles.dayCheckbox}
                  checked={settings.auto_accept_bookings}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      auto_accept_bookings: e.target.checked,
                    })
                  }
                />
                <label htmlFor="autoAccept" className={styles.label}>
                  تأیید خودکار رزروهای منطبق با زمان‌های باز تقویم من
                </label>
              </div>

              <div className={styles.actionsFooter}>
                <button type="submit" className={styles.primaryBtn} disabled={saving}>
                  {saving ? "در حال ذخیره..." : "ذخیره تنظیمات رزرو"}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
