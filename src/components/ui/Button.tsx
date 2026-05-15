import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
}

export function Button({ children, className = "", variant = "secondary", ...props }: ButtonProps) {
  return (
    <button className={`button button-${variant} ${className}`.trim()} type="button" {...props}>
      {children}
    </button>
  );
}
