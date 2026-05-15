import type { AITechnicalRiskResult } from "../../types/ai";
import { logDemoEvent } from "../../utils/demoEvents";
import { postAi } from "./aiClient";
import { localDetectRisk } from "./aiFallbacks";
import { validateAITechnicalRisk } from "./validators";

export async function detectTechnicalRiskWithAi(message: string) {
  const fallback = localDetectRisk(message);
  const result = await postAi<AITechnicalRiskResult>(
    "/api/ai/detect-risk",
    { message },
    (payload) => payload.risk,
    validateAITechnicalRisk,
    fallback
  );

  if (result.data.requiresTechnicalReview) {
    logDemoEvent("riesgo_tecnico_detectado", {
      mode: result.mode,
      riskFlags: result.data.riskFlags
    });
  }

  return result;
}
