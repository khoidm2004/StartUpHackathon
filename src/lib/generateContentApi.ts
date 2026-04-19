import type { Company } from "../stores/companyStore";
import {
  buildUserPreferencesString,
  type ContentGeneratorCloudPayload,
  type FinlandSummaryPayload,
  type GenerateContentRequestBody,
} from "../types/contentGenerator";

function getApiBase(): string {
  return (import.meta.env.VITE_API_BASE_URL ?? "").trim().replace(/\/$/, "");
}

function apiUrl(path: string): string {
  const base = getApiBase();
  const p = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${p}` : p;
}

/**
 * GET `/api/finland-summary` — pass-through body for `generateContent.finland_summary`.
 */
export async function fetchFinlandSummary(): Promise<FinlandSummaryPayload> {
  const url = apiUrl("/api/finland-summary");
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  const rawText = await res.text();
  let parsed: FinlandSummaryPayload = {};
  if (rawText) {
    try {
      parsed = JSON.parse(rawText) as FinlandSummaryPayload;
    } catch {
      if (!res.ok) {
        throw new Error(rawText || res.statusText || "Failed to load Finland summary");
      }
      throw new Error("Finland summary response was not valid JSON");
    }
  }
  if (!res.ok) {
    const msg =
      (typeof parsed.error === "string" && parsed.error) ||
      (typeof (parsed as { message?: string }).message === "string" &&
        (parsed as { message: string }).message) ||
      rawText ||
      res.statusText ||
      "Failed to load Finland summary";
    throw new Error(msg);
  }
  return parsed;
}

function ensureSummaryContext(
  finland: FinlandSummaryPayload,
): { body: GenerateContentRequestBody; summaryText: string } {
  const summaryFromFinland =
    typeof finland.summary === "string" ? finland.summary.trim() : "";
  const fromAnalysis =
    typeof finland.analysis === "string" ? finland.analysis.trim() : "";

  const summaryText = summaryFromFinland || fromAnalysis;
  const body: GenerateContentRequestBody = {
    user_preferences: "", // filled by caller
    finland_summary: finland,
  };
  if (!summaryFromFinland && fromAnalysis) {
    body.hot_topics_summary = fromAnalysis;
  }
  return { body, summaryText };
}

export type GenerateContentResult = {
  /** Plain text or markdown from the API; `null` to fall back to UI sample copy. */
  content: string | null;
  title: string | null;
};

/**
 * Fetches `/api/finland-summary`, builds `user_preferences` from the form + company,
 * then POSTs to `/generateContent` with the router’s expected shape.
 */
export async function requestGenerateContent(
  form: ContentGeneratorCloudPayload,
  company: Company | null,
): Promise<GenerateContentResult> {
  const finland = await fetchFinlandSummary();
  const user_preferences = buildUserPreferencesString(form, company).trim();
  const { body: partial, summaryText } = ensureSummaryContext(finland);

  if (!user_preferences) {
    throw new Error("user_preferences is empty — fill in the generator form");
  }
  if (!summaryText) {
    throw new Error(
      "Finland summary did not include usable text (need `summary` or `analysis` from /api/finland-summary)",
    );
  }

  const payload: GenerateContentRequestBody = {
    ...partial,
    user_preferences,
  };

  const url = apiUrl("/api/generateContent");
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const rawText = await res.text();
  let parsed: Record<string, unknown> = {};

  if (rawText) {
    try {
      parsed = JSON.parse(rawText) as Record<string, unknown>;
    } catch {
      if (res.ok) {
        return { content: rawText, title: null };
      }
      throw new Error(rawText || res.statusText || "Invalid response");
    }
  }

  if (!res.ok) {
    const err =
      (typeof parsed.error === "string" && parsed.error) ||
      (typeof parsed.message === "string" && parsed.message) ||
      rawText ||
      res.statusText ||
      "Request failed";
    const details =
      typeof parsed.details === "string" ? parsed.details : undefined;
    throw new Error(details ? `${err}: ${details}` : err);
  }

  const content =
    (typeof parsed.content === "string" && parsed.content) ||
    (typeof parsed.text === "string" && parsed.text) ||
    (typeof parsed.generatedContent === "string" && parsed.generatedContent) ||
    (typeof parsed.body === "string" && parsed.body) ||
    null;

  const title =
    (typeof parsed.title === "string" && parsed.title) ||
    (typeof parsed.headline === "string" && parsed.headline) ||
    null;

  return { content, title };
}
