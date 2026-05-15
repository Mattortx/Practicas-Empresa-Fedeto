import { ArrowLeft, DatabaseZap } from "lucide-react";
import { AdminLeadDashboard } from "../components/admin-demo/AdminLeadDashboard";
import { Notice } from "../components/ui/Notice";

export function AdminDemoPage() {
  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <a className="button button-secondary" href="/">
          <ArrowLeft size={17} aria-hidden="true" />
          Vista publica
        </a>
        <span>
          <DatabaseZap size={17} aria-hidden="true" />
          Panel interno simulado
        </span>
      </header>

      <Notice tone="info">
        Esta vista no tiene autenticacion real y existe solo para la demo de practicas. Las
        solicitudes locales se guardan en el navegador mediante localStorage.
      </Notice>

      <AdminLeadDashboard />
    </main>
  );
}
