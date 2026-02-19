import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { LEADS, type Lead } from "@/config/blower-leads";
import {
  useBlowerState,
  useSetDispositionMutation,
  useSetNoteMutation,
  useSetTextedMutation,
  useSetTagsMutation,
  useSetStageMutation,
  useStartRound2Mutation,
  useLeads,
  type ApiLead,
} from "./use-blower-api";

// --- useAllLeads: fetch leads from API, fall back to static LEADS while loading ---
export function useAllLeads(): { leads: Lead[]; isLoading: boolean } {
  const { data: apiLeads, isLoading } = useLeads();
  const leads = useMemo(() => {
    if (!apiLeads || apiLeads.length === 0) return LEADS;
    return apiLeads.map((l: ApiLead): Lead => ({
      id: l.id,
      name: l.name,
      type: (l.type as Lead["type"]) ?? "physio",
      town: l.town ?? "",
      phone: l.phone ?? "",
      phoneLandline: l.phoneLandline ?? undefined,
      website: l.website ?? undefined,
      notes: l.notes ?? "",
      tier: ((l.tier ?? 2) as Lead["tier"]),
      signal: (l.signal as Lead["signal"]) ?? "local",
      batch: l.batch ?? "",
      batchLabel: l.batchLabel ?? "",
      whatsappSentAt: l.whatsappSentAt,
      whatsappMessage: l.whatsappMessage,
      whatsappRepliedAt: l.whatsappRepliedAt,
      whatsappReply: l.whatsappReply,
      whatsappDisposition: l.whatsappDisposition,
    }));
  }, [apiLeads]);
  return { leads, isLoading };
}

// --- Types (unchanged — all components import from here) ---

export type Disposition =
  | "no_answer"
  | "interested"
  | "not_interested";

export type PipelineStage = "send_demo" | "demo_sent" | "booked" | "won";

export interface CallLogEntry {
  leadId: string;
  disposition: Disposition;
  timestamp: number;
  round: number;
}

export interface DayStats {
  date: string;           // "2026-02-11"
  calls: number;
  noAnswer: number;
  interested: number;
  notInterested: number;
  firstCallAt: number;    // timestamp
  lastCallAt: number;     // timestamp
}

interface BlowerState {
  dispositions: Record<string, Disposition>;
  notes: Record<string, string>;
  callLog: CallLogEntry[];
  currentRound: number;
  attempts: Record<string, number>;
  texted: Record<string, boolean>;
  dailyStats: Record<string, DayStats>;
  tags: Record<string, string[]>;
  stages: Record<string, PipelineStage>;
}

export type FilterKey =
  | "new"
  | "follow_ups"
  | "wins";

interface BlowerStats {
  total: number;
  completed: number;
  streak: number;
  round: number;
}

export interface BatchStats {
  total: number;
  called: number;
  noAnswer: number;
  interested: number;
  notInterested: number;
  followUps: number;
  exhausted: number;
}

const STREAK_GAP_MS = 5 * 60 * 1000; // 5 minutes
const STATE_CHANGE_EVENT = "blower-state-change";

// --- localStorage helpers (kept as fallback) ---

function getStorageKey(username: string) {
  return `blower_${username}`;
}

function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

function getEmptyDayStats(date: string): DayStats {
  return {
    date,
    calls: 0,
    noAnswer: 0,
    interested: 0,
    notInterested: 0,
    firstCallAt: 0,
    lastCallAt: 0,
  };
}

function migrateDispositions(dispositions: Record<string, string>): Record<string, Disposition> {
  const migrated: Record<string, Disposition> = {};
  for (const [id, d] of Object.entries(dispositions)) {
    switch (d) {
      case "no_answer":
      case "voicemail":
        migrated[id] = "no_answer";
        break;
      case "callback":
      case "warm":
      case "hot":
        migrated[id] = "interested";
        break;
      case "not_interested":
        migrated[id] = "not_interested";
        break;
      case "interested":
        migrated[id] = "interested";
        break;
      default:
        break;
    }
  }
  return migrated;
}

function loadState(username: string): BlowerState {
  try {
    const raw = localStorage.getItem(getStorageKey(username));
    if (raw) {
      const parsed = JSON.parse(raw);
      parsed.dispositions = migrateDispositions(parsed.dispositions || {});
      if (!parsed.attempts) parsed.attempts = {};
      if (!parsed.texted) parsed.texted = {};
      if (!parsed.dailyStats) parsed.dailyStats = {};
      if (!parsed.tags) parsed.tags = {};
      if (!parsed.stages) parsed.stages = {};
      return parsed;
    }
  } catch {
    // corrupted — start fresh
  }
  return emptyState();
}

function emptyState(): BlowerState {
  return {
    dispositions: {},
    notes: {},
    callLog: [],
    currentRound: 1,
    attempts: {},
    texted: {},
    dailyStats: {},
    tags: {},
    stages: {},
  };
}

function saveState(username: string, state: BlowerState) {
  localStorage.setItem(getStorageKey(username), JSON.stringify(state));
  window.dispatchEvent(new CustomEvent(STATE_CHANGE_EVENT));
}

// --- Pure computation helpers (unchanged) ---

function computeStreak(callLog: CallLogEntry[]): number {
  if (callLog.length === 0) return 0;
  let streak = 1;
  for (let i = callLog.length - 1; i > 0; i--) {
    const gap = callLog[i].timestamp - callLog[i - 1].timestamp;
    if (gap <= STREAK_GAP_MS) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function computeDailyStreak(dailyStats: Record<string, DayStats>): number {
  const today = getTodayDateString();
  let streak = 0;
  const date = new Date(today);

  for (let i = 0; i < 365; i++) {
    const dateStr = date.toISOString().slice(0, 10);
    const stats = dailyStats[dateStr];

    if (!stats || stats.calls === 0) {
      if (i === 0) {
        date.setDate(date.getDate() - 1);
        continue;
      }
      break;
    }

    if (stats.calls >= 10) {
      streak++;
    } else if (dateStr === today) {
      streak++;
    } else {
      break;
    }

    date.setDate(date.getDate() - 1);
  }

  return streak;
}

function computePersonalBest(dailyStats: Record<string, DayStats>): { calls: number; date: string } | null {
  let best: { calls: number; date: string } | null = null;
  for (const stats of Object.values(dailyStats)) {
    if (!best || stats.calls > best.calls) {
      best = { calls: stats.calls, date: stats.date };
    }
  }
  return best;
}

// --- Hook (API-backed with localStorage fallback) ---

export function useBlowerStore(username: string, assignedLeadIds: string[] | "all") {
  // Local state — starts from localStorage, gets overwritten by API when available
  const [state, setState] = useState<BlowerState>(() => loadState(username));
  const apiSyncedRef = useRef(false);

  // React Query: fetch state from API
  const { data: apiState, isError: apiError } = useBlowerState(username);

  // API mutations
  const dispositionMut = useSetDispositionMutation(username);
  const noteMut = useSetNoteMutation(username);
  const textedMut = useSetTextedMutation(username);
  const tagsMut = useSetTagsMutation(username);
  const stageMut = useSetStageMutation(username);
  const round2Mut = useStartRound2Mutation(username);

  // When API data arrives, use it as source of truth
  useEffect(() => {
    if (apiState && !apiError) {
      const merged: BlowerState = {
        dispositions: apiState.dispositions || {},
        notes: apiState.notes || {},
        callLog: apiState.callLog || [],
        currentRound: apiState.currentRound || 1,
        attempts: apiState.attempts || {},
        texted: apiState.texted || {},
        dailyStats: apiState.dailyStats || {},
        tags: apiState.tags || {},
        stages: apiState.stages || {},
      };
      setState(merged);
      apiSyncedRef.current = true;
    }
  }, [apiState, apiError]);

  // Assigned leads for this user
  const leads = useMemo<Lead[]>(() => {
    if (assignedLeadIds === "all") return LEADS;
    const idSet = new Set(assignedLeadIds);
    return LEADS.filter((l) => idSet.has(l.id));
  }, [assignedLeadIds]);

  // Sync from localStorage when other components dispatch the event (fallback only)
  useEffect(() => {
    const handler = () => {
      // Only use localStorage sync if API is not working
      if (!apiSyncedRef.current) {
        setState(loadState(username));
      }
    };
    window.addEventListener(STATE_CHANGE_EVENT, handler);
    return () => window.removeEventListener(STATE_CHANGE_EVENT, handler);
  }, [username]);

  // Always persist to localStorage as a backup
  useEffect(() => {
    saveState(username, state);
  }, [username, state]);

  // --- Mutators (optimistic local update + fire-and-forget API call) ---

  const setDisposition = useCallback(
    (leadId: string, disposition: Disposition | null) => {
      setState((prev) => {
        const newDispositions = { ...prev.dispositions };
        let newCallLog = [...prev.callLog];
        const newAttempts = { ...prev.attempts };
        const newDailyStats = { ...prev.dailyStats };
        const newStages = { ...prev.stages };
        const now = Date.now();
        const today = getTodayDateString();

        if (disposition === null) {
          delete newDispositions[leadId];
          const lastIdx = newCallLog.findLastIndex((e) => e.leadId === leadId);
          if (lastIdx !== -1) {
            newCallLog.splice(lastIdx, 1);
          }
        } else {
          newDispositions[leadId] = disposition;
          newCallLog.push({
            leadId,
            disposition,
            timestamp: now,
            round: prev.currentRound,
          });

          if (disposition === "interested" && !newStages[leadId]) {
            newStages[leadId] = "send_demo";
          }

          if (disposition === "no_answer") {
            newAttempts[leadId] = (newAttempts[leadId] || 0) + 1;
          }

          if (!newDailyStats[today]) {
            newDailyStats[today] = getEmptyDayStats(today);
          }
          const todayStats = { ...newDailyStats[today] };
          todayStats.calls++;
          todayStats.lastCallAt = now;
          if (todayStats.firstCallAt === 0) {
            todayStats.firstCallAt = now;
          }

          if (disposition === "no_answer") todayStats.noAnswer++;
          else if (disposition === "interested") todayStats.interested++;
          else if (disposition === "not_interested") todayStats.notInterested++;

          newDailyStats[today] = todayStats;
        }

        return {
          ...prev,
          dispositions: newDispositions,
          callLog: newCallLog,
          attempts: newAttempts,
          dailyStats: newDailyStats,
          stages: newStages,
        };
      });

      // Fire API call (non-blocking)
      dispositionMut.mutate({ leadId, disposition });
    },
    [dispositionMut]
  );

  const setNote = useCallback((leadId: string, text: string) => {
    setState((prev) => ({
      ...prev,
      notes: { ...prev.notes, [leadId]: text },
    }));

    noteMut.mutate({ leadId, text });
  }, [noteMut]);

  const startRound2 = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentRound: 2,
    }));

    round2Mut.mutate();
  }, [round2Mut]);

  const setTexted = useCallback((leadId: string) => {
    setState((prev) => ({
      ...prev,
      texted: { ...prev.texted, [leadId]: true },
    }));

    textedMut.mutate({ leadId });
  }, [textedMut]);

  const setTags = useCallback((leadId: string, tags: string[]) => {
    setState((prev) => ({
      ...prev,
      tags: { ...prev.tags, [leadId]: tags },
    }));

    tagsMut.mutate({ leadId, tags });
  }, [tagsMut]);

  const setStage = useCallback((leadId: string, stage: PipelineStage) => {
    setState((prev) => ({
      ...prev,
      stages: { ...prev.stages, [leadId]: stage },
    }));

    stageMut.mutate({ leadId, stage });
  }, [stageMut]);

  // --- Filters (unchanged logic) ---

  const getFilteredLeads = useCallback(
    (filter: FilterKey, batchId?: string): Lead[] => {
      const pool = batchId ? leads.filter((l) => l.batch === batchId) : leads;

      switch (filter) {
        case "new":
          return pool.filter((l) => {
            const d = state.dispositions[l.id];
            if (!d) return true;
            if (state.currentRound === 2 && d === "no_answer") {
              return true;
            }
            return false;
          });
        case "follow_ups":
          return pool.filter((l) => {
            if (state.dispositions[l.id] !== "no_answer") return false;
            const attempts = state.attempts[l.id] || 0;
            return attempts < 5;
          });
        case "wins":
          return pool.filter((l) => state.dispositions[l.id] === "interested");
        default:
          return pool;
      }
    },
    [leads, state.dispositions, state.currentRound, state.attempts]
  );

  // --- Batch Stats (unchanged logic) ---

  const getBatchStats = useCallback(
    (batchId: string): BatchStats => {
      const batchLeads = leads.filter((l) => l.batch === batchId);
      const total = batchLeads.length;
      let called = 0;
      let noAnswer = 0;
      let interested = 0;
      let notInterested = 0;
      let followUps = 0;
      let exhausted = 0;

      for (const lead of batchLeads) {
        const d = state.dispositions[lead.id];
        if (!d) continue;
        called++;
        if (d === "no_answer") {
          noAnswer++;
          const attempts = state.attempts[lead.id] || 0;
          if (attempts >= 5) {
            exhausted++;
          } else {
            followUps++;
          }
        } else if (d === "interested") {
          interested++;
        } else if (d === "not_interested") {
          notInterested++;
        }
      }

      return { total, called, noAnswer, interested, notInterested, followUps, exhausted };
    },
    [leads, state.dispositions, state.attempts]
  );

  // --- Computed Stats (unchanged logic) ---

  const stats = useMemo<BlowerStats>(() => {
    const total = leads.length;
    const completed = leads.filter((l) => state.dispositions[l.id]).length;
    const streak = computeStreak(state.callLog);
    return {
      total,
      completed,
      streak,
      round: state.currentRound,
    };
  }, [leads, state.dispositions, state.callLog, state.currentRound]);

  // --- Daily Stats (unchanged logic) ---

  const getTodayStats = useCallback((): DayStats => {
    const today = getTodayDateString();
    return state.dailyStats[today] || getEmptyDayStats(today);
  }, [state.dailyStats]);

  const getDailyStreak = useCallback((): number => {
    return computeDailyStreak(state.dailyStats);
  }, [state.dailyStats]);

  const getPersonalBest = useCallback((): { calls: number; date: string } | null => {
    return computePersonalBest(state.dailyStats);
  }, [state.dailyStats]);

  // --- Filter Counts (unchanged logic) ---

  const filterCounts = useMemo(() => {
    return {
      new: getFilteredLeads("new").length,
      follow_ups: getFilteredLeads("follow_ups").length,
      wins: getFilteredLeads("wins").length,
    };
  }, [getFilteredLeads]);

  // --- Return same interface as before ---

  return {
    leads,
    dispositions: state.dispositions,
    notes: state.notes,
    callLog: state.callLog,
    attempts: state.attempts,
    texted: state.texted,
    tags: state.tags,
    stages: state.stages,
    dailyStats: state.dailyStats,
    stats,
    filterCounts,
    getTodayStats,
    getDailyStreak,
    getPersonalBest,
    setDisposition,
    setNote,
    setTexted,
    setTags,
    setStage,
    startRound2,
    getFilteredLeads,
    getBatchStats,
  };
}
