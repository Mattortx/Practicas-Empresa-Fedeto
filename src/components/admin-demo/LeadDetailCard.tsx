import { CalendarDays, ClipboardList, ShieldAlert } from "lucide-react";
import type { CommercialLead } from "../../types/commercialCopilot";
import { Badge, PriorityBadge, StatusBadge } from "../ui/Badge";

interface LeadDetailCardProps {
  lead?: CommercialLead;
}

export function LeadDetailCard({ lead }: LeadDetailCardProps) {
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
        {lead.technicalRisk && (
          <Badge tone="orange">Revision tecnica necesaria</Badge>
        )}
      </div>

      <div className="detail-grid">
        <Info label="Cliente" value={lead.summary.name} />
        <Info label="Correo" value={lead.summary.email} />
        <Info label="Telefono" value={lead.summary.phone} />
        <Info label="Familia" value={lead.summary.productFamily} />
        <Info label="Necesidad" value={lead.summary.needType} />
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
