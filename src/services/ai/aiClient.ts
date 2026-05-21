import type { AIEnvelope, AIHealth } from "../../types/ai";
import { buildApiUrl } from "../apiBase";

const AI_ENABLED_KEY = "protecciones-toledo-ai-enabled";

export function isAiEnabled() {
  if (typeof window === "undefined") {
    return true;
  }

  return window.localStorage.getItem(AI_ENABLED_KEY) !== "false";
}

export function setAiEnabled(enabled: boolean) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(AI_ENABLED_KEY, String(enabled));
  }
}

export async function getAiHealth(): Promise<AIHealth> {
  try {
    const payload = await fetchJson<AIHealth>("/api/ai/health", { method: "GET" }, 3500);
    return payload;
  } catch {
    return {
      ok: false,
      aiEnabled: false,
      aiConfigured: false,
      mode: "local",
      model: "no disponible"
    };
  }
}

export async function postAi<T>(
  path: string,
  body: Record<string, unknown>,
  extract: (payload: Record<string, unknown>) => unknown,
  validate: (value: unknown) => T | null,
  fallback: T
): Promise<AIEnvelope<T>> {
  if (!isAiEnabled()) {
    return { available: false, mode: "local", reason: "ai_disabled", data: fallback };
  }

  try {
    const payload = await fetchJson<Record<string, unknown>>(
      path,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      },
      9000
    );
    const data = validate(extract(payload)) ?? fallback;

    return {
      available: Boolean(payload.available),
      mode: payload.mode === "ai" ? "ai" : "local",
      reason: typeof payload.reason === "string" ? payload.reason : undefined,
      error: typeof payload.error === "string" ? payload.error : undefined,
      model: typeof payload.model === "string" ? payload.model : undefined,
      data
    };
  } catch {
    return { available: false, mode: "local", reason: "api_unavailable", data: fallback };
  }
}

async function fetchJson<T>(url: string, init: RequestInit, timeoutMs: number): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(buildApiUrl(url), { ...init, signal: controller.signal });
    const payload = (await response.json()) as T;

    if (!response.ok) {
      throw new Error("API error");
    }

    return payload;
  } finally {
    window.clearTimeout(timeout);
  }
}
