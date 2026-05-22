import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  ClipboardCheck,
  Factory,
  FileCheck2,
  Gauge,
  MessageSquareText,
  Route,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UsersRound
} from "lucide-react";
import { ChatWidget } from "../components/commercial-copilot/ChatWidget";
import { Header } from "../components/layout/Header";

const operatingStats = [
  { label: "IA", value: "Groq preparado", tone: "green" },
  { label: "Datos", value: "Demo local", tone: "blue" },
  { label: "Salida", value: "Ficha comercial", tone: "red" },
  { label: "Riesgo", value: "Guardrails técnicos", tone: "orange" }
];

const scenarioCards = [
  {
    id: "provisional",
    title: "Protección provisional",
    prompt: "Necesito proteger el borde de un forjado durante una obra en Toledo.",
    result: "Familia probable: protección provisional. Pide soporte, longitud, urgencia y contacto.",
    priority: "Media"
  },
  {
    id: "definitiva",
    title: "Cubierta industrial",
    prompt: "Busco una barandilla definitiva para una cubierta donde no se puede perforar.",
    result: "Familia probable: protección definitiva. Marca revisión por entorno y fijación.",
    priority: "Alta"
  },
  {
    id: "normativa",
    title: "Consulta normativa",
    prompt: "Cumple la UNE EN 13374?",
    result: "Consulta sensible. No confirma cumplimiento y deriva a revisión técnica.",
    priority: "Revisión"
  }
];

const companyBenefits = [
  {
    icon: MessageSquareText,
    title: "Menos consultas incompletas",
    text: "El usuario no abandona una caja de texto abierta: el copiloto guía la primera toma de datos."
  },
  {
    icon: Gauge,
    title: "Prioridad visible",
    text: "Cada solicitud llega con familia probable, urgencia, riesgo tecnico y siguiente accion."
  },
  {
    icon: UsersRound,
    title: "Mejor traspaso interno",
    text: "Comercial y tecnico revisan una ficha comun en vez de reconstruir el contexto desde cero."
  }
];

const companyContextCards = [
  {
    icon: Factory,
    title: "Fabricación y suministro",
    text:
      "La demo parte de una empresa industrial que diseña, fabrica y provee sistemas metálicos de protección en altura."
  },
  {
    icon: ShieldCheck,
    title: "Protección colectiva",
    text:
      "El copiloto distingue entre protección provisional, definitiva, bases, casquillos, auxiliares y consumibles."
  },
  {
    icon: Route,
    title: "Obras con riesgo real",
    text:
      "Está pensado para consultas de cubiertas, forjados, terrazas técnicas, puentes, silos, naves y mantenimiento."
  },
  {
    icon: ClipboardCheck,
    title: "Revisión documentada",
    text:
      "Cuando aparecen normativa, montaje, resistencia o anclajes, la consulta se deriva a revisión técnica."
  }
];

export function PublicDemoPage() {
  const [activeScenario, setActiveScenario] = useState(scenarioCards[0]);

  return (
    <main className="public-page product-demo-page">
      <Header />

      <section className="product-hero">
        <div className="product-hero-copy">
          <span className="eyebrow">Demo funcional para presentación</span>
          <h1>Copiloto Comercial Protecciones Toledo</h1>
          <p>
            Una experiencia conversacional para cualificar consultas de protección en altura,
            ordenar datos comerciales y entregar una ficha revisable por el equipo interno.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#copiloto">
              Probar copiloto <ArrowRight size={17} aria-hidden="true" />
            </a>
            <a className="button button-secondary" href="/admin-demo">
              Abrir panel interno
            </a>
          </div>
          <div className="status-rack" aria-label="Estado operativo de la demo">
            {operatingStats.map((item) => (
              <div className={`status-tile status-${item.tone}`} key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="commercial-console" aria-label="Vista previa comercial">
          <div className="console-topbar">
            <span>Lead intake</span>
            <strong>Solicitud cualificada</strong>
          </div>
          <div className="console-message">
            <MessageSquareText size={19} aria-hidden="true" />
            <p>{activeScenario.prompt}</p>
          </div>
          <div className="console-pipeline">
            <span>Consulta</span>
            <span>Clasificación</span>
            <span>Ficha</span>
            <span>Revision</span>
          </div>
          <div className="console-result">
            <div>
              <span>Resultado esperado</span>
              <strong>{activeScenario.title}</strong>
              <p>{activeScenario.result}</p>
            </div>
            <div className="priority-dial">
              <span>Prioridad</span>
              <strong>{activeScenario.priority}</strong>
            </div>
          </div>
          <div className="console-actions" aria-label="Escenarios de presentacion">
            {scenarioCards.map((scenario) => (
              <button
                className={scenario.id === activeScenario.id ? "active" : ""}
                type="button"
                key={scenario.id}
                onClick={() => setActiveScenario(scenario)}
              >
                {scenario.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="presentation-strip" aria-label="Resumen de valor">
        <span>
          <Factory size={17} aria-hidden="true" />
          Contexto industrial
        </span>
        <span>
          <Sparkles size={17} aria-hidden="true" />
          IA asistida
        </span>
        <span>
          <ShieldAlert size={17} aria-hidden="true" />
          Derivación técnica prudente
        </span>
        <span>
          <BarChart3 size={17} aria-hidden="true" />
          Panel comercial
        </span>
      </section>

      <section className="company-context-section">
        <div className="section-title compact-title">
          <span>Contexto real de empresa</span>
          <h2>Un copiloto afinado para protección en altura, no para atención genérica</h2>
          <p>
            La base de conocimiento se ha ampliado con información pública de Protecciones Toledo:
            fabricación propia, protección colectiva, sistemas de borde, bases, casquillos y revisión
            técnica prudente.
          </p>
        </div>
        <div className="context-card-grid">
          {companyContextCards.map((item) => {
            const Icon = item.icon;

            return (
              <article className="context-card" key={item.title}>
                <Icon size={22} aria-hidden="true" />
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="benefit-section" id="proceso">
        <div className="section-title compact-title">
          <span>Proceso comercial</span>
          <h2>Del primer mensaje a una oportunidad revisable</h2>
        </div>
        <div className="benefit-grid">
          {companyBenefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <article className="benefit-card" key={benefit.title}>
                <Icon size={22} aria-hidden="true" />
                <strong>{benefit.title}</strong>
                <p>{benefit.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="demo-copilot-section demo-workbench" id="copiloto">
        <div className="demo-section-title">
          <span className="eyebrow">Herramienta interactiva</span>
          <h2>Prueba la experiencia del cliente</h2>
          <p>
            Usa un caso rapido o escribe una consulta libre. El copiloto pregunta lo necesario,
            clasifica la solicitud y genera una ficha para el panel interno.
          </p>
        </div>

        <div className="demo-copilot-layout">
          <aside className="demo-guide-card polished-guide" aria-label="Guia de presentacion">
            <strong>Guion de presentacion</strong>
            <ol>
              <li>El cliente describe su necesidad en lenguaje natural.</li>
              <li>El copiloto orienta familia, prioridad y datos faltantes.</li>
              <li>Las dudas técnicas sensibles se derivan sin prometer cumplimiento.</li>
              <li>La solicitud queda disponible en el panel comercial.</li>
            </ol>
            <a className="button button-secondary" href="/admin-demo">
              Ver panel interno
            </a>
            <p className="guide-note">
              La memoria académica del proyecto está separada en <a href="/practicas">/practicas</a>.
            </p>
          </aside>

          <ChatWidget />
        </div>
      </section>

      <section className="panel-preview-section">
        <div className="panel-preview-copy">
          <span className="eyebrow">Vista interna</span>
          <h2>El equipo no recibe una conversación suelta, recibe una ficha</h2>
          <p>
            El panel agrupa solicitudes, estados, prioridades, riesgo técnico y resumen comercial
            para que la demo muestre el ciclo completo.
          </p>
          <a className="button button-primary" href="/admin-demo">
            Abrir panel <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="panel-preview-card" aria-label="Vista previa del panel">
          <div className="preview-row preview-head">
            <span>Familia</span>
            <span>Prioridad</span>
            <span>Estado</span>
          </div>
          <div className="preview-row">
            <span>Protección provisional</span>
            <strong>Alta</strong>
            <em>Nueva</em>
          </div>
          <div className="preview-row">
            <span>Documentación técnica</span>
            <strong>Revisión</strong>
            <em>Técnica</em>
          </div>
          <div className="preview-summary">
            <FileCheck2 size={20} aria-hidden="true" />
            <p>Resumen comercial listo para seguimiento y respuesta.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
