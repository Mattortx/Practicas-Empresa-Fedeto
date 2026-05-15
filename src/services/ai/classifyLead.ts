import type { AILeadClassification } from "../../types/ai";
import { logDemoEvent } from "../../utils/demoEvents";
import { postAi } from "./aiClient";
import { localClassifyLead } from "./aiFallbacks";
import { validateAIClassification } from "./validators";

export async function classifyLeadWithAi(
  message: string,
  context: Record<string, unknown> = {}
) {
  const fallback = localClassifyLead(message);
  const result = await postAi<AILeadClassification>(
    "/api/ai/classify-lead",
    { message, context },
    (payload) => payload.classification,
    validateAIClassification,
    fallback
  );

  logDemoEvent(result.available ? "consulta_clasificada" : "fallback_activado", {
    mode: result.mode,
    reason: result.reason,
    family: result.data.family,
    confidence: result.data.confidence
  });

  if (result.data.requiresTechnicalReview) {
    logDemoEvent("riesgo_tecnico_detectado", {
      family: result.data.family,
      intent: result.data.intent
    });
  }

  if (result.error) {
    logDemoEvent("error_ia", { error: result.error, reason: result.reason });
  }

  return result;
}
