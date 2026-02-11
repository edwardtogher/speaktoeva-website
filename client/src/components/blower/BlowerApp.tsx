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

// Slide direction: 1 = sliding left (going to follow-ups), -1 = sliding right (going to new)
const tabSlideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

export default function BlowerApp({ username, onLogout }: BlowerAppProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("new");
  const [tabDirection, setTabDirection] = useState(1);
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

  // --- Swipe-back gesture for dialler view ---
  const [diallerSwipeX, setDiallerSwipeX] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const isDiallerSwipingRef = useRef(false);

  const handleDiallerTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch.clientX <= 50) {
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      isDiallerSwipingRef.current = false;
    } else {
      touchStartRef.current = null;
    }
  }, []);

  const handleDiallerTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = Math.abs(touch.clientY - touchStartRef.current.y);
    if (dx > 10 && dx > dy) {
      isDiallerSwipingRef.current = true;
      setDiallerSwipeX(Math.min(dx, 300));
    }
  }, []);

  const handleDiallerTouchEnd = useCallback(() => {
    if (!touchStartRef.current) { setDiallerSwipeX(0); return; }
    touchStartRef.current = null;
    if (isDiallerSwipingRef.current && diallerSwipeX > 100) {
      setDiallerSwipeX(400);
      setTimeout(() => {
        handleBackToBatches();
        setDiallerSwipeX(0);
      }, 150);
    } else {
      setDiallerSwipeX(0);
    }
    isDiallerSwipingRef.current = false;
  }, [diallerSwipeX, handleBackToBatches]);

  // Directional filter change (used by both swipe and button taps)
  const handleFilterChange = useCallback((filter: FilterKey) => {
    if (filter === activeFilter) return;
    // Direction: going to follow_ups = 1 (slide left), going to new = -1 (slide right)
    setTabDirection(filter === "follow_ups" ? 1 : -1);
    setActiveFilter(filter);
  }, [activeFilter]);

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
        handleFilterChange("follow_ups");
      } else if (dx > 0 && activeFilter === "follow_ups") {
        // Swipe right -> New
        handleFilterChange("new");
      }
    }
  }, [activeFilter, handleFilterChange]);

  // --- History View ---
  if (view === "history") {
    return (
      <HistoryView
        dailyStats={store.dailyStats}
        dailyStreak={dailyStreak}
        callLog={store.callLog}
        onBack={() => setView("batches")}
      />
    );
  }

  // --- Batch List / Dialler with view transitions ---
  return (
    <div className="relative min-h-[100dvh] bg-[#F2F2F7]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <AnimatePresence mode="wait">
        {view === "batches" ? (
          <motion.div
            key="batches"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="min-h-[100dvh] bg-[#F2F2F7] text-zinc-900 flex flex-col"
          >
            {/* Header — daily stats + controls */}
            <div className="sticky top-0 z-40">
              <ProgressHeader
                mode="batches"
                todayCalls={todayStats.calls}
                dailyStreak={dailyStreak}
                personalBest={personalBest}
                onHistory={() => setView("history")}
                onLogout={onLogout}
              />
            </div>

            {/* Batch cards + interested leads */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              <h2 className="text-2xl font-black text-indigo-600 pt-2 pb-1">Batches</h2>
              {batches.map((batch) => (
                <BatchCard
                  key={batch.id}
                  batch={batch}
                  stats={store.getBatchStats(batch.id)}
                  onTap={() => handleBatchTap(batch.id)}
                />
              ))}

              {/* Interested leads section */}
              {(() => {
                const interestedLeadIds = store.getFilteredLeads("wins");
                if (interestedLeadIds.length === 0) return null;
                return (
                  <>
                    <h2 className="text-2xl font-black text-indigo-600 pt-4 pb-1">Interested</h2>
                    {interestedLeadIds.map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] px-4 py-3.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-[15px] text-zinc-900 truncate">
                              {lead.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-sm text-zinc-500">{lead.town}</span>
                              <span className="text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full px-2 py-0.5">
                                {lead.type}
                              </span>
                            </div>
                            {store.notes[lead.id] && (
                              <p className="text-sm text-zinc-400 mt-1 truncate">
                                {store.notes[lead.id]}
                              </p>
                            )}
                          </div>
                          <a
                            href={`tel:${lead.phone}`}
                            className="ml-3 flex-shrink-0 p-2 text-indigo-500 hover:text-indigo-700 transition-colors"
                            aria-label={`Call ${lead.name}`}
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    ))}
                  </>
                );
              })()}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dialler"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="min-h-[100dvh] bg-[#F2F2F7] text-zinc-900 flex flex-col"
            style={{
              transform: diallerSwipeX > 0 ? `translateX(${diallerSwipeX}px)` : undefined,
              transition: isDiallerSwipingRef.current ? "none" : "transform 0.2s ease-out",
              opacity: diallerSwipeX > 0 ? 1 - diallerSwipeX / 500 : 1,
            }}
            onTouchStart={handleDiallerTouchStart}
            onTouchMove={handleDiallerTouchMove}
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
                onFilterChange={handleFilterChange}
                counts={batchFilterCounts}
                batchId={activeBatchId ?? undefined}
                exhaustedCount={batchStats?.exhausted ?? 0}
              />
            </div>

            {/* Scrollable lead list with tab swipe */}
            <div
              className="flex-1 overflow-hidden relative"
              onTouchStart={handleTabSwipeStart}
              onTouchEnd={handleTabSwipeEnd}
            >
              <AnimatePresence initial={false} custom={tabDirection} mode="popLayout">
                <motion.div
                  key={activeFilter}
                  custom={tabDirection}
                  variants={tabSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", damping: 25, stiffness: 250, mass: 0.8 }}
                  className="h-full overflow-y-auto pb-24"
                >
                  <LeadList
                    filter={activeFilter}
                    store={store}
                    batchId={activeBatchId ?? undefined}
                    onInterested={(leadName) => setInterestedLead({ name: leadName })}
                    onStartCall={handleStartCall}
                  />
                </motion.div>
              </AnimatePresence>
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
