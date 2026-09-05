"use client";

import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header} dir="rtl">

      <div className={styles.logo}>
        <strong>Endoora</strong>
        <span>A new door to your English</span>
      </div>


      <nav>
        <Link href="/">خانه</Link>
        <Link href="/how-it-works">
          چطور کار می‌کند
        </Link>
        <Link href="/teachers">
          مدرس‌ها
        </Link>
        <Link href="/courses">
          دوره‌ها
        </Link>
        <Link href="/skills">
          مهارت‌ها
        </Link>
        <Link href="/ielts">
          IELTS
        </Link>
        <Link href="/placement">
          تعیین سطح
        </Link>
        <Link href="/pricing">
          قیمت
        </Link>
        <Link href="/help">
          راهنما
        </Link>
      </nav>


      <div>
        <button>
          ورود
        </button>

        <button>
          English
        </button>
      </div>

    </header>
  );
}
