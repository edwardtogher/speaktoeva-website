import { useState, useMemo } from "react";
import { LogOut } from "lucide-react";
import { BLOWER_USERS } from "@/config/blower-users";
import { useBlowerStore, type FilterKey } from "@/hooks/use-blower-store";
import ProgressHeader from "./ProgressHeader";
import FilterBar from "./FilterBar";
import LeadList from "./LeadList";
import ScriptDrawer from "./ScriptDrawer";
import MilestoneOverlay from "./MilestoneOverlay";

interface BlowerAppProps {
  username: string;
  onLogout: () => void;
}

export default function BlowerApp({ username, onLogout }: BlowerAppProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("new");

  const user = useMemo(
    () => BLOWER_USERS.find((u) => u.username === username),
    [username]
  );

  const store = useBlowerStore(
    username,
    user?.assignedLeadIds ?? "all"
  );

  return (
    <div className="min-h-[100dvh] bg-zinc-950 text-white flex flex-col">
      {/* Sticky header area */}
      <div className="sticky top-0 z-40">
        <div className="relative">
          <ProgressHeader stats={store.stats} />
          <button
            onClick={onLogout}
            className="absolute top-3 right-3 p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={store.filterCounts}
        />
      </div>

      {/* Scrollable lead list */}
      <div className="flex-1 overflow-y-auto pb-24">
        <LeadList
          filter={activeFilter}
          store={store}
        />
      </div>

      {/* Script FAB + drawer */}
      <ScriptDrawer />

      {/* Milestone celebrations */}
      <MilestoneOverlay completed={store.stats.completed} />
    </div>
  );
}
