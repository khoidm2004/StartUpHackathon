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

const contentGeneratedPrompt = PromptTemplate.fromTemplate(`
You are an expert content creator.

Using the user preferences and hot topics summary below, create a compelling piece of content.

--- USER PREFERENCES ---
{user_preferences}

--- HOT TOPICS SUMMARY ---
{hot_topics_summary}

--- INSTRUCTIONS ---
- If content type is "email": write a subject line + email body
- If content type is "blog post": write a title + introduction + 3 main sections + conclusion
- Match the tone and audience from user preferences
- Naturally incorporate the hot topics into the content
- Make it engaging and ready to publish
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

app.post("/api/generateContent", async (req, res) => {
  try {
    if (!groqApiKey?.trim()) {
      return res.status(500).json({ error: "GROQ_API_KEY is not configured" });
    }

    const { user_preferences, hot_topics_summary } = req.body as {
      user_preferences?: string;
      hot_topics_summary?: string;
    };
    if (!user_preferences?.trim() || !hot_topics_summary?.trim()) {
      return res.status(400).json({
        error:
          "Both user_preferences and hot_topics_summary are required non-empty strings",
      });
    }

    const chain = contentGeneratedPrompt.pipe(model);
    const result = await chain.invoke({
      user_preferences,
      hot_topics_summary,
    });

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
