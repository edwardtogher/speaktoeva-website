import { useState, useCallback, useRef } from "react";
import type { Lead } from "@/config/blower-leads";
import type { FilterKey, Disposition } from "@/hooks/use-blower-store";
import LeadCard from "./LeadCard";

interface LeadListProps {
  filter: FilterKey;
  store: {
    getFilteredLeads: (filter: FilterKey) => Lead[];
    dispositions: Record<string, Disposition>;
    notes: Record<string, string>;
    setDisposition: (leadId: string, disposition: Disposition | null) => void;
    setNote: (leadId: string, text: string) => void;
    startRound2: () => void;
    stats: { round: number; completed: number; total: number };
  };
}

export default function LeadList({ filter, store }: LeadListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const leads = store.getFilteredLeads(filter);

  // After setting disposition, auto-expand next uncalled lead
  const handleDisposition = useCallback(
    (leadId: string, disposition: Disposition | null) => {
      store.setDisposition(leadId, disposition);

      if (disposition !== null) {
        // Find next undispositioned lead in the current filtered list
        const currentIdx = leads.findIndex((l) => l.id === leadId);
        const nextUncalled = leads.find(
          (l, i) => i > currentIdx && !store.dispositions[l.id]
        );

        if (nextUncalled) {
          // Small delay to let the disposition render, then scroll
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
    [leads, store]
  );

  const handleToggle = useCallback(
    (leadId: string) => {
      setExpandedId((prev) => (prev === leadId ? null : leadId));
    },
    []
  );

  // Empty states
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <p className="text-zinc-500 text-lg">
          {filter === "new" && store.stats.round === 1 && (
            <>
              All leads called!
              <br />
              <button
                onClick={store.startRound2}
                className="mt-4 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors min-h-[48px]"
              >
                Start Round 2 - Retries
              </button>
            </>
          )}
          {filter === "new" && store.stats.round === 2 && "All retries done! Nice work."}
          {filter === "follow_ups" && "No follow-ups yet. Keep calling!"}
          {filter === "wins" && "No wins yet. They're coming!"}
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
          onToggle={() => handleToggle(lead.id)}
          onDisposition={(d) => handleDisposition(lead.id, d)}
        />
      ))}
    </div>
  );
}
