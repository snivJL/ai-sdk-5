import { tool } from "ai";
import z from "zod";

export const getInformationTool = tool({
  description: `get information from your knowledge base to answer questions.`,
  inputSchema: z.object({
    question: z.string().describe("the users question"),
    similarQuestions: z.array(z.string()).describe("keywords to search"),
  }),
  execute: async ({ question }) => {
    // const results = await Promise.all(
    //   similarQuestions.map(async (question) => {
    //     const response = await fetch("http://localhost:8000/api/query", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({ query: question }),
    //     });
    //      const response = await fetch("http://localhost:8000/api/query", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({ query: question }),
    //     });
    //     if (!response.ok) return []; // or throw error
    //     const data = await response.json();
    //     // Expecting: { documents: [...] }
    //     return data.documents || [];
    //   })
    // );
    const response = await fetch("http://localhost:8000/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: question }),
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.documents || [];
    // const results = await Promise.all(
    // const allDocs = results.flat();

    // const seen = new Set();
    // const uniqueDocs = allDocs.filter((doc) => {
    //   const key = doc.metadata.id;
    //   if (seen.has(key)) return false;
    //   seen.add(key);
    //   return true;
    // });
    console.log("found docs", uniqueDocs.length);
    return uniqueDocs.slice(3);
  },
});
