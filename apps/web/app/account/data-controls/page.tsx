"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { AuthShell } from "../../../components/auth/AuthShell";
import {
  apiErrorMessages,
  endooraApi,
  persistPreferredLocale,
  type EndooraLocale,
} from "../../../lib/endoora-api";
import {
  fetchPrivacyPreferences,
  updatePrivacyPreferences,
  type PrivacyConsentPreference,
} from "../../../lib/privacy-ops";
import styles from "./data-controls.module.css";

type AccountMe = {
  id: string;
  email: string;
  preferred_locale: EndooraLocale;
};

type DataExportRequest = {
  id: string;
  status: string;
  requested_at?: string;
  completed_at?: string | null;
  failure_code?: string;
};

type DeletionRequest = {
  id: string;
  status: string;
  scheduled_for: string;
  requested_at?: string;
};

type AccountSummary = {
  data_controls: {
    latest_export: DataExportRequest | null;
    latest_deletion_request: DeletionRequest | null;
  };
};

const copy = {
  fa: {
    title: "حریم خصوصی و داده‌ها",
    description:
      "درخواست خروجی داده‌های حساب و فرایند حذف حساب Endoora را از این بخش مدیریت کنید.",

    loading: "در حال بارگذاری کنترل‌های داده…",
    errorTitle: "امکان بارگذاری تنظیمات داده وجود نداشت.",
    signIn: "ورود",

    exportTitle: "دریافت خروجی از داده‌ها",
    exportDescription:
      "می‌توانید یک درخواست برای آماده‌سازی خروجی داده‌های حساب خود ثبت کنید.",
    requestExport: "درخواست خروجی داده‌ها",
    requestingExport: "در حال ثبت درخواست…",
    exportSuccess:
      "درخواست خروجی داده‌ها با موفقیت ثبت شد.",
    noExports:
      "هنوز هیچ درخواست خروجی داده‌ای ثبت نشده است.",
    exportHistory: "درخواست‌های خروجی",
    requestId: "شناسه درخواست",
    status: "وضعیت",
    requestedAt: "زمان درخواست",
    completedAt: "زمان تکمیل",
    unavailable: "نامشخص",

    deleteTitle: "درخواست حذف حساب",
    deleteDescription:
      "این بخش برای ثبت درخواست حذف حساب است. درخواست حذف بلافاصله حساب را پاک نمی‌کند و تاریخ برنامه‌ریزی‌شده توسط سرور تعیین می‌شود.",

    deleteWarningTitle: "اقدام حساس",
    deleteWarning:
      "درخواست حذف حساب می‌تواند در آینده باعث حذف داده‌ها و از دست رفتن دسترسی شما شود. فقط زمانی ادامه دهید که واقعاً قصد حذف حساب را دارید.",

    existingDeletion:
      "برای این حساب یک درخواست حذف ثبت شده است.",
    deletionStatus: "وضعیت درخواست",
    scheduledFor: "زمان برنامه‌ریزی‌شده",

    reason: "دلیل اختیاری",
    reasonHelp:
      "حداکثر ۶۴ نویسه. اطلاعات حساس در این قسمت وارد نکنید.",

    confirmation: "تأیید حذف",
    confirmationHelp:
      'برای فعال شدن دکمه، عبارت انگلیسی "DELETE" را دقیقاً وارد کنید.',

    requestDeletion: "ثبت درخواست حذف حساب",
    requestingDeletion: "در حال ثبت درخواست…",
    deletionSuccess:
      "درخواست حذف حساب ثبت شد.",
    cancelDeletion: "لغو درخواست حذف",
    cancellingDeletion: "در حال لغو درخواست…",
    cancellationSuccess:
      "درخواست حذف لغو شد و حساب شما حفظ می‌شود.",

    back: "بازگشت به حساب کاربری",
  },

  en: {
    title: "Privacy & data controls",
    description:
      "Manage Endoora account data exports and account-deletion requests.",

    loading: "Loading data controls…",
    errorTitle: "Your data controls could not be loaded.",
    signIn: "Sign in",

    exportTitle: "Export your data",
    exportDescription:
      "You can submit a request to prepare an export of your account data.",
    requestExport: "Request data export",
    requestingExport: "Requesting…",
    exportSuccess:
      "Your data-export request was submitted successfully.",
    noExports:
      "You have not submitted any data-export requests yet.",
    exportHistory: "Export requests",
    requestId: "Request ID",
    status: "Status",
    requestedAt: "Requested",
    completedAt: "Completed",
    unavailable: "Unavailable",

    deleteTitle: "Request account deletion",
    deleteDescription:
      "This area submits an account-deletion request. It does not immediately erase the account; the server determines the scheduled date.",

    deleteWarningTitle: "Sensitive action",
    deleteWarning:
      "Account deletion may eventually remove your data and access. Continue only when you genuinely intend to delete the account.",

    existingDeletion:
      "A deletion request already exists for this account.",
    deletionStatus: "Request status",
    scheduledFor: "Scheduled for",

    reason: "Optional reason",
    reasonHelp:
      "Maximum 64 characters. Do not enter sensitive information here.",

    confirmation: "Deletion confirmation",
    confirmationHelp:
      'Type the English word "DELETE" exactly to enable the button.',

    requestDeletion: "Request account deletion",
    requestingDeletion: "Submitting…",
    deletionSuccess:
      "Your account-deletion request was submitted.",
    cancelDeletion: "Cancel deletion request",
    cancellingDeletion: "Cancelling…",
    cancellationSuccess:
      "The deletion request was cancelled and your account will be kept.",

    back: "Back to account",
  },
} as const;

function formatDate(
  value: string | null | undefined,
  locale: EndooraLocale,
): string {
  if (!value) {
    return copy[locale].unavailable;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    locale === "fa" ? "fa-IR" : "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(date);
}

export default function DataControlsPage() {
  const [prefs, setPrefs] = useState<PrivacyConsentPreference | null>(null);
  const [prefsSaveStatus, setPrefsSaveStatus] = useState("");

  useEffect(() => {
    fetchPrivacyPreferences().then(setPrefs).catch(console.error);
  }, []);

  const togglePref = (key: keyof PrivacyConsentPreference) => {
    if (prefs) setPrefs({ ...prefs, [key]: !prefs[key] });
  };

  const savePrefs = async () => {
    if (prefs) {
      setPrefsSaveStatus("در حال ذخیره...");
      try {
        await updatePrivacyPreferences(prefs);
        setPrefsSaveStatus("تنظیمات با موفقیت ذخیره شد.");
        setTimeout(() => setPrefsSaveStatus(""), 3000);
      } catch (err) {
        setPrefsSaveStatus("خطا در ذخیره تنظیمات.");
      }
    }
  };

  const [locale, setLocale] =
    useState<EndooraLocale>("fa");

  const [account, setAccount] =
    useState<AccountMe | null>(null);

  const [exports, setExports] =
    useState<DataExportRequest[]>([]);

  const [deletion, setDeletion] =
    useState<DeletionRequest | null>(null);

  const [reason, setReason] = useState("");
  const [confirmation, setConfirmation] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [exportBusy, setExportBusy] =
    useState(false);
  const [deleteBusy, setDeleteBusy] =
    useState(false);
  const [cancelBusy, setCancelBusy] =
    useState(false);

  const [exportSuccess, setExportSuccess] =
    useState(false);
  const [deleteSuccess, setDeleteSuccess] =
    useState(false);
  const [cancelSuccess, setCancelSuccess] =
    useState(false);

  const [errors, setErrors] =
    useState<string[]>([]);

  const t = copy[locale];

  useEffect(() => {
    let cancelled = false;
    let errorLocale: EndooraLocale = "fa";

    Promise.all([
      endooraApi<AccountMe>("/auth/me/"),
      endooraApi<DataExportRequest[]>(
        "/profiles/data-exports/",
      ),
      endooraApi<AccountSummary>(
        "/profiles/account-summary/",
      ),
    ])
      .then(
        ([
          accountResult,
          exportResults,
          summaryResult,
        ]) => {
          if (cancelled) {
            return;
          }

          const accountLocale: EndooraLocale =
            accountResult.preferred_locale === "en"
              ? "en"
              : "fa";

          errorLocale = accountLocale;

          setLocale(accountLocale);
          setAccount(accountResult);
          setExports(exportResults);
          const latestDeletion =
            summaryResult.data_controls.latest_deletion_request;
          setDeletion(
            latestDeletion?.status === "pending"
              ? latestDeletion
              : null,
          );
        },
      )
      .catch((error: unknown) => {
        if (!cancelled) {
          setErrors(
            apiErrorMessages(
              error,
              errorLocale,
            ),
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLocaleChange(nextLocale: EndooraLocale) {
    const previousLocale = locale;
    setLocale(nextLocale);

    if (!account || nextLocale === previousLocale) {
      return;
    }

    try {
      await persistPreferredLocale(nextLocale);
      setAccount((current) => current ? {
        ...current,
        preferred_locale: nextLocale,
      } : current);
    } catch (error) {
      setLocale(previousLocale);
      setErrors(apiErrorMessages(error, previousLocale));
    }
  }

  async function requestExport() {
    setExportBusy(true);
    setExportSuccess(false);
    setErrors([]);

    try {
      const result =
        await endooraApi<DataExportRequest>(
          "/profiles/data-exports/",
          {
            method: "POST",
            json: {},
          },
        );

      setExports((current) => {
        const exists = current.some(
          (item) => item.id === result.id,
        );

        if (exists) {
          return current.map((item) =>
            item.id === result.id
              ? result
              : item,
          );
        }

        return [result, ...current];
      });

      setExportSuccess(true);
    } catch (error) {
      setErrors(
        apiErrorMessages(error, locale),
      );
    } finally {
      setExportBusy(false);
    }
  }

  async function requestDeletion(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (confirmation !== "DELETE") {
      return;
    }

    setDeleteBusy(true);
    setDeleteSuccess(false);
    setErrors([]);

    try {
      const result =
        await endooraApi<DeletionRequest>(
          "/auth/deletion-request/",
          {
            method: "POST",
            json: {
              confirm: "DELETE",
              reason_code: reason.trim(),
            },
          },
        );

      setDeletion(result);
      setConfirmation("");
      setDeleteSuccess(true);
    } catch (error) {
      setErrors(
        apiErrorMessages(error, locale),
      );
    } finally {
      setDeleteBusy(false);
    }
  }

  async function cancelDeletion() {
    setCancelBusy(true);
    setCancelSuccess(false);
    setErrors([]);

    try {
      await endooraApi<DeletionRequest>(
        "/auth/deletion-request/cancel/",
        {
          method: "POST",
          json: { confirm: "KEEP" },
        },
      );
      setDeletion(null);
      setCancelSuccess(true);
    } catch (error) {
      setErrors(apiErrorMessages(error, locale));
    } finally {
      setCancelBusy(false);
    }
  }

  if (loading) {
    return (
      <AuthShell
        locale={locale}
        onLocaleChange={setLocale}
        title={t.title}
        description={t.loading}
        variant="wide"
      >
        <div
          className="endoora-status-message"
          role="status"
        >
          {t.loading}
        </div>
      </AuthShell>
    );
  }

  if (!account) {
    return (
      <AuthShell
        locale={locale}
        onLocaleChange={setLocale}
        title={t.title}
        description={t.errorTitle}
        variant="wide"
        footer={
          <Link href="/auth/login">
            {t.signIn}
          </Link>
        }
      >
        <div
          className="endoora-error-summary"
          role="alert"
        >
          <h3>{t.errorTitle}</h3>

          <ul>
            {errors.map((message, index) => (
              <li key={`${message}-${index}`}>
                {message}
              </li>
            ))}
          </ul>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      locale={locale}
      onLocaleChange={handleLocaleChange}
      title={t.title}
      description={t.description}
      variant="wide"
      footer={
        <Link
          href="/account"
          className={styles.back}
        >
          {t.back}
        </Link>
      }
    >
      <div className={styles.content}>

        {prefs && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Granular Privacy Preferences (تنظیمات حریم خصوصی و پردازش داده‌ها)
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', background: 'var(--color-surface-elevated, #f9fafb)', padding: 'var(--spacing-lg, 1.5rem)', borderRadius: 'var(--radius-lg, 0.5rem)' }}>
              <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="checkbox" checked={prefs.functional_storage} disabled />
                <span>Essential / عملکردی (Always active / ضروری)</span>
              </label>
              <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="checkbox" checked={prefs.analytics_processing} onChange={() => togglePref('analytics_processing')} />
                <span>Analytics / بهبود عملکرد آموزشی و تحلیلی</span>
              </label>
              <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="checkbox" checked={prefs.ai_model_training_telemetry} onChange={() => togglePref('ai_model_training_telemetry')} />
                <span>AI Model / بازخورد و بهینه‌سازی هوش مصنوعی</span>
              </label>
              <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="checkbox" checked={prefs.marketing_communications} onChange={() => togglePref('marketing_communications')} />
                <span>Marketing / اطلاع‌رسانی و پیام‌های ارتباطی</span>
              </label>
              <button type="button" onClick={savePrefs} className="endoora-button endoora-button--primary" style={{ width: 'fit-content', marginTop: '0.5rem' }}>
                ذخیره تنظیمات (Save)
              </button>
              {prefsSaveStatus && <span style={{ color: 'var(--color-success, green)', fontSize: 'var(--font-size-sm, 0.875rem)' }}>{prefsSaveStatus}</span>}
            </div>
          </section>
        )}

        {errors.length > 0 ? (
          <div
            className="endoora-error-summary"
            role="alert"
          >
            <h3>{t.errorTitle}</h3>

            <ul>
              {errors.map((message, index) => (
                <li key={`${message}-${index}`}>
                  {message}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {t.exportTitle}
          </h2>

          <p className={styles.description}>
            {t.exportDescription}
          </p>

          {exportSuccess ? (
            <div
              className="endoora-status-message endoora-status-message--success"
              role="status"
            >
              {t.exportSuccess}
            </div>
          ) : null}

          <div className={styles.actions}>
            <button
              type="button"
              className="endoora-button endoora-button--primary"
              disabled={exportBusy}
              onClick={() => {
                void requestExport();
              }}
            >
              {exportBusy
                ? t.requestingExport
                : t.requestExport}
            </button>
          </div>

          <h3>{t.exportHistory}</h3>

          {exports.length === 0 ? (
            <p className={styles.description}>
              {t.noExports}
            </p>
          ) : (
            <ul className={styles.list}>
              {exports.map((item) => (
                <li
                  key={item.id}
                  className={styles.item}
                >
                  <div className={styles.itemRow}>
                    <strong>{t.requestId}</strong>

                    <span
                      dir="ltr"
                      className={styles.ltr}
                    >
                      {item.id}
                    </span>
                  </div>

                  <div className={styles.itemRow}>
                    <strong>{t.status}</strong>

                    <span className={styles.status}>
                      {item.status}
                    </span>
                  </div>

                  <div className={styles.itemRow}>
                    <strong>{t.requestedAt}</strong>

                    <span>
                      {formatDate(
                        item.requested_at,
                        locale,
                      )}
                    </span>
                  </div>

                                    {item.completed_at ? (
                    <>
                      <div className={styles.itemRow}>
                        <strong>{t.completedAt}</strong>
                        <span>{formatDate(item.completed_at, locale)}</span>
                      </div>
                      <div className={styles.itemRow} style={{ marginTop: '0.5rem' }}>
                        <a href={`/api/privacy/export/${item.id}/download/`} className="endoora-button endoora-button--secondary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                          دانلود فایل (Download)
                        </a>
                      </div>
                    </>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section
          className={`${styles.section} ${styles.danger}`}
        >
          <h2 className={styles.sectionTitle}>
            {t.deleteTitle}
          </h2>

          <p className={styles.description}>
            {t.deleteDescription}
          </p>

                    <div className={styles.warning}>
            <strong>
              {t.deleteWarningTitle}
            </strong>

            <p>{t.deleteWarning}</p>
            <div style={{ marginTop: '0.5rem', padding: '0.25rem 0.5rem', background: 'var(--color-danger-light, #fee2e2)', color: 'var(--color-danger-dark, #991b1b)', borderRadius: 'var(--radius-sm, 0.25rem)', display: 'inline-block', fontWeight: 'bold' }}>
              فرصت انصراف ۷ روزه (7-day grace period)
            </div>
          </div>

          {deleteSuccess ? (
            <div
              className="endoora-status-message endoora-status-message--success"
              role="status"
            >
              {t.deletionSuccess}
            </div>
          ) : null}

          {cancelSuccess ? (
            <div
              className="endoora-status-message endoora-status-message--success"
              role="status"
            >
              {t.cancellationSuccess}
            </div>
          ) : null}

          {deletion ? (
            <div className={styles.item}>
              <strong>
                {t.existingDeletion}
              </strong>

              <div className={styles.itemRow}>
                <span>{t.deletionStatus}</span>

                <span className={styles.status}>
                  {deletion.status}
                </span>
              </div>

              <div className={styles.itemRow}>
                <span>{t.scheduledFor}</span>

                <span>
                  {formatDate(
                    deletion.scheduled_for,
                    locale,
                  )}
                </span>
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className="endoora-button endoora-button--secondary"
                  disabled={cancelBusy}
                  onClick={() => void cancelDeletion()}
                >
                  {cancelBusy
                    ? t.cancellingDeletion
                    : t.cancelDeletion}
                </button>
              </div>
            </div>
          ) : (
            <form
              className={styles.form}
              onSubmit={requestDeletion}
            >
              <div className="endoora-field">
                <label
                  className="endoora-field__label"
                  htmlFor="deletion-reason"
                >
                  {t.reason}
                </label>

                <input
                  id="deletion-reason"
                  className="endoora-input"
                  maxLength={64}
                  value={reason}
                  onChange={(event) =>
                    setReason(event.target.value)
                  }
                />

                <p className="endoora-field__help">
                  {t.reasonHelp}
                </p>
              </div>

              <div className="endoora-field">
                <label
                  className="endoora-field__label"
                  htmlFor="deletion-confirmation"
                >
                  {t.confirmation}
                </label>

                <input
                  id="deletion-confirmation"
                  className={`endoora-input ${styles.ltr}`}
                  autoComplete="off"
                  spellCheck={false}
                  value={confirmation}
                  onChange={(event) =>
                    setConfirmation(
                      event.target.value,
                    )
                  }
                />

                <p className="endoora-field__help">
                  {t.confirmationHelp}
                </p>
              </div>

              <div className={styles.actions}>
                <button
                  type="submit"
                  className="endoora-button endoora-button--secondary"
                  disabled={
                    deleteBusy ||
                    confirmation !== "DELETE"
                  }
                >
                  {deleteBusy
                    ? t.requestingDeletion
                    : t.requestDeletion}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </AuthShell>
  );
}
