"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "@/components/ielts/reviewed-practice.module.css";

const sections = {writing:"نوشته‌ها", speaking:"تمرین‌های گفتاری", sessions:"آزمون‌های قدیمی"} as const;
type Section = keyof typeof sections;
type Row = {id:string; created_at:string; test_title_fa?:string; task2_prompt_title?:string; part2_cue_card_title?:string};

export default function History() {
  const [section,setSection] = useState<Section>("writing");
  const [rows,setRows] = useState<Row[]>([]);
  const [status,setStatus] = useState("در حال دریافت…");
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const res = await fetch("/backend/api/ielts/"+section+"/history/", {cache:"no-store",credentials:"same-origin", signal:controller.signal});
        if (res.status === 401 || res.status === 403) {setStatus("برای مشاهدهٔ سابقه وارد حساب خود شوید.");return;}
        if (!res.ok) throw Error();
        const items:Row[] = await res.json();
        if (!controller.signal.aborted) { setRows(items); setStatus(items.length ? "" : "سابقه‌ای ثبت نشده است."); }
      } catch { if (!controller.signal.aborted) setStatus("دریافت سابقه ممکن نشد."); }
    }
    void load();
    return () => controller.abort();
  }, [section]);
  return <main className={styles.page} dir="rtl"><Link href="/ielts">فهرست تمرین‌ها</Link><h1>سابقهٔ حساب در نسخهٔ قبلی</h1>
    <label>بخش <select value={section} onChange={e=>{setRows([]); setStatus("در حال دریافت…"); setSection(e.target.value as Section);}}>
      {Object.entries(sections).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label>
    <p role="status">{status}</p><ul>{rows.map(r=><li key={r.id}>{r.test_title_fa || r.task2_prompt_title || r.part2_cue_card_title || sections[section]} · {new Date(r.created_at).toLocaleDateString("fa-IR")}</li>)}</ul></main>;
}
