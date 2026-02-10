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

interface BlowerState {
  dispositions: Record<string, Disposition>;
  notes: Record<string, string>;
  callLog: CallLogEntry[];
  currentRound: number;
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

const STREAK_GAP_MS = 5 * 60 * 1000; // 5 minutes
const STATE_CHANGE_EVENT = "blower-state-change";

function getStorageKey(username: string) {
  return `blower_${username}`;
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
            timestamp: Date.now(),
            round: prev.currentRound,
          });
        }

        return {
          ...prev,
          dispositions: newDispositions,
          callLog: newCallLog,
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

  // --- Filters ---

  const getFilteredLeads = useCallback(
    (filter: FilterKey): Lead[] => {
      switch (filter) {
        case "new":
          return leads.filter((l) => {
            const d = state.dispositions[l.id];
            if (!d) return true; // never called
            // In round 2, no_answer leads become "new" again (ready to retry)
            if (state.currentRound === 2 && d === "no_answer") {
              return true;
            }
            return false;
          });
        case "follow_ups":
          return leads.filter((l) => state.dispositions[l.id] === "no_answer");
        case "wins":
          return leads.filter((l) => state.dispositions[l.id] === "interested");
        default:
          return leads;
      }
    },
    [leads, state.dispositions, state.currentRound]
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
    stats,
    filterCounts,
    setDisposition,
    setNote,
    startRound2,
    getFilteredLeads,
  };
}
