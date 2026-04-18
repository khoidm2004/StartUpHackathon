import { ChatGroq } from "@langchain/groq";
import { HumanMessage } from "@langchain/core/messages";
import dotenv from "dotenv";
import { MODELS, SYNTHESIS_MODEL, GROQ_CONFIG, ModelConfig } from "../config/groqConfig";
import { analysisPrompt, buildSynthesisPrompt, AnalysisResults } from "../utils/prompts";
import { logger } from "../utils/logger";

dotenv.config();

// ============================================================
//  HELPER — convert LangChain message content to string
// ============================================================
function contentToString(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map((c) => (typeof c === "string" ? c : JSON.stringify(c))).join("");
  }
  return String(content);
}

// ============================================================
//  QUERY SINGLE MODEL — analysis prompt via chain
// ============================================================
async function queryModel(modelId: string, label: string): Promise<string> {
  logger.info(`Querying ${label}...`);

  const groq = new ChatGroq({
    model: modelId,
    apiKey: process.env.GROQ_API_KEY ?? "",
    temperature: GROQ_CONFIG.temperature,
    maxTokens: GROQ_CONFIG.maxTokens,
  });

  const chain = analysisPrompt.pipe(groq);
  const result = await chain.invoke({ context: "Finland, current trends, 2025" });

  const output = contentToString(result.content);
  logger.success(`${label} done (${output.length} chars)`);
  return output.trim();
}

// ============================================================
//  RUN 4 MODELS IN PARALLEL — same prompt
// ============================================================
export async function runParallelAnalysis(): Promise<AnalysisResults> {
  logger.divider("🚀 Running 4 Groq models in parallel...");

  const results = await Promise.allSettled(
    MODELS.map((m: ModelConfig) => queryModel(m.model, m.name))
  );

  const outputs: Partial<AnalysisResults> = {};

  MODELS.forEach((m: ModelConfig, i: number) => {
    const result = results[i];
    const key = m.id;
    if (result.status === "fulfilled") {
      outputs[key] = result.value;
    } else {
      logger.warn(`${m.name} failed: ${(result.reason as Error)?.message}`);
      outputs[key] = `[${m.name} failed: ${(result.reason as Error)?.message}]`;
    }
  });

  return outputs as AnalysisResults;
}

// ============================================================
//  RUN SYNTHESIS — build prompt as plain string, invoke directly
//  (avoids PromptTemplate type inference issues with LangChain)
// ============================================================
export async function runSynthesis(reports: AnalysisResults): Promise<string> {
  logger.divider("🧠 Running synthesis model...");

  const groq = new ChatGroq({
    model: SYNTHESIS_MODEL,
    apiKey: process.env.GROQ_API_KEY ?? "",
    temperature: 0.5,
    maxTokens: 4096,
  });

  // Build prompt as plain string — no PromptTemplate needed
  const prompt = buildSynthesisPrompt(reports);
  const result = await groq.invoke([new HumanMessage(prompt)]);

  const output = contentToString(result.content);
  logger.success(`Synthesis done (${output.length} chars)`);
  return output.trim();
}