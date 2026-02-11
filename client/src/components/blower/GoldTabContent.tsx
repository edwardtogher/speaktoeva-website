import { useState, useCallback } from "react";
import type { Lead } from "@/config/blower-leads";
import type { Disposition } from "@/hooks/use-blower-store";
import LeadCard from "./LeadCard";

interface GoldTabContentProps {
  leads: Lead[];
  dispositions: Record<string, Disposition>;
  attempts: Record<string, number>;
  texted: Record<string, boolean>;
  notes: Record<string, string>;
  setDisposition: (leadId: string, disposition: Disposition | null) => void;
  setTexted: (leadId: string) => void;
  onStartCall: (leadId: string) => void;
}

export default function GoldTabContent({
  leads,
  dispositions,
  attempts,
  texted,
  notes,
  setDisposition,
  setTexted,
  onStartCall,
}: GoldTabContentProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = useCallback((leadId: string) => {
    setExpandedId((prev) => (prev === leadId ? null : leadId));
  }, []);

  const handleSetTexted = useCallback(
    (leadId: string) => {
      setTexted(leadId);
    },
    [setTexted]
  );

  return (
    <div className="px-4 py-3 space-y-3">
      {/* Summary banner */}
      <div className="rounded-2xl bg-amber-50 border border-amber-200/50 px-4 py-3">
        <p className="text-sm font-semibold text-amber-700">
          {leads.length} lead{leads.length !== 1 ? "s" : ""} to call back
        </p>
        <p className="text-xs text-amber-500 mt-0.5">
          They didn't pick up -- they need you
        </p>
      </div>

      {/* Lead list */}
      {leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-zinc-400 text-lg">No Gold leads yet</p>
          <p className="text-zinc-400 text-sm mt-1">
            Keep calling -- leads that don't answer will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              disposition={dispositions[lead.id] || null}
              expanded={expandedId === lead.id}
              attempts={attempts[lead.id] || 0}
              texted={texted[lead.id] || false}
              note={notes[lead.id] || undefined}
              isGold
              onToggle={() => handleToggle(lead.id)}
              onDisposition={(d) => setDisposition(lead.id, d)}
              onSetTexted={() => handleSetTexted(lead.id)}
              onStartCall={() => onStartCall(lead.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
