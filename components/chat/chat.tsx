"use client";

import { useChat } from "@ai-sdk/react";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { MessageList } from "./message-list";
import { useState } from "react";
import { toast } from "sonner";

export function Chat() {
  const { sendMessage, messages, status, regenerate } = useChat({
    onToolCall: ({ toolCall }) => {
      setToolName(toolCall.toolName);
    },
    onError: (error) => {
      console.error("catch error", error);
      toast.error(JSON.stringify(error, null, 2));
    },
  });
  const [toolName, setToolName] = useState<string | undefined>(undefined);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <ChatHeader />
      <MessageList messages={messages} status={status} toolName={toolName} />
      <ChatInput
        onSendMessage={sendMessage}
        regenerate={regenerate}
        status={status}
      />
    </div>
  );
}
