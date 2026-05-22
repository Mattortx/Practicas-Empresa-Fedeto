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
    calificada: "Calificada",
    pendiente_contacto_comercial: "Pendiente contacto comercial",
    pendiente_revision_tecnica: "Pendiente revisión técnica",
    cerrada_demo: "Cerrada en demo",
    cerrada_no_oportunidad: "Cerrada"
  };

  const tone = status === "pendiente_revision_tecnica" ? "orange" : status === "cerrada_demo" || status === "cerrada_no_oportunidad" ? "green" : "blue";
  return <Badge tone={tone}>{labels[status]}</Badge>;
}
