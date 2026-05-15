export const aiProductFamilies = [
  "proteccion_provisional",
  "proteccion_definitiva",
  "bases_casquillos",
  "auxiliares",
  "consumibles",
  "solucion_medida",
  "documentacion_normativa",
  "desconocida"
];

export const aiIntents = [
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

export const leadPriorities = ["baja", "media", "alta"];

const extractedDataSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "name",
    "company",
    "email",
    "phone",
    "approximateLocation",
    "workType",
    "productFamily",
    "approximateLength",
    "urgency",
    "needDescription",
    "technicalRestriction",
    "canDrill",
    "temporaryOrPermanent",
    "hasPlansOrDocumentation",
    "notes"
  ],
  properties: {
    name: { type: "string" },
    company: { type: "string" },
    email: { type: "string" },
    phone: { type: "string" },
    approximateLocation: { type: "string" },
    workType: { type: "string" },
    productFamily: { type: "string", enum: aiProductFamilies },
    approximateLength: { type: "string" },
    urgency: { type: "string" },
    needDescription: { type: "string" },
    technicalRestriction: { type: "string" },
    canDrill: { type: "string", enum: ["si", "no", "desconocido"] },
    temporaryOrPermanent: { type: "string", enum: ["temporal", "permanente", "desconocido"] },
    hasPlansOrDocumentation: { type: "string", enum: ["si", "no", "desconocido"] },
    notes: { type: "string" }
  }
};

export const classificationSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "family",
    "needType",
    "confidence",
    "priority",
    "requiresTechnicalReview",
    "missingFields",
    "suggestedNextQuestion",
    "suggestedReply",
    "safetyWarning",
    "intent",
    "extractedData"
  ],
  properties: {
    family: { type: "string", enum: aiProductFamilies },
    needType: { type: "string" },
    confidence: { type: "number" },
    priority: { type: "string", enum: leadPriorities },
    requiresTechnicalReview: { type: "boolean" },
    missingFields: { type: "array", items: { type: "string" } },
    suggestedNextQuestion: { type: "string" },
    suggestedReply: { type: "string" },
    safetyWarning: { type: "string" },
    intent: { type: "string", enum: aiIntents },
    extractedData: extractedDataSchema
  }
};

export const riskSchema = {
  type: "object",
  additionalProperties: false,
  required: ["requiresTechnicalReview", "riskFlags", "reason", "safeReply", "promptInjectionDetected"],
  properties: {
    requiresTechnicalReview: { type: "boolean" },
    riskFlags: { type: "array", items: { type: "string" } },
    reason: { type: "string" },
    safeReply: { type: "string" },
    promptInjectionDetected: { type: "boolean" }
  }
};

export const summarySchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "commercialSummary",
    "technicalNotes",
    "recommendedNextAction",
    "missingInformation",
    "riskFlags",
    "priorityReason"
  ],
  properties: {
    title: { type: "string" },
    commercialSummary: { type: "string" },
    technicalNotes: { type: "string" },
    recommendedNextAction: { type: "string" },
    missingInformation: { type: "array", items: { type: "string" } },
    riskFlags: { type: "array", items: { type: "string" } },
    priorityReason: { type: "string" }
  }
};

export const faqSchema = {
  type: "object",
  additionalProperties: false,
  required: ["answer", "requiresTechnicalReview", "suggestedFlowId", "safetyWarning"],
  properties: {
    answer: { type: "string" },
    requiresTechnicalReview: { type: "boolean" },
    suggestedFlowId: {
      type: "string",
      enum: [
        "provisional",
        "definitiva",
        "bases-casquillos",
        "auxiliares",
        "consumibles",
        "medida",
        "presupuesto",
        "desconocido",
        "documentacion",
        "none"
      ]
    },
    safetyWarning: { type: "string" }
  }
};

export const commercialReplySchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "commercialReply",
    "pendingInformation",
    "recommendedNextAction",
    "requiresTechnicalReview",
    "suggestedTag"
  ],
  properties: {
    commercialReply: { type: "string" },
    pendingInformation: { type: "array", items: { type: "string" } },
    recommendedNextAction: { type: "string" },
    requiresTechnicalReview: { type: "boolean" },
    suggestedTag: { type: "string" }
  }
};
