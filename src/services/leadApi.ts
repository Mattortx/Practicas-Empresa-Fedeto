/**
 * Cliente API para leads y eventos del copiloto.
 * Conecta con los endpoints /api/leads y /api/events del backend.
 */

import { buildApiUrl } from "./apiBase";

interface ApiResponse<T> {
  available: boolean;
  error?: string;
  data?: T;
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(buildApiUrl(path), {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options
    });

    const body = await res.json();

    if (!res.ok) {
      return { available: true, error: body.error ?? `HTTP ${res.status}` };
    }

    return { available: true, ...body };
  } catch {
    return { available: false, error: "fetch_failed" };
  }
}

// ── Leads ─────────────────────────────────────────────────────

export interface LeadFilters {
  status?: string;
  priority?: string;
  limit?: number;
  offset?: number;
}

export async function fetchLeads(filters: LeadFilters = {}) {
  const params = new URLSearchParams();

  if (filters.status) params.set("status", filters.status);
  if (filters.priority) params.set("priority", filters.priority);
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.offset) params.set("offset", String(filters.offset));

  const qs = params.toString();

  return apiFetch<{ leads: unknown[]; total: number }>(
    `/api/leads${qs ? `?${qs}` : ""}`
  );
}

export async function fetchLead(id: string) {
  return apiFetch<{ lead: unknown }>(`/api/leads/${id}`);
}

export async function createLead(lead: Record<string, unknown>) {
  return apiFetch<{ lead: unknown }>("/api/leads", {
    method: "POST",
    body: JSON.stringify(lead)
  });
}

export async function updateLead(id: string, updates: Record<string, unknown>) {
  return apiFetch<{ lead: unknown }>(`/api/leads/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates)
  });
}

export async function deleteLead(id: string) {
  return apiFetch<{ deleted: boolean }>(`/api/leads/${id}`, {
    method: "DELETE"
  });
}

export async function deleteAllLeads() {
  return apiFetch<{ deleted: boolean }>("/api/leads", {
    method: "DELETE"
  });
}

// ── Eventos ───────────────────────────────────────────────────

export async function createEvent(
  eventType: string,
  leadId?: string,
  payload?: Record<string, unknown>
) {
  return apiFetch<{ event: unknown }>("/api/events", {
    method: "POST",
    body: JSON.stringify({
      event_type: eventType,
      lead_id: leadId ?? null,
      payload: payload ?? {}
    })
  });
}

export async function fetchLeadEvents(leadId: string) {
  return apiFetch<{ events: unknown[] }>(`/api/leads/${leadId}/events`);
}

// ── Health ────────────────────────────────────────────────────

export async function checkDbHealth() {
  return apiFetch<{ ok: boolean; connected: boolean }>("/api/health/db");
}
