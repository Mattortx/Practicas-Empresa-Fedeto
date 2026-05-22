import { ArrowLeft, BarChart3 } from "lucide-react";
import { AdminLeadDashboard } from "../components/admin-demo/AdminLeadDashboard";

export function AdminDemoPage() {
  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <a className="button button-secondary" href="/">
          <ArrowLeft size={17} aria-hidden="true" />
          Demo funcional
        </a>
        <a className="button button-secondary" href="/practicas">
          Proyecto de prácticas
        </a>
        <a className="button button-ghost" href="/admin-demo/analytics">
          <BarChart3 size={17} aria-hidden="true" />
          Analíticas
        </a>
      </header>

      <AdminLeadDashboard />
    </main>
  );
}
