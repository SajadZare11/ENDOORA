"use client";

import Link from "next/link";
import { useLearnerHome } from "./LearnerShell";
import { trackPrimaryAction } from "../../lib/learner-dashboard";

export function LearnerDashboard() {
  const {data,locale} = useLearnerHome();
  const fa = locale === "fa";
  const action = data.primary_action;
  const course = data.active_course;
  const destinations = [
    ["/assignments",fa ? "تکلیف‌ها" : "Assignments"],
    ["/leitner",fa ? "مرور واژگان" : "Vocabulary review"],
    ["/classes",fa ? "کلاس‌ها" : "Classes"],
    ["/courses",fa ? "دوره‌های من" : "Courses"],
    ["/progress",fa ? "پیشرفت" : "Progress"],
    ["/skills",fa ? "مهارت‌ها" : "Skills"],
  ];
  return <div className="account-panel" dir={fa ? "rtl" : "ltr"}>
    <h1>{fa ? "سلام" : "Hello"}, {data.greeting_name}</h1>
    <section className="learner-today-card"><h2>{fa ? action.title_fa : action.title_en}</h2>
      <p>{fa ? action.description_fa : action.description_en}</p><p>{fa ? action.reason_fa : action.reason_en}</p>
      <Link href={action.href} onClick={() => {void trackPrimaryAction(action.id);}}>{fa ? "ادامه" : "Continue"}</Link></section>
    {data.today_mission && <section><h2>{fa ? data.today_mission.title_fa : data.today_mission.title_en}</h2>
      <p>{fa ? data.today_mission.description_fa : data.today_mission.description_en}</p><Link href="/today">{fa ? "ماموریت امروز" : "Today’s mission"}</Link></section>}
    <section><h2>{fa ? "مسیر یادگیری" : "Learning path"}</h2><p>{fa ? data.path_message_fa : data.path_message_en}</p>
      <ol>{data.path_steps.map(step => <li key={step.id} aria-current={step.state === "current" ? "step" : undefined}>{fa ? step.label_fa : step.label_en}</li>)}</ol>
      <Link href="/path">{fa ? "مشاهده مسیر" : "View path"}</Link></section>
    <section><h2>{fa ? "وضعیت مهارت‌ها" : "Your skills"}</h2>
      {data.skills.length ? <ul>{data.skills.map(skill => <li key={skill.id}>{fa ? skill.label_fa + " · " + skill.status_fa : skill.label_en + " · " + skill.status_en}</li>)}</ul>
        : <p>{fa ? "پس از ثبت شواهد یادگیری، وضعیت مهارت‌ها اینجا نمایش داده می‌شود." : "Your skill estimates appear here after your first assessment."}</p>}
      <p>{fa ? "امتیاز" : "XP"} {data.xp} · {fa ? "روزهای پی‌درپی" : "Day streak"} {data.streak_days}</p>
      {data.srs_available && <p>{fa ? "واژه‌های آماده مرور" : "Words due for review"} {data.srs_due_count}</p>}</section>
    {typeof course?.slug === "string" && <section><h2>{fa ? "ادامه دوره" : "Continue your course"}</h2>
      <Link href={"/courses/"+encodeURIComponent(course.slug)}>{String((fa ? course.title_fa : course.title_en) || course.slug)}</Link></section>}
    <nav className="learner-overview-grid" aria-label={fa ? "فضای یادگیری" : "Learning workspace"}>{destinations.map(([href,title]) => <Link key={href} href={href}>{title}</Link>)}</nav>
    <section><h2>{fa ? "فعالیت‌های اخیر" : "Recent activity"}</h2>
      {(data.recent_activities || []).map(a => <p key={a.id}>{fa ? a.title_fa : a.title_en} · <time dateTime={a.created_at}>{new Date(a.created_at).toLocaleDateString(fa ? "fa-IR" : "en")}</time></p>)}
      {!data.recent_activities?.length && <p>{fa ? "هنوز فعالیتی ثبت نشده است." : "Your activity will appear here."}</p>}</section>
  </div>;
}
