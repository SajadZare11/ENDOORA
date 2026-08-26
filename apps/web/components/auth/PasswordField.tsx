"use client";

import { useState, type InputHTMLAttributes } from "react";

import styles from "./auth.module.css";

type PasswordFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  showLabel: string;
  hideLabel: string;
  error?: string;
  help?: string;
};

function EyeIcon({ hidden }: { hidden: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.6" />
      {hidden ? <path d="m4 4 16 16" /> : null}
    </svg>
  );
}

export function PasswordField({
  id,
  label,
  showLabel,
  hideLabel,
  error,
  help,
  className = "",
  ...inputProps
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const helpId = help ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="endoora-field">
      <label className="endoora-field__label" htmlFor={id}>{label}</label>
      <div className={styles.passwordWrap}>
        <input
          {...inputProps}
          id={id}
          type={visible ? "text" : "password"}
          className={`endoora-input ${styles.ltrInput} ${className} ${error ? "endoora-input--error" : ""}`}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={errorId ?? helpId}
        />
        <button
          type="button"
          className={styles.passwordToggle}
          aria-label={visible ? hideLabel : showLabel}
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
        >
          <EyeIcon hidden={visible} />
        </button>
      </div>
      {error ? (
        <p id={errorId} className="endoora-field__error">{error}</p>
      ) : help ? (
        <p id={helpId} className="endoora-field__help">{help}</p>
      ) : null}
    </div>
  );
}
