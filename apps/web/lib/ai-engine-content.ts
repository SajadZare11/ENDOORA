export type AiCapabilityKey =
  | "learner_twin"
  | "ielts_evaluator"
  | "voice_roleplay"
  | "grammar_hex";

export interface AiPromptTemplate {
  id: string;
  capabilityKey: AiCapabilityKey;
  name: string;
  description: string;
  systemPrompt: string;
  temperature: number;
  topP: number;
  maxOutputTokens: number;
  assignedModel: string;
  fallbackModel: string;
  version: number;
  isDeployed: boolean;
  updatedAt: string;
  updatedBy: string;
}

export interface AiModelRoutingRule {
  capabilityKey: AiCapabilityKey;
  capabilityLabel: string;
  primaryModel: string;
  secondaryModel: string;
  enableAutoFallback: boolean;
  timeoutMs: number;
  retryCount: number;
  status: "healthy" | "degraded" | "failing";
  avgLatencyMs: number;
  successRatePercent: number;
}

export interface AiSafetyAndBudgetConfig {
  globalKillSwitch: boolean;
  killSwitchReason?: string;
  dailyTokenBudget: number;
  tokensConsumedToday: number;
  costEstimateUsdToday: number;
  budgetAlertThresholdPercent: number;
  safetyLevel: "low" | "medium" | "strict";
  blockedHarmfulCallsToday: number;
}

export interface AiBenchmarkCase {
  id: string;
  title: string;
  capabilityKey: AiCapabilityKey;
  targetBand: number;
  sampleInput: string;
  expectedScoreRange: { min: number; max: number };
  lastRunResult?: {
    assignedBand: number;
    latencyMs: number;
    tokensUsed: number;
    passed: boolean;
    executedAt: string;
    feedbackSummary: string;
    subScores: {
      taskAchievement: number;
      coherenceCohesion: number;
      lexicalResource: number;
      grammaticalAccuracy: number;
    };
  };
}

export interface AiEngineStats {
  totalPromptsConfigured: number;
  activeModelsCount: number;
  totalTokensToday: number;
  estCostTodayUsd: number;
  fallbackEventsToday: number;
  benchmarkPassRatePercent: number;
  globalKillSwitchActive: boolean;
}

export const AVAILABLE_AI_MODELS = [
  { id: "gemini-1.5-flash", name: "Google Gemini 1.5 Flash (Ultra-Fast & Cost-Efficient)", provider: "Google DeepMind" },
  { id: "gemini-1.5-pro", name: "Google Gemini 1.5 Pro (High Reasoning & Long Context)", provider: "Google DeepMind" },
  { id: "gemini-2.0-flash-exp", name: "Google Gemini 2.0 Flash (Next-Gen Multimodal)", provider: "Google DeepMind" },
  { id: "gpt-4o-mini", name: "OpenAI GPT-4o Mini (Fallback Cloud)", provider: "OpenAI" },
  { id: "claude-3-5-haiku", name: "Anthropic Claude 3.5 Haiku (Fast Logic)", provider: "Anthropic" },
  { id: "local-mock-deterministic", name: "Endoora Local Offline Mock (Zero Token Cost)", provider: "Endoora Engine" },
];

export const INITIAL_AI_PROMPTS: AiPromptTemplate[] = [
  {
    id: "prompt-twin-001",
    capabilityKey: "learner_twin",
    name: "دوقلوی هوش مصنوعی و پشتیبان یادگیری (Learner Twin Companion)",
    description: "شخصیت همراه و همدل زبان‌آموز، متناسب با سطح CEFR کاربر، ارائه بازخورد تشویقی و ایجاد عادات روزانه مطالعه.",
    systemPrompt: `You are the Endoora AI Learner Twin—an empathetic, highly encouraging, and adaptive English study companion.
Your mission is to guide the student toward natural language fluency using the CEFR framework.
Rules:
1. Always adapt your vocabulary and sentence length to the user's estimated level (A1 to C1).
2. Praise effort before gently correcting grammar mistakes. Do not overwhelm with more than 1-2 corrections per turn.
3. If the user writes in Persian, reply warmly in Persian first, then offer a natural English phrase for what they wanted to say.
4. Keep turns conversational, asking 1 open-ended follow-up question to provoke speaking/writing practice.`,
    temperature: 0.7,
    topP: 0.9,
    maxOutputTokens: 1024,
    assignedModel: "gemini-1.5-flash",
    fallbackModel: "gemini-1.5-pro",
    version: 4,
    isDeployed: true,
    updatedAt: "2026-11-14T11:20:00Z",
    updatedBy: "مدیر ارشد هوش مصنوعی",
  },
  {
    id: "prompt-ielts-001",
    capabilityKey: "ielts_evaluator",
    name: "مصحح و ارزیاب هوشمند مقالات آیلتس (IELTS Academic Writing & Speaking Evaluator)",
    description: "ارزیابی سخت‌گیرانه و دقیق رایتینگ تسک ۲ بر اساس استانداردهای رسمی ۴ گانه کمبریج (TR, CC, LR, GRA) همراه با استخراج نمره باند.",
    systemPrompt: `You are an elite, certified Cambridge IELTS Examiner for Academic Writing Task 2.
Evaluate the candidate's essay strictly according to the official IELTS Band Descriptors (Bands 1-9 in 0.5 increments):
1. Task Response (TR): Address all parts of prompt, clear position, well-developed arguments.
2. Coherence and Cohesion (CC): Paragraphing, logical sequencing, accurate cohesive devices.
3. Lexical Resource (LR): Wide range, natural collocations, minimal spelling/formation slips.
4. Grammatical Range and Accuracy (GRA): Mix of complex/simple structures, punctuation, frequency of errors.

Output format MUST be valid JSON with this exact schema:
{
  "overallBand": number,
  "subScores": {
    "taskAchievement": number,
    "coherenceCohesion": number,
    "lexicalResource": number,
    "grammaticalAccuracy": number
  },
  "keyStrengths": string[],
  "priorityImprovements": string[],
  "inlineCorrections": [
    {"original": string, "suggested": string, "explanation": string}
  ],
  "examinerSummary": string
}`,
    temperature: 0.2,
    topP: 0.8,
    maxOutputTokens: 2048,
    assignedModel: "gemini-1.5-pro",
    fallbackModel: "gemini-1.5-flash",
    version: 7,
    isDeployed: true,
    updatedAt: "2026-11-15T09:45:00Z",
    updatedBy: "سرپرست سنجش آیلتس",
  },
  {
    id: "prompt-roleplay-001",
    capabilityKey: "voice_roleplay",
    name: "سناریوهای تعاملی صوتی و نقش‌آفرینی (Voice Roleplay Scenarios)",
    description: "شبیه‌سازی موقعیت‌های واقعی دنیای واقعی (فرودگاه، مصاحبه استخدامی، کافه و مذاکرات تجاری) به صورت مکالمه‌ای روان.",
    systemPrompt: `You are an interactive English conversational partner acting out real-life situational roleplays (Airport immigration, Job interview, Coffee shop order, Academic seminar).
Rules:
1. Stay strictly in character for the chosen scenario. Never break immersion by saying 'As an AI...'.
2. Keep your spoken responses concise (1-3 sentences) suitable for real-time Text-To-Speech (TTS).
3. Use natural colloquial expressions, interjections, and natural pauses.
4. If the user struggles or pauses, provide an encouraging prompt or repeat your question politely.`,
    temperature: 0.85,
    topP: 0.95,
    maxOutputTokens: 512,
    assignedModel: "gemini-1.5-flash",
    fallbackModel: "local-mock-deterministic",
    version: 3,
    isDeployed: true,
    updatedAt: "2026-11-13T16:10:00Z",
    updatedBy: "طراح دوره‌های مکالمه",
  },
  {
    id: "prompt-grammar-001",
    capabilityKey: "grammar_hex",
    name: "آزمایشگاه تطبیقی گرامر ۶ گوشه (Grammar Hex Diagnostic Lab)",
    description: "تحلیل الگوهای تکرارشونده خطاهای دستوری فارسی‌زبانان (زمان‌ها، حروف اضافه، جملات شرطی) و خلق تمارین تشخیصی فوری.",
    systemPrompt: `You are the Grammar Hex Diagnostic Engine.
Your role is to detect structural misconceptions in Persian-speaking English learners (e.g. L1 interference with prepositions, tense confusion between Past Simple and Present Perfect, double negation).
Analyze the input sentence:
1. Identify the exact error category according to CEFR Grammar matrix.
2. Explain the root misconception clearly in Persian.
3. Provide the corrected English sentence.
4. Generate 2 targeted micro-drill questions to reinforce the correct grammatical rule.`,
    temperature: 0.3,
    topP: 0.85,
    maxOutputTokens: 1024,
    assignedModel: "gemini-1.5-flash",
    fallbackModel: "gemini-1.5-pro",
    version: 2,
    isDeployed: true,
    updatedAt: "2026-11-12T14:00:00Z",
    updatedBy: "دپارتمان گرامر کاربردی",
  },
];

export const INITIAL_ROUTING_RULES: AiModelRoutingRule[] = [
  {
    capabilityKey: "learner_twin",
    capabilityLabel: "دوقلوی هوش مصنوعی (Companion)",
    primaryModel: "gemini-1.5-flash",
    secondaryModel: "gemini-1.5-pro",
    enableAutoFallback: true,
    timeoutMs: 4500,
    retryCount: 2,
    status: "healthy",
    avgLatencyMs: 640,
    successRatePercent: 99.4,
  },
  {
    capabilityKey: "ielts_evaluator",
    capabilityLabel: "مصحح مقالات آیلتس (Writing & Speaking)",
    primaryModel: "gemini-1.5-pro",
    secondaryModel: "gemini-1.5-flash",
    enableAutoFallback: true,
    timeoutMs: 8000,
    retryCount: 2,
    status: "healthy",
    avgLatencyMs: 1420,
    successRatePercent: 98.9,
  },
  {
    capabilityKey: "voice_roleplay",
    capabilityLabel: "سناریوهای صوتی رول‌پلی (Real-time Audio)",
    primaryModel: "gemini-1.5-flash",
    secondaryModel: "local-mock-deterministic",
    enableAutoFallback: true,
    timeoutMs: 3000,
    retryCount: 1,
    status: "healthy",
    avgLatencyMs: 480,
    successRatePercent: 99.8,
  },
  {
    capabilityKey: "grammar_hex",
    capabilityLabel: "تحلیل گرامر تطبیقی (Grammar Hex)",
    primaryModel: "gemini-1.5-flash",
    secondaryModel: "gemini-1.5-pro",
    enableAutoFallback: true,
    timeoutMs: 4000,
    retryCount: 2,
    status: "healthy",
    avgLatencyMs: 590,
    successRatePercent: 99.1,
  },
];

export const INITIAL_SAFETY_BUDGET: AiSafetyAndBudgetConfig = {
  globalKillSwitch: false,
  dailyTokenBudget: 6000000, // 6 Million Tokens/Day
  tokensConsumedToday: 1845200,
  costEstimateUsdToday: 1.38,
  budgetAlertThresholdPercent: 85,
  safetyLevel: "medium",
  blockedHarmfulCallsToday: 14,
};

export const INITIAL_BENCHMARK_CASES: AiBenchmarkCase[] = [
  {
    id: "bm-case-001",
    title: "انشای نمونه باند ۵.۰ آیلتس (سطح متوسط ضعیف - خطاهای ساختاری مکرر)",
    capabilityKey: "ielts_evaluator",
    targetBand: 5.0,
    sampleInput: `Nowadays many people think that technology makes our life easy but some other people say it is bad. In my opinion technology has some good things and also bad things.
First of all, mobile phones are very good because we can talk with our friends very fast. Also internet is good for search information. But when people use phone too much they dont speak together and family is breaking.
In the second, children play computer games all day and they become lazy and fat. This is very danger for their health and eyes.
In conclusion, I think technology is useful but we must not use it too much otherwise it has many problems for society.`,
    expectedScoreRange: { min: 4.5, max: 5.5 },
    lastRunResult: {
      assignedBand: 5.0,
      latencyMs: 1280,
      tokensUsed: 610,
      passed: true,
      executedAt: "2026-11-15T12:00:00Z",
      feedbackSummary: "کالیبراسیون دقیق: انشا ساختار پاراگراف دارد اما دایره واژگان ساده و خطاهای دستوری مانع از ارتقا به باند ۶ شده است.",
      subScores: {
        taskAchievement: 5.0,
        coherenceCohesion: 5.0,
        lexicalResource: 5.0,
        grammaticalAccuracy: 5.0,
      },
    },
  },
  {
    id: "bm-case-002",
    title: "انشای نمونه باند ۷.۰ آیلتس (سطح خوب - استدلال منسجم با خطاهای جزئی)",
    capabilityKey: "ielts_evaluator",
    targetBand: 7.0,
    sampleInput: `In the contemporary era, the proliferation of digital technology has fundamentally transformed how human beings communicate and work. While some detractors argue that technological advancement fosters social isolation, I contend that its advantages, particularly in terms of global connectivity and educational accessibility, significantly outweigh the drawbacks.
To begin with, modern telecommunications have effectively dismantled geographical barriers. In the past, international collaboration was both sluggish and costly; however, sophisticated videoconferencing platforms now enable multinational teams and students to interact seamlessly in real time. Moreover, open-access educational repositories allow learners from developing nations to access premium academic resources that were previously unattainable.
Conversely, excessive dependency on smart gadgets can precipitate sedentary lifestyles and diminish interpersonal empathy. Nevertheless, these ramifications stem from poor individual self-regulation rather than the intrinsic flaws of technology itself.
In conclusion, while the digital revolution undoubtedly presents specific psychological challenges, its role as a catalyst for educational empowerment and worldwide cohesion is undeniable.`,
    expectedScoreRange: { min: 6.5, max: 7.5 },
    lastRunResult: {
      assignedBand: 7.0,
      latencyMs: 1540,
      tokensUsed: 780,
      passed: true,
      executedAt: "2026-11-15T12:05:00Z",
      feedbackSummary: "تطابق ایده‌آل با استانداردهای باند ۷: واژگان دانشگاهی مناسب، ساختارهای گرامری پیچیده و ارجاع منطقی در طول متن.",
      subScores: {
        taskAchievement: 7.0,
        coherenceCohesion: 7.5,
        lexicalResource: 7.0,
        grammaticalAccuracy: 7.0,
      },
    },
  },
  {
    id: "bm-case-003",
    title: "انشای نمونه باند ۸.۵ آیلتس (سطح حرفه‌ای - زبان آکادمیک فاخر و تسلط کامل)",
    capabilityKey: "ielts_evaluator",
    targetBand: 8.5,
    sampleInput: `The inexorable march of technological innovation has precipitated an unprecedented paradigm shift in the fabric of human society. While a vocal contingent of cultural critics laments the ostensible erosion of authentic social cohesion, I would argue that technological convergence serves as a profound catalyst for intellectual democratization and transnational collaboration, provided its implementation is governed by rigorous ethical frameworks.
Central to this discourse is the democratizing capacity of pervasive computing. By decentralized dissemination of scholarly literature and open-source pedagogy, geographic insularity no longer dictates cognitive development. Furthermore, the advent of AI-driven diagnostic tools in medicine and automated linguistic decoders has fundamentally reshaped public welfare and cross-cultural discourse.
Admittedly, unmitigated screen immersion and algorithmic echo chambers pose palpable threats to cognitive autonomy and psychological well-being. However, categorizing these socio-technical vulnerabilities as inherent defects of technological progression is intellectually reductive; they are rather symptoms of institutional latency in fostering digital literacy.
To conclude, the socio-economic dividends yielded by technological advancement overwhelmingly eclipse its peripheral liabilities. Humanity must consciously cultivate digital stewardship rather than succumbing to anachronistic technophobia.`,
    expectedScoreRange: { min: 8.0, max: 9.0 },
    lastRunResult: {
      assignedBand: 8.5,
      latencyMs: 1690,
      tokensUsed: 890,
      passed: true,
      executedAt: "2026-11-15T12:10:00Z",
      feedbackSummary: "عملکرد درخشان و کالیبره: دایره واژگان تخصصی و آکادمیک بسیار غنی، تنوع ساختارهای نحوی پیچیده و کنترل بی‌نقص بر لحن رسمی.",
      subScores: {
        taskAchievement: 8.5,
        coherenceCohesion: 8.5,
        lexicalResource: 9.0,
        grammaticalAccuracy: 8.5,
      },
    },
  },
];
