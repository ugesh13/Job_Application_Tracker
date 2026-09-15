import { createInsertSchema } from "drizzle-zod";
import { date, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const userProjectsTable = pgTable("user_projects", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 128 }).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  url: text("url"),
  skills: text("skills").array().notNull().default([]),  // array of skill names used in this project
  startDate: date("start_date", { mode: "string" }),
  endDate: date("end_date", { mode: "string" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertUserProjectSchema = createInsertSchema(userProjectsTable).omit({ id: true, userId: true, createdAt: true });
export type InsertUserProject = z.infer<typeof insertUserProjectSchema>;
export type UserProject = typeof userProjectsTable.$inferSelect;
