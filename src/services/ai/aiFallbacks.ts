import { classifyFamilyFromText } from "../../data/productFamilies";
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
    missingFields: ["ubicacion aproximada", "urgencia", "datos de contacto"],
    suggestedNextQuestion: requiresTechnicalReview
      ? "Puede indicar el producto o sistema sobre el que necesita documentacion?"
      : localNextQuestion(family),
    suggestedReply: requiresTechnicalReview
      ? "No puedo confirmar ese extremo ni sustituir una revision tecnica. Puedo recoger la consulta para que el equipo competente la revise."
      : localOrientationReply(family),
    safetyWarning: requiresTechnicalReview ? "Revision tecnica necesaria antes de confirmar solucion." : null,
    intent: requiresTechnicalReview ? "soporte_tecnico" : "pedir_informacion_producto",
    extractedData: {
      productFamily: family,
      needDescription: message
    }
  };
}

function localNextQuestion(family: AIProductFamily) {
  const questions: Record<AIProductFamily, string> = {
    proteccion_provisional: "El borde a proteger es forjado, cubierta, muro, canto de forjado u otro soporte?",
    proteccion_definitiva: "Se puede fijar al soporte o necesita una solucion sin perforacion directa?",
    bases_casquillos: "Busca base, casquillo recto, casquillo acodado, anclaje o fijacion especial?",
    auxiliares: "Que producto auxiliar necesita y en que cantidad aproximada?",
    consumibles: "Que consumible o recambio busca y con que cantidad aproximada?",
    solucion_medida: "Dispone de planos, mediciones o fotografias para una revision posterior?",
    documentacion_normativa: "Puede indicar el producto o sistema sobre el que necesita documentacion?",
    desconocida: "La solucion debe ser temporal durante obra o permanente para mantenimiento?"
  };

  return questions[family];
}

function localOrientationReply(family: AIProductFamily) {
  const replies: Record<AIProductFamily, string> = {
    proteccion_provisional:
      "Por lo que indicas, la consulta encaja inicialmente con proteccion provisional de borde. Conviene concretar soporte, posibilidad de perforacion, longitud aproximada y urgencia antes de derivarla.",
    proteccion_definitiva:
      "La necesidad parece orientada a una proteccion definitiva. Para avanzar de forma prudente hay que conocer entorno, tipo de soporte, si se puede fijar y si existe documentacion de la zona.",
    bases_casquillos:
      "La consulta apunta a bases, casquillos o elementos de fijacion. Para responder mejor conviene identificar tipo de pieza, soporte, cantidad aproximada y compatibilidad con el sistema existente.",
    auxiliares:
      "Parece una consulta de auxiliares para construccion o mantenimiento. Puedo ayudar a concretar producto, uso previsto, cantidad y urgencia de suministro.",
    consumibles:
      "La consulta encaja con consumibles o recambios. Para prepararla bien interesa recoger referencia, cantidad, uso previsto y ubicacion aproximada.",
    solucion_medida:
      "La necesidad parece singular o adaptada. La cualificacion debe recoger problema principal, restricciones del soporte, documentacion disponible y plazo aproximado.",
    documentacion_normativa:
      "La consulta debe tratarse como documentacion o normativa; el copiloto solo puede orientarla y derivarla para revision competente.",
    desconocida:
      "Todavia no hay datos suficientes para fijar una familia. Puedo hacer unas preguntas breves para distinguir si la solucion es temporal, permanente, de suministro o a medida."
  };

  return replies[family];
}

export function localDetectRisk(message: string): AITechnicalRiskResult {
  const riskFlags = detectTechnicalRisk(message);
  const promptInjectionDetected = hasPromptInjection(message);
  const requiresTechnicalReview = riskFlags.length > 0 || promptInjectionDetected;

  return {
    requiresTechnicalReview,
    riskFlags,
    reason: requiresTechnicalReview
      ? "Se han detectado terminos tecnicos o una peticion insegura."
      : "No se han detectado terminos tecnicos sensibles.",
    safeReply: requiresTechnicalReview
      ? "No puedo confirmar ese extremo ni sustituir una revision tecnica. Puedo recoger la consulta para revision."
      : "Puedo continuar con orientacion comercial inicial.",
    promptInjectionDetected
  };
}

export function localSummarizeLead(lead: CommercialLead): AILeadSummary {
  return {
    title: `${lead.summary.productFamily} - ${lead.summary.company}`,
    commercialSummary: `Consulta sobre ${lead.summary.productFamily}${
      lead.summary.subcategory ? `, enfoque ${lead.summary.subcategory}` : ""
    }. Necesidad: ${lead.summary.needType}. Obra/uso: ${lead.summary.workType}. Ubicacion: ${lead.summary.location}. Urgencia: ${lead.summary.urgency}.`,
    technicalNotes: lead.technicalRisk
      ? "Requiere revision tecnica antes de confirmar solucion, normativa, montaje o documentacion."
      : "Sin revision tecnica marcada por el copiloto.",
    recommendedNextAction: lead.summary.nextAction,
    missingInformation:
      lead.summary.missingInformation && lead.summary.missingInformation.length > 0
        ? lead.summary.missingInformation
        : ["Confirmar datos tecnicos si faltan en observaciones"].filter(() =>
            lead.summary.observations === "No indicado"
          ),
    riskFlags: lead.technicalRiskFlags,
    priorityReason: `Prioridad ${lead.priority} asignada por urgencia, familia, volumen y riesgo tecnico.`
  };
}

export function localAnswerFaq(question: string): AIFaqAnswer {
  const risk = localDetectRisk(question);

  return {
    answer: risk.requiresTechnicalReview
      ? risk.safeReply
      : "Puedo orientarle de forma inicial con la informacion disponible en la demo. Para preparar una consulta util conviene indicar tipo de obra, ubicacion, soporte, longitud o cantidad, urgencia y datos de contacto.",
    requiresTechnicalReview: risk.requiresTechnicalReview,
    suggestedFlowId: risk.requiresTechnicalReview ? "documentacion" : "none",
    safetyWarning: risk.requiresTechnicalReview ? "Consulta tecnica sensible." : null
  };
}

export function localCommercialReply(lead: CommercialLead): AICommercialReply {
  const pendingInformation = [
    ...(lead.summary.missingInformation ?? []),
    lead.summary.location === "No indicado" ? "ubicacion aproximada" : "",
    lead.summary.urgency === "No indicado" ? "urgencia" : "",
    lead.summary.observations === "No indicado" ? "observaciones tecnicas" : ""
  ].filter(Boolean);
  const uniquePendingInformation = Array.from(new Set(pendingInformation));

  return {
    commercialReply: `Estimado/a ${lead.summary.name !== "No indicado" ? lead.summary.name : ""}, gracias por contactar con Protecciones Toledo. Hemos recibido su consulta sobre ${lead.summary.productFamily}. ${
      uniquePendingInformation.length > 0
        ? `Para valorar la solicitud con mayor precision, necesitariamos confirmar: ${uniquePendingInformation.join(", ")}.`
        : "Con la informacion recibida, el equipo comercial puede revisar el caso."
    } ${lead.technicalRisk ? "La consulta se revisara tambien desde el punto de vista tecnico antes de confirmar una solucion definitiva." : "Nuestro equipo revisara la informacion y le respondera con una propuesta ajustada."}`,
    pendingInformation: uniquePendingInformation,
    recommendedNextAction: lead.technicalRisk
      ? "Derivar a revision tecnica y posterior contacto comercial."
      : "Contactar comercialmente con el cliente.",
    requiresTechnicalReview: lead.technicalRisk,
    suggestedTag: lead.technicalRisk ? "Revision tecnica necesaria" : "Contacto comercial"
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
    proteccion_provisional: "Proteccion provisional de borde",
    proteccion_definitiva: "Proteccion definitiva de borde",
    bases_casquillos: "Bases, casquillos o elementos de fijacion",
    auxiliares: "Auxiliares para construccion",
    consumibles: "Consumibles o recambios",
    solucion_medida: "Solucion a medida u obra singular",
    documentacion_normativa: "Documentacion, normativa o consulta tecnica",
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
    "sin tecnico",
    "hazme el calculo",
    "confirma que cumple"
  ].some((keyword) => normalized.includes(keyword));
}
