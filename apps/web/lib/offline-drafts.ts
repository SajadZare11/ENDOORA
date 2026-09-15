"use client";

import { endooraApi } from "./endoora-api";

export type DraftSyncStatus = "synced" | "pending" | "conflict" | "error";

export interface LocalDraftRecord {
  id: string;
  draft_type: string;
  resource_id: string;
  title: string;
  content_json: Record<string, unknown>;
  client_version: number;
  server_version: number;
  client_updated_at: string;
  server_updated_at?: string;
  checksum: string;
  is_conflict?: boolean;
  conflict_backup?: Record<string, unknown>;
  sync_status: DraftSyncStatus;
}

const STORAGE_INDEX_KEY = "endoora_draft_index_v1";
const STORAGE_PREFIX = "endoora_draft_";

type Listener = () => void;
const listeners = new Set<Listener>();

function notifyListeners() {
  listeners.forEach((l) => {
    try {
      l();
    } catch (_) {
      // safe fallback
    }
  });
}

function safeGetItem(key: string): string | null {
  if (typeof window === "undefined" || !window.localStorage) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore quota errors
  }
}

function safeRemoveItem(key: string): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

function getStoredIndex(): string[] {
  const raw = safeGetItem(STORAGE_INDEX_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function setStoredIndex(ids: string[]): void {
  safeSetItem(STORAGE_INDEX_KEY, JSON.stringify(Array.from(new Set(ids))));
}

export function computeLocalChecksum(data: unknown): string {
  const str = JSON.stringify(data || {});
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return "chk_" + Math.abs(hash).toString(16);
}

export function listLocalDrafts(): LocalDraftRecord[] {
  const ids = getStoredIndex();
  const drafts: LocalDraftRecord[] = [];
  for (const id of ids) {
    const raw = safeGetItem(`${STORAGE_PREFIX}${id}`);
    if (raw) {
      try {
        drafts.push(JSON.parse(raw));
      } catch {
        // corrupted item
      }
    }
  }
  return drafts.sort(
    (a, b) =>
      new Date(b.client_updated_at).getTime() -
      new Date(a.client_updated_at).getTime()
  );
}

export function getLocalDraft(id: string): LocalDraftRecord | null {
  const raw = safeGetItem(`${STORAGE_PREFIX}${id}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveLocalDraft(draft: Partial<LocalDraftRecord>): LocalDraftRecord {
  const id = draft.id || `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const existing = getLocalDraft(id);

  const nowIso = new Date().toISOString();
  const content = draft.content_json || existing?.content_json || {};
  const checksum = computeLocalChecksum(content);

  const clientVersion = (existing?.client_version || 0) + 1;

  const record: LocalDraftRecord = {
    id,
    draft_type: draft.draft_type || existing?.draft_type || "general_draft",
    resource_id: draft.resource_id ?? existing?.resource_id ?? "",
    title: draft.title || existing?.title || "پیش‌نویس بدون عنوان",
    content_json: content,
    client_version: clientVersion,
    server_version: existing?.server_version || 1,
    client_updated_at: nowIso,
    server_updated_at: existing?.server_updated_at,
    checksum,
    is_conflict: draft.is_conflict ?? existing?.is_conflict ?? false,
    conflict_backup: draft.conflict_backup || existing?.conflict_backup,
    sync_status: draft.sync_status || "pending",
  };

  safeSetItem(`${STORAGE_PREFIX}${id}`, JSON.stringify(record));

  const currentIds = getStoredIndex();
  if (!currentIds.includes(id)) {
    setStoredIndex([...currentIds, id]);
  }

  notifyListeners();
  return record;
}

export function deleteLocalDraft(id: string): void {
  safeRemoveItem(`${STORAGE_PREFIX}${id}`);
  const currentIds = getStoredIndex();
  setStoredIndex(currentIds.filter((item) => item !== id));
  notifyListeners();
}

export function subscribeToDrafts(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function syncPendingDrafts(): Promise<{
  synced: number;
  conflicts: number;
  errors: number;
}> {
  if (typeof window === "undefined" || !navigator.onLine) {
    return { synced: 0, conflicts: 0, errors: 0 };
  }

  const drafts = listLocalDrafts().filter(
    (d) => d.sync_status === "pending" || d.sync_status === "error"
  );
  if (drafts.length === 0) {
    return { synced: 0, conflicts: 0, errors: 0 };
  }

  try {
    const payload = {
      sync_session_id: `sync_cli_${Date.now()}`,
      network_effective_type:
        // @ts-expect-error navigator.connection may be vendor-prefixed or untyped
        navigator.connection?.effectiveType || "unknown",
      // @ts-expect-error navigator.connection may be vendor-prefixed or untyped
      is_low_bandwidth: Boolean(navigator.connection?.saveData),
      payload_bytes: JSON.stringify(drafts).length,
      drafts: drafts.map((d) => ({
        id: d.id.startsWith("local_") ? undefined : d.id,
        draft_type: d.draft_type,
        resource_id: d.resource_id,
        title: d.title,
        content_json: d.content_json,
        client_version: d.client_version,
        client_updated_at: d.client_updated_at,
        checksum: d.checksum,
      })),
    };

    const response = await endooraApi<{
      sync_session_id: string;
      drafts_received: number;
      drafts_updated: number;
      conflicts_detected: number;
      drafts: Array<{
        id: string;
        title: string;
        client_version: number;
        server_version: number;
        is_conflict: boolean;
        conflict_backup: Record<string, unknown>;
        server_updated_at: string;
      }>;
    }>("/api/drafts/sync/", {
      method: "POST",
      json: payload,
    });

    let synced = 0;
    let conflicts = 0;

    if (response?.drafts) {
      for (const serverDraft of response.drafts) {
        // Match with local draft
        const local = drafts.find(
          (d) => d.id === serverDraft.id || d.title === serverDraft.title
        );
        if (local) {
          local.id = serverDraft.id;
          local.server_version = serverDraft.server_version;
          local.server_updated_at = serverDraft.server_updated_at;
          local.is_conflict = serverDraft.is_conflict;
          local.conflict_backup = serverDraft.conflict_backup;
          local.sync_status = serverDraft.is_conflict ? "conflict" : "synced";
          safeSetItem(`${STORAGE_PREFIX}${local.id}`, JSON.stringify(local));

          if (serverDraft.is_conflict) {
            conflicts++;
          } else {
            synced++;
          }
        }
      }
    }

    notifyListeners();
    return { synced, conflicts, errors: 0 };
  } catch {
    for (const d of drafts) {
      d.sync_status = "error";
      safeSetItem(`${STORAGE_PREFIX}${d.id}`, JSON.stringify(d));
    }
    notifyListeners();
    return { synced: 0, conflicts: 0, errors: drafts.length };
  }
}

// Global auto-sync on network reconnection
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    syncPendingDrafts().catch(() => {});
  });
}
