import fs from "fs";
import path from "path";
export * from "./teacher-contracts-content.ts";
import {
  type CommissionTierKey,
  type ContractType,
  type ContractStatus,
  type CommissionTierConfig,
  type TeacherCommissionProfile,
  type TeacherContractItem,
  type TeacherContractsStats,
  INITIAL_COMMISSION_TIERS,
  INITIAL_TEACHER_PROFILES,
  INITIAL_TEACHER_CONTRACTS,
} from "./teacher-contracts-content.ts";

interface TeacherContractsStoragePayload {
  tiers: CommissionTierConfig[];
  profiles: TeacherCommissionProfile[];
  contracts: TeacherContractItem[];
}

let inMemoryTeacherContracts: TeacherContractsStoragePayload | null = null;

function resolveStoragePath(): string {
  const candidateWeb = path.join(
    process.cwd(),
    "apps",
    "web",
    "data",
    "teacher-contracts-operations.json"
  );
  const candidateLocal = path.join(
    process.cwd(),
    "data",
    "teacher-contracts-operations.json"
  );
  if (fs.existsSync(path.dirname(candidateWeb))) {
    return candidateWeb;
  }
  return candidateLocal;
}

function persistToDisk(): void {
  if (!inMemoryTeacherContracts) return;
  try {
    const filePath = resolveStoragePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(inMemoryTeacherContracts, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not persist Teacher Contracts operations data to disk:", err);
  }
}

export function getTeacherContractsStorage(): TeacherContractsStoragePayload {
  if (inMemoryTeacherContracts) {
    return inMemoryTeacherContracts;
  }

  const filePath = resolveStoragePath();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      inMemoryTeacherContracts = JSON.parse(raw);
      return inMemoryTeacherContracts!;
    }
  } catch (err) {
    console.warn("Could not read teacher-contracts-operations.json, seeding initial data:", err);
  }

  inMemoryTeacherContracts = {
    tiers: JSON.parse(JSON.stringify(INITIAL_COMMISSION_TIERS)),
    profiles: JSON.parse(JSON.stringify(INITIAL_TEACHER_PROFILES)),
    contracts: JSON.parse(JSON.stringify(INITIAL_TEACHER_CONTRACTS)),
  };

  persistToDisk();
  return inMemoryTeacherContracts;
}

export function getTeacherContractsStats(): TeacherContractsStats {
  const storage = getTeacherContractsStorage();
  const activeContracts = storage.contracts.filter((c) => c.status === "active_signed").length;
  const pendingSigns = storage.contracts.filter((c) => c.status === "pending_signature").length;
  const legalHolds = storage.profiles.filter((p) => p.isLegalHoldActive).length;
  const diamonds = storage.profiles.filter((p) => p.currentTier === "diamond").length;

  const avgCommission =
    storage.profiles.length > 0
      ? Math.round(
          storage.profiles.reduce((sum, p) => sum + p.effectiveCommissionPercent, 0) /
            storage.profiles.length
        )
      : 70;

  return {
    totalTeachersUnderContract: storage.profiles.length,
    activeContractsCount: activeContracts,
    pendingSignaturesCount: pendingSigns,
    activeLegalHoldsCount: legalHolds,
    diamondTierCount: diamonds,
    avgTeacherCommissionPercent: avgCommission,
  };
}

export function getTeacherContractsData() {
  const storage = getTeacherContractsStorage();
  const stats = getTeacherContractsStats();
  return {
    tiers: storage.tiers,
    profiles: storage.profiles,
    contracts: storage.contracts,
    stats,
  };
}

export function createContract(params: {
  teacherId: string;
  contractType: ContractType;
  contractTitle: string;
  termsSummary: string;
  commissionPercent?: number;
}): ({ success: true; contract: TeacherContractItem; message: string } | { success: false; contract: null; message: string }) {
  const storage = getTeacherContractsStorage();
  const profile = storage.profiles.find((p) => p.teacherId === params.teacherId);

  if (!profile) {
    return { success: false, contract: null, message: "پروفایل مدرس مورد نظر یافت نشد." };
  }

  const newContract: TeacherContractItem = {
    id: `cnt-${Date.now()}`,
    teacherId: params.teacherId,
    teacherName: profile.teacherName,
    contractType: params.contractType,
    contractTitle: params.contractTitle,
    version: "v1.0",
    status: "pending_signature",
    termsSummary: params.termsSummary,
    teacherCommissionPercent: params.commissionPercent || profile.effectiveCommissionPercent,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  };

  storage.contracts.unshift(newContract);
  persistToDisk();

  return {
    success: true,
    contract: newContract,
    message: `پیش‌نویس قرارداد "${newContract.contractTitle}" با موفقیت ایجاد و جهت امضا آماده شد.`,
  };
}

export function sendContractForSignature(contractId: string): {
  success: boolean;
  contract?: TeacherContractItem;
  message: string;
} {
  const storage = getTeacherContractsStorage();
  const contract = storage.contracts.find((c) => c.id === contractId);

  if (!contract) {
    return { success: false, message: "قرارداد مورد نظر یافت نشد." };
  }

  contract.status = "pending_signature";
  persistToDisk();

  return {
    success: true,
    contract,
    message: `پیامک دعوت به امضای دیجیتال برای استاد ${contract.teacherName} با موفقیت ارسال گردید.`,
  };
}

export function signContractOtp(params: {
  contractId: string;
  otpCode: string;
  signerIp?: string;
}): { success: boolean; contract?: TeacherContractItem; message: string } {
  const storage = getTeacherContractsStorage();
  const contract = storage.contracts.find((c) => c.id === params.contractId);

  if (!contract) {
    return { success: false, message: "قرارداد مورد نظر یافت نشد." };
  }

  const profile = storage.profiles.find((p) => p.teacherId === contract.teacherId);

  contract.status = "active_signed";
  contract.signedAt = new Date().toISOString();
  contract.digitalSignature = {
    signerPhone: profile?.phone || "09120000000",
    otpTrackingCode: `OTP-${params.otpCode || Math.floor(100000 + Math.random() * 900000)}`,
    signerIp: params.signerIp || "185.190.24.110",
    nationalIdHash: `SHA256:${profile?.nationalId || "0000000000"}:SEAL-${Date.now().toString().slice(-4)}`,
  };

  if (profile) {
    profile.hasSignedActiveContract = true;
    profile.activeContractId = contract.id;
  }

  persistToDisk();
  return {
    success: true,
    contract,
    message: `امضای دیجیتال پیامکی قرارداد #${contract.id} با موفقیت ثبت شد و قرارداد رسمیت یافت.`,
  };
}

export function terminateContract(
  contractId: string,
  reason: string
): { success: boolean; contract?: TeacherContractItem; message: string } {
  const storage = getTeacherContractsStorage();
  const contract = storage.contracts.find((c) => c.id === contractId);

  if (!contract) {
    return { success: false, message: "قرارداد مورد نظر یافت نشد." };
  }

  contract.status = "terminated";
  const profile = storage.profiles.find((p) => p.teacherId === contract.teacherId);
  if (profile && profile.activeContractId === contractId) {
    profile.hasSignedActiveContract = false;
  }

  persistToDisk();
  return {
    success: true,
    contract,
    message: `قرارداد #${contractId} به دلیل "${reason}" فسخ گردید و تسویه‌حساب خودکار متوقف شد.`,
  };
}

export function setCustomCommission(params: {
  teacherId: string;
  customPercent: number;
  reason: string;
}): { success: boolean; profile?: TeacherCommissionProfile; message: string } {
  const storage = getTeacherContractsStorage();
  const profile = storage.profiles.find((p) => p.teacherId === params.teacherId);

  if (!profile) {
    return { success: false, message: "مدرس مورد نظر یافت نشد." };
  }

  profile.isCustomOverride = true;
  profile.effectiveCommissionPercent = params.customPercent;
  profile.customOverrideReason = params.reason;

  persistToDisk();
  return {
    success: true,
    profile,
    message: `سهم کارمزد اختصاصی ${params.customPercent}٪ برای استاد ${profile.teacherName} ثبت شد.`,
  };
}

export function evaluateTierPromotion(teacherId: string): {
  success: boolean;
  promoted: boolean;
  previousTier: CommissionTierKey;
  newTier: CommissionTierKey;
  profile?: TeacherCommissionProfile;
  message: string;
} {
  const storage = getTeacherContractsStorage();
  const profile = storage.profiles.find((p) => p.teacherId === teacherId);

  if (!profile) {
    return {
      success: false,
      promoted: false,
      previousTier: "bronze",
      newTier: "bronze",
      message: "مدرس مورد نظر یافت نشد.",
    };
  }

  const prev = profile.currentTier;
  let targetTier: CommissionTierKey = "bronze";

  // Check tiers from diamond down to silver
  const diamondCfg = storage.tiers.find((t) => t.key === "diamond")!;
  const goldCfg = storage.tiers.find((t) => t.key === "gold")!;
  const silverCfg = storage.tiers.find((t) => t.key === "silver")!;

  if (
    profile.totalTeachingHours >= diamondCfg.minTeachingHours &&
    profile.totalCourseSales >= diamondCfg.minCourseSales &&
    profile.averageRating >= diamondCfg.minRating
  ) {
    targetTier = "diamond";
  } else if (
    profile.totalTeachingHours >= goldCfg.minTeachingHours &&
    profile.totalCourseSales >= goldCfg.minCourseSales &&
    profile.averageRating >= goldCfg.minRating
  ) {
    targetTier = "gold";
  } else if (
    profile.totalTeachingHours >= silverCfg.minTeachingHours &&
    profile.totalCourseSales >= silverCfg.minCourseSales &&
    profile.averageRating >= silverCfg.minRating
  ) {
    targetTier = "silver";
  }

  const promoted = targetTier !== prev;
  if (promoted) {
    profile.currentTier = targetTier;
    if (!profile.isCustomOverride) {
      const tierCfg = storage.tiers.find((t) => t.key === targetTier);
      if (tierCfg) {
        profile.effectiveCommissionPercent = tierCfg.teacherSharePercent;
      }
    }
    persistToDisk();
  }

  return {
    success: true,
    promoted,
    previousTier: prev,
    newTier: targetTier,
    profile,
    message: promoted
      ? `استاد ${profile.teacherName} با موفقیت به سطح ${targetTier} ارتقا یافت.`
      : `استاد ${profile.teacherName} در حال حاضر در سطح شایسته ${prev} قرار دارد.`,
  };
}

export function toggleLegalHold(params: {
  teacherId: string;
  isHoldActive: boolean;
  reason?: string;
}): { success: boolean; profile?: TeacherCommissionProfile; message: string } {
  const storage = getTeacherContractsStorage();
  const profile = storage.profiles.find((p) => p.teacherId === params.teacherId);

  if (!profile) {
    return { success: false, message: "مدرس مورد نظر یافت نشد." };
  }

  profile.isLegalHoldActive = params.isHoldActive;
  profile.legalHoldReason = params.isHoldActive ? params.reason : undefined;

  persistToDisk();
  return {
    success: true,
    profile,
    message: params.isHoldActive
      ? `فریز حقوقی برای استاد ${profile.teacherName} فعال شد؛ کلیه تسویه‌حساب‌ها متوقف گردید.`
      : `فریز حقوقی استاد ${profile.teacherName} لغو شد؛ وضعیت تسویه‌حساب به حالت عادی بازگشت.`,
  };
}

export function updateWithholdingTax(params: {
  teacherId: string;
  taxPercent: number;
}): { success: boolean; profile?: TeacherCommissionProfile; message: string } {
  const storage = getTeacherContractsStorage();
  const profile = storage.profiles.find((p) => p.teacherId === params.teacherId);

  if (!profile) {
    return { success: false, message: "مدرس مورد نظر یافت نشد." };
  }

  profile.withholdingTaxPercent = params.taxPercent;
  persistToDisk();

  return {
    success: true,
    profile,
    message: `نرخ مالیات تکلیفی استاد ${profile.teacherName} به ${params.taxPercent}٪ به‌روزرسانی شد.`,
  };
}

export function isTeacherPayoutAllowed(teacherId: string): {
  allowed: boolean;
  reason?: string;
} {
  const storage = getTeacherContractsStorage();
  const profile = storage.profiles.find((p) => p.teacherId === teacherId);

  if (!profile) {
    return { allowed: false, reason: "مدرس در سامانه قراردادها یافت نشد." };
  }

  if (profile.isLegalHoldActive) {
    return {
      allowed: false,
      reason: `فریز حقوقی فعال است: ${profile.legalHoldReason || "تحت بررسی تیم حقوقی"}`,
    };
  }

  if (!profile.hasSignedActiveContract) {
    return {
      allowed: false,
      reason: "مدرس فاقد قرارداد امضاشده و فعال در سامانه است (گاردریل Hard Payout Gate).",
    };
  }

  return { allowed: true };
}

export function resetTeacherContractsDataToInitial(): void {
  inMemoryTeacherContracts = {
    tiers: JSON.parse(JSON.stringify(INITIAL_COMMISSION_TIERS)),
    profiles: JSON.parse(JSON.stringify(INITIAL_TEACHER_PROFILES)),
    contracts: JSON.parse(JSON.stringify(INITIAL_TEACHER_CONTRACTS)),
  };
  persistToDisk();
}
