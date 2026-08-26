"use client";

import Link from "next/link";

import { useLearnerHome } from "../../../components/learner/LearnerShell";


export default function TodayPage() {
  const { data, locale } = useLearnerHome();
  const mission = data.today_mission;

  return (
    <div className="learner-today-page">
      <Link className="learner-back-link" href="/dashboard">
        {locale === "fa" ? "بازگشت به خانه یادگیری" : "Back to learning home"}
      </Link>
      <section className="learner-card">
        <h1>{locale === "fa" ? "ماموریت امروز" : "Today's mission"}</h1>
        {mission ? (
          <>
            <p className="learner-today-page__status">
              {mission.status === "in_progress"
                ? (locale === "fa" ? "در حال انجام" : "In progress")
                : mission.status === "completed"
                  ? (locale === "fa" ? "تکمیل شده" : "Completed")
                  : (locale === "fa" ? "آماده شروع" : "Ready to begin")}
            </p>
            <h2>{locale === "fa" ? mission.title_fa : mission.title_en}</h2>
            <p>{locale === "fa" ? mission.description_fa : mission.description_en}</p>
            {(locale === "fa" ? mission.reason_fa : mission.reason_en) ? (
              <div className="learner-today-page__reason">
                <strong>{locale === "fa" ? "چرا این ماموریت؟" : "Why this mission?"}</strong>
                <p>{locale === "fa" ? mission.reason_fa : mission.reason_en}</p>
              </div>
            ) : null}
            <p className="learner-muted">
              {locale === "fa"
                ? "فعالیت تعاملی ماموریت در مرحله اختصاصی Daily Mission تکمیل می‌شود؛ این صفحه داده ساختگی تولید نمی‌کند."
                : "The interactive activity is completed in the dedicated Daily Mission stage; this page does not fabricate learning data."}
            </p>
          </>
        ) : (
          <>
            <h2>{locale === "fa" ? "هنوز ماموریتی ساخته نشده است" : "No mission has been created yet"}</h2>
            <p>{locale === "fa" ? "ابتدا تعیین سطح را تکمیل کن تا قدم بعدی با شواهد واقعی انتخاب شود." : "Complete placement first so the next step can be selected from real evidence."}</p>
            <Link className="learner-button learner-button--primary" href="/placement">
              {locale === "fa" ? "شروع تعیین سطح" : "Start placement"}
            </Link>
          </>
        )}
      </section>
    </div>
  );
}
