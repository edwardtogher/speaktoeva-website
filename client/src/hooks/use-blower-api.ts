import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE, API_KEY } from "@/config/api";
import type {
  Disposition,
  PipelineStage,
  CallLogEntry,
  DayStats,
} from "./use-blower-store";

// --- API fetch helper ---

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(API_KEY ? { "x-api-key": API_KEY } : {}),
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}

// --- Types matching API responses ---

export interface ApiState {
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

// --- Query keys ---

const keys = {
  state: (userId: string) => ["blower", "state", userId] as const,
};

// --- Queries ---

export function useBlowerState(userId: string) {
  return useQuery<ApiState>({
    queryKey: keys.state(userId),
    queryFn: () => apiFetch<ApiState>(`/api/state/${userId}`),
    staleTime: 30_000, // 30s — we do optimistic updates, so staleness is OK
    refetchOnWindowFocus: true,
    retry: 1,
  });
}

// --- Mutations ---

export function useSetDispositionMutation(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      leadId: string;
      disposition: Disposition | null;
    }) =>
      apiFetch(`/api/state/${userId}/disposition`, {
        method: "POST",
        body: JSON.stringify(params),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.state(userId) });
    },
  });
}

export function useSetNoteMutation(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { leadId: string; text: string }) =>
      apiFetch(`/api/state/${userId}/note`, {
        method: "POST",
        body: JSON.stringify(params),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.state(userId) });
    },
  });
}

export function useSetTextedMutation(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { leadId: string }) =>
      apiFetch(`/api/state/${userId}/texted`, {
        method: "POST",
        body: JSON.stringify(params),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.state(userId) });
    },
  });
}

export function useSetTagsMutation(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { leadId: string; tags: string[] }) =>
      apiFetch(`/api/state/${userId}/tags`, {
        method: "POST",
        body: JSON.stringify(params),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.state(userId) });
    },
  });
}

export function useSetStageMutation(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: { leadId: string; stage: PipelineStage }) =>
      apiFetch(`/api/state/${userId}/stage`, {
        method: "POST",
        body: JSON.stringify(params),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.state(userId) });
    },
  });
}

export function useStartRound2Mutation(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiFetch(`/api/state/${userId}/round`, {
        method: "POST",
        body: JSON.stringify({ round: 2 }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.state(userId) });
    },
  });
}

// --- Leaderboard ---

export interface LeaderboardEntry {
  userId: string;
  username: string;
  totalCalls: number;
  todayCalls: number;
  interested: number;
  winRate: number;
  currentStreak: number;
  personalBest: { calls: number; date: string } | null;
  last7Days: number[];
}

export function useLeaderboard() {
  return useQuery<LeaderboardEntry[]>({
    queryKey: ["blower", "leaderboard"],
    queryFn: () => apiFetch<LeaderboardEntry[]>("/api/stats/leaderboard"),
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });
}

// --- Leads API ---

export interface ApiLead {
  id: string;
  name: string;
  type: string;
  town: string | null;
  phone: string | null;
  phoneLandline: string | null;
  website: string | null;
  notes: string | null;
  tier: number;
  signal: string | null;
  batch: string | null;
  batchLabel: string | null;
  status: string;
  attemptCount: number;
  lastCallAt: string | null;
  nextCallbackAt: string | null;
  textedAt: string | null;
  textMessage: string | null;
  whatsappSentAt: string | null;
  whatsappMessage: string | null;
  whatsappRepliedAt: string | null;
  whatsappReply: string | null;
  whatsappDisposition: string | null;
}

export function useLeads(filters?: { batch?: string; status?: string; limit?: number }) {
  const params = new URLSearchParams();
  if (filters?.batch) params.set("batch", filters.batch);
  if (filters?.status) params.set("status", filters.status);
  params.set("limit", String(filters?.limit ?? 1000));
  return useQuery<ApiLead[]>({
    queryKey: ["blower", "leads", filters],
    queryFn: () => apiFetch<ApiLead[]>(`/api/leads?${params.toString()}`),
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });
}

export function useUpdateWhatsapp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      leadId: string;
      whatsappSentAt?: Date;
      whatsappMessage?: string;
      whatsappRepliedAt?: Date;
      whatsappReply?: string;
      whatsappDisposition?: "interested" | "not_interested" | "follow_up" | null;
    }) => {
      const { leadId, ...data } = params;
      return apiFetch(`/api/leads/${leadId}/whatsapp`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blower", "leads"] });
    },
  });
}
