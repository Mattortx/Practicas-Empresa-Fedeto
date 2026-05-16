import { useEffect, useMemo, useState } from "react";
import { ClipboardCheck, MessageSquareText, RotateCcw, ShieldAlert, X } from "lucide-react";
import { getConversationFlow } from "../../data/conversationFlows";
import { controlledFaq } from "../../data/faq";
import { classifyFamilyFromText } from "../../data/productFamilies";
import {
  getCommercialResponse,
  getContextualPromptNotes,
  getTechnicalSensitiveReply,
  privacyNotice,
  technicalGuardrail
} from "../../data/responseLibrary";
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
import { buildDeepOrientationReply, buildFlowStartMessage } from "../../utils/commercialDepth";

const quickDemoCases = [
  {
    label: "Obra provisional",
    text: "Necesito proteger el borde de un forjado durante una obra en Toledo."
  },
  {
    label: "Cubierta definitiva",
    text: "Busco una barandilla definitiva para una cubierta industrial donde no se puede perforar."
  },
  {
    label: "Casquillos",
    text: "Necesito presupuesto para casquillos atornillables, unas 200 unidades."
  },
  {
    label: "Duda normativa",
    text: "Cumple la UNE EN 13374?"
  },
  {
    label: "No lo tengo claro",
    text: "No sé qué necesito, tengo una zona elevada en una nave."
  }
];

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
      : currentStep?.placeholder ?? "Escribe tu consulta o elige una opción...";

  const isInFlow = Boolean(activeFlow && currentStep);
  const qualificationState = useMemo(
    () => buildQualificationState(activeFlow, currentStepIndex, technicalFlags, lastAiClassification),
    [activeFlow, currentStepIndex, lastAiClassification, technicalFlags]
  );

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
      return "IA opcional analizando la consulta. Los guardrails técnicos siguen activos.";
    }

    if (aiStatus === "available") {
      return "IA opcional activa para texto libre; la cualificación comercial sigue con flujos controlados.";
    }

    if (aiStatus === "unavailable") {
      return "IA opcional no configurada o no disponible; reglas y flujos controlados activos.";
    }

    if (!aiEnabled) {
      return "Modo local activado: solo reglas y flujos controlados.";
    }

    if (!activeFlow) {
      return "Modo demo: reglas controladas, IA opcional y sin envío automático.";
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

  async function handleFreeText(
    value: string,
    contextOverride?: { activeFlowId?: string | null; currentStepId?: string | null }
  ) {
    setAiStatus("idle");
    const flags = detectTechnicalRisk(value);
    const localFamily = classifyFamilyFromText(value);

    if (flags.length > 0 && !aiEnabled) {
      logDemoEvent("riesgo_tecnico_detectado", { mode: "local", flags });
      appendAssistant({
        text: `${technicalGuardrail}\n\n${getTechnicalSensitiveReply(flags)}\n\nSi quieres, preparo una consulta técnica documentada para el equipo de Protecciones Toledo.`,
        actions: [
          { label: "Preparar consulta técnica", value: "flow:documentacion", variant: "warning" },
          { label: "Volver al menú", value: "restart", variant: "secondary" }
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
        text: getCommercialResponse("ambiguousLocal", value),
        actions: [
          { label: "No sé qué necesito", value: "flow:desconocido", variant: "secondary" },
          { label: "Solicitar presupuesto", value: "flow:presupuesto", variant: "primary" },
          { label: "Documentación o normativa", value: "flow:documentacion", variant: "warning" }
        ]
      });
      return;
    }

    setAiStatus("thinking");
    const aiResponse = await classifyLeadWithAi(value, {
      activeFlow: contextOverride?.activeFlowId ?? activeFlow?.id ?? null,
      currentStep: contextOverride?.currentStepId ?? currentStep?.id ?? null,
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
      text: buildAiAssistantText(aiResponse.data, aiResponse.available, value),
      actions: buildAiActions(aiResponse.data)
    });
  }

  async function handleQuickDemoCase(text: string) {
    if (aiStatus === "thinking") {
      return;
    }

    setInput("");
    setActiveFlow(null);
    setCurrentStepIndex(0);
    setDraft({});
    setTechnicalFlags([]);
    setPrivacyShown(false);
    setLastAiClassification(undefined);
    setActiveAiClassification(undefined);
    setMessages([
      welcomeMessage(),
      { id: crypto.randomUUID(), role: "user", text }
    ]);
    await handleFreeText(text, { activeFlowId: null, currentStepId: null });
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
      text: buildFlowStartMessage(flow, aiClassification)
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
        text: `${privacyNotice}\n\n${buildContextualStepPrompt(flow, nextStep, nextDraft, nextFlags)}`
      });
      return;
    }

    appendAssistant({ text: buildContextualStepPrompt(flow, nextStep, nextDraft, nextFlags) });
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
        [
          getCommercialResponse("summaryReady", lead.id),
          `Familia: ${lead.productFamilyLabel}.`,
          `Prioridad: ${lead.priority}.`,
          `Revisión técnica: ${lead.technicalRisk ? "Sí" : "No"}.`,
          "En esta prueba de concepto se conserva solo de forma local o simulada."
        ].join("\n"),
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
      appendAssistant({ text: getCommercialResponse("copyError") });
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

      <div className="quick-demo-panel" aria-label="Casos rápidos de prueba">
        <div>
          <span>Casos rápidos</span>
          <strong>Simular consulta</strong>
        </div>
        <div className="quick-demo-actions">
          {quickDemoCases.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleQuickDemoCase(item.text)}
              disabled={aiStatus === "thinking"}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="qualification-panel" aria-label="Estado de cualificación comercial">
        <div className="qualification-item">
          <span>Estado</span>
          <strong>{qualificationState.stage}</strong>
        </div>
        <div className="qualification-item">
          <span>Familia</span>
          <strong>{qualificationState.family}</strong>
        </div>
        <div className="qualification-item">
          <span>Prioridad</span>
          <strong>{qualificationState.priority}</strong>
        </div>
        <div className={`qualification-item ${qualificationState.technicalReview ? "qualification-warning" : ""}`}>
          <span>Revisión técnica</span>
          <strong>{qualificationState.technicalReview ? "Necesaria" : "No marcada"}</strong>
        </div>
      </div>

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
      "Hola. Soy el copiloto comercial de Protecciones Toledo. Puedo ayudarte a orientar tu consulta sobre sistemas de protección de borde, bases, casquillos, auxiliares, consumibles o soluciones a medida. Para una solución definitiva, el equipo técnico deberá revisar los datos de obra y la documentación correspondiente.",
    actions: [
      { label: "Solicitar presupuesto", value: "flow:presupuesto", variant: "primary" },
      { label: "No sé qué necesito", value: "flow:desconocido", variant: "secondary" },
      { label: "Documentación o normativa", value: "flow:documentacion", variant: "warning" }
    ]
  };
}

function validateStep(step: ConversationStep, rawValue: string) {
  const value = rawValue.trim();

  if (step.required !== false && !value) {
    return { valid: false as const, error: getCommercialResponse("requiredField", step.id) };
  }

  if (!value && step.required === false) {
    return { valid: true as const, value: "No indicado" };
  }

  if (step.field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return {
      valid: false as const,
      error: "El correo no parece válido. Escríbelo con formato nombre@empresa.com."
    };
  }

  return { valid: true as const, value };
}

function isContactStep(step: ConversationStep) {
  return ["name", "company", "email", "phone"].includes(step.field);
}

function buildContextualStepPrompt(
  flow: ConversationFlow,
  step: ConversationStep,
  draft: LeadDraft,
  flags: TechnicalRiskFlag[]
) {
  const notes: string[] = [];
  const text = normalize(Object.values(draft).filter(Boolean).join(" "));
  notes.push(...getContextualPromptNotes(flow.id, step.field, text, flags));

  return notes.length > 0 ? `${notes.join("\n\n")}\n\n${step.prompt}` : step.prompt;
}

function buildAiAssistantText(
  classification: AILeadClassification,
  generatedWithAi: boolean,
  sourceText: string
) {
  return buildDeepOrientationReply(classification, generatedWithAi, sourceText);
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

  actions.push({ label: "Volver al menú", value: "restart", variant: "secondary" });

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

function buildQualificationState(
  activeFlow: ConversationFlow | null,
  currentStepIndex: number,
  technicalFlags: TechnicalRiskFlag[],
  classification?: AILeadClassification
) {
  const technicalReview = Boolean(
    activeFlow?.technicalReviewRequired || technicalFlags.length > 0 || classification?.requiresTechnicalReview
  );

  if (activeFlow) {
    return {
      stage: `Paso ${Math.min(currentStepIndex + 1, activeFlow.steps.length)}/${activeFlow.steps.length}`,
      family: activeFlow.label,
      priority: classification?.priority ?? "Por determinar",
      technicalReview
    };
  }

  if (classification) {
    return {
      stage: classification.confidence < 0.45 ? "Ambigua" : "Clasificada",
      family: aiFamilyLabel(classification.family),
      priority: classification.priority,
      technicalReview
    };
  }

  return {
    stage: "Pendiente",
    family: "Sin clasificar",
    priority: "Por determinar",
    technicalReview
  };
}

function aiFamilyLabel(family: AIProductFamily) {
  const labels: Record<AIProductFamily, string> = {
    proteccion_provisional: "Protección provisional",
    proteccion_definitiva: "Protección definitiva",
    bases_casquillos: "Bases y casquillos",
    auxiliares: "Auxiliares",
    consumibles: "Consumibles",
    solucion_medida: "Solución a medida",
    documentacion_normativa: "Documentación o normativa",
    desconocida: "Por determinar"
  };

  return labels[family];
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
    `- Título: ${aiSummary.title}`,
    `- Resumen comercial: ${aiSummary.commercialSummary}`,
    `- Notas técnicas: ${aiSummary.technicalNotes}`,
    `- Información pendiente: ${
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
