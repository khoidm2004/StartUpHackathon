import { PromptTemplate } from "@langchain/core/prompts";

// ============================================================
//  TYPES
// ============================================================
export interface AnalysisResults {
  report1: string;
  report2: string;
  report3: string;
  report4: string;
}

// ============================================================
//  ANALYSIS PROMPT — PromptTemplate, sent to all 4 models
// ============================================================
export const analysisPrompt = PromptTemplate.fromTemplate(`
You are a Finland trend intelligence analyst. Provide a comprehensive and highly detailed
report on the HOTTEST current trends, topics, and happenings in Finland right now.

Cover ALL sections below with specific details, real names, cities, and concrete examples:

## 1. CITIES & LOCAL HOTSPOTS
- What is trending in Helsinki, Tampere, Turku, Espoo, Oulu, and Rovaniemi?
- Hottest neighborhoods, districts, markets, pop-up events, and urban developments
- City-specific cultural shifts or lifestyle changes worth noting

## 2. CULTURE, ARTS & ENTERTAINMENT
- Hottest Finnish music artists, bands, or genres rising right now
- Trending Finnish films, TV shows, podcasts on Yle Areena / Netflix / Spotify
- Major art exhibitions, theatre productions, cultural festivals (Flow, Ruisrock, Helsinki Design Week)
- What Finns are talking about on social media — viral moments, memes, debates

## 3. FOOD & DINING TRENDS
- Hottest restaurants, cafés, or food concepts in Finnish cities right now
- Trending ingredients, cuisines, or unique dining experiences
- Popular food movements (plant-based, Nordic cuisine revival, local sourcing)
- New Finnish food brands or products gaining traction

## 4. TECH, STARTUPS & INNOVATION
- Hottest Finnish startups and scale-ups (recent funding rounds, launches, acquisitions)
- What Nokia, Rovio, Supercell, Wolt, and other Finnish tech giants are doing
- Finland's position in AI, gaming, cleantech, healthtech
- Emerging technologies being adopted by Finnish companies

## 5. BUSINESS & ECONOMY
- Key economic trends affecting Finland currently
- Industries that are booming or declining
- Notable Finnish companies making headlines
- Employment trends and workforce shifts

## 6. SOCIETY, POLITICS & LIFESTYLE
- Major social debates or movements in Finland right now
- Trending lifestyle topics: wellness, sustainability, housing, mental health
- Political topics Finns are actively discussing
- Changes in Finnish work culture or social norms

## 7. SPORTS & OUTDOOR ACTIVITIES
- Trending sports or outdoor activities (current season)
- Hot Finnish athletes or teams making news
- Major upcoming or recent sporting events in Finland

---

Be specific, data-driven, and professional. Write like a journalist briefing a C-suite executive.
Give concrete examples for every section — do NOT be vague.

Context: {context}
`);

// ============================================================
//  SYNTHESIS PROMPT — plain string builder (avoids LangChain
//  PromptTemplate type inference issues with dynamic variables)
// ============================================================
export function buildSynthesisPrompt(reports: AnalysisResults): string {
  return `
You are a senior editorial analyst specializing in Finland. You have received four separate
trend reports from four different AI analysts. Synthesize them into ONE definitive,
polished Finland Trend Intelligence Brief.

---

### ANALYST REPORT 1:
${reports.report1}

---

### ANALYST REPORT 2:
${reports.report2}

---

### ANALYST REPORT 3:
${reports.report3}

---

### ANALYST REPORT 4:
${reports.report4}

---

## SYNTHESIS RULES:

1. **Eliminate redundancy** — same topic mentioned by multiple analysts = include once, mark as confirmed.
2. **Highlight consensus** — mentioned by 2+ analysts = HIGH-CONFIDENCE trend.
3. **Preserve unique insights** — unique finding from 1 analyst = emerging signal.
4. **Same 7 sections** — Cities, Culture, Food, Tech, Business, Society, Sports.
5. **Executive Summary** at the top — 5-bullet TL;DR of the absolute hottest trends.
6. **Trend scores** for every major topic:
   - 🔥 Hot — confirmed by multiple sources, happening NOW
   - 📈 Rising — gaining momentum, worth watching
   - 👀 Watch — early signal, not yet confirmed
7. Professional, magazine-quality tone — like The Economist meets Wired.

Output in clean markdown format only.
`.trim();
}