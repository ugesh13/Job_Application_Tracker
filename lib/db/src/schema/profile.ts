import { createInsertSchema } from "drizzle-zod";
import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const profilesTable = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 128 }).notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(),
  targetRole: text("target_role").notNull(),
  location: text("location").notNull(),
  avatarColor: text("avatar_color").notNull().default("#C88B62"),
  education: text("education"),
  experienceYears: integer("experience_years").default(0),
  careerGoal: text("career_goal"),
  bio: text("bio"),
});

export const insertProfileSchema = createInsertSchema(profilesTable).omit({ id: true, userId: true });
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profilesTable.$inferSelect;