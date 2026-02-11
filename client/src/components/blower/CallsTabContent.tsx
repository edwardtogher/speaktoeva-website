import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { Lead } from "@/config/blower-leads";
import type { Disposition, BatchStats } from "@/hooks/use-blower-store";
import LeadCard from "./LeadCard";
import BatchCard from "./BatchCard";

interface Batch {
  id: string;
  label: string;
  count: number;
}

interface CallsTabContentProps {
  goldLeads: Lead[];
  startedBatches: Batch[];
  unstartedBatches: Batch[];
  dispositions: Record<string, Disposition>;
  attempts: Record<string, number>;
  texted: Record<string, boolean>;
  notes: Record<string, string>;
  getBatchStats: (batchId: string) => BatchStats;
  setDisposition: (leadId: string, disposition: Disposition | null) => void;
  setTexted: (leadId: string) => void;
  onBatchTap: (batchId: string) => void;
  onStartCall: (leadId: string) => void;
}

export default function CallsTabContent({
  goldLeads,
  startedBatches,
  unstartedBatches,
  dispositions,
  attempts,
  texted,
  notes,
  getBatchStats,
  setDisposition,
  setTexted,
  onBatchTap,
  onStartCall,
}: CallsTabContentProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [unstartedExpanded, setUnstartedExpanded] = useState(false);

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
    <div className="px-4 py-3 space-y-3 pb-24">
      {/* Gold section -- callbacks waiting */}
      {goldLeads.length > 0 && (
        <div className="space-y-3">
          {/* Amber banner */}
          <div className="rounded-2xl bg-amber-50 border border-amber-200/50 px-4 py-3">
            <p className="text-sm font-semibold text-amber-700">
              {goldLeads.length} callback{goldLeads.length !== 1 ? "s" : ""} waiting — call these first
            </p>
          </div>

          {/* Gold lead cards */}
          {goldLeads.map((lead) => (
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

      {/* Started batches -- full cards */}
      {startedBatches.map((batch) => (
        <BatchCard
          key={batch.id}
          batch={batch}
          stats={getBatchStats(batch.id)}
          onTap={() => onBatchTap(batch.id)}
        />
      ))}

      {/* Unstarted batches -- collapsible section */}
      {unstartedBatches.length > 0 && (
        <div>
          <button
            onClick={() => setUnstartedExpanded((v) => !v)}
            className="w-full flex items-center justify-between px-2 py-2.5 text-sm text-zinc-500"
          >
            <span className="font-semibold">
              {unstartedBatches.length} more batch{unstartedBatches.length !== 1 ? "es" : ""}
            </span>
            <motion.div
              animate={{ rotate: unstartedExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </button>

          <AnimatePresence>
            {unstartedExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="overflow-hidden space-y-2"
              >
                {unstartedBatches.map((batch) => (
                  <BatchCard
                    key={batch.id}
                    batch={batch}
                    stats={getBatchStats(batch.id)}
                    onTap={() => onBatchTap(batch.id)}
                    compact
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
