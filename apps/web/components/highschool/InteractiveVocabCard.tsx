"use client";

import React, { useState } from "react";
import type { HighSchoolVocabItem } from "@endoora/contracts";
import { playEnglishSpeech } from "@/lib/speech";
import styles from "./highschool-player.module.css";

interface InteractiveVocabCardProps {
  item: HighSchoolVocabItem;
  onSuccess?: () => void;
  onMistake?: (item: HighSchoolVocabItem) => void;
}

const ICON_MAP: Record<string, string> = {
  "firefighter-extinguishing-forest-fire": "🚒 🔥",
  "trapped-wild-animal": "🚫 🦏",
  "cutting-down-forest-trees": "🪓 🌲",
  "vet-caring-for-injured-deer": "🩺 🦌",
  "persian-leopard-on-rocks": "🐆 🪨",
  "blue-whale-swimming-ocean": "🐋 🌊",
  "grey-wolf-in-forest": "🐺 🌲",
  "asian-elephant-walking": "🐘 🌾",
  "endangered-cheetah-symbol": "⚠️ 🐆",
  "heartbeat-life-alive": "💓 🌱",
  "graph-going-up-arrow": "📈 🔝",
  "shield-protecting-wildlife": "🛡️ 🐾",
  "ear-listening-audio": "👂 🔊",
  "lightbulb-example-icon": "💡 📝",
  "planet-earth-space": "🌍 ✨",
  "wild-bengal-tiger": "🐅 🌿",
  "bulldozer-destroying-forest": "🚜 💥",
  "extinct-persian-lion": "🦁 ⏳",
  "tooran-plain-zebra-habitat": "🏞️ 🦓",
  "warning-sign-pay-attention": "⚠️ 👀",
  "bandaged-animal-leg": "🩹 🦌",
  "green-open-plain-grassland": "🌾 🌄",
  "three-small-items-a-few": "🤏 🐾",
  "person-holding-nature": "🧑‍🤝‍🧑 🌿",
  "coffee-tea-choice-alternative": "☕ 🔄 🍵",
  "calendar-arrow-future": "📅 🚀",
  "planets-sun-solar-system": "🪐 ☀️",
  "amazing-ants-working": "🐜 🌿",
  "human-body-system": "🫀 🧬",
  "camel-in-desert": "🐪 🏜️",
  "human-heart-organ": "🫀 💓",
  "blood-drop-red": "🩸 🔴",
  "full-moon-night": "🌕 🌌",
  "saturn-rings-planet": "🪐 ✨",
  "astronomy-telescope": "🔭 🌌",
  "laboratory-microscope": "🔬 🧫",
  "observatory-dome-mountain": "🏛️ 🔭",
  "near-distance-planets": "📏 🪐",
  "rocky-surface-mars": "🪨 🪐",
  "planetary-orbit": "🔄 🪐",
  "powerful-telescope-lens": "⚡ 🔭",
  "liquid-beaker-water": "🧪 💧",
  "single-blood-drop": "💧 🩸",
  "blood-cells-microscope": "🔬 🔴",
  "thousand-number-count": "🔢 💯",
  "microbe-bacteria-germ": "🦠 🧫",
  "useful-daily-exercise": "🏃 🥗",
  "heart-pumping-blood": "🫀 💓",
  "clear-mountain-lake": "🏞️ 💧",
  "healthy-athletic-person": "🍏 🏃",
  "defend-soldiers-shield": "🛡️ ⚔️",
  "monkey-carrying-baby": "🐒 👶",
  "school-bus-collecting-kids": "🚌 🎒",
  "scientific-fact-globe": "💡 🌍",
  "light-bulb-glow": "💡 ⚡",
  "telephone-communication": "☎️ 📞",
  "camera-taking-pictures": "📷 🖼️",
  "airplane-flying-sky": "✈️ ☁️",
  "scientists-working-lab": "🧑‍🔬 🧪",
  "laboratory-research-room": "🔬 🏢",
  "modern-building-architecture": "🏢 🏛️",
  "try-hard-studying": "📖 💪",
  "energetic-boy-running": "⚡ 🏃‍♂️",
  "students-doing-experiments": "👨‍🔬 ⚗️",
  "children-growing-rapidly": "🌱 📈",
  "flu-feeling-weak": "🤒 🛌",
  "edison-lightbulb-invention": "💡 👨‍🔬",
  "research-blood-cells": "🔬 🩸",
  "no-success-without-hard-work": "🏆 🧗‍♂️",
  "solve-problem-puzzle": "🧩 💡",
  "develop-skills-growing": "📈 🌟",
  "belief-faith-heart": "🤲 ✨",
  "quit-stop-smoking": "🚭 ✋",
  "thousands-of-stars": "🌌 🔢",
  "medicine-bottle-pills": "💊 🩺",
  "famous-scientist-portrait": "🌟 🧑‍🔬",
  "build-observatory-telescope": "🏛️ 🔭",
  "believe-me-hand": "🤝 💬",
  "cool-thumbs-up": "👍 🌟",
  "newton-apple-tree": "🍏 🌳",
  "observatory-maragheh": "🔭 🏛️",
  "storytelling-book": "📖 🕯️",
  "firefighters-putting-out-fire": "🧑‍🚒 🚒",
  "passport-travel-document": "🛂 ✈️",
  "tourist-attractions-map": "🗺️ 🏛️",
  "ticket-agency-office": "🎟️ 🏢",
  "destination-board-airport": "🛫 📋",
  "pilgrims-holy-shrine": "🕌 👥",
  "travel-booklet-guide": "📖 🧭",
  "historical-sites-ruins": "🏛️ 🏺",
  "summer-vacation-beach": "🏖️ ☀️",
  "world-travel-globe": "🌍 ✈️",
  "tourist-destination-pin": "📍 🌄",
  "travel-plan-calendar": "📅 ✈️",
  "travel-agent-desk": "👨‍💼 🖥️",
  "travel-choice-options": "🧭 🔀",
  "probably-thinking-cloud": "🤔 💭",
  "hospitable-warm-tea": "🍵 🤝",
  "travel-suggestion-idea": "💡 🗺️",
  "international-airport-terminal": "🛫 🏢",
  "attractive-tourist-view": "✨ 🏞️",
  "ancient-pyramids-egypt": "🔺 🏜️",
  "hot-dry-desert": "🐪 🏜️",
  "entertainment-park-fun": "🎡 🎭",
  "domestic-country-flight": "🏠 ✈️",
  "cultural-traditions-dance": "🎭 🪕",
  "range-of-options-spectrum": "🌈 📊",
  "ancient-wind-towers-yazd": "🏛️ 💨",
  "paradise-nature-garden": "🌸 🏞️",
  "holy-shrine-dome": "🕌 ✨",
  "travel-abroad-passport": "✈️ 🌍",
  // Grade 11 Lesson 1 (Understanding People)
  "language-globe-communication": "🗣️ 🌍",
  "continent-world-map": "🗺️ 🧭",
  "country-nations-flags": "🚩 🏛️",
  "peace-culture-tradition": "🕊️ 🎭",
  "communicate-people-talking": "💬 👥",
  "bilingual-two-languages": "🌐 🗣️",
  "native-speaker-person": "🧑‍🦱 🗣️",
  "dialect-regional-accent": "🗣️ 📍",
  "international-languages-flag": "🌍 🤝",
  "translator-working-studio": "🎙️ 🎧",
  "language-institute-building": "🏫 📚",
  "foreign-country-travel": "✈️ 🌍",
  "fluently-speaking-english": "🗣️ ⚡",
  "experience-years-knowledge": "💡 📈",
  "mother-tongue-persian": "🇮🇷 📖",
  "mazandaran-farming-region": "🌾 🏞️",
  "water-on-mars-exist": "🪐 💧",
  "price-range-scale": "🏷️ 📊",
  "asia-largest-continent": "🌏 🏔️",
  "native-speaker-spanish": "🇪🇸 🗣️",
  "popular-food-rice": "🍚 🍲",
  "imagine-space-travel": "🚀 🌌",
  "century-timeline-21st": "⏳ 📅",
  "percent-village-population": "📊 🏘️",
  "wind-power-meet-needs": "💨 ⚡",
  "society-community-people": "👥 🏙️",
  "ability-human-speech": "🧠 🗣️",
  "prices-vary-shops": "🏪 🔀",
  "make-up-population-share": "🧩 📈",
  "enjoy-weekend-despite-rain": "🌧️ ☕",
  "amazing-wonderful-pyramids": "✨ 🏛️",
  "seek-search-magnifying": "🔍 📜",
  "quit-give-up-smoking": "🚭 🛑",
  "nearly-almost-finish-line": "🏁 ⏱️",
  "fortunately-luckily-clover": "🍀 ✨",
  // Grade 11 Lesson 2 (A Healthy Lifestyle)
  "healthy-lifestyle-heart": "🥗 🏃",
  "junk-food-fastfood": "🍔 🍟",
  "jogging-running-park": "🏃‍♂️ 🌳",
  "health-risk-warning": "⚠️ 🩺",
  "balanced-diet-fruits": "🍎 🥦",
  "physical-activity-gym": "🏋️ 🚴",
  "improve-health-chart": "📈 💓",
  "surfing-net-laptop": "💻 🌐",
  "food-pyramid-chart": "📐 🥗",
  "gain-weight-scale": "⚖️ 📈",
  "high-blood-pressure": "🩺 🔴",
  "heartbeat-listen-stethoscope": "💓 🩺",
  "measure-height-tape": "📏 🧍",
  "serving-rice-bowl": "🍚 🥣",
  "bad-eating-habit": "🍩 🚫",
  "smoking-harmful-lungs": "🚭 🫁",
  "addiction-phone-screen": "📱 😵",
  "heart-attack-hospital": "🚨 🫀",
  "calm-peaceful-mind": "🧘 🕊️",
  "recent-news-calendar": "📰 ⏱️",
  "emotional-feelings-smile": "😊 🎭",
  "prefix-unsafe-shield": "🛡️ ⚠️",
  "prefix-disagree-hands": "🙅 💬",
  "suffix-illness-bed": "🤒 🛌",
  "suffix-peaceful-dove": "🕊️ ✨",
  "climbing-darband-mountain": "🧗 🏔️",
  "hang-out-friends-cafe": "👥 ☕",
  "depressed-sad-person": "😔 🌧️",
  // Grade 11 Lesson 3 (Art and Culture)
  "persian-carpet-rug": "🧶 🏺",
  "pottery-cup-meibod": "🏺 ☕",
  "tilework-sheikh-lotfollah": "🕌 💠",
  "farshchian-painting-art": "🎨 🖼️",
  "calligraphy-nezami-poem": "✒️ 📜",
  "handicrafts-iran-souvenir": "🛍️ 🏺",
  "woodwork-carving-craft": "🪵 🪚",
  "metalwork-copper-craft": "🪙 🔨",
  "cheerful-happy-art": "😊 ✨",
  "proud-hopeful-culture": "🌟 🇮🇷",
  "handmade-products-craft": "🤲 🧵",
  "termeh-isfahan-silk": "🧣 💎",
  "gabbeh-qashqai-nomad": "⛺ 🧶",
  "touching-emotional-gabbeh": "❤️ 🎨",
  "appreciate-culture-hand": "🙏 🏛️",
  "discount-percent-shop": "🏷️ 💰",
  "decorative-wall-clock": "🕰️ 🖼️",
  "craftsmen-hardworking": "🧑‍🎨 🛠️",
  "vast-country-map": "🗺️ 🏞️",
  "valuable-metals-gold": "🥇 🥈",
  "fingerprint-unique-id": "🔍 🆔",
  "animal-diversity-nature": "🐆 🦅",
  "weave-rug-loom": "🧵 🪡",
  "custom-tradition-local": "👥 🏮",
  "identity-flag-culture": "🇮🇷 📜",
  "reflect-mirror-shows": "🪞 💡",
  "humankind-world-people": "🌍 🤝",
  "antonym-start-finish": "🏁 🛑",
  "antonym-cheap-expensive": "💵 💎",
  "antonym-like-dislike": "👍 👎",
  "synonym-famous-wellknown": "⭐ 🌐",
  // Grade 12 Lesson 1 (Sense of Appreciation)
  "respect-parents-elderly": "🧓 💖",
  "elderly-people-care": "👵 👴",
  "take-care-of-grandparents": "🩺 👵",
  "listen-to-advice-elders": "👂 📜",
  "donate-help-poor": "🤲 🎁",
  "kind-loving-family": "🥰 👨‍👩‍👧",
  "dedicated-national-hero": "🎖️ 🇮🇷",
  "helpful-volunteering-boy": "🤝 🌟",
  "polite-respectful-greeting": "🙇‍♂️ 🤝",
  "sense-of-appreciation-heart": "💐 💖",
  "dr-gharib-physician": "👨‍⚕️ 🩺",
  "cure-healing-medicine": "💊 🩹",
  "dedicated-caring-doctor": "🩺 💖",
  "distinguished-professor-award": "🏆 👨‍🏫",
  "medical-textbook-study": "📚 🩺",
  "pity-sympathy-feeling": "😔 🤲",
  "comfortable-sofa-couch": "🛋️ 🏠",
  "feed-pigeons-park": "🕊️ 🌾",
  "hard-of-hearing-ear": "🦻 👴",
  "shout-impatient-yelling": "🗣️ ⚠️",
  "warm-hug-embrace": "🫂 ❤️",
  "mothers-lap-caring": "🤱 🌸",
  "burst-into-tears-crying": "😭 💧",
  "repeatedly-asking-clock": "🔁 ⏱️",
  "forgive-apologize-peace": "🕊️ 🤝",
  "calmly-speaking-peaceful": "🧘 🕊️",
  "mother-diary-memories": "📖 ✍️",
  "collocation-feel-well": "😊 🌡️",
  "collocation-take-temperature": "🌡️ 🤒",
  "collocation-go-abroad": "✈️ 🌍",
  "collocation-spare-no-pains": "💪 🌟",
  "collocation-not-surprisingly": "💡 🎯",
  "collocation-by-the-way": "💬 🔄",
  "collocation-burst-tears": "💧 🥺",
  "passive-poems-reading": "📜 🌍",
  "passive-textbook-written": "📖 ✍️",
  // Grade 12 Lesson 2 (Look it Up!)
  "monolingual-dictionary-book": "📕 🔤",
  "bilingual-dictionary-flags": "📘 🔄",
  "look-up-magnifying-word": "🔍 📖",
  "dictionary-entry-article": "📑 🔤",
  "definition-meaning-bulb": "💡 📝",
  "pronunciation-symbol-ipa": "🗣️ 🔠",
  "compile-dictionary-writer": "✍️ 📚",
  "magnifying-glass-zoom": "🔍 🔬",
  "pocket-dictionary-small": "📗 🎒",
  "identify-needs-checklist": "📋 🎯",
  "teacher-recommend-advice": "👨‍🏫 💡",
  "suppose-think-thought": "🤔 💭",
  "elementary-level-start": "🌱 🔰",
  "intermediate-level-middle": "🌿 📈",
  "advanced-level-expert": "🌳 🎓",
  "smartphone-app-dictionary": "📱 🌐",
  "contain-box-items": "📦 🥫",
  "symbol-chemical-carbon": "⚛️ 🔣",
  "purpose-target-arrow": "🎯 🏹",
  "figure-out-solve-puzzle": "🧩 💡",
  "stand-for-abbreviation": "🔤 🇮🇷",
  "combination-letters-xy": "🔀 🔢",
  "introduction-first-page": "📖 🚪",
  "effectively-success-arrow": "⚡ 🎯",
  "arrange-chairs-order": "🪑 📐",
  "jump-into-action": "🦘 🏃",
  "word-family-roots-tree": "🌳 🔤",
  "disconnect-cable-broken": "🔌 ❌",
  "international-world-globe": "🌐 ✈️",
  "unchangeable-lock-stone": "🔒 🪨",
  "unexpectedly-surprise-gift": "🎁 😲",
  "incomprehensible-question": "❓ 🤯",
  "conditional-type2-imaginary": "💭 ✨",
  // Grade 12 Lesson 3 (Renewable Energy)
  "wind-turbine-energy": "💨 ⚡",
  "fossil-fuel-oil-barrel": "🛢️ ⛏️",
  "renewable-energy-sun-wind": "♻️ ☀️",
  "solar-power-sun-rays": "☀️ ⚡",
  "hydropower-water-dam": "🌊 ⚡",
  "save-energy-lightbulb-off": "💡 🌿",
  "ancient-persia-wind-machine": "🏛️ 💨",
  "solar-panel-roof": "🏠 ☀️",
  "cooling-cost-air-conditioner": "❄️ 💵",
  "led-light-bulb": "💡 ✨",
  "generate-electricity-power": "⚡ 🏭",
  "opposite-fan-turbine": "🔄 🌀",
  "wind-blowing-trees": "🌬️ 🌲",
  "remind-wind-tower-yazd": "🕌 🌬️",
  "electrical-air-conditioner": "❄️ 🏢",
  "rich-in-oil-persian-gulf": "🛢️ 🌊",
  "natural-resources-earth": "🌍 💎",
  "consume-electricity-meter": "📊 🔌",
  "apartment-balcony-view": "🏡 🪟",
  "pollute-river-smoke": "🏭 💨",
  "variety-forms-energy": "🌈 ⚡",
  "ocean-tides-wave": "🌊 🌕",
  "replace-workers-robots": "🤖 🔄",
  "use-up-empty-container": "📭 🚫",
  "forever-infinity-time": "♾️ ⏳",
  "market-demand-graph": "📈 🛒",
  "convert-sunlight-power": "🔄 ⚡",
  "absorb-sunlight-leaves": "🌱 ☀️",
  "proverb-god-helps": "🤲 🌾",
  "proverb-early-bird": "🐦 🐛",
  "proverb-birds-feather": "🦅 🕊️",
  "proverb-actions-louder": "💪 🗣️",
  "proverb-practice-perfect": "🎯 🏹",
  "proverb-too-many-cooks": "👨‍🍳 🍲",
  "proverb-easy-come": "💨 💸",
  "proverb-two-heads": "🧠 🤝",
  "proverb-chickens-hatch": "🐣 🍂",
  "proverb-out-of-sight": "👁️ 💭",
  "proverb-cut-coat": "✂️ 🧥",
  "proverb-burnt-child": "🔥 🧒",
  "proverb-two-birds-stone": "🪨 🎯",
  "proverb-gift-horse": "🐴 🎁"
};

export const InteractiveVocabCard: React.FC<InteractiveVocabCardProps> = ({
  item,
  onSuccess,
  onMistake
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  const [shakingOption, setShakingOption] = useState<number | null>(null);

  const visualEmoji = ICON_MAP[item.imagePromptOrUrl] || "📚 🔍";

  const handleOptionClick = (index: number) => {
    if (isAnswered || disabledOptions.includes(index)) return;

    if (index === item.correctOptionIndex) {
      setSelectedOption(index);
      setIsAnswered(true);
      playEnglishSpeech(item.word);
      onSuccess?.();
    } else {
      setShakingOption(index);
      setDisabledOptions((prev) => [...prev, index]);
      onMistake?.(item);
      setTimeout(() => {
        setShakingOption(null);
      }, 400);
    }
  };

  return (
    <div className={styles.vocabCard}>
      {/* Visual illustration box */}
      <div className={styles.vocabVisual}>
        <span className={styles.vocabVisualIcon}>{visualEmoji}</span>
        <span className={styles.vocabVisualBadge}>
          {isAnswered ? "پاسخ صحیح داده شد ✓" : "گزینه درست را انتخاب کنید"}
        </span>
      </div>

      {/* 3 Choices */}
      <div className={styles.optionsGroup}>
        {item.options.map((option, idx) => {
          const isCorrectChoice = isAnswered && idx === item.correctOptionIndex;
          const isWrongChoice = disabledOptions.includes(idx);
          const isShaking = shakingOption === idx;

          let btnClass = styles.optionButton;
          if (isCorrectChoice) btnClass += ` ${styles.optionButtonCorrect}`;
          if (isWrongChoice) btnClass += ` ${styles.optionButtonWrong}`;
          if (isShaking) btnClass += ` ${styles.shake}`;

          return (
            <button
              key={idx}
              type="button"
              className={btnClass}
              disabled={isAnswered || isWrongChoice}
              onClick={() => handleOptionClick(idx)}
            >
              <span className={styles.optionLetterBadge}>
                {String.fromCharCode(65 + idx)}
              </span>
              <span className={styles.optionText}>{option}</span>
            </button>
          );
        })}
      </div>

      {/* Revealed Details on Correct Selection */}
      {isAnswered && (
        <div className={styles.revealedDetails}>
          <div className={styles.revealedWordHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <span className={styles.wordMainEn}>{item.word}</span>
              {item.phonetic && (
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontFamily: "var(--font-family-latin, monospace)",
                    background: "rgba(22, 101, 52, 0.08)",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "6px",
                    color: "#166534",
                    border: "1px solid rgba(22, 101, 52, 0.2)"
                  }}
                >
                  {item.phonetic}
                </span>
              )}
            </div>
            <button
              type="button"
              className={styles.audioSpeakerBtn}
              onClick={() => playEnglishSpeech(item.word)}
              title="پخش مجدد تلفظ کلمه"
            >
              🔊 تلفظ
            </button>
          </div>

          <div className={styles.wordMeaningFa}>
            💡 <strong>معنی:</strong> {item.persianMeaning}
          </div>

          {/* Simple Example Sentence with Audio */}
          <div className={styles.exampleBox}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#166534", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <span>📝</span> مثال در جمله:
              </span>
              <button
                type="button"
                className={styles.audioSpeakerBtn}
                style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem" }}
                onClick={() => playEnglishSpeech(item.exampleSentence.en)}
                title="پخش صوت جمله مثال"
              >
                🔊 پخش جمله
              </button>
            </div>
            <p className={styles.exampleEn}>{item.exampleSentence.en}</p>
            <p className={styles.exampleFa}>{item.exampleSentence.fa}</p>
          </div>
        </div>
      )}
    </div>
  );
};
