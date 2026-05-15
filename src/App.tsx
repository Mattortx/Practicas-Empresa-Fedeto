import { Building2, FileText, Lock, Wrench } from "lucide-react";
import { ChatWidget } from "./components/ChatWidget";
import { createAssistantEngine } from "./domain/assistantEngine";

const engine = createAssistantEngine();
const knowledgeBase = engine.getKnowledgeBase();

function App() {
  return (
    <main className="app-layout">
      <section className="workspace-panel">
        <div className="brand-block">
          <span className="brand-mark">PT</span>
          <div>
            <p>Demo FEDETO</p>
            <h1>Asistente inteligente para Protecciones Toledo</h1>
          </div>
        </div>

        <div className="snapshot-grid" aria-label="Resumen del MVP">
          <div className="snapshot-item">
            <Building2 size={20} aria-hidden="true" />
            <span>Orientacion comercial tecnica</span>
          </div>
          <div className="snapshot-item">
            <FileText size={20} aria-hidden="true" />
            <span>Contenido local editable</span>
          </div>
          <div className="snapshot-item">
            <Lock size={20} aria-hidden="true" />
            <span>Sin almacenamiento personal</span>
          </div>
          <div className="snapshot-item">
            <Wrench size={20} aria-hidden="true" />
            <span>Reglas explicables</span>
          </div>
        </div>

        <section className="category-panel" aria-labelledby="categories-title">
          <div className="section-heading">
            <p>Base de conocimiento</p>
            <h2 id="categories-title">Categorias principales</h2>
          </div>
          <div className="category-list">
            {knowledgeBase.categories.map((category) => (
              <article className="category-card" key={category.id}>
                <div>
                  <strong>{category.label}</strong>
                  <p>{category.description}</p>
                </div>
                <a href={category.link} target="_blank" rel="noreferrer">
                  Fuente
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="guardrail-panel" aria-label="Limites del asistente">
          <strong>Guardrail tecnico</strong>
          <p>{knowledgeBase.assistant.normativeGuardrail}</p>
        </section>
      </section>

      <ChatWidget />
    </main>
  );
}

export default App;
