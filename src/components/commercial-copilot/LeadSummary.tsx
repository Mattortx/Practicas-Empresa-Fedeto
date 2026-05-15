import { Clipboard, ExternalLink, Mail } from "lucide-react";
import type { CommercialLead } from "../../types/commercialCopilot";
import { PriorityBadge } from "../ui/Badge";

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
          <span>Resumen comercial</span>
          <strong>{lead.productFamilyLabel}</strong>
        </div>
        <PriorityBadge priority={lead.priority} />
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
