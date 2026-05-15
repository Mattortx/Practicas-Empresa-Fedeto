import { compactKnowledgeBase } from "./knowledgeBase.js";
import { buildSafeTechnicalReply, detectLocalRisk, detectPromptInjection, normalize } from "./safetyRules.js";

export function classifyLeadFallback(message, context = {}) {
  const riskFlags = detectLocalRisk(message);
  const promptInjectionDetected = detectPromptInjection(message);
  const family = resolveFamily(message, context);
  const intent = resolveIntent(message, promptInjectionDetected, riskFlags);
  const requiresTechnicalReview = promptInjectionDetected || riskFlags.length > 0;
  const extractedData = extractLeadData(message, family);
  const priority = scorePriority(message, family, requiresTechnicalReview, extractedData);

  return {
    family: promptInjectionDetected || (requiresTechnicalReview && family === "desconocida")
      ? "documentacion_normativa"
      : family,
    needType: resolveNeedType(family, intent),
    confidence: family === "desconocida" ? 0.32 : 0.68,
    priority,
    requiresTechnicalReview,
    missingFields: resolveMissingFields(extractedData, family),
    suggestedNextQuestion: resolveNextQuestion(family, requiresTechnicalReview),
    suggestedReply: requiresTechnicalReview
      ? buildSafeTechnicalReply()
      : "Puedo orientar inicialmente la consulta y preparar una solicitud comercial con los datos principales.",
    safetyWarning: requiresTechnicalReview
      ? "Consulta marcada como sensible: debe revisarse por el equipo tecnico antes de confirmar solucion."
      : "",
    intent,
    extractedData
  };
}

export function detectRiskFallback(message) {
  const riskFlags = detectLocalRisk(message);
  const promptInjectionDetected = detectPromptInjection(message);

  return {
    requiresTechnicalReview: riskFlags.length > 0 || promptInjectionDetected,
    riskFlags,
    reason:
      riskFlags.length > 0
        ? `Detectados terminos sensibles: ${riskFlags.join(", ")}.`
        : promptInjectionDetected
          ? "Detectado intento de modificar reglas o pedir una respuesta insegura."
          : "No se han detectado indicadores tecnicos sensibles en modo local.",
    safeReply:
      riskFlags.length > 0 || promptInjectionDetected
        ? buildSafeTechnicalReply()
        : "Puedo continuar con una orientacion comercial inicial.",
    promptInjectionDetected
  };
}

export function summarizeLeadFallback(lead) {
  const summary = lead?.summary ?? {};
  const missingInformation = [
    ["name", "Nombre del contacto"],
    ["company", "Empresa"],
    ["email", "Correo"],
    ["workType", "Tipo de obra"],
    ["location", "Ubicacion aproximada"],
    ["urgency", "Urgencia"]
  ]
    .filter(([key]) => !summary[key] || summary[key] === "No indicado")
    .map(([, label]) => label);

  return {
    title: `${summary.productFamily ?? "Solicitud comercial"} - ${summary.company ?? "Cliente por confirmar"}`,
    commercialSummary: [
      `Consulta sobre ${summary.productFamily ?? "familia por determinar"}.`,
      `Necesidad: ${summary.needType ?? "No indicada"}.`,
      `Obra/uso: ${summary.workType ?? "No indicado"}.`,
      `Ubicacion: ${summary.location ?? "No indicada"}.`,
      `Urgencia: ${summary.urgency ?? "No indicada"}.`
    ].join(" "),
    technicalNotes: summary.requiresTechnicalReview
      ? "Requiere revision tecnica antes de confirmar solucion, normativa, montaje o documentacion."
      : "No se han marcado riesgos tecnicos sensibles en el resumen local.",
    recommendedNextAction:
      summary.nextAction ?? "Contactar con el cliente y solicitar informacion pendiente si aplica.",
    missingInformation,
    riskFlags: lead?.technicalRiskFlags ?? [],
    priorityReason: `Prioridad ${lead?.priority ?? "media"} asignada por urgencia, familia, volumen y revision tecnica.`
  };
}

export function answerFaqFallback(question) {
  const risk = detectRiskFallback(question);

  if (risk.requiresTechnicalReview) {
    return {
      answer: buildSafeTechnicalReply(),
      requiresTechnicalReview: true,
      suggestedFlowId: "documentacion",
      safetyWarning: "Consulta tecnica sensible."
    };
  }

  const normalized = normalize(question);
  const kb = compactKnowledgeBase();
  const answer = normalized.includes("presupuesto")
    ? "Para preparar un presupuesto conviene indicar tipo de obra, ubicacion, soporte, longitud o cantidad, urgencia y datos de contacto."
    : `Puedo orientarle con informacion de la base local de la demo:\n${kb}`;

  return {
    answer,
    requiresTechnicalReview: false,
    suggestedFlowId: normalized.includes("presupuesto") ? "presupuesto" : "none",
    safetyWarning: ""
  };
}

export function commercialReplyFallback(lead) {
  const summary = lead?.summary ?? {};
  const missing = summarizeLeadFallback(lead).missingInformation;

  return {
    commercialReply: [
      `Estimado/a ${summary.name && summary.name !== "No indicado" ? summary.name : ""},`.trim(),
      `gracias por contactar con Protecciones Toledo. Hemos recibido su consulta sobre ${summary.productFamily ?? "sistemas de proteccion en altura"}.`,
      missing.length > 0
        ? `Para poder valorar la solicitud con mayor precision, necesitariamos confirmar: ${missing.join(", ")}.`
        : "Con la informacion recibida, el equipo comercial puede revisar el caso y preparar el siguiente paso.",
      summary.requiresTechnicalReview
        ? "La consulta se revisara tambien desde el punto de vista tecnico antes de confirmar una solucion definitiva."
        : "Nuestro equipo revisara la informacion y le respondera con una propuesta ajustada."
    ].join(" "),
    pendingInformation: missing,
    recommendedNextAction:
      summary.requiresTechnicalReview
        ? "Derivar a revision tecnica y posterior contacto comercial."
        : "Contactar comercialmente con el cliente.",
    requiresTechnicalReview: Boolean(summary.requiresTechnicalReview),
    suggestedTag: summary.requiresTechnicalReview ? "Revision tecnica necesaria" : "Contacto comercial"
  };
}

function resolveFamily(message, context) {
  const text = normalize(`${message} ${context?.localFamily ?? ""}`);

  if (text.includes("une") || text.includes("normativa") || text.includes("certifica")) {
    return "documentacion_normativa";
  }

  if (text.includes("casquillo") || text.includes("base") || text.includes("anclaje")) {
    return "bases_casquillos";
  }

  if (text.includes("consumible") || text.includes("recambio") || text.includes("cartucho")) {
    return "consumibles";
  }

  if (text.includes("auxiliar") || text.includes("repuesto")) {
    return "auxiliares";
  }

  if (text.includes("medida") || text.includes("especial") || text.includes("singular")) {
    return "solucion_medida";
  }

  if (text.includes("definitiva") || text.includes("permanente") || text.includes("cubierta") || text.includes("terraza")) {
    return "proteccion_definitiva";
  }

  if (text.includes("provisional") || text.includes("temporal") || text.includes("forjado") || text.includes("obra")) {
    return "proteccion_provisional";
  }

  return "desconocida";
}

function resolveIntent(message, promptInjectionDetected, riskFlags) {
  const text = normalize(message);

  if (promptInjectionDetected) {
    return "soporte_tecnico";
  }

  if (text.includes("presupuesto") || text.includes("oferta") || text.includes("precio")) {
    return "solicitar_presupuesto";
  }

  if (text.includes("documentacion") || text.includes("ficha")) {
    return "pedir_documentacion";
  }

  if (text.includes("normativa") || text.includes("une") || text.includes("cumple")) {
    return "preguntar_normativa";
  }

  if (text.includes("instalar") || text.includes("montaje") || text.includes("anclaje")) {
    return "preguntar_instalacion";
  }

  if (text.includes("no se que") || text.includes("no se exactamente") || text.includes("no tengo claro")) {
    return "no_sabe_que_necesita";
  }

  return riskFlags.length > 0 ? "soporte_tecnico" : "pedir_informacion_producto";
}

function resolveNeedType(family, intent) {
  if (intent === "solicitar_presupuesto") {
    return "Solicitud de presupuesto";
  }

  const labels = {
    proteccion_provisional: "Proteccion provisional de borde",
    proteccion_definitiva: "Proteccion definitiva de borde",
    bases_casquillos: "Bases, casquillos o elementos de fijacion",
    auxiliares: "Auxiliares para construccion",
    consumibles: "Consumibles o recambios",
    solucion_medida: "Solucion a medida u obra singular",
    documentacion_normativa: "Documentacion, normativa o consulta tecnica",
    desconocida: "Necesidad por determinar"
  };

  return labels[family] ?? labels.desconocida;
}

function resolveNextQuestion(family, requiresTechnicalReview) {
  if (requiresTechnicalReview) {
    return "Puede indicar el producto o sistema y la documentacion tecnica que necesita revisar?";
  }

  const questions = {
    proteccion_provisional: "El borde a proteger es forjado, cubierta, muro, canto de forjado u otro soporte?",
    proteccion_definitiva: "Se puede fijar al soporte o necesita una solucion sin perforacion directa?",
    bases_casquillos: "Busca base, casquillo recto, casquillo acodado, anclaje o fijacion especial?",
    auxiliares: "Que producto auxiliar necesita y en que cantidad aproximada?",
    consumibles: "Que consumible o recambio busca y con que cantidad aproximada?",
    solucion_medida: "Dispone de planos, mediciones o fotografias para una revision posterior?",
    desconocida: "La solucion debe ser temporal durante obra o permanente para mantenimiento?"
  };

  return questions[family] ?? questions.desconocida;
}

function extractLeadData(message, family) {
  const email = message.match(/[^\s@]+@[^\s@]+\.[^\s@]+/)?.[0] ?? "";
  const phone = message.match(/(?:\+34\s*)?(?:\d[\s-]?){9,}/)?.[0]?.trim() ?? "";
  const text = normalize(message);
  const amount = text.includes("en 13374")
    ? ""
    : message.match(/\b\d+(?:[,.]\d+)?\s*(?:m|metros|uds|unidades)?\b/i)?.[0] ?? "";

  return {
    name: "",
    company: "",
    email,
    phone,
    approximateLocation: extractLocation(message),
    workType: text.includes("obra") ? "Obra" : text.includes("nave") ? "Nave industrial" : "",
    productFamily: family,
    approximateLength: amount,
    urgency: text.includes("urgente") || text.includes("alta") ? "Alta" : "",
    needDescription: message.slice(0, 240),
    technicalRestriction: text.includes("sin perforar") || text.includes("no se puede perforar") ? "No perforar" : "",
    canDrill: text.includes("sin perforar") || text.includes("no se puede perforar") ? "no" : "desconocido",
    temporaryOrPermanent: text.includes("definitiva") || text.includes("permanente") ? "permanente" : text.includes("provisional") || text.includes("temporal") ? "temporal" : "desconocido",
    hasPlansOrDocumentation: text.includes("planos") || text.includes("documentacion") ? "si" : "desconocido",
    notes: ""
  };
}

function extractLocation(message) {
  const match = message.match(/\ben\s+([A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñ-]+)/);
  return match?.[1] ?? "";
}

function resolveMissingFields(extractedData, family) {
  const fields = [];

  if (!extractedData.approximateLocation) {
    fields.push("ubicacion aproximada");
  }

  if (!extractedData.approximateLength && family !== "desconocida") {
    fields.push(family === "bases_casquillos" || family === "consumibles" ? "cantidad aproximada" : "longitud aproximada");
  }

  if (!extractedData.urgency) {
    fields.push("urgencia");
  }

  fields.push("datos de contacto");

  return fields;
}

function scorePriority(message, family, requiresTechnicalReview, extractedData) {
  const text = normalize(message);
  let score = 0;

  if (text.includes("urgente") || text.includes("alta") || text.includes("obra activa")) {
    score += 2;
  }

  if (requiresTechnicalReview || family === "solucion_medida") {
    score += 1;
  }

  if (Number.parseFloat(extractedData.approximateLength) >= 100) {
    score += 1;
  }

  if (extractedData.email || extractedData.phone) {
    score += 1;
  }

  if (score >= 3) {
    return "alta";
  }

  if (score >= 1) {
    return "media";
  }

  return "baja";
}
