"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { apiErrorMessages, endooraApi, EndooraApiError } from "@/lib/endoora-api";
import { clearActiveUser, setActiveUserId } from "@/lib/client-storage";
import { fetchUserWallet, fetchBillingInvoices, type PaymentTransaction } from "@/lib/marketplace";

interface Profile { goal?: string; preferred_daily_minutes?: number; public_name?: string }
interface Summary { account: {id: string; email: string; role: string; is_premium:boolean}; profile: Profile | null; session: {expires_at: string}; data_controls:{latest_deletion_request:{status:string} | null} }
interface Notice {id: string; title: string; message: string; is_read: boolean}
const tabs = {profile: "پروفایل", security: "امنیت و نشست", wallet: "کیف پول و صورتحساب", plan: "اشتراک", usage: "فعالیت", notifications: "اعلان‌ها", data: "داده‌های من"};
const goals = {general_english: "زبان عمومی", conversation: "مکالمه", ielts: "آیلتس", academic: "تحصیل", work: "کار", travel: "سفر", school: "مدرسه", other: "سایر"};

export default function AccountPage() {
  const [account, setAccount] = useState<Summary | null>(null);
  const [tab, setTab] = useState("profile");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [wallet, setWallet] = useState<number | null>(null);
  const [invoices, setInvoices] = useState<PaymentTransaction[]>([]);
  const [notices, setNotices] = useState<Notice[] | null>(null);
  const [pendingDelete,setPendingDelete] = useState(false);
  const [prefs,setPrefs] = useState<Record<string,boolean> | null>(null);
  const [download, setDownload] = useState("");
  useEffect(() => {
    function readTab() {
      const value = new URLSearchParams(location.search).get("tab") || "profile";
      setTab(Object.hasOwn(tabs, value) ? value : "profile");
    }
    readTab();
    window.addEventListener("popstate", readTab);
    endooraApi<Summary>("/profiles/account-summary/").then(data => {
      setActiveUserId(data.account.id);
      setAccount(data); setPendingDelete(data.data_controls.latest_deletion_request?.status === "pending");
    }).catch(error => {
      if (error instanceof EndooraApiError && [401,403].includes(error.status)) {
        clearActiveUser();
        location.replace("/auth/login?next=" + encodeURIComponent(location.pathname + location.search));
      } else setStatus(apiErrorMessages(error, "fa").join(" "));
    });
    return () => window.removeEventListener("popstate", readTab);
  }, []);
  useEffect(() => {
    if (!account) return;
    let active = true;
    const fail = (error: unknown) => { if (active) setStatus(apiErrorMessages(error, "fa").join(" ")); };
    if (tab === "data") endooraApi<Record<string,boolean>>("/privacy/preferences/").then(value => {if(active) setPrefs(value);}).catch(fail);
    if (tab === "wallet") Promise.all([fetchUserWallet(), fetchBillingInvoices()]).then(([w,b]) => {
      if (active) {setWallet(w.wallet.balance_toman); setInvoices(b.invoices);}
    }).catch(fail);
    if (tab === "notifications") endooraApi<{notifications: Notice[]}>("/notifications/").then(data => {
      if (active) setNotices(data.notifications);
    }).catch(fail);
    return () => {active = false;};
  }, [account, tab]);

  async function perform(action: () => Promise<void>) {
    if (busy) return;
    setBusy(true); setStatus("");
    try { await action(); } catch (error) { setStatus(apiErrorMessages(error, "fa").join(" ")); }
    finally { setBusy(false); }
  }
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    void perform(async () => {
      if (tab === "security") {
        await endooraApi("/auth/password/change/", {method: "POST", json: Object.fromEntries(data)});
        form.reset(); setStatus("رمز عبور تغییر کرد.");
      } else if (account) {
        const json = account.account.role === "teacher" ? {public_name: data.get("public_name")} :
          {goal: data.get("goal"), preferred_daily_minutes: Number(data.get("minutes"))};
        const profile = await endooraApi<Profile>("/profiles/" + account.account.role + "/", {method: "PATCH", json});
        setAccount({...account, profile}); setStatus("تغییرات ذخیره شد.");
      }
    });
  }
  if (!account) return <main className="account-panel" role="status">{status || "در حال دریافت حساب کاربری…"}</main>;
  return <main dir="rtl" className="account-panel">
    <h1>حساب کاربری</h1><p dir="ltr">{account.account.email}</p>
    <nav aria-label="بخش‌های حساب">{Object.entries(tabs).map(([key,label]) =>
      <Link key={key} aria-current={tab === key ? "page" : undefined} href={"?tab=" + key} onClick={e => {
        e.preventDefault(); history.pushState(null,"","?tab=" + key); setStatus(""); setTab(key);
      }}>{label}</Link>)}</nav>
    <h2>{tabs[tab as keyof typeof tabs]}</h2>
    {tab === "profile" && ["learner","teacher"].includes(account.account.role) && <form onSubmit={save}>
      {account.account.role === "teacher" ? <label>نام عمومی<input name="public_name" required defaultValue={account.profile?.public_name}/></label> : <>
        <label>هدف یادگیری<select required name="goal" defaultValue={account.profile?.goal || ""}><option value="">انتخاب کنید</option>{Object.entries(goals).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></label>
        <label>زمان روزانه (دقیقه)<input name="minutes" type="number" required min="5" max="240" defaultValue={account.profile?.preferred_daily_minutes ?? ""}/></label></>}
      <button disabled={busy}>ذخیره تغییرات</button></form>}
    {tab === "security" && <><p>پایان نشست فعلی {new Date(account.session.expires_at).toLocaleString("fa-IR")}</p><form onSubmit={save}>
      <label>رمز فعلی<input required name="current_password" type="password" autoComplete="current-password"/></label>
      <label>رمز جدید<input required minLength={8} maxLength={256} name="new_password" type="password" autoComplete="new-password"/></label>
      <button disabled={busy}>تغییر رمز عبور</button></form></>}
    {tab === "wallet" && (wallet === null ? <p>در انتظار دریافت موجودی</p> : <><p>موجودی {wallet.toLocaleString("fa-IR")} تومان</p>
      {invoices.length ? <ul>{invoices.map(i => <li key={i.id}>{i.amount_toman.toLocaleString("fa-IR")} تومان · {i.status_display} · {i.ref_id || i.id}</li>)}</ul> : <p>صورتحسابی ثبت نشده است.</p>}</>)}
    {tab === "usage" && <Link href="/progress">مشاهده پیشرفت یادگیری</Link>}
    {tab === "plan" && <><p>{account.account.is_premium ? "اشتراک پرمیوم فعال است." : "اشتراک پرمیوم فعال نیست."}</p><Link href="/pricing">طرح‌ها و شرایط اشتراک</Link></>}
    {tab === "notifications" && (notices === null ? <p>در انتظار دریافت اعلان‌ها</p> : notices.length ? notices.map(n => <article key={n.id}><h3>{n.title}</h3><p>{n.message}</p>
      {!n.is_read && <button disabled={busy} onClick={() => perform(async () => {await endooraApi("/notifications/"+n.id+"/read/", {method:"POST"}); setNotices(notices.map(item => item.id === n.id ? {...item,is_read:true} : item));})}>علامت خوانده‌شده</button>}</article>) : <p>اعلانی برای شما ثبت نشده است.</p>)}
    {tab === "data" && <><button disabled={busy} onClick={() => perform(async () => {const result = await endooraApi<{export_id:string}>("/privacy/export/", {method: "POST"}); setDownload("/backend/api/privacy/export/"+result.export_id+"/download/");})}>درخواست خروجی اطلاعات حساب</button> {download && <a href={download} download>دانلود فایل JSON</a>}</>}
    {tab === "data" && <section><h3>ترجیحات حریم خصوصی</h3>{prefs && <form onSubmit={e => {
      e.preventDefault(); const form = new FormData(e.currentTarget);
      void perform(async () => {
        const saved = await endooraApi<Record<string,boolean>>("/privacy/preferences/",{method:"PUT",json:{
          analytics_processing:form.has("analytics_processing"),ai_model_training_telemetry:form.has("ai_model_training_telemetry"),marketing_communications:form.has("marketing_communications"),
        }}); setPrefs(saved); setStatus("ترجیحات ذخیره شد.");
      });
    }}>{Object.entries({analytics_processing:"تحلیل استفاده",ai_model_training_telemetry:"داده‌های آموزشی مدل",marketing_communications:"پیام‌های بازاریابی"}).map(([key,label]) =>
      <label key={key}><input type="checkbox" name={key} defaultChecked={prefs[key]}/>{label}</label>)}<button disabled={busy}>ذخیره ترجیحات</button></form>}
    <h3>{pendingDelete ? "لغو درخواست حذف" : "درخواست حذف حساب"}</h3><form onSubmit={e => {
      e.preventDefault(); const form=e.currentTarget; const confirm = new FormData(form).get("confirm");
      void perform(async () => {await endooraApi(pendingDelete ? "/auth/deletion-request/cancel/" : "/auth/deletion-request/",{method:"POST",json:{confirm}});
        setPendingDelete(!pendingDelete); form.reset(); setStatus("درخواست ثبت شد.");});
    }}><label>برای تأیید، عبارت {pendingDelete ? "KEEP" : "DELETE"} را وارد کنید.<input required name="confirm" pattern={pendingDelete ? "KEEP" : "DELETE"}/></label>
    <button disabled={busy}>{pendingDelete ? "لغو درخواست" : "ثبت درخواست حذف حساب"}</button></form></section>}
    <p role="status">{status}</p><button disabled={busy} onClick={() => perform(async () => {await endooraApi("/auth/logout/", {method:"POST"}); clearActiveUser(); location.replace("/");})}>خروج از حساب</button>
  </main>;
}
