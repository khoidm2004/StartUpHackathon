import { Router, Request, Response } from "express";
import { getAllCompanies } from "./companies.service";
import { logger } from "../../lib/logger";

export const companiesRouter = Router();

// GET /api/companies — fetch all companies
companiesRouter.get("/companies", async (_req: Request, res: Response) => {
  logger.divider("📡 GET /api/companies");
  try {
    const companies = await getAllCompanies();
    res.json({ success: true, count: companies.length, data: companies });
  } catch (err) {
    logger.error((err as Error).message);
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

