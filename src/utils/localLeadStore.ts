import { mockLeads } from "../data/mockLeads";
import type { CommercialLead } from "../types/commercialCopilot";
import { fetchLeads, createLead, updateLead as apiUpdateLead, deleteAllLeads as apiDeleteAllLeads } from "../services/leadApi";

const STORAGE_KEY = "protecciones-toledo-demo-leads";

// ── API mode (backend con Supabase) ──────────────────────────

async function apiAvailable(): Promise<boolean> {
  try {
    const res = await fetch("/api/health/db");
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

  const result = await apiUpdateLead(id, updates as unknown as Record<string, unknown>);
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
  return {
    id: apiLead.id as string,
    createdAt: (apiLead.createdAt ?? apiLead.created_at) as string,
    status: (apiLead.status ?? "nueva") as CommercialLead["status"],
    priority: (apiLead.priority ?? "media") as CommercialLead["priority"],
    technicalRisk: (apiLead.technicalRisk ?? apiLead.technical_risk) as boolean,
    technicalRiskFlags: (apiLead.technicalRiskFlags ?? apiLead.technical_risk_flags ?? []) as CommercialLead["technicalRiskFlags"],
    productFamilyId: (apiLead.productFamilyId ?? apiLead.product_family_id) as CommercialLead["productFamilyId"],
    productFamilyLabel: (apiLead.productFamilyLabel ?? apiLead.product_family_label ?? "") as string,
    needType: (apiLead.needType ?? apiLead.need_type ?? "") as string,
    source: "demo",
    summary: {
      name: (apiLead.contactName ?? "") as string,
      company: (apiLead.company ?? "") as string,
      email: (apiLead.email ?? "") as string,
      phone: (apiLead.phone ?? "") as string,
      needType: (apiLead.needType ?? "") as string,
      productFamily: (apiLead.productFamilyLabel ?? "") as string,
      workType: "",
      location: "",
      urgency: "",
      observations: "",
      priority: (apiLead.priority ?? "media") as CommercialLead["priority"],
      requiresTechnicalReview: (apiLead.technicalRisk ?? false) as boolean,
      nextAction: "",
      technicalWarnings: []
    },
    summaryText: "",
    aiClassification: apiLead.aiClassification as CommercialLead["aiClassification"],
    aiSummary: apiLead.aiSummary as CommercialLead["aiSummary"],
    aiSummarySource: apiLead.aiSummarySource as CommercialLead["aiSummarySource"],
    aiCommercialReply: apiLead.aiCommercialReply as CommercialLead["aiCommercialReply"],
    aiGeneratedAt: apiLead.aiGeneratedAt as string,
    extractedLeadData: apiLead.extractedLeadData as CommercialLead["extractedLeadData"]
  };
}
