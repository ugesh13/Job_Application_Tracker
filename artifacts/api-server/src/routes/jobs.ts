import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import { format, addDays } from "date-fns";
import { db, jobsTable } from "@workspace/db";
import { AuthenticatedRequest } from "../middleware/auth";
import {
  CreateJobBody,
  CreateJobResponse,
  DeleteJobParams,
  GetJobParams,
  GetJobResponse,
  ListJobsQueryParams,
  ListJobsResponse,
  UpdateJobBody,
  UpdateJobParams,
  UpdateJobResponse,
} from "@workspace/api-zod";
import { ensureSeedData, listTrackedJobs, serializeJob } from "../lib/jobs";

const router: IRouter = Router();

router.get("/jobs", async (req: AuthenticatedRequest, res): Promise<void> => {
  const parsed = ListJobsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const jobs = await listTrackedJobs(req.user!.uid, parsed.data);
  res.json(ListJobsResponse.parse(jobs));
});

router.post("/jobs", async (req: AuthenticatedRequest, res): Promise<void> => {
  await ensureSeedData();
  const parsed = CreateJobBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;
  const [job] = await db
    .insert(jobsTable)
    .values({
      userId: req.user!.uid,
      title: data.title,
      company: data.company,
      location: data.location ?? "Remote",
      stage: data.stage,
      nextAction: data.nextAction ?? "Follow up in 7 days",
      nextActionDate: data.nextActionDate ?? format(addDays(new Date(), 7), "yyyy-MM-dd"),
      postedAt: format(new Date(), "yyyy-MM-dd"),
      appliedAt: data.stage === "wishlist" ? null : format(new Date(), "yyyy-MM-dd"),
      salary: data.salary ?? "Not listed",
      experienceLevel: data.experienceLevel ?? "Mid-level",
      jobType: data.jobType ?? "Full-time",
      industry: data.industry ?? "Technology",
      saved: data.saved ?? false,
      companyColor: "#596B5C",
      description: data.description ?? null,
      url: data.url ?? null,
      notes: data.notes ?? null,
      contact: data.contact ?? null,
      recruiterName: data.recruiterName ?? null,
      recruiterEmail: data.recruiterEmail ?? null,
      interviewDate: data.interviewDate ?? null,
      followUpDate: data.followUpDate ?? null,
      resumeVersion: data.resumeVersion ?? null,
      skillsRequired: data.skillsRequired ?? [],
    })
    .returning();

  res.status(201).json(CreateJobResponse.parse(serializeJob(job)));
});

router.get("/jobs/:id", async (req: AuthenticatedRequest, res): Promise<void> => {
  await ensureSeedData();
  const params = GetJobParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [job] = await db.select().from(jobsTable).where(and(eq(jobsTable.id, params.data.id), eq(jobsTable.userId, req.user!.uid)));
  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }
  res.json(GetJobResponse.parse(serializeJob(job)));
});

router.patch("/jobs/:id", async (req: AuthenticatedRequest, res): Promise<void> => {
  await ensureSeedData();
  const params = UpdateJobParams.safeParse(req.params);
  const parsed = UpdateJobBody.safeParse(req.body);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;
  const update: Partial<typeof jobsTable.$inferInsert> = { ...data };
  if (data.stage) {
    update.stageUpdatedAt = new Date();
    update.appliedAt = data.stage === "wishlist" ? null : undefined;
  }
  const [job] = await db.update(jobsTable).set(update).where(and(eq(jobsTable.id, params.data.id), eq(jobsTable.userId, req.user!.uid))).returning();
  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }
  res.json(UpdateJobResponse.parse(serializeJob(job)));
});

router.delete("/jobs/:id", async (req: AuthenticatedRequest, res): Promise<void> => {
  await ensureSeedData();
  const params = DeleteJobParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [job] = await db.delete(jobsTable).where(and(eq(jobsTable.id, params.data.id), eq(jobsTable.userId, req.user!.uid))).returning();
  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;