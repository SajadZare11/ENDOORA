"use client";

import { Button, Table } from "@endoora/ui";
import Link from "next/link";
import { useState } from "react";
import { useTeacherHome } from "./TeacherShell";
import styles from "./teacher-foundation.module.css";

interface TeacherFoundationPageProps {
  titleFa: string;
  titleEn: string;
  bodyFa: string;
  bodyEn: string;
}

export function TeacherFoundationPage({
  titleFa,
  titleEn,
  bodyFa,
  bodyEn,
}: TeacherFoundationPageProps) {
  const { data, locale } = useTeacherHome();
  const isFa = locale === "fa";
  const verified = data.capabilities.teacher_verified;

  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const isClasses = titleFa.includes("کلاس") || titleEn.toLowerCase().includes("class");
  const isResources = titleFa.includes("منابع") || titleEn.toLowerCase().includes("resource");
  const isQuestions = titleFa.includes("سؤال") || titleEn.toLowerCase().includes("question");
  const isRequests = titleFa.includes("درخواست") || titleEn.toLowerCase().includes("request");

  const sampleQuestions = [
    {
      id: "Q-101",
      topicFa: "کاربرد Present Perfect vs Past Simple در مصاحبه شغلی",
      topicEn: "Present Perfect vs Past Simple in Job Interviews",
      typeFa: "چهارگزینه‌ای (تحلیلی)",
      typeEn: "Multiple Choice",
      level: "B1",
      skillFa: "گرامر کاربردی",
      skillEn: "Applied Grammar",
    },
    {
      id: "Q-102",
      topicFa: "تحلیل نمودار روند تغییرات تسک ۱ آیلتس آکادمیک",
      topicEn: "Describing Trends and Projections (IELTS Task 1)",
      typeFa: "نگارش تحلیلی (تشریحی)",
      typeEn: "Writing Task",
      level: "B2",
      skillFa: "مهارت نگارش",
      skillEn: "Academic Writing",
    },
    {
      id: "Q-103",
      topicFa: "افعال دوکلمه‌ای پرکاربرد در جلسات کاری و مذاکرات",
      topicEn: "Essential Business Phrasal Verbs in Negotiations",
      typeFa: "جای خالی و تطبیق",
      typeEn: "Gap Fill & Matching",
      level: "B2",
      skillFa: "دایره واژگان",
      skillEn: "Business Lexis",
    },
    {
      id: "Q-104",
      topicFa: "بیان نظرات مخالف در مباحثات آکادمیک با لحن محترمانه",
      topicEn: "Polite Disagreement in Academic Discussions",
      typeFa: "سناریوی مکالمه (گفتاری)",
      typeEn: "Speaking Scenario",
      level: "C1",
      skillFa: "مکالمه پیشرفته",
      skillEn: "Advanced Speaking",
    },
  ];

  const filteredQuestions = sampleQuestions.filter((q) => {
    const matchLevel = selectedLevel === "all" || q.level === selectedLevel;
    const matchSearch =
      searchQuery.trim() === "" ||
      q.topicFa.includes(searchQuery) ||
      q.topicEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.skillFa.includes(searchQuery);
    return matchLevel && matchSearch;
  });

  return (
    <div className={styles.foundationContainer}>
      {/* 1. Header with Breadcrumb and Actions */}
      <header className={styles.header}>
        <div className={styles.headerBreadcrumb}>
          <Link href="/teacher" className={styles.breadcrumbLink}>
            {isFa ? "میزکار مدرس" : "Teacher Hub"}
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{isFa ? titleFa : titleEn}</span>
        </div>

        <div className={styles.headerMain}>
          <div>
            <h1 className={styles.pageTitle}>{isFa ? titleFa : titleEn}</h1>
            <p className={styles.pageSubtitle}>{isFa ? bodyFa : bodyEn}</p>
          </div>

          <div className={styles.headerActions}>
            <Link className="teacher-btn teacher-btn--secondary" href="/teacher">
              {isFa ? "بازگشت به میزکار" : "Back to Hub"}
            </Link>
            {isClasses && (
              <Link className="teacher-btn teacher-btn--primary" href="/teacher/fixed-classes/new">
                + {isFa ? "ایجاد کلاس جدید" : "New Class"}
              </Link>
            )}
            {isQuestions && (
              <Link className="teacher-btn teacher-btn--primary" href="/teacher/planning">
                ⚡ {isFa ? "تولید سؤال با هوش مصنوعی" : "Generate Questions (AI)"}
              </Link>
            )}
          </div>
        </div>

        {/* 2. Key Metrics Bar */}
        <div className={styles.metricsBar}>
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>{isFa ? "وضعیت دسترسی مدرسی" : "Teaching Access"}</span>
            <strong className={styles.metricValue}>
              {verified ? (isFa ? "تأییدشده و فعال ✓" : "Verified & Active ✓") : (isFa ? "در انتظار مدارک" : "Pending")}
            </strong>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>{isFa ? "پوشش سطوح آموزشی" : "CEFR Levels"}</span>
            <strong className={styles.metricValue}>A1 &rarr; C1</strong>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>
              {isQuestions
                ? isFa ? "مخزن سؤالات استاندارد" : "Curated Questions"
                : isClasses
                ? isFa ? "ظرفیت تعریف دوره" : "Class Capacity"
                : isFa ? "منابع آموزشی رسمی" : "Curricular Standards"}
            </span>
            <strong className={styles.metricValue}>
              {isQuestions ? "۴۵۰+ آیتم" : isClasses ? "نامحدود" : "۴ مرجع استاندارد"}
            </strong>
          </div>
        </div>
      </header>

      {/* 3. Question Bank Content */}
      {isQuestions && (
        <section className={styles.sectionCard}>
          <div className={styles.toolbarRow}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder={isFa ? "جست‌وجو در عنوان یا مهارت سؤال..." : "Search questions or skills..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.filterGroup}>
              {["all", "B1", "B2", "C1"].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  className={`${styles.filterBtn} ${selectedLevel === lvl ? styles.filterBtnActive : ""}`}
                  onClick={() => setSelectedLevel(lvl)}
                >
                  {lvl === "all" ? (isFa ? "همه سطوح" : "All Levels") : `سطح ${lvl}`}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <Table className={styles.table}>
              <thead>
                <tr>
                  <th>{isFa ? "کد" : "ID"}</th>
                  <th>{isFa ? "موضوع و شرح سؤال" : "Topic & Description"}</th>
                  <th>{isFa ? "مهارت" : "Skill"}</th>
                  <th>{isFa ? "سطح" : "Level"}</th>
                  <th>{isFa ? "نوع سؤال" : "Format"}</th>
                  <th style={{ textAlign: "center" }}>{isFa ? "عملیات" : "Action"}</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuestions.map((q) => (
                  <tr key={q.id}>
                    <td>
                      <code className={styles.codePill}>{q.id}</code>
                    </td>
                    <td>
                      <strong>{isFa ? q.topicFa : q.topicEn}</strong>
                    </td>
                    <td>
                      <span className={styles.skillTag}>{isFa ? q.skillFa : q.skillEn}</span>
                    </td>
                    <td>
                      <span className={styles.levelBadge}>{q.level}</span>
                    </td>
                    <td>
                      <span className={styles.typeText}>{isFa ? q.typeFa : q.typeEn}</span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={() => alert(isFa ? `سؤال ${q.id} به تکالیف کلاس انتخابی الصاق شد.` : `Question ${q.id} added.`)}
                      >
                        {isFa ? "+ افزودن به تکلیف" : "+ Assign"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </section>
      )}

      {/* 4. Classes Content */}
      {isClasses && (
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>{isFa ? "برنامه کلاس‌ها و دوره‌های ترم جاری" : "Current Cohorts & Rosters"}</h2>
              <p>{isFa ? "فهرست دوره‌های ثبت‌شده، ساعات برگزاری و زبان‌آموزان" : "Active courses and scheduled live meetings"}</p>
            </div>
            <Link className="teacher-btn teacher-btn--primary" href="/teacher/fixed-classes/new">
              + {isFa ? "تعریف کلاس جدید" : "Create Cohort"}
            </Link>
          </div>

          <div className={styles.tableWrapper}>
            <Table className={styles.table}>
              <thead>
                <tr>
                  <th>{isFa ? "عنوان دوره" : "Course Title"}</th>
                  <th>{isFa ? "سطح" : "Level"}</th>
                  <th>{isFa ? "ثبت‌نام" : "Roster"}</th>
                  <th>{isFa ? "زمان برگزاری" : "Schedule"}</th>
                  <th>{isFa ? "وضعیت" : "Status"}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>{isFa ? "مکالمه فشرده بازرگانی و مصاحبه" : "Intensive Business Speaking"}</strong>
                  </td>
                  <td><span className={styles.levelBadge}>B1 - B2</span></td>
                  <td>۵ نفر (ظرفیت تکمیل)</td>
                  <td>{isFa ? "دوشنبه و چهارشنبه ۱۸:۰۰" : "Mon & Wed 18:00"}</td>
                  <td><span className={styles.statusActive}>{isFa ? "در حال اجرا" : "Active"}</span></td>
                </tr>
                <tr>
                  <td>
                    <strong>{isFa ? "آزمایشگاه رایتینگ آیلتس تسک ۲" : "IELTS Task 2 Writing Lab"}</strong>
                  </td>
                  <td><span className={styles.levelBadge}>B2</span></td>
                  <td>۴ نفر</td>
                  <td>{isFa ? "یکشنبه و سه‌شنبه ۱۹:۳۰" : "Sun & Tue 19:30"}</td>
                  <td><span className={styles.statusActive}>{isFa ? "در حال اجرا" : "Active"}</span></td>
                </tr>
              </tbody>
            </Table>
          </div>
        </section>
      )}

      {/* 5. Resources Content */}
      {isResources && (
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>{isFa ? "استانداردها و شیوه‌نامه‌های تدریس Endoora" : "Endoora Teaching Standards & Syllabi"}</h2>
              <p>{isFa ? "منابع مرجع، جداول ارزیابی مهارتی و شیوه‌نامه‌های مصوب" : "Official assessment rubrics and pedagogical blueprints"}</p>
            </div>
          </div>

          <div className={styles.resourceGrid}>
            {[
              {
                titleFa: "شیوه‌نامه سنجش ۶ مهارته CEFR",
                titleEn: "6-Skill CEFR Assessment Rubrics",
                descFa: "دستورالعمل‌های استاندارد نمره‌دهی برای بخش‌های نگارش (Writing) و گفتار (Speaking).",
                descEn: "Grading criteria for Writing task rubrics and Speaking pronunciation fluency.",
              },
              {
                titleFa: "راهنمای تداخل‌های متداول زبان فارسی (L1 Interference)",
                titleEn: "Persian Learner L1 Transfer Guide",
                descFa: "تحلیل ریشه‌ای خطاهای متداول گرامری، حروف اضافه و استرس هجاها در زبان‌آموزان ایرانی.",
                descEn: "Root cause analysis of Persian grammatical interference, prepositions and stress shifts.",
              },
              {
                titleFa: "طرح درس‌های تعاملی سطوح A1 تا B2",
                titleEn: "Interactive Lesson Plan Blueprints",
                descFa: "سرفصل‌های مصوب کلاسی منطبق با مهارت‌های سنجیده شده در آزمون تعیین سطح ایندورا.",
                descEn: "Approved classroom worksheets and syllabi mapped directly to placement skills.",
              },
              {
                titleFa: "بانک نمونه آزمونک‌های تکرار فاصله‌دار (Spaced Review)",
                titleEn: "Spaced Repetition Diagnostic Templates",
                descFa: "سوالات استاندارد تثبیت واژگان کلاسی بر مبنای منحنی فراموشی ابینگهاوس.",
                descEn: "Spaced repetition quiz blueprints for consolidating active classroom vocabulary.",
              },
            ].map((res, idx) => (
              <div key={idx} className={styles.resourceCard}>
                <h3>{isFa ? res.titleFa : res.titleEn}</h3>
                <p>{isFa ? res.descFa : res.descEn}</p>
                <button type="button" className={styles.resourceActionBtn}>
                  {isFa ? "مشاهده و دانلود سرفصل" : "View Syllabus"} &rarr;
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Requests Content */}
      {isRequests && (
        <section className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>{isFa ? "تابلوی درخواست‌های آنی زبان‌آموزان (Learn Now)" : "Learn Now Tutoring Board"}</h2>
              <p>{isFa ? "درخواست‌های فوری جلسات رفع اشکال و تمرین هدفمند" : "Urgent tutoring requests from motivated learners"}</p>
            </div>
          </div>

          <div className={styles.requestList}>
            {[
              {
                skillFa: "رفع اشکال رایتینگ تسک ۲ آیلتس",
                skillEn: "IELTS Writing Task 2 Review",
                level: "B2",
                timeFa: "امروز ساعت ۲۰:۰۰ (۴۵ دقیقه)",
                timeEn: "Today 20:00 (45 mins)",
                rateFa: "۲۸۰,۰۰۰ تومان",
                rateEn: "280,000 Tomans",
              },
              {
                skillFa: "تمرین روان‌گویی مکالمه مصاحبه کاری",
                skillEn: "Job Interview Speaking Practice",
                level: "B1",
                timeFa: "فردا ساعت ۱۸:۳۰ (۳۰ دقیقه)",
                timeEn: "Tomorrow 18:30 (30 mins)",
                rateFa: "۲۲۰,۰۰۰ تومان",
                rateEn: "220,000 Tomans",
              },
            ].map((req, idx) => (
              <div key={idx} className={styles.requestItem}>
                <div>
                  <div className={styles.requestTitleRow}>
                    <strong>{isFa ? req.skillFa : req.skillEn}</strong>
                    <span className={styles.levelBadge}>{req.level}</span>
                  </div>
                  <span className={styles.requestMeta}>
                    {isFa ? req.timeFa : req.timeEn} • {isFa ? req.rateFa : req.rateEn}
                  </span>
                </div>
                <Button
                  type="button"
                  className="teacher-btn teacher-btn--primary"
                  disabled={!verified}
                >
                  {verified
                    ? isFa ? "پذیرش درخواست" : "Accept Session"
                    : isFa ? "نیاز به تأیید مدارک" : "Verification Required"}
                </Button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
