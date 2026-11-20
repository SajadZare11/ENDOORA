"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FormField, CustomDynamicForm } from "@/lib/admin-forms-webhooks-store";

export default function PublicDynamicFormPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [form, setForm] = useState<CustomDynamicForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form responses state: fieldId -> value
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<string | null>(null);

  // Audio recording states for voice_recording fields: fieldId -> { isRecording, audioBlob, audioUrl, seconds }
  const [recordingStates, setRecordingStates] = useState<
    Record<string, { isRecording: boolean; audioUrl: string | null; seconds: number }>
  >({});
  const mediaRecorderRef = useRef<Record<string, MediaRecorder | null>>({});
  const audioChunksRef = useRef<Record<string, Blob[]>>({});
  const timerIntervalRef = useRef<Record<string, any>>({});

  // Fetch form data
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/public/forms/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.form) {
          setForm(data.form);
          // initialize default values
          const initialAnswers: Record<string, any> = {};
          data.form.fields.forEach((field: FormField) => {
            if (field.defaultValue !== undefined) {
              initialAnswers[field.id] = field.defaultValue;
            }
          });
          setAnswers(initialAnswers);
        } else {
          setError(data.error || "فرم مورد نظر یافت نشد یا در دسترس نیست.");
        }
      })
      .catch(() => setError("خطا در برقراری ارتباط با سرور."))
      .finally(() => setLoading(false));
  }, [slug]);

  // Voice recording handlers
  const startRecording = async (fieldId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current[fieldId] = recorder;
      audioChunksRef.current[fieldId] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current[fieldId].push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current[fieldId], { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setRecordingStates((prev) => ({
          ...prev,
          [fieldId]: { ...(prev[fieldId] || {}), isRecording: false, audioUrl: url },
        }));
        // Store simulated audio data uri or label
        setAnswers((prev) => ({ ...prev, [fieldId]: `audio-recorded-${fieldId}.webm` }));
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setRecordingStates((prev) => ({
        ...prev,
        [fieldId]: { isRecording: true, audioUrl: null, seconds: 0 },
      }));

      // Start ticker
      timerIntervalRef.current[fieldId] = setInterval(() => {
        setRecordingStates((prev) => {
          const cur = prev[fieldId];
          if (!cur) return prev;
          return {
            ...prev,
            [fieldId]: { ...cur, seconds: cur.seconds + 1 },
          };
        });
      }, 1000);
    } catch {
      alert("دسترسی به میکروفون مرورگر امکان‌پذیر نیست. لطفاً دسترسی ضبط صدا را تایید کنید.");
    }
  };

  const stopRecording = (fieldId: string) => {
    if (timerIntervalRef.current[fieldId]) {
      clearInterval(timerIntervalRef.current[fieldId]);
    }
    const recorder = mediaRecorderRef.current[fieldId];
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/public/forms/${form.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmittedSuccess(data.message || form.successMessageFa);
      } else {
        alert(data.error || "خطا در ثبت پاسخ‌ها");
      }
    } catch {
      alert("خطای ارتباطی در ارسال پاسخ فرم");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div dir="rtl" style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-vazirmatn, sans-serif)", color: "#64748b" }}>
        <span>در حال بارگذاری فرم... ⏳</span>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div dir="rtl" style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", fontFamily: "var(--font-vazirmatn, sans-serif)" }}>
        <h2 style={{ color: "#ef4444" }}>خطا در بارگذاری فرم</h2>
        <p style={{ color: "#64748b" }}>{error}</p>
        <Link href="/" style={{ color: "#2563eb", textDecoration: "underline" }}>
          بازگشت به صفحه اصلی سایت
        </Link>
      </div>
    );
  }

  if (submittedSuccess) {
    return (
      <div
        dir="rtl"
        style={{
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
          background: "radial-gradient(ellipse at top, #1e293b 0%, #0f172a 100%)",
          fontFamily: "var(--font-vazirmatn, sans-serif)",
        }}
      >
        <div
          style={{
            maxWidth: "580px",
            width: "100%",
            background: "#ffffff",
            borderRadius: "24px",
            padding: "3rem 2rem",
            textAlign: "center",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "#dcfce7",
              color: "#15803d",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.5rem",
              margin: "0 auto 1.5rem auto",
            }}
          >
            ✓
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a", marginBottom: "0.75rem" }}>
            پاسخ شما با موفقیت ثبت شد
          </h2>
          <p style={{ fontSize: "1rem", color: "#475569", lineHeight: 1.7, marginBottom: "2rem" }}>
            {submittedSuccess}
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            <Link
              href="/"
              style={{
                background: "#2563eb",
                color: "#ffffff",
                padding: "0.75rem 1.5rem",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "700",
                fontSize: "0.95rem",
              }}
            >
              صفحه اصلی آکادمی ایندورا
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
        fontFamily: "var(--font-vazirmatn, sans-serif)",
        padding: "2.5rem 1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: "720px",
          width: "100%",
          background: "#ffffff",
          borderRadius: "20px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
          overflow: "hidden",
        }}
      >
        {/* Header Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e293b, #0f172a)",
            color: "#ffffff",
            padding: "2.5rem 2rem",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <span style={{ background: "rgba(56, 189, 248, 0.2)", color: "#38bdf8", padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: "700" }}>
              Endoora Academy Form
            </span>
          </div>
          <h1 style={{ margin: "0 0 0.5rem 0", fontSize: "1.75rem", fontWeight: "800", lineHeight: 1.4 }}>
            {form.titleFa}
          </h1>
          {form.descriptionFa && (
            <p style={{ margin: 0, fontSize: "0.95rem", color: "#94a3b8", lineHeight: 1.6 }}>
              {form.descriptionFa}
            </p>
          )}
        </div>

        {/* Dynamic Fields Form */}
        <form onSubmit={handleSubmit} style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {form.fields.map((field) => {
            const val = answers[field.id] || "";
            const recState = recordingStates[field.id];

            return (
              <div key={field.id} style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                <label style={{ fontSize: "0.95rem", fontWeight: "700", color: "#1e293b" }}>
                  {field.label} {field.isRequired && <span style={{ color: "#ef4444" }}>*</span>}
                </label>
                {field.helpText && (
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{field.helpText}</span>
                )}

                {/* Text / Phone / Email */}
                {(field.type === "text" || field.type === "phone" || field.type === "email") && (
                  <input
                    type={field.type === "phone" ? "tel" : field.type === "email" ? "email" : "text"}
                    dir={field.type === "email" || field.type === "phone" ? "ltr" : "rtl"}
                    required={field.isRequired}
                    placeholder={field.placeholder || ""}
                    value={val}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    style={{
                      padding: "0.75rem 1rem",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.95rem",
                      outline: "none",
                    }}
                  />
                )}

                {/* Textarea */}
                {field.type === "textarea" && (
                  <textarea
                    rows={4}
                    required={field.isRequired}
                    placeholder={field.placeholder || ""}
                    value={val}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    style={{
                      padding: "0.75rem 1rem",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.95rem",
                      outline: "none",
                      fontFamily: "inherit",
                    }}
                  />
                )}

                {/* Dropdown Select */}
                {field.type === "select" && (
                  <select
                    required={field.isRequired}
                    value={val}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    style={{
                      padding: "0.75rem 1rem",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.95rem",
                      background: "#ffffff",
                    }}
                  >
                    <option value="">انتخاب کنید...</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}

                {/* Radio Options */}
                {field.type === "radio" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.25rem" }}>
                    {field.options?.map((opt) => (
                      <label
                        key={opt}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.6rem",
                          padding: "0.6rem 0.85rem",
                          background: val === opt ? "#eff6ff" : "#f8fafc",
                          border: `1px solid ${val === opt ? "#2563eb" : "#e2e8f0"}`,
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                        }}
                      >
                        <input
                          type="radio"
                          name={field.id}
                          value={opt}
                          checked={val === opt}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Rating 1 to 5 Stars */}
                {field.type === "rating" && (
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.25rem" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleInputChange(field.id, star)}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "2rem",
                          color: (Number(val) || 0) >= star ? "#f59e0b" : "#cbd5e1",
                          transition: "color 0.15s ease",
                        }}
                      >
                        ★
                      </button>
                    ))}
                    <span style={{ fontSize: "0.85rem", color: "#64748b", marginRight: "0.5rem" }}>
                      ({val || 0} از ۵)
                    </span>
                  </div>
                )}

                {/* Voice Recording Input */}
                {field.type === "voice_recording" && (
                  <div
                    style={{
                      background: "#f8fafc",
                      border: "2px dashed #cbd5e1",
                      borderRadius: "12px",
                      padding: "1.25rem",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    {!recState?.isRecording ? (
                      <button
                        type="button"
                        onClick={() => startRecording(field.id)}
                        style={{
                          background: "linear-gradient(135deg, #ef4444, #dc2626)",
                          color: "#ffffff",
                          border: "none",
                          padding: "0.75rem 1.5rem",
                          borderRadius: "999px",
                          fontWeight: "700",
                          fontSize: "0.95rem",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          boxShadow: "0 4px 6px -1px rgba(239, 68, 68, 0.3)",
                        }}
                      >
                        <span>🎙️</span>
                        <span>{recState?.audioUrl ? "ضبط مجدد صدا (Re-Record)" : "شروع ضبط صدا با میکروفون"}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => stopRecording(field.id)}
                        style={{
                          background: "#0f172a",
                          color: "#ffffff",
                          border: "none",
                          padding: "0.75rem 1.5rem",
                          borderRadius: "999px",
                          fontWeight: "700",
                          fontSize: "0.95rem",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
                        <span>توقف ضبط ({String(Math.floor((recState?.seconds || 0) / 60)).padStart(2, "0")}:{String((recState?.seconds || 0) % 60).padStart(2, "0")})</span>
                      </button>
                    )}

                    {recState?.audioUrl && (
                      <div style={{ width: "100%", marginTop: "0.5rem" }}>
                        <audio src={recState.audioUrl} controls style={{ width: "100%" }} />
                      </div>
                    )}
                  </div>
                )}

                {/* File Upload Input */}
                {field.type === "file_upload" && (
                  <div
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #cbd5e1",
                      borderRadius: "10px",
                      padding: "1rem",
                    }}
                  >
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleInputChange(field.id, file.name);
                        }
                      }}
                      style={{ fontSize: "0.85rem" }}
                    />
                    {val && (
                      <div style={{ fontSize: "0.8rem", color: "#16a34a", marginTop: "0.35rem" }}>
                        ✓ فایل انتخاب شده: <strong>{val}</strong>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <button
            type="submit"
            disabled={submitting}
            style={{
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "#ffffff",
              border: "none",
              padding: "1rem 2rem",
              borderRadius: "12px",
              fontWeight: "800",
              fontSize: "1.05rem",
              cursor: submitting ? "not-allowed" : "pointer",
              boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.4)",
              marginTop: "1rem",
            }}
          >
            {submitting ? "در حال ارسال و ثبت نهایی..." : "🚀 ثبت و ارسال نهایی پاسخ"}
          </button>
        </form>
      </div>
    </div>
  );
}
