import type { CommercialLead } from "../../types/commercialCopilot";
import { Badge } from "../ui/Badge";
import { PriorityBadge, StatusBadge } from "./LeadStatusBadge";

interface LeadTableProps {
  leads: CommercialLead[];
  selectedId?: string;
  onSelect: (lead: CommercialLead) => void;
}

export function LeadTable({ leads, selectedId, onSelect }: LeadTableProps) {
  return (
    <div className="lead-table" role="table" aria-label="Solicitudes generadas">
      <div className="lead-table-row lead-table-head" role="row">
        <span>Cliente</span>
        <span>Empresa</span>
        <span>Familia</span>
        <span>Necesidad</span>
        <span>Urgencia</span>
        <span>Prioridad</span>
        <span>Estado</span>
        <span>Revision tecnica</span>
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
          <span>{lead.productFamilyLabel}</span>
          <span>{lead.needType}</span>
          <span>{lead.summary.urgency}</span>
          <span>
            <PriorityBadge priority={lead.priority} />
          </span>
          <span>
            <StatusBadge status={lead.status} />
          </span>
          <span>
            <Badge tone={lead.technicalRisk ? "orange" : "green"}>
              {lead.technicalRisk ? "Si" : "No"}
            </Badge>
          </span>
        </button>
      ))}
    </div>
  );
}
