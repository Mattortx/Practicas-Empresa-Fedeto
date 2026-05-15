import type { CommercialLead } from "../../types/commercialCopilot";
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
        <span>Familia</span>
        <span>Urgencia</span>
        <span>Estado</span>
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
            <small>{lead.summary.company}</small>
          </span>
          <span>{lead.productFamilyLabel}</span>
          <span>
            <PriorityBadge priority={lead.priority} />
          </span>
          <span>
            <StatusBadge status={lead.status} />
          </span>
        </button>
      ))}
    </div>
  );
}
