import { createInsertSchema } from "drizzle-zod";
import { boolean, integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const alertsTable = pgTable("alerts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 128 }).notNull(),
  query: text("query").notNull(),
  location: text("location").notNull(),
  frequency: text("frequency").notNull().default("Daily"),
  active: boolean("active").notNull().default(true),
  matchCount: integer("match_count").notNull().default(0),
});

export const insertAlertSchema = createInsertSchema(alertsTable).omit({ id: true, userId: true });
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alertsTable.$inferSelect;