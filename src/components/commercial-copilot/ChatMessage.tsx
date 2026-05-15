import { Bot, UserRound } from "lucide-react";
import type { ChatAction, ChatMessage as ChatMessageType } from "../../types/commercialCopilot";
import { LeadSummary } from "./LeadSummary";

interface ChatMessageProps {
  message: ChatMessageType;
  onAction: (action: ChatAction) => void;
  onCopy: (text: string) => void;
}

export function ChatMessage({ message, onAction, onCopy }: ChatMessageProps) {
  return (
    <article className={`copilot-message copilot-message-${message.role}`}>
      <span className="message-avatar" aria-hidden="true">
        {message.role === "user" ? <UserRound size={17} /> : <Bot size={17} />}
      </span>
      <div className="message-content">
        <p>{renderLines(message.text)}</p>
        {message.lead && <LeadSummary lead={message.lead} onCopy={onCopy} />}
        {message.actions && message.actions.length > 0 && (
          <div className="message-actions">
            {message.actions.map((action) => (
              <button
                className={`message-action action-${action.variant ?? "secondary"}`}
                key={`${message.id}-${action.value}`}
                type="button"
                onClick={() => onAction(action)}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function renderLines(text: string) {
  return text.split("\n").map((line, index, lines) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 && <br />}
    </span>
  ));
}
