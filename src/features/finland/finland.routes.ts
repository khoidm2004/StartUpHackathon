import { Request, Response, Router } from "express";
import { runFinlandPipeline } from "./finland.service";
import { logger } from "../../lib/logger";

export const finlandRouter = Router();

finlandRouter.get("/finland-summary", async (_req: Request, res: Response) => {
  logger.divider("📡 GET /api/finland-summary");
  try {
    const result = await runFinlandPipeline();
    res.json({ success: true, ...result });
  } catch (err) {
    logger.error((err as Error).message);
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

finlandRouter.post("/finland-summary", async (_req: Request, res: Response) => {
  logger.divider("📡 POST /api/finland-summary");
  try {
    const result = await runFinlandPipeline();
    res.json({ success: true, ...result });
  } catch (err) {
    logger.error((err as Error).message);
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});
