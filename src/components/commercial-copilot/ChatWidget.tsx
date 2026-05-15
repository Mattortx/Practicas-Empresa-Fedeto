import { useMemo, useState } from "react";
import { ClipboardCheck, RotateCcw, ShieldAlert } from "lucide-react";
import { getConversationFlow } from "../../data/conversationFlows";
import { controlledFaq } from "../../data/faq";
import { classifyFamilyFromText } from "../../data/productFamilies";
import type {
  ChatAction,
  ChatMessage,
  CommercialLead,
  ConversationFlow,
  ConversationStep,
  FlowId,
  LeadDraft,
  TechnicalRiskFlag
} from "../../types/commercialCopilot";
import { buildCommercialLead } from "../../utils/leadSummary";
import { saveLocalLead } from "../../utils/localLeadStore";
import { detectTechnicalRisk } from "../../utils/technicalRisk";
import { Button } from "../ui/Button";
import { NeedSelector } from "./NeedSelector";
import { ChatWindow } from "./ChatWindow";

const privacyNotice =
  "Los datos introducidos se utilizaran unicamente para preparar una solicitud comercial en esta demo. No introduzca informacion sensible. La solucion definitiva debera ser revisada por el equipo tecnico de la empresa.";

const technicalGuardrail =
  "Puedo orientar de forma general, pero no confirmo normativa, certificados, ensayos, resistencias, calculos ni instrucciones de montaje. Para confirmar la solucion adecuada, el equipo tecnico debe revisar soporte, uso previsto y documentacion oficial.";

interface ChatWidgetProps {
  onLeadGenerated?: (lead: CommercialLead) => void;
}

export function ChatWidget({ onLeadGenerated }: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [welcomeMessage()]);
  const [input, setInput] = useState("");
  const [activeFlow, setActiveFlow] = useState<ConversationFlow | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [draft, setDraft] = useState<LeadDraft>({});
  const [technicalFlags, setTechnicalFlags] = useState<TechnicalRiskFlag[]>([]);
  const [privacyShown, setPrivacyShown] = useState(false);
  const [lastCopied, setLastCopied] = useState(false);

  const currentStep = activeFlow?.steps[currentStepIndex];
  const placeholder = currentStep?.placeholder ?? "Escribe tu consulta o elige una opcion...";

  const isInFlow = Boolean(activeFlow && currentStep);

  const helperText = useMemo(() => {
    if (!activeFlow) {
      return "Modo demo: reglas controladas, sin IA externa y sin envio automatico.";
    }

    return `Cualificando: ${activeFlow.label}`;
  }, [activeFlow]);

  function handleSubmit(rawValue: string) {
    const value = rawValue.trim();

    if (!value) {
      return;
    }

    setInput("");
    appendUser(value);

    if (isInFlow && activeFlow && currentStep) {
      handleStepAnswer(activeFlow, currentStep, value);
      return;
    }

    handleFreeText(value);
  }

  function handleAction(action: ChatAction) {
    appendUser(action.label);

    if (action.value.startsWith("flow:")) {
      startFlow(action.value.replace("flow:", "") as FlowId);
      return;
    }

    if (action.value === "restart") {
      restart();
      return;
    }

    if (action.value === "admin") {
      window.location.href = "/admin-demo";
      return;
    }
  }

  function handleFreeText(value: string) {
    const flags = detectTechnicalRisk(value);

    if (flags.length > 0) {
      appendAssistant({
        text: `${technicalGuardrail}\n\nSi quieres, preparo una consulta tecnica documentada para el equipo de Protecciones Toledo.`,
        actions: [
          { label: "Preparar consulta tecnica", value: "flow:documentacion", variant: "warning" },
          { label: "Volver al menu", value: "restart", variant: "secondary" }
        ]
      });
      return;
    }

    const faq = controlledFaq.find((item) =>
      item.keywords.some((keyword) => normalize(value).includes(normalize(keyword)))
    );

    if (faq) {
      appendAssistant({
        text: faq.answer,
        actions: [
          { label: "Solicitar presupuesto", value: "flow:presupuesto", variant: "primary" },
          { label: "Ver opciones", value: "restart", variant: "secondary" }
        ]
      });
      return;
    }

    if (normalize(value).includes("presupuesto") || normalize(value).includes("oferta")) {
      startFlow("presupuesto");
      return;
    }

    const family = classifyFamilyFromText(value);

    if (family) {
      startFlow(family.id);
      return;
    }

    appendAssistant({
      text:
        "Para orientar bien la consulta necesito clasificar la necesidad. Puedes elegir una opcion o describir si se trata de proteccion provisional, definitiva, fijaciones, consumibles o una solucion a medida.",
      actions: [
        { label: "No se que necesito", value: "flow:desconocido", variant: "secondary" },
        { label: "Solicitar presupuesto", value: "flow:presupuesto", variant: "primary" },
        { label: "Documentacion o normativa", value: "flow:documentacion", variant: "warning" }
      ]
    });
  }

  function startFlow(flowId: FlowId) {
    const flow = getConversationFlow(flowId);

    if (!flow) {
      return;
    }

    setActiveFlow(flow);
    setCurrentStepIndex(0);
    setDraft({ needType: flow.needType });
    setTechnicalFlags(flow.technicalReviewRequired ? ["documentacion_tecnica"] : []);
    setPrivacyShown(false);

    appendAssistant({
      text: `${flow.intro}\n\n${flow.steps[0].prompt}`
    });
  }

  function handleStepAnswer(flow: ConversationFlow, step: ConversationStep, value: string) {
    const validation = validateStep(step, value);

    if (!validation.valid) {
      appendAssistant({ text: validation.error });
      return;
    }

    const nextDraft = { ...draft, [step.field]: validation.value };
    const nextFlags = Array.from(new Set([...technicalFlags, ...detectTechnicalRisk(value)]));
    const nextIndex = currentStepIndex + 1;

    setDraft(nextDraft);
    setTechnicalFlags(nextFlags);
    setCurrentStepIndex(nextIndex);

    const nextStep = flow.steps[nextIndex];

    if (!nextStep) {
      completeFlow(flow, nextDraft, nextFlags);
      return;
    }

    if (!privacyShown && isContactStep(nextStep)) {
      setPrivacyShown(true);
      appendAssistant({
        text: `${privacyNotice}\n\n${nextStep.prompt}`
      });
      return;
    }

    appendAssistant({ text: nextStep.prompt });
  }

  function completeFlow(
    flow: ConversationFlow,
    completedDraft: LeadDraft,
    completedFlags: TechnicalRiskFlag[]
  ) {
    const lead = buildCommercialLead(completedDraft, flow, completedFlags);
    saveLocalLead(lead);
    onLeadGenerated?.(lead);

    appendAssistant({
      text:
        "Solicitud preparada para el equipo comercial. En esta prueba de concepto se conserva solo de forma local o simulada.",
      lead,
      actions: [
        { label: "Ver en panel interno", value: "admin", variant: "primary" },
        { label: "Nueva consulta", value: "restart", variant: "secondary" }
      ]
    });

    setActiveFlow(null);
    setCurrentStepIndex(0);
    setDraft({});
    setTechnicalFlags([]);
    setPrivacyShown(false);
  }

  function restart() {
    setMessages([welcomeMessage()]);
    setActiveFlow(null);
    setCurrentStepIndex(0);
    setDraft({});
    setTechnicalFlags([]);
    setPrivacyShown(false);
  }

  async function copyText(text: string) {
    await navigator.clipboard.writeText(text);
    setLastCopied(true);
    window.setTimeout(() => setLastCopied(false), 1800);
  }

  function appendUser(text: string) {
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", text }
    ]);
  }

  function appendAssistant(message: Omit<ChatMessage, "id" | "role">) {
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "assistant", ...message }
    ]);
  }

  return (
    <section className="copilot-shell" id="copiloto" aria-label="Copiloto comercial">
      <header className="copilot-header">
        <div>
          <span>Copiloto comercial</span>
          <h2>Clasifica, cualifica y resume consultas</h2>
        </div>
        <Button variant="ghost" onClick={restart}>
          <RotateCcw size={16} aria-hidden="true" />
          Reiniciar
        </Button>
      </header>

      <div className="copilot-alert">
        <ShieldAlert size={18} aria-hidden="true" />
        <p>{technicalGuardrail}</p>
      </div>

      <NeedSelector onSelect={handleAction} />

      <ChatWindow
        messages={messages}
        input={input}
        placeholder={placeholder}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        onAction={handleAction}
        onCopy={copyText}
      />

      <footer className="copilot-footer">
        <span>{helperText}</span>
        {lastCopied && (
          <span className="copy-confirmation">
            <ClipboardCheck size={15} aria-hidden="true" />
            Resumen copiado
          </span>
        )}
      </footer>
    </section>
  );
}

function welcomeMessage(): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    text:
      "Hola. Soy el copiloto comercial de Protecciones Toledo. Puedo ayudarte a orientar tu consulta sobre sistemas de proteccion de borde, bases, casquillos, auxiliares, consumibles o soluciones a medida. Para cuestiones tecnicas definitivas, nuestro equipo revisara tu caso de forma personalizada.",
    actions: [
      { label: "Solicitar presupuesto", value: "flow:presupuesto", variant: "primary" },
      { label: "No se que necesito", value: "flow:desconocido", variant: "secondary" },
      { label: "Documentacion o normativa", value: "flow:documentacion", variant: "warning" }
    ]
  };
}

function validateStep(step: ConversationStep, rawValue: string) {
  const value = rawValue.trim();

  if (step.required !== false && !value) {
    return { valid: false as const, error: "Necesito este dato para preparar un resumen comercial util." };
  }

  if (!value && step.required === false) {
    return { valid: true as const, value: "No indicado" };
  }

  if (step.field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return {
      valid: false as const,
      error: "El correo no parece valido. Escribelo con formato nombre@empresa.com."
    };
  }

  return { valid: true as const, value };
}

function isContactStep(step: ConversationStep) {
  return ["name", "company", "email", "phone"].includes(step.field);
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
