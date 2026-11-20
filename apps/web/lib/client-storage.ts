"use client";

/**
 * Account-Scoped Client Storage Utility (SEC-004 / F22)
 *
 * Scopes localStorage and sessionStorage keys by authenticated user ID to prevent
 * cross-account data leakage on shared devices (IELTS attempts, Leitner decks,
 * exam drafts, diagnostic results, and progress).
 */

const ACTIVE_USER_STORAGE_KEY = "endoora_active_user_id";
const USER_KEY_PREFIX = "endoora_u_";
const GUEST_KEY_PREFIX = "endoora_guest__";
const AUTH_CHANGED_EVENT = "endoora:auth-user-changed";

// In-memory fallback for SSR or environments without localStorage
const memoryStorage = new Map<string, string>();

function getLocalStorage(): Storage | null {
  if (typeof window !== "undefined" && window.localStorage) {
    return window.localStorage;
  }
  return null;
}

/**
 * Retrieves the currently active user ID from client storage.
 */
export function getActiveUserId(): string | null {
  const storage = getLocalStorage();
  if (storage) {
    return storage.getItem(ACTIVE_USER_STORAGE_KEY);
  }
  return memoryStorage.get(ACTIVE_USER_STORAGE_KEY) || null;
}

/**
 * Sets the currently active user ID.
 * When switching accounts or logging out, cleans up transient scratch data
 * and notifies subscribers to reload isolated user views.
 */
export function setActiveUserId(userId: string | null): void {
  const previousUserId = getActiveUserId();
  const normalizedNewId = userId && userId.trim() ? userId.trim() : null;

  const storage = getLocalStorage();
  if (storage) {
    if (normalizedNewId) {
      storage.setItem(ACTIVE_USER_STORAGE_KEY, normalizedNewId);
    } else {
      storage.removeItem(ACTIVE_USER_STORAGE_KEY);
    }
  } else {
    if (normalizedNewId) {
      memoryStorage.set(ACTIVE_USER_STORAGE_KEY, normalizedNewId);
    } else {
      memoryStorage.delete(ACTIVE_USER_STORAGE_KEY);
    }
  }

  // Detect account switch or logout
  if (previousUserId !== normalizedNewId) {
    // When switching accounts, clear guest scratch data to prevent cross-account inheritance
    clearGuestData();

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(AUTH_CHANGED_EVENT, {
          detail: {
            previousUserId,
            newUserId: normalizedNewId,
            timestamp: Date.now(),
          },
        })
      );
    }
  }
}

/**
 * Clears active user context (logout).
 */
export function clearActiveUser(): void {
  setActiveUserId(null);
}

/**
 * Computes an account-isolated storage key.
 * - Authenticated: `endoora_u_{userId}__{cleanKey}`
 * - Guest / Unauthenticated: `endoora_guest__{cleanKey}`
 */
export function getScopedStorageKey(
  baseKey: string,
  explicitUserId?: string | null
): string {
  const cleanKey = baseKey.replace(/^endoora_/, "");
  const targetUserId =
    explicitUserId !== undefined ? explicitUserId : getActiveUserId();

  if (targetUserId && targetUserId.trim()) {
    return `${USER_KEY_PREFIX}${targetUserId.trim()}__${cleanKey}`;
  }
  return `${GUEST_KEY_PREFIX}${cleanKey}`;
}

/**
 * Account-scoped localStorage abstraction.
 */
export const scopedLocalStorage = {
  getItem(baseKey: string, explicitUserId?: string | null): string | null {
    const key = getScopedStorageKey(baseKey, explicitUserId);
    const storage = getLocalStorage();
    if (storage) {
      try {
        return storage.getItem(key);
      } catch {
        return null;
      }
    }
    return memoryStorage.get(key) || null;
  },

  setItem(
    baseKey: string,
    value: string,
    explicitUserId?: string | null
  ): void {
    const key = getScopedStorageKey(baseKey, explicitUserId);
    const storage = getLocalStorage();
    if (storage) {
      try {
        storage.setItem(key, value);
      } catch (err) {
        console.warn("Failed to set scoped localStorage item:", err);
      }
    } else {
      memoryStorage.set(key, value);
    }
  },

  removeItem(baseKey: string, explicitUserId?: string | null): void {
    const key = getScopedStorageKey(baseKey, explicitUserId);
    const storage = getLocalStorage();
    if (storage) {
      try {
        storage.removeItem(key);
      } catch {
        // ignore
      }
    } else {
      memoryStorage.delete(key);
    }
  },

  /**
   * Deletes all storage records belonging to a specific user.
   */
  clearUserData(userId: string): void {
    if (!userId) return;
    const prefix = `${USER_KEY_PREFIX}${userId.trim()}__`;
    const storage = getLocalStorage();
    if (storage) {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < storage.length; i++) {
          const k = storage.key(i);
          if (k && k.startsWith(prefix)) {
            keysToRemove.push(k);
          }
        }
        for (const k of keysToRemove) {
          storage.removeItem(k);
        }
      } catch {
        // ignore
      }
    }

    // Memory storage cleanup
    for (const k of Array.from(memoryStorage.keys())) {
      if (k.startsWith(prefix)) {
        memoryStorage.delete(k);
      }
    }
  },

  /**
   * Clears all guest/unauthenticated records.
   */
  clearGuestData(): void {
    clearGuestData();
  },
};

/**
 * Cleans up guest storage keys.
 */
export function clearGuestData(): void {
  const storage = getLocalStorage();
  if (storage) {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < storage.length; i++) {
        const k = storage.key(i);
        if (k && k.startsWith(GUEST_KEY_PREFIX)) {
          keysToRemove.push(k);
        }
      }
      for (const k of keysToRemove) {
        storage.removeItem(k);
      }
    } catch {
      // ignore
    }
  }

  for (const k of Array.from(memoryStorage.keys())) {
    if (k.startsWith(GUEST_KEY_PREFIX)) {
      memoryStorage.delete(k);
    }
  }
}
