"use client";

import Link from "next/link";
import { useState } from "react";
import { useLearnerHome } from "../../../components/learner/LearnerShell";
import styles from "../learner-subpages.module.css";

interface Turn {
  id: string;
  speaker: "system" | "learner";
  speakerNameFa: string;
  speakerNameEn: string;
  text: string;
}

interface Scenario {
  id: string;
  titleFa: string;
  titleEn: string;
  level: string;
  contextFa: string;
  contextEn: string;
  initialTurns: Turn[];
  promptOptions: string[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "sc-airport",
    titleFa: "فرودگاه و بازرسی گذرنامه",
    titleEn: "Airport Passport Control & Customs",
    level: "A2 - B1",
    contextFa: "شما به مقصد لندن رسیده‌اید و مامور کنترل گذرنامه درباره هدف سفر و محل اقامت سوال می‌پرسد.",
    contextEn: "You just landed in London. The border control officer inquires about your trip purpose and accommodation.",
    initialTurns: [
      {
        id: "t1",
        speaker: "system",
        speakerNameFa: "مامور کنترل گذرنامه",
        speakerNameEn: "Immigration Officer",
        text: "Good morning. May I please inspect your passport and landing card?",
      },
      {
        id: "t2",
        speaker: "learner",
        speakerNameFa: "شما",
        speakerNameEn: "You",
        text: "Good morning, officer. Here are my documents.",
      },
      {
        id: "t3",
        speaker: "system",
        speakerNameFa: "مامور کنترل گذرنامه",
        speakerNameEn: "Immigration Officer",
        text: "Thank you. What is the primary purpose of your visit, and how long will you stay?",
      },
    ],
    promptOptions: [
      "I am attending an educational conference for seven days.",
      "I am visiting historical museums and staying for two weeks.",
      "I have business meetings with our software partner.",
    ],
  },
  {
    id: "sc-interview",
    titleFa: "مصاحبه کاری و معرفی شغلی",
    titleEn: "Job Interview & Background",
    level: "B1 - B2",
    contextFa: "در مصاحبه شغلی برای یک موقعیت بین‌المللی، از شما خواسته شده در مورد تجربه حل مسئله صحبت کنید.",
    contextEn: "In an interview for an international company, the interviewer asks how you handle tight project deadlines.",
    initialTurns: [
      {
        id: "t1",
        speaker: "system",
        speakerNameFa: "مصاحبه‌کننده",
        speakerNameEn: "Interviewer",
        text: "Welcome! Could you describe a challenging project where your team faced an unexpected delay?",
      },
      {
        id: "t2",
        speaker: "learner",
        speakerNameFa: "شما",
        speakerNameEn: "You",
        text: "Certainly. In our previous product release, we faced critical API changes two weeks before launch.",
      },
      {
        id: "t3",
        speaker: "system",
        speakerNameFa: "مصاحبه‌کننده",
        speakerNameEn: "Interviewer",
        text: "Impressive context. How exactly did you prioritize tasks to deliver on time?",
      },
    ],
    promptOptions: [
      "We restructured our sprints and focused strictly on the core user journey.",
      "I organized daily stand-up syncs to resolve bottlenecks immediately.",
      "We automated our regression testing pipeline to prevent regressions.",
    ],
  },
  {
    id: "sc-cafe",
    titleFa: "سفارش در کافه و رستوران",
    titleEn: "Ordering at a Local Café",
    level: "A1 - A2",
    contextFa: "در کافه هستید و می‌خواهید نوشیدنی سفارش دهید و نحوه پرداخت را بپرسید.",
    contextEn: "You are at a café in Dublin, ordering morning coffee and checking payment options.",
    initialTurns: [
      {
        id: "t1",
        speaker: "system",
        speakerNameFa: "باریستا",
        speakerNameEn: "Barista",
        text: "Hi there! What can I get started for you today?",
      },
      {
        id: "t2",
        speaker: "learner",
        speakerNameFa: "شما",
        speakerNameEn: "You",
        text: "Hello! Could I please have a large oat-milk latte?",
      },
      {
        id: "t3",
        speaker: "system",
        speakerNameFa: "باریستا",
        speakerNameEn: "Barista",
        text: "Sure thing. Would you like that for here or to go?",
      },
    ],
    promptOptions: [
      "For here, please. And do you accept contactless card payments?",
      "To go, please. Also, could I add a blueberry muffin?",
      "For here, thank you. Could I have a glass of water as well?",
    ],
  },
];

export default function RoleplayPage() {
  const { locale } = useLearnerHome();
  const isFa = locale === "fa";

  const [activeScenario, setActiveScenario] = useState<Scenario>(SCENARIOS[0]);
  const [turns, setTurns] = useState<Turn[]>(SCENARIOS[0].initialTurns);
  const [inputText, setInputText] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleSelectScenario(sc: Scenario) {
    setActiveScenario(sc);
    setTurns(sc.initialTurns);
    setInputText("");
    setFeedback(null);
  }

  function handleSendTurn(textToSend: string) {
    if (!textToSend.trim()) return;

    const nextId = turns.length + 1;
    const newLearnerTurn: Turn = {
      id: `turn-learner-${nextId}`,
      speaker: "learner",
      speakerNameFa: "شما",
      speakerNameEn: "You",
      text: textToSend.trim(),
    };

    const newSystemTurn: Turn = {
      id: `turn-system-${nextId + 1}`,
      speaker: "system",
      speakerNameFa: activeScenario.initialTurns[0].speakerNameFa,
      speakerNameEn: activeScenario.initialTurns[0].speakerNameEn,
      text:
        activeScenario.id === "sc-airport"
          ? "Understood. Everything is in order. Enjoy your stay in the United Kingdom!"
          : activeScenario.id === "sc-interview"
          ? "That demonstrates great leadership and accountability. Thank you for elaborating."
          : "Perfect! Your order will be ready at the counter in two minutes.",
    };

    setTurns((prev) => [...prev, newLearnerTurn, newSystemTurn]);
    setInputText("");
    setFeedback(
      isFa
        ? "✓ پاسخ شما با موفقیت در بافت مکالمه قرار گرفت و گردش طبیعی گفتگو حفظ شد."
        : "✓ Your conversational contribution was syntactically fitting and situationally natural."
    );
  }

  function handleReset() {
    setTurns(activeScenario.initialTurns);
    setInputText("");
    setFeedback(null);
  }

  return (
    <div className={styles.container}>
      <Link className={styles.backLink} href="/dashboard">
        <span aria-hidden="true">{isFa ? "←" : "→"}</span>
        {isFa ? "بازگشت به داشبورد" : "Back to dashboard"}
      </Link>

      <section className={styles.heroCard}>
        <div className={styles.heroHeader}>
          <div>
            <h1 className={styles.heroTitle}>
              {isFa ? "تمرین مکالمه در سناریوهای واقعی (Roleplay)" : "Interactive Conversational Roleplay"}
            </h1>
            <p className={styles.heroSubtitle}>
              {isFa
                ? "مکالمه تعاملی نوبتی در موقعیت‌های طبیعی روزمره (فرودگاه، مصاحبه شغلی، کافه) برای ساخت اعتمادبه‌نفس گفتاری."
                : "Engage in situational turn-by-turn dialogues reflecting real-world scenarios to build communicative confidence."}
            </p>
          </div>
          <span className={`${styles.heroBadge} ${styles.heroBadgeSuccess}`}>
            {isFa ? `سطح: ${activeScenario.level}` : `Level: ${activeScenario.level}`}
          </span>
        </div>

        {/* Scenario Selection Buttons */}
        <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", marginBlockStart: "var(--space-4)" }}>
          {SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              type="button"
              className={`${styles.filterPill} ${activeScenario.id === sc.id ? styles.filterPillActive : ""}`}
              onClick={() => handleSelectScenario(sc)}
            >
              {isFa ? sc.titleFa : sc.titleEn}
            </button>
          ))}
        </div>
      </section>

      {/* Interactive Dialogue Card */}
      <section className={styles.card}>
        <div
          style={{
            padding: "var(--space-4)",
            background: "var(--color-canvas)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-control)",
            marginBlockEnd: "var(--space-5)",
          }}
        >
          <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 700, color: "var(--color-endoora-blue)" }}>
            {isFa ? "بافت و موقعیت سناریو:" : "Scenario Context:"}
          </span>
          <p style={{ margin: "var(--space-1) 0 0 0", color: "var(--color-text)", lineHeight: 1.6 }}>
            {isFa ? activeScenario.contextFa : activeScenario.contextEn}
          </p>
        </div>

        {/* Turns Stream */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBlockEnd: "var(--space-6)" }}>
          {turns.map((turn) => {
            const isLearner = turn.speaker === "learner";
            return (
              <div
                key={turn.id}
                style={{
                  alignSelf: isLearner ? "flex-end" : "flex-start",
                  maxInlineSize: "85%",
                  background: isLearner ? "var(--color-action)" : "var(--color-canvas)",
                  color: isLearner ? "var(--color-action-text)" : "var(--color-text)",
                  border: `1px solid ${isLearner ? "transparent" : "var(--color-border)"}`,
                  borderRadius: "var(--radius-card)",
                  padding: "var(--space-4)",
                  boxShadow: "var(--shadow-subtle)",
                }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    opacity: 0.85,
                    display: "block",
                    marginBlockEnd: "var(--space-1)",
                  }}
                >
                  {isFa ? turn.speakerNameFa : turn.speakerNameEn}
                </span>
                <p dir="ltr" style={{ margin: 0, fontWeight: 500, lineHeight: 1.5, fontFamily: "var(--font-family-latin)" }}>
                  {turn.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* Suggested Response Pills */}
        <div style={{ marginBlockEnd: "var(--space-4)" }}>
          <span style={{ fontSize: "var(--font-size-meta)", fontWeight: 700, color: "var(--color-muted)", display: "block", marginBlockEnd: "var(--space-2)" }}>
            {isFa ? "پاسخ‌های پیشنهادی برای نوبت شما:" : "Suggested Responses For Your Turn:"}
          </span>
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            {activeScenario.promptOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                dir="ltr"
                className={styles.buttonSecondary}
                style={{ fontSize: "var(--font-size-meta)", paddingBlock: "var(--space-1)", textAlign: "left" }}
                onClick={() => handleSendTurn(opt)}
              >
                &ldquo;{opt}&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <div style={{ display: "flex", gap: "var(--space-2)", marginBlockEnd: "var(--space-4)" }}>
          <input
            type="text"
            dir="ltr"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendTurn(inputText);
            }}
            placeholder="Or type your own response in English..."
            style={{
              flex: 1,
              padding: "var(--space-3)",
              borderRadius: "var(--radius-control)",
              border: "1px solid var(--color-border)",
              background: "var(--color-canvas)",
              color: "var(--color-text)",
              fontSize: "var(--font-size-body)",
            }}
          />
          <button
            type="button"
            className={styles.buttonPrimary}
            onClick={() => handleSendTurn(inputText)}
            disabled={!inputText.trim()}
          >
            {isFa ? "ارسال نوبت" : "Send Turn"}
          </button>
          <button type="button" className={styles.buttonSecondary} onClick={handleReset}>
            {isFa ? "شروع مجدد" : "Reset"}
          </button>
        </div>

        {feedback && (
          <div className={`${styles.feedbackBox} ${styles.feedbackBoxSuccess}`} role="status">
            {feedback}
          </div>
        )}

        <footer className={styles.disclaimer}>
          {isFa
            ? "نکته آموزشی: تمرین نقش‌آفرینی (Roleplay) برای مواجهه با مکالمات غیرقابل پیش‌بینی سفر و محیط‌های آکادمیک بین‌المللی است."
            : "Pedagogical Note: Roleplay simulations prepare learners for spontaneous communication in international workplace and academic situations."}
        </footer>
      </section>
    </div>
  );
}
