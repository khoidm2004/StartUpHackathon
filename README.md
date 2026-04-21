## Objective

This web app is part of the Startup Hackathon project and helps SME teams create consistent, multilingual marketing output faster.

Challenge: Build a content generation pipeline that produces GEO-optimized, multilingual, brand-aligned marketing content autonomously for SME companies.

## AI Pipeline Overview

The web app connects to a backend AI pipeline with specialized agents:

- Generate Content Agent creates first-pass multilingual marketing content.
- GEO optimization agents (Summary, Rating, Report) refine, evaluate, and explain output quality.
- The backend server orchestrates each step and stores outputs in the database for iteration and reuse.

## How the App Operates

1. The dashboard gathers hot topics from cities such as Tampere and Helsinki, then visualizes trends and AI suggestions for new content based on the brand profile.
2. The app generates multilingual content (email, video script, blog post) aligned with the brand profile, user input, and trending topics.
3. To view company branding context, navigate to the `Brand Profile` tab.
4. Users choose target language and content parameters from the dashboard.
5. The app sends requests to the AI pipeline to generate and GEO-optimize content.
6. Generated content and quality feedback can be iterated and reused across campaigns.

## Tech Stack

- React 18 + TypeScript
- Vite
- React Router
- Zustand
- i18next (with browser language detection)
- Supabase JavaScript client
