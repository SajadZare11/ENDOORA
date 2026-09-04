"use client";

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
            ? "تحلیل اختیاری هنوز فعال نیست"
            : "Optional analytics are not active yet"}
        </strong>

        <p>
          {locale === "fa"
            ? "Endoora هیچ اسکریپت رهگیری شخص ثالثی بارگیری نمی‌کند. این انتخاب فقط در مرورگر شما ذخیره می‌شود تا حفظ حریم خصوصی از ابتدا شفاف و تضمین‌شده باشد."
            : "Endoora loads no third-party analytics scripts. This preference is stored only in your browser so the consent path is explicit from the start."}
        </p>
      </div>

      <div className={styles.consentActions}>
        <button type="button" onClick={() => save("accepted")}>
          {isFa ? "اجازه در آینده" : "Allow in future"}
        </button>

        <button type="button" onClick={() => save("declined")}>
          {isFa ? "رد تحلیل اختیاری" : "Decline optional analytics"}
        </button>
      </div>
    </aside>
  );
}