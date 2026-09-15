import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db, jobsTable } from "@workspace/db";

const seedJobs = [
  ["Senior Product Designer", "Linear", "Remote", "interview", "Prepare your case study", 1, "2026-09-03", "2026-08-31", "₹28–34 LPA", "Senior", "Full-time", "Technology", false, "#5B62B7"],
  ["Product Designer", "Razorpay", "Bengaluru, India", "applied", "Send a follow-up", -2, "2026-08-27", "2026-08-20", "₹22–28 LPA", "Mid-level", "Full-time", "Fintech", false, "#176B87"],
  ["UX Researcher", "Figma", "Remote", "wishlist", "Review the role", 3, "2026-09-02", "2026-09-02", "$140–165k", "Mid-level", "Full-time", "Technology", true, "#A66F52"],
  ["Product Designer", "Atlassian", "Bengaluru, India", "applied", "Find a connection", -4, "2026-08-21", "2026-08-18", "₹25–32 LPA", "Mid-level", "Full-time", "Technology", false, "#1859A8"],
  ["Brand Designer", "Notion", "Remote", "offer", "Review compensation", 0, "2026-08-15", "2026-08-10", "$125–145k", "Mid-level", "Full-time", "Technology", true, "#222222"],
  ["Visual Designer", "Miro", "Remote", "rejected", "Write a quick reflection", -6, "2026-08-04", "2026-07-28", "$110–130k", "Mid-level", "Full-time", "Technology", false, "#FFD02F"],
  ["Design Systems Lead", "HubSpot", "Remote", "applied", "Follow up with recruiter", -9, "2026-08-06", "2026-07-31", "$150–175k", "Senior", "Full-time", "SaaS", false, "#FF7A59"],
  ["Product Designer", "Swiggy", "Hyderabad, India", "wishlist", "Tailor your portfolio", 5, "2026-09-01", "2026-09-01", "₹20–26 LPA", "Mid-level", "Full-time", "Consumer", true, "#FC8019"],
] as const;

const dateFromNow = (offset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
};

const dateDaysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

let seedPromise: Promise<void> | undefined;

export const ensureSeedData = () => {
  return Promise.resolve();
};

export const initialsFor = (company: string) =>
  company
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const serializeJob = (job: typeof jobsTable.$inferSelect) => {
  const daysInStage = Math.max(
    0,
    Math.floor((Date.now() - new Date(job.stageUpdatedAt).getTime()) / 86_400_000),
  );

  return {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    stage: job.stage,
    nextAction: job.nextAction,
    nextActionDate: job.nextActionDate,
    postedAt: job.postedAt,
    appliedAt: job.appliedAt,
    daysInStage,
    salary: job.salary,
    experienceLevel: job.experienceLevel,
    jobType: job.jobType,
    industry: job.industry,
    saved: job.saved,
    companyColor: job.companyColor,
    companyInitials: initialsFor(job.company),
    description: job.description,
    url: job.url,
    notes: job.notes,
    contact: job.contact,
    recruiterName: job.recruiterName ?? null,
    recruiterEmail: job.recruiterEmail ?? null,
    interviewDate: job.interviewDate ?? null,
    followUpDate: job.followUpDate ?? null,
    resumeVersion: job.resumeVersion ?? null,
    skillsRequired: job.skillsRequired ?? [],
  };
};

export const listTrackedJobs = async (userId: string, params: {
  search?: string;
  location?: string;
  industry?: string;
  salaryMin?: number;
  experienceLevel?: string;
  jobType?: string;
  savedOnly?: boolean;
  sort?: "recent" | "salary" | "relevance";
}) => {
  const filters = [eq(jobsTable.userId, userId)];

  if (params.search) {
    filters.push(or(ilike(jobsTable.title, `%${params.search}%`), ilike(jobsTable.company, `%${params.search}%`))!);
  }
  if (params.location) filters.push(ilike(jobsTable.location, `%${params.location}%`));
  if (params.industry) filters.push(eq(jobsTable.industry, params.industry));
  if (params.experienceLevel) filters.push(eq(jobsTable.experienceLevel, params.experienceLevel));
  if (params.jobType) filters.push(eq(jobsTable.jobType, params.jobType));
  if (params.savedOnly) filters.push(eq(jobsTable.saved, true));

  const orderBy =
    params.sort === "salary"
      ? desc(jobsTable.salary)
      : params.sort === "relevance"
        ? asc(jobsTable.title)
        : desc(jobsTable.createdAt);

  const jobs = await db
    .select()
    .from(jobsTable)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(orderBy);

  const serialized = jobs.map(serializeJob);
  if (!params.salaryMin) return serialized;

  return serialized.filter((job) => {
    const match = job.salary.match(/[\d,]+/);
    if (!match) return false;
    const amount = Number(match[0].replaceAll(",", ""));
    const normalized = job.salary.includes("₹") ? amount * 1000 : amount < 1000 ? amount * 1000 : amount;
    return normalized >= params.salaryMin!;
  });
};