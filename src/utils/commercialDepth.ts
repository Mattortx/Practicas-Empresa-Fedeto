import { getProductFamily } from "../data/productFamilies";
import {
  getCommercialResponse,
  getFamilyOrientationResponse,
  getSituationalResponses
} from "../data/responseLibrary";
import type { AILeadClassification, AIProductFamily } from "../types/ai";
import type {
  ConversationFlow,
  LeadDraft,
  ProductFamilyId,
  ProductSubcategory,
  TechnicalRiskFlag
} from "../types/commercialCopilot";

interface CommercialDepthInsight {
  subcategory: string;
  classificationReason: string;
  detectedSignals: string[];
  missingInformation: string[];
  suggestedQuestion: string;
}

const fieldLabels: Record<string, string> = {
  supportType: "tipo de soporte",
  canDrill: "posibilidad de perforación o fijación",
  approximateLength: "longitud aproximada",
  quantity: "cantidad aproximada",
  environment: "entorno de uso",
  documentationAvailable: "planos, fotografías o documentación disponible",
  project: "obra o proyecto asociado",
  customProblem: "problema principal a resolver",
  riskLocation: "zona exacta del riesgo"
};

const familyReason: Record<ProductFamilyId, string> = {
  provisional:
    "La consulta apunta a una protección temporal durante obra, mantenimiento o una intervención con riesgo de caída.",
  definitiva:
    "La consulta parece orientada a una solución permanente para mantenimiento, cubierta, terraza técnica o recorrido seguro.",
  "bases-casquillos":
    "El foco está en elementos de fijación, alojamiento o compatibilidad con postes, bases o casquillos.",
  auxiliares:
    "La necesidad se centra en material auxiliar, reposición o apoyo a instalación/mantenimiento.",
  consumibles:
    "La consulta encaja con suministro, recambio o consumo recurrente asociado a obra o mantenimiento.",
  medida:
    "La necesidad presenta condiciones singulares, restricciones de soporte o adaptación que requieren revisión personalizada."
};

const flowDepthNotes: Record<string, string> = {
  provisional:
    "Voy a fijarme especialmente en soporte, posibilidad de perforación, longitud, ubicación y urgencia. Con eso el equipo podrá valorar mejor la familia provisional adecuada.",
  definitiva:
    "En soluciones definitivas importa distinguir entorno, uso permanente, fijación posible, longitud y documentación disponible. La respuesta final debe validarla el equipo técnico.",
  "bases-casquillos":
    "Para bases y casquillos conviene identificar soporte, uso previsto, tipo de pieza, cantidad y referencias si existen.",
  auxiliares:
    "Para auxiliares interesa concretar producto, cantidad, uso previsto, compatibilidad y urgencia de suministro.",
  consumibles:
    "Para consumibles o recambios la clave es referencia, cantidad, uso, urgencia y ubicación de entrega o aplicación.",
  medida:
    "En una solución a medida recogeré restricciones, problema principal, documentación disponible y plazo para derivarlo a revisión personalizada.",
  desconocido:
    "Haré una clasificación orientativa según si la necesidad es temporal o permanente, dónde está el riesgo y si puede fijarse al soporte.",
  documentacion:
    "Esta consulta se tratará con prudencia: no confirmaré normativa, montaje, resistencia ni cumplimiento sin revisión documental.",
  presupuesto:
    "Prepararé una solicitud comercial inicial y dejaré marcados los datos que puedan faltar para presupuestar con más precisión."
};

export function buildCommercialDepthInsight(
  draft: LeadDraft,
  flow: ConversationFlow,
  technicalRiskFlags: TechnicalRiskFlag[]
): CommercialDepthInsight {
  const productFamilyId = resolveProductFamilyId(draft, flow);
  const family = getProductFamily(productFamilyId);
  const sourceText = buildSourceText(draft, flow);
  const subcategory = family ? detectSubcategory(sourceText, family.subcategories) : undefined;
  const detectedSignals = buildDetectedSignals(draft, technicalRiskFlags);
  const missingInformation = buildMissingInformation(draft, flow, productFamilyId);

  return {
    subcategory: subcategory?.label ?? "Por determinar",
    classificationReason: buildClassificationReason(productFamilyId, subcategory),
    detectedSignals,
    missingInformation,
    suggestedQuestion: subcategory?.followUpQuestion ?? flow.nextAction
  };
}

export function buildFlowStartMessage(flow: ConversationFlow, aiClassification?: AILeadClassification) {
  const familyId = flow.productFamily ?? mapAiFamilyToProductFamilyId(aiClassification?.family);
  const family = getProductFamily(familyId);
  const depthNote = flowDepthNotes[flow.id] ?? "Continuare con preguntas guiadas para cualificar la consulta.";
  const suggestedQuestion = aiClassification?.suggestedNextQuestion
    ? `\n\nPregunta sugerida por el análisis inicial: ${aiClassification.suggestedNextQuestion}`
    : "";

  return [
    flow.intro,
    family
      ? `\n\nEnfoque comercial: ${family.shortLabel}. ${depthNote}`
      : `\n\nEnfoque comercial: por determinar. ${depthNote}`,
    suggestedQuestion,
    `\n\n${flow.steps[0].prompt}`
  ].join("");
}

export function buildDeepOrientationReply(
  classification: AILeadClassification,
  generatedWithAi: boolean,
  sourceText: string
) {
  const productFamilyId = mapAiFamilyToProductFamilyId(classification.family);
  const family = getProductFamily(productFamilyId);
  const subcategory = family ? detectSubcategory(sourceText, family.subcategories) : undefined;
  const confidence = Math.round(classification.confidence * 100);
  const situationalNotes = getSituationalResponses(sourceText).slice(0, 2);
  const sections = [
    getFamilyOrientationResponse(classification.family, sourceText),
    classification.suggestedReply,
    family
      ? `Lectura comercial: la consulta encaja inicialmente con ${family.label.toLowerCase()}${
          subcategory ? `, con posible enfoque en ${subcategory.label.toLowerCase()}` : ""
        }.`
      : "Lectura comercial: todavía no hay datos suficientes para asignar una familia con seguridad.",
    productFamilyId
      ? `${familyReason[productFamilyId]} Confianza orientativa: ${confidence}%.`
      : `La confianza es orientativa (${confidence}%), por eso conviene hacer unas preguntas de clasificación.`,
    generatedWithAi ? getCommercialResponse("aiValidated", sourceText) : getCommercialResponse("localFallback", sourceText)
  ].filter(Boolean);

  sections.push(...situationalNotes);

  if (classification.missingFields.length > 0) {
    sections.push(`Datos que conviene completar: ${classification.missingFields.join(", ")}.`);
  }

  if (subcategory?.followUpQuestion || classification.suggestedNextQuestion) {
    sections.push(`Siguiente pregunta útil: ${subcategory?.followUpQuestion ?? classification.suggestedNextQuestion}`);
  }

  if (classification.requiresTechnicalReview) {
    sections.push(
      "Esta consulta queda marcada como revisión técnica necesaria antes de confirmar solución, montaje, resistencia, documentación o cumplimiento."
    );
  }

  if (classification.safetyWarning) {
    sections.push(`Aviso: ${classification.safetyWarning}`);
  }

  return sections.join("\n\n");
}

export function mapAiFamilyToProductFamilyId(family?: AIProductFamily): ProductFamilyId | undefined {
  const map: Partial<Record<AIProductFamily, ProductFamilyId>> = {
    proteccion_provisional: "provisional",
    proteccion_definitiva: "definitiva",
    bases_casquillos: "bases-casquillos",
    auxiliares: "auxiliares",
    consumibles: "consumibles",
    solucion_medida: "medida"
  };

  return family ? map[family] : undefined;
}

function buildClassificationReason(productFamilyId: ProductFamilyId | undefined, subcategory?: ProductSubcategory) {
  if (!productFamilyId) {
    return "No hay suficientes datos para fijar una familia única; se recomienda revisar la consulta comercialmente.";
  }

  const baseReason = familyReason[productFamilyId];

  return subcategory
    ? `${baseReason} Subcategoría probable: ${subcategory.label}, detectada por el vocabulario y los datos aportados.`
    : `${baseReason} La subcategoría concreta queda pendiente de confirmar con más información.`;
}

function detectSubcategory(text: string, subcategories: ProductSubcategory[]) {
  const normalizedText = normalize(text);

  return subcategories
    .map((subcategory) => ({
      subcategory,
      score: subcategory.keywords.reduce(
        (total, keyword) => (normalizedText.includes(normalize(keyword)) ? total + 1 : total),
        0
      )
    }))
    .sort((a, b) => b.score - a.score)
    .find((entry) => entry.score > 0)?.subcategory;
}

function buildDetectedSignals(draft: LeadDraft, technicalRiskFlags: TechnicalRiskFlag[]) {
  const signals = [
    draft.workType ? `Tipo de obra: ${draft.workType}` : "",
    draft.supportType ? `Soporte: ${draft.supportType}` : "",
    draft.canDrill ? `Fijación/perforación: ${draft.canDrill}` : "",
    draft.approximateLength ? `Longitud: ${draft.approximateLength}` : "",
    draft.quantity ? `Cantidad: ${draft.quantity}` : "",
    draft.environment ? `Entorno: ${draft.environment}` : "",
    draft.solutionDuration ? `Duración: ${draft.solutionDuration}` : "",
    draft.urgency ? `Urgencia: ${draft.urgency}` : "",
    technicalRiskFlags.length > 0 ? `Riesgo técnico: ${technicalRiskFlags.join(", ")}` : ""
  ].filter(Boolean);

  return signals.length > 0 ? signals : ["Consulta inicial pendiente de cualificación detallada"];
}

function buildMissingInformation(draft: LeadDraft, flow: ConversationFlow, productFamilyId?: ProductFamilyId) {
  const missingByRequiredStep = flow.steps
    .filter((step) => step.required !== false && !draft[step.field])
    .map((step) => fieldLabels[step.field] ?? step.field);

  const recommendedByFamily = [
    productFamilyId === "provisional" && !draft.supportType ? fieldLabels.supportType : "",
    productFamilyId === "provisional" && !draft.canDrill ? fieldLabels.canDrill : "",
    productFamilyId === "definitiva" && !draft.documentationAvailable
      ? fieldLabels.documentationAvailable
      : "",
    productFamilyId === "definitiva" && !draft.environment ? fieldLabels.environment : "",
    productFamilyId === "bases-casquillos" && !draft.quantity ? fieldLabels.quantity : "",
    productFamilyId === "bases-casquillos" && !draft.supportType ? fieldLabels.supportType : "",
    productFamilyId === "medida" && !draft.documentationAvailable ? fieldLabels.documentationAvailable : "",
    productFamilyId === "medida" && !draft.customProblem ? fieldLabels.customProblem : "",
    ["auxiliares", "consumibles"].includes(productFamilyId ?? "") && !draft.quantity
      ? fieldLabels.quantity
      : ""
  ].filter(Boolean);

  return Array.from(new Set([...missingByRequiredStep, ...recommendedByFamily])).slice(0, 6);
}

function resolveProductFamilyId(draft: LeadDraft, flow: ConversationFlow): ProductFamilyId | undefined {
  if (flow.productFamily) {
    return flow.productFamily;
  }

  const normalized = normalize(
    `${draft.productFamily ?? ""} ${draft.solutionDuration ?? ""} ${draft.riskLocation ?? ""} ${
      draft.customProblem ?? ""
    } ${draft.needType ?? ""}`
  );

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

function buildSourceText(draft: LeadDraft, flow: ConversationFlow) {
  return `${flow.needType} ${Object.values(draft).filter(Boolean).join(" ")}`;
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
