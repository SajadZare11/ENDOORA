import type { ReactNode } from "react";

export type ToastMessage = {
  id: string;
  title: string;
  message?: ReactNode;
  tone?: "info" | "success" | "warning" | "error";
};

export function ToastRegion({ messages, label = "Notifications" }: { messages: ToastMessage[]; label?: string }) {
  return (
    <section className="endoora-toast-region" aria-label={label} aria-live="polite" aria-relevant="additions text">
      {messages.map((message) => (
        <article key={message.id} className={`endoora-toast endoora-toast--${message.tone ?? "info"}`}>
          <strong>{message.title}</strong>
          {message.message ? <div>{message.message}</div> : null}
        </article>
      ))}
    </section>
  );
}
