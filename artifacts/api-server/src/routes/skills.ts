import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import { db, userSkillsTable } from "@workspace/db";
import {
  CreateSkillBody,
  CreateSkillResponse,
  DeleteSkillParams,
  ListSkillsResponse,
} from "@workspace/api-zod";
import { AuthenticatedRequest } from "../middleware/auth";

const router: IRouter = Router();

router.get("/skills", async (req: AuthenticatedRequest, res): Promise<void> => {
  const skills = await db
    .select()
    .from(userSkillsTable)
    .where(eq(userSkillsTable.userId, req.user!.uid));

  res.json(ListSkillsResponse.parse(skills));
});

router.post("/skills", async (req: AuthenticatedRequest, res): Promise<void> => {
  const parsed = CreateSkillBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;
  const [skill] = await db
    .insert(userSkillsTable)
    .values({
      userId: req.user!.uid,
      name: data.name,
      proficiency: data.proficiency ?? "intermediate",
      yearsExperience: data.yearsExperience ?? 0,
    })
    .returning();

  res.status(201).json(CreateSkillResponse.parse(skill));
});

router.delete("/skills/:id", async (req: AuthenticatedRequest, res): Promise<void> => {
  const params = DeleteSkillParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [skill] = await db
    .delete(userSkillsTable)
    .where(
      and(
        eq(userSkillsTable.id, params.data.id),
        eq(userSkillsTable.userId, req.user!.uid),
      ),
    )
    .returning();

  if (!skill) {
    res.status(404).json({ error: "Skill not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
