import { useEffect, useMemo, useState } from "react";
import { ClipboardCheck, MessageSquareText, RotateCcw, ShieldAlert, X } from "lucide-react";
import { getConversationFlow } from "../../data/conversationFlows";
import { controlledFaq } from "../../data/faq";
import { classifyFamilyFromText } from "../../data/productFamilies";
import { getAiHealth, isAiEnabled as readAiEnabled, setAiEnabled as persistAiEnabled } from "../../services/ai/aiClient";
import { classifyLeadWithAi } from "../../services/ai/classifyLead";
import { summarizeLeadWithAi } from "../../services/ai/summarizeLead";
import type { AILeadClassification, AILeadSummary, AIProductFamily } from "../../types/ai";
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
import { logDemoEvent } from "../../utils/demoEvents";
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
  const [isOpen, setIsOpen] = useState(true);
  const [aiStatus, setAiStatus] = useState<"idle" | "thinking" | "available" | "unavailable">("idle");
  const [aiEnabled, setAiEnabledState] = useState(() => readAiEnabled());
  const [aiHealthLabel, setAiHealthLabel] = useState("Comprobando IA...");
  const [lastAiClassification, setLastAiClassification] = useState<AILeadClassification | undefined>();
  const [activeAiClassification, setActiveAiClassification] = useState<AILeadClassification | undefined>();

  const currentStep = activeFlow?.steps[currentStepIndex];
  const placeholder =
    aiStatus === "thinking"
      ? "Analizando consulta..."
      : currentStep?.placeholder ?? "Escribe tu consulta o elige una opcion...";

  const isInFlow = Boolean(activeFlow && currentStep);

  useEffect(() => {
    let cancelled = false;

    if (!aiEnabled) {
      setAiHealthLabel("Usando respuestas locales");
      return;
    }

    getAiHealth().then((health) => {
      if (!cancelled) {
        setAiHealthLabel(health.mode === "ai" ? "IA disponible" : "Modo demo sin IA");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [aiEnabled]);

  const helperText = useMemo(() => {
    if (aiStatus === "thinking") {
      return "IA opcional analizando la consulta. Los guardrails tecnicos siguen activos.";
    }

    if (aiStatus === "available") {
      return "IA opcional activa para texto libre; la cualificacion comercial sigue con flujos controlados.";
    }

    if (aiStatus === "unavailable") {
      return "IA opcional no configurada o no disponible; reglas y flujos controlados activos.";
    }

    if (!aiEnabled) {
      return "Modo local activado: solo reglas y flujos controlados.";
    }

    if (!activeFlow) {
      return "Modo demo: reglas controladas, IA opcional y sin envio automatico.";
    }

    return `Cualificando: ${activeFlow.label}`;
  }, [activeFlow, aiEnabled, aiStatus]);

  async function handleSubmit(rawValue: string) {
    const value = rawValue.trim();
    const canSkipOptionalStep = isInFlow && currentStep?.required === false;

    if (aiStatus === "thinking") {
      return;
    }

    if (!value && !canSkipOptionalStep) {
      return;
    }

    setInput("");
    appendUser(value || "No indicado");

    if (isInFlow && activeFlow && currentStep) {
      await handleStepAnswer(activeFlow, currentStep, value);
      return;
    }

    await handleFreeText(value);
  }

  function handleAction(action: ChatAction) {
    appendUser(action.label);

    if (action.value.startsWith("flow:")) {
      const flowId = action.value.replace("flow:", "") as FlowId;
      const classificationForFlow =
        lastAiClassification && resolveFlowFromClassification(lastAiClassification) === flowId
          ? lastAiClassification
          : undefined;
      startFlow(flowId, classificationForFlow);
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

  async function handleFreeText(value: string) {
    setAiStatus("idle");
    const flags = detectTechnicalRisk(value);
    const localFamily = classifyFamilyFromText(value);

    if (flags.length > 0 && !aiEnabled) {
      logDemoEvent("riesgo_tecnico_detectado", { mode: "local", flags });
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

    if (!aiEnabled) {
      if (localFamily) {
        startFlow(localFamily.id);
        return;
      }

      appendAssistant({
        text:
          "Para orientar bien la consulta necesito clasificar la necesidad. El modo local esta activo, asi que continuo con los flujos controlados.",
        actions: [
          { label: "No se que necesito", value: "flow:desconocido", variant: "secondary" },
          { label: "Solicitar presupuesto", value: "flow:presupuesto", variant: "primary" },
          { label: "Documentacion o normativa", value: "flow:documentacion", variant: "warning" }
        ]
      });
      return;
    }

    setAiStatus("thinking");
    const aiResponse = await classifyLeadWithAi(value, {
      activeFlow: activeFlow?.id ?? null,
      currentStep: currentStep?.id ?? null,
      localFamily: localFamily?.id ?? "",
      localRiskFlags: flags
    });

    setLastAiClassification(aiResponse.data);

    if (aiResponse.available) {
      setAiStatus("available");
    } else {
      setAiStatus("unavailable");
    }

    appendAssistant({
      text: buildAiAssistantText(aiResponse.data, aiResponse.available),
      actions: buildAiActions(aiResponse.data)
    });
  }

  function startFlow(flowId: FlowId, aiClassification?: AILeadClassification) {
    const flow = getConversationFlow(flowId);

    if (!flow) {
      return;
    }

    setActiveFlow(flow);
    setCurrentStepIndex(0);
    setDraft({ needType: aiClassification?.needType ?? flow.needType });
    setTechnicalFlags(flow.technicalReviewRequired || aiClassification?.requiresTechnicalReview ? ["documentacion_tecnica"] : []);
    setPrivacyShown(false);
    setActiveAiClassification(aiClassification);
    setAiStatus("idle");

    appendAssistant({
      text: `${flow.intro}\n\n${flow.steps[0].prompt}`
    });
  }

  async function handleStepAnswer(flow: ConversationFlow, step: ConversationStep, value: string) {
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
      await completeFlow(flow, nextDraft, nextFlags);
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

  async function completeFlow(
    flow: ConversationFlow,
    completedDraft: LeadDraft,
    completedFlags: TechnicalRiskFlag[]
  ) {
    setAiStatus(aiEnabled ? "thinking" : "idle");
    const baseLead = buildCommercialLead(completedDraft, flow, completedFlags);
    let lead: CommercialLead = {
      ...baseLead,
      aiClassification: activeAiClassification,
      extractedLeadData: activeAiClassification?.extractedData,
      priority: activeAiClassification?.priority ?? baseLead.priority,
      technicalRisk: baseLead.technicalRisk || Boolean(activeAiClassification?.requiresTechnicalReview),
      summary: {
        ...baseLead.summary,
        priority: activeAiClassification?.priority ?? baseLead.summary.priority,
        requiresTechnicalReview:
          baseLead.summary.requiresTechnicalReview || Boolean(activeAiClassification?.requiresTechnicalReview)
      }
    };

    const summaryResult = await summarizeLeadWithAi(lead);
    const aiSummary = summaryResult.data;
    lead = {
      ...lead,
      aiSummary,
      aiSummarySource: summaryResult.available ? "ai" : "local",
      aiGeneratedAt: summaryResult.available ? new Date().toISOString() : undefined,
      summaryText: buildLeadSummaryText(lead.summaryText, aiSummary, summaryResult.available)
    } as CommercialLead;

    saveLocalLead(lead);
    onLeadGenerated?.(lead);
    logDemoEvent("lead_generado", {
      leadId: lead.id,
      aiSummary: summaryResult.available,
      technicalRisk: lead.technicalRisk
    });
    logDemoEvent("solicitud_enviada_demo", { leadId: lead.id });

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
    setActiveAiClassification(undefined);
    setAiStatus(summaryResult.available ? "available" : "unavailable");
  }

  function toggleAiMode() {
    const next = !aiEnabled;
    persistAiEnabled(next);
    setAiEnabledState(next);
    setAiStatus(next ? "idle" : "unavailable");
    logDemoEvent(next ? "consulta_clasificada" : "fallback_activado", {
      reason: next ? "ai_enabled_by_user" : "ai_disabled_by_user"
    });
  }

  function restart() {
    setMessages([welcomeMessage()]);
    setActiveFlow(null);
    setCurrentStepIndex(0);
    setDraft({});
    setTechnicalFlags([]);
    setPrivacyShown(false);
    setLastAiClassification(undefined);
    setActiveAiClassification(undefined);
    setAiStatus("idle");
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setLastCopied(true);
      window.setTimeout(() => setLastCopied(false), 1800);
    } catch {
      appendAssistant({ text: "No he podido copiar automaticamente. Puedes seleccionar el resumen manualmente." });
    }
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

  if (!isOpen) {
    return (
      <section className="copilot-shell copilot-shell-collapsed" id="copiloto" aria-label="Copiloto comercial cerrado">
        <div>
          <span>Copiloto comercial</span>
          <strong>Protecciones Toledo</strong>
          <p>Abre el asistente para clasificar una consulta y preparar una solicitud comercial.</p>
        </div>
        <Button variant="primary" onClick={() => setIsOpen(true)}>
          <MessageSquareText size={17} aria-hidden="true" />
          Abrir copiloto
        </Button>
      </section>
    );
  }

  return (
    <section className="copilot-shell" id="copiloto" aria-label="Copiloto comercial">
      <header className="copilot-header">
        <div>
          <span>Copiloto comercial</span>
          <h2>Protecciones Toledo - Demo comercial</h2>
        </div>
        <div className="copilot-header-actions">
          <Button variant="ghost" onClick={restart}>
            <RotateCcw size={16} aria-hidden="true" />
            Reiniciar
          </Button>
          <Button variant="ghost" onClick={toggleAiMode}>
            {aiEnabled ? "IA asistida" : "Modo local"}
          </Button>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            <X size={16} aria-hidden="true" />
            Cerrar
          </Button>
        </div>
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
        <span className={`ai-status-pill ${aiHealthLabel === "IA disponible" ? "ai-status-on" : ""}`}>
          {aiHealthLabel}
        </span>
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
      "Hola. Soy el copiloto comercial de Protecciones Toledo. Puedo ayudarte a orientar tu consulta sobre sistemas de proteccion de borde, bases, casquillos, auxiliares, consumibles o soluciones a medida. Para una solucion definitiva, el equipo tecnico debera revisar los datos de obra y la documentacion correspondiente.",
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

function buildAiAssistantText(classification: AILeadClassification, generatedWithAi: boolean) {
  const sections = [
    classification.suggestedReply ||
      "He analizado la consulta, pero conviene continuar con un flujo guiado para recoger datos utiles."
  ];

  sections.push(
    generatedWithAi
      ? "Clasificacion automatica generada con IA asistida y validacion local."
      : "Fallback local aplicado: usando reglas de demo y flujos controlados."
  );

  if (classification.confidence < 0.45) {
    sections.push("La clasificacion es orientativa porque la consulta es ambigua.");
  }

  if (classification.suggestedNextQuestion) {
    sections.push(`Pregunta sugerida: ${classification.suggestedNextQuestion}`);
  }

  if (classification.requiresTechnicalReview) {
    sections.push("Esta consulta queda marcada como revision tecnica necesaria antes de confirmar una solucion.");
  }

  if (classification.safetyWarning) {
    sections.push(`Aviso: ${classification.safetyWarning}`);
  }

  return sections.join("\n\n");
}

function buildAiActions(classification: AILeadClassification): ChatAction[] {
  const suggestedFlowId = resolveFlowFromClassification(classification);
  const actions: ChatAction[] = [];

  if (suggestedFlowId) {
    const flow = getConversationFlow(suggestedFlowId);
    actions.push({
      label: flow ? `Iniciar: ${flow.label}` : "Iniciar flujo recomendado",
      value: `flow:${suggestedFlowId}`,
      variant: classification.requiresTechnicalReview ? "warning" : "primary"
    });
  }

  if (suggestedFlowId !== "presupuesto") {
    actions.push({ label: "Solicitar presupuesto", value: "flow:presupuesto", variant: "secondary" });
  }

  actions.push({ label: "Volver al menu", value: "restart", variant: "secondary" });

  return actions;
}

function resolveFlowFromClassification(classification: AILeadClassification): FlowId {
  if (
    classification.requiresTechnicalReview ||
    classification.family === "documentacion_normativa" ||
    classification.intent === "preguntar_normativa" ||
    classification.intent === "preguntar_instalacion" ||
    classification.intent === "pedir_documentacion" ||
    classification.intent === "soporte_tecnico"
  ) {
    return "documentacion";
  }

  if (classification.intent === "solicitar_presupuesto") {
    return "presupuesto";
  }

  if (classification.intent === "no_sabe_que_necesita" || classification.confidence < 0.42) {
    return "desconocido";
  }

  const familyMap: Record<AIProductFamily, FlowId> = {
    proteccion_provisional: "provisional",
    proteccion_definitiva: "definitiva",
    bases_casquillos: "bases-casquillos",
    auxiliares: "auxiliares",
    consumibles: "consumibles",
    solucion_medida: "medida",
    documentacion_normativa: "documentacion",
    desconocida: "desconocido"
  };

  return familyMap[classification.family];
}

function buildLeadSummaryText(
  localSummaryText: string,
  aiSummary: AILeadSummary,
  generatedWithAi: boolean
) {
  return [
    localSummaryText,
    "",
    generatedWithAi ? "Resumen generado con IA:" : "Resumen complementario local:",
    `- Titulo: ${aiSummary.title}`,
    `- Resumen comercial: ${aiSummary.commercialSummary}`,
    `- Notas tecnicas: ${aiSummary.technicalNotes}`,
    `- Informacion pendiente: ${
      aiSummary.missingInformation.length > 0 ? aiSummary.missingInformation.join(", ") : "No indicada"
    }`,
    `- Motivo de prioridad: ${aiSummary.priorityReason}`
  ].join("\n");
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
