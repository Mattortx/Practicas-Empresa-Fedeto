import {
  ArrowRight,
  ClipboardCheck,
  Factory,
  FileSearch,
  Gauge,
  Handshake,
  Route,
  ShieldAlert
} from "lucide-react";
import { ChatWidget } from "../components/commercial-copilot/ChatWidget";
import { Header } from "../components/layout/Header";
import { Notice } from "../components/ui/Notice";
import { productFamilies } from "../data/productFamilies";
import type { ProductFamilyId } from "../types/commercialCopilot";

const valueItems = [
  "Cualificación rápida de consultas.",
  "Orientación hacia la familia de producto adecuada.",
  "Recogida ordenada de datos comerciales.",
  "Derivación al equipo técnico/comercial.",
  "Reducción de consultas incompletas."
];

const technicalStripItems = [
  "Fabricación propia",
  "Protección colectiva",
  "Obra y mantenimiento",
  "Cubiertas técnicas",
  "Documentación técnica",
  "Soluciones a medida"
];

const familyCardDetails: Record<ProductFamilyId, string[]> = {
  provisional: ["soporte", "perforación", "longitud", "urgencia"],
  definitiva: ["entorno", "fijación", "uso permanente", "documentación"],
  "bases-casquillos": ["tipo de pieza", "soporte", "cantidad", "compatibilidad"],
  auxiliares: ["producto", "uso previsto", "cantidad", "entrega"],
  consumibles: ["referencia", "cantidad", "reposición", "suministro"],
  medida: ["problema", "restricciones", "planos", "plazo"]
};

export function PublicDemoPage() {
  return (
    <main className="public-page">
      <Header />

      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Demo de prácticas FEDETO</span>
          <h1>Copiloto comercial para consultas de protección en altura</h1>
          <p>
            Una prueba de concepto para Protecciones Toledo: el usuario conversa con un
            chatbot integrado, mientras el sistema clasifica la necesidad, recoge datos útiles
            y genera una ficha comercial para revisión interna.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#copiloto">
              Probar copiloto <ArrowRight size={17} aria-hidden="true" />
            </a>
            <a className="button button-secondary" href="/admin-demo">
              Ver panel comercial demo
            </a>
          </div>
          <div className="hero-proof-grid" aria-label="Indicadores de la demo">
            <span>IA opcional</span>
            <span>Fallback local</span>
            <span>Panel interno</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Esquema del copiloto comercial">
          <div className="visual-header">
            <Factory size={22} aria-hidden="true" />
            <span>Flujo comercial técnico</span>
          </div>
          <div className="industrial-scene" aria-hidden="true">
            <div className="scene-roof">
              <span className="scene-post scene-post-left" />
              <span className="scene-post scene-post-center" />
              <span className="scene-post scene-post-right" />
              <span className="scene-rail scene-rail-top" />
              <span className="scene-rail scene-rail-mid" />
              <span className="scene-toeboard" />
            </div>
            <div className="scene-panel scene-panel-left">
              <strong>Alta</strong>
              <span>Prioridad</span>
            </div>
            <div className="scene-panel scene-panel-right">
              <strong>Sí</strong>
              <span>Revisión</span>
            </div>
          </div>
          <ol>
            <li>
              <Route size={18} aria-hidden="true" />
              Usuario describe la necesidad
            </li>
            <li>
              <Gauge size={18} aria-hidden="true" />
              Copiloto clasifica familia y prioridad
            </li>
            <li>
              <ClipboardCheck size={18} aria-hidden="true" />
              Se genera resumen comercial
            </li>
            <li>
              <Handshake size={18} aria-hidden="true" />
              Equipo revisa y responde
            </li>
          </ol>
        </div>
      </section>

      <section className="technical-strip" aria-label="Contexto industrial de la demo">
        {technicalStripItems.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </section>

      <section className="value-section">
        <div className="section-title">
          <span>Valor para la empresa</span>
          <h2>Un chatbot visible con lógica de copiloto comercial</h2>
        </div>
        <div className="value-grid">
          {valueItems.map((item) => (
            <article className="value-card" key={item}>
              <ClipboardCheck size={20} aria-hidden="true" />
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="families-section" id="familias">
        <div className="section-title">
          <span>Familias orientadas</span>
          <h2>Líneas comerciales contempladas en la demo</h2>
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

      <section className="poc-section" id="poc">
        <div className="section-title">
          <span>Prueba de concepto</span>
          <h2>Qué demuestra este copiloto comercial</h2>
          <p>
            Esta sección explica la POC antes de probar la herramienta. El objetivo es mostrar
            cómo una conversación puede convertirse en una solicitud comercial ordenada, sin
            sustituir la revisión técnica de Protecciones Toledo.
          </p>
        </div>

        <div className="poc-grid">
          <article className="poc-card">
            <Route size={20} aria-hidden="true" />
            <strong>Entrada conversaciónal</strong>
            <p>El cliente describe una necesidad real de obra, mantenimiento o suministro.</p>
          </article>
          <article className="poc-card">
            <Gauge size={20} aria-hidden="true" />
            <strong>Clasificación comercial</strong>
            <p>El sistema orienta la consulta hacia una familia y estima prioridad.</p>
          </article>
          <article className="poc-card">
            <FileSearch size={20} aria-hidden="true" />
            <strong>Ficha para revisión</strong>
            <p>La solicitud queda resumida para el equipo comercial o técnico.</p>
          </article>
        </div>

        <div className="copilot-context poc-warning-panel">
          <span className="eyebrow">Copiloto integrado</span>
          <h2>De conversación a oportunidad comercial cualificada</h2>
          <p>
            El copiloto no sustituye al equipo técnico. Su función es estructurar la primera
            consulta para que Protecciones Toledo reciba mejor contexto: familia probable,
            tipo de obra, ubicación, urgencia, datos de contacto y advertencias.
          </p>
          <Notice>
            <strong>Aviso técnico y de privacidad.</strong> Las soluciones definitivas deben ser
            validadas por personal competente. No se ofrecen cálculos estructurales automáticos
            ni confirmaciones normativas. En esta prueba, las solicitudes se conservan solo de
            forma local o simulada.
          </Notice>
          <div className="context-list">
            <span>
              <ShieldAlert size={17} aria-hidden="true" />
              Detecta consultas técnicas sensibles
            </span>
            <span>
              <FileSearch size={17} aria-hidden="true" />
              Prepara resumen para revisión interna
            </span>
          </div>
        </div>
      </section>

      <section className="demo-copilot-section">
        <div className="demo-section-title">
          <span className="eyebrow">Demo interactiva</span>
          <h2>Prueba el copiloto comercial</h2>
          <p>
            Este módulo es la parte funciónal de la demo. Puedes simular una consulta, generar
            una solicitud comercial y verla después en el panel interno.
          </p>
        </div>

        <div className="demo-copilot-layout">
          <aside className="demo-guide-card" aria-label="Guía breve de uso">
            <strong>Cómo probarlo</strong>
            <ol>
              <li>Usa un caso rápido o escribe una consulta libre.</li>
              <li>Responde las preguntas guiadas con datos de demo.</li>
              <li>Genera el resumen comercial.</li>
              <li>Abre el panel interno para revisar la solicitud.</li>
            </ol>
            <a className="button button-secondary" href="/admin-demo">
              Ver panel comercial demo
            </a>
          </aside>

          <ChatWidget />
        </div>
      </section>
    </main>
  );
}
