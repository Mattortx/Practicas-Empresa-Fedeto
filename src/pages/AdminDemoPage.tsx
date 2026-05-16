import { ArrowLeft, DatabaseZap } from "lucide-react";
import { AdminLeadDashboard } from "../components/admin-demo/AdminLeadDashboard";
import { Notice } from "../components/ui/Notice";

export function AdminDemoPage() {
  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <a className="button button-secondary" href="/">
          <ArrowLeft size={17} aria-hidden="true" />
          Vista pública
        </a>
        <span>
          <DatabaseZap size={17} aria-hidden="true" />
          Panel interno simulado
        </span>
      </header>

      <Notice tone="info">
        <strong>Vista simulada para demo de prácticas.</strong> Esta vista no tiene autenticación
        real. Las solicitudes locales se guardan en el navegador mediante localStorage.
      </Notice>

      <AdminLeadDashboard />
    </main>
  );
}
