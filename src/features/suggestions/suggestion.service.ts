import { ChatGroq } from "@langchain/groq";
import { createClient } from "@supabase/supabase-js";
import { suggestionPrompt } from "./suggestion.prompts";
import { messageContentToString } from "../../lib/groq/messageContent";
import { logger } from "../../lib/logger";

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY are required");
  return createClient(url, key);
}

export async function generateSuggestion(): Promise<{
  suggestion: string;
  based_on: { topic: string; city: string; company: string };
}> {
  logger.info("Fetching hottest topic and company from Supabase...");
  const supabase = getSupabaseClient();

  // fetch hottest topic (highest trend_score)
  const { data: topics, error: topicError } = await supabase
    .from("topics")
    .select("*")
    .order("trend_score", { ascending: false })
    .limit(1)
    .single();

  if (topicError || !topics) throw new Error("No topics found in Supabase. Run GET /api/topics first.");

  // fetch first company
  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("*")
    .limit(1)
    .single();

  if (companyError || !company) throw new Error("No company found in Supabase.");

  logger.success(`Hottest topic: ${topics.title} (${topics.city})`);
  logger.success(`Company: ${company.company_name}`);

  const model = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    apiKey: process.env.GROQ_API_KEY ?? "",
    temperature: 0.7,
    maxTokens: 512,
  });

  const chain = suggestionPrompt.pipe(model);
  const result = await chain.invoke({
    company_name: company.company_name,
    industries: company.industries.join(", "),
    hq_location: company.hq_location,
    operating_locations: company.business_operating_locations.join(", "),
    description: company.description,
    topic_title: topics.title,
    topic_category: topics.category,
    topic_city: topics.city,
    topic_score: topics.trend_score,
    topic_streak: topics.streak_days,
    topic_description: topics.description,
  });

  const suggestion = messageContentToString(result.content).trim();
  logger.success("Suggestion generated");

  return {
    suggestion,
    based_on: {
      topic: topics.title,
      city: topics.city,
      company: company.company_name,
    },
  };
}