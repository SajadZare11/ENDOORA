export type DayOfWeek =
  | "شنبه"
  | "یکشنبه"
  | "دوشنبه"
  | "سه‌شنبه"
  | "چهارشنبه"
  | "پنج‌شنبه"
  | "جمعه";

export const PERSIAN_DAYS: { key: string; fa: DayOfWeek; en: string; dayIndex: number }[] = [
  { key: "sat", fa: "شنبه", en: "Saturday", dayIndex: 6 },
  { key: "sun", fa: "یکشنبه", en: "Sunday", dayIndex: 0 },
  { key: "mon", fa: "دوشنبه", en: "Monday", dayIndex: 1 },
  { key: "tue", fa: "سه‌شنبه", en: "Tuesday", dayIndex: 2 },
  { key: "wed", fa: "چهارشنبه", en: "Wednesday", dayIndex: 3 },
  { key: "thu", fa: "پنج‌شنبه", en: "Thursday", dayIndex: 4 },
  { key: "fri", fa: "جمعه", en: "Friday", dayIndex: 5 },
];

export interface ClassScheduleInfo {
  scheduleDays: string[];
  startTime: string; // e.g. "18:00"
  endTime: string;   // e.g. "19:30"
  meetingUrl?: string;
  adobeConnectUrl?: string;
  adobeConnectAppUrl?: string;
}

export interface ScheduleAccessStatus {
  isTodayClassDay: boolean;
  canEnter: boolean;
  isStartingSoon: boolean; // within 15 minutes before start
  isInProgress: boolean;   // between start and end
  statusKey: "active_now" | "starting_soon" | "today_later" | "today_ended" | "another_day";
  messageFa: string;
  messageEn: string;
  minutesUntilOpen: number; // minutes until 15-minute gate opens
  todayDayNameFa: string;
  formattedScheduleFa: string;
  formattedTimeFa: string;
}

/**
 * Normalizes day string from Persian or English into standard Persian Day name.
 */
export function normalizeDayName(day: string): DayOfWeek | null {
  if (!day) return null;
  const d = day.trim().toLowerCase();
  if (d.includes("شنبه") && !d.includes("یک") && !d.includes("دو") && !d.includes("سه") && !d.includes("چهار") && !d.includes("پنج")) return "شنبه";
  if (d.includes("یکشنبه") || d.includes("يكشنبه") || d === "sun" || d === "sunday") return "یکشنبه";
  if (d.includes("دوشنبه") || d === "mon" || d === "monday") return "دوشنبه";
  if (d.includes("سه‌شنبه") || d.includes("سه شنبه") || d === "tue" || d === "tuesday") return "سه‌شنبه";
  if (d.includes("چهارشنبه") || d === "wed" || d === "wednesday") return "چهارشنبه";
  if (d.includes("پنج‌شنبه") || d.includes("پنج شنبه") || d === "thu" || d === "thursday") return "پنج‌شنبه";
  if (d.includes("جمعه") || d === "fri" || d === "friday") return "جمعه";
  if (d === "sat" || d === "saturday") return "شنبه";
  return null;
}

/**
 * Returns current Persian day name for today.
 */
export function getTodayPersianDay(date = new Date()): DayOfWeek {
  const dayIndex = date.getDay(); // 0 is Sunday, 6 is Saturday
  const found = PERSIAN_DAYS.find((d) => d.dayIndex === dayIndex);
  return found ? found.fa : "شنبه";
}

/**
 * Formats time string (e.g. "18:00") into Persian digits if desired.
 */
export function formatPersianTime(timeStr?: string): string {
  if (!timeStr) return "--:--";
  return timeStr.trim();
}

/**
 * Checks whether the current user is allowed into the Adobe Connect classroom
 * (starting 15 minutes before scheduled start time, through the class session).
 */
export function checkClassroomAccess(
  schedule: ClassScheduleInfo,
  now = new Date()
): ScheduleAccessStatus {
  const todayFa = getTodayPersianDay(now);

  const days = (schedule.scheduleDays && schedule.scheduleDays.length > 0)
    ? schedule.scheduleDays
    : ["شنبه", "دوشنبه"];

  const normalizedDays = days
    .map(normalizeDayName)
    .filter((d): d is DayOfWeek => d !== null);

  const isTodayClassDay = normalizedDays.includes(todayFa);

  const startTimeStr = schedule.startTime || "18:00";
  const endTimeStr = schedule.endTime || "19:30";

  const [startH, startM] = startTimeStr.split(":").map((v) => parseInt(v, 10) || 0);
  const [endH, endM] = endTimeStr.split(":").map((v) => parseInt(v, 10) || 0);

  const classStartTime = new Date(now);
  classStartTime.setHours(startH, startM, 0, 0);

  const classEndTime = new Date(now);
  classEndTime.setHours(endH, endM, 0, 0);

  // 15 minutes pre-class opening window
  const gateOpenTime = new Date(classStartTime.getTime() - 15 * 60 * 1000);
  // Allow entry until 15 minutes after official end time
  const gateCloseTime = new Date(classEndTime.getTime() + 15 * 60 * 1000);

  const nowMs = now.getTime();
  const gateOpenMs = gateOpenTime.getTime();
  const classStartMs = classStartTime.getTime();
  const classEndMs = classEndTime.getTime();
  const gateCloseMs = gateCloseTime.getTime();

  const formattedScheduleFa = normalizedDays.join(" و ");
  const formattedTimeFa = `${formatPersianTime(startTimeStr)} الی ${formatPersianTime(endTimeStr)}`;

  if (!isTodayClassDay) {
    return {
      isTodayClassDay: false,
      canEnter: false,
      isStartingSoon: false,
      isInProgress: false,
      statusKey: "another_day",
      messageFa: `کلاس در روزهای ${formattedScheduleFa} برگزار می‌شود. امروز کلاس برگزار نمی‌شود.`,
      messageEn: `Class is scheduled on ${formattedScheduleFa}. No session scheduled today.`,
      minutesUntilOpen: 0,
      todayDayNameFa: todayFa,
      formattedScheduleFa,
      formattedTimeFa,
    };
  }

  // Today IS a class day
  if (nowMs < gateOpenMs) {
    const minutesUntilOpen = Math.max(1, Math.ceil((gateOpenMs - nowMs) / (60 * 1000)));
    return {
      isTodayClassDay: true,
      canEnter: false,
      isStartingSoon: false,
      isInProgress: false,
      statusKey: "today_later",
      messageFa: `جلسه امروز ساعت ${formatPersianTime(startTimeStr)} شروع می‌شود. ورود به کلاس ۱۵ دقیقه قبل (ساعت ${formatPersianTime(
        new Date(gateOpenMs).toTimeString().substring(0, 5)
      )}) فعال خواهد شد.`,
      messageEn: `Session starts today at ${startTimeStr}. Room opens 15 minutes before class (${minutesUntilOpen} min remaining).`,
      minutesUntilOpen,
      todayDayNameFa: todayFa,
      formattedScheduleFa,
      formattedTimeFa,
    };
  }

  if (nowMs >= gateOpenMs && nowMs < classStartMs) {
    const minutesToStart = Math.max(1, Math.ceil((classStartMs - nowMs) / (60 * 1000)));
    return {
      isTodayClassDay: true,
      canEnter: true,
      isStartingSoon: true,
      isInProgress: false,
      statusKey: "starting_soon",
      messageFa: `اتاق کلاس آماده است! کلاس تا ${minutesToStart} دقیقه دیگر شروع می‌شود. می‌توانید وارد شوید.`,
      messageEn: `Classroom is open! Session begins in ${minutesToStart} minutes. You can enter now.`,
      minutesUntilOpen: 0,
      todayDayNameFa: todayFa,
      formattedScheduleFa,
      formattedTimeFa,
    };
  }

  if (nowMs >= classStartMs && nowMs <= classEndMs) {
    return {
      isTodayClassDay: true,
      canEnter: true,
      isStartingSoon: false,
      isInProgress: true,
      statusKey: "active_now",
      messageFa: `کلاس هم‌اکنون در حال برگزاری است. لطفاً بدون معطلی وارد کلاس شوید.`,
      messageEn: `Class is in session right now. Click to join the room.`,
      minutesUntilOpen: 0,
      todayDayNameFa: todayFa,
      formattedScheduleFa,
      formattedTimeFa,
    };
  }

  if (nowMs > classEndMs && nowMs <= gateCloseMs) {
    return {
      isTodayClassDay: true,
      canEnter: true,
      isStartingSoon: false,
      isInProgress: true,
      statusKey: "active_now",
      messageFa: `کلاس در دقایق پایانی قرار دارد. ورود هنوز باز است.`,
      messageEn: `Class session is wrapping up. Room is still accessible.`,
      minutesUntilOpen: 0,
      todayDayNameFa: todayFa,
      formattedScheduleFa,
      formattedTimeFa,
    };
  }

  // After gate close
  return {
    isTodayClassDay: true,
    canEnter: false,
    isStartingSoon: false,
    isInProgress: false,
    statusKey: "today_ended",
    messageFa: `جلسه امروز ساعت ${formatPersianTime(endTimeStr)} خاتمه یافته است.`,
    messageEn: `Today's session ended at ${endTimeStr}.`,
    minutesUntilOpen: 0,
    todayDayNameFa: todayFa,
    formattedScheduleFa,
    formattedTimeFa,
  };
}

/**
 * Checks if a meeting URL is empty or the default unroutable mock URL.
 */
export function isPlaceholderMeetingUrl(url?: string): boolean {
  if (!url || !url.trim()) return true;
  return url.includes("live.endoora.com");
}

/**
 * Builds Adobe Connect links (Web HTML5 client URL, desktop protocol URL, and official proto launcher URL).
 */
export function buildAdobeConnectLinks(classId: string, customUrl?: string): {
  webUrl: string;
  appUrl: string;
  protoUrl: string;
  isConfigured: boolean;
} {
  const isConfigured = Boolean(customUrl && customUrl.trim() && !customUrl.includes("live.endoora.com"));
  const effectiveUrl =
    isConfigured && customUrl
      ? customUrl.trim()
      : `https://live.endoora.com/class-${classId || "room"}`;

  const cleanUrl = effectiveUrl.trim();
  const protoUrl = cleanUrl.includes("?") ? `${cleanUrl}&proto=true` : `${cleanUrl}?proto=true`;

  let appUrl = effectiveUrl;
  if (effectiveUrl.startsWith("https://")) {
    appUrl = `connectpro://${effectiveUrl.replace("https://", "")}`;
  } else if (effectiveUrl.startsWith("http://")) {
    appUrl = `connectpro://${effectiveUrl.replace("http://", "")}`;
  } else if (!effectiveUrl.startsWith("connectpro://")) {
    appUrl = `connectpro://${effectiveUrl}`;
  }

  return {
    webUrl: effectiveUrl,
    appUrl,
    protoUrl,
    isConfigured,
  };
}

