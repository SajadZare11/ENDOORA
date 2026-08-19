"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { AuthShell } from "../../../components/auth/AuthShell";
import {
  apiErrorMessages,
  endooraApi,
  type EndooraLocale,
} from "../../../lib/endoora-api";
import styles from "./profile.module.css";

type AccountRole = "learner" | "teacher";

type AccountMe = {
  id: string;
  email: string;
  phone: string | null;
  phone_verified: boolean;
  role: AccountRole;
  preferred_locale: EndooraLocale;
  capabilities: {
    teacher_verified: boolean;
    marketplace_eligible: boolean;
    paid_class_eligible: boolean;
  };
  is_active: boolean;
};

type LearnerProfile = {
  id: string;
  goal: string;
  age_band: string;
  current_estimate: string;
  preferred_daily_minutes: number | null;
  preferred_days: string[];
  timezone: string;
  completeness_percent: number;
};

type TeacherProfile = {
  id: string;
  public_name: string;
  bio: string;
  experience_years: number | null;
  specialties: string[];
  city: string;
  languages: string[];
  availability_intent: boolean;
  verification_intent: boolean;
  completeness_percent: number;
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
    title: "پروفایل و تنظیمات",
    description:
      "اطلاعات اصلی حساب و تنظیمات پروفایل Endoora را مدیریت کنید.",

    loading: "در حال بارگذاری پروفایل…",
    errorTitle: "امکان بارگذاری پروفایل وجود نداشت.",
    signIn: "ورود",

    accountSection: "تنظیمات حساب",
    profileSection: "اطلاعات پروفایل",

    email: "ایمیل",
    role: "نوع حساب",
    learner: "زبان‌آموز",
    teacher: "مدرس",

    phone: "شماره موبایل",
    phoneHelp:
      "برای شماره ایران از قالبی مانند 09123456789 استفاده کنید.",
    phoneVerified: "شماره تأیید شده است.",
    phoneNotVerified:
      "شماره هنوز تأیید نشده است.",

    language: "زبان رابط",
    persian: "فارسی",
    english: "English",

    goal: "هدف اصلی",
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

    currentEstimate: "سطح تقریبی",
    unknown: "نمی‌دانم",
    dailyMinutes: "زمان روزانه",
    studyDays: "روزهای مناسب",
    timezone: "منطقه زمانی",

    saturday: "شنبه",
    sunday: "یکشنبه",
    monday: "دوشنبه",
    tuesday: "سه‌شنبه",
    wednesday: "چهارشنبه",
    thursday: "پنجشنبه",
    friday: "جمعه",

    publicName: "نام نمایشی",
    bio: "معرفی کوتاه",
    experience: "سابقه تدریس",
    city: "شهر",
    specialties: "تخصص‌ها",
    specialtiesHelp:
      "موارد را با ویرگول جدا کنید.",
    languages: "زبان‌ها",
    languagesHelp:
      "موارد را با ویرگول جدا کنید.",

    availabilityIntent:
      "مایلم بعداً زمان‌های تدریس را ثبت کنم.",
    verificationIntent:
      "مایلم فرایند تأیید مدرس را دنبال کنم.",

    verificationWarning:
      "ثبت این درخواست باعث تأیید خودکار مدرس یا فعال شدن کلاس پولی نمی‌شود.",

    save: "ذخیره تغییرات",
    saving: "در حال ذخیره…",
    saved: "تغییرات با موفقیت ذخیره شد.",

    account: "بازگشت به حساب کاربری",
  },

  en: {
    title: "Profile & settings",
    description:
      "Manage your main Endoora account and profile settings.",

    loading: "Loading profile…",
    errorTitle: "Your profile could not be loaded.",
    signIn: "Sign in",

    accountSection: "Account settings",
    profileSection: "Profile information",

    email: "Email",
    role: "Account type",
    learner: "Learner",
    teacher: "Teacher",

    phone: "Mobile number",
    phoneHelp:
      "For an Iranian number, use a format such as 09123456789.",
    phoneVerified: "Phone number is verified.",
    phoneNotVerified:
      "Phone number is not verified yet.",

    language: "Interface language",
    persian: "Persian",
    english: "English",

    goal: "Main goal",
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

    currentEstimate: "Estimated level",
    unknown: "I don't know",
    dailyMinutes: "Daily study time",
    studyDays: "Preferred days",
    timezone: "Timezone",

    saturday: "Saturday",
    sunday: "Sunday",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",

    publicName: "Public name",
    bio: "Short bio",
    experience: "Teaching experience",
    city: "City",
    specialties: "Specialties",
    specialtiesHelp:
      "Separate items with commas.",
    languages: "Languages",
    languagesHelp:
      "Separate items with commas.",

    availabilityIntent:
      "I would like to add teaching availability later.",
    verificationIntent:
      "I would like to continue teacher verification.",

    verificationWarning:
      "This does not automatically verify the teacher or enable paid classes.",

    save: "Save changes",
    saving: "Saving…",
    saved: "Changes saved successfully.",

    account: "Back to account",
  },
} as const;

function commaList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function ProfilePage() {
  const [locale, setLocale] =
    useState<EndooraLocale>("fa");

  const [account, setAccount] =
    useState<AccountMe | null>(null);

  const [learner, setLearner] =
    useState<LearnerProfile | null>(null);

  const [teacher, setTeacher] =
    useState<TeacherProfile | null>(null);

  const [specialtiesText, setSpecialtiesText] =
    useState("");

  const [languagesText, setLanguagesText] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [errors, setErrors] =
    useState<string[]>([]);

  const t = copy[locale];

  useEffect(() => {
    let cancelled = false;
    let errorLocale: EndooraLocale = "fa";

    endooraApi<AccountMe>("/auth/me/")
      .then(async (accountResult) => {
        if (cancelled) {
          return;
        }

        const accountLocale: EndooraLocale =
          accountResult.preferred_locale === "en"
            ? "en"
            : "fa";

        errorLocale = accountLocale;

        setLocale(accountLocale);
        setAccount(accountResult);

        if (accountResult.role === "learner") {
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
            profile.specialties.join(", "),
          );

          setLanguagesText(
            profile.languages.join(", "),
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

  function handleLocaleChange(
    nextLocale: EndooraLocale,
  ) {
    setLocale(nextLocale);

    setAccount((current) =>
      current
        ? {
            ...current,
            preferred_locale: nextLocale,
          }
        : current,
    );
  }

  function toggleDay(day: string) {
    setLearner((current) => {
      if (!current) {
        return current;
      }

      const exists =
        current.preferred_days.includes(day);

      return {
        ...current,
        preferred_days: exists
          ? current.preferred_days.filter(
              (item) => item !== day,
            )
          : [...current.preferred_days, day],
      };
    });
  }

  async function save(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!account) {
      return;
    }

    setSaving(true);
    setSaved(false);
    setErrors([]);

    try {
      const updatedAccount =
        await endooraApi<AccountMe>(
          "/auth/me/",
          {
            method: "PATCH",
            json: {
              phone:
                account.phone?.trim() || null,
              preferred_locale:
                account.preferred_locale,
            },
          },
        );

      setAccount(updatedAccount);
      setLocale(updatedAccount.preferred_locale);

      if (
        updatedAccount.role === "learner" &&
        learner
      ) {
        const updatedLearner =
          await endooraApi<LearnerProfile>(
            "/profiles/learner/",
            {
              method: "PATCH",
              json: {
                goal: learner.goal,
                age_band: learner.age_band,
                current_estimate:
                  learner.current_estimate,
                preferred_daily_minutes:
                  learner.preferred_daily_minutes,
                preferred_days:
                  learner.preferred_days,
                timezone: learner.timezone,
              },
            },
          );

        setLearner(updatedLearner);
      }

      if (
        updatedAccount.role === "teacher" &&
        teacher
      ) {
        const updatedTeacher =
          await endooraApi<TeacherProfile>(
            "/profiles/teacher/",
            {
              method: "PATCH",
              json: {
                public_name:
                  teacher.public_name.trim(),
                bio: teacher.bio.trim(),
                experience_years:
                  teacher.experience_years,
                specialties:
                  commaList(specialtiesText),
                city: teacher.city.trim(),
                languages:
                  commaList(languagesText),
                availability_intent:
                  teacher.availability_intent,
                verification_intent:
                  teacher.verification_intent,
              },
            },
          );

        setTeacher(updatedTeacher);

        setSpecialtiesText(
          updatedTeacher.specialties.join(", "),
        );

        setLanguagesText(
          updatedTeacher.languages.join(", "),
        );
      }

      setSaved(true);
    } catch (error) {
      setErrors(
        apiErrorMessages(error, locale),
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AuthShell
        locale={locale}
        onLocaleChange={setLocale}
        title={t.title}
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

  if (!account) {
    return (
      <AuthShell
        locale={locale}
        onLocaleChange={setLocale}
        title={t.title}
        description={t.errorTitle}
        footer={
          <Link href="/auth/login">
            {t.signIn}
          </Link>
        }
      >
        <div
          className="endoora-error-summary"
          role="alert"
        >
          <h3>{t.errorTitle}</h3>

          <ul>
            {errors.map((message, index) => (
              <li key={`${message}-${index}`}>
                {message}
              </li>
            ))}
          </ul>
        </div>
      </AuthShell>
    );
  }

  const isLearner =
    account.role === "learner";

  return (
    <AuthShell
      locale={locale}
      onLocaleChange={handleLocaleChange}
      title={t.title}
      description={t.description}
      footer={
        <Link
          href="/account"
          className={styles.back}
        >
          {t.account}
        </Link>
      }
    >
      {saved ? (
        <div
          className="endoora-status-message endoora-status-message--success"
          role="status"
        >
          {t.saved}
        </div>
      ) : null}

      {errors.length > 0 ? (
        <div
          className="endoora-error-summary"
          role="alert"
        >
          <h3>{t.errorTitle}</h3>

          <ul>
            {errors.map((message, index) => (
              <li key={`${message}-${index}`}>
                {message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <form
        className={styles.form}
        onSubmit={save}
      >
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {t.accountSection}
          </h2>

          <div className={styles.grid}>
            <div
              className={`endoora-field ${styles.readOnly}`}
            >
              <label
                className="endoora-field__label"
                htmlFor="account-email"
              >
                {t.email}
              </label>

              <input
                id="account-email"
                className={`endoora-input ${styles.ltr}`}
                value={account.email}
                readOnly
              />
            </div>

            <div
              className={`endoora-field ${styles.readOnly}`}
            >
              <label
                className="endoora-field__label"
                htmlFor="account-role"
              >
                {t.role}
              </label>

              <input
                id="account-role"
                className="endoora-input"
                value={
                  isLearner
                    ? t.learner
                    : t.teacher
                }
                readOnly
              />
            </div>

            <div className="endoora-field">
              <label
                className="endoora-field__label"
                htmlFor="account-phone"
              >
                {t.phone}
              </label>

              <input
                id="account-phone"
                inputMode="tel"
                autoComplete="tel"
                className={`endoora-input ${styles.ltr}`}
                value={account.phone ?? ""}
                onChange={(event) =>
                  setAccount((current) =>
                    current
                      ? {
                          ...current,
                          phone:
                            event.target.value,
                        }
                      : current,
                  )
                }
              />

              <p className="endoora-field__help">
                {t.phoneHelp}
              </p>

              <p className="endoora-field__help">
                {account.phone_verified
                  ? t.phoneVerified
                  : t.phoneNotVerified}
              </p>
            </div>

            <div className="endoora-field">
              <label
                className="endoora-field__label"
                htmlFor="account-language"
              >
                {t.language}
              </label>

              <select
                id="account-language"
                className="endoora-select"
                value={account.preferred_locale}
                onChange={(event) =>
                  handleLocaleChange(
                    event.target
                      .value as EndooraLocale,
                  )
                }
              >
                <option value="fa">
                  {t.persian}
                </option>

                <option value="en">
                  {t.english}
                </option>
              </select>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {t.profileSection}
          </h2>

          {isLearner && learner ? (
            <div className={styles.grid}>
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
                  value={learner.goal}
                  onChange={(event) =>
                    setLearner((current) =>
                      current
                        ? {
                            ...current,
                            goal:
                              event.target.value,
                          }
                        : current,
                    )
                  }
                >
                  <option value="general_english">
                    {t.generalEnglish}
                  </option>

                  <option value="conversation">
                    {t.conversation}
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
                  value={learner.age_band}
                  onChange={(event) =>
                    setLearner((current) =>
                      current
                        ? {
                            ...current,
                            age_band:
                              event.target.value,
                          }
                        : current,
                    )
                  }
                >
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
                    {t.preferNot}
                  </option>
                </select>
              </div>

              <div className="endoora-field">
                <label
                  className="endoora-field__label"
                  htmlFor="learner-level"
                >
                  {t.currentEstimate}
                </label>

                <select
                  id="learner-level"
                  className="endoora-select"
                  value={
                    learner.current_estimate
                  }
                  onChange={(event) =>
                    setLearner((current) =>
                      current
                        ? {
                            ...current,
                            current_estimate:
                              event.target.value,
                          }
                        : current,
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
                  ].map((level) => (
                    <option
                      key={level}
                      value={level}
                    >
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div className="endoora-field">
                <label
                  className="endoora-field__label"
                  htmlFor="learner-minutes"
                >
                  {t.dailyMinutes}
                </label>

                <input
                  id="learner-minutes"
                  type="number"
                  min={5}
                  max={240}
                  className={`endoora-input ${styles.ltr}`}
                  value={
                    learner.preferred_daily_minutes ??
                    ""
                  }
                  onChange={(event) =>
                    setLearner((current) =>
                      current
                        ? {
                            ...current,
                            preferred_daily_minutes:
                              event.target.value
                                ? Number(
                                    event.target
                                      .value,
                                  )
                                : null,
                          }
                        : current,
                    )
                  }
                />
              </div>

              <div
                className={`endoora-field ${styles.fullWidth}`}
              >
                <label
                  className="endoora-field__label"
                  htmlFor="learner-timezone"
                >
                  {t.timezone}
                </label>

                <input
                  id="learner-timezone"
                  className={`endoora-input ${styles.ltr}`}
                  value={learner.timezone}
                  onChange={(event) =>
                    setLearner((current) =>
                      current
                        ? {
                            ...current,
                            timezone:
                              event.target.value,
                          }
                        : current,
                    )
                  }
                />
              </div>

              <fieldset
                className={`endoora-fieldset ${styles.fullWidth}`}
              >
                <legend className="endoora-field__label">
                  {t.studyDays}
                </legend>

                <div className={styles.checks}>
                  {weekdays.map((day) => (
                    <label
                      key={day}
                      className="endoora-check-row"
                    >
                      <input
                        type="checkbox"
                        className="endoora-check"
                        checked={learner.preferred_days.includes(
                          day,
                        )}
                        onChange={() =>
                          toggleDay(day)
                        }
                      />

                      <span className="endoora-check-row__label">
                        {t[day]}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          ) : null}

          {!isLearner && teacher ? (
            <div className={styles.grid}>
              <div className="endoora-field">
                <label
                  className="endoora-field__label"
                  htmlFor="teacher-name"
                >
                  {t.publicName}
                </label>

                <input
                  id="teacher-name"
                  className="endoora-input"
                  value={teacher.public_name}
                  onChange={(event) =>
                    setTeacher((current) =>
                      current
                        ? {
                            ...current,
                            public_name:
                              event.target.value,
                          }
                        : current,
                    )
                  }
                />
              </div>

              <div className="endoora-field">
                <label
                  className="endoora-field__label"
                  htmlFor="teacher-experience"
                >
                  {t.experience}
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
                  onChange={(event) =>
                    setTeacher((current) =>
                      current
                        ? {
                            ...current,
                            experience_years:
                              event.target.value
                                ? Number(
                                    event.target
                                      .value,
                                  )
                                : null,
                          }
                        : current,
                    )
                  }
                />
              </div>

              <div className="endoora-field">
                <label
                  className="endoora-field__label"
                  htmlFor="teacher-city"
                >
                  {t.city}
                </label>

                <input
                  id="teacher-city"
                  className="endoora-input"
                  value={teacher.city}
                  onChange={(event) =>
                    setTeacher((current) =>
                      current
                        ? {
                            ...current,
                            city:
                              event.target.value,
                          }
                        : current,
                    )
                  }
                />
              </div>

              <div className="endoora-field">
                <label
                  className="endoora-field__label"
                  htmlFor="teacher-specialties"
                >
                  {t.specialties}
                </label>

                <input
                  id="teacher-specialties"
                  className={`endoora-input ${styles.ltr}`}
                  value={specialtiesText}
                  onChange={(event) =>
                    setSpecialtiesText(
                      event.target.value,
                    )
                  }
                />

                <p className="endoora-field__help">
                  {t.specialtiesHelp}
                </p>
              </div>

              <div className="endoora-field">
                <label
                  className="endoora-field__label"
                  htmlFor="teacher-languages"
                >
                  {t.languages}
                </label>

                <input
                  id="teacher-languages"
                  className={`endoora-input ${styles.ltr}`}
                  value={languagesText}
                  onChange={(event) =>
                    setLanguagesText(
                      event.target.value,
                    )
                  }
                />

                <p className="endoora-field__help">
                  {t.languagesHelp}
                </p>
              </div>

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
                  maxLength={1500}
                  className={`endoora-input ${styles.textarea}`}
                  value={teacher.bio}
                  onChange={(event) =>
                    setTeacher((current) =>
                      current
                        ? {
                            ...current,
                            bio:
                              event.target.value,
                          }
                        : current,
                    )
                  }
                />
              </div>

              <fieldset
                className={`endoora-fieldset ${styles.fullWidth}`}
              >
                <div className={styles.checks}>
                  <label className="endoora-check-row">
                    <input
                      type="checkbox"
                      className="endoora-check"
                      checked={
                        teacher.availability_intent
                      }
                      onChange={(event) =>
                        setTeacher((current) =>
                          current
                            ? {
                                ...current,
                                availability_intent:
                                  event.target
                                    .checked,
                              }
                            : current,
                        )
                      }
                    />

                    <span className="endoora-check-row__label">
                      {t.availabilityIntent}
                    </span>
                  </label>

                  <label className="endoora-check-row">
                    <input
                      type="checkbox"
                      className="endoora-check"
                      checked={
                        teacher.verification_intent
                      }
                      onChange={(event) =>
                        setTeacher((current) =>
                          current
                            ? {
                                ...current,
                                verification_intent:
                                  event.target
                                    .checked,
                              }
                            : current,
                        )
                      }
                    />

                    <span className="endoora-check-row__label">
                      {t.verificationIntent}
                    </span>
                  </label>
                </div>

                <p className="endoora-field__help">
                  {t.verificationWarning}
                </p>
              </fieldset>
            </div>
          ) : null}
        </section>

        <div className={styles.actions}>
          <button
            type="submit"
            className="endoora-button endoora-button--primary"
            disabled={saving}
          >
            {saving
              ? t.saving
              : t.save}
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
