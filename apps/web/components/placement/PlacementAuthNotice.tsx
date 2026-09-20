"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { endooraApi } from "@/lib/endoora-api";
import { localizedPath, type PublicLocale } from "@/lib/public-site";
import styles from "./placement.module.css";

type SessionAccount = {
  email?: string;
  first_name?: string;
  full_name?: string;
  role?: string;
};

type AuthState =
  | { kind: "checking" }
  | { kind: "anonymous" }
  | { account: SessionAccount; kind: "authenticated" };

export function PlacementAuthNotice({ locale }: { locale: PublicLocale }) {
  const isFa = locale === "fa";
  const [authState, setAuthState] = useState<AuthState>({ kind: "checking" });

  useEffect(() => {
    let isMounted = true;

    endooraApi<SessionAccount>("/auth/me/")
      .then((account) => {
        if (isMounted) setAuthState({ account, kind: "authenticated" });
      })
      .catch(() => {
        if (isMounted) setAuthState({ kind: "anonymous" });
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (authState.kind === "checking") {
    return (
      <section className={styles.authGateBox} aria-busy="true" aria-label={isFa ? "در حال بررسی وضعیت حساب کاربری" : "Checking account status"}>
        <p className={styles.authGateCheckingText}>
          {isFa ? "در حال آماده‌سازی وضعیت پروفایل..." : "Preparing learner profile status..."}
        </p>
      </section>
    );
  }

  if (authState.kind === "authenticated") {
    const displayName =
      authState.account.first_name ||
      authState.account.full_name ||
      authState.account.email ||
      (isFa ? "زبان‌آموز گرامی" : "Learner");

    return (
      <section className={`${styles.authGateBox} ${styles.authGateBoxAuthed}`} aria-label={isFa ? "وضعیت حساب کاربری برای تعیین سطح" : "Placement account status"}>
        <div className={styles.authGateHeader}>
          <span className={styles.authGateBadgeAuthed}>
            <span aria-hidden="true">✓</span>
            {isFa ? "حساب کاربری متصل است" : "Account Connected"}
          </span>
          <span className={styles.authGateUserTag}>{displayName}</span>
        </div>
        <h2 className={styles.authGateTitle}>
          {isFa
            ? "نتایج این آزمون به طور خودکار در پروفایل شما ذخیره خواهد شد"
            : "Your placement results will be saved directly to your profile"}
        </h2>
        <p className={styles.authGateDesc}>
          {isFa
            ? "پس از تکمیل ۲۴ پرسش انطباقی در ۶ مهارت، شواهد یادگیری و کارنامه تفکیکی شما در دوقلوی یادگیری ثبت و نقشه راه اختصاصی‌تان فعال می‌شود."
            : "After completing all 24 adaptive questions across 6 skills, your diagnostic evidence will update your Learner Twin and personalized study path."}
        </p>
        <div className={styles.authGateActions}>
          <Link href="/placement/demo" className={styles.btnPrimary}>
            {isFa ? "شروع آزمون تعیین سطح (۲۴ سوال)" : "Start placement test (24 questions)"}
          </Link>
          <Link href="/placement/report" className={styles.btnSecondary}>
            {isFa ? "مشاهده کارنامه مهارتی" : "View skill report"}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.authGateBox} ${styles.authGateBoxPrompt}`} aria-label={isFa ? "اعلان ثبت‌نام و ورود به حساب کاربری" : "Sign in notice for placement test"}>
      <div className={styles.authGateHeader}>
        <span className={styles.authGateBadgePrompt}>
          <span aria-hidden="true">🔒</span>
          {isFa ? "ذخیره‌سازی هوشمند نتایج" : "Save Results to Profile"}
        </span>
      </div>
      <h2 className={styles.authGateTitle}>
        {isFa
          ? "برای ذخیره نتایج آزمون در پروفایل، ابتدا وارد شوید یا ثبت‌نام کنید"
          : "Sign in or register first to save your placement results to your profile"}
      </h2>
      <p className={styles.authGateDesc}>
        {isFa
          ? "این آزمون ۲۴ سوالی هر ۶ مهارت زبانی (دستور زبان، واژگان، درک مطلب، شنیداری، گفتاری و نگارش) را می‌سنجد. با ورود به حساب کاربری، کارنامه تفکیکی، سطح دقیق CEFR و نقشه یادگیری اختصاصی شما برای همیشه در پروفایلتان حفظ خواهد شد."
          : "This comprehensive test evaluates all 6 skills (Grammar, Vocabulary, Reading, Listening, Speaking, and Writing). Signing in ensures your analytical report, CEFR estimate, and personalized curriculum are safely preserved in your profile."}
      </p>
      <div className={styles.authGateActions}>
        <Link href={localizedPath(locale, "/auth/login?next=/placement/demo")} className={styles.btnPrimary}>
          {isFa ? "ورود به حساب کاربری" : "Sign in"}
        </Link>
        <Link href={localizedPath(locale, "/auth/register?next=/placement/demo")} className={styles.btnPrimaryAlt}>
          {isFa ? "ثبت‌نام رایگان در ایندورا" : "Create free account"}
        </Link>
        <Link href="/placement/demo?guest=true" className={styles.btnGhost}>
          {isFa ? "ادامه به عنوان مهمان (بدون ذخیره در پروفایل)" : "Continue as guest (without saving)"}
        </Link>
      </div>
    </section>
  );
}
