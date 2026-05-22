import { useCallback, useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import type { CommercialLead, LeadStatus } from "../../types/commercialCopilot";
import {
  clearLocalLeads,
  clearLeadsViaApi,
  fetchLeadsFromApi,
  readLocalLeads,
  replaceLocalLeads,
  updateLeadViaApi
} from "../../utils/localLeadStore";
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
  }

  function updateLeadStatus(leadId: string, status: LeadStatus) {
    updateLeadViaApi(leadId, { status });
    setLeads((current) => {
      const updated = current.map((lead) => (lead.id === leadId ? { ...lead, status } : lead));
      replaceLocalLeads(updated);
      return updated;
    });
  }

  function updateLead(updatedLead: CommercialLead) {
    updateLeadViaApi(updatedLead.id, updatedLead);
    setLeads((current) => {
      const updated = current.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead));
      replaceLocalLeads(updated);
      return updated;
    });
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
        <Button variant="ghost" onClick={clearDemoLeads}>
          <Trash2 size={16} aria-hidden="true" />
          Limpiar
        </Button>
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
