import {
  AlertTriangle,
  Building2,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  FileText,
  Gauge,
  Mail,
  MessageSquareText,
  Phone,
  ShieldAlert,
  Sparkles,
  UserRound
} from "lucide-react";
import { useState, type ReactNode } from "react";
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
  { value: "calificada", label: "Calificada" },
  { value: "pendiente_contacto_comercial", label: "Pendiente contacto comercial" },
  { value: "pendiente_revision_tecnica", label: "Pendiente revisión técnica" },
  { value: "cerrada_no_oportunidad", label: "Cerrada — no oportunidad" },
  { value: "cerrada_demo", label: "Cerrada en demo" }
];

export function LeadDetailCard({ lead, onStatusChange, onLeadUpdate }: LeadDetailCardProps) {
  const [busyAction, setBusyAction] = useState<"summary" | "reply" | null>(null);
  const [copied, setCopied] = useState<"summary" | "reply" | null>(null);

  if (!lead) {
    return (
      <aside className="lead-detail empty-state lead-detail-empty">
        <ClipboardList size={30} aria-hidden="true" />
        <strong>Selecciona una solicitud</strong>
        <p>El detalle mostrará la ficha comercial generada por el copiloto.</p>
      </aside>
    );
  }

  const createdDate = new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(lead.createdAt));
  const detectedSignals = formatList(lead.summary.detectedSignals, "No indicadas");
  const missingInformation = formatList(lead.summary.missingInformation, "No indicada");
  const technicalFlags = formatList(lead.technicalRiskFlags, "Sin señales técnicas sensibles");
  const aiConfidence = lead.aiClassification
    ? `${Math.round(lead.aiClassification.confidence * 100)}%`
    : "No aplicada";

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
      <div className="lead-detail-accent" aria-hidden="true" />

      <header className="lead-detail-head">
        <div className="lead-detail-title">
          <span>Detalle de solicitud</span>
          <h2>{fallbackText(lead.summary.name)}</h2>
          <p>{fallbackText(lead.summary.company)}</p>
        </div>
        <div className="lead-detail-status-stack">
          <StatusBadge status={lead.status} />
          <PriorityBadge priority={lead.priority} />
        </div>
      </header>

      <div className="detail-meta">
        <span>
          <CalendarDays size={16} aria-hidden="true" />
          {createdDate}
        </span>
        <Badge tone={lead.source === "demo" ? "neutral" : "blue"}>
          {lead.source === "demo" ? "Dato simulado" : "Generada por el copiloto"}
        </Badge>
        {lead.aiClassification && <Badge tone="blue">Clasificación automática</Badge>}
        {lead.aiSummarySource === "ai" && <Badge tone="green">Resumen generado con IA</Badge>}
        {lead.technicalRisk && <Badge tone="orange">Revisión técnica necesaria</Badge>}
      </div>

      <section className="detail-contact-strip" aria-label="Datos principales del cliente">
        <ContactItem icon={<UserRound size={17} />} label="Cliente" value={lead.summary.name} />
        <ContactItem icon={<Building2 size={17} />} label="Empresa" value={lead.summary.company} />
        <ContactItem icon={<Mail size={17} />} label="Correo" value={lead.summary.email} />
        <ContactItem icon={<Phone size={17} />} label="Teléfono" value={lead.summary.phone} />
      </section>

      <section className="detail-panel detail-panel-commercial">
        <div className="detail-section-title">
          <ClipboardList size={18} aria-hidden="true" />
          <div>
            <span>Clasificación comercial</span>
            <strong>{lead.summary.needType}</strong>
          </div>
        </div>

        <div className="detail-grid">
          <Info
            label="Familia"
            value={<LeadFamilyBadge familyId={lead.productFamilyId} label={lead.summary.productFamily} />}
          />
          <Info label="Subcategoría / enfoque" value={lead.summary.subcategory ?? "Por determinar"} />
          <Info label="Tipo de obra" value={lead.summary.workType} />
          <Info label="Ubicación aproximada" value={lead.summary.location} />
          <Info label="Urgencia" value={lead.summary.urgency} />
          <Info label="Revisión técnica" value={lead.technicalRisk ? "Sí" : "No"} />
          <Info label="Señales detectadas" value={detectedSignals} wide />
          <Info label="Datos pendientes" value={missingInformation} wide />
        </div>
      </section>

      <section className="detail-panel detail-panel-tracking">
        <div className="detail-section-title">
          <Gauge size={18} aria-hidden="true" />
          <div>
            <span>Seguimiento interno</span>
            <strong>Estado y acciones de la demo</strong>
          </div>
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
      </section>

      <section className="detail-panel detail-panel-ai">
        <div className="detail-section-title">
          <Sparkles size={18} aria-hidden="true" />
          <div>
            <span>Lectura del copiloto</span>
            <strong>Señales, intención y prudencia técnica</strong>
          </div>
        </div>

        <div className="detail-grid">
          <Info label="Intención IA" value={lead.aiClassification?.intent ?? "No aplicada"} />
          <Info label="Confianza IA" value={aiConfidence} />
          <Info label="Indicadores técnicos" value={technicalFlags} wide />
          <Info
            label="Motivo de clasificación"
            value={lead.summary.classificationReason ?? "Clasificación generada con reglas de demo."}
            wide
          />
        </div>
      </section>

      {lead.technicalRisk && (
        <div className="technical-risk-panel">
          <AlertTriangle size={18} aria-hidden="true" />
          <div>
            <strong>Consulta técnica sensible</strong>
            <p>
              Revisar documentación, soporte, uso previsto y requisitos aplicables antes de
              responder al cliente. El copiloto no confirma normativa, cálculos ni montaje.
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

function ContactItem({
  icon,
  label,
  value
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="detail-contact-item">
      <span aria-hidden="true">{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{fallbackText(value)}</strong>
      </div>
    </div>
  );
}

function Info({ label, value, wide = false }: { label: string; value: ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "info-pair info-pair-wide" : "info-pair"}>
      <span>{label}</span>
      <strong>{typeof value === "string" ? fallbackText(value) : value}</strong>
    </div>
  );
}

function formatList(values: string[] | undefined, fallback: string) {
  return values && values.length > 0 ? values.join(" · ") : fallback;
}

function fallbackText(value: string | undefined) {
  return value?.trim() ? value : "No indicado";
}
