import { ArrowLeft, DatabaseZap } from "lucide-react";
import { AdminLeadDashboard } from "../components/admin-demo/AdminLeadDashboard";
import { Notice } from "../components/ui/Notice";

export function AdminDemoPage() {
  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <a className="button button-secondary" href="/">
          <ArrowLeft size={17} aria-hidden="true" />
          Demo funcional
        </a>
        <a className="button button-secondary" href="/practicas">
          Proyecto de practicas
        </a>
        <span>
          <DatabaseZap size={17} aria-hidden="true" />
          Panel interno simulado
        </span>
      </header>

      <Notice tone="info">
        <strong>Vista simulada para demo de practicas.</strong> Esta vista no tiene autenticacion
        real. Las solicitudes se guardan en la base de datos (Supabase) si el backend esta
        configurado, o en localStorage como fallback.
      </Notice>

      <AdminLeadDashboard />
    </main>
  );
}
