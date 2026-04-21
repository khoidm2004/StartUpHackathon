## Objective

This backend is part of the Startup Hackathon project and powers autonomous content generation workflows for SME-focused marketing operations.

Challenge: Build content generation pipeline that produces GEO-optimized, multilingual, brand-aligned marketing content autonomously for SME companies.

## AI Solution Architecture

The backend is designed as an AI pipeline with specialized agents:

- **Generate Content Agent**: Creates first-pass multilingual marketing content from company, topic, and language inputs.
- **Summary Agent (GEO Optimize)**: Refines and condenses generated content for clarity, relevance, and search intent.
- **Rating Agent (GEO Optimize)**: Scores outputs against brand alignment, multilingual quality, and GEO optimization criteria.
- **Report Agent (GEO Optimize)**: Produces structured evaluation feedback so teams can improve content iteratively.
- **Server + Database layer**: The server orchestrates each agent step, and the database stores inputs, outputs, scores, and reports for reuse.

## How The App Operates

1. The frontend sends brand profile, topic, and language data to backend API routes.
2. The server validates payloads and starts the Generate Content Agent.
3. GEO optimization agents (Summary, Rating, Report) process the generated content in sequence.
4. The backend stores generation artifacts and evaluation metadata in the database.
5. Final content plus quality insights are returned to the app for user review and iteration.

## Tech Stack

- Node.js + TypeScript
- Express 5
- Zod
- LangChain Core + Groq
- Supabase JavaScript client
- dotenv + CORS
