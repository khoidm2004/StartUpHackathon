import type { TopicsByCityResponse } from "../types/topics";

function getApiBase(): string {
  return (import.meta.env.VITE_API_BASE_URL ?? "").trim().replace(/\/$/, "");
}

function apiUrl(path: string): string {
  const base = getApiBase();
  const p = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${p}` : p;
}

/**
 * GET `/api/topics/city/:city` — saved topics for Helsinki or Tampere, by trend_score descending.
 */
export async function fetchTopicsByCity(
  city: "Helsinki" | "Tampere",
): Promise<TopicsByCityResponse> {
  const url = apiUrl(`/api/topics/city/${encodeURIComponent(city)}`);
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  const rawText = await res.text();
  let parsed: TopicsByCityResponse | Record<string, unknown> = {};
  if (rawText) {
    try {
      parsed = JSON.parse(rawText) as TopicsByCityResponse;
    } catch {
      if (!res.ok) {
        throw new Error(rawText || res.statusText || "Failed to load topics");
      }
      throw new Error("Topics response was not valid JSON");
    }
  }
  if (!res.ok) {
    const msg =
      (typeof (parsed as { error?: string }).error === "string" &&
        (parsed as { error: string }).error) ||
      (typeof (parsed as { message?: string }).message === "string" &&
        (parsed as { message: string }).message) ||
      rawText ||
      res.statusText ||
      "Failed to load topics";
    throw new Error(msg);
  }
  const data = parsed as TopicsByCityResponse;
  if (!data.success) {
    throw new Error("Topics request was not successful");
  }
  return data;
}
