"use client";

import Link from "next/link";
import { useState } from "react";
import { useLearnerHome } from "../../../components/learner/LearnerShell";
import styles from "./vocabulary.module.css";

interface VocabCandidate {
  id: string;
  term: string;
  lemma: string;
  partOfSpeech: string;
  meaningFa: string;
  phonetic: string;
  sourceText: string;
  sourceType: string;
}

interface VocabCard {
  id: string;
  term: string;
  lemma: string;
  partOfSpeech: string;
  meaningFa: string;
  phonetic: string;
  exampleSentence: string;
  collocationEn: string;
  sourceType: string;
  status: "new" | "learning" | "review" | "mastered";
  intervalDays: number;
  repetition: number;
  lapseCount: number;
  isLeech: boolean;
}

const INITIAL_CANDIDATES: VocabCandidate[] = [
  {
    id: "cand-01",
    term: "perseverance",
    lemma: "perseverance",
    partOfSpeech: "noun",
    meaningFa: "پشتکار، مداومت و استقامت در مسیر هدف",
    phonetic: "/ˌpɜː.sɪˈvɪə.rəns/",
    sourceText: "Academic success requires perseverance and deliberate practice.",
    sourceType: "writing",
  },
  {
    id: "cand-02",
    term: "alleviate",
    lemma: "alleviate",
    partOfSpeech: "verb",
    meaningFa: "تسکین دادن، کاستن از شدت درد یا سختی",
    phonetic: "/əˈliː.vi.eɪt/",
    sourceText: "The new transit route will alleviate peak-hour traffic congestion.",
    sourceType: "reading",
  },
  {
    id: "cand-03",
    term: "pragmatic",
    lemma: "pragmatic",
    partOfSpeech: "adjective",
    meaningFa: "عمل‌گرایانه، متکی بر تجربه واقعی",
    phonetic: "/præɡˈmæt.ɪk/",
    sourceText: "We need to adopt a pragmatic approach to language acquisition.",
    sourceType: "conversation",
  },
];

const INITIAL_CARDS: VocabCard[] = [
  {
    id: "card-01",
    term: "discovery",
    lemma: "discovery",
    partOfSpeech: "noun",
    meaningFa: "کشف، دستاورد علمی جدید",
    phonetic: "/dɪˈskʌv.ər.i/",
    exampleSentence: "The scientific team made a groundbreaking discovery in oncology.",
    collocationEn: "make a breakthrough discovery",
    sourceType: "writing",
    status: "learning",
    intervalDays: 2,
    repetition: 2,
    lapseCount: 0,
    isLeech: false,
  },
  {
    id: "card-02",
    term: "ambiguous",
    lemma: "ambiguous",
    partOfSpeech: "adjective",
    meaningFa: "مبهم، چندپهلو، دارای چند معنا",
    phonetic: "/æmˈbɪɡ.ju.əs/",
    exampleSentence: "The contract clause was somewhat ambiguous, leading to disputes.",
    collocationEn: "highly ambiguous statement",
    sourceType: "reading",
    status: "review",
    intervalDays: 4,
    repetition: 3,
    lapseCount: 1,
    isLeech: false,
  },
  {
    id: "card-03",
    term: "cohesion",
    lemma: "cohesion",
    partOfSpeech: "noun",
    meaningFa: "انسجام، پیوستگی متن یا ساختار",
    phonetic: "/koʊˈhiː.ʒən/",
    exampleSentence: "Transitional adverbs strengthen paragraph cohesion in essays.",
    collocationEn: "maintain textual cohesion",
    sourceType: "writing",
    status: "review",
    intervalDays: 6,
    repetition: 4,
    lapseCount: 0,
    isLeech: false,
  },
  {
    id: "card-04",
    term: "articulate",
    lemma: "articulate",
    partOfSpeech: "verb",
    meaningFa: "رسا بیان کردن، به وضوح توضیح دادن",
    phonetic: "/ɑːˈtɪk.jə.leɪt/",
    exampleSentence: "She could articulate complex architectural principles effortlessly.",
    collocationEn: "clearly articulate the vision",
    sourceType: "speaking",
    status: "learning",
    intervalDays: 1,
    repetition: 1,
    lapseCount: 4,
    isLeech: true, // Leech card (>= 4 lapses)
  },
  {
    id: "card-05",
    term: "substantial",
    lemma: "substantial",
    partOfSpeech: "adjective",
    meaningFa: "قابل توجه، اساسی و چشمگیر",
    phonetic: "/səbˈstæn.ʃəl/",
    exampleSentence: "The startup received substantial funding from investors.",
    collocationEn: "substantial improvement",
    sourceType: "lesson",
    status: "mastered",
    intervalDays: 14,
    repetition: 6,
    lapseCount: 0,
    isLeech: false,
  },
];

export default function VocabularyHubPage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";

  const [activeTab, setActiveTab] = useState<"inbox" | "deck" | "extract" | "leeches">("inbox");
  const [candidates, setCandidates] = useState<VocabCandidate[]>(INITIAL_CANDIDATES);
  const [cards, setCards] = useState<VocabCard[]>(INITIAL_CARDS);
  const [deckFilter, setDeckFilter] = useState<"all" | "learning" | "review" | "mastered" | "leeches">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [extractText, setExtractText] = useState("");
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editMeaningText, setEditMeaningText] = useState("");
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  // Audio speech pronunciation
  const handlePlayAudio = (term: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(term);
      utter.lang = "en-US";
      utter.rate = 0.9;
      window.speechSynthesis.speak(utter);
    }
  };

  // Candidate Approval -> adds to cards
  const handleApprove = (candId: string) => {
    const cand = candidates.find((c) => c.id === candId);
    if (!cand) return;

    const newCard: VocabCard = {
      id: `card-${Date.now()}`,
      term: cand.term,
      lemma: cand.lemma,
      partOfSpeech: cand.partOfSpeech,
      meaningFa: cand.meaningFa,
      phonetic: cand.phonetic,
      exampleSentence: cand.sourceText,
      collocationEn: "",
      sourceType: cand.sourceType,
      status: "new",
      intervalDays: 1,
      repetition: 0,
      lapseCount: 0,
      isLeech: false,
    };

    setCards([newCard, ...cards]);
    setCandidates(candidates.filter((c) => c.id !== candId));
    setStatusFeedback(
      isFa
        ? `واژه "${cand.term}" با موفقیت به کارت‌های فعال SRS اضافه شد.`
        : `Word "${cand.term}" approved and added to your SRS review deck.`
    );
  };

  // Candidate Ignore
  const handleIgnore = (candId: string) => {
    setCandidates(candidates.filter((c) => c.id !== candId));
    setStatusFeedback(
      isFa ? "واژه از صندوق ورودی حذف شد." : "Candidate dismissed from inbox."
    );
  };

  // Extract from text
  const handleExtractSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extractText.trim()) return;

    const words = extractText
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length >= 4);

    const uniqueNewWords = Array.from(new Set(words.map((w) => w.toLowerCase()))).slice(0, 3);

    const newCands: VocabCandidate[] = uniqueNewWords.map((word, idx) => ({
      id: `cand-${Date.now()}-${idx}`,
      term: word,
      lemma: word,
      partOfSpeech: "noun/verb",
      meaningFa: `معنی واژه ${word} (استخراج‌شده از متن شما)`,
      phonetic: `/${word}/`,
      sourceText: extractText.slice(0, 120),
      sourceType: "custom_extraction",
    }));

    setCandidates([...newCands, ...candidates]);
    setExtractText("");
    setActiveTab("inbox");
    setStatusFeedback(
      isFa
        ? `${newCands.length} واژه جدید استخراج و به صندوق ورودی اضافه شد.`
        : `${newCands.length} candidate words extracted to your inbox.`
    );
  };

  // Edit card meaning
  const handleStartEdit = (card: VocabCard) => {
    setEditingCardId(card.id);
    setEditMeaningText(card.meaningFa);
  };

  const handleSaveEdit = (cardId: string) => {
    setCards(
      cards.map((c) => (c.id === cardId ? { ...c, meaningFa: editMeaningText } : c))
    );
    setEditingCardId(null);
    setStatusFeedback(
      isFa ? "معنی کارت با موفقیت اصلاح شد." : "Card meaning updated successfully."
    );
  };

  // Delete card (removes personal context)
  const handleDeleteCard = (cardId: string) => {
    setCards(cards.filter((c) => c.id !== cardId));
    setStatusFeedback(
      isFa
        ? "کارت واژه و بافت متنی شخصی آن به طور کامل حذف شد."
        : "Card and associated personal context permanently removed."
    );
  };

  // Filtered cards for deck
  const filteredCards = cards.filter((card) => {
    const matchesFilter =
      deckFilter === "all" ||
      (deckFilter === "leeches" ? card.isLeech : card.status === deckFilter);
    const matchesSearch =
      searchQuery.trim() === "" ||
      card.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.meaningFa.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const dueCount = cards.filter((c) => c.status !== "mastered").length;
  const leechCount = cards.filter((c) => c.isLeech).length;

  return (
    <div className={styles.container}>
      <Link className={styles.backLink} href="/dashboard">
        <span aria-hidden="true">{isFa ? "←" : "→"}</span>
        {isFa ? "بازگشت به داشبورد" : "Back to dashboard"}
      </Link>

      {/* Hero Section */}
      <section className={styles.heroCard}>
        <div className={styles.heroHeader}>
          <div>
            <h1 className={styles.heroTitle}>
              {isFa ? "مدیریت واژگان و مرور فاصله‌دار (SRS)" : "Vocabulary Bank & SRS Review"}
            </h1>
            <p className={styles.heroSubtitle}>
              {isFa
                ? "واژگان جدید از رایتینگ‌ها، مکالمات و تکالیف شما شناسایی می‌شوند و پس از تأیید شما، با الگوریتم علمی تکرار فاصله‌دار به حافظه بلندمدت سپرده می‌شوند."
                : "Vocabulary surfaces from your actual writing, roleplay, and lessons. Approve items into your personal SRS deck for evidence-grounded long-term retention."}
            </p>
          </div>
          <span className={`${styles.heroBadge} ${dueCount > 0 ? styles.heroBadgeWarning : styles.heroBadgeSuccess}`}>
            {isFa ? `${dueCount} کارت موعد مرور` : `${dueCount} Cards Due`}
          </span>
        </div>

        <div className={styles.actionRow}>
          <Link className={styles.buttonPrimary} href="/review">
            <span aria-hidden="true">🔄</span>
            {isFa ? "شروع مرور هوشمند امروز" : "Start SRS Review Session"}
          </Link>
          <Link className={styles.buttonSecondary} href="/today">
            {isFa ? "مأموریت روزانه" : "Daily Mission"}
          </Link>
        </div>
      </section>

      {/* Stats Ribbon */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>{isFa ? "کل واژگان ثبت‌شده" : "Total Cards"}</span>
          <span className={styles.statValue}>{cards.length}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>{isFa ? "موعد مرور امروز" : "Due Today"}</span>
          <span className={styles.statValue} style={{ color: "var(--color-warning-text)" }}>{dueCount}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>{isFa ? "در حال یادگیری" : "In Learning"}</span>
          <span className={styles.statValue}>{cards.filter((c) => c.status === "learning").length}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>{isFa ? "به حافظه سپرده‌شده" : "Mastered"}</span>
          <span className={styles.statValue} style={{ color: "var(--color-success-text)" }}>{cards.filter((c) => c.status === "mastered").length}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>{isFa ? "کارت‌های پرخطا (Leech)" : "Leeches"}</span>
          <span className={styles.statValue} style={{ color: leechCount > 0 ? "var(--color-error-text)" : "inherit" }}>
            {leechCount}
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>{isFa ? "صندوق تأیید نشده" : "Inbox Pending"}</span>
          <span className={styles.statValue}>{candidates.length}</span>
        </div>
      </div>

      {statusFeedback && (
        <div
          role="status"
          style={{
            padding: "var(--space-3) var(--space-4)",
            borderRadius: "var(--radius-control)",
            background: "var(--color-info-bg)",
            color: "var(--color-info-text)",
            border: "1px solid var(--color-border)",
            fontWeight: 600,
            fontSize: "var(--font-size-meta)",
            marginBlockEnd: "var(--space-4)",
          }}
        >
          {statusFeedback}
        </div>
      )}

      {/* Tab Bar */}
      <nav className={styles.tabNav} aria-label="Vocabulary sections">
        <button
          type="button"
          className={`${styles.tabButton} ${activeTab === "inbox" ? styles.tabButtonActive : ""}`}
          onClick={() => setActiveTab("inbox")}
        >
          {isFa ? `صندوق ورودی (${candidates.length})` : `Candidate Inbox (${candidates.length})`}
        </button>
        <button
          type="button"
          className={`${styles.tabButton} ${activeTab === "deck" ? styles.tabButtonActive : ""}`}
          onClick={() => setActiveTab("deck")}
        >
          {isFa ? `بانک واژگان فعال (${cards.length})` : `Active Deck (${cards.length})`}
        </button>
        <button
          type="button"
          className={`${styles.tabButton} ${activeTab === "extract" ? styles.tabButtonActive : ""}`}
          onClick={() => setActiveTab("extract")}
        >
          {isFa ? "استخراج و ثبت واژه" : "Extract & Add"}
        </button>
        <button
          type="button"
          className={`${styles.tabButton} ${activeTab === "leeches" ? styles.tabButtonActive : ""}`}
          onClick={() => setActiveTab("leeches")}
        >
          {isFa ? `بازیابی پرخطاها (${leechCount})` : `Leech Recovery (${leechCount})`}
        </button>
      </nav>

      {/* TAB 1: Candidate Inbox */}
      {activeTab === "inbox" && (
        <section>
          <div style={{ marginBlockEnd: "var(--space-4)" }}>
            <h2 style={{ fontSize: "var(--font-size-section-title)", fontWeight: 700, margin: 0 }}>
              {isFa ? "واژگان پیشنهادی استخراج‌شده از فعالیت شما" : "Extracted Candidate Vocabulary"}
            </h2>
            <p style={{ color: "var(--color-muted)", fontSize: "var(--font-size-meta)", marginBlockStart: "var(--space-1)" }}>
              {isFa
                ? "برخلاف سیستم‌های سنتی، اندورا هر واژه‌ای را خودکار ذخیره نمی‌کند. واژگانی که مایلید به خاطر بسپارید را تأیید کنید."
                : "Endoora requires learner approval to prevent deck bloat. Save only words you want to actively internalize."}
            </p>
          </div>

          {candidates.length === 0 ? (
            <div style={{ textAlign: "center", padding: "var(--space-8)", background: "var(--color-surface)", borderRadius: "var(--radius-card)", border: "1px solid var(--color-border)" }}>
              <span style={{ fontSize: "2rem", display: "block", marginBlockEnd: "var(--space-2)" }}>✨</span>
              <h3 style={{ fontSize: "var(--font-size-body)", fontWeight: 700 }}>
                {isFa ? "صندوق ورودی شما خالی است." : "Candidate inbox is clear."}
              </h3>
              <p style={{ color: "var(--color-muted)", fontSize: "var(--font-size-meta)", maxInlineSize: "28rem", marginInline: "auto" }}>
                {isFa
                  ? "با نوشتن انشا در بخش رایتینگ یا انجام مکالمه در رول‌پلی، کلمات جدید به این بخش وارد خواهند شد."
                  : "Practice writing essays or conversational roleplay to surface new candidate words."}
              </p>
            </div>
          ) : (
            <div className={styles.cardGrid}>
              {candidates.map((cand) => (
                <div key={cand.id} className={styles.vocabCard}>
                  <div>
                    <div className={styles.cardTop}>
                      <span className={styles.sourceBadge}>{cand.sourceType}</span>
                      <span className={styles.wordPhonetic}>{cand.phonetic}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBlock: "var(--space-2)" }}>
                      <h3 className={styles.wordTerm}>{cand.term}</h3>
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(cand.term)}
                        className={styles.buttonSecondary}
                        style={{ padding: "2px 8px", minBlockSize: "1.8rem" }}
                        aria-label="Play audio"
                      >
                        🔊
                      </button>
                    </div>
                    <p className={styles.meaningFa}>{cand.meaningFa}</p>

                    <div className={styles.contextBox}>
                      <span>{isFa ? "جمله اصلی شما:" : "Source Sentence:"}</span>
                      <p className={styles.contextSentence}>&ldquo;{cand.sourceText}&rdquo;</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "var(--space-2)", marginBlockStart: "var(--space-3)" }}>
                    <button
                      type="button"
                      className={styles.buttonPrimary}
                      style={{ flex: 1, padding: "var(--space-2)" }}
                      onClick={() => handleApprove(cand.id)}
                    >
                      {isFa ? "تأیید و افزودن به مرور" : "Approve Card"}
                    </button>
                    <button
                      type="button"
                      className={styles.buttonSecondary}
                      style={{ padding: "var(--space-2)" }}
                      onClick={() => handleIgnore(cand.id)}
                    >
                      {isFa ? "صرف‌نظر" : "Ignore"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 2: Active Deck */}
      {activeTab === "deck" && (
        <section>
          {/* Filter Bar */}
          <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", marginBlockEnd: "var(--space-4)", alignItems: "center" }}>
            <input
              type="text"
              className={styles.input}
              style={{ maxInlineSize: "20rem", margin: 0 }}
              placeholder={isFa ? "جستجو در واژگان یا معنی فارسی..." : "Search term or meaning..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div style={{ display: "flex", gap: "var(--space-1)", flexWrap: "wrap" }}>
              {(["all", "learning", "review", "mastered", "leeches"] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setDeckFilter(filter)}
                  style={{
                    padding: "var(--space-1) var(--space-3)",
                    borderRadius: "var(--radius-pill)",
                    border: "1px solid var(--color-border)",
                    background: deckFilter === filter ? "var(--color-action)" : "var(--color-surface)",
                    color: deckFilter === filter ? "var(--color-button-primary-text)" : "var(--color-text)",
                    fontWeight: 600,
                    fontSize: "var(--font-size-meta)",
                    cursor: "pointer",
                  }}
                >
                  {filter === "all" && (isFa ? "همه" : "All")}
                  {filter === "learning" && (isFa ? "در حال یادگیری" : "Learning")}
                  {filter === "review" && (isFa ? "در چرخه مرور" : "Review")}
                  {filter === "mastered" && (isFa ? "تثبیت‌شده" : "Mastered")}
                  {filter === "leeches" && (isFa ? "پرخطاها (Leech)" : "Leeches")}
                </button>
              ))}
            </div>
          </div>

          {filteredCards.length === 0 ? (
            <div style={{ textAlign: "center", padding: "var(--space-8)", background: "var(--color-surface)", borderRadius: "var(--radius-card)", border: "1px solid var(--color-border)" }}>
              <p style={{ color: "var(--color-muted)", margin: 0 }}>
                {isFa ? "واژه‌ای با این مشخصات یافت نشد." : "No cards match this criteria."}
              </p>
            </div>
          ) : (
            <div className={styles.cardGrid}>
              {filteredCards.map((card) => (
                <div key={card.id} className={`${styles.vocabCard} ${card.isLeech ? styles.vocabCardLeech : ""}`}>
                  <div>
                    <div className={styles.cardTop}>
                      <span
                        className={`${styles.statusPill} ${
                          card.isLeech
                            ? styles.statusPillLeech
                            : card.status === "mastered"
                            ? styles.statusPillMastered
                            : card.status === "learning"
                            ? styles.statusPillLearning
                            : styles.statusPillReview
                        }`}
                      >
                        {card.isLeech
                          ? isFa ? "⚠ پرخطا (Leech)" : "⚠ Leech"
                          : card.status === "mastered"
                          ? isFa ? "تثبیت‌شده" : "Mastered"
                          : isFa ? `فاصله: ${card.intervalDays} روز` : `Interval: ${card.intervalDays}d`}
                      </span>
                      <span className={styles.wordPhonetic}>{card.phonetic}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBlock: "var(--space-2)" }}>
                      <h3 className={styles.wordTerm}>{card.term}</h3>
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(card.term)}
                        className={styles.buttonSecondary}
                        style={{ padding: "2px 8px", minBlockSize: "1.8rem" }}
                        aria-label="Play audio"
                      >
                        🔊
                      </button>
                    </div>

                    {editingCardId === card.id ? (
                      <div style={{ marginBlock: "var(--space-2)" }}>
                        <input
                          type="text"
                          className={styles.input}
                          value={editMeaningText}
                          onChange={(e) => setEditMeaningText(e.target.value)}
                        />
                        <div style={{ display: "flex", gap: "var(--space-2)" }}>
                          <button
                            type="button"
                            className={styles.buttonPrimary}
                            style={{ padding: "var(--space-1) var(--space-2)", fontSize: "var(--font-size-meta)" }}
                            onClick={() => handleSaveEdit(card.id)}
                          >
                            {isFa ? "ذخیره" : "Save"}
                          </button>
                          <button
                            type="button"
                            className={styles.buttonSecondary}
                            style={{ padding: "var(--space-1) var(--space-2)", fontSize: "var(--font-size-meta)" }}
                            onClick={() => setEditingCardId(null)}
                          >
                            {isFa ? "انصراف" : "Cancel"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className={styles.meaningFa}>{card.meaningFa}</p>
                    )}

                    <div className={styles.contextBox}>
                      <span>{isFa ? "مثال در بافت جمله:" : "Contextual Example:"}</span>
                      <p className={styles.contextSentence}>&ldquo;{card.exampleSentence}&rdquo;</p>
                    </div>

                    {card.collocationEn && (
                      <div style={{ fontSize: "var(--font-size-meta)", color: "var(--color-muted)", marginBlockStart: "var(--space-2)" }}>
                        <strong>{isFa ? "ترکیب همنشین: " : "Collocation: "}</strong>
                        <span dir="ltr">{card.collocationEn}</span>
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-3)", marginBlockStart: "var(--space-2)" }}>
                    <button
                      type="button"
                      className={styles.buttonSecondary}
                      style={{ padding: "var(--space-1) var(--space-2)", fontSize: "var(--font-size-meta)" }}
                      onClick={() => handleStartEdit(card)}
                    >
                      {isFa ? "ویرایش معنی" : "Edit Meaning"}
                    </button>
                    <button
                      type="button"
                      className={styles.buttonDanger}
                      onClick={() => handleDeleteCard(card.id)}
                    >
                      {isFa ? "حذف" : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 3: Extract & Add */}
      {activeTab === "extract" && (
        <section className={styles.formCard}>
          <h2 style={{ fontSize: "var(--font-size-section-title)", fontWeight: 700, margin: 0 }}>
            {isFa ? "استخراج هوشمند واژگان از متن انگلیسی" : "Extract Vocabulary from English Text"}
          </h2>
          <p style={{ color: "var(--color-muted)", fontSize: "var(--font-size-meta)", marginBlockStart: "var(--space-1)", marginBlockEnd: "var(--space-4)" }}>
            {isFa
              ? "یک پاراگراف از متنی که مطالعه کرده‌اید یا انشایی که نوشته‌اید را وارد کنید تا کلمات کلیدی با جمله مرجع شناسایی و به صندوق تأیید شما منتقل شوند."
              : "Paste any reading passage or essay paragraph to extract contextual vocabulary with traceable sentences."}
          </p>

          <form onSubmit={handleExtractSubmit}>
            <label htmlFor="extractInput" style={{ fontWeight: 700, fontSize: "var(--font-size-meta)", display: "block" }}>
              {isFa ? "متن انگلیسی مرجع:" : "English Source Passage:"}
            </label>
            <textarea
              id="extractInput"
              className={styles.textarea}
              placeholder="e.g. Cognitive resilience enables language learners to navigate ambiguous grammatical structures with confidence..."
              value={extractText}
              onChange={(e) => setExtractText(e.target.value)}
              required
            />

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" className={styles.buttonPrimary}>
                <span aria-hidden="true">⚡</span>
                {isFa ? "استخراج واژگان کاندید" : "Extract Candidate Words"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* TAB 4: Leech Recovery */}
      {activeTab === "leeches" && (
        <section>
          <div style={{ marginBlockEnd: "var(--space-4)" }}>
            <h2 style={{ fontSize: "var(--font-size-section-title)", fontWeight: 700, margin: 0 }}>
              {isFa ? "بازیابی واژگان پرخطا (Leech Recovery)" : "Leech Word Recovery"}
            </h2>
            <p style={{ color: "var(--color-muted)", fontSize: "var(--font-size-meta)", marginBlockStart: "var(--space-1)" }}>
              {isFa
                ? "واژگانی که بیش از ۴ بار در آزمون‌های تکرار با خطا مواجه شده‌اند (Leech) نباید با فلش‌کارت‌های تکراری وقت شما را هدر دهند. این واژگان به تمرین در جمله‌سازی یا بررسی با مدرس اختصاص داده می‌شوند."
                : "Cards with 4+ lapses are flagged as leeches. Repeated flashcard attempts waste cognitive capacity; instead, practice them via targeted sentence synthesis."}
            </p>
          </div>

          {cards.filter((c) => c.isLeech).length === 0 ? (
            <div style={{ textAlign: "center", padding: "var(--space-8)", background: "var(--color-surface)", borderRadius: "var(--radius-card)", border: "1px solid var(--color-border)" }}>
              <span style={{ fontSize: "2rem", display: "block", marginBlockEnd: "var(--space-2)" }}>🎉</span>
              <h3 style={{ fontSize: "var(--font-size-body)", fontWeight: 700 }}>
                {isFa ? "هیچ کارت پرخطایی در جعبه شما وجود ندارد!" : "Zero leeches in your deck!"}
              </h3>
              <p style={{ color: "var(--color-muted)", fontSize: "var(--font-size-meta)" }}>
                {isFa
                  ? "حافظه بلندمدت شما در شرایط پایدار قرار دارد و کلمات به موقع یادآوری شده‌اند."
                  : "Your recall intervals are calibrated cleanly without persistent memory bottlenecks."}
              </p>
            </div>
          ) : (
            <div className={styles.cardGrid}>
              {cards
                .filter((c) => c.isLeech)
                .map((card) => (
                  <div key={card.id} className={`${styles.vocabCard} ${styles.vocabCardLeech}`}>
                    <div>
                      <div className={styles.cardTop}>
                        <span className={`${styles.statusPill} ${styles.statusPillLeech}`}>
                          {isFa ? `${card.lapseCount} بار لغزش حافظه` : `${card.lapseCount} Memory Lapses`}
                        </span>
                        <span className={styles.wordPhonetic}>{card.phonetic}</span>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBlock: "var(--space-2)" }}>
                        <h3 className={styles.wordTerm}>{card.term}</h3>
                        <button
                          type="button"
                          onClick={() => handlePlayAudio(card.term)}
                          className={styles.buttonSecondary}
                          style={{ padding: "2px 8px", minBlockSize: "1.8rem" }}
                          aria-label="Play audio"
                        >
                          🔊
                        </button>
                      </div>

                      <p className={styles.meaningFa}>{card.meaningFa}</p>

                      <div className={styles.contextBox}>
                        <span>{isFa ? "راهکار پیشنهادی الگوریتم:" : "Recommended Pedagogical Action:"}</span>
                        <p style={{ margin: "var(--space-1) 0 0 0", fontWeight: 600, color: "var(--color-error-text)" }}>
                          {isFa
                            ? "از این واژه در انشای رایتینگ آینده استفاده کنید یا با مدرس خود تمرین نمایید."
                            : "Construct an active sentence in the Writing Mentor or request teacher guidance."}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "var(--space-2)", marginBlockStart: "var(--space-3)" }}>
                      <Link
                        className={styles.buttonPrimary}
                        href="/writing"
                        style={{ flex: 1, padding: "var(--space-2)", fontSize: "var(--font-size-meta)", textDecoration: "none" }}
                      >
                        {isFa ? "تمرین در رایتینگ" : "Practice in Writing"}
                      </Link>
                      <button
                        type="button"
                        className={styles.buttonDanger}
                        onClick={() => handleDeleteCard(card.id)}
                      >
                        {isFa ? "حذف کارت" : "Remove"}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>
      )}

      {/* Educational Notice - Product Constitution Rule #8 */}
      <footer className={styles.disclaimer}>
        {isFa
          ? "سامانه تکرار فاصله‌دار اندورا (SRS) بر مبنای الگوریتم SM-2 بهینه‌سازی شده برای یادگیرندگان ایرانی طراحی شده است. فواصل مرور به صورت کاملاً شفاف و بدون وعده‌های اغراق‌آمیز حافظه فوتوگرافیک محاسبه می‌گردد."
          : "Endoora's Spaced Repetition System operates on empirical cognitive intervals. Next review dates are transparently displayed without false photographic memory guarantees."}
      </footer>
    </div>
  );
}
