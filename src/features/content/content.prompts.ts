import { PromptTemplate } from "@langchain/core/prompts";

export const contentGeneratedPrompt = PromptTemplate.fromTemplate(`
You are an expert content creator.

Using the user preferences and Finland hot topics summary below, create a compelling piece of content that is ready to publish directly — no explanations, no meta-commentary, no labels like "Here is your content:".

--- USER PREFERENCES ---
{user_preferences}

--- HOT TOPICS SUMMARY ---
{hot_topics_summary}

--- OUTPUT RULES ---
- Output the content ONLY. Nothing before or after it.
- If content type is "email": output Subject line first, then a blank line, then the email body.
- If content type is "blog post": output the title first, then the introduction, then 3 clearly separated sections with subheadings, then a conclusion.
- Match the tone, language, and audience from user preferences exactly.
- Naturally weave in 1–2 of the hot topics — do not force all of them.
- Keep it concise, punchy, and publication-ready.
- Do NOT include any explanatory text, disclaimers, or "Note:" sections.
`);
