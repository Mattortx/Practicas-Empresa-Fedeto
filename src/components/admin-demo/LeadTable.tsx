import type { CommercialLead } from "../../types/commercialCopilot";
import { Badge } from "../ui/Badge";
import { LeadFamilyBadge } from "./LeadFamilyBadge";
import { PriorityBadge, StatusBadge } from "./LeadStatusBadge";

interface LeadTableProps {
  leads: CommercialLead[];
  selectedId?: string;
  onSelect: (lead: CommercialLead) => void;
}

export function LeadTable({ leads, selectedId, onSelect }: LeadTableProps) {
  if (leads.length === 0) {
    return (
      <div className="lead-table lead-table-empty">
        <strong>No hay solicitudes para este filtro</strong>
        <p>Cuando el copiloto genere nuevas solicitudes, apareceran en este panel de demo.</p>
      </div>
    );
  }

  return (
    <div className="lead-table" role="table" aria-label="Solicitudes generadas">
      <div className="lead-table-row lead-table-head" role="row">
        <span>Cliente</span>
        <span>Empresa</span>
        <span>Correo</span>
        <span>Teléfono</span>
        <span>Familia</span>
        <span>Necesidad</span>
        <span>Ubicación</span>
        <span>Urgencia</span>
        <span>Prioridad</span>
        <span>Estado</span>
        <span>Revisión técnica</span>
        <span>Fecha</span>
      </div>
      {leads.map((lead) => (
        <button
          className={`lead-table-row ${lead.id === selectedId ? "lead-table-row-active" : ""}`}
          key={lead.id}
          type="button"
          onClick={() => onSelect(lead)}
          role="row"
        >
          <span>
            <strong>{lead.summary.name}</strong>
          </span>
          <span>{lead.summary.company}</span>
          <span>{lead.summary.email}</span>
          <span>{lead.summary.phone}</span>
          <span>
            <LeadFamilyBadge familyId={lead.productFamilyId} label={lead.productFamilyLabel} />
          </span>
          <span>{lead.needType}</span>
          <span>{lead.summary.location}</span>
          <span>{lead.summary.urgency}</span>
          <span>
            <PriorityBadge priority={lead.priority} />
          </span>
          <span>
            <StatusBadge status={lead.status} />
          </span>
          <span>
            <Badge tone={lead.technicalRisk ? "orange" : "green"}>
              {lead.technicalRisk ? "Sí" : "No"}
            </Badge>
          </span>
          <span>
            {new Intl.DateTimeFormat("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric"
            }).format(new Date(lead.createdAt))}
          </span>
        </button>
      ))}
    </div>
  );
}
