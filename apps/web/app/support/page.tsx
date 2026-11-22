"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { endooraApi, EndooraApiError, apiErrorMessages } from "@/lib/endoora-api";
import { PublicShell } from "@/components/marketing/PublicShell";

interface Ticket {id: string; title: string; status_display: string}
interface Detail extends Ticket {description: string; escalated_to_human: boolean; messages: {id:string; sender_name:string; body:string}[]}
interface Faq {id: string; title: string; items: {id:string; question:string; answer:string}[]}
const categories = {payments:"پرداخت و امور مالی", account:"حساب کاربری", security:"امنیت و دسترسی", courses:"دوره‌ها", technical:"مشکل فنی", community:"جامعه", other:"سایر"};
const base = "/support/tickets/";
export default function SupportPage() {
  const [tickets,setTickets] = useState<Ticket[]>([]);
  const [detail,setDetail] = useState<Detail | null>(null);
  const [faq,setFaq] = useState<Faq[]>([]);
  const [auth,setAuth] = useState<boolean | null>(null);
  const [status,setStatus] = useState("");
  const [busy,setBusy] = useState(false);
  const lock = useRef(false);
  const fail = (e: unknown) => setStatus(apiErrorMessages(e,"fa").join(" "));
  useEffect(() => {
    endooraApi<Faq[]>("/support/faq/").then(setFaq).catch(fail);
    endooraApi<Ticket[]>(base).then(rows => {setTickets(rows); setAuth(true);}).catch(e => {
      if(e instanceof EndooraApiError && [401,403].includes(e.status)) setAuth(false); else fail(e);
    });
  }, []);
  async function act(action: () => Promise<void>) {
    if (lock.current) return;
    lock.current = true; setBusy(true); setStatus("");
    try {await action();} catch(e) {fail(e);} finally {lock.current = false; setBusy(false);}
  }
  function submit(e: FormEvent<HTMLFormElement>, reply = false) {
    e.preventDefault();
    const form = e.currentTarget, json = Object.fromEntries(new FormData(form));
    void act(async () => {
      if(reply && detail) {
        await endooraApi(base+detail.id+"/messages/", {method:"POST", json});
        setDetail(await endooraApi<Detail>(base+detail.id+"/"));
      } else {
        const created = await endooraApi<Detail>(base, {method:"POST", json});
        setTickets(prev => [created,...prev]); setDetail(created); setStatus("درخواست ثبت شد.");
      }
      form.reset();
    });
  }
  return <PublicShell locale="fa" currentPath="/support"><div dir="rtl" className="account-panel"><h1>مرکز پشتیبانی</h1>
    <section><h2>پرسش‌های متداول</h2>{faq.flatMap(c => c.items).map(item => <details key={item.id}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</section>
    {auth === false && <Link href="/auth/login?next=/support">برای ثبت و پیگیری درخواست وارد شوید</Link>}
    {auth && <><section><h2>ثبت درخواست پشتیبانی جدید</h2><form onSubmit={submit}>
      <label>موضوع<input name="title" maxLength={255} required/></label><label>دسته‌بندی<select name="category">{Object.entries(categories).map(([v,s]) => <option key={v} value={v}>{s}</option>)}</select></label>
      <label>شرح درخواست<textarea required name="description" rows={4}/></label><button disabled={busy}>ثبت درخواست</button></form></section>
      <section><h2>درخواست‌ها</h2>{tickets.length ? tickets.map(t => <button key={t.id} disabled={busy} onClick={() => act(async () => setDetail(await endooraApi<Detail>(base+t.id+"/")))}>{t.title} · {t.status_display}</button>) : <p>درخواستی ثبت نشده است.</p>}</section>
      {detail && <article><h2>{detail.title}</h2><p>شناسه پیگیری <bdi>{detail.id}</bdi></p><p>{detail.description}</p>
        {detail.messages.map(m => <p key={m.id}><strong>{m.sender_name}</strong> {m.body}</p>)}
        <form onSubmit={e => submit(e,true)}><label>پاسخ<textarea required name="body"/></label><button disabled={busy}>ارسال پاسخ</button></form>
        {detail.escalated_to_human ? <p>برای بررسی کارشناس ارجاع شد.</p> : <button disabled={busy} onClick={() => act(async () => {const result = await endooraApi<Detail>(base+detail.id+"/escalate/",{method:"POST",json:{reason:"درخواست بررسی کارشناس"}}); setDetail(result); setTickets(prev => prev.map(t => t.id === result.id ? result : t));})}>ارجاع به کارشناس</button>}</article>}</>}
    <p role="status">{status}</p></div></PublicShell>;
}
