import { ExternalLink, ShieldCheck } from "lucide-react";

interface HeaderProps {
  section?: "demo" | "practicas";
}

export function Header({ section = "demo" }: HeaderProps) {
  const isPracticas = section === "practicas";
  const currentPath = window.location.pathname;
  const isAnalytics = currentPath === "/admin-demo/analytics";

  return (
    <header className="site-header">
      <a className="brand-link" href="/" aria-label="Ir a la demo funcional">
        <span className="brand-symbol">PT</span>
        <span>
          <strong>Protecciones Toledo</strong>
          <small>{isPracticas ? "Proyecto de prácticas" : "Copiloto Comercial"}</small>
        </span>
      </a>
      <nav className="header-nav" aria-label="Navegación principal">
        {isPracticas ? (
          <>
            <a href="/" className={currentPath === "/" ? "active" : ""}>Demo funcional</a>
            <a href="#arquitectura">Arquitectura</a>
            <a href="#familias">Familias</a>
            <a href="/admin-demo">Panel interno</a>
            <a href="/admin-demo/analytics" className={isAnalytics ? "active" : ""}>Analíticas</a>
          </>
        ) : (
          <>
            <a href="#copiloto">Copiloto</a>
            <a href="/admin-demo" className={currentPath === "/admin-demo" ? "active" : ""}>Panel interno</a>
            <a href="/admin-demo/analytics" className={isAnalytics ? "active" : ""}>Analíticas</a>
            <a href="/practicas" className={currentPath.startsWith("/practicas") ? "active" : ""}>Proyecto de prácticas</a>
          </>
        )}
        <a href="https://proteccionestoledo.com/" target="_blank" rel="noreferrer">
          Web real <ExternalLink size={14} aria-hidden="true" />
        </a>
      </nav>
      <span className="header-badge">
        <ShieldCheck size={16} aria-hidden="true" />
        POC online
      </span>
    </header>
  );
}
