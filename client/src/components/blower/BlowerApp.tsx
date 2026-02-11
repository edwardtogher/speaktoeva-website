import { useState, useMemo, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, History } from "lucide-react";
import { BLOWER_USERS } from "@/config/blower-users";
import { getBatches, LEADS } from "@/config/blower-leads";
import { useBlowerStore, type FilterKey, type Disposition } from "@/hooks/use-blower-store";
import ProgressHeader from "./ProgressHeader";
import FilterBar from "./FilterBar";
import LeadList from "./LeadList";
import CallingMode from "./CallingMode";
import MilestoneOverlay from "./MilestoneOverlay";
import BatchCard from "./BatchCard";
import HistoryView from "./HistoryView";

interface BlowerAppProps {
  username: string;
  onLogout: () => void;
}

type AppView = "batches" | "dialler" | "history";

export default function BlowerApp({ username, onLogout }: BlowerAppProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("new");
  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);
  const [view, setView] = useState<AppView>("batches");
  const [interestedLead, setInterestedLead] = useState<{ name: string } | null>(null);
  const [callingLeadId, setCallingLeadId] = useState<string | null>(null);

  const user = useMemo(
    () => BLOWER_USERS.find((u) => u.username === username),
    [username]
  );

  const store = useBlowerStore(
    username,
    user?.assignedLeadIds ?? "all"
  );

  const batches = useMemo(() => getBatches(), []);

  const todayStats = store.getTodayStats();
  const dailyStreak = store.getDailyStreak();
  const personalBest = store.getPersonalBest();

  // Enter a batch
  const handleBatchTap = (batchId: string) => {
    setActiveBatchId(batchId);
    setActiveFilter("new");
    setView("dialler");
  };

  // Go back to batch list
  const handleBackToBatches = () => {
    setActiveBatchId(null);
    setView("batches");
  };

  // Start calling mode when user taps Call on a lead
  const handleStartCall = useCallback((leadId: string) => {
    setCallingLeadId(leadId);
  }, []);

  // Handle CallingMode completion (disposition set)
  const handleCallingComplete = useCallback(
    (disposition: Disposition, note: string, tags: string[]) => {
      if (!callingLeadId) return;

      // Save disposition, note, and tags
      store.setDisposition(callingLeadId, disposition);
      if (note) store.setNote(callingLeadId, note);
      store.setTags(callingLeadId, tags);

      // Trigger interested celebration
      if (disposition === "interested") {
        const lead = LEADS.find((l) => l.id === callingLeadId);
        if (lead) {
          setInterestedLead({ name: lead.name });
        }
      }

      // Exit calling mode
      setCallingLeadId(null);

      // Auto-advance: find next uncalled lead in batch
      if (activeBatchId) {
        const batchLeads = store.getFilteredLeads("new", activeBatchId);
        const nextUncalled = batchLeads.find(
          (l) => l.id !== callingLeadId && !store.dispositions[l.id]
        );
        if (nextUncalled) {
          setTimeout(() => {
            const el = document.getElementById(`lead-${nextUncalled.id}`);
            el?.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 200);
        }
      }
    },
    [callingLeadId, store, activeBatchId]
  );

  // Handle CallingMode back (exit without disposition)
  const handleCallingBack = useCallback(() => {
    setCallingLeadId(null);
  }, []);

  // Find active batch label
  const activeBatch = batches.find((b) => b.id === activeBatchId);
  const batchStats = activeBatchId ? store.getBatchStats(activeBatchId) : null;

  // Batch-scoped filter counts (not global 101)
  const batchFilterCounts = useMemo(() => {
    if (!activeBatchId) return store.filterCounts;
    return {
      new: store.getFilteredLeads("new", activeBatchId).length,
      follow_ups: store.getFilteredLeads("follow_ups", activeBatchId).length,
      wins: store.getFilteredLeads("wins", activeBatchId).length,
    };
  }, [activeBatchId, store]);

  // Find the lead for CallingMode
  const callingLead = callingLeadId
    ? LEADS.find((l) => l.id === callingLeadId) ?? null
    : null;

  // --- History View ---
  if (view === "history") {
    return (
      <HistoryView
        dailyStats={store.dailyStats}
        dailyStreak={dailyStreak}
        onBack={() => setView("batches")}
      />
    );
  }

  // --- Swipe-back gesture for dialler view ---
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleDiallerTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    // Only track if starting near left edge (within 40px)
    if (touch.clientX <= 40) {
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    } else {
      touchStartRef.current = null;
    }
  }, []);

  const handleDiallerTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = Math.abs(touch.clientY - touchStartRef.current.y);
    touchStartRef.current = null;
    // Require >80px right swipe from left edge, more horizontal than vertical
    if (dx > 80 && dx > dy) {
      handleBackToBatches();
    }
  }, [handleBackToBatches]);

  // --- Swipe between New / Follow-ups tabs ---
  const tabTouchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTabSwipeStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    tabTouchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTabSwipeEnd = useCallback((e: React.TouchEvent) => {
    if (!tabTouchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - tabTouchStartRef.current.x;
    const dy = Math.abs(touch.clientY - tabTouchStartRef.current.y);
    tabTouchStartRef.current = null;
    // Require >60px horizontal, more horizontal than vertical
    if (Math.abs(dx) > 60 && Math.abs(dx) > dy) {
      if (dx < 0 && activeFilter === "new") {
        // Swipe left -> Follow-ups
        setActiveFilter("follow_ups");
      } else if (dx > 0 && activeFilter === "follow_ups") {
        // Swipe right -> New
        setActiveFilter("new");
      }
    }
  }, [activeFilter]);

  // --- Batch List / Dialler with view transitions ---
  return (
    <div className="relative min-h-[100dvh] bg-zinc-950" style={{ fontFamily: "'Inter', sans-serif" }}>
      <AnimatePresence mode="wait">
        {view === "batches" ? (
          <motion.div
            key="batches"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="min-h-[100dvh] bg-zinc-950 text-white flex flex-col"
          >
            {/* Header — daily stats + controls */}
            <div className="sticky top-0 z-40 relative">
              <ProgressHeader
                mode="batches"
                todayCalls={todayStats.calls}
                dailyStreak={dailyStreak}
                personalBest={personalBest}
              />
              {/* Action icons */}
              <div className="absolute top-3 right-3 flex items-center gap-1">
                <button
                  onClick={() => setView("history")}
                  className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Call history"
                >
                  <History className="w-4 h-4" />
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Batch cards */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
              {batches.map((batch) => (
                <BatchCard
                  key={batch.id}
                  batch={batch}
                  stats={store.getBatchStats(batch.id)}
                  onTap={() => handleBatchTap(batch.id)}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dialler"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="min-h-[100dvh] bg-zinc-950 text-white flex flex-col"
            onTouchStart={handleDiallerTouchStart}
            onTouchEnd={handleDiallerTouchEnd}
          >
            {/* Sticky header area */}
            <div className="sticky top-0 z-40">
              <ProgressHeader
                mode="dialler"
                batchLabel={activeBatch?.label}
                batchCalled={batchStats?.called ?? 0}
                batchTotal={batchStats?.total ?? 0}
                todayCalls={todayStats.calls}
                dailyStreak={dailyStreak}
                personalBest={personalBest}
                onBack={handleBackToBatches}
              />
              <FilterBar
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                counts={batchFilterCounts}
                batchId={activeBatchId ?? undefined}
                exhaustedCount={batchStats?.exhausted ?? 0}
              />
            </div>

            {/* Scrollable lead list with tab swipe */}
            <div
              className="flex-1 overflow-y-auto pb-24"
              onTouchStart={handleTabSwipeStart}
              onTouchEnd={handleTabSwipeEnd}
            >
              <LeadList
                filter={activeFilter}
                store={store}
                batchId={activeBatchId ?? undefined}
                onInterested={(leadName) => setInterestedLead({ name: leadName })}
                onStartCall={handleStartCall}
              />
            </div>

            {/* Calling Mode overlay */}
            <AnimatePresence>
              {callingLead && callingLeadId && (
                <CallingMode
                  key={callingLeadId}
                  lead={callingLead}
                  batchId={activeBatchId ?? undefined}
                  existingNote={store.notes[callingLeadId] || ""}
                  existingTags={store.tags[callingLeadId] || []}
                  onComplete={handleCallingComplete}
                  onBack={handleCallingBack}
                />
              )}
            </AnimatePresence>

            {/* Milestone celebrations */}
            <MilestoneOverlay
              completed={todayStats.calls}
              interestedLead={interestedLead}
              onInterestedDismiss={() => setInterestedLead(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
