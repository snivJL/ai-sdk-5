import { type KeyboardEvent, type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, RefreshCw } from "lucide-react";
import { ChatStatus } from "ai";

interface ChatInputProps {
  onSendMessage: (message: { text: string }) => void;
  status: ChatStatus;
  regenerate: () => void;
}

export function ChatInput({
  onSendMessage,
  status,
  regenerate,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const isLoading = status === "submitted";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSendMessage({ text: input });
    setInput("");
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700 p-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            disabled={isLoading}
            className="flex-1 min-h-[48px] resize-none bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
          />

          {/* Send message */}
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            size="lg"
            className="px-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>

          {/* Regenerate last response */}
          <Button
            type="button"
            onClick={regenerate}
            disabled={isLoading}
            size="lg"
            className="px-4 bg-green-600 hover:bg-green-700 text-white"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </form>
        <p className="text-xs text-slate-500 mt-2 text-center">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}
