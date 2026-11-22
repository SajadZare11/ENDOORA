import fs from "fs";
import path from "path";
export * from "./community-moderation-content.ts";
import {
  type CommentModerationStatus,
  type SanctionType,
  type CommunityCommentItem,
  type BannedKeywordRule,
  type SanctionedUserRecord,
  type CommunityModerationStats,
  INITIAL_COMMUNITY_COMMENTS,
  INITIAL_BANNED_KEYWORD_RULES,
  INITIAL_SANCTIONED_USERS,
} from "./community-moderation-content.ts";

interface CommunityModerationStoragePayload {
  comments: CommunityCommentItem[];
  bannedKeywords: BannedKeywordRule[];
  sanctionedUsers: SanctionedUserRecord[];
}

let inMemoryCommunity: CommunityModerationStoragePayload | null = null;

function resolveStoragePath(): string {
  const candidateWeb = path.join(
    process.cwd(),
    "apps",
    "web",
    "data",
    "community-moderation-operations.json"
  );
  const candidateLocal = path.join(
    process.cwd(),
    "data",
    "community-moderation-operations.json"
  );
  if (fs.existsSync(path.dirname(candidateWeb))) {
    return candidateWeb;
  }
  return candidateLocal;
}

function persistToDisk(): void {
  if (!inMemoryCommunity) return;
  try {
    const filePath = resolveStoragePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(inMemoryCommunity, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not persist Community Moderation data to disk:", err);
  }
}

export function getCommunityModerationStorage(): CommunityModerationStoragePayload {
  if (inMemoryCommunity) {
    return inMemoryCommunity;
  }

  const filePath = resolveStoragePath();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      inMemoryCommunity = JSON.parse(raw);
      return inMemoryCommunity!;
    }
  } catch (err) {
    console.warn("Could not read community-moderation-operations.json, seeding initial data:", err);
  }

  inMemoryCommunity = {
    comments: JSON.parse(JSON.stringify(INITIAL_COMMUNITY_COMMENTS)),
    bannedKeywords: JSON.parse(JSON.stringify(INITIAL_BANNED_KEYWORD_RULES)),
    sanctionedUsers: JSON.parse(JSON.stringify(INITIAL_SANCTIONED_USERS)),
  };

  persistToDisk();
  return inMemoryCommunity;
}

export function getCommunityModerationStats(): CommunityModerationStats {
  const storage = getCommunityModerationStorage();
  const pendingCount = storage.comments.filter((c) => c.status === "pending").length;
  const quarantinedCount = storage.comments.filter((c) => c.status === "quarantined").length;
  const approvedCount = storage.comments.filter((c) => c.status === "approved").length;
  const activeShadowbans = storage.sanctionedUsers.filter(
    (s) => s.sanctionType === "shadowban" && s.isActive
  ).length;

  const total = storage.comments.length;
  const autoApprovedPercent = total > 0 ? Math.round((approvedCount / total) * 100) : 0;

  return {
    totalCommentsToday: 48,
    pendingReviewsCount: pendingCount,
    quarantinedCount: quarantinedCount,
    autoApprovedPercent,
    activeShadowbansCount: activeShadowbans,
    avgResponseTimeMin: 14,
  };
}

export function getCommunityModerationData() {
  const storage = getCommunityModerationStorage();
  const stats = getCommunityModerationStats();
  return {
    comments: storage.comments,
    bannedKeywords: storage.bannedKeywords,
    sanctionedUsers: storage.sanctionedUsers,
    stats,
  };
}

export function approveComment(
  commentId: string,
  moderator: string = "مدیر ارشد نظارت"
): ({ success: true; comment: CommunityCommentItem; message: string } | { success: false; comment: null; message: string }) {
  const storage = getCommunityModerationStorage();
  const comment = storage.comments.find((c) => c.id === commentId);

  if (!comment) {
    return { success: false, comment: null, message: "دیدگاه مورد نظر یافت نشد." };
  }

  comment.status = "approved";
  comment.moderatedAt = new Date().toISOString();
  comment.moderatedBy = moderator;
  comment.rejectionReason = undefined;

  persistToDisk();
  return {
    success: true,
    comment,
    message: `دیدگاه "${comment.authorName}" با موفقیت تایید و در سایت منتشر گردید.`,
  };
}

export function rejectComment(
  commentId: string,
  reason: string,
  moderator: string = "مدیر ارشد نظارت"
): ({ success: true; comment: CommunityCommentItem; message: string } | { success: false; comment: null; message: string }) {
  const storage = getCommunityModerationStorage();
  const comment = storage.comments.find((c) => c.id === commentId);

  if (!comment) {
    return { success: false, comment: null, message: "دیدگاه مورد نظر یافت نشد." };
  }

  comment.status = "rejected";
  comment.rejectionReason = reason;
  comment.moderatedAt = new Date().toISOString();
  comment.moderatedBy = moderator;

  persistToDisk();
  return {
    success: true,
    comment,
    message: `دیدگاه به دلیل "${reason}" رد و از دسترس عموم خارج شد.`,
  };
}

export function postOfficialReply(
  commentId: string,
  replyText: string,
  staffName: string = "تیم آموزش ایندورا",
  staffRole: string = "پاسخ رسمی پشتیبانی آموزشی"
): ({ success: true; comment: CommunityCommentItem; message: string } | { success: false; comment: null; message: string }) {
  const storage = getCommunityModerationStorage();
  const comment = storage.comments.find((c) => c.id === commentId);

  if (!comment) {
    return { success: false, comment: null, message: "دیدگاه مورد نظر یافت نشد." };
  }

  comment.officialReply = {
    staffName,
    staffRole,
    content: replyText,
    repliedAt: new Date().toISOString(),
  };

  // If was pending, auto-approve upon official reply
  if (comment.status === "pending") {
    comment.status = "approved";
    comment.moderatedAt = new Date().toISOString();
    comment.moderatedBy = staffName;
  }

  persistToDisk();
  return {
    success: true,
    comment,
    message: "پاسخ رسمی مدیریت با نشان تایید با موفقیت ثبت شد.",
  };
}

export function toggleCommentPin(
  commentId: string,
  isPinned: boolean
): ({ success: true; comment: CommunityCommentItem; message: string } | { success: false; comment: null; message: string }) {
  const storage = getCommunityModerationStorage();
  const comment = storage.comments.find((c) => c.id === commentId);

  if (!comment) {
    return { success: false, comment: null, message: "دیدگاه مورد نظر یافت نشد." };
  }

  comment.isPinned = isPinned;
  persistToDisk();

  return {
    success: true,
    comment,
    message: isPinned
      ? "دیدگاه به عنوان پاسخ مرجع در بالای جلسه پین گردید."
      : "دیدگاه از وضعیت پین خارج شد.",
  };
}

export function toggleCommentLock(
  commentId: string,
  isLocked: boolean
): ({ success: true; comment: CommunityCommentItem; message: string } | { success: false; comment: null; message: string }) {
  const storage = getCommunityModerationStorage();
  const comment = storage.comments.find((c) => c.id === commentId);

  if (!comment) {
    return { success: false, comment: null, message: "دیدگاه مورد نظر یافت نشد." };
  }

  comment.isLocked = isLocked;
  persistToDisk();

  return {
    success: true,
    comment,
    message: isLocked
      ? "تاپیک گفتگو قفل شد؛ ثبت پاسخ جدید امکان‌پذیر نیست."
      : "قفل تاپیک گفتگو با موفقیت باز شد.",
  };
}

export function addBannedKeywordRule(params: {
  pattern: string;
  matchType?: "exact" | "contains" | "regex";
  severity?: "high" | "medium" | "low";
  action?: "quarantine" | "mask" | "reject";
}): ({ success: true; rule: BannedKeywordRule; message: string } | { success: false; rule: null; message: string }) {
  const storage = getCommunityModerationStorage();
  const pattern = params.pattern.trim();

  if (!pattern) {
    return { success: false, rule: null, message: "الگوی کلمه نمی‌تواند خالی باشد." };
  }

  const newRule: BannedKeywordRule = {
    id: `rule-kw-${Date.now()}`,
    pattern,
    matchType: params.matchType || "contains",
    severity: params.severity || "medium",
    action: params.action || "quarantine",
    isActive: true,
    hitCount: 0,
    addedAt: new Date().toISOString(),
  };

  storage.bannedKeywords.unshift(newRule);
  persistToDisk();

  return {
    success: true,
    rule: newRule,
    message: `قانون فیلتر کلمه "${pattern}" با موفقیت اضافه شد.`,
  };
}

export function toggleBannedKeywordRule(
  ruleId: string,
  isActive: boolean
): { success: boolean; message: string } {
  const storage = getCommunityModerationStorage();
  const rule = storage.bannedKeywords.find((r) => r.id === ruleId);

  if (!rule) {
    return { success: false, message: "قانون مورد نظر یافت نشد." };
  }

  rule.isActive = isActive;
  persistToDisk();

  return {
    success: true,
    message: `وضعیت قانون ${rule.pattern} به ${isActive ? "فعال" : "غیرفعال"} تغییر یافت.`,
  };
}

export function deleteBannedKeywordRule(ruleId: string): { success: boolean; message: string } {
  const storage = getCommunityModerationStorage();
  const initLen = storage.bannedKeywords.length;
  storage.bannedKeywords = storage.bannedKeywords.filter((r) => r.id !== ruleId);

  if (storage.bannedKeywords.length < initLen) {
    persistToDisk();
    return { success: true, message: "قانون کلمه ممنوعه با موفقیت حذف گردید." };
  }
  return { success: false, message: "قانون مورد نظر یافت نشد." };
}

export function applyUserSanction(params: {
  userId: string;
  userName: string;
  userEmail: string;
  sanctionType: SanctionType;
  reason: string;
  appliedBy?: string;
}): { success: boolean; record: SanctionedUserRecord; message: string } {
  const storage = getCommunityModerationStorage();

  const newRecord: SanctionedUserRecord = {
    id: `sanc-${Date.now()}`,
    userId: params.userId,
    userName: params.userName,
    userEmail: params.userEmail,
    sanctionType: params.sanctionType,
    reason: params.reason,
    appliedBy: params.appliedBy || "مدیر ارشد نظارت",
    appliedAt: new Date().toISOString(),
    isActive: true,
    expiresAt:
      params.sanctionType === "mute_7_days"
        ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        : undefined,
  };

  storage.sanctionedUsers.unshift(newRecord);
  persistToDisk();

  const sanctionLabel =
    params.sanctionType === "shadowban"
      ? "مسدودسازی نامحسوس (Shadowban)"
      : params.sanctionType === "mute_7_days"
      ? "محرومیت ۷ روزه"
      : params.sanctionType === "permanent_ban"
      ? "اخراج دائم از کامیونیتی"
      : "اخطار انضباطی";

  return {
    success: true,
    record: newRecord,
    message: `محدودیت "${sanctionLabel}" با موفقیت برای کاربر ${params.userName} اعمال گردید.`,
  };
}

export function liftUserSanction(sanctionId: string): { success: boolean; message: string } {
  const storage = getCommunityModerationStorage();
  const record = storage.sanctionedUsers.find((s) => s.id === sanctionId);

  if (!record) {
    return { success: false, message: "پرونده انضباطی مورد نظر یافت نشد." };
  }

  record.isActive = false;
  persistToDisk();

  return {
    success: true,
    message: `محدودیت انضباطی کاربر ${record.userName} با موفقیت لغو و دسترسی آزاد شد.`,
  };
}

export function resetCommunityModerationDataToInitial(): void {
  inMemoryCommunity = {
    comments: JSON.parse(JSON.stringify(INITIAL_COMMUNITY_COMMENTS)),
    bannedKeywords: JSON.parse(JSON.stringify(INITIAL_BANNED_KEYWORD_RULES)),
    sanctionedUsers: JSON.parse(JSON.stringify(INITIAL_SANCTIONED_USERS)),
  };
  persistToDisk();
}
