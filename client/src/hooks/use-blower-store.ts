import { useState, useEffect, useCallback, useMemo } from "react";
import { LEADS, type Lead } from "@/config/blower-leads";

// --- Types ---

export type Disposition =
  | "no_answer"
  | "interested"
  | "not_interested";

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
  attempts: Record<string, number>;       // leadId -> number of call attempts
  texted: Record<string, boolean>;        // leadId -> whether they've been texted
  dailyStats: Record<string, DayStats>;   // date string -> stats
  tags: Record<string, string[]>;         // leadId -> array of tag strings
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
  followUps: number;   // no_answer leads with attempts < 5
  exhausted: number;   // no_answer leads with attempts >= 5
}

const STREAK_GAP_MS = 5 * 60 * 1000; // 5 minutes
const STATE_CHANGE_EVENT = "blower-state-change";

function getStorageKey(username: string) {
  return `blower_${username}`;
}

function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().slice(0, 10); // "2026-02-11"
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

// Migration: convert old 6-disposition data to new 3-disposition model
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
        // Unknown — skip
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
      // Migrate old disposition values
      parsed.dispositions = migrateDispositions(parsed.dispositions || {});
      // Migration: add new fields if they don't exist
      if (!parsed.attempts) parsed.attempts = {};
      if (!parsed.texted) parsed.texted = {};
      if (!parsed.dailyStats) parsed.dailyStats = {};
      if (!parsed.tags) parsed.tags = {};
      return parsed;
    }
  } catch {
    // corrupted — start fresh
  }
  return {
    dispositions: {},
    notes: {},
    callLog: [],
    currentRound: 1,
    attempts: {},
    texted: {},
    dailyStats: {},
    tags: {},
  };
}

function saveState(username: string, state: BlowerState) {
  localStorage.setItem(getStorageKey(username), JSON.stringify(state));
  window.dispatchEvent(new CustomEvent(STATE_CHANGE_EVENT));
}

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

  // Walk backwards from today
  for (let i = 0; i < 365; i++) {
    const dateStr = date.toISOString().slice(0, 10);
    const stats = dailyStats[dateStr];

    if (!stats || stats.calls === 0) {
      // If this is today and we have no calls yet, don't break streak — just skip
      if (i === 0) {
        date.setDate(date.getDate() - 1);
        continue;
      }
      break;
    }

    if (stats.calls >= 10) {
      streak++;
    } else if (dateStr === today) {
      // Today is in-progress (has calls but < 10) — count it, don't break
      streak++;
    } else {
      // Past day with < 10 calls — breaks the streak
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

// --- Hook ---

export function useBlowerStore(username: string, assignedLeadIds: string[] | "all") {
  const [state, setState] = useState<BlowerState>(() => loadState(username));

  // Assigned leads for this user
  const leads = useMemo<Lead[]>(() => {
    if (assignedLeadIds === "all") return LEADS;
    const idSet = new Set(assignedLeadIds);
    return LEADS.filter((l) => idSet.has(l.id));
  }, [assignedLeadIds]);

  // Sync from localStorage when other components dispatch the event
  useEffect(() => {
    const handler = () => {
      setState(loadState(username));
    };
    window.addEventListener(STATE_CHANGE_EVENT, handler);
    return () => window.removeEventListener(STATE_CHANGE_EVENT, handler);
  }, [username]);

  // Persist on every state change
  useEffect(() => {
    saveState(username, state);
  }, [username, state]);

  // --- Mutators ---

  const setDisposition = useCallback(
    (leadId: string, disposition: Disposition | null) => {
      setState((prev) => {
        const newDispositions = { ...prev.dispositions };
        let newCallLog = [...prev.callLog];
        const newAttempts = { ...prev.attempts };
        const newDailyStats = { ...prev.dailyStats };
        const now = Date.now();
        const today = getTodayDateString();

        if (disposition === null) {
          // Toggle off — remove disposition, remove last log entry for this lead
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

          // Track attempts for no_answer
          if (disposition === "no_answer") {
            newAttempts[leadId] = (newAttempts[leadId] || 0) + 1;
          }

          // Update daily stats
          if (!newDailyStats[today]) {
            newDailyStats[today] = getEmptyDayStats(today);
          }
          const todayStats = { ...newDailyStats[today] };
          todayStats.calls++;
          todayStats.lastCallAt = now;
          if (todayStats.firstCallAt === 0) {
            todayStats.firstCallAt = now;
          }

          // Increment disposition counter
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
        };
      });
    },
    []
  );

  const setNote = useCallback((leadId: string, text: string) => {
    setState((prev) => ({
      ...prev,
      notes: { ...prev.notes, [leadId]: text },
    }));
  }, []);

  const startRound2 = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentRound: 2,
    }));
  }, []);

  const setTexted = useCallback((leadId: string) => {
    setState((prev) => ({
      ...prev,
      texted: { ...prev.texted, [leadId]: true },
    }));
  }, []);

  const setTags = useCallback((leadId: string, tags: string[]) => {
    setState((prev) => ({
      ...prev,
      tags: { ...prev.tags, [leadId]: tags },
    }));
  }, []);

  // --- Filters ---

  const getFilteredLeads = useCallback(
    (filter: FilterKey, batchId?: string): Lead[] => {
      const pool = batchId ? leads.filter((l) => l.batch === batchId) : leads;

      switch (filter) {
        case "new":
          return pool.filter((l) => {
            const d = state.dispositions[l.id];
            if (!d) return true; // never called
            // In round 2, no_answer leads become "new" again (ready to retry)
            if (state.currentRound === 2 && d === "no_answer") {
              return true;
            }
            return false;
          });
        case "follow_ups":
          return pool.filter((l) => {
            if (state.dispositions[l.id] !== "no_answer") return false;
            // Only show leads with < 5 attempts (not exhausted)
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

  // --- Batch Stats ---

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

  // --- Computed Stats ---

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

  // --- Daily Stats ---

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

  // --- Filter Counts ---

  const filterCounts = useMemo(() => {
    return {
      new: getFilteredLeads("new").length,
      follow_ups: getFilteredLeads("follow_ups").length,
      wins: getFilteredLeads("wins").length,
    };
  }, [getFilteredLeads]);

  return {
    leads,
    dispositions: state.dispositions,
    notes: state.notes,
    callLog: state.callLog,
    attempts: state.attempts,
    texted: state.texted,
    tags: state.tags,
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
    startRound2,
    getFilteredLeads,
    getBatchStats,
  };
}
