"use client";

import { Button, Input } from "@endoora/ui";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./resources.module.css";
import { useTeacherHome } from "@/components/teacher/TeacherShell";
import {
  fetchTeacherMaterials,
  updateTeacherMaterial,
  batchMaterialAction,
} from "@/lib/teacheros-api";
import type { TeacherMaterial, MaterialType, MaterialStatus } from "@endoora/contracts";
import { MaterialExportModal } from "@/components/teacher/MaterialExportModal";
import { MaterialAdaptModal } from "@/components/teacher/MaterialAdaptModal";
import { MaterialScheduleModal } from "@/components/teacher/MaterialScheduleModal";
import { MaterialAssignModal } from "@/components/teacher/MaterialAssignModal";

export default function TeacherResourcesPage() {
  const { locale, activeClass, classesList } = useTeacherHome();
  const isFa = locale === "fa";

  const [materials, setMaterials] = useState<TeacherMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedClassId, setSelectedClassId] = useState<string>(activeClass?.id ?? "all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [pinnedOnly, setPinnedOnly] = useState(false);
  const [selectedCefr, setSelectedCefr] = useState<string>("all");
  const [selectedOrdering, setSelectedOrdering] = useState<string>("-updated_at");

  // Multi-selection & Batch Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchBusy, setBatchBusy] = useState(false);

  // Modal State for Preview & In-place Edit
  const [activeMaterial, setActiveMaterial] = useState<TeacherMaterial | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editTopic, setEditTopic] = useState("");
  const [editMarkdown, setEditMarkdown] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [assignMessage, setAssignMessage] = useState<string | null>(null);

  // Day 7 Action Modals State
  const [exportTarget, setExportTarget] = useState<TeacherMaterial | null>(null);
  const [adaptTarget, setAdaptTarget] = useState<TeacherMaterial | null>(null);
  const [assignTarget, setAssignTarget] = useState<TeacherMaterial | null>(null);
  const [scheduleTarget, setScheduleTarget] = useState<TeacherMaterial | null>(null);

  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => {
      fetchTeacherMaterials({
        material_type: selectedType !== "all" ? (selectedType as MaterialType) : undefined,
        class_id: selectedClassId !== "all" ? selectedClassId : undefined,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
        is_pinned: pinnedOnly ? true : undefined,
        search: searchTerm.trim() || undefined,
        cefr_level: selectedCefr !== "all" ? selectedCefr : undefined,
        ordering: selectedOrdering,
      })
        .then((data) => {
          if (mounted) {
            setMaterials(data);
            setLoading(false);
          }
        })
        .catch(() => {
          if (mounted) setLoading(false);
        });
    }, 250);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [searchTerm, selectedType, selectedClassId, selectedStatus, pinnedOnly, selectedCefr, selectedOrdering]);

  // Toggle Pinned
  const handleTogglePin = async (material: TeacherMaterial, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = await updateTeacherMaterial(material.id, {
        is_pinned: !material.is_pinned,
      });
      setMaterials((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    } catch (err) {
      console.error("Failed to pin material:", err);
    }
  };

  // Open Preview Modal
  const handleOpenPreview = (material: TeacherMaterial) => {
    setActiveMaterial(material);
    setEditTitle(material.title);
    setEditTopic(material.topic || "");
    setEditMarkdown(material.raw_markdown || "");
    setIsEditing(false);
  };

  // Save In-place Edit
  const handleSaveEdit = async () => {
    if (!activeMaterial) return;
    setSavingEdit(true);
    try {
      const updated = await updateTeacherMaterial(activeMaterial.id, {
        title: editTitle,
        topic: editTopic,
        raw_markdown: editMarkdown,
      });
      setMaterials((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      setActiveMaterial(updated);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update material:", err);
      alert(isFa ? "خطا در ذخیره ویرایش." : "Failed to save edits.");
    } finally {
      setSavingEdit(false);
    }
  };

  // Batch actions handler
  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(materials.map((m) => m.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleBatchAction = async (action: "pin" | "unpin" | "archive" | "delete") => {
    if (selectedIds.length === 0 || batchBusy) return;

    if (action === "delete") {
      const confirmDelete = window.confirm(
        isFa
          ? `آیا از حذف ${selectedIds.length} منبع انتخاب شده اطمینان دارید؟`
          : `Are you sure you want to delete ${selectedIds.length} selected items?`
      );
      if (!confirmDelete) return;
    }

    setBatchBusy(true);
    try {
      const res = await batchMaterialAction(action, selectedIds);
      if (action === "pin") {
        setMaterials((prev) =>
          prev.map((m) => (selectedIds.includes(m.id) ? { ...m, is_pinned: true } : m))
        );
        setAssignMessage(
          isFa
            ? `📌 تعداد ${res.affected_count} منبع با موفقیت نشان شد.`
            : `📌 Pinned ${res.affected_count} items.`
        );
      } else if (action === "unpin") {
        setMaterials((prev) =>
          prev.map((m) => (selectedIds.includes(m.id) ? { ...m, is_pinned: false } : m))
        );
        setAssignMessage(
          isFa
            ? `📍 نشان ${res.affected_count} منبع لغو گردید.`
            : `📍 Unpinned ${res.affected_count} items.`
        );
      } else if (action === "archive") {
        setMaterials((prev) =>
          prev.map((m) =>
            selectedIds.includes(m.id)
              ? { ...m, status: "archived" as MaterialStatus }
              : m
          )
        );
        setAssignMessage(
          isFa
            ? `🗄️ تعداد ${res.affected_count} منبع بایگانی شد.`
            : `🗄️ Archived ${res.affected_count} items.`
        );
      } else if (action === "delete") {
        setMaterials((prev) => prev.filter((m) => !selectedIds.includes(m.id)));
        setAssignMessage(
          isFa
            ? `🗑️ تعداد ${res.affected_count} منبع حذف گردید.`
            : `🗑️ Deleted ${res.affected_count} items.`
        );
      }
      setSelectedIds([]);
      setTimeout(() => setAssignMessage(null), 4000);
    } catch (err) {
      console.error("Batch action failed:", err);
      alert(isFa ? "خطا در اجرای عملیات گروهی." : "Failed to execute batch action.");
    } finally {
      setBatchBusy(false);
    }
  };

  // Stats calculation
  const totalCount = materials.length;
  const approvedCount = materials.filter((m) => m.status === "approved").length;
  const pinnedCount = materials.filter((m) => m.is_pinned).length;
  const assessmentCount = materials.filter((m) => m.material_type === "assessment" || m.material_type === "worksheet").length;

  const getTypeBadgeClass = (type: MaterialType) => {
    switch (type) {
      case "lesson":
        return styles.badgeLesson;
      case "activity":
        return styles.badgeActivity;
      case "worksheet":
        return styles.badgeWorksheet;
      case "assessment":
        return styles.badgeAssessment;
      default:
        return styles.badgeLesson;
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Header Card & Stats */}
      <div className={styles.headerCard}>
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, margin: "0 0 6px" }}>
            {isFa ? "کتابخانه و منابع آموزشی مدرس" : "Teacher Library & Resource Hub"}
          </h1>
          <p style={{ margin: 0, color: "var(--color-muted)", fontSize: "0.92rem" }}>
            {isFa
              ? "مدیریت، جستجوی آنی، ویرایش و خروجی Word/PDF کلیه طرح درس‌ها، فعالیت‌ها، کاربرگ‌ها و کوییزها"
              : "Search, organize, edit, differentiate, and export all generated lessons, worksheets, and quizzes"}
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <div className={styles.statRow}>
            <div className={styles.statChip}>
              <span>{isFa ? "کل منابع:" : "Total:"}</span>
              <strong>{totalCount}</strong>
            </div>
            <div className={styles.statChip}>
              <span>{isFa ? "تأییدشده:" : "Approved:"}</span>
              <strong style={{ color: "#10b981" }}>{approvedCount}</strong>
            </div>
            <div className={styles.statChip}>
              <span>{isFa ? "نشان‌شده:" : "Pinned:"}</span>
              <strong style={{ color: "#fbbf24" }}>{pinnedCount}</strong>
            </div>
            <div className={styles.statChip}>
              <span>{isFa ? "کاربرگ و آزمون:" : "Practice & Tests:"}</span>
              <strong>{assessmentCount}</strong>
            </div>
          </div>
          <Link href="/teacher/planning" className={styles.quickCreateBtn}>
            ⚡ {isFa ? "تولید سریع محتوای جدید" : "Quick Create"}
          </Link>
        </div>
      </div>

      {assignMessage && (
        <div style={{ padding: "12px 16px", background: "rgba(16,185,129,0.1)", border: "1px solid #10b981", borderRadius: "8px", color: "#10b981", fontSize: "0.9rem", fontWeight: 600 }}>
          {assignMessage}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className={styles.filterCard}>
        {/* Type Pills */}
        <div className={styles.typeTabs}>
          <Button
            type="button"
            variant={selectedType === "all" ? "primary" : "secondary"}
            size="sm"
            className={styles.typeTab}
            data-active={selectedType === "all"}
            onClick={() => setSelectedType("all")}
          >
            {isFa ? "همه منابع" : "All Resources"}
          </Button>
          <Button
            type="button"
            variant={selectedType === "lesson" ? "primary" : "secondary"}
            size="sm"
            className={styles.typeTab}
            data-active={selectedType === "lesson"}
            onClick={() => setSelectedType("lesson")}
          >
            {isFa ? "📖 طرح درس‌ها (Lessons)" : "📖 Lessons"}
          </Button>
          <Button
            type="button"
            variant={selectedType === "activity" ? "primary" : "secondary"}
            size="sm"
            className={styles.typeTab}
            data-active={selectedType === "activity"}
            onClick={() => setSelectedType("activity")}
          >
            {isFa ? "🎭 فعالیت‌های کلاسی (Activities)" : "🎭 Activities"}
          </Button>
          <Button
            type="button"
            variant={selectedType === "worksheet" ? "primary" : "secondary"}
            size="sm"
            className={styles.typeTab}
            data-active={selectedType === "worksheet"}
            onClick={() => setSelectedType("worksheet")}
          >
            {isFa ? "📝 کاربرگ‌ها (Worksheets)" : "📝 Worksheets"}
          </Button>
          <Button
            type="button"
            variant={selectedType === "assessment" ? "primary" : "secondary"}
            size="sm"
            className={styles.typeTab}
            data-active={selectedType === "assessment"}
            onClick={() => setSelectedType("assessment")}
          >
            {isFa ? "📊 کوییز و ارزیابی (Assessments)" : "📊 Quizzes & Tests"}
          </Button>
        </div>

        {/* Search Row */}
        <div className={styles.searchRow}>
          <div className={styles.searchInputWrapper}>
            <Input
              type="text"
              className={styles.searchInput}
              placeholder={isFa ? "🔍 جستجوی آنی در عنوان، موضوع و محتوای درس..." : "🔍 Search title, topic, or content..."}
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className={styles.filterSelect}
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
          >
            <option value="all">{isFa ? "همه کلاس‌ها" : "All Classes"}</option>
            {classesList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.level})
              </option>
            ))}
          </select>

          <select
            className={styles.filterSelect}
            value={selectedCefr}
            onChange={(e) => setSelectedCefr(e.target.value)}
          >
            <option value="all">{isFa ? "همه سطوح CEFR" : "All CEFR Levels"}</option>
            <option value="A1">A1 - Beginner</option>
            <option value="A2">A2 - Elementary</option>
            <option value="B1">B1 - Intermediate</option>
            <option value="B2">B2 - Upper-Intermediate</option>
            <option value="C1">C1 - Advanced</option>
            <option value="C2">C2 - Mastery</option>
          </select>

          <select
            className={styles.filterSelect}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">{isFa ? "همه وضعیت‌ها" : "All Statuses"}</option>
            <option value="draft">{isFa ? "پیش‌نویس (Draft)" : "Draft"}</option>
            <option value="approved">{isFa ? "تأییدشده (Approved)" : "Approved"}</option>
            <option value="archived">{isFa ? "آرشیو (Archived)" : "Archived"}</option>
          </select>

          <select
            className={styles.filterSelect}
            value={selectedOrdering}
            onChange={(e) => setSelectedOrdering(e.target.value)}
          >
            <option value="-updated_at">{isFa ? "مرتب‌سازی: جدیدترین‌ها" : "Sort: Newest"}</option>
            <option value="updated_at">{isFa ? "مرتب‌سازی: قدیمی‌ترین‌ها" : "Sort: Oldest"}</option>
            <option value="title">{isFa ? "مرتب‌سازی: عنوان الفبایی" : "Sort: Title (A-Z)"}</option>
            <option value="-cefr_level">{isFa ? "مرتب‌سازی: سطح CEFR" : "Sort: CEFR Level"}</option>
          </select>

          <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.88rem", fontWeight: 600 }}>
            <Input type="checkbox" checked={pinnedOnly}
              onChange={(e) => setPinnedOnly(e.target.checked)}
            />
            <span>{isFa ? "⭐ فقط نشان‌شده‌ها" : "⭐ Pinned only"}</span>
          </label>

          {materials.length > 0 && (
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.88rem", fontWeight: 600 }}>
              <input
                type="checkbox"
                className={styles.cardSelectCheckbox}
                checked={selectedIds.length > 0 && selectedIds.length === materials.length}
                onChange={handleSelectAll}
              />
              <span>{isFa ? `انتخاب همه (${materials.length})` : `Select all (${materials.length})`}</span>
            </label>
          )}
        </div>
      </div>

      {/* Materials Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "48px", color: "var(--color-muted)" }}>
          {isFa ? "در حال فراخوانی منابع کتابخانه..." : "Loading library resources..."}
        </div>
      ) : materials.length > 0 ? (
        <div className={styles.materialsGrid}>
          {materials.map((m) => {
            const isSelected = selectedIds.includes(m.id);
            return (
              <div
                key={m.id}
                className={`${styles.materialCard} ${isSelected ? styles.cardSelected : ""}`}
                onClick={() => handleOpenPreview(m)}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.cardHeader}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="checkbox"
                      className={styles.cardSelectCheckbox}
                      checked={isSelected}
                      onClick={(e) => handleToggleSelect(m.id, e)}
                      onChange={() => {}}
                      title={isFa ? "انتخاب جهت عملیات گروهی" : "Select for batch action"}
                    />
                    <div className={styles.cardBadges}>
                      <span className={`${styles.badge} ${getTypeBadgeClass(m.material_type)}`}>
                        {m.material_type}
                      </span>
                      <span className={`${styles.badge} ${styles.badgeLevel}`}>
                        CEFR {m.cefr_level || "B1"}
                      </span>
                      {m.status === "approved" && (
                        <span className={`${styles.badge}`} style={{ background: "rgba(16,185,129,0.15)", color: "#10b981" }}>
                          ✓ {isFa ? "تأییدشده" : "Approved"}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="tertiary"
                    size="sm"
                    className={styles.starBtn}
                    data-pinned={m.is_pinned}
                    title={isFa ? "نشان کردن / علاقه‌مندی" : "Pin to favorites"}
                    onClick={(e: React.MouseEvent) => handleTogglePin(m, e)}
                  >
                    {m.is_pinned ? "★" : "☆"}
                  </Button>
                </div>

                <div>
                  <h3 className={styles.cardTitle}>{m.title}</h3>
                  {m.topic && <p className={styles.cardTopic}>{m.topic}</p>}
                </div>

                {m.raw_markdown && (
                  <div className={styles.cardSnippet}>{m.raw_markdown}</div>
                )}

                <div className={styles.cardFooter}>
                  <div style={{ fontSize: "0.78rem", color: "var(--color-muted)" }}>
                    {m.class_title || (isFa ? "عمومی" : "General")}
                  </div>

                  <div className={styles.cardActions}>
                    <Button
                      variant="secondary"
                      size="compact"
                      className={styles.actionBtn}
                      title={isFa ? "تخصیص به دانش‌آموزان کلاس" : "Assign to Class"}
                      onClick={(e) => {
                        e.stopPropagation();
                        setAssignTarget(m);
                      }}
                    >
                      📤
                    </Button>
                    <Button
                      variant="secondary"
                      size="compact"
                      className={styles.actionBtn}
                      title={isFa ? "درخواست یک تغییر (Adapt)" : "Request One Change (Adapt)"}
                      onClick={(e) => {
                        e.stopPropagation();
                        setAdaptTarget(m);
                      }}
                    >
                      🔄
                    </Button>
                    <Button
                      variant="secondary"
                      size="compact"
                      className={styles.actionBtn}
                      title={isFa ? "زمان‌بندی در تقویم کلاس" : "Schedule to Calendar"}
                      onClick={(e) => {
                        e.stopPropagation();
                        setScheduleTarget(m);
                      }}
                    >
                      📅
                    </Button>
                    <Button
                      variant="secondary"
                      size="compact"
                      className={styles.actionBtn}
                      title={isFa ? "خروجی Word / PDF" : "Export Word / PDF"}
                      onClick={(e) => {
                        e.stopPropagation();
                        setExportTarget(m);
                      }}
                    >
                      📄
                    </Button>
                    <Link
                      href="/teacher/tools"
                      className={styles.actionBtn}
                      title={isFa ? "تمایز آموزشی ۳ لایه" : "3-Tier Differentiation"}
                      onClick={(e) => e.stopPropagation()}
                    >
                      🎯
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📚</div>
          <h3 style={{ margin: "0 0 6px", fontSize: "1.2rem" }}>
            {isFa ? "هیچ منبعی یافت نشد" : "No materials found"}
          </h3>
          <p style={{ margin: "0 0 16px", color: "var(--color-muted)", fontSize: "0.92rem", maxWidth: "440px" }}>
            {isFa
              ? "با فیلترهای جاری منبعی در کتابخانه وجود ندارد. می‌توانید با موتورهای هوش مصنوعی طرح درس یا کاربرگ جدید تولید کنید."
              : "No materials match your current search filters. Generate new materials using the AI Studio."}
          </p>
          <Link href="/teacher/planning" className={styles.btnPrimary}>
            {isFa ? "⚡ تولید در استودیوی طرح درس" : "⚡ Generate in Planning Studio"}
          </Link>
        </div>
      )}

      {/* Preview & In-place Edit Modal */}
      {activeMaterial && (
        <div className={styles.modalOverlay} onClick={() => setActiveMaterial(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <span className={`${styles.badge} ${getTypeBadgeClass(activeMaterial.material_type)}`} style={{ marginRight: 8 }}>
                  {activeMaterial.material_type}
                </span>
                <span style={{ fontWeight: 800, fontSize: "1.1rem" }}>{activeMaterial.title}</span>
              </div>
              <Button
                type="button"
                variant="tertiary"
                size="sm"
                onClick={() => setActiveMaterial(null)}
                style={{ background: "transparent", border: "none", color: "var(--color-muted)", fontSize: "1.4rem", cursor: "pointer" }}
              >
                ✕
              </Button>
            </div>

            <div className={styles.modalBody}>
              {isEditing ? (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>{isFa ? "عنوان درس / منبع:" : "Title:"}</label>
                    <Input type="text" value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--radius-control)",
                        padding: "8px 12px",
                        color: "var(--color-text)",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>{isFa ? "موضوع و تمرکز:" : "Topic:"}</label>
                    <Input type="text" value={editTopic}
                      onChange={(e) => setEditTopic(e.target.value)}
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--radius-control)",
                        padding: "8px 12px",
                        color: "var(--color-text)",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>{isFa ? "متن کامل آموزشی (Markdown):" : "Raw Markdown Content:"}</label>
                    <textarea
                      rows={12}
                      value={editMarkdown}
                      onChange={(e) => setEditMarkdown(e.target.value)}
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--radius-control)",
                        padding: "12px",
                        color: "var(--color-text)",
                        fontFamily: "monospace",
                        fontSize: "0.9rem",
                        lineHeight: 1.6,
                      }}
                    />
                  </div>
                </>
              ) : (
                <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.7, fontSize: "0.95rem" }}>
                  {activeMaterial.raw_markdown || (isFa ? "متنی ثبت نشده است." : "No content available.")}
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    className={styles.actionBtn}
                    onClick={() => setIsEditing(false)}
                    disabled={savingEdit}
                  >
                    {isFa ? "انصراف" : "Cancel"}
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    className={styles.btnPrimary}
                    onClick={handleSaveEdit}
                    loading={savingEdit}
                    disabled={savingEdit}
                  >
                    {savingEdit ? (isFa ? "در حال ذخیره..." : "Saving...") : (isFa ? "💾 ذخیره تغییرات" : "💾 Save Changes")}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    className={styles.actionBtn}
                    onClick={() => setIsEditing(true)}
                  >
                    {isFa ? "✏️ ویرایش محتوا" : "✏️ Edit Content"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className={styles.actionBtn}
                    onClick={() => setAdaptTarget(activeMaterial)}
                  >
                    {isFa ? "🔄 درخواست تغییر (Adapt)" : "🔄 Adapt"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className={styles.actionBtn}
                    onClick={() => setScheduleTarget(activeMaterial)}
                  >
                    {isFa ? "📅 زمان‌بندی جلسه" : "📅 Schedule"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className={styles.actionBtn}
                    onClick={() => setExportTarget(activeMaterial)}
                  >
                    {isFa ? "📄 خروجی Word / PDF" : "📄 Export"}
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    className={styles.btnPrimary}
                    onClick={() => setAssignTarget(activeMaterial)}
                  >
                    {isFa ? "📤 تخصیص به کلاس" : "📤 Assign"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Day 7 Modals */}
      <MaterialExportModal
        isOpen={Boolean(exportTarget)}
        onClose={() => setExportTarget(null)}
        material={exportTarget}
        locale={locale}
      />

      <MaterialAdaptModal
        isOpen={Boolean(adaptTarget)}
        onClose={() => setAdaptTarget(null)}
        material={adaptTarget}
        locale={locale}
        onAdapted={(newMat) => {
          setMaterials((prev) => [newMat, ...prev]);
          setAssignMessage(
            isFa
              ? "✨ نسخه جدید بهینه‌سازی‌شده ایجاد شد."
              : "✨ New adapted version created."
          );
          setTimeout(() => setAssignMessage(null), 4000);
        }}
      />

      <MaterialScheduleModal
        isOpen={Boolean(scheduleTarget)}
        onClose={() => setScheduleTarget(null)}
        material={scheduleTarget}
        activeClass={activeClass}
        locale={locale}
      />

      <MaterialAssignModal
        isOpen={Boolean(assignTarget)}
        onClose={() => setAssignTarget(null)}
        material={assignTarget}
        activeClass={activeClass}
        classes={classesList}
        locale={locale}
        onAssigned={() => {
          if (assignTarget) {
            setMaterials((prev) =>
              prev.map((m) =>
                m.id === assignTarget.id ? { ...m, status: "approved" as MaterialStatus } : m
              )
            );
          }
          setAssignMessage(
            isFa
              ? "👥 محتوا با موفقیت به زبان‌آموزان تخصیص یافت."
              : "👥 Material successfully assigned to class."
          );
          setTimeout(() => setAssignMessage(null), 4000);
        }}
      />

      {/* Floating Batch Action Bar */}
      {selectedIds.length > 0 && (
        <div className={styles.batchBar}>
          <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
            {isFa
              ? `${selectedIds.length} منبع آموزشی انتخاب شده:`
              : `${selectedIds.length} resources selected:`}
          </div>
          <div className={styles.batchActionsGroup}>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={batchBusy}
              onClick={() => handleBatchAction("pin")}
            >
              📌 {isFa ? "سنجاق کردن همه" : "Pin All"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={batchBusy}
              onClick={() => handleBatchAction("unpin")}
            >
              📍 {isFa ? "لغو سنجاق" : "Unpin All"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={batchBusy}
              onClick={() => handleBatchAction("archive")}
            >
              🗄️ {isFa ? "بایگانی گروهی" : "Archive All"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={batchBusy}
              onClick={() => handleBatchAction("delete")}
              style={{ color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.4)" }}
            >
              🗑️ {isFa ? "حذف گروهی" : "Delete All"}
            </Button>
            <Button
              type="button"
              variant="tertiary"
              size="sm"
              onClick={() => setSelectedIds([])}
            >
              ✕ {isFa ? "انصراف" : "Clear"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
