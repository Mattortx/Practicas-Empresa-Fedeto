import { getProductFamily } from "../data/productFamilies";
import type {
  CommercialLead,
  ConversationFlow,
  LeadDraft,
  LeadSummary,
  ProductFamilyId,
  TechnicalRiskFlag
} from "../types/commercialCopilot";
import { calculateLeadPriority } from "./leadScoring";

export function buildCommercialLead(
  draft: LeadDraft,
  flow: ConversationFlow,
  technicalRiskFlags: TechnicalRiskFlag[]
): CommercialLead {
  const productFamilyId = resolveProductFamilyId(draft, flow);
  const productFamily = getProductFamily(productFamilyId);
  const technicalRisk = Boolean(flow.technicalReviewRequired || technicalRiskFlags.length > 0);
  const priority = calculateLeadPriority(draft, productFamilyId, technicalRisk);
  const warnings = Array.from(
    new Set([
      ...flow.defaultWarnings,
      ...(technicalRisk
        ? [
            "Consulta marcada para revision tecnica antes de confirmar solucion, normativa o documentacion."
          ]
        : [])
    ])
  );

  const summary: LeadSummary = {
    name: value(draft.name),
    company: value(draft.company),
    email: value(draft.email),
    phone: value(draft.phone),
    needType: value(draft.needType, flow.needType),
    productFamily: productFamily?.label ?? value(draft.productFamily, "Por determinar"),
    workType: value(draft.workType, value(draft.project, "No indicado")),
    location: value(draft.location),
    urgency: value(draft.urgency),
    observations: buildObservations(draft),
    priority,
    nextAction: flow.nextAction,
    technicalWarnings: warnings
  };

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: technicalRisk ? "pendiente_revision_tecnica" : "pendiente_contacto_comercial",
    priority,
    technicalRisk,
    technicalRiskFlags,
    productFamilyId,
    productFamilyLabel: summary.productFamily,
    needType: summary.needType,
    summary,
    summaryText: formatLeadSummary(summary),
    source: "local"
  };
}

export function formatLeadSummary(summary: LeadSummary): string {
  return [
    `- Nombre: ${summary.name}`,
    `- Empresa: ${summary.company}`,
    `- Correo: ${summary.email}`,
    `- Telefono: ${summary.phone}`,
    `- Tipo de necesidad: ${summary.needType}`,
    `- Familia de producto: ${summary.productFamily}`,
    `- Tipo de obra: ${summary.workType}`,
    `- Ubicacion aproximada: ${summary.location}`,
    `- Urgencia: ${summary.urgency}`,
    `- Observaciones: ${summary.observations}`,
    `- Nivel de prioridad: ${summary.priority}`,
    `- Recomendacion de siguiente accion: ${summary.nextAction}`,
    `- Advertencias tecnicas: ${summary.technicalWarnings.join(" ")}`
  ].join("\n");
}

function buildObservations(draft: LeadDraft): string {
  const details = [
    draft.observations,
    draft.supportType ? `Soporte: ${draft.supportType}` : "",
    draft.canDrill ? `Fijacion/perforacion: ${draft.canDrill}` : "",
    draft.approximateLength ? `Longitud aproximada: ${draft.approximateLength}` : "",
    draft.quantity ? `Cantidad: ${draft.quantity}` : "",
    draft.environment ? `Entorno: ${draft.environment}` : "",
    draft.customProblem ? `Problema: ${draft.customProblem}` : "",
    draft.documentationAvailable ? `Documentacion disponible: ${draft.documentationAvailable}` : "",
    draft.expectedDeadline ? `Plazo: ${draft.expectedDeadline}` : "",
    draft.riskLocation ? `Zona de riesgo: ${draft.riskLocation}` : "",
    draft.solutionDuration ? `Duracion prevista: ${draft.solutionDuration}` : "",
    draft.commercialGoal ? `Objetivo comercial: ${draft.commercialGoal}` : ""
  ].filter(Boolean);

  return details.length > 0 ? details.join(" | ") : "No indicado";
}

function resolveProductFamilyId(draft: LeadDraft, flow: ConversationFlow): ProductFamilyId | undefined {
  if (flow.productFamily) {
    return flow.productFamily;
  }

  const normalized = `${draft.productFamily ?? ""} ${draft.solutionDuration ?? ""} ${
    draft.riskLocation ?? ""
  } ${draft.customProblem ?? ""}`.toLowerCase();

  if (normalized.includes("permanente") || normalized.includes("cubierta") || normalized.includes("terraza")) {
    return "definitiva";
  }

  if (normalized.includes("temporal") || normalized.includes("forjado") || normalized.includes("obra")) {
    return "provisional";
  }

  if (normalized.includes("base") || normalized.includes("casquillo")) {
    return "bases-casquillos";
  }

  if (normalized.includes("consumible") || normalized.includes("recambio")) {
    return "consumibles";
  }

  if (normalized.includes("medida") || normalized.includes("especial")) {
    return "medida";
  }

  return undefined;
}

function value(valueToCheck: string | undefined, fallback = "No indicado") {
  return valueToCheck?.trim() || fallback;
}
