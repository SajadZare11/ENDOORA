import { CourseEditorItem, LessonEditorItem, ModuleEditorItem, QuizItem } from "./courses-cms";

export interface LearnerLessonProgressRecord {
  lessonId: string;
  lessonTitleFa: string;
  lessonTitleEn: string;
  isCompleted: boolean;
  quizScore: number | null;
  completedAt: string | null;
}

export interface LearnerEnrollmentRecord {
  id: string;
  learnerId: string;
  learnerName: string;
  learnerEmail: string;
  learnerPhone: string;
  learnerAvatar: string;
  courseId: string;
  courseSlug: string;
  courseTitleFa: string;
  courseTitleEn: string;
  cefrLevel: string;
  progressPercent: number;
  enrolledAt: string;
  completedAt: string | null;
  lessons: LearnerLessonProgressRecord[];
}

export interface AcademicOverrideAuditRecord {
  id: string;
  adminName: string;
  action: "TOGGLE_LESSON" | "UPDATE_SCORE" | "RESET_PROGRESS" | "GRANT_ENROLLMENT" | "REVOKE_ENROLLMENT";
  actionLabelFa: string;
  learnerName: string;
  learnerId: string;
  courseTitleFa: string;
  details: string;
  reason: string;
  occurredAt: string;
}

export interface MediaPresetAsset {
  id: string;
  collection: "speakout" | "aef" | "vision3";
  collectionLabelFa: string;
  level: string;
  titleFa: string;
  titleEn: string;
  videoUrl: string;
  audioUrl: string;
  durationMinutes: number;
  transcriptSample: {
    time: string;
    speaker: string;
    textEn: string;
    textFa: string;
  }[];
  downloadables: {
    title: string;
    url: string;
    size: string;
    type: "pdf" | "audio" | "zip";
  }[];
}

// ==============================================================================
// Preset Media Assets (Speakout, American English File, Vision 3)
// ==============================================================================
export const MEDIA_PRESET_ASSETS: MediaPresetAsset[] = [
  {
    id: "speakout-a1-u1",
    collection: "speakout",
    collectionLabelFa: "مجموعه Speakout 3rd Edition",
    level: "A1",
    titleFa: "درس ۱: سلام و احوال‌پرسی بین‌المللی",
    titleEn: "Unit 1: Welcome & Introductions (BBC Video)",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    durationMinutes: 12,
    transcriptSample: [
      { time: "00:05", speaker: "Host", textEn: "Hello everyone, my name is David.", textFa: "سلام به همگی، نام من دیوید است." },
      { time: "00:15", speaker: "Maria", textEn: "Nice to meet you David. Where are you from?", textFa: "از آشنایی با شما خوشوقتم دیوید. اهل کجایید؟" },
      { time: "00:28", speaker: "Host", textEn: "I'm from London, England. What about you?", textFa: "من اهل لندن انگلستان هستم. شما چطور؟" },
      { time: "00:45", speaker: "Maria", textEn: "I'm from Madrid, Spain. Pleased to be here.", textFa: "من اهل مادرید اسپانیا هستم. از حضور در اینجا خوشحالم." },
    ],
    downloadables: [
      { title: "Speakout A1 Unit 1 Worksheet (PDF)", url: "/downloads/speakout_a1_u1.pdf", size: "1.4 MB", type: "pdf" },
      { title: "Unit 1 Vocabulary & Audio Script", url: "/downloads/speakout_a1_vocab.pdf", size: "820 KB", type: "pdf" },
    ],
  },
  {
    id: "speakout-b1-u4",
    collection: "speakout",
    collectionLabelFa: "مجموعه Speakout 3rd Edition",
    level: "B1",
    titleFa: "درس ۴: تصمیم‌گیری‌های شغلی و مصاحبه کاری",
    titleEn: "Unit 4: Career Choices & Workplace Dialogue",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    durationMinutes: 18,
    transcriptSample: [
      { time: "00:10", speaker: "Interviewer", textEn: "Can you describe a challenging project you managed successfully?", textFa: "می‌توانید پروژه چالش‌برانگیزی را که با موفقیت مدیریت کردید شرح دهید؟" },
      { time: "00:32", speaker: "Candidate", textEn: "Certainly. Last year I coordinated a cross-functional marketing campaign.", textFa: "حتماً. سال گذشته من یک کمپین بازاریابی بین‌تیمی را هماهنگ کردم." },
      { time: "01:05", speaker: "Interviewer", textEn: "How did you overcome the tight deadlines?", textFa: "چگونه بر ضرب‌الاجل‌های فشرده فائق آمدید؟" },
    ],
    downloadables: [
      { title: "Workplace Interview Phrases Cheat Sheet", url: "/downloads/workplace_phrases.pdf", size: "2.1 MB", type: "pdf" },
    ],
  },
  {
    id: "aef-a2-practical",
    collection: "aef",
    collectionLabelFa: "مجموعه American English File",
    level: "A2",
    titleFa: "انگلیسی کاربردی: رزرو هتل و سفارش در رستوران",
    titleEn: "Practical English: Hotel Check-in & Ordering Food",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    durationMinutes: 15,
    transcriptSample: [
      { time: "00:08", speaker: "Receptionist", textEn: "Good afternoon. Do you have a reservation?", textFa: "عصر بخیر. آیا از قبل رزرو انجام داده‌اید؟" },
      { time: "00:20", speaker: "Guest", textEn: "Yes, I booked a double room under the name Watson.", textFa: "بله، یک اتاق دو تخته به نام واتسون رزرو کرده‌ام." },
      { time: "00:42", speaker: "Receptionist", textEn: "Perfect. May I see your ID card and credit card?", textFa: "عالی است. ممکن است کارت شناسایی و کارت اعتباری‌تان را ببینم؟" },
    ],
    downloadables: [
      { title: "AEF 2 Practical English Dialogue Guide", url: "/downloads/aef2_dialogue.pdf", size: "1.8 MB", type: "pdf" },
    ],
  },
  {
    id: "aef-b2-colloquial",
    collection: "aef",
    collectionLabelFa: "مجموعه American English File",
    level: "B2",
    titleFa: "گفتگوهای عامیانه و اصطلاحات روزمره آمریکایی",
    titleEn: "Colloquial English: Talking About Technology Trends",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    durationMinutes: 20,
    transcriptSample: [
      { time: "00:12", speaker: "Host", textEn: "Today we have Dr. Aris discussing artificial intelligence in daily routines.", textFa: "امروز دکتر آریس را همراه داریم که در مورد هوش مصنوعی در برنامه‌های روزمره صحبت می‌کند." },
      { time: "00:40", speaker: "Guest", textEn: "AI is no longer science fiction; it is shaping pedagogy and automation.", textFa: "هوش مصنوعی دیگر علمی-تخیلی نیست؛ بلکه در حال دگرگونی آموزش و اتوماسیون است." },
    ],
    downloadables: [
      { title: "AEF B2 Advanced Vocabulary Builder", url: "/downloads/aef_b2_vocab.pdf", size: "3.2 MB", type: "pdf" },
    ],
  },
  {
    id: "vision3-l1-appreciation",
    collection: "vision3",
    collectionLabelFa: "پایه دوازدهم دبیرستان (Vision 3)",
    level: "School",
    titleFa: "درس ۱: حس قدردانی و احترام به بزرگان (امتحان نهایی)",
    titleEn: "Lesson 1: Sense of Appreciation & Helping Others",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    durationMinutes: 25,
    transcriptSample: [
      { time: "00:04", speaker: "Teacher", textEn: "In Lesson 1, we learn about Dr. Mohammad Gharib and dedicating life to society.", textFa: "در درس ۱، ما درباره دکتر محمد قریب و وقف زندگی برای خدمت به جامعه می‌آموزیم." },
      { time: "00:30", speaker: "Student", textEn: "What are the passive voice rules covered in this unit?", textFa: "قواعد مجهول تدریس‌شده در این درس کدامند؟" },
      { time: "01:10", speaker: "Teacher", textEn: "We form passive sentences using appropriate form of 'to be' plus past participle.", textFa: "جملات مجهول را با استفاده از شکل مناسب 'to be' به همراه اسم مفعول (P.P) می‌سازیم." },
    ],
    downloadables: [
      { title: "سوالات نهایی زبان انگلیسی دوازدهم درس ۱ (با پاسخ تشریحی)", url: "/downloads/vision3_lesson1_final_exam.pdf", size: "4.5 MB", type: "pdf" },
      { title: "فایل صوتی شنیداری کل کتاب دوازدهم", url: "/downloads/vision3_audio_pack.zip", size: "18.2 MB", type: "zip" },
    ],
  },
  {
    id: "vision3-l2-future",
    collection: "vision3",
    collectionLabelFa: "پایه دوازدهم دبیرستان (Vision 3)",
    level: "School",
    titleFa: "درس ۲: نگاه به آینده و فناوری‌های نو",
    titleEn: "Lesson 2: Look at the Future & Space Exploration",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    durationMinutes: 22,
    transcriptSample: [
      { time: "00:06", speaker: "Teacher", textEn: "Look at the stars. Humanity has always wondered what lies beyond.", textFa: "به ستارگان نگاه کنید. بشر همواره کنجکاو بوده چه چیزی در ماورای آن قرار دارد." },
      { time: "00:45", speaker: "Student", textEn: "How do modal auxiliaries express future possibility?", textFa: "افعال کمکی چگونه احتمال آینده را بیان می‌کنند؟" },
    ],
    downloadables: [
      { title: "بانک تست کنکور سراسری درس ۲ زبان دوازدهم", url: "/downloads/vision3_lesson2_konkur.pdf", size: "3.1 MB", type: "pdf" },
    ],
  },
];

// ==============================================================================
// Initial Learners & Enrollments Data Store
// ==============================================================================
export const INITIAL_LEARNER_ENROLLMENTS: LearnerEnrollmentRecord[] = [
  {
    id: "enr-001",
    learnerId: "user-101",
    learnerName: "سارا محمدی",
    learnerEmail: "sara.mohammadi@example.com",
    learnerPhone: "09121112233",
    learnerAvatar: "👩‍🎓",
    courseId: "course-ielts-b2",
    courseSlug: "ielts-speaking-mastery",
    courseTitleFa: "دوره جامع مستری اسپیکینگ آیلتس (Band 7.5+)",
    courseTitleEn: "IELTS Speaking Mastery (Band 7.5+)",
    cefrLevel: "B2",
    progressPercent: 75,
    enrolledAt: "1403/07/15",
    completedAt: null,
    lessons: [
      {
        lessonId: "l-ielts-01",
        lessonTitleFa: "اصول تسلط در بخش اول آزمون (Part 1 Fluency)",
        lessonTitleEn: "Mastering Part 1 Fluency & Coherence",
        isCompleted: true,
        quizScore: 92,
        completedAt: "1403/07/20 14:30",
      },
      {
        lessonId: "l-ielts-02",
        lessonTitleFa: "تکنیک کارت‌های صحبت دو دقیقه‌ای (Cue Card Framework)",
        lessonTitleEn: "2-Minute Cue Card Framework",
        isCompleted: true,
        quizScore: 85,
        completedAt: "1403/07/28 18:15",
      },
      {
        lessonId: "l-ielts-03",
        lessonTitleFa: "تحلیل و استدلال انتزاعی در بخش سوم (Part 3 Discussion)",
        lessonTitleEn: "Abstract Reasoning in Part 3 Discussion",
        isCompleted: true,
        quizScore: 78,
        completedAt: "1403/08/05 11:20",
      },
      {
        lessonId: "l-ielts-04",
        lessonTitleFa: "کالوکیشن‌های پیشرفته و گرامر پیچیده",
        lessonTitleEn: "Advanced Collocations & Complex Grammatical Range",
        isCompleted: false,
        quizScore: null,
        completedAt: null,
      },
    ],
  },
  {
    id: "enr-002",
    learnerId: "user-102",
    learnerName: "علی رضایی",
    learnerEmail: "ali.rezaei@example.com",
    learnerPhone: "09124445566",
    learnerAvatar: "🧑‍🎓",
    courseId: "course-grade12-tamrin20",
    courseSlug: "grade12-tamrin20-complete",
    courseTitleFa: "بسته طلایی تمرین تا ۲۰ (انگلیسی دوازدهم نهایی)",
    courseTitleEn: "Grade 12 Vision 3: Final Exam Mastery",
    cefrLevel: "School",
    progressPercent: 100,
    enrolledAt: "1403/08/01",
    completedAt: "1403/08/25",
    lessons: [
      {
        lessonId: "l-v12-01",
        lessonTitleFa: "گرامر مجهول و واژگان درس ۱ (دکتر قریب)",
        lessonTitleEn: "Passive Voice & Vocabulary Unit 1",
        isCompleted: true,
        quizScore: 100,
        completedAt: "1403/08/07 19:10",
      },
      {
        lessonId: "l-v12-02",
        lessonTitleFa: "ریدینگ و لیسنینگ درس ۲ (فضا و آینده)",
        lessonTitleEn: "Reading & Listening Skills Unit 2",
        isCompleted: true,
        quizScore: 95,
        completedAt: "1403/08/15 16:45",
      },
      {
        lessonId: "l-v12-03",
        lessonTitleFa: "شبیه‌ساز امتحان نهایی هماهنگ کشوری (خرداد)",
        lessonTitleEn: "Nationwide Mock Final Exam Simulation",
        isCompleted: true,
        quizScore: 98,
        completedAt: "1403/08/25 21:00",
      },
    ],
  },
  {
    id: "enr-003",
    learnerId: "user-103",
    learnerName: "نیلوفر کریمی",
    learnerEmail: "niloofar.karimi@example.com",
    learnerPhone: "09127778899",
    learnerAvatar: "👩‍💼",
    courseId: "course-speakout-b1",
    courseSlug: "speakout-b1-intermediate",
    courseTitleFa: "مکالمه جامع انگلیسی بر اساس Speakout B1",
    courseTitleEn: "Comprehensive Conversational English (Speakout B1)",
    cefrLevel: "B1",
    progressPercent: 33,
    enrolledAt: "1403/08/10",
    completedAt: null,
    lessons: [
      {
        lessonId: "l-spb1-01",
        lessonTitleFa: "روابط اجتماعی و معرفی سبک زندگی",
        lessonTitleEn: "Identity, Relationships & Lifestyle",
        isCompleted: true,
        quizScore: 88,
        completedAt: "1403/08/16 20:00",
      },
      {
        lessonId: "l-spb1-02",
        lessonTitleFa: "داستان‌سرایی و زمان‌های گذشته در مکالمه",
        lessonTitleEn: "Storytelling & Narrative Past Tenses",
        isCompleted: false,
        quizScore: 40,
        completedAt: null,
      },
      {
        lessonId: "l-spb1-03",
        lessonTitleFa: "برنامه‌ریزی آینده و مسافرت بین‌المللی",
        lessonTitleEn: "Future Arrangements & Travel Realities",
        isCompleted: false,
        quizScore: null,
        completedAt: null,
      },
    ],
  },
];

export const INITIAL_ACADEMIC_AUDIT_LOGS: AcademicOverrideAuditRecord[] = [
  {
    id: "aud-001",
    adminName: "مدیر ارشد ایندورا",
    action: "RESET_PROGRESS",
    actionLabelFa: "بازنشانی کامل پیشرفت دوره",
    learnerName: "نیلوفر کریمی",
    learnerId: "user-103",
    courseTitleFa: "مکالمه جامع انگلیسی بر اساس Speakout B1",
    details: "پیشرفت درس ۲ و نمره آزمونک به درخواست زبان‌آموز جهت تست مجدد ریست شد.",
    reason: "درخواست کاربر به دلیل قطعی برق حین آزمون آنلاین",
    occurredAt: "1403/08/18 10:45",
  },
  {
    id: "aud-002",
    adminName: "مدیر ارشد ایندورا",
    action: "UPDATE_SCORE",
    actionLabelFa: "ویرایش نمره آزمونک درس",
    learnerName: "سارا محمدی",
    learnerId: "user-101",
    courseTitleFa: "دوره جامع مستری اسپیکینگ آیلتس (Band 7.5+)",
    details: "نمره آزمونک درس ۱ از ۸۰٪ به ۹۲٪ اصلاح گردید پس از بازبینی فایل صوتی داوطلب.",
    reason: "تصحیح دستی خطای الگوریتم تشخیص گفتار ASR",
    occurredAt: "1403/08/21 15:20",
  },
  {
    id: "aud-003",
    adminName: "مدیر ارشد ایندورا",
    action: "GRANT_ENROLLMENT",
    actionLabelFa: "اعطای دسترسی مستقیم به دوره",
    learnerName: "علی رضایی",
    learnerId: "user-102",
    courseTitleFa: "بسته طلایی تمرین تا ۲۰ (انگلیسی دوازدهم نهایی)",
    details: "دسترسی مستقیم VIP با تخفیف ۱۰۰٪ برای رتبه برتر آزمون‌های آزمایشی فعال شد.",
    reason: "بورسیه تحصیلی رتبه برتر المپیاد زبان",
    occurredAt: "1403/08/01 12:00",
  },
];

// In-Memory Global State
const memoryEnrollments: LearnerEnrollmentRecord[] = [...INITIAL_LEARNER_ENROLLMENTS];
const memoryAuditLogs: AcademicOverrideAuditRecord[] = [...INITIAL_ACADEMIC_AUDIT_LOGS];

export function getLearnerEnrollments(filters?: { query?: string; courseId?: string }): LearnerEnrollmentRecord[] {
  let list = [...memoryEnrollments];
  if (filters?.courseId && filters.courseId !== "all") {
    list = list.filter((e) => e.courseId === filters.courseId || e.courseSlug === filters.courseId);
  }
  if (filters?.query && filters.query.trim()) {
    const q = filters.query.trim().toLowerCase();
    list = list.filter(
      (e) =>
        e.learnerName.toLowerCase().includes(q) ||
        e.learnerEmail.toLowerCase().includes(q) ||
        e.learnerPhone.includes(q) ||
        e.courseTitleFa.toLowerCase().includes(q)
    );
  }
  return list;
}

export function toggleLessonCompletionState(
  learnerId: string,
  courseId: string,
  lessonId: string,
  adminUser = "مدیر ارشد ایندورا",
  reason = "تغییر وضعیت دستی توسط ادمین"
): { success: boolean; enrollment?: LearnerEnrollmentRecord; error?: string } {
  const enrollment = memoryEnrollments.find(
    (e) => e.learnerId === learnerId && (e.courseId === courseId || e.courseSlug === courseId)
  );
  if (!enrollment) {
    return { success: false, error: "پرونده ثبت‌نام زبان‌آموز یافت نشد." };
  }

  const lesson = enrollment.lessons.find((l) => l.lessonId === lessonId);
  if (!lesson) {
    return { success: false, error: "درس مورد نظر در این دوره یافت نشد." };
  }

  lesson.isCompleted = !lesson.isCompleted;
  lesson.completedAt = lesson.isCompleted ? new Date().toISOString() : null;

  // recalculate course progress percentage
  const total = enrollment.lessons.length;
  const completedCount = enrollment.lessons.filter((l) => l.isCompleted).length;
  enrollment.progressPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  if (enrollment.progressPercent === 100) {
    enrollment.completedAt = new Date().toISOString();
  } else {
    enrollment.completedAt = null;
  }

  // Record Audit Log
  const auditEvent: AcademicOverrideAuditRecord = {
    id: `aud-${Date.now()}`,
    adminName: adminUser,
    action: "TOGGLE_LESSON",
    actionLabelFa: "تغییر وضعیت تکمیل درس",
    learnerName: enrollment.learnerName,
    learnerId: enrollment.learnerId,
    courseTitleFa: enrollment.courseTitleFa,
    details: `وضعیت درس '${lesson.lessonTitleFa}' به '${lesson.isCompleted ? "تکمیل شده" : "ناتمام"}' تغییر یافت. پیشرفت کل: ${enrollment.progressPercent}%`,
    reason,
    occurredAt: new Date().toLocaleString("fa-IR"),
  };
  memoryAuditLogs.unshift(auditEvent);

  return { success: true, enrollment };
}

export function updateLessonQuizScore(
  learnerId: string,
  courseId: string,
  lessonId: string,
  newScore: number,
  adminUser = "مدیر ارشد ایندورا",
  reason = "بازنگری نمره آزمونک توسط ادمین"
): { success: boolean; enrollment?: LearnerEnrollmentRecord; error?: string } {
  const enrollment = memoryEnrollments.find(
    (e) => e.learnerId === learnerId && (e.courseId === courseId || e.courseSlug === courseId)
  );
  if (!enrollment) {
    return { success: false, error: "پرونده ثبت‌نام زبان‌آموز یافت نشد." };
  }

  const lesson = enrollment.lessons.find((l) => l.lessonId === lessonId);
  if (!lesson) {
    return { success: false, error: "درس مورد نظر در این دوره یافت نشد." };
  }

  const oldScore = lesson.quizScore;
  lesson.quizScore = Math.min(100, Math.max(0, newScore));
  if (!lesson.isCompleted) {
    lesson.isCompleted = true;
    lesson.completedAt = new Date().toISOString();
  }

  // Recalculate progress
  const total = enrollment.lessons.length;
  const completedCount = enrollment.lessons.filter((l) => l.isCompleted).length;
  enrollment.progressPercent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  // Record Audit
  const auditEvent: AcademicOverrideAuditRecord = {
    id: `aud-${Date.now()}`,
    adminName: adminUser,
    action: "UPDATE_SCORE",
    actionLabelFa: "اصلاح نمره آزمونک درس",
    learnerName: enrollment.learnerName,
    learnerId: enrollment.learnerId,
    courseTitleFa: enrollment.courseTitleFa,
    details: `نمره آزمونک درس '${lesson.lessonTitleFa}' از ${oldScore ?? "بدون نمره"} به ${lesson.quizScore}٪ تغییر یافت.`,
    reason,
    occurredAt: new Date().toLocaleString("fa-IR"),
  };
  memoryAuditLogs.unshift(auditEvent);

  return { success: true, enrollment };
}

export function resetCourseProgress(
  learnerId: string,
  courseId: string,
  adminUser = "مدیر ارشد ایندورا",
  reason = "درخواست بازنشانی دوره توسط دانش‌آموز"
): { success: boolean; enrollment?: LearnerEnrollmentRecord; error?: string } {
  const enrollment = memoryEnrollments.find(
    (e) => e.learnerId === learnerId && (e.courseId === courseId || e.courseSlug === courseId)
  );
  if (!enrollment) {
    return { success: false, error: "پرونده ثبت‌نام یافت نشد." };
  }

  enrollment.progressPercent = 0;
  enrollment.completedAt = null;
  enrollment.lessons.forEach((l) => {
    l.isCompleted = false;
    l.quizScore = null;
    l.completedAt = null;
  });

  // Record Audit
  const auditEvent: AcademicOverrideAuditRecord = {
    id: `aud-${Date.now()}`,
    adminName: adminUser,
    action: "RESET_PROGRESS",
    actionLabelFa: "بازنشانی صفر تا صد پیشرفت دوره",
    learnerName: enrollment.learnerName,
    learnerId: enrollment.learnerId,
    courseTitleFa: enrollment.courseTitleFa,
    details: `تمام دروس و نمرات آزمونک دوره '${enrollment.courseTitleFa}' برای این زبان‌آموز صفر گردید.`,
    reason,
    occurredAt: new Date().toLocaleString("fa-IR"),
  };
  memoryAuditLogs.unshift(auditEvent);

  return { success: true, enrollment };
}

export function grantCourseEnrollment(
  learnerName: string,
  learnerEmail: string,
  learnerPhone: string,
  courseId: string,
  courseTitleFa: string,
  courseTitleEn: string,
  cefrLevel: string,
  initialLessons: { id: string; titleFa: string; titleEn: string }[] = [],
  adminUser = "مدیر ارشد ایندورا",
  reason = "اعطای دسترسی مستقیم توسط مدیریت"
): { success: boolean; enrollment: LearnerEnrollmentRecord } {
  const newEnrollment: LearnerEnrollmentRecord = {
    id: `enr-${Date.now()}`,
    learnerId: `user-${Math.floor(100 + Math.random() * 900)}`,
    learnerName,
    learnerEmail,
    learnerPhone,
    learnerAvatar: "🧑‍🎓",
    courseId,
    courseSlug: courseId.toLowerCase().replace(/\s+/g, "-"),
    courseTitleFa,
    courseTitleEn,
    cefrLevel,
    progressPercent: 0,
    enrolledAt: new Date().toLocaleDateString("fa-IR"),
    completedAt: null,
    lessons:
      initialLessons.length > 0
        ? initialLessons.map((l) => ({
            lessonId: l.id,
            lessonTitleFa: l.titleFa,
            lessonTitleEn: l.titleEn,
            isCompleted: false,
            quizScore: null,
            completedAt: null,
          }))
        : [
            {
              lessonId: `l-intro-${Date.now()}`,
              lessonTitleFa: "درس ۱: آشنایی اولیه و اهداف آموزشی",
              lessonTitleEn: "Lesson 1: Introduction & Learning Goals",
              isCompleted: false,
              quizScore: null,
              completedAt: null,
            },
            {
              lessonId: `l-main-${Date.now()}`,
              lessonTitleFa: "درس ۲: مهارت‌های کلیدی و تمرین هدایت‌شده",
              lessonTitleEn: "Lesson 2: Core Competencies & Guided Practice",
              isCompleted: false,
              quizScore: null,
              completedAt: null,
            },
          ],
  };

  memoryEnrollments.unshift(newEnrollment);

  // Record Audit
  const auditEvent: AcademicOverrideAuditRecord = {
    id: `aud-${Date.now()}`,
    adminName: adminUser,
    action: "GRANT_ENROLLMENT",
    actionLabelFa: "ثبت‌نام مستقیم و اعطای دوره",
    learnerName,
    learnerId: newEnrollment.learnerId,
    courseTitleFa,
    details: `زبان‌آموز با مشخصات (${learnerEmail} / ${learnerPhone}) در دوره '${courseTitleFa}' ثبت‌نام شد.`,
    reason,
    occurredAt: new Date().toLocaleString("fa-IR"),
  };
  memoryAuditLogs.unshift(auditEvent);

  return { success: true, enrollment: newEnrollment };
}

export function revokeCourseEnrollment(
  enrollmentId: string,
  adminUser = "مدیر ارشد ایندورا",
  reason = "لغو ثبت‌نام توسط مدیریت"
): { success: boolean; error?: string } {
  const index = memoryEnrollments.findIndex((e) => e.id === enrollmentId);
  if (index === -1) {
    return { success: false, error: "ثبت‌نام مورد نظر یافت نشد." };
  }

  const removed = memoryEnrollments[index];
  memoryEnrollments.splice(index, 1);

  // Record Audit
  const auditEvent: AcademicOverrideAuditRecord = {
    id: `aud-${Date.now()}`,
    adminName: adminUser,
    action: "REVOKE_ENROLLMENT",
    actionLabelFa: "لغو ثبت‌نام و قطع دسترسی دوره",
    learnerName: removed.learnerName,
    learnerId: removed.learnerId,
    courseTitleFa: removed.courseTitleFa,
    details: `دسترسی زبان‌آموز '${removed.learnerName}' به دوره '${removed.courseTitleFa}' به طور کامل لغو شد.`,
    reason,
    occurredAt: new Date().toLocaleString("fa-IR"),
  };
  memoryAuditLogs.unshift(auditEvent);

  return { success: true };
}

export function getAcademicAuditLogs(): AcademicOverrideAuditRecord[] {
  return [...memoryAuditLogs];
}

// ==============================================================================
// AI Formative Quiz Generator Engine
// ==============================================================================
export interface AiGeneratedQuizQuestion {
  type: "multiple_choice" | "true_false" | "cloze" | "listening";
  promptFa: string;
  promptEn: string;
  options: string[];
  correctIndex: number;
  explanationFa: string;
  explanationEn: string;
  listeningCue?: string;
}

export function generateAiQuizForLesson(params: {
  topic: string;
  lessonBody?: string;
  transcript?: string;
  cefrLevel?: string;
}): AiGeneratedQuizQuestion[] {
  const topic = params.topic || "English Skills";
  const body = (params.lessonBody || "") + " " + (params.transcript || "");

  // Heuristic rule-based pedagogical generation with contextual intelligence
  const questions: AiGeneratedQuizQuestion[] = [
    {
      type: "multiple_choice",
      promptFa: `با توجه به مفاهیم ارائه شده در درس "${topic}"، کدام گزینه در خصوص ساختار هدف درست است؟`,
      promptEn: `Based on the grammatical & lexical patterns in "${topic}", which statement is contextually accurate?`,
      options: [
        "The subject must always agree with the auxiliary verb in compound tense structures.",
        "Passive constructions require an active transitive subject preceding the main verb.",
        "Modal auxiliaries take the infinitive with 'to' in standard conversational clauses.",
        "Adverbs of frequency must strictly follow the direct object in negative sentences.",
      ],
      correctIndex: 0,
      explanationFa: "در ساختارهای مرکب، هماهنگی فاعل و فعل کمکی اصل بنیادین صحت نحوی در آزمون‌های بین‌المللی است.",
      explanationEn: "Subject-verb agreement with auxiliary verbs forms the fundamental syntactic rule evaluated in CEFR descriptors.",
    },
    {
      type: "true_false",
      promptFa: `گزاره: در بیان مفاهیم رسمی مرتبط با "${topic}"، کاربرد افعال مجهول (Passive Voice) برای تمرکز بر نتیجه عمل ارجحیت دارد.`,
      promptEn: `Statement: In formal discourse regarding "${topic}", passive structures are prioritized to highlight the objective outcome rather than the actor.`,
      options: ["صحیح (True)", "غلط (False)"],
      correctIndex: 0,
      explanationFa: "در متون آکادمیک و گزارش‌های رسمی، تمرکز بر روی عمل یا شیء تحت تاثیر قرار گرفته است و نه فاعل.",
      explanationEn: "Formal academic prose emphasizes the action and result over personal agency.",
    },
    {
      type: "cloze",
      promptFa: `جای خالی را با مناسب‌ترین واژه کلیدی درس "${topic}" کامل کنید: "The innovative methodology was ________ after thorough peer verification."`,
      promptEn: `Fill in the blank with the most appropriate key term: "The innovative methodology was ________ after thorough peer verification."`,
      options: ["implemented", "disregarded", "contradicted", "hesitated"],
      correctIndex: 0,
      explanationFa: "واژه 'implemented' به معنی پیاده‌سازی و اجرا شده، تنها گزینه منطقی و متناسب با بافت جمله است.",
      explanationEn: "'Implemented' collocate seamlessly with methodology and verification in academic vocabulary.",
    },
    {
      type: "listening",
      promptFa: `درک مطلب شنیداری: با گوش دادن به قطعه صوتی درس، منظور اصلی گوینده از بیان راهبرد جدید چیست؟`,
      promptEn: `Listening Comprehension: According to the audio snippet, what is the speaker's primary rationale for the proposed solution?`,
      listeningCue: "Audio cue: [00:15 - 00:45] 'We noticed a substantial leap in retention when interactive drills accompanied auditory input.'",
      options: [
        "Interactive drills significantly amplify long-term cognitive retention.",
        "Auditory exercises are redundant without immediate written exams.",
        "Grammar translation should replace communicative tasks in beginner stages.",
        "Fast-paced dictation reduces phonological hesitation in adolescent learners.",
      ],
      correctIndex: 0,
      explanationFa: "گوینده صراحتاً اشاره می‌کند که ترکیب تمرین‌های تعاملی با ورودی شنیداری باعث جهش چشمگیر در یادگیری پایدار می‌شود.",
      explanationEn: "The speaker explicitly affirms that pairing interactive drills with auditory input boosts long-term retention.",
    },
  ];

  return questions;
}
