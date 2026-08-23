"use client";

import { useState } from "react";

import EndooraBackground from "@/components/design/EndooraBackground";
import GlassCard from "@/components/design/GlassCard";
import LearnerTwinPreview from "@/components/placement/LearnerTwinPreview";
import PlacementQuestion from "@/components/placement/PlacementQuestion";
import styles from "@/components/placement/placement.module.css";

const questions = [
  { section: "Grammar", question: "She ___ to school every day.", options: ["go", "goes", "going", "gone"] },
  { section: "Vocabulary", question: "A place where you borrow books is a...", options: ["library", "kitchen", "garden", "station"] },
  { section: "Reading", question: "Ali studies English every evening because he wants to travel. Why does Ali study English?", options: ["Travel", "Cooking", "Sports", "Work"] },
];

export function PlacementDemo() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const question = questions[index];

  function next() {
    if (index < questions.length - 1) {
      setIndex(index + 1);
      setSelected("");
      return;
    }

    window.alert("این فقط یک پیش‌نمایش رابط است؛ موتور تعیین سطح در Days 14–17 ساخته می‌شود.");
  }

  return (
    <EndooraBackground>
      <div className={styles.container}>
        <GlassCard>
          <div className={styles.hero}>
            <p>پیش‌نمایش رابط تعیین سطح Endoora</p>
            <h1>مسیر انگلیسی خودت را بشناس</h1>
            <p>این صفحه فقط نمونه رابط است و نتیجه آموزشی یا برآورد سطح تولید نمی‌کند.</p>
          </div>
        </GlassCard>
        <div className={styles.grid}>
          <PlacementQuestion question={question} index={index} total={questions.length} selected={selected} setSelected={setSelected} next={next} />
          <LearnerTwinPreview />
        </div>
      </div>
    </EndooraBackground>
  );
}
