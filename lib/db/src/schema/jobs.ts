import { createInsertSchema } from "drizzle-zod";
import { boolean, date, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const jobsTable = pgTable("jobs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 128 }).notNull(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull().default("Remote"),
  stage: text("stage").notNull().default("wishlist"),
  nextAction: text("next_action").notNull().default("Review the role"),
  nextActionDate: date("next_action_date", { mode: "string" }).notNull(),
  postedAt: date("posted_at", { mode: "string" }).notNull(),
  appliedAt: date("applied_at", { mode: "string" }),
  stageUpdatedAt: timestamp("stage_updated_at", { withTimezone: true }).notNull().defaultNow(),
  salary: text("salary").notNull().default("Not listed"),
  experienceLevel: text("experience_level").notNull().default("Mid-level"),
  jobType: text("job_type").notNull().default("Full-time"),
  industry: text("industry").notNull().default("Technology"),
  saved: boolean("saved").notNull().default(false),
  companyColor: text("company_color").notNull().default("#596B5C"),
  description: text("description"),
  url: text("url"),
  notes: text("notes"),
  contact: text("contact"),
  recruiterName: text("recruiter_name"),
  recruiterEmail: text("recruiter_email"),
  interviewDate: date("interview_date", { mode: "string" }),
  followUpDate: date("follow_up_date", { mode: "string" }),
  resumeVersion: text("resume_version"),
  skillsRequired: text("skills_required").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertJobSchema = createInsertSchema(jobsTable).omit({
  id: true,
  stageUpdatedAt: true,
  createdAt: true,
  userId: true,
});

export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobsTable.$inferSelect;