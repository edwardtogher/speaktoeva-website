import { cn } from "@/lib/utils";
import type { FilterKey } from "@/hooks/use-blower-store";

interface FilterBarProps {
  activeFilter: FilterKey;
  onFilterChange: (filter: FilterKey) => void;
  counts: Record<FilterKey, number>;
  batchId?: string;
  exhaustedCount?: number;
}

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "new", label: "New" },
  { key: "follow_ups", label: "Gold" },
];

export default function FilterBar({
  activeFilter,
  onFilterChange,
  counts,
  exhaustedCount = 0,
}: FilterBarProps) {
  return (
    <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-3 py-2">
      <div className="flex gap-2">
        {FILTERS.map(({ key, label }) => {
          const isGold = key === "follow_ups";
          const isActive = activeFilter === key;
          return (
            <button
              key={key}
              onClick={() => onFilterChange(key)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-sm font-semibold transition-colors min-h-[44px]",
                isActive
                  ? isGold
                    ? "bg-amber-500 text-white shadow-sm"
                    : "bg-indigo-600 text-white shadow-sm"
                  : "bg-[#F2F2F7] text-zinc-500 active:bg-gray-200"
              )}
            >
              {label}
              <span
                className={cn(
                  "text-xs tabular-nums px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
                  isActive
                    ? "bg-white/20 text-white/90"
                    : "bg-zinc-200 text-zinc-400"
                )}
              >
                {counts[key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Gold subtitle when Gold tab is active */}
      {activeFilter === "follow_ups" && counts.follow_ups > 0 && (
        <p className="text-[11px] text-amber-600 text-center mt-1.5 italic">
          They didn't pick up — that's the exact problem you solve.
        </p>
      )}

      {/* Exhausted note */}
      {exhaustedCount > 0 && (
        <p className="text-[11px] text-zinc-400 text-center mt-1.5 tabular-nums">
          {exhaustedCount} exhausted (5+ attempts)
        </p>
      )}
    </div>
  );
}
