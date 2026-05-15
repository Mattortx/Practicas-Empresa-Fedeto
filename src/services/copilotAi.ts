import { classifyLeadWithAi } from "./ai/classifyLead";
import type { FlowId, ProductFamilyId } from "../types/commercialCopilot";

export interface AiCopilotResponse {
  available: boolean;
  mode?: "ai" | "local" | "rules";
  model?: string;
  reason?: string;
  error?: string;
  intent?: string;
  productFamilyId?: ProductFamilyId | "none";
  suggestedFlowId?: FlowId | "none";
  requiresTechnicalReview?: boolean;
  confidence?: number;
  answer?: string;
  nextAction?: string;
  technicalWarnings?: string[];
}

interface AiCopilotRequest {
  message: string;
  context?: Record<string, unknown>;
}

export async function requestAiCopilot({
  message,
  context = {}
}: AiCopilotRequest): Promise<AiCopilotResponse> {
  const result = await classifyLeadWithAi(message, context);
  const classification = result.data;

  return {
    available: result.available,
    mode: result.mode,
    model: result.model,
    reason: result.reason,
    error: result.error,
    intent: classification.intent,
    productFamilyId: mapProductFamily(classification.family),
    suggestedFlowId: resolveSuggestedFlow(classification),
    requiresTechnicalReview: classification.requiresTechnicalReview,
    confidence: classification.confidence,
    answer: classification.suggestedReply,
    nextAction: classification.suggestedNextQuestion,
    technicalWarnings: classification.safetyWarning ? [classification.safetyWarning] : []
  };
}

function mapProductFamily(family: string): ProductFamilyId | "none" {
  const map: Record<string, ProductFamilyId | "none"> = {
    proteccion_provisional: "provisional",
    proteccion_definitiva: "definitiva",
    bases_casquillos: "bases-casquillos",
    auxiliares: "auxiliares",
    consumibles: "consumibles",
    solucion_medida: "medida",
    documentacion_normativa: "none",
    desconocida: "none"
  };

  return map[family] ?? "none";
}

function resolveSuggestedFlow(classification: {
  family: string;
  intent: string;
  confidence: number;
  requiresTechnicalReview: boolean;
}): FlowId | "none" {
  if (classification.requiresTechnicalReview || classification.family === "documentacion_normativa") {
    return "documentacion";
  }

  if (classification.intent === "solicitar_presupuesto") {
    return "presupuesto";
  }

  if (classification.confidence < 0.42) {
    return "desconocido";
  }

  return mapProductFamily(classification.family) === "none"
    ? "desconocido"
    : (mapProductFamily(classification.family) as FlowId);
}
