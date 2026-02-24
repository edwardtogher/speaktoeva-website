import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertLeadSchema,
  insertCallLogSchema,
  dispositionEnum,
  type Disposition,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // ── Leads ──

  app.get("/api/leads", async (req: Request, res: Response) => {
    try {
      const leads = await storage.getLeads({
        batch: req.query.batch as string | undefined,
        status: req.query.status as string | undefined,
        search: req.query.search as string | undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        offset: req.query.offset ? Number(req.query.offset) : undefined,
      });
      res.json(leads);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  app.get("/api/leads/check-phone", async (req: Request, res: Response) => {
    try {
      const phone = req.query.phone as string;
      if (!phone) return res.status(400).json({ message: "phone query param required" });
      const result = await storage.checkPhoneDuplicate(phone);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Failed to check phone" });
    }
  });

  app.get("/api/leads/:id", async (req: Request, res: Response) => {
    try {
      const lead = await storage.getLeadById(req.params.id);
      if (!lead) return res.status(404).json({ message: "Lead not found" });
      res.json(lead);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch lead" });
    }
  });

  app.post("/api/leads/import", async (req: Request, res: Response) => {
    try {
      const body = z.object({ leads: z.array(insertLeadSchema) }).safeParse(req.body);
      if (!body.success) return res.status(400).json({ message: "Invalid data", errors: body.error.flatten() });

      const result = await storage.bulkImportLeads(body.data.leads);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Failed to import leads" });
    }
  });

  app.patch("/api/leads/:id", async (req: Request, res: Response) => {
    try {
      const lead = await storage.updateLead(req.params.id, req.body);
      res.json(lead);
    } catch (err) {
      res.status(500).json({ message: "Failed to update lead" });
    }
  });

  app.post("/api/leads/:id/disposition", async (req: Request, res: Response) => {
    try {
      const body = z
        .object({
          disposition: dispositionEnum,
          notes: z.string().optional(),
          nextCallbackAt: z.coerce.date().optional(),
          durationSeconds: z.number().int().optional(),
          userId: z.string().min(1),
        })
        .safeParse(req.body);

      if (!body.success) return res.status(400).json({ message: "Invalid data", errors: body.error.flatten() });

      const result = await storage.logCallDisposition(req.params.id, body.data.userId, {
        disposition: body.data.disposition as Disposition,
        notes: body.data.notes,
        nextCallbackAt: body.data.nextCallbackAt,
        durationSeconds: body.data.durationSeconds,
      });
      res.json(result);
    } catch (err: any) {
      if (err.message?.includes("not found")) return res.status(404).json({ message: err.message });
      res.status(500).json({ message: "Failed to log disposition" });
    }
  });

  app.patch("/api/leads/:id/whatsapp", async (req: Request, res: Response) => {
    try {
      const body = z.object({
        whatsappSentAt: z.coerce.date().optional(),
        whatsappMessage: z.string().optional(),
        whatsappRepliedAt: z.coerce.date().optional(),
        whatsappReply: z.string().optional(),
        whatsappDisposition: z.enum(["interested", "not_interested", "follow_up"]).nullable().optional(),
        senderAccount: z.string().optional(),
      }).safeParse(req.body);

      if (!body.success) return res.status(400).json({ message: "Invalid data", errors: body.error.flatten() });

      const lead = await storage.updateLead(req.params.id, {
        whatsappSentAt: body.data.whatsappSentAt,
        whatsappMessage: body.data.whatsappMessage,
        whatsappRepliedAt: body.data.whatsappRepliedAt,
        whatsappReply: body.data.whatsappReply,
        whatsappDisposition: body.data.whatsappDisposition ?? undefined,
        senderAccount: body.data.senderAccount,
      });
      res.json(lead);
    } catch (err) {
      res.status(500).json({ message: "Failed to update WhatsApp status" });
    }
  });

  app.post("/api/leads/:id/text", async (req: Request, res: Response) => {
    try {
      const body = z.object({ message: z.string().min(1) }).safeParse(req.body);
      if (!body.success) return res.status(400).json({ message: "message is required" });

      const lead = await storage.markLeadTexted(req.params.id, body.data.message);
      res.json(lead);
    } catch (err) {
      res.status(500).json({ message: "Failed to mark lead as texted" });
    }
  });

  app.post("/api/leads/:id/tags", async (req: Request, res: Response) => {
    try {
      const body = z.object({ tags: z.array(z.string().min(1)) }).safeParse(req.body);
      if (!body.success) return res.status(400).json({ message: "tags array required" });

      await storage.setLeadTags(req.params.id, body.data.tags);
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ message: "Failed to set tags" });
    }
  });

  // ── Followups ──

  app.get("/api/followups", async (req: Request, res: Response) => {
    try {
      const date = (req.query.date as string) || new Date().toISOString().slice(0, 10);
      const userId = req.query.userId as string | undefined;
      const leads = await storage.getFollowups(date, userId);
      res.json(leads);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch followups" });
    }
  });

  // ── Batches ──

  app.get("/api/batches", async (_req: Request, res: Response) => {
    try {
      const batches = await storage.getBatches();
      res.json(batches);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch batches" });
    }
  });

  // ── Stats ──

  app.get("/api/stats/daily", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      const date = (req.query.date as string) || new Date().toISOString().slice(0, 10);
      if (!userId) return res.status(400).json({ message: "userId query param required" });

      const stats = await storage.getDailyStats(userId, date);
      res.json(stats ?? { totalCalls: 0, noAnswer: 0, interested: 0, notInterested: 0 });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch daily stats" });
    }
  });

  app.get("/api/stats/streak", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) return res.status(400).json({ message: "userId query param required" });

      const streak = await storage.getStreak(userId);
      res.json(streak);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch streak" });
    }
  });

  app.get("/api/stats/batch", async (req: Request, res: Response) => {
    try {
      const batch = req.query.batch as string | undefined;
      const stats = await storage.getBatchStats(batch);
      res.json(stats);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch batch stats" });
    }
  });

  app.get("/api/stats/leaderboard", async (_req: Request, res: Response) => {
    try {
      const leaderboard = await storage.getLeaderboard();
      res.json(leaderboard);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // ── Call Logs ──

  app.get("/api/call-logs", async (req: Request, res: Response) => {
    try {
      const logs = await storage.getCallLogs({
        leadId: req.query.leadId as string | undefined,
        userId: req.query.userId as string | undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        offset: req.query.offset ? Number(req.query.offset) : undefined,
      });
      res.json(logs);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch call logs" });
    }
  });

  // ── Blower State (bridge for frontend localStorage shape) ──

  // Resolve username to DB user ID (UUID), creating user if needed
  async function resolveUserId(username: string): Promise<string> {
    let user = await storage.getUserByUsername(username);
    if (!user) {
      user = await storage.createUser({ username, password: username });
    }
    return user.id;
  }

  app.get("/api/state/:userId", async (req: Request, res: Response) => {
    try {
      const userId = await resolveUserId(req.params.userId);

      // Fetch all data in parallel
      const [allLeads, callLogRows, allTags, allDailyStats] = await Promise.all([
        storage.getLeads({ limit: 10000 }),
        storage.getCallLogs({ userId, limit: 10000 }),
        storage.getAllLeadTags(),
        storage.getAllDailyStats(userId),
      ]);

      // Build dispositions, notes, attempts, texted maps from leads
      const dispositions: Record<string, string> = {};
      const notes: Record<string, string> = {};
      const attempts: Record<string, number> = {};
      const texted: Record<string, boolean> = {};

      for (const lead of allLeads) {
        // Map DB statuses to the frontend's 3-value Disposition type
        if (lead.status === "no_answer" || lead.status === "voicemail") {
          dispositions[lead.id] = "no_answer";
        } else if (lead.status === "interested" || lead.status === "callback") {
          dispositions[lead.id] = "interested";
        } else if (lead.status === "not_interested") {
          dispositions[lead.id] = "not_interested";
        }
        // "new" and "exhausted" are not mapped — they stay absent from the dispositions record

        if (lead.notes) {
          notes[lead.id] = lead.notes;
        }

        if (lead.attemptCount > 0) {
          attempts[lead.id] = lead.attemptCount;
        }

        if (lead.textedAt) {
          texted[lead.id] = true;
        }
      }

      // Build callLog array from call_logs table
      const callLog = callLogRows.map((log) => ({
        leadId: log.leadId,
        disposition: log.disposition === "voicemail" ? "no_answer"
          : log.disposition === "callback" ? "interested"
          : log.disposition,
        timestamp: new Date(log.timestamp).getTime(),
        round: log.round,
      }));

      // Build dailyStats map
      const dailyStatsMap: Record<string, {
        date: string;
        calls: number;
        noAnswer: number;
        interested: number;
        notInterested: number;
        firstCallAt: number;
        lastCallAt: number;
      }> = {};

      for (const row of allDailyStats) {
        dailyStatsMap[row.date] = {
          date: row.date,
          calls: row.totalCalls,
          noAnswer: row.noAnswer,
          interested: row.interested,
          notInterested: row.notInterested,
          firstCallAt: row.firstCallAt ? new Date(row.firstCallAt).getTime() : 0,
          lastCallAt: row.lastCallAt ? new Date(row.lastCallAt).getTime() : 0,
        };
      }

      // Build tags map
      const tags: Record<string, string[]> = {};
      for (const row of allTags) {
        if (!tags[row.leadId]) tags[row.leadId] = [];
        tags[row.leadId].push(row.tag);
      }

      res.json({
        dispositions,
        notes,
        callLog,
        currentRound: 1,
        attempts,
        texted,
        dailyStats: dailyStatsMap,
        tags,
        stages: {},
      });
    } catch (err) {
      console.error("GET /api/state/:userId error:", err);
      res.status(500).json({ message: "Failed to fetch state" });
    }
  });

  app.post("/api/state/:userId/disposition", async (req: Request, res: Response) => {
    try {
      const userId = await resolveUserId(req.params.userId);
      const body = z
        .object({
          leadId: z.string().min(1),
          disposition: z.union([
            z.enum(["no_answer", "interested", "not_interested"]),
            z.null(),
          ]),
        })
        .safeParse(req.body);

      if (!body.success) {
        return res.status(400).json({ message: "Invalid data", errors: body.error.flatten() });
      }

      const { leadId, disposition } = body.data;

      if (disposition === null) {
        // Clear disposition — reset lead to "new" and clear attempts
        await storage.updateLead(leadId, { status: "new", attemptCount: 0 } as any);
      } else {
        // Map frontend disposition to DB disposition for logCallDisposition
        await storage.logCallDisposition(leadId, userId, { disposition: disposition as Disposition });
      }

      res.json({ ok: true });
    } catch (err: any) {
      if (err.message?.includes("not found")) {
        return res.status(404).json({ message: err.message });
      }
      console.error("POST /api/state/:userId/disposition error:", err);
      res.status(500).json({ message: "Failed to set disposition" });
    }
  });

  app.post("/api/state/:userId/note", async (req: Request, res: Response) => {
    try {
      const body = z
        .object({
          leadId: z.string().min(1),
          text: z.string(),
        })
        .safeParse(req.body);

      if (!body.success) {
        return res.status(400).json({ message: "Invalid data", errors: body.error.flatten() });
      }

      await storage.updateLead(body.data.leadId, { notes: body.data.text } as any);
      res.json({ ok: true });
    } catch (err) {
      console.error("POST /api/state/:userId/note error:", err);
      res.status(500).json({ message: "Failed to set note" });
    }
  });

  app.post("/api/state/:userId/texted", async (req: Request, res: Response) => {
    try {
      const body = z
        .object({
          leadId: z.string().min(1),
        })
        .safeParse(req.body);

      if (!body.success) {
        return res.status(400).json({ message: "Invalid data", errors: body.error.flatten() });
      }

      await storage.markLeadTexted(body.data.leadId, "");
      res.json({ ok: true });
    } catch (err) {
      console.error("POST /api/state/:userId/texted error:", err);
      res.status(500).json({ message: "Failed to mark texted" });
    }
  });

  app.post("/api/state/:userId/tags", async (req: Request, res: Response) => {
    try {
      const body = z
        .object({
          leadId: z.string().min(1),
          tags: z.array(z.string().min(1)),
        })
        .safeParse(req.body);

      if (!body.success) {
        return res.status(400).json({ message: "Invalid data", errors: body.error.flatten() });
      }

      await storage.setLeadTags(body.data.leadId, body.data.tags);
      res.json({ ok: true });
    } catch (err) {
      console.error("POST /api/state/:userId/tags error:", err);
      res.status(500).json({ message: "Failed to set tags" });
    }
  });

  app.post("/api/state/:userId/stage", async (_req: Request, res: Response) => {
    // Stages not yet in DB — acknowledge and return OK
    res.json({ ok: true });
  });

  app.post("/api/state/:userId/round", async (_req: Request, res: Response) => {
    // Round is a client concept for now — acknowledge and return OK
    res.json({ ok: true });
  });

  const httpServer = createServer(app);

  return httpServer;
}
