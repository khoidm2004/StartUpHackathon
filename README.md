## Objective

This web app is part of the Startup Hackathon project and focuses on helping SME teams create consistent, multilingual marketing output faster.

Challenge: Build content generation pipeline that produces GEO-optimized, multilingual, brand-aligned marketing content autonomously for SME companies.

## AI Pipeline Overview

The web app connects to a backend AI pipeline with specialized agents:

- Generate Content Agent creates first-pass multilingual marketing content.
- GEO optimization agents (Summary, Rating, Report) refine, evaluate, and explain output quality.
- The backend server orchestrates each step and stores outputs in the database for iteration and reuse.

## How The App Operates

1. Users onboard their company profile, brand tone, and product context.
2. The app generates and manages multilingual topic ideas aligned with business goals.
3. Users choose target language and content parameters from the dashboard.
4. The app sends requests to the AI pipeline to generate and GEO-optimize content.
5. Generated content and quality feedback can be iterated and reused across campaigns.

## Tech Stack

- React 18 + TypeScript
- Vite
- React Router
- Zustand
- i18next (with browser language detection)
- Supabase JavaScript client
