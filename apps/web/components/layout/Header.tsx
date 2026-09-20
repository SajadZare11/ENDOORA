"use client";

import Link from "next/link";
import Image from "next/image";
import { Button, BdiEn } from "@endoora/ui";
import { useLocale } from "../../lib/locale-context";
import { LanguageSwitcher } from "./LanguageSwitcher";
import styles from "./Header.module.css";

export default function Header() {
  const { isFa, t, dir } = useLocale();

  return (
    <header className={styles.header} dir={dir}>
      <Link href="/" className={styles.logo} aria-label="Endoora home">
        <Image
          src="/images/endoora-mark.png"
          alt="Endoora logo"
          width={36}
          height={43}
          className={styles.logoImg}
          priority
        />
        <div className={styles.logoCopy}>
          <strong dir="ltr">Endoora</strong>
          <span dir="ltr">A new door to your English</span>
        </div>
      </Link>

      <nav aria-label={t("nav.learn")}>
        <Link href="/">{t("nav.home")}</Link>
        <Link href="/how-it-works">{isFa ? "چطور کار می‌کند" : "How It Works"}</Link>
        <Link href="/teachers">{t("nav.teachers")}</Link>
        <Link href="/courses">{t("nav.courses")}</Link>
        <Link href="/skills">{isFa ? "مهارت‌ها" : "Skills"}</Link>
        <Link href="/community">{isFa ? "جامعه" : "Community"}</Link>
        <Link href="/ielts"><BdiEn>IELTS</BdiEn></Link>
        <Link href="/placement">{t("nav.placement")}</Link>
        <Link href="/pricing">{t("nav.pricing")}</Link>
        <Link href="/search">{isFa ? "جستجو" : "Search"}</Link>
        <Link href="/support">{isFa ? "پشتیبانی" : "Support"}</Link>
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
        <Button variant="secondary">
          {t("nav.login")}
        </Button>
        <LanguageSwitcher variant="toggle" />
      </div>
    </header>
  );
}
