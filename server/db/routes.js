import { getSupabase, isSupabaseConfigured } from "./supabase.js";

function db() {
  return getSupabase();
}

/**
 * Endpoints DB para leads y eventos del copiloto.
 *
 * GET    /api/leads              → listar leads (filtros opcionales: status, priority)
 * GET    /api/leads/:id          → obtener un lead
 * POST   /api/leads              → crear lead
 * PATCH  /api/leads/:id          → actualizar lead (status, priority, summary, etc.)
 * DELETE /api/leads              → borrar todos los leads locales
 * DELETE /api/leads/:id          → borrar un lead
 * GET    /api/leads/:id/events   → eventos de un lead
 * POST   /api/events             → crear evento de auditoría
 * GET    /api/health/db          → healthcheck de la BD
 */

export async function handleDbRoute(request, response, sendJson) {
  if (!isSupabaseConfigured()) {
    sendJson(response, 503, {
      available: false,
      error: "db_not_configured",
      message: "SUPABASE_URL y SUPABASE_SERVICE_KEY no están configuradas."
    });
    return true;
  }

  const url = new URL(request.url ?? "/", `http://localhost:${process.env.PORT ?? 8787}`);
  const path = url.pathname;
  const method = request.method;

  // Healthcheck DB
  if (path === "/api/health/db" && method === "GET") {
    return handleDbHealth(request, response, sendJson);
  }

  // List leads
  if (path === "/api/leads" && method === "GET") {
    return handleListLeads(request, response, sendJson, url);
  }

  // Create lead
  if (path === "/api/leads" && method === "POST") {
    return handleCreateLead(request, response, sendJson);
  }

  // Delete all leads
  if (path === "/api/leads" && method === "DELETE") {
    return handleDeleteAllLeads(request, response, sendJson);
  }

  // Single lead routes
  const leadMatch = path.match(/^\/api\/leads\/([a-f0-9-]+)(\/events)?$/);

  if (leadMatch) {
    const leadId = leadMatch[1];
    const subResource = leadMatch[2];

    // GET /api/leads/:id/events
    if (subResource === "/events" && method === "GET") {
      return handleListLeadEvents(request, response, sendJson, leadId);
    }

    // GET /api/leads/:id
    if (!subResource && method === "GET") {
      return handleGetLead(request, response, sendJson, leadId);
    }

    // PATCH /api/leads/:id
    if (!subResource && method === "PATCH") {
      return handleUpdateLead(request, response, sendJson, leadId);
    }

    // DELETE /api/leads/:id
    if (!subResource && method === "DELETE") {
      return handleDeleteLead(request, response, sendJson, leadId);
    }
  }

  // Create event
  if (path === "/api/events" && method === "POST") {
    return handleCreateEvent(request, response, sendJson);
  }

  return false;
}

// ── Handlers ───────────────────────────────────────────────────

async function handleDbHealth(_request, response, sendJson) {
  try {
    const { data, error } = await db().from("leads").select("id", { count: "exact", head: true });

    sendJson(response, 200, {
      ok: true,
      connected: !error,
      error: error?.message ?? null
    });
  } catch (error) {
    sendJson(response, 500, { ok: false, connected: false, error: error.message });
  }

  return true;
}

async function handleListLeads(_request, response, sendJson, url) {
  try {
    const status = url.searchParams.get("status");
    const priority = url.searchParams.get("priority");
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 100), 500);
    const offset = Math.max(Number(url.searchParams.get("offset") ?? 0), 0);

    let query = db()
      .from("leads")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    if (priority) {
      query = query.eq("priority", priority);
    }

    const { data, error, count } = await query;

    if (error) {
      sendJson(response, 500, { available: false, error: error.message });
      return true;
    }

    sendJson(response, 200, {
      available: true,
      leads: data.map(mapLeadFromDb),
      total: count ?? data.length,
      limit,
      offset
    });
  } catch (error) {
    sendJson(response, 500, { available: false, error: error.message });
  }

  return true;
}

async function handleGetLead(_request, response, sendJson, leadId) {
  try {
    const { data, error } = await db()
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (error) {
      sendJson(response, error.code === "PGRST116" ? 404 : 500, {
        available: false,
        error: error.code === "PGRST116" ? "not_found" : error.message
      });
      return true;
    }

    sendJson(response, 200, { available: true, lead: mapLeadFromDb(data) });
  } catch (error) {
    sendJson(response, 500, { available: false, error: error.message });
  }

  return true;
}

async function handleCreateLead(request, response, sendJson) {
  try {
    const body = await readJsonBody(request);
    const lead = mapLeadToDb(body);

    const { data, error } = await db()
      .from("leads")
      .insert([lead])
      .select()
      .single();

    if (error) {
      sendJson(response, 500, { available: false, error: error.message });
      return true;
    }

    sendJson(response, 201, { available: true, lead: mapLeadFromDb(data) });
  } catch (error) {
    sendJson(response, 500, { available: false, error: error.message });
  }

  return true;
}

async function handleUpdateLead(request, response, sendJson, leadId) {
  try {
    const body = await readJsonBody(request);
    const updates = {};

    // Whitelist de campos actualizables
    const allowedFields = [
      "status", "priority", "technical_risk", "technical_risk_flags",
      "contact_name", "company", "email", "phone",
      "product_family_id", "product_family_label", "need_type",
      "summary", "ai_summary", "ai_summary_source",
      "ai_classification", "ai_commercial_reply", "ai_generated_at",
      "extracted_lead_data"
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      sendJson(response, 400, { available: false, error: "no_fields_to_update" });
      return true;
    }

    const { data, error } = await db()
      .from("leads")
      .update(updates)
      .eq("id", leadId)
      .select()
      .single();

    if (error) {
      sendJson(response, error.code === "PGRST116" ? 404 : 500, {
        available: false,
        error: error.code === "PGRST116" ? "not_found" : error.message
      });
      return true;
    }

    sendJson(response, 200, { available: true, lead: mapLeadFromDb(data) });
  } catch (error) {
    sendJson(response, 500, { available: false, error: error.message });
  }

  return true;
}

async function handleDeleteLead(_request, response, sendJson, leadId) {
  try {
    const { error } = await db()
      .from("leads")
      .delete()
      .eq("id", leadId);

    if (error) {
      sendJson(response, 500, { available: false, error: error.message });
      return true;
    }

    sendJson(response, 200, { available: true, deleted: true });
  } catch (error) {
    sendJson(response, 500, { available: false, error: error.message });
  }

  return true;
}

async function handleDeleteAllLeads(_request, response, sendJson) {
  try {
    const { error } = await db()
      .from("leads")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (error) {
      sendJson(response, 500, { available: false, error: error.message });
      return true;
    }

    sendJson(response, 200, { available: true, deleted: true });
  } catch (error) {
    sendJson(response, 500, { available: false, error: error.message });
  }

  return true;
}

async function handleListLeadEvents(_request, response, sendJson, leadId) {
  try {
    const { data, error } = await db()
      .from("conversation_events")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      sendJson(response, 500, { available: false, error: error.message });
      return true;
    }

    sendJson(response, 200, { available: true, events: data });
  } catch (error) {
    sendJson(response, 500, { available: false, error: error.message });
  }

  return true;
}

async function handleCreateEvent(request, response, sendJson) {
  try {
    const body = await readJsonBody(request);

    if (!body.event_type) {
      sendJson(response, 400, { available: false, error: "missing_event_type" });
      return true;
    }

    const { data, error } = await db()
      .from("conversation_events")
      .insert([{
        lead_id: body.lead_id ?? null,
        event_type: body.event_type,
        payload: body.payload ?? {}
      }])
      .select()
      .single();

    if (error) {
      sendJson(response, 500, { available: false, error: error.message });
      return true;
    }

    sendJson(response, 201, { available: true, event: data });
  } catch (error) {
    sendJson(response, 500, { available: false, error: error.message });
  }

  return true;
}

// ── Mappers ────────────────────────────────────────────────────

function mapLeadFromDb(row) {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: row.status,
    priority: row.priority,
    technicalRisk: row.technical_risk,
    technicalRiskFlags: row.technical_risk_flags ?? [],
    productFamilyId: row.product_family_id,
    productFamilyLabel: row.product_family_label,
    needType: row.need_type,
    source: row.source,
    summary: row.summary ?? {},
    summaryText: row.summary?.observations ?? "",
    contactName: row.contact_name,
    company: row.company,
    email: row.email,
    phone: row.phone,
    aiClassification: row.ai_classification,
    aiSummary: row.ai_summary,
    aiSummarySource: row.ai_summary_source,
    aiCommercialReply: row.ai_commercial_reply,
    aiGeneratedAt: row.ai_generated_at,
    extractedLeadData: row.extracted_lead_data
  };
}

function mapLeadToDb(lead) {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  return {
    ...(lead.id && isUuid.test(lead.id) ? { id: lead.id } : {}),
    status: lead.status ?? "nueva",
    priority: lead.priority ?? "media",
    technical_risk: lead.technicalRisk ?? false,
    technical_risk_flags: lead.technicalRiskFlags ?? [],
    product_family_id: lead.productFamilyId ?? null,
    product_family_label: lead.productFamilyLabel ?? "",
    need_type: lead.needType ?? "",
    source: lead.source ?? "demo",
    contact_name: lead.contactName ?? lead.summary?.name ?? "",
    company: lead.company ?? lead.summary?.company ?? "",
    email: lead.email ?? lead.summary?.email ?? "",
    phone: lead.phone ?? lead.summary?.phone ?? "",
    summary: lead.summary ?? {},
    ai_classification: lead.aiClassification ?? null,
    ai_summary: lead.aiSummary ?? null,
    ai_summary_source: lead.aiSummarySource ?? null,
    ai_commercial_reply: lead.aiCommercialReply ?? null,
    ai_generated_at: lead.aiGeneratedAt ?? null,
    extracted_lead_data: lead.extractedLeadData ?? null
  };
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let raw = "";

    request.on("data", (chunk) => {
      raw += chunk;

      if (raw.length > 80_000) {
        request.destroy();
        reject(new Error("Request too large"));
      }
    });

    request.on("end", () => {
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });

    request.on("error", reject);
  });
}
