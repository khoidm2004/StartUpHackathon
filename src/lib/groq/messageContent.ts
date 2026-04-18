/**
 * Normalize LangChain message content to a single string (shared across features).
 */
export function messageContentToString(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((c) => (typeof c === "string" ? c : JSON.stringify(c)))
      .join("");
  }
  return String(content);
}
