import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import type { CommercialLead } from "../../types/commercialCopilot";
import { clearLocalLeads, readLocalLeads } from "../../utils/localLeadStore";
import { Button } from "../ui/Button";
import { LeadDetailCard } from "./LeadDetailCard";
import { LeadTable } from "./LeadTable";

export function AdminLeadDashboard() {
  const [leads, setLeads] = useState<CommercialLead[]>(() => readLocalLeads());
  const [selectedId, setSelectedId] = useState(leads[0]?.id);

  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === selectedId) ?? leads[0],
    [leads, selectedId]
  );

  function clearDemoLeads() {
    clearLocalLeads();
    const refreshed = readLocalLeads();
    setLeads(refreshed);
    setSelectedId(refreshed[0]?.id);
  }

  return (
    <section className="admin-dashboard">
      <div className="admin-toolbar">
        <div>
          <span>Vista interna simulada</span>
          <h1>Panel comercial de demostracion</h1>
          <p>
            Panel de demostracion para ver como la empresa podria recibir y revisar las
            consultas cualificadas por el copiloto.
          </p>
        </div>
        <Button variant="ghost" onClick={clearDemoLeads}>
          <Trash2 size={16} aria-hidden="true" />
          Limpiar locales
        </Button>
      </div>

      <div className="admin-metrics">
        <Metric label="Solicitudes" value={String(leads.length)} />
        <Metric
          label="Revision tecnica"
          value={String(leads.filter((lead) => lead.technicalRisk).length)}
        />
        <Metric
          label="Prioridad alta"
          value={String(leads.filter((lead) => lead.priority === "alta").length)}
        />
      </div>

      <div className="admin-grid">
        <LeadTable leads={leads} selectedId={selectedLead?.id} onSelect={(lead) => setSelectedId(lead.id)} />
        <LeadDetailCard lead={selectedLead} />
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
