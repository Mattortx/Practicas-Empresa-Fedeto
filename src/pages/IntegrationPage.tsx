import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  Database,
  Globe2,
  KeyRound,
  Mail,
  ServerCog,
  ShieldCheck
} from "lucide-react";
import { useState } from "react";
import { Header } from "../components/layout/Header";

const embedSnippet = `<script src="https://preproduccion.proteccionestoledo.com/copiloto-widget.js" defer></script>
<div
  id="protecciones-toledo-copiloto"
  data-mode="commercial"
  data-source="web"
></div>`;

const productionChecklist = [
  "Validar aviso legal, privacidad y base de consentimiento con la empresa.",
  "Activar autenticación en el panel interno antes de usar datos reales.",
  "Configurar backend en Railway con variables de entorno y sin claves en frontend.",
  "Conectar Groq u OpenAI solo desde servidor, con timeout, validación y fallback local.",
  "Revisar fichas técnicas reales antes de activar una base documental o RAG.",
  "Definir retención de datos, exportación y borrado de solicitudes."
];

const integrationBlocks = [
  {
    icon: Globe2,
    title: "Web o WordPress",
    text:
      "El MVP queda preparado para incrustarse como widget o como bloque dentro de una página existente, sin obligar a rehacer la web real."
  },
  {
    icon: ServerCog,
    title: "Backend seguro",
    text:
      "Las llamadas de IA y futuras integraciones comerciales deben pasar por servidor para no exponer claves API en navegador."
  },
  {
    icon: Database,
    title: "Datos comerciales",
    text:
      "La demo usa localStorage y datos mock. En preproducción puede conectarse a Supabase o a un CRM con permisos y retención."
  },
  {
    icon: ShieldCheck,
    title: "Guardrails técnicos",
    text:
      "Las consultas sobre normativa, cálculo, montaje o anclaje se derivan a revisión técnica y no se contestan como certeza automática."
  }
];

export function IntegrationPage() {
  const [copied, setCopied] = useState(false);

  async function copySnippet() {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(embedSnippet);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <main className="public-page integration-page">
      <Header />

      <section className="integration-hero">
        <div>
          <a className="button button-secondary" href="/">
            <ArrowLeft size={17} aria-hidden="true" />
            Volver a la demo
          </a>
          <span className="eyebrow">Preparación para producción</span>
          <h1>Integración web, IA y datos comerciales</h1>
          <p>
            Esta vista convierte las mejoras futuras del README en una propuesta técnica defendible:
            cómo incrustar el copiloto, qué servicios hacen falta y qué controles se exigirían antes
            de usar datos reales.
          </p>
        </div>
        <aside className="integration-status-card">
          <strong>Estado actual</strong>
          <ul>
            <li>
              <CheckCircle2 size={17} aria-hidden="true" />
              Demo local operativa
            </li>
            <li>
              <CheckCircle2 size={17} aria-hidden="true" />
              IA opcional con fallback
            </li>
            <li>
              <CheckCircle2 size={17} aria-hidden="true" />
              Exportación CSV/JSON
            </li>
            <li>
              <CheckCircle2 size={17} aria-hidden="true" />
              Retención local de demo
            </li>
          </ul>
        </aside>
      </section>

      <section className="integration-grid reveal-group">
        {integrationBlocks.map((block) => {
          const Icon = block.icon;

          return (
            <article className="integration-card" key={block.title}>
              <Icon size={24} aria-hidden="true" />
              <strong>{block.title}</strong>
              <p>{block.text}</p>
            </article>
          );
        })}
      </section>

      <section className="embed-section">
        <div className="embed-copy">
          <span className="eyebrow">Widget embebible</span>
          <h2>Ejemplo de integración en la web real</h2>
          <p>
            Para WordPress o una web corporativa, el copiloto podría publicarse como script
            versionado. La configuración productiva tendría que apuntar al backend seguro, no a
            claves API en el navegador.
          </p>
          <div className="integration-badges">
            <span>
              <Code2 size={15} aria-hidden="true" />
              Script embebible
            </span>
            <span>
              <KeyRound size={15} aria-hidden="true" />
              Claves solo en servidor
            </span>
            <span>
              <Mail size={15} aria-hidden="true" />
              Email/CRM futuro
            </span>
          </div>
        </div>
        <div className="embed-code-card">
          <div>
            <strong>Snippet orientativo</strong>
            <button type="button" onClick={copySnippet}>
              <ClipboardCheck size={15} aria-hidden="true" />
              {copied ? "Copiado" : "Copiar"}
            </button>
          </div>
          <pre>{embedSnippet}</pre>
        </div>
      </section>

      <section className="production-checklist-section">
        <div>
          <span className="eyebrow">Checklist empresarial</span>
          <h2>Antes de pasar de demo a uso real</h2>
          <p>
            La demo muestra una arquitectura viable, pero una implantación real debe cerrar
            privacidad, autenticación, documentación técnica validada y canal comercial.
          </p>
        </div>
        <ol>
          {productionChecklist.map((item) => (
            <li key={item}>
              <CheckCircle2 size={17} aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
