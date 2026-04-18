import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage } from "@langchain/core/messages";
import { PromptTemplate } from "@langchain/core/prompts";

dotenv.config({ path: ".env" });

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5174",
].filter((o): o is string => Boolean(o));

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  }),
);

app.use(express.json());

const groqApiKey = process.env.GROQ_API_KEY;
const groqModelId = process.env.GROQ_MODEL ?? "llama-3.1-8b-instant";

const model = new ChatGroq({
  model: groqModelId,
  apiKey: groqApiKey ?? "",
  temperature: 0.3,
});

const prompt = PromptTemplate.fromTemplate(`
You are a professional meeting summarizer with validation capabilities.

FIRST, analyze if the provided text is actually meeting minutes or meeting-related content.

Meeting minutes typically contain:
- Discussion of topics or agenda items
- Decisions made or conclusions reached
- Action items or tasks assigned
- Participant information or attendees
- Date/time information
- Topics discussed in a professional context

If the text is NOT meeting minutes (e.g., random text, stories, code, personal messages, advertisements, etc.), respond EXACTLY with this format:
The provided text does not appear to be meeting minutes. Please provide actual meeting minutes containing discussions, decisions, or action items.

If the text IS valid meeting minutes, provide a structured summary in the following format:

1. DATE & ATTENDEES: List the date and attendees
2. BRIEF SUMMARY: A short overview of the meeting
3. KEY DECISIONS: List the main decisions made
4. ACTION ITEMS: List all action items with owners and deadlines
5. IMPORTANT DISCUSSION POINTS: Highlight key topics discussed
6. NEXT STEPS: What happens next

Meeting Minutes to Analyze:
{meetingMinutes}

Remember: If not meeting minutes, return the error JSON. If valid, provide the structured summary.
`);

function messageContentToString(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((c) => (typeof c === "string" ? c : JSON.stringify(c)))
      .join("");
  }
  return String(content);
}

app.post("/api/summarize", async (req, res) => {
  try {
    if (!groqApiKey?.trim()) {
      return res.status(500).json({ error: "GROQ_API_KEY is not configured" });
    }

    const { meetingMinutes } = req.body as { meetingMinutes?: string };
    if (!meetingMinutes || meetingMinutes.trim() === "") {
      return res.status(400).json({ error: "Meeting minutes are required" });
    }

    const chain = prompt.pipe(model);
    const result = await chain.invoke({ meetingMinutes });

    res.json({ summary: messageContentToString(result.content) });
  } catch (error) {
    res.status(500).json({
      error: "Failed to summarize meeting",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/** Smoke test: verifies GROQ_API_KEY, network, and model id via Groq API. */
app.get("/api/groq-test", async (_req, res) => {
  try {
    if (!groqApiKey?.trim()) {
      return res.status(500).json({
        ok: false,
        provider: "groq",
        error: "GROQ_API_KEY is not configured",
      });
    }

    const result = await model.invoke([
      new HumanMessage("Reply with exactly one word: pong"),
    ]);

    res.json({
      ok: true,
      provider: "groq",
      model: groqModelId,
      reply: messageContentToString(result.content),
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      provider: "groq",
      model: groqModelId,
      error: "Groq request failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
