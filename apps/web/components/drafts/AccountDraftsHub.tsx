"use client";

import { useEffect, useState } from "react";
import {
  deleteLocalDraft,
  listLocalDrafts,
  LocalDraftRecord,
  saveLocalDraft,
  subscribeToDrafts,
  syncPendingDrafts,
} from "../../lib/offline-drafts";
import styles from "./drafts-hub.module.css";

export function AccountDraftsHub() {
  const [drafts, setDrafts] = useState<LocalDraftRecord[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setDrafts(listLocalDrafts());
    const unsub = subscribeToDrafts(() => {
      setDrafts(listLocalDrafts());
    });
    return unsub;
  }, []);

  const handleSyncAll = async () => {
    setIsSyncing(true);
    setFeedback(null);
    try {
      const res = await syncPendingDrafts();
      setFeedback(
        `همگام‌سازی تکمیل شد: ${res.synced} ارسال موفق، ${res.conflicts} تداخل، ${res.errors} خطا.`
      );
    } catch {
      setFeedback("خطا در برقراری ارتباط با سرور. لطفاً بعداً تلاش کنید.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCreateSampleDraft = () => {
    const newRecord = saveLocalDraft({
      title: `پیش‌نویس جدید ${new Date().toLocaleTimeString("fa-IR")}`,
      draft_type: "writing_submission",
      resource_id: `writing-${Date.now()}`,
      content_json: {
        paragraph1:
          "This is an offline-safe draft saved in local browser storage.",
        timestamp: new Date().toISOString(),
      },
    });
    setFeedback(`پیش‌نویس "${newRecord.title}" ایجاد شد.`);
  };

  const handleCopyContent = (draft: LocalDraftRecord) => {
    const text = JSON.stringify(draft.content_json, null, 2);
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setFeedback(`محتوای پیش‌نویس "${draft.title}" در حافظه کپی شد.`);
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`آیا از حذف پیش‌نویس "${title}" اطمینان دارید؟`)) {
      deleteLocalDraft(id);
      setFeedback(`پیش‌نویس "${title}" حذف شد.`);
    }
  };

  const pendingCount = drafts.filter(
    (d) => d.sync_status === "pending" || d.sync_status === "error"
  ).length;
  const conflictCount = drafts.filter((d) => d.sync_status === "conflict").length;
  const syncedCount = drafts.filter((d) => d.sync_status === "synced").length;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>پیش‌نویس‌های ذخیره‌شده و همگام‌سازی آفلاین</h1>
        <p className={styles.description}>
          در این بخش می‌توانید تمامی نوشته‌ها، پاسخ‌های تمرین و چک‌پوینت‌های آزمون را که
          در حالت آنلاین یا آفلاین ثبت شده‌اند مدیریت و با سرور همگام‌سازی کنید.
        </p>
      </header>

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{drafts.length}</div>
          <div className={styles.statLabel}>کل پیش‌نویس‌های محلی</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{pendingCount}</div>
          <div className={styles.statLabel}>در انتظار همگام‌سازی</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{conflictCount}</div>
          <div className={styles.statLabel}>تداخل همزمانی</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{syncedCount}</div>
          <div className={styles.statLabel}>همگام‌شده با سرور</div>
        </div>
      </section>

      <div className={styles.actionsBar}>
        <div style={{ display: "flex", gap: "var(--space-2, 8px)" }}>
          <button
            type="button"
            onClick={handleSyncAll}
            disabled={isSyncing || pendingCount === 0}
            className={styles.primaryButton}
          >
            {isSyncing ? "در حال همگام‌سازی..." : "🔄 همگام‌سازی همه با سرور"}
          </button>
          <button
            type="button"
            onClick={handleCreateSampleDraft}
            className={styles.secondaryButton}
          >
            ➕ ایجاد پیش‌نویس آزمایشی
          </button>
        </div>

        {feedback && (
          <span style={{ fontSize: "var(--font-size-xs, 12px)", color: "var(--color-primary, #0D9488)" }}>
            {feedback}
          </span>
        )}
      </div>

      <div className={styles.draftsList}>
        {drafts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📝</div>
            <div className={styles.emptyText}>
              در حال حاضر هیچ پیش‌نویس ذخیره‌شده‌ای در این مرورگر وجود ندارد.
            </div>
            <button
              type="button"
              onClick={handleCreateSampleDraft}
              className={styles.primaryButton}
            >
              ایجاد اولین پیش‌نویس آزمایشی
            </button>
          </div>
        ) : (
          drafts.map((d) => {
            const isConflict = d.sync_status === "conflict" || d.is_conflict;
            let badgeClass = styles.statusSynced;
            let badgeLabel = "همگام‌شده (Synced)";

            if (isConflict) {
              badgeClass = styles.statusConflict;
              badgeLabel = "تداخل نسخه (Conflict)";
            } else if (d.sync_status === "pending") {
              badgeClass = styles.statusPending;
              badgeLabel = "در انتظار ارسال (Pending)";
            } else if (d.sync_status === "error") {
              badgeClass = styles.statusConflict;
              badgeLabel = "خطای ارسال (Retry)";
            }

            return (
              <article
                key={d.id}
                className={`${styles.draftCard} ${isConflict ? styles.draftCardConflict : ""}`}
              >
                <div className={styles.draftCardHeader}>
                  <h2 className={styles.draftTitle}>{d.title}</h2>
                  <div className={styles.badgeGroup}>
                    <span className={styles.typeBadge}>{d.draft_type}</span>
                    <span className={`${styles.statusBadge} ${badgeClass}`}>
                      {badgeLabel}
                    </span>
                  </div>
                </div>

                <div className={styles.draftSnippet}>
                  {JSON.stringify(d.content_json, null, 2)}
                </div>

                <div className={styles.draftFooter}>
                  <span>
                    نسخه محلی: v{d.client_version} | آخرین تغییر:{" "}
                    {new Date(d.client_updated_at).toLocaleTimeString("fa-IR")}
                  </span>

                  <div className={styles.draftActions}>
                    <button
                      type="button"
                      onClick={() => handleCopyContent(d)}
                      className={styles.textButton}
                    >
                      کپی محتوا
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(d.id, d.title)}
                      className={styles.deleteButton}
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
