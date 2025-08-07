import { Bot, Search, MessageSquare, Zap, Brain, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type LoadingMessageProps = {
  toolName?: string;
  step?: string;
};

const getToolConfig = (toolName?: string) => {
  switch (toolName) {
    case "getInformation":
      return {
        icon: Search,
        message: "Searching knowledge base",
        steps: [
          "Analyzing your question...",
          "Searching relevant documents...",
          "Extracting key information...",
          "Preparing context...",
        ],
        color: "text-emerald-600",
        bgColor: "bg-emerald-600",
        lightBg: "bg-emerald-50 dark:bg-emerald-950",
        dotColor: "bg-emerald-400",
        badgeVariant: "secondary" as const,
      };
    case "understandQuery":
      return {
        icon: Brain,
        message: "Understanding your query",
        steps: [
          "Parsing your question...",
          "Identifying key concepts...",
          "Reformulating for better search...",
          "Optimizing retrieval...",
        ],
        color: "text-purple-600",
        bgColor: "bg-purple-600",
        lightBg: "bg-purple-50 dark:bg-purple-950",
        dotColor: "bg-purple-400",
        badgeVariant: "secondary" as const,
      };
    default:
      return {
        icon: Bot,
        message: "AI is thinking",
        steps: [
          "Processing your request...",
          "Generating response...",
          "Finalizing answer...",
        ],
        color: "text-blue-600",
        bgColor: "bg-blue-600",
        lightBg: "bg-blue-50 dark:bg-blue-950",
        dotColor: "bg-slate-400",
        badgeVariant: "default" as const,
      };
  }
};

export function LoadingMessage({ toolName, step }: LoadingMessageProps) {
  const config = getToolConfig(toolName);
  const IconComponent = config.icon;

  // Simulate step progression if no specific step provided
  const currentStep =
    step || config.steps[Math.floor(Date.now() / 1500) % config.steps.length];

  return (
    <div className="flex gap-3 justify-start">
      <div className="flex-shrink-0 relative">
        <div
          className={`w-8 h-8 rounded-full ${config.bgColor} flex items-center justify-center relative overflow-hidden`}
        >
          <IconComponent className="w-4 h-4 text-white z-10" />
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
          {/* Pulsing ring */}
          <div
            className={`absolute -inset-1 rounded-full ${config.bgColor} opacity-20 animate-ping`}
          ></div>
        </div>

        {/* Floating sparkles */}
        <Sparkles
          className={`absolute -top-1 -right-1 w-3 h-3 ${config.color} animate-pulse`}
        />
      </div>

      <Card
        className={`max-w-[80%] p-4 ${config.lightBg} border-slate-200 dark:border-slate-700 relative overflow-hidden`}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-slide"></div>

        <div className="space-y-3 relative z-10">
          {/* Header with tool badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex space-x-1">
                <div
                  className={`w-2 h-2 ${config.dotColor} rounded-full animate-bounce [animation-delay:-0.3s]`}
                ></div>
                <div
                  className={`w-2 h-2 ${config.dotColor} rounded-full animate-bounce [animation-delay:-0.15s]`}
                ></div>
                <div
                  className={`w-2 h-2 ${config.dotColor} rounded-full animate-bounce`}
                ></div>
              </div>
              <span className={`text-sm font-medium ${config.color}`}>
                {config.message}
              </span>
            </div>

            {toolName && (
              <Badge variant={config.badgeVariant} className="text-xs">
                {toolName}
              </Badge>
            )}
          </div>

          {/* Current step */}
          <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            {currentStep}
          </div>

          {/* Enhanced progress bar */}
          <div className="space-y-2">
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full ${config.bgColor} rounded-full relative`}
                style={{
                  animation: "loading-progress 3s ease-in-out infinite",
                }}
              >
                {/* Shimmer effect on progress bar */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>

            {/* Step indicators */}
            <div className="flex justify-between">
              {config.steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
                    index <= (config.steps.indexOf(currentStep) || 0)
                      ? config.bgColor
                      : "bg-slate-300 dark:bg-slate-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>

      <style jsx>{`
        @keyframes loading-progress {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        @keyframes slide {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-slide {
          animation: slide 3s infinite;
        }
      `}</style>
    </div>
  );
}
