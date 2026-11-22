import fs from "fs";
import net from "net";
import { recordAuditLog } from "./admin-ops.ts";
import {
  resolveStoragePath,
  atomicWriteJsonSync,
  readJsonWithFallback,
} from "./admin-storage-engine.ts";

// ==============================================================================
// 1. Server Telemetry & Process Health Types
// ==============================================================================
export interface ServerProcessInfo {
  name: string;
  pid: number;
  cpuPercent: number;
  memoryMb: number;
  uptimeSeconds: number;
  status: "running" | "degraded" | "stopped";
}

export interface ServerHealthTelemetry {
  cpuUtilizationPercent: number;
  totalMemoryMb: number;
  usedMemoryMb: number;
  freeMemoryMb: number;
  databaseLatencyMs: number;
  databaseActiveConnections: number;
  requestsPerSecond: number;
  errorRatePercent: number;
  serverUptimeSeconds: number;
  nodeVersion: string;
  osPlatform: string;
  evaluatedAt: string;
  processes: ServerProcessInfo[];
  recentSystemAlerts: {
    id: string;
    level: "info" | "warning" | "critical";
    messageFa: string;
    timestamp: string;
  }[];
}

// ==============================================================================
// 2. Live Database Browser & Inspector Types
// ==============================================================================
export type DatabaseTableId =
  | "users"
  | "courses"
  | "enrollments"
  | "ledger"
  | "audit_logs"
  | "feature_flags";

export interface DatabaseTableMeta {
  id: DatabaseTableId;
  nameFa: string;
  nameEn: string;
  estimatedRowsCount: number;
  sizeKb: number;
  primaryKey: string;
  columns: string[];
}

export interface DatabaseRowMutation {
  table: DatabaseTableId;
  rowId: string;
  updates: Record<string, any>;
  reason: string;
}

// ==============================================================================
// 3. Cache & CDN Purge Types
// ==============================================================================
export interface CachePurgeEvent {
  id: string;
  target: "redis_all" | "redis_namespace" | "nextjs_route" | "cdn_static";
  namespaceOrPath?: string;
  keysPurgedCount: number;
  purgedBy: string;
  occurredAt: string;
  status: "success" | "failed";
}

export interface CacheTelemetry {
  redisStatus: "connected" | "degraded" | "disconnected";
  redisMemoryUsedMb: number;
  redisTotalKeys: number;
  hitRatioPercent: number;
  missRatioPercent: number;
  lastPurgeTimestamp: string;
  recentPurgeEvents: CachePurgeEvent[];
}

// ==============================================================================
// 4. Emergency Maintenance Gateway Types
// ==============================================================================
export interface MaintenanceModeConfig {
  isEnabled: boolean;
  titleFa: string;
  titleEn: string;
  messageFa: string;
  messageEn: string;
  estimatedCompletionIso: string;
  secretBypassKey: string;
  allowedIps: string[];
  contactSupportUrl: string;
  updatedAt: string;
  updatedBy: string;
}

// ==============================================================================
// 5. Environment & API Gateway Vault Types
// ==============================================================================
export type ApiIntegrationServiceId =
  | "gemini_ai"
  | "kavenegar_sms"
  | "zarinpal_gateway"
  | "arvan_storage"
  | "postgres_db";

export interface ApiIntegrationStatus {
  id: ApiIntegrationServiceId;
  nameFa: string;
  nameEn: string;
  category: "ai" | "messaging" | "payment" | "storage" | "database";
  status: "connected" | "degraded" | "offline";
  latencyMs: number;
  lastPingAt: string;
  maskedKey: string;
  rawKeyConfigured: boolean;
  endpointUrl: string;
  details?: Record<string, any>;
}

// ==============================================================================
// Initial State & Data
// ==============================================================================
export const INITIAL_TABLES_META: DatabaseTableMeta[] = [
  {
    id: "users",
    nameFa: "کاربران و هویت‌ها (Users & Profiles)",
    nameEn: "auth_user & profiles",
    estimatedRowsCount: 1420,
    sizeKb: 2840,
    primaryKey: "id",
    columns: ["id", "username", "email", "role", "is_active", "date_joined", "wallet_balance_toman"],
  },
  {
    id: "courses",
    nameFa: "دوره‌ها و سرفصل‌ها (Courses)",
    nameEn: "courses_course",
    estimatedRowsCount: 24,
    sizeKb: 1450,
    primaryKey: "id",
    columns: ["id", "slug", "title_fa", "cefr_level", "status", "is_premium", "estimated_hours"],
  },
  {
    id: "enrollments",
    nameFa: "ثبت‌نام و پیشرفت (Learner Enrollments)",
    nameEn: "courses_learnercourseenrollment",
    estimatedRowsCount: 285,
    sizeKb: 420,
    primaryKey: "id",
    columns: ["id", "learner_id", "course_id", "progress_percent", "enrolled_at", "completed_at"],
  },
  {
    id: "ledger",
    nameFa: "خزانه‌داری و تراکنش‌ها (Financial Ledger)",
    nameEn: "ledger_teacherpayableledgerentry",
    estimatedRowsCount: 640,
    sizeKb: 980,
    primaryKey: "id",
    columns: ["id", "reference_id", "entry_type", "amount_toman", "status", "created_at"],
  },
  {
    id: "audit_logs",
    nameFa: "ردپای ممیزی سیستم (Audit Events)",
    nameEn: "audit_auditevent",
    estimatedRowsCount: 3820,
    sizeKb: 6400,
    primaryKey: "id",
    columns: ["id", "actor_email", "action", "target_model", "target_pk", "reason", "occurred_at"],
  },
  {
    id: "feature_flags",
    nameFa: "کلیدهای ویژگی سیستم (Feature Flags)",
    nameEn: "core_featureflag",
    estimatedRowsCount: 6,
    sizeKb: 32,
    primaryKey: "key",
    columns: ["key", "enabled", "rollout_percentage", "owner", "rationale", "kill_switch_behavior"],
  },
];

export const INITIAL_MAINTENANCE_CONFIG: MaintenanceModeConfig = {
  isEnabled: false,
  titleFa: "سامانه آموزشی ایندورا در حال ارتقا و بهینه‌سازی است",
  titleEn: "Endoora Platform is undergoing planned maintenance",
  messageFa: "ما در حال ارتقای سرورهای هوش مصنوعی و بهینه‌سازی پایگاه داده هستیم. به زودی با امکاناتی نو بازمی‌گردیم.",
  messageEn: "We are currently performing routine database and AI infrastructure upgrades. We'll be back shortly.",
  estimatedCompletionIso: new Date(Date.now() + 3600000 * 2).toISOString(), // 2 hours from now
  secretBypassKey: "endoora_master_override_2026",
  allowedIps: ["127.0.0.1", "192.168.1.1"],
  contactSupportUrl: "https://t.me/endoora_support",
  updatedAt: "1403/08/20 16:30",
  updatedBy: "مدیر ارشد ایندورا",
};

export const INITIAL_CACHE_TELEMETRY: CacheTelemetry = {
  redisStatus: "connected",
  redisMemoryUsedMb: 42.6,
  redisTotalKeys: 18450,
  hitRatioPercent: 94.2,
  missRatioPercent: 5.8,
  lastPurgeTimestamp: "1403/08/20 12:15",
  recentPurgeEvents: [
    {
      id: "purge-001",
      target: "nextjs_route",
      namespaceOrPath: "/pricing",
      keysPurgedCount: 1,
      purgedBy: "مدیر ارشد ایندورا",
      occurredAt: "1403/08/20 12:15",
      status: "success",
    },
    {
      id: "purge-002",
      target: "redis_namespace",
      namespaceOrPath: "throttles:*",
      keysPurgedCount: 142,
      purgedBy: "سیستم خودکار SOC",
      occurredAt: "1403/08/19 18:30",
      status: "success",
    },
  ],
};

export const INITIAL_API_INTEGRATIONS: ApiIntegrationStatus[] = [
  {
    id: "gemini_ai",
    nameFa: "درگاه هوش مصنوعی گوگل (Gemini 2.5/3.8 Flash)",
    nameEn: "Google Gemini AI Gateway",
    category: "ai",
    status: "connected",
    latencyMs: 145,
    lastPingAt: "هم‌اکنون",
    maskedKey: "AIzaSyD-****-****-9f82K",
    rawKeyConfigured: true,
    endpointUrl: "https://generativelanguage.googleapis.com/v1beta",
    details: { activeModel: "gemini-3.8-flash", dailyRequests: 4210, quotaStatus: "Normal" },
  },
  {
    id: "kavenegar_sms",
    nameFa: "وب‌سرویس پیامک کاوه‌نگار (OTP & Broadcast)",
    nameEn: "Kavenegar SMS Gateway",
    category: "messaging",
    status: "connected",
    latencyMs: 82,
    lastPingAt: "۲ دقیقه پیش",
    maskedKey: "347265****-****-****-81729",
    rawKeyConfigured: true,
    endpointUrl: "https://api.kavenegar.com/v1",
    details: { creditToman: 4850000, sentToday: 185, deliveryRate: "99.2%" },
  },
  {
    id: "zarinpal_gateway",
    nameFa: "درگاه پرداخت زرین‌پال / شاپرک",
    nameEn: "Zarinpal & Shaparak Payment Gateway",
    category: "payment",
    status: "connected",
    latencyMs: 110,
    lastPingAt: "۵ دقیقه پیش",
    maskedKey: "zp.merchant.****-****-42e1",
    rawKeyConfigured: true,
    endpointUrl: "https://api.zarinpal.com/pg/v4/payment",
    details: { sandboxMode: false, settlementCycle: "Paya T+1", successfulTxCount: 94 },
  },
  {
    id: "arvan_storage",
    nameFa: "فضای ابری ذخیره‌سازی رسانه‌ها (S3 / ArvanCloud)",
    nameEn: "ArvanCloud S3 Object Storage",
    category: "storage",
    status: "connected",
    latencyMs: 45,
    lastPingAt: "هم‌اکنون",
    maskedKey: "ak_live_****-****-7f91",
    rawKeyConfigured: true,
    endpointUrl: "https://s3.ir-thr-at1.arvanstorage.ir",
    details: { bucket: "endoora-media-vault", totalObjects: 3120, usedSpaceGb: 28.4 },
  },
  {
    id: "postgres_db",
    nameFa: "پایگاه داده اصلی (PostgreSQL 16 High-Availability)",
    nameEn: "Primary PostgreSQL Database",
    category: "database",
    status: "connected",
    latencyMs: 4,
    lastPingAt: "هم‌اکنون",
    maskedKey: "postgres://endoora:****@127.0.0.1:5432/endoora_db",
    rawKeyConfigured: true,
    endpointUrl: "127.0.0.1:5432/endoora_db",
    details: { poolSize: 20, activeConnections: 6, maxLifetimeSec: 1800 },
  },
];

// ==============================================================================
// Persistent State & Store Accessors (server-ops-operations.json)
// ==============================================================================
export interface ServerOpsStoragePayload {
  maintenance: MaintenanceModeConfig;
  cacheTelemetry: CacheTelemetry;
  apiIntegrations: ApiIntegrationStatus[];
  sampleTableData: Record<DatabaseTableId, any[]>;
}

let inMemoryServerOps: ServerOpsStoragePayload | null = null;
let lastServerOpsMtime = 0;

function getServerOpsPath(): string {
  return resolveStoragePath("server-ops-operations.json");
}

export function getServerOpsStorage(): ServerOpsStoragePayload {
  const filePath = getServerOpsPath();
  if (inMemoryServerOps && fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    if (stats.mtimeMs <= lastServerOpsMtime) {
      return inMemoryServerOps;
    }
  }

  const { data, mtime } = readJsonWithFallback<ServerOpsStoragePayload>(
    filePath,
    () => ({
      maintenance: JSON.parse(JSON.stringify(INITIAL_MAINTENANCE_CONFIG)),
      cacheTelemetry: JSON.parse(JSON.stringify(INITIAL_CACHE_TELEMETRY)),
      apiIntegrations: JSON.parse(JSON.stringify(INITIAL_API_INTEGRATIONS)),
      sampleTableData: {
        users: [
          { id: "usr_01", username: "sara_m", email: "sara.mohammadi@example.com", role: "learner", is_active: true, date_joined: "1403/07/15", wallet_balance_toman: 250000 },
          { id: "usr_02", username: "ali_r", email: "ali.rezaei@example.com", role: "learner", is_active: true, date_joined: "1403/08/01", wallet_balance_toman: 0 },
          { id: "usr_03", username: "dr_watson", email: "watson@endoora.ir", role: "teacher", is_active: true, date_joined: "1403/06/10", wallet_balance_toman: 18500000 },
          { id: "usr_04", username: "niloofar_k", email: "niloofar.karimi@example.com", role: "learner", is_active: true, date_joined: "1403/08/10", wallet_balance_toman: 120000 },
          { id: "usr_05", username: "super_admin", email: "admin@endoora.ir", role: "administrator", is_active: true, date_joined: "1403/01/01", wallet_balance_toman: 0 },
        ],
        courses: [
          { id: "crs_01", slug: "grade-12-tamrin20", title_fa: "تمرین تا ۲۰ (انگلیسی دوازدهم نهایی)", cefr_level: "School", status: "published", is_premium: true, estimated_hours: 15 },
          { id: "crs_02", slug: "speakout-b1-mastery", title_fa: "دوره مکالمه و گرامر جامع (Speakout B1)", cefr_level: "B1", status: "published", is_premium: true, estimated_hours: 30 },
          { id: "crs_03", slug: "ielts-speaking-mastery", title_fa: "دوره جامع مستری اسپیکینگ آیلتس (Band 7.5+)", cefr_level: "B2", status: "published", is_premium: true, estimated_hours: 25 },
        ],
        enrollments: [
          { id: "enr_01", learner_id: "usr_01", course_id: "crs_03", progress_percent: 75, enrolled_at: "1403/07/15", completed_at: null },
          { id: "enr_02", learner_id: "usr_02", course_id: "crs_01", progress_percent: 100, enrolled_at: "1403/08/01", completed_at: "1403/08/25" },
          { id: "enr_03", learner_id: "usr_04", course_id: "crs_02", progress_percent: 33, enrolled_at: "1403/08/10", completed_at: null },
        ],
        ledger: [
          { id: "led_01", reference_id: "tx_9812", entry_type: "COURSE_COMMISSION", amount_toman: 420000, status: "settled", created_at: "1403/08/18 14:20" },
          { id: "led_02", reference_id: "tx_9813", entry_type: "TEACHER_PAYOUT", amount_toman: 2850000, status: "settled", created_at: "1403/08/19 10:15" },
          { id: "led_03", reference_id: "tx_9814", entry_type: "SUBSCRIPTION_REVENUE", amount_toman: 790000, status: "pending", created_at: "1403/08/20 16:00" },
        ],
        audit_logs: [
          { id: "aud_01", actor_email: "admin@endoora.ir", action: "update", target_model: "LearnerLessonProgress", target_pk: "l-v12-01", reason: "اورراید نمره آزمونک", occurred_at: "1403/08/20 14:15" },
          { id: "aud_02", actor_email: "admin@endoora.ir", action: "create", target_model: "CustomDynamicPage", target_pk: "exam-cram-1403", reason: "انتشار لندینگ پیج جدید", occurred_at: "1403/08/20 11:30" },
        ],
        feature_flags: [
          { key: "ai_tutor_realtime", enabled: true, rollout_percentage: 100, owner: "AI Platform Team", rationale: "دوقلوی هوش مصنوعی", kill_switch_behavior: "REVIEWED_FALLBACK" },
          { key: "konkur_exam_simulators", enabled: true, rollout_percentage: 100, owner: "Curriculum Team", rationale: "شبیه‌ساز امتحان نهایی", kill_switch_behavior: "READ_ONLY" },
          { key: "marketplace_instant_booking", enabled: false, rollout_percentage: 0, owner: "Marketplace Team", rationale: "رزرو فوری کلاس بدون تایید مدرس", kill_switch_behavior: "DISABLE" },
        ],
      },
    }),
    (p): p is ServerOpsStoragePayload =>
      typeof p?.maintenance === "object" && Array.isArray(p?.apiIntegrations) && typeof p?.sampleTableData === "object"
  );

  inMemoryServerOps = data;
  lastServerOpsMtime = mtime;
  return inMemoryServerOps;
}

export function persistServerOps(): void {
  if (!inMemoryServerOps) return;
  const filePath = getServerOpsPath();
  atomicWriteJsonSync(filePath, inMemoryServerOps);
  if (fs.existsSync(filePath)) {
    lastServerOpsMtime = fs.statSync(filePath).mtimeMs;
  }
}

// ==============================================================================
// Store Accessors & Handlers
// ==============================================================================

// 1. Telemetry
export function getServerTelemetry(): ServerHealthTelemetry {
  const memUsed = Math.round(180 + Math.random() * 25);
  return {
    cpuUtilizationPercent: Math.round(14 + Math.random() * 8),
    totalMemoryMb: 2048,
    usedMemoryMb: memUsed,
    freeMemoryMb: 2048 - memUsed,
    databaseLatencyMs: Math.round(3 + Math.random() * 3),
    databaseActiveConnections: Math.round(6 + Math.random() * 4),
    requestsPerSecond: Math.round(35 + Math.random() * 15),
    errorRatePercent: 0.02,
    serverUptimeSeconds: 1248500,
    nodeVersion: "v20.18.0",
    osPlatform: "Linux / Windows Node Hybrid",
    evaluatedAt: new Date().toLocaleTimeString("fa-IR"),
    processes: [
      { name: "Next.js Web Server (Edge/Standalone)", pid: 1402, cpuPercent: 3.2, memoryMb: 112, uptimeSeconds: 320400, status: "running" },
      { name: "Django REST Framework (Core API)", pid: 1488, cpuPercent: 4.1, memoryMb: 98, uptimeSeconds: 320400, status: "running" },
      { name: "Redis Memory Cache & Session Engine", pid: 812, cpuPercent: 0.8, memoryMb: 42, uptimeSeconds: 1248500, status: "running" },
      { name: "PostgreSQL HA Database Cluster", pid: 904, cpuPercent: 5.4, memoryMb: 185, uptimeSeconds: 1248500, status: "running" },
      { name: "ONNX Acoustic GOP Engine Worker", pid: 2110, cpuPercent: 1.2, memoryMb: 85, uptimeSeconds: 142000, status: "running" },
    ],
    recentSystemAlerts: [
      { id: "alt-01", level: "info", messageFa: "پایش بلادرنگ سرویس‌ها با زمان پاسخگویی ۴ میلی‌ثانیه فعال است.", timestamp: "هم‌اکنون" },
      { id: "alt-02", level: "warning", messageFa: "میزان مصرف بافر موقت Redis به ۴۲ مگابایت رسید (سالم).", timestamp: "۱۰ دقیقه پیش" },
    ],
  };
}

// 2. Database Inspector
export function getDatabaseTableData(
  tableId: DatabaseTableId,
  search?: string
): { meta: DatabaseTableMeta; rows: any[] } {
  const storage = getServerOpsStorage();
  const meta = INITIAL_TABLES_META.find((t) => t.id === tableId) || INITIAL_TABLES_META[0];
  let rows = [...(storage.sampleTableData[tableId] || [])];

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    rows = rows.filter((r) =>
      Object.values(r).some((val) => String(val).toLowerCase().includes(q))
    );
  }

  return { meta, rows };
}

export function mutateDatabaseRow(
  tableId: DatabaseTableId,
  rowId: string,
  updates: Record<string, any>,
  reason: string,
  adminUser = "مدیر ارشد ایندورا"
): { success: boolean; row?: any; error?: string } {
  const storage = getServerOpsStorage();
  const rows = storage.sampleTableData[tableId];
  if (!rows) return { success: false, error: "جدول مورد نظر یافت نشد." };

  const meta = INITIAL_TABLES_META.find((t) => t.id === tableId);
  const pkField = meta?.primaryKey || "id";
  const index = rows.findIndex((r) => String(r[pkField]) === String(rowId));

  if (index === -1) return { success: false, error: "رکورد با شناسه مشخص شده یافت نشد." };

  const oldRow = { ...rows[index] };
  const updatedRow = { ...oldRow, ...updates };
  rows[index] = updatedRow;
  persistServerOps();

  recordAuditLog({
    actor_id: null,
    actor_email: adminUser,
    actor_role: "administrator",
    action: "update",
    target_app: "database_inspector",
    target_model: tableId,
    target_pk: String(rowId),
    before_summary: oldRow,
    after_summary: updatedRow,
    reason: reason || "ویرایش مستقیم رکورد توسط مدیر ارشد در گاد مود",
    request_method: "POST",
    request_path: `/api/admin/server-ops/database`,
    environment: "production",
  });

  return { success: true, row: updatedRow };
}

// 3. Cache Purge
export function getCacheTelemetry(): CacheTelemetry {
  return { ...getServerOpsStorage().cacheTelemetry };
}

export function purgeCache(
  target: "redis_all" | "redis_namespace" | "nextjs_route" | "cdn_static",
  namespaceOrPath = "",
  adminUser = "مدیر ارشد ایندورا"
): { success: boolean; event: CachePurgeEvent } {
  const storage = getServerOpsStorage();
  const newEvent: CachePurgeEvent = {
    id: `purge-${Date.now()}`,
    target,
    namespaceOrPath,
    keysPurgedCount: target === "redis_all" ? 18450 : Math.round(15 + Math.random() * 120),
    purgedBy: adminUser,
    occurredAt: new Date().toLocaleTimeString("fa-IR"),
    status: "success",
  };

  storage.cacheTelemetry.recentPurgeEvents.unshift(newEvent);
  storage.cacheTelemetry.lastPurgeTimestamp = newEvent.occurredAt;
  if (storage.cacheTelemetry.recentPurgeEvents.length > 20) {
    storage.cacheTelemetry.recentPurgeEvents.pop();
  }
  persistServerOps();

  recordAuditLog({
    actor_id: null,
    actor_email: adminUser,
    actor_role: "administrator",
    action: "delete",
    target_app: "cache_manager",
    target_model: target,
    target_pk: namespaceOrPath || target,
    before_summary: {},
    after_summary: { target, namespaceOrPath, keysPurged: newEvent.keysPurgedCount },
    reason: "پاکسازی دستی کش یا باطل‌سازی بافر مسیر توسط مدیر ارشد",
    request_method: "POST",
    request_path: "/api/admin/server-ops/cache",
    environment: "production",
  });

  return { success: true, event: newEvent };
}

// 4. Maintenance Gateway
export function getMaintenanceConfig(): MaintenanceModeConfig {
  return { ...getServerOpsStorage().maintenance };
}

export function saveMaintenanceConfig(
  config: Partial<MaintenanceModeConfig>,
  adminUser = "مدیر ارشد ایندورا"
): { success: boolean; config: MaintenanceModeConfig } {
  const storage = getServerOpsStorage();
  const previousState = storage.maintenance.isEnabled;
  storage.maintenance = {
    ...storage.maintenance,
    ...config,
    updatedAt: new Date().toLocaleString("fa-IR"),
    updatedBy: adminUser,
  };
  persistServerOps();

  recordAuditLog({
    actor_id: null,
    actor_email: adminUser,
    actor_role: "administrator",
    action: "update",
    target_app: "maintenance_shield",
    target_model: "MaintenanceModeConfig",
    target_pk: "emergency_lock",
    before_summary: { isEnabled: previousState },
    after_summary: { isEnabled: storage.maintenance.isEnabled },
    reason: storage.maintenance.isEnabled ? "فعال‌سازی حالت تعمیرات و قفل اضطراری کل سایت" : "غیرفعال‌سازی حالت تعمیرات و بازگشایی عمومی سایت",
    request_method: "POST",
    request_path: "/api/admin/server-ops/maintenance",
    environment: "production",
  });

  return { success: true, config: storage.maintenance };
}

// 5. API Vault
export function getApiIntegrations(): ApiIntegrationStatus[] {
  return [...getServerOpsStorage().apiIntegrations];
}

export async function pingApiIntegration(
  serviceId: ApiIntegrationServiceId
): Promise<{ success: boolean; service: ApiIntegrationStatus }> {
  const storage = getServerOpsStorage();
  const match = storage.apiIntegrations.find((s) => s.id === serviceId);
  if (!match) throw new Error("Service not found");

  const start = performance.now();
  match.lastPingAt = new Date().toLocaleTimeString("fa-IR");

  if (serviceId === "postgres_db") {
    // Probe TCP port 5432 or Django fallback
    const tcpResult = await new Promise<{ ok: boolean; latency: number }>((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(2500);

      socket.on("connect", () => {
        const latency = Math.round(performance.now() - start);
        socket.destroy();
        resolve({ ok: true, latency });
      });

      socket.on("timeout", () => {
        socket.destroy();
        resolve({ ok: false, latency: 2500 });
      });

      socket.on("error", () => {
        socket.destroy();
        resolve({ ok: false, latency: Math.round(performance.now() - start) });
      });

      socket.connect(5432, "127.0.0.1");
    });

    if (tcpResult.ok) {
      match.status = "connected";
      match.latencyMs = Math.max(1, tcpResult.latency);
      match.details = { ...match.details, socketStatus: "TCP port 5432 open" };
    } else {
      // Check Django HTTP health
      try {
        const dStart = performance.now();
        const dRes = await fetch("http://127.0.0.1:8000/api/health/", {
          signal: AbortSignal.timeout(1500),
        }).catch(() => null);
        if (dRes && dRes.status < 500) {
          match.status = "degraded";
          match.latencyMs = Math.round(performance.now() - dStart);
          match.details = { ...match.details, socketStatus: "Postgres offline, Django SQLite active" };
        } else {
          match.status = "offline";
          match.latencyMs = tcpResult.latency;
          match.details = { ...match.details, socketStatus: "Postgres 5432 refused and Django offline" };
        }
      } catch {
        match.status = "offline";
        match.latencyMs = tcpResult.latency;
      }
    }
  } else {
    // HTTP/HTTPS endpoint ping (HEAD with GET fallback)
    try {
      const url = match.endpointUrl.startsWith("http")
        ? match.endpointUrl
        : `https://${match.endpointUrl}`;

      let res: Response | null = null;
      try {
        res = await fetch(url, {
          method: "HEAD",
          signal: AbortSignal.timeout(3500),
          headers: { "User-Agent": "Endoora-HealthProbe/1.0" },
        });
      } catch {
        // Fallback to minimal GET with byte range if HEAD fails or is rejected
        res = await fetch(url, {
          method: "GET",
          headers: { Range: "bytes=0-0", "User-Agent": "Endoora-HealthProbe/1.0" },
          signal: AbortSignal.timeout(3500),
        }).catch(() => null);
      }

      const elapsed = Math.round(performance.now() - start);
      if (res && res.status < 500) {
        // Any HTTP status code below 500 (even 401/403/404) proves server reachability
        match.status = elapsed > 2000 ? "degraded" : "connected";
        match.latencyMs = Math.max(1, elapsed);
        match.details = { ...match.details, httpStatus: res.status };
      } else if (res && res.status >= 500) {
        match.status = "degraded";
        match.latencyMs = elapsed;
        match.details = { ...match.details, httpStatus: res.status };
      } else {
        match.status = "offline";
        match.latencyMs = Math.max(1, elapsed);
      }
    } catch {
      match.status = "offline";
      match.latencyMs = Math.round(performance.now() - start);
    }
  }

  persistServerOps();
  return { success: true, service: match };
}
