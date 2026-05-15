import { mockLeads } from "../data/mockLeads";
import type { CommercialLead } from "../types/commercialCopilot";

const STORAGE_KEY = "protecciones-toledo-demo-leads";

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
