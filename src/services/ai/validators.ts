import type {
  AICommercialReply,
  AIFaqAnswer,
  AIIntent,
  AILeadClassification,
  AILeadSummary,
  AIProductFamily,
  AITechnicalRiskResult,
  ExtractedLeadData
} from "../../types/ai";
import type { LeadPriority } from "../../types/commercialCopilot";

const families: AIProductFamily[] = [
  "proteccion_provisional",
  "proteccion_definitiva",
  "bases_casquillos",
  "auxiliares",
  "consumibles",
  "solucion_medida",
  "documentacion_normativa",
  "desconocida"
];

const priorities: LeadPriority[] = ["baja", "media", "alta"];
const intents: AIIntent[] = [
  "solicitar_presupuesto",
  "pedir_informacion_producto",
  "pedir_documentacion",
  "preguntar_normativa",
  "preguntar_instalacion",
  "comparar_soluciones",
  "no_sabe_que_necesita",
  "contacto_comercial",
  "soporte_tecnico",
  "otra"
];

export function validateAIClassification(value: unknown): AILeadClassification | null {
  if (!isObject(value)) {
    return null;
  }

  return {
    family: enumValue(value.family, families, "desconocida"),
    needType: stringValue(value.needType, "Necesidad por determinar"),
    confidence: clampNumber(value.confidence, 0, 1, 0),
    priority: enumValue(value.priority, priorities, "media"),
    requiresTechnicalReview: Boolean(value.requiresTechnicalReview),
    missingFields: stringArray(value.missingFields),
    suggestedNextQuestion: stringValue(
      value.suggestedNextQuestion,
      "¿Puede indicar si la solución debe ser temporal o permanente?"
    ),
    suggestedReply: stringValue(
      value.suggestedReply,
      "Puedo orientar la consulta y preparar una solicitud comercial."
    ),
    safetyWarning: stringValue(value.safetyWarning, "") || null,
    intent: enumValue(value.intent, intents, "otra"),
    extractedData: normalizeExtractedData(value.extractedData)
  };
}

export function validateAILeadSummary(value: unknown): AILeadSummary | null {
  if (!isObject(value)) {
    return null;
  }

  return {
    title: stringValue(value.title, "Solicitud comercial"),
    commercialSummary: stringValue(value.commercialSummary, "Resumen pendiente de completar."),
    technicalNotes: stringValue(value.technicalNotes, "Sin notas técnicas adicionales."),
    recommendedNextAction: stringValue(value.recommendedNextAction, "Contactar con el cliente."),
    missingInformation: stringArray(value.missingInformation),
    riskFlags: stringArray(value.riskFlags),
    priorityReason: stringValue(value.priorityReason, "Prioridad calculada por reglas de demo.")
  };
}

export function validateAITechnicalRisk(value: unknown): AITechnicalRiskResult | null {
  if (!isObject(value)) {
    return null;
  }

  return {
    requiresTechnicalReview: Boolean(value.requiresTechnicalReview),
    riskFlags: stringArray(value.riskFlags),
    reason: stringValue(value.reason, "Revisión prudente requerida."),
    safeReply: stringValue(value.safeReply, "Puedo recoger la consulta para revisión técnica."),
    promptInjectionDetected: Boolean(value.promptInjectionDetected)
  };
}

export function validateAIFaq(value: unknown): AIFaqAnswer | null {
  if (!isObject(value)) {
    return null;
  }

  return {
    answer: stringValue(value.answer, "No dispongo de datos suficientes para confirmar ese extremo."),
    requiresTechnicalReview: Boolean(value.requiresTechnicalReview),
    suggestedFlowId: stringValue(value.suggestedFlowId, "none") as AIFaqAnswer["suggestedFlowId"],
    safetyWarning: stringValue(value.safetyWarning, "") || null
  };
}

export function validateAICommercialReply(value: unknown): AICommercialReply | null {
  if (!isObject(value)) {
    return null;
  }

  return {
    commercialReply: stringValue(value.commercialReply, "Gracias por contactar con Protecciones Toledo."),
    pendingInformation: stringArray(value.pendingInformation),
    recommendedNextAction: stringValue(value.recommendedNextAction, "Contactar con el cliente."),
    requiresTechnicalReview: Boolean(value.requiresTechnicalReview),
    suggestedTag: stringValue(value.suggestedTag, "Consulta comercial")
  };
}

function normalizeExtractedData(value: unknown): ExtractedLeadData {
  const data = isObject(value) ? value : {};

  return {
    name: stringValue(data.name, undefined),
    company: stringValue(data.company, undefined),
    email: stringValue(data.email, undefined),
    phone: stringValue(data.phone, undefined),
    approximateLocation: stringValue(data.approximateLocation, undefined),
    workType: stringValue(data.workType, undefined),
    productFamily: enumValue(data.productFamily, families, "desconocida"),
    approximateLength: stringValue(data.approximateLength, undefined),
    urgency: stringValue(data.urgency, undefined),
    needDescription: stringValue(data.needDescription, undefined),
    technicalRestriction: stringValue(data.technicalRestriction, undefined),
    canDrill: booleanish(data.canDrill),
    temporaryOrPermanent: enumValue(
      data.temporaryOrPermanent,
      ["temporal", "permanente", "desconocido"] as const,
      "desconocido"
    ),
    hasPlansOrDocumentation: booleanish(data.hasPlansOrDocumentation),
    notes: stringValue(data.notes, undefined)
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function stringValue(value: unknown, fallback: string): string;
function stringValue(value: unknown, fallback: undefined): string | undefined;
function stringValue(value: unknown, fallback: string | undefined) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function enumValue<T extends string>(value: unknown, allowed: readonly T[], fallback: T) {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function stringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean)
    : [];
}

function clampNumber(value: unknown, min: number, max: number, fallback: number) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return Math.max(min, Math.min(max, number));
}

function booleanish(value: unknown) {
  if (value === true || value === "si") {
    return true;
  }

  if (value === false || value === "no") {
    return false;
  }

  return null;
}
