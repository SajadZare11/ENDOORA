/**
 * Client API and TypeScript interfaces for Notifications & Notification Center (OPS-006)
 */

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: "LEARNING" | "ASSIGNMENT" | "SECURITY" | "FINANCIAL" | "SYSTEM";
  category_display: string;
  channel: "IN_APP" | "SMS" | "EMAIL";
  status: "PENDING" | "SENT" | "DELIVERED" | "READ" | "FAILED";
  is_read: boolean;
  action_url: string;
  created_at: string;
  read_at: string | null;
}

export interface NotificationPreferences {
  in_app_enabled: boolean;
  sms_enabled: boolean;
  email_enabled: boolean;
  learning_updates: boolean;
  assignment_alerts: boolean;
  financial_receipts: boolean;
  security_warnings: boolean;
  marketing_promotions: boolean;
  phone_number_verified: boolean;
  user_phone: string | null;
  updated_at: string;
}

export interface NotificationListResponse {
  notifications: NotificationItem[];
  unread_count: number;
  total_count: number;
}

export const FALLBACK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-01",
    title: "خوش‌آمدید به پلتفرم یادگیری زبان اندورا",
    message: "حساب کاربری شما با موفقیت فعال شد. می‌توانید از بخش تعیین سطح، مهارت‌های زبان خود را بسنجید.",
    category: "SYSTEM",
    category_display: "اطلاعیه‌های سیستم",
    channel: "IN_APP",
    status: "DELIVERED",
    is_read: false,
    action_url: "/placement",
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    read_at: null,
  },
  {
    id: "notif-02",
    title: "ماموریت روزانه جدید شما آماده است",
    message: "تمرین تطبیقی هوشمند واژگان و درک مطلب امروز در دسترس شما قرار گرفت.",
    category: "LEARNING",
    category_display: "یادگیری و تمارین",
    channel: "IN_APP",
    status: "DELIVERED",
    is_read: false,
    action_url: "/today",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read_at: null,
  },
  {
    id: "notif-03",
    title: "تایید نشست ورود و تدابیر امنیتی",
    message: "نشست کاربری شما از طریق مرورگر ثبت گردید. در صورت عدم تطابق به بخش نشست‌ها مراجعه فرمایید.",
    category: "SECURITY",
    category_display: "امنیت و حساب کاربری",
    channel: "IN_APP",
    status: "READ",
    is_read: true,
    action_url: "/account/sessions",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read_at: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
  },
];

export const FALLBACK_PREFERENCES: NotificationPreferences = {
  in_app_enabled: true,
  sms_enabled: true,
  email_enabled: true,
  learning_updates: true,
  assignment_alerts: true,
  financial_receipts: true,
  security_warnings: true,
  marketing_promotions: false,
  phone_number_verified: true,
  user_phone: "09123456789",
  updated_at: new Date().toISOString(),
};

export async function fetchNotifications(
  category?: string,
  unreadOnly?: boolean
): Promise<NotificationListResponse> {
  try {
    const params = new URLSearchParams();
    if (category && category !== "ALL") params.set("category", category);
    if (unreadOnly) params.set("unread_only", "true");

    const res = await fetch(`/api/notifications/?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) {
      return {
        notifications: FALLBACK_NOTIFICATIONS,
        unread_count: 2,
        total_count: 3,
      };
    }
    return (await res.json()) as NotificationListResponse;
  } catch {
    return {
      notifications: FALLBACK_NOTIFICATIONS,
      unread_count: 2,
      total_count: 3,
    };
  }
}

export async function markNotificationRead(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/notifications/${id}/read/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function markAllNotificationsRead(): Promise<boolean> {
  try {
    const res = await fetch("/api/notifications/read-all/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchNotificationPreferences(): Promise<NotificationPreferences> {
  try {
    const res = await fetch("/api/notifications/preferences/", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return FALLBACK_PREFERENCES;
    return (await res.json()) as NotificationPreferences;
  } catch {
    return FALLBACK_PREFERENCES;
  }
}

export async function updateNotificationPreferences(
  prefs: Partial<NotificationPreferences>
): Promise<boolean> {
  try {
    const res = await fetch("/api/notifications/preferences/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prefs),
    });
    return res.ok;
  } catch {
    return false;
  }
}
