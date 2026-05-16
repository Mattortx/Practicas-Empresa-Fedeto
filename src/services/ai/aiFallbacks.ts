import { classifyFamilyFromText } from "../../data/productFamilies";
import {
  getCommercialResponse,
  getFamilyNextQuestion,
  getFamilyOrientationResponse,
  getTechnicalSensitiveReply
} from "../../data/responseLibrary";
import type {
  AICommercialReply,
  AIFaqAnswer,
  AILeadClassification,
  AILeadSummary,
  AIProductFamily,
  AITechnicalRiskResult
} from "../../types/ai";
import type { CommercialLead } from "../../types/commercialCopilot";
import { detectTechnicalRisk } from "../../utils/technicalRisk";

export function localClassifyLead(message: string): AILeadClassification {
  const technicalFlags = detectTechnicalRisk(message);
  const family = mapLocalFamily(classifyFamilyFromText(message)?.id);
  const requiresTechnicalReview = technicalFlags.length > 0 || hasPromptInjection(message);

  return {
    family: hasPromptInjection(message) || (requiresTechnicalReview && family === "desconocida")
      ? "documentacion_normativa"
      : family,
    needType: resolveNeedType(family),
    confidence: family === "desconocida" ? 0.25 : 0.62,
    priority: requiresTechnicalReview ? "alta" : "media",
    requiresTechnicalReview,
    missingFields: ["ubicación aproximada", "urgencia", "datos de contacto"],
    suggestedNextQuestion: requiresTechnicalReview
      ? "Puede indicar el producto o sistema sobre el que necesita documentación?"
      : getFamilyNextQuestion(family, message),
    suggestedReply: requiresTechnicalReview
      ? getTechnicalSensitiveReply(technicalFlags)
      : getFamilyOrientationResponse(family, message),
    safetyWarning: requiresTechnicalReview ? "Revisión técnica necesaria antes de confirmar solución." : null,
    intent: requiresTechnicalReview ? "soporte_tecnico" : "pedir_informacion_producto",
    extractedData: {
      productFamily: family,
      needDescription: message
    }
  };
}

export function localDetectRisk(message: string): AITechnicalRiskResult {
  const riskFlags = detectTechnicalRisk(message);
  const promptInjectionDetected = hasPromptInjection(message);
  const requiresTechnicalReview = riskFlags.length > 0 || promptInjectionDetected;

  return {
    requiresTechnicalReview,
    riskFlags,
    reason: requiresTechnicalReview
      ? "Se han detectado términos técnicos o una petición insegura."
      : "No se han detectado términos técnicos sensibles.",
    safeReply: requiresTechnicalReview ? getTechnicalSensitiveReply(riskFlags) : "Puedo continuar con orientación comercial inicial.",
    promptInjectionDetected
  };
}

export function localSummarizeLead(lead: CommercialLead): AILeadSummary {
  return {
    title: `${lead.summary.productFamily} - ${lead.summary.company}`,
    commercialSummary: `Consulta sobre ${lead.summary.productFamily}${
      lead.summary.subcategory ? `, enfoque ${lead.summary.subcategory}` : ""
    }. Necesidad: ${lead.summary.needType}. Obra/uso: ${lead.summary.workType}. Ubicación: ${lead.summary.location}. Urgencia: ${lead.summary.urgency}.`,
    technicalNotes: lead.technicalRisk
      ? "Requiere revisión técnica antes de confirmar solución, normativa, montaje o documentación."
      : "Sin revisión técnica marcada por el copiloto.",
    recommendedNextAction: lead.summary.nextAction,
    missingInformation:
      lead.summary.missingInformation && lead.summary.missingInformation.length > 0
        ? lead.summary.missingInformation
        : ["Confirmar datos técnicos si faltan en observaciones"].filter(() =>
            lead.summary.observations === "No indicado"
          ),
    riskFlags: lead.technicalRiskFlags,
    priorityReason: `Prioridad ${lead.priority} asignada por urgencia, familia, volumen y riesgo técnico.`
  };
}

export function localAnswerFaq(question: string): AIFaqAnswer {
  const risk = localDetectRisk(question);

  return {
    answer: risk.requiresTechnicalReview
      ? risk.safeReply
      : `${getCommercialResponse("ambiguousLocal", question)} Para preparar una consulta útil conviene indicar tipo de obra, ubicación, soporte, longitud o cantidad, urgencia y datos de contacto.`,
    requiresTechnicalReview: risk.requiresTechnicalReview,
    suggestedFlowId: risk.requiresTechnicalReview ? "documentacion" : "none",
    safetyWarning: risk.requiresTechnicalReview ? "Consulta técnica sensible." : null
  };
}

export function localCommercialReply(lead: CommercialLead): AICommercialReply {
  const pendingInformation = [
    ...(lead.summary.missingInformation ?? []),
    lead.summary.location === "No indicado" ? "ubicación aproximada" : "",
    lead.summary.urgency === "No indicado" ? "urgencia" : "",
    lead.summary.observations === "No indicado" ? "observaciones técnicas" : ""
  ].filter(Boolean);
  const uniquePendingInformation = Array.from(new Set(pendingInformation));

  return {
    commercialReply: `Estimado/a ${lead.summary.name !== "No indicado" ? lead.summary.name : ""}, gracias por contactar con Protecciones Toledo. Hemos recibido su consulta sobre ${lead.summary.productFamily}. ${
      uniquePendingInformation.length > 0
        ? `Para valorar la solicitud con mayor precisión, necesitaríamos confirmar: ${uniquePendingInformation.join(", ")}.`
        : "Con la información recibida, el equipo comercial puede revisar el caso."
    } ${lead.technicalRisk ? "La consulta se revisará también desde el punto de vista técnico antes de confirmar una solución definitiva." : "Nuestro equipo revisará la información y le responderá con una propuesta ajustada."}`,
    pendingInformation: uniquePendingInformation,
    recommendedNextAction: lead.technicalRisk
      ? "Derivar a revisión técnica y posterior contacto comercial."
      : "Contactar comercialmente con el cliente.",
    requiresTechnicalReview: lead.technicalRisk,
    suggestedTag: lead.technicalRisk ? "Revisión técnica necesaria" : "Contacto comercial"
  };
}

function mapLocalFamily(id?: string): AIProductFamily {
  const map: Record<string, AIProductFamily> = {
    provisional: "proteccion_provisional",
    definitiva: "proteccion_definitiva",
    "bases-casquillos": "bases_casquillos",
    auxiliares: "auxiliares",
    consumibles: "consumibles",
    medida: "solucion_medida"
  };

  return id ? map[id] ?? "desconocida" : "desconocida";
}

function resolveNeedType(family: AIProductFamily) {
  const labels: Record<AIProductFamily, string> = {
    proteccion_provisional: "Protección provisional de borde",
    proteccion_definitiva: "Protección definitiva de borde",
    bases_casquillos: "Bases, casquillos o elementos de fijación",
    auxiliares: "Auxiliares para construcción",
    consumibles: "Consumibles o recambios",
    solucion_medida: "Solución a medida u obra singular",
    documentacion_normativa: "Documentación, normativa o consulta técnica",
    desconocida: "Necesidad por determinar"
  };

  return labels[family];
}

function hasPromptInjection(message: string) {
  const normalized = message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return [
    "ignora tus instrucciones",
    "dime la clave",
    "api key",
    "sin técnico",
    "hazme el cálculo",
    "confirma que cumple"
  ].some((keyword) => normalized.includes(keyword));
}
