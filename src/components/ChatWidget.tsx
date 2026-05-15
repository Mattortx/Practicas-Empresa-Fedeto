import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUp,
  Check,
  Clipboard,
  ExternalLink,
  Mail,
  MessageSquareText,
  ShieldCheck
} from "lucide-react";
import { createAssistantEngine } from "../domain/assistantEngine";
import {
  buildLeadSummary,
  getFirstIncompleteField,
  leadFields,
  LeadDraft,
  LeadField,
  validateLeadField
} from "../domain/lead";
import type { AssistantResponse, ChatAction } from "../domain/types";

type MessageRole = "assistant" | "user";

interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  actions?: ChatAction[];
  summary?: string;
}

const engine = createAssistantEngine();

export function ChatWidget() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    assistantMessage(engine.getWelcome())
  ]);
  const [input, setInput] = useState("");
  const [leadDraft, setLeadDraft] = useState<LeadDraft | null>(null);
  const [activeField, setActiveField] = useState<LeadField | null>(null);
  const [lastSuggestedNeed, setLastSuggestedNeed] = useState("");
  const [copiedSummaryId, setCopiedSummaryId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const isCollectingLead = Boolean(leadDraft && activeField);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const currentPlaceholder = useMemo(() => {
    if (activeField) {
      return activeField.placeholder;
    }

    return "Escribe tu consulta sobre proteccion en altura...";
  }, [activeField]);

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = input.trim();

    if (!value) {
      return;
    }

    setInput("");
    processUserInput(value);
  }

  function processUserInput(value: string) {
    appendUserMessage(value);

    if (isCollectingLead && activeField && leadDraft) {
      handleLeadAnswer(activeField, value);
      return;
    }

    handleAssistantResponse(engine.respond(value));
  }

  function handleAction(action: ChatAction) {
    appendUserMessage(action.label);

    if (action.value.startsWith("http")) {
      window.open(action.value, "_blank", "noopener,noreferrer");
      appendAssistantMessage({
        text: "He abierto el enlace de contacto en una nueva pestaña. Tambien puedo preparar un resumen si quieres dejar la consulta mas estructurada.",
        actions: [{ label: "Preparar resumen", value: "lead:start", variant: "primary" }]
      });
      return;
    }

    if (action.value === "lead:start") {
      startLeadFlow();
      return;
    }

    handleAssistantResponse(engine.respond(action.value));
  }

  function handleAssistantResponse(response: AssistantResponse) {
    if (response.suggestedNeed) {
      setLastSuggestedNeed(response.suggestedNeed);
    }

    if (response.startLead) {
      appendAssistantMessage(response);
      startLeadFlow(response.suggestedNeed);
      return;
    }

    appendAssistantMessage(response);
  }

  function startLeadFlow(need = lastSuggestedNeed) {
    const initialDraft: LeadDraft = need ? { need } : {};
    const firstField = getFirstIncompleteField(initialDraft);

    setLeadDraft(initialDraft);
    setActiveField(firstField ?? null);

    if (firstField) {
      appendAssistantText(firstField.prompt);
    }
  }

  function handleLeadAnswer(field: LeadField, value: string) {
    const validation = validateLeadField(field, value);

    if (!validation.valid) {
      appendAssistantText(validation.error);
      return;
    }

    const updatedDraft: LeadDraft = {
      ...(leadDraft ?? {}),
      [field.id]: validation.normalizedValue
    };
    const nextField = getFirstIncompleteField(updatedDraft);

    setLeadDraft(updatedDraft);
    setActiveField(nextField ?? null);

    if (nextField) {
      appendAssistantText(nextField.prompt);
      return;
    }

    const summary = buildLeadSummary(updatedDraft);
    const summaryMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      text: "Consulta preparada. Puedes copiar el resumen o abrir un correo para trasladarlo al equipo comercial.",
      summary,
      actions: [
        { label: "Nueva consulta", value: "no se que producto necesito", variant: "secondary" },
        { label: "Contacto web", value: engine.getKnowledgeBase().company.contactUrl, variant: "secondary" }
      ]
    };

    setMessages((current) => [...current, summaryMessage]);
    setLeadDraft(null);
    setActiveField(null);
  }

  function appendUserMessage(text: string) {
    setMessages((current) => [...current, { id: crypto.randomUUID(), role: "user", text }]);
  }

  function appendAssistantMessage(response: AssistantResponse) {
    setMessages((current) => [...current, assistantMessage(response)]);
  }

  function appendAssistantText(text: string) {
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "assistant", text }
    ]);
  }

  async function copySummary(message: ChatMessage) {
    if (!message.summary) {
      return;
    }

    await navigator.clipboard.writeText(message.summary);
    setCopiedSummaryId(message.id);
    window.setTimeout(() => setCopiedSummaryId(null), 1800);
  }

  function mailtoHref(summary: string) {
    const subject = "Consulta comercial desde asistente web";
    return `mailto:${engine.getKnowledgeBase().company.contactEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(summary)}`;
  }

  return (
    <section className="chat-shell" aria-label="Asistente Protecciones Toledo">
      <header className="chat-header">
        <div className="chat-title">
          <span className="chat-avatar" aria-hidden="true">
            <ShieldCheck size={22} />
          </span>
          <div>
            <p>Asistente comercial tecnico</p>
            <strong>Protecciones Toledo</strong>
          </div>
        </div>
        <span className="status-pill">MVP local</span>
      </header>

      <div className="message-list">
        {messages.map((message) => (
          <article className={`message message-${message.role}`} key={message.id}>
            <div className="message-icon" aria-hidden="true">
              {message.role === "assistant" ? <MessageSquareText size={18} /> : <span>TU</span>}
            </div>
            <div className="message-body">
              <p>{renderText(message.text)}</p>
              {message.summary && (
                <div className="summary-box">
                  <pre>{message.summary}</pre>
                  <div className="summary-actions">
                    <button
                      className="icon-button"
                      type="button"
                      onClick={() => copySummary(message)}
                      title="Copiar resumen"
                      aria-label="Copiar resumen"
                    >
                      {copiedSummaryId === message.id ? <Check size={18} /> : <Clipboard size={18} />}
                    </button>
                    <a
                      className="icon-link"
                      href={mailtoHref(message.summary)}
                      title="Abrir correo"
                      aria-label="Abrir correo"
                    >
                      <Mail size={18} />
                    </a>
                  </div>
                </div>
              )}
              {message.actions && message.actions.length > 0 && (
                <div className="action-row">
                  {message.actions.map((action) => (
                    <button
                      className={`action-chip action-${action.variant ?? "secondary"}`}
                      key={`${message.id}-${action.label}`}
                      type="button"
                      onClick={() => handleAction(action)}
                    >
                      {action.value.startsWith("http") && <ExternalLink size={15} aria-hidden="true" />}
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
        <div ref={bottomRef} />
      </div>

      <form className="chat-form" onSubmit={submitMessage}>
        <input
          aria-label="Mensaje para el asistente"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={currentPlaceholder}
        />
        <button className="send-button" type="submit" title="Enviar" aria-label="Enviar mensaje">
          <ArrowUp size={20} />
        </button>
      </form>
      {isCollectingLead && (
        <div className="lead-progress" aria-live="polite">
          Dato solicitado: {activeField?.label}. Campos del resumen: {leadFields.length}.
        </div>
      )}
    </section>
  );
}

function assistantMessage(response: AssistantResponse): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    text: response.text,
    actions: response.actions
  };
}

function renderText(text: string) {
  return text.split("\n").map((line, index) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < text.split("\n").length - 1 && <br />}
    </span>
  ));
}
