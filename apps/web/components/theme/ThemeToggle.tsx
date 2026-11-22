"use client";

import {useSyncExternalStore} from "react";

function subscribe(notify: () => void) {
  window.addEventListener("endoora-theme",notify);
  return () => window.removeEventListener("endoora-theme",notify);
}
export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe,() => document.documentElement.dataset.theme === "dark",() => false);
  return <button type="button" className="theme-toggle" aria-label="حالت تاریک / Dark mode" aria-pressed={dark} onClick={() => {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {localStorage.setItem("endoora-theme-v1",next);} catch { /* The preference still applies to this page. */ }
    window.dispatchEvent(new Event("endoora-theme"));
  }}>{dark ? "☀" : "☾"}</button>;
}
