import { Request, Response, Router } from "express";

export const healthRouter = Router();

healthRouter.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", groq_token_set: !!process.env.GROQ_API_KEY });
});
