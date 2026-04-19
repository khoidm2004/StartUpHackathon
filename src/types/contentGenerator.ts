import type { Company } from "../stores/companyStore";

export const CONTENT_TYPE_KEYS = ["blogPost", "video", "email"] as const;
export type ContentTypeKey = (typeof CONTENT_TYPE_KEYS)[number];

/** Form values for cloud/API requests (generate, save draft, etc.). */
export type ContentGeneratorCloudPayload = {
  /** Selected industry key, e.g. `food`, `retail`, `professional`, `health`, or `""` if unset. */
  industry: string;
  audience: string;
  geo: string;
  outputLanguage: "en" | "fi";
  contentType: ContentTypeKey;
  prompt: string;
};

/**
 * Pass-through from GET/POST `/api/finland-summary`
 * (e.g. `{ success, summary, analysis, ... }`).
 */
export type FinlandSummaryPayload = {
  success?: boolean;
  summary?: string;
  analysis?: string;
} & Record<string, unknown>;

/**
 * POST body for `POST …/generateContent` — matches the content router contract.
 */
export type GenerateContentRequestBody = {
  user_preferences: string;
  hot_topics_summary?: string;
  /** Pass-through from `/api/finland-summary`; server reads `summary` for context. */
  finland_summary?: FinlandSummaryPayload;
};

export function buildUserPreferencesString(
  form: ContentGeneratorCloudPayload,
  company: Company | null,
): string {
  const lines: string[] = [
    `Content type: ${form.contentType}`,
    `Output language: ${form.outputLanguage}`,
    `Industry: ${form.industry.trim() || "(not set)"}`,
    `Audience: ${form.audience.trim() || "(not set)"}`,
    `GEO / location focus: ${form.geo.trim() || "(not set)"}`,
    "",
    "Creative brief / prompt:",
    form.prompt.trim() || "(empty)",
  ];
  if (company) {
    lines.push(
      "",
      "Company context (from workspace):",
      `Name: ${company.company_name}`,
      `Headquarters: ${company.hq_location}`,
      `Industries: ${company.industries.join(", ") || "(none)"}`,
      `Operating locations: ${company.business_operating_locations.join(", ") || "(none)"}`,
      "",
      "Company profile:",
      company.description.trim() || "(empty)",
    );
  }
  return lines.join("\n");
}
