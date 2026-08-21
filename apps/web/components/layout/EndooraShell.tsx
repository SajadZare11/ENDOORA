import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./EndooraShell.module.css";

const nav = [
  ["خانه", "/"],
  ["چطور کار می‌کند", "/how-it-works"],
  ["تعیین سطح", "/placement"],
  ["مدرس‌ها", "/teachers"],
  ["دوره‌ها", "/learn"],
  ["IELTS", "/ielts"],
  ["قیمت", "/pricing"],
  ["راهنما", "/help"],
];

export function EndooraShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell} dir="rtl" lang="fa">
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          <strong dir="ltr">Endoora</strong>
          <span dir="ltr">A new door to your English</span>
        </Link>

        <nav className={styles.nav}>
          {nav.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link href="/en" className={styles.language}>English</Link>
          <Link href="/auth/login" className={styles.cta}>ورود</Link>
        </div>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <div>
          <strong dir="ltr">Endoora</strong>
          <p>سیستم یادگیری انگلیسی فارسی‌محور برای زبان‌آموزان ایران.</p>
        </div>

        <div>
          <strong>یادگیری</strong>
          <p>مهارت‌ها</p>
          <p>منابع</p>
          <p>وبلاگ</p>
        </div>

        <div>
          <strong>اعتماد</strong>
          <p>حریم خصوصی</p>
          <p>دسترسی‌پذیری</p>
        </div>

        <div>
          <strong>پشتیبانی</strong>
          <p>تماس</p>
          <p>وضعیت سرویس</p>
        </div>
      </footer>
    </div>
  );
}
