import { Request, Response, Router } from "express";
import { HumanMessage } from "@langchain/core/messages";
import { contentGeneratedPrompt } from "./content.prompts";
import { createContentGroqModel, getContentModelId } from "./content.model";
import { messageContentToString } from "../../lib/groq/messageContent";

export const contentRouter = Router();

const model = createContentGroqModel();
const groqApiKey = process.env.GROQ_API_KEY;
const groqModelId = getContentModelId();

contentRouter.post("/generateContent", async (req: Request, res: Response) => {
  try {
    if (!groqApiKey?.trim()) {
      return res.status(500).json({ error: "GROQ_API_KEY is not configured" });
    }

    const { user_preferences, hot_topics_summary, finland_summary } = req.body as {
      user_preferences?: string;
      hot_topics_summary?: string;
      /** Pass-through from GET/POST /api/finland-summary ({ success, summary, analysis, ... }) */
      finland_summary?: { summary?: string };
    };

    const summaryFromFinland =
      typeof finland_summary?.summary === "string" ? finland_summary.summary.trim() : "";
    const summaryText = summaryFromFinland || hot_topics_summary?.trim() || "";

    if (!user_preferences?.trim() || !summaryText) {
      return res.status(400).json({
        error:
          "user_preferences is required; provide either finland_summary (object with summary from GET /api/finland-summary) or hot_topics_summary as a non-empty string",
      });
    }

    const chain = contentGeneratedPrompt.pipe(model);
    const result = await chain.invoke({
      user_preferences,
      hot_topics_summary: summaryText,
    });

    const raw = messageContentToString(result.content);
    const clean = raw
      .replace(/\*\*(.*?)\*\*/g, "$1")   // bold
      .replace(/\*(.*?)\*/g, "$1")        // italic
      .replace(/#{1,6}\s/g, "");          // headings

    res.json({ content: clean });
  } catch (error) {
    res.status(500).json({
      error: "Failed to generate content",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

contentRouter.get("/groq-test", async (_req: Request, res: Response) => {
  try {
    if (!groqApiKey?.trim()) {
      return res.status(500).json({ ok: false, error: "GROQ_API_KEY is not configured" });
    }

    const result = await model.invoke([new HumanMessage("Reply with exactly one word: pong")]);

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
