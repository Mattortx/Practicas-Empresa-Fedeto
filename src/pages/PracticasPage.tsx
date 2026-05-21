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
  "Construir una prueba de concepto util para cualificar consultas comerciales.",
  "Separar la experiencia de cliente de la memoria academica del proyecto.",
  "Integrar IA generativa con reglas locales y validaciones prudentes.",
  "Persistir solicitudes y eventos para simular un flujo comercial completo."
];

const architectureLayers = [
  {
    icon: Layers3,
    title: "Experiencia",
    text: "React y Vite organizan demo funcional, panel interno y memoria de practicas."
  },
  {
    icon: ServerCog,
    title: "API",
    text: "Node expone rutas para IA, leads, eventos, healthchecks y webhook opcional."
  },
  {
    icon: DatabaseZap,
    title: "Datos",
    text: "Supabase guarda solicitudes, estados y trazabilidad basica de eventos."
  },
  {
    icon: Sparkles,
    title: "IA",
    text: "Groq asiste en clasificacion, resumen y respuesta, con fallback local."
  }
];

const methodology = [
  {
    title: "Analisis del dominio",
    text: "Se identificaron familias comerciales, datos necesarios y situaciones que requieren revision tecnica."
  },
  {
    title: "Prototipado funcional",
    text: "Se desarrollo una conversacion guiada capaz de convertir mensajes libres en solicitudes estructuradas."
  },
  {
    title: "Integracion y despliegue",
    text: "Se separo frontend, backend, base de datos y variables secretas para preparar una demo online."
  },
  {
    title: "Validacion de seguridad",
    text: "Se anadieron guardrails para no confirmar normativa, calculos, montaje ni resistencia desde IA."
  }
];

const familyCardDetails: Record<ProductFamilyId, string[]> = {
  provisional: ["soporte", "perforacion", "longitud", "urgencia"],
  definitiva: ["entorno", "fijacion", "uso permanente", "documentacion"],
  "bases-casquillos": ["tipo de pieza", "soporte", "cantidad", "compatibilidad"],
  auxiliares: ["producto", "uso previsto", "cantidad", "entrega"],
  consumibles: ["referencia", "cantidad", "reposicion", "suministro"],
  medida: ["problema", "restricciones", "planos", "plazo"]
};

export function PracticasPage() {
  return (
    <main className="public-page academic-page">
      <Header section="practicas" />

      <section className="academic-hero">
        <div className="academic-hero-copy">
          <span className="eyebrow">Proyecto de practicas FEDETO</span>
          <h1>Memoria academica del copiloto comercial</h1>
          <p>
            Documentacion visual del prototipo: problema abordado, decisiones tecnicas,
            arquitectura, metodologia, limites de IA y evidencias de funcionamiento.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="/">
              Abrir demo funcional
            </a>
            <a className="button button-secondary" href="/admin-demo">
              Ver panel interno
            </a>
          </div>
        </div>

        <div className="academic-cover" aria-label="Resumen del proyecto">
          <div className="report-sheet">
            <span>Informe tecnico</span>
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
              El proyecto demuestra como una interfaz conversacional puede ordenar la entrada
              de informacion, orientar al cliente, detectar riesgos tecnicos y preparar una
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
          <span>Metodologia</span>
          <h2>Fases de trabajo y criterios de validacion</h2>
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
          <strong>Buenas practicas aplicadas.</strong> Las claves se configuran como secretos del
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
          <h2>El sistema asiste, pero no sustituye la revision tecnica</h2>
          <p>
            La aplicacion esta disenada para preparar contexto comercial. Las decisiones sobre
            normativa, certificacion, calculo, montaje, anclaje o resistencia se derivan a
            personal competente.
          </p>
        </div>
        <div className="safety-grid">
          <span>
            <ShieldAlert size={18} aria-hidden="true" />
            Deteccion de riesgo tecnico
          </span>
          <span>
            <GitBranch size={18} aria-hidden="true" />
            Fallback local si falla IA
          </span>
          <span>
            <Workflow size={18} aria-hidden="true" />
            Flujo trazable para presentacion
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
