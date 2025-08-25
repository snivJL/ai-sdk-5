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
        "chat-model": openai("o4-mini"),
        "chat-model-reasoning": wrapLanguageModel({
          model: openai("o4-mini"),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
        "title-model": openai("o4-mini"),
        "artifact-model": openai("o4-mini"),
      },
      imageModels: {
        "small-model": openai.image("dall-e-3"),
      },
    });
