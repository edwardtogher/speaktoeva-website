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

  const httpServer = createServer(app);

  return httpServer;
}
