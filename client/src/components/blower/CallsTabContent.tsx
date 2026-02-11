import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight, Phone } from "lucide-react";
import type { Lead } from "@/config/blower-leads";
import type { Disposition, BatchStats } from "@/hooks/use-blower-store";
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
  getBatchStats: (batchId: string) => BatchStats;
  onBatchTap: (batchId: string) => void;
  onGoldTap: () => void;
}

export default function CallsTabContent({
  goldLeads,
  startedBatches,
  unstartedBatches,
  getBatchStats,
  onBatchTap,
  onGoldTap,
}: CallsTabContentProps) {
  const [unstartedExpanded, setUnstartedExpanded] = useState(false);

  return (
    <div className="px-4 py-3 space-y-3 pb-24">
      {/* Gold card -- taps into Gold dialler */}
      {goldLeads.length > 0 && (
        <button
          onClick={onGoldTap}
          className="w-full bg-gradient-to-r from-amber-50 to-amber-100/80 border border-amber-200/60 rounded-2xl px-4 py-3.5 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.06)] active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-amber-200/60 flex items-center justify-center flex-shrink-0">
              <Phone className="w-4.5 h-4.5 text-amber-700" />
            </div>
            <div className="text-left min-w-0">
              <p className="text-[15px] font-bold text-amber-800">
                Gold
              </p>
              <p className="text-xs text-amber-600/80">
                {goldLeads.length} callback{goldLeads.length !== 1 ? "s" : ""} waiting
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-amber-400 flex-shrink-0" />
        </button>
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
