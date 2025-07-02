import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("analyst"), // admin, manager, analyst
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const analysts = pgTable("analysts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(), // junior, pleno, senior
  startDate: timestamp("start_date").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  dayOffEnabled: boolean("day_off_enabled").notNull().default(false),
  observations: text("observations"),
  performance: text("performance"), // excellent, good, average, needs_improvement
  currentSalary: decimal("current_salary", { precision: 10, scale: 2 }),
  lastSalaryAdjustment: timestamp("last_salary_adjustment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const vacationPeriods = pgTable("vacation_periods", {
  id: serial("id").primaryKey(),
  analystId: integer("analyst_id").notNull().references(() => analysts.id, { onDelete: "cascade" }),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const salaryHistory = pgTable("salary_history", {
  id: serial("id").primaryKey(),
  analystId: integer("analyst_id").notNull().references(() => analysts.id, { onDelete: "cascade" }),
  previousAmount: decimal("previous_amount", { precision: 10, scale: 2 }),
  newAmount: decimal("new_amount", { precision: 10, scale: 2 }).notNull(),
  adjustmentDate: timestamp("adjustment_date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertAnalystSchema = createInsertSchema(analysts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVacationPeriodSchema = createInsertSchema(vacationPeriods).omit({
  id: true,
  createdAt: true,
});

export const insertSalaryHistorySchema = createInsertSchema(salaryHistory).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Analyst = typeof analysts.$inferSelect;
export type InsertAnalyst = z.infer<typeof insertAnalystSchema>;
export type VacationPeriod = typeof vacationPeriods.$inferSelect;
export type InsertVacationPeriod = z.infer<typeof insertVacationPeriodSchema>;
export type SalaryHistory = typeof salaryHistory.$inferSelect;
export type InsertSalaryHistory = z.infer<typeof insertSalaryHistorySchema>;
