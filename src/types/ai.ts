import type { FlowId, LeadPriority } from "./commercialCopilot";

export type AIProductFamily =
  | "proteccion_provisional"
  | "proteccion_definitiva"
  | "bases_casquillos"
  | "auxiliares"
  | "consumibles"
  | "solucion_medida"
  | "documentacion_normativa"
  | "desconocida";

export type AIIntent =
  | "solicitar_presupuesto"
  | "pedir_informacion_producto"
  | "pedir_documentacion"
  | "preguntar_normativa"
  | "preguntar_instalacion"
  | "comparar_soluciones"
  | "no_sabe_que_necesita"
  | "contacto_comercial"
  | "soporte_tecnico"
  | "otra";

export interface ExtractedLeadData {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  approximateLocation?: string;
  workType?: string;
  productFamily?: AIProductFamily;
  approximateLength?: string;
  urgency?: string;
  needDescription?: string;
  technicalRestriction?: string;
  canDrill?: boolean | null;
  temporaryOrPermanent?: "temporal" | "permanente" | "desconocido";
  hasPlansOrDocumentation?: boolean | null;
  notes?: string;
}

export interface AILeadClassification {
  family: AIProductFamily;
  needType: string;
  confidence: number;
  priority: LeadPriority;
  requiresTechnicalReview: boolean;
  missingFields: string[];
  suggestedNextQuestion: string;
  suggestedReply: string;
  safetyWarning?: string | null;
  intent: AIIntent;
  extractedData: ExtractedLeadData;
}

export interface AILeadSummary {
  title: string;
  commercialSummary: string;
  technicalNotes: string;
  recommendedNextAction: string;
  missingInformation: string[];
  riskFlags: string[];
  priorityReason: string;
}

export interface AITechnicalRiskResult {
  requiresTechnicalReview: boolean;
  riskFlags: string[];
  reason: string;
  safeReply: string;
  promptInjectionDetected: boolean;
}

export interface AIFaqAnswer {
  answer: string;
  requiresTechnicalReview: boolean;
  suggestedFlowId: FlowId | "none";
  safetyWarning?: string | null;
}

export interface AICommercialReply {
  commercialReply: string;
  pendingInformation: string[];
  recommendedNextAction: string;
  requiresTechnicalReview: boolean;
  suggestedTag: string;
}

export interface AIEnvelope<T> {
  available: boolean;
  mode: "ai" | "local";
  reason?: string;
  error?: string;
  model?: string;
  data: T;
}

export interface AIHealth {
  ok: boolean;
  aiEnabled: boolean;
  aiConfigured: boolean;
  mode: "ai" | "local";
  model: string;
  summaryModel?: string;
  classifierModel?: string;
}
