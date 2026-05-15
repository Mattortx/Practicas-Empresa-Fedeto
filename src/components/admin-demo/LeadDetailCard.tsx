import { CalendarDays, ClipboardList, ShieldAlert } from "lucide-react";
import type { CommercialLead, LeadStatus } from "../../types/commercialCopilot";
import { Badge, PriorityBadge, StatusBadge } from "../ui/Badge";
import { LeadFamilyBadge } from "./LeadFamilyBadge";

interface LeadDetailCardProps {
  lead?: CommercialLead;
  onStatusChange?: (leadId: string, status: LeadStatus) => void;
}

const statusOptions: Array<{ value: LeadStatus; label: string }> = [
  { value: "nueva", label: "Nueva" },
  { value: "pendiente_revision_tecnica", label: "Pendiente revision tecnica" },
  { value: "pendiente_contacto_comercial", label: "Pendiente contacto comercial" },
  { value: "cerrada_demo", label: "Cerrada en demo" }
];

export function LeadDetailCard({ lead, onStatusChange }: LeadDetailCardProps) {
  if (!lead) {
    return (
      <aside className="lead-detail empty-state">
        <strong>Selecciona una solicitud</strong>
        <p>El detalle mostrara el resumen comercial generado por el copiloto.</p>
      </aside>
    );
  }

  return (
    <aside className="lead-detail">
      <div className="lead-detail-head">
        <div>
          <span>Detalle de solicitud</span>
          <h2>{lead.summary.company}</h2>
        </div>
        <StatusBadge status={lead.status} />
      </div>

      <div className="detail-meta">
        <span>
          <CalendarDays size={16} aria-hidden="true" />
          {new Intl.DateTimeFormat("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          }).format(new Date(lead.createdAt))}
        </span>
        <PriorityBadge priority={lead.priority} />
        <Badge tone={lead.source === "demo" ? "neutral" : "blue"}>
          {lead.source === "demo" ? "Dato simulado" : "Generada por el copiloto"}
        </Badge>
        {lead.technicalRisk && (
          <Badge tone="orange">Revision tecnica necesaria</Badge>
        )}
      </div>

      <label className="status-control">
        <span>Estado de seguimiento</span>
        <select
          value={lead.status}
          onChange={(event) => onStatusChange?.(lead.id, event.target.value as LeadStatus)}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <div className="detail-grid">
        <Info label="Cliente" value={lead.summary.name} />
        <Info label="Empresa" value={lead.summary.company} />
        <Info label="Correo" value={lead.summary.email} />
        <Info label="Telefono" value={lead.summary.phone} />
        <div className="info-pair">
          <span>Familia</span>
          <strong>
            <LeadFamilyBadge familyId={lead.productFamilyId} label={lead.summary.productFamily} />
          </strong>
        </div>
        <Info label="Necesidad" value={lead.summary.needType} />
        <Info label="Urgencia" value={lead.summary.urgency} />
        <Info label="Revision tecnica" value={lead.technicalRisk ? "Si" : "No"} />
        <Info label="Ubicacion" value={lead.summary.location} />
      </div>

      {lead.technicalRisk && (
        <div className="technical-risk-panel">
          <ShieldAlert size={18} aria-hidden="true" />
          <div>
            <strong>Consulta tecnica sensible</strong>
            <p>
              Revisar documentacion, soporte, uso previsto y requisitos aplicables antes de
              responder al cliente.
            </p>
          </div>
        </div>
      )}

      <section className="detail-summary">
        <div className="detail-summary-title">
          <ClipboardList size={18} aria-hidden="true" />
          <strong>Resumen generado por el copiloto</strong>
        </div>
        <pre>{lead.summaryText}</pre>
      </section>
    </aside>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-pair">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
