import { PromptTemplate } from "@langchain/core/prompts";

export interface AnalysisResults {
  report1: string;
  report2: string;
  report3: string;
  report4: string;
}

/**
 * Single analyst pass: one structured report. Kept compact so four parallel runs
 * stay focused; synthesis merges overlap across agents.
 */
export const analysisPrompt = PromptTemplate.fromTemplate(`You are a Finland trend analyst. Produce one report on what is most relevant in Finland **right now**, using the context as a framing hint.

**Audience:** busy executives. **Style:** concrete and scannable—name cities, companies, venues, people, or events when you can; mark uncertainty briefly instead of guessing.

**Use exactly these seven sections** (## headings in this order). Each section: short intro sentence plus bullets or compact paragraphs—depth over filler.

## 1. Cities & local hotspots
Major cities and regions (Helsinki capital region, Tampere only): what locals and visitors care about—neighborhoods, retail, events, mobility, seasonal urban life.

## 2. Culture, arts & entertainment
Music, publishing, games, film/TV/streaming, festivals, museums, theater; what is breaking through culturally or in social chatter.

## 3. Food & dining
Restaurants, cafés, ingredients, movements (Nordic, plant-based, local), notable products or brands.

## 4. Tech, startups & innovation
Startups, scale-ups, funding or M&A if relevant, larger tech employers, AI/gaming/cleantech/health angles; how companies are adopting new tech.

## 5. Business & economy
Macro themes, key sectors up or down, large employers in the news, jobs and skills.

## 6. Society, politics & lifestyle
Debates, policy, housing, welfare, environment, wellness, work-life norms—what Finns are arguing about or changing.

## 7. Sports & outdoor life
Current season / calendar; teams, athletes, major fixtures; outdoor culture relevant to the season.

Context: {context}`);

export function buildSynthesisPrompt(reports: AnalysisResults): string {
  const blocks = [
    ["A", reports.report1],
    ["B", reports.report2],
    ["C", reports.report3],
    ["D", reports.report4],
  ] as const;

  const inputs = blocks
    .map(([label, text]) => `### Report ${label}\n${text.trim()}`)
    .join("\n\n---\n\n");

  return `You merge four independent analyst drafts into **one** polished **Finland Trend Intelligence Brief** (markdown only).

${inputs}

---

**Do this:**
1. **Executive summary** — Five bullets: the strongest cross-cutting trends; no fluff.
2. **De-duplicate** — Same fact in multiple reports → state once; note when 2+ agree (**consensus**).
3. **Single-source** distinctive points → keep as **emerging** or **unconfirmed** where appropriate.
4. **Body** — Same seven themes as the inputs: Cities, Culture, Food, Tech, Business, Society, Sports. Use ## headings.
5. **Signals** — For important themes, tag line-level strength: **Hot** (supported by multiple reports or strong evidence), **Rising**, or **Watch** (thin evidence).
6. **Voice** — Professional magazine tone; avoid repeating filler across sections.

Output nothing except the brief.`.trim();
}
