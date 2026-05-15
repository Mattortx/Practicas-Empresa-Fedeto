import { FormEvent, useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";
import type { ChatAction, ChatMessage } from "../../types/commercialCopilot";
import { ChatMessage as ChatMessageView } from "./ChatMessage";

interface ChatWindowProps {
  messages: ChatMessage[];
  input: string;
  placeholder: string;
  onInputChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onAction: (action: ChatAction) => void;
  onCopy: (text: string) => void;
}

export function ChatWindow({
  messages,
  input,
  placeholder,
  onInputChange,
  onSubmit,
  onAction,
  onCopy
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(input);
  }

  return (
    <>
      <div className="copilot-thread">
        {messages.map((message) => (
          <ChatMessageView
            key={message.id}
            message={message}
            onAction={onAction}
            onCopy={onCopy}
          />
        ))}
        <div ref={bottomRef} />
      </div>
      <form className="copilot-input" onSubmit={submit}>
        <input
          aria-label="Mensaje para el copiloto comercial"
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          placeholder={placeholder}
        />
        <button type="submit" aria-label="Enviar mensaje" title="Enviar">
          <ArrowUp size={20} />
        </button>
      </form>
    </>
  );
}
