"use client";

import React from "react";
import styles from "./admin-help-modal.module.css";
import { AdminModuleTab } from "./MasterAdminConsole";

export interface HelpGuideContent {
  title: string;
  badge: string;
  sensitivity: "safe" | "medium" | "critical";
  sensitivityLabel: string;
  whatIsIt: string;
  whatHappensIfChanged: string;
  safetyTip: string;
}

export const MODULE_HELP_GUIDES: Record<AdminModuleTab, HelpGuideContent> = {
  overview: {
    title: "نمای کلی و کارهای امروز",
    badge: "صفحه اصلی",
    sensitivity: "safe",
    sensitivityLabel: "🟢 کاملاً بی‌خطر و فقط نمایشی",
    whatIsIt: "اینجا پیشخوان خوش‌آمدگویی شماست؛ مثل تابلوی اعلانات که خلاصه وضعیت سایت، کارهای فوری امروز و آمار مهم رو یکجا نشون میده.",
    whatHappensIfChanged: "هیچ تغییری در سایت ایجاد نمیکنه. فقط می‌تونی با خیال راحت آمار رو ببینی یا روی کارهای منتظر کلیک کنی تا بری انجامشون بدی.",
    safetyTip: "هر وقت حس کردی گیج شدی یا نمیدونی از کجا شروع کنی، برگرد به همین صفحه تا ببینی چه کاری منتظرته.",
  },
  "site-cms": {
    title: "ویرایش متن‌ها، عکس‌ها و بنرهای سایت",
    badge: "ویترین سایت",
    sensitivity: "medium",
    sensitivityLabel: "🟡 نیازمند دقت (تغییر در دید عموم)",
    whatIsIt: "مثل ویترین مغازه است. متن تبریک بالای صفحه، بنر اصلی، معرفی مهارت‌ها و قیمت‌های جلوی دید مشتری رو از اینجا عوض می‌کنی.",
    whatHappensIfChanged: "به محض اینکه دکمه ذخیره رو بزنی، همه بازدیدکننده‌ها متن و عکس جدید رو می‌بینن.",
    safetyTip: "قبل از ذخیره، یه دور متنت رو بخون تا غلط املایی نداشته باشه. نگران نباش، خرابکاری نمیشه و همیشه می‌تونی متنش رو دوباره عوض کنی.",
  },
  "site-builder": {
    title: "استودیو ساخت صفحات و لندینگ پیج‌ها",
    badge: "صفحه‌ساز",
    sensitivity: "medium",
    sensitivityLabel: "🟡 نیازمند دقت (طراحی صفحه)",
    whatIsIt: "اگر بخوای برای مناسبتی مثل جشنواره عید یا تخفیف کنکور یک صفحه اختصاصی بسازی، از اینجا مثل پازل تکه‌ها رو کنار هم می‌چینی.",
    whatHappensIfChanged: "می‌تونی صفحات پیش‌نویس بسازی یا صفحه جدیدت رو برای دیدن در سایت منتشر کنی.",
    safetyTip: "اول در حالت «پیش‌نویس» صفحه رو بساز و وقتی ظاهرش رو پسندیدی، دکمه انتشار عمومی رو بزن.",
  },
  "forms-webhooks": {
    title: "فرم‌های ثبت‌نام و دریافت پیام‌ها",
    badge: "فرم‌ساز",
    sensitivity: "safe",
    sensitivityLabel: "🟢 امن و کاربردی",
    whatIsIt: "فرم‌هایی مثل «تماس با ما»، «پیش‌ثبت‌نام همایش» یا پرسشنامه‌ها از اینجا تعریف و مدیریت میشن.",
    whatHappensIfChanged: "سوالاتی که از کاربر پرسیده میشه رو کم یا زیاد می‌کنی و میتونی مشخص کنی جواب‌ها کجا برن.",
    safetyTip: "فیلدهای اجباری رو خیلی زیاد نکن تا زبان‌آموزان خسته نشن و سریع فرم رو پر کنن.",
  },
  seo: {
    title: "بهینه‌سازی برای موتورهای جستجو (گوگل)",
    badge: "سئو و آدرس‌ها",
    sensitivity: "medium",
    sensitivityLabel: "🟡 نیازمند دقت (روی رتبه گوگل اثر دارد)",
    whatIsIt: "اینجا به گوگل می‌گی هر صفحه سایت ما درباره چیه تا وقتی مردم سرچ می‌کنن «کلاس آیلتس»، سایت شما رو صفحه اول بیاره.",
    whatHappensIfChanged: "عنوان و توضیحاتی که در نتایج سرچ گوگل نمایش داده میشه تغییر میکنه. همچنین آدرس‌های قدیمی رو به آدرس‌های جدید وصل میکنه.",
    safetyTip: "آدرس‌های مهم سایت رو الکی تغییر نده تا لینک‌های قدیمی مردم توی گوگل خراب نشه.",
  },
  academics: {
    title: "مدرسه، دوره‌ها و بانک سوالات",
    badge: "آموزش",
    sensitivity: "medium",
    sensitivityLabel: "🟡 نیازمند دقت (مربوط به محتوای آموزشی)",
    whatIsIt: "قفسه کتاب‌ها و دوره‌های شماست! درس‌های پایه‌های دهم، یازدهم، دوازدهم، دوره‌های آیلتس و سوالات تستی اینجا قرار دارن.",
    whatHappensIfChanged: "می‌تونی درس جدید اضافه کنی، قیمت دوره رو تعیین کنی یا سوالات آزمون‌ها رو اصلاح کنی.",
    safetyTip: "اگر دوره‌ای رو غیرفعال کنی، دانش‌آموزان در اون لحظه نمی‌تونن واردش بشن، پس دوره‌هایی که زبان‌آموز فعال دارند رو حذف نکن.",
  },
  "exam-integrity": {
    title: "نظارت بر آزمون‌ها و ضدتقلب",
    badge: "سنجش و آزمون",
    sensitivity: "safe",
    sensitivityLabel: "🟢 امن و نظارتی",
    whatIsIt: "مثل مراقب جلسه امتحانه! نشون میده کیا الان دارن آزمون میدن و آیا کسی تقلب کرده یا از هوش مصنوعی کمک خواسته یا نه.",
    whatHappensIfChanged: "می‌تونی نمرات ثبت‌شده رو بازبینی کنی یا اعتراض دانش‌آموز به تصحیح نمره رو بررسی کنی.",
    safetyTip: "همیشه قبل از رد کردن پاسخ یک دانش‌آموز، بازخورد و فایل صوتی/متنی او رو یک‌بار گوش بده.",
  },
  users: {
    title: "فهرست اعضا و زبان‌آموزان",
    badge: "کاربران",
    sensitivity: "medium",
    sensitivityLabel: "🟡 نیازمند دقت (حساب‌های کاربری مردم)",
    whatIsIt: "دفتر حضور و غیاب کل کاربران سایت! شماره موبایل، نام، نقش (زبان‌آموز یا معلم) و وضعیت ثبت‌نامشون اینجاست.",
    whatHappensIfChanged: "می‌تونی حساب کاربری کسی رو که اذیت کرده موقتاً ببندی یا نقشش رو تغییر بدی.",
    safetyTip: "هیچ کاربری رو بدون دلیل مسدود نکن و اگر حساب کاربری مدیر دیگری رو دیدی، دسترسی او رو تغییر نده.",
  },
  "teacher-verifications": {
    title: "بررسی و تایید معلمان جدید",
    badge: "کارتابل اساتید",
    sensitivity: "safe",
    sensitivityLabel: "🟢 بی‌خطر و مدیریتی",
    whatIsIt: "معلم‌هایی که می‌خوان در سایت شما تدریس کنن، رزومه و ویدیو می‌فرستن؛ شما ویدیو رو می‌بینی و اگر تایید کردی میان داخل سایت.",
    whatHappensIfChanged: "با زدن دکمه «تایید»، معلم اجازه پیدا میکنه دوره بذاره و کلاس خصوصی تعریف کنه.",
    safetyTip: "اگر ویدیو کیفیت نداشت یا مدرکش ناقص بود، گزینه «درخواست اصلاح مدارک» رو بزن تا دوباره بفرسته.",
  },
  "teacher-contracts": {
    title: "قراردادها و درصد سهم معلمان",
    badge: "قراردادها",
    sensitivity: "medium",
    sensitivityLabel: "🟡 نیازمند دقت (روی درصد کارمزد اثر دارد)",
    whatIsIt: "مشخص می‌کنه از هر پولی که دانش‌آموز بابت کلاس میده، چند درصدش سهم سایت شماست و چند درصدش به معلم می‌رسه.",
    whatHappensIfChanged: "درصد کارمزد تدریس یا متن تعهدنامه رسمی اساتید عوض میشه.",
    safetyTip: "قبل از تغییر درصد سهم یک معلم، مطمئن شو که با او به توافق رسیدی تا دلخوری مالی پیش نیاد.",
  },
  support: {
    title: "پشتیبانی و تیکت‌های پاسخ‌نشده",
    badge: "مرکز تماس",
    sensitivity: "safe",
    sensitivityLabel: "🟢 کاملاً امن و ارتباطی",
    whatIsIt: "مثل صندوق پیام‌هاست. اگر دانش‌آموزی تو پرداخت گیر کرده یا سوالی داره پیام میده و شما براش جواب می‌نویسی.",
    whatHappensIfChanged: "پاسخ شما بلافاصله برای کاربر ارسال و پیامک میشه.",
    safetyTip: "سعی کن روزانه دو سه بار به این بخش سر بزنی تا دانش‌آموزها احساس کنن همیشه پشتشون هستی.",
  },
  community: {
    title: "نظرات و تالارهای گفتگوی کاربران",
    badge: "تالار گفتگو",
    sensitivity: "safe",
    sensitivityLabel: "🟢 امن و نظارتی",
    whatIsIt: "جایی که بچه‌ها زیر درس‌ها نظر میذارن و با هم حرف می‌زنن. اگر کسی کلمه نامناسبی بنویسه ربات اول اینجا میاره تا شما ببینی.",
    whatHappensIfChanged: "می‌تونی نظری رو تایید کنی تا همه ببینن، یا اگر توهین‌آمیز بود پاکش کنی.",
    safetyTip: "برای نظرات مفید و قشنگ دکمه «تایید و سنجاق به بالا» رو بزن تا بقیه هم انرژی بگیرن.",
  },
  finance: {
    title: "درآمد، تراکنش‌ها و تسویه‌حساب‌ها",
    badge: "خزانه‌داری",
    sensitivity: "medium",
    sensitivityLabel: "🟡 نیازمند دقت (حساب و کتاب مالی)",
    whatIsIt: "دفتر دخل و خرج سایت! نشون میده امروز، این هفته و این ماه چقدر فروش داشتی و معلمان چقدر طلب دارن.",
    whatHappensIfChanged: "می‌تونی درخواست تسویه حساب معلمان رو ثبت کنی یا رسید واریزی‌ها رو ببینی.",
    safetyTip: "همیشه قبل از زدن دکمه «تسویه انجام شد»، شماره شبای بانکی و نام صاحب حساب رو تطبیق بده.",
  },
  marketing: {
    title: "کدهای تخفیف، بن‌ها و کمپین‌ها",
    badge: "جشنواره‌ها",
    sensitivity: "safe",
    sensitivityLabel: "🟢 امن و رشددهنده",
    whatIsIt: "ابزار جذب مشتری! مثلاً کد تخفیف ۲۰ درصدی به اسم `NOROOZ` می‌سازی تا فروش سایت بالا بره.",
    whatHappensIfChanged: "کاربران هنگام خرید می‌تونن این کد رو بزنن و مبلغ تخفیف از فاکتورشون کم بشه.",
    safetyTip: "حتماً تاریخ انقضا و سقف تعداد برای کدهای تخفیف بذار تا ناخواسته سود سایت صفر نشه.",
  },
  broadcast: {
    title: "ارسال پیامک و اعلانات همگانی",
    badge: "پیام‌رسان",
    sensitivity: "safe",
    sensitivityLabel: "🟢 امن و اطلاع‌رسانی",
    whatIsIt: "بلندگوی سایت! می‌تونی با یک کلیک برای همه دانش‌آموزان یا معلمان پیامک یا اعلان درون‌برنامه‌ای بفرستی.",
    whatHappensIfChanged: "پیامک به گوشی مخاطبانت ارسال میشه و هزینه پیامک از پنل پیامکی کسر میشه.",
    safetyTip: "متن پیامک رو کوتاه و ترغیب‌کننده بنویس و لینک صفحه تخفیف رو آخرش قرار بده.",
  },
  analytics: {
    title: "آمار بازدیدها و تحلیل ثبت‌نام‌ها",
    badge: "نمودارها",
    sensitivity: "safe",
    sensitivityLabel: "🟢 کاملاً بی‌خطر و تحلیلی",
    whatIsIt: "چشم‌انداز و دوربین سایت! بهت میگه امروز چند نفر اومدن تو سایت، کدوم درس پرطرفدارتر بوده و از کدوم شهرها بیشتر اومدن.",
    whatHappensIfChanged: "هیچ تغییری در سایت ایجاد نمیکنه. فقط اطلاعات بهت میده تا تصمیم‌های بهتری بگیری.",
    safetyTip: "صفحاتی که بازدید بالایی دارن رو چک کن و مطمئن شو بنر تخفیف روشون گذاشته شده.",
  },
  "system-ops": {
    title: "عملیات سرور، دیتابیس و تنظیمات حیاتی",
    badge: "منطقه فنی",
    sensitivity: "critical",
    sensitivityLabel: "🔴 فوق‌العاده حساس و پرخطر (خطر از کار افتادن سایت)",
    whatIsIt: "موتورخانه اصلی زیر زمین سایت! شامل پشتیبان‌گیری از کل اطلاعات، حالت تعمیرات (تعطیلی موقت سایت)، تنظیمات پایگاه داده و سرعت حافظه کش.",
    whatHappensIfChanged: "دستکاری اشتباه در این بخش می‌تونه سایت رو کلاً از دسترس خارج کنه، دیتابیس رو به هم بریزه یا اطلاعاتی رو پاک کنه!",
    safetyTip: "اگر اطلاعات مهندسی سرور نداری، به گزینه‌های این بخش اصلاً دست نزن! سیستم به طور خودکار از همه چیز مراقبت میکنه.",
  },
  "ai-engine": {
    title: "مغز هوش مصنوعی و مدل‌های زبانی",
    badge: "هوش مصنوعی",
    sensitivity: "critical",
    sensitivityLabel: "🔴 حساس و پرخطر (اثر مستقیم روی تصحیح نمرات)",
    whatIsIt: "مرکز فرماندهی مغز ربات‌های سایت؛ پرامپت‌ها، لحن صحبت ربات معلم و شیوه تصحیح آزمون‌های مکالمه و رایتینگ آیلتس.",
    whatHappensIfChanged: "اگر متن دستورات هوش مصنوعی اشتباه عوض بشه، ربات ممکنه پاسخ اشتباه به دانش‌آموز بده یا نمره‌ها رو جابجا محاسبه کنه.",
    safetyTip: "دستورات هوش مصنوعی تست‌شده هستند. قبل از تغییر متن پرامپت‌ها، حتماً یک نسخه از متن قبلی کپی بردار.",
  },
  security: {
    title: "دیوار آتش، نشست‌ها و اتاق امنیت",
    badge: "اتاق نگهبانی",
    sensitivity: "critical",
    sensitivityLabel: "🔴 حساس و امنیتی (امکان مسدودسازی دسترسی)",
    whatIsIt: "دربان و نگهبان ۲۴ ساعته سایت! آی‌پی‌های مشکوک رو شناسایی میکنه و از حملات هکرها و ربات‌های مزاحم به سایت جلوگیری میکنه.",
    whatHappensIfChanged: "می‌تونی یک آی‌پی یا فرد مشکوک رو بلاک کنی، اما اگر اشتباهی رنج آی‌پی اشتباهی رو بلاک کنی، کاربران عادی ممکنه نتونن وارد سایت بشن.",
    safetyTip: "تنظیمات فایروال به شکل خودکار روی امن‌ترین حالت قرار داره. فقط در صورت حمله گزارش‌شده آی‌پی متخلف رو مسدود کن.",
  },
};

interface AdminHelpModalProps {
  tab: AdminModuleTab | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminHelpModal({ tab, isOpen, onClose }: AdminHelpModalProps) {
  if (!isOpen || !tab) return null;

  const guide = MODULE_HELP_GUIDES[tab] || {
    title: "راهنمای کاربری این بخش",
    badge: "راهنما",
    sensitivity: "safe",
    sensitivityLabel: "🟢 بی‌خطر",
    whatIsIt: "این بخش برای مدیریت امکانات مختلف سامانه ایندورا طراحی شده است.",
    whatHappensIfChanged: "تنظیمات مربوط به این بخش ذخیره و اجرا خواهد شد.",
    safetyTip: "در صورت وجود ابهام، ابتدا با مطالعه راهنما از اثر تغییرات مطمئن شوید.",
  };

  const getSensitivityClass = () => {
    switch (guide.sensitivity) {
      case "critical":
        return styles.critBadge;
      case "medium":
        return styles.medBadge;
      default:
        return styles.safeBadge;
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.helpIcon}>💡</span>
            <div>
              <h3 className={styles.title}>{guide.title}</h3>
              <span className={styles.badgeLabel}>{guide.badge}</span>
            </div>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} title="بستن راهنما">
            ✕
          </button>
        </div>

        {/* Sensitivity Alert Banner */}
        <div className={`${styles.sensitivityBar} ${getSensitivityClass()}`}>
          <span className={styles.sensitivityIcon}>
            {guide.sensitivity === "critical" ? "🚨" : guide.sensitivity === "medium" ? "⚠️" : "🛡️"}
          </span>
          <div>
            <strong>سطح حساسیت این بخش: </strong>
            <span>{guide.sensitivityLabel}</span>
          </div>
        </div>

        {/* 3 Child-Friendly Explanations */}
        <div className={styles.contentList}>
          {/* 1. What is it? */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardEmoji}>👶</span>
              <h4 className={styles.cardTitle}>این بخش چیه؟ (به زبان خیلی ساده)</h4>
            </div>
            <p className={styles.cardText}>{guide.whatIsIt}</p>
          </div>

          {/* 2. What happens if changed? */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardEmoji}>⚙️</span>
              <h4 className={styles.cardTitle}>اگه دکمه‌هاشو دست بزنم چی میشه؟</h4>
            </div>
            <p className={styles.cardText}>{guide.whatHappensIfChanged}</p>
          </div>

          {/* 3. Safety tip */}
          <div className={`${styles.card} ${styles.safetyCard}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardEmoji}>🛡️</span>
              <h4 className={styles.cardTitle}>چطور بدون خرابکاری و با خیال راحت کار کنم؟</h4>
            </div>
            <p className={styles.cardText}>{guide.safetyTip}</p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={styles.footer}>
          <span className={styles.footerHint}>
            خیالتون راحت، تمام کارهای مهم دارای قابلیت بررسی مجدد هستند.
          </span>
          <button type="button" className={styles.btnGotIt} onClick={onClose}>
            متوجه شدم، بستن
          </button>
        </div>
      </div>
    </div>
  );
}
