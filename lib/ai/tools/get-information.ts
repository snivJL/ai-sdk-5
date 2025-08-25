import { tool } from "ai";
import z from "zod";
const metadataSchema = z.object({
  title: z.string(),
  relevance: z.number(),
  company: z.string(),
  industry: z.string(),
  year: z.number(),
});

const vespaDocumentSchema = z.object({
  content: z.string(),
  metadata: z.object(metadataSchema),
});
export const getInformationTool = tool({
  description: `get information from your knowledge base to answer questions.`,
  inputSchema: z.object({
    question: z.string().describe("the user's question"),
  }),
  outputSchema: z.array(z.object(vespaDocumentSchema)),
  execute: async ({ question }) => {
    const response = await fetch("http://localhost:8000/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: question,
        industry: "Human Resources Technology",
      }),
    });
    if (!response.ok) return [];
    const data = await response.json();
    console.log(
      data.documents.map((doc) => ({
        metadata: {
          title: doc.metadata.title,
          relevance: doc.metadata.relevance,
          company: doc.metadata.company,
          industry: doc.metadata.industry,
          year: doc.metadata.year,
        },
      }))
    );
    return data.documents || [];
  },
});
