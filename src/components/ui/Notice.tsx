import type { ReactNode } from "react";

export function Notice({ children, tone = "warning" }: { children: ReactNode; tone?: "warning" | "info" }) {
  return <div className={`notice notice-${tone}`}>{children}</div>;
}
