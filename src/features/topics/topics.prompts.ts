import { PromptTemplate } from "@langchain/core/prompts";

export const extractTopicsPrompt = PromptTemplate.fromTemplate(`
You are a Finland trend analyst. Given the Finland trend intelligence summary below,
extract exactly 10 hot topics — 5 for Helsinki and 5 for Tampere.

--- FINLAND SUMMARY ---
{summary}

--- INSTRUCTIONS ---
- Return exactly 10 topics total: 5 for Helsinki, 5 for Tampere
- Order each city group by hotness, hottest first
- Each topic must have these exact fields:
  - rank: number from 1 to 10 (1 = hottest overall)
  - city: either "Helsinki" or "Tampere"
  - title: short topic name
  - category: one of Tech, Culture, Food, Business, Society, Sports, Lifestyle
  - trend_score: a number from 1 to 100 representing how hot this topic is (100 = hottest)
  - streak_days: estimated number of days this topic has been trending (1 to 30)
  - description: one sentence explaining why this topic is trending in that city
- Respond ONLY with a valid JSON array, no markdown, no explanation, no code fences
- Do not include any text before or after the JSON array
`);