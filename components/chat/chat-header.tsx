import { Bot } from "lucide-react";

export function ChatHeader() {
  return (
    <div className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Bot className="w-6 h-6 text-blue-600" />
          AI Chat Assistant
        </h1>
      </div>
    </div>
  );
}
