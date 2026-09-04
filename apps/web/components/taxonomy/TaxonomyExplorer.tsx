"use client";

import { useEffect, useState, useTransition } from "react";
import styles from "./taxonomy.module.css";

export type TaxonomyNodeItem = {
  id: string;
  slug: string;
  kind: string;
  label_fa: string;
  label_en: string;
  display_label: string;
  description_fa: string;
  description_en: string;
  display_description: string;
  cefr_level: string;
  descriptor_reference: string;
  source_name: string;
  source_url: string;
  license_note: string;
  estimated_effort_minutes: number | null;
  status: "active" | "deprecated";
  parent: { id: string; slug: string; label_fa: string; label_en: string } | null;
  replacement: { id: string; slug: string; label_fa: string; label_en: string } | null;
  prerequisites: Array<{ id: string; slug: string; label_fa: string; label_en: string }>;
  sort_order: number;
};

export type TaxonomyMeta = {
  default_language: string;
  available_languages: string[];
  cefr_levels: string[];
  kinds: string[];
  active_counts: Record<string, number>;
  latest_release: string | null;
};

export function TaxonomyExplorer({ initialLocale = "fa" }: { initialLocale?: "fa" | "en" }) {
  const [locale, setLocale] = useState<"fa" | "en">(initialLocale);
  const [nodes, setNodes] = useState<TaxonomyNodeItem[]>([]);
  const [meta, setMeta] = useState<TaxonomyMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedKind, setSelectedKind] = useState<string>("all");
  const [selectedCefr, setSelectedCefr] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [includeDeprecated, setIncludeDeprecated] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [, startTransition] = useTransition();

  const isFa = locale === "fa";

  useEffect(() => {
    let active = true;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const metaRes = await fetch("/api/taxonomy/meta/");
        if (!metaRes.ok) throw new Error("Failed to load taxonomy metadata");
        const metaData: TaxonomyMeta = await metaRes.json();
        if (active) setMeta(metaData);

        const params = new URLSearchParams();
        params.set("per_page", "100");
        if (locale === "en") params.set("lang", "en");
        if (selectedKind !== "all") params.set("kind", selectedKind);
        if (selectedCefr !== "all") params.set("cefr", selectedCefr);
        if (searchQuery.trim()) params.set("q", searchQuery.trim());
        if (includeDeprecated) params.set("include_deprecated", "1");

        const nodesRes = await fetch(`/api/taxonomy/nodes/?${params.toString()}`);
        if (!nodesRes.ok) throw new Error("Failed to load taxonomy nodes");
        const nodesData = await nodesRes.json();
        if (active) setNodes(nodesData.results || []);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load taxonomy");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void fetchData();

    return () => {
      active = false;
    };
  }, [locale, selectedKind, selectedCefr, searchQuery, includeDeprecated]);

  function handleCopyId(id: string) {
    navigator.clipboard.writeText(id).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => {});
  }

  const kindLabels: Record<string, { fa: string; en: string }> = {
    all: { fa: "همه انواع", en: "All kinds" },
    skill: { fa: "مهارت اصلی", en: "Skill" },
    subskill: { fa: "زیرمهارت", en: "Subskill" },
    objective: { fa: "هدف آموزشی", en: "Objective" },
    grammar_topic: { fa: "مبحث گرامر", en: "Grammar topic" },
    vocabulary_topic: { fa: "موضوع واژگان", en: "Vocabulary topic" },
    age_tag: { fa: "گروه سنی", en: "Age tag" },
    exam_tag: { fa: "تگ آزمون", en: "Exam tag" },
  };

  return (
    <section className={styles.taxonomyContainer} aria-label={isFa ? "کاوشگر تاکسونومی آموزشی" : "Educational Taxonomy Explorer"}>
      <header className={styles.headerSection}>
        <span className={styles.kicker}>
          {isFa ? "نقشه یکپارچه یادگیری" : "Shared Language Map"}
        </span>
        <h1>{isFa ? "تاکسونومی مهارت‌ها و اهداف آموزشی CEFR" : "CEFR Skill & Content Taxonomy"}</h1>
        <p>
          {isFa
            ? "این ساختار استاندارد مبنای تعیین سطح، مسیر یادگیری، ماموریت‌های روزانه، بانک سوالات و ارزیابی پیشرفت در Endoora است."
            : "The stable reference map powering placement, learning paths, daily missions, the question bank, and progress analytics in Endoora."}
        </p>

        {meta ? (
          <div className={styles.metaStats}>
            <span className={styles.statBadge}>
              {isFa ? "نسخه جاری:" : "Release:"} <strong>{meta.latest_release ?? "day12-v1"}</strong>
            </span>
            <span className={styles.statBadge}>
              {isFa ? "مهارت‌های پایه:" : "Core Skills:"} <strong>{meta.active_counts["skill"] ?? 9}</strong>
            </span>
            <span className={styles.statBadge}>
              {isFa ? "اهداف و مباحث فعال:" : "Active Objectives & Topics:"} <strong>{nodes.length}</strong>
            </span>
          </div>
        ) : null}
      </header>

      <div className={styles.controlsBar}>
        <div className={styles.searchRow}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder={isFa ? "جست‌وجوی مهارت، گرامر، واژگان یا شناسه..." : "Search skill, grammar, vocabulary, or slug..."}
            value={searchQuery}
            onChange={(e) => startTransition(() => setSearchQuery(e.target.value))}
            aria-label={isFa ? "جست‌وجو در تاکسونومی" : "Search taxonomy"}
          />

          <select
            className={styles.filterSelect}
            value={selectedKind}
            onChange={(e) => setSelectedKind(e.target.value)}
            aria-label={isFa ? "فیلتر بر اساس نوع" : "Filter by kind"}
          >
            {Object.entries(kindLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {isFa ? label.fa : label.en}
              </option>
            ))}
          </select>

          <select
            className={styles.filterSelect}
            value={selectedCefr}
            onChange={(e) => setSelectedCefr(e.target.value)}
            aria-label={isFa ? "فیلتر سطح CEFR" : "Filter by CEFR level"}
          >
            <option value="all">{isFa ? "همه سطوح CEFR" : "All CEFR levels"}</option>
            {["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.toggleRow}>
          <div className={styles.pillGroup}>
            <button
              type="button"
              className={`${styles.pillBtn} ${selectedKind === "all" ? styles.pillBtnActive : ""}`}
              onClick={() => setSelectedKind("all")}
            >
              {isFa ? "همه" : "All"}
            </button>
            <button
              type="button"
              className={`${styles.pillBtn} ${selectedKind === "skill" ? styles.pillBtnActive : ""}`}
              onClick={() => setSelectedKind("skill")}
            >
              {isFa ? "مهارت‌ها" : "Skills"}
            </button>
            <button
              type="button"
              className={`${styles.pillBtn} ${selectedKind === "objective" ? styles.pillBtnActive : ""}`}
              onClick={() => setSelectedKind("objective")}
            >
              {isFa ? "اهداف یادگیری" : "Objectives"}
            </button>
            <button
              type="button"
              className={`${styles.pillBtn} ${selectedKind === "grammar_topic" ? styles.pillBtnActive : ""}`}
              onClick={() => setSelectedKind("grammar_topic")}
            >
              {isFa ? "گرامر" : "Grammar"}
            </button>
            <button
              type="button"
              className={`${styles.pillBtn} ${selectedKind === "vocabulary_topic" ? styles.pillBtnActive : ""}`}
              onClick={() => setSelectedKind("vocabulary_topic")}
            >
              {isFa ? "واژگان" : "Vocabulary"}
            </button>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={includeDeprecated}
                onChange={(e) => setIncludeDeprecated(e.target.checked)}
              />
              <span>{isFa ? "نمایش موارد منسوخ" : "Include deprecated"}</span>
            </label>

            <button
              type="button"
              className={styles.pillBtn}
              onClick={() => setLocale(isFa ? "en" : "fa")}
              aria-label={isFa ? "تغییر زبان به انگلیسی" : "Switch language to Persian"}
            >
              {isFa ? "English" : "فارسی"}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles.stateBox}>
          <p>{isFa ? "در حال بارگذاری اطلاعات تاکسونومی..." : "Loading taxonomy dataset..."}</p>
        </div>
      ) : error ? (
        <div className={styles.stateBox}>
          <p style={{ color: "#dc2626" }}>{error}</p>
          <button
            type="button"
            className={styles.retryBtn}
            onClick={() => setLocale((prev) => (prev === "fa" ? "fa" : "en"))}
          >
            {isFa ? "تلاش مجدد" : "Retry"}
          </button>
        </div>
      ) : nodes.length === 0 ? (
        <div className={styles.stateBox}>
          <p>{isFa ? "هیچ موردی مطابق فیلترهای انتخابی یافت نشد." : "No taxonomy items matched the selected filters."}</p>
        </div>
      ) : (
        <div className={styles.nodeGrid}>
          {nodes.map((node) => {
            const primaryTitle = isFa ? node.label_fa : node.label_en;
            const secondaryTitle = isFa ? node.label_en : node.label_fa;
            const description = isFa ? node.description_fa : node.description_en;
            const kindMeta = kindLabels[node.kind] || { fa: node.kind, en: node.kind };

            return (
              <article key={node.id} className={styles.nodeCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.badges}>
                    <span className={styles.badgeKind}>
                      {isFa ? kindMeta.fa : kindMeta.en}
                    </span>
                    {node.cefr_level ? (
                      <span className={styles.badgeCefr}>{node.cefr_level}</span>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className={styles.copyIdBtn}
                    onClick={() => handleCopyId(node.id)}
                    title={isFa ? "کپی شناسه یکتا" : "Copy stable UUID"}
                  >
                    {copiedId === node.id ? (isFa ? "کپی شد!" : "Copied!") : (isFa ? "کپی شناسه" : "Copy ID")}
                  </button>
                </div>

                <h2 className={styles.nodeTitle}>{primaryTitle}</h2>
                <p className={styles.nodeAltTitle}>{secondaryTitle}</p>

                {description ? (
                  <p className={styles.nodeDescription}>{description}</p>
                ) : null}

                <div className={styles.nodeMetadata}>
                  <div className={styles.metaRow}>
                    <span>{isFa ? "شناسه ماشین:" : "Slug:"}</span>
                    <span className={styles.slugCode}>{node.slug}</span>
                  </div>

                  {node.descriptor_reference ? (
                    <div className={styles.metaRow}>
                      <span>{isFa ? "مرجع CEFR:" : "Descriptor:"}</span>
                      <span style={{ fontSize: "0.75rem" }}>{node.descriptor_reference}</span>
                    </div>
                  ) : null}

                  {node.estimated_effort_minutes ? (
                    <div className={styles.metaRow}>
                      <span>{isFa ? "زمان تخمینی:" : "Est. effort:"}</span>
                      <span>{node.estimated_effort_minutes} {isFa ? "دقیقه" : "min"}</span>
                    </div>
                  ) : null}

                  {node.prerequisites && node.prerequisites.length > 0 ? (
                    <div>
                      <span style={{ display: "block", marginBlockEnd: "4px" }}>
                        {isFa ? "پیش‌نیازها:" : "Prerequisites:"}
                      </span>
                      <div className={styles.prereqList}>
                        {node.prerequisites.map((p) => (
                          <span key={p.id} className={styles.prereqItem}>
                            {p.slug}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
