"use client";

import { useState } from "react";

const questions = [
  {
    id: 1,
    section: "Grammar",
    question: "She ___ to school every day.",
    options: ["go", "goes", "going", "gone"],
    answer: "goes",
  },
  {
    id: 2,
    section: "Vocabulary",
    question: "A place where you borrow books is a...",
    options: ["library", "kitchen", "garden", "station"],
    answer: "library",
  },
  {
    id: 3,
    section: "Reading",
    question:
      "Ali studies English every evening because he wants to travel. Why does Ali study English?",
    options: ["Travel", "Cooking", "Sports", "Work"],
    answer: "Travel",
  },
];

export default function PlacementPage() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);

  const question = questions[current];

  function nextQuestion() {
    const updated = [...answers];
    updated[current] = selected;
    setAnswers(updated);

    setSelected("");

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      console.log("Finished:", updated);
      alert("آزمون تمام شد");
    }
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen p-8 text-right"
    >
      <h1 className="text-3xl font-bold mb-4">
        آزمون تعیین سطح Endoora
      </h1>

      <p className="mb-8">
        بخش {question.section}
      </p>

      <div className="border rounded-xl p-6 max-w-2xl">
        <h2 className="text-xl mb-6">
          سوال {current + 1} از {questions.length}
        </h2>

        <p
          dir={
            question.section === "Reading" ||
            question.section === "Vocabulary" ||
            question.section === "Grammar"
              ? "ltr"
              : "rtl"
          }
          className="mb-6 text-lg"
        >
          {question.question}
        </p>

        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => setSelected(option)}
              className={`block w-full border rounded-lg p-3 text-right ${
                selected === option
                  ? "border-blue-600 bg-blue-50"
                  : ""
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <button
          disabled={!selected}
          onClick={nextQuestion}
          className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
        >
          {current === questions.length - 1
            ? "پایان آزمون"
            : "سوال بعدی"}
        </button>
      </div>
    </main>
  );
}
