const STORAGE_KEY = "protecciones-toledo-demo-events";

export type DemoEventName =
  | "consulta_clasificada"
  | "riesgo_tecnico_detectado"
  | "lead_generado"
  | "resumen_generado"
  | "fallback_activado"
  | "error_ia"
  | "solicitud_enviada_demo";

export interface DemoEvent {
  id: string;
  name: DemoEventName;
  createdAt: string;
  details?: Record<string, unknown>;
}

export function logDemoEvent(name: DemoEventName, details?: Record<string, unknown>) {
  const event: DemoEvent = {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
    details
  };

  if (typeof window !== "undefined") {
    const current = readDemoEvents();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([event, ...current].slice(0, 120)));
  }

  console.info("[demo-event]", event);
}

export function readDemoEvents(): DemoEvent[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
