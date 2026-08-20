"use client";

import { useState } from "react";

export default function ListeningReadyPage() {
  const [status, setStatus] = useState("آماده بررسی میکروفون");

  async function checkMicrophone() {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setStatus("میکروفون آماده است");
    } catch {
      setStatus("اجازه میکروفون داده نشد. می‌توانید بعداً ادامه دهید.");
    }
  }

  return (
    <main dir="rtl" className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">بخش شنیداری و تعامل متنی</h1>
      <p className="mt-4">{status}</p>
      <button className="mt-6 rounded bg-blue-600 px-5 py-3 text-white" onClick={checkMicrophone}>
        بررسی میکروفون
      </button>
    </main>
  );
}
