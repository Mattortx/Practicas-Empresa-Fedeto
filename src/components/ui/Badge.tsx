import type { LeadPriority, LeadStatus } from "../../types/commercialCopilot";
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  tone?: "neutral" | "red" | "blue" | "orange" | "green";
}

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function PriorityBadge({ priority }: { priority: LeadPriority }) {
  const tone = priority === "alta" ? "red" : priority === "media" ? "orange" : "blue";
  return <Badge tone={tone}>Prioridad {priority}</Badge>;
}

export function StatusBadge({ status }: { status: LeadStatus }) {
  const labels: Record<LeadStatus, string> = {
    nueva: "Nueva",
    pendiente_revision_tecnica: "Pendiente revision tecnica",
    pendiente_contacto_comercial: "Pendiente contacto comercial",
    cerrada_demo: "Cerrada en demo"
  };

  const tone = status === "pendiente_revision_tecnica" ? "orange" : status === "cerrada_demo" ? "green" : "blue";
  return <Badge tone={tone}>{labels[status]}</Badge>;
}
