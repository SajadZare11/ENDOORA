import fs from "fs";
import path from "path";
export * from "./treasury-content.ts";
import {
  type TeacherPayoutRecord,
  type EscrowRecord,
  type TreasuryStats,
  INITIAL_PAYOUT_REQUESTS,
  INITIAL_ESCROW_RECORDS,
  INITIAL_REVENUE_STATS,
} from "./treasury-content.ts";
import { adjustUserWallet } from "./admin-users-store.ts";

interface TreasuryStoragePayload {
  payouts: TeacherPayoutRecord[];
  escrows: EscrowRecord[];
}

let inMemoryTreasury: TreasuryStoragePayload | null = null;

function resolveStoragePath(): string {
  const candidateWeb = path.join(process.cwd(), "apps", "web", "data", "treasury-operations.json");
  const candidateLocal = path.join(process.cwd(), "data", "treasury-operations.json");
  if (fs.existsSync(path.dirname(candidateWeb))) {
    return candidateWeb;
  }
  return candidateLocal;
}

export function getTreasuryData(): TreasuryStoragePayload {
  if (inMemoryTreasury) {
    return inMemoryTreasury;
  }

  const filePath = resolveStoragePath();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      inMemoryTreasury = JSON.parse(raw);
      return inMemoryTreasury!;
    }
  } catch (err) {
    console.warn("Could not read treasury-operations.json from disk, seeding with initial data:", err);
  }

  inMemoryTreasury = {
    payouts: [...INITIAL_PAYOUT_REQUESTS],
    escrows: [...INITIAL_ESCROW_RECORDS],
  };
  saveTreasuryDataToDisk(inMemoryTreasury);
  return inMemoryTreasury;
}

export function saveTreasuryDataToDisk(data: TreasuryStoragePayload): boolean {
  inMemoryTreasury = data;
  try {
    const filePath = resolveStoragePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.warn("Failed to write treasury-operations.json to disk:", err);
    return false;
  }
}

export function getTreasuryStats(): TreasuryStats {
  const data = getTreasuryData();
  const payouts = data.payouts;
  const escrows = data.escrows;

  const pendingPayouts = payouts.filter((p) => p.status === "pending" || p.status === "processing");
  const pendingPayoutsSum = pendingPayouts.reduce((sum, p) => sum + (p.amountToman || 0), 0);

  const completedPayouts = payouts.filter((p) => p.status === "completed");
  const completedPayoutsSum = completedPayouts.reduce((sum, p) => sum + (p.amountToman || 0), 0);

  const activeEscrows = escrows.filter((e) => e.status === "held" || e.status === "disputed");
  const activeEscrowFloat = activeEscrows.reduce((sum, e) => sum + (e.totalAmountToman || 0), 0);
  const disputedCount = escrows.filter((e) => e.status === "disputed").length;

  return {
    totalGrossVolumeToman: INITIAL_REVENUE_STATS.totalGrossVolumeToman,
    totalPlatformCommissionToman: INITIAL_REVENUE_STATS.totalPlatformCommissionToman,
    pendingPayoutsToman: pendingPayoutsSum,
    pendingPayoutsCount: pendingPayouts.length,
    activeEscrowFloatToman: activeEscrowFloat,
    activeEscrowFloatCount: activeEscrows.length,
    disputedEscrowCount: disputedCount,
    completedDisbursementsThisMonthToman: completedPayoutsSum,
    revenueBreakdown: INITIAL_REVENUE_STATS.revenueBreakdown,
  };
}

// 1. Disburse Payout (Completed with mandatory bank transfer code)
export function disbursePayout(
  payoutId: string,
  data: {
    bankTrackingCode: string;
    adminNotes?: string;
    actor?: string;
  }
): { success: boolean; payout?: TeacherPayoutRecord; error?: string } {
  if (!data.bankTrackingCode || !data.bankTrackingCode.trim()) {
    return { success: false, error: "ثبت شماره ارجاع یا کد پیگیری حواله پایا/ساتنا الزامی است." };
  }

  const treasury = getTreasuryData();
  const payout = treasury.payouts.find((p) => p.id === payoutId);
  if (!payout) {
    return { success: false, error: `درخواست تسویه با شناسه ${payoutId} یافت نشد.` };
  }

  payout.status = "completed";
  payout.bankTrackingCode = data.bankTrackingCode.trim();
  payout.disbursedAt = new Date().toISOString();
  payout.disbursedBy = data.actor || "مدیر ارشد خزانه‌داری ایندورا";
  if (data.adminNotes) {
    payout.adminNotes = data.adminNotes;
  }

  saveTreasuryDataToDisk(treasury);
  return { success: true, payout };
}

// 2. Reject Payout
export function rejectPayout(
  payoutId: string,
  data: {
    rejectionReason: string;
    adminNotes?: string;
    actor?: string;
  }
): { success: boolean; payout?: TeacherPayoutRecord; error?: string } {
  if (!data.rejectionReason || !data.rejectionReason.trim()) {
    return { success: false, error: "درج دلیل دقیق رد درخواست تسویه الزامی است." };
  }

  const treasury = getTreasuryData();
  const payout = treasury.payouts.find((p) => p.id === payoutId);
  if (!payout) {
    return { success: false, error: `درخواست تسویه با شناسه ${payoutId} یافت نشد.` };
  }

  payout.status = "rejected";
  payout.rejectionReason = data.rejectionReason.trim();
  if (data.adminNotes) {
    payout.adminNotes = data.adminNotes;
  }

  saveTreasuryDataToDisk(treasury);
  return { success: true, payout };
}

// 3. Mark Payout Processing
export function markPayoutProcessing(
  payoutId: string
): { success: boolean; payout?: TeacherPayoutRecord; error?: string } {
  const treasury = getTreasuryData();
  const payout = treasury.payouts.find((p) => p.id === payoutId);
  if (!payout) {
    return { success: false, error: `درخواست تسویه با شناسه ${payoutId} یافت نشد.` };
  }

  payout.status = "processing";
  saveTreasuryDataToDisk(treasury);
  return { success: true, payout };
}

// 4. Arbitrate Escrow (3-Way: Release to teacher, Refund to student, or Split)
export function arbitrateEscrow(
  escrowId: string,
  data: {
    decision: "release_to_teacher" | "refund_to_learner" | "split";
    verdictMessage: string;
    splitLearnerPercent?: number;
    actor?: string;
  }
): { success: boolean; escrow?: EscrowRecord; error?: string } {
  if (!data.verdictMessage || !data.verdictMessage.trim()) {
    return { success: false, error: "درج متن و دلیل رأی داوری الزامی است." };
  }

  const treasury = getTreasuryData();
  const escrow = treasury.escrows.find((e) => e.id === escrowId);
  if (!escrow) {
    return { success: false, error: `پرونده ضمانت اسکرو با شناسه ${escrowId} یافت نشد.` };
  }

  const now = new Date().toISOString();
  escrow.arbitratedAt = now;
  escrow.arbitratedBy = data.actor || "مدیر ارشد خزانه‌داری ایندورا";
  escrow.arbitrationVerdict = data.verdictMessage;

  if (data.decision === "release_to_teacher") {
    escrow.status = "released";
  } else if (data.decision === "refund_to_learner") {
    escrow.status = "refunded";
    // Refund 100% to learner wallet
    adjustUserWallet(escrow.learnerId, {
      amountToman: escrow.totalAmountToman,
      reasonCategory: "refund",
      adminNote: `استرداد ۱۰۰٪ وجه کلاس بر اساس رأی داوری: ${data.verdictMessage}`,
      actor: data.actor || "داوری پلتفرم ایندورا",
    });
  } else if (data.decision === "split") {
    const splitPercent = data.splitLearnerPercent || 50;
    const learnerAmount = Math.round((escrow.totalAmountToman * splitPercent) / 100);
    const teacherAmount = escrow.totalAmountToman - learnerAmount;

    escrow.status = "split";
    escrow.splitLearnerAmountToman = learnerAmount;
    escrow.splitTeacherAmountToman = teacherAmount;

    // Refund learner portion to wallet
    adjustUserWallet(escrow.learnerId, {
      amountToman: learnerAmount,
      reasonCategory: "compensation",
      adminNote: `تسویه توافقی داوری (${splitPercent}٪ استرداد به دانشجو): ${data.verdictMessage}`,
      actor: data.actor || "داوری پلتفرم ایندورا",
    });
  }

  saveTreasuryDataToDisk(treasury);
  return { success: true, escrow };
}
