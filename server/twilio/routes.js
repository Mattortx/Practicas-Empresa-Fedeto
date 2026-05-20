import { classificationSchema } from "../ai/schemas.js";
import { buildSafeTechnicalReply, detectPromptInjection } from "../ai/safetyRules.js";
import { commercialCopilotSystemPrompt } from "../ai/systemPrompt.js";
import { validateClassification } from "../ai/validators.js";
import { classifyLeadFallback, detectRiskFallback } from "../ai/fallbacks.js";
import { callStructuredLlm } from "../ai/llmClient.js";

export async function handleTwilioRoute(request, response, twilioConfig, aiConfig) {
  const url = new URL(request.url ?? "/", `http://localhost:${aiConfig.port}`);

  if (url.pathname !== "/api/twilio/inbound") {
    return false;
  }

  if (request.method !== "POST") {
    sendXml(response, 405, twimlMessage("Metodo no permitido para el webhook de Twilio."));
    return true;
  }

  if (twilioConfig.webhookToken && url.searchParams.get("token") !== twilioConfig.webhookToken) {
    sendXml(response, 403, twimlMessage("Webhook no autorizado."));
    return true;
  }

  const body = await readTwilioBody(request);
  const message = sanitizeTwilioText(body.Body ?? body.body ?? body.Message ?? "");

  if (!message) {
    sendXml(
      response,
      200,
      twimlMessage("Soy el copiloto comercial de Protecciones Toledo. Envia una consulta breve para orientarla.")
    );
    return true;
  }

  const classification = await classifyTwilioMessage(message, aiConfig);
  const reply = buildTwilioReply(message, classification, twilioConfig.publicAppUrl);
  sendXml(response, 200, twimlMessage(reply));
  return true;
}

async function classifyTwilioMessage(message, config) {
  const local = classifyLeadFallback(message, {});

  if (!config.aiEnabled || !config.apiKey || detectPromptInjection(message)) {
    return local;
  }

  const result = await callStructuredLlm({
    provider: config.provider,
    apiKey: config.apiKey,
    model: config.classifierModel,
    instructions: commercialCopilotSystemPrompt,
    schemaName: "twilio_lead_classification",
    schema: classificationSchema,
    input: {
      task: "clasificar mensaje entrante desde Twilio",
      channel: "twilio",
      message,
      localSignals: {
        localFamily: local.family,
        localIntent: local.intent,
        requiresTechnicalReview: local.requiresTechnicalReview
      }
    },
    maxOutputTokens: 650,
    timeoutMs: config.timeoutMs
  });

  if (!result.ok) {
    return local;
  }

  const ai = validateClassification(result.data);

  if (!ai) {
    return local;
  }

  return {
    ...ai,
    requiresTechnicalReview: Boolean(local.requiresTechnicalReview || ai.requiresTechnicalReview),
    priority: safestPriority(local.priority, ai.priority),
    missingFields: Array.from(new Set([...local.missingFields, ...ai.missingFields]))
  };
}

function buildTwilioReply(message, classification, publicAppUrl) {
  const risk = detectRiskFallback(message);

  if (risk.requiresTechnicalReview || classification.requiresTechnicalReview) {
    return limitTwilioReply(
      [
        buildSafeTechnicalReply(),
        "Puedo dejar la consulta clasificada para revision tecnica/comercial.",
        `Familia orientativa: ${formatFamily(classification.family)}.`,
        publicAppUrl ? `Para completar la solicitud de demo: ${publicAppUrl}` : ""
      ].filter(Boolean).join(" ")
    );
  }

  return limitTwilioReply(
    [
      classification.suggestedReply ||
        "Puedo orientar inicialmente la consulta y preparar una solicitud comercial.",
      `Familia orientativa: ${formatFamily(classification.family)}.`,
      classification.suggestedNextQuestion ? `Siguiente dato util: ${classification.suggestedNextQuestion}` : "",
      publicAppUrl ? `Completa la solicitud en la demo: ${publicAppUrl}` : ""
    ].filter(Boolean).join(" ")
  );
}

function formatFamily(family) {
  const labels = {
    proteccion_provisional: "protección provisional de borde",
    proteccion_definitiva: "protección definitiva de borde",
    bases_casquillos: "bases y casquillos",
    auxiliares: "auxiliares para construcción",
    consumibles: "consumibles",
    solucion_medida: "solución a medida",
    documentacion_normativa: "documentación o normativa",
    desconocida: "por determinar"
  };

  return labels[family] ?? labels.desconocida;
}

function safestPriority(localPriority, aiPriority) {
  const order = { baja: 0, media: 1, alta: 2 };
  return order[localPriority] > order[aiPriority] ? localPriority : aiPriority;
}

function limitTwilioReply(value) {
  const prettified = prettifySpanishText(value);
  return prettified.length > 1300 ? `${prettified.slice(0, 1290).trim()}...` : prettified;
}

function prettifySpanishText(value) {
  return value
    .replace(/\bproteccion\b/g, "protección")
    .replace(/\bProteccion\b/g, "Protección")
    .replace(/\bfijacion\b/g, "fijación")
    .replace(/\bFijacion\b/g, "Fijación")
    .replace(/\bconstruccion\b/g, "construcción")
    .replace(/\bConstruccion\b/g, "Construcción")
    .replace(/\bsolucion\b/g, "solución")
    .replace(/\bSolucion\b/g, "Solución")
    .replace(/\brevision\b/g, "revisión")
    .replace(/\bRevision\b/g, "Revisión")
    .replace(/\btecnica\b/g, "técnica")
    .replace(/\btecnico\b/g, "técnico")
    .replace(/\binformacion\b/g, "información")
    .replace(/\bubicacion\b/g, "ubicación")
    .replace(/\bdocumentacion\b/g, "documentación")
    .replace(/\butil\b/g, "útil")
    .replace(/\bQue\b/g, "Qué");
}

function twimlMessage(message) {
  return `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escapeXml(message)}</Message></Response>`;
}

function sendXml(response, status, xml) {
  response.writeHead(status, { "Content-Type": "text/xml; charset=utf-8" });
  response.end(xml);
}

function sanitizeTwilioText(value) {
  return typeof value === "string" ? value.trim().slice(0, 1600) : "";
}

function readTwilioBody(request) {
  return new Promise((resolveBody, rejectBody) => {
    let rawBody = "";

    request.on("data", (chunk) => {
      rawBody += chunk;

      if (rawBody.length > 20_000) {
        request.destroy();
        rejectBody(new Error("Twilio request too large"));
      }
    });

    request.on("end", () => {
      const contentType = request.headers["content-type"] ?? "";

      if (String(contentType).includes("application/json")) {
        resolveBody(safeJsonParse(rawBody) ?? {});
        return;
      }

      resolveBody(Object.fromEntries(new URLSearchParams(rawBody)));
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

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
