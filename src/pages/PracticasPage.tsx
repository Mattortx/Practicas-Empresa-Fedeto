import {
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  DatabaseZap,
  FileSearch,
  Gauge,
  GitBranch,
  Layers3,
  Route,
  ServerCog,
  ShieldAlert,
  Sparkles,
  Workflow
} from "lucide-react";
import { Header } from "../components/layout/Header";
import { Notice } from "../components/ui/Notice";
import { productFamilies } from "../data/productFamilies";
import type { ProductFamilyId } from "../types/commercialCopilot";

const academicMetrics = [
  { value: "4", label: "Capas funcionales" },
  { value: "6", label: "Familias comerciales" },
  { value: "5", label: "Endpoints IA" },
  { value: "2", label: "Vistas principales" }
];

const objectives = [
  "Construir una prueba de concepto útil para cualificar consultas comerciales.",
  "Separar la experiencia de cliente de la memoria académica del proyecto.",
  "Integrar IA generativa con reglas locales y validaciones prudentes.",
  "Persistir solicitudes y eventos para simular un flujo comercial completo."
];

const projectNarrative = [
  {
    title: "Problema de partida",
    text:
      "Una consulta sobre protección en altura suele llegar incompleta: falta tipo de obra, soporte, longitud, urgencia, documentación o datos de contacto. El MVP ordena esa entrada sin sustituir al equipo técnico."
  },
  {
    title: "Hipótesis del MVP",
    text:
      "Un chatbot integrado en la web puede funcionar como copiloto comercial si combina conversación guiada, clasificación por familias de producto y resumen interno para seguimiento."
  },
  {
    title: "Criterio profesional",
    text:
      "La demo evita prometer cumplimiento normativo, cálculos, montaje o resistencia. Cuando aparecen términos sensibles, deriva la consulta para revisión técnica."
  }
];

const demoDeliverables = [
  "Vista pública con explicación del copiloto y caso de uso.",
  "Chatbot con flujos comerciales, entrada libre e IA opcional.",
  "Generación de solicitudes con prioridad y revisión técnica.",
  "Panel interno con filtros, detalle, estados y resumen comercial.",
  "Analíticas de demo con distribución, prioridad, estado y evolución.",
  "Documentación de arquitectura, límites, seguridad y despliegue."
];

const evaluationPoints = [
  "La aplicación se puede ejecutar localmente y desplegar como POC.",
  "Las claves de IA no se exponen en el frontend.",
  "El sistema funciona con IA y también con fallback local.",
  "Los textos mantienen tono técnico, comercial y prudente.",
  "El panel muestra cómo la empresa aprovecharía las solicitudes."
];

const architectureLayers = [
  {
    icon: Layers3,
    title: "Experiencia",
    text: "React y Vite organizan demo funcional, panel interno, analíticas y memoria de prácticas."
  },
  {
    icon: ServerCog,
    title: "API",
    text: "Node expone rutas para IA, leads, eventos, healthchecks y webhook opcional."
  },
  {
    icon: DatabaseZap,
    title: "Datos",
    text: "Supabase guarda solicitudes, estados y trazabilidad básica de eventos."
  },
  {
    icon: Sparkles,
    title: "IA",
    text: "Groq asiste en clasificación, resumen y respuesta, con fallback local."
  }
];

const methodology = [
  {
    title: "Análisis del dominio",
    text: "Se identificaron familias comerciales, datos necesarios y situaciones que requieren revisión técnica."
  },
  {
    title: "Prototipado funcional",
    text: "Se desarrolló una conversación guiada capaz de convertir mensajes libres en solicitudes estructuradas."
  },
  {
    title: "Integración y despliegue",
    text: "Se separó frontend, backend, base de datos y variables secretas para preparar una demo online."
  },
  {
    title: "Validación de seguridad",
    text: "Se añadieron guardrails para no confirmar normativa, cálculos, montaje ni resistencia desde IA."
  }
];

const familyCardDetails: Record<ProductFamilyId, string[]> = {
  provisional: ["soporte", "perforación", "longitud", "urgencia"],
  definitiva: ["entorno", "fijación", "uso permanente", "documentación"],
  "bases-casquillos": ["tipo de pieza", "soporte", "cantidad", "compatibilidad"],
  auxiliares: ["producto", "uso previsto", "cantidad", "entrega"],
  consumibles: ["referencia", "cantidad", "reposición", "suministro"],
  medida: ["problema", "restricciones", "planos", "plazo"]
};

export function PracticasPage() {
  return (
    <main className="public-page academic-page">
      <Header section="practicas" />

      <section className="academic-hero">
        <div className="academic-hero-copy">
          <span className="eyebrow">Proyecto de prácticas FEDETO</span>
          <h1>Memoria académica del copiloto comercial</h1>
          <p>
            Documentación visual del prototipo: problema abordado, decisiones técnicas,
            arquitectura, metodología, límites de IA y evidencias de funcionamiento.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="/">
              Abrir demo funcional
            </a>
            <a className="button button-secondary" href="/admin-demo">
              Ver panel interno
            </a>
            <a className="button button-secondary" href="/admin-demo/analytics">
              Ver analíticas
            </a>
          </div>
        </div>

        <div className="academic-cover" aria-label="Resumen del proyecto">
          <div className="report-sheet">
            <span>Informe técnico</span>
            <strong>Copiloto Comercial Protecciones Toledo</strong>
            <p>POC web con IA, backend, Supabase y despliegue online.</p>
            <div className="report-lines" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="academic-metrics">
            {academicMetrics.map((metric) => (
              <div key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="academic-summary">
        <article className="abstract-card">
          <BookOpenCheck size={23} aria-hidden="true" />
          <div>
            <span className="eyebrow">Resumen ejecutivo</span>
            <h2>De una consulta informal a un flujo comercial medible</h2>
            <p>
              El proyecto demuestra cómo una interfaz conversacional puede ordenar la entrada
              de información, orientar al cliente, detectar riesgos técnicos y preparar una
              ficha revisable por el equipo de Protecciones Toledo.
            </p>
          </div>
        </article>
        <div className="objective-list" aria-label="Objetivos del proyecto">
          {objectives.map((objective) => (
            <div key={objective}>
              <CheckCircle2 size={18} aria-hidden="true" />
              <span>{objective}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="academic-section project-explainer-section">
        <div className="section-title compact-title">
          <span>Alcance del proyecto</span>
          <h2>Una POC pensada para defender valor técnico y valor empresarial</h2>
          <p>
            La aplicación se ha planteado como un MVP realista para prácticas: una sola web,
            una experiencia de cliente, un panel interno simulado y una capa de IA segura que
            ayuda a clasificar sin inventar información técnica.
          </p>
        </div>

        <div className="project-narrative-grid reveal-group">
          {projectNarrative.map((item, index) => (
            <article className="project-narrative-card" key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="academic-section project-deliverables-section">
        <div className="deliverables-panel">
          <div>
            <span className="eyebrow">Entregables demostrables</span>
            <h2>Qué se puede enseñar en una defensa de prácticas</h2>
            <p>
              La demo cubre el ciclo completo: captación, conversación, cualificación, generación
              de ficha, revisión interna y lectura analítica de oportunidades.
            </p>
          </div>
          <div className="deliverables-grid">
            {demoDeliverables.map((item) => (
              <span key={item}>
                <CheckCircle2 size={17} aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="evaluation-panel">
          <span className="eyebrow">Criterios de evaluación</span>
          <h2>Por qué la solución es defendible</h2>
          {evaluationPoints.map((item) => (
            <div key={item}>
              <ClipboardCheck size={17} aria-hidden="true" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="academic-section" id="arquitectura">
        <div className="section-title compact-title">
          <span>Arquitectura</span>
          <h2>Separacion clara entre interfaz, API, datos e IA</h2>
          <p>
            El prototipo se despliega como una experiencia web conectada a un backend que
            centraliza las operaciones sensibles y conserva las claves fuera del frontend.
          </p>
        </div>

        <div className="architecture-diagram">
          {architectureLayers.map((layer, index) => {
            const Icon = layer.icon;

            return (
              <article className="architecture-node" key={layer.title}>
                <span className="node-index">{String(index + 1).padStart(2, "0")}</span>
                <Icon size={22} aria-hidden="true" />
                <strong>{layer.title}</strong>
                <p>{layer.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="academic-section methodology-section">
        <div className="section-title compact-title">
          <span>Metodología</span>
          <h2>Fases de trabajo y criterios de validación</h2>
        </div>
        <div className="methodology-timeline">
          {methodology.map((item, index) => (
            <article key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="academic-section evidence-section">
        <div className="evidence-panel">
          <span className="eyebrow">Evidencias funcionales</span>
          <h2>La demo se puede comprobar por rutas y healthchecks</h2>
          <div className="evidence-grid">
            <div>
              <Route size={20} aria-hidden="true" />
              <strong>/</strong>
              <span>Demo funcional</span>
            </div>
            <div>
              <FileSearch size={20} aria-hidden="true" />
              <strong>/admin-demo</strong>
              <span>Panel interno</span>
            </div>
            <div>
              <Gauge size={20} aria-hidden="true" />
              <strong>/api/ai/health</strong>
              <span>IA configurada</span>
            </div>
            <div>
              <DatabaseZap size={20} aria-hidden="true" />
              <strong>/api/health/db</strong>
              <span>Base de datos conectada</span>
            </div>
          </div>
        </div>
        <Notice>
          <strong>Buenas prácticas aplicadas.</strong> Las claves se configuran como secretos del
          entorno online. El frontend consume la API mediante URL de entorno y no expone claves
          de Groq ni Supabase.
        </Notice>
      </section>

      <section className="families-section academic-families" id="familias">
        <div className="section-title compact-title">
          <span>Dominio comercial</span>
          <h2>Familias y datos cualificados por el copiloto</h2>
        </div>
        <div className="family-grid">
          {productFamilies.map((family, index) => (
            <article className={`family-card family-${family.accent}`} key={family.id}>
              <div className="family-card-top">
                <span>{family.shortLabel}</span>
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <strong>{family.label}</strong>
              <p>{family.description}</p>
              <div className="family-subcategory-list" aria-label={`Enfoques de ${family.label}`}>
                {family.subcategories.slice(0, 3).map((subcategory) => (
                  <span key={subcategory.id}>{subcategory.label}</span>
                ))}
              </div>
              <div className="family-card-data">
                <span>Datos que cualifica</span>
                <p>{familyCardDetails[family.id].join(" / ")}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="academic-section safety-section">
        <div>
          <span className="eyebrow">Seguridad y alcance</span>
          <h2>El sistema asiste, pero no sustituye la revisión técnica</h2>
          <p>
            La aplicación está diseñada para preparar contexto comercial. Las decisiones sobre
            normativa, certificación, cálculo, montaje, anclaje o resistencia se derivan a
            personal competente.
          </p>
        </div>
        <div className="safety-grid">
          <span>
            <ShieldAlert size={18} aria-hidden="true" />
            Detección de riesgo técnico
          </span>
          <span>
            <GitBranch size={18} aria-hidden="true" />
            Fallback local si falla IA
          </span>
          <span>
            <Workflow size={18} aria-hidden="true" />
            Flujo trazable para presentación
          </span>
          <span>
            <ClipboardCheck size={18} aria-hidden="true" />
            Resumen comercial estructurado
          </span>
        </div>
      </section>
    </main>
  );
}
