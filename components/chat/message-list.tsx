import { useRef, useEffect, useMemo } from "react";
import { LoadingMessage } from "./loading-message";
import { EmptyState } from "./empty-state";
import { Message } from "./message";
import { ChatStatus } from "ai";
import type { MyUIMessage } from "@/lib/ai/types";

interface MessageListProps {
  messages: MyUIMessage[];
  status: ChatStatus;
  toolName?: string;
}

export function MessageList({ messages, status, toolName }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const showLoadingMessage = useMemo(() => {
    return (
      status === "submitted" ||
      (status === "streaming" &&
        !Boolean(
          messages[messages.length - 1]?.parts.some(
            (part) => part.type === "text" && Boolean(part.text)
          )
        ))
    );
  }, [status, messages]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-32">
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.length === 0 && <EmptyState />}

        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        {showLoadingMessage && <LoadingMessage toolName={toolName} />}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
