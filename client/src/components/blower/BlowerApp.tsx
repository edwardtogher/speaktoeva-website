import { useState, useMemo, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { BLOWER_USERS } from "@/config/blower-users";
import { getBatches, LEADS, type Lead } from "@/config/blower-leads";
import { useBlowerStore, type FilterKey, type Disposition } from "@/hooks/use-blower-store";
import ProgressHeader from "./ProgressHeader";
import LeadList from "./LeadList";
import CallingMode from "./CallingMode";
import CallTransition from "./CallTransition";
import MilestoneOverlay from "./MilestoneOverlay";
import BatchCard from "./BatchCard";
import HistoryView from "./HistoryView";
import PipelineView from "./PipelineView";
import ScriptsSection from "./ScriptsSection";
import HomeTabBar, { type TabKey } from "./HomeTabBar";
import GoldTabContent from "./GoldTabContent";
import LeaderboardView from "./LeaderboardView";
import SearchOverlay from "./SearchOverlay";
import CallNextButton from "./CallNextButton";
import PBBanner from "./PBBanner";

interface BlowerAppProps {
  username: string;
  onLogout: () => void;
}

type AppView = "home" | "dialler" | "history";

interface TransitionState {
  disposition: Disposition;
  leadName: string;
  nextLeadId: string | null;
  nextLeadName: string | null;
  nextLeadTown: string | null;
  batchComplete: boolean;
}

export default function BlowerApp({ username, onLogout }: BlowerAppProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("new");
  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);
  const [view, setView] = useState<AppView>("home");
  const [activeTab, setActiveTab] = useState<TabKey>("batches");
  const [interestedLead, setInterestedLead] = useState<{ name: string } | null>(null);
  const [callingLeadId, setCallingLeadId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [transition, setTransition] = useState<TransitionState | null>(null);
  const [unstartedExpanded, setUnstartedExpanded] = useState(false);

  const user = useMemo(
    () => BLOWER_USERS.find((u) => u.username === username),
    [username]
  );

  const store = useBlowerStore(
    username,
    user?.assignedLeadIds ?? "all"
  );

  const batches = useMemo(() => getBatches(), []);

  // Filter batches by user's assignedBatches (if set)
  const effectiveBatches = useMemo(() => {
    if (!user?.assignedBatches || user.assignedBatches.length === 0) {
      return batches; // show all
    }
    return batches.filter(b => user.assignedBatches!.includes(b.id));
  }, [batches, user]);

  // Build a set of lead IDs belonging to the user's assigned batches (for Gold/Pipeline filtering)
  const userLeadIds = useMemo(() => {
    if (!user?.assignedBatches || user.assignedBatches.length === 0) {
      return null; // no filtering needed
    }
    const batchSet = new Set(user.assignedBatches);
    return new Set(LEADS.filter(l => batchSet.has(l.batch)).map(l => l.id));
  }, [user]);

  const todayStats = store.getTodayStats();
  const dailyStreak = store.getDailyStreak();
  const personalBest = store.getPersonalBest();

  // Split batches into started and unstarted
  const { startedBatches, unstartedBatches } = useMemo(() => {
    const started: typeof effectiveBatches = [];
    const unstarted: typeof effectiveBatches = [];
    for (const batch of effectiveBatches) {
      const stats = store.getBatchStats(batch.id);
      if (stats.called > 0) {
        started.push(batch);
      } else {
        unstarted.push(batch);
      }
    }
    return { startedBatches: started, unstartedBatches: unstarted };
  }, [effectiveBatches, store]);

  // Find next uncalled lead across all batches (for Call Next button)
  const nextUncalledLead = useMemo(() => {
    for (const batch of effectiveBatches) {
      const batchLeads = LEADS.filter((l) => l.batch === batch.id);
      for (const lead of batchLeads) {
        if (!store.dispositions[lead.id]) {
          return { lead, batchId: batch.id };
        }
      }
    }
    return null;
  }, [effectiveBatches, store.dispositions]);

  // Enter a batch
  const handleBatchTap = (batchId: string) => {
    setActiveBatchId(batchId);
    setActiveFilter("new");
    setView("dialler");
  };

  // Go back to home with previously active tab preserved
  const handleBackToHome = () => {
    setActiveBatchId(null);
    setActiveFilter("new");
    setView("home");
  };

  // Gold mode: viewing all follow-up leads across all batches
  const isGoldMode = view === "dialler" && activeBatchId === null && activeFilter === "follow_ups";

  // Handle the Call Next button tap
  const handleCallNext = useCallback(() => {
    if (!nextUncalledLead) return;
    const { lead, batchId } = nextUncalledLead;
    setActiveBatchId(batchId);
    setActiveFilter("new");
    setView("dialler");
    // Immediately open CallingMode for this lead
    setCallingLeadId(lead.id);
  }, [nextUncalledLead]);

  // Handle selecting a lead from the search overlay
  const handleSearchSelect = useCallback((leadId: string) => {
    const lead = LEADS.find((l) => l.id === leadId);
    if (!lead) return;

    // Check if it's a Gold lead
    const disp = store.dispositions[leadId];
    const att = store.attempts[leadId] || 0;
    const isGoldLead = disp === "no_answer" && att < 5;

    if (isGoldLead) {
      // Navigate to Gold tab on home screen
      setView("home");
      setActiveTab("gold");
    } else if (disp === "interested") {
      // Navigate to Pipeline tab
      setView("home");
      setActiveTab("pipeline");
    } else {
      // Navigate to the lead's batch
      setActiveBatchId(lead.batch);
      setActiveFilter("new");
      setView("dialler");
    }

    // Scroll to the lead after the view renders
    setTimeout(() => {
      const el = document.getElementById(`lead-${leadId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        // Flash highlight effect
        el.style.transition = "box-shadow 0.3s ease";
        el.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.5)";
        setTimeout(() => {
          el.style.boxShadow = "";
        }, 2000);
      }
    }, 300);
  }, [store.dispositions, store.attempts]);

  // Start calling mode when user taps Call on a lead
  const handleStartCall = useCallback((leadId: string) => {
    setCallingLeadId(leadId);
  }, []);

  // Find the next uncalled lead in the current context (batch or Gold)
  const findNextLead = useCallback(
    (currentLeadId: string): Lead | null => {
      // Gold mode: calling from Gold tab (home view, no activeBatchId)
      if (view === "home" && activeTab === "gold") {
        const golds = store.getFilteredLeads("follow_ups");
        const filtered = userLeadIds ? golds.filter(l => userLeadIds.has(l.id)) : golds;
        return filtered.find((l) => l.id !== currentLeadId) ?? null;
      }

      // Batch mode: calling from dialler
      if (activeBatchId) {
        const batchLeads = store.getFilteredLeads("new", activeBatchId);
        const currentIdx = batchLeads.findIndex((l) => l.id === currentLeadId);
        // Look for leads after the current one first, then wrap around
        const afterCurrent = batchLeads.filter(
          (l, i) => i > currentIdx && l.id !== currentLeadId && !store.dispositions[l.id]
        );
        if (afterCurrent.length > 0) return afterCurrent[0];
        // Wrap: check before current
        const beforeCurrent = batchLeads.filter(
          (l, i) => i < currentIdx && l.id !== currentLeadId && !store.dispositions[l.id]
        );
        return beforeCurrent.length > 0 ? beforeCurrent[0] : null;
      }

      // Gold mode in dialler view (isGoldMode)
      if (isGoldMode) {
        const golds = store.getFilteredLeads("follow_ups");
        const filtered = userLeadIds ? golds.filter(l => userLeadIds.has(l.id)) : golds;
        return filtered.find((l) => l.id !== currentLeadId) ?? null;
      }

      return null;
    },
    [view, activeTab, activeBatchId, isGoldMode, store, userLeadIds]
  );

  // Handle CallingMode completion (disposition set)
  const handleCallingComplete = useCallback(
    (disposition: Disposition, note: string, tags: string[]) => {
      if (!callingLeadId) return;

      const currentLead = LEADS.find((l) => l.id === callingLeadId);

      // Save disposition, note, and tags
      store.setDisposition(callingLeadId, disposition);
      if (note) store.setNote(callingLeadId, note);
      store.setTags(callingLeadId, tags);

      // Trigger interested celebration (runs alongside transition)
      if (disposition === "interested") {
        if (currentLead) {
          setInterestedLead({ name: currentLead.name });
        }
      }

      // Find the next lead before closing CallingMode
      const nextLead = findNextLead(callingLeadId);

      // Close CallingMode immediately
      setCallingLeadId(null);

      // Show the transition card
      setTransition({
        disposition,
        leadName: currentLead?.name ?? "Unknown",
        nextLeadId: nextLead?.id ?? null,
        nextLeadName: nextLead?.name ?? null,
        nextLeadTown: nextLead?.town ?? null,
        batchComplete: !nextLead,
      });
    },
    [callingLeadId, store, findNextLead]
  );

  // Transition: auto-advance to next lead
  const handleTransitionContinue = useCallback(() => {
    if (!transition) return;

    if (transition.nextLeadId) {
      // Advance to the next lead
      setCallingLeadId(transition.nextLeadId);
    }
    // Clear transition (whether advancing or batch complete)
    setTransition(null);
  }, [transition]);

  // Transition: user tapped "Stop Calling"
  const handleTransitionStop = useCallback(() => {
    setTransition(null);
  }, []);

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
        handleBackToHome();
        setDiallerSwipeX(0);
      }, 150);
    } else {
      setDiallerSwipeX(0);
    }
    isDiallerSwipingRef.current = false;
  }, [diallerSwipeX, handleBackToHome]);

  // Gold leads for the Gold tab and count badge (filtered by user's assigned batches)
  const goldLeads = useMemo(() => {
    const all = store.getFilteredLeads("follow_ups");
    if (!userLeadIds) return all;
    return all.filter(l => userLeadIds.has(l.id));
  }, [store, userLeadIds]);

  // Pipeline leads for the Pipeline tab and count badge (filtered by user's assigned batches)
  const pipelineLeads = useMemo(() => {
    const all = store.getFilteredLeads("wins");
    if (!userLeadIds) return all;
    return all.filter(l => userLeadIds.has(l.id));
  }, [store, userLeadIds]);

  // --- History View ---
  if (view === "history") {
    return (
      <HistoryView
        dailyStats={store.dailyStats}
        dailyStreak={dailyStreak}
        callLog={store.callLog}
        onBack={() => setView("home")}
      />
    );
  }

  // --- Home with tabs / Dialler with view transitions ---
  return (
    <div className="relative min-h-[100dvh] bg-[#F2F2F7]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <AnimatePresence mode="wait">
        {view === "home" ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="min-h-[100dvh] bg-[#F2F2F7] text-zinc-900 flex flex-col"
          >
            {/* Header -- daily stats + controls */}
            <div className="sticky top-0 z-40">
              <ProgressHeader
                mode="batches"
                todayCalls={todayStats.calls}
                dailyTarget={user?.dailyTarget}
                dailyStreak={dailyStreak}
                personalBest={personalBest}
                username={username}
                onHistory={() => setView("history")}
                onLogout={onLogout}
                onSearch={() => setSearchOpen(true)}
              />

              {/* PB Banner */}
              <PBBanner todayCalls={todayStats.calls} personalBest={personalBest} />

              <HomeTabBar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                goldCount={goldLeads.length}
                pipelineCount={pipelineLeads.length}
              />
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeTab === "batches" && (
                  <motion.div
                    key="tab-batches"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="px-4 py-3 space-y-3 pb-24"
                  >
                    {/* Started batches -- full cards */}
                    {startedBatches.map((batch) => (
                      <BatchCard
                        key={batch.id}
                        batch={batch}
                        stats={store.getBatchStats(batch.id)}
                        onTap={() => handleBatchTap(batch.id)}
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
                                  stats={store.getBatchStats(batch.id)}
                                  onTap={() => handleBatchTap(batch.id)}
                                  compact
                                />
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "gold" && (
                  <motion.div
                    key="tab-gold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <GoldTabContent
                      leads={goldLeads}
                      dispositions={store.dispositions}
                      attempts={store.attempts}
                      texted={store.texted}
                      notes={store.notes}
                      setDisposition={store.setDisposition}
                      setTexted={store.setTexted}
                      onStartCall={handleStartCall}
                    />
                  </motion.div>
                )}

                {activeTab === "pipeline" && (
                  <motion.div
                    key="tab-pipeline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <PipelineView
                      leads={pipelineLeads}
                      stages={store.stages}
                      notes={store.notes}
                      onSetStage={store.setStage}
                      onBack={handleBackToHome}
                      embedded
                    />
                  </motion.div>
                )}

                {activeTab === "scripts" && (
                  <motion.div
                    key="tab-scripts"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="px-4 py-3"
                  >
                    <ScriptsSection />
                  </motion.div>
                )}

                {activeTab === "leaderboard" && (
                  <motion.div
                    key="tab-leaderboard"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <LeaderboardView />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Call Next floating button -- only on Batches tab */}
            {activeTab === "batches" && (
              <CallNextButton
                nextLeadName={nextUncalledLead?.lead.name ?? null}
                onTap={handleCallNext}
              />
            )}

            {/* CallingMode overlay -- works from Gold tab */}
            <AnimatePresence>
              {callingLead && callingLeadId && (
                <CallingMode
                  key={callingLeadId}
                  lead={callingLead}
                  batchId={undefined}
                  attempts={store.attempts[callingLeadId] || 0}
                  existingNote={store.notes[callingLeadId] || ""}
                  existingTags={store.tags[callingLeadId] || []}
                  onComplete={handleCallingComplete}
                  onBack={handleCallingBack}
                />
              )}
            </AnimatePresence>

            {/* Call transition overlay (between calls) */}
            <AnimatePresence>
              {transition && !callingLeadId && (
                <CallTransition
                  key="call-transition"
                  disposition={transition.disposition}
                  leadName={transition.leadName}
                  nextLeadName={transition.nextLeadName ?? undefined}
                  nextLeadBusiness={transition.nextLeadTown ?? undefined}
                  todayCalls={todayStats.calls}
                  batchComplete={transition.batchComplete}
                  onContinue={handleTransitionContinue}
                  onStop={handleTransitionStop}
                />
              )}
            </AnimatePresence>

            {/* Milestone celebrations */}
            <MilestoneOverlay
              completed={todayStats.calls}
              interestedLead={interestedLead}
              onInterestedDismiss={() => setInterestedLead(null)}
            />

            {/* Search overlay */}
            <SearchOverlay
              open={searchOpen}
              onClose={() => setSearchOpen(false)}
              dispositions={store.dispositions}
              attempts={store.attempts}
              onSelectLead={handleSearchSelect}
            />
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
                onBack={handleBackToHome}
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

            {/* Call transition overlay (between calls) */}
            <AnimatePresence>
              {transition && !callingLeadId && (
                <CallTransition
                  key="call-transition"
                  disposition={transition.disposition}
                  leadName={transition.leadName}
                  nextLeadName={transition.nextLeadName ?? undefined}
                  nextLeadBusiness={transition.nextLeadTown ?? undefined}
                  todayCalls={todayStats.calls}
                  batchComplete={transition.batchComplete}
                  onContinue={handleTransitionContinue}
                  onStop={handleTransitionStop}
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
