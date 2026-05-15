import { aiIntents, aiProductFamilies, leadPriorities } from "./schemas.js";

export function validateClassification(value) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const family = enumValue(value.family, aiProductFamilies, "desconocida");
  const confidence = clampNumber(value.confidence, 0, 1, 0);

  return {
    family: confidence < 0.42 ? "desconocida" : family,
    needType: stringValue(value.needType, "Necesidad por determinar"),
    confidence,
    priority: enumValue(value.priority, leadPriorities, "media"),
    requiresTechnicalReview: Boolean(value.requiresTechnicalReview),
    missingFields: arrayOfStrings(value.missingFields),
    suggestedNextQuestion: stringValue(
      value.suggestedNextQuestion,
      "Puede indicar si la solucion debe ser temporal o permanente?"
    ),
    suggestedReply: stringValue(
      value.suggestedReply,
      "Puedo orientar la consulta y preparar una solicitud comercial para revision."
    ),
    safetyWarning: stringValue(value.safetyWarning, ""),
    intent: enumValue(value.intent, aiIntents, "otra"),
    extractedData: normalizeExtractedData(value.extractedData)
  };
}

export function validateRisk(value) {
  if (!value || typeof value !== "object") {
    return null;
  }

  return {
    requiresTechnicalReview: Boolean(value.requiresTechnicalReview),
    riskFlags: arrayOfStrings(value.riskFlags),
    reason: stringValue(value.reason, "Revision prudente requerida."),
    safeReply: stringValue(
      value.safeReply,
      "Puedo recoger la consulta para que el equipo competente la revise."
    ),
    promptInjectionDetected: Boolean(value.promptInjectionDetected)
  };
}

export function validateSummary(value) {
  if (!value || typeof value !== "object") {
    return null;
  }

  return {
    title: stringValue(value.title, "Solicitud comercial"),
    commercialSummary: stringValue(value.commercialSummary, "Resumen pendiente de completar."),
    technicalNotes: stringValue(value.technicalNotes, "Sin notas tecnicas adicionales."),
    recommendedNextAction: stringValue(
      value.recommendedNextAction,
      "Contactar con el cliente y revisar informacion pendiente."
    ),
    missingInformation: arrayOfStrings(value.missingInformation),
    riskFlags: arrayOfStrings(value.riskFlags),
    priorityReason: stringValue(value.priorityReason, "Prioridad asignada por datos disponibles.")
  };
}

export function validateFaq(value) {
  if (!value || typeof value !== "object") {
    return null;
  }

  return {
    answer: stringValue(value.answer, "No dispongo de datos suficientes para confirmar ese extremo."),
    requiresTechnicalReview: Boolean(value.requiresTechnicalReview),
    suggestedFlowId: stringValue(value.suggestedFlowId, "none"),
    safetyWarning: stringValue(value.safetyWarning, "")
  };
}

export function validateCommercialReply(value) {
  if (!value || typeof value !== "object") {
    return null;
  }

  return {
    commercialReply: stringValue(value.commercialReply, "Gracias por contactar con Protecciones Toledo."),
    pendingInformation: arrayOfStrings(value.pendingInformation),
    recommendedNextAction: stringValue(value.recommendedNextAction, "Contactar con el cliente."),
    requiresTechnicalReview: Boolean(value.requiresTechnicalReview),
    suggestedTag: stringValue(value.suggestedTag, "Consulta comercial")
  };
}

export function sanitizeUserText(value, maxLength = 3500) {
  return stringValue(value, "").slice(0, maxLength);
}

function normalizeExtractedData(value) {
  const data = value && typeof value === "object" ? value : {};

  return {
    name: stringValue(data.name, ""),
    company: stringValue(data.company, ""),
    email: stringValue(data.email, ""),
    phone: stringValue(data.phone, ""),
    approximateLocation: stringValue(data.approximateLocation, ""),
    workType: stringValue(data.workType, ""),
    productFamily: enumValue(data.productFamily, aiProductFamilies, "desconocida"),
    approximateLength: stringValue(data.approximateLength, ""),
    urgency: stringValue(data.urgency, ""),
    needDescription: stringValue(data.needDescription, ""),
    technicalRestriction: stringValue(data.technicalRestriction, ""),
    canDrill: enumValue(data.canDrill, ["si", "no", "desconocido"], "desconocido"),
    temporaryOrPermanent: enumValue(
      data.temporaryOrPermanent,
      ["temporal", "permanente", "desconocido"],
      "desconocido"
    ),
    hasPlansOrDocumentation: enumValue(
      data.hasPlansOrDocumentation,
      ["si", "no", "desconocido"],
      "desconocido"
    ),
    notes: stringValue(data.notes, "")
  };
}

function stringValue(value, fallback) {
  return typeof value === "string" ? value.trim() : fallback;
}

function enumValue(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

function arrayOfStrings(value) {
  return Array.isArray(value)
    ? value.filter((item) => typeof item === "string").map((item) => item.trim()).filter(Boolean)
    : [];
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return Math.max(min, Math.min(max, number));
}
