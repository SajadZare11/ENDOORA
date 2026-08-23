"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { Button, IconButton } from "./Button";

export type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  closeLabel?: string;
  variant?: "dialog" | "drawer";
};

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  closeLabel = "Close",
  variant = "dialog",
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;

    if (open && !node.open) {
      previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      node.showModal();
      window.requestAnimationFrame(() => {
        const firstFocusable = node.querySelector<HTMLElement>(
          "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])",
        );
        firstFocusable?.focus();
      });
    } else if (!open && node.open) {
      node.close();
    }
  }, [open]);

  function close() {
    onOpenChange(false);
    window.requestAnimationFrame(() => previousFocusRef.current?.focus());
  }

  return (
    <dialog
      ref={dialogRef}
      className={`endoora-dialog ${variant === "drawer" ? "endoora-dialog--drawer" : ""}`}
      aria-labelledby={titleId}
      aria-modal="true"
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          close();
        }
      }}
      onClose={() => {
        if (open) onOpenChange(false);
        previousFocusRef.current?.focus();
      }}
    >
      <div className="endoora-dialog__surface">
        <header className="endoora-dialog__header">
          <div>
            <h2 id={titleId} className="text-section-title">{title}</h2>
            {description ? <p id={descriptionId} className="endoora-dialog__description">{description}</p> : null}
          </div>
          <IconButton label={closeLabel} variant="tertiary" icon={<span aria-hidden="true">×</span>} onClick={close} />
        </header>
        <div className="endoora-dialog__body">{children}</div>
        {footer ? <footer className="endoora-dialog__footer">{footer}</footer> : null}
      </div>
    </dialog>
  );
}

export function Drawer(props: Omit<DialogProps, "variant">) {
  return <Dialog {...props} variant="drawer" />;
}

export function DialogActions({ onCancel, onConfirm, cancelLabel = "Cancel", confirmLabel = "Confirm" }: {
  onCancel: () => void;
  onConfirm: () => void;
  cancelLabel?: string;
  confirmLabel?: string;
}) {
  return (
    <div className="endoora-dialog-actions">
      <Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
      <Button onClick={onConfirm}>{confirmLabel}</Button>
    </div>
  );
}
