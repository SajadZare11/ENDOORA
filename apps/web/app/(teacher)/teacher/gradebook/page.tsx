"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./gradebook.module.css";
import { useTeacherHome } from "../../../../components/teacher/TeacherShell";
import { fetchTeacherClasses, type TeacherClass } from "../../../../lib/teacher-classes";
import {
  fetchClassGradebook,
  getClassGradebookExportCsvUrl,
  type ClassGradebookMatrix,
} from "../../../../lib/teacher-gradebook";

export default function TeacherGradebookPage() {
  const { locale } = useTeacherHome();
  const isFa = locale === "fa";

  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [gradebook, setGradebook] = useState<ClassGradebookMatrix | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchStudent, setSearchStudent] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initial load classes
  useEffect(() => {
    async function loadClasses() {
      try {
        const clsList = await fetchTeacherClasses();
        setClasses(clsList);
        if (clsList.length > 0) {
          setSelectedClassId((prev) => prev || clsList[0].id);
        }
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : "Failed to load classes.");
      }
    }
    void loadClasses();
  }, []);

  // Load gradebook whenever selectedClassId changes
  useEffect(() => {
    async function loadMatrix() {
      if (!selectedClassId) return;
      setLoading(true);
      setErrorMsg(null);
      try {
        const data = await fetchClassGradebook(selectedClassId);
        setGradebook(data);
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : "Failed to load gradebook.");
      } finally {
        setLoading(false);
      }
    }
    void loadMatrix();
  }, [selectedClassId]);

  const filteredStudents = gradebook?.students.filter((s) => {
    if (!searchStudent) return true;
    const q = searchStudent.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
  });

  const getPillClass = (percentage: number | null, status: string) => {
    if (status === "missing") return styles.gradeMissing;
    if (status === "not_started") return styles.gradeNotStarted;
    if (status === "submitted") return styles.gradeSubmitted;
    if (percentage === null) return styles.gradeNotStarted;
    if (percentage >= 85) return styles.gradeA;
    if (percentage >= 70) return styles.gradeB;
    if (percentage >= 60) return styles.gradeC;
    if (percentage >= 50) return styles.gradeD;
    return styles.gradeF;
  };

  return (
    <div className={styles.container} dir={isFa ? "rtl" : "ltr"}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>{isFa ? "کارنامه و ماتریس نمرات کلاس‌ها" : "Class Gradebook"}</h1>
          <p className={styles.subtitle}>
            {isFa
              ? "مشاهده ماتریس جامع عملکرد، نمرات تکالیف، نرخ انجام و خروجی اکسل."
              : "Comprehensive academic matrix, assignment performance, completion rates, and CSV export."}
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
          <Link href="/teacher/analytics" className="teacher-button teacher-button--secondary">
            {isFa ? "تحلیل و پایش 📈" : "Analytics 📈"}
          </Link>
          <Link href="/teacher/interventions" className="teacher-button teacher-button--secondary">
            {isFa ? "مداخلات 🎯" : "Interventions 🎯"}
          </Link>
          <Link href="/teacher/grading" className="teacher-button teacher-button--primary">
            {isFa ? "صندوق تصحیح تکالیف" : "Grading Queue"}
          </Link>
          <Link href="/teacher/classes" className="teacher-button teacher-button--secondary">
            {isFa ? "مدیریت کلاس‌ها" : "Manage Classes"}
          </Link>
        </div>
      </header>

      {/* Class Selector & Controls Bar */}
      <div className={styles.controlsBar}>
        <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ fontWeight: 600, fontSize: "var(--font-size-sm)" }}>
            {isFa ? "انتخاب کلاس:" : "Select Class:"}
          </label>
          <select
            value={selectedClassId || ""}
            onChange={(e) => setSelectedClassId(e.target.value)}
            style={{ padding: "var(--space-2) var(--space-3)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border-subtle)" }}
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.level} - {c.subject})
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder={isFa ? "جستجوی زبان‌آموز..." : "Search student..."}
            value={searchStudent}
            onChange={(e) => setSearchStudent(e.target.value)}
            style={{ padding: "var(--space-2) var(--space-3)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border-subtle)" }}
          />
        </div>

        {selectedClassId && (
          <a
            href={getClassGradebookExportCsvUrl(selectedClassId)}
            className="teacher-button teacher-button--secondary"
            download
          >
            {isFa ? "خروجی فایل اکسل (CSV)" : "Export CSV"}
          </a>
        )}
      </div>

      {errorMsg && (
        <div style={{ padding: "var(--space-3)", background: "var(--color-danger-subtle)", color: "var(--color-danger-dark)", borderRadius: "var(--radius-sm)" }}>
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "var(--space-8)" }}>
          {isFa ? "در حال محاسبه و بارگیری ماتریس نمرات..." : "Calculating gradebook matrix..."}
        </div>
      ) : !gradebook ? (
        <div style={{ textAlign: "center", padding: "var(--space-8)" }}>
          {isFa ? "هیچ کلاسی یافت نشد." : "No class gradebook data available."}
        </div>
      ) : (
        <>
          {/* KPI Summary Cards */}
          <div className={styles.kpiGrid}>
            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>{isFa ? "میانگین نمره کلاس" : "Class Average"}</span>
              <span className={styles.kpiValue}>{gradebook.class_average_percentage}%</span>
            </div>
            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>{isFa ? "تعداد کل زبان‌آموزان" : "Enrolled Students"}</span>
              <span className={styles.kpiValue}>{gradebook.total_students}</span>
            </div>
            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>{isFa ? "تعداد تکالیف منتشرشده" : "Published Assignments"}</span>
              <span className={styles.kpiValue}>{gradebook.total_assignments}</span>
            </div>
          </div>

          {/* Matrix Grid Table */}
          <div className={styles.matrixWrapper}>
            <table className={styles.matrixTable}>
              <thead>
                <tr>
                  <th className={styles.stickyCol}>{isFa ? "زبان‌آموز (Student)" : "Student"}</th>
                  <th>{isFa ? "میانگین کل" : "Overall %"}</th>
                  <th>{isFa ? "رتبه" : "Grade"}</th>
                  <th>{isFa ? "انجام شده" : "Completed"}</th>
                  <th>{isFa ? "غیبت/نقص" : "Missing"}</th>
                  {gradebook.assignments.map((a) => (
                    <th key={a.id}>
                      <div>{a.title}</div>
                      <div style={{ fontSize: "var(--font-size-xs)", fontWeight: 400, color: "var(--color-text-secondary)" }}>
                        {a.total_points} pts | {a.average_percentage}% avg
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredStudents && filteredStudents.length > 0 ? (
                  filteredStudents.map((s) => (
                    <tr key={s.student_id}>
                      <td className={styles.stickyCol}>
                        <div>
                          <strong>{s.name}</strong>
                          <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
                            {s.email}
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>{s.overall_percentage}%</strong>
                      </td>
                      <td>
                        <span className={styles.gradePill} style={{ background: "var(--color-bg-muted)" }}>
                          {s.letter_grade}
                        </span>
                      </td>
                      <td>{s.completed_count}</td>
                      <td style={{ color: s.missing_count > 0 ? "var(--color-danger-600)" : "inherit" }}>
                        {s.missing_count}
                      </td>
                      {gradebook.assignments.map((a) => {
                        const cell = s.grades[a.id];
                        if (!cell) return <td key={a.id}>-</td>;

                        let label = "-";
                        if (cell.score !== null) {
                          label = `${cell.score} (${cell.percentage}%)`;
                        } else if (cell.status === "missing") {
                          label = isFa ? "غایب" : "Missing";
                        } else if (cell.status === "submitted") {
                          label = isFa ? "تصحیح نشده" : "Submitted";
                        }

                        const pillClass = getPillClass(cell.percentage, cell.status);

                        return (
                          <td key={a.id}>
                            {cell.attempt_id ? (
                              <Link
                                href={`/teacher/grading/${cell.attempt_id}`}
                                className={`${styles.gradePill} ${pillClass}`}
                                title={isFa ? "کلیک برای مشاهده یا تصحیح تلاش" : "Click to view or grade attempt"}
                              >
                                {label}
                              </Link>
                            ) : (
                              <span className={`${styles.gradePill} ${pillClass}`}>
                                {label}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5 + gradebook.assignments.length} style={{ textAlign: "center", padding: "var(--space-4)" }}>
                      {isFa ? "زبان‌آموزی در این کلاس ثبت نشده است." : "No students found."}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className={styles.footerRow}>
                  <td className={styles.stickyCol}>{isFa ? "میانگین کلاس" : "Class Average"}</td>
                  <td>{gradebook.class_average_percentage}%</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  {gradebook.assignments.map((a) => (
                    <td key={a.id}>
                      {a.average_percentage}% ({a.completion_rate}% comp)
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
