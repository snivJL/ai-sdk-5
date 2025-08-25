import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { isTestEnvironment } from "../constants";

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {},
    })
  : customProvider({
      languageModels: {
        "chat-model": openai("gpt-4.1"),
        "chat-model-reasoning": wrapLanguageModel({
          model: openai("gpt-4.1"),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
        "title-model": openai("gpt-4.1"),
        "artifact-model": openai("gpt-4.1"),
      },
      imageModels: {
        "small-model": openai.image("dall-e-3"),
      },
    });
