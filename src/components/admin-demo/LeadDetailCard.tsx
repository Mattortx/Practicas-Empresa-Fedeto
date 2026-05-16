import { CalendarDays, ClipboardCheck, ClipboardList, FileText, MessageSquareText, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { generateCommercialReplyWithAi } from "../../services/ai/generateCommercialReply";
import { summarizeLeadWithAi } from "../../services/ai/summarizeLead";
import type { CommercialLead, LeadStatus } from "../../types/commercialCopilot";
import { logDemoEvent } from "../../utils/demoEvents";
import { Badge, PriorityBadge, StatusBadge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { LeadFamilyBadge } from "./LeadFamilyBadge";

interface LeadDetailCardProps {
  lead?: CommercialLead;
  onStatusChange?: (leadId: string, status: LeadStatus) => void;
  onLeadUpdate?: (lead: CommercialLead) => void;
}

const statusOptions: Array<{ value: LeadStatus; label: string }> = [
  { value: "nueva", label: "Nueva" },
  { value: "pendiente_revision_tecnica", label: "Pendiente revisión técnica" },
  { value: "pendiente_contacto_comercial", label: "Pendiente contacto comercial" },
  { value: "cerrada_demo", label: "Cerrada en demo" }
];

export function LeadDetailCard({ lead, onStatusChange, onLeadUpdate }: LeadDetailCardProps) {
  const [busyAction, setBusyAction] = useState<"summary" | "reply" | null>(null);
  const [copied, setCopied] = useState<"summary" | "reply" | null>(null);

  if (!lead) {
    return (
      <aside className="lead-detail empty-state">
        <strong>Selecciona una solicitud</strong>
        <p>El detalle mostrara el resumen comercial generado por el copiloto.</p>
      </aside>
    );
  }

  async function generateAiSummary() {
    if (!lead) {
      return;
    }

    setBusyAction("summary");
    const result = await summarizeLeadWithAi(lead);
    const updatedLead: CommercialLead = {
      ...lead,
      aiSummary: result.data,
      aiSummarySource: result.available ? "ai" : "local",
      aiGeneratedAt: result.available ? new Date().toISOString() : lead.aiGeneratedAt
    };
    onLeadUpdate?.(updatedLead);
    setBusyAction(null);
  }

  async function generateReply() {
    if (!lead) {
      return;
    }

    setBusyAction("reply");
    const result = await generateCommercialReplyWithAi(lead);
    const updatedLead: CommercialLead = {
      ...lead,
      aiCommercialReply: result.data,
      aiGeneratedAt: result.available ? new Date().toISOString() : lead.aiGeneratedAt
    };
    onLeadUpdate?.(updatedLead);
    logDemoEvent(result.available ? "resumen_generado" : "fallback_activado", {
      leadId: lead.id,
      action: "commercial_reply",
      mode: result.mode
    });
    setBusyAction(null);
  }

  function markTechnicalReview() {
    if (!lead) {
      return;
    }

    const updatedLead: CommercialLead = {
      ...lead,
      technicalRisk: true,
      technicalRiskFlags: Array.from(new Set([...lead.technicalRiskFlags, "documentacion_tecnica"])),
      status: "pendiente_revision_tecnica",
      summary: {
        ...lead.summary,
        requiresTechnicalReview: true
      }
    };
    onLeadUpdate?.(updatedLead);
  }

  async function copyToClipboard(type: "summary" | "reply", text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    window.setTimeout(() => setCopied(null), 1600);
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
        {lead.aiClassification && <Badge tone="blue">Clasificación automática</Badge>}
        {lead.aiSummarySource === "ai" && <Badge tone="green">Resumen generado con IA</Badge>}
        {lead.technicalRisk && (
          <Badge tone="orange">Revisión técnica necesaria</Badge>
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

      <div className="ai-action-panel">
        <Button variant="secondary" onClick={generateAiSummary} disabled={busyAction === "summary"}>
          <FileText size={16} aria-hidden="true" />
          {busyAction === "summary" ? "Generando..." : "Generar resumen con IA"}
        </Button>
        <Button variant="secondary" onClick={generateReply} disabled={busyAction === "reply"}>
          <MessageSquareText size={16} aria-hidden="true" />
          {busyAction === "reply" ? "Preparando..." : "Generar borrador"}
        </Button>
        <Button variant="ghost" onClick={markTechnicalReview}>
          <ShieldAlert size={16} aria-hidden="true" />
          Marcar revisión técnica
        </Button>
      </div>

      <div className="detail-grid">
        <Info label="Cliente" value={lead.summary.name} />
        <Info label="Empresa" value={lead.summary.company} />
        <Info label="Correo" value={lead.summary.email} />
        <Info label="Teléfono" value={lead.summary.phone} />
        <div className="info-pair">
          <span>Familia</span>
          <strong>
            <LeadFamilyBadge familyId={lead.productFamilyId} label={lead.summary.productFamily} />
          </strong>
        </div>
        <Info label="Subcategoría / enfoque" value={lead.summary.subcategory ?? "Por determinar"} />
        <Info label="Necesidad" value={lead.summary.needType} />
        <Info label="Urgencia" value={lead.summary.urgency} />
        <Info label="Revisión técnica" value={lead.technicalRisk ? "Sí" : "No"} />
        <Info label="Ubicación" value={lead.summary.location} />
        <Info
          label="Señales detectadas"
          value={
            lead.summary.detectedSignals && lead.summary.detectedSignals.length > 0
              ? lead.summary.detectedSignals.join(" | ")
              : "No indicadas"
          }
        />
        <Info
          label="Datos pendientes"
          value={
            lead.summary.missingInformation && lead.summary.missingInformation.length > 0
              ? lead.summary.missingInformation.join(", ")
              : "No indicados"
          }
        />
        {lead.aiClassification && (
          <>
            <Info label="Intencion IA" value={lead.aiClassification.intent} />
            <Info label="Confianza IA" value={`${Math.round(lead.aiClassification.confidence * 100)}%`} />
          </>
        )}
      </div>

      {lead.summary.classificationReason && (
        <section className="classification-reason-card">
          <strong>Lectura comercial del copiloto</strong>
          <p>{lead.summary.classificationReason}</p>
        </section>
      )}

      {lead.technicalRisk && (
        <div className="technical-risk-panel">
          <ShieldAlert size={18} aria-hidden="true" />
          <div>
            <strong>Consulta técnica sensible</strong>
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
          <button
            className="icon-copy-button"
            type="button"
            onClick={() => copyToClipboard("summary", lead.summaryText)}
          >
            <ClipboardCheck size={15} aria-hidden="true" />
            {copied === "summary" ? "Copiado" : "Copiar"}
          </button>
        </div>
        <pre>{lead.summaryText}</pre>
      </section>

      {lead.aiSummary && (
        <section className="ai-insight-card">
          <strong>{lead.aiSummary.title}</strong>
          <p>{lead.aiSummary.commercialSummary}</p>
          <dl>
            <div>
              <dt>Notas técnicas</dt>
              <dd>{lead.aiSummary.technicalNotes}</dd>
            </div>
            <div>
              <dt>Datos pendientes</dt>
              <dd>
                {lead.aiSummary.missingInformation.length > 0
                  ? lead.aiSummary.missingInformation.join(", ")
                  : "No indicados"}
              </dd>
            </div>
            <div>
              <dt>Siguiente acción</dt>
              <dd>{lead.aiSummary.recommendedNextAction}</dd>
            </div>
            <div>
              <dt>Motivo de prioridad</dt>
              <dd>{lead.aiSummary.priorityReason}</dd>
            </div>
          </dl>
        </section>
      )}

      {lead.aiCommercialReply && (
        <section className="ai-insight-card">
          <div className="detail-summary-title">
            <strong>Borrador de respuesta comercial</strong>
            <button
              className="icon-copy-button"
              type="button"
              onClick={() => copyToClipboard("reply", lead.aiCommercialReply?.commercialReply ?? "")}
            >
              <ClipboardCheck size={15} aria-hidden="true" />
              {copied === "reply" ? "Copiado" : "Copiar respuesta"}
            </button>
          </div>
          <p>{lead.aiCommercialReply.commercialReply}</p>
          <Badge tone={lead.aiCommercialReply.requiresTechnicalReview ? "orange" : "blue"}>
            {lead.aiCommercialReply.suggestedTag}
          </Badge>
        </section>
      )}
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
