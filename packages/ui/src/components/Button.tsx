import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "destructive";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

export function Button({
  variant = "primary",
  loading = false,
  leadingIcon,
  trailingIcon,
  children,
  className = "",
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = ["endoora-button", `endoora-button--${variant}`, className].filter(Boolean).join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <span className="endoora-spinner" aria-hidden="true" /> : leadingIcon}
      <span>{children}</span>
      {!loading && trailingIcon}
    </button>
  );
}

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  icon: ReactNode;
  variant?: ButtonVariant;
};

export function IconButton({ label, icon, variant = "tertiary", className = "", type = "button", ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      className={["endoora-icon-button", `endoora-button--${variant}`, className].filter(Boolean).join(" ")}
      aria-label={label}
      title={label}
      {...props}
    >
      {icon}
    </button>
  );
}
