import { PromptTemplate } from "@langchain/core/prompts";

export const contentGeneratedPrompt = PromptTemplate.fromTemplate(`
You are an expert content creator.

Using the user preferences and hot topics summary below, create a compelling piece of content.

--- USER PREFERENCES ---
{user_preferences}

--- HOT TOPICS SUMMARY ---
{hot_topics_summary}

--- INSTRUCTIONS ---
- If content type is "email": write a subject line + email body
- If content type is "blog post": write a title + introduction + 3 main sections + conclusion
- Match the tone and audience from user preferences
- Naturally incorporate the hot topics into the content
- Make it engaging and ready to publish
`);
