import { Router, type IRouter } from "express";
import { db, alertsTable } from "@workspace/db";
import {
  CreateAlertBody,
  CreateAlertResponse,
  ListAlertsResponse,
} from "@workspace/api-zod";
import { ensureSeedData } from "../lib/jobs";

import { AuthenticatedRequest } from "../middleware/auth";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

const ensureAlertSeed = () => {
  return Promise.resolve();
};

router.get("/alerts", async (req: AuthenticatedRequest, res): Promise<void> => {
  await ensureSeedData();
  await ensureAlertSeed();
  const limit = Math.min(parseInt(req.query.limit as string) || 100, 1000);
  const alerts = await db.select().from(alertsTable).where(eq(alertsTable.userId, req.user!.uid)).limit(limit);
  res.json(ListAlertsResponse.parse(alerts));
});

router.post("/alerts", async (req: AuthenticatedRequest, res): Promise<void> => {
  await ensureAlertSeed();
  const parsed = CreateAlertBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [alert] = await db
    .insert(alertsTable)
    .values({
      userId: req.user!.uid,
      query: parsed.data.query,
      location: parsed.data.location,
      frequency: parsed.data.frequency ?? "Daily",
      active: parsed.data.active ?? true,
      matchCount: 0,
    })
    .returning();
  res.status(201).json(CreateAlertResponse.parse(alert));
});

export default router;