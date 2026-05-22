import { mockLeads } from "../data/mockLeads";
import type { CommercialLead } from "../types/commercialCopilot";
import { buildApiUrl } from "../services/apiBase";
import { fetchLeads, createLead, updateLead as apiUpdateLead, deleteAllLeads as apiDeleteAllLeads } from "../services/leadApi";

const STORAGE_KEY = "protecciones-toledo-demo-leads";

// ── API mode (backend con Supabase) ──────────────────────────

async function apiAvailable(): Promise<boolean> {
  try {
    const res = await fetch(buildApiUrl("/api/health/db"));
    const body = await res.json();
    return body.available !== false && body.connected !== false;
  } catch {
    return false;
  }
}

let _apiChecked = false;
let _apiOk = false;

async function isApiReady(): Promise<boolean> {
  if (!_apiChecked) {
    _apiOk = await apiAvailable();
    _apiChecked = true;
  }
  return _apiOk;
}

export async function fetchLeadsFromApi(filters?: { status?: string; priority?: string }): Promise<CommercialLead[]> {
  if (!(await isApiReady())) {
    return readLocalLeads();
  }

  const result = await fetchLeads(filters);

  if (result.available && result.data) {
    // Mapear del formato API al formato CommercialLead
    const rawLeads = (result.data as { leads: unknown[] }).leads;
    return rawLeads.map((lead) => mapApiLeadToCommercial(lead as Record<string, unknown>));
  }

  return readLocalLeads();
}

export async function saveLeadToApi(lead: CommercialLead): Promise<boolean> {
  if (!(await isApiReady())) {
    saveLocalLead(lead);
    return true;
  }

  const result = await createLead(lead as unknown as Record<string, unknown>);
  const saved = result.available && !result.error;

  if (!saved) {
    saveLocalLead(lead);
  }

  return saved;
}

export async function updateLeadViaApi(id: string, updates: Partial<CommercialLead>): Promise<boolean> {
  if (!(await isApiReady())) {
    return false;
  }

  const result = await apiUpdateLead(id, mapCommercialUpdatesToApi(updates));
  return result.available && !result.error;
}

export async function clearLeadsViaApi(): Promise<boolean> {
  if (!(await isApiReady())) {
    clearLocalLeads();
    return true;
  }

  const result = await apiDeleteAllLeads();
  return result.available && !result.error;
}

// ── Local mode (legacy, fallback) ────────────────────────────

export function readLocalLeads(): CommercialLead[] {
  if (typeof window === "undefined") {
    return mockLeads;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  const localLeads = stored ? safeParse(stored) : [];

  return [...localLeads, ...mockLeads].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function saveLocalLead(lead: CommercialLead) {
  if (typeof window === "undefined") {
    return;
  }

  const current = readStoredOnly();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([lead, ...current]));
}

export function replaceLocalLeads(leads: CommercialLead[]) {
  if (typeof window === "undefined") {
    return;
  }

  const localLeads = leads.filter((lead) => lead.source === "local");
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(localLeads));
}

export function clearLocalLeads() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

// ── Helpers ──────────────────────────────────────────────────

function readStoredOnly(): CommercialLead[] {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored ? safeParse(stored) : [];
}

function safeParse(value: string): CommercialLead[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mapApiLeadToCommercial(apiLead: Record<string, unknown>): CommercialLead {
  const summary =
    typeof apiLead.summary === "object" && apiLead.summary !== null
      ? (apiLead.summary as CommercialLead["summary"])
      : undefined;
  const status = normalizeLeadStatus(apiLead.status);

  return {
    id: apiLead.id as string,
    createdAt: (apiLead.createdAt ?? apiLead.created_at) as string,
    status,
    priority: (apiLead.priority ?? "media") as CommercialLead["priority"],
    technicalRisk: (apiLead.technicalRisk ?? apiLead.technical_risk) as boolean,
    technicalRiskFlags: (apiLead.technicalRiskFlags ?? apiLead.technical_risk_flags ?? []) as CommercialLead["technicalRiskFlags"],
    productFamilyId: (apiLead.productFamilyId ?? apiLead.product_family_id) as CommercialLead["productFamilyId"],
    productFamilyLabel: (apiLead.productFamilyLabel ?? apiLead.product_family_label ?? "") as string,
    needType: (apiLead.needType ?? apiLead.need_type ?? "") as string,
    source: "demo",
    summary: {
      name: summary?.name ?? (apiLead.contactName ?? "") as string,
      company: summary?.company ?? (apiLead.company ?? "") as string,
      email: summary?.email ?? (apiLead.email ?? "") as string,
      phone: summary?.phone ?? (apiLead.phone ?? "") as string,
      needType: summary?.needType ?? (apiLead.needType ?? "") as string,
      productFamily: summary?.productFamily ?? (apiLead.productFamilyLabel ?? "") as string,
      workType: summary?.workType ?? "",
      location: summary?.location ?? "",
      urgency: summary?.urgency ?? "",
      observations: summary?.observations ?? "",
      classificationReason: summary?.classificationReason,
      detectedSignals: summary?.detectedSignals ?? [],
      missingInformation: summary?.missingInformation ?? [],
      priority: summary?.priority ?? (apiLead.priority ?? "media") as CommercialLead["priority"],
      requiresTechnicalReview: summary?.requiresTechnicalReview ?? (apiLead.technicalRisk ?? false) as boolean,
      nextAction: summary?.nextAction ?? "",
      technicalWarnings: summary?.technicalWarnings ?? []
    },
    summaryText: (apiLead.summaryText ?? apiLead.summary_text ?? summary?.observations ?? "") as string,
    aiClassification: apiLead.aiClassification as CommercialLead["aiClassification"],
    aiSummary: apiLead.aiSummary as CommercialLead["aiSummary"],
    aiSummarySource: apiLead.aiSummarySource as CommercialLead["aiSummarySource"],
    aiCommercialReply: apiLead.aiCommercialReply as CommercialLead["aiCommercialReply"],
    aiGeneratedAt: apiLead.aiGeneratedAt as string,
    extractedLeadData: apiLead.extractedLeadData as CommercialLead["extractedLeadData"]
  };
}

function mapCommercialUpdatesToApi(updates: Partial<CommercialLead>): Record<string, unknown> {
  const apiUpdates: Record<string, unknown> = {};

  if (updates.status !== undefined) apiUpdates.status = updates.status;
  if (updates.priority !== undefined) apiUpdates.priority = updates.priority;
  if (updates.technicalRisk !== undefined) apiUpdates.technical_risk = updates.technicalRisk;
  if (updates.technicalRiskFlags !== undefined) apiUpdates.technical_risk_flags = updates.technicalRiskFlags;
  if (updates.productFamilyId !== undefined) apiUpdates.product_family_id = updates.productFamilyId;
  if (updates.productFamilyLabel !== undefined) apiUpdates.product_family_label = updates.productFamilyLabel;
  if (updates.needType !== undefined) apiUpdates.need_type = updates.needType;
  if (updates.summary !== undefined) {
    apiUpdates.summary = updates.summary;
    apiUpdates.contact_name = updates.summary.name;
    apiUpdates.company = updates.summary.company;
    apiUpdates.email = updates.summary.email;
    apiUpdates.phone = updates.summary.phone;
  }
  if (updates.aiClassification !== undefined) apiUpdates.ai_classification = updates.aiClassification;
  if (updates.aiSummary !== undefined) apiUpdates.ai_summary = updates.aiSummary;
  if (updates.aiSummarySource !== undefined) apiUpdates.ai_summary_source = updates.aiSummarySource;
  if (updates.aiCommercialReply !== undefined) apiUpdates.ai_commercial_reply = updates.aiCommercialReply;
  if (updates.aiGeneratedAt !== undefined) apiUpdates.ai_generated_at = updates.aiGeneratedAt;
  if (updates.extractedLeadData !== undefined) apiUpdates.extracted_lead_data = updates.extractedLeadData;

  return apiUpdates;
}

function normalizeLeadStatus(value: unknown): CommercialLead["status"] {
  const allowed: CommercialLead["status"][] = [
    "nueva",
    "calificada",
    "pendiente_contacto_comercial",
    "pendiente_revision_tecnica",
    "cerrada_demo",
    "cerrada_no_oportunidad"
  ];

  return allowed.includes(value as CommercialLead["status"])
    ? (value as CommercialLead["status"])
    : "nueva";
}
