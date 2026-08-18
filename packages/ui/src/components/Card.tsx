import type { HTMLAttributes, ReactNode } from "react";

export type CardProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
};

export function Card({ title, description, actions, children, className = "", ...props }: CardProps) {
  return (
    <article className={["endoora-card", className].filter(Boolean).join(" ")} {...props}>
      {(title || description || actions) ? (
        <header className="endoora-card__header">
          <div>
            {title ? <h3 className="endoora-card__title">{title}</h3> : null}
            {description ? <p className="endoora-card__description">{description}</p> : null}
          </div>
          {actions ? <div className="endoora-card__actions">{actions}</div> : null}
        </header>
      ) : null}
      <div className="endoora-card__body">{children}</div>
    </article>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "info" | "success" | "warning" | "error" }) {
  return <span className={`endoora-badge endoora-badge--${tone}`}>{children}</span>;
}
