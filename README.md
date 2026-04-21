## Objective

This backend is part of the Startup Hackathon project and powers autonomous content generation workflows for SME-focused marketing operations.

Challenge: Build content generation pipeline that produces GEO-optimized, multilingual, brand-aligned marketing content autonomously for SME companies.

## How The App Operates

1. The frontend sends company profile, topic, and language inputs to backend API routes.
2. Validation and orchestration layers prepare structured prompts and generation context.
3. AI generation services create multilingual, brand-aligned marketing content.
4. Persistence services store and retrieve generated content and related metadata.
5. Responses are returned to the web app for review, iteration, and campaign usage.

## Tech Stack

- Node.js + TypeScript
- Express 5
- Zod
- LangChain Core + Groq
- Supabase JavaScript client
- dotenv + CORS
