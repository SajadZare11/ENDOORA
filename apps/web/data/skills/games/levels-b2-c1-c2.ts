import type { GameLevel, SkillKey, CefrLevel } from "./types";

interface LevelTopic {
  fa: string;
  en: string;
  focus: string;
}

const B2_TOPICS: LevelTopic[] = [
  { fa: "شرطی نوع سوم و فرصت‌های از دست رفته", en: "Third Conditional & Regrets", focus: "Had + p.p., would have + p.p." },
  { fa: "مجهول پیشرفته در زمان‌های استمراری و کامل", en: "Complex Passive Constructions", focus: "Being analyzed, has been undertaken" },
  { fa: "نقل قول غیرمستقیم با افعال گزارش‌دهی متنوع", en: "Advanced Reporting Verbs", focus: "Urged, claimed, denied, admitted" },
  { fa: "افعال دوکلمه‌ای دانشگاهی و رسمی", en: "Academic Phrasal Verbs", focus: "Account for, carry out, bring about" },
  { fa: "شبه‌جملات موصولی غیرتوصیفی با ویرگول", en: "Non-Defining Relative Clauses", focus: "Which, whose, whom with commas" },
  { fa: "افعال وجهی گذشته برای احتمال و سرزنش", en: "Past Modals of Deduction & Regret", focus: "Should have, could have, must have been" },
  { fa: "کلوکیشن‌های سطح بالا برای مقاله‌نویسی آیلتس", en: "High-Tier Academic Collocations", focus: "Profound impact, compelling evidence" },
  { fa: "نشانه‌گذاری و حروف ربط متضاد", en: "Concession Connectors", focus: "Whereas, despite, nevertheless, albeit" },
  { fa: "اصطلاحات استعاری و ضرب‌المثل‌های شغلی", en: "Workplace Metaphors & Idioms", focus: "Cut corners, think outside the box" },
  { fa: "مناظره و دفاع ساختاریافته از عقیده (Boss Level)", en: "Structured Debate & Defense (B2 Boss)", focus: "Rebuttal, nuanced counterarguments" },
];

const C1_TOPICS: LevelTopic[] = [
  { fa: "وارونگی دستوری برای تاکید بلاغی", en: "Grammatical Inversion for Emphasis", focus: "Seldom have I, Under no circumstances" },
  { fa: "جملات شکافته و تمرکز بر اطلاعات مهم", en: "Cleft Sentences & Information Focus", focus: "What concerns me most is, It was X that" },
  { fa: "حالت التزامی و فرم‌های فرضی پیشرفته", en: "Advanced Subjunctive Mood", focus: "It is imperative that he submit" },
  { fa: "کلوکیشن‌های ادبی و واژگان تخصصی انتزاعی", en: "Abstract Academic Lexicon", focus: "Pervasive, unprecedented, dichotomy" },
  { fa: "شبه‌جملات فاعلی با وجه وصفی (Participle Clauses)", en: "Participle Clauses in Discourse", focus: "Having completed the thesis, walking through" },
  { fa: "طنز، کنایه و ظرایف زبانی در سخنرانی", en: "Irony, Sarcasm & Tonal Nuance", focus: "Subtle understatement, euphemisms" },
  { fa: "افعال ربطی مقاله‌نویسی بین‌المللی", en: "Advanced Discourse Markers", focus: "Notwithstanding, hitherto, in retrospect" },
  { fa: "اصطلاحات بومی پیچیده و مَثَل‌های کلاسیک", en: "Idiomatic Mastery & Classical Adages", focus: "Burn the midnight oil, blessing in disguise" },
  { fa: "فهم گفتار متصل بسیار سریع و فشرده", en: "Connected Speech Acoustic Decoding", focus: "Elision, assimilation, weak vowels" },
  { fa: "سخنرانی تد و دفاعیه تز دکتری (Boss Level)", en: "Keynote Delivery & Dissertation Defense (C1 Boss)", focus: "Rhetorical mastery, scholarly critique" },
];

const C2_TOPICS: LevelTopic[] = [
  { fa: "تسلط بر بلاغت و آرایه‌های ادبی زبان انگلیسی", en: "Rhetorical Devices & Stylistic Variations", focus: "Alliteration, antithesis, chiasmus" },
  { fa: "رمزگشایی لهجه‌های غیرمعمول و متلک‌های محلی", en: "Rare Regional Dialects & Slang", focus: "Archaic idioms, colloquial nuance" },
  { fa: "نگارش مقالات فلسفی و نقد ادبی عمیق", en: "Philosophical & Critical Discourse", focus: "Epistemological rigor, deconstruction" },
  { fa: "ظرافت در ادراک تمایزهای معنایی باریک", en: "Subtle Semantic Differentiation", focus: "Connotation vs denotation, hyperbole" },
  { fa: "بداهه‌گویی در سطح سخنران بومی فرهیخته", en: "Native-Level Spontaneous Eloquence", focus: "Impromptu speech, cadence and poise" },
  { fa: "ساختارهای نحوی نادر و ترکیبات تاریخی", en: "Archaic & Classical Syntax Patterns", focus: "Inverted conditionals: Had it not been for" },
  { fa: "نقد و تحلیل متون دیپلماتیک و اسناد حقوقی", en: "Diplomatic & Legal Lexicon", focus: "Unambiguous parsing of bilateral treaties" },
  { fa: "انعطاف زبانی و بازی با کلمات در بالاترین سطح", en: "Linguistic Agility & Wordplay", focus: "Puns, wit, intellectual banter" },
  { fa: "شنیداری پیشرفته: نویز بالا و سرعت مافوق طبیعی", en: "High-Distortion Audio Comprehension", focus: "Rapid courtroom cross-examinations" },
  { fa: "اوج استادی زبان انگلیسی (The Grandmaster Boss)", en: "The Grandmaster of English Mastery (C2 Boss)", focus: "Flawless bilingual articulation" },
];

function buildTierSkillLevels(tier: CefrLevel, skill: SkillKey, topics: LevelTopic[]): GameLevel[] {
  const baseReward = tier === "B2" ? 120 : tier === "C1" ? 150 : 200;

  return topics.map((t, idx) => {
    const lvlNum = idx + 1;
    return {
      levelNumber: lvlNum,
      cefr: tier,
      skill,
      titleFa: t.fa,
      titleEn: t.en,
      descriptionFa: `تمرین و چالش تسلط بر ${t.focus} در سطح ${tier}.`,
      xpReward: baseReward + lvlNum * 8,
      timeLimitSeconds: 45,
      questions: [
        {
          id: `${skill[0]}-${tier.toLowerCase()}-${lvlNum}-1`,
          type:
            skill === "listening"
              ? "audio-detective"
              : skill === "reading"
              ? "speed-reader"
              : skill === "writing"
              ? "sentence-smith"
              : skill === "grammar"
              ? "syntax-architect"
              : "vocab-blitz",
          prompt: `چالش تخصصی مرحله ${lvlNum} سطح ${tier} (${skill}): ${t.en}`,
          promptFa: `کدام مورد گزاره تحلیلی صحیح مربوط به ${t.fa} را بیان می‌کند؟`,
          audioText: `At the ${tier} level of English, scholars must demonstrate impeccable control over ${t.focus}.`,
          passage: `ADVANCED DISCOURSE ARCHIVE (${tier}): The comprehensive investigation into ${t.en} reveals that linguistic accuracy coupled with pragmatic competence forms the hallmark of true language mastery.`,
          targetSentence: `Under no circumstances should researchers underestimate the profound influence of ${t.focus}.`,
          scrambledTokens: ["the importance of", "Under no circumstances", "should we overlook", t.focus],
          correctOrder: ["Under no circumstances", "should we overlook", "the importance of", t.focus],
          options: [
            `پاسخ تحلیلی منطبق بر معیارهای پیشرفته ${tier}: تاکید بر استدلال موثق و انسجام مفهومی`,
            "تکرار کلیشه‌های زبانی بدون ارائه ادله مستند",
            "ساده‌سازی بیش از حد مفاهیم پیچیده",
            "نادیده گرفتن بافت متنی و پیامدهای زبانی",
          ],
          correctAnswer: 0,
          explanationFa: `نکته کلیدی سطح ${tier}: تسلط بر ${t.focus} موجب تمایز زبان‌آموز نخبه و ارتقای چشمگیر روانی کلام می‌شود.`,
        },
        {
          id: `${skill[0]}-${tier.toLowerCase()}-${lvlNum}-2`,
          type:
            skill === "listening"
              ? "audio-detective"
              : skill === "reading"
              ? "speed-reader"
              : skill === "writing"
              ? "sentence-smith"
              : "vocab-blitz",
          prompt: `بررسی ظرایف مفهومی ${t.en}:`,
          promptFa: `کدام کلوکیشن یا ساختار نحوی بافت حرفه‌ای‌تری ایجاد می‌کند؟`,
          audioText: `Notice how the speaker subtly modulates tone to convey skepticism rather than outright denial.`,
          passage: `Furthermore, stylistic precision at the ${tier} band enables speakers to navigate ambiguity with remarkable dexterity.`,
          targetSentence: `The data presented provides compelling evidence in support of this hypothesis.`,
          options: [
            "گزینه آکادمیک: کاربرد دقیق واژگان کنایی و نشانگرهای کلامی منسجم",
            "استفاده از جملات ناقص و عامیانه در متون رسمی",
            "ابهام در مرجع ضمایر و گسستگی میان پاراگراف‌ها",
            "عدم هماهنگی زمان افعال در بخش‌های مختلف",
          ],
          correctAnswer: 0,
          explanationFa: `نکته آموزشی ${tier}: کاربرد به جای نشانگرهای گفتمانی، انسجام متن را به حداکثر می‌رساند.`,
        },
        {
          id: `${skill[0]}-${tier.toLowerCase()}-${lvlNum}-3`,
          type:
            skill === "listening"
              ? "audio-detective"
              : skill === "reading"
              ? "speed-reader"
              : skill === "writing"
              ? "sentence-smith"
              : "vocab-blitz",
          prompt: `جمع‌بندی آزمون مرحله ${lvlNum} سطح ${tier}:`,
          promptFa: `استراتژی برتر برای تثبیت این مهارت در مکالمات واقعی چیست؟`,
          audioText: `Mastery at this zenith requires internalizing these syntactic subtleties into spontaneous production.`,
          targetSentence: `True fluency emerges when grammatical complexity becomes an instinctive tool for thought.`,
          options: [
            "تولید خودانگیخته جملات و تفکر مستقیم به زبان انگلیسی بدون اتکا به ترجمه درونی",
            "ترجمه واژه به واژه قواعد در ذهن پیش از شروع تکلم",
            "حفظ کردن جملات آماده بدون توجه به موقعیت مکالمه",
            "پرهیز از شرکت در گفتگوهای چالش‌برانگیز",
          ],
          correctAnswer: 0,
          explanationFa: `دستورالعمل جامع ${tier}: بازتولید آزادانه ایده‌ها بدون درنگ ذهنی، نشان اصلی تسلط بومی است.`,
        },
      ],
    };
  });
}

export function getTierLevels(tier: "B2" | "C1" | "C2", skill: SkillKey): GameLevel[] {
  const topics = tier === "B2" ? B2_TOPICS : tier === "C1" ? C1_TOPICS : C2_TOPICS;
  return buildTierSkillLevels(tier, skill, topics);
}
