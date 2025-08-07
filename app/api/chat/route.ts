import { systemPrompt } from "@/lib/ai/prompts";
import { getInformationTool } from "@/lib/ai/tools/get-information";
import { understandQueryTool } from "@/lib/ai/understand-query";
import { openai } from "@ai-sdk/openai";
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  smoothStream,
  stepCountIs,
} from "ai";
import { NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();
    const lastMessages = messages.slice(-10);

    const result = streamText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages: convertToModelMessages(lastMessages),
      experimental_transform: smoothStream({
        delayInMs: 20,
        chunking: "word",
      }),
      stopWhen: [stepCountIs(5)],
      tools: {
        getInformation: getInformationTool,
        // understandQuery: understandQueryTool,
      },
      onError(error) {
        console.error("❌ streamText error:", error);
      },
    });

    // this will send your 200-streaming response
    return result.toUIMessageStreamResponse();
  } catch (err: unknown) {
    console.error("💥 API Error:", err);
    const message =
      err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
