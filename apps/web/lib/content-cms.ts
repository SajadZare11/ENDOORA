export type ContentCategory =
  | "listening"
  | "speaking"
  | "reading"
  | "writing"
  | "grammar"
  | "vocabulary"
  | "culture"
  | "school";

export type ContentType =
  | "article"
  | "audio_lesson"
  | "video_lesson"
  | "culture_post"
  | "school_guide"
  | "practice_quiz";

export type ContentStatus = "draft" | "in_review" | "published" | "archived";

export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "ALL";

export type AgeBand = "all" | "kids" | "teens" | "adults";

export type SchoolGrade = "vision_1" | "vision_2" | "vision_3" | "konkur" | "none";

export type LicenseType =
  | "original_editorial"
  | "cc_by_sa"
  | "public_domain"
  | "educational_fair_use";

export interface QuizItem {
  prompt_fa?: string;
  prompt_en?: string;
  options?: string[];
  correct_index?: number;
  explanation_fa?: string;
  explanation_en?: string;
}

export interface DownloadableResource {
  title_fa?: string;
  title_en?: string;
  file_url?: string;
  file_size_bytes?: number;
  file_type?: string;
}

export interface ContentItemEditorRecord {
  id: string;
  slug: string;
  title_fa: string;
  title_en: string;
  summary_fa: string;
  summary_en: string;
  category: ContentCategory;
  content_type: ContentType;
  status: ContentStatus;
  cefr_level: CefrLevel;
  age_band: AgeBand;
  school_grade: SchoolGrade;
  content_body_fa: string;
  content_body_en: string;
  learning_objectives: string[];
  prerequisites: string[];
  audio_url: string;
  audio_duration_seconds: number;
  audio_transcript_fa: string;
  audio_transcript_en: string;
  video_url: string;
  video_duration_seconds: number;
  video_captions: string;
  downloadable_resources: DownloadableResource[];
  quiz_data: QuizItem[];
  is_premium: boolean;
  free_preview_excerpt_fa: string;
  free_preview_excerpt_en: string;
  source_attribution: string;
  license_type: LicenseType;
  author_name: string;
  tags: string[];
  view_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export const MOCK_CONTENT_ITEMS: ContentItemEditorRecord[] = [
  {
    id: "cnt-1",
    slug: "mastering-present-perfect-vs-past-simple",
    title_fa: "تفاوت کاربردی حال کامل و گذشته ساده در مکالمه",
    title_en: "Present Perfect vs. Past Simple: The Definitive Guide",
    summary_fa: "چگونه بدون تردید بین گذشته ساده و حال کامل در مکالمات روزمره و آزمون آیلتس انتخاب کنیم.",
    summary_en: "Learn the core pedagogical differences between finished past actions and life experiences.",
    category: "grammar",
    content_type: "article",
    status: "published",
    cefr_level: "B1",
    age_band: "all",
    school_grade: "none",
    content_body_fa: "یکی از متداول‌ترین چالش‌های زبان‌آموزان فارسی‌زبان، تفکیک زمان حال کامل (Present Perfect) و گذشته ساده است. در گذشته ساده زمان مشخص و تمام شده است (last week, yesterday)، اما در حال کامل اثر عمل یا تجربه در زمان حال مد نظر است.",
    content_body_en: "Use Past Simple for completed actions at a definite time in the past: 'I visited Isfahan last year.' Use Present Perfect when the time is indefinite or the experience matters: 'I have visited Isfahan twice.'",
    learning_objectives: ["تفکیک نشانه‌های زمانی گذشته مشخص", "به‌کارگیری صحیح ever/never در تجربیات زندگی"],
    prerequisites: ["simple-past-basics", "regular-irregular-verbs"],
    audio_url: "",
    audio_duration_seconds: 0,
    audio_transcript_fa: "",
    audio_transcript_en: "",
    video_url: "",
    video_duration_seconds: 0,
    video_captions: "",
    downloadable_resources: [
      { title_fa: "خلاصه گرامری و جدول مقایسه‌ای PDF", title_en: "Grammar Summary Sheet PDF", file_url: "https://media.endoora.ir/docs/grammar-summary-b1.pdf", file_size_bytes: 420000, file_type: "pdf" }
    ],
    quiz_data: [
      {
        prompt_fa: "کدام جمله از لحاظ کاربرد زمانی صحیح است؟",
        prompt_en: "Which sentence is grammatically correct?",
        options: ["I have seen him yesterday.", "I saw him yesterday.", "I have saw him yesterday.", "I am seeing him yesterday."],
        correct_index: 1,
        explanation_fa: "به دلیل وجود قید زمان معین yesterday باید از گذشته ساده (saw) استفاده شود.",
        explanation_en: "Because 'yesterday' specifies a completed past time, Past Simple is mandatory."
      }
    ],
    is_premium: false,
    free_preview_excerpt_fa: "راهنمای سریع تفکیک زمان گذشته ساده و حال کامل در مکالمه روزمره.",
    free_preview_excerpt_en: "Quick guide to distinguishing past simple and present perfect in conversation.",
    source_attribution: "Endoora Applied Linguistics Board",
    license_type: "original_editorial",
    author_name: "دکتر سارا رضوانی",
    tags: ["grammar", "b1", "tenses", "conversation"],
    view_count: 1420,
    published_at: "2026-03-01T10:00:00Z",
    created_at: "2026-02-28T09:00:00Z",
    updated_at: "2026-03-05T12:00:00Z",
  },
  {
    id: "cnt-2",
    slug: "persian-nowruz-cultural-traditions-in-english",
    title_fa: "روایت آیین‌ها و فرهنگ نوروز به زبان انگلیسی برای گردشگران و دوستان خارجی",
    title_en: "Explaining Nowruz Traditions & Haft-Sin to International Friends",
    summary_fa: "واژگان، عبارات تشبیهی و ساختارهای فرهنگی برای معرفی آداب عید نوروز و سفره هفت‌سین.",
    summary_en: "Cultural vocabulary, metaphors, and polite phrasing to describe Iranian New Year rituals.",
    category: "culture",
    content_type: "culture_post",
    status: "published",
    cefr_level: "B2",
    age_band: "all",
    school_grade: "none",
    content_body_fa: "معرفی نمادهای هفت‌سین مانند سمنو (sweet wheat pudding)، سیر (garlic representing medicine and health)، سیب (apple representing beauty) با توضیحات شیوا و اصطلاحات طبیعی انگلیسی.",
    content_body_en: "Nowruz marks the vernal equinox and the arrival of spring. The Haft-Sin table features seven symbolic items starting with the Persian letter 'Sin', each embodying a wish for the new year.",
    learning_objectives: ["شرح عناصر سفره هفت‌سین به انگلیسی روان", "پاسخ به سوالات متداول گردشگران درباره تقویم خورشیدی"],
    prerequisites: ["descriptive-adjectives-b1"],
    audio_url: "https://media.endoora.ir/audio/nowruz-explanation-b2.mp3",
    audio_duration_seconds: 480,
    audio_transcript_fa: "متن صوتی پادکست معرفی نوروز با تلفظ لهجه بریتیش استاندارد.",
    audio_transcript_en: "Full transcript of the Nowruz cultural podcast episode.",
    video_url: "",
    video_duration_seconds: 0,
    video_captions: "",
    downloadable_resources: [],
    quiz_data: [],
    is_premium: false,
    free_preview_excerpt_fa: "چگونه جشن نوروز را با افتخار و روانی به مخاطبان بین‌المللی معرفی کنیم.",
    free_preview_excerpt_en: "Learn how to explain Nowruz eloquently to global audiences.",
    source_attribution: "Endoora Cultural Exchange Unit",
    license_type: "original_editorial",
    author_name: "استاد کیان مهرآذر",
    tags: ["culture", "nowruz", "podcast", "b2", "iran"],
    view_count: 3200,
    published_at: "2026-03-10T14:30:00Z",
    created_at: "2026-03-08T11:00:00Z",
    updated_at: "2026-03-11T16:00:00Z",
  },
  {
    id: "cnt-3",
    slug: "konkur-vision-3-cloze-test-speed-strategies",
    title_fa: "تکنیک‌های تست‌زنی کلوزتست کنکور و پایه‌های یازدهم و دوازدهم (Vision 2 & 3)",
    title_en: "Mastering Cloze Tests for Iranian Konkur & High School Vision 3",
    summary_fa: "کشف نشانه‌های قبل و بعد از جای خالی، تشخیص نقش دستوری، و صرفه‌جویی در زمان دفترچه کنکور.",
    summary_en: "Pedagogical clues, collocations, and elimination strategies tailored for nationwide Konkur candidates.",
    category: "school",
    content_type: "school_guide",
    status: "published",
    cefr_level: "B2",
    age_band: "teens",
    school_grade: "konkur",
    content_body_fa: "در تست‌های کلوزتست زبان کنکور سراسری، خواندن کل متن پیش از بررسی گزینه‌ها اشتباه است. باید بلافاصله حرف اضافه متصل به فعل و همنشینی‌ها (Collocations) بررسی شوند.",
    content_body_en: "A step-by-step breakdown of five real national exam passages with detailed distractor analysis.",
    learning_objectives: ["تشخیص نقش کلمه در جای خالی", "حذف گزینه‌های انحرافی در ۳۰ ثانیه"],
    prerequisites: ["vision-1-2-vocabulary"],
    audio_url: "",
    audio_duration_seconds: 0,
    audio_transcript_fa: "",
    audio_transcript_en: "",
    video_url: "https://media.endoora.ir/video/konkur-cloze-strategies.mp4",
    video_duration_seconds: 720,
    video_captions: "",
    downloadable_resources: [
      { title_fa: "جزوه ۲۰ تست طلایی کلوزتست کنکور با پاسخ تشریحی", title_en: "20 Golden Cloze Questions PDF", file_url: "https://media.endoora.ir/docs/konkur-cloze-20.pdf", file_size_bytes: 850000, file_type: "pdf" }
    ],
    quiz_data: [],
    is_premium: true,
    free_preview_excerpt_fa: "۳ نکته کلیدی برای مواجهه با سوالات کلوزتست در آزمون سراسری.",
    free_preview_excerpt_en: "Three critical clues to solve national exam cloze passages swiftly.",
    source_attribution: "دپارتمان زبان کنکور ایندورا",
    license_type: "original_editorial",
    author_name: "مهندس علیرضا صابری",
    tags: ["konkur", "vision3", "school", "cloze-test"],
    view_count: 5120,
    published_at: "2026-03-12T08:00:00Z",
    created_at: "2026-03-09T18:00:00Z",
    updated_at: "2026-03-14T09:00:00Z",
  },
  {
    id: "cnt-4",
    slug: "connected-speech-elision-linking-in-everyday-english",
    title_fa: "شنیدن و درک مکالمه سریع: اتصال صداها (Linking) و حذف آواها (Elision)",
    title_en: "Connected Speech: Deciphering Fast Natural English for Learners",
    summary_fa: "چرا انگلیسی‌زبانان واژه‌ها را مانند کتاب نمی‌خوانند؟ بررسی قوانین اتصال همخوان‌ها و ادغام واکه‌ها.",
    summary_en: "Demystify catenation, weak forms, and assimilation with real audio snippets.",
    category: "listening",
    content_type: "audio_lesson",
    status: "in_review",
    cefr_level: "B1",
    age_band: "all",
    school_grade: "none",
    content_body_fa: "وقتی یک کلمه با همخوان تمام می‌شود و کلمه بعد با واکه شروع می‌شود، اتصال مستقیم رخ می‌دهد (Linking Consonant to Vowel). مثلاً an apple به صورت [a-napple] شنیده می‌شود.",
    content_body_en: "In spoken discourse, words blend seamlessly. Learn the 4 golden rules of connected speech.",
    learning_objectives: ["تشخیص حروف ربط داده‌شده در فایل‌های صوتی آیلتس", "تقویت درک شنیداری فیلم و سریال بدون زیرنویس"],
    prerequisites: ["phonetics-ipa-basics"],
    audio_url: "https://media.endoora.ir/audio/connected-speech-b1.mp3",
    audio_duration_seconds: 600,
    audio_transcript_fa: "متن همراه با علامت‌گذاری آوانگاری در بخش‌های اتصال صوتی.",
    audio_transcript_en: "Complete transcript with phonetic linking indicators.",
    video_url: "",
    video_duration_seconds: 0,
    video_captions: "",
    downloadable_resources: [],
    quiz_data: [],
    is_premium: false,
    free_preview_excerpt_fa: "آشنایی با پدیده گفتار پیوسته و تفاوت آن با خوانش کتابی کلمات.",
    free_preview_excerpt_en: "Introduction to natural connected speech phenomena.",
    source_attribution: "Endoora Listening & Phonetics Lab",
    license_type: "original_editorial",
    author_name: "مریم فرهمند",
    tags: ["listening", "pronunciation", "connected-speech", "b1"],
    view_count: 890,
    published_at: null,
    created_at: "2026-03-13T10:00:00Z",
    updated_at: "2026-03-14T11:00:00Z",
  },
  {
    id: "cnt-5",
    slug: "academic-writing-task2-balanced-argument-structures",
    title_fa: "ساختار مقاله‌نویسی تحلیلی و تراز آیلتس تسک ۲ (Discuss Both Views)",
    title_en: "IELTS Task 2: Structuring a Balanced Discussion Essay",
    summary_fa: "چارچوب ۴ پاراگرافی استاندارد، جملات رابط پیشرفته و نحوه بیان بی‌طرفانه استدلال‌ها.",
    summary_en: "Master balanced topic sentences, concession clauses, and authoritative concluding paragraphs.",
    category: "writing",
    content_type: "article",
    status: "draft",
    cefr_level: "C1",
    age_band: "adults",
    school_grade: "none",
    content_body_fa: "تسک ۲ آیلتس برای سوالات 'Discuss both views and give your opinion' نیازمند بررسی برابر هر دو دیدگاه پیش از اتخاذ موضع شخصی در مقدمه و نتیجه‌گیری است.",
    content_body_en: "A high-scoring discussion essay requires balanced development of opposing arguments without prematurely skewing body paragraph 1.",
    learning_objectives: ["نگارش مقدمه ۳ لایه‌ای استاندارد", "استفاده از جملات شرطی و واژگان تراز ۷+"],
    prerequisites: ["ielts-essay-fundamentals"],
    audio_url: "",
    audio_duration_seconds: 0,
    audio_transcript_fa: "",
    audio_transcript_en: "",
    video_url: "",
    video_duration_seconds: 0,
    video_captions: "",
    downloadable_resources: [],
    quiz_data: [],
    is_premium: true,
    free_preview_excerpt_fa: "راهنمای نگارش مقاله تحلیلی آیلتس تسک ۲.",
    free_preview_excerpt_en: "Draft outline for balanced IELTS essays.",
    source_attribution: "IELTS Examiner Board Endoora",
    license_type: "original_editorial",
    author_name: "دکتر نیما صراف",
    tags: ["writing", "ielts", "c1", "academic"],
    view_count: 310,
    published_at: null,
    created_at: "2026-03-14T15:00:00Z",
    updated_at: "2026-03-15T08:00:00Z",
  }
];

export async function fetchEditorContentItems(
  params?: {
    category?: string;
    status?: string;
    content_type?: string;
    cefr?: string;
    search?: string;
  },
  signal?: AbortSignal
): Promise<{ count: number; results: ContentItemEditorRecord[] }> {
  const query = new URLSearchParams();
  if (params?.category && params.category !== "all") query.set("category", params.category);
  if (params?.status && params.status !== "all") query.set("status", params.status);
  if (params?.content_type && params.content_type !== "all") query.set("content_type", params.content_type);
  if (params?.cefr && params.cefr !== "ALL") query.set("cefr", params.cefr);
  if (params?.search) query.set("search", params.search);

  const url = `/api/content/editor/?${query.toString()}`;

  try {
    const res = await fetch(url, {
      signal,
      credentials: "include",
      headers: { credentials: "omit" },
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // offline or backend not running
  }

  // Filter in-memory fallback
  let filtered = [...MOCK_CONTENT_ITEMS];
  if (params?.category && params.category !== "all") {
    filtered = filtered.filter((i) => i.category === params.category);
  }
  if (params?.status && params.status !== "all") {
    filtered = filtered.filter((i) => i.status === params.status);
  }
  if (params?.content_type && params.content_type !== "all") {
    filtered = filtered.filter((i) => i.content_type === params.content_type);
  }
  if (params?.cefr && params.cefr !== "ALL") {
    filtered = filtered.filter((i) => i.cefr_level === params.cefr);
  }
  if (params?.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(
      (i) =>
        i.title_fa.toLowerCase().includes(s) ||
        i.title_en.toLowerCase().includes(s) ||
        i.slug.toLowerCase().includes(s) ||
        i.author_name.toLowerCase().includes(s)
    );
  }

  return {
    count: filtered.length,
    results: filtered,
  };
}

export async function fetchEditorContentItemDetail(
  id: string,
  signal?: AbortSignal
): Promise<ContentItemEditorRecord> {
  try {
    const res = await fetch(`/api/content/editor/${id}/`, {
      signal,
      credentials: "include",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }

  const mock = MOCK_CONTENT_ITEMS.find((i) => i.id === id || i.slug === id);
  if (mock) return mock;
  throw new Error("محتوای مورد نظر یافت نشد.");
}

export async function createEditorContentItem(
  payload: Partial<ContentItemEditorRecord>
): Promise<ContentItemEditorRecord> {
  const res = await fetch("/api/content/editor/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = Object.entries(err)
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
      .join(" | ") || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return res.json();
}

export async function updateEditorContentItem(
  id: string,
  payload: Partial<ContentItemEditorRecord>
): Promise<ContentItemEditorRecord> {
  const res = await fetch(`/api/content/editor/${id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = Object.entries(err)
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
      .join(" | ") || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return res.json();
}

export async function transitionEditorContentItem(
  id: string,
  action: "submit_review" | "publish" | "archive" | "revert_draft",
  note: string = ""
): Promise<ContentItemEditorRecord> {
  const res = await fetch(`/api/content/editor/${id}/transition/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ action, note }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }

  return res.json();
}

export async function deleteEditorContentItem(id: string): Promise<void> {
  const res = await fetch(`/api/content/editor/${id}/`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
}
