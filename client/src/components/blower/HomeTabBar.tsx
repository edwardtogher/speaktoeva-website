import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

export type TabKey = "batches" | "gold" | "pipeline" | "scripts" | "leaderboard";

interface HomeTabBarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  goldCount: number;
  pipelineCount: number;
}

interface TabDef {
  key: TabKey;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

export default function HomeTabBar({
  activeTab,
  onTabChange,
  goldCount,
  pipelineCount,
}: HomeTabBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  const tabs: TabDef[] = [
    { key: "batches", label: "Batches" },
    { key: "gold", label: "Gold", count: goldCount },
    { key: "pipeline", label: "Pipeline", count: pipelineCount },
    { key: "scripts", label: "Scripts" },
    { key: "leaderboard", label: "Board", icon: <Trophy className="w-3.5 h-3.5" /> },
  ];

  // Scroll active tab into view on mount and tab change
  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const button = activeRef.current;
      const buttonRect = button.getBoundingClientRect();

      // If the button is outside the visible area, scroll it into view
      const scrollLeft =
        button.offsetLeft -
        container.offsetWidth / 2 +
        buttonRect.width / 2;

      container.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: "smooth",
      });
    }
  }, [activeTab]);

  return (
    <div className="bg-white/90 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div
        ref={scrollRef}
        className="home-tab-scroll flex items-center gap-1.5 px-3 py-1.5 overflow-x-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <style>{`
          .home-tab-scroll::-webkit-scrollbar { display: none; }
        `}</style>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const showCount = tab.count !== undefined && tab.count > 0;

          return (
            <button
              key={tab.key}
              ref={isActive ? activeRef : undefined}
              onClick={() => onTabChange(tab.key)}
              className={cn(
                "flex-shrink-0 flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold min-h-[36px] transition-colors",
                isActive
                  ? "bg-indigo-600 text-white"
                  : "bg-[#F2F2F7] text-zinc-500"
              )}
            >
              {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
              {tab.label}
              {showCount && (
                <span
                  className={cn(
                    "rounded-full text-[10px] px-1.5 tabular-nums leading-tight",
                    isActive
                      ? "bg-white/20 text-white/90"
                      : "bg-zinc-300/50 text-zinc-500"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
