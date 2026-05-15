import type { FlowId, ProductFamilyId } from "../types/commercialCopilot";

export interface AiCopilotResponse {
  available: boolean;
  mode?: "ai" | "rules";
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
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch("/api/copilot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message, context }),
      signal: controller.signal
    });

    const payload = (await response.json()) as AiCopilotResponse;

    if (!response.ok) {
      return {
        available: false,
        mode: "rules",
        error: payload.error ?? "api_error",
        answer: payload.answer
      };
    }

    return payload;
  } catch {
    return {
      available: false,
      mode: "rules",
      error: "api_unavailable",
      answer: "IA no disponible en este momento."
    };
  } finally {
    window.clearTimeout(timeout);
  }
}
