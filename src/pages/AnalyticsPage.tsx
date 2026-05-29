import { ArrowLeft, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminAnalyticsPanel } from "../components/admin-demo/AdminAnalyticsPanel";
import type { CommercialLead } from "../types/commercialCopilot";
import { fetchLeadsFromApi, readLocalLeads } from "../utils/localLeadStore";

export function AnalyticsPage() {
  const [leads, setLeads] = useState<CommercialLead[]>(() => readLocalLeads());

  useEffect(() => {
    fetchLeadsFromApi().then((apiLeads) => {
      if (apiLeads.length > 0) {
        setLeads(apiLeads);
      }
    });
  }, []);

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <a className="button button-secondary" href="/admin-demo">
          <ArrowLeft size={17} aria-hidden="true" />
          Panel comercial
        </a>
        <a className="button button-secondary" href="/practicas">
          Proyecto de prácticas
        </a>
        <a className="button button-secondary" href="/integracion">
          Integración
        </a>
        <span>
          <Download size={17} aria-hidden="true" />
          Analíticas
        </span>
      </header>

      <div className="analytics-hero">
        <span className="eyebrow">Analítica comercial</span>
        <h1>Informes de solicitudes</h1>
        <p>
          Distribución por familia, prioridad, estado de seguimiento y evolución temporal de las
          solicitudes registradas.
        </p>
      </div>

      <AdminAnalyticsPanel
        leads={leads}
        filteredLeads={leads}
        activeFilterLabel="Todas"
      />
    </main>
  );
}
