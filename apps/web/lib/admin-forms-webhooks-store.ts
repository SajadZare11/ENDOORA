import fs from "fs";
import { recordAuditLog } from "./admin-ops.ts";
import {
  resolveStoragePath,
  atomicWriteJsonSync,
  readJsonWithFallback,
} from "./admin-storage-engine.ts";

// ==============================================================================
// 1. Data Models & Types
// ==============================================================================

export type FormFieldType =
  | "text"
  | "textarea"
  | "radio"
  | "checkbox"
  | "select"
  | "rating"
  | "voice_recording"
  | "file_upload"
  | "phone"
  | "email"
  | "date";

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  isRequired: boolean;
  options?: string[]; // For radio, checkbox, select
  defaultValue?: string | number;
  maxFileSizeMb?: number; // For file_upload
  maxRecordingSeconds?: number; // For voice_recording (e.g. 120s)
}

export interface FormAutomationConfig {
  telegramEnabled: boolean;
  telegramChatId: string;
  telegramBotToken?: string;
  smsEnabled: boolean;
  smsTemplate: string;
  webhookEnabled: boolean;
  webhookUrl: string;
  webhookSecret?: string;
  webhookHeaders?: Record<string, string>;
}

export interface CustomDynamicForm {
  id: string;
  slug: string;
  titleFa: string;
  titleEn: string;
  descriptionFa: string;
  coverBannerUrl?: string;
  status: "published" | "draft" | "closed";
  fields: FormField[];
  automations: FormAutomationConfig;
  submissionCount: number;
  viewCount: number;
  maxSubmissions?: number;
  deadlineIso?: string;
  successMessageFa: string;
  redirectUrl?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface FormSubmissionRecord {
  id: string;
  formId: string;
  formSlug: string;
  submittedAt: string;
  respondentIp: string;
  respondentUserAgent: string;
  respondentEmail?: string;
  respondentPhone?: string;
  answers: Record<string, any>; // fieldId -> value
  webhookStatus: "pending" | "success" | "failed" | "skipped";
  telegramStatus: "sent" | "failed" | "skipped";
  smsStatus: "sent" | "failed" | "skipped";
}

// ==============================================================================
// 2. Pre-Configured Forms & Initial In-Memory State
// ==============================================================================

export const INITIAL_FORMS: CustomDynamicForm[] = [
  {
    id: "frm_01",
    slug: "ielts-placement-oral",
    titleFa: "آزمون تعیین سطح گفتاری و ارزیابی لهجه آیلتس",
    titleEn: "IELTS Speaking Diagnostic & Audio Assessment",
    descriptionFa:
      "لطفاً به سوالات زیر پاسخ داده و بخش اسپیکینگ را با صدای رسا ضبط کنید. سیستم هوش مصنوعی ایندورا تحلیل آکوستیک دقیق را در اختیار شما قرار خواهد داد.",
    coverBannerUrl: "/images/banners/ielts-speaking.webp",
    status: "published",
    submissionCount: 42,
    viewCount: 310,
    deadlineIso: new Date(Date.now() + 15 * 86400 * 1000).toISOString(),
    successMessageFa: "پاسخ‌های شما با موفقیت دریافت شد! نتیجه تحلیل و تعیین سطح ظرف ۲۴ ساعت برای شما پیامک خواهد شد.",
    createdAt: "1403/08/15",
    updatedAt: "1403/08/20",
    createdBy: "مدیر ارشد ایندورا",
    fields: [
      {
        id: "f_name",
        type: "text",
        label: "نام و نام خانوادگی",
        placeholder: "مثال: سارا محمدی",
        isRequired: true,
      },
      {
        id: "f_phone",
        type: "phone",
        label: "شماره همراه (جهت دریافت پیامک نتیجه)",
        placeholder: "09121234567",
        isRequired: true,
      },
      {
        id: "f_target_band",
        type: "select",
        label: "نمره هدف شما در آزمون آیلتس (Target Band)",
        isRequired: true,
        options: ["Band 6.0", "Band 6.5", "Band 7.0", "Band 7.5", "Band 8.0+"],
      },
      {
        id: "f_speaking_audio",
        type: "voice_recording",
        label: "ضبط پاسخ صوتی به تاپیک اسپیکینگ پارت ۲ (Cue Card: Describe a memorable journey)",
        helpText: "دکمه ضبط را فشرده و بین ۶۰ تا ۱۲۰ ثانیه به انگلیسی صحبت کنید.",
        isRequired: true,
        maxRecordingSeconds: 120,
      },
      {
        id: "f_prev_trf",
        type: "file_upload",
        label: "آپلود کارنامه قبلی آزمون (اختیاری - PDF یا تصویر)",
        isRequired: false,
        maxFileSizeMb: 5,
      },
    ],
    automations: {
      telegramEnabled: true,
      telegramChatId: "@endoora_admissions_bot",
      smsEnabled: true,
      smsTemplate: "ielts_placement_received",
      webhookEnabled: true,
      webhookUrl: "https://api.endoora.ir/webhooks/crm-intake",
    },
  },
  {
    id: "frm_02",
    slug: "teacher-recruitment",
    titleFa: "فرم جذب، مصاحبه و همکاری اساتید زبان انگلیسی",
    titleEn: "Teacher Application & Onboarding",
    descriptionFa:
      "اگر دارای مدرک بین‌المللی تدریس (CELTA / DELTA / TESOL) یا نمره آیلتس بالای ۸ هستید، به خانواده مدرسین ایندورا بپیوندید.",
    status: "published",
    submissionCount: 19,
    viewCount: 145,
    successMessageFa: "رزومه شما با موفقیت ثبت شد. تیم آکادمیک ایندورا جهت هماهنگی جلسه دمو با شما تماس خواهد گرفت.",
    createdAt: "1403/08/10",
    updatedAt: "1403/08/18",
    createdBy: "تیم جذب مدرسین",
    fields: [
      {
        id: "t_name",
        type: "text",
        label: "نام و نام خانوادگی",
        placeholder: "نام کامل",
        isRequired: true,
      },
      {
        id: "t_email",
        type: "email",
        label: "ایمیل رسمی",
        placeholder: "teacher@example.com",
        isRequired: true,
      },
      {
        id: "t_experience_years",
        type: "radio",
        label: "سابقه تدریس تخصصی زبان انگلیسی:",
        isRequired: true,
        options: ["کمتر از ۳ سال", "۳ تا ۵ سال", "۵ تا ۱۰ سال", "بیش از ۱۰ سال"],
      },
      {
        id: "t_resume_file",
        type: "file_upload",
        label: "رزومه تحصیلی و شغلی (فایل PDF)",
        isRequired: true,
        maxFileSizeMb: 10,
      },
      {
        id: "t_bio",
        type: "textarea",
        label: "خلاصه‌ای از سبک تدریس و دستاوردهای شاگردان شما",
        placeholder: "توضیح متدولوژی و روش کار...",
        isRequired: false,
      },
    ],
    automations: {
      telegramEnabled: true,
      telegramChatId: "@endoora_hr_channel",
      smsEnabled: true,
      smsTemplate: "teacher_application_confirm",
      webhookEnabled: false,
      webhookUrl: "",
    },
  },
  {
    id: "frm_03",
    slug: "student-satisfaction-1403",
    titleFa: "نظرسنجی کیفیت دوره‌ها و ارزیابی رضایت زبان‌آموزان",
    titleEn: "Student Course Satisfaction & NPS Survey",
    descriptionFa: "دیدگاه‌های شما در بهبود کیفیت آموزش و قابلیت‌های هوش مصنوعی ایندورا تاثیر مستقیم دارد.",
    status: "published",
    submissionCount: 68,
    viewCount: 420,
    successMessageFa: "از بازخورد ارزشمند شما سپاسگزاریم! کد تخفیف ۲۰٪ در حساب کاربری شما فعال شد.",
    createdAt: "1403/08/01",
    updatedAt: "1403/08/19",
    createdBy: "مدیر پشتیبانی و رشد",
    fields: [
      {
        id: "s_overall_rating",
        type: "rating",
        label: "میزان رضایت کلی شما از پلتفرم ایندورا (از ۱ تا ۵ ستاره):",
        isRequired: true,
        defaultValue: 5,
      },
      {
        id: "s_ai_feedback",
        type: "radio",
        label: "دقت بازخورد هوش مصنوعی در تصحیح اسپیکینگ و رایتینگ:",
        isRequired: true,
        options: ["عالی و فراتر از انتظار", "خوب و کاربردی", "متوسط", "نیاز به بهبود دارد"],
      },
      {
        id: "s_comments",
        type: "textarea",
        label: "چه ویژگی یا کلاسی مایلید به سایت اضافه شود؟",
        placeholder: "انتقادات و پیشنهادات شما...",
        isRequired: false,
      },
    ],
    automations: {
      telegramEnabled: false,
      telegramChatId: "",
      smsEnabled: false,
      smsTemplate: "",
      webhookEnabled: true,
      webhookUrl: "https://api.endoora.ir/webhooks/feedback-sync",
    },
  },
  {
    id: "frm_04",
    slug: "corporate-training-request",
    titleFa: "درخواست آموزش سازمانی و دوره‌های شرکتی",
    titleEn: "Corporate Business English Training Inquiry",
    descriptionFa: "ارتقای مهارت زبان تخصصی، مکاتبات بین‌المللی و مذاکره برای مدیران و پرسنل سازمان‌ها.",
    status: "published",
    submissionCount: 8,
    viewCount: 95,
    successMessageFa: "درخواست سازمانی شما ثبت شد. کارشناس آموزش شرکتی ظرف ۴ ساعت کاری با شما تماس خواهد گرفت.",
    createdAt: "1403/08/05",
    updatedAt: "1403/08/12",
    createdBy: "بخش B2B ایندورا",
    fields: [
      {
        id: "c_org_name",
        type: "text",
        label: "نام شرکت یا سازمان",
        placeholder: "مثال: هلدینگ فناوری پیشرو",
        isRequired: true,
      },
      {
        id: "c_contact_person",
        type: "text",
        label: "نام و سمت متقاضی",
        placeholder: "مثال: مدیر منابع انسانی",
        isRequired: true,
      },
      {
        id: "c_phone",
        type: "phone",
        label: "تلفن تماس مستقیم",
        placeholder: "02188888888",
        isRequired: true,
      },
      {
        id: "c_employee_count",
        type: "select",
        label: "تعداد پرسنل متقاضی آموزش:",
        isRequired: true,
        options: ["۱۰ تا ۲۵ نفر", "۲۵ تا ۵۰ نفر", "۵۰ تا ۱۰۰ نفر", "بیش از ۱۰۰ نفر"],
      },
    ],
    automations: {
      telegramEnabled: true,
      telegramChatId: "@endoora_b2b_leads",
      smsEnabled: true,
      smsTemplate: "corporate_lead_ack",
      webhookEnabled: true,
      webhookUrl: "https://crm.endoora.ir/api/leads",
    },
  },
];

export const INITIAL_SUBMISSIONS: FormSubmissionRecord[] = [
  {
    id: "sub-001",
    formId: "frm_01",
    formSlug: "ielts-placement-oral",
    submittedAt: "۱۴۰۳/۰۸/۲۰ ۱۵:۳۰",
    respondentIp: "5.127.18.92",
    respondentUserAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5)",
    respondentPhone: "09123456789",
    answers: {
      f_name: "مریم ابراهیمی",
      f_phone: "09123456789",
      f_target_band: "Band 7.5",
      f_speaking_audio: "/uploads/audio/demo-speaking-maryam.mp3",
      f_prev_trf: "trf-maryam-2023.pdf",
    },
    webhookStatus: "success",
    telegramStatus: "sent",
    smsStatus: "sent",
  },
  {
    id: "sub-002",
    formId: "frm_01",
    formSlug: "ielts-placement-oral",
    submittedAt: "۱۴۰۳/۰۸/۲۰ ۱۲:۱۵",
    respondentIp: "89.198.32.14",
    respondentUserAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    respondentPhone: "09351112233",
    answers: {
      f_name: "کیوان صادقی",
      f_phone: "09351112233",
      f_target_band: "Band 7.0",
      f_speaking_audio: "/uploads/audio/demo-speaking-keyvan.mp3",
      f_prev_trf: null,
    },
    webhookStatus: "success",
    telegramStatus: "sent",
    smsStatus: "sent",
  },
  {
    id: "sub-003",
    formId: "frm_02",
    formSlug: "teacher-recruitment",
    submittedAt: "۱۴۰۳/۰۸/۱۹ ۱۸:۴۵",
    respondentIp: "94.182.110.5",
    respondentUserAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    respondentEmail: "dr.farhadi@example.com",
    answers: {
      t_name: "دکتر فرزاد فرهادی",
      t_email: "dr.farhadi@example.com",
      t_experience_years: "۵ تا ۱۰ سال",
      t_resume_file: "cv-farhad-farhadi-celta.pdf",
      t_bio: "دارنده مدرک CELTA کمبریج با ۹ سال سابقه تدریس مستری آیلتس در موسسات برتر تهران",
    },
    webhookStatus: "skipped",
    telegramStatus: "sent",
    smsStatus: "sent",
  },
  {
    id: "sub-004",
    formId: "frm_03",
    formSlug: "student-satisfaction-1403",
    submittedAt: "۱۴۰۳/۰۸/۲۰ ۱۱:۱۰",
    respondentIp: "188.253.4.12",
    respondentUserAgent: "Mozilla/5.0 (Android 14; Mobile)",
    answers: {
      s_overall_rating: 5,
      s_ai_feedback: "عالی و فراتر از انتظار",
      s_comments: "تمرین‌های اسپیکینگ هوش مصنوعی با فیدبک تلفظ فونتیک بسیار عالی بود.",
    },
    webhookStatus: "success",
    telegramStatus: "skipped",
    smsStatus: "skipped",
  },
];

// ==============================================================================
// 3. Persistent State & Store Accessors (forms-webhooks-operations.json)
// ==============================================================================
export interface FormsWebhooksStoragePayload {
  forms: CustomDynamicForm[];
  submissions: FormSubmissionRecord[];
}

let inMemoryFormsWebhooks: FormsWebhooksStoragePayload | null = null;
let lastFormsWebhooksMtime = 0;

function getFormsWebhooksPath(): string {
  return resolveStoragePath("forms-webhooks-operations.json");
}

export function getFormsWebhooksStorage(): FormsWebhooksStoragePayload {
  const filePath = getFormsWebhooksPath();
  if (inMemoryFormsWebhooks && fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    if (stats.mtimeMs <= lastFormsWebhooksMtime) {
      return inMemoryFormsWebhooks;
    }
  }

  const { data, mtime } = readJsonWithFallback<FormsWebhooksStoragePayload>(
    filePath,
    () => ({
      forms: JSON.parse(JSON.stringify(INITIAL_FORMS)),
      submissions: JSON.parse(JSON.stringify(INITIAL_SUBMISSIONS)),
    }),
    (p): p is FormsWebhooksStoragePayload =>
      Array.isArray(p?.forms) && Array.isArray(p?.submissions)
  );

  inMemoryFormsWebhooks = data;
  lastFormsWebhooksMtime = mtime;
  return inMemoryFormsWebhooks;
}

export function persistFormsWebhooks(): void {
  if (!inMemoryFormsWebhooks) return;
  const filePath = getFormsWebhooksPath();
  atomicWriteJsonSync(filePath, inMemoryFormsWebhooks);
  if (fs.existsSync(filePath)) {
    lastFormsWebhooksMtime = fs.statSync(filePath).mtimeMs;
  }
}

// ==============================================================================
// Store Handlers & Operations
// ==============================================================================

// 1. Get Forms
export function getCustomFormsList(): CustomDynamicForm[] {
  return [...getFormsWebhooksStorage().forms];
}

export function getCustomFormBySlug(slug: string): CustomDynamicForm | undefined {
  return getFormsWebhooksStorage().forms.find((f) => f.slug === slug);
}

export function getCustomFormById(id: string): CustomDynamicForm | undefined {
  return getFormsWebhooksStorage().forms.find((f) => f.id === id);
}

// 2. Save / Create Form
export function saveCustomForm(
  formData: Partial<CustomDynamicForm> & { titleFa: string; slug: string },
  adminUser = "مدیر ارشد ایندورا"
): { success: boolean; form: CustomDynamicForm } {
  const storage = getFormsWebhooksStorage();
  const existingIndex = storage.forms.findIndex((f) => f.id === formData.id || f.slug === formData.slug);

  if (existingIndex !== -1) {
    const oldForm = storage.forms[existingIndex];
    const updatedForm: CustomDynamicForm = {
      ...oldForm,
      ...formData,
      fields: formData.fields || oldForm.fields,
      automations: formData.automations || oldForm.automations,
      updatedAt: new Date().toLocaleDateString("fa-IR"),
    };
    storage.forms[existingIndex] = updatedForm;
    persistFormsWebhooks();

    recordAuditLog({
      actor_id: null,
      actor_email: adminUser,
      actor_role: "administrator",
      action: "update",
      target_app: "dynamic_forms",
      target_model: "CustomDynamicForm",
      target_pk: updatedForm.id,
      before_summary: { titleFa: oldForm.titleFa, fieldsCount: oldForm.fields.length },
      after_summary: { titleFa: updatedForm.titleFa, fieldsCount: updatedForm.fields.length },
      reason: `به‌روزرسانی فرم پویا: ${updatedForm.titleFa}`,
      request_method: "POST",
      request_path: "/api/admin/forms",
      environment: "production",
    });

    return { success: true, form: updatedForm };
  }

  // Create new form
  const id = `frm_${Date.now()}`;
  const newForm: CustomDynamicForm = {
    id,
    slug: formData.slug.trim().toLowerCase().replace(/\s+/g, "-"),
    titleFa: formData.titleFa,
    titleEn: formData.titleEn || formData.slug,
    descriptionFa: formData.descriptionFa || "",
    status: formData.status || "published",
    fields: formData.fields || [],
    automations: formData.automations || {
      telegramEnabled: false,
      telegramChatId: "",
      smsEnabled: false,
      smsTemplate: "",
      webhookEnabled: false,
      webhookUrl: "",
    },
    submissionCount: 0,
    viewCount: 0,
    maxSubmissions: formData.maxSubmissions,
    deadlineIso: formData.deadlineIso,
    successMessageFa: formData.successMessageFa || "پاسخ شما با موفقیت ثبت شد.",
    createdAt: new Date().toLocaleDateString("fa-IR"),
    updatedAt: new Date().toLocaleDateString("fa-IR"),
    createdBy: adminUser,
  };

  storage.forms.unshift(newForm);
  persistFormsWebhooks();

  recordAuditLog({
    actor_id: null,
    actor_email: adminUser,
    actor_role: "administrator",
    action: "create",
    target_app: "dynamic_forms",
    target_model: "CustomDynamicForm",
    target_pk: id,
    before_summary: {},
    after_summary: { titleFa: newForm.titleFa, slug: newForm.slug, fieldsCount: newForm.fields.length },
    reason: `طراحی و انتشار فرم پویای جدید: ${newForm.titleFa}`,
    request_method: "POST",
    request_path: "/api/admin/forms",
    environment: "production",
  });

  return { success: true, form: newForm };
}

// 3. Delete Form
export function deleteCustomForm(formId: string, adminUser = "مدیر ارشد ایندورا"): { success: boolean } {
  const storage = getFormsWebhooksStorage();
  const index = storage.forms.findIndex((f) => f.id === formId);
  if (index === -1) return { success: false };

  const [removed] = storage.forms.splice(index, 1);
  persistFormsWebhooks();

  recordAuditLog({
    actor_id: null,
    actor_email: adminUser,
    actor_role: "administrator",
    action: "delete",
    target_app: "dynamic_forms",
    target_model: "CustomDynamicForm",
    target_pk: formId,
    before_summary: { titleFa: removed.titleFa, slug: removed.slug },
    after_summary: {},
    reason: `حذف فرم پویای ${removed.titleFa}`,
    request_method: "DELETE",
    request_path: "/api/admin/forms",
    environment: "production",
  });

  return { success: true };
}

// 4. Submissions Explorer
export function getFormSubmissions(formIdOrSlug?: string): FormSubmissionRecord[] {
  const storage = getFormsWebhooksStorage();
  if (!formIdOrSlug || formIdOrSlug === "all") {
    return [...storage.submissions];
  }
  return storage.submissions.filter(
    (s) => s.formId === formIdOrSlug || s.formSlug === formIdOrSlug
  );
}

export function submitPublicFormResponse(
  slug: string,
  answers: Record<string, any>,
  clientIp = "127.0.0.1",
  userAgent = "Mozilla/5.0"
): { success: boolean; submission?: FormSubmissionRecord; messageFa?: string; error?: string } {
  const storage = getFormsWebhooksStorage();
  const form = storage.forms.find((f) => f.slug === slug);
  if (!form) return { success: false, error: "فرم مورد نظر یافت نشد." };
  if (form.status === "closed") return { success: false, error: "مهلت ثبت پاسخ در این فرم به پایان رسیده است." };

  // Validate required fields
  for (const field of form.fields) {
    if (field.isRequired && (answers[field.id] === undefined || answers[field.id] === null || answers[field.id] === "")) {
      return { success: false, error: `تکمیل فیلد «${field.label}» الزامی است.` };
    }
  }

  const subId = `sub_${Date.now()}`;
  const submission: FormSubmissionRecord = {
    id: subId,
    formId: form.id,
    formSlug: form.slug,
    submittedAt: new Date().toLocaleString("fa-IR"),
    respondentIp: clientIp,
    respondentUserAgent: userAgent,
    respondentPhone: answers.f_phone || answers.c_phone || answers.phone || undefined,
    respondentEmail: answers.t_email || answers.email || undefined,
    answers,
    webhookStatus: form.automations.webhookEnabled ? "success" : "skipped",
    telegramStatus: form.automations.telegramEnabled ? "sent" : "skipped",
    smsStatus: form.automations.smsEnabled ? "sent" : "skipped",
  };

  storage.submissions.unshift(submission);
  form.submissionCount += 1;
  persistFormsWebhooks();

  return {
    success: true,
    submission,
    messageFa: form.successMessageFa || "پاسخ شما با موفقیت ثبت شد.",
  };
}

export function updateSubmissionWebhookStatus(
  submissionId: string,
  status: "pending" | "success" | "failed" | "skipped"
): boolean {
  const storage = getFormsWebhooksStorage();
  const sub = storage.submissions.find((s) => s.id === submissionId);
  if (!sub) return false;
  sub.webhookStatus = status;
  persistFormsWebhooks();
  return true;
}

// 5. Test Webhook Ping
export async function testWebhookEndpoint(
  url: string,
  samplePayload?: any
): Promise<{ success: boolean; latencyMs: number; statusCode: number; responseSnippet: string }> {
  const start = Date.now();
  try {
    // If testing external url via fetch
    const payload = samplePayload || {
      event: "form_submission.test",
      form_slug: "test-form-endoora",
      respondent: { name: "آزمایش‌کننده ایندورا", phone: "09120000000" },
      timestamp: new Date().toISOString(),
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Endoora-Webhook-Test": "true",
        "User-Agent": "Endoora-Webhook-Verification/1.0",
      },
      body: JSON.stringify(payload),
      redirect: "error", // Prevent SSRF via 3xx redirects
      signal: AbortSignal.timeout(5000), // Enforce 5-second timeout
    });

    const latencyMs = Date.now() - start;

    // Safely read up to 2KB of response to avoid memory exhaustion
    let responseSnippet = "OK (بدون بادی)";
    if (res.body) {
      const reader = res.body.getReader();
      const { value } = await reader.read();
      if (value) {
        responseSnippet = new TextDecoder().decode(value).slice(0, 150);
      }
      await reader.cancel();
    }

    return {
      success: res.ok,
      latencyMs,
      statusCode: res.status,
      responseSnippet: responseSnippet || `کد وضعیت HTTP: ${res.status}`,
    };
  } catch (err: any) {
    return {
      success: false,
      latencyMs: Date.now() - start,
      statusCode: 0,
      responseSnippet: `خطا در اتصال: ${err?.name === "TimeoutError" ? "مهلت زمانی ارتباط به پایان رسید (Timeout 5s)" : err?.message || "عدم دسترسی به سرور مقصد"}`,
    };
  }
}
