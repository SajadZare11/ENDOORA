import fs from "fs";
import path from "path";
export * from "./broadcast-notifications-content.ts";
import {
  type BroadcastCampaign,
  type BroadcastTemplate,
  type AudienceSegment,
  type BroadcastStats,
  type BroadcastChannel,
  type BroadcastPriority,
  type AudienceSegmentKey,
  INITIAL_AUDIENCE_SEGMENTS,
  INITIAL_BROADCAST_TEMPLATES,
  INITIAL_BROADCAST_CAMPAIGNS,
} from "./broadcast-notifications-content.ts";

interface BroadcastStoragePayload {
  campaigns: BroadcastCampaign[];
  templates: BroadcastTemplate[];
  segments: AudienceSegment[];
}

let inMemoryBroadcast: BroadcastStoragePayload | null = null;

function resolveStoragePath(): string {
  const candidateWeb = path.join(
    process.cwd(),
    "apps",
    "web",
    "data",
    "broadcast-notifications-operations.json"
  );
  const candidateLocal = path.join(
    process.cwd(),
    "data",
    "broadcast-notifications-operations.json"
  );
  if (fs.existsSync(path.dirname(candidateWeb))) {
    return candidateWeb;
  }
  return candidateLocal;
}

function persistToDisk(): void {
  if (!inMemoryBroadcast) return;
  try {
    const filePath = resolveStoragePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(inMemoryBroadcast, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not persist broadcast notifications data to disk:", err);
  }
}

export function getBroadcastStorage(): BroadcastStoragePayload {
  if (inMemoryBroadcast) {
    return inMemoryBroadcast;
  }

  const filePath = resolveStoragePath();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      inMemoryBroadcast = JSON.parse(raw);
      return inMemoryBroadcast!;
    }
  } catch (err) {
    console.warn("Could not read broadcast-notifications-operations.json, seeding initial data:", err);
  }

  inMemoryBroadcast = {
    campaigns: [...INITIAL_BROADCAST_CAMPAIGNS],
    templates: [...INITIAL_BROADCAST_TEMPLATES],
    segments: [...INITIAL_AUDIENCE_SEGMENTS],
  };

  persistToDisk();
  return inMemoryBroadcast;
}

export function getBroadcastStats(): BroadcastStats {
  const storage = getBroadcastStorage();
  const completed = storage.campaigns.filter((c) => c.status === "completed");
  const scheduled = storage.campaigns.filter((c) => c.status === "scheduled");

  const totalDelivered = completed.reduce((sum, c) => sum + c.actualDeliveredCount, 0);

  const totalSms = completed
    .filter((c) => c.channels.includes("sms"))
    .reduce((sum, c) => sum + c.actualDeliveredCount, 0);

  const avgRate =
    completed.length > 0
      ? Number(
          (completed.reduce((sum, c) => sum + c.deliveryRatePercent, 0) / completed.length).toFixed(1)
        )
      : 0;

  const urgentBanners = completed.filter(
    (c) => c.channels.includes("urgent_banner") && c.priority === "critical"
  ).length;

  return {
    totalCampaignsSent: completed.length,
    totalNotificationsDelivered: totalDelivered,
    totalSmsDispatched: totalSms,
    avgDeliveryRatePercent: avgRate,
    activeUrgentBannersCount: urgentBanners,
    scheduledCampaignsCount: scheduled.length,
  };
}

export function getBroadcastData() {
  const storage = getBroadcastStorage();
  const stats = getBroadcastStats();
  return {
    campaigns: storage.campaigns,
    templates: storage.templates,
    segments: storage.segments,
    stats,
  };
}

export function sendTestNotificationToAdmin(
  payload: {
    title: string;
    body: string;
    channels: BroadcastChannel[];
  },
  adminPhone: string = "09121234567"
): { success: boolean; message: string } {
  if (!payload.title.trim() || !payload.body.trim()) {
    return { success: false, message: "عنوان و متن اعلان برای ارسال تست الزامی است." };
  }

  const channelNames = payload.channels.map((c) => (c === "sms" ? "پیامک" : "نوتیفیکیشن")).join(" و ");
  return {
    success: true,
    message: `پیام تست با موفقیت از طریق ${channelNames} به شماره همراه ادمین (${adminPhone}) ارسال شد.`,
  };
}

export function dispatchBroadcastCampaign(params: {
  title: string;
  body: string;
  ctaText?: string;
  ctaUrl?: string;
  channels: BroadcastChannel[];
  priority: BroadcastPriority;
  targetSegment: AudienceSegmentKey;
  scheduledFor?: string | null;
  createdBy?: string;
}): { success: boolean; campaign: BroadcastCampaign } {
  const storage = getBroadcastStorage();
  const segment = storage.segments.find((s) => s.key === params.targetSegment);
  const estimated = segment ? segment.estimatedCount : 100;

  const isScheduled = !!params.scheduledFor;
  const actualDelivered = isScheduled ? 0 : Math.round(estimated * 0.985);
  const deliveryRate = isScheduled ? 0 : 98.5;

  const newCampaign: BroadcastCampaign = {
    id: `camp-${Date.now()}`,
    title: params.title.trim(),
    body: params.body.trim(),
    ctaText: params.ctaText?.trim(),
    ctaUrl: params.ctaUrl?.trim(),
    channels: params.channels,
    priority: params.priority,
    targetSegment: params.targetSegment,
    targetSegmentLabel: segment ? segment.label : params.targetSegment,
    estimatedRecipients: estimated,
    actualDeliveredCount: actualDelivered,
    deliveryRatePercent: deliveryRate,
    status: isScheduled ? "scheduled" : "completed",
    scheduledFor: params.scheduledFor || null,
    sentAt: isScheduled ? null : new Date().toISOString(),
    createdBy: params.createdBy || "مدیر ارشد ایندورا",
    isTestSentToAdmin: true,
    createdAt: new Date().toISOString(),
  };

  storage.campaigns.unshift(newCampaign);
  persistToDisk();

  return { success: true, campaign: newCampaign };
}

export function cancelScheduledCampaign(campaignId: string): {
  success: boolean;
  message: string;
} {
  const storage = getBroadcastStorage();
  const campaign = storage.campaigns.find((c) => c.id === campaignId);

  if (!campaign) {
    return { success: false, message: "کمپین اعلان مورد نظر یافت نشد." };
  }

  if (campaign.status !== "scheduled") {
    return { success: false, message: "تنها کمپین‌های زمان‌بندی‌شده قابل لغو هستند." };
  }

  campaign.status = "cancelled";
  persistToDisk();

  return {
    success: true,
    message: `ارسال زمان‌بندی‌شده کمپین "${campaign.title}" با موفقیت لغو گردید.`,
  };
}

export function resetBroadcastDataToInitial(): void {
  inMemoryBroadcast = {
    campaigns: JSON.parse(JSON.stringify(INITIAL_BROADCAST_CAMPAIGNS)),
    templates: JSON.parse(JSON.stringify(INITIAL_BROADCAST_TEMPLATES)),
    segments: JSON.parse(JSON.stringify(INITIAL_AUDIENCE_SEGMENTS)),
  };
  persistToDisk();
}
