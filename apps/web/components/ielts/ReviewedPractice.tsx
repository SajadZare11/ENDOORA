"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./reviewed-practice.module.css";

type Question = { id: string; prompt: string; choices: string[] };
type Unit = { title: string; instruction: string; passage?: string; audio?: string; questions: Question[] };
type Result = { correct: number; total: number; transcript?: string; items: { id: string; correct: boolean; answer: string; explanation: string }[] };
type State = { unit: Unit; answers: Record<string, string>; revision: number; owner: string | null; result: Result | null };
const base = "/backend/api/ielts/units/";

async function request<T>(url: string, body?: object, signal?: AbortSignal): Promise<T> {
  let options: RequestInit = { signal, credentials: "same-origin", cache: "no-store" };
  if (body) {
    const csrf = await fetch("/backend/api/auth/csrf/", options);
    if (!csrf.ok) throw new Error("دریافت مجوز ارسال ممکن نشد.");
    const token = (await csrf.json()).csrf_token;
    options = { ...options, method: "POST", headers: { "Content-Type": "application/json", "X-CSRFToken": token }, body: JSON.stringify(body) };
  }
  const response = await fetch(url, options);
  if (!response.ok) {
    if (response.status === 409) throw new Error("حساب یا نسخهٔ ذخیره‌شده تغییر کرده است. صفحه را دوباره باز کنید.");
    if (response.status === 404) throw new Error("این تمرین در حال حاضر منتشر نشده است.");
    throw new Error("پاسخ معتبر از سرور دریافت نشد. دوباره تلاش کنید.");
  }
  return response.json() as Promise<T>;
}

export function PracticeIndex() {
  const [units, setUnits] = useState<{ slug: string; title: string }[] | null>(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    request<{units: {slug: string; title: string}[]}>(base, undefined, controller.signal)
      .then(data => setUnits(data.units)).catch(() => { if (!controller.signal.aborted) setError("فهرست تمرین‌ها در دسترس نیست."); });
    return () => controller.abort();
  }, [retry]);
  return <main className={styles.page} dir="rtl"><h1>تمرین آیلتس</h1><p>در هر تمرین کوتاه پاسخ خود را ثبت کنید و دلیل هر پاسخ را به فارسی بخوانید.</p>
    {error ? <p role="alert">{error} <button onClick={() => { setError(""); setRetry(x => x+1); }}>تلاش دوباره</button></p>
      : !units ? <p role="status">در حال دریافت…</p> : units.length === 0 ? <p>تمرین جدید پس از بازبینی منتشر می‌شود.</p> : <ul>{units.map(u => <li key={u.slug}><Link href={"/ielts/unit/"+u.slug} lang="en" dir="ltr">{u.title}</Link></li>)}</ul>}
    <h2>تمرین مهارت‌های تولیدی</h2><p>برای تمرین انفرادی، نوشته یا یادداشت گفتاری خود را با معیارهای راهنما مرور کنید.</p>
    <p><Link href="/ielts/workshop">کارگاه نوشتن و گفتار</Link></p><p><Link href="/ielts/history">سابقهٔ تمرین‌های نسخهٔ قبلی</Link></p></main>;
}

export function ReviewedPractice({ slug }: { slug: string }) {
  const url = base + encodeURIComponent(slug) + "/";
  const [state, setState] = useState<State | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [note, setNote] = useState("");
  const [question, setQuestion] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    request<State>(url, undefined, controller.signal).then(data => { setState(data); setQuestion(data.unit.questions[0]?.id ?? ""); })
      .catch((e: Error) => { if (!controller.signal.aborted) setMessage(e.message); });
    return () => controller.abort();
  }, [url]);
  async function submit(action: "save" | "finish") {
    if (!state || busy) return;
    setBusy(true); setMessage("");
    try {
      const receipt = await request<{result: Result | null; revision: number; saved: boolean}>(url, {action, answers: state.answers, revision: state.revision, owner: state.owner});
      setState({ ...state, revision: receipt.revision, result: receipt.result });
      setMessage(receipt.saved ? "در حساب شما ذخیره شد." : "نتیجهٔ مهمان فقط در این صفحه نمایش داده می‌شود.");
    } catch (e) { setMessage(e instanceof Error ? e.message : "ارسال ناموفق بود."); }
    finally { setBusy(false); }
  }
  async function report() {
    if (busy || !note.trim()) return;
    setBusy(true);
    try { await request(url+"report/", {question, note}); setNote(""); setMessage("گزارش شما برای بررسی ثبت شد."); }
    catch (e) { setMessage(e instanceof Error ? e.message : "ارسال ناموفق بود."); }
    finally { setBusy(false); }
  }
  if (!state) return <main className={styles.page} dir="rtl"><Link href="/ielts">فهرست تمرین‌ها</Link><p role="status">{message || "در حال دریافت…"}</p></main>;
  const {unit, answers, result} = state;
  return <main className={styles.page} dir="rtl"><Link href="/ielts">همهٔ تمرین‌ها</Link><h1 lang="en" dir="ltr">{unit.title}</h1>
    <p lang="en" dir="ltr">{unit.instruction}</p>{unit.passage && <blockquote lang="en" dir="ltr">{unit.passage}</blockquote>}
    {unit.audio && <><p>اعلان تمرینی با صدای مصنوعی انگلیسی</p><audio controls preload="metadata" src={unit.audio} aria-label="Library announcement" /></>}
    <p>{state.owner ? "برای نگه‌داشتن پاسخ‌ها، ذخیرهٔ پیش‌نویس را بزنید." : "در حالت مهمان، با بستن صفحه پاسخ‌ها پاک می‌شوند."}</p>
    {unit.questions.map((q,i) => <fieldset key={q.id} disabled={busy || !!result} dir="ltr" lang="en"><legend>{i+1}. {q.prompt}</legend>
      {q.choices.map(c => <label key={c}><input type="radio" name={q.id} checked={answers[q.id]===c} onChange={() => {setState({...state, answers:{...answers,[q.id]:c}}); setMessage("");}} /> {c}</label>)}
      {result && <p dir="rtl" lang="fa">{result.items[i].correct ? "درست" : "نیاز به مرور"} · <b lang="en">{result.items[i].answer}</b><br/>{result.items[i].explanation}</p>}</fieldset>)}
    {!result && <div>{state.owner && <button disabled={busy} onClick={() => submit("save")}>ذخیرهٔ پیش‌نویس</button>}
      <button disabled={busy || Object.keys(answers).length !== unit.questions.length} onClick={() => submit("finish")}>پایان و بررسی پاسخ‌ها</button></div>}
    {result && <section><h2>نتیجهٔ این تمرین</h2><p>{result.correct} پاسخ درست از {result.total}</p>
      {result.transcript && <details><summary>متن فایل صوتی</summary><p dir="ltr" lang="en">{result.transcript}</p></details>}</section>}
    {state.owner && <details><summary>گزارش ایراد سؤال</summary><label>شمارهٔ سؤال <select value={question} onChange={e => setQuestion(e.target.value)}>{unit.questions.map((q,i) => <option key={q.id} value={q.id}>{i+1}</option>)}</select></label>
      <label>توضیح <textarea maxLength={700} value={note} onChange={e => setNote(e.target.value)} /></label><button disabled={busy || note.trim().length<3} onClick={report}>ارسال گزارش</button></details>}
    <p role="status" aria-live="polite">{message}</p></main>;
}
