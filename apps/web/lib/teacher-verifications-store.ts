import fs from "fs";
import path from "path";
export * from "./teacher-verifications-content";
import {
  type TeacherApplicationRecord,
  type VerificationStats,
  type ReviewDecisionPayload,
  type TeacherVerificationStatus,
  INITIAL_TEACHER_APPLICATIONS,
} from "./teacher-verifications-content";
import { INITIAL_USERS } from "./admin-users";

// In-memory cache for fast runtime access with disk sync fallback
let inMemoryApplications: TeacherApplicationRecord[] | null = null;

function resolveStoragePath(): string {
  const candidateWeb = path.join(process.cwd(), "apps", "web", "data", "teacher-verifications.json");
  const candidateLocal = path.join(process.cwd(), "data", "teacher-verifications.json");
  if (fs.existsSync(path.dirname(candidateWeb))) {
    return candidateWeb;
  }
  return candidateLocal;
}

export function getTeacherApplications(): TeacherApplicationRecord[] {
  if (inMemoryApplications) {
    return inMemoryApplications;
  }

  const filePath = resolveStoragePath();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      inMemoryApplications = JSON.parse(raw);
      return inMemoryApplications!;
    }
  } catch (err) {
    console.warn("Could not read teacher-verifications.json from disk, seeding with initial data:", err);
  }

  inMemoryApplications = [...INITIAL_TEACHER_APPLICATIONS];
  saveApplicationsToDisk(inMemoryApplications);
  return inMemoryApplications;
}

export function saveApplicationsToDisk(apps: TeacherApplicationRecord[]): boolean {
  inMemoryApplications = apps;
  try {
    const filePath = resolveStoragePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(apps, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.warn("Failed to write teacher-verifications.json to disk:", err);
    return false;
  }
}

export function getApplicationById(id: string): TeacherApplicationRecord | null {
  const all = getTeacherApplications();
  return all.find((a) => a.id === id || a.userId === id) || null;
}

export function applyReviewDecision(
  appId: string,
  payload: ReviewDecisionPayload
): { success: boolean; application?: TeacherApplicationRecord; error?: string } {
  const all = getTeacherApplications();
  const index = all.findIndex((a) => a.id === appId);

  if (index === -1) {
    return { success: false, error: `درخواست با شناسه ${appId} یافت نشد.` };
  }

  const current = all[index];
  const now = new Date().toISOString();
  let nextStatus: TeacherVerificationStatus = current.status;
  let actionLabel = "";

  switch (payload.decision) {
    case "approve":
      nextStatus = "approved";
      actionLabel = "تایید صلاحیت نهایی و اعطای نشان‌ها و کارمزد";
      break;
    case "request_revision":
      nextStatus = "revision_requested";
      actionLabel = "ارجاع جهت اصلاح و تکمیل مدارک";
      break;
    case "reject":
      nextStatus = "rejected";
      actionLabel = "رد درخواست تدریس";
      break;
    case "suspend":
      nextStatus = "suspended";
      actionLabel = "تعلیق موقت فعالیت در مارکت‌پلیس";
      break;
    case "update_privileges":
      actionLabel = "به‌روزرسانی تنظیمات کارمزد و نشان‌های استاد";
      break;
  }

  const updated: TeacherApplicationRecord = {
    ...current,
    status: nextStatus,
    reviewedAt: now,
    reviewedBy: payload.actor || "مدیر ارشد ایندورا",
    adminNotes: payload.adminNotes !== undefined ? payload.adminNotes : current.adminNotes,
    commissionRatePercent:
      payload.commissionRatePercent !== undefined ? payload.commissionRatePercent : current.commissionRatePercent,
    commissionTier: payload.commissionTier || current.commissionTier,
    assignedBadges: payload.assignedBadges !== undefined ? payload.assignedBadges : current.assignedBadges,
    customBadges: payload.customBadges !== undefined ? payload.customBadges : current.customBadges,
    isFeatured: payload.isFeatured !== undefined ? payload.isFeatured : current.isFeatured,
    teachingPermissions: {
      ...current.teachingPermissions,
      ...(payload.teachingPermissions || {}),
    },
    rejectionReason: payload.rejectionReason !== undefined ? payload.rejectionReason : current.rejectionReason,
    revisionChecklist:
      payload.revisionChecklist !== undefined ? payload.revisionChecklist : current.revisionChecklist,
    revisionInstructions:
      payload.revisionInstructions !== undefined ? payload.revisionInstructions : current.revisionInstructions,
    history: [
      ...current.history,
      {
        id: `hist-${Date.now()}`,
        timestamp: now,
        action: actionLabel,
        actor: payload.actor || "مدیر ارشد ایندورا",
        previousStatus: current.status,
        newStatus: nextStatus,
        notes: payload.adminNotes || payload.rejectionReason || payload.revisionInstructions,
      },
    ],
  };

  all[index] = updated;
  saveApplicationsToDisk(all);

  // Synchronize user record verification status
  const matchedUser = INITIAL_USERS.find(
    (u) => u.id === current.userId || u.name === current.fullName
  );
  if (matchedUser) {
    matchedUser.isTeacherVerified = nextStatus === "approved";
    matchedUser.marketplaceEligible = nextStatus === "approved";
  }

  return { success: true, application: updated };
}

export function getVerificationStats(): VerificationStats {
  const all = getTeacherApplications();
  const total = all.length;
  const pending = all.filter((a) => a.status === "pending").length;
  const inReview = all.filter((a) => a.status === "in_review").length;
  const revision = all.filter((a) => a.status === "revision_requested").length;
  const approved = all.filter((a) => a.status === "approved").length;
  const rejected = all.filter((a) => a.status === "rejected").length;
  const suspended = all.filter((a) => a.status === "suspended").length;

  const sumCommission = all.reduce((acc, curr) => acc + (curr.commissionRatePercent || 20), 0);
  const avgCommission = total > 0 ? Number((sumCommission / total).toFixed(1)) : 20;

  return {
    totalApplicants: total,
    pendingCount: pending,
    inReviewCount: inReview,
    revisionRequestedCount: revision,
    approvedCount: approved,
    rejectedCount: rejected,
    suspendedCount: suspended,
    averageCommissionPercent: avgCommission,
  };
}
