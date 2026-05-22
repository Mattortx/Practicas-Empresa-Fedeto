import type { CommercialLead } from "../../types/commercialCopilot";
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
      <div className="lead-list lead-list-empty">
        <strong>No hay solicitudes para este filtro</strong>
        <p>Cuando el copiloto genere nuevas solicitudes, aparecerán en esta lista.</p>
      </div>
    );
  }

  return (
    <div className="lead-list" role="listbox" aria-label="Solicitudes generadas">
      {leads.map((lead) => {
        const isSelected = lead.id === selectedId;

        return (
          <button
            className={`lead-list-row ${isSelected ? "lead-list-row-active" : ""}`}
            key={lead.id}
            type="button"
            onClick={() => onSelect(lead)}
            role="option"
            aria-selected={isSelected}
          >
            <span className="lead-list-main">
              <strong>{lead.summary.name || "Sin nombre"}</strong>
              <span className="lead-list-company">{lead.summary.company || "Sin empresa"}</span>
            </span>

            <span className="lead-list-badges">
              <LeadFamilyBadge familyId={lead.productFamilyId} label={lead.summary.productFamily} />
              <PriorityBadge priority={lead.priority} />
              <StatusBadge status={lead.status} />
            </span>

            <span className="lead-list-date">
              {new Intl.DateTimeFormat("es-ES", {
                day: "2-digit",
                month: "2-digit"
              }).format(new Date(lead.createdAt))}
            </span>
          </button>
        );
      })}
    </div>
  );
}
