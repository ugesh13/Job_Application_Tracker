import { createInsertSchema } from "drizzle-zod";
import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const userSkillsTable = pgTable("user_skills", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 128 }).notNull(),
  name: text("name").notNull(),
  proficiency: text("proficiency").notNull().default("intermediate"), // beginner, intermediate, advanced, expert
  yearsExperience: integer("years_experience").notNull().default(0),
});

export const insertUserSkillSchema = createInsertSchema(userSkillsTable).omit({ id: true, userId: true });
export type InsertUserSkill = z.infer<typeof insertUserSkillSchema>;
export type UserSkill = typeof userSkillsTable.$inferSelect;
