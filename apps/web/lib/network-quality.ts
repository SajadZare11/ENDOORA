"use client";

export type NetworkEffectiveType = "slow-2g" | "2g" | "3g" | "4g" | "unknown";

export interface NetworkQualityState {
  isOnline: boolean;
  effectiveType: NetworkEffectiveType;
  saveData: boolean;
  isLowBandwidthMode: boolean;
  rtt?: number;
  downlink?: number;
}

const LOW_BANDWIDTH_PREF_KEY = "endoora_low_bandwidth_v1";

type Listener = (state: NetworkQualityState) => void;
const listeners = new Set<Listener>();

function readLowBandwidthPref(): boolean {
  if (typeof window === "undefined" || !window.localStorage) return false;
  try {
    return window.localStorage.getItem(LOW_BANDWIDTH_PREF_KEY) === "true";
  } catch {
    return false;
  }
}

export function getNetworkQualityState(): NetworkQualityState {
  if (typeof window === "undefined") {
    return {
      isOnline: true,
      effectiveType: "4g",
      saveData: false,
      isLowBandwidthMode: false,
    };
  }

  const isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;
  // @ts-expect-error Connection API untyped
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  const effectiveType: NetworkEffectiveType = (connection?.effectiveType as NetworkEffectiveType) || "unknown";
  const saveData = Boolean(connection?.saveData);
  const userPref = readLowBandwidthPref();

  // Automatic low bandwidth mode if connection is 2g/slow-2g, saveData is enabled, or user explicitly requested it
  const isLowBandwidthMode =
    userPref || saveData || effectiveType === "2g" || effectiveType === "slow-2g";

  return {
    isOnline,
    effectiveType,
    saveData,
    isLowBandwidthMode,
    rtt: connection?.rtt,
    downlink: connection?.downlink,
  };
}

export function setLowBandwidthMode(enabled: boolean): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(LOW_BANDWIDTH_PREF_KEY, enabled ? "true" : "false");
  } catch {
    // safe fallback
  }
  notifyNetworkListeners();
}

function notifyNetworkListeners(): void {
  const current = getNetworkQualityState();
  listeners.forEach((fn) => {
    try {
      fn(current);
    } catch (_) {
      // safe fallback
    }
  });
}

export function subscribeToNetworkQuality(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

if (typeof window !== "undefined") {
  window.addEventListener("online", notifyNetworkListeners);
  window.addEventListener("offline", notifyNetworkListeners);

  // @ts-expect-error Connection API untyped
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection && typeof connection.addEventListener === "function") {
    connection.addEventListener("change", notifyNetworkListeners);
  }
}
