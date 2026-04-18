// ============================================================
//  GROQ MODEL CONFIG — 4 models, same prompt
// ============================================================

export interface ModelConfig {
  id: "report1" | "report2" | "report3" | "report4";
  name: string;
  model: string;
}

export const MODELS: ModelConfig[] = [
  {
    id: "report1",
    name: "Llama-3.3-70B",
    model: "llama-3.3-70b-versatile",
  },
  {
    id: "report2",
    name: "Llama-3.1-8B",
    model: "llama-3.1-8b-instant",
  },
  {
    id: "report3",
    name: "Gemma2-9B",
    model: "gemma2-9b-it",
  },
  {
    id: "report4",
    name: "Mixtral-8x7B",
    model: "mixtral-8x7b-32768",
  },
];

export const SYNTHESIS_MODEL = "llama-3.3-70b-versatile";

export const GROQ_CONFIG = {
  temperature: 0.7,
  maxTokens: 2048,
};