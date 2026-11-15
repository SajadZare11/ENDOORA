import fs from "fs";
import path from "path";
export * from "./security-command-content.ts";
import {
  type LiveUserSession,
  type IpFirewallRule,
  type MaintenanceConfig,
  type SecurityCommandStats,
  type AttackVectorType,
  INITIAL_ACTIVE_SESSIONS,
  INITIAL_IP_FIREWALL_RULES,
  INITIAL_MAINTENANCE_CONFIG,
} from "./security-command-content.ts";

interface SecurityStoragePayload {
  sessions: LiveUserSession[];
  rules: IpFirewallRule[];
  maintenanceConfig: MaintenanceConfig;
}

let inMemorySecurity: SecurityStoragePayload | null = null;

function resolveStoragePath(): string {
  const candidateWeb = path.join(process.cwd(), "apps", "web", "data", "security-operations.json");
  const candidateLocal = path.join(process.cwd(), "data", "security-operations.json");
  if (fs.existsSync(path.dirname(candidateWeb))) {
    return candidateWeb;
  }
  return candidateLocal;
}

function persistToDisk(): void {
  if (!inMemorySecurity) return;
  try {
    const filePath = resolveStoragePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(inMemorySecurity, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not persist security operations data to disk:", err);
  }
}

export function getSecurityCommandData(): SecurityStoragePayload {
  if (inMemorySecurity) {
    return inMemorySecurity;
  }

  const filePath = resolveStoragePath();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      inMemorySecurity = JSON.parse(raw);
      return inMemorySecurity!;
    }
  } catch (err) {
    console.warn("Could not read security-operations.json, seeding initial data:", err);
  }

  inMemorySecurity = {
    sessions: [...INITIAL_ACTIVE_SESSIONS],
    rules: [...INITIAL_IP_FIREWALL_RULES],
    maintenanceConfig: { ...INITIAL_MAINTENANCE_CONFIG },
  };

  persistToDisk();
  return inMemorySecurity;
}

export function getSecurityCommandStats(): SecurityCommandStats {
  const data = getSecurityCommandData();
  const suspiciousCount = data.sessions.filter(
    (s) => s.riskLevel === "high" || s.riskLevel === "critical"
  ).length;

  const activeBlacklist = data.rules.filter(
    (r) => r.ruleType === "blacklist" && r.status === "active"
  );
  const activeWhitelist = data.rules.filter(
    (r) => r.ruleType === "whitelist" && r.status === "active"
  );

  const attacksToday = activeBlacklist.reduce((sum, r) => sum + r.failedAttemptsCount, 0);

  const activeScores = data.rules.filter((r) => r.status === "active");
  const avgScore =
    activeScores.length > 0
      ? Math.round(
          activeScores.reduce((sum, r) => sum + r.threatScore, 0) / activeScores.length
        )
      : 0;

  return {
    totalActiveSessions: data.sessions.length,
    suspiciousSessionsCount: suspiciousCount,
    activeBlockedIps: activeBlacklist.length,
    whitelistedIpsCount: activeWhitelist.length,
    attacksBlockedToday: attacksToday,
    isMaintenanceActive: data.maintenanceConfig.isMaintenanceActive,
    avgThreatScore: avgScore,
  };
}

export function killSession(sessionId: string): { success: boolean; message: string } {
  const data = getSecurityCommandData();
  const initialLen = data.sessions.length;
  data.sessions = data.sessions.filter((s) => s.id !== sessionId);

  if (data.sessions.length < initialLen) {
    persistToDisk();
    return { success: true, message: `نشست با شناسه ${sessionId} با موفقیت ابطال و اتصال کاربر قطع شد.` };
  }
  return { success: false, message: "نشست مورد نظر یافت نشد یا قبلاً خاتمه یافته است." };
}

export function forceLogoutAllUserSessions(userId: string): {
  success: boolean;
  removedCount: number;
  message: string;
} {
  const data = getSecurityCommandData();
  const initialLen = data.sessions.length;
  data.sessions = data.sessions.filter((s) => s.userId !== userId);
  const removed = initialLen - data.sessions.length;

  if (removed > 0) {
    persistToDisk();
    return {
      success: true,
      removedCount: removed,
      message: `تعداد ${removed} نشست فعال کاربر با موفقیت مسدود و خروج اجباری انجام شد.`,
    };
  }
  return {
    success: false,
    removedCount: 0,
    message: "هیچ نشست فعالی برای این کاربر در سیستم یافت نشد.",
  };
}

export function blockIp(params: {
  ipAddress: string;
  reason: string;
  duration?: "24_hours" | "7_days" | "permanent";
  attackVector?: AttackVectorType;
  threatScore?: number;
  createdBy?: string;
}): { success: boolean; rule: IpFirewallRule } {
  const data = getSecurityCommandData();
  const duration = params.duration || "permanent";

  let expiresAt: string | null = null;
  const now = new Date();
  if (duration === "24_hours") {
    expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
  } else if (duration === "7_days") {
    expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
  }

  const existingRule = data.rules.find((r) => r.ipAddress === params.ipAddress.trim());

  if (existingRule) {
    existingRule.ruleType = "blacklist";
    existingRule.status = "active";
    existingRule.reason = params.reason;
    existingRule.duration = duration;
    existingRule.expiresAt = expiresAt;
    existingRule.threatScore = params.threatScore ?? Math.max(existingRule.threatScore, 85);
    existingRule.attackVector = params.attackVector || existingRule.attackVector;
    existingRule.createdBy = params.createdBy || existingRule.createdBy;
    persistToDisk();
    return { success: true, rule: existingRule };
  }

  const newRule: IpFirewallRule = {
    id: `ip-rule-${Date.now()}`,
    ipAddress: params.ipAddress.trim(),
    ruleType: "blacklist",
    threatScore: params.threatScore ?? 90,
    attackVector: params.attackVector || "manual_admin_ban",
    reason: params.reason,
    failedAttemptsCount: 1,
    duration,
    expiresAt,
    createdAt: new Date().toISOString(),
    createdBy: params.createdBy || "مدیر ارشد امنیت",
    status: "active",
  };

  data.rules.unshift(newRule);
  persistToDisk();
  return { success: true, rule: newRule };
}

export function unblockIp(ruleId: string): { success: boolean; message: string } {
  const data = getSecurityCommandData();
  const rule = data.rules.find((r) => r.id === ruleId);

  if (!rule) {
    return { success: false, message: "قانون فایروال با این شناسه یافت نشد." };
  }

  rule.status = "lifted";
  persistToDisk();
  return { success: true, message: `محدودیت آدرس ${rule.ipAddress} لغو و از حالت مسدود خارج گردید.` };
}

export function whitelistIp(params: {
  ipAddress: string;
  reason: string;
  createdBy?: string;
}): { success: boolean; rule: IpFirewallRule } {
  const data = getSecurityCommandData();
  const existingRule = data.rules.find((r) => r.ipAddress === params.ipAddress.trim());

  if (existingRule) {
    existingRule.ruleType = "whitelist";
    existingRule.status = "active";
    existingRule.threatScore = 0;
    existingRule.reason = params.reason;
    existingRule.attackVector = "trusted_office_ip";
    existingRule.duration = "permanent";
    existingRule.expiresAt = null;
    persistToDisk();
    return { success: true, rule: existingRule };
  }

  const newRule: IpFirewallRule = {
    id: `ip-rule-${Date.now()}`,
    ipAddress: params.ipAddress.trim(),
    ruleType: "whitelist",
    threatScore: 0,
    attackVector: "trusted_office_ip",
    reason: params.reason,
    failedAttemptsCount: 0,
    duration: "permanent",
    expiresAt: null,
    createdAt: new Date().toISOString(),
    createdBy: params.createdBy || "مدیر ارشد سیستم",
    status: "active",
  };

  data.rules.unshift(newRule);
  persistToDisk();
  return { success: true, rule: newRule };
}

export function updateMaintenanceConfig(params: Partial<MaintenanceConfig>): {
  success: boolean;
  config: MaintenanceConfig;
} {
  const data = getSecurityCommandData();
  data.maintenanceConfig = {
    ...data.maintenanceConfig,
    ...params,
    updatedAt: new Date().toISOString(),
  };
  persistToDisk();
  return { success: true, config: data.maintenanceConfig };
}

export function resetSecurityCommandDataToInitial(): void {
  inMemorySecurity = {
    sessions: JSON.parse(JSON.stringify(INITIAL_ACTIVE_SESSIONS)),
    rules: JSON.parse(JSON.stringify(INITIAL_IP_FIREWALL_RULES)),
    maintenanceConfig: JSON.parse(JSON.stringify(INITIAL_MAINTENANCE_CONFIG)),
  };
  persistToDisk();
}
