import { Bot, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MessagePart } from "./message-part";
import { MyUIMessage } from "@/lib/ai/types";

interface MessageProps {
  message: MyUIMessage;
}

export function Message({ message }: MessageProps) {
  const showMessage = message?.parts.some(
    (part) => part.type === "text" && Boolean(part.text)
  );
  if (!showMessage) return null;
  return (
    <div
      className={`flex gap-3 ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {message.role === "assistant" && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      <Card
        className={`max-w-[80%] p-4 ${
          message.role === "user"
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
        }`}
      >
        <div className="space-y-2">
          {message.parts.map((part, index) => (
            <MessagePart
              key={index}
              part={part}
              messageRole={message.role}
              index={index}
            />
          ))}
        </div>
      </Card>

      {message.role === "user" && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
    </div>
  );
}
