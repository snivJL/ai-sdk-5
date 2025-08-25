import { type KeyboardEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, RotateCcw } from "lucide-react";
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

  const onClick = () => {
    if (!input.trim() || isLoading) return;

    onSendMessage({ text: input });
    setInput("");
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div className="overflow-y-auto">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto p-6">
        <div className="sticky bottom-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl p-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about your documents..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
            </div>
            <Button
              size="lg"
              onClick={onClick}
              disabled={!input.trim() || isLoading}
              className="px-6 bg-gradient-to-r from-[#171717] to-slate-600 hover:from-[#171717]/90 hover:to-slate-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Send className="w-5 h-5" />
            </Button>
            <Button
              size="lg"
              onClick={regenerate}
              variant="outline"
              disabled={isLoading}
              className="px-6 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex items-center justify-center mt-4 text-xs text-slate-500 dark:text-slate-400">
            <span>Press Enter to send • Shift + Enter for new line</span>
          </div>
        </div>
      </div>
    </div>
  );
}
