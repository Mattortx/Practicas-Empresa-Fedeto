import { useEffect, useMemo, useState } from "react";
import { Download, FileJson, ShieldCheck, Trash2 } from "lucide-react";
import type { CommercialLead, LeadStatus } from "../../types/commercialCopilot";
import {
  clearLeadsViaApi,
  fetchLeadsFromApi,
  getLocalLeadPrivacySnapshot,
  purgeExpiredLocalLeads,
  readLocalLeads,
  replaceLocalLeads,
  updateLeadViaApi
} from "../../utils/localLeadStore";
import { exportLeadsToCsv, exportLeadsToJson } from "../../utils/leadExport";
import { Button } from "../ui/Button";
import { LeadDetailCard } from "./LeadDetailCard";
import { LeadTable } from "./LeadTable";

type LeadFilter =
  | "todas"
  | "nuevas"
  | "revision"
  | "alta"
  | "provisional"
  | "definitiva"
  | "medida";

const filters: Array<{ id: LeadFilter; label: string }> = [
  { id: "todas", label: "Todas" },
  { id: "nuevas", label: "Nuevas" },
  { id: "revision", label: "Revisión técnica" },
  { id: "alta", label: "Alta prioridad" },
  { id: "provisional", label: "Protección provisional" },
  { id: "definitiva", label: "Protección definitiva" },
  { id: "medida", label: "Soluciones a medida" }
];

export function AdminLeadDashboard() {
  const [leads, setLeads] = useState<CommercialLead[]>(() => readLocalLeads());
  const [activeFilter, setActiveFilter] = useState<LeadFilter>("todas");
  const [selectedId, setSelectedId] = useState(leads[0]?.id);
  const [purgedCount, setPurgedCount] = useState(0);
  const [privacySnapshot, setPrivacySnapshot] = useState(() => getLocalLeadPrivacySnapshot());

  const filteredLeads = useMemo(
    () => leads.filter((lead) => matchesFilter(lead, activeFilter)),
    [leads, activeFilter]
  );

  const selectedLead = useMemo(
    () => filteredLeads.find((lead) => lead.id === selectedId) ?? filteredLeads[0],
    [filteredLeads, selectedId]
  );
  const activeFilterLabel = filters.find((filter) => filter.id === activeFilter)?.label ?? "Todas";

  // Cargar leads desde la API al montar el componente
  useEffect(() => {
    const removed = purgeExpiredLocalLeads();
    setPurgedCount(removed);
    setPrivacySnapshot(getLocalLeadPrivacySnapshot());

    fetchLeadsFromApi().then((apiLeads) => {
      if (apiLeads.length > 0) {
        setLeads(apiLeads);
        setSelectedId(apiLeads[0]?.id);
      }
    });
  }, []);

  useEffect(() => {
    if (!filteredLeads.some((lead) => lead.id === selectedId)) {
      setSelectedId(filteredLeads[0]?.id);
    }
  }, [filteredLeads, selectedId]);

  async function clearDemoLeads() {
    await clearLeadsViaApi();
    const refreshed = readLocalLeads();
    setLeads(refreshed);
    setSelectedId(refreshed[0]?.id);
    setPrivacySnapshot(getLocalLeadPrivacySnapshot());
  }

  function updateLeadStatus(leadId: string, status: LeadStatus) {
    updateLeadViaApi(leadId, { status });
    setLeads((current) => {
      const updated = current.map((lead) => (lead.id === leadId ? { ...lead, status } : lead));
      replaceLocalLeads(updated);
      setPrivacySnapshot(getLocalLeadPrivacySnapshot());
      return updated;
    });
  }

  function updateLead(updatedLead: CommercialLead) {
    updateLeadViaApi(updatedLead.id, updatedLead);
    setLeads((current) => {
      const updated = current.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead));
      replaceLocalLeads(updated);
      setPrivacySnapshot(getLocalLeadPrivacySnapshot());
      return updated;
    });
  }

  function handleExportCsv() {
    exportLeadsToCsv(leads);
  }

  function handleExportJson() {
    exportLeadsToJson(leads);
  }

  return (
    <section className="admin-dashboard">
      <div className="admin-toolbar">
        <div>
          <span>Panel comercial · Vista simulada para demo de prácticas</span>
          <h1>Solicitudes de clientes</h1>
          <p>
            Solicitudes cualificadas por el copiloto, listas para revisión y seguimiento
            comercial.
          </p>
        </div>
        <div className="admin-toolbar-actions">
          <Button variant="secondary" onClick={handleExportCsv} disabled={leads.length === 0}>
            <Download size={16} aria-hidden="true" />
            CSV
          </Button>
          <Button variant="secondary" onClick={handleExportJson} disabled={leads.length === 0}>
            <FileJson size={16} aria-hidden="true" />
            JSON
          </Button>
          <Button variant="ghost" onClick={clearDemoLeads}>
            <Trash2 size={16} aria-hidden="true" />
            Limpiar
          </Button>
        </div>
      </div>

      <div className="admin-metrics">
        <Metric label="Total" value={String(leads.length)} />
        <Metric
          label="Nuevas"
          value={String(leads.filter((lead) => lead.status === "nueva").length)}
        />
        <Metric
          label="Revisión técnica"
          value={String(leads.filter((lead) => lead.technicalRisk).length)}
        />
        <Metric
          label="Prioridad alta"
          value={String(leads.filter((lead) => lead.priority === "alta").length)}
        />
      </div>

      <div className="admin-filters" aria-label="Filtros de solicitudes">
        {filters.map((filter) => (
          <button
            className={filter.id === activeFilter ? "filter-chip filter-chip-active" : "filter-chip"}
            key={filter.id}
            type="button"
            onClick={() => setActiveFilter(filter.id)}
          >
            <span>{filter.label}</span>
            <strong>{leads.filter((lead) => matchesFilter(lead, filter.id)).length}</strong>
          </button>
        ))}
      </div>

      <div className="privacy-retention-panel">
        <ShieldCheck size={19} aria-hidden="true" />
        <div>
          <strong>Privacidad de la demo</strong>
          <p>
            Las solicitudes reales generadas en local se conservan solo en este navegador durante
            {` ${privacySnapshot.retentionDays} días`}. Los ejemplos mock están separados de los
            datos introducidos por usuarios.
          </p>
        </div>
        <dl>
          <div>
            <dt>Locales</dt>
            <dd>{privacySnapshot.localLeadCount}</dd>
          </div>
          <div>
            <dt>Más antigua</dt>
            <dd>{formatOldestDate(privacySnapshot.oldestLocalLead)}</dd>
          </div>
          <div>
            <dt>Purgadas</dt>
            <dd>{purgedCount}</dd>
          </div>
        </dl>
      </div>

      <div className="admin-grid">
        <LeadTable
          leads={filteredLeads}
          selectedId={selectedLead?.id}
          onSelect={(lead) => setSelectedId(lead.id)}
        />
        <LeadDetailCard
          lead={selectedLead}
          onStatusChange={updateLeadStatus}
          onLeadUpdate={updateLead}
        />
      </div>
    </section>
  );
}

function formatOldestDate(value?: string) {
  if (!value) {
    return "Sin datos locales";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Sin fecha válida";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function matchesFilter(lead: CommercialLead, filter: LeadFilter) {
  if (filter === "todas") {
    return true;
  }

  if (filter === "nuevas") {
    return lead.status === "nueva";
  }

  if (filter === "revision") {
    return lead.technicalRisk;
  }

  if (filter === "alta") {
    return lead.priority === "alta";
  }

  if (filter === "provisional") {
    return lead.productFamilyId === "provisional";
  }

  if (filter === "definitiva") {
    return lead.productFamilyId === "definitiva";
  }

  return lead.productFamilyId === "medida";
}
