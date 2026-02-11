import { sql, relations } from "drizzle-orm";
import {
  pgSchema,
  text,
  varchar,
  integer,
  timestamp,
  uuid,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// All tables live in the "blower" schema (not public)
// This ensures Drizzle generates "blower"."table_name" in all SQL
const blower = pgSchema("blower");

// ─── Users ───────────────────────────────────────────────

export const users = blower.table("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// ─── Leads ───────────────────────────────────────────────

export const leadStatusEnum = z.enum([
  "new",
  "no_answer",
  "voicemail",
  "interested",
  "callback",
  "not_interested",
  "exhausted",
]);
export type LeadStatus = z.infer<typeof leadStatusEnum>;

export const leadTypeEnum = z.enum([
  "physio",
  "chiro",
  "osteo",
  "multi",
  "wellness",
]);

export const leadSignalEnum = z.enum([
  "hiring",
  "ads",
  "local",
  "compound",
]);

export const leads = blower.table(
  "leads",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    name: text("name").notNull(),
    type: text("type").notNull().default("physio"),
    town: text("town"),
    phone: text("phone"),
    phoneLandline: text("phone_landline"),
    phoneNormalized: text("phone_normalized"),
    website: text("website"),
    notes: text("notes"),
    tier: integer("tier").default(2),
    signal: text("signal"),
    batch: text("batch"),
    batchLabel: text("batch_label"),
    status: text("status").notNull().default("new"),
    attemptCount: integer("attempt_count").notNull().default(0),
    lastCallAt: timestamp("last_call_at"),
    nextCallbackAt: timestamp("next_callback_at"),
    textedAt: timestamp("texted_at"),
    textMessage: text("text_message"),
    assignedUserId: varchar("assigned_user_id").references(() => users.id),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("leads_phone_normalized_idx").on(table.phoneNormalized),
    index("leads_status_idx").on(table.status),
    index("leads_batch_idx").on(table.batch),
    index("leads_next_callback_at_idx").on(table.nextCallbackAt),
  ],
);

export const insertLeadSchema = z.object({
  name: z.string().min(1),
  type: leadTypeEnum.default("physio"),
  town: z.string().nullish(),
  phone: z.string().nullish(),
  phoneLandline: z.string().nullish(),
  phoneNormalized: z.string().nullish(),
  website: z.string().nullish(),
  notes: z.string().nullish(),
  tier: z.number().int().min(1).max(3).default(2),
  signal: leadSignalEnum.nullish(),
  batch: z.string().nullish(),
  batchLabel: z.string().nullish(),
  status: leadStatusEnum.default("new"),
  attemptCount: z.number().int().default(0),
  lastCallAt: z.coerce.date().nullish(),
  nextCallbackAt: z.coerce.date().nullish(),
  textedAt: z.coerce.date().nullish(),
  textMessage: z.string().nullish(),
  assignedUserId: z.string().nullish(),
  deletedAt: z.coerce.date().nullish(),
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

// ─── Call Logs ───────────────────────────────────────────

export const dispositionEnum = z.enum([
  "no_answer",
  "interested",
  "not_interested",
  "voicemail",
  "callback",
]);
export type Disposition = z.infer<typeof dispositionEnum>;

export const callLogs = blower.table(
  "call_logs",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    leadId: varchar("lead_id")
      .notNull()
      .references(() => leads.id),
    userId: varchar("user_id").references(() => users.id),
    disposition: text("disposition").notNull(),
    notes: text("notes"),
    durationSeconds: integer("duration_seconds"),
    timestamp: timestamp("timestamp").notNull().defaultNow(),
    round: integer("round").notNull().default(1),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("call_logs_lead_id_idx").on(table.leadId),
    index("call_logs_timestamp_idx").on(table.timestamp),
  ],
);

export const insertCallLogSchema = z.object({
  leadId: z.string().min(1),
  userId: z.string().nullish(),
  disposition: dispositionEnum,
  notes: z.string().nullish(),
  durationSeconds: z.number().int().nullish(),
  timestamp: z.coerce.date().optional(),
  round: z.number().int().default(1),
});

export type InsertCallLog = z.infer<typeof insertCallLogSchema>;
export type CallLog = typeof callLogs.$inferSelect;

// ─── Daily Stats ─────────────────────────────────────────

export const dailyStats = blower.table(
  "daily_stats",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id),
    date: varchar("date", { length: 10 }).notNull(), // "2026-02-11"
    totalCalls: integer("total_calls").notNull().default(0),
    noAnswer: integer("no_answer").notNull().default(0),
    interested: integer("interested").notNull().default(0),
    notInterested: integer("not_interested").notNull().default(0),
    firstCallAt: timestamp("first_call_at"),
    lastCallAt: timestamp("last_call_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("daily_stats_user_date_idx").on(table.userId, table.date),
  ],
);

export const insertDailyStatsSchema = z.object({
  userId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  totalCalls: z.number().int().default(0),
  noAnswer: z.number().int().default(0),
  interested: z.number().int().default(0),
  notInterested: z.number().int().default(0),
  firstCallAt: z.coerce.date().nullish(),
  lastCallAt: z.coerce.date().nullish(),
});

export type InsertDailyStats = z.infer<typeof insertDailyStatsSchema>;
export type DailyStats = typeof dailyStats.$inferSelect;

// ─── Lead Tags ───────────────────────────────────────────

export const leadTags = blower.table(
  "lead_tags",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    leadId: varchar("lead_id")
      .notNull()
      .references(() => leads.id),
    tag: varchar("tag", { length: 100 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("lead_tags_lead_tag_idx").on(table.leadId, table.tag),
  ],
);

export const insertLeadTagSchema = z.object({
  leadId: z.string().min(1),
  tag: z.string().min(1).max(100),
});

export type InsertLeadTag = z.infer<typeof insertLeadTagSchema>;
export type LeadTag = typeof leadTags.$inferSelect;

// ─── Relations ───────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  leads: many(leads),
  callLogs: many(callLogs),
  dailyStats: many(dailyStats),
}));

export const leadsRelations = relations(leads, ({ one, many }) => ({
  assignedUser: one(users, {
    fields: [leads.assignedUserId],
    references: [users.id],
  }),
  callLogs: many(callLogs),
  tags: many(leadTags),
}));

export const callLogsRelations = relations(callLogs, ({ one }) => ({
  lead: one(leads, {
    fields: [callLogs.leadId],
    references: [leads.id],
  }),
  user: one(users, {
    fields: [callLogs.userId],
    references: [users.id],
  }),
}));

export const dailyStatsRelations = relations(dailyStats, ({ one }) => ({
  user: one(users, {
    fields: [dailyStats.userId],
    references: [users.id],
  }),
}));

export const leadTagsRelations = relations(leadTags, ({ one }) => ({
  lead: one(leads, {
    fields: [leadTags.leadId],
    references: [leads.id],
  }),
}));
