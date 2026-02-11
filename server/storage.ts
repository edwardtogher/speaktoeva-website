import { eq, and, or, ilike, sql, desc, asc, lte, gte, count, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import {
  type User,
  type InsertUser,
  type Lead,
  type InsertLead,
  type CallLog,
  type InsertCallLog,
  type DailyStats,
  type LeadTag,
  users,
  leads,
  callLogs,
  dailyStats,
  leadTags,
  type Disposition,
} from "@shared/schema";
import * as schema from "@shared/schema";
import { randomUUID } from "crypto";

// ─── Callback cadence ────────────────────────────────────
// After attempt N with no_answer/voicemail, schedule next callback:
const CALLBACK_CADENCE_DAYS: Record<number, number> = {
  1: 1,
  2: 1,
  3: 2,
  4: 2,
  5: 3,
  6: 4,
};
const MAX_ATTEMPTS = 7;

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9+]/g, "");
}

function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

// ─── Interface ───────────────────────────────────────────

export interface LeadFilters {
  batch?: string;
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface BatchStats {
  batch: string;
  batchLabel: string | null;
  total: number;
  new: number;
  noAnswer: number;
  interested: number;
  notInterested: number;
  exhausted: number;
  callback: number;
}

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Leads
  getLeads(filters: LeadFilters): Promise<Lead[]>;
  getLeadById(id: string): Promise<(Lead & { callLogs: CallLog[]; tags: LeadTag[] }) | undefined>;
  bulkImportLeads(data: InsertLead[]): Promise<{ imported: number; skipped: number }>;
  updateLead(id: string, updates: Partial<Lead>): Promise<Lead>;
  logCallDisposition(
    leadId: string,
    userId: string,
    data: { disposition: Disposition; notes?: string; nextCallbackAt?: Date; durationSeconds?: number },
  ): Promise<{ lead: Lead; callLog: CallLog }>;
  markLeadTexted(leadId: string, message: string): Promise<Lead>;
  checkPhoneDuplicate(phone: string): Promise<{ exists: boolean; lead?: Lead }>;
  getFollowups(date: string, userId?: string): Promise<Lead[]>;

  // Stats
  getDailyStats(userId: string, date: string): Promise<DailyStats | undefined>;
  getStreak(userId: string): Promise<{ streak: number; personalBest: number }>;
  getBatchStats(batch?: string): Promise<BatchStats[]>;

  // Call logs
  getCallLogs(filters: { leadId?: string; userId?: string; limit?: number; offset?: number }): Promise<CallLog[]>;

  // Batches
  getBatches(): Promise<{ batch: string; batchLabel: string | null; count: number }[]>;

  // Tags
  setLeadTags(leadId: string, tags: string[]): Promise<void>;
}

// ─── Database Storage ────────────────────────────────────

export class DatabaseStorage implements IStorage {
  private db;

  constructor(databaseUrl: string) {
    const pool = new Pool({ connectionString: databaseUrl });
    this.db = drizzle(pool, { schema });
  }

  // ── Users ──

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await this.db.insert(users).values(insertUser).returning();
    return user;
  }

  // ── Leads ──

  async getLeads(filters: LeadFilters): Promise<Lead[]> {
    const conditions = [isNull(leads.deletedAt)];

    if (filters.batch) {
      conditions.push(eq(leads.batch, filters.batch));
    }
    if (filters.status) {
      conditions.push(eq(leads.status, filters.status));
    }
    if (filters.search) {
      conditions.push(
        or(
          ilike(leads.name, `%${filters.search}%`),
          ilike(leads.town, `%${filters.search}%`),
          ilike(leads.phone, `%${filters.search}%`),
        )!,
      );
    }

    return this.db
      .select()
      .from(leads)
      .where(and(...conditions))
      .orderBy(asc(leads.name))
      .limit(filters.limit ?? 100)
      .offset(filters.offset ?? 0);
  }

  async getLeadById(id: string): Promise<(Lead & { callLogs: CallLog[]; tags: LeadTag[] }) | undefined> {
    const [lead] = await this.db.select().from(leads).where(eq(leads.id, id)).limit(1);
    if (!lead) return undefined;

    const logs = await this.db
      .select()
      .from(callLogs)
      .where(eq(callLogs.leadId, id))
      .orderBy(desc(callLogs.timestamp));

    const tags = await this.db.select().from(leadTags).where(eq(leadTags.leadId, id));

    return { ...lead, callLogs: logs, tags };
  }

  async bulkImportLeads(data: InsertLead[]): Promise<{ imported: number; skipped: number }> {
    let imported = 0;
    let skipped = 0;

    for (const lead of data) {
      const normalized = lead.phone ? normalizePhone(lead.phone) : null;

      if (normalized) {
        const existing = await this.db
          .select({ id: leads.id })
          .from(leads)
          .where(eq(leads.phoneNormalized, normalized))
          .limit(1);

        if (existing.length > 0) {
          skipped++;
          continue;
        }
      }

      await this.db.insert(leads).values({
        ...lead,
        phoneNormalized: normalized,
      });
      imported++;
    }

    return { imported, skipped };
  }

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    const [lead] = await this.db
      .update(leads)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();
    return lead;
  }

  async logCallDisposition(
    leadId: string,
    userId: string,
    data: { disposition: Disposition; notes?: string; nextCallbackAt?: Date; durationSeconds?: number },
  ): Promise<{ lead: Lead; callLog: CallLog }> {
    const now = new Date();

    // Get current lead state
    const [currentLead] = await this.db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
    if (!currentLead) throw new Error(`Lead ${leadId} not found`);

    // Create call log
    const [callLog] = await this.db
      .insert(callLogs)
      .values({
        leadId,
        userId,
        disposition: data.disposition,
        notes: data.notes ?? null,
        durationSeconds: data.durationSeconds ?? null,
        timestamp: now,
      })
      .returning();

    // Determine lead updates based on disposition
    const leadUpdates: Partial<Lead> = {
      lastCallAt: now,
      updatedAt: now,
    };

    switch (data.disposition) {
      case "interested": {
        leadUpdates.status = "interested";
        leadUpdates.nextCallbackAt = null;
        break;
      }
      case "not_interested": {
        leadUpdates.status = "not_interested";
        leadUpdates.nextCallbackAt = null;
        break;
      }
      case "callback": {
        leadUpdates.status = "callback";
        leadUpdates.nextCallbackAt = data.nextCallbackAt ?? null;
        break;
      }
      case "no_answer":
      case "voicemail": {
        const newAttemptCount = currentLead.attemptCount + 1;
        leadUpdates.attemptCount = newAttemptCount;

        if (newAttemptCount >= MAX_ATTEMPTS) {
          leadUpdates.status = "exhausted";
          leadUpdates.nextCallbackAt = null;
        } else {
          leadUpdates.status = data.disposition;
          const daysToAdd = CALLBACK_CADENCE_DAYS[newAttemptCount] ?? 4;
          leadUpdates.nextCallbackAt = addDays(now, daysToAdd);
        }
        break;
      }
    }

    const [lead] = await this.db
      .update(leads)
      .set(leadUpdates)
      .where(eq(leads.id, leadId))
      .returning();

    // Upsert daily stats
    await this.upsertDailyStats(userId, now, data.disposition);

    return { lead, callLog };
  }

  private async upsertDailyStats(userId: string, now: Date, disposition: Disposition): Promise<void> {
    const date = now.toISOString().slice(0, 10);

    const [existing] = await this.db
      .select()
      .from(dailyStats)
      .where(and(eq(dailyStats.userId, userId), eq(dailyStats.date, date)))
      .limit(1);

    if (existing) {
      const updates: Record<string, unknown> = {
        totalCalls: existing.totalCalls + 1,
        lastCallAt: now,
        updatedAt: new Date(),
      };
      if (disposition === "no_answer" || disposition === "voicemail") {
        updates.noAnswer = existing.noAnswer + 1;
      } else if (disposition === "interested") {
        updates.interested = existing.interested + 1;
      } else if (disposition === "not_interested") {
        updates.notInterested = existing.notInterested + 1;
      }

      await this.db
        .update(dailyStats)
        .set(updates)
        .where(eq(dailyStats.id, existing.id));
    } else {
      await this.db.insert(dailyStats).values({
        userId,
        date,
        totalCalls: 1,
        noAnswer: disposition === "no_answer" || disposition === "voicemail" ? 1 : 0,
        interested: disposition === "interested" ? 1 : 0,
        notInterested: disposition === "not_interested" ? 1 : 0,
        firstCallAt: now,
        lastCallAt: now,
      });
    }
  }

  async markLeadTexted(leadId: string, message: string): Promise<Lead> {
    const [lead] = await this.db
      .update(leads)
      .set({ textedAt: new Date(), textMessage: message, updatedAt: new Date() })
      .where(eq(leads.id, leadId))
      .returning();
    return lead;
  }

  async checkPhoneDuplicate(phone: string): Promise<{ exists: boolean; lead?: Lead }> {
    const normalized = normalizePhone(phone);
    const [lead] = await this.db
      .select()
      .from(leads)
      .where(eq(leads.phoneNormalized, normalized))
      .limit(1);

    return lead ? { exists: true, lead } : { exists: false };
  }

  async getFollowups(date: string, userId?: string): Promise<Lead[]> {
    const dayStart = new Date(`${date}T00:00:00.000Z`);
    const dayEnd = new Date(`${date}T23:59:59.999Z`);

    const conditions = [
      gte(leads.nextCallbackAt, dayStart),
      lte(leads.nextCallbackAt, dayEnd),
      isNull(leads.deletedAt),
    ];

    if (userId) {
      conditions.push(eq(leads.assignedUserId, userId));
    }

    return this.db
      .select()
      .from(leads)
      .where(and(...conditions))
      .orderBy(asc(leads.nextCallbackAt));
  }

  // ── Stats ──

  async getDailyStats(userId: string, date: string): Promise<DailyStats | undefined> {
    const [stats] = await this.db
      .select()
      .from(dailyStats)
      .where(and(eq(dailyStats.userId, userId), eq(dailyStats.date, date)))
      .limit(1);
    return stats;
  }

  async getStreak(userId: string): Promise<{ streak: number; personalBest: number }> {
    const rows = await this.db
      .select({ date: dailyStats.date, totalCalls: dailyStats.totalCalls })
      .from(dailyStats)
      .where(and(eq(dailyStats.userId, userId), sql`${dailyStats.totalCalls} > 0`))
      .orderBy(desc(dailyStats.date));

    if (rows.length === 0) return { streak: 0, personalBest: 0 };

    let streak = 0;
    let personalBest = 0;
    let currentStreak = 0;
    const today = todayDateString();

    // Walk backwards from most recent day
    let expectedDate = today;
    for (const row of rows) {
      if (row.date === expectedDate) {
        currentStreak++;
        // Move expected date back one day
        const d = new Date(expectedDate);
        d.setDate(d.getDate() - 1);
        expectedDate = d.toISOString().slice(0, 10);
      } else {
        if (currentStreak > personalBest) personalBest = currentStreak;
        // If streak broken and we haven't set the main streak yet
        if (streak === 0) streak = currentStreak;
        currentStreak = 1;
        const d = new Date(row.date);
        d.setDate(d.getDate() - 1);
        expectedDate = d.toISOString().slice(0, 10);
      }
    }
    if (currentStreak > personalBest) personalBest = currentStreak;
    if (streak === 0) streak = currentStreak;

    return { streak, personalBest };
  }

  async getBatchStats(batch?: string): Promise<BatchStats[]> {
    const conditions = [isNull(leads.deletedAt)];
    if (batch) conditions.push(eq(leads.batch, batch));

    const rows = await this.db
      .select({
        batch: leads.batch,
        batchLabel: leads.batchLabel,
        status: leads.status,
        cnt: count(),
      })
      .from(leads)
      .where(and(...conditions))
      .groupBy(leads.batch, leads.batchLabel, leads.status);

    const batchMap = new Map<string, BatchStats>();
    for (const row of rows) {
      const b = row.batch ?? "(none)";
      if (!batchMap.has(b)) {
        batchMap.set(b, {
          batch: b,
          batchLabel: row.batchLabel,
          total: 0,
          new: 0,
          noAnswer: 0,
          interested: 0,
          notInterested: 0,
          exhausted: 0,
          callback: 0,
        });
      }
      const stats = batchMap.get(b)!;
      const n = Number(row.cnt);
      stats.total += n;
      switch (row.status) {
        case "new": stats.new += n; break;
        case "no_answer":
        case "voicemail": stats.noAnswer += n; break;
        case "interested": stats.interested += n; break;
        case "not_interested": stats.notInterested += n; break;
        case "exhausted": stats.exhausted += n; break;
        case "callback": stats.callback += n; break;
      }
    }

    return Array.from(batchMap.values());
  }

  // ── Call Logs ──

  async getCallLogs(filters: { leadId?: string; userId?: string; limit?: number; offset?: number }): Promise<CallLog[]> {
    const conditions = [];
    if (filters.leadId) conditions.push(eq(callLogs.leadId, filters.leadId));
    if (filters.userId) conditions.push(eq(callLogs.userId, filters.userId));

    return this.db
      .select()
      .from(callLogs)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(callLogs.timestamp))
      .limit(filters.limit ?? 100)
      .offset(filters.offset ?? 0);
  }

  // ── Batches ──

  async getBatches(): Promise<{ batch: string; batchLabel: string | null; count: number }[]> {
    const rows = await this.db
      .select({
        batch: leads.batch,
        batchLabel: leads.batchLabel,
        count: count(),
      })
      .from(leads)
      .where(isNull(leads.deletedAt))
      .groupBy(leads.batch, leads.batchLabel);

    return rows.map((r) => ({
      batch: r.batch ?? "(none)",
      batchLabel: r.batchLabel,
      count: Number(r.count),
    }));
  }

  // ── Tags ──

  async setLeadTags(leadId: string, tags: string[]): Promise<void> {
    // Delete existing tags
    await this.db.delete(leadTags).where(eq(leadTags.leadId, leadId));

    // Insert new tags
    if (tags.length > 0) {
      await this.db.insert(leadTags).values(
        tags.map((tag) => ({ leadId, tag })),
      );
    }
  }
}

// ─── Memory Storage (fallback) ───────────────────────────

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Stub implementations for MemStorage — only used as fallback
  async getLeads(): Promise<Lead[]> { return []; }
  async getLeadById(): Promise<undefined> { return undefined; }
  async bulkImportLeads(): Promise<{ imported: number; skipped: number }> { return { imported: 0, skipped: 0 }; }
  async updateLead(): Promise<Lead> { throw new Error("Not implemented in MemStorage"); }
  async logCallDisposition(): Promise<{ lead: Lead; callLog: CallLog }> { throw new Error("Not implemented in MemStorage"); }
  async markLeadTexted(): Promise<Lead> { throw new Error("Not implemented in MemStorage"); }
  async checkPhoneDuplicate(): Promise<{ exists: boolean }> { return { exists: false }; }
  async getFollowups(): Promise<Lead[]> { return []; }
  async getDailyStats(): Promise<undefined> { return undefined; }
  async getStreak(): Promise<{ streak: number; personalBest: number }> { return { streak: 0, personalBest: 0 }; }
  async getBatchStats(): Promise<BatchStats[]> { return []; }
  async getCallLogs(): Promise<CallLog[]> { return []; }
  async getBatches(): Promise<{ batch: string; batchLabel: string | null; count: number }[]> { return []; }
  async setLeadTags(): Promise<void> {}
}

// ─── Export ──────────────────────────────────────────────

export const storage: IStorage = process.env.DATABASE_URL
  ? new DatabaseStorage(process.env.DATABASE_URL)
  : new MemStorage();
