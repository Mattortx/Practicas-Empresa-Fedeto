export type ProductFamilyId =
  | "provisional"
  | "definitiva"
  | "bases-casquillos"
  | "auxiliares"
  | "consumibles"
  | "medida";

export type FlowId =
  | ProductFamilyId
  | "presupuesto"
  | "desconocido"
  | "documentacion";

export type LeadPriority = "baja" | "media" | "alta";

export type LeadStatus =
  | "nueva"
  | "pendiente_revision_tecnica"
  | "pendiente_contacto_comercial"
  | "cerrada_demo";

export type TechnicalRiskFlag =
  | "normativa"
  | "certificacion"
  | "calculo"
  | "instalacion"
  | "resistencia"
  | "documentacion_tecnica";

export type LeadFieldId =
  | "name"
  | "company"
  | "email"
  | "phone"
  | "needType"
  | "productFamily"
  | "workType"
  | "location"
  | "urgency"
  | "observations"
  | "supportType"
  | "canDrill"
  | "approximateLength"
  | "quantity"
  | "environment"
  | "project"
  | "customProblem"
  | "documentationAvailable"
  | "expectedDeadline"
  | "riskLocation"
  | "solutionDuration"
  | "commercialGoal";

export interface ProductFamily {
  id: ProductFamilyId;
  label: string;
  shortLabel: string;
  description: string;
  examples: string[];
  keywords: string[];
  accent: "red" | "blue" | "orange" | "slate";
}

export interface ConversationStep {
  id: string;
  field: LeadFieldId;
  prompt: string;
  placeholder?: string;
  required?: boolean;
}

export interface ConversationFlow {
  id: FlowId;
  label: string;
  productFamily?: ProductFamilyId;
  needType: string;
  intro: string;
  steps: ConversationStep[];
  technicalReviewRequired?: boolean;
  defaultWarnings: string[];
  nextAction: string;
}

export type LeadDraft = Partial<Record<LeadFieldId, string>>;

export interface LeadSummary {
  name: string;
  company: string;
  email: string;
  phone: string;
  needType: string;
  productFamily: string;
  workType: string;
  location: string;
  urgency: string;
  observations: string;
  priority: LeadPriority;
  nextAction: string;
  technicalWarnings: string[];
}

export interface CommercialLead {
  id: string;
  createdAt: string;
  status: LeadStatus;
  priority: LeadPriority;
  technicalRisk: boolean;
  technicalRiskFlags: TechnicalRiskFlag[];
  productFamilyId?: ProductFamilyId;
  productFamilyLabel: string;
  needType: string;
  summary: LeadSummary;
  summaryText: string;
  source: "demo" | "local";
}

export interface ChatAction {
  label: string;
  value: string;
  variant?: "primary" | "secondary" | "warning";
}

export interface ChatMessage {
  id: string;
  role: "assistant" | "user" | "system";
  text: string;
  actions?: ChatAction[];
  lead?: CommercialLead;
}
