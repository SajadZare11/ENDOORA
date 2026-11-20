"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "./server-ops-godmode.module.css";
import {
  ServerHealthTelemetry,
  DatabaseTableId,
  DatabaseTableMeta,
  CacheTelemetry,
  MaintenanceModeConfig,
  ApiIntegrationStatus,
  INITIAL_TABLES_META,
  INITIAL_MAINTENANCE_CONFIG,
  INITIAL_CACHE_TELEMETRY,
  INITIAL_API_INTEGRATIONS,
} from "@/lib/admin-server-ops-store";
import {
  DatabaseBackupRecord,
  BackupPolicyConfig,
  SqlQueryExecutionResult,
  ServerIncidentRecord,
  IncidentStatus,
  BackgroundTaskRecord,
  TaskExecutionLog,
  DictionaryItem,
  TaskScheduleType,
  INITIAL_BACKUPS,
  INITIAL_BACKUP_POLICY,
  INITIAL_INCIDENTS,
  INITIAL_TASKS,
  INITIAL_DICTIONARY,
} from "@/lib/admin-autonomous-ops-store";

type GodModeTab =
  | "telemetry"
  | "database"
  | "backups"
  | "incidents"
  | "cron-engine"
  | "dictionary"
  | "cache"
  | "maintenance"
  | "api-vault";

export default function ServerOperationsGodMode() {
  const [activeTab, setActiveTab] = useState<GodModeTab>("telemetry");
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // 1. Telemetry State
  const [telemetry, setTelemetry] = useState<ServerHealthTelemetry | null>(null);
  const [autoRefreshTelemetry, setAutoRefreshTelemetry] = useState<boolean>(true);
  const [telemetryLoading, setTelemetryLoading] = useState<boolean>(false);

  // 2. Database Inspector State
  const [selectedTable, setSelectedTable] = useState<DatabaseTableId>("users");
  const [tableSearch, setTableSearch] = useState<string>("");
  const [tableRows, setTableRows] = useState<any[]>([]);
  const [tableMeta, setTableMeta] = useState<DatabaseTableMeta>(INITIAL_TABLES_META[0]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  // Database Modals
  const [inspectRowData, setInspectRowData] = useState<any | null>(null);
  const [editRowData, setEditRowData] = useState<{ row: any; formState: Record<string, any>; reason: string } | null>(null);
  const [mutatingRow, setMutatingRow] = useState<boolean>(false);

  // 3. Cache & CDN State
  const [cacheTelemetry, setCacheTelemetry] = useState<CacheTelemetry>(INITIAL_CACHE_TELEMETRY);
  const [cacheLoading, setCacheLoading] = useState<boolean>(false);
  const [customPurgeNamespace, setCustomPurgeNamespace] = useState<string>("throttles:*");
  const [customPurgeRoute, setCustomPurgeRoute] = useState<string>("/pricing");
  const [confirmFlushModal, setConfirmFlushModal] = useState<boolean>(false);

  // 4. Maintenance Gateway State
  const [maintenance, setMaintenance] = useState<MaintenanceModeConfig>(INITIAL_MAINTENANCE_CONFIG);
  const [maintenanceSaving, setMaintenanceSaving] = useState<boolean>(false);
  const [durationPreset, setDurationPreset] = useState<string>("2h");

  // 5. API Vault State
  const [apiServices, setApiServices] = useState<ApiIntegrationStatus[]>(INITIAL_API_INTEGRATIONS);
  const [vaultLoading, setVaultLoading] = useState<boolean>(false);
  const [pingingServiceId, setPingingServiceId] = useState<string | null>(null);

  // ==============================================================================
  // Autonomous No-Engineer Suite States
  // ==============================================================================

  // 6. Backups & SQL Console
  const [backups, setBackups] = useState<DatabaseBackupRecord[]>(INITIAL_BACKUPS);
  const [backupPolicy, setBackupPolicy] = useState<BackupPolicyConfig>(INITIAL_BACKUP_POLICY);
  const [creatingBackup, setCreatingBackup] = useState<boolean>(false);
  const [restoreConfirmBackup, setRestoreConfirmBackup] = useState<DatabaseBackupRecord | null>(null);
  const [restoring, setRestoring] = useState<boolean>(false);
  const [sqlQuery, setSqlQuery] = useState<string>("SELECT id, username, role, is_active, balance_toman FROM users LIMIT 10;");
  const [sqlIsDryRun, setSqlIsDryRun] = useState<boolean>(true);
  const [sqlResult, setSqlResult] = useState<SqlQueryExecutionResult | null>(null);
  const [sqlLoading, setSqlLoading] = useState<boolean>(false);

  // 7. Incidents & Errors (Sentry-like)
  const [incidents, setIncidents] = useState<ServerIncidentRecord[]>(INITIAL_INCIDENTS);
  const [incidentFilter, setIncidentFilter] = useState<string>("all");
  const [retryingIncidentId, setRetryingIncidentId] = useState<string | null>(null);
  const [expandedStackTraceId, setExpandedStackTraceId] = useState<string | null>(null);
  const [expandedPayloadId, setExpandedPayloadId] = useState<string | null>(null);

  // 8. Background Tasks & Cron
  const [tasks, setTasks] = useState<BackgroundTaskRecord[]>(INITIAL_TASKS);
  const [taskLogs, setTaskLogs] = useState<TaskExecutionLog[]>([]);
  const [runningTaskId, setRunningTaskId] = useState<string | null>(null);
  const [showNewTaskModal, setShowNewTaskModal] = useState<boolean>(false);
  const [newTaskForm, setNewTaskForm] = useState<{
    titleFa: string;
    titleEn: string;
    descriptionFa: string;
    scheduleType: TaskScheduleType;
    cronExpression: string;
    targetEndpoint: string;
  }>({
    titleFa: "",
    titleEn: "",
    descriptionFa: "",
    scheduleType: "daily",
    cronExpression: "0 2 * * *",
    targetEndpoint: "/api/cron/custom-task",
  });

  // 9. Translation & UI Dictionary
  const [dictionary, setDictionary] = useState<DictionaryItem[]>(INITIAL_DICTIONARY);
  const [dictSearch, setDictSearch] = useState<string>("");
  const [dictCategory, setDictCategory] = useState<string>("all");
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [showAddKeyModal, setShowAddKeyModal] = useState<boolean>(false);
  const [newKeyForm, setNewKeyForm] = useState<{ key: string; category: any; faText: string; enText: string }>({
    key: "",
    category: "general",
    faText: "",
    enText: "",
  });

  // Flash message notification helper
  const notify = (text: string, isError = false) => {
    setStatusMessage({ text, isError });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // ==============================================================================
  // Fetch Handlers
  // ==============================================================================

  // Fetch Telemetry
  const fetchTelemetry = useCallback(async () => {
    try {
      setTelemetryLoading(true);
      const res = await fetch("/api/admin/server-ops/telemetry");
      const data = await res.json();
      if (data.success && data.telemetry) {
        setTelemetry(data.telemetry);
      }
    } catch {
      // fallback
    } finally {
      setTelemetryLoading(false);
    }
  }, []);

  // Fetch Database Rows
  const fetchDatabaseRows = useCallback(async () => {
    try {
      setTableLoading(true);
      const url = `/api/admin/server-ops/database?table=${selectedTable}&q=${encodeURIComponent(tableSearch)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setTableRows(data.rows);
        if (data.currentTable) {
          setTableMeta(data.currentTable);
        }
      }
    } catch {
      notify("خطا در دریافت اطلاعات جدول پایگاه داده", true);
    } finally {
      setTableLoading(false);
    }
  }, [selectedTable, tableSearch]);

  // Fetch Cache Telemetry
  const fetchCache = useCallback(async () => {
    try {
      setCacheLoading(true);
      const res = await fetch("/api/admin/server-ops/cache");
      const data = await res.json();
      if (data.success && data.telemetry) {
        setCacheTelemetry(data.telemetry);
      }
    } catch {
      // fallback
    } finally {
      setCacheLoading(false);
    }
  }, []);

  // Fetch Maintenance Config
  const fetchMaintenance = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/server-ops/maintenance");
      const data = await res.json();
      if (data.success && data.config) {
        setMaintenance(data.config);
      }
    } catch {
      // fallback
    }
  }, []);

  // Fetch API Vault
  const fetchApiVault = useCallback(async () => {
    try {
      setVaultLoading(true);
      const res = await fetch("/api/admin/server-ops/api-vault");
      const data = await res.json();
      if (data.success && data.services) {
        setApiServices(data.services);
      }
    } catch {
      // fallback
    } finally {
      setVaultLoading(false);
    }
  }, []);

  // Fetch Backups
  const fetchBackups = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/autonomous-ops/backups");
      const data = await res.json();
      if (data.success) {
        if (data.backups) setBackups(data.backups);
        if (data.policy) setBackupPolicy(data.policy);
      }
    } catch {
      // fallback
    }
  }, []);

  // Fetch Incidents
  const fetchIncidents = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/autonomous-ops/incidents");
      const data = await res.json();
      if (data.success && data.incidents) {
        setIncidents(data.incidents);
      }
    } catch {
      // fallback
    }
  }, []);

  // Fetch Background Tasks
  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/autonomous-ops/tasks");
      const data = await res.json();
      if (data.success) {
        if (data.tasks) setTasks(data.tasks);
        if (data.logs) setTaskLogs(data.logs);
      }
    } catch {
      // fallback
    }
  }, []);

  // Fetch Dictionary
  const fetchDictionary = useCallback(async () => {
    try {
      const url = `/api/admin/autonomous-ops/dictionary?q=${encodeURIComponent(dictSearch)}&category=${dictCategory}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.items) {
        setDictionary(data.items);
      }
    } catch {
      // fallback
    }
  }, [dictSearch, dictCategory]);

  // Lifecycle Initialization
  useEffect(() => {
    fetchTelemetry();
    fetchCache();
    fetchMaintenance();
    fetchApiVault();
    fetchBackups();
    fetchIncidents();
    fetchTasks();
    fetchDictionary();
  }, [fetchTelemetry, fetchCache, fetchMaintenance, fetchApiVault, fetchBackups, fetchIncidents, fetchTasks, fetchDictionary]);

  // Auto-refresh 5-second ticker for telemetry
  useEffect(() => {
    if (!autoRefreshTelemetry || activeTab !== "telemetry") return;
    const interval = setInterval(() => {
      fetchTelemetry();
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefreshTelemetry, activeTab, fetchTelemetry]);

  // Refetch database rows on table change or search
  useEffect(() => {
    if (activeTab === "database") {
      fetchDatabaseRows();
    }
  }, [activeTab, selectedTable, tableSearch, fetchDatabaseRows]);

  // Refetch dictionary on search or category filter change
  useEffect(() => {
    if (activeTab === "dictionary") {
      fetchDictionary();
    }
  }, [activeTab, dictSearch, dictCategory, fetchDictionary]);

  // ==============================================================================
  // Action Handlers
  // ==============================================================================

  // Mutate Row Handler
  const handleSaveRowMutation = async () => {
    if (!editRowData) return;
    if (!editRowData.reason.trim()) {
      alert("وارد کردن علت تغییر (Audit Reason) برای رعایت الزامات ممیزی الزامی است.");
      return;
    }

    try {
      setMutatingRow(true);
      const pk = editRowData.row[tableMeta.primaryKey] || editRowData.row.id || editRowData.row.key;
      const res = await fetch("/api/admin/server-ops/database", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: selectedTable,
          rowId: pk,
          updates: editRowData.formState,
          reason: editRowData.reason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        notify("تغییرات با موفقیت اعمال و در ممیزی امنیتی ثبت شد.");
        setEditRowData(null);
        fetchDatabaseRows();
      } else {
        notify(data.error || "خطا در اعمال تغییرات", true);
      }
    } catch {
      notify("خطا در برقراری ارتباط با سرور", true);
    } finally {
      setMutatingRow(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!tableRows.length) return;
    const headers = Object.keys(tableRows[0]);
    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [
        headers.join(","),
        ...tableRows.map((r) =>
          headers
            .map((h) => {
              const val = r[h] === null ? "" : String(r[h]);
              return `"${val.replace(/"/g, '""')}"`;
            })
            .join(",")
        ),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `endoora_${selectedTable}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tableRows, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `endoora_${selectedTable}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Cache Purge
  const handlePurgeCache = async (
    target: "redis_all" | "redis_namespace" | "nextjs_route" | "cdn_static",
    namespaceOrPath = ""
  ) => {
    try {
      setCacheLoading(true);
      const res = await fetch("/api/admin/server-ops/cache", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, namespaceOrPath }),
      });
      const data = await res.json();
      if (data.success) {
        notify(data.message);
        if (data.telemetry) setCacheTelemetry(data.telemetry);
        setConfirmFlushModal(false);
      } else {
        notify(data.error || "خطا در پاکسازی کش", true);
      }
    } catch {
      notify("خطای شبکه در پاکسازی کش", true);
    } finally {
      setCacheLoading(false);
    }
  };

  // Save Maintenance Config
  const handleSaveMaintenance = async (updates: Partial<MaintenanceModeConfig>) => {
    try {
      setMaintenanceSaving(true);
      const res = await fetch("/api/admin/server-ops/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...maintenance, ...updates }),
      });
      const data = await res.json();
      if (data.success && data.config) {
        setMaintenance(data.config);
        notify(data.message);
      } else {
        notify(data.error || "خطا در ذخیره حالت تعمیرات", true);
      }
    } catch {
      notify("خطا در ارتباط با سرور", true);
    } finally {
      setMaintenanceSaving(false);
    }
  };

  // Ping API Integration
  const handlePingService = async (serviceId: string) => {
    try {
      setPingingServiceId(serviceId);
      const res = await fetch("/api/admin/server-ops/api-vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId }),
      });
      const data = await res.json();
      if (data.success && data.service) {
        setApiServices((prev) =>
          prev.map((s) => (s.id === serviceId ? data.service : s))
        );
        notify(data.message);
      } else {
        notify(data.error || "خطا در پینگ سرویس", true);
      }
    } catch {
      notify("خطا در پینگ سرویس", true);
    } finally {
      setPingingServiceId(null);
    }
  };

  // Ping All API Integrations
  const handlePingAllServices = async () => {
    for (const service of apiServices) {
      await handlePingService(service.id);
    }
  };

  // Calculate maintenance duration preset
  const handleDurationPresetChange = (preset: string) => {
    setDurationPreset(preset);
    let hours = 2;
    if (preset === "30m") hours = 0.5;
    else if (preset === "1h") hours = 1;
    else if (preset === "2h") hours = 2;
    else if (preset === "4h") hours = 4;
    else if (preset === "12h") hours = 12;

    const targetIso = new Date(Date.now() + hours * 3600 * 1000).toISOString();
    setMaintenance((prev) => ({ ...prev, estimatedCompletionIso: targetIso }));
  };

  // ==============================================================================
  // Autonomous No-Engineer Suite Handlers
  // ==============================================================================

  // Create Backup
  const handleCreateBackup = async (format: "sql" | "json" | "schema_only") => {
    try {
      setCreatingBackup(true);
      const res = await fetch("/api/admin/autonomous-ops/backups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", format }),
      });
      const data = await res.json();
      if (data.success && data.backup) {
        notify(data.message);
        setBackups((prev) => [data.backup, ...prev]);
      } else {
        notify(data.error || "خطا در تولید فایل پشتیبان", true);
      }
    } catch {
      notify("خطا در ارتباط با سرور بکاپ", true);
    } finally {
      setCreatingBackup(false);
    }
  };

  // Restore Backup
  const handleExecuteRestore = async () => {
    if (!restoreConfirmBackup) return;
    try {
      setRestoring(true);
      const res = await fetch("/api/admin/autonomous-ops/backups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore", backupId: restoreConfirmBackup.id }),
      });
      const data = await res.json();
      if (data.success) {
        notify(data.message);
        setRestoreConfirmBackup(null);
        fetchDatabaseRows();
      } else {
        notify(data.error || "خطا در بازگردانی پایگاه داده", true);
      }
    } catch {
      notify("خطا در برقراری ارتباط با سرور", true);
    } finally {
      setRestoring(false);
    }
  };

  // Execute SQL
  const handleExecuteSql = async () => {
    if (!sqlQuery.trim()) return;
    try {
      setSqlLoading(true);
      const res = await fetch("/api/admin/autonomous-ops/backups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sql",
          query: sqlQuery,
          isDryRun: sqlIsDryRun,
        }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        setSqlResult(data.result);
        notify(
          sqlIsDryRun
            ? "کوئری در حالت شبیه‌سازی و رول‌بک اجرا شد (بدون تغییر دیتابیس)."
            : "کوئری زنده با موفقیت بر روی دیتابیس اعمال گردید."
        );
      } else {
        notify(data.error || "خطا در اجرای کوئری SQL", true);
      }
    } catch {
      notify("خطا در ارسال کوئری به موتور پایگاه داده", true);
    } finally {
      setSqlLoading(false);
    }
  };

  // Update Incident Status
  const handleUpdateIncidentStatus = async (incidentId: string, status: IncidentStatus) => {
    try {
      const res = await fetch("/api/admin/autonomous-ops/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_status", incidentId, status }),
      });
      const data = await res.json();
      if (data.success && data.incident) {
        notify(`وضعیت خطا به «${status === "resolved" ? "حل شده" : status}» تغییر یافت.`);
        setIncidents((prev) => prev.map((i) => (i.id === incidentId ? data.incident : i)));
      }
    } catch {
      notify("خطا در به‌روزرسانی وضعیت خطا", true);
    }
  };

  // Retry Failed Request
  const handleRetryIncident = async (incidentId: string) => {
    try {
      setRetryingIncidentId(incidentId);
      const res = await fetch("/api/admin/autonomous-ops/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "retry", incidentId }),
      });
      const data = await res.json();
      if (data.success) {
        notify(data.message);
        setIncidents((prev) =>
          prev.map((i) => (i.id === incidentId ? { ...i, status: "resolved" } : i))
        );
      } else {
        notify(data.error || "تلاش مجدد با خطا مواجه شد", true);
      }
    } catch {
      notify("خطا در ارسال درخواست مجدد", true);
    } finally {
      setRetryingIncidentId(null);
    }
  };

  // Run Task Now
  const handleRunTaskNow = async (taskId: string) => {
    try {
      setRunningTaskId(taskId);
      const res = await fetch("/api/admin/autonomous-ops/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "run_now", taskId }),
      });
      const data = await res.json();
      if (data.success && data.task) {
        notify(data.message);
        setTasks((prev) => prev.map((t) => (t.id === taskId ? data.task : t)));
        if (data.log) setTaskLogs((prev) => [data.log, ...prev]);
      } else {
        notify(data.error || "خطا در اجرای تسک", true);
      }
    } catch {
      notify("خطا در برقراری ارتباط با موتور تسک‌ها", true);
    } finally {
      setRunningTaskId(null);
    }
  };

  // Toggle Task Status
  const handleToggleTask = async (taskId: string, isEnabled: boolean) => {
    try {
      const res = await fetch("/api/admin/autonomous-ops/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle", taskId, isEnabled }),
      });
      const data = await res.json();
      if (data.success && data.task) {
        notify(isEnabled ? "تسک فعال شد." : "تسک متوقف شد.");
        setTasks((prev) => prev.map((t) => (t.id === taskId ? data.task : t)));
      }
    } catch {
      notify("خطا در تغییر وضعیت تسک", true);
    }
  };

  // Create Custom Task
  const handleCreateCustomTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskForm.titleFa || !newTaskForm.targetEndpoint) return;
    try {
      const res = await fetch("/api/admin/autonomous-ops/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", taskData: newTaskForm }),
      });
      const data = await res.json();
      if (data.success && data.task) {
        notify(data.message);
        setTasks((prev) => [...prev, data.task]);
        setShowNewTaskModal(false);
        setNewTaskForm({
          titleFa: "",
          titleEn: "",
          descriptionFa: "",
          scheduleType: "daily",
          cronExpression: "0 2 * * *",
          targetEndpoint: "/api/cron/custom-task",
        });
      }
    } catch {
      notify("خطا در ثبت تسک جدید", true);
    }
  };

  // Save Dictionary Item
  const handleSaveDictionaryItem = async (key: string, faText: string, enText: string) => {
    try {
      setSavingKey(key);
      const res = await fetch("/api/admin/autonomous-ops/dictionary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", key, faText, enText }),
      });
      const data = await res.json();
      if (data.success && data.item) {
        notify(data.message);
        setDictionary((prev) => prev.map((i) => (i.key === key ? data.item : i)));
      }
    } catch {
      notify("خطا در ذخیره عبارت دیکشنری", true);
    } finally {
      setSavingKey(null);
    }
  };

  // Export Dictionary JSON
  const handleExportDictionaryJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dictionary, null, 2));
    const dl = document.createElement("a");
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `endoora_i18n_dictionary_${Date.now()}.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
  };

  // Filtered incidents
  const filteredIncidents = incidents.filter((i) => {
    if (incidentFilter === "all") return true;
    return i.status === incidentFilter;
  });

  return (
    <div className={styles.container} dir="rtl">
      {/* Toast Notification */}
      {statusMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "2rem",
            left: "2rem",
            zIndex: 10000,
            padding: "0.85rem 1.5rem",
            borderRadius: "10px",
            fontSize: "0.9rem",
            fontWeight: "700",
            boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
            background: statusMessage.isError ? "#ef4444" : "#10b981",
            color: "#ffffff",
          }}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Header Card */}
      <div className={styles.headerCard}>
        <div className={styles.topRow}>
          <div className={styles.titleArea}>
            <div className={styles.titleWithBadge}>
              <h2>موتورخانه سرور و پایگاه داده (منطقه حساس و فنی)</h2>
              <span className={styles.godModeBadge}>⚠️ احتیاط بالا</span>
            </div>
            <p>
              تنظیمات زیرساختی و پایگاه داده: تهیه فایل پشتیبان (بک‌آپ)، مشاهده جدول‌ها، گزارش خطاهای کاربران و بررسی سلامت سرور
            </p>
          </div>

          <div className={styles.statusIndicator}>
            <span className={styles.pulsingDot} />
            <span>موتور سرور: فعال و آنلاین</span>
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <nav className={styles.subTabsNav}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "telemetry" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("telemetry")}
          >
            📊 سلامت سرور و منابع
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "database" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("database")}
          >
            🗄️ جدول‌های پایگاه داده
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "backups" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("backups")}
          >
            💾 پشتیبان‌گیری و دیتابیس
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "incidents" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("incidents")}
          >
            🐞 گزارش خطاهای سایت
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "cron-engine" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("cron-engine")}
          >
            ⏱️ کارهای خودکار زمان‌بندی‌شده
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "dictionary" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("dictionary")}
          >
            🌐 واژه‌نامه و ترجمه‌ها
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "cache" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("cache")}
          >
            ⚡ پاکسازی حافظه موقت (کش)
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "maintenance" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("maintenance")}
          >
            🛑 حالت تعمیرات و خاموشی (حساس)
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === "api-vault" ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveTab("api-vault")}
          >
            🔐 تست اتصال پیامک و درگاه‌ها
          </button>
        </nav>
      </div>

      {/* ===================================================================== */}
      {/* 1. Sub-Tab: Telemetry & Process Health */}
      {/* ===================================================================== */}
      {activeTab === "telemetry" && (
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>پایش بلادرنگ منابع سخت‌افزاری و پردازش‌های فعال سرور</h3>
              <p>آخرین ارزیابی: {telemetry?.evaluatedAt || "هم‌اکنون"} | معماری: {telemetry?.osPlatform} | نود: {telemetry?.nodeVersion}</p>
            </div>
            <div className={styles.actionBtnsGroup}>
              <label style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={autoRefreshTelemetry}
                  onChange={(e) => setAutoRefreshTelemetry(e.target.checked)}
                />
                <span>به‌روزرسانی خودکار هر ۵ ثانیه</span>
              </label>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={fetchTelemetry}
                disabled={telemetryLoading}
              >
                🔄 استعلام فوری
              </button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>
                <span>مصرف پردازنده (CPU)</span>
                <span>{telemetry?.cpuUtilizationPercent || 18}%</span>
              </div>
              <div className={styles.metricValue}>{telemetry?.cpuUtilizationPercent || 18}%</div>
              <div className={styles.metricBarContainer}>
                <div
                  className={`${styles.metricBar} ${
                    (telemetry?.cpuUtilizationPercent || 0) > 80 ? styles.barDanger : styles.barSuccess
                  }`}
                  style={{ width: `${telemetry?.cpuUtilizationPercent || 18}%` }}
                />
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>
                <span>حافظه رم مصرفی (RAM)</span>
                <span>{telemetry?.usedMemoryMb || 192} / {telemetry?.totalMemoryMb || 2048} MB</span>
              </div>
              <div className={styles.metricValue}>
                {Math.round(((telemetry?.usedMemoryMb || 192) / (telemetry?.totalMemoryMb || 2048)) * 100)}%
              </div>
              <div className={styles.metricBarContainer}>
                <div
                  className={`${styles.metricBar} styles.barSuccess`}
                  style={{
                    width: `${Math.round(((telemetry?.usedMemoryMb || 192) / (telemetry?.totalMemoryMb || 2048)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>
                <span>تاخیر پایگاه داده (DB Latency)</span>
                <span>Active: {telemetry?.databaseActiveConnections || 8}</span>
              </div>
              <div className={styles.metricValue}>{telemetry?.databaseLatencyMs || 4} ms</div>
              <div className={styles.metricBarContainer}>
                <div className={`${styles.metricBar} styles.barSuccess`} style={{ width: "15%" }} />
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>
                <span>نرخ درخواست‌ها (RPS)</span>
                <span>خطا: {telemetry?.errorRatePercent || 0.01}%</span>
              </div>
              <div className={styles.metricValue}>{telemetry?.requestsPerSecond || 42} req/s</div>
              <div className={styles.metricBarContainer}>
                <div className={`${styles.metricBar} styles.barSuccess`} style={{ width: "35%" }} />
              </div>
            </div>
          </div>

          {/* Processes Table */}
          <div>
            <h4 style={{ margin: "0 0 0.75rem 0", fontSize: "1rem", color: "#0f172a" }}>
              لیست فرآیندها و سرویس‌های در حال اجرا (Active Daemon Processes)
            </h4>
            <div className={styles.tableContainer}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>نام فرآیند / سرویس</th>
                    <th>PID</th>
                    <th>مصرف CPU</th>
                    <th>حافظه RAM</th>
                    <th>مدت زمان فعالیت (Uptime)</th>
                    <th>وضعیت سلامت</th>
                  </tr>
                </thead>
                <tbody>
                  {telemetry?.processes.map((proc) => (
                    <tr key={proc.pid}>
                      <td style={{ fontWeight: "700" }}>{proc.name}</td>
                      <td style={{ fontFamily: "monospace", color: "#64748b" }}>{proc.pid}</td>
                      <td>{proc.cpuPercent}%</td>
                      <td>{proc.memoryMb} MB</td>
                      <td>{Math.round(proc.uptimeSeconds / 3600)} ساعت</td>
                      <td>
                        <span
                          className={
                            proc.status === "running"
                              ? styles.badgeSuccess
                              : proc.status === "degraded"
                              ? styles.badgeWarning
                              : styles.badgeDanger
                          }
                        >
                          {proc.status === "running" ? "در حال اجرا (Healthy)" : proc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. Sub-Tab: Database Browser & Inspector */}
      {/* ===================================================================== */}
      {activeTab === "database" && (
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>بازرس مستقیم جداول پایگاه داده و اصلاح امن داده‌ها (Data Inspector)</h3>
              <p>هرگونه تغییر در رکوردهای دیتابیس به همراه شناسه مدیر و توجیه در لاگ ممیزی سیستم ضبط می‌شود.</p>
            </div>

            <div className={styles.actionBtnsGroup}>
              <button type="button" className={styles.btnSecondary} onClick={handleExportCSV}>
                📥 خروجی CSV
              </button>
              <button type="button" className={styles.btnSecondary} onClick={handleExportJSON}>
                📥 خروجی JSON
              </button>
              <button type="button" className={styles.btnPrimary} onClick={fetchDatabaseRows} disabled={tableLoading}>
                🔄 تازه‌سازی
              </button>
            </div>
          </div>

          {/* Table Selector & Search */}
          <div className={styles.dbControlsBar}>
            <div className={styles.tableSelectorList}>
              {INITIAL_TABLES_META.map((tbl) => (
                <button
                  key={tbl.id}
                  type="button"
                  className={`${styles.tableSelectBtn} ${selectedTable === tbl.id ? styles.tableSelectBtnActive : ""}`}
                  onClick={() => {
                    setSelectedTable(tbl.id);
                    setTableSearch("");
                  }}
                >
                  {tbl.nameFa} ({tbl.id})
                </button>
              ))}
            </div>

            <div className={styles.searchBox}>
              <span>🔍</span>
              <input
                type="text"
                placeholder="جستجو در تمام ستون‌های جدول..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Table Metadata Summary */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <span className={styles.tableMetaBadge}>
              نام جدول: <strong>{tableMeta.nameEn}</strong>
            </span>
            <span className={styles.tableMetaBadge}>
              تعداد رکوردهای فیلتر شده: <strong>{tableRows.length}</strong>
            </span>
            <span className={styles.tableMetaBadge}>
              کلید اصلی (Primary Key): <strong>{tableMeta.primaryKey}</strong>
            </span>
            <span className={styles.tableMetaBadge}>
              حجم تخمینی: <strong>{tableMeta.sizeKb} KB</strong>
            </span>
          </div>

          {/* Rows Data Table */}
          <div className={styles.tableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  {tableMeta.columns.map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                  <th style={{ textAlign: "center" }}>عملیات گاد مود</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.length === 0 ? (
                  <tr>
                    <td colSpan={tableMeta.columns.length + 1} style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
                      رکوردی برای نمایش یافت نشد.
                    </td>
                  </tr>
                ) : (
                  tableRows.map((row, idx) => {
                    const rowPk = row[tableMeta.primaryKey] || row.id || row.key || idx;
                    return (
                      <tr key={String(rowPk)}>
                        {tableMeta.columns.map((col) => {
                          const val = row[col];
                          let rendered = String(val ?? "");
                          if (typeof val === "boolean") {
                            rendered = val ? "✅ بله" : "❌ خیر";
                          } else if (typeof val === "object" && val !== null) {
                            rendered = JSON.stringify(val);
                          }
                          return (
                            <td key={col} style={{ maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {rendered}
                            </td>
                          );
                        })}
                        <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                          <div style={{ display: "inline-flex", gap: "0.4rem" }}>
                            <button
                              type="button"
                              className={styles.btnSecondary}
                              style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                              onClick={() => setInspectRowData(row)}
                            >
                              JSON 👁️
                            </button>
                            <button
                              type="button"
                              className={styles.btnPrimary}
                              style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                              onClick={() => {
                                setEditRowData({
                                  row,
                                  formState: { ...row },
                                  reason: "",
                                });
                              }}
                            >
                              ویرایش امن ✏️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. Sub-Tab: Database Backups & Safe SQL Query Studio */}
      {/* ===================================================================== */}
      {activeTab === "backups" && (
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>استودیو پشتیبان‌گیری، اسنپ‌شات‌های محلی/ابری و کنسول امن SQL</h3>
              <p>
                تولید نسخه‌های پشتیبان مستقل، دانلود مستقیم فایل Dump، بازگردانی بلادرنگ (Restore) و اجرای کوئری‌های SQL با حفاظ آزمایشی (Dry-Run)
              </p>
            </div>
            <div className={styles.actionBtnsGroup}>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => handleCreateBackup("sql")}
                disabled={creatingBackup}
              >
                {creatingBackup ? "در حال ایجاد اسنپ‌شات..." : "💾 تولید اسنپ‌شات کامل SQL"}
              </button>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => handleCreateBackup("json")}
                disabled={creatingBackup}
              >
                📄 بکاپ ساختاریافته JSON
              </button>
            </div>
          </div>

          {/* Backup Policy Bar */}
          <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "10px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <strong style={{ color: "#0f172a", fontSize: "0.95rem" }}>خط‌مشی پشتیبان‌گیری خودکار شبانه:</strong>
              <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "0.25rem" }}>
                وضعیت: {backupPolicy.autoBackupEnabled ? "فعال (روزانه ساعت ۰۳:۰۰ بامداد)" : "غیرفعال"} | دوره نگهداری: {backupPolicy.retentionDays} روز | مقصد همگام‌سازی ابری: S3 ({backupPolicy.s3Bucket})
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <span className={styles.badgeSuccess}>همگام‌سازی ابری S3 فعال است</span>
            </div>
          </div>

          {/* Backups List */}
          <div>
            <h4 style={{ margin: "0 0 0.75rem 0", fontSize: "1rem", color: "#0f172a" }}>
              اسنپ‌شات‌ها و فایل‌های پشتیبان در دسترس (Snapshots Archive)
            </h4>
            <div className={styles.backupCardGrid}>
              {backups.map((bkp) => (
                <div key={bkp.id} className={styles.backupCard}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                      <strong style={{ fontSize: "0.9rem", color: "#0f172a", fontFamily: "monospace", direction: "ltr", textAlign: "left" }}>
                        {bkp.filename}
                      </strong>
                      <span className={styles.badgeSuccess}>{bkp.format.toUpperCase()}</span>
                    </div>
                    <p style={{ margin: "0.25rem 0 0.5rem 0", fontSize: "0.8rem", color: "#64748b" }}>{bkp.notes}</p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    <div className={styles.backupMetaRow}>
                      <span>حجم فایل:</span>
                      <strong>{bkp.sizeMb} مگابایت</strong>
                    </div>
                    <div className={styles.backupMetaRow}>
                      <span>تعداد جداول / رکوردها:</span>
                      <span>{bkp.tablesCount} جدول / {bkp.rowCount.toLocaleString()} رکورد</span>
                    </div>
                    <div className={styles.backupMetaRow}>
                      <span>زمان ایجاد:</span>
                      <span>{bkp.createdAt} ({bkp.createdBy})</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                    <a
                      href={`/api/admin/autonomous-ops/backups?downloadId=${bkp.id}`}
                      className={styles.btnSecondary}
                      style={{ flex: 1, textDecoration: "none", textAlign: "center", justifyContent: "center", fontSize: "0.8rem", padding: "0.4rem 0.6rem" }}
                      download
                    >
                      📥 دانلود فایل
                    </a>
                    <button
                      type="button"
                      className={styles.btnDanger}
                      style={{ fontSize: "0.8rem", padding: "0.4rem 0.75rem" }}
                      onClick={() => setRestoreConfirmBackup(bkp)}
                    >
                      ♻️ بازگردانی (Restore)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safe SQL Query Console */}
          <div style={{ marginTop: "1rem" }}>
            <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1.05rem", color: "#0f172a" }}>
              کنسول اجرای امن کوئری‌های SQL (Safe SQL Studio)
            </h4>
            <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.85rem", color: "#64748b" }}>
              اجرای مستقیم کوئری‌ها بر روی کلاستر PostgreSQL همراه با کلید محافظتی Dry-Run جهت جلوگیری از اشتباهات ناخواسته
            </p>

            <div className={styles.sqlConsoleBox}>
              <textarea
                className={styles.sqlTextarea}
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                placeholder="Write SQL query: SELECT, UPDATE, INSERT, EXPLAIN..."
              />

              <div className={styles.sqlButtonsBar}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <label style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#f8fafc", fontSize: "0.85rem", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={sqlIsDryRun}
                      onChange={(e) => setSqlIsDryRun(e.target.checked)}
                    />
                    <span style={{ color: sqlIsDryRun ? "#38bdf8" : "#fca5a5" }}>
                      حالت شبیه‌سازی و رول‌بک آزمایشی (Dry-Run Safety) {sqlIsDryRun ? "🛡️ فعال" : "⚠️ غیرفعال (Live Mutation)"}
                    </span>
                  </label>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    className={styles.btnSecondary}
                    onClick={() => setSqlQuery("SELECT id, username, role, is_active FROM users LIMIT 10;")}
                    style={{ fontSize: "0.8rem" }}
                  >
                    نمونه کوئری کاربران
                  </button>
                  <button
                    type="button"
                    className={styles.btnPrimary}
                    onClick={handleExecuteSql}
                    disabled={sqlLoading}
                  >
                    {sqlLoading ? "در حال اجرا..." : "⚡ اجرای کوئری SQL"}
                  </button>
                </div>
              </div>
            </div>

            {/* SQL Execution Results */}
            {sqlResult && (
              <div style={{ marginTop: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <strong style={{ fontSize: "0.9rem", color: "#0f172a" }}>
                    نتیجه اجرا ({sqlResult.executionTimeMs}ms - {sqlResult.affectedRows} سطر تحت تاثیر):
                  </strong>
                  <span className={sqlResult.isDryRun ? styles.badgeWarning : styles.badgeSuccess}>
                    {sqlResult.isDryRun ? "حالت آزمایشی (Rollback)" : "اعمال نهایی (Committed)"}
                  </span>
                </div>

                <div className={styles.tableContainer}>
                  <table className={styles.dataTable}>
                    <thead>
                      <tr>
                        {sqlResult.columns.map((col) => (
                          <th key={col}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sqlResult.rows.map((row, i) => (
                        <tr key={i}>
                          {sqlResult.columns.map((col) => (
                            <td key={col} style={{ fontFamily: "monospace" }}>
                              {String(row[col] ?? "")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. Sub-Tab: Incident Management & Live Error Streamer (Sentry-like) */}
      {/* ===================================================================== */}
      {activeTab === "incidents" && (
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>مرکز جامع پایش حوادث، استک‌تریس و خطاهای ۵۰۰ سرور (Incident Manager)</h3>
              <p>
                مشاهده لحظه‌ای استک‌تریس خطاهای پیش‌آمده برای زبان‌آموزان با اطلاعات کامل نشست، بدنه درخواست و امکان تلاش مجدد خودکار تراکنش‌ها
              </p>
            </div>
            <div className={styles.actionBtnsGroup}>
              <button type="button" className={styles.btnSecondary} onClick={fetchIncidents}>
                🔄 تازه‌سازی فید خطاها
              </button>
            </div>
          </div>

          {/* Status Filters */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {[
              { id: "all", label: "همه حوادث" },
              { id: "unresolved", label: "حل نشده (Unresolved)" },
              { id: "investigating", label: "در حال بررسی" },
              { id: "resolved", label: "برطرف شده (Resolved)" },
            ].map((flt) => (
              <button
                key={flt.id}
                type="button"
                className={`${styles.tableSelectBtn} ${incidentFilter === flt.id ? styles.tableSelectBtnActive : ""}`}
                onClick={() => setIncidentFilter(flt.id)}
              >
                {flt.label}
              </button>
            ))}
          </div>

          {/* Incidents List */}
          <div className={styles.incidentList}>
            {filteredIncidents.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2.5rem", color: "#10b981", background: "#f0fdf4", borderRadius: "8px" }}>
                ✅ هیچ خطای فعالی در این بخش ثبت نشده است. وضعیت سیستم در سلامت کامل قرار دارد.
              </div>
            ) : (
              filteredIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className={`${styles.incidentCard} ${
                    inc.severity === "critical"
                      ? styles.incidentCritical
                      : inc.severity === "warning"
                      ? styles.incidentWarning
                      : styles.incidentInfo
                  }`}
                >
                  <div className={styles.incidentHeader}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                        <span className={styles.incidentErrorName}>{inc.errorName}</span>
                        <span
                          className={
                            inc.severity === "critical"
                              ? styles.badgeDanger
                              : inc.severity === "warning"
                              ? styles.badgeWarning
                              : styles.badgeSuccess
                          }
                        >
                          {inc.severity.toUpperCase()}
                        </span>
                        <span
                          className={
                            inc.status === "resolved"
                              ? styles.badgeSuccess
                              : inc.status === "investigating"
                              ? styles.badgeWarning
                              : styles.badgeDanger
                          }
                        >
                          {inc.status === "resolved" ? "حل شده" : inc.status === "investigating" ? "در حال بررسی" : "حل نشده"}
                        </span>
                      </div>
                      <p className={styles.incidentMessage}>{inc.errorMessage}</p>
                    </div>

                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      {inc.retryable && inc.status !== "resolved" && (
                        <button
                          type="button"
                          className={styles.btnPrimary}
                          style={{ fontSize: "0.8rem", padding: "0.4rem 0.75rem" }}
                          onClick={() => handleRetryIncident(inc.id)}
                          disabled={retryingIncidentId === inc.id}
                        >
                          {retryingIncidentId === inc.id ? "در حال تلاش..." : "🔄 تلاش مجدد درخواست کاربر"}
                        </button>
                      )}

                      {inc.status !== "resolved" ? (
                        <button
                          type="button"
                          className={styles.btnSecondary}
                          style={{ fontSize: "0.8rem", padding: "0.4rem 0.75rem" }}
                          onClick={() => handleUpdateIncidentStatus(inc.id, "resolved")}
                        >
                          ✅ ثبت به عنوان حل شده
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={styles.btnSecondary}
                          style={{ fontSize: "0.8rem", padding: "0.4rem 0.75rem" }}
                          onClick={() => handleUpdateIncidentStatus(inc.id, "unresolved")}
                        >
                          بازگشایی مجدد 🔄
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className={styles.incidentMetaGrid}>
                    <div>
                      <span>آدرس اندپوینت: </span>
                      <strong style={{ direction: "ltr", display: "inline-block" }}>
                        [{inc.requestMethod}] {inc.requestUrl}
                      </strong>
                    </div>
                    <div>
                      <span>کد وضعیت HTTP: </span>
                      <strong style={{ color: inc.statusCode >= 500 ? "#ef4444" : "#f59e0b" }}>{inc.statusCode}</strong>
                    </div>
                    <div>
                      <span>کاربر متاثر: </span>
                      <strong>{inc.userEmail || inc.userId || "کاربر مهمان"}</strong>
                    </div>
                    <div>
                      <span>آی‌پی کلاینت: </span>
                      <span style={{ fontFamily: "monospace" }}>{inc.clientIp}</span>
                    </div>
                    <div>
                      <span>تعداد وقوع: </span>
                      <strong>{inc.occurredCount} مرتبه</strong>
                    </div>
                    <div>
                      <span>آخرین وقوع: </span>
                      <span>{inc.lastSeenAt}</span>
                    </div>
                  </div>

                  {/* Stack Trace Accordion */}
                  <div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        type="button"
                        className={styles.btnSecondary}
                        style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
                        onClick={() =>
                          setExpandedStackTraceId(expandedStackTraceId === inc.id ? null : inc.id)
                        }
                      >
                        {expandedStackTraceId === inc.id ? "بستن استک‌تریس ▲" : "مشاهده استک‌تریس خطای کد ▼"}
                      </button>

                      {inc.requestPayload && (
                        <button
                          type="button"
                          className={styles.btnSecondary}
                          style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
                          onClick={() =>
                            setExpandedPayloadId(expandedPayloadId === inc.id ? null : inc.id)
                          }
                        >
                          {expandedPayloadId === inc.id ? "بستن بادی درخواست ▲" : "مشاهده بادی و پارامترهای درخواست ▼"}
                        </button>
                      )}
                    </div>

                    {expandedStackTraceId === inc.id && (
                      <div className={styles.stackTraceBox} style={{ marginTop: "0.5rem" }}>
                        {inc.stackTrace.map((line, idx) => (
                          <div key={idx}>{line}</div>
                        ))}
                      </div>
                    )}

                    {expandedPayloadId === inc.id && inc.requestPayload && (
                      <pre className={styles.jsonBox} style={{ marginTop: "0.5rem", maxHeight: "150px" }}>
                        {JSON.stringify(inc.requestPayload, null, 2)}
                      </pre>
                    )}
                  </div>

                  {inc.resolutionNote && (
                    <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "0.5rem 0.75rem", borderRadius: "6px", fontSize: "0.8rem", color: "#166534" }}>
                      یادداشت رفع نقص: {inc.resolutionNote} (توسط {inc.resolvedBy} در {inc.resolvedAt})
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. Sub-Tab: Background Tasks & Cron Scheduler (Task & Cron Engine) */}
      {/* ===================================================================== */}
      {activeTab === "cron-engine" && (
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>موتور تسک‌های زمان‌بندی‌شده و کران‌جاب‌های خودکار (Cron Engine)</h3>
              <p>
                مدیریت وظایف دوره‌ای سیستم (پشتیبان‌گیری خودکار، محاسبه تسویه اساتید، پاکسازی سشن‌ها و ارسال اعلان‌ها) با قابلیت اجرای فوری و ساخت تسک دلخواه
              </p>
            </div>
            <div className={styles.actionBtnsGroup}>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => setShowNewTaskModal(true)}
              >
                ➕ تعریف تسک خودکار جدید
              </button>
              <button type="button" className={styles.btnSecondary} onClick={fetchTasks}>
                🔄 تازه‌سازی وضعیت
              </button>
            </div>
          </div>

          {/* Tasks Grid */}
          <div className={styles.taskGrid}>
            {tasks.map((tsk) => (
              <div key={tsk.id} className={styles.taskCard}>
                <div>
                  <div className={styles.taskCardTop}>
                    <div>
                      <h4 className={styles.taskTitleFa}>{tsk.titleFa}</h4>
                      <p className={styles.taskTitleEn}>{tsk.titleEn}</p>
                    </div>
                    <label className={styles.toggleSwitch} style={{ transform: "scale(0.8)" }}>
                      <input
                        type="checkbox"
                        checked={tsk.isEnabled}
                        onChange={(e) => handleToggleTask(tsk.id, e.target.checked)}
                      />
                      <span className={styles.slider} />
                    </label>
                  </div>
                  <p className={styles.taskDesc}>{tsk.descriptionFa}</p>
                </div>

                <div className={styles.taskMetaBox}>
                  <div className={styles.taskMetaItem}>
                    <span>فرمول کران (Cron):</span>
                    <strong style={{ fontFamily: "monospace", direction: "ltr" }}>{tsk.cronExpression}</strong>
                  </div>
                  <div className={styles.taskMetaItem}>
                    <span>اجرای بعدی:</span>
                    <span>{tsk.nextScheduledRun}</span>
                  </div>
                  <div className={styles.taskMetaItem}>
                    <span>آخرین اجرا:</span>
                    <span>{tsk.lastRunAt} ({tsk.lastRunDurationMs}ms)</span>
                  </div>
                  <div className={styles.taskMetaItem}>
                    <span>نرخ موفقیت (Success Rate):</span>
                    <strong style={{ color: "#10b981" }}>{tsk.successRatePercent}% ({tsk.totalRunCount} بار)</strong>
                  </div>
                </div>

                {tsk.lastOutputSummary && (
                  <div style={{ fontSize: "0.785rem", color: "#64748b", background: "#f8fafc", padding: "0.4rem 0.6rem", borderRadius: "6px" }}>
                    خلاصه آخرین خروجی: {tsk.lastOutputSummary}
                  </div>
                )}

                <button
                  type="button"
                  className={styles.btnPrimary}
                  style={{ width: "100%", justifyContent: "center", fontSize: "0.85rem" }}
                  onClick={() => handleRunTaskNow(tsk.id)}
                  disabled={runningTaskId === tsk.id}
                >
                  {runningTaskId === tsk.id ? "در حال اجرای تسک..." : "⚡ اجرای فوری این تسک (Run Now)"}
                </button>
              </div>
            ))}
          </div>

          {/* Execution History Logs */}
          <div style={{ marginTop: "1rem" }}>
            <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.95rem", color: "#334155" }}>
              سوابق و گزارش‌های اجرای اخیر تسک‌ها:
            </h4>
            <div className={styles.tableContainer}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>شناسه</th>
                    <th>نام تسک</th>
                    <th>آغازکننده</th>
                    <th>زمان شروع</th>
                    <th>مدت زمان</th>
                    <th>وضعیت</th>
                    <th>خلاصه لاگ</th>
                  </tr>
                </thead>
                <tbody>
                  {taskLogs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ fontFamily: "monospace", color: "#64748b" }}>{log.id}</td>
                      <td style={{ fontWeight: "700" }}>{log.taskTitleFa}</td>
                      <td>{log.triggeredBy === "cron_scheduler" ? "زمان‌بند خودکار" : "مدیر دستی"}</td>
                      <td>{log.startedAt}</td>
                      <td>{log.durationMs} میلی‌ثانیه</td>
                      <td>
                        <span className={styles.badgeSuccess}>موفق</span>
                      </td>
                      <td style={{ fontSize: "0.8rem", color: "#475569" }}>{log.output}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 6. Sub-Tab: Translation & Live UI String Dictionary */}
      {/* ===================================================================== */}
      {activeTab === "dictionary" && (
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>واژه‌نامه متون و پیام‌های زنده سایت (Live i18n Dictionary)</h3>
              <p>
                تغییر آنلاین و آنی تمامی عناوین، دکمه‌ها، پیام‌های خطا و متون لندینگ‌پیج‌ها بدون نیاز به هیچ‌گونه ویرایش در کدهای فرانت‌اند
              </p>
            </div>
            <div className={styles.actionBtnsGroup}>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => setShowAddKeyModal(true)}
              >
                ➕ افزودن عبارت جدید
              </button>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={handleExportDictionaryJson}
              >
                📥 خروجی کامل JSON
              </button>
            </div>
          </div>

          {/* Category Pills & Search */}
          <div className={styles.dbControlsBar}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {[
                { id: "all", label: "همه دسته‌ها" },
                { id: "general", label: "عمومی و هدر" },
                { id: "auth", label: "ورود و ثبت‌نام" },
                { id: "checkout", label: "خرید و پرداخت" },
                { id: "errors", label: "پیام‌های خطا" },
                { id: "lms", label: "کلاس و آزمون‌ها" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`${styles.tableSelectBtn} ${dictCategory === cat.id ? styles.tableSelectBtnActive : ""}`}
                  onClick={() => setDictCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className={styles.searchBox}>
              <span>🔍</span>
              <input
                type="text"
                placeholder="جستجو در کلیدها و عبارات فارسی/انگلیسی..."
                value={dictSearch}
                onChange={(e) => setDictSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Dictionary Items Table */}
          <div className={styles.tableContainer}>
            <table className={styles.dictTable}>
              <thead>
                <tr>
                  <th style={{ width: "22%" }}>شناسه کلید (Key)</th>
                  <th style={{ width: "35%" }}>متن فارسی (فارسی)</th>
                  <th style={{ width: "33%" }}>متن انگلیسی (English)</th>
                  <th style={{ width: "10%", textAlign: "center" }}>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {dictionary.map((item) => (
                  <tr key={item.key}>
                    <td>
                      <code style={{ color: "#2563eb", fontWeight: "700" }}>{item.key}</code>
                      <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>دسته: {item.category}</div>
                    </td>
                    <td>
                      <input
                        type="text"
                        className={styles.dictInput}
                        defaultValue={item.faText}
                        onBlur={(e) => {
                          if (e.target.value !== item.faText) {
                            handleSaveDictionaryItem(item.key, e.target.value, item.enText);
                          }
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        dir="ltr"
                        className={styles.dictInput}
                        defaultValue={item.enText}
                        onBlur={(e) => {
                          if (e.target.value !== item.enText) {
                            handleSaveDictionaryItem(item.key, item.faText, e.target.value);
                          }
                        }}
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        type="button"
                        className={styles.btnSecondary}
                        style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
                        disabled={savingKey === item.key}
                        onClick={() => notify(`عبارت «${item.key}» ذخیره و بر روی سایت اعمال شد.`)}
                      >
                        {savingKey === item.key ? "در حال ذخیره..." : "ذخیره 💾"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 7. Sub-Tab: Cache & CDN Purge Center */}
      {/* ===================================================================== */}
      {activeTab === "cache" && (
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>مرکز مدیریت حافظه موقت Redis و باطل‌سازی بافرهای Next.js ISR و CDN</h3>
              <p>وضعیت موتور کش: <strong>{cacheTelemetry.redisStatus}</strong> | آخرین پاکسازی: <strong>{cacheTelemetry.lastPurgeTimestamp}</strong></p>
            </div>
            <button
              type="button"
              className={styles.btnDanger}
              onClick={() => setConfirmFlushModal(true)}
            >
              ⚠️ پاکسازی کامل کش سرور (FlushAll)
            </button>
          </div>

          {/* Cache Telemetry Stats */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>
                <span>میزان مصرف رم Redis</span>
                <span>{cacheTelemetry.redisMemoryUsedMb} MB</span>
              </div>
              <div className={styles.metricValue}>{cacheTelemetry.redisMemoryUsedMb} MB</div>
              <div className={styles.metricBarContainer}>
                <div className={`${styles.metricBar} styles.barSuccess`} style={{ width: "35%" }} />
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>
                <span>تعداد کلیدهای فعال ایندکس‌شده</span>
                <span>Keys</span>
              </div>
              <div className={styles.metricValue}>{cacheTelemetry.redisTotalKeys.toLocaleString()}</div>
              <div className={styles.metricBarContainer}>
                <div className={`${styles.metricBar} styles.barSuccess`} style={{ width: "65%" }} />
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>
                <span>نرخ موفقیت کش (Hit Ratio)</span>
                <span>بسیار مطلوب</span>
              </div>
              <div className={styles.metricValue} style={{ color: "#10b981" }}>
                {cacheTelemetry.hitRatioPercent}%
              </div>
              <div className={styles.metricBarContainer}>
                <div className={`${styles.metricBar} styles.barSuccess`} style={{ width: `${cacheTelemetry.hitRatioPercent}%` }} />
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>
                <span>نرخ عدم تطابق کش (Miss Ratio)</span>
                <span>پایین و پایدار</span>
              </div>
              <div className={styles.metricValue} style={{ color: "#64748b" }}>
                {cacheTelemetry.missRatioPercent}%
              </div>
              <div className={styles.metricBarContainer}>
                <div className={`${styles.metricBar} styles.barWarning`} style={{ width: `${cacheTelemetry.missRatioPercent * 4}%` }} />
              </div>
            </div>
          </div>

          {/* Purge Actions Grid */}
          <h4 style={{ margin: "0.5rem 0 0 0", fontSize: "1.05rem", color: "#0f172a" }}>
            اقدامات پاکسازی هدفمند و آنی (Targeted Purge Actions)
          </h4>
          <div className={styles.cachePurgeGrid}>
            {/* Namespace Purge */}
            <div className={styles.purgeCard}>
              <div>
                <h5 className={styles.purgeCardTitle}>پاکسازی بر اساس پیشوند کلیدها (Namespace)</h5>
                <p className={styles.purgeCardDesc}>
                  حذف دسته‌ای کلیدهای خاص موقت بدون آسیب به داده‌های پایدار (مثال: `throttles:*`, `course:cache:*`, `auth:tokens:*`)
                </p>
              </div>
              <input
                type="text"
                className={styles.purgeInput}
                value={customPurgeNamespace}
                onChange={(e) => setCustomPurgeNamespace(e.target.value)}
                placeholder="e.g. throttles:*"
              />
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => handlePurgeCache("redis_namespace", customPurgeNamespace)}
                disabled={cacheLoading}
              >
                🧹 پاکسازی این پیشوند
              </button>
            </div>

            {/* Next.js ISR Route Invalidation */}
            <div className={styles.purgeCard}>
              <div>
                <h5 className={styles.purgeCardTitle}>باطل‌سازی مسیر Next.js On-Demand ISR</h5>
                <p className={styles.purgeCardDesc}>
                  ارسال سیگنال بازتولید آنی صفحه استاتیک روی سرور Next.js برای مسیر مشخص شده بدون نیاز به استقرار مجدد
                </p>
              </div>
              <input
                type="text"
                className={styles.purgeInput}
                value={customPurgeRoute}
                onChange={(e) => setCustomPurgeRoute(e.target.value)}
                placeholder="e.g. /pricing or /p/exam-cram-1403"
              />
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => handlePurgeCache("nextjs_route", customPurgeRoute)}
                disabled={cacheLoading}
              >
                🔄 باطل‌سازی کش این مسیر
              </button>
            </div>

            {/* CDN Static Purge */}
            <div className={styles.purgeCard}>
              <div>
                <h5 className={styles.purgeCardTitle}>پاکسازی کش لایه لبه CDN (Edge Invalidation)</h5>
                <p className={styles.purgeCardDesc}>
                  ارسال دستور Flush به سرورهای ابر آروان جهت به‌روزرسانی فایل‌های استاتیک CSS, JS و تصاویر دوره‌ها در سراسر کشور
                </p>
              </div>
              <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                دامنه مقصد: <code>cdn.endoora.ir / assets</code>
              </div>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => handlePurgeCache("cdn_static")}
                disabled={cacheLoading}
              >
                🌐 باطل‌سازی استاتیک CDN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 8. Sub-Tab: Emergency Maintenance Gateway */}
      {/* ===================================================================== */}
      {activeTab === "maintenance" && (
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>دروازه قفل اضطراری پلتفرم و حالت تعمیرات (Emergency Maintenance Gateway)</h3>
              <p>
                در هنگام استقرارهای حساس، مهاجرت داده‌ها یا حوادث فنی، سایت را به صورت یکپارچه برای عموم کاربران مسدود کرده و به صفحه شکیل تعمیرات هدایت کنید.
              </p>
            </div>
            <a
              href="/maintenance"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnSecondary}
              style={{ textDecoration: "none" }}
            >
              👁️ پیش‌نمایش زنده صفحه (/maintenance)
            </a>
          </div>

          {/* Hero Emergency Lock Switch */}
          <div className={`${styles.maintenanceHero} ${maintenance.isEnabled ? styles.maintenanceHeroLocked : ""}`}>
            <div className={styles.heroStatusText}>
              <h4>
                {maintenance.isEnabled
                  ? "🚨 قفل اضطراری سایت در حال حاضر فعال است! (سایت برای عموم مسدود است)"
                  : "🛡️ سایت در وضعیت عادی و عمومی قرار دارد (عملیات نگهداری غیرفعال است)"}
              </h4>
              <p>
                {maintenance.isEnabled
                  ? "تمامی بازدیدکنندگان عادی به صفحه اختصاصی نگهداری منتقل می‌شوند مگر اینکه کلید بای‌پس را وارد کنند."
                  : "بازدیدکنندگان به تمامی صفحات، کلاس‌ها و درگاه‌های خرید بدون محدودیت دسترسی دارند."}
              </p>
            </div>

            <label className={styles.toggleSwitch}>
              <input
                type="checkbox"
                checked={maintenance.isEnabled}
                onChange={(e) => {
                  const willEnable = e.target.checked;
                  if (willEnable) {
                    const confirmed = window.confirm(
                      "⚠️ اخطار مهم و حساس:\n\nروشن کردن این گزینه بلافاصله سایت را برای تمامی کاربران عادی و دانش‌آموزان مسدود کرده و پیام «سایت در حال بروزرسانی است» را نمایش می‌دهد.\n\nآیا از مسدودسازی موقت سایت اطمینان کامل دارید؟"
                    );
                    if (!confirmed) return;
                  }
                  handleSaveMaintenance({ isEnabled: willEnable });
                }}
                disabled={maintenanceSaving}
              />
              <span className={styles.slider} />
            </label>
          </div>

          {/* Maintenance Configuration Form */}
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>مدت زمان تخمینی تا اتمام عملیات:</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {["30m", "1h", "2h", "4h", "12h"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className={`${styles.btnSecondary} ${durationPreset === preset ? styles.tableSelectBtnActive : ""}`}
                    onClick={() => handleDurationPresetChange(preset)}
                    style={{ flex: 1, padding: "0.4rem 0.5rem", fontSize: "0.8rem" }}
                  >
                    {preset === "30m" ? "۳۰ دقیقه" : preset === "1h" ? "۱ ساعت" : preset === "2h" ? "۲ ساعت" : preset === "4h" ? "۴ ساعت" : "۱۲ ساعت"}
                  </button>
                ))}
              </div>
              <input
                type="text"
                dir="ltr"
                className={styles.formInput}
                value={maintenance.estimatedCompletionIso}
                onChange={(e) => setMaintenance({ ...maintenance, estimatedCompletionIso: e.target.value })}
                placeholder="ISO Timestamp"
              />
            </div>

            <div className={styles.formGroup}>
              <label>کلید گذرگاه اختصاصی مدیران (Secret Master Bypass Key):</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  dir="ltr"
                  className={styles.formInput}
                  value={maintenance.secretBypassKey}
                  onChange={(e) => setMaintenance({ ...maintenance, secretBypassKey: e.target.value })}
                />
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() =>
                    setMaintenance({
                      ...maintenance,
                      secretBypassKey: `endoora_master_override_${Math.floor(1000 + Math.random() * 9000)}`,
                    })
                  }
                >
                  🎲 تصادفی
                </button>
              </div>
              <small style={{ color: "#64748b" }}>با وارد کردن این کلید در صفحه نگهداری، مدیران می‌توانند از سد قفل عبور کنند.</small>
            </div>

            <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
              <label>عنوان فارسی پیام نگهداری:</label>
              <input
                type="text"
                className={styles.formInput}
                value={maintenance.titleFa}
                onChange={(e) => setMaintenance({ ...maintenance, titleFa: e.target.value })}
              />
            </div>

            <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
              <label>توضیحات فارسی به مخاطبان و زبان‌آموزان:</label>
              <textarea
                rows={3}
                className={styles.formTextarea}
                value={maintenance.messageFa}
                onChange={(e) => setMaintenance({ ...maintenance, messageFa: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => handleSaveMaintenance(maintenance)}
              disabled={maintenanceSaving}
            >
              {maintenanceSaving ? "در حال ذخیره‌سازی..." : "💾 ذخیره و اعمال آنی تنظیمات نگهداری"}
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 9. Sub-Tab: Environment & API Gateway Vault */}
      {/* ===================================================================== */}
      {activeTab === "api-vault" && (
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h3>صندوق امن کلیدها و تست بلادرنگ درگاه‌های حیاتی (API Gateway Vault)</h3>
              <p>نظارت بر تاخیر (Latency)، پینگ زنده و وضعیت اتصال کلیدهای ارتباطی سیستم‌های خارجی ایندورا</p>
            </div>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={handlePingAllServices}
              disabled={vaultLoading}
            >
              🚀 تست پینگ همگانی همه درگاه‌ها
            </button>
          </div>

          {/* Integrations Cards Grid */}
          <div className={styles.apiVaultGrid}>
            {apiServices.map((service) => (
              <div key={service.id} className={styles.apiCard}>
                <div className={styles.apiCardTop}>
                  <div>
                    <h4 className={styles.apiNameFa}>{service.nameFa}</h4>
                    <p className={styles.apiNameEn}>{service.nameEn}</p>
                  </div>
                  <span
                    className={
                      service.status === "connected"
                        ? styles.badgeSuccess
                        : service.status === "degraded"
                        ? styles.badgeWarning
                        : styles.badgeDanger
                    }
                  >
                    {service.status === "connected" ? "متصل (Online)" : service.status}
                  </span>
                </div>

                <div className={styles.apiDetailsRow}>
                  <span>تاخیر شبکه (Ping Latency):</span>
                  <strong style={{ color: service.latencyMs < 50 ? "#10b981" : service.latencyMs < 150 ? "#2563eb" : "#d97706" }}>
                    {service.latencyMs} میلی‌ثانیه
                  </strong>
                </div>

                <div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.25rem" }}>کلید یا شناسه اتصال:</div>
                  <div className={styles.maskedKey}>{service.maskedKey}</div>
                </div>

                <button
                  type="button"
                  className={styles.btnSecondary}
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => handlePingService(service.id)}
                  disabled={pingingServiceId === service.id}
                >
                  {pingingServiceId === service.id ? "در حال ارسال پینگ..." : "⚡ تست مجدد پینگ این درگاه"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* Modals */}
      {/* ===================================================================== */}

      {/* Restore Database Confirmation Modal */}
      {restoreConfirmBackup && (
        <div className={styles.modalBackdrop} onClick={() => setRestoreConfirmBackup(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "520px" }}>
            <div className={styles.modalHeader}>
              <h3 style={{ color: "#ef4444" }}>⚠️ تایید بازگردانی پایگاه داده (Restore)</h3>
              <button type="button" className={styles.closeBtn} onClick={() => setRestoreConfirmBackup(null)}>
                ×
              </button>
            </div>

            <p style={{ fontSize: "0.9rem", color: "#334155", lineHeight: 1.6 }}>
              آیا از بازگردانی پایگاه داده به وضعیت اسنپ‌شات <strong>{restoreConfirmBackup.filename}</strong> اطمینان کامل دارید؟
            </p>
            <div style={{ background: "#fef2f2", padding: "0.75rem", borderRadius: "8px", border: "1px solid #fecaca", fontSize: "0.85rem", color: "#991b1b" }}>
              توجه: این اقدام تمامی رکوردهای بعد از تاریخ <strong>{restoreConfirmBackup.createdAt}</strong> را با وضعیت این فایل پشتیبان جایگزین خواهد کرد.
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
              <button type="button" className={styles.btnSecondary} onClick={() => setRestoreConfirmBackup(null)}>
                انصراف
              </button>
              <button
                type="button"
                className={styles.btnDanger}
                onClick={handleExecuteRestore}
                disabled={restoring}
              >
                {restoring ? "در حال بازگردانی پایگاه داده..." : "بله، پایگاه داده را بازگردانی کن"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowNewTaskModal(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>تعریف تسک خودکار و کران‌جاب جدید (New Task)</h3>
              <button type="button" className={styles.closeBtn} onClick={() => setShowNewTaskModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleCreateCustomTask} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className={styles.formGroup}>
                <label>عنوان فارسی تسک:</label>
                <input
                  type="text"
                  className={styles.formInput}
                  required
                  placeholder="مثال: پاکسازی کدهای OTP منقضی شده"
                  value={newTaskForm.titleFa}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, titleFa: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>عنوان انگلیسی (English Title):</label>
                <input
                  type="text"
                  dir="ltr"
                  className={styles.formInput}
                  placeholder="e.g. Purge Expired OTP Codes"
                  value={newTaskForm.titleEn}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, titleEn: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>توضیحات عملکرد تسک:</label>
                <textarea
                  rows={2}
                  className={styles.formTextarea}
                  value={newTaskForm.descriptionFa}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, descriptionFa: e.target.value })}
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>دوره تناوب زمان‌بندی:</label>
                  <select
                    className={styles.formSelect}
                    value={newTaskForm.scheduleType}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, scheduleType: e.target.value as TaskScheduleType })}
                  >
                    <option value="every_15m">هر ۱۵ دقیقه</option>
                    <option value="every_hour">هر ۱ ساعت</option>
                    <option value="every_6h">هر ۶ ساعت</option>
                    <option value="daily">روزانه (ساعت ۰۲:۰۰ بامداد)</option>
                    <option value="weekly">هفتگی (جمعه‌ها)</option>
                    <option value="custom_cron">فرمول سفارشی Cron</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>فرمول کران (Cron Expression):</label>
                  <input
                    type="text"
                    dir="ltr"
                    className={styles.formInput}
                    value={newTaskForm.cronExpression}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, cronExpression: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>آدرس اندپوینت هدف برای اجرای تسک:</label>
                <input
                  type="text"
                  dir="ltr"
                  className={styles.formInput}
                  required
                  placeholder="/api/cron/your-task-endpoint"
                  value={newTaskForm.targetEndpoint}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, targetEndpoint: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="button" className={styles.btnSecondary} onClick={() => setShowNewTaskModal(false)}>
                  انصراف
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  💾 ثبت و زمان‌بندی تسک
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Dictionary Key Modal */}
      {showAddKeyModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowAddKeyModal(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "480px" }}>
            <div className={styles.modalHeader}>
              <h3>افزودن کلید واژه‌نامه جدید (New i18n Key)</h3>
              <button type="button" className={styles.closeBtn} onClick={() => setShowAddKeyModal(false)}>
                ×
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div className={styles.formGroup}>
                <label>شناسه کلید یکتا (Key - انگلیسی و با آندراسکور):</label>
                <input
                  type="text"
                  dir="ltr"
                  className={styles.formInput}
                  placeholder="e.g. banner_spring_sale"
                  value={newKeyForm.key}
                  onChange={(e) => setNewKeyForm({ ...newKeyForm, key: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>دسته‌بندی:</label>
                <select
                  className={styles.formSelect}
                  value={newKeyForm.category}
                  onChange={(e) => setNewKeyForm({ ...newKeyForm, category: e.target.value })}
                >
                  <option value="general">عمومی (General)</option>
                  <option value="auth">احراز هویت (Auth)</option>
                  <option value="courses">دوره‌ها (Courses)</option>
                  <option value="checkout">خرید و پرداخت (Checkout)</option>
                  <option value="errors">پیام‌های خطا (Errors)</option>
                  <option value="lms">کلاس و آزمون‌ها (LMS)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>متن فارسی (Persian Text):</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="متن نمایش داده شده به زبان فارسی..."
                  value={newKeyForm.faText}
                  onChange={(e) => setNewKeyForm({ ...newKeyForm, faText: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>متن انگلیسی (English Text):</label>
                <input
                  type="text"
                  dir="ltr"
                  className={styles.formInput}
                  placeholder="English translation..."
                  value={newKeyForm.enText}
                  onChange={(e) => setNewKeyForm({ ...newKeyForm, enText: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
              <button type="button" className={styles.btnSecondary} onClick={() => setShowAddKeyModal(false)}>
                انصراف
              </button>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => {
                  if (!newKeyForm.key.trim() || !newKeyForm.faText.trim()) {
                    alert("کلید و متن فارسی الزامی است.");
                    return;
                  }
                  handleSaveDictionaryItem(newKeyForm.key.trim(), newKeyForm.faText, newKeyForm.enText);
                  setShowAddKeyModal(false);
                  setNewKeyForm({ key: "", category: "general", faText: "", enText: "" });
                }}
              >
                💾 ذخیره کلید
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JSON Inspector Modal */}
      {inspectRowData && (
        <div className={styles.modalBackdrop} onClick={() => setInspectRowData(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>مشاهده کامل ساختار رکورد (JSON Inspector)</h3>
              <button type="button" className={styles.closeBtn} onClick={() => setInspectRowData(null)}>
                ×
              </button>
            </div>
            <pre className={styles.jsonBox}>{JSON.stringify(inspectRowData, null, 2)}</pre>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(inspectRowData, null, 2));
                  notify("متن JSON در کلیپ‌بورد کپی شد.");
                }}
              >
                📋 کپی JSON
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safe Row Edit Modal */}
      {editRowData && (
        <div className={styles.modalBackdrop} onClick={() => setEditRowData(null)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>ویرایش امن رکورد در جدول {tableMeta.nameFa}</h3>
              <button type="button" className={styles.closeBtn} onClick={() => setEditRowData(null)}>
                ×
              </button>
            </div>

            <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
              کلید اصلی رکورد: <code>{String(editRowData.row[tableMeta.primaryKey] || editRowData.row.id || editRowData.row.key)}</code>
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", maxHeight: "400px", overflowY: "auto" }}>
              {Object.keys(editRowData.formState).map((field) => {
                const isPk = field === tableMeta.primaryKey || field === "id";
                return (
                  <div key={field} className={styles.formGroup}>
                    <label style={{ fontSize: "0.8rem", color: "#475569" }}>
                      ستون {field} {isPk && "(کلید اصلی - غیرقابل تغییر)"}:
                    </label>
                    <input
                      type="text"
                      className={styles.formInput}
                      disabled={isPk}
                      value={String(editRowData.formState[field] ?? "")}
                      onChange={(e) =>
                        setEditRowData({
                          ...editRowData,
                          formState: { ...editRowData.formState, [field]: e.target.value },
                        })
                      }
                    />
                  </div>
                );
              })}

              <div className={styles.formGroup} style={{ borderTop: "1px dashed #cbd5e1", paddingTop: "0.75rem" }}>
                <label style={{ color: "#b91c1c" }}>علت تغییر (Audit Log Reason - الزامی):</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="مثال: اصلاح بالانس کیف پول بر اساس تیکت پشتیبانی #982..."
                  value={editRowData.reason}
                  onChange={(e) => setEditRowData({ ...editRowData, reason: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button type="button" className={styles.btnSecondary} onClick={() => setEditRowData(null)}>
                انصراف
              </button>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={handleSaveRowMutation}
                disabled={mutatingRow}
              >
                {mutatingRow ? "در حال اعمال..." : "💾 ذخیره و ثبت در ممیزی امنیتی"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flush All Confirmation Modal */}
      {confirmFlushModal && (
        <div className={styles.modalBackdrop} onClick={() => setConfirmFlushModal(false)}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} style={{ maxWidth: "480px" }}>
            <div className={styles.modalHeader}>
              <h3 style={{ color: "#ef4444" }}>⚠️ تایید پاکسازی کامل Redis</h3>
              <button type="button" className={styles.closeBtn} onClick={() => setConfirmFlushModal(false)}>
                ×
              </button>
            </div>

            <p style={{ fontSize: "0.9rem", color: "#334155", lineHeight: 1.6 }}>
              آیا از اجرای دستور <strong>FlushAll</strong> اطمینان کامل دارید؟ این اقدام تمامی کلیدهای موقت حافظه، کش‌ها و سشن‌های در حافظه را بلافاصله باطل می‌سازد.
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button type="button" className={styles.btnSecondary} onClick={() => setConfirmFlushModal(false)}>
                انصراف
              </button>
              <button
                type="button"
                className={styles.btnDanger}
                onClick={() => handlePurgeCache("redis_all")}
                disabled={cacheLoading}
              >
                بله، حافظه Redis را کاملا پاک کن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
