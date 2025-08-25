"use client";

import { UIMessage, useChat } from "@ai-sdk/react";
import { ChatHeader } from "./chat-header";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "../ai-elements/message";
import { Response } from "../ai-elements/response";
import { useSearchParams } from "next/navigation";
import {
  PromptInput,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { GlobeIcon, MicIcon } from "lucide-react";
import { Session } from "next-auth";
import { DefaultChatTransport } from "ai";
import { generateUUID } from "@/lib/utils";

const models = [
  { id: "gpt-4o", name: "GPT-4o" },
  { id: "claude-opus-4-20250514", name: "Claude 4 Opus" },
];

type ChatProps = {
  id: string;
  session: Session;
  initialMessages: Array<UIMessage>;
};
export function Chat({ id, session, initialMessages }: ChatProps) {
  const [text, setText] = useState<string>("");
  const [model, setModel] = useState<string>(models[0].id);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.history.replaceState({}, "", `/chat/${id}`);

    sendMessage(
      { text: text },
      {
        body: {
          model: model,
          messageId: generateUUID(),
        },
      }
    );
    setText("");
  };

  // const { sendMessage, messages, status, regenerate } = useChat({
  //   messages: initialMessages,
  //   onToolCall: ({ toolCall }) => {
  //     setToolName(toolCall.toolName);
  //   },
  //   onError: (error) => {
  //     console.error("catch error", error);
  //     toast.error(JSON.stringify(error, null, 2));
  //   },
  // });
  const { messages, sendMessage, status } = useChat({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest({ messages }) {
        console.log("Prepare send messages request", messages);
        return { body: { message: messages[messages.length - 1], id } };
      },
    }),
    onToolCall: ({ toolCall }) => {
      setToolName(toolCall.toolName);
    },
  });
  const [toolName, setToolName] = useState<string | undefined>(undefined);

  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const [hasAppendedQuery, setHasAppendedQuery] = useState(false);

  useEffect(() => {
    console.log(query, hasAppendedQuery, id);
    if (query && !hasAppendedQuery) {
      sendMessage({ role: "user", parts: [{ type: "text", text: query }] });

      setHasAppendedQuery(true);
      window.history.replaceState({}, "", `/chat/${id}`);
    }
  }, [query, sendMessage, hasAppendedQuery, id]);

  return (
    <div className="flex flex-col flex-1 h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <ChatHeader
        attachments={[]}
        chatId={id}
        selectedModelId={model}
        setAttachments={() => {}}
        session={session}
      />
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        <Conversation
          className="relative max-w-4xl mx-auto"
          style={{ height: "500px" }}
        >
          <ConversationContent>
            {messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <Response key={`${message.id}-${i}`}>
                            {part.text}
                          </Response>
                        );
                      default:
                        return null;
                    }
                  })}
                </MessageContent>
              </Message>
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>
      {/* <MessageList messages={messages} status={status} toolName={toolName} /> */}
      {/* 
      <ChatInput
        onSendMessage={sendMessage}
        regenerate={regenerate}
        status={status}
      /> */}
      <PromptInput onSubmit={handleSubmit} className="mt-4 max-w-4xl mx-auto">
        <PromptInputTextarea
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <PromptInputToolbar>
          <PromptInputTools>
            <PromptInputButton>
              <MicIcon size={16} />
            </PromptInputButton>
            <PromptInputButton>
              <GlobeIcon size={16} />
              <span>Search</span>
            </PromptInputButton>
            <PromptInputModelSelect
              onValueChange={(value) => {
                setModel(value);
              }}
              value={model}
            >
              <PromptInputModelSelectTrigger>
                <PromptInputModelSelectValue />
              </PromptInputModelSelectTrigger>
              <PromptInputModelSelectContent>
                {models.map((model) => (
                  <PromptInputModelSelectItem key={model.id} value={model.id}>
                    {model.name}
                  </PromptInputModelSelectItem>
                ))}
              </PromptInputModelSelectContent>
            </PromptInputModelSelect>
          </PromptInputTools>
          <PromptInputSubmit disabled={!text} status={status} />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
}
