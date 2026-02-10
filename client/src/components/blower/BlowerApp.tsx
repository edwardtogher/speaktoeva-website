import { useState, useMemo } from "react";
import { LogOut, History } from "lucide-react";
import { BLOWER_USERS } from "@/config/blower-users";
import { getBatches } from "@/config/blower-leads";
import { useBlowerStore, type FilterKey } from "@/hooks/use-blower-store";
import ProgressHeader from "./ProgressHeader";
import FilterBar from "./FilterBar";
import LeadList from "./LeadList";
import ScriptDrawer from "./ScriptDrawer";
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

  // --- Batch List View ---
  if (view === "batches") {
    return (
      <div className="min-h-[100dvh] bg-zinc-950 text-white flex flex-col">
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
      </div>
    );
  }

  // --- Batch Dialler View ---
  return (
    <div className="min-h-[100dvh] bg-zinc-950 text-white flex flex-col">
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

      {/* Scrollable lead list */}
      <div className="flex-1 overflow-y-auto pb-24">
        <LeadList
          filter={activeFilter}
          store={store}
          batchId={activeBatchId ?? undefined}
          onInterested={(leadName) => setInterestedLead({ name: leadName })}
        />
      </div>

      {/* Script FAB + drawer */}
      <ScriptDrawer />

      {/* Milestone celebrations */}
      <MilestoneOverlay
        completed={todayStats.calls}
        interestedLead={interestedLead}
        onInterestedDismiss={() => setInterestedLead(null)}
      />
    </div>
  );
}
