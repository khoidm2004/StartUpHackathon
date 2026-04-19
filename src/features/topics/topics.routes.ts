import { Router, Request, Response } from "express";
import {
  extractTopTopics,
  saveTopicsToSupabase,
  getTopicsByCity,
  getTopicsStreak,
} from "./topics.service";
import { runFinlandPipeline } from "../finland/finland.service";
import { logger } from "../../lib/logger";

export const topicsRouter = Router();

// GET /api/topics
// Runs Finland pipeline → extracts 10 topics → saves to Supabase
topicsRouter.get("/topics", async (_req: Request, res: Response) => {
  logger.divider("GET /api/topics");
  try {
    const { summary } = await runFinlandPipeline();
    const topics = await extractTopTopics(summary);
    await saveTopicsToSupabase(topics);
    res.json({ success: true, count: topics.length, topics });
  } catch (err) {
    logger.error((err as Error).message);
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// GET /api/topics/city/:city
// Fetch hot trends by city from Supabase (Helsinki or Tampere)
topicsRouter.get("/topics/city/:city", async (req: Request<{ city: string }>, res: Response) => {
  const { city } = req.params;
  logger.divider(`GET /api/topics/city/${city}`);
  try {
    const topics = await getTopicsByCity(city);
    res.json({ success: true, city, count: topics.length, topics });
  } catch (err) {
    logger.error((err as Error).message);
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

// GET /api/topics/streak
// Fetch all topic names + streak_days from Supabase, ordered by longest streak
topicsRouter.get("/topics/streak", async (_req: Request, res: Response) => {
  logger.divider(" GET /api/topics/streak");
  try {
    const topics = await getTopicsStreak();
    res.json({ success: true, count: topics.length, topics });
  } catch (err) {
    logger.error((err as Error).message);
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});