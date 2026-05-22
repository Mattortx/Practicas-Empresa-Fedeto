-- Migración inicial: esquema para el Copiloto Comercial - Protecciones Toledo
-- Ejecutar en el SQL Editor de Supabase (o vía migración)

-- Extensión para UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── leads ─────────────────────────────────────────────────────
-- Almacena solicitudes comerciales generadas por el copiloto
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'nueva'
    CHECK (status IN ('nueva','calificada','pendiente_revision_tecnica','pendiente_contacto_comercial','cerrada_demo','cerrada_no_oportunidad')),
  priority TEXT NOT NULL DEFAULT 'media'
    CHECK (priority IN ('baja','media','alta')),
  technical_risk BOOLEAN NOT NULL DEFAULT false,
  technical_risk_flags TEXT[] DEFAULT '{}',
  product_family_id TEXT,
  product_family_label TEXT NOT NULL DEFAULT '',
  need_type TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT 'demo'
    CHECK (source IN ('demo','local','twilio')),
  -- Datos de contacto
  contact_name TEXT DEFAULT '',
  company TEXT DEFAULT '',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  -- Resumen estructurado (JSON)
  summary JSONB DEFAULT '{}',
  -- Campos de IA
  ai_classification JSONB,
  ai_summary JSONB,
  ai_summary_source TEXT,
  ai_commercial_reply JSONB,
  ai_generated_at TIMESTAMPTZ,
  extracted_lead_data JSONB
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_priority ON leads(priority);

-- Compatibilidad para instalaciones previas de la POC donde el CHECK de estados ya existía.
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE leads
  ADD CONSTRAINT leads_status_check
  CHECK (status IN ('nueva','calificada','pendiente_revision_tecnica','pendiente_contacto_comercial','cerrada_demo','cerrada_no_oportunidad'));

-- ── conversation_events ───────────────────────────────────────
-- Auditoría de eventos del copiloto
CREATE TABLE IF NOT EXISTS conversation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  payload JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_events_created_at ON conversation_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_lead_id ON conversation_events(lead_id);

-- ── Trigger para updated_at ───────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_leads_updated_at ON leads;
CREATE TRIGGER trg_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
