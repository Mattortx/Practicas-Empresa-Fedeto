import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  ChartColumn,
  ChartLine,
  ClipboardCheck,
  Factory,
  FileCheck2,
  Gauge,
  MessageSquareText,
  PieChart,
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
        <div className="context-card-grid reveal-group">
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
        <div className="benefit-grid reveal-group">
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

      <section className="demo-copilot-section" id="copiloto">
        <div className="demo-section-title">
          <span className="eyebrow">Herramienta interactiva</span>
          <h2>Prueba la experiencia del cliente</h2>
          <p>
            Elige un caso rápido o escribe tu consulta. El copiloto te guía, clasifica la solicitud
            y la deja lista para el panel interno.
          </p>
        </div>

        <div className="demo-copilot-layout">
          <div className="how-it-works reveal-group" aria-label="Cómo funciona">
            <div className="how-step">
              <span className="how-step-icon">
                <MessageSquareText size={22} aria-hidden="true" />
              </span>
              <strong>Describe tu necesidad</strong>
              <p>El cliente explica su caso en lenguaje natural.</p>
            </div>
            <div className="how-step">
              <span className="how-step-icon">
                <Sparkles size={22} aria-hidden="true" />
              </span>
              <strong>El copiloto clasifica</strong>
              <p>Orienta familia, prioridad y detecta riesgo técnico.</p>
            </div>
            <div className="how-step">
              <span className="how-step-icon">
                <ClipboardCheck size={22} aria-hidden="true" />
              </span>
              <strong>Recibe una ficha</strong>
              <p>La solicitud queda lista para revisar en el panel interno.</p>
            </div>
            <div className="how-step">
              <span className="how-step-icon">
                <ShieldAlert size={22} aria-hidden="true" />
              </span>
              <strong>Derivación técnica</strong>
              <p>Si hay normativa, montaje o cálculos, se marca para revisión del equipo técnico.</p>
            </div>
            <div className="how-step">
              <span className="how-step-icon">
                <UsersRound size={22} aria-hidden="true" />
              </span>
              <strong>Seguimiento comercial</strong>
              <p>El equipo revisa la ficha y responde con la información ya estructurada.</p>
            </div>
            <div className="how-step">
              <span className="how-step-icon">
                <FileCheck2 size={22} aria-hidden="true" />
              </span>
              <strong>Historial en panel</strong>
              <p>Cada conversación deja una ficha disponible en el panel interno para su consulta.</p>
            </div>
            <div className="how-step">
              <span className="how-step-icon">
                <BarChart3 size={22} aria-hidden="true" />
              </span>
              <strong>Análisis de patrones</strong>
              <p>Los datos agregados revelan tendencias y ayudan a anticipar oportunidades comerciales.</p>
            </div>
          </div>

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

      <section className="analytics-preview-section">
        <div className="analytics-preview-copy">
          <span className="eyebrow">Analíticas</span>
          <h2>Distribución, prioridad y evolución de las solicitudes</h2>
          <p>
            Los informes agrupan las solicitudes por familia de producto, prioridad comercial,
            estado de seguimiento y evolución temporal. Ayudan a entender qué tipo de consultas
            llegan y con qué urgencia.
          </p>
          <a className="button button-primary" href="/admin-demo/analytics">
            Ver informes <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="analytics-preview-card" aria-label="Vista previa de analíticas">
          <div className="analytics-preview-header">
            <ChartColumn size={20} aria-hidden="true" />
            <span>Lectura comercial</span>
          </div>
          <div className="analytics-preview-grid">
            <div className="analytics-preview-metric">
              <span>Familia dominante</span>
              <strong>Provisional</strong>
            </div>
            <div className="analytics-preview-metric">
              <span>Carga técnica</span>
              <strong>42%</strong>
            </div>
            <div className="analytics-preview-metric">
              <span>Prioridad alta</span>
              <strong>8</strong>
            </div>
            <div className="analytics-preview-metric">
              <span>Seguimiento</span>
              <strong>12 abiertas</strong>
            </div>
          </div>
          <div className="analytics-preview-charts">
            <div className="preview-chart-bar">
              <span className="preview-chart-label">Por familia</span>
              <div className="preview-bar-track">
                <span className="preview-bar-fill" style={{ width: "48%" }}>Provisional</span>
                <span className="preview-bar-fill" style={{ width: "32%" }}>Definitiva</span>
                <span className="preview-bar-fill" style={{ width: "20%" }}>Bases</span>
              </div>
            </div>
            <div className="preview-chart-donut">
              <span className="preview-chart-label">Prioridad</span>
              <div className="preview-donut-track">
                <span className="preview-donut-segment alta" />
                <span className="preview-donut-segment media" />
                <span className="preview-donut-segment baja" />
                <strong>24</strong>
              </div>
            </div>
          </div>
          <div className="analytics-preview-footer">
            <ChartLine size={16} aria-hidden="true" />
            <span>Evolución temporal y tabla resumen disponibles en informes</span>
            <PieChart size={16} aria-hidden="true" />
          </div>
        </div>
      </section>
    </main>
  );
}
