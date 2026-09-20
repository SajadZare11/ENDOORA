import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ایندورا | درگاهی نو به زبان انگلیسی",
    short_name: "ایندورا | Endoora",
    description: "سیستم آموزش هوشمند، شخصی‌سازی‌شده و سنجش تطبیقی زبان انگلیسی ویژه فارسی‌زبانان",
    start_url: "/",
    display: "standalone",
    background_color: "#0F172A",
    theme_color: "#0B0F19",
    dir: "rtl",
    lang: "fa",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "میز کار زبان‌آموز",
        short_name: "یادگیری",
        description: "دسترسی به ماموریت‌های روزانه و داشبورد زبان‌آموز",
        url: "/dashboard",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "آزمون تعیین سطح",
        short_name: "تعیین سطح",
        description: "شروع یا ادامه آزمون انطباقی تعیین سطح CEFR",
        url: "/placement",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "میز کار مدرس",
        short_name: "مدرس",
        description: "مدیریت کلاس‌ها، زبان‌آموزان و تکالیف",
        url: "/teacher",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "پیش‌نویس‌های آفلاین",
        short_name: "پیش‌نویس‌ها",
        description: "مشاهده و همگام‌سازی پیش‌نویس‌های ذخیره‌شده محلی",
        url: "/account/drafts",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
    categories: ["education", "productivity"],
  };
}
