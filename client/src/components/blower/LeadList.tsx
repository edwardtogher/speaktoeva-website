import { useState, useCallback, useRef } from "react";
import type { Lead } from "@/config/blower-leads";
import type { FilterKey, Disposition } from "@/hooks/use-blower-store";
import LeadCard from "./LeadCard";

interface LeadListProps {
  filter: FilterKey;
  batchId?: string;
  onInterested?: (leadName: string) => void;
  onStartCall?: (leadId: string) => void;
  store: {
    getFilteredLeads: (filter: FilterKey, batchId?: string) => Lead[];
    dispositions: Record<string, Disposition>;
    attempts: Record<string, number>;
    texted: Record<string, boolean>;
    notes: Record<string, string>;
    setDisposition: (leadId: string, disposition: Disposition | null) => void;
    setNote: (leadId: string, text: string) => void;
    setTexted: (leadId: string) => void;
    startRound2: () => void;
    stats: { round: number; completed: number; total: number };
  };
}

export default function LeadList({ filter, store, batchId, onInterested, onStartCall }: LeadListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const leads = store.getFilteredLeads(filter, batchId);

  // After setting disposition, auto-expand next uncalled lead
  const handleDisposition = useCallback(
    (leadId: string, disposition: Disposition | null) => {
      store.setDisposition(leadId, disposition);

      // Trigger interested celebration
      if (disposition === "interested" && onInterested) {
        const lead = leads.find((l) => l.id === leadId);
        if (lead) {
          onInterested(lead.name);
        }
      }

      if (disposition !== null) {
        // Find next undispositioned lead in the current filtered list
        const currentIdx = leads.findIndex((l) => l.id === leadId);
        const nextUncalled = leads.find(
          (l, i) => i > currentIdx && !store.dispositions[l.id]
        );

        if (nextUncalled) {
          setTimeout(() => {
            setExpandedId(nextUncalled.id);
            const el = document.getElementById(`lead-${nextUncalled.id}`);
            el?.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 150);
        } else {
          setExpandedId(null);
        }
      }
    },
    [leads, store, onInterested]
  );

  const handleToggle = useCallback(
    (leadId: string) => {
      setExpandedId((prev) => (prev === leadId ? null : leadId));
    },
    []
  );

  const handleSetTexted = useCallback(
    (leadId: string) => {
      store.setTexted(leadId);
    },
    [store]
  );

  // Empty states
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <p className="text-zinc-500 text-lg">
          {filter === "new" && "All leads in this batch called!"}
          {filter === "follow_ups" && "No follow-ups yet. Keep calling!"}
        </p>
      </div>
    );
  }

  return (
    <div ref={listRef} className="px-3 py-2 space-y-1.5">
      {leads.map((lead) => (
        <LeadCard
          key={lead.id}
          lead={lead}
          disposition={store.dispositions[lead.id] || null}
          expanded={expandedId === lead.id}
          attempts={store.attempts[lead.id] || 0}
          texted={store.texted[lead.id] || false}
          onToggle={() => handleToggle(lead.id)}
          onDisposition={(d) => handleDisposition(lead.id, d)}
          onSetTexted={() => handleSetTexted(lead.id)}
          onStartCall={onStartCall ? () => onStartCall(lead.id) : undefined}
        />
      ))}
    </div>
  );
}
