import { commercialCopilotSystemPrompt } from "./systemPrompt.js";
import { callStructuredOpenAI } from "./openaiClient.js";
import { compactKnowledgeBase } from "./knowledgeBase.js";
import {
  classificationSchema,
  commercialReplySchema,
  faqSchema,
  riskSchema,
  summarySchema
} from "./schemas.js";
import {
  answerFaqFallback,
  classifyLeadFallback,
  commercialReplyFallback,
  detectRiskFallback,
  summarizeLeadFallback
} from "./fallbacks.js";
import { buildSafeTechnicalReply, detectLocalRisk, detectPromptInjection } from "./safetyRules.js";
import {
  sanitizeUserText,
  validateClassification,
  validateCommercialReply,
  validateFaq,
  validateRisk,
  validateSummary
} from "./validators.js";

export async function handleAiRoute(request, response, config, sendJson) {
  const url = new URL(request.url ?? "/", `http://localhost:${config.port}`);
  const path = url.pathname;

  if (path === "/api/ai/health" && request.method === "GET") {
    sendJson(response, 200, {
      ok: true,
      aiEnabled: config.aiEnabled,
      aiConfigured: Boolean(config.apiKey),
      mode: config.aiEnabled && config.apiKey ? "ai" : "local",
      model: config.model,
      summaryModel: config.summaryModel,
      classifierModel: config.classifierModel
    });
    return true;
  }

  if (path === "/api/copilot" && request.method === "POST") {
    const body = await readJsonBody(request);
    await classifyLead(request, response, config, sendJson, body);
    return true;
  }

  if (!path.startsWith("/api/ai/")) {
    return false;
  }

  if (request.method !== "POST") {
    sendJson(response, 405, { available: false, error: "method_not_allowed" });
    return true;
  }

  const body = await readJsonBody(request);

  if (path === "/api/ai/classify-lead") {
    await classifyLead(request, response, config, sendJson, body);
    return true;
  }

  if (path === "/api/ai/detect-risk") {
    await detectRisk(request, response, config, sendJson, body);
    return true;
  }

  if (path === "/api/ai/summarize-lead") {
    await summarizeLead(request, response, config, sendJson, body);
    return true;
  }

  if (path === "/api/ai/answer-faq") {
    await answerFaq(request, response, config, sendJson, body);
    return true;
  }

  if (path === "/api/ai/generate-commercial-reply") {
    await generateCommercialReply(request, response, config, sendJson, body);
    return true;
  }

  sendJson(response, 404, { available: false, error: "unknown_ai_route" });
  return true;
}

async function classifyLead(_request, response, config, sendJson, body) {
  const message = sanitizeUserText(body.message);
  const context = compactContext(body.context);

  if (!message) {
    sendJson(response, 400, { available: false, error: "missing_message" });
    return;
  }

  const local = classifyLeadFallback(message, context);
  const localRiskFlags = detectLocalRisk(message);
  const promptInjectionDetected = detectPromptInjection(message);

  if (promptInjectionDetected) {
    sendJson(response, 200, {
      available: false,
      mode: "local",
      reason: "prompt_injection_detected",
      classification: {
        ...local,
        requiresTechnicalReview: true,
        family: "documentacion_normativa",
        suggestedReply: buildSafeTechnicalReply(),
        safetyWarning: "Intento de manipulacion o peticion insegura detectada."
      }
    });
    return;
  }

  const aiResult = await callAiOrFallback({
    config,
    model: config.classifierModel,
    schemaName: "lead_classification",
    schema: classificationSchema,
    input: {
      task: "clasificar consulta comercial",
      message,
      context,
      localSignals: {
        localRiskFlags,
        localFamily: local.family,
        localIntent: local.intent
      },
      allowedFamilies: [
        "proteccion_provisional",
        "proteccion_definitiva",
        "bases_casquillos",
        "auxiliares",
        "consumibles",
        "solucion_medida",
        "documentacion_normativa",
        "desconocida"
      ]
    },
    fallback: local,
    validator: validateClassification,
    maxOutputTokens: 850
  });

  const classification = mergeClassification(local, aiResult.data, localRiskFlags);
  sendJson(response, 200, {
    available: aiResult.available,
    mode: aiResult.mode,
    reason: aiResult.reason,
    error: aiResult.error,
    model: aiResult.model,
    classification
  });
}

async function detectRisk(_request, response, config, sendJson, body) {
  const message = sanitizeUserText(body.message);
  const local = detectRiskFallback(message);

  if (!message) {
    sendJson(response, 400, { available: false, error: "missing_message" });
    return;
  }

  const aiResult = await callAiOrFallback({
    config,
    model: config.classifierModel,
    schemaName: "technical_risk_detection",
    schema: riskSchema,
    input: {
      task: "detectar consulta tecnica sensible",
      message,
      localRiskFlags: local.riskFlags,
      promptInjectionDetected: local.promptInjectionDetected
    },
    fallback: local,
    validator: validateRisk,
    maxOutputTokens: 500
  });

  sendJson(response, 200, {
    available: aiResult.available,
    mode: aiResult.mode,
    reason: aiResult.reason,
    error: aiResult.error,
    risk: mergeRisk(local, aiResult.data)
  });
}

async function summarizeLead(_request, response, config, sendJson, body) {
  const lead = minimizeLeadForAi(body.lead);
  const local = summarizeLeadFallback(lead);

  const aiResult = await callAiOrFallback({
    config,
    model: config.summaryModel,
    schemaName: "lead_summary",
    schema: summarySchema,
    input: {
      task: "generar resumen comercial",
      lead,
      instruction:
        "No inventes datos. Distingue datos aportados, datos pendientes, revision tecnica necesaria y siguiente accion comercial."
    },
    fallback: local,
    validator: validateSummary,
    maxOutputTokens: 900
  });

  sendJson(response, 200, {
    available: aiResult.available,
    mode: aiResult.mode,
    reason: aiResult.reason,
    error: aiResult.error,
    model: aiResult.model,
    summary: aiResult.data
  });
}

async function answerFaq(_request, response, config, sendJson, body) {
  const question = sanitizeUserText(body.question ?? body.message);
  const local = answerFaqFallback(question);

  if (!question) {
    sendJson(response, 400, { available: false, error: "missing_question" });
    return;
  }

  const aiResult = await callAiOrFallback({
    config,
    model: config.model,
    schemaName: "controlled_faq_answer",
    schema: faqSchema,
    input: {
      task: "responder FAQ usando solo base local",
      question,
      knowledgeBase: compactKnowledgeBase(),
      instruction:
        "Si la pregunta es tecnica o normativa, no confirmes nada y ofrece recoger la consulta."
    },
    fallback: local,
    validator: validateFaq,
    maxOutputTokens: 650
  });

  sendJson(response, 200, {
    available: aiResult.available,
    mode: aiResult.mode,
    reason: aiResult.reason,
    error: aiResult.error,
    faq: aiResult.data
  });
}

async function generateCommercialReply(_request, response, config, sendJson, body) {
  const lead = minimizeLeadForAi(body.lead);
  const local = commercialReplyFallback(lead);

  const aiResult = await callAiOrFallback({
    config,
    model: config.summaryModel,
    schemaName: "commercial_reply",
    schema: commercialReplySchema,
    input: {
      task: "generar borrador de respuesta comercial",
      lead,
      instruction:
        "No envies correo real. Prepara un borrador breve, profesional y prudente para el equipo comercial."
    },
    fallback: local,
    validator: validateCommercialReply,
    maxOutputTokens: 800
  });

  sendJson(response, 200, {
    available: aiResult.available,
    mode: aiResult.mode,
    reason: aiResult.reason,
    error: aiResult.error,
    model: aiResult.model,
    commercialReply: aiResult.data
  });
}

async function callAiOrFallback({ config, model, schemaName, schema, input, fallback, validator, maxOutputTokens }) {
  if (!config.aiEnabled) {
    return { available: false, mode: "local", reason: "ai_disabled", data: fallback };
  }

  if (!config.apiKey) {
    return { available: false, mode: "local", reason: "missing_api_key", data: fallback };
  }

  const result = await callStructuredOpenAI({
    apiKey: config.apiKey,
    model,
    instructions: commercialCopilotSystemPrompt,
    schemaName,
    schema,
    input,
    maxOutputTokens,
    timeoutMs: config.timeoutMs
  });

  if (!result.ok) {
    return {
      available: false,
      mode: "local",
      reason: "fallback_applied",
      error: result.error,
      data: fallback
    };
  }

  const validated = validator(result.data);

  if (!validated) {
    return {
      available: false,
      mode: "local",
      reason: "invalid_ai_output",
      data: fallback
    };
  }

  return { available: true, mode: "ai", model, data: validated };
}

function mergeClassification(local, ai, localRiskFlags) {
  const requiresTechnicalReview = Boolean(
    local.requiresTechnicalReview || ai.requiresTechnicalReview || localRiskFlags.length > 0
  );

  return {
    ...ai,
    family: requiresTechnicalReview && ai.family === "desconocida" ? "documentacion_normativa" : ai.family,
    priority: safestPriority(local.priority, ai.priority),
    requiresTechnicalReview,
    missingFields: Array.from(new Set([...local.missingFields, ...ai.missingFields])),
    safetyWarning:
      requiresTechnicalReview && !ai.safetyWarning
        ? "Consulta marcada para revision tecnica antes de confirmar solucion."
        : ai.safetyWarning,
    extractedData: {
      ...local.extractedData,
      ...Object.fromEntries(
        Object.entries(ai.extractedData).filter(([, value]) => Boolean(value) && value !== "desconocido")
      )
    }
  };
}

function mergeRisk(local, ai) {
  return {
    ...ai,
    requiresTechnicalReview: Boolean(local.requiresTechnicalReview || ai.requiresTechnicalReview),
    promptInjectionDetected: Boolean(local.promptInjectionDetected || ai.promptInjectionDetected),
    riskFlags: Array.from(new Set([...local.riskFlags, ...ai.riskFlags])),
    safeReply: local.requiresTechnicalReview || local.promptInjectionDetected ? local.safeReply : ai.safeReply
  };
}

function safestPriority(localPriority, aiPriority) {
  const order = { baja: 0, media: 1, alta: 2 };
  return order[localPriority] > order[aiPriority] ? localPriority : aiPriority;
}

function compactContext(context) {
  if (!context || typeof context !== "object") {
    return {};
  }

  return {
    activeFlow: typeof context.activeFlow === "string" ? context.activeFlow : null,
    currentStep: typeof context.currentStep === "string" ? context.currentStep : null,
    localFamily: typeof context.localFamily === "string" ? context.localFamily : "",
    localRiskFlags: Array.isArray(context.localRiskFlags) ? context.localRiskFlags.slice(0, 8) : []
  };
}

function minimizeLeadForAi(lead) {
  if (!lead || typeof lead !== "object") {
    return {};
  }

  const summary = lead.summary && typeof lead.summary === "object" ? lead.summary : {};

  return {
    id: typeof lead.id === "string" ? lead.id : "",
    productFamilyLabel: lead.productFamilyLabel ?? summary.productFamily ?? "",
    needType: lead.needType ?? summary.needType ?? "",
    priority: lead.priority ?? summary.priority ?? "media",
    technicalRisk: Boolean(lead.technicalRisk ?? summary.requiresTechnicalReview),
    technicalRiskFlags: Array.isArray(lead.technicalRiskFlags) ? lead.technicalRiskFlags : [],
    summary: {
      company: summary.company ?? "",
      needType: summary.needType ?? "",
      productFamily: summary.productFamily ?? "",
      workType: summary.workType ?? "",
      location: summary.location ?? "",
      urgency: summary.urgency ?? "",
      observations: summary.observations ?? "",
      requiresTechnicalReview: Boolean(summary.requiresTechnicalReview),
      nextAction: summary.nextAction ?? "",
      technicalWarnings: Array.isArray(summary.technicalWarnings) ? summary.technicalWarnings : []
    },
    aiClassification: lead.aiClassification ?? null,
    aiSummary: lead.aiSummary ?? null
  };
}

function readJsonBody(request) {
  return new Promise((resolveBody, rejectBody) => {
    let rawBody = "";

    request.on("data", (chunk) => {
      rawBody += chunk;

      if (rawBody.length > 80_000) {
        request.destroy();
        rejectBody(new Error("Request too large"));
      }
    });

    request.on("end", () => {
      resolveBody(safeJsonParse(rawBody) ?? {});
    });

    request.on("error", rejectBody);
  });
}

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
