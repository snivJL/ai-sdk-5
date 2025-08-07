import { openai } from "@ai-sdk/openai";
import { generateObject, tool } from "ai";
import z from "zod";

export const understandQueryTool = tool({
  description: `understand the users query. use this tool on every prompt.`,
  inputSchema: z.object({
    query: z.string().describe("the users query"),
    toolsToCallInOrder: z
      .array(z.string())
      .describe(
        "these are the tools you need to call in the order necessary to respond to the users query"
      ),
  }),
  //   execute: async ({ query }) => {
  //     const {
  //       object: { questions },
  //     } = await generateObject({
  //       model: openai("gpt-4o"),
  //       system: `
  //         You are a hybrid‐search optimization assistant.
  //         Given any user query, produce concise reformulations that:
  //         • Preserve the original intent (semantic similarity)
  //         • Surface core keywords for exact‐match retrieval
  //         Output up to three suggestions.`,
  //       schema: z.object({
  //         questions: z
  //           .array(z.string().min(1))
  //           .max(3)
  //           .describe(
  //             "Up to three reformulated queries optimized for hybrid similarity + keyword search."
  //           ),
  //       }),
  //       prompt: `Original query: "${query}"
  // Generate up to 3 reformulated queries that blend semantic variation and key-term emphasis.`,
  //     });

  //     return questions;
  //   },
  execute: async ({ query }) => {
    const {
      object: { questions },
    } = await generateObject({
      model: openai("gpt-4o"),
      system: `
You are a Query Reformulator for a hybrid‐search RAG system.
Rewrite the user’s free-form question into up to three concise, search-optimized queries for our vector KB. When reformulating:
 • Preserve the original intent and semantic meaning.
 • Emphasize core keywords and entities for exact-match retrieval.
 • Expand with relevant synonyms, abbreviations, and domain-specific terms.
 • Preserve numbers, dates, names, and technical keywords verbatim.
 • Remove filler words, polite framing, and stop-phrases.
 • Split compound questions into logical sub-queries using AND/OR where useful.
    `,
      schema: z.object({
        questions: z
          .array(z.string().min(1))
          .max(3)
          .describe(
            "Up to three reformulated queries optimized for hybrid similarity + keyword search."
          ),
      }),
      prompt: `Original query: "${query}"`,
    });

    return questions;
  },
});
