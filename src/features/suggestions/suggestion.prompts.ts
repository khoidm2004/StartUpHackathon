import { PromptTemplate } from "@langchain/core/prompts";

export const suggestionPrompt = PromptTemplate.fromTemplate(`
You are a marketing strategist for Finnish businesses.In 1 sentence, suggest the single best content piece for this company based on the trending topic.

Based on the company profile and the hottest trending topic below, suggest the single best piece of content this company should create next.

--- COMPANY PROFILE ---
Company name: {company_name}
Industries: {industries}
Headquarters: {hq_location}
Operating locations: {operating_locations}
Description: {description}

--- HOTTEST TOPIC RIGHT NOW ---
Title: {topic_title}
Category: {topic_category}
City: {topic_city}
Trend score: {topic_score}/100
Days trending: {topic_streak} days
Context: {topic_description}

--- OUTPUT RULES ---
Output ONLY the suggestion. No labels, no explanations, no "Here is my suggestion:".
Write 2 sentences maximum.
Be specific — mention the company name, the city, and a concrete content format (e.g. Instagram post, email campaign, blog post).
Make it actionable and ready to hand to a copywriter.
`);