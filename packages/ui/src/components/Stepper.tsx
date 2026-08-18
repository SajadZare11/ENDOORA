"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Button } from "./Button";

export type StepDefinition = {
  id: string;
  title: string;
  description?: string;
  content: ReactNode;
};

export type ResumableStepperProps = {
  steps: StepDefinition[];
  storageKey: string;
  onSave?: (stepId: string) => void;
  onCancel?: () => void;
  onComplete?: () => void;
  saveLabel?: string;
};

export function ResumableStepper({ steps, storageKey, onSave, onCancel, onComplete, saveLabel = "Save and continue later" }: ResumableStepperProps) {
  const [index, setIndex] = useState(0);
  const [restored, setRestored] = useState(false);
  const active = steps[index];

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      const savedIndex = steps.findIndex((step) => step.id === saved);
      if (savedIndex >= 0) setIndex(savedIndex);
    }
    setRestored(true);
  }, [steps, storageKey]);

  useEffect(() => {
    if (restored && active) window.localStorage.setItem(storageKey, active.id);
  }, [active, restored, storageKey]);

  const statusText = useMemo(() => `Step ${index + 1} of ${steps.length}`, [index, steps.length]);
  if (!active) return null;

  function save() {
    window.localStorage.setItem(storageKey, active.id);
    onSave?.(active.id);
  }

  function cancel() {
    onCancel?.();
  }

  function next() {
    if (index >= steps.length - 1) {
      window.localStorage.removeItem(storageKey);
      onComplete?.();
      return;
    }
    setIndex((current) => current + 1);
  }

  return (
    <section className="endoora-stepper" aria-labelledby={`${storageKey}-step-title`}>
      <div className="endoora-stepper__status" aria-live="polite">
        <span>{statusText}</span>
        {restored ? <span className="endoora-stepper__saved">Progress is saved on this device.</span> : null}
      </div>
      <ol className="endoora-stepper__list" aria-label="Progress">
        {steps.map((step, stepIndex) => (
          <li key={step.id} data-state={stepIndex === index ? "current" : stepIndex < index ? "complete" : "upcoming"}>
            <span aria-hidden="true">{stepIndex + 1}</span>
            <span>{step.title}</span>
          </li>
        ))}
      </ol>
      <div className="endoora-stepper__content">
        <h3 id={`${storageKey}-step-title`} className="text-card-title">{active.title}</h3>
        {active.description ? <p className="endoora-stepper__description">{active.description}</p> : null}
        {active.content}
      </div>
      <div className="endoora-stepper__actions">
        <Button variant="tertiary" onClick={cancel}>Cancel</Button>
        <Button variant="secondary" onClick={save}>{saveLabel}</Button>
        <div className="endoora-stepper__advance">
          <Button variant="secondary" disabled={index === 0} onClick={() => setIndex((current) => Math.max(0, current - 1))}>Back</Button>
          <Button onClick={next}>{index === steps.length - 1 ? "Complete" : "Continue"}</Button>
        </div>
      </div>
    </section>
  );
}
