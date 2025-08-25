"use client";

import { UIMessage, useChat } from "@ai-sdk/react";
import { ChatHeader } from "./chat-header";
import { ChangeEvent, useCallback, useEffect, useState } from "react";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageAvatar, MessageContent } from "../ai-elements/message";
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
import { GlobeIcon, MicIcon, PaperclipIcon } from "lucide-react";
import { Session } from "next-auth";
import { DefaultChatTransport } from "ai";
import { generateUUID } from "@/lib/utils";
import { Loader } from "../ai-elements/loader";
import { FileUpload } from "./file-upload";
import { toast } from "sonner";

const models = [
  { id: "gpt-5", name: "GPT-5" },
  { id: "claude-opus-4-20250514", name: "Claude 4 Opus" },
];

interface FileAttachment {
  name: string;
  type: string; // MIME type
  url?: string;
  data?: string; // base64 or data URL
}

type ChatProps = {
  id: string;
  session: Session;
  initialMessages: Array<UIMessage>;
};

export function Chat({ id, session, initialMessages }: ChatProps) {
  const [text, setText] = useState<string>("");
  const [model, setModel] = useState<string>(models[0].id);
  const [attachments, setAttachments] = useState<Array<FileAttachment>>([]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showFileUpload, setShowFileUpload] = useState(false);

  const handleFileSelect = async (file: File) => {
    try {
      const res = await uploadFile(file);
      if (!res) return;
      const newAttachment: FileAttachment = {
        name: res.name,
        type: res.contentType,
        data: res.url,
      };

      setAttachments((prev) => [...prev, newAttachment]);
      console.log(JSON.stringify(attachments, null, 2));
      setSelectedFile(file);
      setShowFileUpload(false);
    } catch (error) {
      console.error("Error converting file to base64:", error);
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const { url, pathname, contentType } = data;

        return {
          url,
          name: pathname,
          contentType: contentType,
        };
      }
      const { error } = await response.json();
      toast.error(error);
    } catch (error) {
      toast.error("Failed to upload file, please try again!");
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setAttachments([]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Don't submit if there's no text and no attachments
    if (!text.trim() && attachments.length === 0) {
      return;
    }

    window.history.replaceState({}, "", `/chat/${id}`);

    // Create message parts - start with text if present
    const messageParts: any[] = [];

    if (text.trim()) {
      messageParts.push({ type: "text", text: text });
    }

    // Add file parts for each attachment
    attachments.forEach((attachment) => {
      messageParts.push({
        type: "file",
        data: attachment.data,
        mediaType: attachment.type,
        fileName: attachment.name,
      });
    });

    sendMessage(
      {
        role: "user",
        parts: messageParts,
      },
      {
        body: {
          model: model,
          messageId: generateUUID(),
        },
      }
    );

    setText("");
    // setAttachments([]);
    // setSelectedFile(null);
    setShowFileUpload(false);
  };

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
    if (query && !hasAppendedQuery) {
      sendMessage({ role: "user", parts: [{ type: "text", text: query }] });
      setHasAppendedQuery(true);
      window.history.replaceState({}, "", `/chat/${id}`);
    }
  }, [query, sendMessage, hasAppendedQuery, id]);

  // Check if we can submit (either text or attachments)
  const canSubmit = text.trim() || attachments.length > 0;

  return (
    <div className="flex flex-col flex-1 h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <ChatHeader
        attachments={attachments} // Pass the actual attachments state
        chatId={id}
        selectedModelId={model}
        setAttachments={setAttachments}
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
                <MessageAvatar
                  src={message.role === "assistant" ? "/logo-sm.svg" : ""}
                  name={"User"}
                />
                <MessageContent>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <Response key={`${message.id}-${i}`}>
                            {part.text}
                          </Response>
                        );
                      // case "file":
                      //   return (
                      //     <div
                      //       key={`${message.id}-${i}`}
                      //       className="mb-2 p-2 bg-muted rounded-md border"
                      //     >
                      //       <div className="flex items-center gap-2">
                      //         <PaperclipIcon
                      //           size={16}
                      //           className="text-muted-foreground"
                      //         />
                      //         <span className="text-sm font-medium">
                      //           {part.filename || "Attached file"}
                      //         </span>
                      //       </div>
                      //     </div>
                      //   );
                      default:
                        return null;
                    }
                  })}
                </MessageContent>
              </Message>
            ))}
            {status === "submitted" && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>

      <PromptInput onSubmit={handleSubmit} className="mt-4 max-w-4xl mx-auto">
        {showFileUpload && (
          <div className="mb-4">
            <FileUpload
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              selectedFile={selectedFile}
              acceptedTypes={[".pdf", ".doc", ".docx"]}
              maxSizeInMB={10}
            />
          </div>
        )}
        <PromptInputTextarea
          onChange={(e) => setText(e.target.value)}
          value={text}
          placeholder={
            attachments.length > 0
              ? `Ask about ${attachments[0].name}...`
              : "Type your message..."
          }
        />
        <PromptInputToolbar>
          <PromptInputTools>
            <PromptInputButton>
              <MicIcon size={16} />
            </PromptInputButton>
            <PromptInputButton
              onClick={() => setShowFileUpload(!showFileUpload)}
            >
              <PaperclipIcon size={16} />
              <span>Attach</span>
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
          <PromptInputSubmit
            disabled={!canSubmit || status === "submitted"}
            status={status}
          />
        </PromptInputToolbar>
      </PromptInput>
    </div>
  );
}
