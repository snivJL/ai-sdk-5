"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, RotateCcw } from "lucide-react";

export function EmptyState() {
  const [message, setMessage] = useState("");

  const features = [
    {
      title: "Contextual Retrieval",
      description:
        "Efficiently retrieve relevant documents from your Knowledge Base",
    },
    {
      title: "Augmented Generation",
      description: "Generate precise answers by combining LLMs with your data",
    },
    {
      title: "Intelligent Chat",
      description: "Engage in natural conversations with your documents",
    },
  ];

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto p-6">
      {/* Welcome Section */}
      <div className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-[#171717] via-blue-600 to-[#171717] bg-clip-text text-transparent">
              KB Search
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl">
            Interact with your Knowledge Base. Ask questions, retrieve relevant
            documents, and get precise answers powered by advanced RAG
            technology.
          </p>

          {/* Feature Cards - no icons */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
