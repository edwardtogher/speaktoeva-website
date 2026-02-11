import { useState, useMemo, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { BLOWER_USERS } from "@/config/blower-users";
import { getBatches, LEADS } from "@/config/blower-leads";
import { useBlowerStore, type FilterKey, type Disposition } from "@/hooks/use-blower-store";
import ProgressHeader from "./ProgressHeader";
import LeadList from "./LeadList";
import CallingMode from "./CallingMode";
import MilestoneOverlay from "./MilestoneOverlay";
import BatchCard from "./BatchCard";
import HistoryView from "./HistoryView";
import PipelineView from "./PipelineView";
import ScriptsSection from "./ScriptsSection";

interface BlowerAppProps {
  username: string;
  onLogout: () => void;
}

type AppView = "batches" | "dialler" | "history" | "pipeline";

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

  // Enter Gold mode (all follow-up leads across batches)
  const handleGoldTap = () => {
    setActiveBatchId(null);
    setActiveFilter("follow_ups");
    setView("dialler");
  };

  // Enter pipeline view
  const handleInterestedTap = () => {
    setView("pipeline");
  };

  // Go back to batch list
  const handleBackToBatches = () => {
    setActiveBatchId(null);
    setActiveFilter("new");
    setView("batches");
  };

  // Gold mode: viewing all follow-up leads across all batches
  const isGoldMode = view === "dialler" && activeBatchId === null && activeFilter === "follow_ups";

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

  // --- Pipeline View ---
  if (view === "pipeline") {
    const interestedLeads = store.getFilteredLeads("wins");
    return (
      <PipelineView
        leads={interestedLeads}
        stages={store.stages}
        notes={store.notes}
        onSetStage={store.setStage}
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

            {/* Home screen cards */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {/* Pipeline card — interested leads (hottest) */}
              <h2 className="text-2xl font-black text-green-600 pt-2 pb-1">Interested</h2>
              {(() => {
                const wins = store.getFilteredLeads("wins");
                const stageCounts = { send_demo: 0, demo_sent: 0, booked: 0, won: 0 };
                for (const lead of wins) {
                  const stage = store.stages[lead.id] || "send_demo";
                  stageCounts[stage]++;
                }
                const parts: string[] = [];
                if (stageCounts.send_demo > 0) parts.push(`${stageCounts.send_demo} send demo`);
                if (stageCounts.demo_sent > 0) parts.push(`${stageCounts.demo_sent} chasing`);
                if (stageCounts.booked > 0) parts.push(`${stageCounts.booked} booked`);
                if (stageCounts.won > 0) parts.push(`${stageCounts.won} won`);

                return (
                  <motion.button
                    onClick={handleInterestedTap}
                    whileTap={{ scale: 0.98 }}
                    className="w-full min-h-[72px] rounded-2xl bg-white border border-gray-100/50 px-5 py-4 text-left shadow-[0_2px_8px_rgba(0,0,0,0.08)] active:shadow-sm active:scale-[0.99] transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-lg flex-shrink-0">{"\ud83c\udfaf"}</span>
                        <span className="font-bold text-[15px] text-zinc-900">Pipeline</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                        <span className="text-sm tabular-nums text-zinc-500">
                          {wins.length} lead{wins.length !== 1 ? "s" : ""}
                        </span>
                        <ChevronRight className="w-4 h-4 text-zinc-400" />
                      </div>
                    </div>
                    <div className="text-xs">
                      {wins.length > 0 ? (
                        <span className="text-zinc-500">{parts.join(" \u00b7 ")}</span>
                      ) : (
                        <span className="text-zinc-400">No wins yet — keep calling!</span>
                      )}
                    </div>
                  </motion.button>
                );
              })()}

              {/* Gold card — follow-ups (warm) */}
              <h2 className="text-2xl font-black text-amber-600 pt-4 pb-1">Gold</h2>
              <motion.button
                onClick={handleGoldTap}
                whileTap={{ scale: 0.98 }}
                className="w-full min-h-[72px] rounded-2xl bg-white border border-gray-100/50 px-5 py-4 text-left shadow-[0_2px_8px_rgba(0,0,0,0.08)] active:shadow-sm active:scale-[0.99] transition-all"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg flex-shrink-0">{"\ud83e\udd47"}</span>
                    <span className="font-bold text-[15px] text-zinc-900">Gold Leads</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                    <span className="text-sm tabular-nums text-zinc-500">
                      {store.filterCounts.follow_ups} lead{store.filterCounts.follow_ups !== 1 ? "s" : ""}
                    </span>
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  </div>
                </div>
                <Progress
                  value={store.filterCounts.follow_ups > 0 ? 100 : 0}
                  className="h-1.5 bg-gray-100 mb-2.5 [&>div]:bg-amber-500"
                />
                <div className="flex items-center gap-3 text-xs">
                  {store.filterCounts.follow_ups > 0 ? (
                    <span className="text-amber-600 font-medium">
                      They didn't pick up — they need you
                    </span>
                  ) : (
                    <span className="text-green-600 font-semibold">All clear {"\u2713"}</span>
                  )}
                </div>
              </motion.button>

              {/* Batch cards — cold (first contact) */}
              <h2 className="text-2xl font-black text-indigo-600 pt-4 pb-1">Batches</h2>
              {batches.map((batch) => (
                <BatchCard
                  key={batch.id}
                  batch={batch}
                  stats={store.getBatchStats(batch.id)}
                  onTap={() => handleBatchTap(batch.id)}
                />
              ))}

              {/* Scripts section — expandable reference cards */}
              <ScriptsSection />
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
                batchLabel={isGoldMode ? "Gold" : activeBatch?.label}
                batchCalled={isGoldMode ? store.filterCounts.follow_ups : (batchStats?.called ?? 0)}
                batchTotal={isGoldMode ? store.filterCounts.follow_ups : (batchStats?.total ?? 0)}
                todayCalls={todayStats.calls}
                dailyStreak={dailyStreak}
                personalBest={personalBest}
                onBack={handleBackToBatches}
              />
            </div>

            {/* Scrollable lead list */}
            <div className="flex-1 overflow-y-auto pb-24">
              <LeadList
                filter={isGoldMode ? "follow_ups" : "new"}
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
                  attempts={store.attempts[callingLeadId] || 0}
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
