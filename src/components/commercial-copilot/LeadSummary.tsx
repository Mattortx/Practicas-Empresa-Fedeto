import { Clipboard, ExternalLink, Mail } from "lucide-react";
import type { CommercialLead } from "../../types/commercialCopilot";
import { Badge, PriorityBadge } from "../ui/Badge";

interface LeadSummaryProps {
  lead: CommercialLead;
  onCopy: (text: string) => void;
}

export function LeadSummary({ lead, onCopy }: LeadSummaryProps) {
  const mailHref = `mailto:info@proteccionestoledo.com?subject=${encodeURIComponent(
    "Solicitud comercial desde copiloto web"
  )}&body=${encodeURIComponent(lead.summaryText)}`;

  return (
    <section className="lead-summary-card" aria-label="Resumen comercial generado">
      <div className="lead-summary-head">
        <div>
          <span>Solicitud preparada</span>
          <strong>{lead.productFamilyLabel}</strong>
        </div>
        <div className="lead-summary-badges">
          <PriorityBadge priority={lead.priority} />
          <Badge tone={lead.technicalRisk ? "orange" : "green"}>
            {lead.technicalRisk ? "Revisión técnica necesaria" : "Consulta comercial"}
          </Badge>
        </div>
      </div>
      <div className="lead-summary-highlights">
        <div>
          <span>Cliente</span>
          <strong>{lead.summary.name}</strong>
        </div>
        <div>
          <span>Empresa</span>
          <strong>{lead.summary.company}</strong>
        </div>
        <div>
          <span>Urgencia</span>
          <strong>{lead.summary.urgency}</strong>
        </div>
        <div>
          <span>Enfoque</span>
          <strong>{lead.summary.subcategory ?? "Por determinar"}</strong>
        </div>
        <div>
          <span>Siguiente acción</span>
          <strong>{lead.summary.nextAction}</strong>
        </div>
      </div>
      <pre>{lead.summaryText}</pre>
      <div className="summary-toolbar">
        <button type="button" onClick={() => onCopy(lead.summaryText)} title="Copiar resumen">
          <Clipboard size={17} aria-hidden="true" />
          Copiar
        </button>
        <a href={mailHref} title="Abrir correo">
          <Mail size={17} aria-hidden="true" />
          Correo
        </a>
        <a href="/admin-demo" title="Ver en panel interno">
          <ExternalLink size={17} aria-hidden="true" />
          Ver panel
        </a>
      </div>
    </section>
  );
}
