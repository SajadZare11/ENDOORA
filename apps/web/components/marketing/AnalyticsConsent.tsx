"use client";

import { endooraApi } from "../../lib/endoora-api";
import { Button } from "@endoora/ui";

import { useSyncExternalStore } from "react";
import type { PublicLocale } from "../../lib/public-site";
import styles from "./marketing.module.css";

const STORAGE_KEY = "endoora_optional_analytics_consent";
const CONSENT_EVENT = "endoora:analytics-consent";

type ConsentChoice = "accepted" | "declined" | null;

function readChoice(): ConsentChoice {
  const value = window.localStorage.getItem(STORAGE_KEY);

  if (value === "accepted" || value === "declined") {
    return value;
  }

  return null;
}

function getServerSnapshot(): ConsentChoice {
  return null;
}

function subscribe(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      onStoreChange();
    }
  };

  const handleConsentChange = () => {
    onStoreChange();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(CONSENT_EVENT, handleConsentChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CONSENT_EVENT, handleConsentChange);
  };
}

export function AnalyticsConsent({ locale }: { locale: PublicLocale }) {
  const isFa = locale === "fa";

  const choice = useSyncExternalStore(
    subscribe,
    readChoice,
    getServerSnapshot,
  );

  if (choice) {
    return null;
  }

  function save(value: Exclude<ConsentChoice, null>) {
    window.localStorage.setItem(STORAGE_KEY, value);
    window.dispatchEvent(new Event(CONSENT_EVENT));
    void endooraApi("/auth/me/").then(() => endooraApi("/privacy/preferences/", {method:"PUT",json:{analytics_processing:value === "accepted"}})).catch(() => {});
    if(value === "accepted") void endooraApi("/analytics/track/", {method:"POST",json:{event_name:"route_view_landing",optional_consent:true,locale}}).catch(() => {});
  }

  return (
    <aside
      className={styles.consent}
      aria-label={
        isFa ? "تنظیمات تحلیل اختیاری" : "Optional analytics preference"
      }
    >
      <div>
        <strong>
          {isFa
            ? "اندازه‌گیری اختیاری استفاده از سایت"
            : "Optional usage analytics"}
        </strong>

        <p>
          {locale === "fa"
            ? "Endoora هیچ اسکریپت رهگیری شخص ثالثی بارگیری نمی‌کند. می‌توانید ثبت رویدادهای استفاده را بپذیرید یا رد کنید."
            : "Endoora loads no third-party analytics scripts. Choose whether Endoora may record optional usage events."}
        </p>
      </div>

      <div className={styles.consentActions}>
        <Button type="button" onClick={() => save("accepted")}>
          {isFa ? "اجازه ثبت رویدادها" : "Allow analytics"}
        </Button>

        <Button type="button" onClick={() => save("declined")}>
          {isFa ? "رد تحلیل اختیاری" : "Decline optional analytics"}
        </Button>
      </div>
    </aside>
  );
}