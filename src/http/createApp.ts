import express from "express";
import cors from "cors";
import { healthRouter } from "./health.routes";
import { finlandRouter } from "../features/finland/finland.routes";
import { contentRouter } from "../features/content/content.routes";
import { companiesRouter } from "../features/companies/companies.routes";


const allowedOrigins = ["http://localhost:3000", "http://localhost:5174", "http://localhost:5173"].filter(
  (o): o is string => Boolean(o),
);

export function createApp() {
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

  app.use(healthRouter);
  app.use("/api", finlandRouter);
  app.use("/api", contentRouter);
  app.use("/api", companiesRouter);

  return app;
}
