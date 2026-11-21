"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "@/components/ielts/reviewed-practice.module.css";

export default function Workshop() {
  const [task, setTask] = useState<"writing" | "speaking">("writing");
  const [drafts, setDrafts] = useState({ writing: "", speaking: "" });
  const text = drafts[task];
  const writing = task === "writing";
  function download() {
    const url = URL.createObjectURL(new Blob([text], {type:"text/plain;charset=utf-8"}));
    const link = document.createElement("a");
    link.href = url; link.download = "endoora-"+task+".txt"; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <main className={styles.page} dir="rtl"><Link href="/ielts">فهرست تمرین‌ها</Link><h1>کارگاه نوشتن و گفتار</h1>
    <label>مهارت <select value={task} onChange={e=>setTask(e.target.value as typeof task)}><option value="writing">نوشتن</option><option value="speaking">گفتار</option></select></label>
    <p dir="ltr" lang="en">{writing ? "Some libraries now lend tools as well as books. Should public libraries spend money on this service? Give reasons and develop an example." : "Describe a skill you learned from another person. Say who helped you, what you practised, and how you use it today."}</p>
    <label>{writing ? "متن انگلیسی شما" : "یادداشت برای پاسخ شفاهی"}<textarea dir="ltr" lang="en" value={text} onChange={e => setDrafts({...drafts,[task]:e.target.value})}/></label>
    <p>تعداد واژه‌های واردشده: {text.trim() ? text.trim().split(/\s+/u).length : 0}</p><h2>بازبینی شخصی</h2>
    <ul>{(writing ? ["آیا موضع شما در سراسر نوشته روشن است؟","کدام مثال واقعاً دلیل شما را توضیح می‌دهد؟","یک جمله را برای دقت واژگان و دستور دوباره بخوانید."] :
      ["بدون خواندن یادداشت، دربارهٔ تجربه صحبت کنید.","آیا شنونده می‌تواند ترتیب رویدادها را دنبال کند؟","یک نکته را با جزئیات یا مثال روشن‌تر بیان کنید."]).map(t=><li key={t}>{t}</li>)}</ul>
    <p>متن در همین برگه می‌ماند. پیش از بستن صفحه یک نسخه دریافت کنید.</p><button onClick={download} disabled={!text.trim()}>دریافت متن</button></main>;
}
