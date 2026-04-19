import { ChatGroq } from "@langchain/groq";
import { createClient } from "@supabase/supabase-js";
import { extractTopicsPrompt } from "./topics.prompts";
import { messageContentToString } from "../../lib/groq/messageContent";
import { logger } from "../../lib/logger";

export interface Topic {
  rank: number;
  city: string;
  title: string;
  category: string;
  trend_score: number;
  streak_days: number;
  description: string;
}

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY are required");
  return createClient(url, key);
}

// Extract 10 topics from summary using Groq
export async function extractTopTopics(summary: string): Promise<Topic[]> {
  logger.info("Extracting top 10 topics from summary...");

  const model = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    apiKey: process.env.GROQ_API_KEY ?? "",
    temperature: 0.3,
    maxTokens: 2048,
  });

  const chain = extractTopicsPrompt.pipe(model);
  const result = await chain.invoke({ summary });

  const raw = messageContentToString(result.content).trim();
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const topics: Topic[] = JSON.parse(cleaned);

  logger.success(`Extracted ${topics.length} topics`);
  return topics;
}

// Save topics to Supabase (clear old ones first)
export async function saveTopicsToSupabase(topics: Topic[]): Promise<void> {
  logger.info("Saving topics to Supabase...");
  const supabase = getSupabaseClient();

  await supabase.from("topics").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const { error } = await supabase.from("topics").insert(topics);
  if (error) throw new Error(error.message);

  logger.success(`Saved ${topics.length} topics to Supabase`);
}

// Fetch topics filtered by city
export async function getTopicsByCity(city: string): Promise<Topic[]> {
  logger.info(`Fetching topics for city: ${city}...`);
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .ilike("city", city)
    .order("trend_score", { ascending: false });

  if (error) throw new Error(error.message);
  logger.success(`Fetched ${data.length} topics for ${city}`);
  return data;
}

// Fetch only title + streak_days for all topics
export async function getTopicsStreak(): Promise<{ title: string; city: string; streak_days: number }[]> {
  logger.info("Fetching topics streak...");
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("topics")
    .select("title, city, streak_days")
    .order("streak_days", { ascending: false });

  if (error) throw new Error(error.message);
  logger.success(`Fetched streak for ${data.length} topics`);
  return data;
}