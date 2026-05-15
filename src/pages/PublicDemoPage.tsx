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

const valueItems = [
  "Cualificacion rapida de consultas.",
  "Orientacion hacia la familia de producto adecuada.",
  "Recogida ordenada de datos comerciales.",
  "Derivacion al equipo tecnico/comercial.",
  "Reduccion de consultas incompletas."
];

export function PublicDemoPage() {
  return (
    <main className="public-page">
      <Header />

      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Demo de practicas FEDETO</span>
          <h1>Copiloto comercial para consultas de proteccion en altura</h1>
          <p>
            Una prueba de concepto para Protecciones Toledo: el usuario conversa con un
            chatbot integrado, mientras el sistema clasifica la necesidad, recoge datos utiles
            y genera una ficha comercial para revision interna.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#copiloto">
              Probar copiloto <ArrowRight size={17} aria-hidden="true" />
            </a>
            <a className="button button-secondary" href="/admin-demo">
              Ver panel interno
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-label="Esquema del copiloto comercial">
          <div className="visual-header">
            <Factory size={22} aria-hidden="true" />
            <span>Flujo comercial tecnico</span>
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

      <section className="value-section">
        <div className="section-title">
          <span>Valor para la empresa</span>
          <h2>Un chatbot visible con logica de copiloto comercial</h2>
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
          <h2>Lineas comerciales contempladas en la demo</h2>
        </div>
        <div className="family-grid">
          {productFamilies.map((family) => (
            <article className={`family-card family-${family.accent}`} key={family.id}>
              <strong>{family.label}</strong>
              <p>{family.description}</p>
              <small>{family.examples.join(" / ")}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="copilot-section">
        <div className="copilot-context">
          <span className="eyebrow">Copiloto integrado</span>
          <h2>De conversacion a oportunidad comercial cualificada</h2>
          <p>
            El copiloto no sustituye al equipo tecnico. Su funcion es estructurar la primera
            consulta para que Protecciones Toledo reciba mejor contexto: familia probable,
            tipo de obra, ubicacion, urgencia, datos de contacto y advertencias.
          </p>
          <Notice>
            <strong>Aviso tecnico y de privacidad.</strong> Las soluciones definitivas deben ser
            validadas por personal competente. No se ofrecen calculos estructurales automaticos
            ni confirmaciones normativas. En esta prueba, las solicitudes se conservan solo de
            forma local o simulada.
          </Notice>
          <div className="context-list">
            <span>
              <ShieldAlert size={17} aria-hidden="true" />
              Detecta consultas tecnicas sensibles
            </span>
            <span>
              <FileSearch size={17} aria-hidden="true" />
              Prepara resumen para revision interna
            </span>
          </div>
        </div>
        <ChatWidget />
      </section>
    </main>
  );
}
