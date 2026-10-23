'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type {
  ClassroomSessionData,
  ClassroomLoggedError,
  ClassroomVocabItem,
  ErrorCategory,
} from "@endoora/contracts";
import {
  loadClassroomSession,
  saveClassroomSession,
  syncErrorToLeitner,
  syncVocabToBank,
  ERROR_CATEGORIES,
  getCategoryLabelFa,
} from "@/lib/classroom-studio-storage";
import { StudioVideoStage } from "./StudioVideoStage";
import { StudioSessionSummaryModal } from "./StudioSessionSummaryModal";
import styles from "./classroom-studio.module.css";

interface ClassroomStudioProps {
  bookingId: string;
  initialRole?: "teacher" | "learner";
}

export function ClassroomStudio({
  bookingId,
  initialRole = "learner",
}: ClassroomStudioProps) {
  const router = useRouter();

  const [session, setSession] = useState<ClassroomSessionData>(() =>
    loadClassroomSession(bookingId)
  );
  const [role, setRole] = useState<"teacher" | "learner">(initialRole);
  const [activeTab, setActiveTab] = useState<
    "errors" | "notes" | "agenda" | "vocab"
  >("errors");

  // Countdown timer state
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    (session.durationMinutes || 45) * 60
  );
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // Error input form state (for teacher)
  const [newErrorCat, setNewErrorCat] = useState<ErrorCategory>("grammar");
  const [newErrorLearner, setNewErrorLearner] = useState("");
  const [newErrorNative, setNewErrorNative] = useState("");
  const [newErrorExpl, setNewErrorExpl] = useState("");

  // Vocab input form state (for teacher)
  const [newVocabWord, setNewVocabWord] = useState("");
  const [newVocabIpa, setNewVocabIpa] = useState("");
  const [newVocabMeaning, setNewVocabMeaning] = useState("");
  const [newVocabExample, setNewVocabExample] = useState("");

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Persist session changes
  const updateSession = (updated: ClassroomSessionData) => {
    setSession(updated);
    saveClassroomSession(updated);
  };

  // Add a new error correction
  const handleAddError = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newErrorLearner.trim() || !newErrorNative.trim()) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    const newError: ClassroomLoggedError = {
      id: `err-${Date.now()}`,
      timestamp: timeStr,
      category: newErrorCat,
      categoryLabelFa: getCategoryLabelFa(newErrorCat),
      learnerSpoke: newErrorLearner.trim(),
      nativeCorrection: newErrorNative.trim(),
      explanationFa: newErrorExpl.trim() || "تصحیح ساختار کلامی توسط استاد.",
      syncedToLeitner: false,
    };

    const updated = {
      ...session,
      loggedErrors: [newError, ...session.loggedErrors],
    };
    updateSession(updated);

    // Reset form
    setNewErrorLearner("");
    setNewErrorNative("");
    setNewErrorExpl("");
  };

  // Sync a single error to Leitner
  const handleSyncError = (errorId: string) => {
    const target = session.loggedErrors.find((e) => e.id === errorId);
    if (!target) return;

    syncErrorToLeitner(target, {
      bookingId: session.bookingId,
      teacherName: session.teacherName,
    });

    const updatedErrors = session.loggedErrors.map((e) =>
      e.id === errorId ? { ...e, syncedToLeitner: true } : e
    );
    updateSession({
      ...session,
      loggedErrors: updatedErrors,
    });
  };

  // Add a new vocabulary item
  const handleAddVocab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVocabWord.trim() || !newVocabMeaning.trim()) return;

    const newVocab: ClassroomVocabItem = {
      id: `voc-${Date.now()}`,
      wordEn: newVocabWord.trim(),
      ipa: newVocabIpa.trim() || undefined,
      meaningFa: newVocabMeaning.trim(),
      exampleSentenceEn: newVocabExample.trim() || "",
      syncedToVocabBank: false,
    };

    const updated = {
      ...session,
      vocabItems: [newVocab, ...session.vocabItems],
    };
    updateSession(updated);

    setNewVocabWord("");
    setNewVocabIpa("");
    setNewVocabMeaning("");
    setNewVocabExample("");
  };

  // Sync vocab to bank
  const handleSyncVocab = (vocabId: string) => {
    const target = session.vocabItems.find((v) => v.id === vocabId);
    if (!target) return;

    syncVocabToBank(target);
    const updatedVocab = session.vocabItems.map((v) =>
      v.id === vocabId ? { ...v, syncedToVocabBank: true } : v
    );
    updateSession({
      ...session,
      vocabItems: updatedVocab,
    });
  };

  // Toggle Agenda Item
  const handleToggleAgenda = (agendaId: string) => {
    const updatedAgenda = session.agenda.map((a) =>
      a.id === agendaId ? { ...a, completed: !a.completed } : a
    );
    updateSession({
      ...session,
      agenda: updatedAgenda,
    });
  };

  // Update Notepad
  const handleNotesChange = (text: string) => {
    updateSession({
      ...session,
      notesMarkdown: text,
    });
  };

  const handleInsertNotepadSnippet = (snippet: string) => {
    const updated = `${session.notesMarkdown}\n\n${snippet}`;
    handleNotesChange(updated);
  };

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const isTimerCritical = secondsRemaining <= 300; // <= 5 minutes

  return (
    <div className={styles.studioContainer}>
      {/* Studio Top Bar */}
      <header className={styles.studioTopBar}>
        <div className={styles.sessionMeta}>
          <div className={styles.liveIndicator}>
            <span className={styles.liveDot} />
            <span>جلسه زنده</span>
          </div>
          <div>
            <h1 className={styles.sessionTitle}>
              {session.skillNameFa} با {session.teacherName.split("(")[0]}
            </h1>
            <p className={styles.sessionSubtitle}>
              کد رزرو جلسه: {session.bookingId.slice(0, 8)} • زبان‌آموز: {session.learnerName}
            </p>
          </div>
        </div>

        <div className={styles.topBarActions}>
          {/* Quick Perspective Toggle */}
          <div className={styles.roleToggleGroup} role="group" aria-label="انتخاب نقش">
            <button
              type="button"
              className={`${styles.roleToggleBtn} ${role === "teacher" ? styles.roleToggleBtnActive : ""}`}
              onClick={() => setRole("teacher")}
            >
              👨‍🏫 حالت استاد
            </button>
            <button
              type="button"
              className={`${styles.roleToggleBtn} ${role === "learner" ? styles.roleToggleBtnActive : ""}`}
              onClick={() => setRole("learner")}
            >
              🧑‍🎓 حالت زبان‌آموز
            </button>
          </div>

          {/* Countdown Clock */}
          <div
            className={`${styles.timerBadge} ${isTimerCritical ? styles.timerWarning : ""}`}
            title="زمان باقیمانده از جلسه"
          >
            <span>⏱️</span>
            <span>{formatTimer(secondsRemaining)}</span>
          </div>

          <button
            type="button"
            className={styles.endSessionBtn}
            onClick={() => setShowSummaryModal(true)}
          >
            🏁 پایان کلاس و صدور کارنامه
          </button>

          <Link href={`/bookings/${bookingId}`} className={styles.exitLink}>
            ✕ خروج موقت
          </Link>
        </div>
      </header>

      {/* Split-Screen Studio Main */}
      <main className={styles.studioMain}>
        {/* Left Pane: Dual Video Stage */}
        <StudioVideoStage
          teacherName={session.teacherName}
          learnerName={session.learnerName}
          role={role}
        />

        {/* Right Pane: Collaborative Teaching Workspace */}
        <section className={styles.rightPane} aria-label="میز کار آموزشی و یادداشت‌های جلسه">
          {/* Workspace Tabs */}
          <nav className={styles.workspaceTabs} aria-label="تب‌های میز کار">
            <button
              type="button"
              className={`${styles.workspaceTab} ${activeTab === "errors" ? styles.workspaceTabActive : ""}`}
              onClick={() => setActiveTab("errors")}
            >
              <span>❌ شکار اشتباهات و بازنویسی</span>
              <span
                className={`${styles.tabBadge} ${session.loggedErrors.length > 0 ? styles.tabBadgeAlert : ""}`}
              >
                {session.loggedErrors.length}
              </span>
            </button>

            <button
              type="button"
              className={`${styles.workspaceTab} ${activeTab === "notes" ? styles.workspaceTabActive : ""}`}
              onClick={() => setActiveTab("notes")}
            >
              <span>📝 تخته مشترک یادداشت</span>
            </button>

            <button
              type="button"
              className={`${styles.workspaceTab} ${activeTab === "agenda" ? styles.workspaceTabActive : ""}`}
              onClick={() => setActiveTab("agenda")}
            >
              <span>⏱️ برنامه و مراحل جلسه</span>
              <span className={styles.tabBadge}>
                {session.agenda.filter((a) => a.completed).length} / {session.agenda.length}
              </span>
            </button>

            <button
              type="button"
              className={`${styles.workspaceTab} ${activeTab === "vocab" ? styles.workspaceTabActive : ""}`}
              onClick={() => setActiveTab("vocab")}
            >
              <span>💎 واژگان طلایی (Vocab Catcher)</span>
              <span className={styles.tabBadge}>{session.vocabItems.length}</span>
            </button>
          </nav>

          {/* Workspace Content */}
          <div className={styles.workspaceContent}>
            {/* TAB 1: REAL-TIME ERROR LOGGER */}
            {activeTab === "errors" && (
              <div className={styles.errorLoggerSection}>
                {/* Form to log error (shown to teacher or for interactive testing) */}
                {role === "teacher" && (
                  <div className={styles.newErrorInputCard}>
                    <form onSubmit={handleAddError}>
                      <div className={styles.newErrorHeader}>
                        <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "#38bdf8" }}>
                          ➕ ثبت اشتباه کلامی و ارائه بازنویسی حرفه‌ای
                        </span>
                        <select
                          className={styles.categorySelect}
                          value={newErrorCat}
                          onChange={(e) => setNewErrorCat(e.target.value as ErrorCategory)}
                        >
                          {ERROR_CATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.labelFa}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className={styles.formGrid}>
                        <div className={styles.formField}>
                          <label className={styles.labelWrong}>❌ جمله‌ای که زبان‌آموز گفت:</label>
                          <input
                            type="text"
                            className={styles.studioInput}
                            placeholder="e.g. I am agree with you"
                            value={newErrorLearner}
                            onChange={(e) => setNewErrorLearner(e.target.value)}
                          />
                        </div>
                        <div className={styles.formField}>
                          <label className={styles.labelCorrect}>✅ بازنویسی استاندارد / بند ۸:</label>
                          <input
                            type="text"
                            className={styles.studioInput}
                            placeholder="e.g. I completely agree with you"
                            value={newErrorNative}
                            onChange={(e) => setNewErrorNative(e.target.value)}
                          />
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
                        <div style={{ flex: 1 }} className={styles.formField}>
                          <label style={{ color: "#94a3b8" }}>توضیح کوتاه و علت خطا (فارسی):</label>
                          <input
                            type="text"
                            className={`${styles.studioInput} ${styles.studioInputFa}`}
                            placeholder="علت خطای ساختاری یا تداخل زبان فارسی..."
                            value={newErrorExpl}
                            onChange={(e) => setNewErrorExpl(e.target.value)}
                          />
                        </div>
                        <button type="submit" className={styles.submitErrorBtn}>
                          ثبت روی تخته ←
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Logged Error Cards */}
                <div className={styles.errorCardList}>
                  {session.loggedErrors.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                      هنوز خطایی در این جلسه ثبت نشده است. هنگام صحبت زبان‌آموز، استاد می‌تواند
                      اشتباهات را برای اصلاح و انتقال به لایتنر ثبت نماید.
                    </div>
                  ) : (
                    session.loggedErrors.map((err) => {
                      const catMeta = ERROR_CATEGORIES.find((c) => c.id === err.category);
                      return (
                        <article key={err.id} className={styles.errorCard}>
                          <div className={styles.errorCardTop}>
                            <span
                              className={styles.errorBadge}
                              style={{ background: catMeta?.badgeColor || "#2563eb" }}
                            >
                              {err.categoryLabelFa}
                            </span>
                            <span className={styles.errorTimestamp}>⏱️ {err.timestamp}</span>
                          </div>

                          <div className={styles.comparisonBox}>
                            <div className={styles.compWrong}>
                              <span style={{ display: "block", fontSize: "0.75rem", color: "#f87171", fontWeight: 700, marginBottom: "2px" }}>
                                ❌ عبارت دارای خطا:
                              </span>
                              {err.learnerSpoke}
                            </div>
                            <div className={styles.compCorrect}>
                              <span style={{ display: "block", fontSize: "0.75rem", color: "#4ade80", fontWeight: 700, marginBottom: "2px" }}>
                                ✅ بازنویسی صحیح و طبیعی:
                              </span>
                              {err.nativeCorrection}
                            </div>
                          </div>

                          <div className={styles.errorExplanation}>
                            <strong>نکته استاد: </strong>
                            {err.explanationFa}
                          </div>

                          <div className={styles.errorCardActions}>
                            {err.syncedToLeitner ? (
                              <span className={styles.syncedBadge}>
                                ✓ در جعبه لایتنر شما ذخیره شد
                              </span>
                            ) : (
                              <button
                                type="button"
                                className={styles.syncLeitnerBtn}
                                onClick={() => handleSyncError(err.id)}
                              >
                                ⭐ ذخیره در جعبه لایتنر من
                              </button>
                            )}
                          </div>
                        </article>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: SHARED LESSON NOTEPAD */}
            {activeTab === "notes" && (
              <div className={styles.notepadContainer}>
                <div className={styles.notepadToolbar}>
                  <button
                    type="button"
                    className={styles.notepadToolBtn}
                    onClick={() =>
                      handleInsertNotepadSnippet(
                        "> **فرمول طلایی:** [توضیح نکته کلیدی استاد در این کادر قرار می‌گیرد]"
                      )
                    }
                  >
                    + کادر نکته طلایی
                  </button>
                  <button
                    type="button"
                    className={styles.notepadToolBtn}
                    onClick={() =>
                      handleInsertNotepadSnippet(
                        "### ساختار زمانی PPF در اسپیکینگ:\n* **گذشته (Past):** \n* **حال (Present):** \n* **آینده (Future):** "
                      )
                    }
                  >
                    + الگوی داستان‌سرایی PPF
                  </button>
                  <button
                    type="button"
                    className={styles.notepadToolBtn}
                    onClick={() =>
                      handleInsertNotepadSnippet(
                        "#### تمرین اصلاح تلفظ واج‌های /w/ و /v/:\n* `world` vs `voice`\n* `wet` vs `vet`\n* `wine` vs `vine`"
                      )
                    }
                  >
                    + جفت‌های مینیمال /w/ و /v/
                  </button>
                </div>

                <textarea
                  className={styles.notepadTextarea}
                  value={session.notesMarkdown}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  placeholder="یادداشت‌های مشترک تخته... هر تغییری به صورت خودکار برای هر دو طرف ذخیره می‌شود."
                />
              </div>
            )}

            {/* TAB 3: LESSON AGENDA */}
            {activeTab === "agenda" && (
              <div className={styles.agendaList}>
                <div style={{ marginBottom: "1rem" }}>
                  <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.1rem", color: "#38bdf8" }}>
                    طرح درس و مراحل زمان‌بندی‌شده جلسه
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8" }}>
                    با اتمام هر بخش از کلاس، تیک مربوطه را بزنید تا پیشرفت زمانی ثبت شود.
                  </p>
                </div>

                {session.agenda.map((item) => (
                  <label
                    key={item.id}
                    className={`${styles.agendaItem} ${item.completed ? styles.agendaItemCompleted : ""}`}
                  >
                    <input
                      type="checkbox"
                      className={styles.agendaCheckbox}
                      checked={item.completed}
                      onChange={() => handleToggleAgenda(item.id)}
                    />
                    <div className={styles.agendaText}>
                      <h4 className={styles.agendaTitle}>{item.titleFa}</h4>
                      <span className={styles.agendaDuration}>
                        زمان پیشنهادی: {item.durationMinutes} دقیقه
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* TAB 4: VOCAB CATCHER */}
            {activeTab === "vocab" && (
              <div>
                {/* Form to add vocab (shown to teacher) */}
                {role === "teacher" && (
                  <div className={styles.newErrorInputCard} style={{ marginBottom: "1.5rem" }}>
                    <form onSubmit={handleAddVocab}>
                      <h4 style={{ margin: "0 0 0.75rem 0", color: "#38bdf8" }}>
                        ➕ ثبت واژه یا اصطلاح طلایی جلسه
                      </h4>
                      <div className={styles.formGrid}>
                        <div className={styles.formField}>
                          <label style={{ color: "#38bdf8" }}>واژه انگلیسی (English Word / Idiom):</label>
                          <input
                            type="text"
                            className={styles.studioInput}
                            placeholder="e.g. watershed moment"
                            value={newVocabWord}
                            onChange={(e) => setNewVocabWord(e.target.value)}
                          />
                        </div>
                        <div className={styles.formField}>
                          <label style={{ color: "#94a3b8" }}>تلفظ فونتیک (IPA):</label>
                          <input
                            type="text"
                            className={styles.studioInput}
                            placeholder="e.g. /ˈwɔː.tə.ʃed ˈməʊ.mənt/"
                            value={newVocabIpa}
                            onChange={(e) => setNewVocabIpa(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className={styles.formGrid}>
                        <div className={styles.formField}>
                          <label style={{ color: "#cbd5e1" }}>معنی و کاربرد به فارسی:</label>
                          <input
                            type="text"
                            className={`${styles.studioInput} ${styles.studioInputFa}`}
                            placeholder="معنی دقیق فارسی..."
                            value={newVocabMeaning}
                            onChange={(e) => setNewVocabMeaning(e.target.value)}
                          />
                        </div>
                        <div className={styles.formField}>
                          <label style={{ color: "#94a3b8" }}>جمله مثال در بافت (Example Sentence):</label>
                          <input
                            type="text"
                            className={styles.studioInput}
                            placeholder="e.g. It was a watershed moment in my life."
                            value={newVocabExample}
                            onChange={(e) => setNewVocabExample(e.target.value)}
                          />
                        </div>
                      </div>

                      <div style={{ textAlign: "left", marginTop: "0.5rem" }}>
                        <button type="submit" className={styles.submitErrorBtn}>
                          افزودن به جعبه لغات جلسه ←
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Vocab Cards Grid */}
                <div className={styles.vocabGrid}>
                  {session.vocabItems.map((v) => (
                    <article key={v.id} className={styles.vocabCard}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <span className={styles.vocabWordEn}>{v.wordEn}</span>
                        {v.syncedToVocabBank ? (
                          <span style={{ color: "#22c55e", fontSize: "0.75rem", fontWeight: 700 }}>
                            ✓ در جعبه لغات شما
                          </span>
                        ) : (
                          <button
                            type="button"
                            className={styles.syncLeitnerBtn}
                            onClick={() => handleSyncVocab(v.id)}
                            style={{ padding: "0.2rem 0.5rem", fontSize: "0.7rem" }}
                          >
                            + ذخیره
                          </button>
                        )}
                      </div>
                      {v.ipa && <div className={styles.vocabIpa}>{v.ipa}</div>}
                      <div className={styles.vocabMeaningFa}>{v.meaningFa}</div>
                      {v.exampleSentenceEn && (
                        <div className={styles.vocabExampleEn}>"{v.exampleSentenceEn}"</div>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Post-Session Summary Modal */}
      {showSummaryModal && (
        <StudioSessionSummaryModal
          session={session}
          onClose={() => setShowSummaryModal(false)}
          onUpdateSession={updateSession}
        />
      )}
    </div>
  );
}
