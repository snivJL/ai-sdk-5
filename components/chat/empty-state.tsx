import { Bot } from "lucide-react";

export function EmptyState() {
  return (
    <div className="text-center py-12">
      <Bot className="w-12 h-12 text-slate-400 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
        Welcome to AI Chat
      </h2>
      <p className="text-slate-500 dark:text-slate-500">
        Start a conversation by typing a message below
      </p>
    </div>
  );
}
