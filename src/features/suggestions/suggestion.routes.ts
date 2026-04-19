import { Router, Request, Response } from "express";
import { generateSuggestion } from "./suggestion.service";
import { logger } from "../../lib/logger";

export const suggestionRouter = Router();

// GET /api/suggestion
// No input needed — reads hottest topic + company from Supabase, generates suggestion
suggestionRouter.get("/suggestion", async (_req: Request, res: Response) => {
  logger.divider("GET /api/suggestion");
  try {
    const result = await generateSuggestion();
    res.json({ success: true, ...result });
  } catch (err) {
    logger.error((err as Error).message);
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});