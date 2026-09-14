'use client';

import React, { useEffect, useState, useTransition } from "react";
import styles from "./ielts-content.module.css";
import {
  fetchAdminIELTSTests,
  fetchAdminIELTSTestDetail,
  submitTestForReview,
  approveIELTSTest,
  publishIELTSTest,
  cloneIELTSTestVersion,
  fetchBandDescriptors,
  IELTSTestListItem,
  IELTSTestDetail,
  IELTSSection,
  IELTSBandDescriptor,
  QualityChecklistState,
  MANDATORY_IELTS_DISCLAIMER_TEXT,
} from "../../../lib/ielts";

export default function AdminIELTSContentPage() {
  const [isPending, startTransition] = useTransition();

  // Test lists & filters
  const [tests, setTests] = useState<IELTSTestListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Selected test detail & Inspector
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [testDetail, setTestDetail] = useState<IELTSTestDetail | null>(null);
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showAnswerKeys, setShowAnswerKeys] = useState(true);

  // Band Descriptors state
  const [descriptors, setDescriptors] = useState<IELTSBandDescriptor[]>([]);
  const [showDescriptorsTab, setShowDescriptorsTab] = useState(false);

  // Review Modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewChecklist, setReviewChecklist] = useState<QualityChecklistState>({
    zero_copyright_infringement: false,
    cefr_calibrated: false,
    answer_key_verified: false,
    audio_script_verified: false,
    typo_and_formatting_checked: false,
  });
  const [reviewModalError, setReviewModalError] = useState<string | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Publish Modal state
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishModalError, setPublishModalError] = useState<string | null>(null);

  // Load Tests
  const loadTests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminIELTSTests({
        status: statusFilter,
        test_type: typeFilter,
      });
      setTests(data);
      if (data.length > 0 && !selectedTestId) {
        setSelectedTestId(data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در دریافت لیست آزمون‌های آیلتس.");
    } finally {
      setLoading(false);
    }
  };

  // Load Selected Test Detail
  const loadDetail = async (id: string) => {
    setLoadingDetail(true);
    try {
      const detail = await fetchAdminIELTSTestDetail(id);
      setTestDetail(detail);
      setActiveSectionIndex(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در دریافت جزئیات آزمون.");
    } finally {
      setLoadingDetail(false);
    }
  };

  // Load Band Descriptors
  const loadDescriptors = async () => {
    try {
      const data = await fetchBandDescriptors();
      setDescriptors(data);
    } catch {
      // Non-blocking for primary test explorer
    }
  };

  useEffect(() => {
    loadTests();
    loadDescriptors();
  }, [typeFilter, statusFilter]);

  useEffect(() => {
    if (selectedTestId) {
      loadDetail(selectedTestId);
    }
  }, [selectedTestId]);

  // Handle Submit for Review
  const handleSubmitForReview = async (testId: string) => {
    setError(null);
    setSuccessMsg(null);
    try {
      const updated = await submitTestForReview(testId);
      setTestDetail(updated);
      setSuccessMsg("آزمون با موفقیت برای بازبینی مستقل ارسال شد (وضعیت In Review).");
      loadTests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ارسال آزمون برای بازبینی.");
    }
  };

  // Handle Review & Approve
  const handleApprove = async () => {
    if (!testDetail) return;
    setReviewModalError(null);
    setSubmittingReview(true);
    try {
      const updated = await approveIELTSTest(testDetail.id, {
        checklist: reviewChecklist,
        notes: reviewNotes,
      });
      setTestDetail(updated);
      setShowReviewModal(false);
      setSuccessMsg("آزمون با موفقیت بازبینی و تأیید شد (وضعیت Approved). اکنون آماده انتشار است.");
      loadTests();
    } catch (err) {
      setReviewModalError(err instanceof Error ? err.message : "خطا در ثبت تأییدیه بازبینی.");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Handle Publish Test
  const handlePublish = async () => {
    if (!testDetail) return;
    setPublishModalError(null);
    setPublishing(true);
    try {
      const updated = await publishIELTSTest(testDetail.id);
      setTestDetail(updated);
      setShowPublishModal(false);
      setSuccessMsg("آزمون منتشر شد و محتوای آن برای حفاظت از آزمون‌های زبان‌آموزان قفل گردید (Locked).");
      loadTests();
    } catch (err) {
      setPublishModalError(err instanceof Error ? err.message : "خطا در انتشار آزمون.");
    } finally {
      setPublishing(false);
    }
  };

  // Handle Clone New Version
  const handleCloneVersion = async (testId: string) => {
    setError(null);
    setSuccessMsg(null);
    try {
      const cloned = await cloneIELTSTestVersion(testId);
      setSuccessMsg(`نسخه جدید (نسخه ${cloned.version}) با موفقیت ایجاد شد و در وضعیت پیش‌نویس قرار گرفت.`);
      setSelectedTestId(cloned.id);
      loadTests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ایجاد نسخه جدید آزمون.");
    }
  };

  const currentSection: IELTSSection | undefined = testDetail?.sections?.[activeSectionIndex];

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <header className={styles.header}>
        <div className={styles.headerTitles}>
          <div className={styles.headerBadgeRow}>
            <span className={styles.disclaimerBadge}>قوانین سخت‌گیرانه اصالت</span>
            <span className={styles.disclaimerBadge}>Two-Person Review Gate</span>
          </div>
          <h1 className={styles.title}>استودیو طراحی و کنترل کیفی محتوای آیلتس</h1>
          <p className={styles.subtitle}>
            بانک سوالات شبیه‌ساز، بازبینی دونفره مستقل، کالیبراسیون استاندارد CEFR، توصیف‌گرهای نمره باند و
            قفل نسخه‌ها برای تضمین اصالت و عدم نقض کپی‌رایت.
          </p>
        </div>

        <div className={styles.filterGroup}>
          <button
            type="button"
            className={`${styles.filterButton} ${showDescriptorsTab ? styles.filterButtonActive : ""}`}
            onClick={() => setShowDescriptorsTab(!showDescriptorsTab)}
          >
            {showDescriptorsTab ? "بازگشت به آزمون‌ها" : "راهنمای نمره باند آیلتس (Band Descriptors)"}
          </button>
        </div>
      </header>

      {/* Mandatory Official Trademark Disclaimer Banner */}
      <aside className={styles.disclaimerBanner} role="note">
        <span className={styles.disclaimerBadge}>سلب مسئولیت قانونی</span>
        <div>
          <strong>{MANDATORY_IELTS_DISCLAIMER_TEXT}</strong>
          <div>
            محتوای این بخش ۱۰۰٪ توسط هیئت علمی اندورا تألیف شده و مستقل از مراجع رسمی آیلتس (Cambridge / British Council / IDP) می‌باشد.
          </div>
        </div>
      </aside>

      {/* Alert Banners */}
      {error && <div className={styles.alertError}>{error}</div>}
      {successMsg && <div className={styles.alertSuccess}>{successMsg}</div>}

      {showDescriptorsTab ? (
        /* Band Descriptors View */
        <section className={styles.card} aria-label="Band Descriptors">
          <div className={styles.inspectorHeader} style={{ padding: "var(--space-4)" }}>
            <h2 className={styles.passageTitle}>توصیف‌گرهای رسمی نمره باند آیلتس (Public Band Descriptors)</h2>
            <p className={styles.instructionsText}>
              معیارهای عمومی ارزیابی مهارت‌های نوشتاری و گفتاری همراه با شاخص‌های تشریحی فارسی
            </p>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>مهارت</th>
                  <th>معیار ارزیابی</th>
                  <th>نمره باند</th>
                  <th>توصیف‌گر رسمی (English)</th>
                  <th>راهنمای آموزشی فارسی (Pedagogical Guidance)</th>
                </tr>
              </thead>
              <tbody>
                {descriptors.map((d) => (
                  <tr key={d.id} className={styles.tableRow}>
                    <td><strong>{d.section_type.toUpperCase()}</strong></td>
                    <td>{d.criteria_key_display}</td>
                    <td><span className={styles.badgeVersion}>Band {d.band_level}</span></td>
                    <td style={{ direction: "ltr", textAlign: "left", fontSize: "var(--font-size-xs)" }}>
                      {d.public_descriptor_en}
                    </td>
                    <td style={{ fontSize: "var(--font-size-xs)" }}>{d.pedagogical_guidance_fa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        /* Main Tests Explorer & Inspector */
        <>
          {/* Controls & Filter Bar */}
          <div className={styles.controlsBar}>
            <div className={styles.filterGroup}>
              <span style={{ fontSize: "var(--font-size-sm)", fontWeight: 700 }}>نوع آزمون:</span>
              <button
                type="button"
                className={`${styles.filterButton} ${typeFilter === "all" ? styles.filterButtonActive : ""}`}
                onClick={() => setTypeFilter("all")}
              >
                همه
              </button>
              <button
                type="button"
                className={`${styles.filterButton} ${typeFilter === "academic" ? styles.filterButtonActive : ""}`}
                onClick={() => setTypeFilter("academic")}
              >
                Academic
              </button>
              <button
                type="button"
                className={`${styles.filterButton} ${typeFilter === "general_training" ? styles.filterButtonActive : ""}`}
                onClick={() => setTypeFilter("general_training")}
              >
                General Training
              </button>
            </div>

            <div className={styles.filterGroup}>
              <span style={{ fontSize: "var(--font-size-sm)", fontWeight: 700 }}>وضعیت انتشار:</span>
              <select
                className={styles.selectInput}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="draft">پیش‌نویس (Draft)</option>
                <option value="in_review">در حال بازبینی (In Review)</option>
                <option value="approved">تأیید شده (Approved)</option>
                <option value="published">منتشر شده (Published)</option>
              </select>
            </div>
          </div>

          {/* Test Catalog Table */}
          <section className={styles.card} aria-label="IELTS Tests Repository">
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>عنوان آزمون</th>
                    <th>نوع آزمون</th>
                    <th>نسخه</th>
                    <th>وضعیت</th>
                    <th>طراح / مؤلف</th>
                    <th>بازبین مستقل</th>
                    <th>بخش‌ها / سوالات</th>
                    <th>مدت (دقیقه)</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: "center", padding: "var(--space-6)" }}>
                        در حال بارگذاری مخزن آزمون‌های آیلتس...
                      </td>
                    </tr>
                  ) : tests.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: "center", padding: "var(--space-6)" }}>
                        هیچ آزمونی با فیلترهای انتخابی یافت نشد.
                      </td>
                    </tr>
                  ) : (
                    tests.map((t) => (
                      <tr
                        key={t.id}
                        className={`${styles.tableRow} ${selectedTestId === t.id ? styles.tableRowSelected : ""}`}
                      >
                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <strong>{t.title_fa}</strong>
                            <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)", direction: "ltr", textAlign: "right" }}>
                              {t.title_en}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className={styles.badge}>
                            {t.test_type === "academic" ? "آکادمیک" : "جنرال ترینینگ"}
                          </span>
                        </td>
                        <td>
                          <span className={styles.badgeVersion}>v{t.version}</span>
                        </td>
                        <td>
                          {t.status === "draft" && <span className={`${styles.badge} ${styles.badgeDraft}`}>پیش‌نویس</span>}
                          {t.status === "in_review" && <span className={`${styles.badge} ${styles.badgeInReview}`}>در بازبینی</span>}
                          {t.status === "approved" && <span className={`${styles.badge} ${styles.badgeApproved}`}>تأیید شده</span>}
                          {t.status === "published" && (
                            <span className={`${styles.badge} ${styles.badgePublished}`}>
                              منتشر شده {t.is_locked ? "🔒" : ""}
                            </span>
                          )}
                        </td>
                        <td>{t.author_name}</td>
                        <td>
                          {t.reviewed_by ? (
                            <span style={{ color: "var(--color-success-text)", fontWeight: 600 }}>{t.reviewer_name}</span>
                          ) : (
                            <span style={{ color: "var(--color-text-secondary)" }}>—</span>
                          )}
                        </td>
                        <td>{t.sections_count} بخش ({t.total_questions} سوال)</td>
                        <td>{t.total_duration_minutes} دقیقه</td>
                        <td>
                          <button
                            type="button"
                            className={styles.actionButtonSecondary}
                            onClick={() => setSelectedTestId(t.id)}
                          >
                            مشاهده و بازبینی
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Test Detail & Question Inspector */}
          {testDetail && (
            <section className={styles.inspectorPane} aria-label="Test Inspector">
              <div className={styles.inspectorHeader}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBlockEnd: "var(--space-1)" }}>
                    <span className={styles.badgeVersion}>نسخه {testDetail.version}</span>
                    {testDetail.is_locked && <span className={`${styles.badge} ${styles.badgeLocked}`}>قفل شده (Immutable)</span>}
                    <span className={styles.groupTypeBadge}>{testDetail.difficulty_level}</span>
                  </div>
                  <h2 className={styles.title} style={{ fontSize: "var(--font-size-2xl)" }}>{testDetail.title_fa}</h2>
                  <p style={{ margin: 0, direction: "ltr", textAlign: "right", color: "var(--color-text-secondary)" }}>
                    {testDetail.title_en}
                  </p>
                </div>

                {/* Workflow Action Buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className={styles.actionButtonSecondary}
                    onClick={() => setShowAnswerKeys(!showAnswerKeys)}
                  >
                    {showAnswerKeys ? "مخفی‌سازی کلید پاسخ" : "نمایش کلید پاسخ"}
                  </button>

                  {testDetail.status === "draft" && (
                    <button
                      type="button"
                      className={styles.actionButtonPrimary}
                      onClick={() => handleSubmitForReview(testDetail.id)}
                    >
                      ارسال به صف بازبینی
                    </button>
                  )}

                  {testDetail.status === "in_review" && (
                    <button
                      type="button"
                      className={styles.actionButtonPrimary}
                      style={{ background: "var(--color-info-text)" }}
                      onClick={() => {
                        setReviewNotes(testDetail.review_notes || "");
                        setReviewModalError(null);
                        setShowReviewModal(true);
                      }}
                    >
                      تأیید کیفی بازبین (Review Gate)
                    </button>
                  )}

                  {testDetail.status === "approved" && (
                    <button
                      type="button"
                      className={styles.actionButtonPrimary}
                      style={{ background: "var(--color-success-text)" }}
                      onClick={() => {
                        setPublishModalError(null);
                        setShowPublishModal(true);
                      }}
                    >
                      انتشار و قفل نهایی
                    </button>
                  )}

                  {testDetail.is_locked && (
                    <button
                      type="button"
                      className={styles.actionButtonSecondary}
                      onClick={() => handleCloneVersion(testDetail.id)}
                    >
                      ایجاد نسخه جدید (Clone v+{testDetail.version + 1})
                    </button>
                  )}
                </div>
              </div>

              {/* Provenance and Legal Check Banner */}
              <div style={{ fontSize: "var(--font-size-xs)", background: "var(--color-surface-hover)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
                <strong>شناسنامه مالکیت معنوی و اصالت:</strong> {testDetail.copyright_source}
              </div>

              {/* Section Tabs */}
              <div className={styles.sectionTabs}>
                {testDetail.sections.map((sec, idx) => (
                  <button
                    key={sec.id}
                    type="button"
                    className={`${styles.sectionTabButton} ${activeSectionIndex === idx ? styles.sectionTabButtonActive : ""}`}
                    onClick={() => setActiveSectionIndex(idx)}
                  >
                    <span>بخش {sec.order}:</span>
                    <span>{sec.section_type_display}</span>
                    <span style={{ fontSize: "var(--font-size-xs)", opacity: 0.8 }}>({sec.duration_minutes} دقیقه)</span>
                  </button>
                ))}
              </div>

              {/* Current Section Content & Questions */}
              {loadingDetail ? (
                <div style={{ textAlign: "center", padding: "var(--space-6)" }}>در حال دریافت اطلاعات بخش...</div>
              ) : !currentSection ? (
                <div>هیچ بخشی برای این آزمون ثبت نشده است.</div>
              ) : (
                <div className={styles.previewArea}>
                  {/* Audio Script for Listening or Speaking */}
                  {(currentSection.section_type === "listening" || currentSection.section_type === "speaking") && (
                    <div className={styles.audioCard}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <strong>Audio Track Placeholder:</strong>
                        <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                          {currentSection.audio_media_url || "No audio URL configured"}
                        </span>
                      </div>
                      {currentSection.audio_script && (
                        <div>
                          <strong style={{ fontSize: "var(--font-size-xs)" }}>Full Audio Transcript / Script:</strong>
                          <div className={styles.audioScriptBox}>{currentSection.audio_script}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Passages and Question Groups */}
                  {currentSection.passages_tasks.map((pt) => (
                    <div
                      key={pt.id}
                      className={
                        currentSection.section_type === "reading"
                          ? styles.previewAreaSplit
                          : styles.previewArea
                      }
                    >
                      {/* Passage / Prompt Text */}
                      <div className={styles.passageBox}>
                        <h3 className={styles.passageTitle}>{pt.title}</h3>
                        {pt.word_count > 0 && (
                          <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                            Word Count: {pt.word_count} words
                          </span>
                        )}
                        {pt.media_image_url && (
                          <div style={{ padding: "var(--space-3)", background: "var(--color-surface)", border: "1px dashed var(--color-border)", textAlign: "center", borderRadius: "var(--radius-md)" }}>
                            [Diagram / Chart Placeholder: {pt.media_image_url}]
                          </div>
                        )}
                        <div className={styles.passageText}>{pt.content_text}</div>
                      </div>

                      {/* Question Groups */}
                      <div className={styles.questionsContainer}>
                        {pt.question_groups.map((group) => (
                          <div key={group.id} className={styles.questionGroupCard}>
                            <div className={styles.questionGroupHeader}>
                              <span className={styles.groupTypeBadge}>{group.question_type_display}</span>
                              <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                                گروه {group.order}
                              </span>
                            </div>
                            <p className={styles.instructionsText}>{group.instructions}</p>

                            {/* Headings Bank for Matching Headings */}
                            {Array.isArray(group.heading_options) && group.heading_options.length > 0 && (
                              <div className={styles.headingsBox}>
                                <strong>List of Headings / Options:</strong>
                                <ul style={{ margin: "var(--space-1) 0 0", paddingInlineStart: "var(--space-4)" }}>
                                  {group.heading_options.map((h, i) => (
                                    <li key={i}>
                                      {typeof h === "object" ? `${h.id}: ${h.text}` : String(h)}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Individual Questions */}
                            {group.questions.map((q) => (
                              <div key={q.id} className={styles.questionItem}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                  <span className={styles.questionPrompt}>
                                    Question {q.question_number}: {q.prompt_text}
                                  </span>
                                  <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                                    {q.max_score} نمره
                                  </span>
                                </div>

                                {/* Options if Multiple Choice */}
                                {Array.isArray(q.options) && q.options.length > 0 && (
                                  <div className={styles.optionsList}>
                                    {q.options.map((opt) => (
                                      <div key={opt.id}>
                                        <strong>{opt.id}.</strong> {opt.text}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Answer Key & Explanation */}
                                {showAnswerKeys && (
                                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
                                    {Array.isArray(q.correct_answers) && q.correct_answers.length > 0 && (
                                      <div>
                                        <span className={styles.correctAnswerTag}>
                                          ✓ کلید صحیح: {q.correct_answers.join(" | ")}
                                        </span>
                                      </div>
                                    )}
                                    {q.explanation && (
                                      <div className={styles.explanationBox}>
                                        <strong>تحلیل و استناد:</strong> {q.explanation}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </>
      )}

      {/* Review Gate Modal */}
      {showReviewModal && testDetail && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>تأیید کیفی و بازبینی دونفره (Two-Person Review Gate)</h3>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setShowReviewModal(false)}
              >
                ✕
              </button>
            </div>

            {reviewModalError && <div className={styles.alertError}>{reviewModalError}</div>}

            <div style={{ fontSize: "var(--font-size-sm)", background: "var(--color-surface-hover)", padding: "var(--space-3)", borderRadius: "var(--radius-md)" }}>
              <div><strong>طراح محتوا:</strong> {testDetail.author_name}</div>
              <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-xs)", marginBlockStart: "var(--space-1)" }}>
                توجه: بر اساس قانون Four-Eyes، بازبین باید شخصی غیر از طراح آزمون باشد.
              </div>
            </div>

            <div className={styles.checklistGrid}>
              <label className={styles.checklistItem}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={reviewChecklist.zero_copyright_infringement}
                  onChange={(e) =>
                    setReviewChecklist({ ...reviewChecklist, zero_copyright_infringement: e.target.checked })
                  }
                />
                <div className={styles.checklistLabel}>
                  <strong>۱. اصالت ۱۰۰٪ محتوا و عدم نقض کپی‌رایت</strong>
                  <span className={styles.checklistHelp}>
                    تأیید عدم کپی‌برداری از متون کمبریج، بریتیش کانسیل یا IDP.
                  </span>
                </div>
              </label>

              <label className={styles.checklistItem}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={reviewChecklist.cefr_calibrated}
                  onChange={(e) =>
                    setReviewChecklist({ ...reviewChecklist, cefr_calibrated: e.target.checked })
                  }
                />
                <div className={styles.checklistLabel}>
                  <strong>۲. کالیبراسیون سطح دشواری بر اساس CEFR</strong>
                  <span className={styles.checklistHelp}>
                    انطباق پیچیدگی متون با سطوح B2 تا C1 استاندارد آیلتس.
                  </span>
                </div>
              </label>

              <label className={styles.checklistItem}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={reviewChecklist.answer_key_verified}
                  onChange={(e) =>
                    setReviewChecklist({ ...reviewChecklist, answer_key_verified: e.target.checked })
                  }
                />
                <div className={styles.checklistLabel}>
                  <strong>۳. راستی‌آزمایی کلید پاسخ و محدودیت تعداد واژه</strong>
                  <span className={styles.checklistHelp}>
                    بررسی املای بریتیش/امریکن و عدم وجود ابهام در گزینه‌ها.
                  </span>
                </div>
              </label>

              <label className={styles.checklistItem}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={reviewChecklist.audio_script_verified}
                  onChange={(e) =>
                    setReviewChecklist({ ...reviewChecklist, audio_script_verified: e.target.checked })
                  }
                />
                <div className={styles.checklistLabel}>
                  <strong>۴. وضوح فایل صوتی و اسکریپت لیسنینگ/اسپیکینگ</strong>
                  <span className={styles.checklistHelp}>
                    بررسی سرعت، لهجه و تطابق کلمه به کلمه صوت با اسکریپت.
                  </span>
                </div>
              </label>

              <label className={styles.checklistItem}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={reviewChecklist.typo_and_formatting_checked}
                  onChange={(e) =>
                    setReviewChecklist({ ...reviewChecklist, typo_and_formatting_checked: e.target.checked })
                  }
                />
                <div className={styles.checklistLabel}>
                  <strong>۵. کنترل تایپوگرافی، علائم نگارشی و ساختار ظاهری</strong>
                  <span className={styles.checklistHelp}>
                    عدم وجود غلط‌های املایی، فاصله‌گذاری غلط و خطاهای نشانه‌گذاری.
                  </span>
                </div>
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>یادداشت بازبین و مستندات تأیید:</label>
              <textarea
                className={styles.textarea}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="توضیحات و نکات کنترل کیفی..."
              />
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.actionButtonSecondary}
                onClick={() => setShowReviewModal(false)}
                disabled={submittingReview}
              >
                انصراف
              </button>
              <button
                type="button"
                className={styles.actionButtonPrimary}
                onClick={handleApprove}
                disabled={submittingReview}
              >
                {submittingReview ? "در حال ثبت تأییدیه..." : "تأیید رسمی و انتقال به Approved"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Confirmation Modal */}
      {showPublishModal && testDetail && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>انتشار نهایی و قفل آزمون</h3>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setShowPublishModal(false)}
              >
                ✕
              </button>
            </div>

            {publishModalError && <div className={styles.alertError}>{publishModalError}</div>}

            <div style={{ lineHeight: 1.7, fontSize: "var(--font-size-sm)" }}>
              <p>
                آیا از انتشار عمومی آزمون <strong>{testDetail.title_fa} (نسخه {testDetail.version})</strong> اطمینان دارید؟
              </p>
              <div style={{ background: "var(--color-warning-bg)", border: "1px solid var(--color-warning-border)", color: "var(--color-warning-text)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", marginBlock: "var(--space-3)" }}>
                <strong>هشدار تغییرناپذیری (Immutability):</strong> پس از انتشار، آزمون به صورت خودکار قفل خواهد شد (`is_locked=True`) و هرگونه تغییر بعدی نیازمند ایجاد نسخه جدید خواهد بود.
              </div>
              <div>
                <strong>سلب مسئولیت الزامی:</strong>
                <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)", marginBlockStart: "var(--space-1)" }}>
                  {testDetail.disclaimer_label}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.actionButtonSecondary}
                onClick={() => setShowPublishModal(false)}
                disabled={publishing}
              >
                انصراف
              </button>
              <button
                type="button"
                className={styles.actionButtonPrimary}
                style={{ background: "var(--color-success-text)" }}
                onClick={handlePublish}
                disabled={publishing}
              >
                {publishing ? "در حال انتشار و قفل..." : "تأیید و انتشار عمومی"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
