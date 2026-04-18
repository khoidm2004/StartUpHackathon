import { ChatGroq } from "@langchain/groq";

export function createContentGroqModel(): ChatGroq {
  const groqApiKey = process.env.GROQ_API_KEY;
  const groqModelId = process.env.GROQ_MODEL ?? "llama-3.1-8b-instant";

  return new ChatGroq({
    model: groqModelId,
    apiKey: groqApiKey ?? "",
    temperature: 0.3,
  });
}

export function getContentModelId(): string {
  return process.env.GROQ_MODEL ?? "llama-3.1-8b-instant";
}
