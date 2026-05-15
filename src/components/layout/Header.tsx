import { ExternalLink, ShieldCheck } from "lucide-react";

export function Header() {
  return (
    <header className="site-header">
      <a className="brand-link" href="/" aria-label="Ir a la vista publica">
        <span className="brand-symbol">PT</span>
        <span>
          <strong>Protecciones Toledo</strong>
          <small>Copiloto comercial demo</small>
        </span>
      </a>
      <nav className="header-nav" aria-label="Navegacion principal">
        <a href="#familias">Familias</a>
        <a href="#copiloto">Copiloto</a>
        <a href="/admin-demo">Panel demo</a>
        <a href="https://proteccionestoledo.com/" target="_blank" rel="noreferrer">
          Web real <ExternalLink size={14} aria-hidden="true" />
        </a>
      </nav>
      <span className="header-badge">
        <ShieldCheck size={16} aria-hidden="true" />
        POC local
      </span>
    </header>
  );
}
