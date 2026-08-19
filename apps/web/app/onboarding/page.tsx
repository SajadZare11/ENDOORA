"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { AuthShell } from "../../components/auth/AuthShell";
import authStyles from "../../components/auth/auth.module.css";
import {
  apiErrorMessages,
  endooraApi,
  type EndooraLocale,
} from "../../lib/endoora-api";
import styles from "./onboarding.module.css";

type AccountRole = "learner" | "teacher";

type OnboardingProgress = {
  id: string;
  role: AccountRole;
  stage: string;
  current_step: number;
  completed_steps: number[];
  draft_data: Record<string, unknown>;
  is_completed: boolean;
  completed_at: string | null;
};

type AccountSummary = {
  account: {
    id: string;
    email: string;
    role: AccountRole;
    preferred_locale: EndooraLocale;
  };
  profile_completeness: number;
  onboarding: OnboardingProgress | null;
};

type LearnerProfile = {
  id?: string;
  goal: string;
  age_band: string;
  current_estimate: string;
  preferred_daily_minutes: number | null;
  preferred_days: string[];
  timezone: string;
  completeness_percent?: number;
};

type TeacherProfile = {
  id?: string;
  public_name: string;
  bio: string;
  experience_years: number | null;
  specialties: string[];
  city: string;
  languages: string[];
  availability_intent: boolean;
  verification_intent: boolean;
  completeness_percent?: number;
};

const emptyLearner: LearnerProfile = {
  goal: "",
  age_band: "",
  current_estimate: "unknown",
  preferred_daily_minutes: 30,
  preferred_days: [],
  timezone: "Asia/Tehran",
};

const emptyTeacher: TeacherProfile = {
  public_name: "",
  bio: "",
  experience_years: null,
  specialties: [],
  city: "",
  languages: [],
  availability_intent: false,
  verification_intent: false,
};

const weekdays = [
  "saturday",
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
] as const;

const copy = {
  fa: {
    loading: "در حال بارگذاری اطلاعات حساب…",
    titleLearner: "شروع مسیر یادگیری",
    titleTeacher: "راه‌اندازی پروفایل مدرس",
    descriptionLearner:
      "فقط اطلاعاتی را می‌گیریم که برای ساخت اولین مسیر یادگیری شما لازم است.",
    descriptionTeacher:
      "اطلاعات اولیه حرفه‌ای خود را وارد کنید. درخواست تأیید مدرس به معنی تأیید خودکار نیست.",
    step: "مرحله",
    of: "از",
    basic: "اطلاعات اولیه",
    preferences: "ترجیحات",
    review: "بررسی نهایی",
    goal: "هدف اصلی شما",
    choose: "انتخاب کنید",
    generalEnglish: "انگلیسی عمومی",
    conversation: "مکالمه",
    ielts: "IELTS",
    academic: "انگلیسی دانشگاهی",
    work: "کار و حرفه",
    travel: "سفر",
    school: "انگلیسی مدرسه",
    other: "سایر",
    ageBand: "گروه سنی",
    under13: "زیر ۱۳ سال",
    age1315: "۱۳ تا ۱۵",
    age1617: "۱۶ تا ۱۷",
    age1824: "۱۸ تا ۲۴",
    age2534: "۲۵ تا ۳۴",
    age3544: "۳۵ تا ۴۴",
    age45: "۴۵ سال و بیشتر",
    preferNot: "ترجیح می‌دهم نگویم",
    currentEstimate: "سطح فعلی تقریبی",
    unknown: "نمی‌دانم",
    dailyMinutes: "زمان مطالعه روزانه",
    minutes: "دقیقه",
    studyDays: "روزهای مناسب برای یادگیری",
    timezone: "منطقه زمانی",
    saturday: "شنبه",
    sunday: "یکشنبه",
    monday: "دوشنبه",
    tuesday: "سه‌شنبه",
    wednesday: "چهارشنبه",
    thursday: "پنجشنبه",
    friday: "جمعه",
    publicName: "نام نمایشی مدرس",
    experience: "سابقه تدریس",
    years: "سال",
    city: "شهر",
    bio: "معرفی کوتاه",
    specialties: "تخصص‌ها",
    specialtiesHelp:
      "با ویرگول جدا کنید؛ مثال: IELTS, Conversation",
    languages: "زبان‌هایی که استفاده می‌کنید",
    languagesHelp:
      "با ویرگول جدا کنید؛ مثال: Persian, English",
    availabilityIntent:
      "مایلم بعداً زمان‌های تدریس خود را ثبت کنم.",
    verificationIntent:
      "مایلم فرایند تأیید مدرس را آغاز کنم.",
    verificationNotice:
      "این گزینه فقط علاقه شما به شروع فرایند تأیید را ثبت می‌کند و هیچ دسترسی ویژه یا امکان کلاس پولی ایجاد نمی‌کند.",
    saveLater: "ذخیره و ادامه در آینده",
    saving: "در حال ذخیره…",
    saved: "اطلاعات شما با موفقیت روی سرور ذخیره شد.",
    back: "مرحله قبل",
    next: "ادامه",
    complete: "تکمیل شروع حساب",
    errorTitle: "لطفاً موارد زیر را بررسی کنید",
    requiredGoal: "یک هدف اصلی انتخاب کنید.",
    requiredAge: "گروه سنی را انتخاب کنید.",
    requiredDays: "حداقل یک روز مناسب انتخاب کنید.",
    invalidMinutes:
      "زمان روزانه باید بین ۵ تا ۲۴۰ دقیقه باشد.",
    requiredTeacherName: "نام نمایشی مدرس را وارد کنید.",
    invalidExperience: "سابقه تدریس معتبر وارد کنید.",
    requiredCity: "شهر را وارد کنید.",
    requiredBio: "یک معرفی کوتاه وارد کنید.",
    requiredSpecialty: "حداقل یک تخصص وارد کنید.",
    requiredLanguage: "حداقل یک زبان وارد کنید.",
    finishedTitle: "اطلاعات اولیه تکمیل شد",
    finishedLearner:
      "پروفایل اولیه شما ذخیره شد و Endoora آماده ساخت مراحل بعدی مسیر یادگیری است.",
    finishedTeacher:
      "پروفایل اولیه مدرس ذخیره شد. تأیید مدرس و دسترسی‌های حرفه‌ای در مراحل جداگانه بررسی می‌شوند.",
    home: "بازگشت به صفحه اصلی",
    login: "ورود به حساب",
    notSignedIn:
      "برای ادامه ثبت‌نام باید وارد حساب Endoora شوید.",
    email: "حساب",
  },

  en: {
    loading: "Loading your account…",
    titleLearner: "Set up your learning journey",
    titleTeacher: "Set up your teacher profile",
    descriptionLearner:
      "We only ask for information needed to build your first learning path.",
    descriptionTeacher:
      "Enter your initial professional information. Requesting verification does not automatically verify your account.",
    step: "Step",
    of: "of",
    basic: "Basic information",
    preferences: "Preferences",
    review: "Review",
    goal: "Your main goal",
    choose: "Choose",
    generalEnglish: "General English",
    conversation: "Conversation",
    ielts: "IELTS",
    academic: "Academic English",
    work: "Work and career",
    travel: "Travel",
    school: "School English",
    other: "Other",
    ageBand: "Age band",
    under13: "Under 13",
    age1315: "13–15",
    age1617: "16–17",
    age1824: "18–24",
    age2534: "25–34",
    age3544: "35–44",
    age45: "45+",
    preferNot: "Prefer not to say",
    currentEstimate: "Current level estimate",
    unknown: "I don't know",
    dailyMinutes: "Daily study time",
    minutes: "minutes",
    studyDays: "Preferred learning days",
    timezone: "Timezone",
    saturday: "Saturday",
    sunday: "Sunday",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    publicName: "Public teacher name",
    experience: "Teaching experience",
    years: "years",
    city: "City",
    bio: "Short bio",
    specialties: "Specialties",
    specialtiesHelp:
      "Separate with commas; for example: IELTS, Conversation",
    languages: "Languages you use",
    languagesHelp:
      "Separate with commas; for example: Persian, English",
    availabilityIntent:
      "I would like to add my teaching availability later.",
    verificationIntent:
      "I would like to begin teacher verification.",
    verificationNotice:
      "This only records your intention to begin verification. It does not grant verification, marketplace access, or paid-class privileges.",
    saveLater: "Save and continue later",
    saving: "Saving…",
    saved: "Your information has been saved on the server.",
    back: "Back",
    next: "Continue",
    complete: "Complete account setup",
    errorTitle: "Check the following",
    requiredGoal: "Choose your main goal.",
    requiredAge: "Choose an age band.",
    requiredDays: "Choose at least one learning day.",
    invalidMinutes:
      "Daily study time must be between 5 and 240 minutes.",
    requiredTeacherName: "Enter your public teacher name.",
    invalidExperience: "Enter valid teaching experience.",
    requiredCity: "Enter your city.",
    requiredBio: "Enter a short bio.",
    requiredSpecialty: "Enter at least one specialty.",
    requiredLanguage: "Enter at least one language.",
    finishedTitle: "Initial setup complete",
    finishedLearner:
      "Your initial profile is saved and Endoora is ready for the next learning-path steps.",
    finishedTeacher:
      "Your initial teacher profile is saved. Verification and professional capabilities are reviewed separately.",
    home: "Return to home",
    login: "Log in",
    notSignedIn:
      "You must be signed in to continue Endoora onboarding.",
    email: "Account",
  },
} as const;

function commaList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function displayList(value: string[]): string {
  return value.join(", ");
}

export default function OnboardingPage() {
  const [locale, setLocale] =
    useState<EndooraLocale>("fa");

  const [summary, setSummary] =
    useState<AccountSummary | null>(null);

  const [learner, setLearner] =
    useState<LearnerProfile>(emptyLearner);

  const [teacher, setTeacher] =
    useState<TeacherProfile>(emptyTeacher);

  const [specialtiesText, setSpecialtiesText] =
    useState("");

  const [languagesText, setLanguagesText] =
    useState("");

  const [step, setStep] = useState(1);

  const [completedSteps, setCompletedSteps] =
    useState<number[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [finished, setFinished] = useState(false);

  const [errors, setErrors] =
    useState<string[]>([]);

  const t = copy[locale];

  useEffect(() => {
  let cancelled = false;
  let errorLocale: EndooraLocale = "fa";

  endooraApi<AccountSummary>(
    "/profiles/account-summary/",
  )
    .then(async (account) => {
      if (cancelled) {
        return;
      }

      const accountLocale: EndooraLocale =
        account.account.preferred_locale === "en"
          ? "en"
          : "fa";

      errorLocale = accountLocale;

      setSummary(account);
      setLocale(accountLocale);

      if (account.onboarding) {
        setStep(
          Math.min(
            Math.max(
              account.onboarding.current_step,
              1,
            ),
            3,
          ),
        );

        setCompletedSteps(
          account.onboarding.completed_steps,
        );

        if (account.onboarding.is_completed) {
          setFinished(true);
        }
      }

      if (account.account.role === "learner") {
        const profile =
          await endooraApi<LearnerProfile>(
            "/profiles/learner/",
          );

        if (!cancelled) {
          setLearner(profile);
        }

        return;
      }

      const profile =
        await endooraApi<TeacherProfile>(
          "/profiles/teacher/",
        );

      if (!cancelled) {
        setTeacher(profile);

        setSpecialtiesText(
          displayList(profile.specialties),
        );

        setLanguagesText(
          displayList(profile.languages),
        );
      }
    })
    .catch((error: unknown) => {
      if (!cancelled) {
        setErrors(
          apiErrorMessages(
            error,
            errorLocale,
          ),
        );
      }
    })
    .finally(() => {
      if (!cancelled) {
        setLoading(false);
      }
    });

  return () => {
    cancelled = true;
  };
}, []);

  function validateCurrentStep(): string[] {
    const nextErrors: string[] = [];

    if (!summary) {
      return nextErrors;
    }

    if (
      summary.account.role === "learner"
    ) {
      if (step === 1) {
        if (!learner.goal) {
          nextErrors.push(
            t.requiredGoal,
          );
        }

        if (!learner.age_band) {
          nextErrors.push(
            t.requiredAge,
          );
        }
      }

      if (step === 2) {
        const minutes =
          learner.preferred_daily_minutes;

        if (
          minutes === null ||
          minutes < 5 ||
          minutes > 240
        ) {
          nextErrors.push(
            t.invalidMinutes,
          );
        }

        if (
          learner.preferred_days.length ===
          0
        ) {
          nextErrors.push(
            t.requiredDays,
          );
        }
      }
    } else {
      if (step === 1) {
        if (
          !teacher.public_name.trim()
        ) {
          nextErrors.push(
            t.requiredTeacherName,
          );
        }

        if (
          teacher.experience_years ===
            null ||
          teacher.experience_years < 0 ||
          teacher.experience_years > 70
        ) {
          nextErrors.push(
            t.invalidExperience,
          );
        }

        if (!teacher.city.trim()) {
          nextErrors.push(
            t.requiredCity,
          );
        }
      }

      if (step === 2) {
        if (!teacher.bio.trim()) {
          nextErrors.push(
            t.requiredBio,
          );
        }

        if (
          commaList(
            specialtiesText,
          ).length === 0
        ) {
          nextErrors.push(
            t.requiredSpecialty,
          );
        }

        if (
          commaList(
            languagesText,
          ).length === 0
        ) {
          nextErrors.push(
            t.requiredLanguage,
          );
        }
      }
    }

    return nextErrors;
  }

  async function saveProfile() {
    if (!summary) {
      return;
    }

    if (
      summary.account.role === "learner"
    ) {
      await endooraApi<LearnerProfile>(
        "/profiles/learner/",
        {
          method: "PATCH",
          json: learner,
        },
      );

      return;
    }

    const specialties =
      commaList(specialtiesText);

    const languages =
      commaList(languagesText);

    const nextTeacher = {
      ...teacher,
      specialties,
      languages,
    };

    const result =
      await endooraApi<TeacherProfile>(
        "/profiles/teacher/",
        {
          method: "PATCH",
          json: nextTeacher,
        },
      );

    setTeacher(result);

    setSpecialtiesText(
      displayList(result.specialties),
    );

    setLanguagesText(
      displayList(result.languages),
    );
  }

  async function persistProgress(
    targetStep: number,
    markCurrentComplete: boolean,
  ) {
    const nextCompleted =
      markCurrentComplete
        ? Array.from(
            new Set([
              ...completedSteps,
              step,
            ]),
          ).sort((a, b) => a - b)
        : completedSteps;

    await endooraApi<OnboardingProgress>(
      "/profiles/onboarding/",
      {
        method: "PATCH",
        json: {
          current_step: targetStep,
          completed_steps:
            nextCompleted,
          draft_data: {
            last_saved_step: step,
          },
        },
      },
    );

    setCompletedSteps(
      nextCompleted,
    );
  }

  async function saveAndStay() {
    const validationErrors =
      validateCurrentStep();

    if (
      validationErrors.length > 0
    ) {
      setErrors(
        validationErrors,
      );

      return;
    }

    setSaving(true);
    setErrors([]);
    setSaved(false);

    try {
      await saveProfile();

      await persistProgress(
        step,
        false,
      );

      setSaved(true);
    } catch (error) {
      setErrors(
        apiErrorMessages(
          error,
          locale,
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  async function moveNext(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const validationErrors =
      validateCurrentStep();

    if (
      validationErrors.length > 0
    ) {
      setErrors(
        validationErrors,
      );

      return;
    }

    setSaving(true);
    setErrors([]);
    setSaved(false);

    try {
      await saveProfile();

      const nextStep = Math.min(
        step + 1,
        3,
      );

      await persistProgress(
        nextStep,
        true,
      );

      setStep(nextStep);
      setSaved(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      setErrors(
        apiErrorMessages(
          error,
          locale,
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  async function completeOnboarding() {
    setSaving(true);
    setErrors([]);
    setSaved(false);

    try {
      await saveProfile();

      await persistProgress(
        3,
        true,
      );

      await endooraApi<OnboardingProgress>(
        "/profiles/onboarding/complete/",
        {
          method: "POST",
          json: {},
        },
      );

      setFinished(true);
    } catch (error) {
      setErrors(
        apiErrorMessages(
          error,
          locale,
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  function toggleLearnerDay(
    day: string,
  ) {
    setLearner((current) => {
      const exists =
        current.preferred_days.includes(
          day,
        );

      return {
        ...current,
        preferred_days: exists
          ? current.preferred_days.filter(
              (item) => item !== day,
            )
          : [
              ...current.preferred_days,
              day,
            ],
      };
    });
  }

  if (loading) {
    return (
      <AuthShell
        locale={locale}
        onLocaleChange={setLocale}
        title="Endoora"
        description={t.loading}
      >
        <div
          className="endoora-status-message"
          role="status"
        >
          {t.loading}
        </div>
      </AuthShell>
    );
  }

  if (!summary) {
    return (
      <AuthShell
        locale={locale}
        onLocaleChange={setLocale}
        title="Endoora"
        description={
          t.notSignedIn
        }
        footer={
          <Link href="/auth/login">
            {t.login}
          </Link>
        }
      >
        {errors.length > 0 ? (
          <div
            className="endoora-error-summary"
            role="alert"
          >
            <ul>
              {errors.map(
                (
                  message,
                  index,
                ) => (
                  <li
                    key={`${message}-${index}`}
                  >
                    {message}
                  </li>
                ),
              )}
            </ul>
          </div>
        ) : null}
      </AuthShell>
    );
  }

  const isLearner =
    summary.account.role ===
    "learner";

  if (finished) {
    return (
      <AuthShell
        locale={locale}
        onLocaleChange={setLocale}
        title={
          t.finishedTitle
        }
        description={
          isLearner
            ? t.finishedLearner
            : t.finishedTeacher
        }
        footer={
          <Link href="/">
            {t.home}
          </Link>
        }
      >
        <div
          className="endoora-status-message endoora-status-message--success"
          role="status"
        >
          {isLearner
            ? t.finishedLearner
            : t.finishedTeacher}
        </div>
      </AuthShell>
    );
  }

  const title = isLearner
    ? t.titleLearner
    : t.titleTeacher;

  const description =
    isLearner
      ? t.descriptionLearner
      : t.descriptionTeacher;

  const stepNames = [
    t.basic,
    t.preferences,
    t.review,
  ];

  return (
    <AuthShell
      locale={locale}
      onLocaleChange={
        setLocale
      }
      title={title}
      description={
        description
      }
      footer={
        <span>
          {t.email}:{" "}
          <span
            dir="ltr"
            className="ltr-isolate"
          >
            {
              summary.account
                .email
            }
          </span>
        </span>
      }
    >
      <div
        className={
          styles.progress
        }
      >
        <p
          className={
            styles.progressText
          }
        >
          {t.step} {step}{" "}
          {t.of} 3 —{" "}
          {
            stepNames[
              step - 1
            ]
          }
        </p>

        <ol
          className={
            styles.progressList
          }
          aria-label={`${t.step} ${step} ${t.of} 3`}
        >
          {[1, 2, 3].map(
            (number) => (
              <li
                key={number}
                className={`${
                  styles.progressItem
                } ${
                  completedSteps.includes(
                    number,
                  )
                    ? styles.progressItemComplete
                    : number ===
                        step
                      ? styles.progressItemActive
                      : ""
                }`}
              />
            ),
          )}
        </ol>
      </div>

      {saved ? (
        <div
          className={`endoora-status-message endoora-status-message--success ${styles.saved}`}
          role="status"
        >
          {t.saved}
        </div>
      ) : null}

      {errors.length > 0 ? (
        <div
          className="endoora-error-summary"
          role="alert"
          aria-labelledby="onboarding-errors"
        >
          <h3 id="onboarding-errors">
            {t.errorTitle}
          </h3>

          <ul>
            {errors.map(
              (
                message,
                index,
              ) => (
                <li
                  key={`${message}-${index}`}
                >
                  {message}
                </li>
              ),
            )}
          </ul>
        </div>
      ) : null}

      {step < 3 ? (
        <form
          className={
            styles.form
          }
          onSubmit={
            moveNext
          }
          noValidate
        >
          {isLearner &&
          step === 1 ? (
            <div
              className={
                styles.grid
              }
            >
              <div className="endoora-field">
                <label
                  className="endoora-field__label"
                  htmlFor="learner-goal"
                >
                  {t.goal}
                </label>

                <select
                  id="learner-goal"
                  className="endoora-select"
                  value={
                    learner.goal
                  }
                  onChange={(
                    event,
                  ) =>
                    setLearner(
                      (
                        current,
                      ) => ({
                        ...current,
                        goal:
                          event
                            .target
                            .value,
                      }),
                    )
                  }
                >
                  <option value="">
                    {t.choose}
                  </option>

                  <option value="general_english">
                    {
                      t.generalEnglish
                    }
                  </option>

                  <option value="conversation">
                    {
                      t.conversation
                    }
                  </option>

                  <option value="ielts">
                    {t.ielts}
                  </option>

                  <option value="academic">
                    {t.academic}
                  </option>

                  <option value="work">
                    {t.work}
                  </option>

                  <option value="travel">
                    {t.travel}
                  </option>

                  <option value="school">
                    {t.school}
                  </option>

                  <option value="other">
                    {t.other}
                  </option>
                </select>
              </div>

              <div className="endoora-field">
                <label
                  className="endoora-field__label"
                  htmlFor="learner-age"
                >
                  {t.ageBand}
                </label>

                <select
                  id="learner-age"
                  className="endoora-select"
                  value={
                    learner.age_band
                  }
                  onChange={(
                    event,
                  ) =>
                    setLearner(
                      (
                        current,
                      ) => ({
                        ...current,
                        age_band:
                          event
                            .target
                            .value,
                      }),
                    )
                  }
                >
                  <option value="">
                    {t.choose}
                  </option>

                  <option value="under_13">
                    {t.under13}
                  </option>

                  <option value="13_15">
                    {t.age1315}
                  </option>

                  <option value="16_17">
                    {t.age1617}
                  </option>

                  <option value="18_24">
                    {t.age1824}
                  </option>

                  <option value="25_34">
                    {t.age2534}
                  </option>

                  <option value="35_44">
                    {t.age3544}
                  </option>

                  <option value="45_plus">
                    {t.age45}
                  </option>

                  <option value="prefer_not">
                    {
                      t.preferNot
                    }
                  </option>
                </select>
              </div>

              <div
                className={`endoora-field ${styles.fullWidth}`}
              >
                <label
                  className="endoora-field__label"
                  htmlFor="learner-level"
                >
                  {
                    t.currentEstimate
                  }
                </label>

                <select
                  id="learner-level"
                  className="endoora-select"
                  value={
                    learner.current_estimate
                  }
                  onChange={(
                    event,
                  ) =>
                    setLearner(
                      (
                        current,
                      ) => ({
                        ...current,
                        current_estimate:
                          event
                            .target
                            .value,
                      }),
                    )
                  }
                >
                  <option value="unknown">
                    {t.unknown}
                  </option>

                  {[
                    "A1",
                    "A2",
                    "B1",
                    "B2",
                    "C1",
                    "C2",
                  ].map(
                    (level) => (
                      <option
                        key={
                          level
                        }
                        value={
                          level
                        }
                      >
                        {
                          level
                        }
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>
          ) : null}

          {isLearner &&
          step === 2 ? (
            <div
              className={
                styles.grid
              }
            >
              <div className="endoora-field">
                <label
                  className="endoora-field__label"
                  htmlFor="daily-minutes"
                >
                  {
                    t.dailyMinutes
                  }
                </label>

                <input
                  id="daily-minutes"
                  type="number"
                  min={5}
                  max={240}
                  step={5}
                  className={`endoora-input ${styles.ltr}`}
                  value={
                    learner.preferred_daily_minutes ??
                    ""
                  }
                  onChange={(
                    event,
                  ) =>
                    setLearner(
                      (
                        current,
                      ) => ({
                        ...current,
                        preferred_daily_minutes:
                          event
                            .target
                            .value
                            ? Number(
                                event
                                  .target
                                  .value,
                              )
                            : null,
                      }),
                    )
                  }
                />

                <p className="endoora-field__help">
                  {t.minutes}
                </p>
              </div>

              <div className="endoora-field">
                <label
                  className="endoora-field__label"
                  htmlFor="timezone"
                >
                  {
                    t.timezone
                  }
                </label>

                <input
                  id="timezone"
                  type="text"
                  className={`endoora-input ${styles.ltr}`}
                  value={
                    learner.timezone
                  }
                  onChange={(
                    event,
                  ) =>
                    setLearner(
                      (
                        current,
                      ) => ({
                        ...current,
                        timezone:
                          event
                            .target
                            .value,
                      }),
                    )
                  }
                />
              </div>

              <fieldset
                className={`endoora-fieldset ${styles.fullWidth}`}
              >
                <legend className="endoora-field__label">
                  {
                    t.studyDays
                  }
                </legend>

                <div
                  className={
                    styles.days
                  }
                >
                  {weekdays.map(
                    (day) => (
                      <label
                        key={
                          day
                        }
                        className="endoora-check-row"
                      >
                        <input
                          type="checkbox"
                          className="endoora-check"
                          checked={learner.preferred_days.includes(
                            day,
                          )}
                          onChange={() =>
                            toggleLearnerDay(
                              day,
                            )
                          }
                        />

                        <span className="endoora-check-row__label">
                          {
                            t[
                              day
                            ]
                          }
                        </span>
                      </label>
                    ),
                  )}
                </div>
              </fieldset>
            </div>
          ) : null}

          {!isLearner &&
          step === 1 ? (
            <div
              className={
                styles.grid
              }
            >
              <div className="endoora-field">
                <label
                  className="endoora-field__label"
                  htmlFor="teacher-name"
                >
                  {
                    t.publicName
                  }
                </label>

                <input
                  id="teacher-name"
                  className="endoora-input"
                  value={
                    teacher.public_name
                  }
                  onChange={(
                    event,
                  ) =>
                    setTeacher(
                      (
                        current,
                      ) => ({
                        ...current,
                        public_name:
                          event
                            .target
                            .value,
                      }),
                    )
                  }
                />
              </div>

              <div className="endoora-field">
                <label
                  className="endoora-field__label"
                  htmlFor="teacher-experience"
                >
                  {
                    t.experience
                  }
                </label>

                <input
                  id="teacher-experience"
                  type="number"
                  min={0}
                  max={70}
                  className={`endoora-input ${styles.ltr}`}
                  value={
                    teacher.experience_years ??
                    ""
                  }
                  onChange={(
                    event,
                  ) =>
                    setTeacher(
                      (
                        current,
                      ) => ({
                        ...current,
                        experience_years:
                          event
                            .target
                            .value
                            ? Number(
                                event
                                  .target
                                  .value,
                              )
                            : null,
                      }),
                    )
                  }
                />

                <p className="endoora-field__help">
                  {t.years}
                </p>
              </div>

              <div
                className={`endoora-field ${styles.fullWidth}`}
              >
                <label
                  className="endoora-field__label"
                  htmlFor="teacher-city"
                >
                  {t.city}
                </label>

                <input
                  id="teacher-city"
                  className="endoora-input"
                  value={
                    teacher.city
                  }
                  onChange={(
                    event,
                  ) =>
                    setTeacher(
                      (
                        current,
                      ) => ({
                        ...current,
                        city:
                          event
                            .target
                            .value,
                      }),
                    )
                  }
                />
              </div>
            </div>
          ) : null}

          {!isLearner &&
          step === 2 ? (
            <div
              className={
                styles.grid
              }
            >
              <div
                className={`endoora-field ${styles.fullWidth}`}
              >
                <label
                  className="endoora-field__label"
                  htmlFor="teacher-bio"
                >
                  {t.bio}
                </label>

                <textarea
                  id="teacher-bio"
                  className={`endoora-input ${styles.textarea}`}
                  maxLength={
                    1500
                  }
                  value={
                    teacher.bio
                  }
                  onChange={(
                    event,
                  ) =>
                    setTeacher(
                      (
                        current,
                      ) => ({
                        ...current,
                        bio:
                          event
                            .target
                            .value,
                      }),
                    )
                  }
                />
              </div>

              <div className="endoora-field">
                <label
                  className="endoora-field__label"
                  htmlFor="specialties"
                >
                  {
                    t.specialties
                  }
                </label>

                <input
                  id="specialties"
                  className={`endoora-input ${styles.ltr}`}
                  value={
                    specialtiesText
                  }
                  onChange={(
                    event,
                  ) =>
                    setSpecialtiesText(
                      event
                        .target
                        .value,
                    )
                  }
                />

                <p className="endoora-field__help">
                  {
                    t.specialtiesHelp
                  }
                </p>
              </div>

              <div className="endoora-field">
                <label
                  className="endoora-field__label"
                  htmlFor="teacher-languages"
                >
                  {
                    t.languages
                  }
                </label>

                <input
                  id="teacher-languages"
                  className={`endoora-input ${styles.ltr}`}
                  value={
                    languagesText
                  }
                  onChange={(
                    event,
                  ) =>
                    setLanguagesText(
                      event
                        .target
                        .value,
                    )
                  }
                />

                <p className="endoora-field__help">
                  {
                    t.languagesHelp
                  }
                </p>
              </div>

              <fieldset
                className={`endoora-fieldset ${styles.fullWidth}`}
              >
                <label className="endoora-check-row">
                  <input
                    type="checkbox"
                    className="endoora-check"
                    checked={
                      teacher.availability_intent
                    }
                    onChange={(
                      event,
                    ) =>
                      setTeacher(
                        (
                          current,
                        ) => ({
                          ...current,
                          availability_intent:
                            event
                              .target
                              .checked,
                        }),
                      )
                    }
                  />

                  <span className="endoora-check-row__label">
                    {
                      t.availabilityIntent
                    }
                  </span>
                </label>

                <label className="endoora-check-row">
                  <input
                    type="checkbox"
                    className="endoora-check"
                    checked={
                      teacher.verification_intent
                    }
                    onChange={(
                      event,
                    ) =>
                      setTeacher(
                        (
                          current,
                        ) => ({
                          ...current,
                          verification_intent:
                            event
                              .target
                              .checked,
                        }),
                      )
                    }
                  />

                  <span className="endoora-check-row__label">
                    {
                      t.verificationIntent
                    }
                  </span>
                </label>

                <p className="endoora-field__help">
                  {
                    t.verificationNotice
                  }
                </p>
              </fieldset>
            </div>
          ) : null}

          <div
            className={
              styles.actions
            }
          >
            <button
              type="button"
              className="endoora-button endoora-button--secondary"
              disabled={
                saving
              }
              onClick={() => {
                void saveAndStay();
              }}
            >
              {saving
                ? t.saving
                : t.saveLater}
            </button>

            <div
              className={
                styles.actionsPrimary
              }
            >
              {step > 1 ? (
                <button
                  type="button"
                  className="endoora-button endoora-button--tertiary"
                  disabled={
                    saving
                  }
                  onClick={() =>
                    setStep(
                      (
                        current,
                      ) =>
                        Math.max(
                          current -
                            1,
                          1,
                        ),
                    )
                  }
                >
                  {t.back}
                </button>
              ) : null}

              <button
                type="submit"
                className="endoora-button endoora-button--primary"
                disabled={
                  saving
                }
              >
                {saving
                  ? t.saving
                  : t.next}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div
          className={
            authStyles.form
          }
        >
          <dl
            className={
              styles.review
            }
          >
            {isLearner ? (
              <>
                <div
                  className={
                    styles.reviewItem
                  }
                >
                  <dt>
                    {t.goal}
                  </dt>

                  <dd>
                    {
                      learner.goal
                    }
                  </dd>
                </div>

                <div
                  className={
                    styles.reviewItem
                  }
                >
                  <dt>
                    {t.ageBand}
                  </dt>

                  <dd>
                    {
                      learner.age_band
                    }
                  </dd>
                </div>

                <div
                  className={
                    styles.reviewItem
                  }
                >
                  <dt>
                    {
                      t.currentEstimate
                    }
                  </dt>

                  <dd>
                    {
                      learner.current_estimate
                    }
                  </dd>
                </div>

                <div
                  className={
                    styles.reviewItem
                  }
                >
                  <dt>
                    {
                      t.dailyMinutes
                    }
                  </dt>

                  <dd>
                    {
                      learner.preferred_daily_minutes
                    }{" "}
                    {
                      t.minutes
                    }
                  </dd>
                </div>

                <div
                  className={
                    styles.reviewItem
                  }
                >
                  <dt>
                    {
                      t.studyDays
                    }
                  </dt>

                  <dd>
                    {learner.preferred_days
                      .map(
                        (
                          day,
                        ) =>
                          t[
                            day as keyof typeof t
                          ],
                      )
                      .join(
                        "، ",
                      )}
                  </dd>
                </div>

                <div
                  className={
                    styles.reviewItem
                  }
                >
                  <dt>
                    {
                      t.timezone
                    }
                  </dt>

                  <dd
                    dir="ltr"
                    className="ltr-isolate"
                  >
                    {
                      learner.timezone
                    }
                  </dd>
                </div>
              </>
            ) : (
              <>
                <div
                  className={
                    styles.reviewItem
                  }
                >
                  <dt>
                    {
                      t.publicName
                    }
                  </dt>

                  <dd>
                    {
                      teacher.public_name
                    }
                  </dd>
                </div>

                <div
                  className={
                    styles.reviewItem
                  }
                >
                  <dt>
                    {
                      t.experience
                    }
                  </dt>

                  <dd>
                    {
                      teacher.experience_years
                    }{" "}
                    {t.years}
                  </dd>
                </div>

                <div
                  className={
                    styles.reviewItem
                  }
                >
                  <dt>
                    {t.city}
                  </dt>

                  <dd>
                    {
                      teacher.city
                    }
                  </dd>
                </div>

                <div
                  className={
                    styles.reviewItem
                  }
                >
                  <dt>
                    {
                      t.specialties
                    }
                  </dt>

                  <dd>
                    {
                      specialtiesText
                    }
                  </dd>
                </div>

                <div
                  className={
                    styles.reviewItem
                  }
                >
                  <dt>
                    {
                      t.languages
                    }
                  </dt>

                  <dd>
                    {
                      languagesText
                    }
                  </dd>
                </div>
              </>
            )}
          </dl>

          <div
            className={
              styles.actions
            }
          >
            <button
              type="button"
              className="endoora-button endoora-button--secondary"
              disabled={
                saving
              }
              onClick={() => {
                void saveAndStay();
              }}
            >
              {saving
                ? t.saving
                : t.saveLater}
            </button>

            <div
              className={
                styles.actionsPrimary
              }
            >
              <button
                type="button"
                className="endoora-button endoora-button--tertiary"
                disabled={
                  saving
                }
                onClick={() =>
                  setStep(2)
                }
              >
                {t.back}
              </button>

              <button
                type="button"
                className="endoora-button endoora-button--primary"
                disabled={
                  saving
                }
                onClick={() => {
                  void completeOnboarding();
                }}
              >
                {saving
                  ? t.saving
                  : t.complete}
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthShell>
  );
}