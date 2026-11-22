"use client";

import { Button } from "@endoora/ui";
import Link from "next/link";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { endooraApi, EndooraApiError } from "@/lib/endoora-api";
import EndooraBackground from "@/components/design/EndooraBackground";
import GlassCard from "@/components/design/GlassCard";
import { AudioWaveformPlayer } from "./AudioWaveformPlayer";
import { AudioRecorder } from "./AudioRecorder";
import { WritingEditor } from "./WritingEditor";
import {
  AdaptiveItem,
  AdaptiveState,
  createInitialAdaptiveState,
  updateAdaptiveState,
  selectNextAdaptiveItem,
  isItemCorrect,
  calculatePlacementSummary,
  CEFR_DESCRIPTIONS,
  CefrLevel,
  SectionType,
  SECTION_ITEM_QUOTAS,
  SECTION_DURATIONS,
  TOTAL_ADMINISTERED_ITEMS,
} from "@/lib/adaptive-engine";
import { FULL_CALIBRATED_ITEMS_BANK } from "@/lib/placement-item-bank";
import styles from "@/components/placement/placement.module.css";

type Locale = "fa" | "en";

type SessionAccount = {
  email?: string;
  first_name?: string;
  full_name?: string;
  role?: string;
};

type AuthState =
  | { kind: "checking" }
  | { kind: "anonymous" }
  | { account: SessionAccount; kind: "authenticated" };

interface PlacementAnswerRecord {
  idempotency_key: string;
  question_key: string;
  question_version_id?: string | null;
  answer_value: {
    selected_option?: string;
    spoken_text?: string;
    written_text?: string;
    [key: string]: unknown;
  };
  created_at: string;
  updated_at: string;
}

interface PlacementSessionData {
  id: string;
  status: "active" | "submitted" | "expired";
  current_section: string;
  started_at: string;
  section_started_at: string;
  section_time_remaining_sec: number;
  updated_at: string;
  expires_at: string;
  is_expired: boolean;
  is_active: boolean;
  answers_count: number;
  answers: PlacementAnswerRecord[];
}

const SECTIONS_ORDER: SectionType[] = [
  "grammar",
  "vocabulary",
  "reading",
  "listening",
  "speaking",
  "writing",
];

// Dynamic 50-item quotas: Grammar 15, Vocab 15, Reading 5, Listening 5, Speaking 5, Writing 5

// Full calibrated item bank (348 items across A1-C2)
const DEFAULT_ITEMS_BANK: AdaptiveItem[] = FULL_CALIBRATED_ITEMS_BANK;

const t = {
  fa: {
    heroTag: "موتور انطباقی پیشرفته ایندورا (CAT)",
    heroTitle: "سامانه سنجش و تعیین سطح هوشمند اندورا (Endoora Engine)",
    heroDesc: "این ارزیابی چندمرحله‌ای به صورت هوشمند و انطباقی با دقت پاسخ‌های شما تنظیم می‌شود: پاسخ‌های صحیح سوالات سطح بالاتر را فعال می‌کنند تا سطح واقعی شما (از A1 تا C2) با حداکثر دقت سنجیده شود.",
    questionCounter: "سوال",
    of: "از",
    section: "بخش",
    grammar: "دستور زبان",
    vocabulary: "واژگان",
    reading: "درک مطلب",
    listening: "شنیداری",
    speaking: "گفتاری",
    writing: "نگارش",
    next: "سوال بعدی",
    prev: "سوال قبلی",
    submit: "ثبت نهایی و صدور کارنامه",
    submitting: "در حال ثبت نهایی و تحلیل نتایج...",
    savedStatus: "پاسخ‌ها به صورت خودکار با مهر زمانی سرور ذخیره می‌شوند.",
    savedStatusShort: "ذخیره زنده",
    offlineWarning: "اتصال اینترنت قطع است. آخرین پاسخ تأییدشده حفظ می‌شود؛ نگران از دست رفتن اطلاعات نباشید.",
    expiredAlert: "نشست آزمون شما منقضی شده است. برای حفظ اعتبار آموزشی، لطفا یک نشست جدید شروع کنید.",
    startNewSession: "شروع نشست جدید",
    completedTitle: "آزمون هوشمند تعیین سطح با موفقیت ثبت شد!",
    completedDesc: "پاسخ‌های شما توسط موتور انطباقی پردازش شد و سطح دقیق شما در شاخص ۰ تا ۱۰۰ سنجش اندورا (Endoora Index) و چارچوب بین‌المللی CEFR تعیین گردید. اکنون می‌توانید کارنامه تحلیلی خود را مشاهده کنید.",
    viewReport: "مشاهده کارنامه جامع تعیین سطح",
    goToDashboard: "ورود به داشبورد زبان‌آموز",
    authNotice: "برای اتصال این پاسخ‌ها به پروفایل آموزشی خود، در سامانه وارد شده‌اید.",
    pretestKicker: "سامانه سنجش و تعیین سطح هوشمند اندورا",
    pretestTitle: "سنجش هوشمند و انطباقی سطح زبان انگلیسی (A1 تا C2)",
    pretestDesc: "این سیستم ارزیابی انطباقی (CAT) اختصاصی اندورا بر اساس تئوری مدرن پاسخ به سوال (IRT/Rasch)، سطح دشواری سوالات را بر اساس توانایی واقعی شما تنظیم می‌کند. سوالات تکراری حذف شده و با پاسخ درست، سوالات چالشی‌تر ظاهر می‌شوند.",
    skillsHeader: "مهارت‌های ۶ گانه مورد سنجش در این آزمون (۵۰ سوال)",
    skill1: "دستور زبان (Grammar) · ۱۵ سوال (۱۵ دقیقه)",
    skill2: "واژگان (Vocabulary) · ۱۵ سوال (۱۵ دقیقه)",
    skill3: "درک مطلب (Reading) · ۵ سوال (۱۲ دقیقه)",
    skill4: "شنیداری (Listening) · ۵ سوال (۱۰ دقیقه) با صوت بومی",
    skill5: "گفتاری (Speaking) · ۵ سوال (۱۰ دقیقه) ضبط صدا و روانی کلام",
    skill6: "نگارش (Writing) · ۵ سوال (۱۰ دقیقه) ارزیابی نوشتار",
    authChecking: "در حال بررسی وضعیت حساب کاربری...",
    authedNoticeTitle: "حساب کاربری متصل است",
    authedNoticeDesc: "پاسخ‌های شما با مهر زمانی سرور در پروفایلتان ذخیره می‌شوند و کارنامه نهایی به داشبورد شما اضافه خواهد شد.",
    startTestBtn: "شروع آزمون انطباقی تعیین سطح (۵۰ سوال)",
    unauthedTitle: "برای ذخیره نتایج آزمون در پروفایل، ابتدا وارد شوید یا ثبت‌نام کنید",
    unauthedDesc: "این آزمون انطباقی سطح شما را به‌صورت تقریبی در شاخص اختصاصی ۰ تا ۱۰۰ اندورا محاسبه می‌کند. برای ثبت دائمی در پروفایل و دریافت برنامه یادگیری اختصاصی، پیشنهاد می‌کنیم وارد شوید.",
    signInBtn: "ورود به حساب کاربری",
    registerBtn: "ثبت‌نام سریع و رایگان",
    guestBtn: "ادامه به عنوان مهمان (آزمون آزمایشی)",
    guestPillNotice: "حالت آزمایشی (مهمان): نتایج در حافظه موقت مرورگر ذخیره می‌شوند.",
    guestPillAction: "ورود یا ثبت‌نام برای ذخیره‌سازی دائمی",
    unauthedSubmittedDesc: "نتیجه مهمان در همین زبانه قابل مشاهده است. برای شروع آزمونی که در حساب ذخیره می‌شود وارد شوید.",
    registerSaveBtn: "ثبت‌نام برای آزمون حساب کاربری",
    adaptiveLevelLabel: "سطح انطباقی جاری:",
    endooraIndexEstLabel: "شاخص سنجش اندورا:",
    sectionTimeRemaining: "زمان باقی‌مانده این بخش:",
    passageLabel: "متن درک مطلب (Reading Passage)",
  },
  en: {
    heroTag: "Endoora Advanced CAT Adaptive Engine",
    heroTitle: "Proprietary Endoora Adaptive Placement Assessment",
    heroDesc: "This multi-stage test adapts dynamically in real time to your demonstrated ability: correct answers unlock higher-level challenges to pinpoint your exact CEFR level (A1 to C2) with maximum precision.",
    questionCounter: "Question",
    of: "of",
    section: "Section",
    grammar: "Grammar",
    vocabulary: "Vocabulary",
    reading: "Reading Comprehension",
    listening: "Listening",
    speaking: "Speaking",
    writing: "Writing",
    next: "Next question",
    prev: "Previous question",
    submit: "Submit and Generate Certificate",
    submitting: "Submitting and evaluating results...",
    savedStatus: "Answers are saved automatically with server timestamps.",
    savedStatusShort: "Live Autosave",
    offlineWarning: "You are currently offline. Your last confirmed answers are preserved.",
    expiredAlert: "Your placement session has expired. Please start a new session to ensure accurate evaluation.",
    startNewSession: "Start new session",
    completedTitle: "Adaptive placement test completed successfully!",
    completedDesc: "Your responses have been processed by the Computer-Adaptive Testing engine. Your verified Endoora Placement Index (0–100) and CEFR level are ready.",
    viewReport: "View Comprehensive Placement Report",
    goToDashboard: "Go to learner dashboard",
    authNotice: "You are signed in and your answers are linked to your learning profile.",
    pretestKicker: "Endoora Proprietary Adaptive Placement System",
    pretestTitle: "Adaptive Diagnostic Assessment (CEFR A1 to C2)",
    pretestDesc: "This proprietary Computer-Adaptive Testing (CAT) system utilizes Item Response Theory (1-PL Rasch) to adjust question difficulty in real time based on your accuracy. Correct answers step up to advanced CEFR tiers.",
    skillsHeader: "Evaluated Competencies (50 Items)",
    skill1: "Grammar · 15 Items (15 min)",
    skill2: "Vocabulary · 15 Items (15 min)",
    skill3: "Reading · 5 Items (12 min)",
    skill4: "Listening · 5 Items (10 min) Authentic Spoken Audio",
    skill5: "Speaking · 5 Items (10 min) Speech & Fluency",
    skill6: "Writing · 5 Items (10 min) Text Analysis",
    authChecking: "Checking account status...",
    authedNoticeTitle: "Learner Account Connected",
    authedNoticeDesc: "Your responses are securely autosaved to your profile, and your comprehensive diagnostic report will be accessible in your dashboard.",
    startTestBtn: "Start Adaptive Placement Test (50 Items)",
    unauthedTitle: "Sign in or register to save your results to your profile",
    unauthedDesc: "This comprehensive test estimates your 0-100 Endoora Placement Index. To save your results and personalized roadmap in your profile, please sign in or create an account.",
    signInBtn: "Sign in to account",
    registerBtn: "Create free account",
    guestBtn: "Continue as guest (Practice Mode)",
    guestPillNotice: "Guest mode: results are saved in local browser storage.",
    guestPillAction: "Sign in / Register to save permanently",
    unauthedSubmittedDesc: "Assessment completed! Your guest report is available in this browser tab. Sign in to start a saved assessment.",
    registerSaveBtn: "Register for an account assessment",
    adaptiveLevelLabel: "Current Adaptive Level:",
    endooraIndexEstLabel: "Endoora Index Est.:",
    sectionTimeRemaining: "Section Time Remaining:",
    passageLabel: "Reading Passage",
  },
};

function evaluate(items: AdaptiveItem[], values: Record<string,string>) {
  return items.reduce((state,item) => {
    const value = values[item.id];
    if (!value) return state;
    const isCorrect = isItemCorrect(item,value);
    return updateAdaptiveState(state, {itemId:item.id, section:item.section, cefrLevel:(item.cefr_level || "B1") as CefrLevel,
      isCorrect, scorePercentage:isCorrect ? 100 : 0});
  },createInitialAdaptiveState());
}

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
}

export function PlacementRunner({ initialLocale = "fa" }: { initialLocale?: Locale }) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [allQuestionsPool, setAllQuestionsPool] = useState<AdaptiveItem[]>(DEFAULT_ITEMS_BANK);
  const [activeQuestions, setActiveQuestions] = useState<AdaptiveItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [adaptiveState, setAdaptiveState] = useState<AdaptiveState>(createInitialAdaptiveState());
  const [askedItemIds, setAskedItemIds] = useState<Set<string>>(new Set());

  const [session, setSession] = useState<PlacementSessionData | null>(null);
  const [authState, setAuthState] = useState<AuthState>({ kind: "checking" });
  const [hasStarted, setHasStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // Section countdown timer based on section durations (Grammar 15m, Vocab 15m, Reading 12m, Listening 10m, Speaking 10m, Writing 10m)
  const [sectionTimeRemaining, setSectionTimeRemaining] = useState(SECTION_DURATIONS.grammar || 900);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const working = useRef(false);
  const accountResolved = useRef(false);
  const copy = t[locale];
  const currentSection = SECTIONS_ORDER[currentSectionIndex] || "grammar";
  const question: AdaptiveItem = activeQuestions[currentIndex] || DEFAULT_ITEMS_BANK[0];
  const selectedOption = answers[question.id] || "";

  const sectionQuota = SECTION_ITEM_QUOTAS[currentSection] || 5;
  const currentSectionQuestions = activeQuestions.filter((q) => q.section === currentSection);
  const sectionQuestionNumber = Math.max(
    1,
    currentSectionQuestions.findIndex((q) => q.id === question?.id) + 1 || currentSectionQuestions.length || 1
  );

  // Initialize or resume placement session
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      const params = new URLSearchParams(window.location.search);
      const immediate = params.get("start") === "1" || ["1","true"].includes(params.get("guest") || "");
      try {
        const account = await endooraApi<SessionAccount>("/auth/me/");
        if (!isMounted) return;
        accountResolved.current = true;
        setAuthState({kind:"authenticated",account});
        const [data, items] = await Promise.all([
          endooraApi<PlacementSessionData>("/placement/sessions/", {method:"POST"}),
          endooraApi<AdaptiveItem[]>("/placement/questions/"),
        ]);
        if (!isMounted) return;
        const pool = [...DEFAULT_ITEMS_BANK, ...items.filter(i => !DEFAULT_ITEMS_BANK.some(d => d.id === i.id))];
        setAllQuestionsPool(pool);
        setSession(data);
        const restored: Record<string,string> = {};
        const history: AdaptiveItem[] = [];
        for (const answer of [...data.answers].sort((a,b) => a.created_at.localeCompare(b.created_at))) {
          const item = pool.find(q => q.id === answer.question_key);
          if (!item) continue;
          const value = answer.answer_value;
          restored[item.id] = value.selected_option || value.spoken_text || value.written_text || "";
          history.push(item);
        }
        const section = SECTIONS_ORDER.findIndex(sec => sec === data.current_section);
        setCurrentSectionIndex(Math.max(0,section));
        if (data.section_started_at) setSectionTimeRemaining(Math.max(1, data.section_time_remaining_sec -
          Math.floor((Date.now() - Date.parse(data.section_started_at))/1000)));
        const used = new Set(history.map(item => item.id));
        if (history.length && history.at(-1)?.section !== data.current_section) {
          const item = selectNextAdaptiveItem(pool.filter(q => q.section === data.current_section),used,evaluate(history,restored).currentCefr);
          if(item) {history.push(item); used.add(item.id);}
        }
        setAnswers(restored); setActiveQuestions(history); setAskedItemIds(used);
        setAdaptiveState(evaluate(history,restored)); setCurrentIndex(Math.max(0,history.length-1));
        setHasStarted(immediate || history.length > 0);
      } catch (e) {
        if (!isMounted) return;
        if (e instanceof EndooraApiError && [401,403].includes(e.status) && !accountResolved.current) {
          setAuthState({kind:"anonymous"});
          try {
            const draft = JSON.parse(sessionStorage.getItem("endoora_guest__placement_draft") || "null");
            if (draft && Array.isArray(draft.ids) && draft.answers && Date.now() < draft.expires) {
              const items = draft.ids.map((id:string) => DEFAULT_ITEMS_BANK.find(q => q.id === id)).filter(Boolean) as AdaptiveItem[];
              setAnswers(draft.answers); setActiveQuestions(items); setAskedItemIds(new Set(items.map(i => i.id)));
              setAdaptiveState(evaluate(items,draft.answers)); setCurrentIndex(Math.max(0,Math.min(items.length-1,Number(draft.index) || 0)));
              setCurrentSectionIndex(Math.max(0,SECTIONS_ORDER.indexOf((items.at(-1)?.section || "grammar") as SectionType)));
              setSectionTimeRemaining(Math.max(1,Math.round((draft.deadline-Date.now())/1000)));
              setHasStarted(true); return;
            }
          } catch { /* A new guest session can start when browser storage is unavailable. */ }
          setHasStarted(immediate);
        } else setError("دریافت نشست انجام نشد. صفحه را دوباره بارگیری کنید.");
      }
    }
    void initSession();

    function handleOnline() {
      setIsOffline(false);
    }
    function handleOffline() {
      setIsOffline(true);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      isMounted = false;
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const onSectionTimeout = useEffectEvent(async () => {
    if (!working.current) await handleTimeout();
  });
  useEffect(() => {
    if (!hasStarted || isSubmitted || isExpired) return;
    if (sectionTimeRemaining === 0) { void onSectionTimeout(); return; }
    const timer = window.setTimeout(() => setSectionTimeRemaining(value => Math.max(0,value-1)),1000);
    return () => window.clearTimeout(timer);
  }, [hasStarted,isSubmitted,isExpired,sectionTimeRemaining,currentSectionIndex]);

  // Initialize initial adaptive question when test starts
  useEffect(() => {
    if (hasStarted && activeQuestions.length === 0 && allQuestionsPool.length > 0) {
      const sectionItems = allQuestionsPool.filter((q) => q.section === "grammar");
      const targetCefr: CefrLevel = "A2"; // Baseline starting point
      const initialItem = selectNextAdaptiveItem(sectionItems, new Set(), targetCefr) || sectionItems[0];

      if (initialItem) {
        setActiveQuestions([initialItem]);
        setAskedItemIds(new Set([initialItem.id]));
        setCurrentIndex(0);
      }
    }
  }, [hasStarted, activeQuestions.length, allQuestionsPool]);

  useEffect(() => {
    if (authState.kind !== "anonymous" || !hasStarted || !activeQuestions.length || isSubmitted) return;
    try {
      sessionStorage.setItem("endoora_guest__placement_draft",JSON.stringify({
        ids:activeQuestions.map(i => i.id), answers, index:currentIndex,
        expires:Date.now()+24*3600000, deadline:Date.now()+sectionTimeRemaining*1000,
      }));
    } catch { /* Guests can continue in this tab without browser storage. */ }
  },[authState.kind,hasStarted,activeQuestions,answers,currentIndex,isSubmitted,sectionTimeRemaining]);

  async function saveAnswer(key: string, value: string) {
    if (working.current || isExpired || isSubmitted || authState.kind === "checking") return;
    working.current = true; setSaving(true); setError("");
    try {
      if(authState.kind === "authenticated") {
        if (!session) throw new Error("session unavailable");
        await endooraApi("/placement/sessions/"+session.id+"/answers/", {method:"POST",json:{
          question_key:question.id, question_version_id:question.question_version_id || null,
          answer_value:{[key]:value},
        }});
      }
      const next = {...answers,[question.id]:value};
      setAnswers(next); setAdaptiveState(evaluate(activeQuestions,next));
    } catch {setError("پاسخ ذخیره نشد. دوباره تلاش کنید.");}
    finally {working.current = false; setSaving(false);}
  }
  const handleSelectOption = (value:string) => saveAnswer("selected_option",value);
  const handleSaveSpokenAnswer = (value:string) => saveAnswer("spoken_text",value);
  const handleSaveWrittenAnswer = (value:string) => saveAnswer("written_text",value);

  async function advanceSection(section: SectionType) {
    if (authState.kind !== "authenticated") return true;
    try {
      if (!session) throw new Error("session unavailable");
      await endooraApi("/placement/sessions/"+session.id+"/advance/", {method:"POST",json:{section}});
      setError(""); return true;
    } catch {setError("بخش آزمون تغییر نکرد. دوباره تلاش کنید."); return false;}
  }

  // Automatic Section Advance on Timer Timeout (autoAdvance / handleTimeout)
  async function handleTimeout() {
    await handleTimeExpired();
  }

  async function handleTimeExpired() {
    if (isSubmitted || isExpired) return;

    if (currentSectionIndex < SECTIONS_ORDER.length - 1) {
      const nextSecIdx = currentSectionIndex + 1;
      const nextSec = SECTIONS_ORDER[nextSecIdx];
      if (!(await advanceSection(nextSec))) return;
      setCurrentSectionIndex(nextSecIdx);
      setSectionTimeRemaining(SECTION_DURATIONS[nextSec] || 600);


      const secPool = allQuestionsPool.filter((q) => q.section === nextSec);
      const targetCefr = adaptiveState.currentCefr;
      const nextItem = selectNextAdaptiveItem(secPool, askedItemIds, targetCefr) || secPool[0];

      if (nextItem) {
        setActiveQuestions((prev) => [...prev, nextItem]);
        setAskedItemIds((prev) => new Set([...prev, nextItem.id]));
        setCurrentIndex(activeQuestions.length);
      }
    } else {
      // Last section (writing) timed out! Trigger final submission
      handleSubmit();
    }
  }

  // Next Question with Computer-Adaptive Branching
  async function handleNext() {
    // 1. If currently viewing an earlier question, simply move forward in history
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return;
    }

    // Determine correctness of current question's answer for dynamic difficulty branching:
    // If correct -> next question is harder (سخت تر) or same level if at ceiling
    // If incorrect -> next question is easier (اسون تر)
    const currentAnswer = answers[question.id];
    const wasCurrentCorrect =
      currentAnswer !== undefined && currentAnswer !== null && String(currentAnswer).trim().length > 0
        ? isItemCorrect(question, currentAnswer)
        : false;

    // 2. Count how many questions have been asked in the current section
    const currentSectionQuestions = activeQuestions.filter((q) => q.section === currentSection);
    const quota = SECTION_ITEM_QUOTAS[currentSection] || 5;

    let nextSecIdx = currentSectionIndex;
    let nextSec = currentSection;

    // Advance to next competency section if section quota reached
    if (currentSectionQuestions.length >= quota) {
      if (currentSectionIndex < SECTIONS_ORDER.length - 1) {
        nextSecIdx = currentSectionIndex + 1;
        nextSec = SECTIONS_ORDER[nextSecIdx];
        if (!(await advanceSection(nextSec))) return;
      setCurrentSectionIndex(nextSecIdx);
        setSectionTimeRemaining(SECTION_DURATIONS[nextSec] || 600); // Reset timer for new section

      } else {
        // All sections completed! Trigger submission
        handleSubmit();
        return;
      }
    }

    // 3. Dynamically select the next adaptive item:
    // When within the same section, pass wasCurrentCorrect to step up/down difficulty.
    // When entering a new section, seed from current estimated ability tier.
    const secPool = allQuestionsPool.filter((q) => q.section === nextSec);
    const targetCefr = adaptiveState.currentCefr;
    const isSameSection = nextSec === currentSection;
    const nextItem = selectNextAdaptiveItem(
      secPool,
      askedItemIds,
      targetCefr,
      isSameSection ? wasCurrentCorrect : null
    );

    if (nextItem) {
      setActiveQuestions((prev) => [...prev, nextItem]);
      setAskedItemIds((prev) => new Set([...prev, nextItem.id]));
      setCurrentIndex(activeQuestions.length);
    } else {
      // If pool exhausted in this section, transition to next section
      if (currentSectionIndex < SECTIONS_ORDER.length - 1) {
        const nextNextSecIdx = currentSectionIndex + 1;
        const nextNextSec = SECTIONS_ORDER[nextNextSecIdx];
        if (!(await advanceSection(nextNextSec))) return;
        setCurrentSectionIndex(nextNextSecIdx);
        setSectionTimeRemaining(SECTION_DURATIONS[nextNextSec] || 600);
        const nextSecPool = allQuestionsPool.filter((q) => q.section === nextNextSec);
        const fallbackItem = selectNextAdaptiveItem(nextSecPool, askedItemIds, targetCefr, null) || nextSecPool[0];
        if (fallbackItem) {
          setActiveQuestions((prev) => [...prev, fallbackItem]);
          setAskedItemIds((prev) => new Set([...prev, fallbackItem.id]));
          setCurrentIndex(activeQuestions.length);
        } else {
          handleSubmit();
        }
      } else {
        handleSubmit();
      }
    }
  }

  // Previous Question
  function handlePrev() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  // Final Submission
  async function handleSubmit() {
    if (working.current || authState.kind === "checking") return;
    working.current = true; setIsSubmitting(true); setError("");
    try {
      if (authState.kind === "authenticated") {
        if (!session) throw new Error("session unavailable");
        await endooraApi("/placement/sessions/"+session.id+"/submit/", {method:"POST"});
      } else {
        sessionStorage.setItem("endoora_guest__placement_summary",JSON.stringify(calculatePlacementSummary(activeQuestions,answers)));
        sessionStorage.removeItem("endoora_guest__placement_draft");
      }
      setIsSubmitted(true);
    } catch {setError("ثبت نتیجه انجام نشد. دوباره تلاش کنید.");}
    finally {working.current = false; setIsSubmitting(false);}
  }

  function handleRestartSession() {window.location.reload();}

  const totalEstimatedQuestions = TOTAL_ADMINISTERED_ITEMS;
  const isLastQuestion =
    currentSectionIndex === SECTIONS_ORDER.length - 1 &&
    activeQuestions.filter((q) => q.section === currentSection).length >= (SECTION_ITEM_QUOTAS[currentSection] ?? 5);

  return (
    <EndooraBackground>
      <div className={styles.container} dir={locale === "fa" ? "rtl" : "ltr"}>
        {error && <p role="alert">{error}</p>}
        {/* Status Alerts */}
        {isOffline && <div className={`${styles.alert} ${styles.alertWarning}`}>{copy.offlineWarning}</div>}

        {isExpired && (
          <div className={`${styles.alert} ${styles.alertError}`}>
            <p>{copy.expiredAlert}</p>
            <Button type="button" className={styles.btnPrimary} onClick={handleRestartSession} style={{ marginTop: "1rem" }}>
              {copy.startNewSession}
            </Button>
          </div>
        )}

        {/* Pre-Test Overview & Auth Gate */}
        {!hasStarted && !isSubmitted && !isExpired && (
          <GlassCard>
            <div className={styles.hero}>
              <h1 className={styles.heroHeading}>
                {locale === "fa" ? (
                  <>
                    <span className={styles.heroBrandWrap}>
                      <svg className={styles.heroSpark} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M12 2C12 7.523 7.523 12 2 12C7.523 12 12 16.477 12 22C12 16.477 16.477 12 22 12C16.477 12 12 7.523 12 2Z"
                          fill="url(#sparkGradPretest)"
                        />
                        <circle cx="12" cy="12" r="1.5" fill="#ffffff" opacity="0.9" />
                        <defs>
                          <linearGradient id="sparkGradPretest" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#06b6d4" />
                            <stop offset="1" stopColor="#0284c7" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <span className={styles.heroBrandText}>ایندورا،</span>
                    </span>
                    <span className={styles.heroSubText}>تعیین سطح هوشمند</span>
                  </>
                ) : (
                  <>
                    <span className={styles.heroBrandWrap}>
                      <svg className={styles.heroSpark} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M12 2C12 7.523 7.523 12 2 12C7.523 12 12 16.477 12 22C12 16.477 16.477 12 22 12C16.477 12 12 7.523 12 2Z"
                          fill="url(#sparkGradPretest)"
                        />
                        <circle cx="12" cy="12" r="1.5" fill="#ffffff" opacity="0.9" />
                        <defs>
                          <linearGradient id="sparkGradPretest" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#06b6d4" />
                            <stop offset="1" stopColor="#0284c7" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <span className={styles.heroBrandText}>Endoora,</span>
                    </span>
                    <span className={styles.heroSubText}>Smart Placement Test</span>
                  </>
                )}
              </h1>
            </div>

            <div className={styles.skillsOverview}>
              <h2 className={styles.skillsOverviewTitle}>
                <span>🎯</span>
                <span>{copy.skillsHeader}</span>
              </h2>
              <div className={styles.skillsGrid}>
                <div className={styles.skillCard}>
                  <div className={styles.skillCardHeader}>
                    <span className={styles.skillCardIcon}>🎯</span>
                    <span className={styles.skillCardNumber}>۰۱</span>
                  </div>
                  <span className={styles.skillCardTitle}>{locale === "fa" ? "دستور زبان (Grammar)" : "Grammar"}</span>
                  <span className={styles.skillCardDetail}>{copy.skill1}</span>
                </div>
                <div className={styles.skillCard}>
                  <div className={styles.skillCardHeader}>
                    <span className={styles.skillCardIcon}>📚</span>
                    <span className={styles.skillCardNumber}>۰۲</span>
                  </div>
                  <span className={styles.skillCardTitle}>{locale === "fa" ? "واژگان (Vocabulary)" : "Vocabulary"}</span>
                  <span className={styles.skillCardDetail}>{copy.skill2}</span>
                </div>
                <div className={styles.skillCard}>
                  <div className={styles.skillCardHeader}>
                    <span className={styles.skillCardIcon}>📖</span>
                    <span className={styles.skillCardNumber}>۰۳</span>
                  </div>
                  <span className={styles.skillCardTitle}>{locale === "fa" ? "درک مطلب (Reading)" : "Reading"}</span>
                  <span className={styles.skillCardDetail}>{copy.skill3}</span>
                </div>
                <div className={styles.skillCard}>
                  <div className={styles.skillCardHeader}>
                    <span className={styles.skillCardIcon}>🎧</span>
                    <span className={styles.skillCardNumber}>۰۴</span>
                  </div>
                  <span className={styles.skillCardTitle}>{locale === "fa" ? "شنیداری (Listening)" : "Listening"}</span>
                  <span className={styles.skillCardDetail}>{copy.skill4}</span>
                </div>
                <div className={styles.skillCard}>
                  <div className={styles.skillCardHeader}>
                    <span className={styles.skillCardIcon}>🎙️</span>
                    <span className={styles.skillCardNumber}>۰۵</span>
                  </div>
                  <span className={styles.skillCardTitle}>{locale === "fa" ? "گفتاری (Speaking)" : "Speaking"}</span>
                  <span className={styles.skillCardDetail}>{copy.skill5}</span>
                </div>
                <div className={styles.skillCard}>
                  <div className={styles.skillCardHeader}>
                    <span className={styles.skillCardIcon}>✍️</span>
                    <span className={styles.skillCardNumber}>۰۶</span>
                  </div>
                  <span className={styles.skillCardTitle}>{locale === "fa" ? "نگارش (Writing)" : "Writing"}</span>
                  <span className={styles.skillCardDetail}>{copy.skill6}</span>
                </div>
              </div>
            </div>

            {/* Account Status Card */}
            {authState.kind === "checking" ? (
              <div className={styles.authGateBox} aria-busy="true">
                <p className={styles.authGateCheckingText}>{copy.authChecking}</p>
              </div>
            ) : authState.kind === "authenticated" ? (
              <div className={`${styles.authGateBox} ${styles.authGateBoxAuthed}`}>
                <div className={styles.authGateHeader}>
                  <span className={styles.authGateBadgeAuthed}>
                    <span aria-hidden="true">✓</span>
                    {copy.authedNoticeTitle}
                  </span>
                  <span className={styles.authGateUserTag}>
                    {authState.account.first_name || authState.account.email || (locale === "fa" ? "زبان‌آموز گرامی" : "Learner")}
                  </span>
                </div>
                <h3 className={styles.authGateTitle}>{copy.authedNoticeTitle}</h3>
                <p className={styles.authGateDesc}>{copy.authedNoticeDesc}</p>
                <div className={styles.authGateActions}>
                  <Button type="button" className={styles.btnPrimary} disabled={!session} onClick={() => setHasStarted(true)}>
                    {copy.startTestBtn} <span aria-hidden="true">{locale === "fa" ? "←" : "→"}</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className={`${styles.authGateBox} ${styles.authGateBoxPrompt}`}>
                <div className={styles.authGateHeader}>
                  <span className={styles.authGateBadgePrompt}>
                    <span aria-hidden="true">🔒</span>
                    {locale === "fa" ? "ذخیره‌سازی دائمی کارنامه" : "Save to Profile"}
                  </span>
                </div>
                <h3 className={styles.authGateTitle}>{copy.unauthedTitle}</h3>
                <p className={styles.authGateDesc}>{copy.unauthedDesc}</p>
                <div className={styles.authGateActions}>
                  <Link href="/auth/login?next=/placement/demo?start=1" className={styles.btnPrimary}>
                    {copy.signInBtn}
                  </Link>
                  <Link href="/auth/register?next=/placement/demo?start=1" className={styles.btnPrimaryAlt}>
                    {copy.registerBtn}
                  </Link>
                  <Button type="button" className={styles.btnGhost} onClick={() => setHasStarted(true)}>
                    {copy.guestBtn}
                  </Button>
                </div>
              </div>
            )}
          </GlassCard>
        )}

        {/* Submission Complete View */}
        {isSubmitted ? (
          <div className={styles.emptyState}>
            <div style={{ fontSize: "3.5rem", marginBlockEnd: "var(--space-2)" }}>🏆</div>
            <h2>{copy.completedTitle}</h2>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.75rem 1.5rem",
                borderRadius: "var(--radius-pill)",
                background: "color-mix(in srgb, var(--color-action) 12%, var(--color-surface))",
                border: "1.5px solid var(--color-action)",
                marginBlock: "1rem",
              }}
            >
              <span style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--color-action)" }}>
                {adaptiveState.currentCefr}
              </span>
              <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-text)" }}>
                {locale === "fa" ? "شاخص سنجش اندورا:" : "Endoora Index:"} {adaptiveState.endooraIndex} / 100
              </span>
            </div>
            <p style={{ marginBlock: "1.5rem", maxWidth: "38rem", marginInline: "auto" }}>
              {authState.kind === "anonymous" ? copy.unauthedSubmittedDesc : copy.completedDesc}
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBlockStart: "var(--space-4)" }}>
              {authState.kind === "anonymous" ? (
                <>
                  <Link href={session ? "/placement/report?session="+session.id : "/placement/report"} className={styles.btnPrimary}>
                    {copy.viewReport} <span aria-hidden="true">{locale === "fa" ? "←" : "→"}</span>
                  </Link>
                  <Link href="/auth/register?next=/placement/demo?start=1" className={styles.btnSecondary}>
                    {copy.registerSaveBtn}
                  </Link>
                </>
              ) : (
                <>
                  <Link href={session ? "/placement/report?session="+session.id : "/placement/report"} className={styles.btnPrimary}>
                    {copy.viewReport} <span aria-hidden="true">{locale === "fa" ? "←" : "→"}</span>
                  </Link>
                  <Link href="/dashboard" className={styles.btnSecondary}>
                    {copy.goToDashboard}
                  </Link>
                </>
              )}
            </div>
          </div>
        ) : hasStarted && !isExpired && question ? (
          <>
            {/* Distraction-Free Active Test Status Bar */}
            <div className={styles.adaptiveHud}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
                <span className={styles.adaptiveLevelBadge}>
                  🎯 {copy[currentSection] || currentSection}
                </span>
                <span style={{ fontSize: "0.88rem", color: "var(--color-text)", fontWeight: 700 }}>
                  {copy.questionCounter} {sectionQuestionNumber} {copy.of} {sectionQuota}
                </span>
                <span style={{ fontSize: "0.78rem", color: "var(--color-muted)", fontWeight: 500 }}>
                  ({copy.questionCounter} {currentIndex + 1} {copy.of} {TOTAL_ADMINISTERED_ITEMS})
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                <span className={`${styles.timerBadge} ${sectionTimeRemaining < 120 ? styles.timerWarning : ""}`}>
                  ⏱️ {formatTimer(sectionTimeRemaining)}
                </span>
                <div className={styles.autosaveBadge}>
                  <span className={styles.autosaveDot} />
                  {copy.savedStatusShort}
                </div>
              </div>
            </div>

            {/* Guest notice */}
            {authState.kind === "anonymous" && (
              <div className={styles.guestNoticePill}>
                <span>{copy.guestPillNotice}</span>
                <Link href="/auth/register?next=/placement/demo?start=1" className={styles.guestNoticeLink}>
                  {copy.guestPillAction}
                </Link>
              </div>
            )}

            <div className={styles.singleColumnTest}>
              {/* Question Card with Window Chrome Header */}
              <div className={styles.questionCard}>
                <div className={styles.cardChrome}>
                  <span />
                  <span />
                  <span />
                  <strong>
                    Endoora Adaptive CAT · Item {currentIndex + 1}
                  </strong>
                </div>

                <div className={styles.cardBody}>
                  {/* Multi-stage Section Tabs */}
                  <div className={styles.sectionNav} role="tablist" aria-label={locale === "fa" ? "مراحل آزمون" : "Test sections"}>
                    <div className={`${styles.sectionPill} ${question.section === "grammar" ? styles.sectionPillActive : styles.sectionPillDone}`}>
                      🎯 {locale === "fa" ? "۱. دستور زبان" : "1. Grammar"}
                    </div>
                    <div className={`${styles.sectionPill} ${question.section === "vocabulary" ? styles.sectionPillActive : (["reading", "listening", "speaking", "writing"].includes(question.section) ? styles.sectionPillDone : "")}`}>
                      📚 {locale === "fa" ? "۲. واژگان" : "2. Vocabulary"}
                    </div>
                    <div className={`${styles.sectionPill} ${question.section === "reading" ? styles.sectionPillActive : (["listening", "speaking", "writing"].includes(question.section) ? styles.sectionPillDone : "")}`}>
                      📖 {locale === "fa" ? "۳. درک مطلب" : "3. Reading"}
                    </div>
                    <div className={`${styles.sectionPill} ${question.section === "listening" ? styles.sectionPillActive : (["speaking", "writing"].includes(question.section) ? styles.sectionPillDone : "")}`}>
                      🎧 {locale === "fa" ? "۴. شنیداری" : "4. Listening"}
                    </div>
                    <div className={`${styles.sectionPill} ${question.section === "speaking" ? styles.sectionPillActive : (question.section === "writing" ? styles.sectionPillDone : "")}`}>
                      🎙️ {locale === "fa" ? "۵. گفتاری" : "5. Speaking"}
                    </div>
                    <div className={`${styles.sectionPill} ${question.section === "writing" ? styles.sectionPillActive : ""}`}>
                      ✍️ {locale === "fa" ? "۶. نگارش" : "6. Writing"}
                    </div>
                  </div>

                  <div className={styles.counter}>
                    <span>
                      {copy.questionCounter} {currentIndex + 1} {copy.of} ~{totalEstimatedQuestions}
                    </span>
                    <span className={styles.sectionBadge}>
                      {locale === "fa" ? (question.title_fa || question.section) : (question.title_en || question.section)} · {question.cefr_level || "B1"}
                    </span>
                  </div>

                  <div className={styles.progressBarContainer}>
                    <div
                      className={styles.progressBarFill}
                      style={{ width: `${Math.min(100, ((currentIndex + 1) / totalEstimatedQuestions) * 100)}%` }}
                    />
                  </div>

                  {question.prompt_fa && (
                    <div className={styles.persianPromptBox}>
                      <span aria-hidden="true">💡</span>
                      <span>{question.prompt_fa}</span>
                    </div>
                  )}

                  {/* Listening Section Audio Player */}
                  {question.audio_url && (
                    <div style={{ marginBlockEnd: "var(--space-4)" }}>
                      <AudioWaveformPlayer
                        key={question.id}
                        src={question.audio_url}
                        playLimit={question.play_limit || 2}
                        title_fa={question.title_fa || "فایل صوتی سوال"}
                        title_en={question.title_en || "Question Audio"}
                        locale={locale}
                        transcript={question.transcript}
                      />
                    </div>
                  )}

                  {/* Split Screen for Reading Comprehension or Linear for Others */}
                  {question.section === "reading" && question.passage ? (
                    <div className={styles.readingSplitGrid}>
                      <div className={styles.readingPassagePanel}>
                        <div className={styles.readingPassageHeader}>
                          <strong>📖 {copy.passageLabel}</strong>
                          <small>Level: {question.cefr_level}</small>
                        </div>
                        <div className={styles.readingPassageText}>
                          {question.passage}
                        </div>
                      </div>

                      <div>
                        <div className={styles.englishPrompt} dir="ltr" style={{ marginTop: 0 }}>
                          {question.prompt_en}
                        </div>

                        <div className={styles.options}>
                          {question.options.map((opt, optIdx) => {
                            const letter = String.fromCharCode(65 + optIdx);
                            const isSelected = selectedOption === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                dir="ltr"
                                aria-pressed={isSelected}
                                disabled={saving}
                                className={`${styles.option} ${isSelected ? styles.optionActive : ""}`}
                                onClick={() => handleSelectOption(opt)}
                              >
                                <span className={styles.optionLetterBadge}>{letter}</span>
                                <span className={styles.optionText}>{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={styles.englishPrompt} dir="ltr">
                        {question.prompt_en}
                      </div>

                      {question.section === "speaking" ? (
                        <AudioRecorder
                          key={question.id}
                          timeLimitSec={question.recording_time_limit_sec || 60}
                          minWordsExpected={question.min_words_expected || 10}
                          locale={locale}
                          initialSpokenText={answers[question.id] || ""}
                          onConfirmAnswer={(payload) => {
                            if (payload.spoken_text) {
                              handleSaveSpokenAnswer(payload.spoken_text);
                            }
                          }}
                        />
                      ) : question.section === "writing" ? (
                        <WritingEditor
                          key={question.id}
                          minWordsExpected={question.min_words_expected || 15}
                          maxWordsExpected={question.max_words_expected || 100}
                          locale={locale}
                          initialText={answers[question.id] || ""}
                          onConfirmAnswer={(payload) => {
                            if (payload.written_text) {
                              handleSaveWrittenAnswer(payload.written_text);
                            }
                          }}
                          onChangeText={(newText) => {
                            setAnswers((prev) => ({ ...prev, [question.id]: newText }));
                          }}
                        />
                      ) : (
                        <div className={styles.options}>
                          {question.options.map((opt, optIdx) => {
                            const letter = String.fromCharCode(65 + optIdx);
                            const isSelected = selectedOption === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                dir="ltr"
                                aria-pressed={isSelected}
                                disabled={saving}
                                className={`${styles.option} ${isSelected ? styles.optionActive : ""}`}
                                onClick={() => handleSelectOption(opt)}
                              >
                                <span className={styles.optionLetterBadge}>{letter}</span>
                                <span className={styles.optionText}>{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}

                  <div className={styles.navRow}>
                    <Button
                      type="button"
                      className={styles.btnSecondary}
                      onClick={handlePrev}
                      disabled={currentIndex === 0 || saving}
                    >
                      {copy.prev}
                    </Button>

                    {!isLastQuestion ? (
                      <Button type="button" className={styles.btnPrimary} onClick={handleNext} disabled={saving || !selectedOption}>
                        {copy.next} <span aria-hidden="true">{locale === "fa" ? "←" : "→"}</span>
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        className={styles.btnPrimary}
                        onClick={handleSubmit}
                        disabled={isSubmitting || saving || !selectedOption}
                      >
                        {isSubmitting ? copy.submitting : copy.submit}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </EndooraBackground>
  );
}
