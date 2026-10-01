import type { Request, Response } from "express";
import app from "./app";
import { seedDatabase } from "./services/seed.service";
import { logger } from "./lib/logger";

let isSeeded = false;

/**
 * Serverless function entry point for Vercel / AWS Lambda / cloud functions.
 * Lazily runs auto-seed once per cold start if AUTO_SEED is enabled and DB is empty.
 */
export default async function handler(req: Request, res: Response) {
  if (!isSeeded && process.env.AUTO_SEED !== "false") {
    try {
      isSeeded = true;
      await seedDatabase();
    } catch (err) {
      logger.error({ err }, "Auto-seed initialization error in serverless handler");
    }
  }

  return app(req, res);
}
