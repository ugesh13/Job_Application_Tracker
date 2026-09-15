import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, jobsTable } from "@workspace/db";
import { GetDashboardResponse } from "@workspace/api-zod";
import { ensureSeedData } from "../lib/jobs";
import { AuthenticatedRequest } from "../middleware/auth";

const router: IRouter = Router();

router.get("/dashboard", async (req: AuthenticatedRequest, res): Promise<void> => {
  await ensureSeedData();
  const jobs = await db.select().from(jobsTable).where(eq(jobsTable.userId, req.user!.uid));
  const applications = jobs.filter((job) => job.stage !== "wishlist");
  const interviews = jobs.filter((job) => job.stage === "interview" || job.stage === "offer");
  const todayStr = new Date().toISOString().slice(0, 10);
  const needsAction = jobs.filter(
    (job) => job.stage !== "offer" && job.stage !== "rejected" && job.nextActionDate <= todayStr,
  );
  const averageDays =
    jobs.length === 0
      ? 0
      : Math.round(
          jobs.reduce(
            (total, job) =>
              total + Math.max(0, Math.floor((Date.now() - new Date(job.stageUpdatedAt).getTime()) / 86_400_000)),
            0,
          ) / jobs.length,
        );

  // Dynamic 4-week series calculation
  const now = Date.now();
  const ONE_WEEK = 7 * 86_400_000;
  const weekSeries = [
    { label: "3 wks ago", applications: 0, interviews: 0 },
    { label: "2 wks ago", applications: 0, interviews: 0 },
    { label: "Last week", applications: 0, interviews: 0 },
    { label: "This week", applications: 0, interviews: 0 },
  ];

  for (const job of jobs) {
    const jobTime = job.appliedAt ? new Date(job.appliedAt).getTime() : new Date(job.stageUpdatedAt).getTime();
    const diffWeeks = Math.floor((now - jobTime) / ONE_WEEK);
    const bucketIndex = 3 - diffWeeks;
    if (bucketIndex >= 0 && bucketIndex < 4) {
      if (job.stage !== "wishlist") {
        weekSeries[bucketIndex].applications += 1;
      }
      if (job.stage === "interview" || job.stage === "offer") {
        weekSeries[bucketIndex].interviews += 1;
      }
    }
  }

  // Dynamic activity stream generated from real jobs
  const activity: Array<{ id: number; text: string; time: string; tone: string }> = [];

  const urgentAction = jobs.find((j) => j.nextActionDate <= todayStr && j.stage !== "rejected" && j.stage !== "offer");
  if (urgentAction) {
    activity.push({
      id: urgentAction.id * 10 + 1,
      text: `Action due for ${urgentAction.company}: ${urgentAction.nextAction}`,
      time: "Today",
      tone: "amber",
    });
  }

  const recentInterview = jobs.find((j) => j.stage === "interview" || j.stage === "offer");
  if (recentInterview) {
    activity.push({
      id: recentInterview.id * 10 + 2,
      text: `${recentInterview.stage === "offer" ? "Offer received from" : "Interview round active at"} ${recentInterview.company}`,
      time: "Recent",
      tone: "green",
    });
  }

  const recentApplied = jobs.find((j) => j.stage === "applied");
  if (recentApplied) {
    activity.push({
      id: recentApplied.id * 10 + 3,
      text: `Application submitted to ${recentApplied.company} for ${recentApplied.title}`,
      time: recentApplied.appliedAt || "Recent",
      tone: "blue",
    });
  }

  if (activity.length === 0) {
    activity.push({
      id: 999,
      text: "Welcome to Momentum! Add target roles to unlock AI career guidance.",
      time: "Just now",
      tone: "green",
    });
  }

  const data = {
    applicationsSent: applications.length,
    responseRate: applications.length ? Math.round(((interviews.length + jobs.filter((job) => job.stage === "rejected").length) / applications.length) * 100) : 0,
    interviews: interviews.length,
    averageDays,
    needsAction: needsAction.length,
    weekSeries,
    activity: activity.slice(0, 5),
  };

  res.json(GetDashboardResponse.parse(data));
});

export default router;