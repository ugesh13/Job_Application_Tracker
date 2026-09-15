import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import { db, userProjectsTable } from "@workspace/db";
import {
  CreateProjectBody,
  CreateProjectResponse,
  DeleteProjectParams,
  ListProjectsResponse,
  UpdateProjectBody,
  UpdateProjectParams,
  UpdateProjectResponse,
} from "@workspace/api-zod";
import { AuthenticatedRequest } from "../middleware/auth";

const router: IRouter = Router();

const serializeProject = (project: typeof userProjectsTable.$inferSelect) => ({
  id: project.id,
  name: project.name,
  description: project.description ?? null,
  url: project.url ?? null,
  skills: project.skills ?? [],
  startDate: project.startDate ?? null,
  endDate: project.endDate ?? null,
  createdAt: project.createdAt.toISOString(),
});

router.get("/projects", async (req: AuthenticatedRequest, res): Promise<void> => {
  const projects = await db
    .select()
    .from(userProjectsTable)
    .where(eq(userProjectsTable.userId, req.user!.uid));

  res.json(ListProjectsResponse.parse(projects.map(serializeProject)));
});

router.post("/projects", async (req: AuthenticatedRequest, res): Promise<void> => {
  const parsed = CreateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;
  const [project] = await db
    .insert(userProjectsTable)
    .values({
      userId: req.user!.uid,
      name: data.name,
      description: data.description ?? null,
      url: data.url ?? null,
      skills: data.skills ?? [],
      startDate: data.startDate ?? null,
      endDate: data.endDate ?? null,
    })
    .returning();

  res.status(201).json(CreateProjectResponse.parse(serializeProject(project)));
});

router.patch("/projects/:id", async (req: AuthenticatedRequest, res): Promise<void> => {
  const params = UpdateProjectParams.safeParse(req.params);
  const parsed = UpdateProjectBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;
  const [project] = await db
    .update(userProjectsTable)
    .set({
      name: data.name,
      description: data.description ?? null,
      url: data.url ?? null,
      skills: data.skills ?? [],
      startDate: data.startDate ?? null,
      endDate: data.endDate ?? null,
    })
    .where(
      and(
        eq(userProjectsTable.id, params.data.id),
        eq(userProjectsTable.userId, req.user!.uid),
      ),
    )
    .returning();

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  res.json(UpdateProjectResponse.parse(serializeProject(project)));
});

router.delete("/projects/:id", async (req: AuthenticatedRequest, res): Promise<void> => {
  const params = DeleteProjectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [project] = await db
    .delete(userProjectsTable)
    .where(
      and(
        eq(userProjectsTable.id, params.data.id),
        eq(userProjectsTable.userId, req.user!.uid),
      ),
    )
    .returning();

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
